import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '../../icons/FlowerIcons'

const tabs = ['Information', 'Images', 'Pricing', 'Inventory', 'Shipping']
const fieldClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-100'

const initialProduct = {
  name: '',
  description: '',
  category: 'Phone',
  tags: ['Apple', 'iPhone', '64GB'],
  taxExcludedPrice: '',
  taxIncludedPrice: '',
  taxRule: 'US-AL Rate (4%)',
  unitPrice: '',
  unitPer: '0',
  sku: '',
  stockQuantity: '0',
  trackInventory: true,
  weight: '',
  shippingClass: 'Standard',
  dimensions: '',
}

export default function AddProductModal({ onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('Information')
  const [product, setProduct] = useState(initialProduct)
  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState([])

  const updateProduct = (field, value) => {
    setProduct((current) => ({ ...current, [field]: value }))
  }

  const addTag = (event) => {
    if (event.key !== 'Enter' || !tagInput.trim()) return
    event.preventDefault()
    const tag = tagInput.trim()
    if (!product.tags.includes(tag)) updateProduct('tags', [...product.tags, tag])
    setTagInput('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!product.name.trim()) {
      setActiveTab('Information')
      return
    }
    if (!product.taxExcludedPrice && !product.taxIncludedPrice) {
      setActiveTab('Pricing')
      return
    }
    onSave({ ...product, images })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="flex h-[calc(100dvh-1.5rem)] max-h-[700px] w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
          <span aria-hidden="true" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add product form"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 border-b border-slate-200 px-3">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-current={activeTab === tab ? 'step' : undefined}
                className={`shrink-0 border-b-2 px-2.5 py-3 text-[9px] font-semibold uppercase transition ${
                  activeTab === tab
                    ? 'border-[#16A34A] text-[#15803D]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">{activeTab}</h3>

          {activeTab === 'Information' && (
            <div className="space-y-3.5">
              <label className="block text-[11px] font-medium text-slate-500">
                Product Name
                <input
                  required
                  value={product.name}
                  onChange={(event) => updateProduct('name', event.target.value)}
                  placeholder="Enter product name"
                  className={fieldClass}
                />
              </label>
              <label className="block text-[11px] font-medium text-slate-500">
                Description
                <textarea
                  value={product.description}
                  onChange={(event) => updateProduct('description', event.target.value)}
                  placeholder="Type something"
                  className={`${fieldClass} min-h-[115px] resize-y`}
                />
              </label>
              <label className="block text-[11px] font-medium text-slate-500">
                Category
                <select value={product.category} onChange={(event) => updateProduct('category', event.target.value)} className={`${fieldClass} bg-white`}>
                  <option>Phone</option><option>Accessories</option><option>Audio</option><option>Smart Watch</option><option>Notebook</option>
                </select>
              </label>
              <div>
                <label htmlFor="product-tags" className="block text-[11px] font-medium text-slate-500">Tags</label>
                <div className="mt-1.5 flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 px-2 py-1.5">
                  {product.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-700">
                      {tag}
                      <button type="button" onClick={() => updateProduct('tags', product.tags.filter((item) => item !== tag))} aria-label={`Remove ${tag} tag`} className="text-slate-400 hover:text-slate-700">×</button>
                    </span>
                  ))}
                  <input id="product-tags" value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={addTag} placeholder="Add tag" className="min-w-16 flex-1 bg-transparent px-1 py-1 text-[10px] outline-none" />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">Press Enter to add a tag</p>
              </div>
            </div>
          )}

          {activeTab === 'Images' && (
            <div>
              <label htmlFor="product-images" className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center text-[11px] text-slate-500 transition hover:border-emerald-400">
                <span className="mb-2 text-xl text-slate-400">⇧</span>
                <span>Drag and drop or <span className="text-[#16A34A]">Browse</span> to upload</span>
                <input id="product-images" type="file" accept="image/*" multiple onChange={(event) => setImages(Array.from(event.target.files || []).map((file) => file.name))} className="sr-only" />
              </label>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex h-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                    {images[index] ? <span className="truncate px-1 text-[8px]">{images[index]}</span> : <span className="text-lg">▧</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Pricing' && (
            <div className="space-y-3.5">
              <label className="block text-[11px] font-medium text-slate-500">
                Tax Excluded Price
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-[#16A34A]">
                  <span className="mr-2 text-xs text-slate-600">$</span>
                  <input type="number" min="0" step="0.01" value={product.taxExcludedPrice} onChange={(event) => updateProduct('taxExcludedPrice', event.target.value)} className="w-full text-xs outline-none" />
                </div>
              </label>
              <label className="block text-[11px] font-medium text-slate-500">
                Tax Included Price
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-[#16A34A]">
                  <span className="mr-2 text-xs text-slate-600">$</span>
                  <input type="number" min="0" step="0.01" value={product.taxIncludedPrice} onChange={(event) => updateProduct('taxIncludedPrice', event.target.value)} className="w-full text-xs outline-none" />
                </div>
              </label>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="product-tax-rule" className="text-[11px] font-medium text-slate-500">Tax Rule</label>
                  <button type="button" className="text-[10px] font-medium text-[#16A34A] underline underline-offset-2">Create New Tax</button>
                </div>
                <select id="product-tax-rule" value={product.taxRule} onChange={(event) => updateProduct('taxRule', event.target.value)} className={`${fieldClass} bg-white`}>
                  <option>US-AL Rate (4%)</option><option>Standard tax rate</option><option>Tax exempt</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[11px] font-medium text-slate-500">
                  Unit Price
                  <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 px-3 py-2.5">
                    <span className="mr-2 text-xs text-slate-600">$</span>
                    <input type="number" min="0" step="0.01" value={product.unitPrice} onChange={(event) => updateProduct('unitPrice', event.target.value)} className="w-full min-w-0 text-xs outline-none" />
                  </div>
                </label>
                <label className="block text-[11px] font-medium text-slate-500">
                  Per
                  <input type="number" min="0" value={product.unitPer} onChange={(event) => updateProduct('unitPer', event.target.value)} className={fieldClass} />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'Inventory' && (
            <div className="space-y-3.5">
              <label className="block text-[11px] font-medium text-slate-500">
                SKU
                <input value={product.sku} onChange={(event) => updateProduct('sku', event.target.value)} placeholder="Auto-generated if empty" className={fieldClass} />
              </label>
              <label className="block text-[11px] font-medium text-slate-500">
                Stock Quantity
                <input type="number" min="0" value={product.stockQuantity} onChange={(event) => updateProduct('stockQuantity', event.target.value)} className={fieldClass} />
              </label>
              <label className="flex items-center gap-2 text-[11px] text-slate-600">
                <input type="checkbox" checked={product.trackInventory} onChange={(event) => updateProduct('trackInventory', event.target.checked)} className="h-4 w-4 accent-[#16A34A]" />
                Track inventory for this product
              </label>
            </div>
          )}

          {activeTab === 'Shipping' && (
            <div className="space-y-3.5">
              <label className="block text-[11px] font-medium text-slate-500">
                Weight
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 px-3 py-2.5">
                  <input type="number" min="0" step="0.01" value={product.weight} onChange={(event) => updateProduct('weight', event.target.value)} className="w-full text-xs outline-none" />
                  <span className="ml-2 text-[10px] text-slate-400">kg</span>
                </div>
              </label>
              <label className="block text-[11px] font-medium text-slate-500">
                Shipping Class
                <select value={product.shippingClass} onChange={(event) => updateProduct('shippingClass', event.target.value)} className={`${fieldClass} bg-white`}>
                  <option>Standard</option><option>Fragile</option><option>Oversized</option>
                </select>
              </label>
              <label className="block text-[11px] font-medium text-slate-500">
                Package Dimensions (L × W × H)
                <input value={product.dimensions} onChange={(event) => updateProduct('dimensions', event.target.value)} placeholder="e.g. 20 × 10 × 5 cm" className={fieldClass} />
              </label>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 sm:px-6">
          {activeTab !== 'Information' ? (
            <button type="button" onClick={() => setActiveTab(tabs[tabs.indexOf(activeTab) - 1])} className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-medium text-slate-600 hover:bg-slate-50">
              Previous
            </button>
          ) : <span />}
          {activeTab !== 'Shipping' ? (
            <button type="button" onClick={() => setActiveTab(tabs[tabs.indexOf(activeTab) + 1])} className="rounded-lg bg-[#16A34A] px-5 py-2 text-[10px] font-bold text-white hover:bg-[#15803d]">
              Next Step
            </button>
          ) : (
            <button type="submit" className="rounded-lg bg-[#16A34A] px-5 py-2 text-[10px] font-bold text-white hover:bg-[#15803d]">
              Save Product
            </button>
          )}
        </div>
      </form>
    </div>,
    document.body,
  )
}
