INSERT INTO department (name)
VALUES
('Sporting Goods'),
('Home Goods'),
('Automotive'),
('Groceries'),
('Checkout'),
('Hardware');

INSERT INTO roles (title, salary, department_id)
VALUES
('Cashier', 8.40, 5),
('Stocker', 8.00, 4),
('Mechanic', 12.00, 3),
('Paint Specialist', 8.50, 6),
('Home Specialist', 9.20, 2),
('Outdoor pro', 10, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Super', 'Mario', 3, 9),
('Donkey', 'Kong', 6, 12),
('Ichigo', 'Kurasaki', 2, 8),
('Mike', 'Jones', 1, 7),
('Son', 'Goku', 5, 11),
('Squid', 'Inkling', 4, 10),
('Shikamaru', 'Nara', 1, NULL),
('Aliec', 'Brown', 2, NULL),
('Johnny', 'Dert', 3, NULL),
('Amber', 'Pile', 4, NULL),
('Mickey', 'Mouse', 5, NULL),
('Donald', 'Duck', 6, NULL)