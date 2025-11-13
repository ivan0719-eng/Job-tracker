"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Applications = {
  id: string
  company: string
  position: string
  status: string
  dateApplied: string
  salary?: string
  location?: string
  jobUrl?: string
}

export default function DashBoard(){
  const {data: session, status} = useSession()
  const router = useRouter()

  const[applications, setApplications] = useState<Applications[]>([])
  const[isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if(status === 'unauthenticated'){
      router.push('/auth/signin')
    }
  },[status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApplications()
    }
  }, [status])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if(status === 'loading'){
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <p className='text-gray-900'>Loading...</p>
      </div>
    )
  }

  const calculateStats = () => {
    const total = applications?.length ?? 0

    const applied = applications?.filter(app => app.status === "Applied").length ?? 0
    const interview = applications?.filter(app => app.status === "Interview").length ?? 0
    const offer = applications?.filter(app => app.status === "Offered").length ?? 0
    const rejected = applications?.filter(app => app.status === "Rejected").length ?? 0
    const ignored = applications?.filter(app => app.status === "Ignored").length ?? 0

    const responseRate = total > 0 
      ? Math.round(((interview + offer + rejected) / total) * 100) 
      : 0

    const successRate = total > 0 
      ? Math.round((offer / total) * 100) 
      : 0

    return {
      total,
      applied,
      interview,
      offer,
      rejected,
      responseRate,
      successRate
    }
  }

  const stats = calculateStats()

  const getStatusData = () => {
    return [
      { name: 'Applied', value: stats.applied, fill: '#3B82F6' },
      { name: 'Interview', value: stats.interview, fill: '#F59E0B' },
      { name: 'Offer', value: stats.offer, fill: '#10B981' },
      { name: 'Rejected', value: stats.rejected, fill: '#EF4444' }
    ].filter(item => item.value > 0)
  }

  const getTimelineData = () => {
    const byMonth: {[key:string]:number} = {}

    applications?.forEach(app => {
      const date = new Date(app.dateApplied)
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      byMonth[monthYear] = (byMonth[monthYear] || 0) + 1
    })
    
    return Object.entries(byMonth).map(([month, count]) => ({
      month,
      applications: count
    }))
  }

  return(
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          📊 Analytics Dashboard
        </h1>

        {/* Back to Home Button */}
        <div className='mb-8'>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Back To Applications
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading Data...</p>
          </div>
        ) : (
          <div>
            {/* Statistics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
              {/* Total Applications */}
              <div className='bg-white p-6 rounded-lg shadow'>
                <div className='text-gray-500 text-sm font-medium'>Total Applications</div>
                <div className='text-3xl font-bold text-blue-600 mt-2'>{stats.total}</div>
              </div>

              {/* Response Rate */}
              <div className='bg-white p-6 rounded-lg shadow'>
                <div className='text-gray-500 text-sm font-medium'>Response Rate</div>
                <div className='text-3xl font-bold text-orange-600 mt-2'>{stats.responseRate}%</div>
              </div>

              {/* Success Rate */}
              <div className='bg-white p-6 rounded-lg shadow'>
                <div className='text-gray-500 text-sm font-medium'>Success Rate</div>
                <div className='text-3xl font-bold text-green-600 mt-2'>{stats.successRate}%</div>
              </div>

              {/* Interviews */}
              <div className='bg-white p-6 rounded-lg shadow'>
                <div className='text-gray-500 text-sm font-medium'>Interviews</div>
                <div className='text-3xl font-bold text-purple-600 mt-2'>{stats.interview}</div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className='bg-white p-6 rounded-lg shadow mb-8'>
              <h2 className='text-xl font-bold mb-4 text-gray-900'>
                Status Breakdown
              </h2>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center p-4 bg-blue-50 rounded'>
                  <div className='text-2xl font-bold text-blue-600'>{stats.applied}</div>
                  <div className='text-sm text-gray-600'>Applied</div>
                </div>

                <div className='text-center p-4 bg-orange-50 rounded'>
                  <div className='text-2xl font-bold text-orange-600'>{stats.interview}</div>
                  <div className="text-sm text-gray-600">Interview</div>
                </div>

                <div className='text-center p-4 bg-green-50 rounded'>
                  <div className='text-2xl font-bold text-green-600'>{stats.offer}</div>
                  <div className="text-sm text-gray-600">Offer</div>
                </div>

                <div className='text-center p-4 bg-red-50 rounded'>
                  <div className='text-2xl font-bold text-red-600'>{stats.rejected}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
              {/* Pie Chart - Status Distribution */}
              <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Applications By Status
                </h2>

                {stats.total > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data to display</p>
                )}
              </div>

              {/* Bar Chart - Timeline */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Applications Over Time
                </h2>
                
                {stats.total > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getTimelineData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data to display</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

