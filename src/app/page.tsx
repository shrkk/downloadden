'use client';

import { useState, useEffect } from "react";
import SplitText from "./SplitText";
import TiltedCard from "./TiltedCard";

const RECENT_KEY = "dowloadden_recent_links";

// Define a type for videoInfo
interface VideoInfo {
  platform: string;
  title: string;
  thumbnail: string;
  formats: Array<{
    label: string;
    url: string;
    size: string;
    ext: string;
    height: number;
  }>;
  originalUrl: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecent(JSON.parse(stored));
    }
  }, []);

  const saveRecent = (link: string) => {
    const updated = [link, ...recent.filter(l => l !== link)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      setError("Could not read from clipboard.");
    }
  };

  const handleRecentClick = (link: string) => {
    setUrl(link);
    setError("");
    setVideoInfo(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setVideoInfo(null);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setVideoInfo(data);
      saveRecent(url);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch video info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background text-foreground p-4">
      <main className="flex flex-col items-center w-full max-w-lg mt-16 gap-8">
        {/* Animated DownloadDen Title */}
        <SplitText
          text="DownloadDen"
          className="text-7xl sm:text-7xl font-bold text-center mb-2 glass-title"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={() => console.log('All letters have animated!')}
        />
        <p className="text-center text-lg mb-4 glass-subtitle">No Signup, No Ads, No Limits. Download Any Video.</p>
        {mounted && recent.length > 0 && (
          <div className="w-full mb-2">
            <div className="text-xs text-gray-500 mb-1">Recent links:</div>
            <div className="flex flex-wrap gap-2">
              {recent.map((link, i) => (
                <button
                  key={i}
                  className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                  onClick={() => handleRecentClick(link)}
                  type="button"
                >
                  {link.length > 40 ? link.slice(0, 37) + "..." : link}
                </button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="url"
              required
              placeholder="Paste video URL (YouTube, Instagram, TikTok...)"
              className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black dark:border-gray-700 dark:text-white"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={handlePaste}
              className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-xl"
              title="Paste from clipboard"
            >📋</button>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded glass-card dark:glass-card-dark border border-white/20 dark:border-white/10 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-white/20 dark:hover:bg-black/20 transition backdrop-blur"
            disabled={loading}
          >
            {loading ? "Loading..." : "Download"}
          </button>
        </form>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {loading && <div className="text-center">Loading video info...</div>}
        {videoInfo && (
          <TiltedCard
            imageSrc={videoInfo.thumbnail}
            altText={videoInfo.title}
            captionText={videoInfo.title}
            containerHeight="340px"
            containerWidth="100%"
            imageHeight="340px"
            imageWidth="100%"
            scaleOnHover={1.06}
            rotateAmplitude={10}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={false}
          >
            <div className={`w-full p-6 flex flex-col items-center gap-4 glass-card dark:glass-card-dark`} style={{minHeight: 280, zIndex: 4, position: 'relative'}}>
              <h2 className="glass-title text-2xl text-center mb-1">{videoInfo.title}</h2>
              <div className="flex flex-col gap-2 w-full">
                {videoInfo.platform === "instagram" ? (
                  videoInfo.formats && videoInfo.formats.length > 0 ? (
                    <button
                      className="block w-full py-2 px-4 rounded bg-white/30 dark:bg-black/30 text-blue-900 dark:text-blue-200 font-semibold text-center hover:bg-white/50 dark:hover:bg-black/50 transition border border-white/20 dark:border-white/10 shadow"
                      onClick={async () => {
                        const f = videoInfo.formats[0];
                        try {
                          const res = await fetch("/api/download/file", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url: videoInfo.originalUrl, height: f.label.match(/(\d+)p/)?.[1], platform: videoInfo.platform }),
                          });
                          if (!res.ok) throw new Error("Failed to download file");
                          const blob = await res.blob();
                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(blob);
                          a.download = `${videoInfo.title || "video"}_${f.label.replace(/\s+/g, "_")}.mp4`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                        } catch {
                          alert("Failed to download file");
                        }
                      }}
                      type="button"
                    >
                      Download ({videoInfo.formats[0].size})
                    </button>
                  ) : (
                    <div className="text-red-500 text-center">No downloadable format found for this Instagram video.</div>
                  )
                ) : (
                  videoInfo.formats.map((f: { label: string; url: string; size: string; ext: string; height: number }, i: number) => (
                    <button
                      key={i}
                      className="block w-full py-2 px-4 rounded bg-white/30 dark:bg-black/30 text-blue-900 dark:text-blue-200 font-semibold text-center hover:bg-white/50 dark:hover:bg-black/50 transition border border-white/20 dark:border-white/10 shadow"
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/download/file", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url: videoInfo.originalUrl, height: f.label.match(/(\d+)p/)?.[1], platform: videoInfo.platform }),
                          });
                          if (!res.ok) throw new Error("Failed to download file");
                          const blob = await res.blob();
                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(blob);
                          a.download = `${videoInfo.title || "video"}_${f.label.replace(/\s+/g, "_")}.mp4`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                        } catch {
                          alert("Failed to download file");
                        }
                      }}
                      type="button"
                    >
                      {f.label} ({f.size})
                    </button>
                  ))
                )}
              </div>
            </div>
          </TiltedCard>
        )}
      </main>
      <footer className="w-full text-center py-6 text-gray-500 text-sm mt-12 flex flex-col gap-2 items-center">
        <div>Built by @shrkk on github.</div>
        <div className="max-w-xl mx-auto text-xs text-gray-400 mt-2">
          Make sure you don&apos;t violate the rights of others with any files you download.<br/>
          Copyrighted music can&apos;t be downloaded with this tool.<br/>
          <span className="block mt-1">If a creator has <span className="font-mono text-gray-300">#nodownload</span> in their description, the content can&apos;t be downloaded.</span>
        </div>
      </footer>
    </div>
  );
}
