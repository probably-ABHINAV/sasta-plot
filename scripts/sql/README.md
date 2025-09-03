
# SQL Scripts Execution Order

This directory contains SQL scripts for setting up the database schema and initial data. Execute them in the following order:

## Execution Order

1. **001_init.sql** - Initial database setup with basic tables (profiles, plots, plot_images, inquiries, posts)
2. **002_seed.sql** - Seed demo plots data
3. **003_storage_bucket_fix.sql** - Fix storage bucket configuration
4. **004_schema_rerun.sql** - Idempotent schema setup (alternative to 001_init.sql)
5. **005_storage_bucket_public.sql** - Make storage bucket public
6. **006_fix_plots_schema.sql** - Fix plots table schema and add missing columns
7. **007_create_posts_table.sql** - Create posts table for blog functionality
8. **008_add_size_unit.sql** - Add size_unit column to plots table
9. **009_create_inquiries_table.sql** - Create inquiries table for contact forms

## Usage

### For Fresh Database Setup:
Execute scripts in order from 1-9.

### For Existing Database:
- Scripts are designed to be idempotent (safe to run multiple times)
- Use `IF NOT EXISTS` and `IF EXISTS` clauses to prevent errors
- You can run individual scripts as needed for specific updates

## Important Notes

- Always backup your database before running migration scripts
- Test scripts in a development environment first
- Some scripts modify existing data, review carefully before execution
- RLS (Row Level Security) policies are included for security

## Database Tables Created

- **profiles** - User profiles with role-based access
- **plots** - Plot listings with details and pricing
- **plot_images** - Images associated with plots
- **posts** - Blog posts and content
- **inquiries** - Contact form submissions and plot inquiries

Each table includes appropriate RLS policies for security and proper indexing for performance.
