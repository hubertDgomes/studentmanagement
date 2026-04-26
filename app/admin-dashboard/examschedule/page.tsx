'use client'
import axios from "axios"
import React, { useEffect, useState } from "react"

const ExamSchedulePage = () => {

  const [exam, setExam] = useState("")
  const [classes, setClasses] = useState("")
  const [subject, setSubject] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const [examData, setExamData] = useState<any[]>([])

  const fetchExams = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/showexam`, { withCredentials: true })
      .then((res) => setExamData(res.data.exam))
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const handleExamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_LINK}/api/addexam`,
        { date: exam, classes, subject, startTime, endTime },
        { withCredentials: true }
      )
      setExamData((prev: any) => [...prev, res.data.message])
    } catch (err) {
      console.log(err)
    }
  }



 
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Exam Schedule</h1>
        <p className="text-base-content/60 mt-1">Create and manage exam schedules for all classes.</p>
      </div>

      <div className="card bg-base-100 shadow-md mb-8">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Add New Exam</h2>

          <form onSubmit={handleExamSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Date */}
              <div className="form-control">
                <label className="label" htmlFor="exam-date">
                  <span className="label-text font-medium">Exam Date</span>
                </label>
                <input
                  onChange={(e) => setExam(e.target.value)}
                  id="exam-date"
                  type="date"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Class Selection */}
              <div className="form-control">
                <label className="label" htmlFor="exam-class">
                  <span className="label-text font-medium">Class</span>
                </label>
                <select
                  onChange={(e) => setClasses(e.target.value)}
                  id="exam-class" className="select select-bordered w-full" required>
                  <option value="" disabled>Select a class</option>
                  <option value="Class 1 - A">Class 1 - A</option>
                  <option value="Class 1 - B">Class 1 - B</option>
                  <option value="Class 2 - A">Class 2 - A</option>
                  <option value="Class 2 - B">Class 2 - B</option>
                  <option value="Class 3 - A">Class 3 - A</option>
                  <option value="Class 3 - B">Class 3 - B</option>
                  <option value="Class 4 - A">Class 4 - A</option>
                  <option value="Class 4 - B">Class 4 - B</option>
                  <option value="Class 5 - A">Class 5 - A</option>
                  <option value="Class 5 - B">Class 5 - B</option>
                </select>
              </div>

              {/* Subject */}
              <div className="form-control">
                <label className="label" htmlFor="exam-subject">
                  <span className="label-text font-medium">Subject</span>
                </label>
                <select
                  onChange={(e) => setSubject(e.target.value)}
                  id="exam-subject" className="select select-bordered w-full" required>
                  <option value="" disabled>Select a subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Literature">Literature</option>
                </select>
              </div>

              {/* Start Time */}
              <div className="form-control">
                <label className="label" htmlFor="exam-start-time">
                  <span className="label-text font-medium">Start Time</span>
                </label>
                <input
                  onChange={(e) => setStartTime(e.target.value)}
                  id="exam-start-time"
                  type="time"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* End Time */}
              <div className="form-control">
                <label className="label" htmlFor="exam-end-time">
                  <span className="label-text font-medium">End Time</span>
                </label>
                <input
                  onChange={(e) => setEndTime(e.target.value)}
                  id="exam-end-time"
                  type="time"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Submit */}
              <div className="form-control justify-end">
                <label className="label">
                  <span className="label-text opacity-0">submit</span>
                </label>
                <button type="submit" className="btn btn-primary w-full">
                  + Add Schedule
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* Entries Table */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Scheduled Exams</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {examData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-base-content/50 py-6">No exams scheduled yet.</td>
                  </tr>
                ) : (
                  examData.map((entry: any, idx: number) => (
                    <tr key={entry._id}>
                      <td>{idx + 1}</td>
                      <td>{entry.date}</td>
                      <td><span className="badge badge-outline">{entry.classes}</span></td>
                      <td>{entry.subject}</td>
                      <td>{entry.startTime}</td>
                      <td>{entry.endTime}</td>
                     
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

export default ExamSchedulePage