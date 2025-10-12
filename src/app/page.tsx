'use client'

import { useState, useEffect } from 'react'
import { type } from '../../.next/types/routes';

type Application = {
  id: string
  company: string
  position: string
  status: string
  jobURL: string
  salary: number
  location: string
  dateApplied: string
}

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([])
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [jobURL, setJobURL] = useState('')
  const [salary, setSalary] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    const res = await fetch('/api/applications')
    const data = await res.json()
    setApplications(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, position, jobURL, salary, location })
    })
    setCompany('')
    setPosition('')
    setJobURL('')
    setSalary('')
    setLocation('')
    fetchApplications()
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Job Application Tracker</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder='JobURL'
              value={jobURL}
              onChange={(e) => setJobURL(e.target.value)}
            />
            <input 
              type="text"
              placeholder='Salary'
              value = {salary}
              onChange={(e) => setSalary(e.target.value)}
             />
             <input 
              type="text"
              placeholder='Location'
              value={location}
              onChange={(e) => setLocation(e.target.value)} />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Add Application
          </button>
        </form>

        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="mt-2 space-y-1 text-sm text-gray-500">
              <h3 className="text-xl font-semibold">{app.company}</h3>
              <p className="text-gray-600">{app.position}</p>
              {app.salary && <p>💰 {app.salary}</p>}
              {app.location && <p>📍 {app.location}</p>}
              <p className='text-gray-600'>{app.jobURL && ( 
                <a  href={app.jobURL} 
                    target='_blank'
                    rel="noopener noreferrer"
                    className='text-blue-500 hover:underline' 
                    >View Job Posting</a> )}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}