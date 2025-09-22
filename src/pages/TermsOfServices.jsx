import { useState, useEffect } from "react";

const TermsOfService = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation on mount
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#0B1D13] py-12 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF7F11] mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-[#2A2A2A] rounded-xl p-8 border border-[#4B5320] space-y-8">
            {/* Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-gray-300">
                By accessing or using Sports Fundraiser's website, mobile
                applications, and services (collectively, the "Services"), you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service and our Privacy Policy. These
                Terms constitute a legally binding agreement between you and
                Sports Fundraiser. If you do not agree to these terms, you may
                not access or use our Services. Your continued use of the
                Services following the posting of any changes to these Terms
                constitutes acceptance of those changes.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                2. Eligibility
              </h2>
              <p className="text-gray-300">
                To use our Services, you must meet the following criteria:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>
                  • Be at least 18 years of age at the time of registration
                </li>
                <li>
                  • Be a legal resident of a jurisdiction where such contests
                  and fundraising activities are permitted by law
                </li>
                <li>
                  • Provide accurate, current, and complete information during
                  the registration process
                </li>
                <li>
                  • Not be an employee, contractor, or immediate family member
                  of Sports Fundraiser, its affiliates, or partners
                </li>
                <li>
                  • Have the legal capacity to enter into a binding contract
                </li>
                <li>
                  • Not be restricted from participating by any applicable laws
                  or regulations
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                We reserve the right to verify your eligibility at any time and
                to suspend or terminate your account if you are found to be
                ineligible.
              </p>
            </section>

            {/* Account */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                3. Account Registration and Security
              </h2>
              <p className="text-gray-300">
                When you create an account with us, you agree to the following:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>
                  • Provide accurate, current, and complete information during
                  registration and promptly update any information to keep it
                  accurate
                </li>
                <li>
                  • Maintain the security and confidentiality of your password
                  and any authentication information
                </li>
                <li>
                  • Notify us immediately of any unauthorized access to or use
                  of your account
                </li>
                <li>
                  • Accept responsibility for all activities that occur under
                  your account, including any purchases or transactions
                </li>
                <li>
                  • Not create more than one account per person; multiple
                  accounts may result in termination of all associated accounts
                </li>
                <li>• Not transfer or sell your account to any other person</li>
              </ul>
              <p className="text-gray-300 mt-4">
                We reserve the right to refuse service, suspend or terminate
                accounts, or remove or edit content in our sole discretion.
              </p>
            </section>

            {/* Tickets */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                4. Ticket Purchases and Terms
              </h2>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • All ticket sales are final. No refunds will be issued except
                  as required by applicable law or at our sole discretion
                </li>
                <li>
                  • Teams are assigned through a verified random process and
                  cannot be chosen or influenced by participants
                </li>
                <li>
                  • Ticket exchanges are limited to 5 times per ticket and must
                  be completed before the tournament's specified deadline
                </li>
                <li>
                  • Tickets must be purchased before the tournament deadline;
                  late purchases will not be accepted
                </li>
                <li>
                  • The entry fee for each ticket is clearly displayed before
                  purchase and may vary based on the number of teams included
                </li>
                <li>
                  • By purchasing a ticket, you acknowledge that the outcome
                  depends on the performance of randomly assigned teams
                </li>
                <li>
                  • We reserve the right to cancel any ticket purchase if we
                  suspect fraudulent activity or violation of these Terms
                </li>
              </ul>
            </section>

            {/* Prizes */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                5. Prizes and Winners
              </h2>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • Winners are determined based on the official rules of each
                  tournament, which are available on our website
                </li>
                <li>
                  • Prize amounts are based on the total prize pool, which is
                  calculated from ticket sales after deducting operational costs
                  and charitable donations
                </li>
                <li>
                  • Winners must complete all required tax documentation
                  (including W-9 forms for US residents) before receiving prizes
                </li>
                <li>
                  • All prizes are subject to applicable federal, state, and
                  local taxes; winners are solely responsible for any tax
                  liabilities
                </li>
                <li>
                  • Prize claims must be made within 30 days of tournament
                  completion; unclaimed prizes may be forfeited
                </li>
                <li>
                  • We reserve the right to substitute prizes of equal or
                  greater value if the advertised prize becomes unavailable
                </li>
                <li>
                  • Prize distribution timelines will be communicated to winners
                  and typically occur within 30-45 days after tournament
                  completion
                </li>
                <li>
                  • By accepting a prize, winners grant us permission to use
                  their name, likeness, and city/state of residence for
                  promotional purposes
                </li>
              </ul>
            </section>

            {/* Prohibited */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                6. Prohibited Activities
              </h2>
              <p className="text-gray-300">
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>
                  • Create multiple accounts or use any means to circumvent
                  account restrictions
                </li>
                <li>
                  • Use automated systems, scripts, bots, or other unauthorized
                  methods to purchase tickets or access our Services
                </li>
                <li>
                  • Attempt to manipulate, interfere with, or exploit the random
                  team assignment process
                </li>
                <li>
                  • Engage in any fraudulent, deceptive, or illegal activity in
                  connection with our Services
                </li>
                <li>
                  • Violate any applicable laws, regulations, or third-party
                  rights
                </li>
                <li>
                  • Use our Services to harass, abuse, or harm another person
                </li>
                <li>
                  • Attempt to gain unauthorized access to our systems,
                  networks, or other users' accounts
                </li>
                <li>
                  • Interfere with or disrupt the integrity or performance of
                  our Services
                </li>
                <li>
                  • Reverse engineer, decompile, or disassemble any aspect of
                  our Services
                </li>
                <li>
                  • Use our Services for any commercial purpose without our
                  express written consent
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                Violation of these prohibitions may result in termination of
                your account, forfeiture of any prizes, and legal action if
                appropriate.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                7. Intellectual Property Rights
              </h2>
              <p className="text-gray-300">
                All content, features, and functionality on our website and
                Services, including but not limited to text, graphics, logos,
                images, icons, audio clips, video clips, data compilations,
                software, and the compilation thereof (the "Content") is the
                property of Sports Fundraiser, our licensors, or other providers
                of such material and is protected by United States and
                international copyright, trademark, patent, trade secret, and
                other intellectual property or proprietary rights laws.
              </p>
              <p className="text-gray-300 mt-4">
                These Terms permit you to use the Services for your personal,
                non-commercial use only. You must not reproduce, distribute,
                modify, create derivative works of, publicly display, publicly
                perform, republish, download, store, or transmit any of the
                material on our Services, except as incidental to normal web
                browsing or as otherwise expressly permitted by these Terms.
              </p>
              <p className="text-gray-300 mt-4">
                The Sports Fundraiser name, logo, and all related names, logos,
                product and service names, designs, and slogans are trademarks
                of Sports Fundraiser or its affiliates or licensors. You must
                not use such marks without our prior written permission.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-300">
                To the fullest extent permitted by applicable law, Sports
                Fundraiser, its affiliates, licensors, service providers,
                employees, agents, officers, or directors shall not be liable
                for:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>
                  • Any indirect, special, incidental, consequential, or
                  punitive damages
                </li>
                <li>
                  • Loss of profits, data, use, goodwill, or other intangible
                  losses
                </li>
                <li>
                  • Any errors or inaccuracies in the information provided
                  through our Services
                </li>
                <li>
                  • Personal injury or property damage resulting from your
                  access to or use of our Services
                </li>
                <li>
                  • Any unauthorized access to or use of our servers and/or any
                  personal information stored therein
                </li>
                <li>
                  • Any interruption or cessation of transmission to or from our
                  Services
                </li>
                <li>
                  • Any bugs, viruses, Trojan horses, or the like that may be
                  transmitted to or through our Services
                </li>
                <li>
                  • Any errors or omissions in any content or for any loss or
                  damage incurred as a result of the use of any content posted,
                  emailed, transmitted, or otherwise made available through the
                  Services
                </li>
                <li>
                  • The defamatory, offensive, or illegal conduct of any third
                  party
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                In no event shall our total liability to you for all damages,
                losses, and causes of action (whether in contract, tort, or
                otherwise) exceed the amount you have paid to us in the last six
                months, or $100, whichever is greater.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-gray-300">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days' notice prior to any new terms
                taking effect. What constitutes a material change will be
                determined at our sole discretion. Changes will be effective
                immediately upon posting to our website. Your continued use of
                our Services after any changes constitutes acceptance of the
                modified terms. We encourage you to review these Terms
                periodically for any changes.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                10. Termination
              </h2>
              <p className="text-gray-300">
                We may suspend or terminate your account and access to our
                Services at our sole discretion, without notice, for conduct
                that we believe violates these Terms of Service, is harmful to
                other users, us, or third parties, or for any other reason,
                including but not limited to:
              </p>
              <ul className="text-gray-300 space-y-2 mt-2">
                <li>
                  • Violation of these Terms or any applicable laws or
                  regulations
                </li>
                <li>
                  • Engaging in fraudulent, abusive, or illegal activities
                </li>
                <li>• Creating risk or possible legal exposure for us</li>
                <li>• Failure to pay any fees owed to us</li>
                <li>
                  • Provision of false, inaccurate, or incomplete information
                </li>
                <li>
                  • Upon the request of law enforcement or government agencies
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                Upon termination, your right to use the Services will
                immediately cease. If you wish to terminate your account, you
                may simply discontinue using the Services or contact us to
                request account deletion.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                11. Governing Law and Dispute Resolution
              </h2>
              <p className="text-gray-300">
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Delaware, without regard to its
                conflict of law provisions. Any legal action or proceeding
                arising under these Terms will be brought exclusively in the
                federal or state courts located in Delaware, and the parties
                hereby irrevocably consent to the personal jurisdiction and
                venue therein.
              </p>
              <p className="text-gray-300 mt-4">
                Before filing any claim against Sports Fundraiser, you agree to
                attempt to resolve the dispute informally by contacting
                legal@sportsfundraiser.com. If we cannot resolve the dispute
                within 60 days, you agree to resolve any claims through final
                and binding arbitration, rather than in court.
              </p>
            </section>

            {/* Miscellaneous */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                12. Miscellaneous Provisions
              </h2>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <strong>Entire Agreement:</strong> These Terms constitute
                  the entire agreement between you and Sports Fundraiser
                  regarding our Services and supersede all prior agreements.
                </li>
                <li>
                  • <strong>Severability:</strong> If any provision of these
                  Terms is held to be invalid or unenforceable, the remaining
                  provisions will remain in full force and effect.
                </li>
                <li>
                  • <strong>Waiver:</strong> Our failure to enforce any right or
                  provision of these Terms will not be considered a waiver of
                  those rights.
                </li>
                <li>
                  • <strong>Assignment:</strong> You may not assign or transfer
                  these Terms or your rights hereunder without our prior written
                  consent.
                </li>
                <li>
                  • <strong>Force Majeure:</strong> We shall not be liable for
                  any failure to perform our obligations due to events beyond
                  our reasonable control.
                </li>
                <li>
                  • <strong>Notices:</strong> We may provide notices to you via
                  email, postal mail, or postings on our Services.
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                13. Contact Information
              </h2>
              <p className="text-gray-300">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="mt-4 text-gray-300">
                <p>Sports Fundraiser Legal Department</p>
                <p>Email: legal@sportsfundraiser.com</p>
                <p>Phone: +1 (555) 123-LEGAL (5342)</p>
                <p>Mail: 123 Tournament Lane, Wilmington, DE 19801</p>
              </div>
              <p className="text-gray-300 mt-4">
                We strive to respond to all legitimate inquiries within 5
                business days.
              </p>
            </section>
          </div>

          {/* Acceptance Checkbox for UX (non-functional example) */}
          <div className="mt-8 p-4 bg-[#2A2A2A] rounded-lg border border-[#4B5320]">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms-acceptance"
                  type="checkbox"
                  className="focus:ring-[#FF7F11] h-4 w-4 text-[#FF7F11] border-gray-600 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms-acceptance" className="text-gray-300">
                  I have read, understood, and agree to be bound by these Terms
                  of Service
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
