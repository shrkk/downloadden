import React from "react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="glass-card dark:glass-card-dark max-w-2xl w-full p-8 rounded-2xl shadow-xl overflow-y-auto mt-12 mb-12">
        <h1 className="text-3xl font-bold mb-4 text-center glass-title">Platform Disclaimer</h1>
        <div className="text-xs sm:text-sm leading-relaxed text-gray-200 whitespace-pre-line" style={{fontFamily: 'var(--font-geist-sans), Arial, sans-serif'}}>
{`
DownloadDen is an independent tool and is not affiliated with, endorsed by, or sponsored by YouTube, Instagram, TikTok, or any other platform. All trademarks, logos, and brand names are the property of their respective owners.

Use of DownloadDen is at your own risk. Please ensure you comply with the terms of service of any platform from which you download content.
`}
        </div>
      </div>
    </div>
  );
} 