import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../apiIntercepter';
import Sendmoney from './Sendmoney';

const Transcations = () => {
    const [transcations, setTranscations] = useState(null);
    const [filter, setFilter] = useState('ALL'); // 'ALL' | 'SENT' | 'RECEIVED'
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchtranscations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/transaction/transactionsdata');
            if (response.data && response.data.success) {
                setTranscations(response.data.transcations || []);
            } else {
                toast.error(response.data?.message || "Failed to load transactions");
                setTranscations([]);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to load transactions";
            toast.error(errorMsg);
            setTranscations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchtranscations();
    }, []);

    const allTx = transcations || [];
    const totalSent = allTx
        .filter((t) => t.send)
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalReceived = allTx
        .filter((t) => !t.send)
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalVolume = totalSent + totalReceived;

    const filteredTx = allTx.filter((t) => {
        if (filter === 'SENT') return t.send;
        if (filter === 'RECEIVED') return !t.send;
        return true;
    });

    if (selectedUser) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Sendmoney
                    userId={selectedUser.id}
                    recipient={{ _id: selectedUser.id, name: selectedUser.name }}
                    onBack={() => setSelectedUser(null)}
                    onSuccess={() => {
                        setSelectedUser(null);
                        fetchtranscations();
                    }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Passbook & Ledger</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Detailed, immutable audit trail of all peer transfers and wallet activity.
                    </p>
                </div>
                <button
                    onClick={fetchtranscations}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                >
                    <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {loading ? "Refreshing..." : "Refresh Ledger"}
                </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
                {/* Total Volume */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Transaction Volume</p>
                    <h2 className="text-2xl font-black text-slate-900 mt-2 font-mono">
                        ₹ {totalVolume.toLocaleString('en-IN')}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">{allTx.length} total transfers recorded</p>
                </div>

                {/* Total Debited */}
                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm bg-gradient-to-br from-white to-rose-50/30">
                    <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Total Money Sent (Debited)</p>
                    <h2 className="text-2xl font-black text-rose-600 mt-2 font-mono">
                        - ₹ {totalSent.toLocaleString('en-IN')}
                    </h2>
                    <p className="text-xs text-rose-400 mt-1">{allTx.filter((t) => t.send).length} outgoing transfers</p>
                </div>

                {/* Total Credited */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Total Money Received (Credited)</p>
                    <h2 className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                        + ₹ {totalReceived.toLocaleString('en-IN')}
                    </h2>
                    <p className="text-xs text-emerald-500 mt-1">{allTx.filter((t) => !t.send).length} incoming credits</p>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
                {/* Filter Tabs */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-base">Transaction Records</h3>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {['ALL', 'SENT', 'RECEIVED'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                    filter === tab
                                        ? 'bg-white text-sky-700 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {tab === 'ALL' ? 'All' : tab === 'SENT' ? 'Debits (-)' : 'Credits (+)'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Transaction List */}
                <div className="mt-4 overflow-x-auto">
                    {loading && (
                        <div className="text-center py-12 text-slate-400 text-sm">
                            Fetching transaction history...
                        </div>
                    )}

                    {!loading && filteredTx.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-2">
                                📑
                            </div>
                            <p className="text-slate-600 font-semibold text-sm">No transactions found</p>
                            <p className="text-slate-400 text-xs mt-1">Your ledger will populate as money is sent or received.</p>
                        </div>
                    )}

                    {!loading && filteredTx.length > 0 && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="pb-3 px-3">#</th>
                                    <th className="pb-3 px-4">Counterparty</th>
                                    <th className="pb-3 px-4">Type</th>
                                    <th className="pb-3 px-4">Amount</th>
                                    <th className="pb-3 px-4">Timestamp</th>
                                    <th className="pb-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTx.map((e, index) => {
                                    const isDebit = e.send;
                                    const dateStr = e.date
                                        ? new Date(e.date).toLocaleString('en-IN', {
                                              dateStyle: 'medium',
                                              timeStyle: 'short',
                                          })
                                        : 'N/A';

                                    return (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3.5 px-3 text-slate-400 font-mono text-xs">{index + 1}</td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                                            isDebit
                                                                ? 'bg-rose-100 text-rose-700'
                                                                : 'bg-emerald-100 text-emerald-700'
                                                        }`}
                                                    >
                                                        {isDebit ? '↑' : '↓'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{e.name || "Wallet User"}</p>
                                                        <p className="text-[11px] font-mono text-slate-400">ID: {e.id ? e.id.slice(-8) : "N/A"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        isDebit
                                                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}
                                                >
                                                    {isDebit ? 'DEBIT (SENT)' : 'CREDIT (RECEIVED)'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-sm">
                                                <span className={isDebit ? 'text-rose-600' : 'text-emerald-600'}>
                                                    {isDebit ? '-' : '+'} ₹{Number(e.amount).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                                                {dateStr}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {e.id && (
                                                    <button
                                                        onClick={() => setSelectedUser({ id: e.id, name: e.name })}
                                                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 transition-colors cursor-pointer"
                                                    >
                                                        Send Again
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transcations;