-- Execute no SQL Editor do Supabase: seu projeto → SQL Editor → New query

CREATE TABLE credenciamentos (
  id          BIGSERIAL PRIMARY KEY,
  municipio   TEXT        NOT NULL,
  nome        TEXT        NOT NULL,
  documento   TEXT        NOT NULL,
  cargo       TEXT        NOT NULL,
  assinatura  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE credenciamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública"
  ON credenciamentos FOR SELECT USING (true);

CREATE POLICY "Inserção pública"
  ON credenciamentos FOR INSERT WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE credenciamentos;
