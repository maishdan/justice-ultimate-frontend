// 📁 File: src/components/dashboard/widgets/AffiliatePanel.tsx

import React from 'react';
import { Gift, Link2, Copy } from 'lucide-react';

export default function AffiliatePanel() {
  const referralLink = 'https://justiceauto.com/ref?user=123';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="bg-green-800/90 p-6 rounded-2xl shadow-lg hover:shadow-green-400/40 transition-all duration-300">
      <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-lime-300">
        <Gift className="text-lime-400" /> Affiliate Panel
      </h3>
      <p className="text-green-100 mb-4">
        Invite friends and earn discounts or commissions for every successful referral!
      </p>
      <div className="flex items-center gap-2 bg-green-700 p-3 rounded-lg">
        <Link2 className="text-lime-300" />
        <input
          readOnly
          value={referralLink}
          className="bg-transparent border-none outline-none text-green-100 w-full"
        />
        <button
          onClick={handleCopy}
          className="text-lime-200 hover:text-white transition-colors"
        >
          <Copy size={18} />
        </button>
      </div>
      <div className="mt-4 text-sm text-lime-200">
        You’ve earned <span className="font-bold">KES 1,250</span> this month from referrals!
      </div>
    </div>
  );
}
