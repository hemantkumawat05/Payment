import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppData } from '../context/AppContext';
import api from '../apiIntercepter';

const Profile = () => {
    const { user, sessionInfo, fetchUser } = AppData();
    const [pin, setPin] = useState('');
    const [revealedBalance, setRevealedBalance] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheckBalance = async (e) => {
        if (e) e.preventDefault();
        try {
            if (!pin || pin.toString().length !== 6) {
                return toast.error("Please enter your 6-digit transaction PIN");
            }
            setLoading(true);
            const response = await api.post('/api/transaction/balance', { pin: Number(pin) });
            if (response.data && response.data.success) {
                setRevealedBalance(response.data.balance);
                toast.success("Wallet balance verified!");
                setPin('');
            } else {
                toast.error(response.data?.message || "Failed to verify PIN");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to check balance";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header / Identity Hero */}
            <div className="bg-gradient-to-r from-[#0F4A8A] to-[#0A2540] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-slate-700">
                <div className="absolute -right-8 -top-8 w-44 h-44 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center font-black text-3xl shadow-lg border-2 border-white/20">
                            {userInitial}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user?.name || "Account Holder"}</h1>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    VERIFIED
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm mt-0.5">{user?.email || "user@paytem.com"}</p>
                            <p className="text-[11px] font-mono text-slate-400 mt-1">
                                User Account ID: {user?._id || "****************"}
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/setting"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5"
                    >
                        <span>⚙</span> Manage Security & PIN
                    </Link>
                </div>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Wallet Balance & PIN Verification */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Wallet Account Balance</h2>
                        <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                            Tier-1 Primary
                        </span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                        <p className="text-xs text-slate-500 font-medium">Verified Wallet Balance</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-light text-slate-400">₹</span>
                            <span className="text-3xl font-black text-slate-900 font-mono">
                                {revealedBalance !== null
                                    ? Number(revealedBalance).toLocaleString('en-IN')
                                    : (user?.amount !== undefined ? Number(user.amount).toLocaleString('en-IN') : "••••••")}
                            </span>
                        </div>
                        {revealedBalance === null && (
                            <p className="text-[11px] text-slate-400 mt-1">Balance from verified profile session</p>
                        )}
                    </div>

                    {/* Quick PIN verification form */}
                    <form onSubmit={handleCheckBalance} className="space-y-3 pt-2">
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Verify with 6-Digit PIN
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                maxLength={6}
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="Enter 6-digit PIN"
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:border-sky-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                                {loading ? "Verifying..." : "Verify PIN"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Multi-Factor Authentication & Session Details */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Security Credentials & 2FA</h2>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Active Shield
                        </span>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-slate-500">Two-Factor Authentication (2FA)</span>
                            <span className="font-semibold text-emerald-600">● Email OTP Enabled</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-slate-500">Access Token Lifecycle</span>
                            <span className="font-semibold text-slate-700">15 Minutes (HttpOnly Cookie)</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-slate-500">Refresh Token Rotation</span>
                            <span className="font-semibold text-slate-700">7 Days (Redis Session)</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-slate-500">CSRF Defense</span>
                            <span className="font-semibold text-sky-600">Double-Submit Header Validation</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-slate-500">Active Session ID</span>
                            <span className="font-mono text-slate-600 text-[11px]">
                                {sessionInfo?.sessionId ? `${sessionInfo.sessionId.slice(0, 12)}...` : "Active"}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Link
                            to="/transcation"
                            className="block w-full py-2.5 text-center text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                        >
                            View Passbook Ledger →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;