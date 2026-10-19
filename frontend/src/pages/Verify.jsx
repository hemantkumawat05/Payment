import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../apiIntercepter';

const Verify = () => {
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('Verifying your email token...');
    const params = useParams();

    async function verifyUser() {
        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/user/verify/${params.token}`);
            setStatus('success');
            setMessage(data.message || 'Email verified successfully! Your account has been created.');
            toast.success("Account Verified Successfully!");
        } catch (error) {
            setStatus('error');
            const err = error.response?.data?.message || error.message || 'Verification link expired or invalid';
            setMessage(err);
            toast.error(err);
        }
    }

    useEffect(() => {
        if (params.token) {
            verifyUser();
        } else {
            setStatus('error');
            setMessage('Invalid verification token.');
        }
    }, [params.token]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-sky-500 selection:text-white">
            <header className="max-w-7xl w-full mx-auto p-6">
                <Link to="/" className="inline-flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F4A8A] to-[#0284C7] flex items-center justify-center font-black text-white text-lg">
                        ₹
                    </div>
                    <span className="font-extrabold text-xl text-slate-900">Paytem</span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F4A8A] via-[#00BAF2] to-[#0284C7]" />

                    {status === 'loading' && (
                        <div className="py-8">
                            <div className="w-14 h-14 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900">Validating Verification Link</h2>
                            <p className="text-xs text-slate-500 mt-1">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto text-3xl mb-4 shadow-sm">
                                ✓
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                                Account Activated
                            </span>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Email Verified!</h2>
                            <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed">
                                {message}
                            </p>

                            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-900 text-left mb-6">
                                <p className="font-bold">🎉 Welcome Bonus Initialized:</p>
                                <p className="text-[11px] text-sky-700 mt-0.5">
                                    Your wallet is pre-funded with <b>₹10,000</b> and protected by default PIN <b>123456</b>.
                                </p>
                            </div>

                            <Link
                                to="/login"
                                className="block w-full py-3 bg-gradient-to-r from-[#0F4A8A] to-[#0284C7] hover:from-[#0c3c70] hover:to-[#0275b1] text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-700/20 transition-all"
                            >
                                Proceed to Sign In with 2FA →
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="py-4">
                            <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center mx-auto text-3xl mb-4 shadow-sm">
                                ✕
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 mb-2">
                                Verification Expired
                            </span>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Activation Failed</h2>
                            <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/signup"
                                    className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors"
                                >
                                    Try Signing Up Again
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-6 text-center text-xs text-slate-400">
                © Paytem Digital Wallet. Multi-Factor 2FA Authentication Enforced.
            </footer>
        </div>
    );
};

export default Verify;