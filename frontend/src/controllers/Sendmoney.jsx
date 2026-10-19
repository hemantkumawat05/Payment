import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../apiIntercepter';

const Sendmoney = ({ userId, recipient, onBack, onSuccess }) => {
    const [pin, setPin] = useState('');
    const [ammount, setAmmount] = useState('');
    const [loading, setLoading] = useState(false);

    const recipientId = recipient?._id || userId;
    const recipientName = recipient?.name || 'Verified User';
    const recipientEmail = recipient?.email || '';

    const quickAmounts = [500, 1000, 2000, 5000];

    const sendammount = async (e) => {
        if (e) e.preventDefault();
        try {
            if (!ammount || Number(ammount) <= 0) {
                return toast.error("Please enter a valid transfer amount greater than 0");
            }
            if (!pin || pin.toString().length !== 6) {
                return toast.error("Please enter your valid 6-digit transaction PIN");
            }

            setLoading(true);
            const response = await api.post('/api/transaction/sendamount', {
                reciverid: recipientId,
                amount: Number(ammount),
                senderPin: Number(pin),
            });

            if (response.data && response.data.success) {
                const remaining = response.data.balance !== undefined ? response.data.balance : response.data.blance;
                toast.success(`₹${ammount} sent successfully! Remaining balance: ₹${Number(remaining).toLocaleString('en-IN')}`);
                setPin('');
                setAmmount('');
                if (onSuccess) {
                    onSuccess(response.data);
                }
            } else {
                toast.error(response.data?.message || "Transaction failed");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Transaction failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                    <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">Transfer Funds</h2>
                    <p className="text-xs text-slate-500">Secured with 2FA session & CSRF protection</p>
                </div>
                <button
                    onClick={onBack}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                    ✕ Close
                </button>
            </div>

            {/* Recipient Card */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                        {recipientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{recipientName}</h4>
                        {recipientEmail && <p className="text-xs text-slate-500">{recipientEmail}</p>}
                        <p className="text-[11px] font-mono text-slate-400">ID: {recipientId?.slice(-10)}</p>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                    VERIFIED
                </span>
            </div>

            <form onSubmit={sendammount} className="space-y-4">
                {/* Amount Input */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Transfer Amount (₹)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                        <input
                            type="number"
                            min="1"
                            value={ammount}
                            onChange={(e) => setAmmount(e.target.value)}
                            placeholder="0"
                            className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white text-lg transition-colors"
                        />
                    </div>
                    {/* Quick Amount Chips */}
                    <div className="flex gap-2 mt-2">
                        {quickAmounts.map((q) => (
                            <button
                                key={q}
                                type="button"
                                onClick={() => setAmmount(q.toString())}
                                className="flex-1 py-1 text-xs font-semibold bg-slate-100 hover:bg-sky-100 hover:text-sky-700 rounded-lg text-slate-600 border border-slate-200 transition-colors"
                            >
                                +₹{q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PIN Input */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        6-Digit Transaction PIN
                    </label>
                    <input
                        type="password"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center tracking-widest text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white text-lg transition-colors"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Default PIN is 123456 unless changed in Settings.</p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-base shadow-lg shadow-sky-600/25 transition-all cursor-pointer"
                    >
                        {loading ? "Processing Secure Transfer..." : `Send ₹${ammount || "0"} Now`}
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                    >
                        Back to User Directory
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Sendmoney;