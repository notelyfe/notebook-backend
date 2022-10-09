const connectToMongo = require('./db')

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

//Available routes
app.use('/api/auth', require('./Routes/auth'))
app.use('/api/notes', require('./Routes/notes'))


app.listen(port, () => {
  console.log(`note-notebook app listening on port ${port}`)
})

connectToMongo();