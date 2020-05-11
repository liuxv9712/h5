var whiter;
$(function() {
	$.init();
	whiter = getURLDecodeParameter('whiter');
	if(whiter){
		
	}
	
	// 原因
	$('input[name=reasonTypeText]').picker({
		toolbarTemplate: '<header class="bar bar-nav">\
							<button class="button button-link pull-right close-picker">确定</button>\
							<h1 class="title">选择原因</h1>\
						</header>',
		cols: [{
				textAlign: 'center',
				values: [1, 10],
				displayValues: ['请假','其他']
			}],
		formatValue: function (picker, value, displayValue){
			$('input[name=reasonType]').val(value[0]);
			$('input[name=reasonType]').trigger('propertychange');
			return displayValue[0];
		}
	});
	
	// 取消
	$('.btn-cancel').on('click',function(){
		window.history.go(-1);
		return;
	});	
	
	// 保存
	$('.btn-ok').on('click',function(){
		if($(this).hasClass('disabled')){
			return;
		}
		$(this).addClass('disabled');
		var btn = $(this);
		var params = $('.whiter-set-form').serializeJson();
		params.xh = getURLDecodeParameter('xh');
		
		doSubmit(
			DEF_GLOBAL_DOMAIN + '/bzx/whiters/setWhiters.do',
			params
		).done(function(res){
			if(res.code == 1000){
				$.alert('设置成功',function () {
					window.history.go(-1);
				});
			}else{
				$.alert(res.message);
				$(btn).removeClass('disabled');
			}
			return;
		});
		return;
	});
	
	// 日期选择
	$('input[name=endDate],input[name=startDate]').calendar({
		monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		onClose: function(p) {
			p.input.trigger('propertychange');
			return;
		}
	});
	
	// 表单监听
	$('input').on('input propertychange', function() {
		var flag = 0;
		$.each($('.whiter-set-form').serializeArray(),function(i,item){
			if(item.name == 'other'){
				return true;
			}
			if(item.name != 'reasonTypeText'){
				if(!item.value || item.value == '' || item.value.length < 1) {
					flag = 1;
					return false;
				}
			}
		});
		
		if(flag == 0){
			$('.btn-ok').removeClass('disabled');
		}else{
			$('.btn-ok').addClass('disabled');
		}
	    return;
	});
	
});
