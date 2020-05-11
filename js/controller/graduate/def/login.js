$(function(){
	console.log($('.graduate').data('schema'));
	
	// svg图片按钮
	$.get('../../../img/graduate/def/login/button.svg', function(svgDoc){
		var svg = document.importNode(svgDoc.documentElement,true);
		$('.btn').append(svg);
		
	},"xml");
	
	// 登录
	$('.btn').on('click','#svg-login',function(){
		$(this).find('.svg-login-bg').css('fill', '#ccc')
		$(this).find('.login-text').text('登录中...');
		// 校验用户密码
		// 校验用户密码
		var _acct = $("input[name='acct']").val();
		var _password = $("input[name='password']").val();
		
		if(!_acct || _acct == ""){
			alert("请输入用户名");
			return false;
		} else if(!_password || _password == ""){
			alert("请输入密码");
			return false;
		} else{
			// 发送请求
			// doPost(
			// 	url,
			// 	{acct:_acct, password:_password}
			// ).then(function(res){
			// 	if(res.code == 1000){
						// 保存用户名
						// localStorage.setItem("id", _acct);
			// 		// 页面跳转
			// 		window.location.href="index.html";
			// 		return true;
			// 	}else{
			// 		$toast(res.message);
			// 		return true;
			// 	}
			// })
			// 页面跳转
			window.location.href="index.html";
		}
	});
});