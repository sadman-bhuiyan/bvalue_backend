const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config()


async function getUser (email) {
    const client = new Client({
        host: 'authentication_db',
        port: 5433,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'SELECT hashed_password FROM users WHERE email= $1'
    const values = [email]

    try {
        const res = await client.query(text, values)
        await client.end()
        return res.rows

    } catch (err) {
        console.log(err.stack)
    }

}

async function createProfile(user_id, name, surname, birthdate, gender, birthcity) {
    const client = new Client({
        host: 'writer_db',
        port: 5433,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'INSERT INTO users(user_id, name, surname, birthdate, gender, birthcity) VALUES ($1,$2,$3,$4,$5,$6,$7)'
    const values = [uuidv4(), user_id, name, surname, birthdate, gender, birthcity]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}

module.exports = {getUser, createProfile};