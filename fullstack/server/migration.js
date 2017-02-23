module.exports.migrate = async (db) => {
  await db.query(`CREATE TABLE IF NOT EXISTS tasks (
      name varchar
    ) `)
}

module.exports.delete = async (db) => {
  await db.query(`DROP TABLE IF EXISTS tasks`)
}
