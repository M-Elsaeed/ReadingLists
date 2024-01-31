const express = require("express");
const { createClient } = require("redis")

const fs = require("fs")

const app = express();
const port = process.env.PORT || 3000;

// const client = createClient({
//     password: 'Z4BpvcJpcFaXULRYsQylHchJ28LqlG4O',
//     socket: {
//         host: 'redis-18179.c243.eu-west-1-3.ec2.cloud.redislabs.com',
//         port: 18179
//     }
// });

app.get("/", (req, res)=>{
    // client.get().then(r => res.send(r)).catch(er=>res.send(er))
    res.send("OK")
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});