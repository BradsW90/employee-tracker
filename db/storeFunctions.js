class Store {
  async start(addOrDelete) {
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
    //creates variable containing db query results
    const results = await this.start().then((connection) => {
      const rows = connection[0].execute(`SELECT * FROM department`);
      return rows;
    });

    //returning rows data
    return results[0];
  } //end of queryDepartment method

  async queryRoles() {
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
    //creates variable containing db query results
    const results = await this.start().then((connection) => {
      const rows = connection[0]
        .execute(`SELECT t1.id, t1.first_name, t1.last_name, roles.salary, roles.title, t2.first_name
    AS managers
    FROM employees t1
    INNER JOIN roles
    ON t1.role_id = roles.id
    LEFT JOIN employees t2
    ON t1.id = t2.manager_id`);

      return rows;
    });

    //returns rows data
    return results[0];
  } //end of queryEmployees method

  async addDepartment(addOrDelete) {
    this.start().then((connection) => {
      const insert = connection[0].execute(
        `INSERT INTO department (name)
      VALUES (?)`,
        [addOrDelete.name]
      );
      console.log("Department added Successfully!");
    });
    return;
  } //end of addDepartment method

  async addRole(addOrDelete) {
    const department = await this.start().then(this.queryDepartment);

    for (a = 0; a < department.length; a++) {
      if (addOrDelete.department === department[a].name) {
        this.start().then((connection) => {
          const insert = connection[0].execute(
            `INSERT INTO roles (title, salary, department_id)
        VALUES (?,?,?)`,
            [addOrDelete.title, addOrDelete.salary, department[a].id]
          );

          return insert;
        });

        return;
      }
    }
  } //end addRole Method
} //end store class

module.exports = Store;
