
CREATE OR REPLACE FUNCTION get_repair_stats(org_id UUID)
RETURNS TABLE (
    total_orders BIGINT,
    completed_orders BIGINT,
    average_cost NUMERIC,
    total_cost NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_orders,
        COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_orders,
        AVG(total_cost) as average_cost,
        SUM(total_cost) as total_cost
    FROM repair_orders
    WHERE organization_id = org_id;
END;
$$;
