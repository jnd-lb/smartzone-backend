const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email is required"],
    index: {
      unique: true
    },
    validate : {
      validator: (em)=>{
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(em);
      },
      message: "Please enter a valid email"
    }},
  password: { 
    type: String,
    required: true,
    minlength:[6, 'Minimum password length is 6 characters'],
    },
});

// fire a function before doc saved to db | before sign up
schema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("user", schema);