// src/pages/FAQ.jsx
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqItems = [
    {
      question: "How do I purchase a ticket?",
      answer:
        "To purchase a ticket, simply create an account, select your preferred tournament, choose the number of teams (3, 4, 5, or 6), and complete the payment process using one of our secure payment methods.",
    },
    {
      question: "When will I receive my teams?",
      answer:
        "Teams are assigned immediately after purchase. If team names aren't finalized yet, you'll see seed positions (like 'AFC #1') which will be updated with actual team names once they're officially announced.",
    },
    {
      question: "How many times can I exchange my ticket?",
      answer:
        "You can exchange your ticket up to 5 times. Each exchange gives you a completely new random set of teams. You'll be notified how many exchanges you have remaining after each exchange.",
    },
    {
      question: "How is scoring calculated?",
      answer:
        "Points are based on the actual points scored by your teams throughout the tournament. Winning teams accumulate points from all games, while eliminated teams keep points from games played before elimination.",
    },
    {
      question: "When are winners announced?",
      answer:
        "Winners are announced within 48 hours after the tournament concludes. All results are verified before official announcement and prize distribution.",
    },
    {
      question: "How do I receive my prize if I win?",
      answer:
        "Prizes are typically distributed via electronic transfer (bank transfer, PayPal, etc.) within 7-10 business days after winner verification. You'll need to complete any required tax documentation.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, PayPal, Venmo, and Cash App. All payments are processed through secure, encrypted payment gateways.",
    },
    {
      question: "Can I play from outside the United States?",
      answer:
        "Participation is currently limited to residents of states where such contests are legally permitted. Please check your local laws and our terms of service for eligibility requirements.",
    },
    {
      question: "What happens if no ticket has the winning team?",
      answer:
        "If no ticket contains the tournament champion, the prize pool is distributed to tickets with the highest and lowest total points according to our predetermined prize distribution structure.",
    },
    {
      question: "How are ties broken?",
      answer:
        "Ties are broken by: 1) Total points scored by all teams, 2) Points in the final round, 3) Points in the semi-final round, 4) Random draw if still tied.",
    },
    {
      question: "Is there an age requirement to participate?",
      answer:
        "Yes, participants must be at least 18 years of age to create an account and purchase tickets in accordance with our terms of service and applicable laws.",
    },
    {
      question: "Can I purchase multiple tickets for the same tournament?",
      answer:
        "Yes, you can purchase multiple tickets for the same tournament. Each ticket will have a unique combination of teams, increasing your chances of winning.",
    },
    {
      question: "How are the teams randomly assigned?",
      answer:
        "Teams are assigned using a certified random algorithm that ensures fair distribution across all tickets. The system prevents duplicate teams within a single ticket.",
    },
    {
      question: "What percentage of proceeds goes to charity?",
      answer:
        "A minimum of 20% of all ticket sales goes to our partnered charitable organizations. The exact percentage varies by tournament and is clearly displayed before purchase.",
    },
    {
      question: "Can I get a refund for my ticket?",
      answer:
        "Ticket purchases are final and non-refundable, as teams are immediately assigned upon purchase. Exceptions may be made in exceptional circumstances at the discretion of management.",
    },
    {
      question: "How are the prize amounts determined?",
      answer:
        "Prize amounts are based on the number of tickets sold for each tournament. A fixed percentage of the total pool is allocated to prizes, with the amounts clearly displayed before purchase.",
    },
    {
      question: "What happens if a game is postponed or cancelled?",
      answer:
        "If a game is postponed, points will be counted once the game is played. If a game is cancelled entirely, points will be allocated based on tournament rules, which may include average points from previous games.",
    },
    {
      question: "Can I transfer my ticket to someone else?",
      answer:
        "Tickets are non-transferable once purchased. They are linked to your account and cannot be sold or transferred to another user.",
    },
    {
      question: "How do I update my account information?",
      answer:
        "You can update your account information at any time by visiting the 'Account Settings' section in your dashboard after logging in.",
    },
    {
      question: "Are there any strategies to increase my chances of winning?",
      answer:
        "While team selection is random, you can increase your chances by purchasing multiple tickets. However, all tickets have an equal chance of containing winning teams as the assignment is completely random.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1D13] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF7F11] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300">
            Find answers to common questions about our sports fundraiser
            tournaments.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#2A2A2A] rounded-xl border border-[#4B5320] overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#0B1D13] transition-colors"
              >
                <span className="text-lg font-medium text-white">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-[#FF7F11] transform transition-transform ${
                    openItems[index] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openItems[index] && (
                <div className="px-6 pb-6">
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-300 mb-6">
            Can't find the answer you're looking for? Please reach out to our
            support team.
          </p>
          <a
            href="/contact"
            className="bg-[#FF1E1E] hover:bg-[#FF7F11] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 inline-block"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
