const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#0B1D13] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF7F11] mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-[#2A2A2A] rounded-xl p-8 border border-[#4B5320] space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-300">
                Sports Fundraiser ("we," "our," or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our website and services.
              </p>
              <p className="text-gray-300">
                By using our services, you consent to the data practices
                described in this policy. If you do not agree with the data
                practices described, you should not use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-[#FF7F11] mb-3">
                Personal Information
              </h3>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Full name and contact information</li>
                <li>• Email address and phone number</li>
                <li>• Payment information and transaction history</li>
                <li>• Date of birth for age verification</li>
                <li>• Government-issued ID for prize verification</li>
                <li>• Mailing address for prize distribution</li>
                <li>• Tax identification information for prize reporting</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#FF7F11] mb-3">
                Technical Information
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• IP address and device information</li>
                <li>• Browser type and version</li>
                <li>• Pages visited and time spent on site</li>
                <li>• Cookies and similar tracking technologies</li>
                <li>• Geographic location data</li>
                <li>• Device identifiers and operating system</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#FF7F11] mb-3">
                Usage Information
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Tournament participation history</li>
                <li>• Ticket purchase patterns</li>
                <li>• Game preferences and selections</li>
                <li>• Customer service interactions</li>
                <li>• Communication preferences</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="text-gray-300 space-y-2">
                <li>• To create and manage your account</li>
                <li>• To process payments and transactions</li>
                <li>• To communicate with you about our services</li>
                <li>• To provide customer support</li>
                <li>• To verify eligibility for prizes</li>
                <li>• To improve our website and services</li>
                <li>• To comply with legal obligations</li>
                <li>• To prevent fraud and ensure security</li>
                <li>• To personalize your experience</li>
                <li>• To send promotional offers and updates</li>
                <li>• To conduct research and analysis</li>
                <li>• To enforce our terms and conditions</li>
              </ul>
            </section>

            {/* Legal Basis for Processing */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                4. Legal Basis for Processing
              </h2>
              <p className="text-gray-300 mb-4">
                We process your personal information based on the following
                legal grounds:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <strong>Performance of contract:</strong> To provide the
                  services you requested
                </li>
                <li>
                  • <strong>Legitimate interests:</strong> To improve our
                  services and prevent fraud
                </li>
                <li>
                  • <strong>Legal obligation:</strong> To comply with applicable
                  laws and regulations
                </li>
                <li>
                  • <strong>Consent:</strong> Where we have obtained your
                  explicit consent
                </li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                5. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-300 mb-4">
                We may share your information with:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <strong>Payment processors</strong> to complete transactions
                </li>
                <li>
                  • <strong>Legal authorities</strong> when required by law
                </li>
                <li>
                  • <strong>Service providers</strong> who assist in our
                  operations
                </li>
                <li>
                  • <strong>Tax authorities</strong> for prize reporting
                  purposes
                </li>
                <li>
                  • <strong>Auditors and professional advisors</strong> for
                  compliance purposes
                </li>
                <li>
                  • <strong>Business transfer recipients</strong> in case of
                  merger or acquisition
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                We do not sell your personal information to third parties for
                marketing purposes.
              </p>

              <h3 className="text-xl font-semibold text-[#FF7F11] mb-3 mt-6">
                International Data Transfers
              </h3>
              <p className="text-gray-300">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place for international data transfers.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-300">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this policy, unless a longer
                retention period is required or permitted by law. Our retention
                periods are based on:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>
                  • The length of time we have an ongoing relationship with you
                </li>
                <li>• Legal obligations to retain data for certain periods</li>
                <li>• Statute of limitations for legal claims</li>
                <li>• Regulatory requirements for financial records</li>
                <li>• The need to prevent fraud and abuse</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                7. Data Security
              </h2>
              <p className="text-gray-300">
                We implement appropriate security measures to protect your
                personal information, including:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>• SSL encryption for all data transmissions</li>
                <li>• Secure storage of sensitive information</li>
                <li>• Regular security assessments and updates</li>
                <li>• Limited access to personal data</li>
                <li>• Multi-factor authentication for administrative access</li>
                <li>• Regular employee training on data protection</li>
                <li>• Incident response and breach notification procedures</li>
              </ul>
              <p className="text-gray-300 mt-4">
                While we implement robust security measures, no method of
                transmission over the Internet or electronic storage is 100%
                secure. We cannot guarantee absolute security of your
                information.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                8. Your Rights
              </h2>
              <p className="text-gray-300">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>
                  • <strong>Access:</strong> Right to access and review your
                  personal information
                </li>
                <li>
                  • <strong>Rectification:</strong> Right to correct inaccurate
                  or incomplete data
                </li>
                <li>
                  • <strong>Erasure:</strong> Right to request deletion of your
                  personal data
                </li>
                <li>
                  • <strong>Restriction:</strong> Right to limit processing of
                  your data
                </li>
                <li>
                  • <strong>Portability:</strong> Right to receive your data in
                  a structured format
                </li>
                <li>
                  • <strong>Objection:</strong> Right to object to processing of
                  your data
                </li>
                <li>
                  • <strong>Withdraw consent:</strong> Right to withdraw consent
                  at any time
                </li>
                <li>
                  • <strong>Complain:</strong> Right to lodge a complaint with a
                  supervisory authority
                </li>
              </ul>

              <div className="bg-[#0B1D13] rounded-lg p-4 mt-4 border border-[#4B5320]">
                <p className="text-[#FF7F11] font-semibold">
                  To exercise any of these rights, please contact us using the
                  information provided in the "Contact Us" section.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                9. Cookies and Tracking
              </h2>
              <p className="text-gray-300">
                We use cookies and similar technologies to:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>• Remember your preferences and settings</li>
                <li>• Analyze website traffic and usage patterns</li>
                <li>• Provide personalized content</li>
                <li>• Improve our services</li>
                <li>• Deliver targeted advertisements</li>
                <li>• Measure advertising effectiveness</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#FF7F11] mb-3 mt-6">
                Cookie Management
              </h3>
              <p className="text-gray-300">
                You can control cookies through your browser settings. Most
                browsers allow you to refuse cookies or delete existing cookies.
                However, disabling cookies may limit your ability to use certain
                features of our services.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-gray-300">
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children. If we become aware that we have collected personal
                information from a child without parental consent, we will take
                steps to delete that information.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                11. Third-Party Links
              </h2>
              <p className="text-gray-300">
                Our website may contain links to third-party websites. This
                Privacy Policy does not apply to those websites. We encourage
                you to review the privacy policies of any third-party sites you
                visit.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                12. Changes to This Policy
              </h2>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page, updating the "Last updated" date, and, in some cases,
                we may provide additional notice (such as adding a statement to
                our homepage or sending you a notification).
              </p>
              <p className="text-gray-300 mt-2">
                We encourage you to review this Privacy Policy periodically to
                stay informed about our information practices.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-300">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-[#0B1D13] rounded-lg p-4 mt-4 border border-[#4B5320]">
                <p className="text-gray-300">
                  <strong>Email:</strong> privacy@sportsfundraiser.com
                  <br />
                  <strong>Phone:</strong> +1 (555) 123-4567
                  <br />
                  <strong>Address:</strong> 123 Sports Avenue, Tournament City,
                  TC 12345
                  <br />
                  <strong>Data Protection Officer:</strong>{" "}
                  dpo@sportsfundraiser.com
                </p>
              </div>
              <p className="text-gray-300 mt-4">
                We will respond to all legitimate requests within 30 days.
                Occasionally, it may take longer if your request is particularly
                complex or you have made several requests.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
