const connectToMongo = require('./db')
var cors = require('cors')

const express = require('express')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available routes
app.use('/api/auth', require('./Routes/auth'))
app.use('/api/notes', require('./Routes/notes'))

app.listen(port, () => {
  console.log(`note-notebook app listening on port ${port}`)
})

connectToMongo();