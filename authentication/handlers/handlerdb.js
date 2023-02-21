const { Client } = require('pg');

export async function checkUser (email) {
    const client = new Client({
        host: 'authdb',
        port: 5472
    })
    await client.connect()

    const text = 'SELECT email FROM users WHERE email= $1'
    const values = [email]

    try {
        const res = await client.query(text, values)
        await client.end()
        if (res.rows.length == 0) {
            return false
        }
        return true

    } catch (err) {
        console.log(err.stack)
        return true
    }

}

export async function createUser(email, hash) {
    const client = new Client()
    await client.connect()

    const text = 'INSERT INTO users(email, password) VALUES ($1,$2)'
    const values = [email, password]

    try {
        const res = await client.query(text, values)
        await client.end()

    } catch (err) {
        console.log(err.stack)
    }
}