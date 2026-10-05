import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FlowerLogo,
  SearchIcon,
  DashboardIcon,
  TaskIcon,
  ShoppingBagIcon,
  CalendarIcon,
  MailIcon,
  ChatIcon,
  ProjectIcon,
  FolderIcon,
  NotesIcon,
  ContactsIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
} from '../../icons/FlowerIcons'

export default function Sidebar({ isOpen, onClose, focusSearchRequest, profile }) {
  const location = useLocation()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [ecommerceOpen, setEcommerceOpen] = useState(
    location.pathname.startsWith('/ecommerce') || location.pathname === '/products' || location.pathname === '/orders' || location.pathname === '/customers'
  )

  useEffect(() => {
    if (focusSearchRequest > 0) {
      searchInputRef.current?.focus()
      setSearchOpen(true)
    }
  }, [focusSearchRequest])

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: DashboardIcon,
    },
    {
      name: 'Task',
      path: '/tasks',
      icon: TaskIcon,
    },
    {
      name: 'E-Commerce',
      isDropdown: true,
      icon: ShoppingBagIcon,
      isOpen: ecommerceOpen,
      setIsOpen: setEcommerceOpen,
      subItems: [
        { name: 'Products', path: '/products' },
        { name: 'Orders', path: '/orders' },
        { name: 'Customers', path: '/customers' },
      ],
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: CalendarIcon,
    },
    {
      name: 'Mail',
      path: '/mail',
      icon: MailIcon,
      badge: 8,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      name: 'Chat',
      path: '/chat',
      icon: ChatIcon,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: ProjectIcon,
    },
    {
      name: 'File Manager',
      path: '/files',
      icon: FolderIcon,
    },
    {
      name: 'Notes',
      path: '/notes',
      icon: NotesIcon,
    },
    {
      name: 'Contacts',
      path: '/contacts',
      icon: ContactsIcon,
    },
  ]

  const isEcomActive =
    location.pathname.startsWith('/ecommerce') ||
    location.pathname === '/products' ||
    location.pathname === '/orders' ||
    location.pathname === '/customers'
  const searchableItems = navItems.flatMap((item) =>
    item.path ? [{ name: item.name, path: item.path }] : item.subItems || []
  )
  const searchResults = searchableItems
    .filter((item) => item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .slice(0, 8)

  const selectSearchResult = (path) => {
    navigate(path)
    setSearchQuery('')
    setSearchOpen(false)
    onClose()
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-50">
          <NavLink to="/" className="flex items-center gap-3 group">
            <FlowerLogo className="w-8 h-8 transition-transform group-hover:rotate-12 duration-300" />
            <span className="font-extrabold text-xl tracking-wider text-slate-800 uppercase">
              FLOWER
            </span>
          </NavLink>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search */}
        <div className="px-5 pt-5 pb-3">
          <div
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setSearchOpen(false)
              }
            }}
          >
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search anything"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setSearchOpen(false)
                } else if (event.key === 'Enter' && searchResults[0]) {
                  selectSearchResult(searchResults[0].path)
                }
              }}
              aria-label="Search pages"
              aria-expanded={searchOpen}
              aria-controls="sidebar-search-results"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/70 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-flower-pill/80 focus:border-transparent transition-all"
            />
            {searchOpen && (
              <div
                id="sidebar-search-results"
                role="listbox"
                aria-label="Search results"
                className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.path}
                      type="button"
                      role="option"
                      aria-selected="false"
                      onClick={() => selectSearchResult(result.path)}
                      className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-[#F0FCE7] hover:text-[#14532D]"
                    >
                      {result.name}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-slate-400">No pages found</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>

          {navItems.map((item) => {
            if (item.isDropdown) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => item.setIsOpen(!item.isOpen)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isEcomActive
                        ? 'bg-[#B4F481] text-[#14532D] shadow-sm font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${isEcomActive ? 'text-[#14532D]' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.isOpen ? (
                      <ChevronDownIcon className="w-4 h-4 opacity-70" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 opacity-70" />
                    )}
                  </button>

                  {item.isOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-1 border-l-2 border-slate-100 ml-4">
                      {item.subItems.map((sub) => {
                        const isSubActive = location.pathname === sub.path
                        return (
                          <NavLink
                            key={sub.name}
                            to={sub.path}
                            onClick={onClose}
                            className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              isSubActive
                                ? 'bg-slate-100 text-slate-900 font-bold'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            • {sub.name}
                          </NavLink>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#B4F481] text-[#14532D] shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#14532D]' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-red-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer">
            <img
              src={profile.picture || '/user-avatar.png'}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{profile.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{profile.role}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </aside>
    </>
  )
}
