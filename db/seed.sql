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
    ('Chris', 'Traeger', 18, 1),
        ('Sir Benjamin', 'Wyatt', 18, 2),
        ('Ron', 'Swanson', 1, 3),
        ('Leslie', 'Knope', 2, NULL),
        ('Hugh', 'Trumple', 3, NULL),
        ('Al', 'Connor', 4, NULL),
        ('Joe', 'Fantringham', 5, NULL),
        ('Tammy', 'Swanson', 7, 2),
        ('Marlene', 'Griggs-Knope', 8, 2),
        ('Harold', 'Bauer', 9, 2),
        ('Ann', 'Perkins', 10, 2),
        ('April', 'Ludgate', 11, 2),
        ('Eugene', 'Burnout', 12, NULL),
        ('Harris', 'Burnout', 12, NULL),
        ('Brett', 'Burnout', 12, 11),
        ('Mark', 'Brendanawicz', 13, 2),
        ('Carl', 'Lorthner', 14, 2),
        ('Tom', 'Haverford', 15, 4),
        ('Sir Andrew Maxwell', 'Dwyer', 16, 2),
        ('Donna', 'Meagle', 19, 4),
        ('Gerald', 'Gergich', 20, 4),
        ('Garry', 'Gergich', 20, 4),
        ('Jerry', 'Gergich', 20, 4),
        ('Larry', 'Gergich', 20, 4),
        ('Lenny', 'Gergich', 20, 4),
        ('Terry', 'Gergich', 20, 4),
        ('Mailman', 'Gergich', 20, 4),
        ('Kyle', 'Client', 21, 4),
        ('Jeremy', 'Jamm', 22, 4),
        ('Douglass', 'Howser', 22, 4),
        ('Ethel', 'Beavers', 23, 2),
        ('Dawn', 'Krink', 24, 2),
        ('Len', 'Hugeff', 25, 5),
        ('Dewey', 'Burnout', 26, 7),
        ('George', 'Williams', 27, 9),
        ('David', 'Sanderson', 25, 5);
