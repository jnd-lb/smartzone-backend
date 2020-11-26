const Router = require("express").Router;
const router = Router();
const bodyParser = require("body-parser");
const {ObjectID} = require('mongodb');
const auth = require("../../middleware/auth");
const SmartPhones = require("../../database/model/smartPhone");
let db = null;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const multer = require('multer');

////////////////Configuration Of Storage////////////////
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
////////////End Of storage configuration////////////////


////////////////Update////////////////
router.put('/:id', (req, res) => {
    //TODO validate & sanitize input

    let picked = {
        modelName,
        brandId,
        screenSize,
        frontCameraRes,
        rearCameraRes,
        batteryCapacity,
        ram,
        cpu,
        price,
        releasedDate,
        os,
        sim
    } = req.body;

     //remove the undefined attribute
    picked = Object.keys(picked).reduce((acc, key) => {
        if (picked[key] !== undefined) acc[key] = picked[key];
        return acc;
    }, {});

    let id = ObjectID(req.params.id);
    db.collection("models").updateOne({ _id: id }, { $set: picked }, (err, result) => {
        if (err) res.status(500).json({ status: 500, error: true, message: "there is an internal error" });

        res.status(200).json({
            status: 200,
            error: false,
            message: "The the data have been updated successfully"
        });
    });
});

////////////////Get All////////////////
router.get("/",(req,res)=>{
    /**
     * return a list of models. pagination. 
     * this function will filter the data accovrding to the filtering query params pricemin=x&pricemax&brand=x
     */
    //TODO Sanitise and validate the input
    const details = {};
    if (req.query.brand) details.brand = req.query.brand;
    if (req.query.pricemax || req.query.pricemin) details.price = { $lte: 9999, $gte: 0 };
    if (req.query.pricemax) details.price.$lte = parseInt(req.query.pricemax);
    if (req.query.pricemin) details.price.$gte = parseInt(req.query.pricemin);
     
   let result = db.collection("models").aggregate([
       {
        $match: {
            ...details
        }
       },
        { $lookup:
           {
             from: 'brands',
             localField: 'brandId',
             foreignField: '_id',
             as: 'brand'
           }
         }
        ]);

        //pagination
        result.limit(10);
        let offset = parseInt(req.query.offset) || 0;
        result.skip(offset);
        result.toArray().then(arrayOfData => {
            res.status(200).json(
                {
                    status: 200,
                    error: false,
                    message: "data retrieved successfully",
                    data: arrayOfData
                }
            );
        })
});

////Add////
router.post("/", auth, upload.single("modelImage"), (req, res, next) => {
    //TODO sanitize user input
    
    let {modelName, brandId, screenSize, frontCameraRes, rearCameraRes, batteryCapacity,ram, cpu, price, releasedDate, os, sim} = req.body;
    const smartPhone = new SmartPhones({
        modelName:modelName,
        brandId:brandId,
        screenSize:screenSize,
        frontCameraRes:frontCameraRes,
        rearCameraRes:rearCameraRes,
        batteryCapacity:batteryCapacity,
        ram:ram,
        cpu:cpu,
        price:price,
        releasedDate:releasedDate,
        os:os,
        sim:sim,
        imgUrl: req.file.path
    });

    smartPhone.save();
    
/* //handle missing feild
    if (!(modelName && brandId && screenSize && frontCameraRes && rearCamera && batteryCapacity && ram && cpu && price && releasedDate && os && dualSim)) {
        res.status(403).json({ status: 403, error: true, message: 'all the features of the model should be provided' });
        return;
    }
    const smartPhone = new SmartPhones();
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
*/
    
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