import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function ProfilePage() {
  const { profile, saveProfile } = useOutletContext()
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setSaved(false)
    setError('')
  }

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Choose a JPG, PNG, WEBP, or GIF image.')
      event.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be 2 MB or smaller.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setError('Could not read this image. Please choose another file.')
        return
      }
      setForm((current) => ({ ...current, picture: reader.result }))
      setSaved(false)
      setError('')
    }
    reader.onerror = () => setError('Could not read this image. Please choose another file.')
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    try {
      saveProfile(form)
      setSaved(true)
    } catch (error) {
      if (error instanceof DOMException && ['QuotaExceededError', 'SecurityError'].includes(error.name)) {
        setError('Could not save your profile. Please try a smaller image.')
        return
      }
      throw error
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Account</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-800">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal details and workspace identity.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
          <img
            src={form.picture || '/user-avatar.png'}
            alt={form.name}
            className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-emerald-100"
          />
          <label className="mt-4 inline-flex cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
            Change photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePictureChange}
              className="sr-only"
              aria-label="Choose profile photo"
            />
          </label>
          {form.picture && (
            <button
              type="button"
              onClick={() => {
                setForm((current) => ({ ...current, picture: '' }))
                setSaved(false)
                setError('')
              }}
              className="ml-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              Remove
            </button>
          )}
          <p className="mt-2 text-[10px] text-slate-400">JPG, PNG, WEBP or GIF · Up to 2 MB</p>
          <h2 className="mt-4 font-extrabold text-slate-800">{form.name}</h2>
          <p className="mt-1 text-xs text-slate-400">{form.role}</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-800">Profile Information</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-500">
              Full Name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400"
              />
            </label>
            <label className="text-xs font-bold text-slate-500">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400"
              />
            </label>
            <label className="text-xs font-bold text-slate-500">
              Role
              <input
                name="role"
                value={form.role}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400"
              />
            </label>
            <label className="text-xs font-bold text-slate-500">
              Phone
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#14532D] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#166534]"
            >
              Save Changes
            </button>
            {saved && <p role="status" className="text-xs font-semibold text-emerald-700">Profile saved.</p>}
            {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}
          </div>
        </form>
      </div>
    </section>
  )
}
