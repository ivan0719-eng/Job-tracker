import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all applications
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: { interviews: true },
      orderBy: { dateApplied: 'desc' }
    })
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

// POST new application
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const application = await prisma.application.create({
      data: {
        company: body.company,
        position: body.position,
        status: body.status || 'Applied',
        dateApplied: body.dateApplied || new Date(),
        jobUrl: body.jobUrl,
        salary: body.salary,
        location: body.location,
        notes: body.notes
      }
    })
    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}