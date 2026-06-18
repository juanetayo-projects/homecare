-- ============================================
-- HomeCare Soft - Seed Sedes
-- Versión: 004
-- ============================================

insert into sedes (codigo, nombre, ciudad, direccion, activo) values
  ('ADT-CALI',        'ADT Cali',           'Cali',         'Cali, Valle del Cauca', true),
  ('ADT-PALMIRA',     'ADT Palmira',        'Palmira',      'Palmira, Valle del Cauca', true),
  ('ADT-TULUA',       'ADT Tuluá',          'Tuluá',        'Tuluá, Valle del Cauca', true),
  ('ADT-POPAYAN',     'ADT Popayán',        'Popayán',      'Popayán, Cauca', true),
  ('ADT-BUENAVENTURA','ADT Buenaventura',   'Buenaventura', 'Buenaventura, Valle del Cauca', true),
  ('SALUD-MENTAL',    'Salud Mental',       'Palmira',      'Palmira, Valle del Cauca', true),
  ('VIH',             'VIH',                'Palmira',      'Palmira, Valle del Cauca', true),
  ('ADMINISTRATIVA',  'Sede Administrativa','Palmira',      'Palmira, Valle del Cauca', true),
  ('LOGISTICA',       'Central Logística',  'Palmira',      'Palmira, Valle del Cauca', true)
on conflict (codigo) do nothing;
