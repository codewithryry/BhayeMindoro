-- Initial supported municipalities (all in Oriental Mindoro).
-- Reference data only — no fares, routes, terminals, or sources are seeded.

insert into public.municipalities (name, province) values
  ('Calapan', 'Oriental Mindoro'),
  ('Naujan', 'Oriental Mindoro'),
  ('Pinamalayan', 'Oriental Mindoro'),
  ('Puerto Galera', 'Oriental Mindoro')
on conflict (name, province) do nothing;
