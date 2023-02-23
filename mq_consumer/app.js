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
                    handlerDB.createRole("user",message.id)
                    handlerDB.createRoleReader("user",message.id)
                    channel.ack(data);
                    break;
                case 'create_role_admin':
                    handlerDB.createRole("admin",message.id)
                    handlerDB.createRoleReader("admin",message.id)
                    channel.ack(data);
                    break;
                case 'create_profile':
                    handlerDB.createProfile(message.id)
                    handlerDB.createProfileReader(message.id)
                    channel.ack(data);
                    break;
                case 'modify_profile':
                        handlerDB.modifyProfileReader(message.user_id, message.name, message.surname, message.birthdate, message.gender, message.birthcity)
                        channel.ack(data);
                        break;
                case 'delete_profile':
                        handlerDB.deleteProfileReader(message.user_id);
                        handlerDB.deleteRoleReader(message.user_id);
                        handlerDB.deleteUser(message.user_id);
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