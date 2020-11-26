const express = require("express");
const config = require("./config/config");

const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 8000;



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });
//routes
app.use('/uploads', express.static('uploads'));
const showroom = require("./routes/showroom/showroom");
const dashboard = require("./routes/admin/model");
const user = require("./routes/admin/user");

const uri = config.mongodb_uri;
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});

try{
    client.connect(err => {
        if(err) throw "Error in the Database";
        const database = client.db("smartzone");      
        app.use("/uploads",express.static("uploads"));
        app.use("/model",showroom(database));
        app.use("/admin/model",dashboard(database));
        app.use("/admin",user(database));
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