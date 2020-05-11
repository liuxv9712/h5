var IS_LOADING = false; //数据加载中标识
var IS_LAST_PAGE = false; //判断是否是最后一页
var NEXT_PAGE; //下一页页码
var qtype;
$(function() {
	$.init();
	qtype = getURLDecodeParameter('qtype');
	
	query_bzx_page();

	// 工具筛选
	$('.btn-filter').on('click', function() {
		$.openPanel("#panel-js-demo");
	});

	// 查看详情
	$('.stu-list ul').on('click','.stu-item',function(){
		var stu = $(this).data('record');
		to_page('stu-details.html',{stuid:stu.id,xh:stu.xh});
		return;
	});
	
	// 标签切换
	$('.tags ul li').on('click',function(){
		if(!$(this).hasClass('active')){
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
			
			//重新加载学生列表
			$('.stu-list ul').empty();
			$('.divide-line').remove();
			query_bzx_page();
		}
		return;
	});
	
	
	// 模糊查询
	$('input[name=xh]').bind("input propertychange", function(e) {
		if($(this).val().length > 3 || $(this).val().length < 1 ){
			
			setTimeout(function(){
				resetPage();
				query_stu_page();
			},500);
		}
	});
	
	// 按班级编码查询
	$('.btn-search').on('click',function(){
		$.closePanel();
		resetPage();
		query_bzx_page();
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
				query_bzx_page(NEXT_PAGE);
			}
			IS_LOADING = false;
		}, 1000);
	});
});


function resetPage(){
	$('.stu-list').empty();
	$('.stu-list').append('<ul></ul>');
	
	if($('.infinite-scroll').find('.infinite-scroll-preloader').length < 1){
		$.attachInfiniteScroll($('.infinite-scroll'));
		$('.infinite-scroll').append('<div class="infinite-scroll-preloader">'+
									'	<div class="preloader">'+
									'	</div>'+
									'</div>');
	}
	return;
}


/**
 * 分页查询学生列表
 * @param {Object} sp 起始页码
 */
function query_bzx_page(sp) {
	var params = $('.search-form').serializeJson();
	params.pageSize = 20;
	if (sp) {
		params.startPage = sp;
	}else{
		params.startPage = 0;
	}
	
	var url; 
	const qtype = getURLDecodeParameter('qtype');
	if(qtype == 'date'){
		url = DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/findBzxPage.do';
		var cdate = getURLDecodeParameter('cdate');
		if(cdate){
			params.cdate = cdate;
		}
	}else if(qtype == 'lx'){
		url = DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/findLxBzxPage.do';
		var days = getURLDecodeParameter('days');
		if(days){
			params.days = days;
		}
	}else if(qtype == 'lj'){
		url = DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/findLjBzxPage.do';
		var days = getURLDecodeParameter('days');
		if(days){
			params.days = days;
		}
	}
	
	console.log(params);
	doPost(
		url,
		params
	).done(function(res){
		console.log(res);
		if (res.code == 1000) {
			if (res.data.records > 0) {
		
				$(res.data.resultList).each(function(index, item) {
					var _li = $('<li class="item-link item-content stu-item"></li>');
					$(_li).append(
									'<div class="item-media"><img src="../../../img/def-head.png"></div>'+
									'<div class="item-inner">'+
									'	<div class="item-title-row">'+
									'		<div class="item-title">'+item.xm+'</div>'+
									'	</div>'+
									'	<div class="item-subtitle">'+item.xh+'</div>'+
									'	<div class="item-subtitle">'+item.bjmc+'</div>'+
									'</div>');
					$(_li).data('record',item);
					$('.stu-list ul').append(_li);
				});
		
				//加载结束后判断是否还有下一页，如果没有则注销无限滚动事件
				if (!res.data.hasNext) {
					IS_LAST_PAGE = true;
					$.detachInfiniteScroll($('.infinite-scroll')); //注销无限滚动
					$('.infinite-scroll').find('.infinite-scroll-preloader').remove(); //删除加载提示
					$('.stu-list').show_divide_line();
				} else {
					IS_LAST_PAGE = false;
					NEXT_PAGE = res.data.nextPage;
				}
		
				return true;
			} else {
				append_empty_order();
				return false;
			}
		} else {
			append_empty_order();
			return false;
		}
	});

}


/**
 * 显示空订单页面
 */
function append_empty_order(){
	$('.stu-list ul').remove();
	$('.stu-list').append_no_data('暂未查询到数据');
	$.detachInfiniteScroll($('.infinite-scroll'));								//注销无限滚动
	$('.infinite-scroll').find('.infinite-scroll-preloader').remove();			//删除加载提示
}