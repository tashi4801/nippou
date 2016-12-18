
function del(ipi_info){
	
   $(function(){
	    var data = {'ipi_info':ipi_info};
		console.log('data' + JSON.stringify(data));
		swal({
			  title: 'アカウントを削除しますか？',
			  text: "アカウントの削除を行います。",
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: '削除!',
		      showLoaderOnConfirm: true,
			  preConfirm: function () {
		    	  return new Promise(function (resolve) {
					console.log('data' + JSON.stringify(data));
				    $.ajax({
					    type: 'POST',
					    url : '/del',
					    data:data
				    }).done(function(response, textStatus, jqXHR) {
				    	console.log("成功");
				    	swal("削除","削除が完了しました。","success");
				    	setTimeout(function(){
				    		location.href = '/';
				    	},10000);
				    }).fail(function(jqXHR, textStatus, errorThrown ) {
				    	console.log("失敗");
				    });
		    	 });
		      }
	        });
	 });     
};

function resist(){
	$(function(){
		var id = $('#id').val();
		var pass = $('#pass').val();
		var resist_name = $('#resist_name').val();
		console.log('id ' + id);
		console.log('pass ' + pass);
		console.log('resist_name ' + resist_name);
		
		var data = {
		    'id':id,
		    'pass':pass,
		    'resist_name':resist_name
		};

		swal.queue([{
			  title: "登録しますか？",
			  text: "ログインを行い、正しいアカウントであるかを確認致します。",
		      type: 'warning',	  
		      showCancelButton: true,
		      confirmButtonColor: '#3085d6',
		      cancelButtonColor: '#d33',
			  confirmButtonText: "登録します",
		      cancelButtonText: 'キャンセル',
		      showLoaderOnConfirm: true,
		      preConfirm: function () {
		    	  return new Promise(function (resolve) {
				    $.ajax({
					  type: 'POST',
					  url: '/resist',
					  data: data
				    }).done(function(response, textStatus, jqXHR) {
				    	console.log("成功");
				    	swal("登録！！","登録が完了しました。","success");
				    	 setTimeout(function() {
				    		 location.href = '/';
					        }, 500);
					    resolve();
				    }).fail(function(jqXHR, textStatus, errorThrown ) {
				    	console.log("失敗");
				    });
				});
		      }
     }]);
 });
}

 function input(ipi_info){
		$(function(){
			var gyomu = $('#gyomu').val();
			var shokan = $('#shokan').val();
			console.log('gyomu ' + gyomu);
			console.log('shokan ' + shokan);
			
			var data = {
			    'ipi_info':ipi_info,
			    'gyomu':gyomu,
			    'shokan':shokan
			};

			swal.queue([{
				  title: "下記の内容で送信しますか？",
				  html:'<p>業務報告:</p>'+
				       '<p>'+gyomu+'</p>'+
				       '<p>所感:</p>'+
				       '<p>'+shokan+'</p>',
			      type: 'warning',	  
			      showCancelButton: true,
			      confirmButtonColor: '#3085d6',
			      cancelButtonColor: '#d33',
				  confirmButtonText: "送信",
			      cancelButtonText: 'キャンセル',
			      showLoaderOnConfirm: true,
			      preConfirm: function () {
			    	  return new Promise(function (resolve) {
					    $.ajax({
						  type: 'POST',
						  url: '/send',
						  data: data
					    }).done(function(response, textStatus, jqXHR) {
					    	console.log("成功");
					    	swal("送信完了！！","送信が完了しました。","success");
					    	 setTimeout(function() {
					    		 location.href = '/';
						        }, 500);
						    resolve();
					    }).fail(function(jqXHR, textStatus, errorThrown ) {
					    	console.log("失敗");
					    });
					});
			      }
	     }]);
	 });
	}
