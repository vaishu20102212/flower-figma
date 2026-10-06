import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => ({
    name: localStorage.getItem('flower-profile-name') || 'Felecia Brown',
    email: localStorage.getItem('flower-profile-email') || 'example@mail.com',
    role: localStorage.getItem('flower-profile-role') || 'Project Manager',
    phone: localStorage.getItem('flower-profile-phone') || '+123-4567-8800',
    picture: localStorage.getItem('flower-profile-picture') || '',
  }))
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const [focusSearchRequest, setFocusSearchRequest] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [headerTab, setHeaderTab] = useState('settings')

  const saveProfile = (updatedProfile) => {
    localStorage.setItem('flower-profile-name', updatedProfile.name)
    localStorage.setItem('flower-profile-email', updatedProfile.email)
    localStorage.setItem('flower-profile-role', updatedProfile.role)
    localStorage.setItem('flower-profile-phone', updatedProfile.phone)
    if (updatedProfile.picture) {
      localStorage.setItem('flower-profile-picture', updatedProfile.picture)
    } else {
      localStorage.removeItem('flower-profile-picture')
    }
    setProfile(updatedProfile)
  }

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        focusSearchRequest={focusSearchRequest}
        profile={profile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          activeTab={headerTab}
          onSelectTab={setHeaderTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearch={() => {
            setSidebarOpen(true)
            setFocusSearchRequest((current) => current + 1)
          }}
          profile={profile}
          onLockScreen={() => setIsLocked(true)}
          onLogout={() => {
            sessionStorage.removeItem('flower-authenticated')
            navigate('/login')
          }}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto">
            <Outlet context={{ headerTab, setHeaderTab, profile, saveProfile }} />
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
