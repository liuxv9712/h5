var IS_LOADING = false; //数据加载中标识
var IS_LAST_PAGE = false; //判断是否是最后一页
var NEXT_PAGE; //下一页页码

$(function() {
	$.init();

	query_stu_page();

	// 工具筛选
	$('.btn-filter').on('click', function() {
		$.openPanel("#panel-js-demo");
	});

	// 查看详情
	$('.stu-list').on('click','.stu-item',function(){
		var stu = $(this).data('record');
		to_page('stu-calendar.html',{xh:stu.xh});
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
		query_stu_page();
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
				query_stu_page(NEXT_PAGE);
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
function query_stu_page(sp) {
	var params = $('.search-form').serializeJson();
	params.pageSize = 20;
	if (sp) {
		params.startPage = sp;
	}else{
		params.startPage = 0;
	}
	
	doPost(
		DEF_GLOBAL_DOMAIN + '/orgs/students/findMyStudentsPage.do',
		params
	).done(function(res){
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
	$('.infinite-scroll').find('.divide-line').remove();						
	return;
}