const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/note_notebook"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () =>{
        console.log("connect to mongo success")
    })
}

module.exports = connectToMongo;