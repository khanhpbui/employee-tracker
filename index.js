const mysql = require("mysql2");
const inquirer = require("inquirer");
const db = require("./db/connection");
//const table = require("console.table");

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Empoyee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
        name: "toDo",
      },
    ])
    .then((res) => {
      switch (res.toDo) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Empoyee Role":
          updateEmployeeRole();
          break;
        case "View All Roles":
          viewAllRole();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartment();
          break;
        case "Add Department":
          addDepartment();
          break;
        default:
          console.log("Existing Application");
          process.exit();
      }
    })
    .catch((err) => console.log(err));
}

// To view all employees
function viewAllEmployees() {
  db.query("SELECT * FROM employee", (err, results) => {
    console.log("\n");
    console.table(results);
    init();
  });
}

// To add employee
function addEmployee() {
  // let roleChoices = [];
  // db.query("SELECT * FROM role", (err, results) => {
  //   console.log("\n");
  //   console.table(results);
  // });

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
      },
      {
        type: "input",
        message: "What is the employee's role ID?",
        name: "roleId",
      },
      {
        type: "input",
        message: "What is the employee's manager ID?",
        name: "managerId",
      },
    ])
    .then((res) => {
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${res.firstName}', '${res.lastName}', ${res.roleId}, ${res.managerId})`,
        (err, result) => {
          console.log("New employee has been added!");

          // did not log ???
          init();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's ID number?",
        name: "employeeId",
      },
      {
        type: "input",
        message: "What is the empoyee's new role ID?",
        name: "roleId",
      },
    ])
    .then((res) => {
      db.query(
        `UPDATE employee SET role_id = ${res.roleId} WHERE id = ${res.employeeId};`,
        (err, result) => {
          console.log("This employee's role has been updated");
        }
      );
    });
}


// this is set!!!!
function viewAllRole() {
  db.query(
    "SELECT r.title AS role_title, d.department_name AS department FROM role AS r LEFT JOIN department AS d ON r.department_id = d.id GROUP BY r.id;",
    (err, results) => {
      console.log("\n");
      console.table(results);
      init();
    }
  );
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of the role?",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "roleSalary",
      },
      {
        type: "input",
        message: "What is the department ID that does the role belong to?",
        name: "departmentId",
        // need code
      },
    ])
    .then((res) =>
      db.query(
        `INSERT INTO role (title, salary, department_id) VALUES ('${res.roleTitle}', ${res.roleSalary}, ${res.departmentId});`,
        (err, result) => {
          console.log("\n");
          console.table(result);
          init();
        }
      )
    );
}



// this is sett!!!
function viewAllDepartment() {
  db.query("SELECT * FROM department", (err, results) => {
    console.log("\n");
    console.table(results);
    init();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "departmentName",
      },
    ])

    // error with .then()???
    .then((res) =>
      db.query(
        `INSERT INTO department (department_name) VALUES ('${res.departmentName}')`,
        (err, result) => {
          console.log(`Added ${res.departmentName} to the database`);
          init();
        }
      )
    );
}

init();
