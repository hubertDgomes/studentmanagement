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

const CATEGORY_BADGE: Record<string, string> = {
  General: "badge-neutral", Exam: "badge-warning", Lab: "badge-info",
  Holiday: "badge-success", Event: "badge-accent", Urgent: "badge-error",
}

const CATEGORIES = ["General", "Exam", "Lab", "Holiday", "Event", "Urgent"]

export default function StudentNoticePage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/getnotices`, { withCredentials: true })
      .then((res) => { setNotices(res.data.notices); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filterCat ? notices.filter((n) => n.category === filterCat) : notices

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <span className="text-2xl">📢</span> Notices & Announcements
          </h1>
          <p className="text-base-content/60 mt-1">Stay up to date with the latest school announcements.</p>
        </div>
        <div className="stats shadow bg-base-100 text-sm">
          <div className="stat py-3 px-5">
            <div className="stat-title text-xs">Total</div>
            <div className="stat-value text-2xl text-primary">{notices.length}</div>
          </div>
          <div className="stat py-3 px-5">
            <div className="stat-title text-xs">Urgent</div>
            <div className="stat-value text-2xl text-error">{notices.filter(n => n.category === "Urgent").length}</div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="card-title text-lg">All Notices</h2>
            <select
              className="select select-bordered select-sm w-full sm:w-44"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-base-content/40 gap-2">
              <span className="text-5xl">📭</span>
              <p className="font-medium">No notices available.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((n) => (
                <div
                  key={n._id}
                  className={`border rounded-xl p-4 transition-colors ${n.category === "Urgent" ? "border-error/40 bg-error/5" : "border-base-300 hover:bg-base-200"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`badge ${CATEGORY_BADGE[n.category] || "badge-neutral"} badge-sm`}>{n.category}</span>
                      <span className="badge badge-outline badge-sm">{n.targetAudience}</span>
                      <h3 className="font-semibold text-base">{n.title}</h3>
                      {n.category === "Urgent" && <span className="animate-pulse text-error font-bold text-xs">● URGENT</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-base-content/40">
                        {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setExpandedId(expandedId === n._id ? null : n._id)}
                      >
                        {expandedId === n._id ? "▲ Hide" : "▼ Read"}
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