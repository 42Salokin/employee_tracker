-- Connect to the database
\c employees

INSERT INTO department
    (name)
VALUES
  ('Shire'),
       ('Gondor'),
       ('Mirkwood'),
       ('Erebor'),
       ('Valinor');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Hobbit', 38000, 1),
        ('Human', 64000, 2),
        ('Elf', 2931000, 3),
        ('Istari', 2018000, 5),
        ('Dwarf', 139000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Gandalf', 'Grey', 5, 1),
        ('Aragorn', 'Arathornson', 2, 2),
        ('Frodo', 'Baggins', 1, 3),
        ('Boromir', 'Denethorson', 2, 2),        
        ('Samwise', 'Gamgee', 1, 3),
        ('Meriadoc', 'Brandybuck', 1, 3),
        ('Peregrin', 'Took', 1, 3),
        ('Legolas', 'Greenleaf', 3, 2),
        ('Gimli', 'Gloinson', 5, 2);
        
