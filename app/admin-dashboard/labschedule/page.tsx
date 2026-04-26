'use client'
import axios from "axios"
import React, { useEffect, useState } from "react"

type LabEntry = {
  _id: string
  date: string
  classes: string
  subject: string
  labRoom: string
  startTime: string
  endTime: string
  teacher: string
}

const LAB_ROOMS = ["Lab A", "Lab B", "Lab C", "Lab D", "Computer Lab 1", "Computer Lab 2", "Physics Lab", "Chemistry Lab", "Biology Lab"]
const CLASSES = ["Class 1 - A", "Class 1 - B", "Class 2 - A", "Class 2 - B", "Class 3 - A", "Class 3 - B", "Class 4 - A", "Class 4 - B", "Class 5 - A", "Class 5 - B"]
const SUBJECTS = ["Computer Science", "Physics", "Chemistry", "Biology", "Mathematics", "Electronics", "Environmental Science"]
const TEACHERS = ["Mr. Rahman", "Ms. Hossain", "Mr. Islam", "Ms. Begum", "Mr. Ahmed", "Ms. Khatun", "Mr. Ali"]

export default function LabSchedulePage() {
  const [date, setDate] = useState("")
  const [classes, setClasses] = useState("")
  const [subject, setSubject] = useState("")
  const [labRoom, setLabRoom] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [teacher, setTeacher] = useState("")
  const [labData, setLabData] = useState<LabEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filterClass, setFilterClass] = useState("")

  const fetchLabs = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/getlabschedules`, { withCredentials: true })
      .then((res) => setLabData(res.data.labs))
      .catch(() => {})
  }

  useEffect(() => { fetchLabs() }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_LINK}/api/addlabschedule`,
        { date, classes, subject, labRoom, startTime, endTime, teacher },
        { withCredentials: true }
      )
      setLabData((prev) => [...prev, res.data.message])
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 3000)
      // reset form
      setDate(""); setClasses(""); setSubject(""); setLabRoom("")
      setStartTime(""); setEndTime(""); setTeacher("")
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_LINK}/api/deletelabschedule/${id}`, { withCredentials: true })
      setLabData((prev) => prev.filter((e) => e._id !== id))
    } catch {
      setError("Failed to delete entry.")
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = filterClass ? labData.filter((e) => e.classes === filterClass) : labData

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <span className="text-2xl">🔬</span> Lab Schedule
          </h1>
          <p className="text-base-content/60 mt-1">Create and manage laboratory session schedules.</p>
        </div>
        <div className="stats shadow bg-base-100 text-sm">
          <div className="stat py-3 px-5">
            <div className="stat-title text-xs">Total Sessions</div>
            <div className="stat-value text-2xl text-primary">{labData.length}</div>
          </div>
          <div className="stat py-3 px-5">
            <div className="stat-title text-xs">Labs in Use</div>
            <div className="stat-value text-2xl text-secondary">{new Set(labData.map(e => e.labRoom)).size}</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {submitSuccess && (
        <div className="alert alert-success mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Lab session scheduled successfully!</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost ml-auto" onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* Form Card */}
      <div className="card bg-base-100 shadow-md mb-8 border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg mb-1 flex items-center gap-2">
            <span className="badge badge-primary badge-sm">NEW</span>
            Add Lab Session
          </h2>
          <p className="text-base-content/50 text-sm mb-4">Fill in all fields to schedule a new lab session.</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

              {/* Date */}
              <div className="form-control">
                <label className="label" htmlFor="lab-date">
                  <span className="label-text font-medium">📅 Date</span>
                </label>
                <input
                  id="lab-date"
                  type="date"
                  className="input input-bordered w-full"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Class */}
              <div className="form-control">
                <label className="label" htmlFor="lab-class">
                  <span className="label-text font-medium">🏫 Class</span>
                </label>
                <select
                  id="lab-class"
                  className="select select-bordered w-full"
                  value={classes}
                  onChange={(e) => setClasses(e.target.value)}
                  required
                >
                  <option value="" disabled>Select class</option>
                  {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div className="form-control">
                <label className="label" htmlFor="lab-subject">
                  <span className="label-text font-medium">📚 Subject</span>
                </label>
                <select
                  id="lab-subject"
                  className="select select-bordered w-full"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="" disabled>Select subject</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Lab Room */}
              <div className="form-control">
                <label className="label" htmlFor="lab-room">
                  <span className="label-text font-medium">🔬 Lab Room</span>
                </label>
                <select
                  id="lab-room"
                  className="select select-bordered w-full"
                  value={labRoom}
                  onChange={(e) => setLabRoom(e.target.value)}
                  required
                >
                  <option value="" disabled>Select lab room</option>
                  {LAB_ROOMS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Teacher */}
              <div className="form-control">
                <label className="label" htmlFor="lab-teacher">
                  <span className="label-text font-medium">👨‍🏫 Teacher</span>
                </label>
                <select
                  id="lab-teacher"
                  className="select select-bordered w-full"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  required
                >
                  <option value="" disabled>Select teacher</option>
                  {TEACHERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Start Time */}
              <div className="form-control">
                <label className="label" htmlFor="lab-start-time">
                  <span className="label-text font-medium">⏰ Start Time</span>
                </label>
                <input
                  id="lab-start-time"
                  type="time"
                  className="input input-bordered w-full"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              {/* End Time */}
              <div className="form-control">
                <label className="label" htmlFor="lab-end-time">
                  <span className="label-text font-medium">⏱️ End Time</span>
                </label>
                <input
                  id="lab-end-time"
                  type="time"
                  className="input input-bordered w-full"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>

              {/* Submit */}
              <div className="form-control justify-end">
                <label className="label">
                  <span className="label-text opacity-0">submit</span>
                </label>
                <button
                  type="submit"
                  id="lab-submit-btn"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading
                    ? <><span className="loading loading-spinner loading-sm" /> Saving...</>
                    : "＋ Add Session"}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* Table Card */}
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="card-title text-lg">Scheduled Lab Sessions</h2>
            <select
              id="lab-filter-class"
              className="select select-bordered select-sm w-full sm:w-48"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Lab Room</th>
                  <th>Teacher</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-base-content/40 py-12">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">🔬</span>
                        <p className="font-medium">No lab sessions scheduled yet.</p>
                        <p className="text-sm">Use the form above to add one.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((entry, idx) => (
                    <tr key={entry._id} className="hover">
                      <td className="font-mono text-xs text-base-content/50">{idx + 1}</td>
                      <td className="font-medium">{entry.date}</td>
                      <td><span className="badge badge-outline badge-sm">{entry.classes}</span></td>
                      <td>{entry.subject}</td>
                      <td>
                        <span className="badge badge-secondary badge-sm">{entry.labRoom}</span>
                      </td>
                      <td>{entry.teacher}</td>
                      <td className="font-mono text-sm">{entry.startTime}</td>
                      <td className="font-mono text-sm">{entry.endTime}</td>
                      <td>
                        <button
                          className="btn btn-error btn-xs"
                          onClick={() => handleDelete(entry._id)}
                          disabled={deletingId === entry._id}
                        >
                          {deletingId === entry._id
                            ? <span className="loading loading-spinner loading-xs" />
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}