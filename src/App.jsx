import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import CalendarPage from './pages/CalendarPage'
import MailPage from './pages/MailPage'
import TaskPage from './pages/TaskPage'
import ProjectsPage from './pages/ProjectsPage'
import FileManagerPage from './pages/FileManagerPage'
import ChatPage from './pages/ChatPage'
import NotesContactsPage from './pages/NotesContactsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default Overview Dashboard (folder 1) */}
          <Route index element={<Dashboard />} />

          {/* E-Commerce Modules (folder 2 & folder 3) */}
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<NotesContactsPage type="contacts" />} />

          {/* Calendar (folder 4) */}
          <Route path="calendar" element={<CalendarPage />} />

          {/* Mail (folder 5) */}
          <Route path="mail" element={<MailPage />} />

          {/* Social & Chat (New folder) */}
          <Route path="chat" element={<ChatPage />} />

          {/* Task Board (folder 6) */}
          <Route path="tasks" element={<TaskPage />} />

          {/* Projects (folder 7) */}
          <Route path="projects" element={<ProjectsPage />} />

          {/* File Manager (folder 8) */}
          <Route path="files" element={<FileManagerPage />} />

          {/* Notes & Contacts */}
          <Route path="notes" element={<NotesContactsPage type="notes" />} />
          <Route path="contacts" element={<NotesContactsPage type="contacts" />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
