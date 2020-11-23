const Brand = require("./model/user");
const brandsList = require("./users");
const mongoose = require('mongoose');
const config = require("../../config/config");

mongoose.connect(config.mongodb_uri);

let count = 0;
function seed() {
    for(let brand of brandsList){
        new Brand(brand)
        .save()
        .then(()=>{
            count++;
            if(count == brandsList.length)
            mongoose.disconnect();
        })
    }
}

seed();