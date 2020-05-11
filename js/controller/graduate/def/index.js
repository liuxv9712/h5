$(function() {
	doPost(
		DEF_GLOBAL_DOMAIN + '/by/graduate/querySchema.do', {
			graduateId: 1
		}, false
	).done(function(res) {

		if (res.code == 1000 && res.data) {
			data = JSON.parse(res.data);
			// console.log(data)
			let pages = data.pages;
			let len = pages.views.sections.length;
			let height = $(window).height();
			let width = $(window).width();

			$(pages.views.sections).each(function(index, item) {
				var oSlide = $('<section class="swiper-slide"></section>');
				$(oSlide).css({
					'background-image': 'url(' + item.backgroundImg + ')'
				});

				var oHead = $('<div class="content-block graduate-head"></div>');
				$(oHead).append('<img class="head-title" src="' + item.logo + '" />');

				var oMain = $('<div class="content-block graduate-main"></div>');
				$(oMain).css({
					'background-image': 'url(' + item.content.borderImg + ')'
				});

				var oMainTitle = $('<div class="content-block main-title backgroundImg"></div>');
				$(oMainTitle).css({
					'background-image': 'url(' + item.head.headBgImg + ')'
				});
				$(oMainTitle).append(
					'<span class="main-title-text ani" swiper-animate-effect="rubberBand" swiper-animate-duration="1s" swiper-animate-delay="0s">' +
					item.head.title + '</span>')

				var oMainCon = $('<p class="main-content"></p>').html(item.content.htmls);

				let oAnimate = $("<div></div>").addClass("graduate-animate");
				
				$(item.animations).each(function(index, ele){
					var img = $(
					'<img class="ani" src="' + ele.icon +'" swiper-animate-effect="'+ ele.anim +'" swiper-animate-duration="1s" swiper-animate-delay="0.5s">'
					);
					$(img).css({'position': 'absolute', 'left': ele.x*width/ele.pageWidth+"px", 'top': ele.y*ele.pageHeight/667+"px"})
					oAnimate.append(img);
				});
				

				// 添加节点
				oMain.append(oMainTitle, oMainCon);
				oSlide.append(oHead, oMain, oAnimate);
				$('.swiper-wrapper').append(oSlide);
			});
			
			
			// 填充数据之后载初始化swiper，只有这样在页面加载完后swiper才会被调用成功
			var mySwiper = new Swiper('.swiper-container', {
				// 滑动方向 horizontal水平
				direction: 'vertical',
				// 切换 默认slide滑动，fade淡入，cube盒子，flip翻转
				effect: 'slide',
				// 滑动速度
				speed: 1800,
				// 分页器
				pagination: '.swiper-pagination',
				// 点击分页器可切换
				paginationClickable: true,
				// 能使用鼠标滚轮控制slide滑动
				mousewheelControl: true,
				// 一屏中可显示的数量,默认1
				slidesPerview: 1,
				// 下滑按钮
				nextButton: '.swiper-button-next',
				//修改swiper自己或子元素时，自动初始化swiper
				observer: true,
				//修改swiper的父元素时，自动初始化swiper
				observeParents: true,
				//Swiper Animate动画初始化
				onInit: function(swiper) {
					//隐藏动画元素
					swiperAnimateCache(swiper);
					// 初始化完成开始动画
					swiperAnimate(swiper);
				},

				onSlideChangeEnd: function(swiper) {
					//每个slide切换结束时也运行当前slide动画
					swiperAnimate(swiper);
				}
			});

			var contentHeight = parseInt($('body').outerHeight(true)) - $('.graduate-head').height() - 28 * 4 - 88 + 'px';
			$('.graduate-main').css('height', contentHeight);
		}
		return;
	});

})
