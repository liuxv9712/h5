// 进度

(function ($) {
	
	$.ProgressPie = function (el, option) {
		$(el).data('ProgressPie',this);
		var canvas = $(el);
		canvas.settings =  $.extend({},$.ProgressPie.default ,option);
		// 设置样式
		canvas.css({
						'background':canvas.settings.background,
						'box-shadow':canvas.settings.boxShadow,
						'border-radius':canvas.settings.borderRadius,
						'border':canvas.settings.border});
		var funs = {};
		funs = {
			initChart:function(){
				
				canvas.settings.chart = new F2.Chart({
					id: $(canvas).attr('id'),
					padding: [-5, -5, -5, -5],
					appendPadding: [0, 0, 0, 0],
					pixelRatio: window.devicePixelRatio
				});
				canvas.settings.chart.source([], {
													y: {
															max: 100,
															min: 0
														}
												},
											);
				canvas.settings.chart.axis(false);
				canvas.settings.chart.tooltip(false);
				
				canvas.settings.chart.coord('polar', {
					transposed: true,
					innerRadius: 0.75,	
					radius:1
				});
				
				canvas.settings.chart.guide().arc({
				    start: [0, 0],
				    end: [1, 99.9999],
				    top: false,
				    style: {
				      lineWidth: 10,
				      stroke: '#FFFFFF'
				    }
				  });
				  
				canvas.settings.chart.interval().position('x*y').size(5).color('#2573ff').animate({
					appear: {
						duration: 1200,
						easing: 'cubicIn'
						
					}
				}); 
				
				canvas.settings.chart.render();
			}
			
		}
		
		// 更改数据
		this.changeData = function(data){
			const all = data.guide.all?data.guide.all:0;
			const zc = data.guide.zc?data.guide.zc:0;
			canvas.settings.chart.guide().html({
				position: ['50%', '50%'],
				html: 
					'<div class="guide" style="transform: scale(0.85);font-size: 12px;color:#17233d;white-space: nowrap;text-align:center;position: relative !important;top: 22px !important;left: 22px !important;">' +
						'<div style="margin:0;">'+(canvas.settings.guide.date?canvas.settings.guide.date.Format('M月d日'):'')+'</div>' +
						'<div id="text" style="margin:0;font-weight: bold;">'+
							'<span style="color:#ff8800">'+  parseInt(all - zc) +'</span>/'+
							'<span>'+all+'</span>'+
						'</div>' + 
					'</div>'
			});
			
			canvas.settings.chart.changeData(data.chartDatas);
			return;
		}
		
		// 获取guid的日期
		this.getGuidDate = function(){
			return canvas.settings.guide.date;
		}
		
		
		// 初始化图表
		funs.initChart();
	};
	
	
	$.ProgressPie.default = {
		chart:null,
		background:'#FFFFFF',
		boxShadow:'3px 4px 6px #e8eaec',
		border:'1px solid #f8f8f9',
		borderRadius:'100%',
		guide:{
			date:null
		}
	}
		
		
})($);