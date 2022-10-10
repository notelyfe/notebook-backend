const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/note-notebook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () =>{
        console.log("connect to mongo success")
    })
}

module.exports = connectToMongo;