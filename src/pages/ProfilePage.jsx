import React from 'react'

export default function ProfilePage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Account</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-800">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal details and workspace identity.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
          <img
            src="/user-avatar.png"
            alt="ArtTemplate"
            className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-emerald-100"
          />
          <h2 className="mt-4 font-extrabold text-slate-800">ArtTemplate</h2>
          <p className="mt-1 text-xs text-slate-400">Admin / Design Studio</p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800">Profile Information</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-500">Full Name<input defaultValue="ArtTemplate" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400" /></label>
            <label className="text-xs font-bold text-slate-500">Email<input defaultValue="hello@arttemplate.com" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400" /></label>
            <label className="text-xs font-bold text-slate-500">Role<input defaultValue="Manager" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400" /></label>
            <label className="text-xs font-bold text-slate-500">Phone<input defaultValue="+1 555 014 2024" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400" /></label>
          </div>
          <button className="mt-6 rounded-xl bg-[#14532D] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#166534]">Save Changes</button>
        </div>
      </div>
    </section>
  )
}
