
import React from 'react';
import { UserProfile, Language } from '../types';

interface Props {
  users: UserProfile[];
  language: Language;
}

const AdminDashboard: React.FC<Props> = ({ users, language }) => {
  const isBN = language === 'bn';

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">
            <i className="fas fa-users-cog"></i>
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tight">
              {isBN ? 'ইউজার ম্যানেজমেন্ট' : 'User Management'}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {users.length} {isBN ? 'জন রেজিস্টার্ড ইউজার' : 'Registered Users'}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold text-sm italic">
                  No users registered yet.
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-black text-slate-700">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-500 tracking-wider">{u.mobile}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${u.isAdmin ? 'bg-slate-800 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                      {u.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
