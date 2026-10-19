import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../apiIntercepter';
import { AppData } from '../context/AppContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const [isOtp, setIsOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(300); // 5 minutes (matches Redis OTP TTL)

    const { setIsAuth, setUser, fetchUser } = AppData();
    const navigate = useNavigate();

    // Countdown timer for OTP expiry
    useEffect(() => {
        let interval = null;
        if (isOtp && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOtp, timer]);

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Step 1: Submit Credentials -> Issues 2FA OTP
    const handleLoginSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!email.trim() || !password) {
            return toast.error("Please enter both email address and password");
        }
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
                email: email.trim().toLowerCase(),
                password,
            });

            if (response.data && response.data.success) {
                toast.success(response.data.message || "OTP code sent to your email!");
                setIsOtp(true);
                setTimer(300);
            } else {
                toast.error(response.data?.message || "Invalid credentials");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Login failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify 2FA OTP -> Sets HttpOnly cookies & CSRF token
    const handleOtpVerification = async (e) => {
        if (e) e.preventDefault();
        const cleanOtp = otp.trim();
        if (cleanOtp.length !== 6 || isNaN(Number(cleanOtp))) {
            return toast.error("Please enter a valid 6-digit numeric OTP");
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/user/verify`,
                { email: email.trim().toLowerCase(), otp: cleanOtp },
                { withCredentials: true }
            );

            if (response.data) {
                toast.success(response.data.message || "Logged in successfully!");
                setIsAuth(true);
                setUser(response.data.user);
                await fetchUser(false);
                navigate('/');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "OTP verification failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP handler
    const handleResendOtp = async () => {
        if (resending || timer > 240) return;
        setResending(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
                email: email.trim().toLowerCase(),
                password,
            });
            if (response.data && response.data.success) {
                toast.success("A fresh 6-digit OTP has been sent to your email!");
                setTimer(300);
            } else {
                toast.error(response.data?.message || "Failed to resend OTP");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to resend OTP";
            toast.error(errorMsg);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] flex flex-col justify-between selection:bg-sky-500 selection:text-white">
            {/* Top Navigation Bar */}
            <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F4A8A] to-[#0284C7] flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                        <span className="text-white font-black text-xl">₹</span>
                    </div>
                    <div>
                        <span className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-2">
                            Paytem <span className="text-[10px] font-bold text-sky-700 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-full">WALLET</span>
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 hidden sm:inline">Don't have an account?</span>
                    <Link
                        to="/signup"
                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-bold text-sky-700 text-xs shadow-sm hover:border-sky-400 transition-all"
                    >
                        Sign Up
                    </Link>
                </div>
            </header>

            {/* Central Auth Container */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-8 sm:p-10 relative overflow-hidden">
                    {/* Top Decorative Cyan Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F4A8A] via-[#00BAF2] to-[#0284C7]" />

                    {/* Step 1: Email & Password */}
                    {!isOtp && (
                        <div>
                            {/* Card Header */}
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#0F4A8A] flex items-center justify-center shadow-lg shadow-[#0F4A8A]/25">
                                    <span className="text-2xl font-black text-[#00BAF2]">P</span>
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                                <p className="text-xs text-slate-500 mt-1">
                                    Sign in with your verified credentials & multi-factor protection.
                                </p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="user@gmail.com"
                                            className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                        />
                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                            ✉
                                        </span>
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Password
                                        </label>
                                        <span className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer">
                                            Min. 8 chars
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            className="w-full pl-3.5 pr-14 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between text-xs pt-1">
                                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer"
                                        />
                                        <span>Remember my wallet session</span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-[#0F4A8A] to-[#0284C7] hover:from-[#0c3c70] hover:to-[#0275b1] disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Verifying Credentials...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Continue to 2FA Verification</span>
                                            <span>→</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 2: 2FA OTP Verification */}
                    {isOtp && (
                        <div>
                            {/* Back button */}
                            <button
                                type="button"
                                onClick={() => setIsOtp(false)}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-5 cursor-pointer"
                            >
                                <span>←</span>
                                <span>Change email or password</span>
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center text-2xl shadow-sm">
                                    🔒
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                                    Step 2 of 2: Two-Factor Authentication
                                </span>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enter 6-Digit OTP</h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    A verification code has been dispatched to:
                                </p>
                                <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">{email}</p>
                            </div>

                            <form onSubmit={handleOtpVerification} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
                                        One-Time Passcode (OTP)
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        autoFocus
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="••••••"
                                        className="w-full py-3 px-4 bg-slate-50 border-2 border-sky-400 rounded-xl font-mono text-center tracking-[0.5em] text-2xl font-black text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white shadow-inner"
                                    />
                                </div>

                                {/* Timer & Resend info */}
                                <div className="flex items-center justify-between text-xs py-1">
                                    <span className="text-slate-500 flex items-center gap-1">
                                        <span>⏱</span>
                                        <span>Expires in:</span>
                                        <b className={`font-mono ${timer < 60 ? 'text-rose-600' : 'text-slate-800'}`}>
                                            {formatTimer(timer)}
                                        </b>
                                    </span>

                                    <button
                                        type="button"
                                        disabled={resending || timer > 240}
                                        onClick={handleResendOtp}
                                        className={`font-bold transition-colors cursor-pointer ${
                                            timer > 240
                                                ? 'text-slate-400 cursor-not-allowed'
                                                : 'text-sky-600 hover:text-sky-800 hover:underline'
                                        }`}
                                    >
                                        {resending ? "Sending..." : "Resend OTP"}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Validating 2FA Code...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Verify OTP & Unlock Wallet</span>
                                            <span>✓</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Bottom Switcher */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500">
                            New to Paytem?{' '}
                            <Link to="/signup" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Security Badges Footer */}
            <footer className="py-6 text-center text-xs text-slate-500 max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">🔒 256-Bit SSL Encrypted</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">🛡️ Double-Submit CSRF Shield</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">⚡ Redis 2FA Session Isolation</span>
                </div>
            </footer>
        </div>
    );
};

export default Login;