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
/////////////Get By ID/////////////
router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    const details = { '_id': ObjectID(id) };

    db.collection('models').findOne(details, (err, item) => {
        //handle not existing model
        console.log(err)
        console.log(item)
        if (err) { res.status(404).json({ status: 404, error: true, message: `the model ${id} does not exist` }); }
        else {
            res.status(200).json({
                status: 200,
                data: item
            });
        }
    });
});
router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    const details = { '_id': ObjectID(id) };
    db.collection('models').deleteOne(details, (err, item) => {
        //handle not existing model
        if (err) {
            res.status(404).json({ status: 404, error: true, message: `the model ${id} does not exist` });
        } else {
            res.status(200).json({ status:200, message: `model was successfully deleted`});
        }
    });
});

module.exports =  (_db)=>{
    db = _db;
    return router
};