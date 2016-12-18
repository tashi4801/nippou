var pg = require('pg');
var con = 'tcp://postgres:admin@localhost:5432/postgres';
var style = '';
const findAllAcountInfoSQL = "select * from id_pass_info ORDER BY ipi_info;";
const insertSQL = "INSERT INTO id_pass_info (user_id,site_id,extra,resist_name) VALUES (1,1001,$1,$2);";
const deleteSQL = 'delete from id_pass_info WHERE ipi_info=$1;';
const findAllSystemSQL = "select * from site ORDER BY site_id;";

module.exports = {

	insertIdPass : function(res,req) {
		var idPassInfo = {'id':req.body.id,'pass':req.body.pass};
		console.log('ressit_name ' + req.body.resist_name);
		var JSON_idPassInfo = JSON.stringify(idPassInfo);
		
		pg.connect(con, function(err, client) {
			if (err) {
				done();
				console.log(err);
				return res.status(500).json({
					success : false,
					data : err
				});
			}
			client.query(insertSQL, [ JSON_idPassInfo , req.body.resist_name ]);
		});
		return true;
	},
	
	deleteAccount : function(req, res, next) {

		var ipi_info = req.body.ipi_info;
		console.log('ipi_info ' + ipi_info);
		
		
		var results = [];
		pg.connect(con, function(err, client, done) {
			if (err) {
				done();
				console.log(err);
				return res.status(500).json({
					success : false,
					data : err
				});
			}
			client.query(deleteSQL, [ ipi_info ]);
			
			var findAllquery = client.query(findAllAcountInfoSQL);
			
			findAllquery.on('row', function(row) {
				results.push(row);
			});
			
			findAllquery.on('end', function() {
				done();
				
				if(results.length > 0){
					style = 'display:none';
				} else {
					style = '';
				}
				console.log('style ' + style);
				console.log('results ' + JSON.stringify(results));
				var JSON_list ={
				           'style':style,
				           'results':results
				           };
				
				res.render('index', {
					list : results,
				    style: style
				});
			});
		});
	},

	findAllAcountInfo : function(req, res) {
	
		var accountList = [];
		
		pg.connect(con, function(err, client) {
			
			var findAllquery = client.query(findAllAcountInfoSQL);
			
			if (err) {
				done();
				console.log("err" + err);
				console.log("err" + err);
				return res.status(500).json({
					success : false,
					data : err
				});
			}
			
			findAllquery.on('row', function(rows) {
				accountList.push(rows);
			});

			findAllquery.on('end', function(row, err) {
				
				if(accountList.length > 0){
					style = 'display:none';
				} else {
					style = '';
				}
				var systemList = [];
		
				pg.connect(con, function(err, client) {
					
					var findAllSystemQuery = client.query(findAllSystemSQL);
					
					if (err) {
						done();
						console.log("err" + err);
						console.log("err" + err);
						return res.status(500).json({
							success : false,
							data : err
						});
					}
					findAllSystemQuery.on('row', function(rows) {
						systemList.push(rows);
					});
		            
					findAllSystemQuery.on('end', function(row, err) {
						console.log('systemList' + JSON.stringify(systemList));	
						console.log('accountList' + JSON.stringify(accountList));	
						res.render(
							'index', {
							'systemList' : systemList,
							'list' : accountList,
						    'style': style
						});
					});
				});
			});
		});
		
		
		return true;
	}
};
