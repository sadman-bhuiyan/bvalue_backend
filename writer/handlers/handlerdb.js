const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config()


async function getUser(email) {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
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

async function getProfile(user_id) {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'SELECT * FROM profile WHERE user_id=$1'
    const values = [user_id]

    try {
        const res = await client.query(text, values)
        await client.end()
        return res.rows

    } catch (err) {
        console.log(err.stack)
    }

}

async function getAllProfiles() {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'SELECT * FROM profile'

    try {
        const res = await client.query(text)
        await client.end()
        return res.rows

    } catch (err) {
        console.log(err.stack)
    }

}

async function getRole(user_id) {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'SELECT * FROM roles WHERE user_id=$1'
    const values = [user_id]

    try {
        const res = await client.query(text, values)
        await client.end()
        return res.rows

    } catch (err) {
        console.log(err.stack)
    }

}

async function modifyProfile(user_id, name, surname, birthdate, gender, birthcity) {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'UPDATE profile SET user_name=$1, user_surname=$2, user_birthdate=$3, user_gender=$4, user_birthcity=$5  WHERE user_id=$6'
    const values = [name, surname, birthdate, gender, birthcity, user_id]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }

}

async function deleteProfile(user_id) {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'DELETE FROM profile WHERE user_id=$1'
    const values = [user_id]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }

}
async function deleteRole(user_id) {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'DELETE FROM roles WHERE user_id=$1'
    const values = [user_id]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }

}


module.exports = { getProfile, getRole, getAllProfiles, modifyProfile, deleteProfile, deleteRole };