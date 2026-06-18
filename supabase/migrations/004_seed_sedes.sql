-- ============================================
-- HomeCare Soft - Seed Sedes
-- Versión: 004
-- ============================================

insert into sedes (codigo, nombre, ciudad, direccion) values
  ('ADT-CALI',       'ADT Cali',          'Cali',         'Cali, Valle del Cauca'),
  ('ADT-PALMIRA',    'ADT Palmira',       'Palmira',      'Palmira, Valle del Cauca'),
  ('ADT-TULUA',      'ADT Tuluá',         'Tuluá',        'Tuluá, Valle del Cauca'),
  ('ADT-POPAYAN',    'ADT Popayán',       'Popayán',      'Popayán, Cauca'),
  ('ADT-BUENAVENTURA','ADT Buenaventura', 'Buenaventura', 'Buenaventura, Valle del Cauca'),
  ('SALUD-MENTAL',   'Salud Mental',      'Palmira',      'Palmira, Valle del Cauca'),
  ('VIH',            'VIH',               'Palmira',      'Palmira, Valle del Cauca'),
  ('ADMINISTRATIVA', 'Sede Administrativa','Palmira',     'Palmira, Valle del Cauca'),
  ('LOGISTICA',      'Central Logística',  'Palmira',     'Palmira, Valle del Cauca')
on conflict (codigo) do nothing;
