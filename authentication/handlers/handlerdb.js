const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const handlerMQ = require('../handlers/handlermq')
const bcrypt = require('bcrypt');

dotenv.config()


async function getUser(email) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'SELECT hashed_password, id FROM users WHERE email=$1'
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
    const values = [id, email, hash]

    try {
        const res = await client.query(text, values)
        await client.end()

        return { id }

    } catch (err) {
        console.log(err.stack)
    }
}

async function createRole(type,id) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'INSERT INTO roles(id, user_id, user_role) VALUES ($1,$2,$3)'
    const values = [uuidv4(), id, type]

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
    const values = [uuidv4(), refresh_token, user_id]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}

async function getRefreshToken(id) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'SELECT token FROM refresh_token WHERE id=$1'
    const values = [id]

    try {
        const res = await client.query(text, values)
        await client.end()
        return res.rows

    } catch (err) {
        console.log(err.stack)
    }

}


async function createAdminUser() {
    console.log("Creating admin user...")
    console.log("Waiting 10 seconds....")
    let user = await getUser(process.env.ADMIN_EMAIL);
    

    if (user.length > 0) {
      console.log("Admin user already exist, skipping...")
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 20000));
    const saltRounds = parseInt(process.env.SALT_ROUNDS);

    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, saltRounds);

    let id = await createUser(process.env.ADMIN_EMAIL, hash);
    await createRole("admin", id.id)
    await handlerMQ.sendData({ action: "create_role_admin", id: id.id })
}



module.exports = { getUser, createUser, insertRefreshToken, getRefreshToken, createRole, createAdminUser };