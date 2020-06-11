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
        "View Departments",
        "View Roles",
        "Update Employee",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Back to Main Menu"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmp();
          break;
        case "Update Employee":
          updateEmp();
          break;
        case "View Departments":
          viewDept();
          break;
        case "View Roles":
          viewRole();
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
        case "Back to Main Menu":
          start();
          break;
        }
      });
  }
  

function viewDept() {
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

// / function to view all departments.
function viewDept() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

   console.table(results);
   start();
})
}

// / function to view all roles.
function viewRole() {
  connection.query("SELECT * FROM role", (err, results) => {
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

  // function to update employee roles.
function updateEmp() {
    connection.query("SELECT * FROM employee", (err, results) => {
      inquirer
        .prompt([{
          name: "employee",
          type: "list",
          message: "Which employee would you like to update?",
          choices: () => {
            const empArray = [];
            for (let i = 0; i < results.length; i++) {
              empArray.push(`${results[i].first_name} ${results[i].last_name}`)
            }
            return empArray
          }
        }])
        .then(function (data) {
          let chosenEmployee;
          for (let i = 0; i < results.length; i++) {
            if (`${results[i].first_name} ${results[i].last_name}` === data.employee) {
              chosenEmployee = results[i]
            }
          }
          connection.query("SELECT * FROM role",
            (err, results) => {
              if (err) throw err;
  
              inquirer
                .prompt([{
                    name: "role",
                    type: "list",
                    message: "What is the employee's new role?",
                    choices: () => {
                      const roleArray = [];
                      for (let i = 0; i < results.length; i++) {
                        roleArray.push(results[i].title)
                      }
                      return roleArray
                    }
                  },
  
                ]).then(function (data) {
                  let chosenRole;
                  for (let i = 0; i < results.length; i++) {
                    if (results[i].title === data.role) {
                      chosenRole = results[i]
                    }
                  }
  
                  const query = connection.query("UPDATE employee SET ? WHERE ?",
                    [{
                        role_id: chosenRole.id
                      },
                      {
                        id: chosenEmployee.id
                      }
                    ], (err) => {
                      if (err) throw err;
                      console.log("------Employee Updated-------")
                      start()
                    })
                  })
                })
              })
            })
          }

  



