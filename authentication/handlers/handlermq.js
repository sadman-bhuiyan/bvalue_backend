const amqp = require("amqplib");


let channel, connection;

async function sendData(data) {
    try {
        connection = await amqp.connect("amqp://rabbitmq:5672");
        channel = await connection.createChannel()

        await channel.assertQueue("queue")

        await channel.sendToQueue("queue", Buffer.from(JSON.stringify(data)));

        await channel.close();
        await connection.close();

    } catch (error) {
        console.log(error)
    }

}


module.exports = { sendData };