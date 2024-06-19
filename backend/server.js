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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,cld
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
// });

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
    CREATE TABLE IF NOT EXISTS forms (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      address VARCHAR(255),
      category VARCHAR(255),
      amountNumeric DOUBLE PRECISION,
      amountWords VARCHAR(255),
      date DATE
    );
  `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  const createFixedDepositsTable = `
    CREATE TABLE IF NOT EXISTS fixed_deposits (
      id SERIAL PRIMARY KEY,
      bankName VARCHAR(255) NOT NULL,
      accountNumber VARCHAR(255) NOT NULL,
      fdrNumber VARCHAR(255) NOT NULL,
      depositAmount DECIMAL(10, 2) NOT NULL,
      date DATE
    );
  `;

  const createAmarNidhiTable = `
    CREATE TABLE IF NOT EXISTS amar_nidhi (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      amountNumeric DECIMAL(10, 2) NOT NULL DEFAULT 1100,
      amountWords VARCHAR(255) NOT NULL DEFAULT 'One Thousand One Hundred Only',
      date DATE
    );
  `;

  const createExpenseFormsTable = `
    CREATE TABLE IF NOT EXISTS expense_forms (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      amountNumeric DECIMAL(10, 2) NOT NULL,
      amountWords VARCHAR(255) NOT NULL,
      notes TEXT,
      tips TEXT,
      date DATE NOT NULL
    );
  `;

  try {
    await pool.query(createFormsTable);
    await pool.query(createUsersTable);
    await pool.query(createFixedDepositsTable);
    await pool.query(createAmarNidhiTable);
    await pool.query(createExpenseFormsTable);
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
    const { rows } = await pool.query('SELECT MAX(id) as latestId FROM expense_forms'); // replace `forms` with your actual table name
    const latestId = rows[0].latestid || 0; // Get the latest ID or default to 0 if none found
    res.json({ latestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/submit-expense', (req, res) => {
  const { name, address, category, amountNumeric, amountWords, date, notes, tips } = req.body;
  const sql = 'INSERT INTO expense_forms (name, address, category, amountNumeric, amountWords, date, notes, tips) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
  pool.query(sql, [name, address, category, amountNumeric, amountWords, date, notes, tips], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Expense form submitted successfully' });
  });
});

app.get('/api/expense/filter', (req, res) => {
  const { category, date, month, year, offset = 0, limit = 50 } = req.query;

  let sql = 'SELECT * FROM expense_forms WHERE 1=1';
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

app.get('/api/expense/totalAmount', async (req, res) => {
  const { category, date, month, year } = req.query;

  let query = 'SELECT SUM(amountNumeric) as totalAmount FROM expense_forms WHERE 1=1'; // replace `your_table_name` with your actual table name
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
    const { rows } = await pool.query('SELECT MAX(id) as latestId FROM forms'); // replace `forms` with your actual table name
    const latestId = rows[0].latestid || 0; // Get the latest ID or default to 0 if none found
    res.json({ latestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/submit-form', (req, res) => {
  const { name, address, category, amountNumeric, amountWords, date } = req.body;
  const sql = 'INSERT INTO forms (name, address, category, amountNumeric, amountWords, date) VALUES ($1, $2, $3, $4, $5, $6)';
  pool.query(sql, [name, address, category, amountNumeric, amountWords, date], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
  }
  res.status(200).json({ message: 'Form submitted successfully' });
});
});

app.get('/api/forms', (req, res) => {
  const sql = 'SELECT * FROM forms';
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

  let sql = 'SELECT * FROM forms WHERE 1=1';
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

  let query = 'SELECT SUM(amountNumeric) as totalAmount FROM forms WHERE 1=1'; // replace `your_table_name` with your actual table name
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
app.get('/api/amarNidhi/latestId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT MAX(id) as latestId FROM amar_nidhi'); // replace `forms` with your actual table name
    const latestId = rows[0].latestid || 0; // Get the latest ID or default to 0 if none found
    res.json({ latestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to handle form submission for AmarNidhi
app.post('/api/amarNidhi', (req, res) => {
  const { name, address, amountNumeric, amountWords } = req.body;
  const sql = 'INSERT INTO amar_nidhi (name, address, amountNumeric, amountWords, date) VALUES ($1, $2, $3, $4, NOW())';
  pool.query(sql, [name, address, amountNumeric, amountWords], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ id: result.insertId });
  });
});

app.get('/api/amarNidhiReceipt', (req, res) => {
  const sql = 'SELECT SUM(amountNumeric) AS totalAmount FROM amar_nidhi WHERE date > NOW() - INTERVAL \'1 YEAR\'';
  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ totalAmount: result.rows[0].totalamount });
  });
});

// Fixed Deposit routes
app.post('/api/fixedDeposit', (req, res) => {
  const { bankName, accountNumber, fdrNumber, date, amount } = req.body;
  const sql = 'INSERT INTO fixed_deposits (bankName, accountNumber, fdrNumber, date, depositAmount) VALUES ($1, $2, $3, $4, $5)';
  pool.query(sql, [bankName, accountNumber, fdrNumber, date, amount], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ id: result.insertId });
  });
});

app.get('/api/total', (req, res) => {
  const sql = 'SELECT SUM(depositAmount) AS totalAmount FROM fixed_deposits';
  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ totalAmount: result.rows[0].totalamount });
  });
});

// Endpoint to fetch all fixed deposit records
app.get('/api/fixedDeposits', (req, res) => {
  const sql = 'SELECT * FROM fixed_deposits';
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results.rows);
  });
});

app.get('/api/amarNidhiRecords', (req, res) => {
  const sql = 'SELECT * FROM amar_nidhi';
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results.rows);
  });
});

app.get('/api/amarNidhiReceipt/custom_date', (req, res) => {
  const { fromDate, toDate, month, year } = req.query;
  let sql = 'SELECT SUM(amountNumeric) AS totalAmount FROM amar_nidhi WHERE 1=1';
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
  let sql = 'SELECT * FROM amar_nidhi WHERE 1=1';
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

// Add delete endpoint for forms
app.delete('/api/forms/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM forms WHERE id = $1';
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Form deleted successfully' });
  });
});

// Endpoint to delete amar_nidhi records
app.delete('/api/amarNidhi/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM amar_nidhi WHERE id = $1';
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Record deleted successfully' });
  });
});

// Endpoint to delete expense_forms records
app.delete('/api/submit-form/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM expense_forms WHERE id = $1';
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Record deleted successfully' });
  });
});

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
