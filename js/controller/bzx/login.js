$(function(){
	/** 登录 */
	$('.btn-login').on('click',function(){
		if(!$(this).hasClass('disabled')){
			$(this).addClass('disabled');
			$(this).html('登录中...');
			var _btn = $(this);
			//取值
			var _acct = $("input[name='acct']").val();
			var _password = $("input[name='password']").val();
			
			//发送请求
			doPost(	
				DEF_GLOBAL_DOMAIN + '/auth/authController/login.do',
				{acct:_acct,password:_password}
			).then(function(res){
				
				$(_btn).removeClass('disabled');
				$(_btn).html('登录');
				
				if(res.code == 1000) {
					//登录成功后存储用户信息在cookie（可省去）
					//jQuery.cookie('auth_user', JSON.stringify(res.data),{ path: '/' });
					//登录成功后的页面跳转
					to_page('home/home.html');
					return true;
				}else {
					$.toast(res.message);
					return true;
				}
				
			});
		}
	});
	
	/** 输入框监听事件：更改登录按钮 */
	$('input[name="acct"],input[name="password"]').on('input propertychange', function() {
	    if($("input[name='acct']").val() && $("input[name='password']").val()){
	    	$('.btn-login').removeClass('disabled');
	    }else{
	    	$('.btn-login').addClass('disabled');
	    }
	    return;
	});
});
