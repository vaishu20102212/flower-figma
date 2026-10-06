import React, { useState } from 'react'
import { ordersList } from '../data/mockData'
import ExportMenu from '../components/common/ExportMenu'
import {
  SearchIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  CheckIcon,
  CloseIcon,
} from '../icons/FlowerIcons'

const getOrderPricing = (total, taxRule = 'US-AL Rate (4%)') => {
  const includedPrice = Number(total.replace(/[^0-9.]/g, ''))

  if (!Number.isFinite(includedPrice)) {
    return null
  }

  const taxRate = taxRule === 'Tax exempt'
    ? 0
    : (Number(taxRule.match(/\(([\d.]+)%\)/)?.[1]) || 4) / 100
  const excludedPrice = includedPrice / (1 + taxRate)
  const taxAmount = includedPrice - excludedPrice
  const formatPrice = (amount) => `$${amount.toFixed(2)}`

  return {
    excludedPrice: formatPrice(excludedPrice),
    taxAmount: formatPrice(taxAmount),
    includedPrice: formatPrice(includedPrice),
  }
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrders, setSelectedOrders] = useState([2, 3, 4])
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)
  const [orders, setOrders] = useState(ordersList)
  const [orderDetailsTab, setOrderDetailsTab] = useState('Order Details')
  const [isBillingAddressOpen, setIsBillingAddressOpen] = useState(true)
  const [isShippingAddressOpen, setIsShippingAddressOpen] = useState(false)

  const filteredOrders = orders.filter((ord) => {
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
  const selectedOrderPricing = selectedOrderDetails
    ? getOrderPricing(selectedOrderDetails.total, selectedOrderDetails.taxRule)
    : null

  const openOrderDetails = (order) => {
    setSelectedOrderDetails(order)
    setOrderDetailsTab('Order Details')
    setIsBillingAddressOpen(true)
    setIsShippingAddressOpen(false)
  }

  const updateSelectedOrder = (field, value) => {
    setSelectedOrderDetails((current) => ({ ...current, [field]: value }))
    setOrders((currentOrders) => currentOrders.map((order) =>
      order.id === selectedOrderDetails.id
        ? { ...order, [field]: value, ...(field === 'fulfillmentStatus' ? { status: value } : {}) }
        : order,
    ))
  }

  const openFirstOrderInvoice = () => {
    const order = filteredOrders[0]
    if (!order) return

    openOrderDetails(order)
    setOrderDetailsTab('Invoice')
  }

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
          <ExportMenu
            title="Orders"
            filename="orders"
            rows={filteredOrders}
            columns={[
              { label: 'Order No.', value: (order) => order.orderNo },
              { label: 'Customer', value: (order) => order.customer },
              { label: 'Product', value: (order) => order.productName || '' },
              { label: 'Date', value: (order) => order.date },
              { label: 'Total', value: (order) => order.total },
              { label: 'Payment', value: (order) => order.payment },
              { label: 'Status', value: (order) => order.status },
            ]}
          />
          <button
            type="button"
            onClick={openFirstOrderInvoice}
            disabled={filteredOrders.length === 0}
            aria-label="View order invoice"
            title={filteredOrders.length ? 'View first order invoice' : 'No orders to show'}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16A34A] text-white shadow-sm transition hover:bg-[#15803d]"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
              <path d="M6 2.75h5l3.25 3.5v11H6a1.25 1.25 0 0 1-1.25-1.25V4A1.25 1.25 0 0 1 6 2.75Z" />
              <path d="M11 2.75v3.5h3.25M7.5 10h5M7.5 13h5" />
            </svg>
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
                    onClick={() => openOrderDetails(order)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-5 animate-fadeIn">
        <div className="relative w-full max-w-[660px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-5">
            <div className="flex min-w-0 overflow-x-auto">
              {['Order Details', 'Products', 'Invoice'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setOrderDetailsTab(tab)}
                  aria-current={orderDetailsTab === tab ? 'page' : undefined}
                  className={`shrink-0 border-b-2 px-3 py-4 text-[9px] font-semibold uppercase transition ${
                    orderDetailsTab === tab
                      ? 'border-[#16A34A] text-[#15803D]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelectedOrderDetails(null)}
              aria-label="Close order details"
              className="ml-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-800">
                {orderDetailsTab === 'Invoice' ? 'Invoice' : 'Orders'}
                <span className="ml-2 text-slate-400">{selectedOrderDetails.orderNo}</span>
              </h2>
              {orderDetailsTab !== 'Products' && (
                <ExportMenu
                  title={orderDetailsTab === 'Invoice' ? `Invoice ${selectedOrderDetails.orderNo}` : `Order ${selectedOrderDetails.orderNo}`}
                  filename={`${orderDetailsTab === 'Invoice' ? 'invoice' : 'order'}-${selectedOrderDetails.orderNo.replace('#', '')}`}
                  rows={[selectedOrderDetails]}
                  columns={[
                    { label: 'Order No.', value: (order) => order.orderNo },
                    { label: 'Customer', value: (order) => order.customer },
                    { label: 'Product', value: (order) => order.productName || 'Product order' },
                    { label: 'Date', value: (order) => order.date },
                    { label: 'Total', value: (order) => order.total },
                    { label: 'Payment', value: (order) => order.payment },
                    { label: 'Fulfilment', value: (order) => order.fulfillmentStatus || order.status },
                    { label: 'Payment Status', value: (order) => order.paymentStatus || (order.status === 'Cancelled' ? 'Refunded' : 'Paid') },
                  ]}
                />
              )}
            </div>

            {orderDetailsTab === 'Order Details' && (
              <div className="space-y-4">
                <section>
                  <h3 className="mb-2 text-sm font-semibold text-slate-700">Customer</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[550px] text-left text-[9px]">
                      <thead>
                        <tr className="border-b border-slate-200 uppercase text-slate-400">
                          {['Name', 'Email', 'Phone', 'Location'].map((heading) => <th key={heading} className="px-2 py-2 font-semibold">{heading}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-slate-600">
                          <td className="px-2 py-2.5">
                            <span className="flex items-center gap-2 whitespace-nowrap">
                              <img src={selectedOrderDetails.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
                              {selectedOrderDetails.customer}
                            </span>
                          </td>
                          <td className="px-2 py-2.5">{selectedOrderDetails.email || 'example@mail.com'}</td>
                          <td className="px-2 py-2.5 whitespace-nowrap">{selectedOrderDetails.phone || '+1(070) 4567-8800'}</td>
                          <td className="px-2 py-2.5 whitespace-nowrap">{selectedOrderDetails.address || '993 E. Brewer St. Holtsville'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="grid gap-3 sm:grid-cols-2">
                  <section className="space-y-3">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-slate-700">Payment method</h3>
                      <select value={selectedOrderDetails.payment} onChange={(event) => updateSelectedOrder('payment', event.target.value)} className="w-full max-w-40 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[10px] text-slate-600 outline-none focus:border-[#16A34A]">
                        {['Credit Card', 'PayPal', 'Payoneer', 'Cash'].map((method) => <option key={method}>{method}</option>)}
                      </select>
                      <p className="mt-2 text-[9px] text-slate-500">Transaction ID: <span className="text-slate-700">{selectedOrderDetails.transactionId || '000001-THXQ'}</span></p>
                      <p className="mt-1 text-[9px] text-slate-500">Amount: <span className="text-slate-700">{selectedOrderDetails.total}</span></p>
                      {selectedOrderDetails.payment === 'Credit Card' && (
                        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <h4 className="text-[9px] font-semibold text-slate-700">Card details</h4>
                          <p className="mt-1.5 text-[9px] text-slate-500">
                            Cardholder: <span className="text-slate-700">{selectedOrderDetails.cardholder || selectedOrderDetails.customer}</span>
                          </p>
                          <p className="mt-1 text-[9px] text-slate-500">
                            Card number: <span className="text-slate-700">
                              {selectedOrderDetails.cardLast4 ? `•••• •••• •••• ${selectedOrderDetails.cardLast4}` : 'Last four digits not available'}
                            </span>
                          </p>
                          {selectedOrderDetails.cardExpiry && (
                            <p className="mt-1 text-[9px] text-slate-500">
                              Expiry: <span className="text-slate-700">{selectedOrderDetails.cardExpiry}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-slate-700">Shipping method</h3>
                      <select value={selectedOrderDetails.shippingMethod || 'Carrier'} onChange={(event) => updateSelectedOrder('shippingMethod', event.target.value)} className="w-full max-w-40 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[10px] text-slate-600 outline-none focus:border-[#16A34A]">
                        {['Carrier', 'Standard', 'Express', 'Pickup'].map((method) => <option key={method}>{method}</option>)}
                      </select>
                      <p className="mt-2 text-[9px] text-slate-500">Tracking Code: <span className="text-slate-700">{selectedOrderDetails.trackingCode || 'FX-012345-6'}</span></p>
                      <p className="mt-1 text-[9px] text-slate-500">Date: <span className="text-slate-700">{selectedOrderDetails.date}</span></p>
                    </div>
                  </section>
                  <section className="space-y-2 rounded-xl bg-slate-50 p-3">
                    <label className="flex items-center justify-between gap-2 text-[9px] font-medium text-slate-600">
                      Fulfilment status
                      <select value={selectedOrderDetails.fulfillmentStatus || selectedOrderDetails.status} onChange={(event) => updateSelectedOrder('fulfillmentStatus', event.target.value)} className="max-w-28 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[9px] outline-none">
                        {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </label>
                    <label className="flex items-center justify-between gap-2 text-[9px] font-medium text-slate-600">
                      Payment status
                      <select value={selectedOrderDetails.paymentStatus || (selectedOrderDetails.status === 'Cancelled' ? 'Refunded' : 'Paid')} onChange={(event) => updateSelectedOrder('paymentStatus', event.target.value)} className="max-w-28 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[9px] outline-none">
                        {['Pending', 'Paid', 'Refunded'].map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </label>
                  </section>
                </div>

                <div className="space-y-2">
                  <section className="overflow-hidden rounded-xl border border-slate-200">
                    <button type="button" onClick={() => setIsBillingAddressOpen((open) => !open)} aria-expanded={isBillingAddressOpen} className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Billing address
                      <ChevronDownIcon className={`h-3.5 w-3.5 transition ${isBillingAddressOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isBillingAddressOpen && (
                      <div className="grid gap-x-4 gap-y-1 border-t border-slate-100 px-3.5 py-3 text-[9px] text-slate-500 sm:grid-cols-3">
                        <p>First name: <span className="text-slate-700">{selectedOrderDetails.customer.split(' ')[0]}</span></p>
                        <p>State/Region: <span className="text-slate-700">{selectedOrderDetails.state || 'New York'}</span></p>
                        <p>Phone: <span className="text-slate-700">{selectedOrderDetails.phone || '+1(070) 4567-8800'}</span></p>
                        <p>Last name: <span className="text-slate-700">{selectedOrderDetails.customer.split(' ').slice(1).join(' ')}</span></p>
                        <p>City: <span className="text-slate-700">{selectedOrderDetails.city || 'New York'}</span></p>
                        <p>Email: <span className="text-slate-700">{selectedOrderDetails.email || 'example@mail.com'}</span></p>
                        <p className="sm:col-span-2">Address: <span className="text-slate-700">{selectedOrderDetails.address || '993 E. Brewer St. Holtsville'}</span></p>
                        <p>Postcode: <span className="text-slate-700">{selectedOrderDetails.postalCode || '11742'}</span></p>
                        <p>Country: <span className="text-slate-700">{selectedOrderDetails.country || 'United States'}</span></p>
                      </div>
                    )}
                  </section>

                  <section className="overflow-hidden rounded-xl border border-slate-200">
                    <button type="button" onClick={() => setIsShippingAddressOpen((open) => !open)} aria-expanded={isShippingAddressOpen} className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Shipping address
                      <ChevronDownIcon className={`h-3.5 w-3.5 transition ${isShippingAddressOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isShippingAddressOpen && (
                      <div className="grid gap-x-4 gap-y-1 border-t border-slate-100 px-3.5 py-3 text-[9px] text-slate-500 sm:grid-cols-3">
                        <p>Customer: <span className="text-slate-700">{selectedOrderDetails.customer}</span></p>
                        <p>Phone: <span className="text-slate-700">{selectedOrderDetails.phone || '+1(070) 4567-8800'}</span></p>
                        <p>Email: <span className="text-slate-700">{selectedOrderDetails.email || 'example@mail.com'}</span></p>
                        <p className="sm:col-span-2">Address: <span className="text-slate-700">{selectedOrderDetails.shippingAddress || selectedOrderDetails.address || '993 E. Brewer St. Holtsville'}</span></p>
                        <p>City/Region: <span className="text-slate-700">{selectedOrderDetails.city || 'New York'}</span></p>
                        <p>Country: <span className="text-slate-700">{selectedOrderDetails.country || 'United States'}</span></p>
                        <p>Postcode: <span className="text-slate-700">{selectedOrderDetails.postalCode || '11742'}</span></p>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}

            {orderDetailsTab === 'Products' && (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[440px] text-left text-[10px]">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>{['Product', 'Product No.', 'Quantity', 'Price', 'Total'].map((heading) => <th key={heading} className="px-3 py-2.5 font-semibold">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100 text-slate-700">
                      <td className="px-3 py-3 font-medium">{selectedOrderDetails.productName || 'Product order'}</td>
                      <td className="px-3 py-3">{selectedOrderDetails.productNo || '—'}</td>
                      <td className="px-3 py-3">{selectedOrderDetails.quantity || 1}</td>
                      <td className="px-3 py-3">{selectedOrderDetails.unitPrice || selectedOrderDetails.total}</td>
                      <td className="px-3 py-3 font-semibold">{selectedOrderDetails.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {orderDetailsTab === 'Invoice' && (
              <section className="space-y-6 rounded-xl border border-slate-100 bg-white p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div className="flex items-center gap-5">
                    <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center bg-[#ff7775] text-center text-white">
                      <span className="text-xs font-bold">INVOICE</span>
                      <span className="mt-1 text-xs">{selectedOrderDetails.orderNo}</span>
                    </div>
                    <div className="space-y-1 text-[10px] text-slate-500">
                      <p className="font-semibold uppercase text-slate-700">Flower</p>
                      <p>Flower Dashboard</p>
                      <p>{selectedOrderDetails.address || 'Customer address on file'}</p>
                      <p>{selectedOrderDetails.email || 'Customer email on file'}</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <p>{selectedOrderDetails.date}</p>
                    <p className="mt-3 font-bold tracking-wide text-slate-700">FLOWER</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-200 uppercase text-slate-400">
                        {['Product', 'Price', 'Quantity', 'Total'].map((heading) => (
                          <th key={heading} className="px-2 py-3 font-medium">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 text-slate-600">
                        <td className="px-2 py-3">{selectedOrderDetails.productName || 'Product order'}</td>
                        <td className="px-2 py-3">{selectedOrderDetails.unitPrice || selectedOrderDetails.total}</td>
                        <td className="px-2 py-3">{selectedOrderDetails.quantity || 1}</td>
                        <td className="px-2 py-3">{selectedOrderDetails.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="ml-auto max-w-52 space-y-2 text-[10px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span><span>{selectedOrderPricing?.excludedPrice || selectedOrderDetails.total}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax</span><span>{selectedOrderPricing?.taxAmount || '$0.00'}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-800">
                    <span>Total</span><span>{selectedOrderPricing?.includedPrice || selectedOrderDetails.total}</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  )
}
