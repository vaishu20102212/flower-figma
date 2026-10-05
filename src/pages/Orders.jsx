import React, { useState } from 'react'
import { ordersList } from '../data/mockData'
import {
  SearchIcon,
  DownloadIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  CheckIcon,
  CloseIcon,
} from '../icons/FlowerIcons'

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrders, setSelectedOrders] = useState([2, 3, 4])
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)

  const filteredOrders = ordersList.filter((ord) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Pending' && ord.status === 'Processing') ||
      (activeTab === 'Processing' && ord.status === 'Processing') ||
      (activeTab === 'Refunded' && ord.status === 'Cancelled')
    const matchesSearch =
      ord.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.payment.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id))
    }
  }

  const toggleSelectItem = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((i) => i !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Orders
        </h1>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-2xl border border-slate-200/80 shadow-sm transition">
            <DownloadIcon className="w-4 h-4 text-slate-500" />
            <span>Export</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'All', count: 983 },
          { key: 'Pending', count: 128 },
          { key: 'Processing', count: 15 },
          { key: 'Refunded', count: 8 },
        ].map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span>{tab.key}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Orders Table Card */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-6">
        {/* Search & Actions toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200/70 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B4F481] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-2xl border border-slate-200/70 transition">
              <span>Actions</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === filteredOrders.length &&
                      filteredOrders.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="pb-3">Order No.</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrders.includes(order.id)
                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderDetails(order)}
                    className={`hover:bg-slate-50/80 transition cursor-pointer ${
                      isSelected ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <td
                      className="py-4 pl-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSelectItem(order.id)
                      }}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-[#16A34A] border-[#16A34A] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </td>

                    <td className="py-4 text-slate-400 font-mono text-[11px]">{order.orderNo}</td>

                    <td className="py-4 font-bold text-slate-800 flex items-center gap-3">
                      <img
                        src={order.avatar}
                        alt={order.customer}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <span>{order.customer}</span>
                    </td>

                    <td className="py-4 text-slate-400">{order.date}</td>
                    <td className="py-4 font-bold text-slate-800">{order.total}</td>
                    <td className="py-4 text-slate-500">{order.payment}</td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block ${
                          order.status === 'Shipped'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : order.status === 'Processing'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#FEE2E2] text-[#DC2626]'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td
                      className="py-4 text-right pr-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <MoreVerticalIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <select className="px-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-xl text-slate-700 font-semibold focus:outline-none">
              <option>10</option>
              <option>20</option>
            </select>
            <span>Showing 1 - 10 of 100</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="px-2.5 py-1 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100">
              «
            </button>
            <button className="px-2.5 py-1 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100">
              ‹
            </button>
            <button className="w-8 h-8 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-600 font-semibold text-xs transition">
              2
            </button>
            <button className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-600 font-semibold text-xs transition">
              3
            </button>
            <span className="px-1 text-slate-400 text-xs">...</span>
            <button className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-600 font-semibold text-xs transition">
              5
            </button>
            <button className="px-2.5 py-1 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100">
              ›
            </button>
            <button className="px-2.5 py-1 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100">
              »
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedOrderDetails.avatar}
                  alt={selectedOrderDetails.customer}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Order {selectedOrderDetails.orderNo}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Customer: <strong className="text-slate-700">{selectedOrderDetails.customer}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Date:</span>
                  <span className="font-semibold text-slate-700">{selectedOrderDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method:</span>
                  <span className="font-semibold text-slate-700">{selectedOrderDetails.payment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-600">{selectedOrderDetails.status}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Total Amount:</span>
                  <span className="text-base font-black text-slate-900">{selectedOrderDetails.total}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    alert(`Tracking details generated for order ${selectedOrderDetails.orderNo}`)
                    setSelectedOrderDetails(null)
                  }}
                  className="w-full py-3 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs rounded-2xl shadow-sm transition"
                >
                  Track Shipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
