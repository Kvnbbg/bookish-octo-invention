// db.js (Amazon Web Services-based database connection)
import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'your_db_host', 
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'your_db_name'
});

// Usage of db (Amazon Web Services-based database connection)
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return; 
  }
  console.log('Connected to the database!');
});

export default db;