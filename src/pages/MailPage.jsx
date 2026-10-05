import React, { useEffect, useMemo, useRef, useState } from 'react'
import { mailMessages } from '../data/mockData'
import {
  SearchIcon,
  PlusIcon,
  PaperclipIcon,
  SendIcon,
  BookmarkIcon,
  DownloadIcon,
  CloseIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
} from '../icons/FlowerIcons'

const initialLabels = ['Personal', 'Work', 'Friends', 'Family', 'Social']
const mailStorageKey = 'flower-dashboard-mail-v1'

function loadMailState() {
  const defaults = {
    messages: mailMessages.map((message, index) => ({
      ...message,
      folder: 'Inbox',
      isImportant: index < 4,
    })),
    labels: initialLabels,
  }

  try {
    const saved = window.localStorage.getItem(mailStorageKey)
    if (!saved) return defaults
    const state = JSON.parse(saved)
    if (!Array.isArray(state.messages) || !Array.isArray(state.labels)) {
      throw new Error('Saved mail data has an invalid format.')
    }
    return state
  } catch (error) {
    console.error('Unable to load saved mail data.', error)
    return defaults
  }
}

function createMessageId(messages) {
  return Math.max(Date.now(), ...messages.map((message) => Number(message.id) || 0)) + 1
}

function createEmptyCompose() {
  return { to: '', cc: '', bcc: '', subject: '', content: '', draftId: null }
}

export default function MailPage() {
  const [storedMailState] = useState(loadMailState)
  const [messages, setMessages] = useState(storedMailState.messages)
  const [selectedId, setSelectedId] = useState(storedMailState.messages[0]?.id ?? null)
  const [activeFolder, setActiveFolder] = useState('Inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [labels, setLabels] = useState(storedMailState.labels)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [compose, setCompose] = useState(createEmptyCompose)
  const [composeFiles, setComposeFiles] = useState([])
  const [replyText, setReplyText] = useState('')
  const [replyFiles, setReplyFiles] = useState([])
  const [replyCc, setReplyCc] = useState('')
  const [replyBcc, setReplyBcc] = useState('')
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [notice, setNotice] = useState('')
  const replyRef = useRef(null)
  const replyFileRef = useRef(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(mailStorageKey, JSON.stringify({ messages, labels }))
    } catch (error) {
      console.error('Unable to save mail data.', error)
      setNotice('Mail changes could not be saved in this browser.')
    }
  }, [labels, messages])

  const folderCount = (folder) => {
    if (folder === 'Marked') return messages.filter((message) => message.isMarked && message.folder !== 'Deleted').length
    if (folder === 'Important') return messages.filter((message) => message.isImportant && message.folder !== 'Deleted').length
    return messages.filter((message) => message.folder === folder).length
  }

  const folders = [
    { name: 'Inbox', icon: '📥' },
    { name: 'Marked', icon: '⭐' },
    { name: 'Drafts', icon: '✏️' },
    { name: 'Sent', icon: '✈️' },
    { name: 'Important', icon: '🔖' },
    { name: 'Deleted', icon: '🗑️' },
  ]

  const visibleMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const matching = messages.filter((message) => {
      const inFolder = labels.includes(activeFolder)
        ? message.tag === activeFolder && message.folder !== 'Deleted'
        : activeFolder === 'Marked'
          ? message.isMarked && message.folder !== 'Deleted'
          : activeFolder === 'Important'
            ? message.isImportant && message.folder !== 'Deleted'
            : message.folder === activeFolder
      const matchesSearch = !query || [
        message.sender,
        message.email,
        message.to,
        message.subject,
        message.preview,
        message.content,
        message.tag,
      ].some((value) => value?.toLowerCase().includes(query))
      return inFolder && matchesSearch
    })

    return matching.sort((first, second) =>
      sortOrder === 'oldest'
        ? Number(first.id) - Number(second.id)
        : Number(second.id) - Number(first.id),
    )
  }, [activeFolder, labels, messages, searchQuery, sortOrder])

  const selectedMail =
    visibleMessages.find((message) => message.id === selectedId) ?? visibleMessages[0] ?? null

  const updateMessage = (id, changes) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, ...changes } : message)),
    )
  }

  const openCompose = (draft = null) => {
    setNotice('')
    setCompose(
      draft
        ? {
            to: draft.to ?? '',
            cc: draft.cc ?? '',
            bcc: draft.bcc ?? '',
            subject: draft.subject === '(no subject)' ? '' : draft.subject,
            content: draft.content ?? '',
            draftId: draft.id,
          }
        : createEmptyCompose(),
    )
    setComposeFiles([])
    setShowCc(Boolean(draft?.cc))
    setShowBcc(Boolean(draft?.bcc))
    setShowComposeModal(true)
  }

  const closeCompose = () => {
    setShowComposeModal(false)
    setCompose(createEmptyCompose())
    setComposeFiles([])
  }

  const discardCompose = () => {
    if (compose.draftId) {
      setMessages((current) => current.filter((message) => message.id !== compose.draftId))
    }
    closeCompose()
    setNotice('Draft discarded.')
  }

  const makeDraftMessage = (draftId = createMessageId(messages)) => ({
    id: draftId,
    sender: compose.to || 'Draft',
    email: compose.to,
    to: compose.to,
    cc: compose.cc,
    bcc: compose.bcc,
    avatar: '/user-avatar.png',
    subject: compose.subject.trim() || '(no subject)',
    preview: compose.content.trim().slice(0, 100) || 'Draft message',
    date: new Date().toLocaleString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hasAttachment: composeFiles.length > 0,
    isMarked: false,
    isImportant: false,
    tag: 'Personal',
    content: compose.content,
    attachments: composeFiles.map((file) => ({
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      type: file.name.split('.').pop(),
      file,
    })),
    folder: 'Drafts',
  })

  const saveDraft = () => {
    const draft = makeDraftMessage(compose.draftId ?? undefined)
    setMessages((current) => {
      const exists = current.some((message) => message.id === draft.id)
      return exists
        ? current.map((message) => (message.id === draft.id ? draft : message))
        : [draft, ...current]
    })
    setActiveFolder('Drafts')
    setSelectedId(draft.id)
    closeCompose()
    setNotice('Draft saved.')
  }

  const sendComposedMessage = (event) => {
    event.preventDefault()
    if (!compose.to.trim() || !compose.subject.trim() || !compose.content.trim()) {
      setNotice('Add a recipient, subject, and message before sending.')
      return
    }

    const sentMessage = {
      ...makeDraftMessage(compose.draftId ?? undefined),
      id: compose.draftId ?? createMessageId(messages),
      sender: compose.to.trim(),
      email: compose.to.trim(),
      preview: compose.content.trim().slice(0, 100),
      date: new Date().toLocaleString(),
      folder: 'Sent',
    }
    setMessages((current) => [
      sentMessage,
      ...current.filter((message) => message.id !== compose.draftId),
    ])
    setActiveFolder('Sent')
    setSelectedId(sentMessage.id)
    closeCompose()
    setNotice('Message sent in this demo.')
  }

  const sendReply = () => {
    if (!selectedMail || !replyText.trim()) {
      setNotice('Write a reply before sending.')
      return
    }
    const recipient = selectedMail.sender === 'You' ? selectedMail.to : selectedMail.email
    if (!recipient) {
      setNotice('The recipient email address is missing.')
      return
    }
    const reply = {
      id: createMessageId(messages),
      sender: 'You',
      email: 'you@flower.local',
      to: recipient,
      cc: replyCc,
      bcc: replyBcc,
      avatar: '/user-avatar.png',
      subject: `Re: ${selectedMail.subject}`,
      preview: replyText.trim().slice(0, 100),
      date: new Date().toLocaleString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasAttachment: replyFiles.length > 0,
      isMarked: false,
      isImportant: false,
      tag: selectedMail.tag || 'Personal',
      content: replyText.trim(),
      attachments: replyFiles.map((file) => ({
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        type: file.name.split('.').pop(),
        file,
      })),
      folder: 'Sent',
    }
    setMessages((current) => [reply, ...current])
    setActiveFolder('Sent')
    setSelectedId(reply.id)
    setReplyText('')
    setReplyFiles([])
    setReplyCc('')
    setReplyBcc('')
    setNotice('Reply sent in this demo.')
  }

  const addLabel = () => {
    const label = window.prompt('Name your label')
    if (!label?.trim()) return
    const cleanLabel = label.trim()
    if (labels.some((existing) => existing.toLowerCase() === cleanLabel.toLowerCase())) {
      setNotice('That label already exists.')
      return
    }
    setLabels((current) => [...current, cleanLabel])
    setNotice(`Label "${cleanLabel}" added. Select an email and assign it from the actions menu.`)
  }

  const downloadAttachment = (attachment) => {
    if (!attachment.file) {
      setNotice(`"${attachment.name}" is sample data; there is no file to download.`)
      return
    }
    const url = URL.createObjectURL(attachment.file)
    const link = document.createElement('a')
    link.href = url
    link.download = attachment.name
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const insertReplyFormatting = (before, after = before) => {
    const textarea = replyRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = replyText.slice(start, end)
    const replacement = `${before}${selected || 'text'}${after}`
    const nextText = `${replyText.slice(0, start)}${replacement}${replyText.slice(end)}`
    setReplyText(nextText)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length)
    })
  }

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 min-h-[780px] flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-60 border-b lg:border-b-0 lg:border-r border-slate-100 p-5 flex flex-col bg-white">
          <button
            onClick={() => openCompose()}
            className="w-full py-3 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>NEW MESSAGE</span>
          </button>

          <nav aria-label="Mail folders" className="mt-6 space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setActiveFolder(folder.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeFolder === folder.name
                    ? 'bg-slate-100 text-slate-800'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">{folder.icon}</span>
                  <span>{folder.name}</span>
                </span>
                {folderCount(folder.name) > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {folderCount(folder.name)}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Labels</span>
              <button
                type="button"
                onClick={addLabel}
                aria-label="Add label"
                className="text-slate-400 hover:text-slate-700"
              >
                +
              </button>
            </div>
            {labels.map((label) => (
              <button
                key={label}
                onClick={() => setActiveFolder(label)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeFolder === label
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                • {label}
              </button>
            ))}
          </div>
        </aside>

        <section className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col bg-slate-50/40">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search mail..."
                aria-label="Search mail"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200/80 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
              />
            </div>
            <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <span className="sr-only">Sort mail</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="max-w-[82px] bg-transparent focus:outline-none cursor-pointer"
                aria-label="Sort mail"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <ChevronDownIcon className="w-3 h-3 text-slate-400 pointer-events-none" />
            </label>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {visibleMessages.map((mail) => (
              <button
                type="button"
                key={mail.id}
                onClick={() => setSelectedId(mail.id)}
                className={`w-full text-left p-4 transition ${
                  selectedMail?.id === mail.id
                    ? 'bg-white shadow-xs border-l-4 border-[#16A34A]'
                    : 'hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={mail.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 truncate">{mail.sender}</span>
                      <span className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        {mail.hasAttachment && <PaperclipIcon className="w-3 h-3" />}
                        {mail.time}
                      </span>
                    </span>
                    <span className="block text-xs font-semibold text-slate-700 truncate mt-0.5">{mail.subject}</span>
                    <span className="block text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-relaxed">{mail.preview}</span>
                    <span className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {mail.tag}
                      </span>
                      <span className="flex gap-1">
                        {mail.isImportant && <span aria-label="Important" title="Important">🔖</span>}
                        {mail.isMarked && <span aria-label="Marked" title="Marked">⭐</span>}
                      </span>
                    </span>
                  </span>
                </div>
              </button>
            ))}
            {visibleMessages.length === 0 && (
              <p className="p-6 text-center text-xs text-slate-400">
                {searchQuery ? 'No messages match your search.' : 'This folder is empty.'}
              </p>
            )}
          </div>
        </section>

        <section className="flex-1 flex flex-col p-5 md:p-6 space-y-5 bg-white overflow-y-auto">
          {selectedMail ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={selectedMail.avatar}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800">{selectedMail.sender}</h3>
                    <p className="text-xs text-emerald-600 font-medium truncate">{selectedMail.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{selectedMail.date}</span>
                  <button
                    type="button"
                    onClick={() => updateMessage(selectedMail.id, { isMarked: !selectedMail.isMarked })}
                    aria-label={selectedMail.isMarked ? 'Remove mark' : 'Mark message'}
                    title={selectedMail.isMarked ? 'Remove mark' : 'Mark message'}
                    className="p-1.5 hover:bg-slate-100 rounded-lg"
                  >
                    <BookmarkIcon className={`w-4 h-4 ${selectedMail.isMarked ? 'text-rose-500' : 'text-slate-400'}`} />
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowActions((current) => !current)}
                      aria-label="More email actions"
                      aria-expanded={showActions}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
                    >
                      <MoreVerticalIcon className="w-4 h-4" />
                    </button>
                    {showActions && (
                      <div className="absolute right-0 top-9 z-10 w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-xl">
                        <button
                          onClick={() => {
                            updateMessage(selectedMail.id, { isImportant: !selectedMail.isImportant })
                            setShowActions(false)
                          }}
                          className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                        >
                          {selectedMail.isImportant ? 'Remove importance' : 'Mark important'}
                        </button>
                        {selectedMail.folder === 'Deleted' ? (
                          <>
                            <button
                              onClick={() => {
                                updateMessage(selectedMail.id, { folder: 'Inbox' })
                                setActiveFolder('Inbox')
                                setShowActions(false)
                                setNotice('Message restored to Inbox.')
                              }}
                              className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                            >
                              Restore to Inbox
                            </button>
                            <button
                              onClick={() => {
                                setMessages((current) => current.filter((message) => message.id !== selectedMail.id))
                                setShowActions(false)
                                setNotice('Message permanently deleted.')
                              }}
                              className="block w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50"
                            >
                              Delete permanently
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                updateMessage(selectedMail.id, { folder: 'Deleted' })
                                setActiveFolder('Deleted')
                                setShowActions(false)
                                setNotice('Message moved to Deleted.')
                              }}
                              className="block w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50"
                            >
                              Move to Deleted
                            </button>
                            {labels.map((label) => (
                              <button
                                key={label}
                                onClick={() => {
                                  updateMessage(selectedMail.id, { tag: label })
                                  setShowActions(false)
                                  setNotice(`Label "${label}" assigned.`)
                                }}
                                className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                              >
                                Label: {label}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedMail.folder === 'Drafts' && (
                    <button
                      onClick={() => openCompose(selectedMail)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold"
                    >
                      Edit draft
                    </button>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{selectedMail.subject}</h2>
              <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedMail.content}</div>

              {selectedMail.attachments?.length > 0 && (
                <div className="pt-2">
                  <h5 className="text-xs font-bold text-slate-700 mb-3">Attachments:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                    {selectedMail.attachments.map((attachment, index) => (
                      <div key={`${attachment.name}-${index}`} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl">{attachment.type === 'pdf' ? '📄' : '📦'}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{attachment.name}</p>
                            <p className="text-[10px] text-slate-400">{attachment.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadAttachment(attachment)}
                          aria-label={`Download ${attachment.name}`}
                          className="p-1.5 rounded-xl bg-white text-slate-500 shadow-xs hover:text-slate-900"
                        >
                          <DownloadIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMail.folder !== 'Drafts' && selectedMail.folder !== 'Deleted' && (
                <div className="pt-5 border-t border-slate-100 space-y-3 mt-auto">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">To:</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold">
                      {selectedMail.sender === 'You' ? selectedMail.to : selectedMail.email}
                    </span>
                    <button type="button" onClick={() => setShowCc((current) => !current)} className="ml-auto text-[11px] text-slate-500 hover:text-slate-800">Cc</button>
                    <button type="button" onClick={() => setShowBcc((current) => !current)} className="text-[11px] text-slate-500 hover:text-slate-800">Bcc</button>
                  </div>
                  {(showCc || showBcc) && (
                    <div className="flex gap-2">
                      {showCc && <input type="email" value={replyCc} onChange={(event) => setReplyCc(event.target.value)} placeholder="Cc recipient" aria-label="Cc recipient" className="w-1/2 px-3 py-2 text-xs border border-slate-200 rounded-xl" />}
                      {showBcc && <input type="email" value={replyBcc} onChange={(event) => setReplyBcc(event.target.value)} placeholder="Bcc recipient" aria-label="Bcc recipient" className="w-1/2 px-3 py-2 text-xs border border-slate-200 rounded-xl" />}
                    </div>
                  )}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#B4F481]">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold">
                      <button type="button" onClick={() => insertReplyFormatting('**')} aria-label="Bold" className="p-1.5 hover:bg-slate-200 rounded font-bold">B</button>
                      <button type="button" onClick={() => insertReplyFormatting('_')} aria-label="Italic" className="p-1.5 hover:bg-slate-200 rounded italic">I</button>
                      <button type="button" onClick={() => insertReplyFormatting('<u>', '</u>')} aria-label="Underline" className="p-1.5 hover:bg-slate-200 rounded underline">U</button>
                      <button type="button" onClick={() => insertReplyFormatting('• ' , '')} aria-label="Bullet point" className="p-1.5 hover:bg-slate-200 rounded">•</button>
                      <button type="button" onClick={() => insertReplyFormatting('😊', '')} aria-label="Insert emoji" className="p-1.5 hover:bg-slate-200 rounded">😊</button>
                    </div>
                    <textarea
                      ref={replyRef}
                      rows="4"
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-4 text-xs bg-white text-slate-700 placeholder-slate-400 focus:outline-none resize-y"
                    />
                    <div className="flex items-center justify-between p-3 bg-white border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={sendReply}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm transition"
                        >
                          Send <SendIcon className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => replyFileRef.current?.click()} aria-label="Attach file to reply" className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50">
                          <PaperclipIcon className="w-4 h-4" />
                        </button>
                        <input
                          ref={replyFileRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(event) => setReplyFiles((current) => [...current, ...Array.from(event.target.files ?? [])])}
                        />
                        {replyFiles.map((file) => <span key={`${file.name}-${file.lastModified}`} className="text-[10px] text-slate-500">{file.name}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-slate-400">
              <div>
                <p className="text-3xl mb-2">✉️</p>
                <p className="font-semibold">No message selected</p>
                <p className="mt-1 text-xs">Choose a message or compose a new one.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {notice && (
        <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification"><CloseIcon className="w-4 h-4" /></button>
        </div>
      )}

      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={sendComposedMessage} className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeCompose}
              aria-label="Close compose"
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-4">{compose.draftId ? 'Edit Draft' : 'Compose New Message'}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="mail-to" className="block text-xs font-semibold text-slate-500 mb-1">To</label>
                <input id="mail-to" type="email" required value={compose.to} onChange={(event) => setCompose((current) => ({ ...current, to: event.target.value }))} placeholder="recipient@example.com" className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]" />
              </div>
              {showCc && (
                <div>
                  <label htmlFor="mail-cc" className="block text-xs font-semibold text-slate-500 mb-1">Cc</label>
                  <input id="mail-cc" type="email" value={compose.cc} onChange={(event) => setCompose((current) => ({ ...current, cc: event.target.value }))} placeholder="cc@example.com" className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              )}
              {showBcc && (
                <div>
                  <label htmlFor="mail-bcc" className="block text-xs font-semibold text-slate-500 mb-1">Bcc</label>
                  <input id="mail-bcc" type="email" value={compose.bcc} onChange={(event) => setCompose((current) => ({ ...current, bcc: event.target.value }))} placeholder="bcc@example.com" className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              )}
              <div className="flex gap-3 text-xs">
                {!showCc && <button type="button" onClick={() => setShowCc(true)} className="text-slate-500 hover:text-slate-800">Add Cc</button>}
                {!showBcc && <button type="button" onClick={() => setShowBcc(true)} className="text-slate-500 hover:text-slate-800">Add Bcc</button>}
              </div>
              <div>
                <label htmlFor="mail-subject" className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                <input id="mail-subject" type="text" required value={compose.subject} onChange={(event) => setCompose((current) => ({ ...current, subject: event.target.value }))} placeholder="Subject title..." className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]" />
              </div>
              <div>
                <label htmlFor="mail-content" className="block text-xs font-semibold text-slate-500 mb-1">Message</label>
                <textarea id="mail-content" rows="6" required value={compose.content} onChange={(event) => setCompose((current) => ({ ...current, content: event.target.value }))} placeholder="Write your email here..." className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]" />
              </div>
              <div>
                <label htmlFor="compose-files" className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-800">
                  <PaperclipIcon className="w-4 h-4" /> Attach files
                </label>
                <input id="compose-files" type="file" multiple onChange={(event) => setComposeFiles((current) => [...current, ...Array.from(event.target.files ?? [])])} className="sr-only" />
                {composeFiles.map((file, index) => (
                  <div key={`${file.name}-${file.lastModified}`} className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>{file.name} ({Math.max(1, Math.round(file.size / 1024))} KB)</span>
                    <button type="button" onClick={() => setComposeFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} aria-label={`Remove ${file.name}`}><CloseIcon className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={discardCompose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800">Discard</button>
                <button type="button" onClick={saveDraft} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900">Save draft</button>
                <button type="submit" className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm transition">Send Message</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
