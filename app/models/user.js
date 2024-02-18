var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    active: Boolean,
    updatedate: Date  
});

module.exports = mongoose.model('User', UserSchema);