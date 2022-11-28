const mysql = require("mysql2");
const inquirer = require("inquirer");
const db = require("./db/connection");

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

function viewAllEmployees() {
  db.query(
    "SELECT e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, e.manager_id FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id LEFT JOIN employee manager ON e.manager_id = e.id GROUP BY e.id;",
    (err, results) => {
      console.log("\n");
      console.table(results);
      init();
    }
  );
}

function addEmployee() {
  let roleChoices = [];
  db.query("SELECT * FROM role", (err, results) => {
    roleChoices.push(results);
    let roleArry = [];
    for (let i = 0; i < roleChoices[0].length; i++) {
      let roleObj = {
        name: roleChoices[0][i].title,
        value: roleChoices[0][i].id,
      };
      roleArry.push(roleObj);
    }

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
          type: "list",
          message: "What is the employee's role?",
          name: "role",
          choices: roleArry,
        },
        {
          type: "input",
          message: "What is the employee's manager ID?",
          name: "managerId",
        },
      ])

      .then((res) => {
        return new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${res.firstName}', '${res.lastName}', ${res.role}, ${res.managerId})`,
            (err, element) => {
              if (err) {
                return reject(err);
              }
              console.log("New employee has been added to the database");
              init();
            }
          );
        });
      });
  });
}

function updateEmployeeRole() {
  let roleChoices = [];
  db.query("SELECT * FROM role", (err, results) => {
    roleChoices.push(results);
    let roleArry = [];
    for (let i = 0; i < roleChoices[0].length; i++) {
      let roleObj = {
        name: roleChoices[0][i].title,
        value: roleChoices[0][i].id,
      };
      roleArry.push(roleObj);
    }
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
          name: "role",
          choices: roleArry,
        },
      ])
      .then((res) => {
        return new Promise((resolve, reject) => {
          db.query(
            `UPDATE employee SET role_id = ${res.role} WHERE id = ${res.employeeId};`,
            (err, element) => {
              if (err) {
                return reject(err);
              }
              console.log("Employee's role has been updated in the database");
              init();
            }
          );
        });
      });
  });
}

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
      },
    ])
    .then((res) => {
      return new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES ('${res.roleTitle}', ${res.roleSalary}, ${res.departmentId});`,
          (err, element) => {
            if (err) {
              return reject(err);
            }
            console.log(`Added ${res.roleTitle} to the database`);
            init();
          }
        );
      });
    });
}

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

    .then((res) => {
      return new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO department (department_name) VALUES ('${res.departmentName}')`,
          (err, element) => {
            if (err) {
              return reject(err);
            }
            console.log(`Added ${res.departmentName} to the database`);
            init();
          }
        );
      });
    });
}

init();
