'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Settings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Protect the route
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  // Show loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }
  
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">⚙️ Settings</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            ← Back to Home
          </Link>
        </div>
        
        {/* User Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <p className="text-xl font-semibold">{session?.user?.name}</p>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Theme Section - We'll add dark mode here */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Appearance</h2>
          <p className="text-gray-600">Dark mode toggle will go here</p>
        </div>
        
        {/* Logout Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Account Actions</h2>
          
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </main>
  )
}