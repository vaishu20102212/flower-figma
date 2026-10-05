import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  recentOrders,
  recentTransactions,
} from '../data/mockData'
import {
  DownloadIcon,
  ChevronDownIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  SendIcon,
  CloseIcon,
} from '../icons/FlowerIcons'

export default function Dashboard() {
  const outletCtx = useOutletContext()
  // Active Dashboard Sub-View: 'overview' (Activity) | 'social' (Settings) | 'finance' (Users)
  const activeDashboardView =
    outletCtx?.headerTab === 'activity'
      ? 'overview'
      : outletCtx?.headerTab === 'users'
      ? 'finance'
      : 'social'

  const [selectedRange] = useState('Last 7 days')
  const [hoveredBar, setHoveredBar] = useState(2) // default Wed
  const [hoveredFinanceBar, setHoveredFinanceBar] = useState(4)
  const [hoveredAnalyticsPoint, setHoveredAnalyticsPoint] = useState(3)
  const [isSocialChatOpen, setIsSocialChatOpen] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)

  const handleSwitchDashboard = (viewKey) => {
    if (outletCtx?.setHeaderTab) {
      if (viewKey === 'social') outletCtx.setHeaderTab('settings')
      else if (viewKey === 'overview') outletCtx.setHeaderTab('activity')
      else if (viewKey === 'finance') outletCtx.setHeaderTab('users')
    }
  }

  // Social chat messages
  const [socialChatMessages, setSocialChatMessages] = useState([
    { id: 1, sender: 'them', text: 'Lorem ipsum dolor sit ame?', time: '09:45am', avatar: '/user-avatar.png' },
    { id: 2, sender: 'me', text: 'Consectetur adipiscing elit. Turpis risus commodo sed viverra. 😳', time: '09:47am' },
    { id: 3, sender: 'them', text: 'Sollicitudin don posuere pharetra.', time: '09:48am', avatar: '/user-avatar.png' },
    { id: 4, sender: 'me', text: 'Laoreet in elementum nisl, ultrices.', time: '09:47am' },
    { id: 5, sender: 'them', text: 'Posuere scelerisque elit duis in. Sapien proin lectus tincidunt.', time: '09:45am', isDateDivider: 'MONDAY', avatar: '/user-avatar.png' },
    { id: 6, sender: 'me', text: 'Eget cursus bibenum amet donec.', time: '09:47am' },
    { id: 7, sender: 'them', text: 'Tellus accumsan, est arcu purus lacus amet. 🤓', time: '09:48am', avatar: '/user-avatar.png' },
    { id: 8, sender: 'me', text: 'Quam consectetur est suspendise facilisis in viverra laoreet...', time: '09:47am' },
  ])
  const [chatInput, setChatInput] = useState('')

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    setSocialChatMessages([
      ...socialChatMessages,
      { id: Date.now(), sender: 'me', text: chatInput, time: 'Just now' }
    ])
    setChatInput('')
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn relative">
      {/* Top Level Sub-Dashboard Switcher Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-3 md:p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 whitespace-nowrap">
            Dashboard Style:
          </span>
          <button
            onClick={() => handleSwitchDashboard('overview')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDashboardView === 'overview'
                ? 'bg-[#16A34A] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Activity (Sales & Analytics)</span>
          </button>

          <button
            onClick={() => handleSwitchDashboard('social')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDashboardView === 'social'
                ? 'bg-[#16A34A] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Settings (Profile & Social)</span>
          </button>

          <button
            onClick={() => handleSwitchDashboard('finance')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDashboardView === 'finance'
                ? 'bg-[#16A34A] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Users (Finance & Cards)</span>
          </button>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          {/* Download Report Button */}
          <button
            title="Download Report"
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl border border-slate-200/80 shadow-sm transition"
          >
            <DownloadIcon className="w-4 h-4" />
          </button>

          {/* Date Filter Pill Dropdown */}
          <div className="relative inline-block">
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-2xl border border-slate-200/80 shadow-sm transition">
              <span>{selectedRange}</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SALES & ANALYTICS OVERVIEW DASHBOARD (Screenshot 122122)               */}
      {/* ========================================================================= */}
      {activeDashboardView === 'overview' && (
        <div className="space-y-6">
          {/* Row 1: KPI Top 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Income */}
            <div className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between border border-slate-100">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Total Income</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800">
                    $8.500
                  </h3>
                  <span className="text-xs font-bold text-emerald-500 flex items-center">
                    ↑ 50.8%
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#2DD4BF] text-2xl font-black shadow-sm">
                $
              </div>
            </div>

            {/* Total Sales */}
            <div className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between border border-slate-100">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Total Sales</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800">
                    3.500K
                  </h3>
                  <span className="text-xs font-bold text-rose-500 flex items-center">
                    ↑ 10.5%
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#2DD4BF] shadow-sm">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="12" width="4" height="8" rx="1" />
                  <rect x="10" y="8" width="4" height="12" rx="1" />
                  <rect x="17" y="4" width="4" height="16" rx="1" />
                </svg>
              </div>
            </div>

            {/* New Clients */}
            <div className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between border border-slate-100">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">New Clients</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800">
                    2.500K
                  </h3>
                  <span className="text-xs font-bold text-emerald-500 flex items-center">
                    ↑ 24.9%
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#2DD4BF] shadow-sm">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2: Dual Bar Chart & Spline Analytics Curve Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Statistics Stacked Bar Chart */}
            <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-card flex flex-col justify-between">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Statistics</h3>
                <button className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                  <CalendarIcon className="h-4 w-4 text-slate-700" />
                  <span>19 Aug – 25 Aug</span>
                  <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>

              {/* Chart Body */}
              <div className="relative flex gap-3 h-56 pt-6">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-right text-xs text-slate-400 font-normal pr-1 w-7 pb-6">
                  <span>400</span>
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                </div>

                {/* Grid & Bars Container */}
                <div className="relative flex-1 flex flex-col justify-between pb-6">
                  {/* Faint Horizontal Gridlines */}
                  <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none pb-6">
                    <div className="w-full border-b border-slate-100" />
                    <div className="w-full border-b border-slate-100" />
                    <div className="w-full border-b border-slate-100" />
                    <div className="w-full border-b border-slate-100" />
                    <div className="w-full border-b border-slate-100" />
                  </div>

                  {/* Columns for 7 Days */}
                  <div className="relative z-10 grid grid-cols-7 h-full items-end">
                    {[
                      { day: 'Mon', income: 190, expense: 150, date: '21 August, 2020', incomeVal: '2.500', expenseVal: '1.200' },
                      { day: 'Tue', income: 110, expense: 150, date: '22 August, 2020', incomeVal: '1.800', expenseVal: '1.500' },
                      { day: 'Wed', income: 250, expense: 130, date: '23 August, 2020', incomeVal: '2.500', expenseVal: '1.200', active: true },
                      { day: 'Thu', income: 190, expense: 70,  date: '24 August, 2020', incomeVal: '2.100', expenseVal: '800' },
                      { day: 'Fri', income: 205, expense: 160, date: '25 August, 2020', incomeVal: '2.700', expenseVal: '1.600' },
                      { day: 'Sat', income: 180, expense: 145, date: '26 August, 2020', incomeVal: '2.400', expenseVal: '1.450' },
                      { day: 'Sun', income: 155, expense: 65,  date: '27 August, 2020', incomeVal: '1.900', expenseVal: '750' },
                    ].map((item, idx) => {
                      const isHovered = hoveredBar === idx || (hoveredBar === null && item.active)
                      const totalVal = item.income + item.expense
                      const incomeHeight = (item.income / 400) * 100
                      const expenseHeight = (item.expense / 400) * 100

                      return (
                        <div
                          key={item.day}
                          className="relative flex flex-col items-center justify-end h-full group cursor-pointer"
                          onMouseEnter={() => setHoveredBar(idx)}
                          onMouseLeave={() => setHoveredBar(2)}
                        >
                          {/* Floating Tooltip Card */}
                          {isHovered && (
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-fadeIn pointer-events-none">
                              <div className="bg-white rounded-2xl shadow-xl border border-slate-100/90 px-3.5 py-1.5 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2.5 text-xs font-bold text-slate-800">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#1E8A38]" />
                                    <span>{item.incomeVal}</span>
                                  </span>
                                  <span className="text-slate-300 font-light">|</span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#36C6A0]" />
                                    <span>{item.expenseVal}</span>
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                                  {item.date}
                                </div>
                              </div>
                              <div className="w-2.5 h-2.5 bg-white rotate-45 -mt-1.5 border-r border-b border-slate-100/90 shadow-sm" />
                            </div>
                          )}

                          {/* Stacked Pill Bar (Top: Expense Teal, Bottom: Income Green) */}
                          <div
                            className="relative w-4 sm:w-4.5 rounded-full overflow-hidden flex flex-col justify-end transition-all duration-200 group-hover:brightness-105"
                            style={{ height: `${((totalVal) / 400) * 100}%` }}
                          >
                            {/* Expense segment (Teal) */}
                            <div
                              className="w-full bg-[#36C6A0]"
                              style={{ height: `${(expenseHeight / ((totalVal) / 400 * 100)) * 100}%` }}
                            />
                            {/* Income segment (Green) */}
                            <div
                              className="w-full bg-[#1E8A38]"
                              style={{ height: `${(incomeHeight / ((totalVal) / 400 * 100)) * 100}%` }}
                            />
                          </div>

                          {/* X-Axis Day Label */}
                          <span className="absolute -bottom-6 text-xs text-slate-400 font-normal">
                            {item.day}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Right Legend */}
              <div className="mt-6 flex items-center justify-end gap-6 text-xs text-slate-500 font-normal">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E8A38]" />
                  <span>Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#36C6A0]" />
                  <span>Expense</span>
                </div>
              </div>
            </div>

            {/* Analytics Area Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800">Analytics</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-2 rounded-2xl border border-slate-200/80 shadow-sm">
                    <CalendarIcon className="w-4 h-4 text-slate-700" />
                    <span>19 Aug – 25 Aug</span>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Stat figures */}
              <div className="flex items-center gap-8 mb-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-bold text-emerald-600">↑</span>
                  <div>
                    <span className="text-lg font-medium text-slate-700">$5.850</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl font-bold text-teal-500">↓</span>
                  <div>
                    <span className="text-lg font-medium text-slate-700">$1.750</span>
                  </div>
                </div>
              </div>

              {/* Screenshot-matched straight-line area chart */}
              <div className="relative h-64 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 560 250" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="analyticsGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A34A" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity="0.12" />
                    </linearGradient>
                    <linearGradient id="analyticsTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.10" />
                    </linearGradient>
                  </defs>

                  {[16, 104, 192, 280, 368, 456, 544].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x} y2="210" stroke="#E2E8F0" strokeWidth="1" />
                  ))}
                  <line x1="16" y1="210" x2="544" y2="210" stroke="#CBD5E1" strokeWidth="1" />

                  {/* Green series */}
                  <path
                    d="M 16 210 L 104 141 L 192 159 L 280 86 L 368 140 L 456 42 L 544 18 L 544 210 Z"
                    fill="url(#analyticsGreen)"
                  />
                  <path
                    d="M 16 210 L 104 141 L 192 159 L 280 86 L 368 140 L 456 42 L 544 18"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="2.25"
                  />

                  {/* Teal series */}
                  <path
                    d="M 16 210 L 104 170 L 192 123 L 280 168 L 368 100 L 456 138 L 544 162 L 544 210 Z"
                    fill="url(#analyticsTeal)"
                  />
                  <path
                    d="M 16 210 L 104 170 L 192 123 L 280 168 L 368 100 L 456 138 L 544 162"
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="2.25"
                  />

                  {[['16', '210'], ['104', '170'], ['192', '123'], ['280', '168'], ['368', '100'], ['456', '138'], ['544', '162']].map(([cx, cy], index) => (
                    <circle key={`teal-${cx}`} cx={cx} cy={cy} r="4" fill="#FFFFFF" stroke="#2DD4BF" strokeWidth="2" onMouseEnter={() => setHoveredAnalyticsPoint(index)} />
                  ))}
                  {[['16', '210'], ['104', '141'], ['192', '159'], ['280', '86'], ['368', '140'], ['456', '42'], ['544', '18']].map(([cx, cy], index) => (
                    <circle key={`green-${cx}`} cx={cx} cy={cy} r={index === hoveredAnalyticsPoint ? '5' : '4'} fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" onMouseEnter={() => setHoveredAnalyticsPoint(index)} />
                  ))}
                </svg>

                {/* Pin Tooltip */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white px-7 py-3 rounded-2xl shadow-lg border border-slate-100 text-center">
                  <p className="text-xs font-bold text-slate-800">$1.000</p>
                  <p className="text-sm text-slate-400">22 August, 2019</p>
                </div>
              </div>

              {/* Days X Axis */}
              <div className="flex justify-between px-2 pt-2 text-sm text-slate-400 font-medium">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Row 3: Sales Gauge Donut & Bidirectional Horizontal Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Gauge Donut */}
            <div className="min-h-[252px] bg-white rounded-md p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Sales</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontalIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Donut Chart */}
              <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="9" />
                  {/* Green Segment (Current Week) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#16A34A"
                    strokeWidth="9"
                    strokeDasharray="150 101.2"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Teal Segment (Last Week) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#2DD4BF"
                    strokeWidth="9"
                    strokeDasharray="85 166.2"
                    strokeDashoffset="-158"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute text-center">
                  <span className="text-lg font-extrabold text-slate-700">3.500</span>
                  <p className="text-[9px] text-slate-400 font-medium">Total</p>
                </div>
              </div>

              {/* Donut Breakdown */}
              <div className="space-y-2 border-t border-slate-100 pt-2 text-[9px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span className="text-slate-500">Current Week</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">2.500</span>
                    <span className="text-emerald-500 font-bold">↑ 8.8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="text-slate-500">Last Week</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">1.000</span>
                    <span className="text-rose-500 font-bold">↓ 5.8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidirectional Horizontal Statistics (Income vs Expense) */}
            <div className="lg:col-span-2 min-w-0 overflow-hidden bg-white rounded-[28px] p-6 shadow-card border border-slate-100 flex flex-col justify-between">
              {/* Header with Title, Center Legend, and Date Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Statistics</h3>

                {/* Center Legend */}
                <div className="flex items-center gap-6 text-xs text-slate-500 font-normal">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E8A38]" />
                    <span>Income</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#36C6A0]" />
                    <span>Expense</span>
                  </span>
                </div>

                {/* Date Dropdown */}
                <button className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition self-start sm:self-auto">
                  <CalendarIcon className="h-4 w-4 text-slate-700" />
                  <span>19 Aug – 25 Aug</span>
                  <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>

              {/* Chart Grid with Y-Axis and Horizontal Diverging Bars */}
              <div className="relative my-auto py-2">
                <div className="flex gap-4">
                  {/* Y-Axis (25 down to 19) */}
                  <div className="flex flex-col justify-between text-right text-xs text-slate-400 font-normal w-5 py-1">
                    {['25', '24', '23', '22', '21', '20', '19'].map((d) => (
                      <span key={d} className="h-5 flex items-center justify-end">{d}</span>
                    ))}
                  </div>

                  {/* Main Grid Area */}
                  <div className="relative flex-1">
                    {/* 9 Vertical Faint Gridlines */}
                    <div className="pointer-events-none absolute inset-0 flex justify-between">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
                        <span key={line} className="border-l border-slate-100 h-full" />
                      ))}
                    </div>

                    {/* Horizontal Diverging Bars */}
                    <div className="relative z-10 space-y-2 py-1">
                      {[
                        { date: '25', income: 50,  expense: 95,  incomeVal: '800',   expenseVal: '1.400' },
                        { date: '24', income: 160, expense: 155, incomeVal: '2.500', expenseVal: '1.200', active: true },
                        { date: '23', income: 210, expense: 200, incomeVal: '2.900', expenseVal: '2.400' },
                        { date: '22', income: 320, expense: 160, incomeVal: '3.800', expenseVal: '1.800' },
                        { date: '21', income: 145, expense: 285, incomeVal: '1.700', expenseVal: '3.100' },
                        { date: '20', income: 245, expense: 170, incomeVal: '3.200', expenseVal: '2.000' },
                        { date: '19', income: 120, expense: 95,  incomeVal: '1.500', expenseVal: '1.100' },
                      ].map((row) => (
                        <div key={row.date} className="relative flex items-center h-5">
                          <div className="relative flex h-full flex-1 items-center justify-center">
                            {/* Left Green Bar (Income) */}
                            <div className="flex w-1/2 justify-end">
                              <div
                                style={{ width: `${(row.income / 400) * 100}%` }}
                                className="h-3.5 rounded-l-full bg-[#1E8A38] transition-all duration-300 hover:brightness-105"
                              />
                            </div>

                            {/* Right Teal Bar (Expense) */}
                            <div className="flex w-1/2 justify-start">
                              <div
                                style={{ width: `${(row.expense / 400) * 100}%` }}
                                className="h-3.5 rounded-r-full bg-[#36C6A0] transition-all duration-300 hover:brightness-105"
                              />
                            </div>

                            {/* Floating Active Tooltip (on row 24) */}
                            {row.active && (
                              <div className="absolute left-[68%] sm:left-[70%] top-1/2 -translate-y-1/2 z-20 flex items-center gap-3 bg-white rounded-2xl shadow-xl border border-slate-100/90 px-3.5 py-1.5 text-xs font-bold text-slate-800 whitespace-nowrap animate-fadeIn pointer-events-none">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-[#1E8A38]" />
                                  <span>{row.incomeVal}</span>
                                </span>
                                <span className="text-slate-300 font-light">|</span>
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-[#36C6A0]" />
                                  <span>{row.expenseVal}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Horizontal Axis Scale */}
              <div className="pl-9 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-9 text-center text-xs text-slate-400 font-normal">
                  <span>400</span>
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                  <span>-100</span>
                  <span>-200</span>
                  <span>-300</span>
                  <span>-400</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Last Orders Table & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Last Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-card border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800">Last Orders</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
                  <span>19 Aug – 25 Aug</span>
                  <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 pb-2">
                      <th className="pb-3 font-semibold">Customer Name</th>
                      <th className="pb-3 font-semibold">Order No.</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Payment Type</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 font-medium text-slate-800 flex items-center gap-2.5">
                          <img
                            src={order.avatar}
                            alt={order.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span>{order.name}</span>
                        </td>
                        <td className="py-3 text-slate-400">{order.orderNo}</td>
                        <td className="py-3 font-semibold text-slate-800">{order.amount}</td>
                        <td className="py-3 text-slate-500">{order.paymentType}</td>
                        <td className="py-3 text-slate-400">{order.date}</td>
                        <td className="py-3 text-right">
                          <button className="text-slate-400 hover:text-slate-600">
                            <MoreVerticalIcon className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transactions Timeline */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800">Transactions</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontalIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={tx.avatar}
                        alt={tx.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{tx.name}</p>
                        <p className="text-[10px] text-slate-400">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {tx.amount}
                      </p>
                      <p className="text-[10px] text-slate-400">{tx.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SOCIAL & PROFILE OVERVIEW DASHBOARD (Screenshots 122149 & 122209)       */}
      {/* ========================================================================= */}
      {activeDashboardView === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: User Profile & Favorites Sidebar Card */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-6">
            <div className="text-center">
              <img
                src="/user-avatar.png"
                alt="Felecia Brown"
                className="w-24 h-24 rounded-3xl object-cover mx-auto shadow-md border-2 border-emerald-500/20"
              />
              <h3 className="text-base font-bold text-slate-800 mt-3">Felecia Brown</h3>
              <p className="text-xs text-slate-400 font-medium">Project Manager</p>
              <button className="mt-3 px-6 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-2xl shadow-md transition">
                Edit profile
              </button>
            </div>

            {/* Info section */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                INFO
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Email</p>
                <p className="text-xs font-medium text-slate-700">example@mail.com</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Phone</p>
                <p className="text-xs font-medium text-slate-700">+123-4567-8800</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Birthday</p>
                <p className="text-xs font-medium text-slate-700">17 March, 1995</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Location</p>
                <p className="text-xs font-medium text-slate-700">New York, NY</p>
              </div>
            </div>

            {/* Favorites List */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                FAVORITES
              </span>
              {[
                { name: 'Ronald Robertson', role: 'Product Designer', avatar: '/user-avatar.png' },
                { name: 'Regina Cooper', role: 'Project Manager', avatar: '/user-avatar.png' },
                { name: 'Judith Black', role: 'Business Analyst', avatar: '/user-avatar.png' },
                { name: 'Dustin Williamson', role: 'Web Developer', avatar: '/user-avatar.png' },
                { name: 'Calvin Flores', role: 'Senior Vice President', avatar: '/user-avatar.png' },
              ].map((fav) => (
                <div key={fav.name} className="flex items-center gap-3">
                  <img src={fav.avatar} alt={fav.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{fav.name}</p>
                    <p className="text-[10px] text-slate-400">{fav.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Main Social Analytics & Followers */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl shadow-card border border-slate-100 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold">↑</div>
                <div>
                  <p className="text-[11px] text-slate-400">Total Visitors</p>
                  <p className="text-lg font-extrabold text-slate-800">20.500 <span className="text-[10px] text-emerald-500 font-bold">↑ 4.85%</span></p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-card border border-slate-100 flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-2xl font-bold">↓</div>
                <div>
                  <p className="text-[11px] text-slate-400">Total Followers</p>
                  <p className="text-lg font-extrabold text-slate-800">21.800 <span className="text-[10px] text-rose-500 font-bold">↓ 5.25%</span></p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-card border border-slate-100 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold">↑</div>
                <div>
                  <p className="text-[11px] text-slate-400">Total Likes</p>
                  <p className="text-lg font-extrabold text-slate-800">30.400 <span className="text-[10px] text-emerald-500 font-bold">↑ 3.55%</span></p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-card border border-slate-100 flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl font-bold">↓</div>
                <div>
                  <p className="text-[11px] text-slate-400">Total Comments</p>
                  <p className="text-lg font-extrabold text-slate-800">14.800 <span className="text-[10px] text-rose-500 font-bold">↓ 10.30%</span></p>
                </div>
              </div>
            </div>

            {/* Visits Spline Chart & Followers Donut */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Visits Spline */}
              <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-card border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800">Visits</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
                    <span>19 Aug – 25 Aug</span>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold">↓</span>
                    <div>
                      <span className="text-xs font-bold text-slate-800">1.400</span>
                      <span className="text-[10px] text-slate-400 ml-1">Min. Visits</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold">-</span>
                    <div>
                      <span className="text-xs font-bold text-slate-800">3.100</span>
                      <span className="text-[10px] text-slate-400 ml-1">Avg. Visits</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">↑</span>
                    <div>
                      <span className="text-xs font-bold text-slate-800">9.500</span>
                      <span className="text-[10px] text-slate-400 ml-1">Max. Visits</span>
                    </div>
                  </div>
                </div>

                {/* Screenshot-matched Visits line chart */}
                <div className="relative h-44 w-full">
                  <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                    {[0, 40, 80, 120, 160].map((y) => (
                      <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#E2E8F0" strokeWidth="1" />
                    ))}
                    <path
                      d="M 0 110 L 83 132 L 166 94 L 249 128 L 332 110 L 415 42 L 500 110 L 500 160 L 0 160 Z"
                      fill="#16A34A"
                      fillOpacity="0.08"
                    />
                    <path
                      d="M 0 110 L 83 132 L 166 94 L 249 128 L 332 110 L 415 42 L 500 110"
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="2"
                    />
                    {[[0, 110], [83, 132], [166, 94], [249, 128], [332, 110], [415, 42], [500, 110]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" />
                    ))}
                  </svg>
                  <div className="absolute top-4 left-1/3 bg-white px-3 py-2 rounded-xl shadow-md border border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-800">Visitors: 3.100</p>
                    <p className="text-[10px] text-slate-400">21 August, 2019</p>
                  </div>
                </div>
              </div>

              {/* Followers Channels Donut */}
              <div className="min-h-[252px] bg-white rounded-md p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">Followers</h3>
                  <button className="text-slate-400"><MoreHorizontalIcon className="w-5 h-5" /></button>
                </div>

                <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#E2E8F0" strokeWidth="8" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#16A34A" strokeWidth="8" strokeDasharray="112 126" strokeDashoffset="0" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="8" strokeDasharray="22 216" strokeDashoffset="-112" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F87171" strokeWidth="8" strokeDasharray="32 206" strokeDashoffset="-140" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#2DD4BF" strokeWidth="8" strokeDasharray="58 180" strokeDashoffset="-178" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-lg font-extrabold text-slate-700">21.800</span>
                    <p className="text-[9px] text-slate-400">Total</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-2 text-[9px] text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-400" /> Facebook 3.5k</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Twitter 7.8k</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600" /> Instagram 5.8k</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> YouTube 4.7k</span>
                </div>
              </div>
            </div>

            {/* Followers Growth & New Followers Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Followers Growth Bar */}
              <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800">Followers Growth</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
                    <span>19 Aug – 25 Aug</span>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">↑</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">21.800</p>
                      <p className="text-[10px] text-slate-400">Current Week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold">↓</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">19.400</p>
                      <p className="text-[10px] text-slate-400">Last Week</p>
                    </div>
                  </div>
                </div>

                {/* Vertical Bar Chart */}
                <div className="relative h-40 px-4">
                  <div className="pointer-events-none absolute inset-x-4 top-0 bottom-6 flex flex-col justify-between">
                    <span className="border-t border-slate-100" />
                    <span className="border-t border-slate-100" />
                    <span className="border-t border-slate-100" />
                    <span className="border-t border-slate-200" />
                  </div>
                  <div className="relative flex h-full items-end justify-between border-b border-slate-200 pb-2">
                  {[
                    { day: 'Mon', val: 70, active: true },
                    { day: 'Tue', val: 30, active: false },
                    { day: 'Wed', val: 65, active: true },
                    { day: 'Thu', val: 55, active: false },
                    { day: 'Fri', val: 60, active: true },
                    { day: 'Sat', val: 90, active: true, badge: '★' },
                    { day: 'Sun', val: 40, active: false },
                  ].map((b) => (
                    <div key={b.day} className="flex h-full flex-col items-center justify-end gap-1">
                      <div className="flex h-32 w-5 items-end">
                        <div
                          style={{ height: `${b.val}%` }}
                          className={`w-full rounded-full transition-all flex items-start justify-center pt-1 ${
                            b.active ? 'bg-[#16A34A]' : 'bg-[#D1FAE5]'
                          }`}
                        >
                          {b.badge && <span className="text-[8px] text-white font-bold">{b.badge}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{b.day}</span>
                    </div>
                  ))}
                  </div>
                </div>
              </div>

              {/* New Followers List with Follow Button & Live Chat Drawer Toggle */}
              <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800">New Followers</h3>
                  <button
                    onClick={() => setIsSocialChatOpen(!isSocialChatOpen)}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>💬 Open Chat Drawer</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Devon Williamson', role: 'Product Designer, Apple Inc', avatar: '/user-avatar.png' },
                    { name: 'Debra Wilson', role: 'Project Manager, Facebook Inc', avatar: '/user-avatar.png' },
                    { name: 'Judith Black', role: 'Business Analyst, Google Inc', avatar: '/user-avatar.png' },
                    { name: 'Philip Henry', role: 'Web Developer, Google Inc', avatar: '/user-avatar.png' },
                    { name: 'Mitchell Cooper', role: 'Senior Vice President, Amazon Inc', avatar: '/user-avatar.png' },
                  ].map((usr) => (
                    <div key={usr.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{usr.name}</p>
                          <p className="text-[10px] text-slate-400">{usr.role}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 text-xs font-semibold rounded-xl transition">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FINANCE & CARDS OVERVIEW DASHBOARD (Dashboard #3)                       */}
      {/* ========================================================================= */}
      {activeDashboardView === 'finance' && (
        <div className="space-y-6">
          {/* Top 3 KPI Sparkline Combined Card (Unified Card with Dividers) */}
          <div className="bg-white rounded-[28px] p-6 shadow-card border border-slate-100 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* 1. Total Income */}
            <div className="flex items-center justify-between px-2 md:px-5 py-2 md:py-0 first:pl-0">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Total Income</p>
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800">$8.500</h3>
                  <span className="text-xs font-medium text-emerald-500">↑ 50.8%</span>
                </div>
              </div>
              <div className="w-28 h-12 relative flex items-center justify-end">
                <svg className="w-full h-full" viewBox="0 0 120 48" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 35 C 10 35, 14 20, 24 18 C 34 16, 42 6, 52 6 C 62 6, 68 25, 78 26 C 88 27, 94 38, 104 36 C 112 34, 116 22, 120 20 L 120 48 L 0 48 Z"
                    fill="url(#incomeFill)"
                  />
                  <path
                    d="M 0 35 C 10 35, 14 20, 24 18 C 34 16, 42 6, 52 6 C 62 6, 68 25, 78 26 C 88 27, 94 38, 104 36 C 112 34, 116 22, 120 20"
                    fill="none"
                    stroke="#1E8A38"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 2. Total Expense */}
            <div className="flex items-center justify-between px-2 md:px-6 py-2 md:py-0">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Total Expense</p>
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800">3.500K</h3>
                  <span className="text-xs font-medium text-rose-400">↓ 10.5%</span>
                </div>
              </div>
              <div className="w-28 h-12 relative flex items-center justify-end">
                <svg className="w-full h-full" viewBox="0 0 120 48" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#36C6A0" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#36C6A0" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 35 C 10 35, 14 20, 24 18 C 34 16, 42 6, 52 6 C 62 6, 68 25, 78 26 C 88 27, 94 38, 104 36 C 112 34, 116 22, 120 20 L 120 48 L 0 48 Z"
                    fill="url(#expenseFill)"
                  />
                  <path
                    d="M 0 35 C 10 35, 14 20, 24 18 C 34 16, 42 6, 52 6 C 62 6, 68 25, 78 26 C 88 27, 94 38, 104 36 C 112 34, 116 22, 120 20"
                    fill="none"
                    stroke="#36C6A0"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 3. Total Bonus */}
            <div className="flex items-center justify-between px-2 md:px-6 py-2 md:py-0 last:pr-0">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Total Bonus</p>
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800">5.100K</h3>
                  <span className="text-xs font-medium text-emerald-500">↑ 24.9%</span>
                </div>
              </div>
              <div className="w-28 h-12 relative flex items-center justify-end">
                <svg className="w-full h-full" viewBox="0 0 120 48" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="bonusFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 35 C 10 35, 14 20, 24 18 C 34 16, 42 6, 52 6 C 62 6, 68 25, 78 26 C 88 27, 94 38, 104 36 C 112 34, 116 22, 120 20 L 120 48 L 0 48 Z"
                    fill="url(#bonusFill)"
                  />
                  <path
                    d="M 0 35 C 10 35, 14 20, 24 18 C 34 16, 42 6, 52 6 C 62 6, 68 25, 78 26 C 88 27, 94 38, 104 36 C 112 34, 116 22, 120 20"
                    fill="none"
                    stroke="#1E8A38"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2: Statistics Dual Bars & Green Balance Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Statistics Dual Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-[28px] p-6 shadow-card border border-slate-100 flex flex-col justify-between">
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-800 tracking-tight">Statistics</h3>
                  <button className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                    <CalendarIcon className="h-3.5 w-3.5 text-slate-700" />
                    <span>19 Aug – 25 Aug</span>
                    <ChevronDownIcon className="h-3 w-3 text-slate-400" />
                  </button>
                </div>
                <div className="mt-2.5 flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">↑</div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">20.500</p>
                      <p className="text-[10px] text-slate-400">Income</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">↓</div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">5.400</p>
                      <p className="text-[10px] text-slate-400">Expense</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Grid */}
              <div className="relative flex gap-3 h-40 pt-4">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-right text-xs text-slate-400 font-normal pr-1 w-7 pb-6">
                  <span>10K</span>
                  <span>5K</span>
                  <span>2K</span>
                  <span>1K</span>
                  <span>0</span>
                </div>

                {/* Grid & Bars Container */}
                <div className="relative flex-1 flex flex-col justify-between pb-6">
                  {/* Faint Horizontal Gridlines */}
                  <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none pb-6">
                    <div className="w-full border-b border-slate-100" />
                    <div className="w-full border-b border-slate-100" />
                    <div className="w-full border-b border-slate-100" />
                    <div className="w-full border-b border-slate-100" />
                    <div className="w-full border-b border-slate-100" />
                  </div>

                  {/* 7 Day Columns with Dual Bars */}
                  <div className="relative z-10 grid grid-cols-7 h-full items-end">
                    {[
                      { day: 'Mon', incomeH: 28, expenseH: 68, active: false },
                      { day: 'Tue', incomeH: 52, expenseH: 14, active: false },
                      { day: 'Wed', incomeH: 62, expenseH: 48, active: false },
                      { day: 'Thu', incomeH: 54, expenseH: 22, active: false },
                      { day: 'Fri', incomeH: 74, expenseH: 34, active: true, incomeVal: '2.500', expenseVal: '1.200', date: '23 August, 2020' },
                      { day: 'Sat', incomeH: 58, expenseH: 50, active: false },
                      { day: 'Sun', incomeH: 48, expenseH: 38, active: false },
                    ].map((item, idx) => {
                      const isHovered = hoveredFinanceBar === idx || (hoveredFinanceBar === null && item.active)

                      return (
                        <div
                          key={item.day}
                          className="relative flex flex-col items-center justify-end h-full group cursor-pointer"
                          onMouseEnter={() => setHoveredFinanceBar(idx)}
                          onMouseLeave={() => setHoveredFinanceBar(4)}
                        >
                          {/* Tooltip Card (on Friday / Hover) */}
                          {isHovered && (
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-fadeIn pointer-events-none">
                              <div className="bg-white rounded-2xl shadow-xl border border-slate-100/90 px-3.5 py-1.5 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2.5 text-xs font-bold text-slate-800">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#1E8A38]" />
                                    <span>{item.incomeVal || '2.500'}</span>
                                  </span>
                                  <span className="text-slate-300 font-light">|</span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#36C6A0]" />
                                    <span>{item.expenseVal || '1.200'}</span>
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                                  {item.date || '23 August, 2020'}
                                </div>
                              </div>
                              <div className="w-2.5 h-2.5 bg-white rotate-45 -mt-1.5 border-r border-b border-slate-100/90 shadow-sm" />
                            </div>
                          )}

                          {/* Dual Side-by-Side Rounded Bars */}
                          <div className="flex items-end gap-1 sm:gap-1.5 h-full">
                            {/* Income Bar (Green) */}
                            <div
                              style={{ height: `${item.incomeH}%` }}
                              className="w-2.5 sm:w-3 bg-[#1E8A38] rounded-full transition-all duration-200 group-hover:brightness-105"
                            />
                            {/* Expense Bar (Teal) */}
                            <div
                              style={{ height: `${item.expenseH}%` }}
                              className="w-2.5 sm:w-3 bg-[#36C6A0] rounded-full transition-all duration-200 group-hover:brightness-105"
                            />
                          </div>

                          {/* X-Axis Day Label */}
                          <span className="absolute -bottom-6 text-xs text-slate-400 font-normal">
                            {item.day}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Green Balance Card with Wave Chart */}
            <div className="bg-[#1E8A38] rounded-[28px] p-6 shadow-card text-white flex flex-col justify-between relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-100">Balance</span>
                <button className="text-emerald-100 hover:text-white">
                  <MoreHorizontalIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Big Balance Amount & Toggle */}
              <div className="my-2">
                <h2 className="text-3xl font-extrabold tracking-tight">$27,500.00</h2>
                <div className="flex items-center gap-2 mt-2.5">
                  <button className="px-3.5 py-1 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-semibold text-white transition">
                    Income
                  </button>
                  <button className="px-3.5 py-1 text-emerald-100 hover:text-white text-xs font-medium transition">
                    Expenses
                  </button>
                </div>
              </div>

              {/* Smooth Live Wave Chart with $250 Tooltip */}
              <div className="relative h-28 w-full my-2">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  {/* Dashed Horizontal Guidelines */}
                  <line x1="0" y1="25" x2="300" y2="25" stroke="#FFFFFF" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#FFFFFF" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke="#FFFFFF" strokeOpacity="0.15" strokeDasharray="3 3" />

                  {/* Secondary translucent wave */}
                  <path
                    d="M 0 90 Q 50 60, 100 85 T 200 65 T 300 70"
                    fill="none"
                    stroke="#A7F3D0"
                    strokeOpacity="0.5"
                    strokeWidth="1.8"
                  />

                  {/* Primary Solid White Wave */}
                  <path
                    d="M 0 85 Q 40 40, 80 80 T 170 65 T 230 22 T 300 60"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Peak Marker Dot */}
                  <circle cx="230" cy="22" r="4.5" fill="#FFFFFF" />
                  <circle cx="230" cy="22" r="2" fill="#1E8A38" />
                </svg>

                {/* Floating $250 Tooltip */}
                <div className="absolute top-0 right-14 bg-white text-[#1E8A38] text-xs font-bold px-2.5 py-1 rounded-xl shadow-lg animate-bounce">
                  $250
                </div>

                {/* Bottom Baseline Tick Marks */}
                <div className="absolute bottom-0 inset-x-0 flex justify-between px-1">
                  {[...Array(24)].map((_, i) => (
                    <span key={i} className="w-0.5 h-1 bg-white/40 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Bottom Summary */}
              <div className="flex items-center justify-between text-xs text-emerald-100 border-t border-emerald-500/40 pt-3">
                <span>Income: <strong className="text-white font-bold ml-1">$500</strong></span>
                <span>Spending: <strong className="text-white font-bold ml-1">$200</strong></span>
              </div>
            </div>
          </div>

          {/* Row 3: My Cards (Visa Card UI) & Category Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Cards Details */}
            <div className="lg:col-span-2 bg-white rounded-[28px] p-6 shadow-card border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800">My Cards</h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex -space-x-1.5 items-center">
                    <span className="w-3.5 h-3.5 bg-rose-500 rounded-full inline-block" />
                    <span className="w-3.5 h-3.5 bg-amber-400 rounded-full inline-block opacity-80" />
                  </div>
                  <span>5880 **** **** 8854</span>
                  <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Visa Card with wave corner */}
                <div className="relative overflow-hidden bg-[#1E8A38] rounded-3xl p-6 text-white shadow-lg space-y-6">
                  {/* Teal corner shape */}
                  <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-[#36C6A0] rounded-full opacity-90 pointer-events-none" />

                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <p className="text-[11px] text-emerald-100 font-medium">Current Balance</p>
                      <h4 className="text-2xl font-black mt-0.5">80,700.00</h4>
                    </div>
                    <span className="font-black italic text-xl tracking-wider text-white">VISA</span>
                  </div>

                  <div className="relative z-10 pt-4 flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-white">Felecia Brown</p>
                      <p className="text-[11px] tracking-wider text-emerald-100 mt-1">•••• •••• •••• 8854</p>
                    </div>
                    <span className="text-xs font-medium text-white">12/19</span>
                  </div>
                </div>

                {/* Card Specs */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Card Type:</span>
                    <span className="font-semibold text-slate-800">Visa</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Card Holder:</span>
                    <span className="font-semibold text-slate-800">Felecia Brown</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Expires:</span>
                    <span className="font-semibold text-slate-800">12/19</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Card Number:</span>
                    <span className="font-semibold text-slate-800">5880 5087 3288 8854</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Total Balance:</span>
                    <span className="font-semibold text-slate-800">80,700.00</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Total Debt:</span>
                    <span className="font-semibold text-slate-800">8,250.00</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowAddCardModal(true)}
                  className="px-6 py-2.5 bg-[#EAFBF5] hover:bg-[#d4f8eb] text-[#16A34A] text-xs font-bold rounded-2xl transition"
                >
                  + Add Card
                </button>
                <div className="flex items-center gap-3">
                  <button className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-2xl shadow-sm transition">
                    Pay Debt
                  </button>
                  <button className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-2xl border border-slate-200/80 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Categorized Transactions */}
            <div className="bg-white rounded-[28px] p-6 shadow-card border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800">Transactions</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontalIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Shopping',
                    time: '08:00 AM — 19 August',
                    amount: '-$1.400',
                    bg: 'bg-[#36C6A0]',
                    icon: (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Travel',
                    time: '09:45 AM — 21 August',
                    amount: '-$850',
                    bg: 'bg-[#8B5CF6]',
                    icon: (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Food',
                    time: '10:15 AM — 24 August',
                    amount: '-$2.150',
                    bg: 'bg-[#F59E0B]',
                    icon: (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Medicine',
                    time: '10:50 AM — 24 August',
                    amount: '-$650',
                    bg: 'bg-[#EF4444]',
                    icon: (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Sport',
                    time: '12:45 AM — 28 August',
                    amount: '-$900',
                    bg: 'bg-[#16A34A]',
                    icon: (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m6.5 6.5 11 11" />
                        <path d="m21 21-1-1" />
                        <path d="m3 3 1 1" />
                        <path d="m18 22 4-4" />
                        <path d="m2 6 4-4" />
                        <path d="m3 10 7-7" />
                        <path d="m14 21 7-7" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-2xl ${item.bg} flex items-center justify-center shadow-xs`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{item.title}</p>
                        <p className="text-[10px] text-slate-400">{item.time}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Sliding Social Live Chat Drawer (Screenshot 122209)                        */}
      {/* ========================================================================= */}
      {isSocialChatOpen && (
        <div className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-100 z-50 flex flex-col animate-slideLeft">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">Chat Conversation</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <button
              onClick={() => setIsSocialChatOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {socialChatMessages.map((msg) => (
              <div key={msg.id}>
                {msg.isDateDivider && (
                  <div className="text-center my-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                      {msg.isDateDivider}
                    </span>
                  </div>
                )}
                <div className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender !== 'me' && (
                    <img src={msg.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                      msg.sender === 'me'
                        ? 'bg-[#16A34A] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-100 shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[9px] mt-1 block text-right ${msg.sender === 'me' ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200/70 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSendChat}
              className="p-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-2xl shadow transition"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800">Add New Card</h3>
              <button onClick={() => setShowAddCardModal(false)} className="text-slate-400 hover:text-slate-700">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500">Cardholder Name</label>
                <input type="text" placeholder="Felecia Brown" className="w-full px-3 py-2 text-xs border rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500">Card Number</label>
                <input type="text" placeholder="5880 0000 0000 8854" className="w-full px-3 py-2 text-xs border rounded-xl mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 text-xs border rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">CVV</label>
                  <input type="password" placeholder="***" className="w-full px-3 py-2 text-xs border rounded-xl mt-1" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <button onClick={() => setShowAddCardModal(false)} className="flex-1 py-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={() => setShowAddCardModal(false)} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow">Save Card</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
