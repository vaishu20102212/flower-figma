import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { projectsList } from '../data/mockData'
import {
  PlusIcon,
  MoreVerticalIcon,
  CalendarIcon,
  CloseIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  ChevronDownIcon,
} from '../icons/FlowerIcons'

const initialTimelineLists = [
  {
    id: 'planning',
    name: 'Planning',
    color: '#4bcf83',
    start: 1,
    duration: 6,
    progress: 100,
    status: 'Completed',
    members: ['Shane Black'],
    children: [],
  },
  {
    id: 'wireframing',
    name: 'Wireframing',
    color: '#43d0df',
    start: 1,
    duration: 8,
    progress: 100,
    status: 'Completed',
    members: ['Judith Black'],
    children: [],
  },
  {
    id: 'design',
    name: 'Design',
    color: '#ffd84d',
    start: 2,
    duration: 10,
    progress: 60,
    status: 'Started',
    members: ['Shane Black'],
    children: [
      { id: 'font-research', name: 'Font Research', start: 3, duration: 6, progress: 100, status: 'Completed', members: ['Shane Black'] },
      { id: 'color-palette', name: 'Color Palette', start: 3, duration: 8, progress: 60, status: 'Started', members: ['Judith Black'] },
      { id: 'mockup', name: 'Mockup', start: 5, duration: 7, progress: 25, status: 'Started', members: ['Robert Edwards'] },
      { id: 'user-interface', name: 'User Interface', start: 7, duration: 9, progress: 50, status: 'Started', members: ['Felecia Brown'] },
      { id: 'illustrations', name: 'Illustrations', start: 9, duration: 7, progress: 100, status: 'Completed', members: ['Dustin Williamson'] },
      { id: 'animated-flow', name: 'Animated UI Flow', start: 3, duration: 7, progress: 0, status: 'On Hold', members: ['Shane Black'] },
    ],
  },
  {
    id: 'development',
    name: 'Development',
    color: '#5ad0bf',
    start: 11,
    duration: 6,
    progress: 50,
    status: 'Started',
    members: ['Felecia Brown'],
    children: [],
  },
  {
    id: 'testing',
    name: 'Testing',
    color: '#c87bf0',
    start: 14,
    duration: 4,
    progress: 0,
    status: 'On Hold',
    members: ['Robert Edwards'],
    children: [],
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(projectsList)
  const [activeFilter, setActiveFilter] = useState('All')
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState({ search: '', member: '', dueDate: 'any', status: 'all' })
  const [draftFilters, setDraftFilters] = useState(appliedFilters)
  const [viewMode, setViewMode] = useState('timeline')
  const [timelineMonth, setTimelineMonth] = useState(new Date(2020, 8, 1))
  const [timelineZoom, setTimelineZoom] = useState(1)
  const [collapsedLists, setCollapsedLists] = useState([])
  const [timelineLists, setTimelineLists] = useState(initialTimelineLists)
  const [openProjectMenu, setOpenProjectMenu] = useState(null)
  const [projectAction, setProjectAction] = useState(null)
  const [actionValues, setActionValues] = useState({
    title: '',
    company: '',
    description: '',
    startDate: '',
    dueDate: '',
    members: [],
    budget: '',
    status: 'Started',
    brandImage: '',
  })
  const [actionMemberToAdd, setActionMemberToAdd] = useState('')
  const [actionError, setActionError] = useState('')
  const [newProject, setNewProject] = useState({
    name: 'App Development',
    client: 'Dropbox, Inc.',
    description: 'Create a mobile application on iOS and Android devices.',
    startDate: '2020-07-12T00:00',
    endDate: '2020-12-07T00:00',
    members: ['Shane Black'],
    budget: '2500000',
    brandImage: '',
  })
  const [memberToAdd, setMemberToAdd] = useState('')
  const [newProjectError, setNewProjectError] = useState('')

  const projectTabs = [
    { label: 'All', count: 151 },
    { label: 'Started', count: 128 },
    { label: 'On Hold', count: 15 },
    { label: 'Completed', count: 8 },
  ]
  const filteredProjects = projects.filter((project) => {
    const matchesTab = activeFilter === 'All' ||
      (activeFilter === 'Started' && (project.status === 'Started' || project.status === 'In Progress')) ||
      (activeFilter !== 'Started' && project.status === activeFilter)
    const query = appliedFilters.search.trim().toLowerCase()
    const matchesSearch = !query || [project.title, project.company, project.description]
      .some((value) => value?.toLowerCase().includes(query))
    const matchesMember = !appliedFilters.member || project.teamMembers?.includes(appliedFilters.member)
    const projectDueDate = new Date(project.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const daysUntilDue = Math.ceil((projectDueDate - today) / (24 * 60 * 60 * 1000))
    const matchesDueDate = appliedFilters.dueDate === 'any' ||
      (appliedFilters.dueDate === 'upcoming' && daysUntilDue >= 0) ||
      (appliedFilters.dueDate === 'week' && daysUntilDue >= 0 && daysUntilDue <= 7) ||
      (appliedFilters.dueDate === 'overdue' && daysUntilDue < 0)
    const matchesStatus = appliedFilters.status === 'all' ||
      (appliedFilters.status === 'Started' && (project.status === 'Started' || project.status === 'In Progress')) ||
      (appliedFilters.status !== 'Started' && project.status === appliedFilters.status)
    return matchesTab && matchesSearch && matchesMember && matchesDueDate && matchesStatus
  })
  const projectMembers = [...new Set(projects.flatMap((project) => project.teamMembers || []))]
  const today = new Date()
  const timelineDays = Array.from({ length: 16 }, (_, index) => {
    const date = new Date(timelineMonth.getFullYear(), timelineMonth.getMonth(), index + 1)
    return {
      day: index + 1,
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      highlighted: (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) || (
        date.getDate() === 8 &&
        date.getMonth() === 8 &&
        date.getFullYear() === 2020
      ),
    }
  })

  const visibleTimelineLists = timelineLists.map((list) => ({
    ...list,
    children: list.children.filter((task) => {
      const query = appliedFilters.search.trim().toLowerCase()
      const matchesSearch = !query || task.name.toLowerCase().includes(query) || list.name.toLowerCase().includes(query)
      const matchesMember = !appliedFilters.member || task.members.includes(appliedFilters.member)
      const matchesStatus = appliedFilters.status === 'all' ||
        (appliedFilters.status === 'Started' && (task.status === 'Started' || task.status === 'In Progress')) ||
        task.status === appliedFilters.status
      return matchesSearch && matchesMember && matchesStatus
    }),
  })).filter((list) => {
    const query = appliedFilters.search.trim().toLowerCase()
    const matchesSearch = !query || list.name.toLowerCase().includes(query) || list.children.length > 0
    const matchesMember = !appliedFilters.member || list.members.includes(appliedFilters.member) || list.children.length > 0
    const matchesStatus = appliedFilters.status === 'all' ||
      (appliedFilters.status === 'Started' && (list.status === 'Started' || list.status === 'In Progress')) ||
      list.status === appliedFilters.status || list.children.length > 0
    return matchesSearch && matchesMember && matchesStatus
  })

  const addTimelineList = () => {
    const id = `list-${Date.now()}`
    setTimelineLists((current) => [...current, {
      id,
      name: 'New List',
      color: '#4bcf83',
      start: 1,
      duration: 4,
      progress: 0,
      status: 'Started',
      members: ['Shane Black'],
      children: [],
    }])
  }

  const matchesTimelineDueDate = (task) => {
    if (appliedFilters.dueDate === 'any') return true
    const dueDate = new Date(timelineMonth.getFullYear(), timelineMonth.getMonth(), task.start + task.duration - 1)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const daysUntilDue = Math.ceil((dueDate - today) / (24 * 60 * 60 * 1000))
    return appliedFilters.dueDate === 'upcoming'
      ? daysUntilDue >= 0
      : appliedFilters.dueDate === 'week'
        ? daysUntilDue >= 0 && daysUntilDue <= 7
        : daysUntilDue < 0
  }

  const updateNewProject = (field, value) => {
    setNewProject((current) => ({ ...current, [field]: value }))
    setNewProjectError('')
  }

  const handleAddProject = (event) => {
    event.preventDefault()
    if (!newProject.name.trim() || !newProject.client.trim() || !newProject.startDate || !newProject.endDate || !newProject.budget) {
      setNewProjectError('Please complete the required project details.')
      return
    }
    if (new Date(newProject.endDate) < new Date(newProject.startDate)) {
      setNewProjectError('End date must be on or after the start date.')
      return
    }
    const endDate = new Date(newProject.endDate)
    const daysUntilDue = Math.ceil((endDate - new Date()) / (24 * 60 * 60 * 1000))
    const timeLeft = daysUntilDue < 0
      ? 'Overdue'
      : daysUntilDue === 0
        ? 'Due today'
        : `${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} left`
    const newProj = {
      id: Date.now(),
      title: newProject.name.trim(),
      category: newProject.client.trim(),
      company: newProject.client.trim(),
      description: newProject.description.trim(),
      progress: 10,
      status: 'In Progress',
      dueDate: endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      tasksTotal: 12,
      tasksDone: 1,
      budget: `$${Number(newProject.budget).toLocaleString('en-US')}`,
      brand: newProject.name.slice(0, 1).toUpperCase(),
      brandImage: newProject.brandImage,
      brandColor: '#16a34a',
      timeLeft,
      startDate: newProject.startDate,
      teamMembers: newProject.members,
      team: newProject.members.map(() => '/user-avatar.png'),
    }
    setProjects((current) => [newProj, ...current])
    setNewProject({
      name: '',
      client: '',
      description: '',
      startDate: '',
      endDate: '',
      members: [],
      budget: '',
      brandImage: '',
    })
    setNewProjectError('')
    setShowAddProjectModal(false)
  }

  const openAction = (type, project) => {
    setOpenProjectMenu(null)
    setActionError('')
    const dueDateValue = project.dueDate ? new Date(project.dueDate) : new Date()
    const startDateValue = project.startDate ? new Date(project.startDate) : new Date(dueDateValue)
    if (!project.startDate) startDateValue.setDate(startDateValue.getDate() - 7)
    setActionValues({
      title: project.title,
      company: project.company || project.category,
      description: project.description,
      startDate: startDateValue.toISOString().slice(0, 16),
      dueDate: dueDateValue.toISOString().slice(0, 16),
      members: project.teamMembers || [],
      budget: String(project.budget || '').replace(/[^0-9.]/g, ''),
      status: project.status === 'In Progress' ? 'Started' : project.status,
      brandImage: project.brandImage || '',
    })
    if (type === 'member') {
      setProjects((current) => current.map((item) => item.id === project.id
        ? {
            ...item,
            team: [...item.team, '/user-avatar.png'],
            teamMembers: [...new Set([...(item.teamMembers || []), 'Shane Black'])],
          }
        : item))
      return
    }
    setProjectAction({ type, projectId: project.id })
  }

  const saveProjectAction = (event) => {
    event.preventDefault()
    const currentProject = projects.find((project) => project.id === projectAction.projectId)
    if (!currentProject) return

    if (projectAction.type === 'delete') {
      setProjects((current) => current.filter((project) => project.id !== projectAction.projectId))
    } else if (projectAction.type === 'edit') {
      const dueDate = new Date(actionValues.dueDate)
      const startDate = new Date(actionValues.startDate)
      if (!actionValues.title.trim() || !actionValues.company.trim() || !actionValues.startDate || !actionValues.dueDate || !actionValues.budget) {
        setActionError('Please complete the required project details.')
        return
      }
      if (dueDate < startDate) {
        setActionError('End date must be on or after the start date.')
        return
      }
      const daysUntilDue = Math.ceil((dueDate - new Date()) / (24 * 60 * 60 * 1000))
      const timeLeft = daysUntilDue < 0
        ? 'Overdue'
        : daysUntilDue === 0
          ? 'Due today'
          : `${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} left`
      setProjects((current) => current.map((project) => project.id === projectAction.projectId
        ? {
            ...project,
            title: actionValues.title.trim(),
            company: actionValues.company.trim(),
            category: actionValues.company.trim(),
            description: actionValues.description.trim(),
            startDate: actionValues.startDate,
            dueDate: dueDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            timeLeft,
            teamMembers: actionValues.members,
            team: actionValues.members.map(() => '/user-avatar.png'),
            budget: `$${Number(actionValues.budget).toLocaleString('en-US')}`,
            status: actionValues.status === 'Started' ? 'In Progress' : actionValues.status,
            brandImage: actionValues.brandImage,
          }
        : project))
    } else if (projectAction.type === 'due-date') {
      const selectedDate = new Date(`${actionValues.dueDate}T00:00:00`)
      setProjects((current) => current.map((project) => project.id === projectAction.projectId
        ? {
            ...project,
            dueDate: selectedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            timeLeft: selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          }
        : project))
    }
    setProjectAction(null)
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <nav aria-label="Project breadcrumb" className="flex items-center gap-2 text-base font-semibold text-[#41464d] md:text-lg">
          <span>Projects</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <button type="button" aria-label="Project plan" onClick={() => setViewMode('timeline')} className="flex items-center gap-1">
            Design Plan
            <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </nav>
        {viewMode === 'timeline' && (
          <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">
            <button type="button" aria-label="Previous month" onClick={() => setTimelineMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} className="rounded p-1 text-slate-400 hover:bg-slate-100">‹</button>
            <span className="min-w-28 text-center font-semibold">{timelineMonth.toLocaleDateString('en-US', { month: 'long' })} <span className="font-normal text-slate-400">{timelineMonth.getFullYear()}</span></span>
            <button type="button" aria-label="Next month" onClick={() => setTimelineMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} className="rounded p-1 text-slate-400 hover:bg-slate-100">›</button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg border border-slate-100 bg-white p-0.5">
            <button type="button" aria-label="Filter projects" aria-expanded={showFilters} onClick={() => setShowFilters((open) => !open)} className={`rounded p-1.5 ${showFilters ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-700'}`}>
              <FilterIcon className="h-3.5 w-3.5" />
            </button>
            <button type="button" aria-label="Project card view" onClick={() => setViewMode('grid')} className={`rounded p-1.5 ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-700'}`}>
              <GridViewIcon className="h-3.5 w-3.5" />
            </button>
            <button type="button" aria-label="Project list view" onClick={() => setViewMode('list')} className={`rounded p-1.5 ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-700'}`}>
              <ListViewIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#16A34A] px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#15803d]"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {showFilters && createPortal(
        <div className="fixed inset-0 z-[60]" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowFilters(false) }}>
          <aside aria-label="Filter projects" className="absolute inset-y-0 right-0 flex w-[min(280px,88vw)] flex-col border-l border-slate-100 bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#41464d]">Filter</h2>
              <button type="button" aria-label="Close filters" onClick={() => setShowFilters(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-medium text-slate-400">
                <span className="sr-only">Search Projects</span>
                <input
                  type="search"
                  aria-label="Search Projects"
                  placeholder="⌕   Search Projects..."
                  value={draftFilters.search}
                  onChange={(event) => setDraftFilters((current) => ({ ...current, search: event.target.value }))}
                  className="h-8 w-full rounded-lg border border-slate-200 px-2.5 text-[10px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-emerald-400"
                />
              </label>

              <label className="block text-[10px] font-medium text-slate-400">
                Members
                <select
                  aria-label="Members"
                  value={draftFilters.member}
                  onChange={(event) => setDraftFilters((current) => ({ ...current, member: event.target.value }))}
                  className="mt-1.5 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-600 outline-none focus:border-emerald-400"
                >
                  <option value="">All members</option>
                  {projectMembers.map((member) => <option key={member} value={member}>{member}</option>)}
                </select>
                {draftFilters.member && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[9px] text-slate-600">
                    <img src="/user-avatar.png" alt="" className="h-3 w-3 rounded-full" />
                    {draftFilters.member}
                    <button type="button" aria-label="Clear selected member" onClick={() => setDraftFilters((current) => ({ ...current, member: '' }))} className="ml-0.5 text-slate-400">×</button>
                  </span>
                )}
              </label>

              <label className="block text-[10px] font-medium text-slate-400">
                Due Date
                <select
                  aria-label="Due Date"
                  value={draftFilters.dueDate}
                  onChange={(event) => setDraftFilters((current) => ({ ...current, dueDate: event.target.value }))}
                  className="mt-1.5 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-600 outline-none focus:border-emerald-400"
                >
                  <option value="any">Due anytime</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="week">Next 7 days</option>
                  <option value="overdue">Overdue</option>
                </select>
              </label>

              <label className="block text-[10px] font-medium text-slate-400">
                Status
                <select
                  aria-label="Status"
                  value={draftFilters.status}
                  onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value }))}
                  className="mt-1.5 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-600 outline-none focus:border-emerald-400"
                >
                  <option value="all">All statuses</option>
                  <option value="Started">Started</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button type="button" onClick={() => { setAppliedFilters(draftFilters); setShowFilters(false) }} className="rounded-md bg-[#16A34A] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#15803d]">
                Apply Filters
              </button>
              <button type="button" onClick={() => { const emptyFilters = { search: '', member: '', dueDate: 'any', status: 'all' }; setDraftFilters(emptyFilters); setAppliedFilters(emptyFilters); setActiveFilter('All'); setShowFilters(false) }} className="text-[9px] font-medium text-emerald-700 underline underline-offset-2">
                Reset all Filters
              </button>
            </div>
          </aside>
        </div>,
        document.body,
      )}

      {/* Filter Tabs */}
      {viewMode !== 'timeline' && <div className="flex items-center justify-between gap-3 border-b border-slate-200">
        <div className="flex items-center gap-5 overflow-x-auto">
        {projectTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveFilter(tab.label)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-0 pb-2.5 pt-1 text-[10px] font-medium transition ${
              activeFilter === tab.label
                ? 'border-[#16A34A] text-[#41464d]'
                : 'border-transparent text-[#89919c] hover:text-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className="rounded-md bg-[#e9ecef] px-1.5 py-0.5 text-[9px] font-semibold text-[#89919c]">
              {tab.count}
            </span>
          </button>
        ))}
        </div>
        <div className="mb-1 flex shrink-0 items-center gap-1">
          <button type="button" aria-label="List view" onClick={() => setViewMode('list')} className={`rounded p-1 ${viewMode === 'list' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <ListViewIcon className="h-3.5 w-3.5" />
          </button>
          <button type="button" aria-label="Grid view" onClick={() => setViewMode('grid')} className={`rounded p-1 ${viewMode === 'grid' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <GridViewIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      }

      {viewMode === 'timeline' ? (
        <section aria-label="Project timeline" className="overflow-x-auto border-y border-slate-200 bg-white">
          <div className="min-w-[940px]">
            <div className="grid grid-cols-[190px_minmax(0,1fr)] border-b border-slate-200">
              <div className="flex items-center border-r border-slate-100 px-4 py-3 text-[9px] font-semibold uppercase tracking-wide text-slate-400">Project Name</div>
              <div className="grid" style={{ gridTemplateColumns: `repeat(${timelineDays.length}, minmax(${42 * timelineZoom}px, 1fr))` }}>
                {timelineDays.map((date) => (
                  <div key={date.day} className="flex h-12 flex-col items-center justify-center border-r border-slate-100 text-[8px] text-slate-400">
                    <span>{date.weekday}</span>
                    <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full text-[10px] ${date.highlighted ? 'bg-[#169b43] font-bold text-white' : 'text-slate-600'}`}>{date.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {visibleTimelineLists.map((list) => {
              const isCollapsed = collapsedLists.includes(list.id)
              const listTasks = [
                { ...list, isParent: true },
                ...(!isCollapsed ? list.children : []),
              ].filter((task) => {
                const query = appliedFilters.search.trim().toLowerCase()
                const matchesSearch = !query || task.name.toLowerCase().includes(query)
                const matchesMember = !appliedFilters.member || task.members.includes(appliedFilters.member)
                const matchesStatus = appliedFilters.status === 'all' ||
                  (appliedFilters.status === 'Started' && (task.status === 'Started' || task.status === 'In Progress')) ||
                  task.status === appliedFilters.status
                return matchesSearch && matchesMember && matchesStatus && matchesTimelineDueDate(task)
              })
              if (!listTasks.length) return null

              return listTasks.map((task) => (
                <div key={task.id} className="grid min-h-[42px] grid-cols-[190px_minmax(0,1fr)] border-b border-slate-100 last:border-b-0">
                  <div className={`flex min-w-0 items-center gap-2 border-r border-slate-100 px-3 ${task.isParent ? 'font-medium' : 'pl-7 text-slate-500'}`} style={task.isParent ? { borderLeft: `2px solid ${list.color}` } : undefined}>
                    {task.isParent && (
                      <button type="button" aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${list.name}`} onClick={() => setCollapsedLists((current) => current.includes(list.id) ? current.filter((id) => id !== list.id) : [...current, list.id])} className="text-slate-400 hover:text-slate-700">
                        <span className="inline-block text-[10px]">{isCollapsed ? '›' : list.children.length ? '⌄' : ''}</span>
                      </button>
                    )}
                    <span className="truncate text-[9px] text-slate-600">{task.name}</span>
                    {task.isParent && <button type="button" aria-label={`Options for ${task.name}`} className="ml-auto text-slate-400">⋮</button>}
                  </div>
                  <div className="relative min-h-[42px] bg-[linear-gradient(to_right,#eef1f4_1px,transparent_1px)]" style={{ backgroundSize: `${100 / timelineDays.length}% 100%` }}>
                    <div className="absolute top-2.5 flex h-5 items-center overflow-hidden rounded-sm text-[8px] text-slate-600" style={{ left: `${((task.start - 1) / timelineDays.length) * 100}%`, width: `${Math.min((task.duration / timelineDays.length) * 100, 100 - ((task.start - 1) / timelineDays.length) * 100)}%`, backgroundColor: `${list.color}55` }}>
                      <div className="absolute inset-y-0 left-0 opacity-40" style={{ width: `${task.progress}%`, backgroundColor: list.color }} />
                      <span className="relative z-10 truncate px-2">{task.name}</span>
                      <span className="relative z-10 ml-auto px-2">{task.progress}%</span>
                    </div>
                  </div>
                </div>
              ))
            })}

            <button type="button" onClick={addTimelineList} className="flex h-10 items-center gap-2 px-4 text-[10px] font-medium text-[#169b43] hover:bg-emerald-50/50">
              <PlusIcon className="h-3 w-3" /> Add List
            </button>
          </div>
          <div className="sticky bottom-2 ml-auto mr-3 flex w-fit items-center gap-2 rounded-xl bg-slate-50/95 p-1 text-[9px] text-slate-500 shadow-sm">
            <button type="button" onClick={() => setTimelineMonth(new Date())} className="rounded-lg px-3 py-1.5 hover:bg-white">Today</button>
            <button type="button" onClick={() => setTimelineZoom((zoom) => Math.max(0.75, zoom - 0.25))} aria-label="Zoom out" className="px-1">−</button>
            <span>Days</span>
            <button type="button" onClick={() => setTimelineZoom((zoom) => Math.min(1.75, zoom + 0.25))} aria-label="Zoom in" className="px-1">+</button>
          </div>
        </section>
      ) : (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-3'}>
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className={`border border-slate-100 bg-white p-4 transition-shadow hover:shadow-md ${viewMode === 'grid' ? 'min-h-[170px]' : 'flex items-center gap-5'}`}
          >
            <div className={`min-w-0 ${viewMode === 'grid' ? '' : 'flex flex-1 items-center gap-4'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-100 text-base font-bold"
                    style={{ color: proj.brandColor || '#16a34a', backgroundColor: `${proj.brandColor || '#16a34a'}10` }}
                    aria-hidden="true"
                  >
                    {proj.brandImage
                      ? <img src={proj.brandImage} alt="" className="h-full w-full rounded-lg object-cover" />
                      : proj.brand || proj.title.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-semibold text-slate-700">{proj.title}</h3>
                    <p className="truncate text-[9px] text-slate-400">{proj.company || proj.category}</p>
                  </div>
                </div>
                <div className="relative shrink-0">
                  <button
                    type="button"
                    aria-label={`More options for ${proj.title}`}
                    aria-expanded={openProjectMenu === proj.id}
                    onClick={() => setOpenProjectMenu((current) => current === proj.id ? null : proj.id)}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  >
                    <MoreVerticalIcon className="h-3.5 w-3.5" />
                  </button>
                  {openProjectMenu === proj.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-slate-100 bg-white p-1 shadow-lg">
                      <button type="button" onClick={() => openAction('edit', proj)} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] text-slate-600 hover:bg-slate-50">
                        <span aria-hidden="true">✎</span> Edit
                      </button>
                      <button type="button" onClick={() => openAction('member', proj)} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] text-slate-600 hover:bg-slate-50">
                        <span aria-hidden="true">♙</span> Add Member
                      </button>
                      <button type="button" onClick={() => openAction('due-date', proj)} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] text-slate-600 hover:bg-slate-50">
                        <CalendarIcon className="h-3 w-3" /> Add Due Date
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button type="button" onClick={() => openAction('delete', proj)} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] text-red-600 hover:bg-red-50">
                        <span aria-hidden="true">▤</span> Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className={`mt-3 text-[9px] leading-[1.5] text-slate-500 ${viewMode === 'grid' ? 'line-clamp-2 min-h-[27px]' : 'line-clamp-1 flex-1'}`}>
                {proj.description}
              </p>

              <div className={`${viewMode === 'grid' ? 'mt-3' : 'w-44 shrink-0'}`}>
                <div className="mb-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Progress</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#4acb78]" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-between ${viewMode === 'grid' ? 'mt-3' : 'w-40 shrink-0'}`}>
              <div className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-[9px] ${proj.timeLeft?.includes('5 days') ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-500'}`}>
                <CalendarIcon className="h-3 w-3" />
                <span>{proj.timeLeft || proj.dueDate}</span>
              </div>
              <div className="flex items-center -space-x-2">
                {proj.team.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover ring-2 ring-white"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Project Modal */}
      {projectAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setProjectAction(null) }}>
          <form onSubmit={saveProjectAction} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-sm font-bold text-slate-800">
              {projectAction.type === 'due-date' ? 'Add Due Date' : 'Delete Project'}
            </h2>
            {projectAction.type === 'due-date' && (
              <label className="block text-xs text-slate-500">Due date
                <input required type="datetime-local" value={actionValues.dueDate} onChange={(event) => setActionValues((current) => ({ ...current, dueDate: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700" />
              </label>
            )}
            {projectAction.type === 'delete' && <p className="text-xs text-slate-500">Are you sure you want to delete this project?</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setProjectAction(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">Cancel</button>
              <button type="submit" className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${projectAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#16A34A] hover:bg-[#15803d]'}`}>
                {projectAction.type === 'due-date' ? 'Save Due Date' : 'Delete'}
              </button>
            </div>
          </form>
        </div>
      )}

      {projectAction?.type === 'edit' && createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/25 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget) setProjectAction(null) }}>
          <form onSubmit={saveProjectAction} className="flex max-h-[calc(100dvh-24px)] w-full max-w-[360px] flex-col overflow-y-auto rounded-lg border border-slate-100 bg-white px-[18px] pb-4 pt-3 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#41464d]">Edit Project</h2>
              <button type="button" aria-label="Close edit project form" onClick={() => setProjectAction(null)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <label htmlFor="edit-project-brand-image" className="relative mx-auto mb-4 grid h-16 w-16 cursor-pointer place-items-center overflow-visible rounded-2xl border border-dashed border-slate-300 text-2xl text-slate-400 hover:border-emerald-400 hover:text-emerald-600">
              <span className="grid h-full w-full place-items-center overflow-hidden rounded-2xl">
                {actionValues.brandImage
                  ? <img src={actionValues.brandImage} alt="Project icon preview" className="h-full w-full object-cover" />
                  : <span style={{ color: projects.find((project) => project.id === projectAction.projectId)?.brandColor || '#16a34a' }}>✦</span>}
              </span>
              <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border border-slate-200 bg-white text-[10px]">✎</span>
              <input id="edit-project-brand-image" type="file" accept="image/*" className="sr-only" onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  if (typeof reader.result === 'string') setActionValues((current) => ({ ...current, brandImage: reader.result }))
                }
                reader.onerror = () => setActionValues((current) => ({ ...current, brandImage: '' }))
                reader.readAsDataURL(file)
              }} />
            </label>

            <div className="space-y-3">
              <label className="block text-[9px] font-medium text-slate-400">
                Status
                <select aria-label="Project status" value={actionValues.status} onChange={(event) => setActionValues((current) => ({ ...current, status: event.target.value }))} className="mt-1 h-7 w-full rounded-lg border border-slate-200 bg-white px-2 text-[9px] text-slate-600 outline-none focus:border-emerald-400">
                  <option value="Started">Started</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
              <label className="block text-[9px] font-medium text-slate-400">
                Project Name
                <input required value={actionValues.title} onChange={(event) => setActionValues((current) => ({ ...current, title: event.target.value }))} className="mt-1 h-7 w-full rounded-lg border border-slate-200 px-2.5 text-[9px] text-slate-700 outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-[9px] font-medium text-slate-400">
                Client Name
                <input required value={actionValues.company} onChange={(event) => setActionValues((current) => ({ ...current, company: event.target.value }))} className="mt-1 h-7 w-full rounded-lg border border-slate-200 px-2.5 text-[9px] text-slate-700 outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-[9px] font-medium text-slate-400">
                Description
                <textarea value={actionValues.description} onChange={(event) => setActionValues((current) => ({ ...current, description: event.target.value }))} className="mt-1 h-[78px] w-full resize-y rounded-lg border border-slate-200 px-2.5 py-2 text-[9px] leading-[1.4] text-slate-700 outline-none focus:border-emerald-400" />
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="block text-[9px] font-medium text-slate-400">
                  Start Date
                  <input required type="datetime-local" value={actionValues.startDate} onChange={(event) => setActionValues((current) => ({ ...current, startDate: event.target.value }))} className="mt-1 h-7 w-full rounded-lg border border-slate-200 px-1.5 text-[8px] text-slate-700 outline-none focus:border-emerald-400" />
                </label>
                <label className="block text-[9px] font-medium text-slate-400">
                  End Date
                  <input required type="datetime-local" min={actionValues.startDate || undefined} value={actionValues.dueDate} onChange={(event) => setActionValues((current) => ({ ...current, dueDate: event.target.value }))} className="mt-1 h-7 w-full rounded-lg border border-slate-200 px-1.5 text-[8px] text-slate-700 outline-none focus:border-emerald-400" />
                </label>
              </div>
              <label className="block text-[9px] font-medium text-slate-400">
                Members
                <div className="mt-1 flex min-h-7 flex-wrap items-center gap-1 rounded-lg border border-slate-200 px-1.5 py-1">
                  {actionValues.members.map((member) => (
                    <span key={member} className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-1 pr-1.5 text-[8px] text-slate-600">
                      <img src="/user-avatar.png" alt="" className="h-3 w-3 rounded-full" />
                      {member}
                      <button type="button" aria-label={`Remove ${member}`} onClick={() => setActionValues((current) => ({ ...current, members: current.members.filter((item) => item !== member) }))} className="text-slate-400">×</button>
                    </span>
                  ))}
                  <select aria-label="Add project member" value={actionMemberToAdd} onChange={(event) => {
                    const selectedMember = event.target.value
                    if (selectedMember) setActionValues((current) => ({ ...current, members: [...new Set([...current.members, selectedMember])] }))
                    setActionMemberToAdd('')
                  }} className="min-w-0 flex-1 bg-transparent text-[8px] text-slate-500 outline-none">
                    <option value="">Add member...</option>
                    {projectMembers.filter((member) => !actionValues.members.includes(member)).map((member) => <option key={member} value={member}>{member}</option>)}
                  </select>
                </div>
              </label>
              <label className="block text-[9px] font-medium text-slate-400">
                Budget
                <div className="mt-1 flex h-7 items-center rounded-lg border border-slate-200 px-2 text-[9px] text-slate-600 focus-within:border-emerald-400">
                  <span className="mr-2">$</span>
                  <input required type="number" min="0" step="1" value={actionValues.budget} onChange={(event) => setActionValues((current) => ({ ...current, budget: event.target.value }))} className="w-full bg-transparent outline-none" />
                </div>
              </label>
            </div>

            {actionError && <p role="alert" className="mt-2 text-[9px] text-red-600">{actionError}</p>}
            <div className="mt-3 flex justify-end">
              <button type="submit" className="rounded-md bg-[#16A34A] px-4 py-2 text-[10px] font-bold text-white hover:bg-[#15803d]">Save</button>
            </div>
          </form>
        </div>,
        document.body,
      )}

      {showAddProjectModal && createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/25 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAddProjectModal(false) }}>
          <form onSubmit={handleAddProject} className="flex max-h-[calc(100dvh-24px)] w-full max-w-[360px] flex-col overflow-y-auto rounded-lg border border-slate-100 bg-white px-[18px] pb-4 pt-3 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#41464d]">Add Project</h2>
              <button type="button" aria-label="Close add project form" onClick={() => setShowAddProjectModal(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <label htmlFor="project-brand-image" className="mx-auto mb-4 grid h-16 w-16 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-slate-300 text-2xl text-slate-400 hover:border-emerald-400 hover:text-emerald-600">
              {newProject.brandImage ? <img src={newProject.brandImage} alt="Project icon preview" className="h-full w-full object-cover" /> : <span aria-hidden="true">+</span>}
              <input
                id="project-brand-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    if (typeof reader.result === 'string') updateNewProject('brandImage', reader.result)
                    else setNewProjectError('Unable to load this image. Please choose another file.')
                  }
                  reader.onerror = () => setNewProjectError('Unable to load this image. Please choose another file.')
                  reader.readAsDataURL(file)
                }}
              />
            </label>

            <div className="space-y-3">
              <label className="block text-[9px] font-medium text-slate-400">
                Project Name
                <input required value={newProject.name} onChange={(event) => updateNewProject('name', event.target.value)} className="mt-1 h-7 w-full rounded-lg border border-slate-200 px-2.5 text-[9px] text-slate-700 outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-[9px] font-medium text-slate-400">
                Client Name
                <input required value={newProject.client} onChange={(event) => updateNewProject('client', event.target.value)} className="mt-1 h-7 w-full rounded-lg border border-slate-200 px-2.5 text-[9px] text-slate-700 outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-[9px] font-medium text-slate-400">
                Description
                <textarea value={newProject.description} onChange={(event) => updateNewProject('description', event.target.value)} className="mt-1 h-[68px] w-full resize-y rounded-lg border border-slate-200 px-2.5 py-2 text-[9px] leading-[1.4] text-slate-700 outline-none focus:border-emerald-400" />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="block text-[9px] font-medium text-slate-400">
                  Start Date
                  <input required type="datetime-local" value={newProject.startDate} onChange={(event) => updateNewProject('startDate', event.target.value)} className="mt-1 h-7 w-full rounded-lg border border-slate-200 px-1.5 text-[8px] text-slate-700 outline-none focus:border-emerald-400" />
                </label>
                <label className="block text-[9px] font-medium text-slate-400">
                  End Date
                  <input required type="datetime-local" min={newProject.startDate} value={newProject.endDate} onChange={(event) => updateNewProject('endDate', event.target.value)} className="mt-1 h-7 w-full rounded-lg border border-slate-200 px-1.5 text-[8px] text-slate-700 outline-none focus:border-emerald-400" />
                </label>
              </div>

              <label className="block text-[9px] font-medium text-slate-400">
                Members
                <div className="mt-1 flex min-h-7 flex-wrap items-center gap-1 rounded-lg border border-slate-200 px-1.5 py-1">
                  {newProject.members.map((member) => (
                    <span key={member} className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-1 pr-1.5 text-[8px] text-slate-600">
                      <img src="/user-avatar.png" alt="" className="h-3 w-3 rounded-full" />
                      {member}
                      <button type="button" aria-label={`Remove ${member}`} onClick={() => updateNewProject('members', newProject.members.filter((item) => item !== member))} className="text-slate-400">×</button>
                    </span>
                  ))}
                  <select aria-label="Add a member" value={memberToAdd} onChange={(event) => {
                    const selectedMember = event.target.value
                    if (selectedMember) updateNewProject('members', [...new Set([...newProject.members, selectedMember])])
                    setMemberToAdd('')
                  }} className="min-w-0 flex-1 bg-transparent text-[8px] text-slate-500 outline-none">
                    <option value="">Add member...</option>
                    {projectMembers.filter((member) => !newProject.members.includes(member)).map((member) => <option key={member} value={member}>{member}</option>)}
                  </select>
                </div>
              </label>

              <label className="block text-[9px] font-medium text-slate-400">
                Budget
                <div className="mt-1 flex h-7 items-center rounded-lg border border-slate-200 px-2 text-[9px] text-slate-600 focus-within:border-emerald-400">
                  <span className="mr-2">$</span>
                  <input required type="number" min="0" step="1" value={newProject.budget} onChange={(event) => updateNewProject('budget', event.target.value)} className="w-full bg-transparent outline-none" />
                </div>
              </label>
            </div>

            {newProjectError && <p role="alert" className="mt-2 text-[9px] text-red-600">{newProjectError}</p>}
            <div className="mt-3 flex justify-end">
              <button type="submit" className="rounded-md bg-[#16A34A] px-4 py-2 text-[10px] font-bold text-white hover:bg-[#15803d]">Create</button>
            </div>
          </form>
        </div>,
        document.body,
      )}
    </div>
  )
}
