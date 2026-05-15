-- Execute este script no SQL Editor do Supabase
-- Acesse: seu projeto → SQL Editor → New query → cole e clique em Run

-- 1. Criar tabela de credenciamentos
CREATE TABLE credenciamentos (
  id          BIGSERIAL PRIMARY KEY,
  municipio   TEXT        NOT NULL,
  nome        TEXT        NOT NULL,
  documento   TEXT        NOT NULL,
  cargo       TEXT        NOT NULL,
  assinatura  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security
ALTER TABLE credenciamentos ENABLE ROW LEVEL SECURITY;

-- 3. Permitir leitura pública (para exibir quem já credenciou)
CREATE POLICY "Leitura pública"
  ON credenciamentos FOR SELECT
  USING (true);

-- 4. Permitir inserção pública (para registrar credenciamentos)
CREATE POLICY "Inserção pública"
  ON credenciamentos FOR INSERT
  WITH CHECK (true);

-- 5. Habilitar Realtime para atualização ao vivo no painel do operador
ALTER PUBLICATION supabase_realtime ADD TABLE credenciamentos;
