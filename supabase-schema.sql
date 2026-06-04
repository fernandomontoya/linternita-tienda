-- Tabla de productos
create table public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  image_url text,
  aromas text[], -- array de strings
  sizes jsonb,   -- array de {id, name, priceModifier}
  featured boolean default false,
  stock integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: solo lectura pública, escritura solo con service role
alter table public.products enable row level security;

create policy "Productos visibles para todos"
  on public.products for select
  using (active = true);

-- Función para auto-actualizar updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute function update_updated_at();

-- Insertar los productos iniciales
insert into public.products (id, name, description, price, category, image_url, aromas, sizes, featured, stock) values
('vela-lavanda-grande', 'Vela de Lavanda', 'Elaborada artesanalmente con cera de soya y aceite esencial de lavanda. Aroma suave que invita a la calma y el descanso.', 280, 'relajacion', null, ARRAY['Lavanda','Lavanda con vainilla','Lavanda con menta'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":80},{"id":"grande","name":"Grande (350g)","priceModifier":160}]', true, 15),
('vela-rosa-decorativa', 'Vela Rosa Decorativa', 'Vela con pétalos de rosa naturales incrustados. Perfecta para decorar y regalar. Aroma floral suave.', 320, 'decorativas', null, ARRAY['Rosa','Rosa con jazmín','Rosa con sándalo'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":100}]', true, 10),
('vela-vainilla', 'Vela de Vainilla', 'El clásico aroma de vainilla en su versión más cálida y acogedora. Ideal para sala o comedor.', 260, 'aromaticas', null, ARRAY['Vainilla pura','Vainilla con canela','Vainilla con coco'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":80},{"id":"grande","name":"Grande (350g)","priceModifier":140}]', true, 20),
('set-regalo-3', 'Set de Regalo — 3 Velas', 'Tres velas artesanales a tu elección en una caja de presentación con listón. El regalo perfecto.', 650, 'regalo', null, null, null, true, 8),
('vela-eucalipto', 'Vela de Eucalipto', 'Aroma fresco y purificante. Perfecta para espacios de trabajo o meditación.', 270, 'relajacion', null, ARRAY['Eucalipto','Eucalipto con menta','Eucalipto con limón'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":80}]', false, 12),
('vela-navidad-pino', 'Vela Navideña de Pino', 'Captura el espíritu de la navidad con aroma a pino y canela. Decoración festiva incluida.', 350, 'navidad', null, ARRAY['Pino','Pino con canela','Pino con naranja'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":90}]', true, 18),
('vela-canela-naranja', 'Vela Canela & Naranja', 'Mezcla cítrica y especiada que llena el hogar de calidez. Perfecta para otoño e invierno.', 265, 'aromaticas', null, ARRAY['Canela con naranja','Solo canela','Naranja con clavo'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":80},{"id":"grande","name":"Grande (350g)","priceModifier":150}]', false, 14),
('vela-jazmin', 'Vela de Jazmín', 'Floral y delicada. El aroma a jazmín crea un ambiente romántico y sofisticado.', 275, 'aromaticas', null, ARRAY['Jazmín puro','Jazmín con rosa','Jazmín con ylang-ylang'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":80}]', false, 11),
('vela-geode-decorativa', 'Vela Geoda Decorativa', 'Vela artística con efecto cristal de geoda. Única, hecha a mano. Decoración de lujo para cualquier espacio.', 480, 'decorativas', null, null, '[{"id":"mediana","name":"Mediana","priceModifier":0},{"id":"grande","name":"Grande","priceModifier":120}]', false, 5),
('set-regalo-5', 'Set de Regalo Premium — 5 Velas', 'Cinco velas artesanales en una caja de lujo con papel seda, tarjeta personalizada y listón dorado.', 980, 'regalo', null, null, null, true, 5),
('vela-coco-lima', 'Vela Coco & Lima', 'Tropical y refrescante. Perfecta para baño o terraza. Aroma que transporta a la playa.', 255, 'aromaticas', null, ARRAY['Coco con lima','Solo coco','Lima con menta'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":75}]', false, 16),
('vela-madera-cedro', 'Vela de Cedro & Madera', 'Aroma amaderado profundo y masculino. Wick de madera que produce un suave crepitar.', 320, 'aromaticas', null, ARRAY['Cedro','Cedro con sándalo','Cedro con vetiver'], '[{"id":"chica","name":"Chica (100g)","priceModifier":0},{"id":"mediana","name":"Mediana (200g)","priceModifier":90},{"id":"grande","name":"Grande (350g)","priceModifier":170}]', false, 9);
