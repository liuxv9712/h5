var charts = [];
$(function(){
	$('.sync-date').html(new Date().dateAdd('d',-1).Format('yyyy-MM-dd'));
	charts.push(new $.ProgressPie($('#chart1'),{guide:{date:new Date().dateAdd('d',-1)}}));
	charts.push(new $.ProgressPie($('#chart2'),{guide:{date:new Date().dateAdd('d',-2)}}));
	charts.push(new $.ProgressPie($('#chart3'),{guide:{date:new Date().dateAdd('d',-3)}}));
	charts.push(new $.ProgressPie($('#chart4'),{guide:{date:new Date().dateAdd('d',-4)}}));
	charts.push(new $.ProgressPie($('#chart5'),{guide:{date:new Date().dateAdd('d',-5)}}));
	charts.push(new $.ProgressPie($('#chart6'),{guide:{date:new Date().dateAdd('d',-6)}}));
	charts.push(new $.ProgressPie($('#chart7'),{guide:{date:new Date().dateAdd('d',-7)}}));
	
	queryWeekDangers();
	
	// 查询今日预警
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/findWarns.do'
	).done(function(res){
		if(res.code == 1000){
			$('.warn-item.yfx p.desc').html(res.data.yfx);
			$('.warn-item.lxst p.desc').html(res.data.lxst);
			$('.warn-item.ljst p.desc').html(res.data.ljst);
		}
		return;
	});
	
	// 图表点击事件
	$('.warn-item').on('click',function(){
		var type = $(this).attr('qtype');
		to_page('../students/stu-bzx-list.html',{qtype:type});
		return;
	});
	
	// 近一周风险点击事件
	$('.week-danger li').on('click',function(){
		var canvas = $(this).find('canvas');
		if(canvas){
			var cdate = $(canvas).data('ProgressPie').getGuidDate().Format('yyyy-MM-dd hh:mm:ss');
			to_page('../students/stu-bzx-list.html',{qtype:'date',cdate:cdate});
		}
		return;
	});
	
	
	// 显示全部
	$('.btn-sta-all').on('click',function(){
		var height = $(this).parents('ul').height();
		if(!$('.sta-more').hasClass('open')){
			$('.sta-more').css('display','flex');
			$('.sta-more').height(0).animate({height: height,marginTop:'0.75rem'});
			$(this).html("收起");
			$('.sta-more').addClass('open');
		}else{
			$('.sta-more').animate({height: "0",marginTop:"0"},function(){
				$(this).css('display','none');
			});
			$(this).html("全部");
			$('.sta-more').removeClass('open');
		}
	});
	
});

/**
 * 查询近一周风险
 */
function queryWeekDangers(){
	var allCount = 0;
	doPost(
		DEF_GLOBAL_DOMAIN + '/orgs/students/countMyStudents.do'
	).then(function(res){
		if(res.code == 1000){
			return res.data;
		}else{
			return 0;
		}
	}).then(function(res){
		allCount = res;
		if(allCount > 0){
			return doPost(
				DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/queryGroupDay.do'
			);
		}
	}).then(function(res){
		$(charts).each(function(index,item){
			var t = item.getGuidDate().Format('yyyy-MM-dd');
			var d;
			if(res && res.data){
				$(res.data).each(function(idx, ite){
					var tt = new Date(ite.cdate.replace(/-/ig,'/')).Format('yyyy-MM-dd');
					if(t === tt){
						d = {
							guide:{
								all:allCount,
								zc:(allCount - ite.bzxCount)
							},
							chartDatas:[{
								x: '1',
								y: parseFloat(((allCount - ite.bzxCount) / allCount) * 100)
							}]
						}
						return false;
					}
				});
			}
			if(d){
				item.changeData(d);
			}else{
				item.changeData({
					guide:{
						all:allCount,
						zc:allCount
					},
					chartDatas:[{
						x: '1',
						y: 100
					}]
				});
			}
		});
	});
}