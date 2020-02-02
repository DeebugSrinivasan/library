var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var AuthorSchema = new Schema( 
    {
        first_name: {type: String, required: true, max: 100}, 
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);
AuthorSchema.virtual('name').get(function() {
    var fullname = '';
    if(this.first_name && this.family_name) {
        fullname = this.first_name + this.family_name;
    }
    return fullname;
});
AuthorSchema.virtual('life_formatted').get(function() {
    return this.date_of_birth?this.date_of_death?moment(this.date_of_birth).format('MMMM Do, YYYY') + ' to ' + moment(this.date_of_birth).format('MMMM Do, YYYY'):moment(this.date_of_birth).format('MMMM Do, YYYY'):'';
})
AuthorSchema.virtual('lifespan').get(function() {
    return (this.date_of_death - this.date_of_birth).toString();
});
AuthorSchema.virtual('url').get(function() {
    return '/catalog/author/' + this._id;
});
module.exports = mongoose.model('Author', AuthorSchema);