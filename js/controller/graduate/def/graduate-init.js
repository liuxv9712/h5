/**
 * 初始化
 */
var schema = {
	logo:'http://cdn.mengdouwang.cn/graduate/schema/title.png',
	themeType:'defaults',
	loginPage:{
		backgroundImg:'http://cdn.mengdouwang.cn/graduate/schema/background.png'
	}
}
$(function () {
	// 1.调用后台接口，读取schemas
	// $('.graduate').load(url, params, callback);
	// 2.验证风格类型是否一致
	if(schema.themeType != 'defaults'){
		$.alert('页面加载出错,请检查链接是否正确!');
		return;
	}


	// 3.解析scheam 生成页面（login 背景+logo）
	$('.graduate').css('background', 'url(' + schema.loginPage.backgroundImg + ')');
	$('.graduate-logo').append('<img src="' + schema.logo + '" />');


	// 4.把数据传给login, $().data('')在指定的元素上存取数据
	$('.graduate').data('schema', schema);
});