import React, { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, DownloadIcon } from '../../icons/FlowerIcons'
import { exportTable } from '../../utils/exportTable'

const options = [
  { label: 'Print', type: 'print', icon: '⎙' },
  { label: 'Excel', type: 'excel', icon: '▦' },
  { label: 'PDF', type: 'pdf', icon: '▤' },
  { label: 'CSV', type: 'csv', icon: '▤' },
]

export default function ExportMenu({ title, filename, columns, rows }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const handleExport = (format) => {
    exportTable({ title, filename, columns, rows, format })
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <DownloadIcon className="h-4 w-4 text-slate-500" />
        <span>Export</span>
        <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.type}
              type="button"
              onClick={() => handleExport(option.type)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-sm text-[#16A34A]">
                {option.icon}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
