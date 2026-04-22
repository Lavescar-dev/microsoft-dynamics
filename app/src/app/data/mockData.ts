export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: 'Active' | 'Inactive';
  owner: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: 'New' | 'Qualified' | 'Unqualified' | 'Contacted';
  rating: 'Hot' | 'Warm' | 'Cold';
  estimatedValue: number;
  owner: string;
}

export interface Opportunity {
  id: string;
  name: string;
  account: string;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
  amount: number;
  closeDate: string;
  owner: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  revenue: number;
  employees: number;
  phone: string;
  website: string;
  status: 'Active' | 'Inactive';
  owner: string;
}

export interface Case {
  id: string;
  title: string;
  customer: string;
  priority: 'High' | 'Normal' | 'Low';
  status: 'Active' | 'Resolved' | 'Pending' | 'Cancelled';
  caseType: 'Question' | 'Problem' | 'Request';
  createdDate: string;
  owner: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';
  issueDate: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  manager: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  items: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  manager: string;
}

export const mockContacts: Contact[] = [
  { id: '1', firstName: 'John', lastName: 'Smith', email: 'john.smith@acmecorp.com', phone: '(555) 123-4567', company: 'Acme Corporation', title: 'CEO', status: 'Active', owner: 'Sarah Johnson' },
  { id: '2', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@techstart.io', phone: '(555) 234-5678', company: 'TechStart Inc', title: 'CTO', status: 'Active', owner: 'Michael Chen' },
  { id: '3', firstName: 'Michael', lastName: 'Brown', email: 'mbrown@globalind.com', phone: '(555) 345-6789', company: 'Global Industries', title: 'VP Sales', status: 'Active', owner: 'Sarah Johnson' },
  { id: '4', firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.w@innovate.com', phone: '(555) 456-7890', company: 'Innovate Solutions', title: 'Product Manager', status: 'Active', owner: 'David Lee' },
  { id: '5', firstName: 'James', lastName: 'Taylor', email: 'jtaylor@nexustech.com', phone: '(555) 567-8901', company: 'Nexus Tech', title: 'Director of IT', status: 'Inactive', owner: 'Michael Chen' },
  { id: '6', firstName: 'Lisa', lastName: 'Anderson', email: 'landerson@prime.com', phone: '(555) 678-9012', company: 'Prime Solutions', title: 'CFO', status: 'Active', owner: 'Sarah Johnson' },
  { id: '7', firstName: 'Robert', lastName: 'Martinez', email: 'robert.m@synergy.io', phone: '(555) 789-0123', company: 'Synergy Corp', title: 'Operations Manager', status: 'Active', owner: 'David Lee' },
  { id: '8', firstName: 'Jennifer', lastName: 'Garcia', email: 'jgarcia@bluesky.com', phone: '(555) 890-1234', company: 'Blue Sky Enterprises', title: 'Marketing Director', status: 'Active', owner: 'Michael Chen' },
  { id: '9', firstName: 'William', lastName: 'Thompson', email: 'wthompson@apex.com', phone: '(555) 901-2345', company: 'Apex Systems', title: 'VP Engineering', status: 'Active', owner: 'Sarah Johnson' },
  { id: '10', firstName: 'Patricia', lastName: 'Robinson', email: 'probinson@stellar.io', phone: '(555) 012-3456', company: 'Stellar Technologies', title: 'Chief Architect', status: 'Active', owner: 'David Lee' },
  { id: '11', firstName: 'Christopher', lastName: 'Lee', email: 'clee@quantum.com', phone: '(555) 123-4568', company: 'Quantum Dynamics', title: 'Head of R&D', status: 'Active', owner: 'Michael Chen' },
  { id: '12', firstName: 'Amanda', lastName: 'White', email: 'awhite@zenith.com', phone: '(555) 234-5679', company: 'Zenith Enterprises', title: 'Sales Director', status: 'Active', owner: 'Sarah Johnson' },
  { id: '13', firstName: 'Daniel', lastName: 'Hall', email: 'dhall@summit.com', phone: '(555) 345-6780', company: 'Summit Solutions', title: 'COO', status: 'Active', owner: 'David Lee' },
  { id: '14', firstName: 'Rachel', lastName: 'Moore', email: 'rmoore@horizon.io', phone: '(555) 456-7891', company: 'Horizon Tech', title: 'VP Product', status: 'Active', owner: 'Michael Chen' },
  { id: '15', firstName: 'Kevin', lastName: 'Clark', email: 'kclark@nexgen.com', phone: '(555) 567-8902', company: 'NexGen Industries', title: 'Business Analyst', status: 'Inactive', owner: 'Sarah Johnson' },
  { id: '16', firstName: 'Michelle', lastName: 'Adams', email: 'madams@velocity.com', phone: '(555) 678-9013', company: 'Velocity Corp', title: 'Project Manager', status: 'Active', owner: 'David Lee' },
  { id: '17', firstName: 'Brian', lastName: 'Nelson', email: 'bnelson@pioneer.io', phone: '(555) 789-0124', company: 'Pioneer Systems', title: 'Solutions Architect', status: 'Active', owner: 'Michael Chen' },
  { id: '18', firstName: 'Nicole', lastName: 'Carter', email: 'ncarter@catalyst.com', phone: '(555) 890-1235', company: 'Catalyst Ventures', title: 'Account Executive', status: 'Active', owner: 'Sarah Johnson' },
];

export const mockLeads: Lead[] = [
  { id: '1', name: 'Robert Johnson', company: 'Alpha Systems', email: 'rjohnson@alpha.com', phone: '(555) 111-2222', source: 'Website', status: 'New', rating: 'Hot', estimatedValue: 50000, owner: 'Sarah Johnson' },
  { id: '2', name: 'Maria Rodriguez', company: 'Beta Technologies', email: 'maria@betatech.com', phone: '(555) 222-3333', source: 'Referral', status: 'Qualified', rating: 'Hot', estimatedValue: 75000, owner: 'Michael Chen' },
  { id: '3', name: 'David Lee', company: 'Gamma Corp', email: 'dlee@gamma.com', phone: '(555) 333-4444', source: 'Trade Show', status: 'Contacted', rating: 'Warm', estimatedValue: 35000, owner: 'David Lee' },
  { id: '4', name: 'Amanda White', company: 'Delta Innovations', email: 'awhite@delta.io', phone: '(555) 444-5555', source: 'LinkedIn', status: 'New', rating: 'Warm', estimatedValue: 45000, owner: 'Sarah Johnson' },
  { id: '5', name: 'Christopher Moore', company: 'Epsilon Group', email: 'cmoore@epsilon.com', phone: '(555) 555-6666', source: 'Cold Call', status: 'Unqualified', rating: 'Cold', estimatedValue: 20000, owner: 'Michael Chen' },
  { id: '6', name: 'Jessica Thomas', company: 'Zeta Enterprises', email: 'jthomas@zeta.com', phone: '(555) 666-7777', source: 'Email Campaign', status: 'Qualified', rating: 'Hot', estimatedValue: 90000, owner: 'David Lee' },
  { id: '7', name: 'Matthew Jackson', company: 'Omega Solutions', email: 'mjackson@omega.com', phone: '(555) 777-8888', source: 'Website', status: 'New', rating: 'Hot', estimatedValue: 65000, owner: 'Sarah Johnson' },
  { id: '8', name: 'Ashley Martin', company: 'Sigma Industries', email: 'amartin@sigma.io', phone: '(555) 888-9999', source: 'Referral', status: 'Contacted', rating: 'Warm', estimatedValue: 55000, owner: 'Michael Chen' },
  { id: '9', name: 'Joshua Harris', company: 'Theta Systems', email: 'jharris@theta.com', phone: '(555) 999-0000', source: 'Trade Show', status: 'Qualified', rating: 'Hot', estimatedValue: 85000, owner: 'David Lee' },
  { id: '10', name: 'Elizabeth Turner', company: 'Lambda Corp', email: 'eturner@lambda.com', phone: '(555) 000-1111', source: 'LinkedIn', status: 'New', rating: 'Warm', estimatedValue: 40000, owner: 'Sarah Johnson' },
  { id: '11', name: 'Andrew Scott', company: 'Kappa Ventures', email: 'ascott@kappa.io', phone: '(555) 111-2223', source: 'Website', status: 'Contacted', rating: 'Cold', estimatedValue: 25000, owner: 'Michael Chen' },
  { id: '12', name: 'Stephanie Phillips', company: 'Iota Enterprises', email: 'sphillips@iota.com', phone: '(555) 222-3334', source: 'Email Campaign', status: 'Qualified', rating: 'Hot', estimatedValue: 95000, owner: 'David Lee' },
  { id: '13', name: 'Ryan Campbell', company: 'Nu Technologies', email: 'rcampbell@nu.com', phone: '(555) 333-4445', source: 'Referral', status: 'New', rating: 'Warm', estimatedValue: 48000, owner: 'Sarah Johnson' },
  { id: '14', name: 'Lauren Parker', company: 'Xi Solutions', email: 'lparker@xi.io', phone: '(555) 444-5556', source: 'Trade Show', status: 'Contacted', rating: 'Hot', estimatedValue: 72000, owner: 'Michael Chen' },
  { id: '15', name: 'Brandon Evans', company: 'Rho Industries', email: 'bevans@rho.com', phone: '(555) 555-6667', source: 'LinkedIn', status: 'Qualified', rating: 'Warm', estimatedValue: 58000, owner: 'David Lee' },
];

export const mockOpportunities: Opportunity[] = [
  { id: '1', name: 'Enterprise Software License', account: 'Acme Corporation', stage: 'Proposal', probability: 70, amount: 125000, closeDate: '2026-04-15', owner: 'Sarah Johnson' },
  { id: '2', name: 'Cloud Migration Project', account: 'TechStart Inc', stage: 'Negotiation', probability: 80, amount: 250000, closeDate: '2026-03-30', owner: 'Michael Chen' },
  { id: '3', name: 'CRM Implementation', account: 'Global Industries', stage: 'Qualification', probability: 40, amount: 180000, closeDate: '2026-05-20', owner: 'Sarah Johnson' },
  { id: '4', name: 'Security Audit Services', account: 'Innovate Solutions', stage: 'Prospecting', probability: 20, amount: 65000, closeDate: '2026-06-10', owner: 'David Lee' },
  { id: '5', name: 'Data Analytics Platform', account: 'Nexus Tech', stage: 'Closed Won', probability: 100, amount: 320000, closeDate: '2026-03-15', owner: 'Michael Chen' },
  { id: '6', name: 'Custom Integration', account: 'Prime Solutions', stage: 'Proposal', probability: 60, amount: 95000, closeDate: '2026-04-25', owner: 'Sarah Johnson' },
  { id: '7', name: 'Mobile App Development', account: 'Synergy Corp', stage: 'Negotiation', probability: 75, amount: 150000, closeDate: '2026-04-05', owner: 'David Lee' },
  { id: '8', name: 'Infrastructure Upgrade', account: 'Blue Sky Enterprises', stage: 'Qualification', probability: 50, amount: 210000, closeDate: '2026-05-15', owner: 'Michael Chen' },
  { id: '9', name: 'AI Training Services', account: 'Apex Systems', stage: 'Proposal', probability: 65, amount: 145000, closeDate: '2026-04-20', owner: 'Sarah Johnson' },
  { id: '10', name: 'DevOps Consulting', account: 'Stellar Technologies', stage: 'Negotiation', probability: 85, amount: 175000, closeDate: '2026-03-28', owner: 'David Lee' },
  { id: '11', name: 'Database Modernization', account: 'Quantum Dynamics', stage: 'Prospecting', probability: 30, amount: 195000, closeDate: '2026-06-01', owner: 'Michael Chen' },
  { id: '12', name: 'Support Contract Renewal', account: 'Zenith Enterprises', stage: 'Closed Won', probability: 100, amount: 85000, closeDate: '2026-03-10', owner: 'Sarah Johnson' },
  { id: '13', name: 'Digital Transformation', account: 'Summit Solutions', stage: 'Qualification', probability: 45, amount: 380000, closeDate: '2026-05-30', owner: 'David Lee' },
  { id: '14', name: 'Cybersecurity Assessment', account: 'Horizon Tech', stage: 'Proposal', probability: 55, amount: 115000, closeDate: '2026-04-18', owner: 'Michael Chen' },
  { id: '15', name: 'Compliance Audit', account: 'NexGen Industries', stage: 'Closed Lost', probability: 0, amount: 75000, closeDate: '2026-03-05', owner: 'Sarah Johnson' },
];

export const mockAccounts: Account[] = [
  { id: '1', name: 'Acme Corporation', industry: 'Manufacturing', revenue: 50000000, employees: 500, phone: '(555) 100-1000', website: 'www.acmecorp.com', status: 'Active', owner: 'Sarah Johnson' },
  { id: '2', name: 'TechStart Inc', industry: 'Technology', revenue: 25000000, employees: 150, phone: '(555) 200-2000', website: 'www.techstart.io', status: 'Active', owner: 'Michael Chen' },
  { id: '3', name: 'Global Industries', industry: 'Retail', revenue: 100000000, employees: 1000, phone: '(555) 300-3000', website: 'www.globalind.com', status: 'Active', owner: 'Sarah Johnson' },
  { id: '4', name: 'Innovate Solutions', industry: 'Consulting', revenue: 15000000, employees: 80, phone: '(555) 400-4000', website: 'www.innovate.com', status: 'Active', owner: 'David Lee' },
  { id: '5', name: 'Nexus Tech', industry: 'Technology', revenue: 75000000, employees: 600, phone: '(555) 500-5000', website: 'www.nexustech.com', status: 'Inactive', owner: 'Michael Chen' },
  { id: '6', name: 'Prime Solutions', industry: 'Financial Services', revenue: 200000000, employees: 2000, phone: '(555) 600-6000', website: 'www.prime.com', status: 'Active', owner: 'Sarah Johnson' },
  { id: '7', name: 'Synergy Corp', industry: 'Healthcare', revenue: 35000000, employees: 250, phone: '(555) 700-7000', website: 'www.synergy.io', status: 'Active', owner: 'David Lee' },
  { id: '8', name: 'Blue Sky Enterprises', industry: 'Media', revenue: 45000000, employees: 300, phone: '(555) 800-8000', website: 'www.bluesky.com', status: 'Active', owner: 'Michael Chen' },
  { id: '9', name: 'Apex Systems', industry: 'Technology', revenue: 90000000, employees: 750, phone: '(555) 900-9000', website: 'www.apex.com', status: 'Active', owner: 'Sarah Johnson' },
  { id: '10', name: 'Stellar Technologies', industry: 'Telecommunications', revenue: 120000000, employees: 1200, phone: '(555) 010-1010', website: 'www.stellar.io', status: 'Active', owner: 'David Lee' },
  { id: '11', name: 'Quantum Dynamics', industry: 'Research', revenue: 30000000, employees: 200, phone: '(555) 110-1100', website: 'www.quantum.com', status: 'Active', owner: 'Michael Chen' },
  { id: '12', name: 'Zenith Enterprises', industry: 'Real Estate', revenue: 65000000, employees: 400, phone: '(555) 210-2100', website: 'www.zenith.com', status: 'Active', owner: 'Sarah Johnson' },
  { id: '13', name: 'Summit Solutions', industry: 'Logistics', revenue: 80000000, employees: 650, phone: '(555) 310-3100', website: 'www.summit.com', status: 'Active', owner: 'David Lee' },
  { id: '14', name: 'Horizon Tech', industry: 'Technology', revenue: 55000000, employees: 450, phone: '(555) 410-4100', website: 'www.horizon.io', status: 'Active', owner: 'Michael Chen' },
  { id: '15', name: 'NexGen Industries', industry: 'Energy', revenue: 150000000, employees: 1500, phone: '(555) 510-5100', website: 'www.nexgen.com', status: 'Inactive', owner: 'Sarah Johnson' },
];

export const mockCases: Case[] = [
  { id: '1', title: 'Product installation issue', customer: 'Acme Corporation', priority: 'High', status: 'Active', caseType: 'Problem', createdDate: '2026-03-20', owner: 'Tech Support Team' },
  { id: '2', title: 'License key activation', customer: 'TechStart Inc', priority: 'Normal', status: 'Resolved', caseType: 'Question', createdDate: '2026-03-18', owner: 'Tech Support Team' },
  { id: '3', title: 'Performance degradation', customer: 'Global Industries', priority: 'High', status: 'Active', caseType: 'Problem', createdDate: '2026-03-22', owner: 'Engineering Team' },
  { id: '4', title: 'Feature request - API access', customer: 'Innovate Solutions', priority: 'Low', status: 'Pending', caseType: 'Request', createdDate: '2026-03-15', owner: 'Product Team' },
  { id: '5', title: 'Data export not working', customer: 'Prime Solutions', priority: 'High', status: 'Active', caseType: 'Problem', createdDate: '2026-03-23', owner: 'Tech Support Team' },
  { id: '6', title: 'Training session request', customer: 'Synergy Corp', priority: 'Normal', status: 'Pending', caseType: 'Request', createdDate: '2026-03-19', owner: 'Customer Success' },
  { id: '7', title: 'Integration setup help', customer: 'Blue Sky Enterprises', priority: 'Normal', status: 'Active', caseType: 'Question', createdDate: '2026-03-21', owner: 'Tech Support Team' },
  { id: '8', title: 'Billing inquiry', customer: 'Apex Systems', priority: 'Low', status: 'Resolved', caseType: 'Question', createdDate: '2026-03-17', owner: 'Finance Team' },
  { id: '9', title: 'Security vulnerability report', customer: 'Stellar Technologies', priority: 'High', status: 'Active', caseType: 'Problem', createdDate: '2026-03-24', owner: 'Security Team' },
  { id: '10', title: 'Custom report development', customer: 'Quantum Dynamics', priority: 'Normal', status: 'Pending', caseType: 'Request', createdDate: '2026-03-16', owner: 'Development Team' },
];

export const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2026-001', customer: 'Acme Corporation', amount: 125000, dueDate: '2026-04-15', status: 'Pending', issueDate: '2026-03-15' },
  { id: '2', invoiceNumber: 'INV-2026-002', customer: 'TechStart Inc', amount: 250000, dueDate: '2026-03-30', status: 'Paid', issueDate: '2026-03-01' },
  { id: '3', invoiceNumber: 'INV-2026-003', customer: 'Global Industries', amount: 180000, dueDate: '2026-04-20', status: 'Pending', issueDate: '2026-03-20' },
  { id: '4', invoiceNumber: 'INV-2026-004', customer: 'Prime Solutions', amount: 95000, dueDate: '2026-03-25', status: 'Overdue', issueDate: '2026-02-25' },
  { id: '5', invoiceNumber: 'INV-2026-005', customer: 'Synergy Corp', amount: 150000, dueDate: '2026-04-05', status: 'Pending', issueDate: '2026-03-05' },
  { id: '6', invoiceNumber: 'INV-2026-006', customer: 'Blue Sky Enterprises', amount: 210000, dueDate: '2026-04-30', status: 'Pending', issueDate: '2026-03-22' },
  { id: '7', invoiceNumber: 'INV-2026-007', customer: 'Apex Systems', amount: 145000, dueDate: '2026-03-28', status: 'Paid', issueDate: '2026-02-28' },
  { id: '8', invoiceNumber: 'INV-2026-008', customer: 'Stellar Technologies', amount: 175000, dueDate: '2026-04-10', status: 'Pending', issueDate: '2026-03-10' },
  { id: '9', invoiceNumber: 'INV-2026-009', customer: 'Zenith Enterprises', amount: 85000, dueDate: '2026-03-15', status: 'Paid', issueDate: '2026-02-15' },
  { id: '10', invoiceNumber: 'INV-2026-010', customer: 'Horizon Tech', amount: 115000, dueDate: '2026-05-01', status: 'Pending', issueDate: '2026-03-24' },
];

export const mockProjects: Project[] = [
  { id: '1', name: 'ERP System Rollout', client: 'Acme Corporation', budget: 500000, spent: 325000, progress: 65, status: 'Active', startDate: '2026-01-01', endDate: '2026-06-30', manager: 'Sarah Johnson' },
  { id: '2', name: 'Cloud Infrastructure Migration', client: 'TechStart Inc', budget: 350000, spent: 315000, progress: 90, status: 'Active', startDate: '2026-02-01', endDate: '2026-04-30', manager: 'Michael Chen' },
  { id: '3', name: 'Mobile App Development', client: 'Global Industries', budget: 250000, spent: 187500, progress: 75, status: 'Active', startDate: '2026-01-15', endDate: '2026-05-15', manager: 'David Lee' },
  { id: '4', name: 'Security Compliance Audit', client: 'Prime Solutions', budget: 125000, spent: 125000, progress: 100, status: 'Completed', startDate: '2026-01-01', endDate: '2026-03-15', manager: 'Sarah Johnson' },
  { id: '5', name: 'Data Center Upgrade', client: 'Synergy Corp', budget: 450000, spent: 180000, progress: 40, status: 'Active', startDate: '2026-02-15', endDate: '2026-08-15', manager: 'Michael Chen' },
  { id: '6', name: 'CRM Customization', client: 'Blue Sky Enterprises', budget: 180000, spent: 90000, progress: 50, status: 'Active', startDate: '2026-03-01', endDate: '2026-06-01', manager: 'David Lee' },
  { id: '7', name: 'Network Security Enhancement', client: 'Apex Systems', budget: 275000, spent: 68750, progress: 25, status: 'On Hold', startDate: '2026-02-01', endDate: '2026-07-01', manager: 'Sarah Johnson' },
  { id: '8', name: 'Business Intelligence Platform', client: 'Stellar Technologies', budget: 400000, spent: 320000, progress: 80, status: 'Active', startDate: '2026-01-10', endDate: '2026-05-10', manager: 'Michael Chen' },
];

export const mockOrders: Order[] = [
  { id: '1', orderNumber: 'ORD-2026-1001', customer: 'Acme Corporation', total: 45000, status: 'Processing', orderDate: '2026-03-20', items: 12 },
  { id: '2', orderNumber: 'ORD-2026-1002', customer: 'TechStart Inc', total: 32000, status: 'Shipped', orderDate: '2026-03-18', items: 8 },
  { id: '3', orderNumber: 'ORD-2026-1003', customer: 'Global Industries', total: 78000, status: 'Delivered', orderDate: '2026-03-15', items: 24 },
  { id: '4', orderNumber: 'ORD-2026-1004', customer: 'Innovate Solutions', total: 23000, status: 'Processing', orderDate: '2026-03-22', items: 6 },
  { id: '5', orderNumber: 'ORD-2026-1005', customer: 'Prime Solutions', total: 56000, status: 'Shipped', orderDate: '2026-03-19', items: 15 },
  { id: '6', orderNumber: 'ORD-2026-1006', customer: 'Synergy Corp', total: 41000, status: 'Processing', orderDate: '2026-03-23', items: 10 },
  { id: '7', orderNumber: 'ORD-2026-1007', customer: 'Blue Sky Enterprises', total: 67000, status: 'Delivered', orderDate: '2026-03-16', items: 18 },
  { id: '8', orderNumber: 'ORD-2026-1008', customer: 'Apex Systems', total: 89000, status: 'Shipped', orderDate: '2026-03-21', items: 22 },
  { id: '9', orderNumber: 'ORD-2026-1009', customer: 'Stellar Technologies', total: 52000, status: 'Processing', orderDate: '2026-03-24', items: 14 },
  { id: '10', orderNumber: 'ORD-2026-1010', customer: 'Quantum Dynamics', total: 34000, status: 'Cancelled', orderDate: '2026-03-17', items: 9 },
];

export const mockEmployees: Employee[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sjohnson@company.com', department: 'Sales', position: 'Sales Manager', hireDate: '2022-01-15', status: 'Active', manager: 'Director of Sales' },
  { id: '2', firstName: 'Michael', lastName: 'Chen', email: 'mchen@company.com', department: 'Sales', position: 'Senior Account Executive', hireDate: '2021-06-01', status: 'Active', manager: 'Sarah Johnson' },
  { id: '3', firstName: 'David', lastName: 'Lee', email: 'dlee@company.com', department: 'Sales', position: 'Account Executive', hireDate: '2023-03-10', status: 'Active', manager: 'Sarah Johnson' },
  { id: '4', firstName: 'Jennifer', lastName: 'Williams', email: 'jwilliams@company.com', department: 'Marketing', position: 'Marketing Director', hireDate: '2020-09-01', status: 'Active', manager: 'CMO' },
  { id: '5', firstName: 'Robert', lastName: 'Brown', email: 'rbrown@company.com', department: 'Engineering', position: 'Software Engineer', hireDate: '2022-05-20', status: 'Active', manager: 'Engineering Manager' },
  { id: '6', firstName: 'Lisa', lastName: 'Davis', email: 'ldavis@company.com', department: 'Customer Support', position: 'Support Specialist', hireDate: '2023-01-08', status: 'Active', manager: 'Support Manager' },
  { id: '7', firstName: 'James', lastName: 'Miller', email: 'jmiller@company.com', department: 'Finance', position: 'Financial Analyst', hireDate: '2021-11-15', status: 'Active', manager: 'CFO' },
  { id: '8', firstName: 'Maria', lastName: 'Garcia', email: 'mgarcia@company.com', department: 'Human Resources', position: 'HR Manager', hireDate: '2020-04-01', status: 'Active', manager: 'VP HR' },
  { id: '9', firstName: 'Thomas', lastName: 'Wilson', email: 'twilson@company.com', department: 'Operations', position: 'Operations Manager', hireDate: '2021-08-12', status: 'On Leave', manager: 'COO' },
  { id: '10', firstName: 'Jessica', lastName: 'Moore', email: 'jmoore@company.com', department: 'Marketing', position: 'Content Specialist', hireDate: '2023-02-20', status: 'Active', manager: 'Jennifer Williams' },
];

export interface Quote {
  id: string;
  quoteNumber: string;
  name: string;
  account: string;
  totalAmount: number;
  status: 'Draft' | 'Active' | 'Won' | 'Lost' | 'Revised';
  validUntil: string;
  createdDate: string;
  owner: string;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  category: string;
  unitPrice: number;
  stock: number;
  status: 'Active' | 'Inactive' | 'Discontinued';
  vendor: string;
}

export interface Competitor {
  id: string;
  name: string;
  industry: string;
  strengths: string;
  weaknesses: string;
  winRate: number;
  opportunities: number;
}

export interface Activity {
  id: string;
  subject: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Task';
  regarding: string;
  priority: 'High' | 'Normal' | 'Low';
  status: 'Open' | 'Completed' | 'Cancelled';
  dueDate: string;
  owner: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  views: number;
  rating: number;
  status: 'Draft' | 'Published' | 'Archived';
  publishDate: string;
}

export interface Queue {
  id: string;
  name: string;
  type: 'Case' | 'Activity' | 'Email';
  activeItems: number;
  owner: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Email' | 'Multi-Channel' | 'Direct Mail' | 'Social Media';
  status: 'Active' | 'Planning' | 'Completed';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  responses: number;
  revenue: number;
  owner: string;
}

export interface Segment {
  id: string;
  name: string;
  type: 'Dynamic' | 'Static';
  criteria: string;
  memberCount: number;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
  campaigns: number;
  avgValue: number;
  owner: string;
}

export interface CustomerJourney {
  id: string;
  name: string;
  status: 'Active' | 'Paused';
  type: 'Automated' | 'Semi-Automated' | 'Manual';
  startTrigger: string;
  steps: number;
  activeCust: number;
  completed: number;
  avgDuration: string;
  conversionRate: number;
  owner: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  customer: string;
  location: string;
  technician: string;
  status: 'In Progress' | 'Scheduled' | 'Completed' | 'Unscheduled';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  serviceType: 'Repair' | 'Maintenance' | 'Installation' | 'Emergency' | 'Inspection';
  scheduledDate: string | null;
  scheduledTime: string | null;
  estimatedDuration: string;
  actualStart: string | null;
}

export const mockQuotes: Quote[] = [
  { id: '1', quoteNumber: 'QUO-2026-001', name: 'Enterprise Software Package', account: 'Acme Corporation', totalAmount: 125000, status: 'Active', validUntil: '2026-04-30', createdDate: '2026-03-15', owner: 'Sarah Johnson' },
  { id: '2', quoteNumber: 'QUO-2026-002', name: 'Cloud Service Bundle', account: 'TechStart Inc', totalAmount: 250000, status: 'Won', validUntil: '2026-04-15', createdDate: '2026-03-10', owner: 'Michael Chen' },
  { id: '3', quoteNumber: 'QUO-2026-003', name: 'CRM Solution Quote', account: 'Global Industries', totalAmount: 180000, status: 'Active', validUntil: '2026-05-10', createdDate: '2026-03-20', owner: 'Sarah Johnson' },
  { id: '4', quoteNumber: 'QUO-2026-004', name: 'Security Services', account: 'Innovate Solutions', totalAmount: 65000, status: 'Draft', validUntil: '2026-04-20', createdDate: '2026-03-22', owner: 'David Lee' },
  { id: '5', quoteNumber: 'QUO-2026-005', name: 'Integration Package', account: 'Prime Solutions', totalAmount: 95000, status: 'Active', validUntil: '2026-04-25', createdDate: '2026-03-18', owner: 'Sarah Johnson' },
  { id: '6', quoteNumber: 'QUO-2026-006', name: 'Mobile Development', account: 'Synergy Corp', totalAmount: 150000, status: 'Revised', validUntil: '2026-04-05', createdDate: '2026-03-12', owner: 'David Lee' },
  { id: '7', quoteNumber: 'QUO-2026-007', name: 'Infrastructure Proposal', account: 'Blue Sky Enterprises', totalAmount: 210000, status: 'Active', validUntil: '2026-05-15', createdDate: '2026-03-19', owner: 'Michael Chen' },
  { id: '8', quoteNumber: 'QUO-2026-008', name: 'AI Platform Quote', account: 'Apex Systems', totalAmount: 145000, status: 'Active', validUntil: '2026-04-18', createdDate: '2026-03-21', owner: 'Sarah Johnson' },
  { id: '9', quoteNumber: 'QUO-2026-009', name: 'Consulting Services', account: 'Stellar Technologies', totalAmount: 175000, status: 'Won', validUntil: '2026-03-30', createdDate: '2026-03-05', owner: 'David Lee' },
  { id: '10', quoteNumber: 'QUO-2026-010', name: 'Database Solution', account: 'Quantum Dynamics', totalAmount: 195000, status: 'Lost', validUntil: '2026-03-25', createdDate: '2026-03-01', owner: 'Michael Chen' },
];

export const mockProducts: Product[] = [
  { id: '1', productId: 'PRD-001', name: 'Enterprise CRM License', category: 'Software', unitPrice: 2500, stock: 500, status: 'Active', vendor: 'Internal' },
  { id: '2', productId: 'PRD-002', name: 'Cloud Storage - 1TB', category: 'Cloud Services', unitPrice: 150, stock: 1000, status: 'Active', vendor: 'Azure' },
  { id: '3', productId: 'PRD-003', name: 'Security Suite Pro', category: 'Security', unitPrice: 800, stock: 250, status: 'Active', vendor: 'Partner Security Inc' },
  { id: '4', productId: 'PRD-004', name: 'AI Analytics Module', category: 'Software', unitPrice: 5000, stock: 100, status: 'Active', vendor: 'Internal' },
  { id: '5', productId: 'PRD-005', name: 'Mobile App Builder', category: 'Development Tools', unitPrice: 1200, stock: 300, status: 'Active', vendor: 'Internal' },
  { id: '6', productId: 'PRD-006', name: 'Database Connector', category: 'Integration', unitPrice: 600, stock: 450, status: 'Active', vendor: 'Partner Tech Corp' },
  { id: '7', productId: 'PRD-007', name: 'Support Plan - Premium', category: 'Services', unitPrice: 10000, stock: 999, status: 'Active', vendor: 'Internal' },
  { id: '8', productId: 'PRD-008', name: 'Training Package', category: 'Services', unitPrice: 3000, stock: 200, status: 'Active', vendor: 'Internal' },
  { id: '9', productId: 'PRD-009', name: 'Legacy System Bridge', category: 'Integration', unitPrice: 750, stock: 150, status: 'Discontinued', vendor: 'Partner Legacy Co' },
  { id: '10', productId: 'PRD-010', name: 'Reporting Dashboard Pro', category: 'Analytics', unitPrice: 1800, stock: 350, status: 'Active', vendor: 'Internal' },
];

export const mockCompetitors: Competitor[] = [
  { id: '1', name: 'Salesforce', industry: 'CRM & Cloud', strengths: 'Market leader, extensive ecosystem', weaknesses: 'High cost, complex implementation', winRate: 35, opportunities: 28 },
  { id: '2', name: 'Oracle CRM', industry: 'Enterprise Software', strengths: 'Strong database integration', weaknesses: 'Legacy technology, expensive', winRate: 52, opportunities: 15 },
  { id: '3', name: 'SAP CRM', industry: 'ERP & CRM', strengths: 'Enterprise integration, global reach', weaknesses: 'Complexity, high TCO', winRate: 48, opportunities: 22 },
  { id: '4', name: 'HubSpot', industry: 'Marketing & Sales', strengths: 'User-friendly, strong marketing tools', weaknesses: 'Limited enterprise features', winRate: 65, opportunities: 18 },
  { id: '5', name: 'Zoho CRM', industry: 'SMB Software', strengths: 'Affordable, feature-rich', weaknesses: 'Support quality, scalability', winRate: 72, opportunities: 12 },
  { id: '6', name: 'SugarCRM', industry: 'Open Source CRM', strengths: 'Customizable, open source', weaknesses: 'Small market share, limited resources', winRate: 80, opportunities: 8 },
  { id: '7', name: 'Pipedrive', industry: 'Sales CRM', strengths: 'Sales-focused, easy to use', weaknesses: 'Limited functionality', winRate: 68, opportunities: 10 },
];

export const mockActivities: Activity[] = [
  { id: '1', subject: 'Follow-up call with Acme Corporation', type: 'Call', regarding: 'Enterprise Software License', priority: 'High', status: 'Open', dueDate: '2026-03-26', owner: 'Sarah Johnson' },
  { id: '2', subject: 'Send proposal to TechStart Inc', type: 'Email', regarding: 'Cloud Migration Project', priority: 'High', status: 'Completed', dueDate: '2026-03-24', owner: 'Michael Chen' },
  { id: '3', subject: 'Product demo for Global Industries', type: 'Meeting', regarding: 'CRM Implementation', priority: 'Normal', status: 'Open', dueDate: '2026-03-28', owner: 'Sarah Johnson' },
  { id: '4', subject: 'Prepare security assessment report', type: 'Task', regarding: 'Security Audit Services', priority: 'High', status: 'Open', dueDate: '2026-03-27', owner: 'David Lee' },
  { id: '5', subject: 'Contract negotiation with Prime Solutions', type: 'Meeting', regarding: 'Custom Integration', priority: 'High', status: 'Open', dueDate: '2026-03-29', owner: 'Sarah Johnson' },
  { id: '6', subject: 'Technical requirements review', type: 'Call', regarding: 'Mobile App Development', priority: 'Normal', status: 'Completed', dueDate: '2026-03-23', owner: 'David Lee' },
  { id: '7', subject: 'Send thank you email to Stellar Tech', type: 'Email', regarding: 'DevOps Consulting', priority: 'Low', status: 'Completed', dueDate: '2026-03-25', owner: 'David Lee' },
  { id: '8', subject: 'Quarterly business review', type: 'Meeting', regarding: 'Zenith Enterprises', priority: 'Normal', status: 'Open', dueDate: '2026-03-30', owner: 'Sarah Johnson' },
  { id: '9', subject: 'Product training session', type: 'Meeting', regarding: 'Horizon Tech', priority: 'Normal', status: 'Open', dueDate: '2026-04-02', owner: 'Michael Chen' },
  { id: '10', subject: 'Budget approval follow-up', type: 'Call', regarding: 'Digital Transformation', priority: 'High', status: 'Open', dueDate: '2026-03-27', owner: 'David Lee' },
];

export const mockKnowledgeArticles: KnowledgeArticle[] = [
  { id: '1', title: 'How to Reset Your Password', category: 'Account Management', author: 'Support Team', views: 1542, rating: 4.5, status: 'Published', publishDate: '2026-01-15' },
  { id: '2', title: 'Getting Started with CRM Integration', category: 'Integration', author: 'Tech Team', views: 823, rating: 4.8, status: 'Published', publishDate: '2026-02-01' },
  { id: '3', title: 'Troubleshooting Data Export Issues', category: 'Technical', author: 'Engineering Team', views: 1156, rating: 4.2, status: 'Published', publishDate: '2026-01-20' },
  { id: '4', title: 'Best Practices for Lead Management', category: 'Sales', author: 'Sarah Johnson', views: 2103, rating: 4.9, status: 'Published', publishDate: '2026-02-10' },
  { id: '5', title: 'Configuring Email Templates', category: 'Configuration', author: 'Admin Team', views: 654, rating: 4.3, status: 'Published', publishDate: '2026-02-15' },
  { id: '6', title: 'Understanding Security Features', category: 'Security', author: 'Security Team', views: 891, rating: 4.7, status: 'Published', publishDate: '2026-01-25' },
  { id: '7', title: 'Mobile App Installation Guide', category: 'Mobile', author: 'Support Team', views: 1789, rating: 4.6, status: 'Published', publishDate: '2026-02-05' },
  { id: '8', title: 'Advanced Reporting Techniques', category: 'Reporting', author: 'Analytics Team', views: 432, rating: 4.4, status: 'Draft', publishDate: '2026-03-01' },
  { id: '9', title: 'API Authentication Methods', category: 'Development', author: 'Dev Team', views: 567, rating: 4.5, status: 'Published', publishDate: '2026-02-20' },
  { id: '10', title: 'Managing User Permissions', category: 'Administration', author: 'Admin Team', views: 1234, rating: 4.8, status: 'Published', publishDate: '2026-01-30' },
];

export const mockQueues: Queue[] = [
  { id: '1', name: 'Support Queue - Tier 1', type: 'Case', activeItems: 23, owner: 'Support Team' },
  { id: '2', name: 'Support Queue - Tier 2', type: 'Case', activeItems: 15, owner: 'Support Team' },
  { id: '3', name: 'Sales Activities', type: 'Activity', activeItems: 42, owner: 'Sales Team' },
  { id: '4', name: 'Customer Service Email', type: 'Email', activeItems: 67, owner: 'Service Team' },
  { id: '5', name: 'Technical Support Queue', type: 'Case', activeItems: 18, owner: 'Tech Support' },
  { id: '6', name: 'Escalation Queue', type: 'Case', activeItems: 8, owner: 'Management' },
  { id: '7', name: 'Marketing Campaigns', type: 'Activity', activeItems: 31, owner: 'Marketing Team' },
  { id: '8', name: 'Partner Inquiries', type: 'Email', activeItems: 12, owner: 'Partner Team' },
];

export const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Q1 Product Launch Campaign', type: 'Email', status: 'Active', startDate: '2026-03-01', endDate: '2026-03-31', budget: 50000, spent: 32500, leads: 456, responses: 187, revenue: 125000, owner: 'Jennifer Williams' },
  { id: '2', name: 'Spring Promotion 2026', type: 'Multi-Channel', status: 'Active', startDate: '2026-03-15', endDate: '2026-04-15', budget: 75000, spent: 28000, leads: 342, responses: 156, revenue: 98000, owner: 'Jennifer Williams' },
  { id: '3', name: 'Customer Retention Program', type: 'Email', status: 'Planning', startDate: '2026-04-01', endDate: '2026-06-30', budget: 40000, spent: 0, leads: 0, responses: 0, revenue: 0, owner: 'Jessica Moore' },
  { id: '4', name: 'Enterprise Sales Outreach', type: 'Direct Mail', status: 'Active', startDate: '2026-02-15', endDate: '2026-05-15', budget: 120000, spent: 95000, leads: 89, responses: 67, revenue: 450000, owner: 'Jennifer Williams' },
  { id: '5', name: 'LinkedIn Lead Gen', type: 'Social Media', status: 'Completed', startDate: '2026-01-01', endDate: '2026-02-28', budget: 35000, spent: 34500, leads: 234, responses: 98, revenue: 67000, owner: 'Jessica Moore' },
  { id: '6', name: 'Trade Show Follow-up', type: 'Email', status: 'Active', startDate: '2026-03-10', endDate: '2026-03-31', budget: 15000, spent: 8500, leads: 156, responses: 89, revenue: 42000, owner: 'Jennifer Williams' },
];

export const mockSegments: Segment[] = [
  { id: '1', name: 'High-Value Enterprise Customers', type: 'Dynamic', criteria: 'Annual Revenue > $1M', memberCount: 234, status: 'Active', lastUpdated: '2026-03-25', campaigns: 3, avgValue: 250000, owner: 'Jennifer Williams' },
  { id: '2', name: 'Mid-Market Tech Companies', type: 'Static', criteria: 'Industry: Technology, Employees: 50-500', memberCount: 567, status: 'Active', lastUpdated: '2026-03-24', campaigns: 5, avgValue: 85000, owner: 'Jessica Moore' },
  { id: '3', name: 'Recently Engaged Leads', type: 'Dynamic', criteria: 'Last Activity < 7 days', memberCount: 189, status: 'Active', lastUpdated: '2026-03-25', campaigns: 2, avgValue: 45000, owner: 'Jennifer Williams' },
  { id: '4', name: 'Healthcare Decision Makers', type: 'Static', criteria: 'Industry: Healthcare, Title: Director+', memberCount: 342, status: 'Active', lastUpdated: '2026-03-23', campaigns: 4, avgValue: 120000, owner: 'Jessica Moore' },
  { id: '5', name: 'Inactive Customers (90+ days)', type: 'Dynamic', criteria: 'Last Purchase > 90 days', memberCount: 156, status: 'Active', lastUpdated: '2026-03-25', campaigns: 1, avgValue: 35000, owner: 'Jennifer Williams' },
  { id: '6', name: 'VIP Accounts', type: 'Static', criteria: 'Lifetime Value > $500K', memberCount: 78, status: 'Active', lastUpdated: '2026-03-22', campaigns: 2, avgValue: 750000, owner: 'Jessica Moore' },
  { id: '7', name: 'Product Launch Beta Users', type: 'Static', criteria: 'Opted in for Beta Program', memberCount: 423, status: 'Inactive', lastUpdated: '2026-02-15', campaigns: 0, avgValue: 52000, owner: 'Jennifer Williams' },
  { id: '8', name: 'Cross-Sell Opportunities', type: 'Dynamic', criteria: 'Product A purchased, No Product B', memberCount: 289, status: 'Active', lastUpdated: '2026-03-24', campaigns: 3, avgValue: 68000, owner: 'Jessica Moore' },
];

export const mockCustomerJourneys: CustomerJourney[] = [
  { id: '1', name: 'New Customer Onboarding', status: 'Active', type: 'Automated', startTrigger: 'Account Created', steps: 7, activeCust: 156, completed: 1234, avgDuration: '14 days', conversionRate: 78, owner: 'Jennifer Williams' },
  { id: '2', name: 'Product Trial to Purchase', status: 'Active', type: 'Automated', startTrigger: 'Trial Started', steps: 5, activeCust: 289, completed: 892, avgDuration: '21 days', conversionRate: 42, owner: 'Jessica Moore' },
  { id: '3', name: 'Re-engagement Campaign', status: 'Active', type: 'Semi-Automated', startTrigger: 'No Activity 30 days', steps: 4, activeCust: 234, completed: 567, avgDuration: '10 days', conversionRate: 35, owner: 'Jennifer Williams' },
  { id: '4', name: 'Enterprise Sales Nurture', status: 'Active', type: 'Manual', startTrigger: 'Lead Qualification', steps: 9, activeCust: 67, completed: 234, avgDuration: '45 days', conversionRate: 65, owner: 'Jessica Moore' },
  { id: '5', name: 'Event Registration Follow-up', status: 'Paused', type: 'Automated', startTrigger: 'Event Registered', steps: 6, activeCust: 0, completed: 445, avgDuration: '7 days', conversionRate: 52, owner: 'Jennifer Williams' },
  { id: '6', name: 'Cross-Sell Journey', status: 'Active', type: 'Automated', startTrigger: 'Product A Purchased', steps: 5, activeCust: 178, completed: 723, avgDuration: '18 days', conversionRate: 28, owner: 'Jessica Moore' },
];

export const mockWorkOrders: WorkOrder[] = [
  { id: 'WO-001234', title: 'HVAC System Repair', customer: 'Acme Corporation', location: 'New York, NY', technician: 'John Smith', status: 'In Progress', priority: 'High', serviceType: 'Repair', scheduledDate: '2026-03-25', scheduledTime: '10:00 AM', estimatedDuration: '3 hours', actualStart: '10:15 AM' },
  { id: 'WO-001235', title: 'Preventive Maintenance - Elevators', customer: 'Downtown Plaza', location: 'Chicago, IL', technician: 'Sarah Johnson', status: 'Scheduled', priority: 'Medium', serviceType: 'Maintenance', scheduledDate: '2026-03-26', scheduledTime: '8:00 AM', estimatedDuration: '4 hours', actualStart: null },
  { id: 'WO-001236', title: 'Network Equipment Installation', customer: 'Tech Innovations LLC', location: 'San Francisco, CA', technician: 'Mike Davis', status: 'Completed', priority: 'Medium', serviceType: 'Installation', scheduledDate: '2026-03-24', scheduledTime: '2:00 PM', estimatedDuration: '2 hours', actualStart: '2:10 PM' },
  { id: 'WO-001237', title: 'Emergency - Power Outage', customer: 'Metro Hospital', location: 'Boston, MA', technician: 'Emily Wilson', status: 'In Progress', priority: 'Urgent', serviceType: 'Emergency', scheduledDate: '2026-03-25', scheduledTime: '9:00 AM', estimatedDuration: '6 hours', actualStart: '8:45 AM' },
  { id: 'WO-001238', title: 'Security System Upgrade', customer: 'Retail Solutions Inc', location: 'Los Angeles, CA', technician: 'David Brown', status: 'Scheduled', priority: 'Low', serviceType: 'Installation', scheduledDate: '2026-03-27', scheduledTime: '1:00 PM', estimatedDuration: '5 hours', actualStart: null },
  { id: 'WO-001239', title: 'Fire Alarm System Inspection', customer: 'Grand Hotel', location: 'Miami, FL', technician: 'Lisa Anderson', status: 'Scheduled', priority: 'High', serviceType: 'Inspection', scheduledDate: '2026-03-26', scheduledTime: '11:00 AM', estimatedDuration: '3 hours', actualStart: null },
  { id: 'WO-001240', title: 'Plumbing Repair - Leak', customer: 'Riverside Apartments', location: 'Seattle, WA', technician: 'Robert Taylor', status: 'Unscheduled', priority: 'High', serviceType: 'Repair', scheduledDate: null, scheduledTime: null, estimatedDuration: '2 hours', actualStart: null },
  { id: 'WO-001241', title: 'Electrical Panel Upgrade', customer: 'Manufacturing Pro', location: 'Detroit, MI', technician: 'James Martinez', status: 'In Progress', priority: 'Medium', serviceType: 'Installation', scheduledDate: '2026-03-25', scheduledTime: '12:00 PM', estimatedDuration: '4 hours', actualStart: '12:05 PM' },
];
