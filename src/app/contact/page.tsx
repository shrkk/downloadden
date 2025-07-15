import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="glass-card dark:glass-card-dark max-w-2xl w-full p-8 rounded-2xl shadow-xl overflow-y-auto mt-12 mb-12">
        <h1 className="text-3xl font-bold mb-4 text-center glass-title">Contact</h1>
        <div className="text-xs sm:text-sm leading-relaxed text-gray-200 whitespace-pre-line" style={{fontFamily: 'var(--font-geist-sans), Arial, sans-serif'}}>
{`
For any questions, feedback, or legal requests (including DMCA notices), please contact us:

Email: shreyank0108@gmail.com

We aim to respond to all inquiries within a reasonable timeframe.
`}
        </div>
      </div>
    </div>
  );
} 