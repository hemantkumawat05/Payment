import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../apiIntercepter';
import { AppData } from '../context/AppContext';

const Setting = () => {
    const { logoutUser } = AppData();
    const navigate = useNavigate();

    // PIN State
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loadingPin, setLoadingPin] = useState(false);

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loadingPassword, setLoadingPassword] = useState(false);

    // Update PIN Handler
    const handleUpdatePin = async (e) => {
        e.preventDefault();
        if (!currentPin) {
            return toast.error("Current 6-digit PIN is required");
        }
        if (!newPin || newPin.toString().length !== 6) {
            return toast.error("New PIN must be exactly 6 digits");
        }
        if (newPin !== confirmPin) {
            return toast.error("New PIN and Confirm PIN do not match");
        }

        try {
            setLoadingPin(true);
            const response = await api.post('/api/user/update', {
                currentPin: Number(currentPin),
                newPin: Number(newPin),
            });

            if (response.data && response.data.success) {
                toast.success(response.data.message || "Transaction PIN updated successfully!");
                setCurrentPin('');
                setNewPin('');
                setConfirmPin('');
            } else {
                toast.error(response.data?.message || "Failed to update PIN");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to update PIN";
            toast.error(errorMsg);
        } finally {
            setLoadingPin(false);
        }
    };

    // Update Password Handler
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!oldPassword) {
            return toast.error("Current password is required");
        }
        if (!newPassword || newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("New password and confirmation do not match");
        }

        try {
            setLoadingPassword(true);
            const response = await api.post('/api/user/update', {
                oldPassword,
                newPassword,
            });

            if (response.data && response.data.success) {
                toast.success(response.data.message || "Password updated successfully!");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(response.data?.message || "Failed to update password");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to update password";
            toast.error(errorMsg);
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="pb-8 border-b border-slate-200">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
                    <span>Security, PIN &</span>
                    <span className="text-sky-600">Account Settings</span>
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                    Manage your 6-digit transaction PIN, multi-factor authentication, active login devices, and profile privacy.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                {/* Left Column: Credentials Management (7 cols) */}
                <div className="lg:col-span-7 space-y-8">
                    {/* 6-Digit PIN Form */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                        <div className="pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-black">
                                    PIN
                                </span>
                                6-Digit Transaction PIN Management
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Your PIN is required to authorize every wallet transfer and balance check.
                            </p>
                        </div>

                        <form onSubmit={handleUpdatePin} className="space-y-4 mt-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Current 6-Digit PIN
                                </label>
                                <input
                                    type="password"
                                    maxLength={6}
                                    value={currentPin}
                                    onChange={(e) => setCurrentPin(e.target.value)}
                                    placeholder="Enter current PIN (Default: 123456)"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:border-sky-500 focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        New 6-Digit PIN
                                    </label>
                                    <input
                                        type="password"
                                        maxLength={6}
                                        value={newPin}
                                        onChange={(e) => setNewPin(e.target.value)}
                                        placeholder="Enter new 6-digit PIN"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:border-sky-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Confirm New PIN
                                    </label>
                                    <input
                                        type="password"
                                        maxLength={6}
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value)}
                                        placeholder="Re-enter new PIN"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:border-sky-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loadingPin}
                                className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                            >
                                {loadingPin ? "Updating PIN..." : "Update Security PIN"}
                            </button>
                        </form>
                    </div>

                    {/* Account Password Form */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                        <div className="pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                                    PWD
                                </span>
                                Account Password
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Change your authentication password (minimum 6 characters, salted with bcrypt).
                            </p>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-4 mt-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loadingPassword}
                                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                            >
                                {loadingPassword ? "Updating Password..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Security Policies & Session Guard (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900 text-sm">Account Protection Policies</h3>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                ENFORCED
                            </span>
                        </div>
                        <div className="space-y-3 mt-4 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-800">Two-Factor Authentication (2FA)</h4>
                                <p className="text-slate-500 mt-0.5">
                                    Every login attempt issues a cryptographic 6-digit OTP to your verified email with 5-minute Redis expiration.
                                </p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-800">CSRF Token Guard</h4>
                                <p className="text-slate-500 mt-0.5">
                                    All state mutations (balance check, funds transfer, credentials update, logout) validate a synchronized double-submit token.
                                </p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-800">HttpOnly Token Architecture</h4>
                                <p className="text-slate-500 mt-0.5">
                                    15-minute access tokens and 7-day refresh tokens are isolated in HttpOnly cookies, immune to XSS theft.
                                </p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-800">Single-Device Active Session</h4>
                                <p className="text-slate-500 mt-0.5">
                                    Logging in from a new browser or device immediately revokes previous active sessions in Redis.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Session Invalidation Card */}
                    <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-200 shadow-sm">
                        <h3 className="font-bold text-rose-900 text-sm">Session Termination</h3>
                        <p className="text-xs text-rose-700 mt-1">
                            Revoke your active refresh token and destroy cached credentials on this device.
                        </p>
                        <button
                            onClick={() => logoutUser(navigate)}
                            className="mt-4 w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                        >
                            Terminate Active Session & Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;