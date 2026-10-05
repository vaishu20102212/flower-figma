import React, { useState } from 'react'
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  CloseIcon,
} from '../icons/FlowerIcons'

export default function CalendarPage() {
  const [currentView, setCurrentView] = useState('Month')
  const [activeFilters, setActiveFilters] = useState([
    'Important',
    'Meeting',
    'Event',
    'Work',
    'Other',
  ])
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventCategory, setNewEventCategory] = useState('Meeting')

  const categories = [
    { name: 'Important', color: 'bg-rose-500', ringColor: 'ring-rose-200' },
    { name: 'Meeting', color: 'bg-[#2DD4BF]', ringColor: 'ring-teal-200' },
    { name: 'Event', color: 'bg-[#22C55E]', ringColor: 'ring-green-200' },
    { name: 'Work', color: 'bg-amber-400', ringColor: 'ring-amber-200' },
    { name: 'Other', color: 'bg-slate-400', ringColor: 'ring-slate-200' },
  ]

  const toggleCategory = (catName) => {
    if (activeFilters.includes(catName)) {
      setActiveFilters(activeFilters.filter((c) => c !== catName))
    } else {
      setActiveFilters([...activeFilters, catName])
    }
  }

  // September 2020 Calendar days layout (Starting Monday Aug 31)
  const days = [
    { day: 30, isPrev: true, hatched: true },
    { day: 31, isPrev: true, hatched: true },
    {
      day: 1,
      events: [
        {
          title: 'Call Back Priscilla',
          time: '10:00',
          category: 'Meeting',
          colSpan: 2,
          bg: 'bg-[#CCFBF1] text-[#0F766E]',
        },
      ],
    },
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5 },

    { day: 6 },
    { day: 7 },
    {
      day: 8,
      isToday: true,
      events: [
        {
          title: 'Meeting with Judith',
          time: '10:00',
          category: 'Meeting',
          colSpan: 2,
          bg: 'bg-[#CCFBF1] text-[#0F766E]',
        },
        {
          title: 'Meeting...',
          time: '10:00',
          category: 'Meeting',
          colSpan: 1,
          bg: 'bg-[#99F6E4] text-[#115E59]',
        },
      ],
    },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12 },

    { day: 13 },
    {
      day: 14,
      events: [
        {
          title: 'Project "Rocket"',
          time: '10:00',
          badge: '+5',
          category: 'Work',
          colSpan: 3,
          bg: 'bg-[#FEF3C7] text-[#92400E] border-l-4 border-amber-400',
        },
      ],
    },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },

    { day: 20 },
    { day: 21 },
    { day: 22 },
    {
      day: 23,
      events: [
        {
          title: 'Presentation',
          time: '10:00',
          category: 'Event',
          colSpan: 3,
          bg: 'bg-[#DCFCE7] text-[#166534] border-l-4 border-[#22C55E]',
        },
        {
          title: 'Presentation',
          time: '10:00',
          category: 'Event',
          colSpan: 2,
          bg: 'bg-[#DCFCE7] text-[#166534] border-l-4 border-[#22C55E]',
        },
      ],
    },
    { day: 24 },
    { day: 25 },
    { day: 26 },

    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 1, isNext: true, hatched: true },
    { day: 2, isNext: true, hatched: true },
    { day: 3, isNext: true, hatched: true },
  ]

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Calendar
        </h1>

        <button
          onClick={() => setShowAddEventModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm transition self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Main Container with Left Category Filters & Right Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Category Filters (Col span 3) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-card border border-slate-100 h-fit space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Calendars
            </h4>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const isChecked = activeFilters.includes(cat.name)
              return (
                <div
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center transition ${
                      isChecked ? cat.color + ' text-white' : 'border border-slate-300'
                    }`}
                  >
                    {isChecked && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                    {cat.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Calendar Grid Shell (Col span 9) */}
        <div className="lg:col-span-9 bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-6">
          {/* Top Month Controls & View Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-1">
                <button className="p-1.5 hover:bg-white rounded-xl text-slate-600 transition">
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-xl text-slate-600 transition">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
              <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 transition">
                Today
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              September <span className="text-slate-400 font-normal">2020</span>
            </h3>

            {/* View switcher pills */}
            <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200/80">
              {['Month', 'Week', 'Day'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentView === view
                      ? 'bg-[#16A34A] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-slate-100 pb-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
            <span>Saturday</span>
            <span>Sunday</span>
          </div>

          {/* 35 Calendar Day Cells */}
          <div className="grid grid-cols-7 border border-slate-100 rounded-2xl overflow-hidden divide-x divide-y divide-slate-100 bg-white">
            {days.map((item, index) => (
              <div
                key={index}
                className={`min-h-[90px] md:min-h-[110px] p-2 relative flex flex-col justify-between ${
                  item.hatched
                    ? 'bg-[repeating-linear-gradient(45deg,#f8fafc,#f8fafc_10px,#f1f5f9_10px,#f1f5f9_20px)] opacity-60 text-slate-300'
                    : 'bg-white hover:bg-slate-50/50 transition'
                }`}
              >
                {/* Day number badge */}
                <div className="flex justify-end">
                  {item.isToday ? (
                    <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {item.day}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-bold ${
                        item.hatched ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {item.day}
                    </span>
                  )}
                </div>

                {/* Event Bars */}
                {item.events && (
                  <div className="space-y-1 mt-1">
                    {item.events.map((ev, evIdx) => (
                      <div
                        key={evIdx}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center justify-between truncate shadow-xs ${ev.bg}`}
                        style={{
                          width: ev.colSpan > 1 ? `${ev.colSpan * 95}%` : '100%',
                          zIndex: 10,
                        }}
                      >
                        <span className="truncate">{ev.title}</span>
                        <div className="flex items-center gap-1 opacity-80 text-[9px] font-medium ml-1">
                          <span>{ev.time}</span>
                          {ev.badge && (
                            <span className="bg-amber-500/20 px-1 rounded text-amber-900 font-bold">
                              {ev.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowAddEventModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Event</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Design Sync Meeting"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Category
                </label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                >
                  <option value="Meeting">Meeting (Teal)</option>
                  <option value="Important">Important (Red)</option>
                  <option value="Event">Event (Green)</option>
                  <option value="Work">Work (Yellow)</option>
                  <option value="Other">Other (Gray)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    defaultValue="2020-09-08"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    defaultValue="10:00"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Event "${newEventTitle || 'New Event'}" added to calendar!`)
                  setShowAddEventModal(false)
                }}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs rounded-2xl shadow-sm transition mt-2"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
