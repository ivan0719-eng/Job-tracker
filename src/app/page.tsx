'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'


type Application = {
  id: string
  company: string
  position: string
  status: string
  jobUrl: string
  salary: number
  location: string
  dateApplied: string
  
}

export default function Home() {
  const {data: session, status} = useSession()
  const router = useRouter()

  const [applications, setApplications] = useState<Application[]>([])
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [jobUrl, setJobURL] = useState('')
  const [salary, setSalary] = useState('')
  const [location, setLocation] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [bullets, setBullets] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  
  useEffect(() => {
    if( status === "unauthenticated"){
      router.push('/auth/signin')
    }
  },[status, router])

  

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApplications()
    }
  }, [status])

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
      body: JSON.stringify({ company, position, jobUrl, salary, location })
    })
    setCompany('')
    setPosition('')
    setJobURL('')
    setSalary('')
    setLocation('')
    fetchApplications()
  }

  const handleGenerateBullets = async (e: React.FormEvent) => {
    e.preventDefault()
    

      if (!projectDescription.trim()) {
        alert('Please enter a project description')
        return
      }
      
      setIsGenerating(true)
      
      try{
      const response = await fetch('/api/generate-bullets',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({description: projectDescription})
      })
      
      const data = await response.json()
      
      if(response.ok){
        setBullets(data.bullets)
      }else {
        alert('Failed to generate bullets ' + data.error)
      }


    }catch(error){
      alert('Error generating bullets')
      console.error('Could Not Generate Bullets', error)
    } finally {
      setIsGenerating(false)
    }
      
  }

  const updateStatus = async (id: string, newStatus: string) => {
    
    try{
      // call API PATCH
      const response = await fetch(`/api/applications/${id}`,
        {
          method: `PATCH`,
          headers: {'Content-Type' : 'applications/json'},
          body: JSON.stringify({status: newStatus})
        }
      )

      if(response.ok){
        fetchApplications()
      } else {
        alert('Failed To Update Server')
      }

    } catch(error) {
      console.error("Update Error",error)
      alert("Error Updating Status")
    }
  }

  const deleteApplication = async (id:string) => {

    if (!confirm('Are you sure you want to delete this application?')) {
    return
  }

    try{

      const response = await fetch(`/api/applications/${id}`,
        {
          method: `DELETE`

        }
      )

      if(response.ok){
        fetchApplications()
      } else {
        alert("Failed To Delete Application")
      }

    } catch (error) {
      console.error('Delete Error',error)
      alert('Delete Error')
    }
  }

  if(status === "loading"){
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p>
          Loading ...
        </p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Redirecting...
  }

  {session && (
    <div className='mb-8 flex items-center justify-between bg-white p-4 rounded-lg shadow'>
      <div className='flex items-center gap-3'>
        {session.user?.image && (
          <img 
          src= {session.user.image} 
          alt= {session.user.name || 'User'}
          className='w-10 h-10 rounded-full'
          />
        ) }
      </div>

      /* This button will be moved to the settings page later */
    <button
        onClick={() => signOut()}
        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
    >
      Sign Out
    </button>
    </div>
  )}

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">Job Application Tracker</h1>

        {/*Dashboard Navigation */}
        <div className="mb-8 flex gap-4">
          <Link
          href={"/dashboard"}
          className='bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold'
          >
            📊 View Analytics Dashboard
          </Link>
        </div>
        
        {/* Application Form */} 
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text"
              placeholder="Company "
              style={{color: 'black'}}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Position"
              style={{color: 'black'}}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder='JobURL'
              style={{color: 'black'}}
              value={jobUrl}
              onChange={(e) => setJobURL(e.target.value)}
              className='border p-2 rounded'
              required
            />
            <input 
              type="text"
              placeholder='Salary'
              style={{color: 'black'}}
              value = {salary}
              onChange={(e) => setSalary(e.target.value)}
              className='border p-2 rounded'
              required
             />
             <input 
              type="text"
              placeholder='Location'
              style={{color: 'black'}}
              value={location}
              onChange={(e) => setLocation(e.target.value)} className='border p-2 rounded'
              required
              />
              
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Add Application
          </button>
        </form>

        /* AI Resume Bullet Generator Part*/
        <div className='bg-white p-6 rounded-lg shadow mb-8'>
          <h2 className='text-2xl font-bold mb-4 text-black' >AI Resume Bullet Generator</h2>

          <form onSubmit={handleGenerateBullets} className='bg-white p-6 rounded-lg shadow mb-8'>
            <textarea 
            placeholder='Describe Your Project Or Working Experience'
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={5}
            style={{color: 'black'}}
            className='w-full border p-3 rounded'
            >
            </textarea>

              <button 
                type='submit'
                disabled = {isGenerating}
                className='mt-4 bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400'
              >
                {isGenerating ? 'Generating...': 'Generate Bullets'}
              </button>

            
          </form>

          {bullets && (
            <div className='mt-6 p-4 bg-gray-50 rounded'>
              <h3 className='font-semibold mb-2 text-black'>Generated Bullets:</h3>
              <div className='whitespace-pre-line text-gray-700 '>
                {bullets}
              </div>
            </div>
          )}
        </div>

        {/*Application Job Listing */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="mt-2 space-y-1 text-sm text-gray-500 p-6 rounded bg-white shadow mb-8 relative" >

              {/* Delete button - top right */}
              <button 
                onClick={()=>deleteApplication(app.id)
                }
                className='absolute top-4 right-4 text-red-500 hover:text-red-700'
                title='Delete Application'
              >
                ❌
              </button>

              <h3 className='className="text-xl font-semibold"' >{app.company}</h3>
              <p className="text-gray-600">{app.position}</p>

              <div className='mt-2 space-y-1 text-sm text-gray-500'>  
              {app.salary && <p>💰 {app.salary}</p>}
              {app.location && <p>📍 {app.location}</p>}
              {app.jobUrl && ( 
                <a  href={app.jobUrl} 
                    target='_blank'
                    rel="noopener noreferrer"
                    className='text-blue-500 hover:underline ' 
                    >🔗 View Job Posting </a> )}
              </div>
              
              {/*Status Dropdown Button */}
              <div className='mt-4'>
                <label className='text-sm font-medium text-gray-700'>Status: </label>
                <select 
                value={app.status}
                onChange={(e)=>updateStatus(app.id, e.target.value)}
                className='ml-2 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Ignored">Ignored</option>

                </select>
                
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  )
}