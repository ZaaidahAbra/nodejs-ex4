const pool = require('./db');

// 4a. Get all employees
async function getAllEmployees() {
  try {
    const [rows] = await pool.query('SELECT * FROM employees');
    console.log('All Employees:');
    console.table(rows);
    return rows;
  } catch (err) {
    console.error('Error fetching employees:', err);
    throw err;
  }
}

// 4b. Get single employee by ID
async function getEmployeeById(id) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM employees WHERE employee_id = ?', 
      [id]
    );
    if (rows.length === 0) {
      console.log(`Employee ${id} not found`);
      return null;
    }
    console.log(`Employee ${id}:`);
    console.table(rows[0]);
    return rows[0];
  } catch (err) {
    console.error('Error fetching employee:', err);
    throw err;
  }
}

// 4c. Add new employee
async function addEmployee(employee) {
  try {
    const [result] = await pool.query(
      'INSERT INTO employees SET ?',
      [employee]
    );
    console.log('Added new employee with ID:', result.insertId);
    return await getAllEmployees();
  } catch (err) {
    console.error('Error adding employee:', err);
    throw err;
  }
}

// 4d. Remove employee by ID
async function removeEmployee(id) {
  try {
    const [result] = await pool.query(
      'DELETE FROM employees WHERE employee_id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      console.log(`Employee ${id} not found`);
      return null;
    }
    console.log(`Removed employee ${id}`);
    return await getAllEmployees();
  } catch (err) {
    console.error('Error removing employee:', err);
    throw err;
  }
}

// 4e. Update employee by ID
async function updateEmployee(id, updates) {
  try {
    const [result] = await pool.query(
      'UPDATE employees SET ? WHERE employee_id = ?',
      [updates, id]
    );
    if (result.affectedRows === 0) {
      console.log(`Employee ${id} not found`);
      return null;
    }
    console.log(`Updated employee ${id}`);
    return await getEmployeeById(id);
  } catch (err) {
    console.error('Error updating employee:', err);
    throw err;
  }
}

// Test all functions
async function testAll() {
  try {
    console.log('=== Testing Employee Functions ===');
    
    // Test getting all employees
    await getAllEmployees();
    
    // Test getting single employee
    await getEmployeeById(1);
    
    // Test adding new employee
    const newEmployee = {
      first_name: 'Zada',
      last_name: 'Smith',
      email: 'zada.smith@example.com',
      phone_number: '555-5678',
      department: 'TeleMarketing',
      salary: 75000
    };
    await addEmployee(newEmployee);
    
    // Test updating employee
    await updateEmployee(2, {
      salary: 80000,
      department: 'Digital Marketing'
    });
    
    // Test removing employee
    await removeEmployee(2);
    
    console.log('=== All tests completed ===');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await pool.end();
    process.exit();
  }
}

testAll();