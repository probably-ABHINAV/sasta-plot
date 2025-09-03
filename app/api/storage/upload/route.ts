
import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const prefix = formData.get('prefix') as string || 'uploads'

    console.log('File received:', file?.name, 'Size:', file?.size)

    if (!file) {
      console.error('No file provided in request')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error('File too large:', file.size)
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const supabase = getServerSupabase()
    
    if (!supabase) {
      console.error('Failed to initialize Supabase client')
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${prefix}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    console.log('Uploading to Supabase with filename:', fileName)

    // Convert File to ArrayBuffer for Supabase
    const fileBuffer = await file.arrayBuffer()

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('plots')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ 
        error: `Upload failed: ${error.message}` 
      }, { status: 500 })
    }

    console.log('Upload successful, getting public URL for:', fileName)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('plots')
      .getPublicUrl(fileName)

    console.log('Public URL generated:', publicUrl)

    return NextResponse.json({ 
      path: data.path,
      publicUrl 
    })

  } catch (error: any) {
    console.error('Upload API error:', error)
    return NextResponse.json({ 
      error: `Upload failed: ${error.message || 'Unknown error'}` 
    }, { status: 500 })
  }
}
