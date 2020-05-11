/**
 * 公共js
 * mail.chenc@foxmail.com
 * 2017-04-21
 */
/** 全局域名 */
var DEF_GLOBAL_DOMAIN = "http://192.168.0.120:8098/model_wap";

/**
 * 初始化
 */
$(function(){
	
	/** <a> 标签超链接过滤 */
	$('a').on('click',function(e){
		var _href = $(this).attr('href');
		if(_href && _href.endsWith('.html')){
			$(this).attr('href',_href + '?Rnd='+Math.random());
		}
		return true;
	});
});

/**
 * 跳转页面，基于windows.location.href
 * @param {Object} _url				地址
 * @param {Object} _params			参数:json格式 [{name:'name',value:'jack'}]
 */
function to_page(_url, _params){
	var _str = '';
	if(_params){
		for(skey in _params){
			_str += '&'+ skey +'=' + encodeURI(encodeURI(_params[skey]));
		}
		_str = _str.substr(1, _str.length - 1) + "&Rnd="+Math.random();
	}else{
		_str += "Rnd="+Math.random();
	}
	window.location.href = _url + "?" + _str;
}

/**
 * 添加分隔符
 * @param {Object} tip		提示语
 */
$.fn.show_divide_line = function(tip){
	if($(this).find(".divide-line").length<1){
		if(!tip){
			tip = '已经触底了~';
		}
		var divide = $('<div class="divide-line"></div>');
		divide.append('<div class="line-left"></div>');
		divide.append('<div class="info" style="text-align: center;font-size: 0.4rem;">'+tip+'</div>');
		divide.append('<div class="line-right"></div>');
		$(this).append(divide);
	}
	return;
}

/**
 * 添加空数据效果
 * @param {Object} tip
 */
$.fn.append_no_data = function(tip){
	if($(this).find(".no-data").length<1){
		if(!tip){
			tip = '暂无有效数据';
		}
		var no_data = $('<div class="no-data" style="text-align: center;margin: 10rem 0rem;"></div>');
		no_data.append('<img src="http://resources.huogeedu.com/no-data.png" />');
		no_data.append('<div style="font-size: 14px; color: #dbdbdb;">'+tip+'</div>');
		$(this).append(no_data);
	}
}

/** 序列化json对象 */
$.fn.serializeJson = function() {
	var serializeObj = {};
	var array = this.serializeArray();
	var str = this.serialize();
	$(array).each(function() {
		if(serializeObj[this.name]) {
			if($.isArray(serializeObj[this.name])) {
				serializeObj[this.name].push(this.value);
			} else {
				serializeObj[this.name] = [serializeObj[this.name], this.value];
			}
		} else {
			serializeObj[this.name] = this.value;
		}
	});
	return serializeObj;
};

/**
 * ajax 请求并返回 ajax 对象
 * @param {Object} url				请求地址
 * @param {Object} params			请求参数json格式
 * @param {Object} loading			是否显示loading交互效果，默认显示
 */
function doPost(url, params, loading) {
	if(typeof(loading) == 'undefined'){
		loading = true;
	}
	if(loading === true){
		$.showIndicator();
	}
	if(url.indexOf("?") >= 0){
		url = url + "&Rnd="+Math.random();
	}else{
		url = url + "?Rnd="+Math.random();
	}
	return $.ajax({
		url:url,
		type:'post',
		dataType:"json",
		data:params,
		cache: false,
		async: true,
		error: function(XMLHttpRequest, textStatus, errorThrown){
			if(XMLHttpRequest.status == 200){
				return;
			}
			if(textStatus === 'timeout'){
				$.toast('连接超时');
			}else if(textStatus === 'error'){
				$.toast('网络连接错误');
			}else if(textStatus === 'abort'){
				$.toast('网络连接中止');
			}else if(textStatus === 'parsererror'){
				$.toast('网络解析错误');
			}else{
				$.toast('网络连接错误');
			}

			if(loading == true){
				$.hideIndicator();
			}
			return false;
		},
		success: function(json){
			if(loading == true){
				$.hideIndicator();
			}
			return true;
		},
		complete: function(XMLHttpRequest, textStatus){
			if(loading == true){
				$.hideIndicator();
			}
			return true;
		}
	});
}

/**
 * ajax post请求,用于一般ajax请求，后台已key/value形式接收参数
 * @param {Object} url				请求地址
 * @param {Object} json_params		请求参数json格式
 * @param {Object} loading			是否展示加载提示，默认不显示
 * @param {Object} succ_callback	请求成功回调函数
 */
function doSubmit (url, params, loading) {
	if(typeof(loading) == 'undefined'){
		loading = true;
	}
	if(loading === true){
		$.showIndicator();
	}
	if(url.indexOf("?") >= 0){
		url = url + "&Rnd="+Math.random();
	}else{
		url = url + "?Rnd="+Math.random();
	}
	return $.ajax({
		url:url,
		type:'post',
		dataType:"json",
		contentType : 'application/json;charset=utf-8',
		data:JSON.stringify(params),
		cache: false,
		async: true,
		error: function(XMLHttpRequest, textStatus, errorThrown){
			if(textStatus === 'timeout'){
				$.toast('连接超时');
			}else if(textStatus === 'error'){
				$.toast('网络连接错误');
			}else if(textStatus === 'abort'){
				$.toast('网络连接中止');
			}else if(textStatus === 'parsererror'){
				$.toast('网络解析错误');
			}else{
				$.toast('网络连接错误');
			}
			
			if(loading == true){
				$.hideIndicator();
			}
			return false;
		},
		success: function(json){
			if(loading == true){
				$.hideIndicator();
			}
			return true;
		},
		complete: function(XMLHttpRequest, textStatus){
			if(loading == true){
				$.hideIndicator();
			}
			return true;
		}
	});
}

/**
 * 从URL地址中获取参数值
 * @param {Object} name参数名
 */
function getURLDecodeParameter(name){
    //构造一个含有目标参数的正则表达式对象  
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
	//匹配目标参数  
	var r = window.location.search.substr(1).match(reg);
	//返回参数值  
	if (r!=null) 
		return decodeURI(decodeURI(r[2]));
	return null;  
}

/**
 * 格式化金额
 * @param s	金额
 * @param n	小数点
 * @returns {String}
 */
function format_money_fen(s,n) { 
	if(!s){
		return "¥0.00";
	}else{
		s = s/100;
		if(n == 0){
			return "¥"+s; 
		}else{
			return "¥"+s.toFixed(2); 
		}
		
	}
}

/**
 * 分转元
 * @param {Object} s
 */
function fen_to_yuan(fen) { 
	if(!fen){
		return "0.00";
	}else{
		fen = fen / 100;
		return fen.toFixed(2); 
	}
}

function trim_undefined(v){
	if(v){
		return v;
	}
	return "";
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
    	fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
    	if (new RegExp("(" + k + ")").test(fmt)){
    		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    	} 
    }
    return fmt;
};

/** 日期相加天数 */
Date.prototype.dateAdd = function(strInterval, Number) {
	var dtTmp = this;
	switch (strInterval) {
	case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));
	case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));
	case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));
	case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));
	case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
	case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	}
}

/** 日期相加天数 */
Date.prototype.getWeekDay = function() {
	var day = this.getDay();
	
	switch (day) {
	case 0 :return "周日";
	case 1 :return "周一";
	case 2 :return "周二";
	case 3 :return "周三";
	case 4 :return "周四";
	case 5 :return "周五";
	case 6 :return "周六";
	}
}