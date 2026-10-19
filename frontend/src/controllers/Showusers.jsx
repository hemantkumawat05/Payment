import React, { useEffect, useState } from 'react';
import api from '../apiIntercepter';
import Sendmoney from './Sendmoney';

const Showusers = ({ onSendSuccess }) => {
    const [users, setUsers] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const getusers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user/userdata');
            if (response.data && response.data.success) {
                setUsers(response.data.users || []);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getusers();
    }, []);

    const filteredUsers = (users || []).filter((u) => {
        const query = searchTerm.toLowerCase();
        return (
            u.name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u._id?.toLowerCase().includes(query)
        );
    });

    if (selectedUser) {
        return (
            <div className="py-4">
                <Sendmoney
                    userId={selectedUser._id}
                    recipient={selectedUser}
                    onBack={() => setSelectedUser(null)}
                    onSuccess={() => {
                        setSelectedUser(null);
                        getusers();
                        if (onSendSuccess) onSendSuccess();
                    }}
                />
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8">
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verified User Directory</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Send money instantly to registered peers using protected multi-factor routing.
                    </p>
                </div>
                <div className="w-full sm:w-72 relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                    />
                    <svg
                        className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* User List Table */}
            <div className="mt-6 overflow-x-auto">
                {loading && (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        Loading directory...
                    </div>
                )}

                {!loading && filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-2">
                            👥
                        </div>
                        <p className="text-slate-600 font-semibold text-sm">No registered users found</p>
                        <p className="text-slate-400 text-xs mt-1">Try another search term or invite friends to join.</p>
                    </div>
                )}

                {!loading && filteredUsers.length > 0 && (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 px-3">#</th>
                                <th className="pb-3 px-4">Account Holder</th>
                                <th className="pb-3 px-4">Account ID</th>
                                <th className="pb-3 px-4">Security Status</th>
                                <th className="pb-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((u, index) => (
                                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3 px-3 text-slate-400 font-mono text-xs">{index + 1}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                                {u.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm leading-tight">{u.name}</p>
                                                <p className="text-xs text-slate-500 leading-tight">{u.email || "user@paytem.com"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                                        {u._id}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            ● 2FA Verified
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => setSelectedUser(u)}
                                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
                                        >
                                            Send Money
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Showusers;