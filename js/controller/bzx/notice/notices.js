var devWidth = window.screen.width + 20;
var IS_LOADING = false; 	//数据加载中标识
var IS_LAST_PAGE = false; 	//判断是否是最后一页
var NEXT_PAGE; 				//下一页页码

$(function() {
	$.init();

	// 查询列表
	queryRemindPage();


	// 处理按钮操作
	$('.cards-list').on('click', '.btn-feedback', function() {
		var target = $(this).parents('.remind');

		var buttons1 = [{
			text: '快速处理',
			bold: true,
			label: true
		}, {
			text: '非正常离校',
			color: 'danger',
			onClick: function() {
				process(target, -1)
			}
		}, {
			text: '请假',
			onClick: function() {
				process(target, 2)
			}
		}, {
			text: '实习',
			onClick: function() {
				process(target, 3)
			}
		}, {
			text: '出国留学',
			onClick: function() {
				process(target, 4)
			}
		}, {
			text: '暂未返校',
			onClick: function() {
				process(target, 5)
			}
		}, {
			text: '其他',
			bold: true,
			onClick: function() {
				process(target, 1)
			}
		}];
		var buttons2 = [{
			text: '取消',
			bg: 'danger'
		}];
		var groups = [buttons1, buttons2];
		$.actions(groups);
	});

	/** 标签页点击事件 */
	$('.tab-link').on('click', function(e) {

		//切换tab时，删除上个tab页的无限滚动事件
		$.detachInfiniteScroll($('.infinite-scroll.active'));

		//为当前tab页增加无限滚动事件
		var _c_t = $(this).attr('href');
		_c_t = _c_t.substr(1, _c_t.length - 1);
		$.attachInfiniteScroll($('#' + _c_t));

		//加载数据
		if ($('#' + _c_t).find('.infinite-scroll-preloader').length > 0) {
			NEXT_PAGE = 1;
			queryRemindPage($('#' + _c_t), NEXT_PAGE);
		}
		return;
	});
	
	/** 无限滚动事件 */
	$(document).on('infinite', function(e) {
		e.preventDefault();
		if(IS_LOADING){
			return false;
		}
		IS_LOADING = true;
		setTimeout(function() {
			if(!IS_LAST_PAGE){
				queryRemindPage(null,NEXT_PAGE);
			}
			IS_LOADING = false;
		}, 1000);
	});
	

});


/**
 * 处理不在校记录 
 */
function process(target, reason) {
	var re = target.data('record');
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxRemind/quickFeed.do', {
			remindId: re.id,
			reason: reason
		}
	).then(function(res) {
		if (res.code == 1000) {
			addRemindCount(-1);
			
			var clone = $(target).clone();
			$(clone).find('.btn-feedback').remove();
			$(clone).find('.info').append("<p>已反馈："+ getReasonText(re.reason) + '</p>');
			
			
			$(target).animate({
				right: devWidth
			}, function() {
				if($('#ycl .remind').length > 0){
					$('#ycl .rbox').prepend(clone);
				}
				$(target).remove();
			});
		} else {
			$.toast(res.message);
		}
		return;
	});
	return;
}


/**
 * 分页查询记录
 * @param {Object} sp
 */
function queryRemindPage(actTab, sp) {
	if (!actTab) {
		actTab = $('.infinite-scroll.active');
	}
	if (!sp) {
		sp = 0
	}
	
	var params = {startPage: sp,pageSize: 20,days: 1};
	if($(actTab).attr('id') == 'dcl'){
		params.status = 0;
	}else if($(actTab).attr('id') == 'ycl'){
		params.status = 1;
	}
		
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxRemind/findMyRemindPage.do', 
		params,
		false
	).done(function(res) {
		if (res.code == 1000 && res.data.records > 0) {
			$(res.data.resultList).each(function(index, item) {
				appendItem(actTab,item);
			});


			//加载结束后判断是否还有下一页，如果没有则注销无限滚动事件
			if (!res.data.hasNext) {
				IS_LAST_PAGE = true;
				$.detachInfiniteScroll($(actTab)); //注销无限滚动
				$(actTab).find('.infinite-scroll-preloader').remove(); //删除加载提示
				$(actTab).find('ul.rbox').show_divide_line();
			} else {
				IS_LAST_PAGE = false;
				NEXT_PAGE = res.data.nextPage;
			}

		} else {
			$(actTab).find('ul.rbox').append_no_data('暂无提醒记录');
			$.detachInfiniteScroll($(actTab)); //注销无限滚动
			$(actTab).find('.infinite-scroll-preloader').remove(); //删除加载提示
		}
		return;
	});

	return;
}



/**
 * dom 添加元素
 * @param {Object} actTab
 * @param {Object} item
 */
function appendItem(actTab, item){
	var li = $('<li class="card remind"></li>');
	$(li).append('<div class="card-header">' +
				'	<a class="user-info external" href="../students/stu-details.html">' +
				'		<img src="../../../img/def-head.png" />' +
				'		<span>' + item.xm + '</span>' +
				'	</a>' +
				'	<span class="iconfont icon-gengduo btn-feedback" style="display: none;"></span>' +
				'</div>');
	if(item.status == 0){
		$(li).find('.btn-feedback').show();
	}
	$(li).append('<div class="card-content">' +
				'	<div class="card-content-inner">' +
				'		<div class="infos">' +
				'			<p class="label">温馨提示</p>' +
				'			<p class="danger">' + item.bjmc + '班的' + item.xm + '同学已连续' + parseInt(DateDiff(item.sdate,item.edate) + 1) + '天疑似不在校请尽快确认！</p>' +
				'		</div>' +
				'	</div>' +
				'</div>');
		
	if(item.status == 1){
		$(li).find('.infos').append("<p>已反馈："+ getReasonText(item.reason) + '</p>');
	}
	$(li).append('<div class="card-footer">' +
				'	<span>更新：'+new Date(item.updateTime.replace(/-/ig,'/')).Format('yyyy-MM-dd')+'</span>'+
				'	<a href="../students/stu-calendar.html?xh='+item.xh+'" class="external">月历</a>'+
				'</div>');
	$(li).data('record', item);
	$(actTab).find('ul.rbox').append(li);
	
	return;
}


function getReasonText(reason){
	return (reason==-1?'非正常离校':(reason == 1)?'其他':(reason == 2)?'请假':(reason == 3)?'实习':(reason == 2)?'出国留学':(reason == 2)?'暂未返校':'');
}


/**
 * 计算两个日期之间相差的天数
 * @param {Object} sDate
 * @param {Object} eDate
 */
function DateDiff(sDate, eDate) { //sDate和eDate是yyyy-MM-dd格式
	var date1 = new Date(sDate);
	var date2 = new Date(eDate);
	var date3 = date2.getTime() - date1.getTime();
	var days = Math.floor(date3 / (24 * 3600 * 1000));
	return days;
}
