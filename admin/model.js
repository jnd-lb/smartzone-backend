const { json } = require("express");
const Router = require("express").Router;
const router = Router();
const bodyParser = require("body-parser");
const {ObjectID} = require('mongodb');
const auth = require("../middleware/auth");
let db = null;

//body parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

////Add////
router.post("/", auth, (req, res, next) => {
    //TODO sanitize user input
    let {modelName, brandId, screenSize, frontCameraRes, rearCamera, batteryCapacity,ram, cpu, price, releasedDate, os, dualSim} = req.body;
    //handle missing feild
    if (!(modelName && brandId && screenSize && frontCameraRes && rearCamera && batteryCapacity && ram && cpu && price && releasedDate && os && dualSim)) {
        res.status(403).json({ status: 403, error: true, message: 'all the features of the model should be provided' });
        return;
    }

    const newModel = {
        modelName: modelName,
        brandId: brandId,
        screenSize: screenSize,
        frontCameraRes: frontCameraRes,
        rearCameraRes: rearCameraRes,
        batteryCapacity: batteryCapacity,
        ram: ram,
        cpu: cpu,
        price: price,
        releasedDate: releasedDate,
        os: os,
        dualSim: dualSim
    };

    db.collection('models').insertOne(newModel, (err, results) => {
        if (err) res.status(500).json({ status: 500, error: true, message: "internal error" });
        res.status(201).json({ status: 201, data: results["ops"][0] });
    });
///------------------------------
    
});
/////////////Get By ID/////////////
router.get("/:id", auth, (req, res, next) => {
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
///delete///
router.delete("/:id", auth, (req, res, next) => {
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