INSERT INTO
    department (department_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Operation Management');

INSERT INTO
    role (title, salary, department_id)
VALUES
    ('CEO', 300000, 5),
    ('Sales Lead', 100000, 1),
    ('Lead Engineer', 150000, 2),
    ('Salesperson', 80000, 1),
    ('Accountant', 90000, 3),
    ('Lawyer', 190000, 4);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, null),
    ('Ashley', 'Rodriguez', 2, 1),
    ('Jane', 'Smith', 3, 1),
    ('Mike', 'Lee', 4, 2),
    ('David', 'Collin', 5, 1),
    ('Nick', 'Sparks', 6, 1);

-- SELECT e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(e.first_name, ' ', e.last_name) AS manager FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id LEFT JOIN employee manager ON e.manager_id = e.id GROUP BY e.id;