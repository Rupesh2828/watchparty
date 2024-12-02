"use client"

import { fetcher } from '@/lib/fetcher'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'

const page = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const { data, error } = useSWR(
        '/api/users', 
        () => fetcher('/api/users', 'POST', { username, email, password }), 
        { revalidateOnFocus: false, shouldRetryOnError: false, isPaused: () => !username || !email || !password }
      );

      const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()

        try {
            await mutate("/api/users", await fetcher('/api/users', 'POST', {username, email, password }),false)
            setMessage('User created successfully')
        } catch (error: any) {
            setMessage(error.message);
            
        }

      }
    
  return (
    <div className='flex flex-col items-center bg-gray-300'>
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
      {/* {error && <p>{error.message}</p>}
      {data && <pre>{JSON.stringify(data)}</pre>} */}
    </form>
    
    </div>
  )
}

export default page
