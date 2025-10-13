import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Update an application
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    console.log('🔄 PATCH request for ID:', id)
    console.log('📦 Body:', body)
    
    const application = await prisma.application.update({
      where: { id },
      data: {
        status: body.status,
        company: body.company,
        position: body.position,
        jobUrl: body.jobUrl,
        salary: body.salary,
        location: body.location,
        notes: body.notes
      }
    })
    
    console.log('✅ Update successful')
    return NextResponse.json(application)
    
  } catch (error) {
    console.error('❌ PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an application
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    console.log('🗑️ DELETE request for ID:', id)
    
    await prisma.application.delete({
      where: { id }
    })
    
    console.log('✅ Delete successful')
    return NextResponse.json({ message: 'Application deleted' })
    
  } catch (error) {
    console.error('❌ DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}