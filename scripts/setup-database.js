
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up Supabase database...');

  try {
    // Check if tables exist first
    const { data: plots, error: plotsCheckError } = await supabase
      .from('plots')
      .select('id')
      .limit(1);

    if (plotsCheckError && plotsCheckError.code === 'PGRST116') {
      console.log('Tables do not exist. Please run the SQL schema files in your Supabase SQL editor:');
      console.log('1. Run scripts/sql/001_init.sql');
      console.log('2. Run scripts/sql/002_seed.sql');
      console.log('Then run this script again to migrate your JSON data.');
      return;
    }

    console.log('Database tables found! Proceeding with data migration...');

    // Migrate existing plot data from JSON
    const plotsJsonPath = path.join(__dirname, '../data/plots.json');
    if (fs.existsSync(plotsJsonPath)) {
      const plotsData = JSON.parse(fs.readFileSync(plotsJsonPath, 'utf8'));
      
      console.log(`Found ${plotsData.length} plots in JSON file. Migrating...`);
      
      for (const plot of plotsData) {
        const plotData = {
          title: plot.title,
          location: plot.location,
          price: plot.price,
          size_sqyd: plot.size_sqyd || 0,
          description: plot.description || '',
          featured: Boolean(plot.featured),
          slug: plot.slug || plot.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          image_url: plot.image || null,
          created_at: plot.created_at || new Date().toISOString()
        };

        const { error } = await supabase
          .from('plots')
          .upsert(plotData, { 
            onConflict: 'slug',
            ignoreDuplicates: false 
          });

        if (error) {
          console.warn(`Warning: Could not migrate plot "${plot.title}":`, error.message);
        } else {
          console.log(`✓ Migrated plot: ${plot.title}`);
        }
      }
    }

    // Migrate blog posts if they exist
    const blogJsonPath = path.join(__dirname, '../data/blog.json');
    if (fs.existsSync(blogJsonPath)) {
      const blogData = JSON.parse(fs.readFileSync(blogJsonPath, 'utf8'));
      
      console.log(`Found ${blogData.length} blog posts. Migrating...`);
      
      for (const post of blogData) {
        const postData = {
          title: post.title,
          slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          content: post.content || '',
          published: Boolean(post.published),
          created_at: post.created_at || new Date().toISOString()
        };

        const { error } = await supabase
          .from('posts')
          .upsert(postData, { 
            onConflict: 'slug',
            ignoreDuplicates: false 
          });

        if (error) {
          console.warn(`Warning: Could not migrate blog post "${post.title}":`, error.message);
        } else {
          console.log(`✓ Migrated blog post: ${post.title}`);
        }
      }
    }

    // Test database connectivity
    const { data: testPlots, error: testError } = await supabase
      .from('plots')
      .select('id, title')
      .limit(3);

    if (testError) {
      console.error('Database test failed:', testError);
    } else {
      console.log(`✓ Database test successful! Found ${testPlots.length} plots`);
    }

    console.log('\n🎉 Database setup and migration completed successfully!');
    console.log('Your application is now using real Supabase database instead of JSON files.');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();
