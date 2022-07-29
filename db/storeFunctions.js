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

    const input = addOrDelete[1].department_id.charAt(0);
    // console.log(department);

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
    const employee = await addOrDelete[0]
      .execute(`SELECT t1.id, t1.first_name, t1.last_name, roles.salary, roles.title, CONCAT
    (t2.first_name,' ', 
    t2.last_name)
AS managers
FROM employees t1
INNER JOIN roles
ON t1.role_id = roles.id
LEFT JOIN employees t2
ON t2.id = t1.manager_id`);

    let roleIdInput = addOrDelete[1].role_id.split(" ");
    let roleIdCheck = roleIdInput.splice(1);

    if (roleIdCheck.length > 1) {
      roleIdCheck = roleIdCheck[0] + " " + roleIdCheck[1];
    } else {
      roleIdCheck = roleIdCheck.pop();
    }

    for (let c = 0; c < employee[0].length; c++) {
      //console.log(roleIdInput[1] + " " + employee[0][c].title);
      if (
        roleIdCheck === employee[0][c].title &&
        employee[0][c].managers != null
      ) {
        console.log(addOrDelete[1].first_name);
        console.log(addOrDelete[1].last_name);
        console.log(parseInt(roleIdInput[0]));
        console.log(employee[0][c].id);

        const insert = await addOrDelete[0].execute(
          `INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`,
          [
            addOrDelete[1].first_name,
            addOrDelete[1].last_name,
            parseInt(roleIdInput[0]),
            employee[0][c].id,
          ]
        );

        console.log("Employee added successfully!");
      }
    }
  }
} //end store class

module.exports = Store;
