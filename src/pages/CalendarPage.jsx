import React, { useState } from 'react'
import { calendarEvents as initialEvents } from '../data/mockData'
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  CloseIcon,
} from '../icons/FlowerIcons'

export default function CalendarPage() {
  const [currentView, setCurrentView] = useState('Month')
  const [currentDate, setCurrentDate] = useState(new Date(2020, 8, 1))
  const [events, setEvents] = useState(initialEvents)
  const [activeFilters, setActiveFilters] = useState([
    'Important',
    'Meeting',
    'Event',
    'Work',
    'Other',
  ])
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDescription, setNewEventDescription] = useState('')
  const [newEventCategory, setNewEventCategory] = useState('Meeting')
  const [newEventDate, setNewEventDate] = useState('2020-09-08')
  const [newEventTime, setNewEventTime] = useState('10:00')
  const [newEventEndDate, setNewEventEndDate] = useState('2020-09-08')
  const [newEventEndTime, setNewEventEndTime] = useState('10:00')
  const [isAllDayEvent, setIsAllDayEvent] = useState(true)
  const [isRepeatingEvent, setIsRepeatingEvent] = useState(false)

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

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const calendarStart = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth(),
    1 - ((monthStart.getDay() + 6) % 7),
  )
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart)
    date.setDate(calendarStart.getDate() + index)
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return {
      day: date.getDate(),
      dateKey,
      hatched: date.getMonth() !== currentDate.getMonth(),
      isToday: date.toDateString() === new Date().toDateString(),
      events: events
        .filter((event) => {
          if (!activeFilters.includes(event.category)) return false
          if (event.repeat) {
            const eventDate = new Date(`${event.date}T00:00:00`)
            const repeatUntil = new Date(`${event.endDate || event.date}T23:59:59`)
            return date >= eventDate && date <= repeatUntil && date.getDay() === eventDate.getDay()
          }
          return dateKey >= event.date && dateKey <= (event.endDate || event.date)
        })
        .map((event) => {
          const categoryStyle = {
            Important: 'bg-rose-100 text-rose-800 border-l-4 border-rose-400',
            Meeting: 'bg-[#CCFBF1] text-[#0F766E]',
            Event: 'bg-[#DCFCE7] text-[#166534] border-l-4 border-[#22C55E]',
            Work: 'bg-[#FEF3C7] text-[#92400E] border-l-4 border-amber-400',
            Other: 'bg-slate-100 text-slate-700',
          }
          return {
            ...event,
            time: event.allDay ? 'All day' : event.endTime ? `${event.time} - ${event.endTime}` : event.time,
            bg: categoryStyle[event.category] || categoryStyle.Other,
          }
        }),
    }
  })

  const changeMonth = (offset) => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + offset, 1))
  }

  const saveEvent = () => {
    const eventTitle = newEventTitle.trim()
    if (!eventTitle || !newEventDate || !newEventEndDate || newEventEndDate < newEventDate) return

    setEvents((currentEvents) => [
      ...currentEvents,
      {
        id: Date.now(),
        title: eventTitle,
        description: newEventDescription.trim(),
        category: newEventCategory,
        date: newEventDate,
        endDate: newEventEndDate,
        time: isAllDayEvent ? '' : newEventTime,
        endTime: isAllDayEvent ? '' : newEventEndTime,
        allDay: isAllDayEvent,
        repeat: isRepeatingEvent,
      },
    ])
    setCurrentDate(new Date(`${newEventDate}T00:00:00`))
    setActiveFilters((filters) => filters.includes(newEventCategory) ? filters : [...filters, newEventCategory])
    setNewEventTitle('')
    setNewEventDescription('')
    setShowAddEventModal(false)
  }

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
                <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="p-1.5 hover:bg-white rounded-xl text-slate-600 transition">
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button onClick={() => changeMonth(1)} aria-label="Next month" className="p-1.5 hover:bg-white rounded-xl text-slate-600 transition">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 transition">
                Today
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              {currentDate.toLocaleDateString('en-US', { month: 'long' })}{' '}
              <span className="text-slate-400 font-normal">{currentDate.getFullYear()}</span>
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

          {/* Calendar Day Cells */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3 animate-fadeIn">
          <div className="relative w-full max-w-[300px] rounded-md border border-slate-200 bg-white px-4 py-3 shadow-xl">
            <button
              type="button"
              onClick={() => setShowAddEventModal(false)}
              aria-label="Close new event form"
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <h3 className="mb-4 text-lg font-semibold text-slate-800">New Event</h3>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                saveEvent()
              }}
              className="space-y-3.5"
            >
              <label className="block text-[10px] font-medium text-slate-400">
                Title
                <input
                  required
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Event title"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-[#16A34A]"
                />
              </label>

              <label className="block text-[10px] font-medium text-slate-400">
                Description
                <textarea
                  value={newEventDescription}
                  onChange={(event) => setNewEventDescription(event.target.value)}
                  placeholder="Add a description"
                  className="mt-1 min-h-[68px] w-full resize-y rounded-xl border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-[#16A34A]"
                />
              </label>

              <fieldset>
                <legend className="mb-1 text-[10px] font-medium text-slate-400">Time and Date</legend>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex min-w-0 overflow-hidden rounded-xl border border-slate-200 ${isAllDayEvent ? 'opacity-50' : ''}`}>
                    <input
                      aria-label="Event start time"
                      type="time"
                      required={!isAllDayEvent}
                      disabled={isAllDayEvent}
                      value={newEventTime}
                      onChange={(event) => setNewEventTime(event.target.value)}
                      className="min-w-0 w-[44%] border-r border-slate-200 px-1 py-2 text-[9px] text-slate-600 outline-none"
                    />
                    <input
                      aria-label="Event start date"
                      required
                      type="date"
                      value={newEventDate}
                      onChange={(event) => {
                        setNewEventDate(event.target.value)
                        if (newEventEndDate < event.target.value) setNewEventEndDate(event.target.value)
                      }}
                      className="min-w-0 w-[56%] px-1 py-2 text-[9px] text-slate-600 outline-none"
                    />
                  </div>
                  <div className={`flex min-w-0 overflow-hidden rounded-xl border border-slate-200 ${isAllDayEvent ? 'opacity-50' : ''}`}>
                    <input
                      aria-label="Event end time"
                      type="time"
                      required={!isAllDayEvent}
                      disabled={isAllDayEvent}
                      value={newEventEndTime}
                      onChange={(event) => setNewEventEndTime(event.target.value)}
                      className="min-w-0 w-[44%] border-r border-slate-200 px-1 py-2 text-[9px] text-slate-600 outline-none"
                    />
                    <input
                      aria-label="Event end date"
                      required
                      type="date"
                      min={newEventDate}
                      value={newEventEndDate}
                      onChange={(event) => setNewEventEndDate(event.target.value)}
                      className="min-w-0 w-[56%] px-1 py-2 text-[9px] text-slate-600 outline-none"
                    />
                  </div>
                </div>
              </fieldset>

              <div className="flex items-center gap-5">
                <label className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={isAllDayEvent}
                    onChange={(event) => setIsAllDayEvent(event.target.checked)}
                    className="h-3 w-3 accent-[#16A34A]"
                  />
                  All Day
                </label>
                <label className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={isRepeatingEvent}
                    onChange={(event) => setIsRepeatingEvent(event.target.checked)}
                    className="h-3 w-3 accent-[#16A34A]"
                  />
                  Repeat
                </label>
              </div>

              <label className="block text-[10px] font-medium text-slate-400">
                Calendar
                <span className="relative mt-1 block">
                  <span className={`pointer-events-none absolute left-2.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-sm ${
                    newEventCategory === 'Important' ? 'bg-rose-400' :
                      newEventCategory === 'Meeting' ? 'bg-teal-400' :
                        newEventCategory === 'Event' ? 'bg-green-500' :
                          newEventCategory === 'Work' ? 'bg-amber-400' : 'bg-slate-400'
                  }`} />
                  <select
                    value={newEventCategory}
                    onChange={(event) => setNewEventCategory(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-7 pr-3 text-[10px] text-slate-700 outline-none focus:border-[#16A34A]"
                  >
                    <option value="Important">Important</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Event">Event</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </span>
              </label>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="rounded-lg bg-[#16A34A] px-5 py-2 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#15803d]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
