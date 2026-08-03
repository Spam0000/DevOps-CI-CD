const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'todo',
  password: process.env.DB_PASSWORD || 'todo',
  database: process.env.DB_NAME || 'todo'
});

function mapTask(row) {
  return {
    id: row.id,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function createTask({ id, description, status }) {
  const result = await pool.query(
    `
      INSERT INTO tasks (id, description, status)
      VALUES ($1, $2, $3)
      RETURNING id, description, status, created_at, updated_at
    `,
    [id, description, status]
  );

  return mapTask(result.rows[0]);
}

async function listTasks() {
  const result = await pool.query(
    `
      SELECT id, description, status, created_at, updated_at
      FROM tasks
      ORDER BY created_at DESC
    `
  );

  return result.rows.map(mapTask);
}

async function getTaskById(id) {
  const result = await pool.query(
    `
      SELECT id, description, status, created_at, updated_at
      FROM tasks
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ? mapTask(result.rows[0]) : null;
}

async function updateTask(id, updates) {
  const fields = [];
  const values = [];

  if (typeof updates.description === 'string') {
    fields.push(`description = $${fields.length + 1}`);
    values.push(updates.description);
  }

  if (typeof updates.status === 'string') {
    fields.push(`status = $${fields.length + 1}`);
    values.push(updates.status);
  }

  if (fields.length === 0) {
    return getTaskById(id);
  }

  fields.push('updated_at = NOW()');
  values.push(id);

  const result = await pool.query(
    `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${values.length}
      RETURNING id, description, status, created_at, updated_at
    `,
    values
  );

  return result.rows[0] ? mapTask(result.rows[0]) : null;
}

async function deleteTask(id) {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = {
  init,
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask
};
