'use client'
import React, { useState } from 'react'
import Leftbar from './components/layouts/Leftbar'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'


type types = {
  e: any
}

const page = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [dept, setDept] = useState("")
  const [semester, setSemester] = useState("")
  const [studentId, setStudentId] = useState("")

  const [loader , setLoader] = useState(false)
    const router = useRouter()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoader(true)
    try {
     const res = await axios.post(`${process.env.NEXT_PUBLIC_API_LINK}/api/signup`, { name, email, password, dept, semester, studentId }, { withCredentials: true })
     alert("Account Create Successfully")
      router.push('/login')
    }
    catch (err) {
      alert("Something went wrong")
    }
    finally{
      setLoader(false)
    }
  }


  return (
    <>
      <div className="flex justify-center items-center h-screen max-h-[1200px] overflow-scroll">
        <div className="p-5 text-center">
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">What is your name?</legend>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text" className="input" placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">What is your Email?</legend>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email" className="input" placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Enter your password</legend>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password" className="input" placeholder="Type here" />
            </fieldset><fieldset className="fieldset">
              <legend className="fieldset-legend">Enter your depertment</legend>
              <input
                onChange={(e) => setDept(e.target.value)}
                type="text" className="input" placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Write you current semester</legend>
              <input
                onChange={(e) => setSemester(e.target.value)}
                type="text" className="input" placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Enter your StudentID</legend>
              <input
                onChange={(e) => setStudentId(e.target.value)}
                type="text" className="input" placeholder="Type here" />
            </fieldset>

            <button
              type='submit'
              className="btn btn-neutral btn-outline my-[20px]">{`${loader ? "Singing In" : "Signup"}`}</button>
          </form>
          <p>Already have an account? <span><Link href={'/login'}>Log In</Link></span></p>


        </div>
      </div>
    </>
  )
}

export default page