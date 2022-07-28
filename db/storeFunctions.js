class Store {
  async start(addOrDelete) {
    const mysql = require("mysql2/promise");

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "D@t@b@$3Acce$$",
      database: "store",
    });

    const array = [connection, addOrDelete];

    return array;
  }

  async queryDepartment() {
    //console.log("querydepartment");
    const results = await this.start().then((connection) => {
      const rows = connection[0].execute(`SELECT * FROM department`);
      return rows;
    });

    return results[0];
  }

  async queryRoles() {
    const results = await this.start().then((connection) => {
      const rows = connection[0]
        .execute(`SELECT roles.id, roles.title, roles.salary, department.name
    AS departments
    FROM roles
    INNER JOIN department
    ON roles.department_id = department.id`);

      return rows;
    });

    return results[0];
  }

  async queryEmployees() {
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

    return results[0];
  }

  async addDepartment(addOrDelete) {
    const results = await this.start();
  }

  async addRole(addOrDelete) {
    const department = await this.start().then(this.queryDepartment);

    for (a = 0; a < department.length; a++) {
      if (addOrDelete.department === department[a].name) {
        const addRoleData = await this.start().then((connection) => {
          const insert = connection[0].execute(
            `INSERT INTO roles (title, salary, department_id)
        VALUES (?,?,?)`,
            [addOrDelete.title, addOrDelete.salary, department[a].id]
          );

          return insert;
        });

        return addRoleData;
      }
    }
  }
}

module.exports = Store;
