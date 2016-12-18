/*
 * GET home page.
 */
var co = require("co");
var db_repository = require('./model/db_repository');

exports.index = function(req, res) {
	db_repository.findAllAcountInfo(req, res);
};

exports.input = function(req, res) {
	console.log('input ' + req.body.ipi_info);
	res.render('inputForm', {
		ipi_info : req.body.ipi_info
	});
};

exports.del = function(req, res) {
	console.log(req.body)
	var JOSN = db_repository.deleteAccount(req, res);
	console.log(JOSN);
	res.render('index', {
		list : JOSN.results,
	    style: JOSN.style
	});
};