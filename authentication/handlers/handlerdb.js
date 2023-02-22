const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config()


async function getUser (email) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'SELECT hashed_password, id, role FROM users WHERE email= $1'
    const values = [email]

    try {
        const res = await client.query(text, values)
        await client.end()
        return res.rows

    } catch (err) {
        console.log(err.stack)
    }

}

async function createUser(email, hash) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'INSERT INTO users(id, email, hashed_password, user_role) VALUES ($1,$2,$3,$4)'
    const values = [uuidv4(),email, hash, "user"]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}

async function insertRefreshToken(user_id, refresh_token) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'INSERT INTO refresh_token(id, refresh_token, user_id) VALUES ($1,$2,$3)'
    const values = [uuidv4(),refresh_token, user_id]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}

async function getRefreshToken (id) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'SELECT refresh_token FROM users WHERE id= $1'
    const values = [id]

    try {
        const res = await client.query(text, values)
        await client.end()
        return res.rows

    } catch (err) {
        console.log(err.stack)
    }

}





module.exports = {getUser, createUser, insertRefreshToken, getRefreshToken};