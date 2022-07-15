const express = require('express')
const app = express()
const cors = require('cors')
const port = 8000
const db = require("./connections/db");
const router = require("./routes/routes")
app.use(cors());
app.use(express.json())
app.use("/", router)

db.authenticate()
    .then(() => {
        console.log('Database connected...')
    })
    .catch(err => {
        console.log('Error: ' + err)
})
db.sync()
    .then(() => {
        app.listen(port, err => {
            if (err) {
                // throw err
                console.log('error')
            } else {
                console.log(`your app is running on PORT : ${port}`)
                console.log(`api url: http://localhost:${port}`)

            }
        })
    })
    .catch(err => console.log('Error: ' + err))