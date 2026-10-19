import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../apiIntercepter';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const navigate = useNavigate();

    const handleSignupSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!name.trim() || name.trim().length < 3) {
            return toast.error("Full name must be at least 3 characters long");
        }
        if (!email.trim()) {
            return toast.error("Email address is required");
        }
        if (!password || password.length < 8) {
            return toast.error("Password must be at least 8 characters long");
        }
        if (password !== confirmPassword) {
            return toast.error("Password and confirm password do not match");
        }

        setLoading(true);
        try {
            const cleanEmail = email.trim().toLowerCase();
            const response = await axios.post(`${BACKEND_URL}/api/user/register`, {
                name: name.trim(),
                email: cleanEmail,
                password,
            });

            if (response.data) {
                toast.success(response.data.message || "Verification email sent!");
                setSubmittedEmail(cleanEmail);
                setIsSubmitted(true);
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data?.error?.[0]?.message ||
                error.message ||
                "Registration failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-between selection:bg-sky-500 selection:text-white">
            {/* Top Minimal Header for Mobile */}
            <header className="lg:hidden p-4 bg-[#0A2540] text-white flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-black text-white">
                        ₹
                    </div>
                    <span className="font-extrabold text-lg">Paytem</span>
                </Link>
                <Link to="/login" className="text-xs font-bold text-sky-400 hover:underline">
                    Sign In →
                </Link>
            </header>

            {/* Split Hero & Form Section */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 bg-transparent">
                    {/* Left Column: Brand Hero Panel (5 cols) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-[#0F4A8A] via-[#092A54] to-[#06182E] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between border border-slate-700/80">
                        {/* Glow Sphere Accents */}
                        <div className="absolute -top-12 -right-12 w-56 h-56 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Brand Header */}
                        <div className="relative z-10">
                            <Link to="/" className="inline-flex items-center gap-3 group">
                                <div className="w-11 h-11 rounded-xl bg-[#00BAF2] flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                                    <span className="text-white font-black text-2xl">₹</span>
                                </div>
                                <div>
                                    <span className="font-black text-2xl tracking-tight text-white flex items-center gap-2">
                                        Paytem <span className="text-[10px] font-bold text-sky-300 bg-sky-950/80 border border-sky-600/60 px-2 py-0.5 rounded-full">WALLET</span>
                                    </span>
                                </div>
                            </Link>

                            <div className="mt-8 space-y-3">
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                                    Fast, Secure &<br />
                                    Seamless Digital<br />
                                    <span className="text-[#38BDF8]">Payments</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    Open your verified Paytem wallet account with instant ₹10,000 initial balance & 6-digit PIN security.
                                </p>
                            </div>
                        </div>

                        {/* Trust Features Card */}
                        <div className="relative z-10 mt-8 bg-white/[0.07] border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-full bg-sky-400/20 flex items-center justify-center text-sm font-bold text-sky-300 shrink-0">
                                    ⚡
                                </div>
                                <div>
                                    <h2 className="text-xs font-bold text-white">Zero-Delay Transfers</h2>
                                    <p className="text-[11px] text-slate-300">Send money instantly across users with live audit ledger.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center text-sm font-bold text-emerald-300 shrink-0">
                                    🔒
                                </div>
                                <div>
                                    <h2 className="text-xs font-bold text-white">6-Digit PIN Encryption</h2>
                                    <p className="text-[11px] text-slate-300">Every debit operation requires personal PIN authorization.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-sm font-bold text-amber-300 shrink-0">
                                    ₹
                                </div>
                                <div>
                                    <h2 className="text-xs font-bold text-white">₹10,000 Welcome Bonus</h2>
                                    <p className="text-[11px] text-slate-300">Pre-funded wallet balance ready for test transactions.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>2FA EMAIL OTP</span>
                            <span>•</span>
                            <span>CSRF SHIELD</span>
                            <span>•</span>
                            <span>REDIS SESSION</span>
                        </div>
                    </div>

                    {/* Right Column: Registration Card (7 cols) */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-900/5 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F4A8A] via-[#00BAF2] to-[#0284C7]" />

                        {!isSubmitted ? (
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create your Account</h2>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Start your digital wallet journey in less than 2 minutes.
                                        </p>
                                    </div>
                                    <Link
                                        to="/login"
                                        className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors hidden sm:block"
                                    >
                                        Sign In
                                    </Link>
                                </div>

                                <form onSubmit={handleSignupSubmit} className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                            Account Holder Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Hemant Kumawat"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="user@gmail.com"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            We will send an activation link to this email.
                                        </p>
                                    </div>

                                    {/* Password & Confirm */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                    Password
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800"
                                                >
                                                    {showPassword ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Min. 8 characters"
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Confirm Password
                                            </label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter password"
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Pre-funded Wallet Notification */}
                                    <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-2xl flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-bold flex items-center justify-center text-sm shrink-0">
                                            🎁
                                        </div>
                                        <div className="text-xs text-sky-900">
                                            <p className="font-bold">Instant ₹10,000 Welcome Balance & PIN 123456</p>
                                            <p className="text-[11px] text-sky-700">Pre-loaded in your wallet upon email verification. Customize anytime.</p>
                                        </div>
                                    </div>

                                    {/* Submit CTA */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-gradient-to-r from-[#0F4A8A] to-[#0284C7] hover:from-[#0c3c70] hover:to-[#0275b1] disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Registering Account & Sending Email...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Create Paytem Account</span>
                                                <span>→</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* Success Confirmation State */
                            <div className="text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto text-3xl mb-4 shadow-sm">
                                    ✉️
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                                    Verification Link Dispatched
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Check Your Inbox</h3>
                                <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                                    We have sent a secure activation link to:
                                </p>
                                <p className="text-sm font-bold text-sky-700 font-mono mt-1 mb-4">
                                    {submittedEmail}
                                </p>

                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-xs text-slate-600 text-left space-y-2 mb-6">
                                    <div className="flex items-center gap-2 font-bold text-slate-800">
                                        <span>⏱️</span>
                                        <span>Link expires in 5 minutes</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                        Click the link inside the email to finalize creation of your account, fund your ₹10,000 wallet, and activate 2FA credentials.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
                                    <Link
                                        to="/login"
                                        className="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                                    >
                                        Proceed to Login →
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setIsSubmitted(false)}
                                        className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                                    >
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bottom Switcher */}
                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-500">
                                Already have a Paytem account?{' '}
                                <Link to="/login" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
                                    Sign In here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="py-6 text-center text-xs text-slate-500 max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">🔒 PCI-DSS Compliant Hashing</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">🛡️ Anti-CSRF Tokenization</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">⚡ Instant UPI Interoperability Ready</span>
                </div>
            </footer>
        </div>
    );
};

export default Signup;
