'use client'
import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Literature', 'Physical Education', 'Arts']
const CLASSES = ['Class 1 - A', 'Class 1 - B', 'Class 2 - A', 'Class 2 - B', 'Class 3 - A', 'Class 3 - B', 'Class 4 - A', 'Class 4 - B', 'Class 5 - A', 'Class 5 - B']
const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

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

const DAY_ABBR: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun'
}

export default function SchedulePage() {
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar')

  const [form, setForm] = useState({
    title: '', classes: '', subject: '', teacher: '',
    dayOfWeek: '', startDate: '', endDate: '',
    startTime: '', endTime: '', room: '', color: COLORS[0]
  })

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchSchedules = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/getschedules`, { withCredentials: true })
      .then(res => setSchedules(res.data.schedules))
      .catch(err => console.error(err))
  }

  useEffect(() => { fetchSchedules() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_LINK}/api/addschedule`, form, { withCredentials: true })
      showToast('Schedule added successfully!', 'success')
      setShowForm(false)
      setForm({ title: '', classes: '', subject: '', teacher: '', dayOfWeek: '', startDate: '', endDate: '', startTime: '', endTime: '', room: '', color: COLORS[0] })
      fetchSchedules()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to add schedule', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this schedule?')) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_LINK}/api/deleteschedule/${id}`, { withCredentials: true })
      showToast('Schedule deleted', 'success')
      fetchSchedules()
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  // Calendar helpers
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay() // 0=Sun
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // make Mon=0

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = Array(startOffset).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [calYear, calMonth, startOffset, daysInMonth])

  const schedulesOnDay = (dayNum: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    const jsDay = new Date(calYear, calMonth, dayNum).getDay()
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][jsDay]
    return schedules.filter(s => s.dayOfWeek === dayName && dateStr >= s.startDate && dateStr <= s.endDate)
  }

  const selectedDaySchedules = useMemo(() => {
    if (!selectedDate) return []
    const [y, m, d] = selectedDate.split('-').map(Number)
    const jsDay = new Date(y, m - 1, d).getDay()
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][jsDay]
    return schedules.filter(s => s.dayOfWeek === dayName && selectedDate >= s.startDate && selectedDate <= s.endDate)
  }, [selectedDate, schedules])

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) } else setCalMonth(m => m - 1) }
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) } else setCalMonth(m => m + 1) }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff', padding: '12px 24px', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)', fontWeight: 600, fontSize: 14
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '32px 32px 28px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Admin Panel</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Class Schedule Manager</h1>
            <p style={{ margin: '6px 0 0', opacity: 0.8, fontSize: 14 }}>Create and manage weekly class schedules for all classes.</p>
          </div>
          <button
            id="open-add-schedule-form"
            onClick={() => setShowForm(true)}
            style={{
              background: '#fff', color: '#6366f1', border: 'none', borderRadius: 12,
              padding: '12px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            <span style={{ fontSize: 20 }}>＋</span> Add Schedule
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          {(['calendar', 'list'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
              border: activeTab === tab ? '2px solid rgba(255,255,255,0.6)' : '2px solid transparent',
              color: '#fff', borderRadius: 8, padding: '7px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              textTransform: 'capitalize', backdropFilter: 'blur(4px)'
            }}>{tab === 'calendar' ? '📅 Calendar View' : '📋 List View'}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 32px' }}>

        {/* ── CALENDAR VIEW ── */}
        {activeTab === 'calendar' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            {/* Calendar */}
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
              {/* Month nav */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <button onClick={prevMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 36, height: 36, fontSize: 18, cursor: 'pointer' }}>‹</button>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{MONTH_NAMES[calMonth]} {calYear}</h2>
                <button onClick={nextMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 36, height: 36, fontSize: 18, cursor: 'pointer' }}>›</button>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '8px 12px 0' }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#94a3b8', padding: '8px 0', textTransform: 'uppercase' }}>{d}</div>
                ))}
              </div>

              {/* Cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 12px 12px', gap: 2 }}>
                {calendarCells.map((dayNum, idx) => {
                  if (!dayNum) return <div key={idx} />
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                  const isToday = dayNum === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                  const isSelected = dateStr === selectedDate
                  const daySchedules = schedulesOnDay(dayNum)
                  return (
                    <div
                      key={idx}
                      id={`cal-day-${dateStr}`}
                      onClick={() => setSelectedDate(dateStr)}
                      style={{
                        borderRadius: 10, padding: '6px 4px', minHeight: 72, cursor: 'pointer',
                        background: isSelected ? '#ede9fe' : isToday ? '#f0f9ff' : '#fff',
                        border: isSelected ? '2px solid #6366f1' : isToday ? '2px solid #bae6fd' : '2px solid transparent',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isToday && !isSelected ? '#6366f1' : 'transparent',
                        color: isToday && !isSelected ? '#fff' : isSelected ? '#6366f1' : '#1e293b',
                        fontWeight: isToday || isSelected ? 700 : 500, fontSize: 13, marginBottom: 4
                      }}>{dayNum}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {daySchedules.slice(0, 2).map(s => (
                          <div key={s._id} style={{
                            background: s.color, color: '#fff', borderRadius: 4,
                            fontSize: 9, fontWeight: 600, padding: '2px 4px',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>{s.subject}</div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div style={{ fontSize: 9, color: '#6366f1', fontWeight: 700 }}>+{daySchedules.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Day detail panel */}
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 24 }}>
              {selectedDate ? (
                <>
                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                    📅 {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  {selectedDaySchedules.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: 40 }}>
                      <div style={{ fontSize: 40 }}>📭</div>
                      <p style={{ marginTop: 8, fontSize: 14 }}>No classes scheduled</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {selectedDaySchedules.map(s => (
                        <div key={s._id} style={{
                          borderLeft: `4px solid ${s.color}`, background: '#f8fafc',
                          borderRadius: '0 10px 10px 0', padding: '12px 14px'
                        }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 4 }}>{s.title}</div>
                          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span>📚 {s.subject} — {s.classes}</span>
                            <span>👤 {s.teacher}</span>
                            <span>🕐 {s.startTime} – {s.endTime}</span>
                            {s.room && <span>🏫 Room {s.room}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: 60 }}>
                  <div style={{ fontSize: 48 }}>📅</div>
                  <p style={{ marginTop: 12, fontSize: 14 }}>Click a day to see its schedule</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {activeTab === 'list' && (
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1e293b' }}>All Schedules ({schedules.length})</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['#','Title','Class','Subject','Teacher','Day','Period','Date Range','Room',''].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedules.length === 0 ? (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>No schedules yet. Click "Add Schedule" to get started.</td></tr>
                  ) : schedules.map((s, i) => (
                    <tr key={s._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{s.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}><span style={{ background: '#ede9fe', color: '#6366f1', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{s.classes}</span></td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{s.subject}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{s.teacher}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{DAY_ABBR[s.dayOfWeek] ?? s.dayOfWeek}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', whiteSpace: 'nowrap' }}>{s.startTime} – {s.endTime}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', whiteSpace: 'nowrap' }}>{s.startDate} → {s.endDate}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{s.room || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          id={`delete-schedule-${s._id}`}
                          onClick={() => handleDelete(s._id)}
                          style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD SCHEDULE MODAL ── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 680,
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)'
          }}>
            {/* Modal header */}
            <div style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', padding: '24px 28px', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 800 }}>Add New Class Schedule</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, width: 32, height: 32, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* Title */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Schedule Title</label>
                  <input id="sched-title" required placeholder="e.g. Morning Math Class" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
                </div>

                {/* Class */}
                <div>
                  <label style={labelStyle}>Class</label>
                  <select id="sched-class" required value={form.classes} onChange={e => setForm(f => ({ ...f, classes: e.target.value }))} style={inputStyle}>
                    <option value="">Select class</option>
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select id="sched-subject" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={inputStyle}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Teacher */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Teacher Name</label>
                  <input id="sched-teacher" required placeholder="e.g. Mr. John Smith" value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} style={inputStyle} />
                </div>

                {/* Day of Week */}
                <div>
                  <label style={labelStyle}>Day of Week</label>
                  <select id="sched-day" required value={form.dayOfWeek} onChange={e => setForm(f => ({ ...f, dayOfWeek: e.target.value }))} style={inputStyle}>
                    <option value="">Select day</option>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                {/* Room */}
                <div>
                  <label style={labelStyle}>Room / Location</label>
                  <input id="sched-room" placeholder="e.g. Room 101" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} style={inputStyle} />
                </div>

                {/* Start Date */}
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input id="sched-start-date" type="date" required value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={inputStyle} />
                </div>

                {/* End Date */}
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input id="sched-end-date" type="date" required value={form.endDate} min={form.startDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} style={inputStyle} />
                </div>

                {/* Start Time */}
                <div>
                  <label style={labelStyle}>Start Time</label>
                  <input id="sched-start-time" type="time" required value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} style={inputStyle} />
                </div>

                {/* End Time */}
                <div>
                  <label style={labelStyle}>End Time</label>
                  <input id="sched-end-time" type="time" required value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} style={inputStyle} />
                </div>

                {/* Color */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Label Color</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                    {COLORS.map(c => (
                      <button type="button" key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                        width: 32, height: 32, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #1e293b' : '3px solid transparent',
                        cursor: 'pointer', outline: form.color === c ? '2px solid #fff' : 'none', outlineOffset: -4
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '2px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                <button id="submit-schedule" type="submit" disabled={submitting} style={{ flex: 2, padding: '12px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Saving…' : '＋ Add Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: '#374151', marginBottom: 6
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid #e2e8f0', fontSize: 14, color: '#1e293b',
  background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit'
}