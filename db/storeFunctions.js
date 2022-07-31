class Store {
  async start(addOrDelete) {
    // console.log("start", this);
    const mysql = require("mysql2/promise");

    //creates db connection instance
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "D@t@b@$3Acce$$",
      database: "store",
    });

    const array = [connection, addOrDelete];

    //return cunnection and secondary pass in arguement
    return array;
  } // end of start method

  async queryDepartment() {
    // console.log("querydepartment", this);
    //creates variable containing db query results
    const results = await this.start().then((connection) => {
      const rows = connection[0].execute(`SELECT * FROM department`);
      return rows;
    });

    //returning rows data
    return results[0];
  } //end of queryDepartment method

  async queryRoles() {
    // console.log("queryroles", this);
    //creates variable containing db query results
    const results = await this.start().then((connection) => {
      const rows = connection[0]
        .execute(`SELECT roles.id, roles.title, roles.salary, department.name
    AS departments
    FROM roles
    INNER JOIN department
    ON roles.department_id = department.id`);

      return rows;
    });

    //returning rows data
    return results[0];
  } //end of queryRoles method

  async queryEmployees() {
    //console.log("queryemployees", this);
    //creates variable containing db query results
    const results = await this.start().then((connection) => {
      const rows = connection[0]
        .execute(`SELECT t1.id, t1.first_name, t1.last_name, roles.salary, roles.title, CONCAT
        (t2.first_name,' ', 
        t2.last_name)
    AS managers
    FROM employees t1
    INNER JOIN roles
    ON t1.role_id = roles.id
    LEFT JOIN employees t2
    ON t2.id = t1.manager_id`);

      return rows;
    });

    //returns rows data
    return results[0];
  } //end of queryEmployees method

  async addDepartment(addOrDelete) {
    // console.log("adddepartment", this);
    const insert = addOrDelete[0].execute(
      `INSERT INTO department (name)
    VALUES (?)`,
      [addOrDelete[1].name]
    );
    console.log("Department added Successfully!");
  } //end of addDepartment method

  async addRole(addOrDelete) {
    // console.log("addRole", this);
    const department = await addOrDelete[0].execute(`SELECT * FROM department`);

    //grabs department id out of string
    const input = addOrDelete[1].department_id.charAt(0);
    //console.log(addOrDelete[1]);

    //used to get appropriate index of department for role creation
    for (let a = 0; a < department.length; a++) {
      if (department[0][a].id === parseInt(input)) {
        const insert = addOrDelete[0].execute(
          `INSERT INTO roles (title, salary, department_id)
      VALUES (?,?,?)`,
          [
            addOrDelete[1].title,
            parseFloat(addOrDelete[1].salary),
            department[0][a].id,
          ]
        );
        console.log("Role added successfully!");
      }

      return;
    }
  } //end addRole Method

  async addEmployee(addOrDelete) {
    // console.log("addEmployee", this);
    //makes variable containing needed employee table data
    const employee = await addOrDelete[0]
      .execute(`SELECT t1.id, CONCAT(t1.first_name, ' ', t1.last_name) AS name, roles.salary, roles.title, CONCAT
    (t2.first_name,' ', 
    t2.last_name)
AS managers
FROM employees t1
INNER JOIN roles
ON t1.role_id = roles.id
LEFT JOIN employees t2
ON t2.id = t1.manager_id`);

    //makes variable with needed role table data
    const role = await addOrDelete[0].execute(`SELECT id, title FROM roles`);

    //console.log(employee[0]);

    //used to get appropriate indexes of arrays for employee creation
    for (let c = 0; c < employee[0].length; c++) {
      for (let f = 0; f < role[0].length; f++) {
        if (
          addOrDelete[1].manager_id === employee[0][c].name &&
          addOrDelete[1].role_id === role[0][f].title
        ) {
          const insert = await addOrDelete[0].execute(
            `INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?)`,
            [
              addOrDelete[1].first_name,
              addOrDelete[1].last_name,
              role[0][f].id,
              employee[0][c].id,
            ]
          );

          console.log(
            addOrDelete[1].first_name +
              " " +
              addOrDelete[1].last_name +
              " added to the database!"
          );
          return;
        }
      }
    }
  } //end add employee method

  //function used to get queries for the add employee menu
  async addEmployeeQuery(connection) {
    //main array to return
    let list = [];

    //gets title column from roles table
    let [rRows, rFields] = await connection[0].execute(
      `SELECT (title) AS name FROM roles`
    );
    //pushes to main array
    list.push(rRows);
    //gets first and last names from employees table
    let [eRows, eFields] = await connection[0].execute(
      `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employees`
    );
    //pushes to main array
    list.push(eRows);

    return list;
  }

  async updateEmployee(updateBody) {
    //gets roles table data
    const resultRoles = await updateBody[0].execute(`SELECT * FROM roles`);
    //gets employees table data
    const resultEmployees = await updateBody[0].execute(
      `SELECT * FROM employees`
    );

    //splits employee name into different variables
    const [first_name, last_name] = updateBody[1].updateEmployee.split(" ");

    //gets approprite indexes of arrays for employee update
    for (let l = 0; l < resultRoles[0].length; l++) {
      for (let m = 0; m < resultEmployees[0].length; m++) {
        if (
          updateBody[1].newRole === resultRoles[0][l].title &&
          resultEmployees[0][m].first_name === first_name &&
          resultEmployees[0][m].last_name === last_name
        ) {
          const employeeUpdate = updateBody[0].execute(
            `UPDATE employees
          SET role_id = ?
          WHERE id = ?`,
            [resultRoles[0][l].id, resultEmployees[0][m].id]
          );

          console.log(first_name + " " + last_name + " updated successfully");
        }
      }
    }
  }
} //end store class

module.exports = Store;
