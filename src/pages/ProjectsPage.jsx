import React, { useState } from 'react'
import { projectsList } from '../data/mockData'
import {
  PlusIcon,
  MoreVerticalIcon,
  CalendarIcon,
  CloseIcon,
} from '../icons/FlowerIcons'

export default function ProjectsPage() {
  const [projects, setProjects] = useState(projectsList)
  const [activeFilter, setActiveFilter] = useState('All')
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Design & Web')

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'All') return true
    return p.status === activeFilter
  })

  const handleAddProject = () => {
    if (!newTitle.trim()) return
    const newProj = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      description: 'New high-priority client initiative roadmap.',
      progress: 10,
      status: 'In Progress',
      dueDate: 'Dec 01, 2026',
      tasksTotal: 12,
      tasksDone: 1,
      budget: '$24,000',
      team: [
        '/user-avatar.png',
      ],
    }
    setProjects([newProj, ...projects])
    setNewTitle('')
    setShowAddProjectModal(false)
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Projects
        </h1>

        <button
          onClick={() => setShowAddProjectModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm transition self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'In Progress', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              activeFilter === tab
                ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-slate-100 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {proj.category}
                </span>

                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreVerticalIcon className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {proj.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Progress</span>
                  <span className="text-emerald-600">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Tasks: {proj.tasksDone}/{proj.tasksTotal}</span>
                  <span>Budget: {proj.budget}</span>
                </div>
              </div>
            </div>

            {/* Footer: Due date & Team stack */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{proj.dueDate}</span>
              </div>

              <div className="flex items-center -space-x-2">
                {proj.team.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt="Member"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowAddProjectModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Project</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI Cloud Platform"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category label"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />
              </div>

              <button
                onClick={handleAddProject}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs rounded-2xl shadow-sm transition mt-2"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
