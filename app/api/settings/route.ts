import { NextResponse } from 'next/server'
import { fileStorage } from '@/lib/file-storage'
import { isAdminUser } from '@/lib/demo-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = fileStorage.getHomepageSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error getting homepage settings:', error)
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const updates = await request.json()
    const settings = fileStorage.updateHomepageSettings(updates)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating homepage settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const updates = await request.json()
    const settings = fileStorage.updateHomepageSettings(updates)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating homepage settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
