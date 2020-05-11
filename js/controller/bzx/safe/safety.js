var lines,topbar,classes;
$(function() {
	lines = new $.SevenLine($('#seven-day-lines'));
	topbar = new $.TopBar($('#top-10-bar'));
	classes = new $.ClassPie($('#class-month-pie'));
	
	$('.button').on('click',function(){
		if(!$(this).hasClass('active')){
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
			
			if($(this).hasClass('lines')){
				loadSevenChartData();
			}else if($(this).hasClass('tops')){
				loadTopChartData();
			}else if($(this).hasClass('pies')){
				loadClassChartData();
			}
		}
	});
	
	// 选择日期
	$('.sync-date').html(new Date().dateAdd('d',-1).Format('yyyy-MM-dd'));
	$("input[name=pick-date]").calendar({
		monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		onChange:function(p, values, displayValues){
			const pickDate = new Date(displayValues[0]+' 23:59:59'.replace(/-/ig,'/'));
			if(pickDate < new Date()){
				$('.sync-date').html(displayValues[0]);
				queryReport();
			}else{
				$.toast('选择日期不能大于当前日期');
			}
			$(p.input).show();
		}
	});
	
	// 报表查询
	queryReport();
});


/**
 * 报表查询
 */
function queryReport(){
	// 数值预警
	loadNumChartData();
	
	// 七天走势
	loadSevenChartData();
	
	// 近1个月累计不在校top 10
	loadTopChartData();
	
	// 近30天不在校风险班级统计
	loadClassChartData();
	return;
}

/**
 * 数值预警
 */
function loadNumChartData(){
	var qdate = new Date($('.sync-date').html().replace(/-/ig,'/'));
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/findRangeWarns.do',
		{qdate:qdate.Format('yyyy-MM-dd hh:mm:ss')}
	).done(function(res) {
		if (res.code == 1000) {
			$('.lx-num').html(res.data.lxst);
			if (res.data.lxst >= 1) {
				$('.lx-num').addClass('warn');
			}
			$('.lj-num').html(res.data.ljst);
			if (res.data.ljst >= 1) {
				$('.lj-num').addClass('warn');
			}
		}
		return;
	});
}


/**
 * 7天走势
 */
function loadSevenChartData(){
	var edate = new Date($('.sync-date').html().replace(/-/ig,'/'));
	
	var chartdatas = [];
	var day = $('.lines.button.active').attr('day');
	for(var i = day; i > 0; i--){
		chartdatas.push({
			date: edate.dateAdd('d', (i - 1) * -1),
			name:edate.dateAdd('d', (i - 1) * -1).Format('M-d'),
			value: 0
		});
	}
	
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/queryGroupDay.do',
		{sdate:edate.dateAdd('d',(day - 1 ) * -1).Format('yyyy-MM-dd hh:mm:ss'), edate:edate.Format('yyyy-MM-dd hh:mm:ss')}
	).done(function(res) {
		if (res.code == 1000 && res.data) {
			$(chartdatas).each(function(index, item) {
				$(res.data).each(function(idx, ite) {
					var tt = new Date(ite.cdate.replace(/-/ig,'/')).Format('yyyy-MM-dd');
					if (item.date.Format('yyyy-MM-dd') === tt) {
						item.value = ite.bzxCount;
						return false;
					}
				});
			});
			lines.changeData(chartdatas);
		}else{
			lines.showEmpty();
		}
		return;
	}).fail(function(res){
		lines.showEmpty();
	});
}

/**
 * 近1个月累计不在校top 10
 */
function loadTopChartData(){
	var edate = new Date($('.sync-date').html().replace(/-/ig,'/'));
	var day = $('.tops.button.active').attr('day');
	
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/queryTopStu.do',
		{top:10, sdate:edate.dateAdd('d',(day - 1) * -1).Format('yyyy-MM-dd hh:mm:ss'), edate:edate.Format('yyyy-MM-dd hh:mm:ss')}
	).done(function(res){
		if(res.code == 1000 && res.data){
			var data = [];
			$(res.data).each(function(index,item){
				data.push({
					xm:item.xm,
					bzxcount:item.bzxCount
				})
			});
			topbar.changeData(data.reverse());
		}else{
			topbar.showEmpty();
		}
		return;
	}).fail(function(res){
		topbar.showEmpty();
	});
}


/**
 * 近30天不在校风险班级统计
 */
function loadClassChartData(){
	var edate = new Date($('.sync-date').html().replace(/-/ig,'/'));
	var day = $('.pies.button.active').attr('day');
	
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/bzxReport/queryGroupClass.do',
		{sdate:edate.dateAdd('d',(day - 1) * -1).Format('yyyy-MM-dd hh:mm:ss'), edate:edate.Format('yyyy-MM-dd hh:mm:ss')}
	).done(function(res){
		if(res.code == 1000 && res.data){
			var sum  = _.sumBy(res.data, function(o) { return o.bzxCount; });
			var data = [];
			var tip = [];
			$(res.data).each(function(index,item){
				data.push({
					name: item.bjmc,
					percent: parseFloat((item.bzxCount / sum).toFixed(2)),
					a: '1'
				});
				
				tip.push(item.bjmc, parseFloat(((item.bzxCount / sum) * 100).toFixed(2)) + '%');
			});
			
			classes.changeData({
				chartData: data,
				legendTips: tip
			});
		}else{
			classes.showEmpty();
		}
		return;
	}).fail(function(res){
		classes.showEmpty();
	});
}
