
-- Database Schema

-- clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- cases table
CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    invoice_amount DECIMAL(12, 2) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'New',
    last_follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT check_status CHECK (status IN ('New', 'In Follow-up', 'Partially Paid', 'Closed')),
    CONSTRAINT check_amount CHECK (invoice_amount > 0)
);



-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO clients (client_name, company_name, city, contact_person, phone, email) VALUES
    ('Rajesh Kumar', 'Tech Solutions Pvt Ltd', 'Bangalore', 'Rajesh Kumar', '+91-9876543210', 'rajesh@techsolutions.com'),
    ('Priya Sharma', 'Digital Marketing Co', 'Mumbai', 'Priya Sharma', '+91-9876543211', 'priya@digitalmarketing.com'),
    ('Amit Patel', 'Manufacturing Industries', 'Ahmedabad', 'Amit Patel', '+91-9876543212', 'amit@manufacturing.com'),
    ('Sneha Reddy', 'Consulting Services', 'Hyderabad', 'Sneha Reddy', '+91-9876543213', 'sneha@consulting.com');

INSERT INTO cases (client_id, invoice_number, invoice_amount, invoice_date, due_date, status, last_follow_up_notes) VALUES
    (1, 'INV-2025-001', 150000.00, '2025-01-01', '2025-01-31', 'New', 'Initial invoice sent'),
    (1, 'INV-2025-002', 75000.00, '2025-01-15', '2025-02-14', 'In Follow-up', 'Client promised payment by end of month'),
    (2, 'INV-2025-003', 250000.00, '2024-12-01', '2024-12-31', 'In Follow-up', 'Multiple follow-ups done, client requested more time'),
    (3, 'INV-2025-004', 500000.00, '2024-11-15', '2024-12-15', 'Partially Paid', 'Received 200000, balance pending'),
    (4, 'INV-2025-005', 125000.00, '2025-01-20', '2025-02-19', 'New', 'Invoice just created'),
    (2, 'INV-2025-006', 180000.00, '2024-10-01', '2024-10-31', 'In Follow-up', 'Legal notice sent');

