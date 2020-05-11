var xh;
var devWidth = window.screen.width + 20;
$(function() {
	doPost(
		DEF_GLOBAL_DOMAIN + '/bzx/whiters/findStuWhiterList.do', {
			xh: getURLDecodeParameter('xh')
		}
	).then(function(res) {
		if (res.code == 1000 && res.data.length > 0) {
			$(res.data).each(function(index, item) {
				var li = $('<li class="whiter"></li>');
				$(li).append('<a href="#" class="item-link item-content">' +
					'	<div class="item-inner">' +
					'		<div class="item-title-row">' +
					'			<div class="item-title">' + item.xm + '的白名单</div>' +
					'			<div class="item-after">' + item.updateTime + '</div>' +
					'		</div>' +
					'		<div class="item-subtitle">类型说明：' + item.reasonType + '</div>' +
					'		<div class="item-subtitle">开始日期：' + new Date(item.startDate.replace(/-/ig, '/')).Format('yyyy-MM-dd') +
					'</div>' +
					'		<div class="item-subtitle">结束日期：' + new Date(item.endDate.replace(/-/ig, '/')).Format('yyyy-MM-dd') +
					'</div>' +
					'	</div>' +
					'</a>');

				$(li).data('record', item);
				$('.whiter-container ul').append(li);
			});

		} else {
			$('.whiter-container ul').remove();
			$('.whiter-container').append_no_data();
		}
	});


	// 添加白名单
	$('.btn-add').on('click', function() {
		to_page('whiter-set.html', {
			xh: getURLDecodeParameter('xh')
		});
		return;
	});

	// 编辑
	$('.whiter-container').on('click', '.whiter', function() {
		var target = $(this);
		
		var buttons1 = [{
			text: '请选择',
			label: true
		}, {
			text: '编辑白名单',
			onClick: function() {
				to_page('whiter-set.html', {
					xh: getURLDecodeParameter('xh'),whiter:JSON.stringify($(target).data('record'))
				});
				return true;
			},
		},{
			text: '移出白名单',
			color: 'danger',
			onClick: function() {
				doPost(
					DEF_GLOBAL_DOMAIN + '/bzx/whiters/moveOut.do', 
					{whiterId: $(target).data('record').id}
				).then(function(res) {
					if (res.code == 1000) {
						$.toast("操作成功");
						
						$(target).animate({
							right: devWidth
						}, function() {
							$(target).remove();
						});
						
					} else {
						$.toast("操作失败");
					}
				});
				return false;
			}
		}];
		var buttons2 = [{
			text: '取消'
		}];
		var groups = [buttons1, buttons2];
		$.actions(groups);


	});

});
