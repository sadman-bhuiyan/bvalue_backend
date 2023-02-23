const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config()

async function createRole(type,user_id) {
    console.log(process.env.DB_NAME)
    console.log(process.env.DB_PASSWORD)
    console.log(process.env.DB_USR)
    try {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'INSERT INTO roles(id, user_id, user_role) VALUES ($1,$2,$3)'
    const values = [uuidv4(),user_id, type ]

    
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}

async function createRoleReader(type,user_id) {
    try {
    const client = new Client({
        host: 'reader_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_READER

    })
    await client.connect()

    const text = 'INSERT INTO roles(id, user_id, user_role) VALUES ($1,$2,$3)'
    const values = [uuidv4(),user_id, type ]

    
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}

async function createProfile(user_id) {
    const client = new Client({
        host: 'writer_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    })
    await client.connect()

    const text = 'INSERT INTO profile(id,user_id, user_name, user_surname, user_birthdate, user_gender, user_birthcity) VALUES ($1,$2,$3,$4,$5,$6,$7)'
    const values = [uuidv4(), user_id , "", "", "", "", ""]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}

async function createProfileReader(user_id) {
    const client = new Client({
        host: 'reader_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_READER

    })
    await client.connect()

    const text = 'INSERT INTO profile(id,user_id, user_name, user_surname, user_birthdate, user_gender, user_birthcity) VALUES ($1,$2,$3,$4,$5,$6,$7)'
    const values = [uuidv4(), user_id , "", "", "", "", ""]

    try {
        const res = await client.query(text, values)
        await client.end()

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

async function modifyProfileReader(user_id, name, surname, birthdate, gender, birthcity) {
    const client = new Client({
        host: 'reader_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_READER

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

async function deleteProfileReader(user_id) {
    const client = new Client({
        host: 'reader_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_READER

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

async function deleteRoleReader(user_id) {
    const client = new Client({
        host: 'reader_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_READER

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

async function deleteUser(user_id) {
    const client = new Client({
        host: 'authentication_db',
        port: 5432,
        user: process.env.DB_USR,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_AUTH

    })
    await client.connect()

    const text = 'DELETE FROM refresh_token WHERE user_id=$1'
    const text_user = 'DELETE FROM users WHERE id=$1'
    const values = [user_id]


    try {
        const res = await client.query(text, values);
        const res_user = await client.query(text_user, values);
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }

}





module.exports = {createRole, createProfile, createProfileReader, createRoleReader, modifyProfile, modifyProfileReader, deleteRoleReader, deleteProfileReader, deleteUser};