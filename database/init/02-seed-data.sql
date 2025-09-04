-- OfficeOps Platform Seed Data
-- Version: 2.1.0
-- Description: Initial data for the OfficeOps platform

-- Insert default departments
INSERT INTO departments (name, description, head, employee_count) VALUES
('Information Technology', 'IT infrastructure and systems management', 'System Administrator', 2),
('Human Resources', 'Employee management and organizational development', 'HR Director', 1),
('Finance', 'Financial management and accounting', 'Finance Manager', 1),
('Operations', 'Daily operations and administration', 'Operations Manager', 1),
('Security', 'Information security and compliance', 'Security Officer', 1);

-- Insert default users (passwords should be hashed in production)
-- Default password for all demo users: "password123"
INSERT INTO users (name, email, password_hash, role, department_id, status) VALUES
(
    'Demo Administrator', 
    'admin@officeops.com', 
    '$2b$10$rQg0Q0Q0Q0Q0Q0Q0Q0Q0QuQ0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0',  -- password123
    'admin', 
    (SELECT id FROM departments WHERE name = 'Information Technology'),
    'active'
),
(
    'Security Officer', 
    'iso@officeops.com', 
    '$2b$10$rQg0Q0Q0Q0Q0Q0Q0Q0Q0QuQ0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0',
    'iso', 
    (SELECT id FROM departments WHERE name = 'Security'),
    'active'
),
(
    'Department Manager', 
    'manager@officeops.com', 
    '$2b$10$rQg0Q0Q0Q0Q0Q0Q0Q0Q0QuQ0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0',
    'manager', 
    (SELECT id FROM departments WHERE name = 'Human Resources'),
    'active'
),
(
    'John Employee', 
    'employee@officeops.com', 
    '$2b$10$rQg0Q0Q0Q0Q0Q0Q0Q0Q0QuQ0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0',
    'employee', 
    (SELECT id FROM departments WHERE name = 'Finance'),
    'active'
),
(
    'System Auditor', 
    'auditor@officeops.com', 
    '$2b$10$rQg0Q0Q0Q0Q0Q0Q0Q0Q0QuQ0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0',
    'auditor', 
    (SELECT id FROM departments WHERE name = 'Operations'),
    'active'
);

-- Insert default system resources
INSERT INTO system_resources (name, description, category, department_id, risk_level, requires_justification, max_access_duration) VALUES
(
    'Employee Database',
    'Access to employee personal and professional information',
    'Database',
    (SELECT id FROM departments WHERE name = 'Human Resources'),
    'high',
    true,
    30
),
(
    'Financial Systems',
    'Access to financial data and accounting systems',
    'Application',
    (SELECT id FROM departments WHERE name = 'Finance'),
    'high',
    true,
    7
),
(
    'Network Infrastructure',
    'Access to network configuration and monitoring tools',
    'Infrastructure',
    (SELECT id FROM departments WHERE name = 'Information Technology'),
    'high',
    true,
    14
),
(
    'Document Management System',
    'Access to corporate documents and policies',
    'Application',
    (SELECT id FROM departments WHERE name = 'Operations'),
    'medium',
    true,
    30
),
(
    'Security Monitoring Tools',
    'Access to security logs and monitoring dashboards',
    'Security',
    (SELECT id FROM departments WHERE name = 'Security'),
    'high',
    true,
    7
);

-- Insert sample assets
INSERT INTO assets (asset_id, name, category, brand, model, serial_number, status, condition, location) VALUES
('LAP-2025-001', 'MacBook Pro 16"', 'laptop', 'Apple', 'MacBook Pro', 'C02X1XXXX', 'available', 'excellent', 'IT Storage'),
('LAP-2025-002', 'Dell Latitude 7420', 'laptop', 'Dell', 'Latitude 7420', 'DL001XXX', 'assigned', 'good', 'Finance Department'),
('SRV-2025-001', 'Database Server', 'server', 'Dell', 'PowerEdge R750', 'PE001XXX', 'assigned', 'excellent', 'Server Room'),
('NET-2025-001', 'Firewall Device', 'network', 'Cisco', 'ASA 5516-X', 'FCH001XXX', 'assigned', 'good', 'Network Room'),
('MON-2025-001', '27" Monitor', 'monitor', 'Dell', 'UltraSharp U2720Q', 'CN001XXX', 'available', 'excellent', 'IT Storage');

-- Insert sample documents
INSERT INTO documents (title, description, type, version, department_id, created_by, requires_acknowledgment) VALUES
(
    'Employee Handbook',
    'Comprehensive guide for all employees covering policies, procedures, and benefits',
    'manual',
    '2.1',
    (SELECT id FROM departments WHERE name = 'Human Resources'),
    (SELECT id FROM users WHERE email = 'manager@officeops.com'),
    true
),
(
    'Information Security Policy',
    'Corporate information security policies and procedures',
    'policy',
    '1.5',
    (SELECT id FROM departments WHERE name = 'Security'),
    (SELECT id FROM users WHERE email = 'iso@officeops.com'),
    true
),
(
    'Financial Procedures Manual',
    'Standard operating procedures for financial transactions and reporting',
    'procedure',
    '1.2',
    (SELECT id FROM departments WHERE name = 'Finance'),
    (SELECT id FROM users WHERE email = 'admin@officeops.com'),
    true
),
(
    'IT Asset Management Policy',
    'Policies and procedures for managing IT assets throughout their lifecycle',
    'policy',
    '1.0',
    (SELECT id FROM departments WHERE name = 'Information Technology'),
    (SELECT id FROM users WHERE email = 'admin@officeops.com'),
    false
);

-- Insert sample risks
INSERT INTO risks (title, description, category, likelihood, impact, owner_id, department_id, mitigation_strategy, next_review_date) VALUES
(
    'Data Breach Risk',
    'Potential unauthorized access to sensitive customer and employee data',
    'Security',
    3,
    5,
    (SELECT id FROM users WHERE email = 'iso@officeops.com'),
    (SELECT id FROM departments WHERE name = 'Security'),
    'Implement multi-factor authentication, regular security training, and access reviews',
    CURRENT_DATE + INTERVAL '90 days'
),
(
    'Server Hardware Failure',
    'Critical server hardware failure causing system downtime',
    'Technical',
    2,
    4,
    (SELECT id FROM users WHERE email = 'admin@officeops.com'),
    (SELECT id FROM departments WHERE name = 'Information Technology'),
    'Regular hardware maintenance, redundant systems, and backup procedures',
    CURRENT_DATE + INTERVAL '180 days'
),
(
    'Compliance Violation',
    'Failure to comply with regulatory requirements leading to fines and penalties',
    'Compliance',
    2,
    5,
    (SELECT id FROM users WHERE email = 'manager@officeops.com'),
    (SELECT id FROM departments WHERE name = 'Human Resources'),
    'Regular compliance audits, staff training, and policy updates',
    CURRENT_DATE + INTERVAL '120 days'
),
(
    'Phishing Attack',
    'Employees falling victim to phishing emails leading to credential compromise',
    'Security',
    4,
    3,
    (SELECT id FROM users WHERE email = 'iso@officeops.com'),
    (SELECT id FROM departments WHERE name = 'Security'),
    'Security awareness training, email filtering, and incident response procedures',
    CURRENT_DATE + INTERVAL '60 days'
);

-- Insert sample courses
INSERT INTO courses (title, description, content, duration_hours, is_mandatory, department_id, created_by) VALUES
(
    'Information Security Awareness',
    'Comprehensive training on information security best practices',
    'This course covers password security, phishing awareness, data protection, and incident reporting procedures.',
    2,
    true,
    (SELECT id FROM departments WHERE name = 'Security'),
    (SELECT id FROM users WHERE email = 'iso@officeops.com')
),
(
    'Data Privacy Compliance',
    'Training on data privacy regulations and compliance requirements',
    'Understanding GDPR, CCPA, and other privacy regulations that affect our organization.',
    1,
    true,
    (SELECT id FROM departments WHERE name = 'Human Resources'),
    (SELECT id FROM users WHERE email = 'manager@officeops.com')
),
(
    'Asset Management Fundamentals',
    'Basic principles of IT asset management and lifecycle management',
    'Learn how to properly manage IT assets from acquisition to disposal.',
    1,
    false,
    (SELECT id FROM departments WHERE name = 'Information Technology'),
    (SELECT id FROM users WHERE email = 'admin@officeops.com')
),
(
    'Risk Assessment Methodology',
    'Understanding and conducting effective risk assessments',
    'Methodologies for identifying, assessing, and mitigating organizational risks.',
    3,
    false,
    (SELECT id FROM departments WHERE name = 'Operations'),
    (SELECT id FROM users WHERE email = 'auditor@officeops.com')
);

-- Insert sample access requests
INSERT INTO access_requests (requester_id, resource_id, justification, priority, requested_start_date, requested_end_date) VALUES
(
    (SELECT id FROM users WHERE email = 'employee@officeops.com'),
    (SELECT id FROM system_resources WHERE name = 'Employee Database'),
    'Need access to update employee records for annual review process',
    'medium',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '30 days'
),
(
    (SELECT id FROM users WHERE email = 'manager@officeops.com'),
    (SELECT id FROM system_resources WHERE name = 'Financial Systems'),
    'Require access to financial reports for quarterly budget analysis',
    'high',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days'
);

-- Insert system settings
INSERT INTO system_settings (key, value, description, category) VALUES
('company_name', 'OfficeOps Platform', 'Company name displayed in the application', 'general'),
('max_login_attempts', '5', 'Maximum number of login attempts before account lockout', 'security'),
('session_timeout', '480', 'Session timeout in minutes (8 hours)', 'security'),
('password_min_length', '8', 'Minimum password length requirement', 'security'),
('backup_retention_days', '90', 'Number of days to retain database backups', 'system'),
('notification_email', 'notifications@officeops.com', 'Email address for system notifications', 'notifications'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode', 'system');

-- Update department employee counts
UPDATE departments SET employee_count = (
    SELECT COUNT(*) FROM users WHERE users.department_id = departments.id
);

-- Create sample notifications
INSERT INTO notifications (recipient_id, title, message, type) VALUES
(
    (SELECT id FROM users WHERE email = 'admin@officeops.com'),
    'Welcome to OfficeOps Platform',
    'Your administrator account has been set up successfully. Please review the system settings and complete the initial configuration.',
    'info'
),
(
    (SELECT id FROM users WHERE email = 'iso@officeops.com'),
    'Security Review Required',
    'New access requests are pending your review. Please check the access management dashboard.',
    'warning'
);

-- Log initial setup in audit logs
INSERT INTO audit_logs (action, table_name, new_values) VALUES
('SYSTEM_INIT', 'system', '{"action": "Initial database setup completed", "version": "2.1.0", "timestamp": "' || CURRENT_TIMESTAMP || '"}');

-- Grant initial permissions (examples)
INSERT INTO user_permissions (user_id, resource_id, can_read, can_write, can_delete, granted_by) VALUES
-- Admin gets full access to all resources
(
    (SELECT id FROM users WHERE email = 'admin@officeops.com'),
    (SELECT id FROM system_resources WHERE name = 'Employee Database'),
    true, true, true,
    (SELECT id FROM users WHERE email = 'admin@officeops.com')
),
(
    (SELECT id FROM users WHERE email = 'admin@officeops.com'),
    (SELECT id FROM system_resources WHERE name = 'Financial Systems'),
    true, true, true,
    (SELECT id FROM users WHERE email = 'admin@officeops.com')
),
-- ISO gets read/write access to security resources
(
    (SELECT id FROM users WHERE email = 'iso@officeops.com'),
    (SELECT id FROM system_resources WHERE name = 'Security Monitoring Tools'),
    true, true, false,
    (SELECT id FROM users WHERE email = 'admin@officeops.com')
),
-- Manager gets read access to HR database
(
    (SELECT id FROM users WHERE email = 'manager@officeops.com'),
    (SELECT id FROM system_resources WHERE name = 'Employee Database'),
    true, false, false,
    (SELECT id FROM users WHERE email = 'admin@officeops.com')
);
