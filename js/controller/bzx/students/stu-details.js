var xh;
var whiter = {};
$(function(){
	$.init();
	
	xh = getURLDecodeParameter('xh');
	
	// 查询学生基本信息
	doPost(
		DEF_GLOBAL_DOMAIN + '/orgs/students/findStudentsByXH.do',
		{xh:xh}
	).done(function(res){
		if(res.code == 1000){
			$('.xm').html(res.data.xm);
			$('.xh').html(res.data.xh);
			$('.field-nj').html(res.data.nj);
			$('.field-bj').html(res.data.bjmc);
			$('.field-zy').html(res.data.zymc);
			$('.field-yx').html(res.data.yxmc);
		}
		return;
	});
	
	// 跳转月历
	$('.btn-stu-calendar').on('click',function(){
		to_page('stu-calendar.html',{xh:xh});
		return;
	});
	
	
	// 白名单设置
	$('.btn-whiter-set').on('click', function() {
		to_page('../whiter/whiter-list.html',{xh:xh});
		return;
	});
	
});



