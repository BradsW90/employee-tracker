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
}

module.exports = Store;
