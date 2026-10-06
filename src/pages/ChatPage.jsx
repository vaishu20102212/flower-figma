import React, { useState } from 'react'
import { chatContacts } from '../data/mockData'
import {
  SearchIcon,
  SendIcon,
  PaperclipIcon,
  MoreVerticalIcon,
} from '../icons/FlowerIcons'

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(chatContacts[0])
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'them',
      text: 'Hi there! Have you had a chance to review the updated Figma designs?',
      time: '12:30 PM',
    },
    {
      id: 2,
      sender: 'me',
      text: 'Yes! The colors and components look super clean. Implementing them in React now.',
      time: '12:35 PM',
    },
    {
      id: 3,
      sender: 'them',
      text: 'Awesome! Let me know if you need any specific icons or asset exports.',
      time: '12:40 PM',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [emojiSearch, setEmojiSearch] = useState('')
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('Smileys')

  const emojiCategories = {
    Smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😍', '🥰', '😘', '😋', '😎', '🤔', '😭', '😡', '🥳', '🤩', '😴'],
    Nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐸', '🐵', '🐔', '🐧', '🦋', '🌷', '🌸', '🌻', '🌹', '🌈', '☀️', '🌙'],
    Food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥑', '🍕', '🍔', '🍟', '🍰', '🍩', '☕', '🧁', '🍪', '🍫'],
    Activity: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🥋', '⛳', '🎯', '🎮', '🎲', '🎸', '🎹', '🎤', '🎨', '🏆', '🥇', '🎳', '🪁'],
    Travel: ['🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚲', '🛵', '🚆', '✈️', '🚀', '🚁', '⛵', '🚢', '🏠', '🏖️', '🏕️', '🌋', '🌍', '🌃', '🗽', '🗺️'],
    Objects: ['⌚', '📱', '💻', '⌨️', '🖥️', '📷', '🎥', '💡', '🔦', '📕', '📚', '✏️', '🖊️', '📎', '🔒', '🔑', '🎁', '🎈', '🧸', '💐', '📦', '📌', '🧹', '🪴'],
    Symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '💕', '💯', '💢', '💬', '💤', '♻️', '✅', '❌', '⭐', '✨', '⚡', '🔥', '🎵', '🔔', '➕'],
  }
  const emojiSearchTerms = {
    smile: emojiCategories.Smileys,
    happy: emojiCategories.Smileys,
    laugh: ['😆', '😂', '🤣', '😅'],
    heart: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💕', '💔'],
    animal: emojiCategories.Nature.slice(0, 16),
    flower: ['🌷', '🌸', '🌻', '🌹'],
    plant: ['🌷', '🌸', '🌻', '🌹', '🪴'],
    fruit: emojiCategories.Food.slice(0, 15),
    food: emojiCategories.Food,
    sport: emojiCategories.Activity,
    music: ['🎸', '🎹', '🎤', '🎵'],
    travel: emojiCategories.Travel,
    car: ['🚗', '🚕', '🏎️', '🚓'],
    plane: ['✈️', '🚀', '🚁'],
    object: emojiCategories.Objects,
    symbol: emojiCategories.Symbols,
    nature: emojiCategories.Nature,
    activity: emojiCategories.Activity,
  }
  const searchTerm = emojiSearch.trim().toLowerCase()
  const visibleEmojis = searchTerm
    ? Object.values(emojiCategories).flat().filter((emoji) =>
      emoji.includes(searchTerm) ||
      Object.entries(emojiSearchTerms).some(([term, matches]) =>
        term.startsWith(searchTerm) && matches.includes(emoji),
      ),
    )
    : emojiCategories[activeEmojiCategory]

  const handleSendMessage = () => {
    if (!inputText.trim()) return
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([...messages, newMsg])
    setInputText('')
  }

  const addEmoji = (emoji) => {
    setInputText((current) => `${current}${emoji}`)
    setIsEmojiPickerOpen(false)
    setEmojiSearch('')
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 min-h-[720px] flex flex-col md:flex-row overflow-hidden">
        {/* Left Contacts List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 mb-3">Chats</h2>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {chatContacts.map((contact) => {
              const isSelected = selectedContact.id === contact.id
              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                    isSelected ? 'bg-emerald-50/40 border-l-4 border-[#16A34A]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">{contact.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {contact.lastMsg}
                    </p>
                  </div>

                  {contact.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Active Chat Thread */}
        <div className="flex-1 flex flex-col justify-between bg-slate-50/30">
          {/* Top Bar */}
          <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {selectedContact.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">{selectedContact.name}</h3>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  {selectedContact.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
              <MoreVerticalIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => {
              const isMe = m.sender === 'me'
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={selectedContact.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  )}
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-[#16A34A] text-white rounded-br-sm'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 font-medium ${
                        isMe ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Attach file"
                  className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  <PaperclipIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Open emoji picker"
                  aria-expanded={isEmojiPickerOpen}
                  onClick={() => setIsEmojiPickerOpen((open) => !open)}
                  className="rounded-xl p-2 text-lg leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  😊
                </button>
                {isEmojiPickerOpen && (
                  <div className="absolute bottom-12 left-0 z-20 w-64 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl">
                    <label className="relative block">
                      <SearchIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        autoFocus
                        type="search"
                        value={emojiSearch}
                        onChange={(event) => setEmojiSearch(event.target.value)}
                        placeholder="Search..."
                        aria-label="Search emojis"
                        className="w-full rounded-full bg-slate-100 py-1.5 pl-8 pr-3 text-[10px] text-slate-700 outline-none focus:ring-1 focus:ring-emerald-300"
                      />
                    </label>
                    <p className="mb-1 mt-2.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
                      {emojiSearch.trim() ? 'Results' : activeEmojiCategory}
                    </p>
                    <div className="grid max-h-36 grid-cols-8 gap-0.5 overflow-y-auto">
                      {visibleEmojis.map((emoji, index) => (
                        <button
                          key={`${emoji}-${index}`}
                          type="button"
                          onClick={() => addEmoji(emoji)}
                          aria-label={`Add ${emoji} emoji`}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-base hover:bg-slate-100"
                        >
                          {emoji}
                        </button>
                      ))}
                      {visibleEmojis.length === 0 && (
                        <p className="col-span-8 py-4 text-center text-[10px] text-slate-400">No emojis found</p>
                      )}
                    </div>
                    {!emojiSearch.trim() && (
                      <div className="mt-2 flex justify-between border-t border-slate-100 pt-1.5">
                        {[
                          ['Smileys', '☺'],
                          ['Nature', '♧'],
                          ['Food', '♡'],
                          ['Activity', '⚽'],
                          ['Travel', '♧'],
                          ['Objects', '▣'],
                          ['Symbols', '⚑'],
                        ].map(([category, icon]) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setActiveEmojiCategory(category)}
                            aria-label={`${category} emojis`}
                            aria-pressed={activeEmojiCategory === category}
                            className={`h-6 w-6 rounded-md text-xs ${activeEmojiCategory === category ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-100'}`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
              />

              <button
                type="submit"
                className="p-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-2xl shadow-sm transition"
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
