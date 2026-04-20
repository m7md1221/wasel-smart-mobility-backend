const db = require('../config/database')

// GET ALL checkpoints
exports.getAll = async (query) => {
  const { page = 1, limit = 10 } = query

  const offset = (page - 1) * limit

  const result = await db.query(
    'SELECT * FROM checkpoints LIMIT $1 OFFSET $2',
    [limit, offset]
  )

  return result.rows
}

// UPDATE status + history 🔥
exports.updateStatus = async (id, newStatus) => {
  const old = await db.query(
    'SELECT status FROM checkpoints WHERE id=$1',
    [id]
  )

  if (old.rows.length === 0) {
    throw new Error('Checkpoint not found')
  }

  const oldStatus = old.rows[0].status

  await db.query(
    'UPDATE checkpoints SET status=$1 WHERE id=$2',
    [newStatus, id]
  )

  await db.query(
    `INSERT INTO checkpoint_status_history
     (checkpoint_id, old_status, new_status, changed_at)
     VALUES ($1, $2, $3, NOW())`,
    [id, oldStatus, newStatus]
  )
}