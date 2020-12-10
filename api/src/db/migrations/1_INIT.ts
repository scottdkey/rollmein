
const installUUID = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`


module.exports.generateSql = () => `${installUUID}`