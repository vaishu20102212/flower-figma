import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const [headerTab, setHeaderTab] = useState('settings')

  if (isLoggedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 text-center">
        <div className="max-w-sm rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B4F481] text-2xl">🌸</div>
          <h1 className="text-xl font-extrabold text-slate-800">You are logged out</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in again to continue managing your workspace.</p>
          <button
            onClick={() => setIsLoggedOut(false)}
            className="mt-6 rounded-2xl bg-[#14532D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#166534]"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          activeTab={headerTab}
          onSelectTab={setHeaderTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLockScreen={() => setIsLocked(true)}
          onLogout={() => setIsLoggedOut(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto">
            <Outlet context={{ headerTab, setHeaderTab }} />
          </div>
        </main>
      </div>

      {isLocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-6 text-center backdrop-blur-sm">
          <div className="max-w-sm text-white">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#B4F481] text-3xl">🔒</div>
            <h1 className="text-2xl font-extrabold">Screen Locked</h1>
            <p className="mt-2 text-sm text-slate-300">Your workspace is protected while you are away.</p>
            <button
              onClick={() => setIsLocked(false)}
              className="mt-7 rounded-2xl bg-[#B4F481] px-6 py-3 text-sm font-bold text-[#14532D] hover:bg-[#c7fa9f]"
            >
              Unlock Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
