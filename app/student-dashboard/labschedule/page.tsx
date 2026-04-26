'use client'
import axios from "axios"
import React, { useEffect, useState } from "react"

type LabEntry = {
  _id: string
  date: string
  classes: string
  subject: string
  labRoom: string
  teacher: string
  startTime: string
  endTime: string
}

const CLASSES = ["Class 1 - A", "Class 1 - B", "Class 2 - A", "Class 2 - B", "Class 3 - A", "Class 3 - B", "Class 4 - A", "Class 4 - B", "Class 5 - A", "Class 5 - B"]

export default function StudentLabPage() {
  const [labs, setLabs] = useState<LabEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClass, setFilterClass] = useState("")

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/getlabschedules`, { withCredentials: true })
      .then((res) => { setLabs(res.data.labs); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filterClass ? labs.filter(l => l.classes === filterClass) : labs

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
          <span className="text-2xl">🔬</span> Lab Schedule
        </h1>
        <p className="text-base-content/60 mt-1">View all laboratory sessions scheduled for your class.</p>
      </div>

      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="card-title text-lg">Lab Sessions</h2>
            <select
              className="select select-bordered select-sm w-full sm:w-48"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr><th>#</th><th>Date</th><th>Class</th><th>Subject</th><th>Lab Room</th><th>Teacher</th><th>Start</th><th>End</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-base-content/40 py-12">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">🔬</span>
                          <p>No lab sessions scheduled.</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((l, idx) => (
                    <tr key={l._id} className="hover">
                      <td className="text-base-content/40 text-xs font-mono">{idx + 1}</td>
                      <td className="font-medium">{l.date}</td>
                      <td><span className="badge badge-outline badge-sm">{l.classes}</span></td>
                      <td>{l.subject}</td>
                      <td><span className="badge badge-secondary badge-sm">{l.labRoom}</span></td>
                      <td>{l.teacher}</td>
                      <td className="font-mono text-sm">{l.startTime}</td>
                      <td className="font-mono text-sm">{l.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}