'use client'
import axios from "axios"
import React, { useEffect, useState } from "react"

type Notice = {
  _id: string
  title: string
  content: string
  category: string
  targetAudience: string
  postedBy: string
  createdAt: string
}

const CATEGORIES = ["General", "Exam", "Lab", "Holiday", "Event", "Urgent"]
const AUDIENCES = ["All", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"]

const CATEGORY_BADGE: Record<string, string> = {
  General: "badge-neutral",
  Exam: "badge-warning",
  Lab: "badge-info",
  Holiday: "badge-success",
  Event: "badge-accent",
  Urgent: "badge-error",
}

export default function NoticePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("General")
  const [targetAudience, setTargetAudience] = useState("All")
  const [postedBy, setPostedBy] = useState("Admin")
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchNotices = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/getnotices`, { withCredentials: true })
      .then((res) => setNotices(res.data.notices))
      .catch(() => {})
  }

  useEffect(() => { fetchNotices() }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_LINK}/api/addnotice`,
        { title, content, category, targetAudience, postedBy },
        { withCredentials: true }
      )
      setNotices((prev) => [res.data.message, ...prev])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setTitle(""); setContent("")
      setCategory("General"); setTargetAudience("All")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to post notice.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_LINK}/api/deletenotice/${id}`, { withCredentials: true })
      setNotices((prev) => prev.filter((n) => n._id !== id))
    } catch {
      setError("Failed to delete notice.")
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = filterCat ? notices.filter((n) => n.category === filterCat) : notices

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <span className="text-2xl">📢</span> Notice & Announcements
          </h1>
          <p className="text-base-content/60 mt-1">Publish notices visible to students instantly.</p>
        </div>
        <div className="stats shadow bg-base-100 text-sm">
          <div className="stat py-3 px-5">
            <div className="stat-title text-xs">Total Notices</div>
            <div className="stat-value text-2xl text-primary">{notices.length}</div>
          </div>
          <div className="stat py-3 px-5">
            <div className="stat-title text-xs">Urgent</div>
            <div className="stat-value text-2xl text-error">{notices.filter(n => n.category === "Urgent").length}</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="alert alert-success mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Notice published successfully!</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error mb-6 shadow-sm">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost ml-auto" onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* Compose Card */}
      <div className="card bg-base-100 shadow-md mb-8 border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg mb-1 flex items-center gap-2">
            <span className="badge badge-primary badge-sm">NEW</span>
            Compose Notice
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control md:col-span-2">
                <label className="label" htmlFor="notice-title">
                  <span className="label-text font-medium">📌 Title</span>
                </label>
                <input
                  id="notice-title"
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="e.g. School closed on Friday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="notice-category">
                  <span className="label-text font-medium">🏷️ Category</span>
                </label>
                <select
                  id="notice-category"
                  className="select select-bordered w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="notice-audience">
                  <span className="label-text font-medium">🎯 Target Audience</span>
                </label>
                <select
                  id="notice-audience"
                  className="select select-bordered w-full"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                >
                  {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="notice-author">
                  <span className="label-text font-medium">✍️ Posted By</span>
                </label>
                <input
                  id="notice-author"
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="e.g. Principal"
                  value={postedBy}
                  onChange={(e) => setPostedBy(e.target.value)}
                  required
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label" htmlFor="notice-content">
                  <span className="label-text font-medium">📝 Content</span>
                </label>
                <textarea
                  id="notice-content"
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  placeholder="Write the full announcement here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" id="notice-submit-btn" className="btn btn-primary px-8" disabled={loading}>
                {loading ? <><span className="loading loading-spinner loading-sm" /> Publishing...</> : "📢 Publish Notice"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notices List */}
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="card-title text-lg">Published Notices</h2>
            <select
              id="notice-filter"
              className="select select-bordered select-sm w-full sm:w-44"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-base-content/40 gap-2">
              <span className="text-5xl">📭</span>
              <p className="font-medium">No notices published yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((n) => (
                <div
                  key={n._id}
                  className="border border-base-300 rounded-xl p-4 bg-base-50 hover:bg-base-200 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`badge ${CATEGORY_BADGE[n.category] || "badge-neutral"} badge-sm`}>{n.category}</span>
                      <span className="badge badge-outline badge-sm">{n.targetAudience}</span>
                      <h3 className="font-semibold text-base">{n.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-base-content/40">
                        {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setExpandedId(expandedId === n._id ? null : n._id)}
                      >
                        {expandedId === n._id ? "▲ Hide" : "▼ View"}
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => handleDelete(n._id)}
                        disabled={deletingId === n._id}
                      >
                        {deletingId === n._id ? <span className="loading loading-spinner loading-xs" /> : "Delete"}
                      </button>
                    </div>
                  </div>

                  {expandedId === n._id && (
                    <div className="mt-3 pt-3 border-t border-base-300">
                      <p className="text-sm text-base-content/80 whitespace-pre-wrap">{n.content}</p>
                      <p className="text-xs text-base-content/40 mt-2">— {n.postedBy}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}