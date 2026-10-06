import React, { useEffect, useRef, useState } from 'react'
import { productsList } from '../data/mockData'
import AddProductModal from '../components/products/AddProductModal'
import ExportMenu from '../components/common/ExportMenu'
import {
  SearchIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  PlusIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  CheckIcon,
} from '../icons/FlowerIcons'

const parseProductPrice = (price) => {
  const value = price.replace(/[^0-9.,]/g, '')
  const normalized = value.includes(',') && value.includes('.')
    ? value.replace(/,/g, '')
    : /^\d{1,3}(?:\.\d{3})+$/.test(value)
      ? value.replace(/\./g, '')
      : value.replace(/,/g, '')
  return Number(normalized) || 0
}

const parseProductDate = (date) => {
  const [day, month, year] = date.split('.').map(Number)
  if (!day || !month || !year) return null
  return new Date(year < 100 ? 2000 + year : year, month - 1, day)
}

export default function Products() {
  const [activeTab, setActiveTab] = useState('All')
  const [products, setProducts] = useState(productsList)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [selectedItems, setSelectedItems] = useState([2, 3, 4])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [productFilters, setProductFilters] = useState({
    category: 'All',
    status: 'All',
    startDate: '',
    endDate: '',
    minPrice: 0,
    maxPrice: 10000,
  })
  const [draftFilters, setDraftFilters] = useState(productFilters)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categories = ['All', ...new Set(products.map((product) => product.category))]
  const productPrices = products.map((product) => parseProductPrice(product.price))
  const minAvailablePrice = Math.min(...productPrices, 0)
  const maxAvailablePrice = Math.max(...productPrices, 10000)

  // Filter products by tab & search
  const filteredProducts = products.filter((prod) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Available' && prod.status === 'Available') ||
      (activeTab === 'Disabled' && prod.status === 'Disabled')
    const matchesCategory = productFilters.category === 'All' || prod.category === productFilters.category
    const matchesStatus = productFilters.status === 'All' || prod.status === productFilters.status
    const productDate = parseProductDate(prod.date)
    const startDate = productFilters.startDate ? new Date(`${productFilters.startDate}T00:00:00`) : null
    const endDate = productFilters.endDate ? new Date(`${productFilters.endDate}T23:59:59`) : null
    const matchesDate =
      (!startDate || (productDate && productDate >= startDate)) &&
      (!endDate || (productDate && productDate <= endDate))
    const price = parseProductPrice(prod.price)
    const matchesPrice = price >= productFilters.minPrice && price <= productFilters.maxPrice
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesCategory && matchesStatus && matchesDate && matchesPrice && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage))
  const activePage = Math.min(currentPage, totalPages)
  const paginatedProducts = filteredProducts.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage,
  )
  const firstItem = filteredProducts.length === 0 ? 0 : (activePage - 1) * itemsPerPage + 1
  const lastItem = Math.min(activePage * itemsPerPage, filteredProducts.length)

  const toggleSelectAll = () => {
    const pageIds = paginatedProducts.map((product) => product.id)
    const allPageItemsSelected = pageIds.every((id) => selectedItems.includes(id))
    if (allPageItemsSelected) {
      setSelectedItems(selectedItems.filter((id) => !pageIds.includes(id)))
    } else {
      setSelectedItems([...new Set([...selectedItems, ...pageIds])])
    }
  }

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const addProduct = (form) => {
    const nextId = Math.max(...products.map((product) => product.id), 0) + 1
    const iconByCategory = {
      Phone: '📱',
      Accessories: '🎧',
      Audio: '🎧',
      'Smart Watch': '⌚',
      Notebook: '💻',
    }
    const today = new Date()
    const date = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getFullYear()).slice(-2)}`
    const taxRate = form.taxRule === 'Tax exempt'
      ? 0
      : (Number(form.taxRule.match(/\(([\d.]+)%\)/)?.[1]) || 4) / 100
    const price = Number(form.taxIncludedPrice || (Number(form.taxExcludedPrice) * (1 + taxRate)))

    const product = {
      id: nextId,
      name: form.name,
      sku: form.sku.trim() || `#${790840 + nextId}`,
      category: form.category,
      date,
      price: `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: 'Available',
      icon: iconByCategory[form.category] || '📦',
      description: form.description,
      specs: {
        tags: form.tags.join(', ') || '—',
        stock: form.trackInventory ? form.stockQuantity : 'Not tracked',
        shipping: form.shippingClass,
        weight: form.weight ? `${form.weight} kg` : '—',
        dimensions: form.dimensions || '—',
        taxRule: form.taxRule,
        unitPrice: form.unitPrice || '—',
        unitPer: form.unitPer,
        images: form.images.join(', ') || '—',
      },
    }

    setProducts((currentProducts) => [product, ...currentProducts])
    setSelectedItems((currentSelected) => [nextId, ...currentSelected])
    setActiveTab('All')
    setSearchQuery('')
    setCurrentPage(1)
    setIsAddProductOpen(false)
  }

  return (
    <div className="w-full space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Products
        </h1>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <ExportMenu
            title="Products"
            filename="products"
            rows={filteredProducts}
            columns={[
              { label: 'Product Name', value: (product) => product.name },
              { label: 'Product No.', value: (product) => product.sku },
              { label: 'Category', value: (product) => product.category },
              { label: 'Date', value: (product) => product.date },
              { label: 'Price', value: (product) => product.price },
              { label: 'Status', value: (product) => product.status },
            ]}
          />

          <button
            type="button"
            onClick={() => setIsAddProductOpen(true)}
            aria-label="Add product"
            title="Add product"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#16A34A] text-white shadow-sm transition hover:bg-[#15803d] hover:shadow"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs & View Switcher Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'All', count: 283 },
            { key: 'Available', count: 268 },
            { key: 'Disabled', count: 15 },
          ].map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  setCurrentPage(1)
                }}
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
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm self-start md:self-auto">
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
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-card border border-slate-100 space-y-6 overflow-hidden">
        {/* Table Search & Action Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200/70 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B4F481] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => {
                  setDraftFilters(productFilters)
                  setIsFilterOpen((open) => !open)
                }}
                aria-label="Filter products"
                aria-expanded={isFilterOpen}
                className={`p-2.5 rounded-2xl border border-slate-200/70 transition ${
                  isFilterOpen ? 'bg-emerald-50 text-[#15803D]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FilterIcon className="w-4 h-4" />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-[min(320px,calc(100vw-32px))] rounded-2xl border border-slate-100 bg-white p-5 shadow-xl">
                  <h3 className="mb-4 text-lg font-bold text-slate-800">Filter</h3>

                  <label className="mb-4 block text-[11px] font-medium text-slate-500">
                    Category
                    <select
                      value={draftFilters.category}
                      onChange={(event) => setDraftFilters((current) => ({ ...current, category: event.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#16A34A]"
                    >
                      {categories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </label>

                  <label className="mb-4 block text-[11px] font-medium text-slate-500">
                    Status
                    <select
                      value={draftFilters.status}
                      onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#16A34A]"
                    >
                      {['All', 'Available', 'Disabled'].map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>

                  <fieldset className="mb-4">
                    <legend className="mb-1.5 text-[11px] font-medium text-slate-500">Date</legend>
                    <div className="grid grid-cols-2 items-center gap-2">
                      <input
                        type="date"
                        aria-label="Start date"
                        value={draftFilters.startDate}
                        onChange={(event) => setDraftFilters((current) => ({ ...current, startDate: event.target.value }))}
                        className="min-w-0 rounded-xl border border-slate-200 px-2 py-2 text-[10px] text-slate-600 outline-none focus:border-[#16A34A]"
                      />
                      <input
                        type="date"
                        aria-label="End date"
                        value={draftFilters.endDate}
                        min={draftFilters.startDate || undefined}
                        onChange={(event) => setDraftFilters((current) => ({ ...current, endDate: event.target.value }))}
                        className="min-w-0 rounded-xl border border-slate-200 px-2 py-2 text-[10px] text-slate-600 outline-none focus:border-[#16A34A]"
                      />
                    </div>
                  </fieldset>

                  <fieldset className="mb-5">
                    <legend className="mb-2 text-[11px] font-medium text-slate-500">Price</legend>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={minAvailablePrice}
                        max={maxAvailablePrice}
                        value={Math.min(draftFilters.minPrice, maxAvailablePrice)}
                        onChange={(event) => setDraftFilters((current) => ({
                          ...current,
                          minPrice: Math.min(Number(event.target.value), current.maxPrice),
                        }))}
                        aria-label="Minimum product price"
                        className="min-w-0 flex-1 accent-[#16A34A]"
                      />
                      <input
                        type="range"
                        min={minAvailablePrice}
                        max={maxAvailablePrice}
                        value={Math.max(draftFilters.maxPrice, minAvailablePrice)}
                        onChange={(event) => setDraftFilters((current) => ({
                          ...current,
                          maxPrice: Math.max(Number(event.target.value), current.minPrice),
                        }))}
                        aria-label="Maximum product price"
                        className="min-w-0 flex-1 accent-[#16A34A]"
                      />
                    </div>
                    <div className="mt-1 flex justify-between gap-2 text-[10px] text-slate-500">
                      <span>${draftFilters.minPrice.toLocaleString()}</span>
                      <span>${draftFilters.maxPrice.toLocaleString()}</span>
                    </div>
                  </fieldset>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const resetFilters = {
                          category: 'All',
                          status: 'All',
                          startDate: '',
                          endDate: '',
                          minPrice: minAvailablePrice,
                          maxPrice: maxAvailablePrice,
                        }
                        setDraftFilters(resetFilters)
                        setProductFilters(resetFilters)
                        setCurrentPage(1)
                      }}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductFilters(draftFilters)
                        setCurrentPage(1)
                        setIsFilterOpen(false)
                      }}
                      className="rounded-lg bg-[#16A34A] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#15803d]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-2xl border border-slate-200/70 transition">
              <span>Actions</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* View Mode: List / Table View */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="min-w-[700px] w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2 w-10">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProducts.length > 0 &&
                        paginatedProducts.every((product) => selectedItems.includes(product.id))
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="pb-3 min-w-[240px]">Product Name</th>
                  <th className="pb-3 hidden lg:table-cell">Product No.</th>
                  <th className="pb-3 hidden xl:table-cell">Category</th>
                  <th className="pb-3 hidden xl:table-cell">Date</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                {paginatedProducts.map((prod) => {
                  const isSelected = selectedItems.includes(prod.id)
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        isSelected ? 'bg-emerald-50/20' : ''
                      }`}
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

                      <td className="py-4 font-bold text-slate-800">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="text-xl shrink-0">{prod.icon}</span>
                          <span className="truncate">{prod.name}</span>
                        </div>
                      </td>

                      <td className="hidden lg:table-cell py-4 text-slate-400 font-mono text-[11px]">
                        {prod.sku}
                      </td>
                      <td className="hidden xl:table-cell py-4 text-slate-500">{prod.category}</td>
                      <td className="hidden xl:table-cell py-4 text-slate-400">{prod.date}</td>
                      <td className="py-4 font-bold text-slate-800 whitespace-nowrap">{prod.price}</td>

                      <td className="py-4 whitespace-nowrap">
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
            {paginatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-card-hover transition flex flex-col justify-between"
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
            <select
              value={itemsPerPage}
              onChange={(event) => {
                setItemsPerPage(Number(event.target.value))
                setCurrentPage(1)
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-xl text-slate-700 font-semibold focus:outline-none"
              aria-label="Products per page"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>Showing {firstItem} - {lastItem} of {filteredProducts.length}</span>
          </div>

          {/* Page numbers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={activePage === 1}
              aria-label="First page"
              className="px-2.5 py-1 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={activePage === 1}
              aria-label="Previous page"
              className="px-2.5 py-1 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={activePage === page ? 'page' : undefined}
                className={`w-8 h-8 rounded-xl font-semibold text-xs transition ${
                  activePage === page
                    ? 'bg-[#16A34A] text-white font-bold shadow-sm'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={activePage === totalPages}
              aria-label="Next page"
              className="px-2.5 py-1 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={activePage === totalPages}
              aria-label="Last page"
              className="px-2.5 py-1 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {isAddProductOpen && (
        <AddProductModal
          onClose={() => setIsAddProductOpen(false)}
          onSave={addProduct}
        />
      )}

    </div>
  )
}
