create or replace function public.seed_demo_plots()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.plots (title, location, price, size_sqyd, description, featured)
  values
    ('Budget Plot near NH-48', 'Jaipur', 450000.00, 900, 'Clear title with nearby schools and markets.', true),
    ('Corner Plot in Gated Community', 'Gurugram', 1550000.00, 1200, 'Wide roads, electricity and water ready.', true);
end; $$;

select public.seed_demo_plots();
drop function public.seed_demo_plots();
