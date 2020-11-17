const express = require("express");
const config = require("./config/config");

const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;

//routes
const showroom = require("./showroom/showroom");
const model = require("./config/admin/model");

const uri = config.mongodb_uri;
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});

try{
    client.connect(err => {
        if(err) throw "Error in the Database";
        const database = client.db("smartzone");      
        app.use("/model",showroom(database));
        app.use("/admin/model",model(database));
      // perform actions on the collection object
      //client.close();
    });
}catch(e){
    app.use((req,res)=>{
        res.status(500).json({
            status:500,
            error:true,
            message:"Unable to connect to database"
        });
    });
}

//here i will start listening to the requests 

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});