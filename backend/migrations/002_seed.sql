-- Seed Demo Owner
INSERT INTO owners (name, rut, email, password_hash, plan)
VALUES ('Carlos Mendoza', '12.345.678-9', 'demo@pagorenta.cl', '$2b$12$76.Z.hF/5iWfH9f9H9f9H9f9H9f9H9f9H9f9H9f9H9f9H9f9H9f9H', 'pro');

-- Get owner_id
DO $$
DECLARE
    v_owner_id UUID;
    v_prop1_id UUID;
    v_prop2_id UUID;
    v_contract_id UUID;
BEGIN
    SELECT id INTO v_owner_id FROM owners WHERE email = 'demo@pagorenta.cl';

    -- Insert Properties
    INSERT INTO properties (owner_id, address, commune, region, property_type, bedrooms, bathrooms, area_m2)
    VALUES (v_owner_id, 'Av. Providencia 1234 Depto 52', 'Providencia', 'Región Metropolitana', 'departamento', 2, 1, 65)
    RETURNING id INTO v_prop1_id;

    INSERT INTO properties (owner_id, address, commune, region, property_type, bedrooms, bathrooms, area_m2)
    VALUES (v_owner_id, 'Los Leones 456 Casa 3', 'Las Condes', 'Región Metropolitana', 'casa', 3, 2, 120)
    RETURNING id INTO v_prop2_id;

    -- Insert Contract for Property 1
    INSERT INTO contracts (
        property_id, owner_id, tenant_name, tenant_rut, tenant_email,
        rent_amount, payment_day, start_date, end_date,
        deposit_months, deposit_amount, status, owner_signed_at, tenant_signed_at
    )
    VALUES (
        v_prop1_id, v_owner_id, 'María González', '15.678.901-2', 'maria@example.com',
        550000, 5, '2025-01-01', '2025-12-31',
        1, 550000, 'active', NOW(), NOW()
    )
    RETURNING id INTO v_contract_id;

    -- Insert 6 payments (Jan to Jun 2025)
    INSERT INTO payments (contract_id, owner_id, amount, period_month, period_year, due_date, paid_date, status, payment_method)
    VALUES
    (v_contract_id, v_owner_id, 550000, 1, 2025, '2025-01-05', '2025-01-05', 'paid', 'transferencia'),
    (v_contract_id, v_owner_id, 550000, 2, 2025, '2025-02-05', '2025-02-05', 'paid', 'transferencia'),
    (v_contract_id, v_owner_id, 550000, 3, 2025, '2025-03-05', '2025-03-05', 'paid', 'transferencia'),
    (v_contract_id, v_owner_id, 550000, 4, 2025, '2025-04-05', '2025-04-05', 'paid', 'transferencia'),
    (v_contract_id, v_owner_id, 550000, 5, 2025, '2025-05-05', '2025-05-05', 'paid', 'transferencia'),
    (v_contract_id, v_owner_id, 550000, 6, 2025, '2025-06-05', NULL, 'pending', NULL);
END $$;
