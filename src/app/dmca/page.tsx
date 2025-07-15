import React from "react";

export default function DMCA() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="glass-card dark:glass-card-dark max-w-2xl w-full p-8 rounded-2xl shadow-xl overflow-y-auto mt-12 mb-12">
        <h1 className="text-3xl font-bold mb-4 text-center glass-title">DMCA & Copyright Policy</h1>
        <div className="text-xs sm:text-sm leading-relaxed text-gray-200 whitespace-pre-line" style={{fontFamily: 'var(--font-geist-sans), Arial, sans-serif'}}>
{`
DownloadDen respects the intellectual property rights of others and expects its users to do the same.

If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible via DownloadDen, please notify us by providing the following information:

1. A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.
2. Identification of the copyrighted work claimed to have been infringed.
3. Identification of the material that is claimed to be infringing and where it is located on the service.
4. Your contact information, including address, telephone number, and email address.
5. A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.
6. A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.

Please send DMCA notices to: shreyank0108@gmail.com

Upon receipt of a valid DMCA notice, DownloadDen will remove or disable access to the allegedly infringing material and take reasonable steps to notify the user who posted it.

Repeat infringers may have their access to DownloadDen terminated.

This policy is subject to change without notice.
`}
        </div>
      </div>
    </div>
  );
} 