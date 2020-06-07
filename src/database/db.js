// import the dependencies of sqlite3

const sqlite3 = require("sqlite3").verbose()

// creating the object for database
const db = new sqlite3.Database("./src/database/database.db")

module.exports = db
// Using the dataBase object for operations
db.serialize(() => {


})
