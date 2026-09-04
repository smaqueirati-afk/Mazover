-- ============================================================================
-- MAZOVER · Datos iniciales (defaults editables desde el panel)
-- Ejecutar DESPUÉS de schema.sql y policies.sql.
-- Las imágenes /demo/* viven en public/demo (reemplazables desde el admin).
-- ============================================================================

-- ---- Configuración global (una fila) ----
insert into public.settings (brand_name) values ('MAZOVER')
on conflict do nothing;

-- ---- Contenido de las secciones de la Home (cada coma editable) ----
insert into public.content_blocks (key, section, label, type, value, image_url, position) values
  ('home.hero.eyebrow',   'home_hero', 'Hero · bajada',        'text',  'Hecho y para argentinos', null, 1),
  ('home.hero.title',     'home_hero', 'Hero · título',        'text',  'Calidad que se siente.', null, 2),
  ('home.hero.subtitle',  'home_hero', 'Hero · subtítulo',     'text',  'Jeans diseñados y fabricados en Argentina, con materiales seleccionados y una obsesión por cada detalle. Para tu día a día.', null, 3),
  ('home.hero.cta1',      'home_hero', 'Hero · CTA principal', 'text',  'Descubrir colección', null, 4),
  ('home.hero.cta2',      'home_hero', 'Hero · CTA secundario','text',  'Conocer la marca', null, 5),
  ('home.hero.badge',     'home_hero', 'Hero · etiqueta',      'text',  'Nueva colección', null, 6),
  ('home.hero.image',     'home_hero', 'Hero · imagen',        'image', null, '/demo/hero.jpg', 7),
  ('home.marquee.items',  'home_marquee','Franja de atributos','text',  'Algodón premium|Confort|Durabilidad|Diseño atemporal|Orgullo argentino', null, 1),
  ('home.philo.eyebrow',  'home_philo','Filosofía · bajada',   'text',  'Nuestra esencia', null, 1),
  ('home.philo.title',    'home_philo','Filosofía · título',   'text',  'Hecho acá. Pensado para durar.', null, 2),
  ('home.philo.body',     'home_philo','Filosofía · texto',    'richtext', 'Creemos que un buen jean no debería depender de una tendencia. Debería acompañarte durante años, adaptarse a tu forma de vivir y mejorar con el tiempo.

Trabajamos con talleres argentinos, algodón seleccionado y una confección obsesiva: cada costura, cada remache y cada botón están pensados para resistir el uso real.', null, 3),
  ('home.philo.image',    'home_philo','Filosofía · imagen',   'image', null, '/demo/texture.jpg', 4),
  ('home.philo.detail',   'home_philo','Filosofía · detalle',  'image', null, '/demo/button.jpg', 5),
  ('home.band.eyebrow',   'home_band', 'Banda · bajada',       'text',  'Los códigos del jean', null, 1),
  ('home.band.title',     'home_band', 'Banda · título',       'text',  'Corte cómodo. Costuras reforzadas. Detalles que duran.', null, 2),
  ('home.band.image',     'home_band', 'Banda · imagen',       'image', null, '/demo/detail.jpg', 3),
  ('home.collection.eyebrow','home_collection','Colección · bajada','text','Colección destacada', null, 1),
  ('home.collection.title',  'home_collection','Colección · título','text','Cortes que se quedan', null, 2),
  ('home.reels.eyebrow',  'home_reels','Reels · handle',       'text',  '@mazover', null, 1),
  ('home.reels.title',    'home_reels','Reels · título',       'text',  'Mirá cómo se usan', null, 2),
  ('home.made.eyebrow',   'home_made', 'Hecho en Arg · bajada','text',  'Hecho en Argentina', null, 1),
  ('home.made.title',     'home_made', 'Hecho en Arg · título','text',  'Diseñado acá. Fabricado acá. Seleccionado para durar.', null, 2),
  ('home.made.col1.title','home_made', 'Columna 1 · título',   'text',  'Diseñado acá', null, 3),
  ('home.made.col1.body', 'home_made', 'Columna 1 · texto',    'text',  'Cada corte nace en nuestro taller: probamos, ajustamos y repetimos hasta que el jean cae como tiene que caer.', null, 4),
  ('home.made.col2.title','home_made', 'Columna 2 · título',   'text',  'Fabricado acá', null, 5),
  ('home.made.col2.body', 'home_made', 'Columna 2 · texto',    'text',  'Trabajamos con confeccionistas argentinos. El trabajo bien hecho sostiene a personas reales, no solo a una etiqueta.', null, 6),
  ('home.made.col3.title','home_made', 'Columna 3 · título',   'text',  'Para durar', null, 7),
  ('home.made.col3.body', 'home_made', 'Columna 3 · texto',    'text',  'Denim de gramaje alto, costuras reforzadas y avíos que resisten. Un jean para años, no para una temporada.', null, 8),
  ('home.made.image_a',   'home_made', 'Hecho en Arg · foto 1','image', null, '/demo/atelier.jpg', 9),
  ('home.made.image_b1',  'home_made', 'Hecho en Arg · foto 2','image', null, '/demo/texture.jpg', 10),
  ('home.made.image_b2',  'home_made', 'Hecho en Arg · foto 3','image', null, '/demo/button.jpg', 11),
  ('home.frases.1',       'home_frases','Frase 1',             'text',  'Hecho y para argentinos', null, 1),
  ('home.frases.2',       'home_frases','Frase 2',             'text',  'Orgullo que se viste', null, 2),
  ('home.frases.3',       'home_frases','Frase 3',             'text',  'Para tu día a día', null, 3),
  ('home.cta.eyebrow',    'home_cta',  'CTA final · bajada',   'text',  'Comprá por WhatsApp', null, 1),
  ('home.cta.title',      'home_cta',  'CTA final · título',   'text',  'Elegí tu corte. Nosotros hacemos el resto.', null, 2),
  ('home.cta.button',     'home_cta',  'CTA final · botón',    'text',  'Ver la colección', null, 3),
  ('footer.about',        'footer',    'Footer · descripción', 'text',  'Denim diseñado y fabricado en Argentina. Calidad que se siente, orgullo que se viste.', null, 1)
on conflict (key) do nothing;

-- Página LA MARCA y HECHO EN ARGENTINA
insert into public.content_blocks (key, section, label, type, value, image_url, position) values
  ('lamarca.hero.eyebrow','page_lamarca','La Marca · bajada','text','La marca',null,1),
  ('lamarca.hero.title','page_lamarca','La Marca · título','text','Denim con oficio, hecho acá.',null,2),
  ('lamarca.hero.image','page_lamarca','La Marca · imagen hero','image',null,'/demo/detail.jpg',3),
  ('lamarca.intro','page_lamarca','La Marca · intro','richtext','MAZOVER nació de una idea simple y terca: hacer, en Argentina, el jean que siempre quisimos usar. Sin atajos, sin temporada de descarte, sin depender de una moda que cambia cada tres meses.

Creemos en el trabajo bien hecho y en la ropa que mejora con los años. Un buen jean no se compra seguido: se elige una vez y se usa hasta que se vuelve tuyo.',null,4),
  ('lamarca.s1.title','page_lamarca','Sección 1 · título','text','Diseño',null,5),
  ('lamarca.s1.body','page_lamarca','Sección 1 · texto','text','Cada corte se prueba, se ajusta y se vuelve a probar hasta que cae como tiene que caer. Buscamos siluetas que no cansen: modernas, cómodas y atemporales.',null,6),
  ('lamarca.s1.image','page_lamarca','Sección 1 · imagen','image',null,'/demo/hero.jpg',7),
  ('lamarca.s2.title','page_lamarca','Sección 2 · título','text','Materiales',null,8),
  ('lamarca.s2.body','page_lamarca','Sección 2 · texto','text','Trabajamos con denim de gramaje alto, avíos metálicos y costuras reforzadas. Materiales seleccionados para que la prenda resista el uso real de todos los días.',null,9),
  ('lamarca.s2.image','page_lamarca','Sección 2 · imagen','image',null,'/demo/texture.jpg',10),
  ('lamarca.quote','page_lamarca','La Marca · frase','text','Menos moda, más propósito. Calidad que se siente.',null,11),
  ('hecho.hero.eyebrow','page_hecho','Hecho · bajada','text','Hecho en Argentina',null,1),
  ('hecho.hero.title','page_hecho','Hecho · título','text','Diseñado, fabricado y pensado para durar.',null,2),
  ('hecho.hero.image','page_hecho','Hecho · imagen hero','image',null,'/demo/atelier.jpg',3),
  ('hecho.intro','page_hecho','Hecho · intro','text','No es una etiqueta: es cómo trabajamos. Diseñamos y fabricamos en Argentina, con talleres locales y gente que sabe lo que hace.',null,4),
  ('hecho.b1.title','page_hecho','Bloque 1 · título','text','Diseñado acá',null,5),
  ('hecho.b1.body','page_hecho','Bloque 1 · texto','text','El proceso empieza en nuestro taller. Moldería propia, pruebas de calce y ajustes hasta llegar al corte final.',null,6),
  ('hecho.b1.image','page_hecho','Bloque 1 · imagen','image',null,'/demo/hero.jpg',7),
  ('hecho.b2.title','page_hecho','Bloque 2 · título','text','Fabricado acá',null,8),
  ('hecho.b2.body','page_hecho','Bloque 2 · texto','text','Confeccionistas argentinos, tanda a tanda. El trabajo bien hecho sostiene a personas reales.',null,9),
  ('hecho.b2.image','page_hecho','Bloque 2 · imagen','image',null,'/demo/atelier.jpg',10),
  ('hecho.b3.title','page_hecho','Bloque 3 · título','text','Seleccionado para durar',null,11),
  ('hecho.b3.body','page_hecho','Bloque 3 · texto','text','Denim de gramaje alto, costuras dobles y avíos que aguantan. Nada decorativo: todo pensado para el uso.',null,12),
  ('hecho.b3.image','page_hecho','Bloque 3 · imagen','image',null,'/demo/texture.jpg',13)
on conflict (key) do nothing;

-- ---- Cortes (fits) ----
insert into public.fits (name, slug, position) values
  ('Slim','slim',1),('Straight','straight',2),('Relaxed','relaxed',3),
  ('Loose','loose',4),('Tapered','tapered',5)
on conflict (slug) do nothing;

-- ---- Talles ----
insert into public.sizes (label, position) values
  ('38',1),('40',2),('42',3),('44',4),('46',5)
on conflict (label) do nothing;

-- ---- Categorías ----
insert into public.categories (name, slug, position) values
  ('Jeans','jeans',1),('Camisas','camisas',2),('Chinos','chinos',3),
  ('Camperas','camperas',4),('Accesorios','accesorios',5)
on conflict (slug) do nothing;

-- ---- Colores globales ----
insert into public.colors (name, slug, hex, position) values
  ('Índigo Raw','indigo-raw','#1E3B63',1),
  ('Negro','negro','#0D1326',2),
  ('Gris Stone','gris-stone','#4A4A4A',3),
  ('Azul Stone','azul-stone','#2A4E7E',4)
on conflict (slug) do nothing;

-- ---- Colecciones ----
insert into public.collections (name, slug, position) values
  ('Nueva temporada','nueva-temporada',1),
  ('Índigo Raw','indigo-raw',2),
  ('Clásicos','clasicos',3),
  ('Últimos talles','ultimos-talles',4)
on conflict (slug) do nothing;

-- ---- Productos de ejemplo ----
insert into public.products (name, slug, short_description, description, category_id, fit_id, composition, price, is_featured, is_new, is_active, position)
select 'Jean Relaxed', 'jean-relaxed',
       'Corte relajado en índigo profundo, para todos los días.',
       'El Jean Relaxed cae holgado sin perder forma. Denim de gramaje alto, costuras reforzadas y avíos metálicos pensados para durar años.',
       (select id from public.categories where slug='jeans'),
       (select id from public.fits where slug='relaxed'),
       '100% algodón · 14.5 oz', 95000, true, true, true, 1
where not exists (select 1 from public.products where slug='jean-relaxed');

insert into public.products (name, slug, short_description, description, category_id, fit_id, composition, price, is_featured, is_active, position)
select 'Jean Straight', 'jean-straight',
       'Corte recto clásico, cómodo y atemporal.',
       'El Jean Straight es el corte de siempre, bien resuelto. Cae parejo desde la cadera al ruedo, con la robustez del denim argentino.',
       (select id from public.categories where slug='jeans'),
       (select id from public.fits where slug='straight'),
       '98% algodón · 2% elastano · 13 oz', 89000, true, true, 2
where not exists (select 1 from public.products where slug='jean-straight');

-- ---- Colores de cada producto ----
insert into public.product_colors (product_id, color_id, name, hex, sku_base, position)
select p.id, c.id, c.name, c.hex, 'JEAN-REL-'||upper(left(c.slug,3)), c.position
from public.products p join public.colors c on c.slug in ('indigo-raw','negro')
where p.slug='jean-relaxed'
  and not exists (select 1 from public.product_colors pc where pc.product_id=p.id and pc.name=c.name);

insert into public.product_colors (product_id, color_id, name, hex, sku_base, position)
select p.id, c.id, c.name, c.hex, 'JEAN-STR-'||upper(left(c.slug,3)), c.position
from public.products p join public.colors c on c.slug in ('gris-stone','azul-stone')
where p.slug='jean-straight'
  and not exists (select 1 from public.product_colors pc where pc.product_id=p.id and pc.name=c.name);

-- ---- Variantes (color × talle) con stock (38 y 46 agotados para mostrar estados) ----
insert into public.product_variants (product_id, product_color_id, size_id, sku, stock)
select pc.product_id, pc.id, s.id, coalesce(pc.sku_base,'SKU')||'-'||s.label,
       case when s.label in ('38','46') then 0 else 6 end
from public.product_colors pc
join public.sizes s on true
join public.products p on p.id = pc.product_id
where p.slug in ('jean-relaxed','jean-straight')
  and not exists (
    select 1 from public.product_variants v where v.product_color_id=pc.id and v.size_id=s.id
  );

-- ---- Imágenes por color ----
-- Jean Relaxed · Índigo Raw
insert into public.product_images (product_id, product_color_id, url, alt, position, is_cover)
select pc.product_id, pc.id, x.url, x.alt, x.pos, x.cover
from public.product_colors pc
join public.products p on p.id=pc.product_id and p.slug='jean-relaxed' and pc.name='Índigo Raw'
join (values
  ('/demo/lifestyle.jpg','Jean Relaxed Índigo — frente',0,true),
  ('/demo/hero.jpg','Jean Relaxed Índigo — look',1,false),
  ('/demo/detail.jpg','Jean Relaxed Índigo — detalle',2,false),
  ('/demo/texture.jpg','Jean Relaxed Índigo — textura',3,false)
) as x(url,alt,pos,cover) on true
where not exists (select 1 from public.product_images i where i.product_color_id=pc.id);

-- Jean Straight · Gris Stone
insert into public.product_images (product_id, product_color_id, url, alt, position, is_cover)
select pc.product_id, pc.id, x.url, x.alt, x.pos, x.cover
from public.product_colors pc
join public.products p on p.id=pc.product_id and p.slug='jean-straight' and pc.name='Gris Stone'
join (values
  ('/demo/product.jpg','Jean Straight Gris — frente',0,true),
  ('/demo/detail.jpg','Jean Straight Gris — detalle',1,false),
  ('/demo/texture.jpg','Jean Straight Gris — textura',2,false)
) as x(url,alt,pos,cover) on true
where not exists (select 1 from public.product_images i where i.product_color_id=pc.id);

-- ---- Reels de Instagram (shoppables) ----
insert into public.instagram_reels (instagram_url, poster_url, caption, product_id, position)
select v.url, v.poster, v.caption,
       (select id from public.products where slug=v.pslug), v.pos
from (values
  ('https://instagram.com/mazover','/demo/hero.jpg','El Relaxed en la calle, todos los días.','jean-relaxed',1),
  ('https://instagram.com/mazover','/demo/lifestyle.jpg','Cómo cae el corte recto en movimiento.','jean-straight',2),
  ('https://instagram.com/mazover','/demo/detail.jpg','Costuras y avíos, de cerca.',null,3),
  ('https://instagram.com/mazover','/demo/atelier.jpg','Así se hace un jean en el taller.',null,4)
) as v(url,poster,caption,pslug,pos)
where not exists (select 1 from public.instagram_reels);

-- ---- Menú principal (mega-menú) ----
insert into public.menus (handle, name) values ('main','Menú principal'), ('footer','Footer')
on conflict (handle) do nothing;

-- Item raíz "Colección" + hijos agrupados en columnas + tile destacado
do $$
declare m uuid; root uuid;
begin
  select id into m from public.menus where handle='main';
  if not exists (select 1 from public.menu_items where menu_id=m and label='Colección') then
    insert into public.menu_items (menu_id, label, link_type, link_ref, position)
      values (m,'Colección','url','/productos',1) returning id into root;
    insert into public.menu_items (menu_id, parent_id, label, link_type, link_ref, column_group, position) values
      (m,root,'Slim','fit','slim','Por corte',1),
      (m,root,'Straight','fit','straight','Por corte',2),
      (m,root,'Relaxed','fit','relaxed','Por corte',3),
      (m,root,'Loose','fit','loose','Por corte',4),
      (m,root,'Tapered','fit','tapered','Por corte',5),
      (m,root,'Jeans','category','jeans','Categorías',1),
      (m,root,'Camisas','category','camisas','Categorías',2),
      (m,root,'Chinos','category','chinos','Categorías',3),
      (m,root,'Camperas','category','camperas','Categorías',4),
      (m,root,'Accesorios','category','accesorios','Categorías',5),
      (m,root,'Nueva temporada','collection','nueva-temporada','Colecciones',1),
      (m,root,'Índigo Raw','collection','indigo-raw','Colecciones',2),
      (m,root,'Clásicos','collection','clasicos','Colecciones',3),
      (m,root,'Últimos talles','collection','ultimos-talles','Colecciones',4);
    insert into public.menu_items (menu_id, parent_id, label, link_type, link_ref, image_url, column_group, position)
      values (m,root,'Jean Relaxed Índigo','product','jean-relaxed','/demo/lifestyle.jpg','Destacado',1);
    -- items de primer nivel adicionales
    insert into public.menu_items (menu_id, label, link_type, link_ref, position) values
      (m,'Jeans','category','jeans',2),
      (m,'La Marca','page','la-marca',3),
      (m,'Hecho en Argentina','page','hecho-en-argentina',4);
  end if;
end $$;

-- ---- Guía de talles ----
insert into public.size_guides (name, columns, rows)
select 'Jeans', '["Talle","Cintura (cm)","Cadera (cm)","Largo (cm)"]'::jsonb,
  '[["38","76","92","100"],["40","80","96","102"],["42","84","100","104"],["44","88","104","106"],["46","92","108","108"]]'::jsonb
where not exists (select 1 from public.size_guides where name='Jeans');
