-- Employee Info.
insert into employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', '1', '3');
insert into employee (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Chan', '2', '1');
insert into employee (first_name, last_name, role_id, manager_id) VALUES ('Ashley', 'Rodriguez', '3', null);
insert into employee (first_name, last_name, role_id, manager_id) VALUES ('Kevin', 'Tupik', '4', '3');
insert into employee (first_name, last_name, role_id, manager_id) VALUES ('Malia', 'Brown', '5', null);
insert into employee (first_name, last_name, role_id, manager_id) VALUES ('Sarah', 'Lourd', '6', null);
insert into employee (first_name, last_name, role_id, manager_id) VALUES ('Tom', 'Allen', '7', '6');

-- Role Info.
insert into role (title, salary, department_id) VALUES ('Sales Lead', '100000', '1');
insert into role (title, salary, department_id) VALUES ('Salesperson', '80000', '1');
insert into role (title, salary, department_id) VALUES ('Lead Engineer', '150000', '2');
insert into role (title, salary, department_id) VALUES ('Software Engineer', '120000', '2');
insert into role (title, salary, department_id) VALUES ('Accountant', '125000', '3');
insert into role (title, salary, department_id) VALUES ('Legal Team Lead', '250000', '4');
insert into role (title, salary, department_id) VALUES ('Lawyer', '190000', '4');

-- Dept Info.
insert into department (name) VALUES ('Sales');
insert into department (name) VALUES ('Engineering');
insert into department (name) VALUES ('Finance');
insert into department (name) VALUES ('Legal');
