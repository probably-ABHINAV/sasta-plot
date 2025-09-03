
-- Create posts table for blog functionality
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add excerpt column if it doesn't exist (for existing tables)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to published posts" ON public.posts
    FOR SELECT USING (published = true);

CREATE POLICY "Allow full access to admin users" ON public.posts
    FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts(published);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at);

-- Insert some sample blog posts
INSERT INTO public.posts (title, slug, content, excerpt, published) VALUES
(
    'Guide to Buying Your First Plot',
    'guide-to-buying-your-first-plot',
    '<h2>Getting Started</h2><p>Buying your first plot can be overwhelming, but with the right guidance, it becomes much easier. Here are the key things to consider...</p><h3>1. Location Research</h3><p>The location of your plot is crucial for future value appreciation. Look for areas with good connectivity, upcoming infrastructure projects, and proper amenities.</p><h3>2. Legal Documentation</h3><p>Always verify the legal status of the plot. Check for clear titles, approved layouts, and necessary clearances from local authorities.</p><h3>3. Budget Planning</h3><p>Plan your budget carefully including the plot cost, registration fees, taxes, and development charges.</p>',
    'A comprehensive guide for first-time plot buyers covering location research, legal documentation, and budget planning.',
    true
),
(
    'Understanding RERA Guidelines for Plot Purchase',
    'understanding-rera-guidelines-for-plot-purchase',
    '<h2>What is RERA?</h2><p>The Real Estate (Regulation and Development) Act, 2016 (RERA) is a landmark legislation that aims to protect the interests of home buyers and boost investments in the real estate sector.</p><h3>Key RERA Guidelines for Plots</h3><p>1. All projects with plots need RERA registration<br>2. Transparent pricing and timeline disclosure<br>3. Regular project updates<br>4. Grievance redressal mechanism</p><h3>Benefits for Buyers</h3><p>RERA ensures transparency, accountability, and timely delivery of projects, making plot purchases safer for buyers.</p>',
    'Learn about RERA guidelines and how they protect plot buyers from fraud and ensure transparent transactions.',
    true
),
(
    'Top Locations for Affordable Plots in 2024',
    'top-locations-for-affordable-plots-2024',
    '<h2>Best Affordable Plot Locations</h2><p>Finding affordable plots in prime locations requires careful research and timing. Here are the top locations offering good value for money in 2024.</p><h3>1. Upcoming Suburban Areas</h3><p>Areas on the outskirts of major cities often offer the best value proposition with future growth potential.</p><h3>2. Government Planned Townships</h3><p>Government-planned areas usually have better infrastructure and transparent pricing.</p><h3>3. Near Metro Corridors</h3><p>Plots near planned or upcoming metro lines often see significant appreciation.</p>',
    'Discover the most promising affordable plot locations for 2024 with high growth potential and good connectivity.',
    true
);
