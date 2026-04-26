'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const navLinks = [
  { label: "Dashboard",      icon: "🏠", href: "/student-dashboard" },
  { label: "Class Schedule", icon: "🗓️", href: "/student-dashboard/schedules" },
  { label: "Exam Schedule",  icon: "📝", href: "/student-dashboard/examschedule" },
  { label: "Lab Sessions",   icon: "🔬", href: "/student-dashboard/labschedule" },
  { label: "Notices",        icon: "📢", href: "/student-dashboard/notice" },
]

const Leftbar = () => {
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen bg-base-100 border-r border-base-300 flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-base-300">
        <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest mb-1">Student Portal</p>
        <h1 className="font-bold text-lg text-base-content leading-tight">
          ABC <span className="text-primary">School</span>
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navLinks.map(({ label, icon, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-base-300">
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-error/70 hover:bg-error/10 hover:text-error transition-all"
        >
          <span>🚪</span> Logout
        </Link>
      </div>
    </div>
  )
}

export default Leftbar