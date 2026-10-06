import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  PlusIcon,
  SearchIcon,
} from '../icons/FlowerIcons'

const emptyContact = {
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '+1',
  phone: '',
  role: '',
  address: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  notes: '',
  avatar: '',
}

export default function NotesContactsPage({ type = 'notes' }) {
  const isNotes = type === 'notes'
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingContactId, setEditingContactId] = useState(null)

  const [newContact, setNewContact] = useState(emptyContact)

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tag: 'General',
  })

  const [contactsList, setContactsList] = useState([
    {
      id: 1,
      name: 'Regina Cooper',
      email: 'regina_cooper@mail.com',
      role: 'Creative Director',
      phone: '+1 (555) 234-5678',
      avatar: '/user-avatar.png',
    },
    {
      id: 2,
      name: 'Robert Edwards',
      email: 'robert.e@flower.design',
      role: 'Lead Product Manager',
      phone: '+1 (555) 876-5432',
      avatar: '/user-avatar.png',
    },
    {
      id: 3,
      name: 'Jane Wilson',
      email: 'jane.w@studio.io',
      role: 'Senior UI/UX Designer',
      phone: '+1 (555) 345-6789',
      avatar: '/user-avatar.png',
    },
    {
      id: 4,
      name: 'Dustin Williamson',
      email: 'dustin.w@flower.ui',
      role: 'Frontend Architect',
      phone: '+1 (555) 987-6543',
      avatar: '/user-avatar.png',
    },
  ])

  const [notesList, setNotesList] = useState([
    {
      id: 1,
      title: 'Design System Guidelines',
      content:
        'Maintain consistent padding of 24px on card containers and use the #B4F481 signature lime pill for active states.',
      date: 'Sep 25, 2026',
      tag: 'Design',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 2,
      title: 'Client Meeting Takeaways',
      content:
        'Export reports as high resolution PDF and support responsive mobile drawers for tablets.',
      date: 'Sep 22, 2026',
      tag: 'Meeting',
      color: 'bg-teal-50 text-teal-700',
    },
    {
      id: 3,
      title: 'Vite & Tailwind Production Build',
      content:
        'Ensure all SVG icons render inline with clean zero dependency vector curves for optimal load speed.',
      date: 'Sep 20, 2026',
      tag: 'Dev',
      color: 'bg-amber-50 text-amber-700',
    },
  ])

  const openModal = () => {
    setEditingContactId(null)
    setNewContact(emptyContact)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingContactId(null)
  }

  const openEditContact = (contact) => {
    const phoneParts = contact.phone.match(/^(\+\d+)\s*(.*)$/)
    const [firstName = '', ...lastNameParts] = contact.name.split(' ')
    setEditingContactId(contact.id)
    setNewContact({
      ...emptyContact,
      ...contact,
      firstName: contact.firstName || firstName,
      lastName: contact.lastName || lastNameParts.join(' '),
      countryCode: contact.countryCode || phoneParts?.[1] || '+1',
      phone: contact.phoneNumber || phoneParts?.[2] || contact.phone,
    })
    setShowModal(true)
  }

  const handleAddContact = (e) => {
    e.preventDefault()

    if (
      !newContact.firstName.trim() ||
      !newContact.lastName.trim() ||
      !newContact.email.trim() ||
      !newContact.role.trim() ||
      !newContact.phone.trim()
    ) {
      return
    }

    const contact = {
      ...newContact,
      id: editingContactId || Date.now(),
      name: `${newContact.firstName.trim()} ${newContact.lastName.trim()}`,
      phone: `${newContact.countryCode} ${newContact.phone.trim()}`,
      phoneNumber: newContact.phone.trim(),
      avatar: newContact.avatar || '/user-avatar.png',
    }

    setContactsList((prev) => editingContactId
      ? prev.map((item) => item.id === editingContactId ? contact : item)
      : [...prev, contact],
    )

    setNewContact(emptyContact)

    setShowModal(false)
  }

  const handleAddNote = (e) => {
    e.preventDefault()

    if (!newNote.title.trim() || !newNote.content.trim()) {
      return
    }

    const note = {
      id: Date.now(),
      ...newNote,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      color: 'bg-emerald-50 text-emerald-700',
    }

    setNotesList((prev) => [note, ...prev])

    setNewNote({
      title: '',
      content: '',
      tag: 'General',
    })

    setShowModal(false)
  }

  const filteredContacts = contactsList.filter((contact) =>
    `${contact.name} ${contact.email} ${contact.role}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  const filteredNotes = notesList.filter((note) =>
    `${note.title} ${note.content} ${note.tag}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight capitalize">
          {isNotes ? 'Notes' : 'Contacts'}
        </h1>

        <button
          onClick={openModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm transition self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add {isNotes ? 'Note' : 'Contact'}</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-6">

        {/* Search */}
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${isNotes ? 'notes' : 'contacts'}...`}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
          />
        </div>

        {/* Notes */}
        {isNotes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm transition cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${note.color}`}
                    >
                      {note.tag}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {note.date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    {note.title}
                  </h4>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}

          </div>
        ) : (

          /* Contacts */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredContacts.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-card transition flex flex-col items-center text-center space-y-3"
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-50"
                />

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {c.name}
                  </h4>

                  <p className="text-xs text-emerald-600 font-semibold">
                    {c.role}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p>{c.email}</p>
                  <p>{c.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openEditContact(c)}
                  aria-label={`Edit ${c.name}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Edit Contact
                </button>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-3 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className={`my-auto max-h-[calc(100dvh-24px)] w-full overflow-y-auto bg-white shadow-2xl ${isNotes ? 'max-w-md rounded-3xl p-6' : 'max-w-[340px] rounded-md px-5 py-4'}`}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className={`flex items-center justify-between ${isNotes ? 'mb-6' : 'mb-4'}`}>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {isNotes ? 'Add New Note' : editingContactId ? 'Edit Contact' : 'New Contact'}
                </h2>

                {isNotes && <p className="mt-1 text-xs text-slate-400">Enter the details below</p>}
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close form"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* CONTACT FORM */}
            {!isNotes ? (
              <form onSubmit={handleAddContact} className="space-y-3">
                <label className="mx-auto mb-1 flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 text-slate-500 hover:border-emerald-500 hover:text-emerald-600">
                  {newContact.avatar ? (
                    <img src={newContact.avatar} alt="Contact profile preview" className="h-full w-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="text-2xl leading-none">+</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    aria-label="Upload contact photo"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) setNewContact((current) => ({ ...current, avatar: URL.createObjectURL(file) }))
                    }}
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-[9px] text-slate-500">
                    First Name
                    <input required value={newContact.firstName} onChange={(event) => setNewContact({ ...newContact, firstName: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-emerald-500" />
                  </label>
                  <label className="block text-[9px] text-slate-500">
                    Last Name
                    <input required value={newContact.lastName} onChange={(event) => setNewContact({ ...newContact, lastName: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-emerald-500" />
                  </label>
                </div>

                <label className="block text-[9px] text-slate-500">
                  Email
                  <input required type="email" value={newContact.email} onChange={(event) => setNewContact({ ...newContact, email: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-emerald-500" />
                </label>

                <label className="block text-[9px] text-slate-500">
                  Phone
                  <span className="mt-1 flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-emerald-500">
                    <select aria-label="Country calling code" value={newContact.countryCode} onChange={(event) => setNewContact({ ...newContact, countryCode: event.target.value })} className="border-r border-slate-200 bg-slate-50 px-2 text-[10px] text-slate-700 outline-none">
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                      <option value="+61">+61</option>
                    </select>
                    <input required aria-label="Phone number" type="tel" value={newContact.phone} onChange={(event) => setNewContact({ ...newContact, phone: event.target.value })} className="min-w-0 flex-1 px-2.5 py-2 text-[10px] text-slate-700 outline-none" />
                  </span>
                </label>

                <label className="block text-[9px] text-slate-500">
                  Job Title
                  <input required value={newContact.role} onChange={(event) => setNewContact({ ...newContact, role: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-emerald-500" />
                </label>

                <label className="block text-[9px] text-slate-500">
                  Address
                  <input value={newContact.address} onChange={(event) => setNewContact({ ...newContact, address: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-emerald-500" />
                </label>

                <fieldset>
                  <legend className="mb-1 text-[9px] text-slate-500">Date of Birth</legend>
                  <div className="grid grid-cols-3 gap-2">
                    <select aria-label="Birth day" value={newContact.birthDay} onChange={(event) => setNewContact({ ...newContact, birthDay: event.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] text-slate-600 outline-none">
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, index) => String(index + 1)).map((day) => <option key={day}>{day}</option>)}
                    </select>
                    <select aria-label="Birth month" value={newContact.birthMonth} onChange={(event) => setNewContact({ ...newContact, birthMonth: event.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] text-slate-600 outline-none">
                      <option value="">Month</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => <option key={month}>{month}</option>)}
                    </select>
                    <select aria-label="Birth year" value={newContact.birthYear} onChange={(event) => setNewContact({ ...newContact, birthYear: event.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] text-slate-600 outline-none">
                      <option value="">Year</option>
                      {Array.from({ length: 110 }, (_, index) => String(new Date().getFullYear() - index)).map((year) => <option key={year}>{year}</option>)}
                    </select>
                  </div>
                </fieldset>

                <label className="block text-[9px] text-slate-500">
                  Notes
                  <textarea value={newContact.notes} onChange={(event) => setNewContact({ ...newContact, notes: event.target.value })} rows={3} placeholder="Type something" className="mt-1 block w-full resize-y rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-emerald-500" />
                </label>

                <div className="flex justify-end pt-1">
                  <button type="submit" className="rounded-lg bg-[#16A34A] px-4 py-2 text-[10px] font-bold text-white hover:bg-[#15803d]">
                    {editingContactId ? 'Save Changes' : 'Add Contact'}
                  </button>
                </div>
              </form>
            ) : (

              /* NOTE FORM */
              <form onSubmit={handleAddNote} className="space-y-4">

                <input
                  type="text"
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({
                      ...newNote,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />

                <select
                  value={newNote.tag}
                  onChange={(e) =>
                    setNewNote({
                      ...newNote,
                      tag: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                >
                  <option>General</option>
                  <option>Design</option>
                  <option>Meeting</option>
                  <option>Dev</option>
                  <option>Important</option>
                </select>

                <textarea
                  rows="5"
                  placeholder="Write your note..."
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({
                      ...newNote,
                      content: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-[#16A34A] hover:bg-[#15803d] text-white text-sm font-bold"
                  >
                    Add Note
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}