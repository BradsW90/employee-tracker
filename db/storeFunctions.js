class Store {
  async start() {
    const mysql = require("mysql2/promise");

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "D@t@b@$3Acce$$",
      database: "store",
    });

    return connection;
  }

  async queryDepartment(connection) {
    //console.log("querydepartment");
    const [rows, fields] = await connection.execute(`SELECT * FROM department`);

    return rows;
  }

  async queryRoles(connection) {
    const [rows, fields] =
      await connection.execute(`SELECT roles.id, roles.title, roles.salary, department.name
    AS departments
    FROM roles
    INNER JOIN department
    ON roles.department_id = department.id`);

    return rows;
  }

  async queryEmployees(connection) {
    const [rows, fields] =
      await connection.execute(`SELECT t1.id, t1.first_name, t1.last_name, roles.salary, roles.title, t2.first_name
    AS managers
    FROM employees t1
    INNER JOIN roles
    ON t1.role_id = roles.id
    LEFT JOIN employees t2
    ON t1.id = t2.manager_id`);

    return rows;
  }
}

module.exports = Store;
