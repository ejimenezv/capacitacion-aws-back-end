import mysql from 'mysql2';

export let db = {
  state: {
    pool: null,
    mode: null,
  },
  
  connect: function() {
    this.state.pool = mysql.createPool({
      host: "localhost",
      port: "3306",
      user: "root", 
      password: "root",
      database: "aws",
      dateStrings: true,
      waitForConnections: true,
      connectionLimit: "2",
      queueLimit: "2"
    })
  
    this.state.mode = "production";
  },
  
  get: function() {
    return this.state.pool.promise();
  },
  
  end: function() {
    this.state.pool.end();
  }
};
