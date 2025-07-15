import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";

function getYtDlpPath() {
  const platform = os.platform();
  if (platform === "win32") {
    return path.join(process.cwd(), "bin", "yt-dlp.exe");
  } else {
    return path.join(process.cwd(), "bin", "yt-dlp");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, height, platform } = await req.json();
    if (!url || !height) {
      return new Response(JSON.stringify({ error: "Missing url or height" }), { status: 400 });
    }

    // Infer platform if not provided
    let plat = platform;
    if (!plat) {
      if (url.includes("youtube.com") || url.includes("youtu.be")) plat = "youtube";
      else if (url.includes("instagram.com")) plat = "instagram";
      else if (url.includes("tiktok.com")) plat = "tiktok";
      else plat = "unknown";
    }

    const ytDlpPath = getYtDlpPath();
    if (!fs.existsSync(ytDlpPath)) {
      return new Response(JSON.stringify({ error: "yt-dlp binary not found" }), { status: 500 });
    }

    let ytDlpArgs;
    if (plat === "youtube") {
      ytDlpArgs = [
        url,
        "-f", `bestvideo[height=${height}]+bestaudio/best[height=${height}]`,
        "-o", "-",
        "--no-check-certificate",
        "--prefer-free-formats",
        "--youtube-skip-dash-manifest",
        "--referer", url,
      ];
    } else if (plat === "instagram" || plat === "tiktok") {
      ytDlpArgs = [
        url,
        "-f", "best",
        "-o", "-",
        "--no-check-certificate",
        "--prefer-free-formats",
        "--referer", url,
      ];
    } else {
      ytDlpArgs = [
        url,
        "-f", "best",
        "-o", "-",
        "--no-check-certificate",
        "--prefer-free-formats",
        "--referer", url,
      ];
    }

    const execa = (await import("execa")).default;
    const proc = execa(ytDlpPath, ytDlpArgs, { encoding: null });

    if (!proc.stdout) {
      return new Response(JSON.stringify({ error: "Failed to start download process." }), { status: 500 });
    }
    const stream = proc.stdout;

    let filename = `video_${height}p.mp4`;
    proc.stderr?.on("data", (data: Buffer) => {
      const str = data.toString();
      const match = str.match(/Destination: (.+)/);
      if (match) filename = match[1];
    });

    return new Response(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
      },
    });
  } catch (err: unknown) {
    console.error("Download error:", err);
    return new Response(JSON.stringify({ error: "Failed to download video." }), { status: 500 });
  }
} 