const amqp = require("amqplib");
const handlerDB = require('./handlers/handlerdb')
let channel, connection;
connectQueue()  // call the connect function
 
async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://rabbitmq:5672");
        channel    = await connection.createChannel()

        await channel.assertQueue("queue")
        console.log("Waiting for messages...")
        channel.consume("queue", data => {
            let message = JSON.parse(data.content)
            switch (message.action){
                case 'create_role':
                    handlerDB.createRole(message.id)
                    channel.ack(data);
                    break;
                default:
                    throw new Error(`Sorry, keyword "${message.action}" not recognized.`)
            }
        })
    } catch (error) {
        console.log(error);
    }
}