const Router = require("express").Router;
const router = Router();
let db = null;

/**
 * return a list of models. pagination. 
 * this function will filter the data accovrding to the filtering query params pricemin=x&pricemax&brand=x
 */
router.get("/",(req,res)=>{
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
             localField: 'brand_id',
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

/*
router.get("/", (req, res) => {
    //TODO validate and sanitize the data passed through the query

    const details = {};
    if (req.query.brand) details.brand = req.query.brand;
    if (req.query.pricemax || req.query.pricemin) details.price = { $lte: 9999, $gte: 0 };
    if (req.query.pricemax) details.price.$lte = parseInt(req.query.pricemax);
    if (req.query.pricemin) details.price.$gte = parseInt(req.query.pricemin);

    db.collection("models").find({}, (err, result) => {
        if (err) {
            res.status(500).json({
                status: 500,
                error: true,
                message: "Internal error"
            });
        }

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
}); 
 */

module.exports = (_db) => {
    db = _db;
    return router
};