require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL // Add this line to restrict CORS to your frontend
}));

app.use(bodyParser.json());

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,cld,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect(async (err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL', err);
  } else {
    console.log('PostgreSQL connected...');
    await createTables();
    createDefaultUser();
  }
});

const createTables = async () => {
  const createFormsTable = `
    CREATE TABLE IF NOT EXISTS raseed (
      id SERIAL PRIMARY KEY,
      receipt_no SERIAL,
      name VARCHAR(255),
      address VARCHAR(255),
      category VARCHAR(255),
      amountNumeric DOUBLE PRECISION,
      amountWords VARCHAR(255),
      mobileno VARCHAR(20),
      notes TEXT,
      date DATE
    );
  `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  const createFixedDepositsTable = `
    CREATE TABLE IF NOT EXISTS fixed_deposit (
      id SERIAL PRIMARY KEY,
      bankName VARCHAR(255) NOT NULL,
      accountNumber VARCHAR(255) NOT NULL,
      fdrNumber VARCHAR(255) NOT NULL,
      depositAmount DECIMAL(10, 2) NOT NULL,
      date DATE
    );
  `;

  const createAmarNidhiTable = `
    CREATE TABLE IF NOT EXISTS amar_nidhis (
      id SERIAL PRIMARY KEY,
      receipt_no SERIAL,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      amountNumeric DECIMAL(10, 2) NOT NULL DEFAULT 1100,
      amountWords VARCHAR(255) NOT NULL DEFAULT 'One Thousand One Hundred Only',
      mobileno VARCHAR(20),
      notes TEXT,
      date DATE
    );
  `;

  const createExpenseFormsTable = `
    CREATE TABLE IF NOT EXISTS expense_form (
      id SERIAL PRIMARY KEY,
      receipt_no SERIAL,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      amountNumeric DECIMAL(10, 2) NOT NULL,
      amountWords VARCHAR(255) NOT NULL,
      mobileno VARCHAR(20),
      notes TEXT,
      tips TEXT,
      date DATE NOT NULL
    );
  `;

  const createUdhaarTable = `
   CREATE TABLE IF NOT EXISTS udhaar (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      amountNumeric DECIMAL(10, 2) NOT NULL,
      amountWords VARCHAR(255) NOT NULL,
      mobileno VARCHAR(20),
      notes TEXT,
      date DATE NOT NULL
    );
  `;

  try {
    await pool.query(createFormsTable);
    await pool.query(createUsersTable);
    await pool.query(createFixedDepositsTable);
    await pool.query(createAmarNidhiTable);
    await pool.query(createExpenseFormsTable);
    await pool.query(createUdhaarTable);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables', err);
  }
};


// FOR USER AUTHENTICATION AND REGISTRATION
// Create default user if not exists
const createDefaultUser = () => {
  const username = process.env.DEFAULT_USER;
  const password = process.env.DEFAULT_PASSWORD;
  const sqlCheckUser = 'SELECT * FROM users WHERE username = $1';

  pool.query(sqlCheckUser, [username], (err, result) => {
    if (err) {
      console.error('Error checking default user:', err);
      return;
    }

    if (result.rows.length === 0) {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return;
        }

        const sqlInsertUser = 'INSERT INTO users (username, password) VALUES ($1, $2)';
        pool.query(sqlInsertUser, [username, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error creating default user:', err);
            return;
          }
          console.log('Default user created successfully');
        });
      });
    }
  });
};

// Authentication endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const sqlCheckUser = 'SELECT * FROM users WHERE username = $1';
  pool.query(sqlCheckUser, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Middleware for verifying JWT tokens
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Protected route
app.get('/api/admin-dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Access granted to Admin Dashboard' });
});

// For CRUD OPERATIONS
// Endpoint to handle form submission for ExpenseRaseed

// Endpoint to fetch the latest ID
app.get('/api/expense/latestId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT MAX(receipt_no) as latestId FROM expense_form'); // replace `forms` with your actual table name
    const latestId = rows[0].latestid || 0; // Get the latest ID or default to 0 if none found
    res.json({ latestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/submit-expense', async (req, res) => {
  const { name, address, category, amountNumeric, amountWords, mobileno, notes, tips, date } = req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Get the highest current receipt_no
    const result = await pool.query('SELECT COALESCE(MAX(receipt_no), 0) AS max_receipt_no FROM expense_form');
    const maxReceiptNo = result.rows[0].max_receipt_no;

    // Insert new record with the next sequential receipt_no
    const insertSql = `
      INSERT INTO expense_form (receipt_no, name, address, category, amountNumeric, amountWords, mobileno, notes, tips, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    await pool.query(insertSql, [maxReceiptNo + 1, name, address, category, amountNumeric, amountWords, mobileno, notes, tips, date]);

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (err) {
    // Rollback the transaction in case of an error
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/expense/filter', (req, res) => {
  const { category, date, month, year, offset = 0, limit = 50 } = req.query;

  let sql = 'SELECT * FROM expense_form WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }
  if (date) {
    params.push(date);
    sql += ` AND DATE(date) = $${params.length}`;
  }
  if (month) {
    params.push(month);
    sql += ` AND EXTRACT(MONTH FROM date) = $${params.length}`;
  }
  if (year) {
    params.push(year);
    sql += ` AND EXTRACT(YEAR FROM date) = $${params.length}`;
  }

  params.push(limit);
  params.push(offset);
  sql += ` ORDER BY date DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  pool.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results.rows);
  });
});

// Endpoint to fetch form records by month or year
app.get('/api/expense/balance', async (req, res) => {
  const { year, month } = req.query;

  try {
    let sql = 'SELECT *, TO_CHAR(date, \'YYYY-MM-DD\') AS formatted_date FROM expense_form WHERE EXTRACT(YEAR FROM date) = $1';
    let values = [year];

    if (month) {
      sql += ' AND EXTRACT(MONTH FROM date) = $2';
      values.push(month);
    }

    const { rows: records } = await pool.query(sql, values);

    // Calculate total amount
    let totalAmountSql = 'SELECT SUM(amountNumeric) AS totalAmount FROM expense_form WHERE EXTRACT(YEAR FROM date) = $1';
    if (month) {
      totalAmountSql += ' AND EXTRACT(MONTH FROM date) = $2';
    }

    const { rows: totalAmountResult } = await pool.query(totalAmountSql, values);
    const totalAmount = totalAmountResult[0].totalamount || 0;

    res.json({ records, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/expense/totalAmount', async (req, res) => {
  const { category, date, month, year } = req.query;

  let query = 'SELECT SUM(amountNumeric) as totalAmount FROM expense_form WHERE 1=1'; // replace `your_table_name` with your actual table name
  let queryParams = [];

  if (category) {
    queryParams.push(category);
    query += ` AND category = $${queryParams.length}`;
  }

  if (date) {
    queryParams.push(date);
    query += ` AND DATE(date) = $${queryParams.length}`;
  }

  if (month) {
    queryParams.push(month);
    query += ` AND EXTRACT(MONTH FROM date) = $${queryParams.length}`;
  }

  if (year) {
    queryParams.push(year);
    query += ` AND EXTRACT(YEAR FROM date) = $${queryParams.length}`;
  }

  try {
    const { rows } = await pool.query(query, queryParams);
    const totalAmount = rows[0].totalamount || 0;
    res.json({ totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch the latest ID
app.get('/api/forms/latestId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT MAX(receipt_no) as latestId FROM raseed'); // replace `forms` with your actual table name
    const latestId = rows[0].latestid || 0; // Get the latest ID or default to 0 if none found
    res.json({ latestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/submit-form', async (req, res) => {
  const { name, address, category, amountNumeric, amountWords, mobileno, notes, date } = req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Get the highest current receipt_no
    const result = await pool.query('SELECT COALESCE(MAX(receipt_no), 0) AS max_receipt_no FROM raseed');
    const maxReceiptNo = result.rows[0].max_receipt_no;

    // Insert new record with the next sequential receipt_no
    const insertSql = `
      INSERT INTO raseed (receipt_no, name, address, category, amountNumeric, amountWords, mobileno, notes, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await pool.query(insertSql, [maxReceiptNo + 1, name, address, category, amountNumeric, amountWords, mobileno, notes, date]);

    // Commit the transaction
    await pool.query('COMMIT');
    
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (err) {
    // Rollback the transaction in case of an error
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/forms', (req, res) => {
  const sql = 'SELECT * FROM raseed';
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log(results.rows);
    res.send(results.rows);
  });
});

app.get('/api/forms/filter', (req, res) => {
  const { category, date, month, year, offset = 0, limit = 50 } = req.query;

  let sql = 'SELECT * FROM raseed WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }
  if (date) {
    params.push(date);
    sql += ` AND DATE(date) = $${params.length}`;
  }
  if (month) {
    params.push(month);
    sql += ` AND EXTRACT(MONTH FROM date) = $${params.length}`;
  }
  if (year) {
    params.push(year);
    sql += ` AND EXTRACT(YEAR FROM date) = $${params.length}`;
  }

  params.push(limit);
  params.push(offset);
  sql += ` ORDER BY date DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  pool.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results.rows);
  });
});

app.get('/api/forms/totalAmount', async (req, res) => {
  const { category, date, month, year } = req.query;

  let query = 'SELECT SUM(amountNumeric) as totalAmount FROM raseed WHERE 1=1'; // replace `your_table_name` with your actual table name
  let queryParams = [];

  if (category) {
    queryParams.push(category);
    query += ` AND category = $${queryParams.length}`;
  }

  if (date) {
    queryParams.push(date);
    query += ` AND DATE(date) = $${queryParams.length}`;
  }

  if (month) {
    queryParams.push(month);
    query += ` AND EXTRACT(MONTH FROM date) = $${queryParams.length}`;
  }

  if (year) {
    queryParams.push(year);
    query += ` AND EXTRACT(YEAR FROM date) = $${queryParams.length}`;
  }

  try {
    const { rows } = await pool.query(query, queryParams);
    const totalAmount = rows[0].totalamount || 0;
    res.json({ totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/forms/balance', async (req, res) => {
  const { year, month } = req.query;

  try {
    let sql = 'SELECT *, TO_CHAR(date, \'YYYY-MM-DD\') AS formatted_date FROM raseed WHERE EXTRACT(YEAR FROM date) = $1';
    let values = [year];

    if (month) {
      sql += ' AND EXTRACT(MONTH FROM date) = $2';
      values.push(month);
    }

    const { rows: records } = await pool.query(sql, values);

    // Calculate total amount
    let totalAmountSql = 'SELECT SUM(amountNumeric) AS totalAmount FROM raseed WHERE EXTRACT(YEAR FROM date) = $1';
    if (month) {
      totalAmountSql += ' AND EXTRACT(MONTH FROM date) = $2';
    }

    const { rows: totalAmountResult } = await pool.query(totalAmountSql, values);
    const totalAmount = totalAmountResult[0].totalamount || 0;

    res.json({ records, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to fetch the latest ID
app.get('/api/amarNidhi/latestId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT MAX(receipt_no) as latestId FROM amar_nidhis'); // replace `forms` with your actual table name
    const latestId = rows[0].latestid || 0; // Get the latest ID or default to 0 if none found
    res.json({ latestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/amarNidhi', async (req, res) => {
  const { name, address, amountNumeric, amountWords, mobileno, notes, date } = req.body; // Include 'date' from the request body

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Get the highest current receipt_no
    const result = await pool.query('SELECT COALESCE(MAX(receipt_no), 0) AS max_receipt_no FROM amar_nidhis');
    const maxReceiptNo = result.rows[0].max_receipt_no;

    // Insert new record with the next sequential receipt_no and user-provided date
    const insertSql = `
      INSERT INTO amar_nidhis (receipt_no, name, address, amountNumeric, amountWords, mobileno, notes, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await pool.query(insertSql, [maxReceiptNo + 1, name, address, amountNumeric, amountWords, mobileno, notes, date]);

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (err) {
    // Rollback the transaction in case of an error
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/amarNidhiReceipt', (req, res) => {
  const sql = 'SELECT SUM(amountNumeric) AS totalAmount FROM amar_nidhis WHERE date > NOW() - INTERVAL \'1 YEAR\'';
  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ totalAmount: result.rows[0].totalamount });
  });
});

// Endpoint to fetch form records by month or year
app.get('/api/amarnidhi/balance', async (req, res) => {
  const { year, month } = req.query;

  try {
    let sql = 'SELECT *, TO_CHAR(date, \'YYYY-MM-DD\') AS formatted_date FROM amar_nidhis WHERE EXTRACT(YEAR FROM date) = $1';
    let values = [year];

    if (month) {
      sql += ' AND EXTRACT(MONTH FROM date) = $2';
      values.push(month);
    }

    const { rows: records } = await pool.query(sql, values);

    // Calculate total amount
    let totalAmountSql = 'SELECT SUM(amountNumeric) AS totalAmount FROM amar_nidhis WHERE EXTRACT(YEAR FROM date) = $1';
    if (month) {
      totalAmountSql += ' AND EXTRACT(MONTH FROM date) = $2';
    }

    const { rows: totalAmountResult } = await pool.query(totalAmountSql, values);
    const totalAmount = totalAmountResult[0].totalamount || 0;

    res.json({ records, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fixed Deposit routes
app.post('/api/fixedDeposit', (req, res) => {
  const { bankName, accountNumber, fdrNumber, date, amount } = req.body;
  const sql = 'INSERT INTO fixed_deposit (bankName, accountNumber, fdrNumber, date, depositAmount) VALUES ($1, $2, $3, $4, $5)';
  pool.query(sql, [bankName, accountNumber, fdrNumber, date, amount], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ id: result.insertId });
  });
});

app.get('/api/total', (req, res) => {
  const sql = 'SELECT SUM(depositAmount) AS totalAmount FROM fixed_deposit';
  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ totalAmount: result.rows[0].totalamount });
  });
});

// Endpoint to fetch all fixed deposit records
app.get('/api/fixedDeposits', (req, res) => {
  const sql = 'SELECT * FROM fixed_deposit';
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results.rows);
  });
});

app.get('/api/amarNidhiRecords', (req, res) => {
  const sql = 'SELECT * FROM amar_nidhis';
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results.rows);
  });
});

app.get('/api/amarNidhiReceipt/custom_date', (req, res) => {
  const { fromDate, toDate, month, year } = req.query;
  let sql = 'SELECT SUM(amountNumeric) AS totalAmount FROM amar_nidhis WHERE 1=1';
  const params = [];

  if (fromDate) {
    params.push(fromDate);
    sql += ` AND date >= $${params.length}`;
  }
  if (toDate) {
    params.push(toDate);
    sql += ` AND date <= $${params.length}`;
  }
  if (month) {
    params.push(month);
    sql += ` AND EXTRACT(MONTH FROM date) = $${params.length}`;
  }
  if (year) {
    params.push(year);
    sql += ` AND EXTRACT(YEAR FROM date) = $${params.length}`;
  }

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL:', err);
      return res.status(500).send(err);
    }
    res.send({ totalAmount: result.rows[0].totalamount });
  });
});

app.get('/api/amarNidhiRecords/custom_date', (req, res) => {
  const { fromDate, toDate, month, year, limit = 50, offset = 0 } = req.query;
  let sql = 'SELECT * FROM amar_nidhis WHERE 1=1';
  const params = [];

  if (fromDate) {
    params.push(fromDate);
    sql += ` AND date >= $${params.length}`;
  }
  if (toDate) {
    params.push(toDate);
    sql += ` AND date <= $${params.length}`;
  }
  if (month) {
    params.push(month);
    sql += ` AND EXTRACT(MONTH FROM date) = $${params.length}`;
  }
  if (year) {
    params.push(year);
    sql += ` AND EXTRACT(YEAR FROM date) = $${params.length}`;
  }

  params.push(limit);
  params.push(offset);
  sql += ` ORDER BY date DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  pool.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error executing SQL:', err);
      return res.status(500).send(err);
    }
    res.send(results.rows);
  });
});

app.post('/submit-udhaar', (req, res) => {
  const { name, address, amountNumeric, amountWords, date, notes, mobileno } = req.body;
  const sql = 'INSERT INTO udhaar (name, address, amountNumeric, amountWords, date, notes, mobileno) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  pool.query(sql, [name, address, amountNumeric, amountWords, date, notes, mobileno], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Udhaar form submitted successfully' });
  });
});

app.get('/api/udhaar/filter', (req, res) => {
  const { date, month, year, offset = 0, limit = 50 } = req.query;

  let sql = 'SELECT * FROM udhaar WHERE 1=1';
  const params = [];

  if (date) {
    params.push(date);
    sql += ` AND DATE(date) = $${params.length}`;
  }
  if (month) {
    params.push(month);
    sql += ` AND EXTRACT(MONTH FROM date) = $${params.length}`;
  }
  if (year) {
    params.push(year);
    sql += ` AND EXTRACT(YEAR FROM date) = $${params.length}`;
  }

  params.push(limit);
  params.push(offset);
  sql += ` ORDER BY date DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  pool.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results.rows);
  });
});

app.delete('/api/forms/deleteBulk', async (req, res) => {
  const { ids } = req.body;

  try {
    // Bulk delete
    const deleteQuery = 'DELETE FROM raseed WHERE id = ANY($1)';
    await pool.query(deleteQuery, [ids]);

    // Resequence receipt_no after deletion
    const resequenceQuery = `
      WITH OrderedReceipts AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS new_receipt_no
        FROM raseed
      )
      UPDATE raseed
      SET receipt_no = OrderedReceipts.new_receipt_no
      FROM OrderedReceipts
      WHERE raseed.id = OrderedReceipts.id;
    `;
    await pool.query(resequenceQuery);

    res.status(200).json({ message: 'Forms deleted and receipt numbers resequenced successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/forms/get-receipt-nos', async (req, res) => {
  const { ids } = req.body;

  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No record IDs provided' });
  }

  try {
    // Query to fetch the records based on the provided IDs
    const query = `
      SELECT receipt_no, name, address, category, amountnumeric, amountwords, mobileno, notes, date 
      FROM raseed
      WHERE id = ANY($1)
    `;
    const { rows } = await pool.query(query, [ids]);

    // Return the records with receipt_no
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/amarnidhis/deleteBulk', async (req, res) => {
  const { ids } = req.body; // Make sure this is an array of integers
  
  try {
    // Ensure all ids are integers
    const parsedIds = ids.map((id) => parseInt(id)).filter(Number.isInteger);
    
    if (parsedIds.length === 0) {
      return res.status(400).json({ error: 'No valid IDs provided for deletion.' });
    }
    
    // Bulk delete using valid IDs
    const deleteQuery = 'DELETE FROM amar_nidhis WHERE id = ANY($1)';
    await pool.query(deleteQuery, [parsedIds]);

    // Resequence receipt_no after deletion
    const resequenceQuery = `
      WITH OrderedReceipts AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS new_receipt_no
        FROM amar_nidhis
      )
      UPDATE amar_nidhis
      SET receipt_no = OrderedReceipts.new_receipt_no
      FROM OrderedReceipts
      WHERE amar_nidhis.id = OrderedReceipts.id;
    `;
    await pool.query(resequenceQuery);

    res.status(200).json({ message: 'Forms deleted and receipt numbers resequenced successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/amarnidhis/get-receipt-nos', async (req, res) => {
  const { ids } = req.body;

  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No record IDs provided' });
  }

  try {
    // Query to fetch the records based on the provided IDs
    const query = `
      SELECT receipt_no, name, address, amountnumeric, amountwords, mobileno, notes, date 
      FROM amar_nidhis
      WHERE id = ANY($1)
    `;
    const { rows } = await pool.query(query, [ids]);

    // Return the records with receipt_no
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/api/expense/deleteBulk', async (req, res) => {
  const { ids } = req.body;

  try {
    // Bulk delete
    const deleteQuery = 'DELETE FROM expense_form WHERE id = ANY($1)';
    await pool.query(deleteQuery, [ids]);

    // Resequence receipt_no after deletion
    const resequenceQuery = `
      WITH OrderedReceipts AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS new_receipt_no
        FROM expense_form
      )
      UPDATE expense_form
      SET receipt_no = OrderedReceipts.new_receipt_no
      FROM OrderedReceipts
      WHERE expense_form.id = OrderedReceipts.id;
    `;
    await pool.query(resequenceQuery);

    res.status(200).json({ message: 'Forms deleted and receipt numbers resequenced successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/expense/get-receipt-nos', async (req, res) => {
  const { ids } = req.body;

  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No record IDs provided' });
  }

  try {
    // Query to fetch the records based on the provided IDs
    const query = `
      SELECT receipt_no, name, address,category, amountnumeric, amountwords, mobileno, notes, tips, date 
      FROM expense_form
      WHERE id = ANY($1)
    `;
    const { rows } = await pool.query(query, [ids]);

    // Return the records with receipt_no
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});