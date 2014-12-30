var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};
var UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    trim: true,
    unique: true,
    //required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  instagram: Schema.Types.Mixed, //See example data below
  pictures: Array,
  updated_at: Date,
  finished_at: Date,
  role: { type: String, required: false, default: 'user'},
  password: String,
  status : { type: String, default: 'inactive' },
  last_visit : { type: Date, default: Date.now() },
  last_login : { type: Date, default: Date.now() }
});

/** Example instagram data
{"username":"rafinskipg","bio":"","website":"","profile_picture":"https:\/\/instagramimages-a.akamaihd.net\/profiles\/anonymousUser.jpg","full_name":"","id":"1583946235"}
**/


UserSchema.virtual('created_at')
  .get(function(){
    return this._id.getTimestamp();
  });

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);

