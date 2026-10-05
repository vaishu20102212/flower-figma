import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MenuIcon,
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  CloseIcon,
  SettingsIcon,
} from '../../icons/FlowerIcons'

export default function Header({
  activeTab = 'settings',
  onSelectTab,
  onToggleSidebar,
  onLockScreen,
  onLogout,
}) {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleTabClick = (tabKey) => {
    if (onSelectTab) {
      onSelectTab(tabKey)
    }
    navigate('/')
  }

  const notifications = [
    {
      id: 1,
      name: 'Regina Cooper',
      time: '1 min ago',
      avatar: '/user-avatar.png',
      unread: true,
    },
    {
      id: 2,
      name: 'Judith Black',
      time: '5 min ago',
      avatar: '/user-avatar.png',
      unread: true,
    },
    {
      id: 3,
      name: 'Ronald Robertson',
      time: '3 hour ago',
      avatar: '/user-avatar.png',
      unread: false,
    },
    {
      id: 4,
      name: 'Dustin Williamson',
      time: '15 hour ago',
      avatar: '/user-avatar.png',
      unread: false,
    },
    {
      id: 5,
      name: 'Calvin Flores',
      time: 'Yesterday',
      avatar: '/user-avatar.png',
      unread: false,
    },
    {
      id: 6,
      name: 'Robert Edwards',
      time: 'Yesterday',
      avatar: '/user-avatar.png',
      unread: false,
    },
  ]

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-slate-100">
      {/* Left side: Hamburger Toggle & Pill Tabs (Settings, Activity, Users) */}
      <div className="flex items-center gap-3 md:gap-5">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Top Navbar Tabs: Settings, Activity, Users */}
        <div className="flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-2xl border border-slate-100">
          <button
            onClick={() => handleTabClick('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#EAFBF5] text-[#16A34A] shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => handleTabClick('activity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'activity'
                ? 'bg-[#EAFBF5] text-[#16A34A] shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            <span>Activity</span>
          </button>

          <button
            onClick={() => handleTabClick('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-[#EAFBF5] text-[#16A34A] shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            <span>Users</span>
          </button>
        </div>
      </div>

      {/* Right side: Actions, Notifications, Separator, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Icon Button */}
        <button
          title="Search"
          className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
        >
          <SearchIcon className="w-5 h-5" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#16A34A] rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                  8
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={n.avatar}
                          alt={n.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        {n.unread && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{n.name}</p>
                        <p className="text-[10px] text-slate-400">{n.time}</p>
                      </div>
                    </div>
                    {n.unread && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="text-slate-300 hover:text-slate-500"
                      >
                        <CloseIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown (Screenshot 122259) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-50 transition"
          >
            <img
              src="/user-avatar.png"
              alt="ArtTemplate"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#16A34A]/30"
            />
            <span className="hidden md:inline text-xs font-bold text-slate-800">
              ArtTemplate
            </span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/user-avatar.png"
                    alt="ArtTemplate"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">ArtTemplate</p>
                    <p className="text-[10px] text-slate-400">Manager</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-white bg-rose-500 px-1.5 py-0.5 rounded-full">
                  8
                </span>
              </div>

              <div className="py-2 space-y-0.5 text-xs text-slate-600 font-medium">
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                  className="flex items-center gap-3 px-5 py-2 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="text-slate-400">👤</span> My Profile
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/mail'); }}
                  className="flex items-center gap-3 px-5 py-2 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="text-slate-400">✉️</span> My Messages
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/tasks'); }}
                  className="flex items-center gap-3 px-5 py-2 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="text-slate-400">📋</span> My Tasks
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                  className="flex items-center gap-3 px-5 py-2 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="text-slate-400">⚙️</span> Settings
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); onLockScreen(); }}
                  className="flex items-center gap-3 px-5 py-2 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="text-slate-400">🔒</span> Lock Screen
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => { setShowProfileMenu(false); onLogout(); }}
                  className="flex items-center gap-3 px-5 py-2 text-rose-600 hover:bg-rose-50 font-semibold"
                >
                  <span className="text-rose-500">🚪</span> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
