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

    const text = 'SELECT hashed_password, id FROM users WHERE email= $1'
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

    const text = 'INSERT INTO users(id, email, hashed_password) VALUES ($1,$2,$3)'
    let id = uuidv4()
    const values = [id,email, hash]

    try {
        const res = await client.query(text, values)
        await client.end()
        
        return {id}

    } catch (err) {
        console.log(err.stack)
    }
}

async function createRole(id) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
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



async function insertRefreshToken(user_id, refresh_token) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'INSERT INTO refresh_token(id, token, user_id) VALUES ($1,$2,$3)'
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

    const text = 'SELECT token FROM refresh_token WHERE id= $1'
    const values = [id]

    try {
        const res = await client.query(text, values)
        await client.end()
        return res.rows

    } catch (err) {
        console.log(err.stack)
    }

}





module.exports = {getUser, createUser, insertRefreshToken, getRefreshToken, createRole};