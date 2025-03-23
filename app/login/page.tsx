"use client"
import {redirect, useRouter} from 'next/navigation'
import React from 'react'
import {useLocalStorage} from "@uidotdev/usehooks";
import dynamic from "next/dynamic";


function Login() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [value, setValue] = useLocalStorage('s_token', '');
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            })

            if (!res.ok) {
                throw new Error('Invalid credentials')
            }

            const data = await res.json()
            setValue(data.token)
            setSuccess('Login successful!')
            router.push('/')
        } catch (err) {
            setError('Invalid credentials')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-4xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-xs"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-xs"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-500 text-white rounded-lg p-2 ${loading ? 'opacity-50' : ''}`}
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    )
}

export default dynamic(() => Promise.resolve(Login),{
    ssr: false,
});