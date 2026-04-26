'use client'
import axios from "axios"
import React, { useEffect, useState } from "react"

type User = {
  _id: string
  name: string
  email: string
  studentId: string
  dept: string
  semester: string
  role: string
}

export default function StudentDashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/profile`, { withCredentials: true })
      .then((res) => { setUser(res.data.user); setLoading(false) })
      .catch(() => { setError("Could not load profile. Please log in."); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  )

  if (error || !user) return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="alert alert-error max-w-sm">{error || "Not logged in."}</div>
    </div>
  )

  const initials = user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">My Dashboard</h1>
        <p className="text-base-content/60 mt-1">Welcome back, {user.name.split(" ")[0]}! Here's your overview.</p>
      </div>

      {/* Profile Card */}
      <div className="card bg-base-100 shadow-md mb-8 border border-base-300">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-3xl flex items-center justify-center">
                <span>{initials}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-base-content">{user.name}</h2>
              <p className="text-base-content/50 text-sm mb-4">{user.email}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoPill label="Student ID" value={user.studentId} icon="🪪" />
                <InfoPill label="Department" value={user.dept} icon="🏛️" />
                <InfoPill label="Semester" value={user.semester} icon="📅" />
                <InfoPill label="Role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} icon="👤" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "My Schedule", icon: "🗓️", href: "/student-dashboard/schedules" },
          { label: "Exam Dates", icon: "📝", href: "/student-dashboard/examschedule" },
          { label: "Lab Sessions", icon: "🔬", href: "/student-dashboard/labschedule" },
          { label: "Notices", icon: "📢", href: "/student-dashboard/notice" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div className="card-body items-center text-center py-6 px-4">
              <span className="text-3xl mb-1">{item.icon}</span>
              <p className="font-semibold text-sm text-base-content">{item.label}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Recent Notices Preview */}
      <RecentNotices />
    </div>
  )
}

function InfoPill({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-base-200 rounded-xl px-4 py-3">
      <p className="text-xs text-base-content/50 mb-0.5">{icon} {label}</p>
      <p className="font-semibold text-sm text-base-content truncate">{value}</p>
    </div>
  )
}

function RecentNotices() {
  const [notices, setNotices] = useState<any[]>([])

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/getnotices`, { withCredentials: true })
      .then((res) => setNotices(res.data.notices.slice(0, 3)))
      .catch(() => {})
  }, [])

  const BADGE: Record<string, string> = {
    General: "badge-neutral", Exam: "badge-warning", Lab: "badge-info",
    Holiday: "badge-success", Event: "badge-accent", Urgent: "badge-error",
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-lg">📢 Latest Notices</h2>
          <a href="/student-dashboard/notice" className="btn btn-ghost btn-sm">View All →</a>
        </div>
        {notices.length === 0 ? (
          <div className="text-center text-base-content/40 py-8">
            <span className="text-3xl">📭</span>
            <p className="mt-2">No notices yet.</p>
          </div>
        ) : notices.map((n) => (
          <div key={n._id} className="border-l-4 border-primary pl-4 py-2 mb-3">
            <div className="flex gap-2 items-center mb-1">
              <span className={`badge ${BADGE[n.category] || "badge-neutral"} badge-xs`}>{n.category}</span>
              <span className="text-xs text-base-content/40">
                {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            </div>
            <p className="font-semibold text-sm">{n.title}</p>
            <p className="text-xs text-base-content/60 line-clamp-2 mt-0.5">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}