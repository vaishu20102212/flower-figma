import React, { useEffect, useMemo, useRef, useState } from 'react'
import { fileManagerData } from '../data/mockData'
import {
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  MoreVerticalIcon,
  ListViewIcon,
  GridViewIcon,
} from '../icons/FlowerIcons'

export default function FileManagerPage() {
  const [viewMode, setViewMode] = useState('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [files, setFiles] = useState(fileManagerData.recentFiles)
  const [activeFolder, setActiveFolder] = useState('All Files')
  const [openMenu, setOpenMenu] = useState(null)

  const fileInputRef = useRef(null)

  // Clean object URLs when component is removed
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.objectUrl) {
          URL.revokeObjectURL(file.objectUrl)
        }
      })
    }
  }, [])

  /* ----------------------------------------
     File upload
  ---------------------------------------- */

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || [])

    if (!selectedFiles.length) return

    const uploadedFiles = selectedFiles.map((file) => ({
      id: `uploaded-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: formatFileSize(file.size),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      icon: getFileIcon(file.name),
      rawFile: file,
      objectUrl: URL.createObjectURL(file),
      uploaded: true,
    }))

    setFiles((prev) => [...uploadedFiles, ...prev])

    // Reset input so the same file can be selected again
    event.target.value = ''
  }

  /* ----------------------------------------
     Download
  ---------------------------------------- */

  const handleDownload = (file) => {
    // Newly uploaded browser files
    if (file.objectUrl) {
      const link = document.createElement('a')
      link.href = file.objectUrl
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // If mockData contains a URL/path
    if (file.url || file.path) {
      const link = document.createElement('a')
      link.href = file.url || file.path
      link.download = file.name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // No real file behind mock data
    console.warn(`No downloadable file is attached to ${file.name}`)
  }

  /* ----------------------------------------
     Delete
  ---------------------------------------- */

  const handleDelete = (fileId) => {
    const fileToDelete = files.find((file) => file.id === fileId)

    if (fileToDelete?.objectUrl) {
      URL.revokeObjectURL(fileToDelete.objectUrl)
    }

    setFiles((prev) => prev.filter((file) => file.id !== fileId))
    setOpenMenu(null)
  }

  /* ----------------------------------------
     File filtering
  ---------------------------------------- */

  const filteredFiles = useMemo(() => {
    let result = files

    if (activeFolder !== 'All Files') {
      result = result.filter((file) => {
        if (file.folder) {
          return file.folder === activeFolder
        }

        return true
      })
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()

      result = result.filter((file) =>
        `${file.name} ${file.size} ${file.date}`
          .toLowerCase()
          .includes(query)
      )
    }

    return result
  }, [files, activeFolder, searchQuery])

  /* ----------------------------------------
     Storage
  ---------------------------------------- */

  const uploadedBytes = files.reduce((total, file) => {
    if (file.rawFile) {
      return total + file.rawFile.size
    }

    return total
  }, 0)

  const baseUsedGB = parseStorageValue(fileManagerData.storage.used)
  const totalGB = parseStorageValue(fileManagerData.storage.total)

  const uploadedGB = uploadedBytes / (1024 * 1024 * 1024)
  const currentUsedGB = baseUsedGB + uploadedGB
  const currentPercentage = Math.min(
    100,
    Math.round((currentUsedGB / totalGB) * 100)
  )

  /* ----------------------------------------
     Folder click
  ---------------------------------------- */

  const handleFolderClick = (folderName) => {
    setActiveFolder(folderName)
    setSearchQuery('')
  }

  return (
    <div
      className="space-y-6 pb-12 animate-fadeIn"
      onClick={() => setOpenMenu(null)}
    >
      {/* ------------------------------------
          Header
      ------------------------------------ */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            File Manager
          </h1>

          {activeFolder !== 'All Files' && (
            <p className="text-xs text-slate-400 mt-1">
              Showing {activeFolder}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleUploadClick()
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-2xl shadow-sm transition self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Upload File</span>
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* ------------------------------------
          Storage Card
      ------------------------------------ */}

      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Cloud Storage
            </h3>

            <p className="text-xs text-slate-400">
              <strong className="text-slate-700">
                {formatGB(currentUsedGB)}
              </strong>{' '}
              of {fileManagerData.storage.total} used
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
            {currentPercentage}% Full
          </span>
        </div>

        {/* Progress */}
        <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
          <div
            className="h-full bg-[#16A34A]"
            style={{ width: '28%' }}
          />

          <div
            className="h-full bg-[#2DD4BF]"
            style={{ width: '32%' }}
          />

          <div
            className="h-full bg-amber-400"
            style={{ width: '10%' }}
          />

          <div
            className="h-full bg-purple-500"
            style={{ width: '5%' }}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
          {fileManagerData.storage.categories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-2"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />

              <span className="text-slate-500">
                {cat.name}:
              </span>

              <span className="font-bold text-slate-800">
                {cat.size}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------
          Folders
      ------------------------------------ */}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Folders
          </h4>

          {activeFolder !== 'All Files' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActiveFolder('All Files')
              }}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all files
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fileManagerData.folders.map((folder) => {
            const isActive = activeFolder === folder.name

            return (
              <button
                type="button"
                key={folder.id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleFolderClick(folder.name)
                }}
                className={`text-left bg-white rounded-2xl p-5 border transition flex items-center justify-between ${
                  isActive
                    ? 'border-emerald-300 ring-2 ring-emerald-50 shadow-card'
                    : 'border-slate-100 shadow-card hover:shadow-card-hover'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${folder.color}`}
                  >
                    {folder.icon}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {folder.name}
                    </h4>

                    <p className="text-[10px] text-slate-400">
                      {folder.filesCount} files • {folder.size}
                    </p>
                  </div>
                </div>

                <span
                  className="text-slate-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVerticalIcon className="w-4 h-4" />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ------------------------------------
          Recent Files
      ------------------------------------ */}

      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {activeFolder === 'All Files'
                ? 'Recent Files'
                : activeFolder}
            </h4>

            <p className="text-[11px] text-slate-400 mt-1">
              {filteredFiles.length} file
              {filteredFiles.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-48 sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B4F481]"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-white shadow-xs text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                <ListViewIcon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-xs text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                <GridViewIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* --------------------------------
            Empty state
        -------------------------------- */}

        {filteredFiles.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">📁</div>

            <h3 className="text-sm font-bold text-slate-700">
              No files found
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Try another search or upload a new file.
            </p>

            <button
              type="button"
              onClick={handleUploadClick}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
            >
              Upload File
            </button>
          </div>
        ) : viewMode === 'list' ? (

          /* --------------------------------
             LIST VIEW
          -------------------------------- */

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">
                    File Name
                  </th>

                  <th className="pb-3">
                    Size
                  </th>

                  <th className="pb-3">
                    Modified
                  </th>

                  <th className="pb-3 text-right pr-2">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {file.icon}
                        </span>

                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 block truncate max-w-[300px]">
                            {file.name}
                          </span>

                          {file.uploaded && (
                            <span className="text-[9px] text-emerald-600 font-semibold">
                              Uploaded
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                      {file.size}
                    </td>

                    <td className="py-3.5 text-slate-400">
                      {file.date}
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <div className="relative flex justify-end items-center gap-1">
                        {/* Download */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(file)
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="Download"
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </button>

                        {/* More */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenu(
                              openMenu === file.id
                                ? null
                                : file.id
                            )
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                        >
                          <MoreVerticalIcon className="w-4 h-4" />
                        </button>

                        {openMenu === file.id && (
                          <div
                            className="absolute right-0 top-9 z-20 w-32 bg-white border border-slate-100 rounded-xl shadow-xl p-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                handleDownload(file)
                                setOpenMenu(null)
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-lg"
                            >
                              Download
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(file.id)
                              }
                              className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        ) : (

          /* --------------------------------
             GRID VIEW
          -------------------------------- */

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="relative bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center hover:bg-slate-100 hover:shadow-sm transition flex flex-col items-center justify-between min-h-[170px]"
              >
                {/* More button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenMenu(
                      openMenu === file.id
                        ? null
                        : file.id
                    )
                  }}
                  className="absolute top-2 right-2 p-1 text-slate-300 hover:text-slate-700"
                >
                  <MoreVerticalIcon className="w-4 h-4" />
                </button>

                {/* File icon */}
                <button
                  type="button"
                  onClick={() => handleDownload(file)}
                  className="text-4xl my-3 hover:scale-110 transition"
                  title="Download"
                >
                  {file.icon}
                </button>

                <div className="w-full">
                  <p className="text-xs font-bold text-slate-800 truncate mb-0.5">
                    {file.name}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {file.size}
                  </p>
                </div>

                {/* Grid menu */}
                {openMenu === file.id && (
                  <div
                    className="absolute right-2 top-9 z-20 w-28 bg-white border border-slate-100 rounded-xl shadow-xl p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        handleDownload(file)
                        setOpenMenu(null)
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                      Download
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(file.id)
                      }
                      className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ==========================================
   HELPERS
========================================== */

function formatFileSize(bytes) {
  if (!bytes) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  )

  const value = bytes / Math.pow(1024, index)

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

function getFileIcon(fileName) {
  const extension =
    fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return '📄'

    case 'doc':
    case 'docx':
      return '📝'

    case 'xls':
    case 'xlsx':
    case 'csv':
      return '📊'

    case 'ppt':
    case 'pptx':
      return '📑'

    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return '🖼️'

    case 'zip':
    case 'rar':
    case '7z':
      return '📦'

    case 'mp3':
    case 'wav':
    case 'ogg':
      return '🎵'

    case 'mp4':
    case 'mov':
    case 'avi':
      return '🎬'

    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'html':
    case 'css':
      return '💻'

    default:
      return '📄'
  }
}

function parseStorageValue(value) {
  if (typeof value === 'number') return value

  const match = String(value).match(/[\d.]+/)

  return match ? Number(match[0]) : 0
}

function formatGB(value) {
  if (value < 1) {
    return `${(value * 1024).toFixed(1)} MB`
  }

  return `${value.toFixed(1)} GB`
}