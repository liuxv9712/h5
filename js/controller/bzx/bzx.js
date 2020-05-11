// 查询reminds数量
var getReminds = function(){
	return doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxRemind/findUnRemindCount.do'
	);
}

/**
 * 添加remind 数量,如果最终结果小于1，则因此提示并从cookie 中删除
 * @param {Object} count
 */
var addRemindCount = function(count){
	var remindCount = $.cookie('remindCount');
	if(remindCount){
		remindCount = parseInt(remindCount) + count;
		if(remindCount < 1){
			$.removeCookie('remindCount',{ path: '/' });
			$('.badge.remind').html('');
			$('.badge.remind').hide();
		}else{
			$.cookie('remindCount',remindCount, {path: '/' });
			$('.badge.remind').html(remindCount);
			$('.badge.remind').show();
		}
	}
	return;
}

$(function(){
	if($('.badge.remind')){
		var remindCount = $.cookie('remindCount');
		if(remindCount){
			remindCount = parseInt(remindCount);
			$('.badge.remind').html(remindCount);
			$('.badge.remind').show();
		}else{
			getReminds().then(function(res){
				if(res.code == 1000 && res.data > 0){
					if(res.data > 0){
						$.cookie('remindCount',parseInt(res.data),{path: '/' });
						$('.badge.remind').html(res.data);
						$('.badge.remind').show();
					}
				}
			});
		}
	}
});