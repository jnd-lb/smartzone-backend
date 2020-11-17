const { json } = require("express");
const Router = require("express").Router;
const router = Router();
const bodyParser = require("body-parser");
const {ObjectID} = require('mongodb');

let db = null;

//body parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

//Add
router.post("/", (req, res, next) => {
    //TODO sanitize user input
    let {image, price, brand, frontCamera, rearCamera, size, battery, ram, cpu, sdStorage, cardSlot, os, date} = req.body;
    //handle missing feild
    if (!(image&& price && brand && frontCamera && rearCamera && size && battery && ram && cpu && sdStorage && cardSlot && os && date)) {
        res.status(403).json({ status: 403, error: true, message: 'all the features of the model should be provided' });
        return;
    }

    const newModel = {
        image: image,
        price: price,
        brand: brand,
        frontCamera: frontCamera,
        rearCamera: rearCamera,
        size: size,
        battery: battery,
        ram: ram,
        cpu: cpu,
        sdStorage: sdStorage,
        cardSlot: cardSlot,
        os: os,
        date: date
    };

    db.collection('models').insertOne(newModel, (err, results) => {
        if (err) res.status(500).json({ status: 500, error: true, message: "internal error" });
        res.status(201).json({ status: 201, data: results["ops"][0] });
    });

    
});
//["ops"][0]
module.exports =  (_db)=>{
    db = _db;
    return router
};