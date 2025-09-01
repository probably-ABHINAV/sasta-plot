create or replace function public.seed_demo_plots()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.plots (title, location, price, size_sqyd, description, featured, slug)
  values
    ('Budget Plot near NH-48', 'Jaipur', 450000.00, 900, 'Clear title with nearby schools and markets.', true, 'budget-plot-near-nh-48'),
    ('Corner Plot in Gated Community', 'Gurugram', 1550000.00, 1200, 'Wide roads, electricity and water ready.', true, 'corner-plot-in-gated-community')
  on conflict (slug) do nothing;
end; $$;

select public.seed_demo_plots();
drop function public.seed_demo_plots();
