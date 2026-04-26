'use client'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_LINK}/api/login`, { email, password }, { withCredentials: true })
            alert("Login Successful!")
            
            const userRole = res.data.user.role;
            console.log(userRole);
            
            if (userRole === 'admin') {
                router.push("/admin-dashboard")
            } else {
                router.push("/student-dashboard")
            }
        }
        catch (err) {
            alert("Something went wrong")
        }
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="p-5 text-center">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
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
                        </fieldset>
                        <button
                            type='submit'
                            className="btn btn-neutral btn-outline my-[20px]">Login</button>
                    </form>
                    <p>New user? <span><Link href={'/'}>Signup</Link></span></p>
                </div>
            </div>
        </>
    )
}

export default page