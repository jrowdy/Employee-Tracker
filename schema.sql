drop database if exists tracker;

create database tracker;

use tracker;

create TABLE employee (
  id int AUTO_INCREMENT,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY (id)
);

create TABLE role (
  id int AUTO_INCREMENT,
  title varchar(30) NOT NULL,
  salary decimal,
  department_id INTEGER,
  PRIMARY KEY (id)
);

create TABLE department (
  id int AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY (id)
);