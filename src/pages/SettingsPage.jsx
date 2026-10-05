import React, { useState } from 'react'

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [compactMode, setCompactMode] = useState(false)

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Preferences</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-800">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Choose how your Flower workspace behaves.</p>
      </div>

      <div className="max-w-3xl divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 p-6">
          <div><h2 className="text-sm font-extrabold text-slate-800">Email notifications</h2><p className="mt-1 text-xs text-slate-500">Receive updates about messages and tasks.</p></div>
          <button onClick={() => setEmailNotifications(!emailNotifications)} className={`relative h-6 w-11 rounded-full transition ${emailNotifications ? 'bg-emerald-500' : 'bg-slate-200'}`} aria-label="Toggle email notifications"><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${emailNotifications ? 'left-6' : 'left-1'}`} /></button>
        </div>
        <div className="flex items-center justify-between gap-4 p-6">
          <div><h2 className="text-sm font-extrabold text-slate-800">Compact layout</h2><p className="mt-1 text-xs text-slate-500">Fit more information on each page.</p></div>
          <button onClick={() => setCompactMode(!compactMode)} className={`relative h-6 w-11 rounded-full transition ${compactMode ? 'bg-emerald-500' : 'bg-slate-200'}`} aria-label="Toggle compact layout"><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${compactMode ? 'left-6' : 'left-1'}`} /></button>
        </div>
        <div className="p-6"><button className="rounded-xl bg-[#14532D] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#166534]">Save Preferences</button></div>
      </div>
    </section>
  )
}
