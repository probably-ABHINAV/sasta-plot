
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Create bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json({ error: listError.message }, { status: 500 })
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'plots')

    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket('plots', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (error) {
        console.error('Error creating bucket:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Storage initialized successfully' 
    })

  } catch (error: any) {
    console.error('Storage init error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  return POST()
}
