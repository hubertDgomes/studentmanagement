'use client'
import axios from "axios"
import React, { useEffect, useState } from "react"

type Schedule = {
  _id: string
  title: string
  classes: string
  subject: string
  teacher: string
  dayOfWeek: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  room: string
  color: string
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const CLASSES = ["Class 1 - A", "Class 1 - B", "Class 2 - A", "Class 2 - B", "Class 3 - A", "Class 3 - B", "Class 4 - A", "Class 4 - B", "Class 5 - A", "Class 5 - B"]

export default function StudentSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClass, setFilterClass] = useState("")
  const [filterDay, setFilterDay] = useState("")
  const [view, setView] = useState<"table" | "cards">("cards")

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/getschedules`, { withCredentials: true })
      .then((res) => { setSchedules(res.data.schedules); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = schedules
    .filter(s => !filterClass || s.classes === filterClass)
    .filter(s => !filterDay || s.dayOfWeek === filterDay)

  // Group by day for card view
  const byDay = DAYS.reduce<Record<string, Schedule[]>>((acc, day) => {
    acc[day] = filtered.filter(s => s.dayOfWeek === day)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <span className="text-2xl">🗓️</span> My Class Schedule
          </h1>
          <p className="text-base-content/60 mt-1">View all your weekly class timetables.</p>
        </div>
        <div className="stats shadow bg-base-100 text-sm">
          <div className="stat py-3 px-5">
            <div className="stat-title text-xs">Total Sessions</div>
            <div className="stat-value text-2xl text-primary">{schedules.length}</div>
          </div>
          <div className="stat py-3 px-5">
            <div className="stat-title text-xs">Active Days</div>
            <div className="stat-value text-2xl text-secondary">
              {DAYS.filter(d => schedules.some(s => s.dayOfWeek === d)).length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select
          className="select select-bordered select-sm w-44"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="select select-bordered select-sm w-40"
          value={filterDay}
          onChange={(e) => setFilterDay(e.target.value)}
        >
          <option value="">All Days</option>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <div className="join ml-auto">
          <button
            className={`join-item btn btn-sm ${view === "cards" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setView("cards")}
          >⊞ Week View</button>
          <button
            className={`join-item btn btn-sm ${view === "table" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setView("table")}
          >☰ Table</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : view === "cards" ? (
        /* ── Week Card View ── */
        <div className="flex flex-col gap-4">
          {DAYS.map(day => {
            const sessions = byDay[day]
            if (!sessions.length) return null
            return (
              <div key={day} className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body py-4">
                  <h2 className="font-bold text-base text-base-content/70 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    {day}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sessions.map(s => (
                      <div
                        key={s._id}
                        className="rounded-xl p-4 border-l-4 bg-base-200"
                        style={{ borderLeftColor: s.color || "#6366f1" }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{s.title}</h3>
                          <span className="badge badge-outline badge-xs">{s.classes}</span>
                        </div>
                        <p className="text-xs text-base-content/60 mb-1">📚 {s.subject}</p>
                        <p className="text-xs text-base-content/60 mb-1">👨‍🏫 {s.teacher}</p>
                        {s.room && <p className="text-xs text-base-content/60 mb-1">🚪 {s.room}</p>}
                        <div className="flex gap-2 mt-2 items-center">
                          <span className="text-xs font-mono bg-base-100 px-2 py-0.5 rounded">
                            {s.startTime} – {s.endTime}
                          </span>
                        </div>
                        <p className="text-xs text-base-content/40 mt-1">{s.startDate} → {s.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-base-content/40 gap-3">
              <span className="text-6xl">📅</span>
              <p className="font-semibold text-lg">No schedules found.</p>
              <p className="text-sm">Try changing the filters above.</p>
            </div>
          )}
        </div>
      ) : (
        /* ── Table View ── */
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Day</th>
                    <th>Room</th>
                    <th>Time</th>
                    <th>Period</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center text-base-content/40 py-12">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">📅</span>
                          <p>No schedules found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((s, idx) => (
                    <tr key={s._id} className="hover">
                      <td className="font-mono text-xs text-base-content/40">{idx + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: s.color || "#6366f1" }}
                          />
                          <span className="font-medium text-sm">{s.title}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-outline badge-sm">{s.classes}</span></td>
                      <td className="text-sm">{s.subject}</td>
                      <td className="text-sm">{s.teacher}</td>
                      <td className="text-sm font-medium">{s.dayOfWeek}</td>
                      <td className="text-sm">{s.room || "—"}</td>
                      <td className="font-mono text-xs">{s.startTime}–{s.endTime}</td>
                      <td className="text-xs text-base-content/50">{s.startDate} → {s.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}