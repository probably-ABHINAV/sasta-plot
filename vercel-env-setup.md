
# Vercel Environment Variables Setup

Add these environment variables in your Vercel project settings:

## Required Variables:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### SMTP Configuration (for contact form)
- `SMTP_HOST` - SMTP server hostname (e.g., smtp.gmail.com)
- `SMTP_PORT` - SMTP server port (e.g., 587)
- `SMTP_USER` - Your email address
- `SMTP_PASS` - Your email app password
- `SMTP_FROM` - From email address

### Site Configuration
- `NEXT_PUBLIC_SITE_URL` - Your production domain

## How to add in Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its corresponding value
4. Make sure to set the environment to "Production", "Preview", or "All"
