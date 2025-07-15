import { NextRequest, NextResponse } from "next/server";
import * as ytdlp from "yt-dlp-exec";
import path from "path";
import fs from "fs";
import os from "os";

// Simple URL validation
function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

// In-memory IP throttling (MVP only)
const ipRequests: Record<string, { count: number; first: number }> = {};
const LIMIT = 10;
const WINDOW = 10 * 60 * 1000; // 10 minutes

function getYtDlpPath() {
  const platform = os.platform();
  if (platform === "win32") {
    return path.join(process.cwd(), "bin", "yt-dlp.exe");
  } else {
    return path.join(process.cwd(), "bin", "yt-dlp");
  }
}

interface VideoFormat {
  label: string;
  url: string;
  size: string;
  ext: string;
  height: number;
  [key: string]: unknown;
}

interface VideoInfo {
  formats: VideoFormat[];
  title?: string;
  thumbnail?: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    // Basic IP extraction (not always reliable in serverless)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const now = Date.now();
    if (!ipRequests[ip] || now - ipRequests[ip].first > WINDOW) {
      ipRequests[ip] = { count: 1, first: now };
    } else {
      ipRequests[ip].count++;
      if (ipRequests[ip].count > LIMIT) {
        return NextResponse.json({ error: "Too many requests. Please wait and try again." }, { status: 429 });
      }
    }

    const { url } = await req.json();
    if (!url || typeof url !== "string" || !isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid or missing URL." }, { status: 400 });
    }

    // Platform detection (basic)
    let platform = "unknown";
    if (url.includes("youtube.com") || url.includes("youtu.be")) platform = "youtube";
    else if (url.includes("instagram.com")) platform = "instagram";
    else if (url.includes("tiktok.com")) platform = "tiktok";

    // Use the yt-dlp binary from bin/yt-dlp(.exe) in the project root
    const ytDlpPath = getYtDlpPath();
    if (!fs.existsSync(ytDlpPath)) {
      console.error("yt-dlp binary not found at", ytDlpPath);
      return NextResponse.json({ error: "Video download failed. Please try again later." }, { status: 500 });
    }

    // Create a ytdlp instance with the custom binary path
    const customYtdlp = ytdlp.create(ytDlpPath);

    let info: VideoInfo;
    try {
      info = (await customYtdlp(url, {
        dumpSingleJson: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        referer: url,
      }) as unknown) as VideoInfo;
    } catch (err) {
      console.error("yt-dlp error:", err);
      return NextResponse.json({ error: "Video download failed. Please try again later." }, { status: 500 });
    }

    // Platform-specific format selection
    let formats: VideoFormat[] = [];
    if (platform === "youtube") {
      const allowedHeights = [144, 360, 480, 720, 1080];
      const seenHeights = new Set();
      formats = (info.formats || [])
        .filter((f: VideoFormat) => f.url && f.ext === "mp4" && allowedHeights.includes(Number(f.height)))
        .sort((a: VideoFormat, b: VideoFormat) => allowedHeights.indexOf(Number(a.height)) - allowedHeights.indexOf(Number(b.height)))
        .filter((f: VideoFormat) => {
          if (seenHeights.has(Number(f.height))) return false;
          seenHeights.add(Number(f.height));
          return true;
        })
        .map((f: VideoFormat) => ({
          label: `MP4 ${f.height}p${f.format_note ? " " + f.format_note : ""}`.trim(),
          url: f.url,
          size: typeof f.filesize === "number" ? `${(Number(f.filesize) / 1024 / 1024).toFixed(1)}MB` : "?",
          ext: f.ext,
          height: Number(f.height),
        }))
        .slice(0, 5);
    } else if (platform === "instagram" || platform === "tiktok") {
      // Pick the best available video format (highest resolution)
      const best = (info.formats || [])
        .filter((f: VideoFormat) => f.url && f.vcodec && f.ext && f.vcodec !== 'none' && f.height)
        .sort((a: VideoFormat, b: VideoFormat) => (Number(b.height) || 0) - (Number(a.height) || 0))[0];
      if (best) {
        formats = [{
          label: `${best.ext.toUpperCase()}${best.height ? ` ${best.height}p` : ''}${best.format_note ? ' ' + best.format_note : ''}`.trim(),
          url: best.url,
          size: typeof best.filesize === "number" ? `${(Number(best.filesize) / 1024 / 1024).toFixed(1)}MB` : "?",
          ext: best.ext,
          height: Number(best.height),
        }];
      }
    } else {
      // Fallback: show up to 5 best video formats
      formats = (info.formats || [])
        .filter((f: VideoFormat) => f.url && f.vcodec && f.ext && f.vcodec !== 'none' && f.height)
        .sort((a: VideoFormat, b: VideoFormat) => (Number(b.height) || 0) - (Number(a.height) || 0))
        .slice(0, 5)
        .map((f: VideoFormat) => ({
          label: `${f.ext.toUpperCase()}${f.height ? ` ${f.height}p` : ''}${f.format_note ? ' ' + f.format_note : ''}`.trim(),
          url: f.url,
          size: typeof f.filesize === "number" ? `${(Number(f.filesize) / 1024 / 1024).toFixed(1)}MB` : "?",
          ext: f.ext,
          height: Number(f.height),
        }));
    }

    return NextResponse.json({
      platform,
      title: info.title || "Untitled",
      thumbnail: info.thumbnail || "",
      formats,
      originalUrl: url,
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
} 