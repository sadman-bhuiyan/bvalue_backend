const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config()

async function createRole(id) {
    const client = new Client({
        host: 'writer_db',
        port: 5434,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'INSERT INTO roles(id, user_id, user_role) VALUES ($1,$2,$3)'
    const values = [uuidv4(),id, "user"]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}








module.exports = {createRole};