'use client'
import axios from "axios"
import React, { useEffect, useState } from "react"

type ExamEntry = {
  _id: string
  date: string
  classes: string
  subject: string
  startTime: string
  endTime: string
}

export default function StudentExamPage() {
  const [exams, setExams] = useState<ExamEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClass, setFilterClass] = useState("")

  const CLASSES = ["Class 1 - A", "Class 1 - B", "Class 2 - A", "Class 2 - B", "Class 3 - A", "Class 3 - B", "Class 4 - A", "Class 4 - B", "Class 5 - A", "Class 5 - B"]

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/showexam`, { withCredentials: true })
      .then((res) => { setExams(res.data.exam); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filterClass ? exams.filter(e => e.classes === filterClass) : exams

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
          <span className="text-2xl">📝</span> Exam Schedule
        </h1>
        <p className="text-base-content/60 mt-1">View all upcoming exams for your class.</p>
      </div>

      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="card-title text-lg">Scheduled Exams</h2>
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
                  <tr><th>#</th><th>Date</th><th>Class</th><th>Subject</th><th>Start</th><th>End</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-base-content/40 py-12">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">📋</span>
                          <p>No exams scheduled.</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((e, idx) => (
                    <tr key={e._id} className="hover">
                      <td className="text-base-content/40 text-xs font-mono">{idx + 1}</td>
                      <td className="font-medium">{e.date}</td>
                      <td><span className="badge badge-outline badge-sm">{e.classes}</span></td>
                      <td>{e.subject}</td>
                      <td className="font-mono text-sm">{e.startTime}</td>
                      <td className="font-mono text-sm">{e.endTime}</td>
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