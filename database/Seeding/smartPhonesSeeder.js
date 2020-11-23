const SmartPhone = require("./model/smartPhone");
const smartPhonesModel = require("./smartPhones");
const mongoose = require('mongoose');
const config = require("../../config/config");

mongoose.connect(config.mongodb_uri);

let count = 0;
function seed() {
    for(let phone of smartPhonesModel){
        new SmartPhone(phone)
        .save()
        .then(()=>{
            count++;
            if(count == smartPhonesModel.length)
            mongoose.disconnect();
        })
    }
}

seed();
