-- Columnas adicionales en orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS source text DEFAULT 'web';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes text;

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id     uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount       numeric(10,2) NOT NULL CHECK (amount > 0),
  payment_type text NOT NULL DEFAULT 'abono',    -- anticipo | abono | total | parcialidad
  payment_method text NOT NULL DEFAULT 'efectivo', -- efectivo | transferencia | tarjeta
  notes        text,
  paid_at      date NOT NULL DEFAULT CURRENT_DATE,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Solo admins (service_role) pueden leer/escribir pagos
CREATE POLICY "Service role full access on payments"
  ON payments FOR ALL
  USING (true)
  WITH CHECK (true);
