//horsemanの設定
var Horseman  = require("node-horseman");
var phantomjs = require("phantomjs");
var option  = {phantomPath:phantomjs.path,loadImages:false,timeout:60*1000};
var horseman  = new Horseman(option);
//モジュール読み込み
var co        = require("co");
var fs        = require("co-fs");
var fs1       = require("fs");
var cheerio   = require("cheerio");
var $ = require('jquery');
//独自モジュール読み込み
var db_repository = require('./model/db_repository');

//ログイン情報
var _logpath = './logs/nippou/';
var pg = require('pg');
var con = 'tcp://postgres:admin@localhost:5432/postgres';
var co        = require("co");
const url ='https://ta.htdb.jp/ggutk9a';
exports.input = function(req, res){
	
	var extra;
    var idPassInfo;
	const findByIdSQL = "select extra from id_pass_info where ipi_info="+req.body.ipi_info+";";
	
	var idPassInfo = pg.connect(con, function(err, client) {
		
		   var findByIdquery = client.query(findByIdSQL);
		   
		   findByIdquery.on('row', function(row) {
			   extra = row;
	       });
	       
	       findByIdquery.on('end', function(row,err,next) {
	    	 idPassInfo = JSON.parse(extra.extra);
		     console.log('idPassInfo ' + JSON.stringify(idPassInfo));
		     var gyoumu = req.body.gyomu;
			 var shokan = req.body.shokan;
			
			console.log(req.body);
			console.log('業務日報: ' + gyoumu);
			console.log('所感: ' + shokan);
			
			co(function *(){
			
			  console.log('START:');
			  var id = idPassInfo.id;
			  var pass = idPassInfo.pass;
			  console.log('id ' + id);
			  console.log('pass ' + pass);
			  //ユーザーエージェントを指定
				yield horseman
					.userAgent('Mozilla/5.0 (Windows NT 6.1; rv:42.0) Gecko/20100101 Firefox/42.0')
					.viewport(1280, 1024)
					.on('consoleMessage',function(msg) {
						console.log(msg);
					});
			
			  //サイトをオープン
			  var html001_1 = yield horseman
			  .open(url)
			  .waitForNextPage()
			  .wait(1000)
			  .html();
			
			  _logAndCap(horseman,html001_1,'html001_1');
			  console.log("====== 働くDBサイトオープン ======");
			  
			  //ログイン情報を入力し、ログイン処理をする
			  var html001_3 = yield horseman
			  .value('input[id="loginId"]',id)
			  .value('input[id="loginPassword"]' ,pass)
			  .finally(function(){
			      _logAndCap(horseman,"",'html001_2');
			      console.log("====== ログイン情報入力 ======");
			  })
			  .evaluate(function(){
			      formSubmit();
			  })
			  .waitForNextPage()
			  .wait(1000)
			  .html();
			
			  _logAndCap(horseman,html001_3,'html001_3');
			  console.log("====== ログイン ======");
			  
			  //htmlがフレームでできている。
			  //日報入力ボタンのあるフレームをフォーカス
			  var html001_4 = yield horseman
			      .switchToFrame('main')
			      .wait(1000)
			      .html();
			  
			  _logAndCap(horseman,html001_4,'html001_4');
			  console.log("====== meinフレームにフォーカス ======");
			  
			  //日報入力画面
			  var html001_5 = yield horseman
			      .click('a[href="/ggutk9a/recordedit/inputregistmenu/dbgId/100026/dbSchemaId/100093/menuId/100197/menuClassId/100042/tmmenuclassitemid/100440/tmtindex/0"]')
			      .waitForNextPage()
			      .wait(1000)
			      .html();
			
			  _logAndCap(horseman,html001_5,'html001_5');
			  console.log("====== 日報入力画面へ ======");
			  
				//日付や入力したい内容をセットし、確定ボタンをクリック
			  var html001_8= yield horseman
			      .value('#field_100663',gyoumu)
			      .value('#field_102279',shokan)
			      .finally(function(){
				        _logAndCap(horseman,"",'html001_7');
				        console.log("====== 日報入力 ======");
			      })
			      .evaluate(function(){
			          registSubmit();
			      })
			      .waitForNextPage()
			      .wait(1000)
			      .html();
			  
			  _logAndCap(horseman,html001_8,'html001_8');
			  console.log("====== 確定ボタン ======");
			  
			  //ログアウト処理
			  var html001_9 = yield horseman
			  .switchToFrame('bar')
			  .wait(500)
			  .evaluate(function(){
			      document.getElementById('logoutForm').submit();
			  })
			  .waitForNextPage()
			  .wait(1000)
			  .html();
			  
			  _logAndCap(horseman,html001_9,'html001_9');
			  
			  //ログアウトしているか判定
			  var isLoginPage = yield horseman.exists('title:contains("ログイン")');
			  if(isLoginPage){
			  	console.log("====== ログアウト ======");
			  }
			
			  res.render('nippou');
			  
		      }).catch(function (e) {
					
				console.log(e);
				
			  });
			
	       });
	       
	       findByIdquery.on('error', function(error) {
	    	  console.log("ERROR!!");   
	          console.log("ERROR!!" + error);
	       });
    });
      console.log("idPassInfo "  + JSON.stringify(idPassInfo));
},
exports.resist = function(req, res){
     
     co(function *(){  

		console.log('START:');
		
		//ユーザーエージェントを指定
		yield horseman
		.userAgent('Mozilla/5.0 (Windows NT 6.1; rv:42.0) Gecko/20100101 Firefox/42.0')
		.viewport(1280, 1024)
		.on('consoleMessage',function(msg) {
			console.log(msg);
		});
		
        		

	    var id = req.body.id;
	    var pass = req.body.pass;
        console.log('id ' + id);
        console.log('pass ' + pass);
        
        
		
		//サイトをオープン
		var html001_1 = yield horseman
		.open(url)
		.waitForNextPage()
		.wait(1000)
		.html();
		
		_logAndCap(horseman,html001_1,'html001_1');
		console.log("====== 働くDBサイトオープン ======");
		
		//ログイン情報を入力し、ログイン処理をする
		var html001_3 = yield horseman
		.value('input[id="loginId"]',id)
		.value('input[id="loginPassword"]' ,pass)
		.finally(function(){
		    _logAndCap(horseman,"",'html001_2');
		    console.log("====== ログイン情報入力 ======");
		})
		.evaluate(function(){
		    formSubmit();
		})
		.waitForNextPage()
		.wait(1000)
		.html();
		
		_logAndCap(horseman,html001_3,'html001_3');
		
		var isSucsessLogin = yield horseman.exists('title:contains("ログイン画面")');
		if(!isSucsessLogin){
			console.log("====== ログイン成功 ======");
			//idpass情報の登録
			db_repository.insertIdPass(res,req);
		}
		
		var html001_4 = yield horseman
	        .switchToFrame('main')
	        .wait(1000)
	        .html();
	    
	    _logAndCap(horseman,html001_4,'html001_4');
	    console.log("====== meinフレームにフォーカス ======");
		
		//ログアウト処理
	    var html001_9 = yield horseman
	    .click('a:contains("ログアウト")')
	    .waitForNextPage()
	    .wait(1000)
	    .html();
	    
	    _logAndCap(horseman,html001_9,'html001_9');
		
		//ログアウトしているか判定
	    var isLoginPage = yield horseman.exists('title:contains("ログイン")');
	    if(isLoginPage){
	    	console.log("====== ログアウト成功 ======");
	    }
//	    return true;
		db_repository.findAllAcountInfo(req, res);
	
		
     }).catch(function (e) {
    	 var err = '入力情報が正しくありません。確認して再入力してください。';
    	 res.render('');
		console.log(e);
	 });
};


//画像スクショとhtmlの取得
	function _logAndCap (horseman,html,filename){ 
		return new Promise(function(resolve,reject) {
			return co(function *() {
			        if(html){
			           yield fs.writeFile(_logpath + filename +'.html',html);
			        }
			        yield horseman.screenshot(_logpath + filename + '.png'); 
			        return resolve();
	       }).catch(function(e){
	        return reject(e);
	       });
	    });
		return true;
	}