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
connection.connect((err) =>{
  if (err) throw err;
  // This runs the start function to start listing the questions.
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "addupRev",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "EXIT"
      ]
    })
    .then(function ({ task }) {
      switch (task) {
        case "View All Employees":
          viewEmp();
          break;
        case "View All Employees by Department":
          viewBydept();
          break;
        case "View All Employees by Manager":
          viewBymanager();
          break;
        case "Add Employee":
          addEmp();
          break;
        case "Remove Employee":
          removeEmp();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Update Employee Manager":
          updateRole();
          break;
        }
      });
  }
  

// function to handle adding new employees
function addEmp() {
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
      choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"
      ]
    },
    {
      name: "manager",
      type: "list",
      message: "Who is the employee's manager?",
      choices:["Ashley Rodriguez", "John Doe", "Sarah Lourd", "None"]
    },
  ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role: answer.role,
          manager: answer.manager
        },
        (err) => {
          if (err) throw err;
          console.log("Your new employee has been added!");
        //   restart the application
          start();
        }
      );
    });
}

function viewEmp() {
  console.log("Viewing Employees\n");

  var query =
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON employee.role_id = r.id
  LEFT JOIN department d
  ON department.id = r.department_id
  LEFT JOIN employee m
	ON manager.id = e.manager_id`

  connection.query(query, function (err, res) {
    if (err) throw err;


    console.table(result);
    console.log("Employees viewed!\n");

    start();
  });
}

// function updateEmp() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", (err, results) => {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "list",
//           choices: () => {
//             const choiceArray = [];
//             for (let i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then((answer) => {
//         // get the information of the chosen item
//         let chosenItem;
//         for (let i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             (error) => {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
