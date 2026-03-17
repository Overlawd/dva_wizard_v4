CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  answers JSONB NOT NULL,
  entitlement_result JSONB, -- Calculated outcome
  status VARCHAR(20) DEFAULT 'in_progress',
  completed_at TIMESTAMP
);