"use client"
import React from 'react'
import {useLocalStorage} from "@uidotdev/usehooks";
import {useRouter} from 'next/navigation'
import dynamic from "next/dynamic";


function Login() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [name, setName] = React.useState('')
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [token, setToken] = useLocalStorage('s_token', '')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        if (name.length < 3) {
            setError('Name must be at least 3 characters')
            setLoading(false)
            return
        }
        if (email.length < 5) {
            setError('Email must be at least 5 characters')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password, name}),
            })

            if (!res.ok) {
                throw new Error(res.statusText)
            }

            const data = await res.json()
            setToken(data.token)
            setSuccess('Login successful!')
            router.push('/')
        } catch (err : any) {
            setError(err.message)
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-xs"
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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