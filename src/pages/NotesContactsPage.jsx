import React, { useState } from 'react'
import {
  PlusIcon,
  SearchIcon,
} from '../icons/FlowerIcons'

export default function NotesContactsPage({ type = 'notes' }) {
  const isNotes = type === 'notes'
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
  })

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
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleAddContact = (e) => {
    e.preventDefault()

    if (
      !newContact.name.trim() ||
      !newContact.email.trim() ||
      !newContact.role.trim() ||
      !newContact.phone.trim()
    ) {
      return
    }

    const contact = {
      id: Date.now(),
      ...newContact,
      avatar: '/user-avatar.png',
    }

    setContactsList((prev) => [...prev, contact])

    setNewContact({
      name: '',
      email: '',
      role: '',
      phone: '',
    })

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
              </div>
            ))}

          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add New {isNotes ? 'Note' : 'Contact'}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Enter the details below
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* CONTACT FORM */}
            {!isNotes ? (
              <form onSubmit={handleAddContact} className="space-y-4">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />

                <input
                  type="text"
                  placeholder="Job Title"
                  value={newContact.role}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
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
                    Add Contact
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
        </div>
      )}
    </div>
  )
}