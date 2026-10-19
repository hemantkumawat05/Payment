import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../apiIntercepter';
import { AppData } from '../context/AppContext';
import Showusers from '../controllers/Showusers';

const Dashboard = () => {
    const { user, fetchUser } = AppData();
    const [balance, setBalance] = useState("****");
    const [pin, setPin] = useState("");
    const [loadingBalance, setLoadingBalance] = useState(false);

    const balancecheck = async (e) => {
        if (e) e.preventDefault();
        try {
            if (!pin || pin.toString().length !== 6) {
                return toast.error("Please enter a valid 6-digit PIN");
            }
            setLoadingBalance(true);
            const response = await api.post('/api/transaction/balance', { pin: Number(pin) });
            if (response.data && response.data.success) {
                setBalance(response.data.balance);
                toast.success("Balance fetched successfully!");
                setPin("");
            } else {
                toast.error(response.data?.message || "Failed to fetch balance");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch balance";
            toast.error(errorMsg);
        } finally {
            setLoadingBalance(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Welcome back, <span className="text-sky-600">{user?.name || "Account Holder"}</span>
                        </h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            2FA Active
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage your secure digital wallet, peer-to-peer transfers, and live audit ledger.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to="/transcation"
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-sm font-semibold shadow-sm transition-all"
                    >
                        View Passbook
                    </Link>
                    <Link
                        to="/setting"
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-sky-600/20 transition-all"
                    >
                        Security & PIN
                    </Link>
                </div>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
                {/* Balance Check Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#0F4A8A] via-[#0A2540] to-[#061826] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-700">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-bold text-sky-300">
                                ₹
                            </div>
                            <div>
                                <span className="text-xs uppercase tracking-wider font-bold text-sky-300">Primary Wallet</span>
                                <p className="text-xs text-slate-400">Account ID: {user?._id?.slice(-8) || "********"}</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
                            CSRF Protected
                        </span>
                    </div>

                    <div className="my-6">
                        <p className="text-xs font-medium text-slate-300">Available Balance</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-light text-slate-400">₹</span>
                            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                                {balance === "****" ? "••••••" : Number(balance).toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    {/* PIN Form */}
                    <form onSubmit={balancecheck} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-2.5">
                        <input
                            type="password"
                            maxLength={6}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Enter 6-digit PIN"
                            className="bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 px-3.5 py-2 rounded-lg text-sm flex-1 focus:outline-none focus:border-sky-500 tracking-widest"
                        />
                        <button
                            type="submit"
                            disabled={loadingBalance}
                            className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm cursor-pointer transition-colors"
                        >
                            {loadingBalance ? "Verifying..." : "Check Balance"}
                        </button>
                        {balance !== "****" && (
                            <button
                                type="button"
                                onClick={() => setBalance("****")}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-3 py-2 rounded-lg cursor-pointer transition-colors"
                            >
                                Hide
                            </button>
                        )}
                    </form>
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                        <span>🔒</span> Default PIN is <span className="font-mono text-sky-300">123456</span> unless modified in Settings.
                    </p>
                </div>

                {/* Security Overview Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">Security Credentials</h3>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <ul className="divide-y divide-slate-100 text-xs text-slate-600 mt-3">
                            <li className="py-2.5 flex justify-between">
                                <span className="text-slate-500">Authentication</span>
                                <span className="font-semibold text-slate-800">2FA OTP + Password</span>
                            </li>
                            <li className="py-2.5 flex justify-between">
                                <span className="text-slate-500">Access Token</span>
                                <span className="font-semibold text-emerald-600">Active (15m Rotation)</span>
                            </li>
                            <li className="py-2.5 flex justify-between">
                                <span className="text-slate-500">Refresh Token</span>
                                <span className="font-semibold text-emerald-600">Active (7d Redis)</span>
                            </li>
                            <li className="py-2.5 flex justify-between">
                                <span className="text-slate-500">CSRF Shield</span>
                                <span className="font-semibold text-sky-600">Double-Submit Cookie</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <Link
                            to="/setting"
                            className="block text-center text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
                        >
                            Manage Security Policies & PIN →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Show Users Directory Component */}
            <div className="mt-8">
                <Showusers onSendSuccess={() => fetchUser(false)} />
            </div>
        </div>
    );
};

export default Dashboard;