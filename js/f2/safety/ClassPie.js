(function($) {

	$.ClassPie = function(el, option) {
		var canvas = $(el);
		canvas.settings = $.extend({}, $.ClassPie.default, option);
		// 设置样式
		var funs = {};
		funs = {
			initChart: function() {

				canvas.settings.chart = new F2.Chart({
					id: $(canvas).attr('id'),
					pixelRatio: window.devicePixelRatio
				});
				// canvas.settings.chart.source([], {
				// 	percent: {
				// 		formatter: function formatter(val) {
				// 			return val * 100 + '%';
				// 		}
				// 	}
				// });
				canvas.settings.chart.legend(false);
				canvas.settings.chart.axis(false);
				canvas.settings.chart.tooltip(false);
				canvas.settings.chart.coord('polar', {
					transposed: true,
					radius: 0.9,
					innerRadius: 0.5
				});

				canvas.settings.chart.guide().html({
					position: ['50%', '50%'],
					html: '<div style="text-align: center;width:150px;height: 50px;">\n      <p style="font-size: 12px;color: #999;margin: 0" id="title"></p>\n      <p style="font-size: 18px;color: #343434;margin: 0;font-weight: bold;" id="percent"></p>\n </div>'
				});
				canvas.settings.chart.interval()
					.position('a*percent')
					.adjust('stack')
					.color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14'])
					.animate({
						appear: {
							duration: 1200,
							easing: 'bounceOut'
						}
					});

				canvas.settings.chart.pieLabel({
					sidePadding: 30,
					activeShape: true,
					label1: function label1(data) {
						return {
							text: data.percent,
							fill: '#343434',
							fontWeight: 'bold'
						};
					},
					label2: function label2(data) {
						return {
							text: data.name,
							fill: '#999'
						};
					},
					onClick: function onClick(ev) {
						var data = ev.data;
						if (data) {
							$('#title').text(data.name);
							$('#percent').text(data.percent);
						}
					}
				});

				// canvas.settings.chart.interval().position('a*percent').color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864',
				// 	'#8543E0'
				// ]).adjust('stack').style({
				// 	lineWidth: 1,
				// 	stroke: '#fff',
				// 	lineJoin: 'round',
				// 	lineCap: 'round'
				// }).animate({
				// 	appear: {
				// 		duration: 1200,
				// 		easing: 'bounceOut'
				// 	}
				// });

				canvas.settings.chart.render();
			}

		}

		// 展示空数据
		this.showEmpty = function() {
			$(canvas).hide();
			if ($(canvas).parent().find('.empty-data').length == 0) {
				$(canvas).parent().append(
					'<div class="empty-data" style="min-height: 4rem;text-align: center;margin: 1rem 0;">' +
					'	<svg t="1587970233169" class="icon" viewBox="0 0 1638 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6437" width="72" height="72"><path d="M0 844.8c0 97.45 361.097 176.47 806.537 176.47s806.502-79.02 806.502-176.47c0-97.417-361.097-176.401-806.502-176.401C361.097 668.399 0 747.383 0 844.8z" fill="#F5F5F5" p-id="6438"></path><path d="M1398.784 580.164H214.254V330.65l259.62-294.878C486.4 13.107 509.132 0.478 531.796 0.478h549.445c22.698 0 45.397 12.63 60.484 37.82l257.092 292.352v249.514zM239.479 555.008h1134.149V338.261L1121.553 50.86c-12.561-17.613-25.19-27.648-40.311-27.648H531.797c-15.12 0-27.716 10.069-37.82 25.19L239.446 340.753v214.22z" fill="#D9D9D9" p-id="6439"></path><path d="M1048.474 413.833c0-40.312 25.19-73.08 55.466-73.08h282.283v456.192c0 52.907-32.768 98.304-75.64 98.304H302.455c-40.345 0-75.605-42.871-75.605-98.304V340.753h282.283c30.242 0 55.432 32.768 55.432 73.08s25.19 73.079 55.433 73.079H993.04c30.242 2.526 55.433-32.768 55.433-73.08z" fill="#FAFAFA" p-id="6440"></path><path d="M1310.583 907.844H302.455c-47.889 0-88.234-50.415-88.234-110.933V328.192h294.912c37.785 0 68.028 37.786 68.028 85.675 0 32.768 20.138 60.484 42.837 60.484H993.04c22.665 0 42.837-27.716 42.837-60.484 0-47.89 30.243-85.675 68.062-85.675h294.878v468.787c0 60.484-37.82 110.9-88.235 110.9zM239.445 353.348v443.597c0 47.89 27.717 85.675 63.01 85.675h1008.128c35.294 0 63.01-37.786 63.01-85.675V353.348H1103.94c-22.698 0-42.871 27.717-42.871 60.485 0 47.889-30.242 85.674-68.028 85.674H619.998c-37.786 0-68.028-37.785-68.028-85.674 0-32.768-20.139-63.01-42.837-63.01H239.445v2.525z" fill="#D9D9D9" p-id="6441"></path></svg>' +
					'	<div style="color: #bfbfbf;">暂无数据</div>' +
					'</div>');
			}
			return;
		}


		// 更改数据
		this.changeData = function(data) {
			if (!$.isEmptyObject(data) && !$.isEmptyObject(data.chartData)) {
				$(canvas).show();
				$(canvas).parent().find('.empty-data').remove();
				canvas.settings.chart.changeData(data.chartData);
			} else {
				this.showEmpty();
			}
			return;
		}


		// 初始化图表
		funs.initChart();
	};


	$.ClassPie.default = {
		chart: null,
		background: '#FFFFFF'
	}

})($);
