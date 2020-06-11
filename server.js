const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console-table");

// This is the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345",
  database: "tracker"
});

// Connection to the MySQL server and SQL database
connection.connect((err) => {
  if (err) throw err;
  // This runs the start function to start listing the questions.
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Roles",
        "EXIT"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmp();
          break;
        case "View All Employees by Department":
          viewBydept();
          break;
        case "View All Employees by Roles":
          viewByroles();
          break;
        case "Add Employee":
          addEmp();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRoles();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        }
      });
  }
  

function viewBydept() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
    .prompt([
      {
      name: "department",
      type: "list",
      message: "Which department?",
      choices: () => {
        const deptArray = [];
          for (let i = 0; i < results.length; i++) {
            deptArray.push(results[i].name)
          }
          return deptArray;
        },
      },
      ])
      .then(function (answer) {
        console.log(answer);
        var query = `SELECT * FROM employee JOIN (department, role) ON (role.department_id=department.id AND employee.role_id=role.id) WHERE ?`;
        connection.query(query, { "department.id": answer.department_id }, function (err, res) {
          if (err) throw err;
          console.table([
            {
              id: `${res[answer]}`,
              Department: `${res[answer]}`
            }
          ])
          })
          })
          start();
      });
    }
  //     .then(function (data){
  //       let chosenDept;
  //       for (let i = 0; i < results.length; i++) {
  //         if (results[i].name === data.name) {
  //           chosenDept = results[i];
  //   }
  //       const query = connection.query(
  //         `select * from employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id where department.name = ?`,
    
  //       (err, res) => {
  //       if (err) throw err;
  //       console.table(res);
  //       start();
  //     })
  // }
  // })


// function viewByroles() {
// }


// function updateRole() {
  
// }

// function to handle adding new employees.

function addEmp() {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
  
  inquirer
  .prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the employee's last name?"
    },
    {
      name: "role",
      type: "list",
      message: "What is the employee's role?",
      choices: () => {
        const roleArray = [];
        for (let i = 0; i < results.length; i++) {
          roleArray.push(results[i].title)
        }
        return roleArray;
      },
    },
  ])
  .then(function (data) {
    let clientRole;
    for (let i = 0; i < results.length; i++) {
      if (results[i].title === data.role) {
        clientRole = results[i]
      }
    }

    const query = connection.query(
      "INSERT INTO employee SET ?", {
        first_name: data.first_name,
        last_name: data.last_name,
        role_id: clientRole.id,
      },
      (err, res) => {
        if (err) throw err;
        console.log("------------Employee, "+ data.first_name + ", was successfully added!------------")
        start();
      })
  })
})
}

// / function to view all employees.
function viewEmp() {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;

   console.table(results);
   start();
})
}

// function to handle adding new roles.
function addRoles() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
  
  inquirer
  .prompt([
    {
      name: "title",
      type: "input",
      message: "What is the new role you want to add?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary? (No symbols or decimals)"
    },
    {
      name: "name",
      type: "list",
      message: "Which department is it in?",
      choices: () => {
        const deptArray = [];
          for (let i = 0; i < results.length; i++) {
            deptArray.push(results[i].name)
          }
          return deptArray;
        },
      },
  ])
  .then(function (data) {
    let newRole;
      for (let i = 0; i < results.length; i++) {
        if (results[i].department_name === data.department) {
          newRole = results[i]
        }
      }
    const query = connection.query(
      "INSERT INTO role SET ?", {
        title: data.title,
        salary: data.salary,
        department_id: newRole.id,
      },
      (err, res) => {
        if (err) throw err;
        console.log("--------The role of: "+ data.title+" was successfully added!---------")
        start();
      })
  })
})
}

// function to handle adding new departments.
function addDept() {
    inquirer
      .prompt([{
        name: "name",
        type: "input",
        message: "What is the name of the department?"
      }])
      .then(function (data) {
        const query = connection.query(
          "INSERT INTO department SET ?", {
           name: data.name
          },
          (err, res) => {
            if (err) throw err;
            console.log("-------------Department, " + data.name +", has been added!--------------")
            start();
          }
        )
      })
  }



