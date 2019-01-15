var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var treeNodeSchema = new Schema({
	tId: { type: String, required: true, unique: true },
	r: { type: String, required: true},
	c: { type: String, required: true},
	type: { type: String, required: true},
	val: { type: String, required: true}

}, {
	collection: 'treeNode'
});

module.exports = mongoose.model('treeNode', treeNodeSchema);

