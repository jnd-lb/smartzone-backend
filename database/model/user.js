const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email is required"]
    /*,lowercase: true,
    index: {
      unique: true
    } ,
    validate: [{
      validator: (em) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(em);
      },
      msg: "Please enter a valid email"
    }] */
  },

  password: {
    type: String,
    required: true,
    minlength: [6, 'Minimum password length is 6 characters'],
  }
});

/* schema.path('email').validate(async (_email) => {
  const emailCount = await mongoose.models.user.find({ email:_email})
  return emailCount==null;
}, 'Email already exists') */

// fire a function before doc saved to db | before sign up
/* schema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});
 */
// static method to login user
/* schema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  }; */

//    validate: () => Promise.reject(new Error('Oops!'))


module.exports = mongoose.model("user", schema);

/* ,
    {
      validator: async (em) => {
        const isEmailExist = await mongoose.models.user.countDocuments({ email: this.email });

        // throw error when email already registered
        console.log(isEmailExist);
        return false
      },
      msg: ">This email already exist"
    } */
