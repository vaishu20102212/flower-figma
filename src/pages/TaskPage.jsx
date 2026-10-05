import React, { useMemo, useState } from 'react'
import { taskColumnsData } from '../data/mockData'

import {
  PlusIcon,
  FilterIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  CheckIcon,
  CloseIcon,
  CalendarIcon,
} from '../icons/FlowerIcons'

export default function TaskPage() {
  const [columns, setColumns] = useState(taskColumnsData)

  const [selectedPlan, setSelectedPlan] = useState('Design Plan')
  const [showPlanMenu, setShowPlanMenu] = useState(false)

  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const [editingTask, setEditingTask] = useState(null)
  const [openColumnMenu, setOpenColumnMenu] = useState(null)

  const [targetColumn, setTargetColumn] = useState('todo')

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [newTaskColumn, setNewTaskColumn] = useState('todo')

  const [draggedTask, setDraggedTask] = useState(null)

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  const resetTaskForm = () => {
    setNewTaskTitle('')
    setNewTaskDesc('')
    setNewTaskDate('')
    setNewTaskColumn('todo')
    setEditingTask(null)
  }

  const openAddModal = (column = 'todo') => {
    resetTaskForm()
    setTargetColumn(column)
    setNewTaskColumn(column)
    setShowAddTaskModal(true)
  }

  const closeModal = () => {
    setShowAddTaskModal(false)
    resetTaskForm()
  }

  // ----------------------------------------
  // Add / Edit task
  // ----------------------------------------

  const handleSaveTask = () => {
    if (!newTaskTitle.trim()) return

    // EDIT
    if (editingTask) {
      setColumns((prev) => {
        const updated = { ...prev }

        Object.keys(updated).forEach((columnKey) => {
          updated[columnKey] = {
            ...updated[columnKey],
            tasks: updated[columnKey].tasks.map((task) => {
              if (task.id !== editingTask.id) return task

              return {
                ...task,
                title: newTaskTitle,
                description:
                  newTaskDesc || 'Task details not provided.',
                date:
                  newTaskDate ||
                  task.date ||
                  getTodayDate(),
              }
            }),
          }
        })

        return updated
      })

      closeModal()
      return
    }

    // ADD
    const newTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      description:
        newTaskDesc.trim() || 'Newly created task item.',
      date: newTaskDate || getTodayDate(),

      tags: ['#22C55E'],

      attachments: 0,
      comments: 0,

      assignees: ['/user-avatar.png'],

      subtasks: [],
      subtasksTotal: 0,
      progress: 0,
    }

    setColumns((prev) => ({
      ...prev,
      [newTaskColumn]: {
        ...prev[newTaskColumn],
        count: prev[newTaskColumn].tasks.length + 1,
        tasks: [newTask, ...prev[newTaskColumn].tasks],
      },
    }))

    closeModal()
  }

  // ----------------------------------------
  // Edit
  // ----------------------------------------

  const handleEditTask = (task) => {
    setEditingTask(task)

    setNewTaskTitle(task.title || '')
    setNewTaskDesc(task.description || '')
    setNewTaskDate(task.date || '')

    setShowAddTaskModal(true)
    setOpenColumnMenu(null)
  }

  // ----------------------------------------
  // Delete
  // ----------------------------------------

  const handleDeleteTask = (columnKey, taskId) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!shouldDelete) return

    setColumns((prev) => {
      const column = prev[columnKey]

      const updatedTasks = column.tasks.filter(
        (task) => task.id !== taskId
      )

      return {
        ...prev,
        [columnKey]: {
          ...column,
          count: updatedTasks.length,
          tasks: updatedTasks,
        },
      }
    })

    setOpenColumnMenu(null)
  }

  // ----------------------------------------
  // Move task
  // ----------------------------------------

  const moveTask = (fromColumn, toColumn, taskId) => {
    if (fromColumn === toColumn) return

    setColumns((prev) => {
      const sourceColumn = prev[fromColumn]
      const targetColumnData = prev[toColumn]

      const task = sourceColumn.tasks.find(
        (item) => item.id === taskId
      )

      if (!task) return prev

      const sourceTasks = sourceColumn.tasks.filter(
        (item) => item.id !== taskId
      )

      const targetTasks = [
        ...targetColumnData.tasks,
        task,
      ]

      return {
        ...prev,

        [fromColumn]: {
          ...sourceColumn,
          count: sourceTasks.length,
          tasks: sourceTasks,
        },

        [toColumn]: {
          ...targetColumnData,
          count: targetTasks.length,
          tasks: targetTasks,
        },
      }
    })
  }

  // ----------------------------------------
  // Drag & Drop
  // ----------------------------------------

  const handleDragStart = (event, columnKey, taskId) => {
    setDraggedTask({
      columnKey,
      taskId,
    })

    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (event, destinationColumn) => {
    event.preventDefault()

    if (!draggedTask) return

    moveTask(
      draggedTask.columnKey,
      destinationColumn,
      draggedTask.taskId
    )

    setDraggedTask(null)
  }

  // ----------------------------------------
  // Subtask
  // ----------------------------------------

  const handleToggleSubtask = (
    columnKey,
    taskId,
    subtaskIndex
  ) => {
    setColumns((prev) => {
      const column = prev[columnKey]

      const tasks = column.tasks.map((task) => {
        if (
          task.id !== taskId ||
          !task.subtasks
        ) {
          return task
        }

        const subtasks = [...task.subtasks]

        subtasks[subtaskIndex] = {
          ...subtasks[subtaskIndex],
          done: !subtasks[subtaskIndex].done,
        }

        const completed = subtasks.filter(
          (item) => item.done
        ).length

        const progress =
          subtasks.length === 0
            ? 0
            : Math.round(
                (completed / subtasks.length) * 100
              )

        return {
          ...task,
          subtasks,
          progress,
        }
      })

      return {
        ...prev,
        [columnKey]: {
          ...column,
          tasks,
        },
      }
    })
  }

  // ----------------------------------------
  // Search + filter
  // ----------------------------------------

  const visibleColumns = useMemo(() => {
    const result = {}

    Object.entries(columns).forEach(
      ([columnKey, column]) => {
        let tasks = [...column.tasks]

        if (searchQuery.trim()) {
          const query =
            searchQuery.toLowerCase()

          tasks = tasks.filter((task) =>
            `${task.title} ${task.description}`
              .toLowerCase()
              .includes(query)
          )
        }

        if (filterStatus !== 'all') {
          if (filterStatus === 'hasSubtasks') {
            tasks = tasks.filter(
              (task) =>
                task.subtasks &&
                task.subtasks.length > 0
            )
          }

          if (filterStatus === 'completed') {
            tasks = tasks.filter(
              (task) => task.progress === 100
            )
          }
        }

        result[columnKey] = {
          ...column,
          tasks,
        }
      }
    )

    return result
  }, [columns, searchQuery, filterStatus])

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <div
      className="space-y-6 pb-12 animate-fadeIn"
      onClick={() => {
        setShowPlanMenu(false)
        setShowFilterMenu(false)
        setOpenColumnMenu(null)
      }}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Plan selector */}
        <div className="relative">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setShowPlanMenu((value) => !value)
            }}
            className="flex items-center gap-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              {selectedPlan}
            </h1>

            <ChevronDownIcon className="w-5 h-5 text-slate-400" />
          </button>

          {showPlanMenu && (
            <div
              className="absolute left-0 top-12 z-30 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-1"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {[
                'Design Plan',
                'Marketing Plan',
                'Development Plan',
              ].map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => {
                    setSelectedPlan(plan)
                    setShowPlanMenu(false)
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${
                    selectedPlan === plan
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setShowFilterMenu(
                  (value) => !value
                )
              }}
              className={`p-2.5 rounded-2xl border shadow-sm transition ${
                filterStatus !== 'all'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FilterIcon className="w-4 h-4" />
            </button>

            {showFilterMenu && (
              <div
                className="absolute right-0 top-12 z-30 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <p className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400">
                  Filter Tasks
                </p>

                <FilterButton
                  active={filterStatus === 'all'}
                  onClick={() =>
                    setFilterStatus('all')
                  }
                >
                  All Tasks
                </FilterButton>

                <FilterButton
                  active={
                    filterStatus === 'hasSubtasks'
                  }
                  onClick={() =>
                    setFilterStatus('hasSubtasks')
                  }
                >
                  Has Subtasks
                </FilterButton>

                <FilterButton
                  active={
                    filterStatus === 'completed'
                  }
                  onClick={() =>
                    setFilterStatus('completed')
                  }
                >
                  100% Completed
                </FilterButton>
              </div>
            )}
          </div>

          {/* Add */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              openAddModal('todo')
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
          placeholder="Search tasks..."
          className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
        />
      </div>

      {/* =====================================
          KANBAN
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {Object.entries(visibleColumns).map(
          ([columnKey, column]) => (
            <div
              key={column.id}
              onDragOver={(event) =>
                event.preventDefault()
              }
              onDrop={(event) =>
                handleDrop(event, columnKey)
              }
              className={`bg-slate-100/70 rounded-3xl p-4 md:p-5 flex flex-col space-y-4 border transition ${
                draggedTask
                  ? 'border-dashed border-emerald-300'
                  : 'border-slate-200/50'
              }`}
            >
              {/* Column header */}
              <div className="relative pb-2">
                <div
                  className="h-1 rounded-full w-12 mb-3"
                  style={{
                    backgroundColor: column.color,
                  }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xs font-extrabold text-slate-700 tracking-wider">
                      {column.title}
                    </h3>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      {column.tasks.length}
                    </span>
                  </div>

                  {/* Column menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setOpenColumnMenu(
                          openColumnMenu === columnKey
                            ? null
                            : columnKey
                        )
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <MoreHorizontalIcon className="w-4 h-4" />
                    </button>

                    {openColumnMenu === columnKey && (
                      <div
                        className="absolute right-0 top-6 z-20 w-36 bg-white border border-slate-100 rounded-xl shadow-xl p-1"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <button
                          type="button"
                          onClick={() => {
                            openAddModal(columnKey)
                            setOpenColumnMenu(null)
                          }}
                          className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50"
                        >
                          Add Task
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-4">
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    columnKey={columnKey}
                    onDragStart={handleDragStart}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleSubtask={
                      handleToggleSubtask
                    }
                  />
                ))}

                {column.tasks.length === 0 && (
                  <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-400">
                      No tasks here
                    </p>
                  </div>
                )}
              </div>

              {/* Quick add */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  openAddModal(columnKey)
                }}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-xs font-bold transition"
              >
                <PlusIcon className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          )
        )}
      </div>

      {/* =====================================
          ADD / EDIT MODAL
      ====================================== */}

      {showAddTaskModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 relative"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {editingTask
                ? 'Edit Task'
                : 'Create New Task'}
            </h3>

            <p className="text-xs text-slate-400 mb-6">
              {editingTask
                ? 'Update the task details.'
                : 'Add a new task to your plan.'}
            </p>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Task Title
                </label>

                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(event) =>
                    setNewTaskTitle(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Modern UI Mockup"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Description
                </label>

                <textarea
                  rows="3"
                  value={newTaskDesc}
                  onChange={(event) =>
                    setNewTaskDesc(
                      event.target.value
                    )
                  }
                  placeholder="Task details..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Due Date
                </label>

                <input
                  type="text"
                  value={newTaskDate}
                  onChange={(event) =>
                    setNewTaskDate(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Jun 20"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
                />
              </div>

              {/* Column */}
              {!editingTask && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Column
                  </label>

                  <select
                    value={newTaskColumn}
                    onChange={(event) =>
                      setNewTaskColumn(
                        event.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="todo">
                      TODO
                    </option>

                    <option value="inProgress">
                      IN PROGRESS
                    </option>

                    <option value="completed">
                      COMPLETED
                    </option>
                  </select>
                </div>
              )}

              {/* Save */}
              <button
                type="button"
                onClick={handleSaveTask}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs rounded-2xl shadow-sm transition mt-2"
              >
                {editingTask
                  ? 'Save Changes'
                  : 'Create Task Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ==========================================
   TASK CARD
========================================== */

function TaskCard({
  task,
  columnKey,
  onDragStart,
  onEdit,
  onDelete,
  onToggleSubtask,
}) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      draggable
      onDragStart={(event) =>
        onDragStart(
          event,
          columnKey,
          task.id
        )
      }
      className="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-200 border border-slate-100 space-y-3 cursor-grab active:cursor-grabbing"
    >
      {/* Top */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {(task.tags || ['#22C55E']).map(
            (tagColor, index) => (
              <div
                key={index}
                className="w-5 h-1 rounded-full"
                style={{
                  backgroundColor: tagColor,
                }}
              />
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <CalendarIcon className="w-3 h-3" />
            <span>
              {task.date || 'No date'}
            </span>
          </div>

          {/* Card menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setShowMenu(
                  (value) => !value
                )
              }}
              className="text-slate-300 hover:text-slate-600"
            >
              <MoreHorizontalIcon className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-5 z-20 w-28 bg-white border border-slate-100 rounded-xl shadow-xl p-1"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    onEdit(task)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDelete(
                      columnKey,
                      task.id
                    )
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-1">
          {task.title}
        </h4>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Image */}
      {task.image && (
        <div className="rounded-xl overflow-hidden max-h-36">
          <img
            src={task.image}
            alt="Task"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Gallery */}
      {task.gallery &&
        task.gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
            {task.gallery.map(
              (image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Gallery"
                  className="w-full h-16 object-cover rounded-lg"
                />
              )
            )}
          </div>
        )}

      {/* Subtasks */}
      {task.subtasks &&
        task.subtasks.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span>
                SUB-TASKS:{' '}
                {task.subtasks.length}
              </span>

              <span>
                {task.progress || 0}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
                style={{
                  width: `${
                    task.progress || 0
                  }%`,
                }}
              />
            </div>

            <div className="space-y-1.5 pt-1">
              {task.subtasks.map(
                (subtask, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() =>
                      onToggleSubtask(
                        columnKey,
                        task.id,
                        index
                      )
                    }
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100 text-left transition"
                  >
                    <span
                      className={
                        subtask.done
                          ? 'text-[11px] text-slate-400 line-through'
                          : 'text-[11px] font-medium text-slate-700'
                      }
                    >
                      {subtask.name}
                    </span>

                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        subtask.done
                          ? 'bg-[#16A34A] border-[#16A34A] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {subtask.done && (
                        <CheckIcon className="w-2.5 h-2.5 stroke-[3]" />
                      )}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
          {task.attachments > 0 && (
            <span className="flex items-center gap-1">
              <PaperclipIcon className="w-3 h-3" />
              {task.attachments}
            </span>
          )}

          {task.comments > 0 && (
            <span className="flex items-center gap-1">
              💬 {task.comments}
            </span>
          )}
        </div>

        {/* Assignees */}
        <div className="flex items-center -space-x-1.5">
          {(task.assignees || []).map(
            (avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt="Assignee"
                className="w-5 h-5 rounded-full object-cover ring-2 ring-white"
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}

/* ==========================================
   FILTER BUTTON
========================================== */

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}

/* ==========================================
   DATE
========================================== */

function getTodayDate() {
  return new Date().toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
    }
  )
}