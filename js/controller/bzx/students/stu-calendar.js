var xh;
var bzxDatas = {};
$(function(){
	$.init();
	
	// 获取学号参数
	xh = getURLDecodeParameter('xh');
	
	// 学生基本信息
	doPost(
		DEF_GLOBAL_DOMAIN + '/orgs/students/findStudentsByXH.do',
		{xh:xh}
	).done(function(res){
		if(res.code == 1000){
			$('.stu-xm').html(res.data.xm);
			$('.stu-xh').html(res.data.xh);
			$('.stu-bjmc').html(res.data.bjmc);
		}
		return;
	});
	
	$('.btn-stu-detail').on('click',function(){
		to_page('stu-details.html',{xh:xh});
		return;
	});
	
	// 日历
	$('.cust-calendar').CduCalendar({
		multiple:false,
		onChange: function(p, values, displayValues) {
			pickDate(p.params.multiple);
			return;
		},
		onMonthYearChangeEnd:function(p, currentYear, currentMonth){
			$('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
			var sDate = new Date(currentYear, currentMonth, 1);
			var eDate = new Date(currentYear, currentMonth + 1, 0);
			queryBzxCalendar(sDate, eDate);
			return;
		},
		onOpen:function(p){
			var date = new Date();
			var sDate = new Date(date.getFullYear(), date.getMonth(), 1);
			var eDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			queryBzxCalendar(sDate, eDate);
			return;
		},
		onDayClick:function(p, day, dateYear, dateMonth, dateDay){
			//如果是反馈则进行反馈逻辑，否做显示条目数据
			if(p.params.multiple === true && $('.feedback').is(':visible')){
				if($(day).hasClass('calendar-day-done') || !$(day).hasClass('point-danger')){
					$.toast('请正确选择未处理过的异常日期');
					return false;
				}
				return true;
			}else{
				// 显示条目异常数据
				var d = new Date($(day).attr('data-date').replace(/-/ig,'/'));
				d.setMonth(d.getMonth() + 1);
				showDateInfo(d.Format('yyyy-MM-dd'));
				return true;
			}
		}
	});
	
	$('.feedback-calendar').CduCalendar({
		multiple:true
	});
	
	// 处理
	$('.btn-feedback').on('click', function() {
		$('.feedback').show();
		$('.feedback').animate({
			height: '15.75rem'
		});
		
		// 设置未多选+清空已选数据
		$('.cust-calendar').data('cducalendar').setMultiple(true);
		$('.cust-calendar').data('cducalendar').setValue([]);
		$('.picker-calendar-month-current .picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
		return;
	});
	
	// 取消反馈
	$('.btn-f-cancel').on('click',function(){
		hideFeedbackPanel();
		return;
	});
	
	// 提交反馈
	$('.btn-f-submit').on('click',function(){
		var selected = $('.picker-calendar-month-current .picker-calendar-day-selected.point-danger').not('.picker-calendar-day-done');
		if(selected.length < 1){
			$.toast('请选择日期');
			return false;
		}
		
		var reason = $('input[name=reason]').val();
		if(!reason){
			$.toast('请选择原因');
			return false;
		}
		var params = {
			xh:xh,
			reason:reason,
			bzxRecordIds:[],
			cdates:[]
		};
		$(selected).each(function(index,item){
			var d = new Date($(item).attr('data-date').replace(/-/ig,'/'));
			d.setMonth(d.getMonth() + 1);
			if(bzxDatas[d.Format('yyyy-MM-dd')]){
				params.bzxRecordIds.push(bzxDatas[d.Format('yyyy-MM-dd')].id);
				params.cdates.push(bzxDatas[d.Format('yyyy-MM-dd')].cdate);
				
				bzxDatas[d.Format('yyyy-MM-dd')].fdyTag = reason;
			}
		});
		if(params.bzxRecordIds.length < 1){
			$.toast('操作数据有误，请尝试刷新后再试!');
			return false;
		}
		
		// 提交
		doPost(
			DEF_GLOBAL_DOMAIN + '/bzx/bzxRecord/feedback.do',
			params
		).done(function(res){
			if(res.code == 1000){
				$.toast('处理成功');
				$(selected).each(function(index,item){
					$(item).removeClass('picker-calendar-day-selected');
					$(item).removeClass('point-danger');
					$(item).addClass('picker-calendar-day-done');
				});
				
				hideFeedbackPanel();
			}else{
				$.toast(res.message);
			}
			return;
		});
		return;
	});
	
	// 选择原因
	$('.item-link.reason-actions').on('click',function(){
		var target = $(this);
		var buttons1 = [{
			text: '快速处理',
			bold: true,
			label: true
		}, {
			text: '非正常离校',
			color: 'danger',
			onClick: function(modal, e) {
				pickReason(target, -1, e.target.innerText)
			}
		}, {
			text: '请假',
			onClick: function(modal, e) {
				pickReason(target, 2, e.target.innerText)
			}
		}, {
			text: '实习',
			onClick: function(modal, e) {
				pickReason(target, 3, e.target.innerText)
			}
		}, {
			text: '出国留学',
			onClick: function(modal, e) {
				pickReason(target, 4, e.target.innerText)
			}
		}, {
			text: '暂未返校',
			onClick: function(modal, e) {
				pickReason(target, 5, e.target.innerText)
			}
		}, {
			text: '其他',
			bold: true,
			onClick: function(modal, e) {
				pickReason(target, 1, e.target.innerText)
			}
		}];
		var buttons2 = [{
			text: '取消',
			bg: 'danger'
		}];
		var groups = [buttons1, buttons2];
		$.actions(groups);
	});
	
});

/**
 * 隐藏反馈面板
 */
function hideFeedbackPanel(){
	$('.cust-calendar').data('cducalendar').setMultiple(false);
	$('.feedback').animate({
		height: 0
	},function(){
		$('.feedback').hide();
	});
	return;
}

/**
 * 选择日期
 * @param {Object} multiple	日历当前是否未多选模式，true=多选模式,false=单选模式
 */
function pickDate(multiple){
	if(multiple === true && $('.feedback').is(':visible')){
		var selected = $('.picker-calendar-month-current .picker-calendar-day-selected.point-danger').not('.picker-calendar-day-done');
		if(selected.length == 0){
			$('.data-scope').html('');
		}else if(parseInt($(selected).first().attr('data-day')) == parseInt($(selected).last().attr('data-day'))){
			$('.data-scope').html($(selected).first().attr('data-month')+'-'+$(selected).first().attr('data-day'));
		}else{
			$('.data-scope').html($(selected).first().attr('data-month')+'-'+$(selected).first().attr('data-day') + '~' + 
								$(selected).last().attr('data-month')+'-'+$(selected).last().attr('data-day'));
		}
	}
	return;
}

/**
 * 选择原因
 * @param {Object} target
 * @param {Object} reason
 */
function pickReason(target, reason, reasonText){
	$('input[name=reason]').val(reason);
	$(target).find('.item-after').html(reasonText);
	return;
}

/**
 * 展示指定日期的不在校详情
 */
function showDateInfo(cdata){
	var bzx = bzxDatas[cdata];
	if(bzx){
		$('.dk').html(bzx.fdyTag?'已反馈:'+getFdyTagText(bzx.fdyTag): (bzx.extCount1 > 0?'正常':'<span class="color-danger">异常</span>'));
		$('.ykt').html(bzx.fdyTag?'已反馈:'+getFdyTagText(bzx.fdyTag): (bzx.yktCount > 0?'正常':'<span class="color-danger">异常</span>'));
		$('.sw').html(bzx.fdyTag?'已反馈:'+getFdyTagText(bzx.fdyTag): (bzx.swCount > 0?'正常':'<span class="color-danger">异常</span>'));
		$('.tx').html(bzx.fdyTag?'已反馈:'+getFdyTagText(bzx.fdyTag): (bzx.txCount > 0?'正常':'<span class="color-danger">异常</span>'));
		$('.mj').html(bzx.fdyTag?'已反馈:'+getFdyTagText(bzx.fdyTag): (bzx.mjCount > 0?'正常':'<span class="color-danger">异常</span>'));
		// $('.sk').html(bzx.skCount > 0?'正常':'<span class="color-danger">异常</span>');
		// $('.pc').html(bzx.pcCount > 0?'正常':'<span class="color-danger">异常</span>');
		
		$('.rlsb').html('暂未开放');
		$('.sk').html('暂未开放');
		$('.pc').html('暂未开放');
	}else{
		$('.dk').html('暂无数据');
		$('.ykt').html('暂无数据');
		$('.sw').html('暂无数据');
		$('.tx').html('暂无数据');
		$('.mj').html('暂无数据');
		
		$('.rlsb').html('暂未开放');
		$('.sk').html('暂未开放');
		$('.pc').html('暂未开放');
	}
	
	return;
}

/**
 * 按日期查询不在校记录列表
 * 默认查询一个月的
 */
function queryBzxCalendar(sDate, eDate){
	bzxDatas = [];
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxRecord/findBzxCalendar.do',
		{xh:xh, sDate:sDate.Format('yyyy-MM-dd hh:mm:ss'), eDate:eDate.Format('yyyy-MM-dd hh:mm:ss')}
	).then(function(res){
		if(res.code == 1000){
			var datas = [];
			$(res.data).each(function(index,item){
				//临时参数存储
				bzxDatas[new Date(item.cdate.replace(/-/ig,'/')).Format('yyyy-MM-dd')] = item;
				
				//定义日历标记信息
				var c = {
							date:new Date(item.cdate.replace(/-/ig,'/')).Format('yyyy-MM-dd'),
							tag:(item.calcFlag > 0?'point-success':'point-danger')
						};
				if(item.fdyTag){
					c.tag = c.tag + ' picker-calendar-day-done';
				}
				datas.push(c);
			});
			
			$('.cust-calendar').data('cducalendar').markTag(datas);
		}
		return;
	}).done(function(res){
		var cdate = new Date().Format('yyyy-MM-dd');
		showDateInfo(cdate);
		return;
	});
}

function getFdyTagText(fdyTag){
	if(fdyTag == 1){
		return '其他';
	}else if(fdyTag == 2){
		return '请假';
	}else if(fdyTag == 3){
		return '实习';
	}else if(fdyTag == 4){
		return '出国留学';
	}else if(fdyTag == 5){
		return '暂未返校';
	}else if(fdyTag == -1){
		return '非正常离校';
	}
	return '';
}


