import React, { useState } from 'react'
import { productsList } from '../data/mockData'
import {
  SearchIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  DownloadIcon,
  PlusIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  CheckIcon,
  CloseIcon,
} from '../icons/FlowerIcons'

export default function Products() {
  const [activeTab, setActiveTab] = useState('All')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState([2, 3, 4])
  const [quickviewProduct, setQuickviewProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  // Filter products by tab & search
  const filteredProducts = productsList.filter((prod) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Available' && prod.status === 'Available') ||
      (activeTab === 'Disabled' && prod.status === 'Disabled')
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredProducts.map((p) => p.id))
    }
  }

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Products
        </h1>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-2xl border border-slate-200/80 shadow-sm transition">
            <DownloadIcon className="w-4 h-4 text-slate-500" />
            <span>Export</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Add Product CTA Green Button */}
          <button
            onClick={() => setQuickviewProduct(productsList[0])}
            className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Tabs & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2">
          {[
            { key: 'All', count: 283 },
            { key: 'Available', count: 268 },
            { key: 'Disabled', count: 15 },
          ].map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
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

        {/* View Mode Switcher (List / Grid) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition ${
              viewMode === 'list'
                ? 'bg-slate-100 text-slate-800'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ListViewIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition ${
              viewMode === 'grid'
                ? 'bg-slate-100 text-slate-800'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <GridViewIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table / Content Card */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-6">
        {/* Table Search & Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200/70 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B4F481] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl border border-slate-200/70 transition">
              <FilterIcon className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-2xl border border-slate-200/70 transition">
              <span>Actions</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* View Mode: List / Table View */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Product No.</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                {filteredProducts.map((prod) => {
                  const isSelected = selectedItems.includes(prod.id)
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        isSelected ? 'bg-emerald-50/20' : ''
                      }`}
                      onClick={() => setQuickviewProduct(prod)}
                    >
                      <td
                        className="py-4 pl-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSelectItem(prod.id)
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

                      <td className="py-4 font-bold text-slate-800 flex items-center gap-3">
                        <span className="text-xl">{prod.icon}</span>
                        <span>{prod.name}</span>
                      </td>

                      <td className="py-4 text-slate-400 font-mono text-[11px]">{prod.sku}</td>
                      <td className="py-4 text-slate-500">{prod.category}</td>
                      <td className="py-4 text-slate-400">{prod.date}</td>
                      <td className="py-4 font-bold text-slate-800">{prod.price}</td>

                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block ${
                            prod.status === 'Available'
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : 'bg-[#FEF3C7] text-[#D97706]'
                          }`}
                        >
                          {prod.status}
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
        ) : (
          /* Grid View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setQuickviewProduct(prod)}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-card-hover transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-32 bg-slate-50 rounded-xl flex items-center justify-center text-4xl mb-4">
                    {prod.icon}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 inline-block ${
                      prod.status === 'Available'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}
                  >
                    {prod.status}
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-2 mb-1">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">{prod.category} • {prod.sku}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <span className="font-extrabold text-sm text-slate-800">{prod.price}</span>
                  <button className="text-xs text-emerald-600 font-bold hover:underline">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <select className="px-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-xl text-slate-700 font-semibold focus:outline-none">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <span>Showing 1 - 10 of 100</span>
          </div>

          {/* Page numbers */}
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

      {/* Product Details Quickview Modal (Folder 3 Figma Screen) */}
      {quickviewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setQuickviewProduct(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Gallery & Thumbnails */}
              <div>
                <div className="w-full h-56 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-6xl mb-4">
                  {quickviewProduct.icon}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-lg text-slate-300"
                    >
                      🖼️
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info & Specifications */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {quickviewProduct.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    SKU: {quickviewProduct.sku}
                  </p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {quickviewProduct.description}
                </p>

                {/* Quantity & Price */}
                <div className="flex items-center justify-between py-2 border-y border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">Quantity</span>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-2xl font-black text-slate-800">
                    {quickviewProduct.price}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      alert(`Added ${quantity} item(s) to Cart!`)
                      setQuickviewProduct(null)
                    }}
                    className="flex-1 py-3 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs rounded-2xl shadow-sm transition"
                  >
                    Add to Cart
                  </button>
                  <button className="p-3 bg-[#E6FFFA] text-[#0D9488] rounded-2xl hover:bg-[#CCFBF1] transition">
                    ❤️
                  </button>
                </div>

                {/* Specifications Grid */}
                <div className="pt-2">
                  <h5 className="text-xs font-bold text-slate-800 mb-2">Specifications</h5>
                  <div className="space-y-1.5 text-xs">
                    {quickviewProduct.specs &&
                      Object.entries(quickviewProduct.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-400 capitalize">{key}</span>
                          <span className="font-semibold text-slate-700">{val}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
