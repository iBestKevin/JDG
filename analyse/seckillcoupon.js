var SECKILL_DOMAIN = "//"+window.location.host +"/";
/**
 * 优惠券相关的JS
 * 京券：0
 * 东券：1
 */
var item = "item";
var itemToggleActive = "item toggle-active";
var orderCouponItem = "orderCouponItem";
var orderGiftCardItem = "orderGiftCardItem";
var orderGiftECardItem = "orderECardItem";
var orderCouponId = "orderCouponId";
var giftCardId = "giftCardId";
var giftECardId = "eCardId";
var toggleWrap = "toggle-wrap";
var toggleWrapHide = "toggle-wrap hide";
var BALANCE_PWD_TYPE = "balancePwdType";
var JING_PWD_TYPE = "jingPwdType";
var LPK_PWD_TYPE = "lpkPwdType";
var dongType = "dongType";
var jingType = "jingType";
$(function(){//初始化
	$(".virtual-type").css("width","150px");
	//优惠券组件初始化
	$("#couponComp").click(function(){
		if ($("#"+orderCouponId).css('display') == 'none') {//展开
			$("#"+orderCouponId).css("display", "block");
			changeClassStyle(orderCouponId, toggleWrap);
			changeClassStyle(orderCouponItem, itemToggleActive);
			//ajax请求可用优惠券列表
			var skuId = $("#skuId").val();
			var url= SECKILL_DOMAIN + "async/getCouponList.action?skuId="+skuId;
			jQuery.ajax( {
				type : "POST",
				dataType : "html",
				url : url,
				async : true,
				cache : false,
				success : function(data) {
					$("#couponDiv").html(data);
					useCouponClick();
					var data={
							couponDiscount:$("#h_couponDiscountPriceId").val(),
							totalPrice:$("#h_sumPayPriceId").val()
					};
					if(data.couponDiscount>0){
						showOrderPrice();
					}
				}
			});
			if($("#jdBeans-new").css('display') != 'none'){
				showOrHideJingdouInfo();
			} 
		}else{//隐藏
			$("#"+orderCouponId).css("display", "none");
			changeClassStyle(orderCouponId, toggleWrapHide);
			changeClassStyle(orderCouponItem, item);
		}
	});
	function useCouponClick(){
			//勾选优惠券事件
			$("input[type=checkbox]").click(function(){
				var checked=$(this).is(":checked");
				 var vt=$(this).parentsUntil("virtual-table")[4];
				 var couponId;
			    if(checked){ //使用优惠券,使用时传递key
			    	if(checkUseRule($(this))){
			    	 couponId=$(this).attr("couponKey");
				     $(vt).addClass("virtual-table-selected");
			    	 useOrCancelCouponByAjax(couponId,true);
			    	}
			    }else{//不用优惠券 ，取消时传id
			    	$(vt).removeClass("virtual-table-selected");
			    	 couponId=$(this).attr("couponId");	
			    	 useOrCancelCouponByAjax(couponId,false);
			    	 checkUseRule();
			    }	
			});
	};
});
/**
 * 检查优惠券使用规则，
 * 东券用一张且不可与其他类优惠券同时使用，
 * 京券可使用多张。
 * @obj 当前选中的是哪个
 */
function checkUseRule(obj){
	var checkboxs = $("[id='orderCouponItem']").find("input");
	var dongQuanNum=0;
	var jingQuanNum=0;
	for (var i = 0; i < checkboxs.length; i++) {
		if (checkboxs[i]["checked"]) {
			var cur=$(checkboxs[i]);
				if(dongQuanNum>0) {
					alert("仅能使用一张东券或多张京券！");
					obj.attr("checked",false);
					return false;
				}
				if(cur.attr("couponType")=="1"){//东券
					dongQuanNum++;
				}else{
					jingQuanNum++;
				}
			}
		}
	if(parseInt(dongQuanNum)+parseInt(jingQuanNum)>0){
		$("#paypasswordPanel").show();
	}else{
		$("#paypasswordPanel").hide();
	}
	return true;
} 
/**
 * 使用和优惠券
 * @param couponId
 * @param isUseCoupon 布尔值，true-使用优惠券，false-取消优惠券
 */
function useOrCancelCouponByAjax(couponId,isUseCoupon){
	var url=SECKILL_DOMAIN + "async/";
	var skuId = $("#skuId").val();
	if(!!isUseCoupon){
		url+="useCoupon.action?skuId="+skuId;
	}else{
		url+="cancelCoupon.action?skuId="+skuId;
	}
	 $.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : {
			couponId:couponId
		},
		async : true,
		cache : false,
		success : function(data) {
			showOrderPrice();
		},
		error:function(xhr, textStatus, errorThrown){
			console.log("---error-----------------.....");
		}
	 });
}


function changeClassStyle(classId, classStyle) {
	$("#" + classId).removeClass();
	$("#" + classId).addClass(classStyle);
}



