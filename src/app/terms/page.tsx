import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="glass-card dark:glass-card-dark max-w-2xl w-full p-8 rounded-2xl shadow-xl overflow-y-auto mt-12 mb-12">
        <h1 className="text-3xl font-bold mb-4 text-center glass-title">Terms of Service</h1>
        <div className="text-xs sm:text-sm leading-relaxed text-gray-200 whitespace-pre-line" style={{fontFamily: 'var(--font-geist-sans), Arial, sans-serif'}}>
{`
Welcome to DownloadDen!

By using this website and service, you agree to the following terms and conditions. Please read them carefully.

1. Acceptance of Terms
By accessing or using DownloadDen, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, do not use the service.

2. Prohibited Uses
You agree not to use DownloadDen to:
- Violate any applicable law or regulation
- Infringe the intellectual property or other rights of others
- Download, share, or distribute copyrighted content without permission
- Circumvent digital rights management or other technical protection measures
- Use the service for any unlawful, harmful, or abusive purpose

3. No Warranty
DownloadDen is provided "as is" and without warranties of any kind. We do not guarantee the accuracy, reliability, or availability of the service.

4. Limitation of Liability
To the maximum extent permitted by law, DownloadDen and its owners are not liable for any damages arising from your use of the service.

5. Indemnification
You agree to indemnify and hold harmless DownloadDen and its owners from any claims, damages, or expenses arising from your use of the service or violation of these terms.

6. Changes to Terms
We may update these Terms of Service at any time. Continued use of the service constitutes acceptance of the new terms.

7. Governing Law
These terms are governed by the laws of the United States, without regard to conflict of law principles.

Contact
If you have questions about these terms, contact us at: shreyank0108@gmail.com
`}
        </div>
      </div>
    </div>
  );
} 