const app = require("./src/app")
const connectedDb = require('./src/Db/db')

connectedDb();


app.listen(3000,()=>{
    console.log("Server is Listening on 3000 port");
})