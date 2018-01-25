seajs.use([
    "jdf/1.0.0/unit/globalInit/5.0.0/globalInit",
    "jdf/1.0.0/ui/lazyload/1.0.0/lazyload",
    "jdf/1.0.0/ui/switchable/1.0.0/switchable",
    "jdf/1.0.0/ui/tips/1.0.0/tips",
    "jdf/1.0.0/ui/dialog/1.0.0/dialog",
    "jdf/1.0.0/ui/placeholder/1.0.0/placeholder",
    "jdf/1.0.0/ui/scrollbar/1.0.0/scrollbar",
    "jdf/1.0.0/ui/drag/1.0.0/drag",
    "user/purchase/2.0.0/js/purchase-recommend",
    "user/purchase/2.0.0/js/subtwl"
  ], function (globalInit,lazyload,switchable,tips,dialog,placeholder,scrollbar,drag,someMoreRecommend,subtwl){//FE 模块加载 start
  globalInit();
  //$.ajaxSettings.async = false;  

//*************************公共方法和变量*************************
var cartUrl = OrderAppConfig.Protocol+"cart.jd.com";
var lipinkaPhysicalUrl = OrderAppConfig.Protocol+"market.jd.com/giftcard/#entity";
var orderUrl = OrderAppConfig.Domain+"/order/getOrderInfo.action";


/**
 * 设置结算页续重运费总重
 * 包含显示逻辑及数据重置逻辑
 */
function refreshFreightWeight(){
    var totalFreightWeightShow = $("#totalFreightWeightShow").val();
    $(".total-freight-weight").hide(); // 默认隐藏，如果数据ok再显示
    if($(".total-freight-weight").length > 0
        && totalFreightWeightShow != undefined && totalFreightWeightShow != ""){
        $(".total-freight-weight-val").html(totalFreightWeightShow+"kg");
        $(".total-freight-weight").show();
    }
}window.refreshFreightWeight=refreshFreightWeight;

refreshFreightWeight();

/**
 * 重置运费明细里的重量
 * 仅包含数据重置逻辑，不负责显隐
 */
function resetFreightDetailWeight(){
    if($("#xzweight-detail").length <= 0){
        return;
    }

    $("#xzweight-detail").html("");
    $("#xzweight-detail-bak").html("");

    var allFreightWeight = $("#allFreightWeight").val();
    if(allFreightWeight != undefined && allFreightWeight != ""){

        var html = "（总重";
        html += allFreightWeight;

        var overFreightWeight = $("#overFreightWeight").val();
        if(overFreightWeight != undefined && overFreightWeight != ""){
            html += "，超出重量" + overFreightWeight + "）";
        } else {
            html += "）";
        }

        $("#xzweight-detail").html(html);
        $("#xzweight-detail-bak").html(html);
    }

    $("#sxweight-detail").html("");
    $("#sxweight-detail-bak").html("");

    var allSxFreightWeight = $("#allSxFreightWeight").val();
    if(allSxFreightWeight != undefined && allSxFreightWeight != ""){

        var html = "（总重";
        html += allSxFreightWeight;

        var overSxFreightWeight = $("#overSxFreightWeight").val();
        if(overSxFreightWeight != undefined && overSxFreightWeight != ""){
            html += "，超出重量" + overSxFreightWeight + "）";
        } else {
            html += "）";
        }

        $("#sxweight-detail").html(html);
        $("#sxweight-detail-bak").html(html);
    }
    //----
    $("#wmweight-detail").html("");
    $("#wmweight-detail-bak").html("");

    var allWmFreightWeight = $("#allWmFreightWeight").val();
    if(allWmFreightWeight != undefined && allWmFreightWeight != ""){

        var html = "（总重";
        html += allWmFreightWeight;

        var overWmFreightWeight = $("#overWmFreightWeight").val();
        if(overWmFreightWeight != undefined && overWmFreightWeight != ""){
            html += "，超出重量" + overWmFreightWeight + "）";
        } else {
            html += "）";
        }

        $("#wmweight-detail").html(html);
        $("#wmweight-detail-bak").html(html);
    }
}window.resetFreightDetailWeight=resetFreightDetailWeight;

/**
 * 清除submit错误消息
 */
function cleanSubmitMessage() {
  $("#submit_message").html("");
  $("#submit_message").hide();
}

function subStr(id){
  $(id).each(function(){ 
    var objString = $.trim($(this).text());
    if(objString.indexOf("...") == -1){
    var objLength = $.trim($(this).text()).length;
    var num = $(this).attr('limit');
    $(this).attr('title',objString); 
    if(objLength > num)
      objString = $(this).text(objString.substring(0,num) + '...'); 
    }
  });
}window.subStr=subStr;

function subStrConsignee(){
	//新地址标签
	  $(".consignee-item").not(".addr-more").each(function(){ 
	    	var addressName = $(this).find("span").text();
	    	if(isEmpty(addressName)){
	    		setOneSpanAlias($(this));
	    	}else{
	    		var num = $(this).find("span").attr('limit');
	    		$(this).find("span").text(addressName.substring(0,num));
	    	}
	  });
	  //老版功能
	 // setConsigneeAiles();
  subStr(".addr-detail .addr-name");
  subStr(".addr-detail .addr-info");
}window.subStrConsignee=subStrConsignee;

function setOneSpanAlias(id){
	  var selectDiv = $(id).next();
      var consignee = selectDiv.find(".addr-info").text().split(' ')[0];
      var name = $.trim(selectDiv.find(".addr-name").text());
      var objLength = name.length;
      var num = $(id).find("span").attr('limit');
      $(id).find("span").attr('title',name);
      if(objLength > num)
        $(id).find("span").text(name.substring(0,num) + '... ' + consignee);
      else
        $(id).find("span").text(name + ' ' + consignee);	
}


//默认设置地址别名
function setConsigneeAlies(){
  $(".consignee-item").not(".addr-more").each(function(){ 
	    if($(this).next().next().find("a").size() != 2){
	      var selectDiv = $(this).next();
	      var consignee = selectDiv.find(".addr-info").text().split(' ')[0];
	      var name = $.trim(selectDiv.find(".addr-name").text());
	      var objLength = name.length;
	      var num = $(this).find("span").attr('limit');
	      $(this).find("span").attr('title',name);
	      if(objLength > num)
	        $(this).find("span").text(name.substring(0,num) + '... ' + consignee);
	      else
	        $(this).find("span").text(name + ' ' + consignee);
	    }
	  });
}


/**
 * 判断服务是否返回有消息【此方法别动】
 *
 * @param data
 * @returns {Boolean}
 */
function isHasMessage(data) {
  if (data.errorMessage) {
    return true;
  } else {
    try {
      if (data != null && data.indexOf("\"errorMessage\":") > -1) {
        var mesageObject = eval("(" + data + ")");
        if (mesageObject != null && mesageObject.errorMessage != null) {
          return true;
        }
      }
    } catch (e) {}
  }
  return false;
}
window.isHasMessage = isHasMessage;

/**
 * 将消息返回【此方法别动】
 * 
 * @param data
 * @return
 */
function getMessage(data) {
  if (data.errorMessage) {
    return data.errorMessage;
  } else {
    try {
      var mesageObject = eval("(" + data + ")");
      if (mesageObject != null && mesageObject.errorMessage != null && mesageObject.errorMessage != "") {
        return mesageObject.errorMessage;
      }
    } catch (e) {}
  }
  return null;
}
window.getMessage = getMessage;

/**
 * 判断用户是否登录【此方法别动】
 */
function isUserNotLogin(data) {
  if (data.error == "NotLogin") {
    return true;
  } else {
    try {
      var obj = eval("(" + data + ")");
      if (obj != null && obj.error != null && obj.error == "NotLogin") {
        return true;
      }
    } catch (e) {
    }
  }
  return false;
}window.isUserNotLogin=isUserNotLogin;

/**
 * 去登录页面
 */
function goToLogin() {
  if (isLocBuy()) {
    window.location.href = OrderAppConfig.LoginLocUrl + "?rid=" + Math.random();
  } else {
    window.location.href = OrderAppConfig.LoginUrl + "?rid=" + Math.random();
  }
}window.goToLogin=goToLogin;

/**
 * 去购物车页面
 */
function goCart() {
  if (isLipinkaPhysical()) {
    window.location.href = lipinkaPhysicalUrl;
  } else {
    if(g_outSkus){
      if(g_noStockType == "600158"){
        log('gz_ord', 'gz_proc', 6, 'qbwhfhgwc');
      }else if(g_noStockType == "600157"){
        log('gz_ord', 'gz_proc', 6, 'bfwhfhgwc');
      }
      window.location.href = cartUrl + '?outSkus=' + g_outSkus + '&rid=' + Math.random();
    }else{
      window.location.href = cartUrl + "?rid=" + Math.random();
    }
  }

}window.goCart=goCart;
/**
 * 刷新结算页面
 */
function goOrder() {
  var isUnregister = $("#isUnregister").val();
  if (isUnregister || isUnregister == "true") {
    window.location.href = orderUrl + "?rid=" + Math.random();
  }
  else {
    var href = window.location.href;
    var url = href;
    if(href.indexOf(".action") > -1){
      url = href.substring(0,href.indexOf(".action")+7)+"?rid=" + Math.random();
    }
    if($("#flowType").val() == 10){
      url = addFlowTypeParam(url);
    }
    window.location.href = url;   
  }
}window.goOrder=goOrder;

/**
 * 大家电刷新结算页面
 */
function bigItemGoOrder() {
  var href = window.location.href;
  var url = href;
  if(href.indexOf(".action") > -1){
    url = href.substring(0,href.indexOf(".action")+7)+"?t=1&rid=" + Math.random();
  }
  if($("#flowType").val() == 10){
    url = addFlowTypeParam(url);
  }
  window.location.href = url;
}window.bigItemGoOrder=bigItemGoOrder;

// ******************************************************收货地址开始**************************************************************
/**
 * 获取收货地址列表
 *
 * @param consigneeId
 */
function consigneeList(selectId) {
  $('#consignee-addr .consignee-cont').css({'height':'42px'});
  $('#consignee-addr .ui-scrollbar-wrap').css('height', '42px');
  var isUnregister = $("#isUnregister").val();
  // 如果是免注册下单，不用获取收货地址列表
  if (isUnregister || isUnregister == "true") return;
  
  var flowType =  $("#flowType").val();
  if(flowType == 1 || flowType == 13){
    return;
  }
  var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/consigneeList.action";
  var consigneeId = $("#consignee_id").val();
  if (isEmpty(consigneeId)) {
    consigneeId = 0;
  }
  
  var addType = $("#consignee-list .consignee-item.item-selected").attr("consigneeType");
  if(addType!=1){
	  addType=0;
  }
  var param = "consigneeParam.id=" + consigneeId;
  	  param = param + "&consigneeParam.addType=";
  	  param = param + addType;
  // param = addFlowTypeParam(param);
  jQuery.ajax({
    type: "POST",
    dataType: "text",
    url: actionUrl,
    data: param,
    cache: false,
    success: function(dataResult, textStatus) {
      //异步加载收货人信息
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      
      // 服务器返回异常处理,如果有消息div则放入,没有则弹出
      if (isHasMessage(
        
      )) {
        goOrder();
        return;
      }
      // 成功后如果有divID直接放入div，没有则返回结果
      else {
        $("#consignee-list").append(dataResult);
        itemListOver.init("#consignee-list");
        var commonConsigeeSize = $("#hidden_consignees_size").val();
        var consigneeSize = parseInt(commonConsigeeSize);
        if ($("#isOpenConsignee").val() == 1) {
          $("#hidden_consignees_size").val(consigneeSize = consigneeSize - 1);
        }
        
	    //地址服务升级:异步加载更多地址,如果默认选中的地址需要升级,显示地址升级信息.-----begin
	    //Step 1
	    var tempId = $('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').first().attr("id");
	    var parent_id = $('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').first().next().attr("parent_id");
	    if(tempId == parent_id){
		   //调整高度
	       $('#consignee-addr .consignee-cont').css({'height':'84px'});
	       $('#consignee-addr .ui-scrollbar-wrap').css({'height':'84px'});
	    }
	    //地址服务升级:异步加载更多地址,如果默认选中的地址需要升级,显示地址升级信息.-----end
	    
        if (consigneeSize == 1 || consigneeSize == 0) {
          $("#consigneeItemAllClick").addClass("hide");
          $("#consigneeItemHideClick").addClass("hide");
        } else if (consigneeSize > 1) {
           var selectDiv = $(".consignee-item").next().next();
           selectDiv.find(".del-consignee").removeClass("hide");
           selectDiv.find(".setdefault-consignee").removeClass("hide");
           
           //******正常地址可以设置默认地址,错误地址不可以设置为默认地址 begin******
           selectDiv.each(function(){
               var $this = $(this);
               if($this.attr("isOldAddress")=="false"){
            	   $this.find(".setdefault-consignee").removeClass("hide");
               }else{
            	   $this.find(".setdefault-consignee").addClass("hide");
               }
               if($("#editConsignee").val()=="1"){
            	   $this.find(".edit-consignee").addClass("hide");
               }
               if($("#delConsignee").val()=="1"){
            	   $this.find(".del-consignee").addClass("hide");
               }
           });
           //******正常地址可以设置默认地址,错误地址不可以设置为默认地址 end******
           
           //******地址服务升级 begin******
           //由于地址服务升级后，旧地址的class为"consignee-item-disable",需要显示出被隐藏的删除按钮
           var selectErrorAddressDiv = $(".consignee-item-disable").next().next();
           selectErrorAddressDiv.find(".del-consignee").removeClass("hide");
           //旧地址不允许设置为默认地址,注释下行代码，隐藏设置按钮
           //selectErrorAddressDiv.find(".setdefault-consignee").removeClass("hide");
           //选中的地址不允许删除
           var itemSelectedAddressDiv = $("#consignee-list .item-selected").next().next();
           itemSelectedAddressDiv.find(".del-consignee").addClass("hide");
           //******地址服务升级 end******
           
           $("#consigneeItemAllClick").removeClass("hide");
           $("#consigneeItemHideClick").addClass("hide");
           //地址列表除去第一条其它隐藏
           $('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').first().nextAll().hide();
		   
		   //地址服务升级:异步加载更多地址,如果默认选中的地址需要升级,显示地址升级信息. begin ******
		   //step 2
		   if(tempId == parent_id){
		       //如果默认选中地址需要升级,将被隐藏的提示信息修改为可见(注:Step 1  已经调整高度)
			   $('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').first().next().css("display","");
		   }
		   //地址服务升级:异步加载更多地址,如果默认选中的地址需要升级,显示地址升级信息. end ******

        }
        if (checkIsNewUser()) {
          if ($(".consignee-item").length > 1) {
            //展开地址列表
            $("#consigneeItemAllClick").click();
            //选中地址列表中的第一条正确地址
            $(".consignee-item").first().click();
          } else {
              if (isLocBuy()) {
              edit_LocConsignee();
            } else {
              use_NewConsignee();
            }
          }
        }
        
        
        if(flowType == 10){
          var selectDiv = $(".consignee-item.item-selected").next();
          var idCard = selectDiv.find(".addr-idCard").html();
 
          if(idCard == "未完善身份证信息"){
            $(".consignee-item.item-selected").next().next().find(".edit-consignee").click();
          }
        }
        //end
      }
    subStrConsignee();
    },
    error: function(XMLHttpResponse) {
      //ignore
    }
  });
}
window.consigneeList = consigneeList;
//异步加载收货人列表
consigneeList();

window.consigneeScroll = null;
function show_ConsigneeAll(type){
	doHandleFirstAccess();
  $("#consigneeItemAllClick").addClass("hide");
  $("#consigneeItemHideClick").removeClass("hide");
  $("#consignee1").removeClass("consignee-off");
  $("#del_consignee_type").val("0");
  $(".consignee-item").parents("li").css("display","list-item");
  
  //地址服务升级:点击"更多地址" 将被隐藏的需要升级(错误地址)地址&地址升级提示信息 修改为可见 begin******
  $(".consignee-item-disable").parents("li").css("display","list-item");
  $(".upgrade-item").parents("li").css("display","");
  //地址服务升级:点击"更多地址" 将被隐藏的需要升级(错误地址)地址&地址升级提示信息 修改为可见 end ******
  
//  $('.ui-scrollbar-main .consignee-scroll ul li').length-$('.selfPickInCommon').length;
  var _height = (($('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').length-$('.selfPickInCommon').length) * 42)+"px";
  $('#consignee-addr .consignee-cont').css({'height': _height});
  $('#consignee-addr .ui-scrollbar-wrap').css({'height':_height});
  //收货人地址滑动 start
  if(($('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').length-$('.selfPickInCommon').length) > 4) {
	  if(consigneeScroll) {
	      $('#consignee-addr .consignee-scrollbar').css({'top':'0px'});
          $('#consignee-addr .ui-scrollbar-item-consignee').css({'top':'2px'});
          consigneeScroll.resetUpdate($('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').length-$('.selfPickInCommon').length);
	  } else {
		  consigneeScroll = $('.consignee-scrollbar').scrollbar({
		       width: 11,
		       scrollClass: 'ui-scrollbar-item-consignee', 
		       mainClass: 'ui-scrollbar-main',
		       hasHeadTail: false,
		       limit: true,
		       wrapHeight: 168
		   });
		  consigneeScroll.resetUpdate = function(length) {
			  //$("#del_consignee_type").val() 展开修改成0  收起修改成1  新增修改成0
			  var flag = $("#del_consignee_type").val();
			  if(flag == "0"){
		        var _height = (length * 42);
		        $('#consignee-addr .consignee-cont').css({'height': _height+"px"});
		        if(_height >= 168) {
		          $('#consignee-addr .ui-scrollbar-wrap').css({'height': '168px'});
		        } else {
		          $('#consignee-addr .ui-scrollbar-wrap').css({'height': _height+"px"});
		        }
		      }
		      if(length>4 && flag == "0"){// 展开状态才显示，否则保持不变
		        $('#consignee-addr .ui-scrollbar-bg').css({'display': 'block', 'top': '0'});
		        $('.consignee-scrollbar').css('position', 'absolute');
		      }else{
		        $('#consignee-addr .ui-scrollbar-bg').css('display', 'none');
		        $('.consignee-scrollbar').css({'height': '', 'position': ''});
		      }  
		      this.update();
		  };
	  }
  }
  //end
  if($("#selfPickOptimize").attr("value")!=1 && $("#selfPickShutDownFlag").attr("value")==1){
	  if(!($(".selfPickInCommonItem").hasClass("item-selected")) && type!=1){
		  showRecommendSelfPickAddress();
	  }
  }else{
	  $("#selfPickInfo").addClass("hide");
  }
  //******常用地址列表只剩一条地址,将"收起地址","更多地址" 隐藏 ****** begin
  var consignee_list = $("#consignee-list [c_li_custom_label=consignee_li]li");
  if(consignee_list.length<=1){
	  $("#consigneeItemAllClick").addClass("hide");
	  $("#consigneeItemHideClick").addClass("hide");
  }
  //******常用地址列表只剩一条地址,将"收起地址","更多地址" 隐藏 ****** end
 
} window.show_ConsigneeAll = show_ConsigneeAll;

/**
 * update by lilong 20150511
 * ！！！注意：仅供前台更新收货人列表位置使用，不更新服务端数据不更新缓存
 * 点击【收起地址】功能，自动将选中追加至默认地址后第二位，如果没有默认地址则自动排在第一位
 */
function hide_ConsigneeAll() {
  $("#consigneeItemAllClick").removeClass("hide");
  $("#consigneeItemHideClick").addClass("hide");
  $("#consignee1").addClass("consignee-off");
  $("#del_consignee_type").val("1");
  $('#consignee-addr .consignee-cont').css({'height':'42px'});
  $('#consignee-addr .ui-scrollbar-wrap .ui-scrollbar-bg').css('display', 'none');
  $('#consignee-addr .ui-scrollbar-wrap .ui-scrollbar-item-consignee').css('display', 'none');
  $('#consignee-addr .ui-scrollbar-wrap').css('height', '42px');
  $('#consignee-content ul').css({
    'top': '0px',
    'position':'absolute'
  });
    /**
     * 修复收货人地址收起展开后，在地址上滚开时，地址消失问题
     */
  $('#consignee-addr .consignee-scrollbar').css({'height': '', 'position': ''});
  // 地址列表切换至第一页
  //var li_selected = $("#consignee-list .consignee-item.item-selected").parent("li");//当前选中li
  /**
   * "收起地址"
   * 1.旧地址(错误四级地址)被选中的情况
   * 2.选择自提地址后常用地址列表没有选中的地址
   */
  var li_selected = $("#consignee-list [c_div_custom_label=consignee_div].item-selected").parent("li");//当前选中li
  if (li_selected.length==0){
	  li_selected = $("#consignee-list [c_li_custom_label=consignee_li]li").first();//第一条"li"
  }
  //****** 地址服务升级:"收起地址"时,判断选中的地址是否有提示信息,控制高度 begin ******
  //var selected_consignee_id = ($("#consignee-list .consignee-item.item-selected").attr("consigneeid"));
  var selected_consignee_id = li_selected.children(":first").attr("consigneeid");
  var parent_id = $("#li_J_toUpgrade_"+selected_consignee_id).attr("parent_id");
  if(li_selected.attr("id") == parent_id){
	  $('#consignee-addr .consignee-cont').css({'height': '84px'});
      $('#consignee-addr .ui-scrollbar-wrap').css({'height':'84px'});
  }
  //****** 地址服务升级:"收起地址"时,判断选中的地址是否有提示信息,控制高度 end ******

  //假如当前选中的不是自提地址，和以前逻辑一样
  if(!$(".selfPickInCommonItem").hasClass("item-selected")){
	  //var first_li = $(".consignee-item").parents("li").last();//当前列表第一项
	  var first_li = $("#consignee-list [c_li_custom_label=consignee_li]li").first();
	  var _tempstr = first_li.find("div span").find(".addr-default").html();
	  if(_tempstr && _tempstr.indexOf("默认地址") > -1) {
	    // 1.插入在默认地址之后
	    li_selected.clone().insertAfter(first_li);
	  } else {
	    // 2.插入在地址列表第一位
	    li_selected.clone().insertBefore(first_li);
	  }
	  li_selected.remove();
	  // 收起并定位第一页功能
	  $("#consignee-list .consignee-item").parents("li").css("display","none");
	  $(".consignee-item.item-selected").parent("li").css("display","list-item");
	  if(consigneeScroll) {
		  //滚轮从新定位
		  consigneeScroll.goTop();
	  }
	  // 初始化地址组件的绑定事件，否则移动dom会导致绑定失效，因此改动组件采用delegate绑定
  }else{
	  var first_li = $(".consignee-item").parents("li").last();//当前列表第一项
//	  var _tempstr = first_li.find("div span").find(".addr-default").html();
//	  if(_tempstr && _tempstr.indexOf("默认地址") > -1) {
//	    // 1.插入在默认地址之后
//	    li_selected.clone().insertAfter(first_li);
//	  } else {
//	    // 2.插入在地址列表第一位
//	    li_selected.clone().insertBefore(first_li);
//	  }
//	  li_selected.remove();
	  // 收起并定位第一页功能
//	  $(".consignee-item").parents("li").css("display","none");
	  first_li.css("display","list-item");
//	  $(".consignee-item.item-selected").parent("li").css("display","list-item");
	  if(consigneeScroll) {
		  //滚轮从新定位
		  consigneeScroll.goTop();
	  }
	  // 初始化地址组件的绑定事件，否则移动dom会导致绑定失效，因此改动组件采用delegate绑定
  }

  if($("#defaultSelfPick").attr("defaultSelfPick")==1){
	$("#recommendAddr").remove();
	$("#defaultSelfPick").css("display","");
  }  
  //end
  
} window.hide_ConsigneeAll = hide_ConsigneeAll;

function setResetFlag(index,value){
  //第一给打1表示进入结算页和切换地址时执行判断是否自动选中自提逻辑
  if(index > 9||!(value == '0'||value == '1')){
    return;
  }
  var resetFlag_arr = $("#resetFlag").val().split("");
  resetFlag_arr[index]=value;
  $("#resetFlag").val(resetFlag_arr.join(""));
}window.setResetFlag = setResetFlag;
function initResetFlag(){
  $("#resetFlag").val("0000000000");
}window.initResetFlag = initResetFlag;
/**
 * 保存收货地址（包含保存常用人收货地址，根据id区分）
 */
function tab_save_Consignee(isGiftBy,pickType) {
  $("body").append('<div id="g-loading" class="purchase-loading"><div class="loading-cont"></div></div>');
  var id = $("#consignee-list .item-selected").attr("consigneeId");
  if (id == undefined || id == null || id == "" || id == 0) {
	  goOrder();
    delayRemoveLoading('#g-loading');
    return;
  }
  if($(".selfPickInCommonItem").length>0 && !($(".selfPickInCommonItem").hasClass("item-selected"))){
	  $("#selfPickSiteName").removeClass("item-selected");
	  $(".optimize").removeClass("item-selected");
  }

  if(!isGiftBy) {
    if (id == $("#consignee_id").val() && id != $(".selfPickInCommonItem").attr("consigneeid")) {
        delayRemoveLoading('#g-loading');
        return;
      }
  }
 
  var flowType =  $("#flowType").val();
  if(flowType == 10){
    var selectDiv = $(".consignee-item.item-selected").next();
    var idCard = selectDiv.find(".addr-idCard").html();
     
    if(idCard == "未完善身份证信息"){
      $(".consignee-item.item-selected").next().next().find(".edit-consignee").click();
    }
  }

  // 如果不隐藏重新获取用户填写的信息
  var consignee_id = id;
  var consignee_type = null;
  var isUpdateCommonAddress = 0;
  var consignee_commons_size = $("#hidden_consignees_size").val();
  var giftSender_consignee_name = "";
  var giftSender_consignee_mobile = "";
  var hongKongId = $("#hongKongId").val();
  var taiWanId = $("#taiWanId").val();
  var overSeasId = $("#overSeasId").val();
  var noteGiftSender = false;
  var isSelfPick = isGiftBy;
  if(isSelfPick!=1){
	  isSelfPick=0;
  }
  
  var selfPickOptimize=0;
  if($("#selfPickOptimize").attr("value")==1){
	  selfPickOptimize=1;
  }
  //隐藏电子发票tips
  $("#giftInvoiceTip").addClass("hide");
  if(isGiftBuy()){
    noteGiftSender= true;
    giftSender_consignee_name = $("#consigneeList_giftSenderConsigneeName").val();
    giftSender_consignee_mobile = $("#consigneeList_giftSenderConsigneeMobile").val();
  }
  consignee_id = id;
  obtainCopyInfoConfig();
  if (consignee_type == "")
    consignee_type = 1;
  
  if (pickType == undefined || pickType == null || pickType == "") {
	  pickType = 0
  }
  
  var param = "consigneeParam.id=" + consignee_id + 
              "&consigneeParam.type=" + consignee_type + 
              "&consigneeParam.commonConsigneeSize=" + consignee_commons_size + 
              "&consigneeParam.isUpdateCommonAddress=" + isUpdateCommonAddress + 
              "&consigneeParam.giftSenderConsigneeName=" + giftSender_consignee_name + 
              "&consigneeParam.giftSendeConsigneeMobile=" + giftSender_consignee_mobile + 
              "&consigneeParam.noteGiftSender=" + noteGiftSender+
              "&consigneeParam.isSelfPick=" + isSelfPick+
              "&consigneeParam.selfPickOptimize=" + selfPickOptimize+
              "&consigneeParam.pickType=" + pickType;
  param = addFlowTypeParam(param);
  var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/saveConsignee.action";
  jQuery.ajax({
    type: "POST",
    dataType: "json",
    url: actionUrl,
    data: param,
    cache: false,
    success: function(consigneeResult, textStatus) {
      if (isUserNotLogin(consigneeResult)) {
        goToLogin();
        delayRemoveLoading('#g-loading');
        return;
      }
      if (consigneeResult.success) {
        var invoiceHtml = $("#part-inv").html();
        if (consigneeResult.restInvoiceByAddress == 22) {
          $("#part-inv").html(invoiceHtml.replace("办公用品", "办公用品（附购物清单）"));
        }
        if (consigneeResult.restInvoiceByAddress == 2) {
          $("#part-inv").html(invoiceHtml.replace("（附购物清单）", ""));
        }
        if (consigneeResult.supportElectro) {
          if(null != consigneeResult.restInvoiceCompanyName){
             $("#part-inv").html("<span class='mr10'>普通发票&nbsp; </span><span class='mr10'> "+consigneeResult.restInvoiceCompanyName+"&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
          }else{
             $("#part-inv").html("<span class='mr10'>普通发票&nbsp; </span><span class='mr10'> 个人&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
          }
        }
        if (consigneeResult.defaultElectro) {
          $("#part-inv").html("<span class='mr10'>电子普通发票&nbsp;<i class='invoice-tips-icon' data-tips='电子普通发票与纸质发票具有同等法律效力，可支持报销入账、商品售后凭证。'></i>&nbsp; </span><span class='mr10'> 个人&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
        }
        //港澳售项目
        if(consigneeResult.resetHK){
        	$("#part-inv").html("<span class='mr10'>不开发票&nbsp;</span><a onclick='edit_Invoice()' id='invoiceEdit' class='ftx-05 invoice-edit hide' href='#none'>修改</a>");
        }
        if(consigneeResult.resetCommon){
        	if(consigneeResult.selectNormalInvoiceContent=="不开发票"){
        		$("#part-inv").html("<span class='mr10'>不开发票&nbsp;</span><a onclick='edit_Invoice()' id='invoiceEdit' class='ftx-05 invoice-edit' href='#none'>修改</a>");
        	}else if(consigneeResult.selectInvoiceType==1){
        		//普票 
                $("#part-inv").html("<span class='mr10'>普通发票&nbsp; </span><span class='mr10'> "+consigneeResult.selectInvoiceTitle+"&nbsp; </span><span class='mr10'>"+consigneeResult.selectNormalInvoiceContent+"&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
        	}else if(consigneeResult.selectInvoiceType==2){
        		//增值税发票
        		$("#part-inv").html("<span class='mr10'>增值税专用发票&nbsp; </span><span class='mr10'> "+consigneeResult.selectInvoiceTitle+"&nbsp; </span><span class='mr10'>"+consigneeResult.selectNormalInvoiceContent+"&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
        	}else if(consigneeResult.selectInvoiceType==3){
        		//电子发票 
        		$("#part-inv").html("<span class='mr10'>电子普通发票&nbsp;<i class='invoice-tips-icon' data-tips='电子普通发票与纸质发票具有同等法律效力，可支持报销入账、商品售后凭证。'></i>&nbsp; </span><span class='mr10'> "+consigneeResult.selectInvoiceTitle+"&nbsp; </span><span class='mr10'>"+consigneeResult.selectNormalInvoiceContent+"&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
        	}
        }
        
      	var consignee_provinceId = consigneeResult.consigneeShowView.provinceId;
      	if(consignee_provinceId == hongKongId || consignee_provinceId == taiWanId || consignee_provinceId == overSeasId){
      		$("#invoiceEdit").addClass("hide");
//      		$(".withouthk").addClass("hide");
      		$(".seven").text("不支持7天无理由退货");
      		$(".seven").removeClass("ftx-04");
      		$(".seven").addClass("ftx-03");
      		$(".sevenicon").removeClass("p-icon-w");
      		$(".sevenicon").addClass("p-icon-no-w");
      		
      		if (consignee_provinceId != overSeasId && consignee_provinceId != taiWanId) {
      			$("#freighttips").removeClass("hide");
      		} else {
      			$("#freighttips").addClass("hide");
      		}
            $("#tariffTip").removeClass("hide");
      	}else{
      		$("#invoiceEdit").removeClass("hide");
//      		$(".withouthk").removeClass("hide");
      		$(".seven").text("支持7天无理由退货");
      		$(".seven").addClass("ftx-07");
      		$(".seven").removeClass("ftx-03");
      		$(".sevenicon").addClass("p-icon-w");
      		$(".sevenicon").removeClass("p-icon-no-w");
      		
      		$("#freighttips").addClass("hide");
      		$("#tariffTip").addClass("hide");
      	}

      	orderInfoTip();
        //end
        if (consigneeResult.resultCode == "isRefreshArea") {
          openEditConsigneeDialog(consignee_id);
        } else {
          restData();
          var areaIds=consigneeResult.consigneeShowView.provinceId + "-" + consigneeResult.consigneeShowView.cityId + "-" + consigneeResult.consigneeShowView.countyId + "-" + consigneeResult.consigneeShowView.townId;
          // 弹出对应提示
          $("#consignee-ret").html(consigneeResult.consigneeHtml); //弹出对应提示
          $("#consignee_id").val(consigneeResult.consigneeShowView.id);
          $("#hideAreaIds").val(areaIds);
          //新换区流程
          if(consigneeResult.newReplacedFlow){
        	  
        	  $("#newReplacedFlow").val(consigneeResult.newReplacedFlow);
        	  $(".replacedSkus").html(consigneeResult.replacedSkuInfos);
        	  
        	  if(consigneeResult.replacedSkuInfos!=null && consigneeResult.replacedSkuInfos.length>0 ){
        		  if(!isBigItemChange()){
        			  showChangedSam(consigneeResult.replacedSkuInfos);
        		  }else{
        			  samAndBigItemChangeArea();
        		  }
        	  }else{
        		  if(isBigItemChange()){
        			  bigItemChangeArea();
        		  }
        	  }
          }else{
        	    if (isBigItemChange() && !isHasSam())
                  bigItemChangeArea();
                if(isHasSam() && !isBigItemChange()) {
                  samChangeArea();
                }
                if(isHasSam() && isBigItemChange()) {
                  samAndBigItemChangeArea();
                }
          }
          if (hasTang9())
              tang9ChangeArea();
          setResetFlag(0,'1');
          save_Pay(0);
          if(isGiftBuy()){
        	  consigneeInfo();
          }
          openConsignee();
          if ($("#isPresale").val() == "true") {
            $("#hiddenUserMobileByPresale").val(consigneeResult.consigneeShowView.mobile);
            if ($("#presaleMobile input").size() > 0) {
              $("#presaleMobile input").val(consigneeResult.consigneeShowView.mobile);
            } else if ($("#userMobileByPresale").size() > 0) {
              $("#userMobileByPresale").html(consigneeResult.consigneeShowView.mobile);
            }
          }
        }
        //重新加载优惠券列表
        if($("#invokeNewCouponInterface").val() != "true"){
          reloadCoupon(consigneeResult.reloadCoupon);
        }else{
          reloadCouponNew(consigneeResult.reloadCoupon);
          reloadGiftCard();
        }       
       
        if($("#selfPickShutDownFlag").attr("value")==1){
		   	 if($("#jd_shipment_item").hasClass("curr")){
		   		 $("#pick_shipment_item").addClass("hide");
		    	 $("#selfpick_name").addClass("hide");
		    	 $("#selfpick_name").next("div").addClass("hide");
		   	 }else if($("#pick_shipment_item").hasClass("curr")){
			   	 $("#jd_shipment_item").addClass("hide");
			   	 $("#_jdpay").addClass("hide");
			   	 $("#selfpick_name").addClass("hide");
			   	 $("#selfpick_name").next("div").addClass("hide");
		   	 }else if($("#_jdpay").hasClass("curr")){
		   		 $("#pick_shipment_item").addClass("hide");
		    	 $("#selfpick_name").addClass("hide");
		    	 $("#selfpick_name").next("div").addClass("hide");
		   	 }
        }
     
      } else {
        delayRemoveLoading('#g-loading');
        openEditConsigneeDialog(consignee_id);
        return;
      }
      delayRemoveLoading('#g-loading');
      
    
      if(!$(".consignee-item.selfPickInCommonItem").hasClass("item-selected")){
    	  if(selfPickOptimize!=1 && $("#selfPickShutDownFlag").attr("value")==1){
	    	  if(!$("#consigneeItemAllClick").hasClass("hide") && $("#selfPickSiteName").length==1){
	    		  //地址收起的时候，如果有常用自提，不推荐
	    	  }else if($("#consignee-list .consignee-item").length==2 && $("#selfPickSiteName").length==1){
	    		  //只有一个常用地址，并且有常用自提，不推荐,待商榷???
	      		  //1、把现有推荐地址删除
	      		  $("#recommendAddr").remove();
	    	  }else{
	    		  $("#selfPickSiteName").removeClass("item-selected");
	    		  showRecommendSelfPickAddress();
	    		  $("#selfPickArea").removeClass("hide");
	    	  }
    	  }
      }
      
//      if($("#defaultSelfPick").length==0 && $("#recommendAddr").length==0){
//    	  $("#selfPickLine").addClass("hide");
//      }else{
//    	  $("#selfPickLine").removeClass("hide");
//      }
    
      
      if(isSelfPick!=1 && !isGiftBuy()){
    	  consigneeInfo();
      }else if(isSelfPick==1 && !isGiftBuy()){
    	//右下角的寄送至和收货人改了
    	$("#sendAddr").html("寄送至："+$("#defaultSelfPick").find(".addr-detail").find(".addr-info").text());
    	$("#sendMobile").html("收货人："+$("#defaultSelfPick").find(".addr-detail").find(".addr-name").text()+" "+$("#defaultSelfPick").find(".addr-detail").find(".addr-tel").text());
      }
//      $(".optimize").addClass("item-selected");
    },
    error: function(XMLHttpResponse) {
      goOrder();
      delayRemoveLoading('#g-loading');
      return;
    }
  });

}
window.tab_save_Consignee = tab_save_Consignee;

function showRecommendSelfPickAddress(payId){
  		  //1、把现有推荐地址删除
//  		  $("#recommendAddr").remove();
//	      var payId = $('.payment-item.item-selected').attr('payId');
  		  var pickParam = "";
  		  pickParam = pickParam + "paymentId="
  		if(payId == null || payId == "" || payId == "undefined" || payId == undefined || payId == "null"){
  			payId = $('.payment-item.item-selected').attr('payId');
  		}
  		  pickParam = pickParam + payId;
  		  pickParam = addFlowTypeParam(pickParam);
  		  var pickActionUrl = OrderAppConfig.AsyncDomain + "/payAndShip/getRecommendSelfPick.action";
  		  jQuery.ajax({
  			    type: "POST",
  			    dataType: "json",
  			    url: pickActionUrl,
  			    data: pickParam,
  			    cache: false,
  			    success: function(dataResult, textStatus) {
  			      if (isUserNotLogin(dataResult)) {
  			        goToLogin();
  			        delayRemoveLoading('#g-loading');
  			        return;
  			      }
  			      var jsonO = dataResult;
  			      if(jsonO!=null && jsonO.pickId!=0){
	  			    	$("#recommendAddr").removeClass("hide");
	  			    	
	  			    	if($("#recommendAddr").length>0){
	  			    		$("#recommendAddr").attr("pickid",jsonO.pickId);
	  			    		var pickSiteListHTML = "";
	  			    		  pickSiteListHTML = pickSiteListHTML +"<span class='addr-name'>"+ jsonO.pickName+"</span>";
		  			    	  pickSiteListHTML = pickSiteListHTML + "<span class='addr-info' limit='51'>";
//		  			    	  pickSiteListHTML = pickSiteListHTML + jsonO.pickName+" "+jsonO.areaName+" ";
//		  			    	  pickSiteListHTML = pickSiteListHTML + jsonO.pickName+" ";
		  			    	  pickSiteListHTML = pickSiteListHTML + jsonO.address;
		  			    	  pickSiteListHTML = pickSiteListHTML + "</span><span class='addr-tel'>";
		  			    	  pickSiteListHTML = pickSiteListHTML + "</span>";
	  			    		$("#recommendAddr .addr-detail").html("");
	  			    		$("#recommendAddr .addr-detail").append(pickSiteListHTML);
	  			    		$("#recommendAddr .addr-ops").html("");
	  			    		$("#recommendAddr .addr-ops").html("<a href='#none' class='setdefault-selfPick ftx-05 mr10' onclick='openUseSelfPickConsigneeDialog("+jsonO.pickId+")'>更换自提地址</a>");
	  			    	}else{
		  			    	//把新的推荐地址显示到页面
		  			    	  var pickSiteListHTML = "";
		  			    	  pickSiteListHTML = pickSiteListHTML + "<li id='recommendAddr' pickid='";
		  			    	  pickSiteListHTML = pickSiteListHTML + jsonO.pickId;
		  			    	  pickSiteListHTML = pickSiteListHTML + "'><div class='consignee-item' onclick='openUseSelfPickConsigneeDialog()'><i class='pick-rec-icon'></i><span>";
		  			    	  pickSiteListHTML = pickSiteListHTML + "匹配自提点";
		  			    	  pickSiteListHTML = pickSiteListHTML + "</span><b></b></div><div class='addr-detail'>";
		  			    	  pickSiteListHTML = pickSiteListHTML +"<span class='addr-name'>"+ jsonO.pickName+"</span>";
		  			    	  pickSiteListHTML = pickSiteListHTML + "<span class='addr-info' limit='45'>";
//		  			    	  pickSiteListHTML = pickSiteListHTML + jsonO.pickName+" "+jsonO.areaName+" ";
//		  			    	  pickSiteListHTML = pickSiteListHTML + jsonO.pickName+"   ";
		  			    	  pickSiteListHTML = pickSiteListHTML + jsonO.address;
		  			    	  pickSiteListHTML = pickSiteListHTML + "</span><span class='addr-tel'>";
		  			    	  pickSiteListHTML = pickSiteListHTML + "</span></div><div class='addr-ops'>";
		  			    	  pickSiteListHTML = pickSiteListHTML + "<a href='#none' class='setdefault-selfPick ftx-05 mr10' onclick='openUseSelfPickConsigneeDialog(";
		  			    	  pickSiteListHTML = pickSiteListHTML + jsonO.pickId;
		  			    	  pickSiteListHTML = pickSiteListHTML + ")'>更换自提地址</a>";
		  			    	  pickSiteListHTML = pickSiteListHTML + "</div></li>";
		  			    	  $("#selfPickInfo").append(pickSiteListHTML);
	  			    	}
  			      }else{
  			    	$("#recommendAddr").remove();
  			      }
  			      subStrConsignee();
  			      
  			      if($("#defaultSelfPick").length==0 && $("#recommendAddr").length==0){
  			    	  $("#selfPickLine").addClass("hide");
  			      }else{
  			    	  $("#selfPickLine").removeClass("hide");
  			      }
  			      
  			    },
  			    error: function(XMLHttpResponse) {
  			      goOrder();
  			      delayRemoveLoading('#g-loading');
  			      return;
  			    }
  			  });
}
window.showRecommendSelfPickAddress = showRecommendSelfPickAddress;

function gift_save_Consignee()
{  
  if(!checkGiftUserName()) return false;
  if(!checkGiftMobile())   return false;
  //$("#consignee_id").val(-1);
  tab_save_Consignee(true);
  var gift_user_mobile = $("#consigneeList_giftSenderConsigneeMobile").val();
  var sNum = "****";
  var begin = 3;
  var gift_user_mobile_dis = gift_user_mobile.substring(0,begin)+sNum+gift_user_mobile.substring(sNum.length+begin);
  $("#gift_user_name").html($("#consigneeList_giftSenderConsigneeName").val());
  if(!(gift_user_mobile.indexOf("*")>0))
  {
    $("#gift_user_mobile").html(gift_user_mobile_dis);
  }
  else
  {
    $("#consigneeList_giftSenderConsigneeMobile").val($("#gift_user_mobile").html().replace(/(^\s*)|(\s*$)/g,''));
  }
  $("#gift_info").show();
  $("#gift_input").hide();
}
window.gift_save_Consignee = gift_save_Consignee;

function checkGiftMobile()
{
  var value = $("#consigneeList_giftSenderConsigneeMobile").val();
  if(value == '')
  {
    $("#error_gift_mobile").show();
    $("#error_gift_mobile").html("电话号码不能为空");
    $("#consigneeList_giftSenderConsigneeMobile").focus();
    return false;
  }
  if (!(check_mobile(value) || new RegExp(/^\d{3}\*\*\*\*\d{4}$/).test(value)))
  {
    $("#error_gift_mobile").show();
    $("#error_gift_mobile").html("电话号码格式不正确");
    $("#consigneeList_giftSenderConsigneeMobile").focus();
    return false;
  }
  $("#error_gift_mobile").hide();
  return true;
}
window.checkGiftMobile = checkGiftMobile;

function checkGiftUserName()
{
  if($("#consigneeList_giftSenderConsigneeName").val()=='')
  {
    $("#error_gift_name").show();
    $("#error_gift_name").html("送礼人不能为空");
    $("#consigneeList_giftSenderConsigneeName").focus();
    return false;
  }
  
  if(!/^[a-zA-Z\u4e00-\u9fa5\\.]{0,20}$/i.test($("#consigneeList_giftSenderConsigneeName").val())){
    $("#error_gift_name").show();
    $("#error_gift_name").html("送礼人只能包含中文或字母");
    $("#consigneeList_giftSenderConsigneeName").focus();
    return false;
  }
  $("#error_gift_name").hide();
  return true;
}
window.checkGiftUserName = checkGiftUserName;

function editGiftUserInfo()
{
  $("#gift_info").hide();
  $("#gift_input").show();
}

window.editGiftUserInfo = editGiftUserInfo;
/**
 * 删除收货人地址
 */
function delete_Consignee(id) {
  $.closeDialog();
  var commonConsigeeSize = $("#hidden_consignees_size").val();
  var consigneeSize = parseInt(commonConsigeeSize);
  var param = "consigneeParam.id=" + id;
  var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/deleteConsignee.action";
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      if (isHasMessage(dataResult)) {
        showMessageWarn(getMessage(dataResult));
      } else {
        if (consigneeSize > 1) {
          consigneeSize = consigneeSize - 1;
          $("#hidden_consignees_size").val("" + consigneeSize);
        }
        $("#consignee_index_" + id).remove();
        
        //*******地址服务升级begin*******
		//删除地址后 需要移除 提示地址升级信息 以及 隐藏域地址信息
		$("#li_J_toUpgrade_" + id).remove();
		$("#hid_upArea_" + id).remove();
		//*******地址服务升级end*******
        
		//是否有滚动条
        if(window.consigneeScroll) {
          //refreshSize 包含 "正确地址" "错误地址" "错误地址提示升级信息"
          var refreshSize= ($('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').length-$('.selfPickInCommon').length);
          consigneeScroll.resetUpdate(refreshSize);
	  	}
        // 如果没有选中的则默认选中第一个地址
        if($("#consignee_id").val()==id) {
        	$(".consignee-item").first().click().parent().css("display", "list-item");
        }
        if(consigneeSize == 1){
          //var selectDiv = $(".consignee-item.item-selected").next().next();
          /**
           * 1.选中自提地址,常用地址中没有选中地址
           * 2.常用地址列表中可能有旧地址样式
           */
          var selectDiv = $("#consignee-list [c_div_custom_label=consignee_div]").next().next();
          selectDiv.find(".del-consignee").addClass("hide");
          selectDiv.find(".setdefault-consignee").addClass("hide");
          $("#consigneeItemAllClick").addClass("hide");
          $("#consigneeItemHideClick").addClass("hide");
        }
        //"更多地址"click
        $("#consigneeItemAllClick").click();
      }
    },
    error : function(XMLHttpResponse) {
      goOrder();
      return false;
    }
  });
}window.delete_Consignee = delete_Consignee;

/**
 * 使用新收货人地址
 */
function use_NewConsignee() {
  if (checkMaxConsigneeSize()) {
    showLargeMessage('地址限制','您的地址数，已经达到限制个数！');
    return;
  }
  $('body').dialog({
    title:'新增收货人信息',
    width:690,
    //height:330,
    height:410,
    type:'iframe',
    source:OrderAppConfig.DynamicDomain + "/consignee/editConsignee.action"
  });
}window.use_NewConsignee=use_NewConsignee;

/**
 * 新增收货地址
 * 海外
 */
function use_NewConsigneeOversea () {
	if (checkMaxConsigneeSize()) {
		showLargeMessage('地址限制','您的地址数，已经达到限制个数！');
		return;
	}
	$('body').dialog({
		title:'新增收货人信息',
		width:690,
		height:430,
		type:'iframe',
		source:OrderAppConfig.DynamicDomain + "/consignee/editConsignee.action?isOverSea=1"
	});
}window.use_NewConsigneeOversea=use_NewConsigneeOversea;

/**
 * 设置默认收货人地址
 */
function setAllDefaultAddress(id) {
  var param = "consigneeParam.id=" + id;
  var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/setAllDefaultAddress.action";
  param = addFlowTypeParam(param);
  jQuery.ajax( {
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      if (isHasMessage(dataResult)) {
        showMessageWarn(getMessage(dataResult));
      } else {
        $("#consignee-list").find(".consignee-item").each(function() {
          if ($(this).attr("consigneeid") != null) {
            $(this).next().next().find("span").remove();
            if($(this).attr("consigneeid") == id){
              $(this).next().next().find("a:first").remove();
              $(this).next().next().prepend("<span></span>");
              $(this).next().find("span:last").after("<span class='addr-default'>默认地址</span>");
              //$(this).find("span").text("默认地址");
            }else{
              if($(this).next().next().find("a").size() == 2){
                $(this).next().next().prepend("<a href='#none' class='ftx-05 setdefault-consignee' fid='"+$(this).attr("consigneeid")+"'>设为默认地址</a>");
                $(this).next().find("span:last").remove();
              }
            }
          }
        });
        
        //****** 地址服务升级begin ******
        //修正点击"设为默认地址"后,旧地址 未移除"默认地址"样式的bug(旧地址为原默认地址的情况)
        $("#consignee-list").find(".consignee-item-disable").each(function() {
            if ($(this).attr("consigneeid") != null) {
              $(this).next().next().find("span").remove();
              if($(this).attr("consigneeid") == id){
                $(this).next().next().find("a:first").remove();
                $(this).next().next().prepend("<span></span>");
                $(this).next().find("span:last").after("<span class='addr-default'>默认地址</span>");
                //$(this).find("span").text("默认地址");
              }else{
                if($(this).next().next().find("a").size() == 2){
                  //默认 隐藏 "设为默认地址" (注：错误地址不允许设置为默认地址)
                  $(this).next().next().prepend("<a href='#none' class='ftx-05 setdefault-consignee hide' fid='"+$(this).attr("consigneeid")+"'>设为默认地址</a>");
                  $(this).next().find("span:last").remove();
                }
              }
            }
          });
        //****** 地址服务升级end ******
        
        subStrConsignee();
      }
    },
    error : function(XMLHttpResponse) {
      goOrder();
      //alert("系统繁忙，请稍后再试！");
      return false;
    }
  });
}window.setAllDefaultAddress=setAllDefaultAddress;

function consigneeInfo(){
  var selectDiv = $(".consignee-item.item-selected").next();
  var address = selectDiv.find(".addr-info").html();
  var name = selectDiv.find(".addr-name").html();
  var phone = selectDiv.find(".addr-tel").html();
  var info="<span class=\"mr20\" id='sendAddr'>寄送至："+address+"</span>" + "<span id='sendMobile'>收货人："+name+" "+phone+"</span>";
  $(".fc-consignee-info").html(info);
}window.consigneeInfo=consigneeInfo;

/**
 * 验证收货地址消息提示
 * 
 * @param divId
 * @param value
 */
function check_Consignee(divId) {
  var errorFlag = false;
  var errorMessage = null;
  var value = null;
  // 验证收货人名称
  if (divId == "name_div") {
    value = $("#consignee_name").val();
    if (isEmpty(value)) {
      errorFlag = true;
      errorMessage = "请您填写收货人姓名";
    }
    if (value.length > 25) {
      errorFlag = true;
      errorMessage = "收货人姓名不能大于25位";
    }
    if (!is_forbid(value)) {
      errorFlag = true;
      errorMessage = "收货人姓名中含有非法字符";
    }
  }
  // 验证邮箱格式
  else if (divId == "email_div") {
    value = $("#consignee_email").val();
    if (!isEmpty(value)) {
      if (!check_email(value)) {
        errorFlag = true;
        errorMessage = "邮箱格式不正确";
      }
    } else {
      if (value.length > 50) {
        errorFlag = true;
        errorMessage = "邮箱长度不能大于50位";
      }
    }
  }
  // 验证地区是否完整
  else if (divId == "area_div") {
    var provinceId = $("#consignee_province").find("option:selected").val();
    var cityId = $("#consignee_city").find("option:selected").val();
    var countyId = $("#consignee_county").find("option:selected").val();
    var townId = $("#consignee_town").find("option:selected").val();
    // 验证地区是否正确
    if (isEmpty(provinceId) || isEmpty(cityId) || isEmpty(countyId)
        || ($("#span_town").html() != null && $("#span_town").html() != "" && !$("#span_town").is(":hidden") && isEmpty(townId))) {
      errorFlag = true;
      errorMessage = "请您填写完整的地区信息";
    }
  }
  // 验证收货人地址
  else if (divId == "address_div") {
    value = $("#consignee_address").val();
    if (isEmpty(value)) {
      errorFlag = true;
      errorMessage = "请您填写收货人详细地址";
    }
    if (!is_forbid(value)) {
      errorFlag = true;
      errorMessage = "收货人详细地址中含有非法字符";
    }
    if (value.length > 50) {
      errorFlag = true;
      errorMessage = "收货人详细地址过长";
    }
  }
  // 验证手机号码
  else if (divId == "call_mobile_div") {
    value = $("#consignee_mobile").val();
    divId = "call_div";
    if (isEmpty(value)) {
      errorFlag = true;
      errorMessage = "请您填写收货人手机号码";
    } else {
      if (!check_mobile(value)) {
        errorFlag = true;
        errorMessage = "手机号码格式不正确";
      }
    }
    if (!errorFlag) {
      value = $("#consignee_phone").val();
      if (!isEmpty(value)) {
        if (!is_forbid(value)) {
          errorFlag = true;
          errorMessage = "固定电话号码中含有非法字符";
        }
        if (!checkPhone(value)) {
          errorFlag = true;
          errorMessage = "固定电话号码格式不正确";
        }
      }
    }
  }
  // 验证电话号码
  else if (divId == "call_phone_div") {
    value = $("#consignee_phone").val();
    divId = "call_div";
    if (!isEmpty(value)) {
      if (!is_forbid(value)) {
        errorFlag = true;
        errorMessage = "固定电话号码中含有非法字符";
      }
      if (!checkPhone(value)) {
        errorFlag = true;
        errorMessage = "固定电话号码格式不正确";
      }
    }
    if (true) {
      value = $("#consignee_mobile").val();
      if (isEmpty(value)) {
        errorFlag = true;
        errorMessage = "请您填写收货人手机号码";
      } else {
        if (!check_mobile(value)) {
          errorFlag = true;
          errorMessage = "手机号码格式不正确";
        }
      }
    }
  }
  
   
  // 验证手机号码
  else if (divId == "call_selfmobile_div") {
    value = $("#consignee_mobile").val();
    if (isEmpty(value)) {
      errorFlag = true;
      errorMessage = "请您填写收货人手机号码";
    } else {
      if (!check_mobile(value)) {
        errorFlag = true;
        errorMessage = "手机号码格式不正确";
      }
    }
  }
  // 验证电话号码
  else if (divId == "call_selfphone_div") {
    value = $("#consignee_phone").val();
    if (!isEmpty(value)) {
      if (!is_forbid(value)) {
        errorFlag = true;
        errorMessage = "固定电话号码中含有非法字符";
      }
      if (!checkPhone(value)) {
        errorFlag = true;
        errorMessage = "固定电话号码格式不正确";
      }
    }
  }
  
  if (errorFlag) {
    $("#" + divId + "_error").html(errorMessage);
    $("#" + divId).addClass("message");
    return false;
  } else {
    $("#" + divId).removeClass("message");
    $("#" + divId + "_error").html("");
  }
  return true;
}window.check_Consignee=check_Consignee;

/**
 * 检查地址是否是最大数量
 * 
 * @returns {Boolean}
 */
function checkMaxConsigneeSize() {
  var isMaxConsigneeSize = false;
  var commonConsigeeSize = $("#hidden_consignees_size").val();
  if (commonConsigeeSize >= 20)
    isMaxConsigneeSize = true;
  return isMaxConsigneeSize;
}window.checkMaxConsigneeSize=checkMaxConsigneeSize;


// ******************************************************保存支付**************************************************************
/**
 * 保存支付与配送方式
 */
function save_Pay(type, onlineType,isPayTab) {
	var typeFlag = type;
	if(type==300){
		type=0;
	}
  if($("#flowType").val()=="1" || $("#flowType").val()=="13"){
    loadSkuList();
    return;
  }
  var payId;
  var otype;
  if(type == null || type == "" || type == "undefined" || type == undefined || type == "null"){
    payId = $('.payment-item.item-selected').attr('payId');
  }else{
    payId=type;
  }
  if(onlineType === 0 || onlineType === 1 || onlineType === 2 || onlineType === 3){
	  otype = onlineType;
  }else{
	  otype = $('.payment-item.item-selected').attr('onlinepaytype');
  }
  var pickShipmentItemCurr = $("#pick_shipment_item").hasClass("curr");
  var param = "shipParam.payId=" + payId + 
              "&shipParam.pickShipmentItemCurr=" + pickShipmentItemCurr + 
              "&shipParam.onlinePayType=" + otype;
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : OrderAppConfig.DynamicDomain + "/payAndShip/getVenderInfo.action",
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      // 服务器返回异常处理,如果有消息div则放入,没有则弹出
      if (isHasMessage(dataResult)) {
        goOrder();
        return;
      } else { // 成功后如果有divID直接放入div，没有则返回结果
        $("#payShipAndSkuInfo").remove();
        $('#shipAndSkuInfo').append('<div id="payShipAndSkuInfo">'+dataResult+'</div>');
        preSaleShow();
        
        flushPlusInfo(2);
        flushCross(2);
        //add by zhuqingjie 此处调用异步
        if(typeFlag==300){
        	doAsynGetSkuPayAndShipInfo(3);
        }else{
        	doAsynGetSkuPayAndShipInfo(1);
        }
        freshUI();
        //end add
        // 企业用户合并支付
        if ($('.payment-item.item-selected').attr('payId') == 5 && $("#enterPriseUser").val() == "true" && $("#closeEnterPrisePayment").val() == "false") {
        	$("#enterPriseUserPaymentSubmit").css('display', 'block');
        } else {
        	$("#enterPriseUserPaymentSubmit").css('display', 'none');
        }
      }
    },
    error : function(XMLHttpResponse) {
      initResetFlag();
      goOrder();
    }
});
//  if($("#selfPickShutDownFlag").attr("value")==1 && onlineType!=100){	 
  if($("#selfPickShutDownFlag").attr("value")==1 && isPayTab==1){
	  var actionUrl = OrderAppConfig.AsyncDomain + "/payAndShip/verifySelfPickCanUse.action";
		var param ="shipParam.payId=" + payId;
		var regionId = $("#temp_pick_sel_regionid").val();
		if (isEmpty(regionId)) {
			regionId = "-1";
		}
		param = param + "&shipParam.regionId=" + regionId;
		param = addFlowTypeParam(param);
		jQuery.ajax({
		    type: "POST",
		    dataType: "json",
		    url: actionUrl,
		    data: param,
		    cache: false,
		    success: function(dataResult, textStatus) {
		      // 没有登录跳登录
		      if (isUserNotLogin(dataResult)) {
		        goToLogin();
		        return;
		      }
		      if (dataResult == "null" || dataResult == null || dataResult == "" || dataResult == 0) {
		    	  //商品不支持自提，置灰自提，不可重新选择
		    	  $("#selfPickSiteName").removeClass("consignee-item");
		    	  $("#selfPickSiteName").addClass("consignee-item-disable");
		    	  $(".selfPickChoose").addClass("hide");
		    	  $(".edit-selfconsignee").addClass("hide");
		    	  $(".noPickChoose").removeClass("hide");
		      }else if(dataResult==2){
		    	  $("#selfPickSiteName").removeClass("consignee-item-disable");
		    	  $("#selfPickSiteName").addClass("consignee-item");
		    	  $(".selfPickChoose").addClass("hide");
		    	  $(".edit-selfconsignee").removeClass("hide");
		    	  $(".noPickChoose").addClass("hide");
		      }else if(dataResult==1){
		    	  $("#selfPickSiteName").removeClass("consignee-item");
		    	  $("#selfPickSiteName").addClass("consignee-item-disable");
		    	  $(".selfPickChoose").removeClass("hide");
		    	  $(".edit-selfconsignee").addClass("hide");
		    	  $(".noPickChoose").addClass("hide");
		      }else{
		    	  //商品不支持自提，置灰自提，不可重新选择
		    	  $("#selfPickSiteName").removeClass("consignee-item");
		    	  $("#selfPickSiteName").addClass("consignee-item-disable");
		    	  $(".selfPickChoose").addClass("hide");
		    	  $(".edit-selfconsignee").addClass("hide");
		    	  $(".noPickChoose").removeClass("hide");
		      }
		    },
		    error: function(XMLHttpResponse) {
		      return false;
		    }
		  });
		//重新推荐自提
		if($("#recommendAddr").length>0){
			showRecommendSelfPickAddress(payId);
		}
  }
}window.save_Pay=save_Pay;
// ---------------------------------------------------------------------------------------------------------------------------
/**
 * 刷新plustip
 */
function flushPlusInfo(type){
	if($("#totalPriceVender").val()=="0"|| typeof $("#totalPriceVender").val() =='undefined'){
		$("#plusInfo").addClass("hide");
		$("#totalPrice").val($("#totalPriceVender").val());
	}else{
		$("#plusInfoByFreight").addClass("hide");
		var plusInfo = jQuery.parseJSON($(".plusInfoConfig").html());
		if(plusInfo != null && plusInfo.plusInfos.length>0){
			var plusProductList;
			var contentMoney;
			if(type=="1"){
				plusProductList = jQuery.parseJSON($(".plusProductList").html());
				contentMoney= "省¥"+$("#totalPriceVender").val();
			}else if(type=="2"){
				$("#totalPrice").val($("#totalPriceVender").val());
				plusProductList = jQuery.parseJSON($(".plusProductListVender").html());
				contentMoney= "省¥"+$("#totalPriceVender").val();
				$("#totalNum").html($("#totalNumVender").val());
				$(".plusProductList").html($(".plusProductListVender").html());
			}
			if($('#totalPriceVender').val()>=149 && $('#plusStatus').val()!=""){
				var m = $('#plusStatus').val();
				var content = plusInfo.plusInfos[m].content;
		    	var url = plusInfo.plusInfos[m].url;
		    	var clstag = plusInfo.plusInfos[m].clstag;
		    	var typeContent = plusInfo.plusInfos[m].typeContent;
		    	var infoHtml="";
	    		infoHtml+="<p class='plus ar pr20'>";
	    		infoHtml+="<i class='plus-icon mr5'></i>"+content;
	    		infoHtml+="&nbsp;&nbsp;<em id='totalPriceEm'>"+contentMoney+"</em>";
	    		infoHtml+="<i class='plus-tips'></i>";
	    		infoHtml+="<a href='"+url+"' target='_blank' class='ftx-08 ml20' clstag='"+clstag+"'>"+typeContent+"&nbsp;&gt;</a></p>";
	    		$("#plusInfo").html(infoHtml);
		    	$('#plusInfo').removeClass("hide");
		    }else if($('#plusStatus').val()=="0" && 0<$('#totalPriceVender').val()<149){
		    	var content = plusInfo.plusInfos[5].content;
		    	var url = plusInfo.plusInfos[5].url;
		    	var clstag = plusInfo.plusInfos[5].clstag;
		    	var typeContent = plusInfo.plusInfos[5].typeContent;
		    	var infoHtml="";
	    		infoHtml+="<p class='plus ar pr20'>";
	    		infoHtml+="<i class='plus-icon mr5'></i>"+content;
	    		infoHtml+="&nbsp;&nbsp;<em id='totalPriceEm'>"+contentMoney+"</em>";
	    		infoHtml+="<i class='plus-tips'></i>";
	    		infoHtml+="<a href='"+url+"' target='_blank' class='ftx-08 ml20' clstag='"+clstag+"'>"+typeContent+"&nbsp;&gt;</a></p>";
	    		$("#plusInfo").html(infoHtml);
		    	$('#plusInfo').removeClass("hide");
		    }else{
		    	$('#plusInfo').addClass("hide");
		    }
			$("#totalPricetip").html("¥"+$("#totalPriceVender").val());
			var html="<ul>";
			for(var i=0;i<plusProductList.length;i++){
				html+="<li class='pbox-item'>";
				html+="<img class='mr15' src='//img14.360buyimg.com/N4/"+plusProductList[i].sku.imgUrl+"' alt='' width='50' height='50'>";
				html+="<div class='pbox-item-desc'>";
				html+="<p class='ftx-08'>¥"+plusProductList[i].plusPrice+"<i class='plus-price'></i></p>";
				var discount = (plusProductList[i].sku.promotion.price-plusProductList[i].sku.promotion.promotionDiscount).toFixed(2)
				html+="<p class='ftx-03'>原价¥"+discount+"</p>";
				html+="<p class='ftx-03'>x"+plusProductList[i].sku.buyNum+"</p></div>";
				html+="<span class='ftx-01 fr'>省¥"+plusProductList[i].plusPriceSpread+"</span></li>";
			}
			html+="<ul>";
			$("#plusProducts").html(html);
		}
	}
}window.flushPlusInfo = flushPlusInfo;


/**
 * 刷新跨区服务费
 */
function flushCross(type){
	var fee;
	var skus;
	if(type=="1"){
		fee = $("#crossRegionalFee").val();
		skus = jQuery.parseJSON($(".crossSku").html());
	}else{
		fee = $("#crossRegionalFeeVender").val();
		skus = jQuery.parseJSON($(".crossSkuVender").html());
	}
	fee =Number(fee).toFixed(2);
	$("#totalCrossRegionalFee").html("总计 ¥"+fee);
	if(skus != null && typeof skus.length !='undefined' && skus.length>0){
		$("#crossRegionalFeetip").removeClass("hide");
		$("#crossRegionalFeeId").html("<i class='freight-icon crossRegionalFee'></i><font color='#FF6600'> ￥"+fee+" </font>");
		var html="<div class='ui-switchable-body'> <div class='ui-switchable-panel-main' >";
		for(var i=0;i<skus.length;i++){
			if(i==0){
				html+="<div class='ui-switchable-panel' > <ul class='sfb-goods-list'>";
			}else if(i % 5 ==0 && i !=0){
				html+="<div class='ui-switchable-panel hide' > <ul class='sfb-goods-list'>";
			}
			html+="<li  class=sfb-goods-item >";
			html+="<a href='#none' title="+skus[i].skuName+"><img height='50' width='50' src='//img12.360buyimg.com/n3/"+skus[i].skuImgUrl+"' alt=''/></a></li>";
			if((i+1) % 5 ==0 && i+1 != skus.length){
				html+="</ul></div>";
			}else if(i+1 == skus.length){
				html+="</ul></div>";
			}
		}
		html+="</div></div><div class='sfb-ui-switchable-page' >";
		html+="<a href='javascript:void(0)' class='sfb-prev'>&lt;</a>";
		html+="<a href='javascript:void(0)' class='sfb-next'>&gt;</a></div>";
		$("#crossSkus").html(html);
	}else{
		$("#crossRegionalFeetip").addClass("hide");
	}
}window.flushCross = flushCross;

/**
 * 加载四级地址名称
 * 
 * @param id
 */
function loadAllAreaName(id) {
  var address = null;
  //var consignee_where = $("#hidden_consignee_where_" + id).val();
  var provinceId = $("#hidden_consignee_provinceId_" + id).val();
  var cityId = $("#hidden_consignee_cityId_" + id).val();
  var countyId = $("#hidden_consignee_countyId_" + id).val();
  var townId = $("#hidden_consignee_townId_" + id).val();
  var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/loadAreaName.action";
  var param = "consigneeParam.provinceId=" + provinceId + "&consigneeParam.cityId=" + cityId + "&consigneeParam.countyId=" + countyId + "&consigneeParam.townId="
      + townId;
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      if (isHasMessage(dataResult)) {
        var message = getMessage(dataResult);
        alert(message);
      } else {
        //address = consignee_where.replace(dataResult, "");
        $("#hidden_consignee_address_" + id).val(address);
      }
    },
    error : function(XMLHttpResponse) {
      //alert("系统繁忙，请稍后再试！");
      return false;
    }
  });
}

/**
 * 判断轻松购是否弹开
 * 
 * @param id
 */
function open_easyBuyConsignee(id) {
  var isHidden = $("#consignee-form").is(":hidden");// 是否隐藏
  var consignee_type = $("#hidden_consignee_type_" + id).val();
  var consignee_townId = $("#hidden_consignee_townId_" + id).val();
  consignee_townId = consignee_townId + "";
  if (isNaN(consignee_townId)) {
    consignee_townId = "0";
  }
  consignee_townId = parseInt(consignee_townId);
  if (isHidden && (consignee_type == 0 || consignee_type == "0")) {
    var mobile = $("#hidden_consignee_mobile_" + id).val();
    if (isEmpty(mobile) || isNaN(mobile)) {
      show_ConsigneeDetail(id);
      return;
    }
  }
  if (isHidden && (consignee_type == 0 || consignee_type == "0") && consignee_townId <= 0) {
    var consignee_provinceId = $("#hidden_consignee_provinceId_" + id).val();
    var consignee_cityId = $("#hidden_consignee_cityId_" + id).val();
    var consignee_countyId = $("#hidden_consignee_countyId_" + id).val();
    var param = "consigneeParam.type=" + consignee_type + "&consigneeParam.provinceId=" + consignee_provinceId + "&consigneeParam.cityId=" + consignee_cityId
        + "&consigneeParam.countyId=" + consignee_countyId + "&consigneeParam.townId=0";
    var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/openEasyBuy.action";
    jQuery.ajax({
      type : "POST",
      dataType : "json",
      url : actionUrl,
      data : param,
      cache : false,
      success : function(data, textStatus) {
        if (isUserNotLogin(data)) {
          goToLogin();
          return;
        }
        if (data) {
          show_ConsigneeDetail(id);
        }
      },
      error : function(XMLHttpResponse) {
        //alert("系统繁忙，请稍后再试！");
      }
    });
  }
}

/**
 * 判断是否展开地址
 */
function openConsignee() {
  var areaId = $("#hideAreaIds").val();
  var areaIds = null;
  if (areaId != null) {
    areaIds = new Array(); // 定义一数组
    areaIds = areaId.split("-");
  }
  if (areaIds != null && areaIds.length == 4) {
    var param = "consigneeParam.provinceId=" + areaIds[0] + "&consigneeParam.cityId=" + areaIds[1] + "&consigneeParam.countyId=" + areaIds[2]
        + "&consigneeParam.townId=" + areaIds[3];

    var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/checkOpenConsignee.action";
    jQuery.ajax({
      type : "POST",
      dataType : "json",
      url : actionUrl,
      data : param,
      cache : false,
      success : function(data, textStatus) {
        if (isUserNotLogin(data)) {
          goToLogin();
          return;
        }
        if (data) {
          //地址校验(注:已配置地址校验等级,配置降级才会被调用此校验接口)
          openEditConsigneeDialog($("#consignee_id").val());
          $("#ui-dialog-close").val(1);
        }
      },
      error : function(XMLHttpResponse) {
        //alert("系统繁忙，请稍后再试！");
      }
    });
  }
}

function loadGiftBuySenderTip() {
  if (isGiftBuy()) {
    $("#saveConsigneeTitleDiv").text("保存收礼人信息");
    $("#saveConsigneeTitleMinDiv").text("保存收礼人信息");
    $("#giftSenderDiv").show();
    $("#consignee-giftSender-form").show();
  } else {
    $("#saveConsigneeTitleDiv").text("保存收货人信息");
    $("#saveConsigneeTitleMinDiv").text("保存收货人信息");
    $("#giftSenderDiv").hide();
    $("#consignee-giftSender-form").hide();
  }
}

/**
 * 校验送礼人姓名
 * 
 * @returns {Boolean}
 */
function checkGiftBuySenderName() {
  var value = $("#giftSender_consignee_name").val();
  var errorFlag = false;
  var errorMessage = "";
  if (isEmpty(value)) {
    errorFlag = true;
    errorMessage = "请您填写送礼人姓名";
  }
  if (value.length > 25) {
    errorFlag = true;
    errorMessage = "收货人姓名不能大于25位";
  }
  if (!is_forbid(value)) {
    errorFlag = true;
    errorMessage = "收货人姓名中含有非法字符";
  }
  if (errorFlag) {
    $("#giftSender_name_div_error").html(errorMessage);
    $("#giftSender_name_div").addClass("message");
    return false;
  } else {
    $("#giftSender_name_div").removeClass("message");
    $("#giftSender_name_div_error").html("");
    return true;
  }
}window.checkGiftBuySenderName=checkGiftBuySenderName;

/**
 * 校验送人手机号
 */
function checkGiftBuySenderMobile() {
  var value = $("#giftSender_consignee_mobile").val();
  var errorFlag = false;
  var errorMessage = "";
  if (isEmpty(value)) {
    errorFlag = true;
    errorMessage = "请您填写收货人手机号码";
  } else {
    if (!check_mobile_new(value)) {
      errorFlag = true;
      errorMessage = "手机号码格式不正确";
    }
  }
  if (errorFlag) {
    $("#giftSender_call_div_error").html(errorMessage);
    $("#giftSender_call_div").addClass("message");
    return false;
  } else {
    $("#giftSender_call_div").removeClass("message");
    $("#giftSender_call_div_error").html("");
    return true;
  }
}window.checkGiftBuySenderMobile=checkGiftBuySenderMobile;

// *****************************************************发票开始********************************************************************

/**
 * 编辑发票信息
 * 
 * @param consigneeId
 */
function edit_Invoice() {
  var url = OrderAppConfig.DynamicDomain + "/invoice/editInvoice.action?1=1";
  var dialogHeight = 600;
  if(isLipinkaPhysical()) {
	    dialogHeight = 680;
  }
  url = addFlowTypeParam(url); 
  $('body').dialog({
    title:'发票信息',
    width:620,
    height:dialogHeight,
    type:'iframe',
    autoIframe:false,
    iframeTimestamp:false,
    mainId:'mainId',
    source: url
  });
}
window.edit_Invoice = edit_Invoice;
/**
 * 
 * 删除发票信息
 * 
 * @param _id
 */
function delete_Invoice(id) {
  $('#mainId').hide();  
  //var isLowIE = ($.browser.isIE7() || $.browser.isIE8() || $.browser.isIE9() || $.browser.isIE10() || $.browser.isIE11())?true:false;
  //var _tempWindow = isLowIE?window.dialogIframe:window.dialogIframe.contentWindow;
  var _tempWindow = document.getElementById('dialogIframe').contentWindow;
  var _$this = _tempWindow.$('#invoice-tit-list .invoice-item[date-fid=fid'+id+']');
  var diaDel = $('body').dialog({
    title:'提示',
    width:400,
    height:100,
    type:'html',
    mainId:'delMainId',
    source:'<div class="tip-box icon-box"><span class="warn-icon m-icon"></span><div class="item-fore"><h3>您确定要删除该发票信息吗？</h3></div><div class="op-btns ac"><a id="delSaveBtn" href="#none"class="btn-9">确定</a><a id="delcallBtn" href="#none" class="btn-9 ml10">取消</a></div></div>',
    onReady:function(){
      $('#delSaveBtn').bind('click',function(){
        var actionUrl = OrderAppConfig.AsyncDomain + "/invoice/deleteInvoiceFromUsual.action";        
        var invokeInvoiceBasicService = $("#invokeInvoiceBasicService").val();        
        var param = "invoiceParam.usualInvoiceId=" + id;
        param = param + "&invokeInvoiceBasicService=" + invokeInvoiceBasicService;
        jQuery.ajax({
          type : "POST",
          dataType : "json",
          url : actionUrl,
          data : param,
          cache : false,
          success : function(dataResult, textStatus) {
            if (isHasMessage(dataResult)) {
              var message = getMessage(dataResult);
              alert(message);
            } else {
              _$this.removeClass('invoice-item-selected');
              if($('#invoice-tit-list .invoice-item-selected').length<=0){
                _$this.prev().click();
              }
              _$this.remove();
              var len =_tempWindow.$('#invoice-tit-list').find('.invoice-item').length;
              if(len<11){
            	  _tempWindow.$('#add-invoice').show();
              }else{
            	  _tempWindow.$('#add-invoice').hide();
              }
              diaDel.close();           
              $('#mainId').show(); 
              if($('#invoice-tit-list .invoice-item.invoice-item-selected').attr("selectType")==2){
            	  var invoiceCode = $('#invoice-tit-list .invoice-item.invoice-item-selected').attr("invoiceCode");
		    	  $('#nor_code').val(invoiceCode);
            	  $('#nor_code_div').removeClass("hide");
				}else{
					$('#nor_code_div').addClass("hide");
				}
            }
              var invoice_dialog = _tempWindow.$(".invoice-dialog");
              if(invoice_dialog != null && invoice_dialog.height() > 0) {
                  var invoice_height = _tempWindow.$(".invoice-dialog").height();
                  $(".ui-dialog-content").height(invoice_height + 60);
              }
          },
          error : function(XMLHttpResponse) {
            diaDel.close();
            $('#mainId').show(); 
            }
          });   
          
        });
      //点击取消click
      $('#delcallBtn').bind('click',function(){
        diaDel.close();
        $('#mainId').show(); 
      });
      //点击叉子click
      $('#delMainId .ui-dialog-close').bind('click',function(){
        $('#mainId').show(); 
      });
    }
  });
}window.delete_Invoice=delete_Invoice;


// *************************************************支付和配送方式开始***************************************************************

function getSelectedPaymentId() {
  var paymentId = 4;
  paymentId = $("input[name='payment'][checked]").val();
  return paymentId;
}


/**
 * 显示配送方式显示的时间
 */
function showCodeTime() {
  $(".t-item").each(function() {
    $(this).show();
  });
  $("#jdShipmentTip").show();
}

/**
 * 选中promise
 */
function selectedPromise() {
  $("#delivery-t4").attr('checked', true);
  $('#date-311').click();
}



function removeMessageTip() {
  $("#save-payAndShip-tip").html("");
  $("#save-consignee-tip").html("");
  $("#save-invoice-tip").html("");
}

/**
 * 用户选中支付方式radio弹出层显示支持与不支持的商品列表
 * 
 * @param obj
 */
var YP_Sku_Flag = null;

function showSkuDialog(obj) {
  if ($(obj).attr("payid") != 4) {
    $("#payment-bankList").hide();
  }
  if ($(obj).attr("payid") == 4) {
    $("#payment-bankList").show();
  }

  if ($(obj).attr("payid") != 1) {
    $("#payment-factoryShipCod").hide();
  }
  if ($(obj).attr("payid") == 1) {
    $("#payment-factoryShipCod").show();
  }
  if ($(obj).attr("payid") != 8) {
    $("#payRemark_8").hide();
  }
  if (YP_Sku_Flag) {
    YP_Sku_Flag = $(obj).parents('.item').parent().find('.item-selected :radio');
  }

  var payArr = $("[id^='pay-method-']");
  for (var i = 0; i < payArr.length; i++) {
    $(payArr[i]).parent().parent().removeClass("item-selected");
    var itempayid = $(payArr[i]).parent().parent().attr("payid");

    $("#supportPaySkus-" + itempayid).css("display", "none");
    // $("#otherSupportSkus-" + itempayid).css("display", "none");

  }
  var selectedPay = $(obj).parent().parent();
  selectedPay.addClass("item-selected");

  var payId = $(obj).attr("payid");
  // 清除其他选项的选中状态
  var itemList = $(".payment").find('.item');
  for (var i = 0; i < itemList.length; i++) {
    var item = itemList[i];
    var $item = $(item);
    $item.height(28);
    $item.find(".label").find("span").hide();
    $item.find(".label").find(".orange").show();
    $item.find(".sment-mark").css("display", "none");
  }

  var dialogDiv = $("#payment-dialog-" + payId)[0];
  if (!!dialogDiv) {
    $.jdThickBox({
      width : 550,
      height : 330,
      title : "请确认支付方式",
      _box : "payment_dialog",
      _con : "payment_dialog_box",
      _close : "payment_dialog_close",
      // source: $("#payment-dialog") // 当指定type时，页面元素容器
      source : '<div class="iloading" style="padding:20px;">正在加载中...<\/div>'
    }, function() {
      $("#payment_dialog, #payment_dialog_box").css("height", "auto");

      var PDHTML = $("#payment-dialog-" + payId)[0].value;

      $("#payment_dialog_box").html(PDHTML);

      $("#dialog-enter-" + payId).bind("click", function() {
        // 清除其他选项的选中状态
        var itemList = $(".payment").find('.item');
        for (var i = 0; i < itemList.length; i++) {
          var item = itemList[i];
          var $item = $(item);
          $item.height(28);
          $item.find(".label").find("span").hide();
          $item.find(".label").find(".orange").show();
          $item.find(".sment-mark").css("display", "none");
        }
    
        $("#supportPaySkus-" + payId).css("display", "inline-block");
        $("#otherSupportSkus-" + payId).css("display", "block");
        jdThickBoxclose();
        if ($("#otherSupportSkus-" + payId) && $("#otherSupportSkus-" + payId).length > 0 && $("#otherSupportSkus-" + payId).find('span').size() > 0) {
          selectedPay.height(56);
        } else {
          selectedPay.height(28);
        }
        YP_Sku_Flag = obj;
        $(obj).attr("checked", "checked");
      });
      $("#dialog-cancel-" + payId).bind("click", function() {

        var itemList = $(".payment").find('.item');
        for (var i = 0; i < itemList.length; i++) {
          var item = itemList[i];
          var $item = $(item);
          $item.height(28);
          $item.find(".label").find("span").hide();
          $item.find(".label").find(".orange").show();
          $item.find(".sment-mark").css("display", "none");
        }

        jdThickBoxclose();
        $(obj).attr('checked', false);
        $(obj).parents(".item").removeClass('item-selected');
        $("#pay-method-4").attr('checked', true);
        $("#pay-method-4").parents(".item").addClass('item-selected');
        //edit_Shipment(4);【dodoa 换成灵辉的方法】
      });
    });
  } else {
    //edit_Shipment(payId);【dodoa 换成灵辉的方法】
  }

}

/**
 * 支付配送展开后的弹窗
 * 
 * @param id
 * @param skuDivId
 * @return
 */
function showShipmentSkuList(id, skuDivId) {
  $("#" + skuDivId).removeClass("hide").show();
  var offset = $("#" + id).position();
  var x = offset.left + 60;
  $('#' + skuDivId).show().css({
    left : x,
    top : -2
  });
}

/**
 * 支付配送关闭后的配送的弹窗
 * 
 * @param id
 * @param SkuDiagId
 * @return
 */
function showShipmentSkuListOutside(id, SkuDiagId) {
  if ($("#payment-ship").find("#payment-window-1").html() != null) {
    $("#payment-ship").find("#payment-window-1").hide();
  }
  if ($("#payment-ship").find("#payment-window-2").html() != null) {
    $("#payment-ship").find("#payment-window-2").hide();
  }
  if ($("#payment-ship").find("#pick-show-sku-out-1").html() != null) {
    $("#payment-ship").find("#pick-show-sku-out-1").hide();
  }
  if ($("#payment-ship").find("#pick-show-sku-out-2").html() != null) {
    $("#payment-ship").find("#pick-show-sku-out-2").hide();
  }
  if ($("#payment-ship").find("#pick-show-sku-out-3").html() != null) {
    $("#payment-ship").find("#pick-show-sku-out-3").hide();
  }
  var topDistance = parseInt(id.substring(id.length - 1, id.length) - 1) * 20;
  $("#payment-ship").find("#" + SkuDiagId).css({
    position : "absolute",
    top : (20 + topDistance) + "px",
    left : 130,
    display : "block"
  });

}

/**
 * 支付配送关闭后的支付方式的弹窗
 * 
 * @param id
 * @param SkuDiagId
 * @return
 */
function showPaymentSkuListOutside(id, SkuDiagId) {
  if ($("#payment-ship").find("#payment-window-1").html() != null) {
    $("#payment-ship").find("#payment-window-1").hide();
  }
  if ($("#payment-ship").find("#payment-window-2").html() != null) {
    $("#payment-ship").find("#payment-window-2").hide();
  }
  if ($("#payment-ship").find("#pick-show-sku-out-1").html() != null) {
    $("#payment-ship").find("#pick-show-sku-out-1").hide();
  }
  if ($("#payment-ship").find("#pick-show-sku-out-2").html() != null) {
    $("#payment-ship").find("#pick-show-sku-out-2").hide();
  }
  if ($("#payment-ship").find("#pick-show-sku-out-3").html() != null) {
    $("#payment-ship").find("#pick-show-sku-out-3").hide();
  }

  var distance = 0;
  if ($.trim($("#payment-ship").find("#pay-name-for-window-1").text()).length == 5) {
    distance = 8;
  } else if ($.trim($("#payment-ship").find("#pay-name-for-window-1").text()).length == 7) {
    distance = 36;
  } else if ($.trim($("#payment-ship").find("#pay-name-for-window-1").text()).length == 8) {
    distance = 46;
  }
  if ("pay-name-for-window-1" == id) {
    $("#payment-ship").find("#payment-window-1").css({
      position : "absolute",
      top : -4,
      left : (165 + distance) + "px",
      display : "block"
    });
  } else {
    if ($.trim($("#payment-ship").find("#check-info-name").text()) != "") {
      distance += 368;
    }
    $("#payment-ship").find("#payment-window-2").css({
      position : "absolute",
      top : -4,
      left : (225 + distance) + "px",
      display : "block"
    });
  }
}

/**
 * 支付配送关闭后的配送方式商品弹窗
 * 
 * @param skuId
 * @return
 */
function removeShipmentSkuListOutside(skuId) {
  $("#payment-ship").find("#" + skuId).hide();
}
/**
 * 支付配送关闭后的支付方式商品弹窗
 * 
 * @param skuId
 * @return
 */
function removePaymentSkuListOutside(skuId) {
  $("#payment-ship").find("#" + skuId).hide();
}
/**
 * 支付配送展开后的商品弹窗
 * 
 * @param skuDivId
 * @return
 */
function removeShipmentSkuListInside(skuDivId) {
  $("#" + skuDivId).hide();
}

function removeFreightSpan() {
  $("#transport").hide();
}window.removeFreightSpan = removeFreightSpan;

function changeBigItemDate(dateValue) {
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : OrderAppConfig.DynamicDomain + "/payAndShip/getInstallDates.action?payAndShipParam.bigSkuTimeId=" + dateValue,
    data : "",
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      $("#installOptionDiv").html(dataResult);
    },
    error : function(XMLHttpResponse) {
      //alert("系统繁忙，请稍后再试！");
      return false;
    }
  });
}

/**
 * 获取支票信息
 * 
 * @param type
 * @return
 */
function getCheckInfo(type) {

  // 2为支票, 如果选择的不为支票则清空支票信息div
  if (type != 2) {
    $("#checkInfo").html("");
  } else {
    var param = addFlowTypeParam();
    $.ajax({
      type : "POST",
      dataType : "text",
      url : OrderAppConfig.AsyncDomain + "/payAndShip/getShipmentCheckInfo.action",
      data : param,
      cache : false,
      success : function(dataResult, textStatus) {
        // 没有登录跳登录
        if (isUserNotLogin(dataResult)) {
          goToLogin();
          return;
        }
        $("#checkInfo").html(dataResult);
        $('.cheque-item :radio').bind('click', function() {
          $('.cheque-btn a').removeClass().addClass('btn-submit');
          $('.cheque-item').removeClass('current');
          $(this).parents('.cheque-item').addClass('current');
        });
      },
      error : function(XMLHttpResponse) {
        //alert("系统繁忙，请稍后再试！");
        return false;
      }
    });
  }
}

/**
 * 跳转到公司转账
 * 
 * @return
 */
function goToCompanyTransfer() {
  // 设置当前选中支付方式为公司转账
  $("#pay-method-5").attr("checked", true);
  // 刷新配送方式
  //edit_Shipment(5);【dodoa 换成灵辉的方法】
  $("#pay-method-1").parents(".item").removeClass("item-selected").height(28);
  $("#supportPaySkus-1").hide();
  $("#otherSupportSkus-1").hide();
  $("#pay-method-5").parents(".item").addClass("item-selected");

}
// 关闭支付与配送方式中的提示框
function closeTip(type) {
  $("#" + type).css("display", "none");
}
// 获取radio中选中的值
function getRadioValue(name) {
  var list = document.getElementsByName(name);
  for (var i = 0; i < list.length; i++) {
    if (list[i].checked == true)
      return list[i].value;
  }
}
// 对选中的radio进行加亮
function lightRadio(name, id) {
  var list = document.getElementsByName(name);
  for (var i = 0; i < list.length; i++) {
    if (list[i].checked == true) {
      $("#" + id + "-" + list[i].value).attr("class", "item item-selected");
    } else {
      $("#" + id + "-" + list[i].value).attr("class", "item");
    }
  }
}
// 显示支票的提示选项
function showCheckDiv(id) {
  if (id == "2") {
    $("#tip1").css("display", "block");
  } else {
    $("#tip1").css("display", "none");
  }
}
/** *****************************************************优惠券************************************************* */

var item = "item";
var itemToggleActive = "item toggle-active";
var orderCouponItem = "orderCouponItem";
var orderGiftCardItem = "orderGiftCardItem";
var orderGiftECardItem = "orderEGiftCardItem";
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
var freeFreight = "freeFreightType";

function couponTip() {
  $(function() {
    $("#coupons .virtual-from").find(".coupon-scope").each(function() {
      var $this = $(this), parent = $this.parents(".list"), dialog = parent.find(".coupon-tip");

      var left = $this.position().left + ($this.width() / 2);

      dialog.css({
        "left" : left + "px",
        "display" : "none"
      });

      $this.bind("mouseenter", function() {
        parent.css({
          "overflow" : "visible",
          "z-index" : 5
        });
        dialog.css("display", "block");
      }).bind("mouseleave", function() {
        parent.css({
          "overflow" : "hidden",
          "z-index" : 1
        });
        dialog.css("display", "none");
      });
    });
  });
}

/**
 * 显示优惠券的可用或不可用商品列表
 */
function showCouponSkuList(){
  var $el = $("#container");
  virtualTips = $el.tips({
      trigger: '.trigger-a',
      width: 260,
      type: 'click',
      sourceTrigger: '#tooltip-box04',
      callback:function(trigger,obj){
        var couponKey = $(trigger).attr("id");
        var availableType = $(trigger).text().indexOf("该券可用商品列表") > -1 ? 0 : 1;
        $('.tooltip-tit',obj).html(availableType == 0 ?"该券可用商品列表":"该券不可用商品列表");
        var param = "couponParam.couponKey=" + couponKey+"&couponParam.availableType="+availableType;;
        param = addFlowTypeParam(param);
        var url = OrderAppConfig.AsyncDomain + "/coupon/getSkuInfoByCouponKey.action";
        jQuery.ajax({
          type : "POST",
          dataType : "text",
          url : url,
          data : param,
          async : true,
          cache : false,
          success : function(result) {
            if (isUserNotLogin(result)) {
            goToLogin();
            return;
          }
          if (isHasMessage(result)) {
            var message = getMessage(result);
            alert(message);
            return;
          }
            $("#v-goods",obj).html(result);
          },
          error : function(XMLHttpResponse) {
            alert("系统繁忙，请稍后再试！");
          }
        });
      }
  });
}

function hideCouponTips(){
  $('#virtual-table').bind('scroll', function(){
    virtualTips.hide();
  });
  $(document).bind('scroll', function(){
    virtualTips.hide();
  });
}

/**
 * 调用后台接口获取可用优惠券数量
 */
function showCouponAvailableNumByRpc(availableCouponNum){
      if (Number(availableCouponNum)>0) {
        var numtext = availableCouponNum;
        if(Number(availableCouponNum)>99){
          numtext = "99+";
        }
        $("#orderCouponItem").find(".toggler").html('<b></b>使用优惠券（京券/东券/运费券）<i class="num">'+numtext+'</i>');
      }else{
        $("#orderCouponItem").find(".toggler").html('<b></b>使用优惠券（京券/东券/运费券）');
      }
}


/**
 * 获取可用优惠券数量
 */
function showCouponAvailableNum(){
  var flag = $("#" + orderCouponId).css('display') == 'none'; // 判断隐藏还是显示优惠券列表
  if(flag && $("#invokeNewCouponInterface").val() == "true"){
    var numtext = $("#canUseCouponDiv input[type='checkbox']").length;
    if(Number(numtext)>99){
      numtext = "99+";
    }
    if(numtext > 0){
      $("#orderCouponItem").find(".toggler").html('<b></b>使用优惠券（京券/东券/运费券）<i class="num">'+numtext+'</i>');
    }else{
      $("#orderCouponItem").find(".toggler").html('<b></b>使用优惠券（京券/东券/运费券）');
    }
  }

}

/**
 * 检查余额安全，是否开启支付密码
 */
function checkBalancePwdResult(type) {
  var param = "couponParam.fundsPwdType=" + type;
  param = addFlowTypeParam(param);
  var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(flag) {
      if (isUserNotLogin(flag)) {
        goToLogin();
        return;
      }
      if (!flag) {
        cancelUsedBalance(); // 账户不安全，设置余额不可用
        return flag;
      }
    }
  });
}

/**
 * 设置余额不可用
 */
function cancelUsedBalance() {
  if ($("#selectOrderBalance").is(':checked')) {// 选中状态
    $("#selectOrderBalance").click(); // JS模拟取消
  }
  $("#selectOrderBalance").attr('disabled', true);
  if ($("#showOrderBalance").css("display") != "none") {
    $("#safeVerciryPromptPart").show();
  }
}

/**
 * 选择京券
 */
function selectJing(obj, key, id) {
  var flag = (obj.checked) ? "1" : "0"; // 判断是否选中京券
  if (flag == 1) {// 选择京券，刷新优惠券列表
    useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/useCoupon.action", key, obj, 1, jingType);
  } else {
    useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/cancelCoupon.action", id, obj, 0, jingType);
  }
}window.selectJing = selectJing;

/**
 * 选择东券
 */
function selectDong(obj, key, id) {
  var flag = (obj.checked) ? "1" : "0"; // 判断是否选中东券
  if (flag == 1) {// 选择东券，刷新优惠券列表
    useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/useCoupon.action", key, obj, 1, dongType);
  } else {
    useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/cancelCoupon.action", id, obj, 0, dongType);
  }
}window.selectDong = selectDong;

/**
 * 选择运费券
 */
function selectFreeFreight(obj, key, id) {
  var flag = (obj.checked) ? "1" : "0"; // 判断是否选中运费券
  if (flag == 1) {// 选择运费券，刷新优惠券列表
    useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/useCoupon.action", key, obj, 1, freeFreight);
  } else {
    useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/cancelCoupon.action", id, obj, 0, freeFreight);
  }
}window.selectFreeFreight = selectFreeFreight;

/**
 * 添加实体券
 *
 * @param obj
 */
function addEntityCoupon(obj) {

  if ($('#couponKeyPressFirst').val() == "" || $('#couponKeyPressSecond').val() == "" || $('#couponKeyPressThrid').val() == ""
      || $('#couponKeyPressFourth').val() == "") {
    showMessageWarn("请输入优惠券密码");
    return;
  }
  var key = $("#couponKeyPressFirst").val() + "-" + $("#couponKeyPressSecond").val() + "-" + $("#couponKeyPressThrid").val() + "-" + $("#couponKeyPressFourth").val();
  $("input[id^='couponKeyPress']").each(function() {
    $(this).val("");
  });
  useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/useCoupon.action", key, obj, 1, "");
}

function removeShiTiCoupon(id) {
  useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/cancelCoupon.action", id, null, 0, "");
}

/**
 * 使用或者取消优惠券 1：使用优惠券，0：取消优惠券
 */
function useOrCancelCoupon(url, id, obj, flag, couponType) {
  var param = "";
  if (flag == 1) {// 使用券传的是couponKey
    param += "couponParam.couponKey=" + id;
  } else {// 取消券使用的是couponId
    param += "couponParam.couponId=" + id;
  }
  param += "&couponParam.pageNum="+$("#pageNum").val();;
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(result) {
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (isHasMessage(result)) {
        var message = getMessage(result);
        alert(message);
        if (obj.checked) {
          obj.checked = false;
        }
        return;
      }
      checkPaymentPasswordSafe(JING_PWD_TYPE, 0);// 用户安全，检查是否开启支付密码
      changeClassStyle(orderCouponId, toggleWrap);
      changeClassStyle(orderCouponItem, itemToggleActive);
      $("#" + OrderAppConfig.Module_Coupon).html(result);
      // 刷新显示：优惠券优惠金额，礼品卡优惠金额，余额优惠金额，实际应付总金额
      useCancelEditJdBean(0, null, true);
      flushOrderPriceByCoupon(); // 改变优惠券状态
      checkCouponWaste();// 检查优惠券是否存在浪费情况
      isNeedPaymentPassword(); // 是否需要支付密码
      hideCouponTips();
    }
  });

}

/**
 * 检查优惠券是否存在浪费情况
 */
function checkCouponWaste() {
  if ($("#hidden_wasteFlag").val() == "true") {
    alert("您的京券金额多于商品应付总额，京券差额不予退还哦~");
  }
}window.checkCouponWaste=checkCouponWaste;

//点击余额ajax请求一次校验支付密码开启 虚拟资产前端代码待重构，例如开启支付密码，页面异步刷新就可以取得这个状态，不必多次请求 LILONG
$('#balance-div .toggle-title').bind('click',function(){

  if ($("#balance-div").hasClass("toggle-active")) {
    $("#balance-div").removeClass("toggle-active");
    $("#jdBalance").addClass("hide");
  } else {
    $("#balance-div").addClass("toggle-active");
    $("#jdBalance").removeClass("hide");
  }

  if($("#safeBalancePart").hasClass('hide')) {
    checkPaymentPasswordSafe('balance', 0);
  }
});

/**
 * 使用优惠券、礼品卡时检查是否开启支付密码
 *
 * @param type
 */
function checkPaymentPasswordSafe(type, giftCardType) {
  var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
  var param = "couponParam.fundsPwdType=" + type;
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(result) {
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (isHasMessage(result)) {
        var message = getMessage(result);
        alert(message);
        if (obj.checked) {
          obj.checked = false;
        }
        return;
      }
      if (!result) {
        // 增加余额提示开启密码的显示
        $("#safeBalancePart").removeClass("hide");
        // 增加优惠券提示开启密码的显示
        $("#safeJingPart").show();
        if (type == JING_PWD_TYPE) {
          cancelAllUsedCoupons();
          //取消选中京券时提示
            showLargeMessage("支付密码未开启", "为保障您的账户资金安全，请先开启支付密码");
          return;
        } else if (type == LPK_PWD_TYPE) {
          cancelAllUsedGiftCards(giftCardType);
          return;
        }

      }

    }
  });
}window.checkPaymentPasswordSafe = checkPaymentPasswordSafe;

    /**
     * 转换成数字。如果是数字返回0
     * @param param
     * @returns {number}
     */
    function toNumber(param){
        return !param || isNaN(param) ? 0 : Number(param);
    }

    /**
     * 刷新运费明细逻辑
     * @param orderPrice
     * @param typeFlag
     * 2016-12-05 jiawl
     */
    function flushOrderFreightDetail(orderPrice, typeFlag) {

    	// 初始化运费明细
        $("#normal-freight-container").show();
        $("#normal-freight-container .normal-freight-title").show();
        $("#sx-freight-container").show();
        $("#sx-freight-container .sx-freight-title").show();
        $("#warmart-freight-container").show();
        $("#warmart-freight-container .normal-freight-title").show();
        // 隐藏续重重量
        $("#xzweight-detail-bak").hide();
        $("#sxweight-detail-bak").hide();
        $("#wmweight-detail-bak").hide();
        $("#xzweight-detail").hide();
        $("#sxweight-detail").hide();
        $("#wmweight-detail").hide();
        // 隐藏基础运费、续重运费、燃油附加费，默认免运费
        $(".base-freight").parent().hide();
        $(".xz-freight").parent().hide();
        $(".overseaxz-freight").parent().hide();
        $(".fuel-freight").parent().hide();
        $(".free-freight").parent().show();
        // 隐藏生鲜运费块、精准达极速达运费块
        $("#sx-freight-container").hide();
        $("#ext-freight-container").hide();
        // 隐藏多余的分隔线
        $("#sx-freight-split-line").hide();
        $("#ext-freight-split-line").hide();
        $("#ext-wm-freight-split-line").hide();
        // 安全起见，默认隐藏精准达、极速达子项
        $(".jzd-freight").parent().hide();
        $(".jsd-freight").parent().hide();
        $(".djsd-freight").parent().hide();
        $(".djzd-freight").parent().hide();
        $(".jzdsx-freight").parent().hide();
        $(".jzdsxdj-freight").parent().hide();
        $(".jsdsx-freight").parent().hide();

        // 店铺运费（包含各类运费子类型运费）
        var venderFreight = orderPrice.venderFreight;
        //alert("venderFreight"+venderFreight+"    sxBaseFreight:"+orderPrice.sxBaseFreight+"    venderFreight[prop]:"+venderFreight[0]);
        if (venderFreight == null) {
            return;
        }

        var hasJdNormalFreight = 0;
        var hasJdSxFreight = 0;
        var hasJdExtFreight = 0;
        var hasJdWmFreight = 0;
        for (var prop in venderFreight) {
            if (!venderFreight.hasOwnProperty(prop)) {
                continue;
            }
            $("#tooltip-box06 b.free-freight").each(function() {

                var freightVenderId = $(this).attr("freightByVenderId");
                if (prop != freightVenderId) {
                    return;
                }
                var popJdShipment = $(this).attr("popJdShipment");
                //运费（包含各类运费子类型运费）
                var freightSop = Number(venderFreight[prop]).toFixed(2);

                // 免运费
                var $curFreeFreight = $(this);
                var $curFreeFreightBlock = $curFreeFreight.parent();
                // 当前运费块div.sfb-item-info（三类：非生鲜（normal-freight-container）、生鲜（sx-freight-container）、pop（normal-freight-container）。精准达、极速达区域特殊处理）
                var $curFreightBlock = $curFreeFreightBlock.parent();
                // 基础运费
                var $curBaseFreight = $curFreightBlock.find(".base-freight");
                var $curBaseFreightBlock = $curBaseFreight.parent();
                // 续重
                var $curXuZhongFreight = $curFreightBlock.find(".xz-freight");
                var $curXuZhongFreightBlock = $curXuZhongFreight.parent();
                
                // 海外续重
                var $curOverseaXuZhongFreight = $curFreightBlock.find(".overseaxz-freight");
                var $curOverseaXuZhongFreightBlock = $curOverseaXuZhongFreight.parent();
                
                // 燃油附加费全球售
                var $curFuelFreight = $curFreightBlock.find(".fuel-freight");
                var $curFuelFreightBlock = $curFuelFreight.parent();
                
                if (prop != 0) { // pop
                    if (freightSop == "0.00" || freightSop == "0" || freightSop == "") { // 原有判断逻辑
                        $curBaseFreightBlock.hide();
                        // 展示免运费
                        $curFreeFreightBlock.show();
                    }  else if ($curFreightBlock.attr("id") == "warmart-freight-container") { // 自营、fbp-生鲜运费
                        // 沃尔玛普通
                        var wmGeneralfreight = toNumber(orderPrice.detail["50"]);
                        // 沃尔玛续重
                        var wmXuzhongfreight = toNumber(orderPrice.detail["52"]);
                        
                        var wmZiTifreight = toNumber(orderPrice.detail["51"]);
                        var wmXjJzdfreight = toNumber(orderPrice.detail["53"]);
                        var wmDjJzdfreight = toNumber(orderPrice.detail["54"]);
                        var wmJsudfreight = toNumber(orderPrice.detail["55"]);
                        var baseWmFreight = wmGeneralfreight + wmZiTifreight;

                        if (baseWmFreight > 0) {
                            // 设置并展示基础运费
                            $curBaseFreight.html("￥" + Number(baseWmFreight).toFixed(2));
                            $curBaseFreightBlock.show();
                            $curFreeFreightBlock.hide();
                            $curFreightBlock.show();
                        }
                        if (wmXuzhongfreight > 0) {
                            // 设置并展示基础运费
                            $curXuZhongFreight.html("￥" + Number(wmXuzhongfreight).toFixed(2));
                            $curXuZhongFreightBlock.show();
                            // 显示续重
                            $("#wmweight-detail").show();
                            $curFreeFreightBlock.hide();
                            $curFreightBlock.show();
                        }
                        if (wmXjJzdfreight > 0) {
                        	hasJdWmFreight = 1;
                            // 显示精准达
                            $("#ext-wm-freight-container .jzd-freight").html("￥" + Number(wmXjJzdfreight).toFixed(2));
                            $("#ext-wm-freight-container .jzd-freight").parent().show();
                            $("#ext-wm-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                        if (wmDjJzdfreight > 0) {
                        	hasJdWmFreight = 1;
                            // 显示精准达
                            $("#ext-wm-freight-container .djzd-freight").html("￥" + Number(wmDjJzdfreight).toFixed(2));
                            $("#ext-wm-freight-container .djzd-freight").parent().show();
                            $("#ext-wm-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                        if (wmJsudfreight > 0) {
                        	hasJdWmFreight = 1;
                            // 显示极速达
                            $("#ext-wm-freight-container .jsd-freight").html("￥" + Number(wmJsudfreight).toFixed(2));
                            $("#ext-wm-freight-container .jsd-freight").parent().show();
                            $("#ext-wm-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                    } else {
                        // 展示基础运费
                        $curBaseFreight.html("￥" + Number(freightSop).toFixed(2));
                        $curBaseFreightBlock.show();
                        $curFreeFreightBlock.hide();
                    }
                } else if ($curFreightBlock.attr("id") == "sx-freight-container") { // 自营、fbp-生鲜运费
                    // 生鲜基础运费
                    var baseSxFreight = toNumber(orderPrice.sxBaseFreight);
                    // 生鲜续重
                    var xuzhongSxfreight = toNumber(orderPrice.detail["33"]);
                    // 生鲜精准达
                    var jzdSxfreight = toNumber(orderPrice.detail["34"]);
                    // 生鲜大件极速达
                    var jzdSxDjfreight = toNumber(orderPrice.detail["35"]);
                    // 生鲜极速达
                    var jsdSxfreight = toNumber(orderPrice.detail["36"]);
                    //alert("jzdSxfreight:"+jzdSxfreight+"jzdSxDjfreight:"+jzdSxDjfreight+"jsdSxfreight:"+jsdSxfreight);
                    baseSxFreight = baseSxFreight -jzdSxfreight - jsdSxfreight - jzdSxDjfreight;

                    if (baseSxFreight <= 0 && xuzhongfreight <= 0) {
                    } else {
                        if (baseSxFreight > 0) {
                            hasJdSxFreight = 1;
                            // 设置并展示基础运费
                            $curBaseFreight.html("￥" + Number(baseSxFreight).toFixed(2));
                            $curBaseFreightBlock.show();
                            $curFreeFreightBlock.hide();
                            $curFreightBlock.show();
                        }
                        if (xuzhongSxfreight > 0) {
                        	if(baseSxFreight <= 0){
                        		$curBaseFreightBlock.hide();
                        	}
                            hasJdSxFreight = 2;
                            // 设置并展示续重运费
                            $curXuZhongFreight.html("￥" + Number(xuzhongSxfreight).toFixed(2));
                            $curXuZhongFreightBlock.show();
                            //展示续重
                            $("#sxweight-detail").show();
                            $curFreeFreightBlock.hide();
                            $curFreightBlock.show();
                        }
                    }
                } else if ($curFreightBlock.attr("id") == "normal-freight-container") { // 自营、fbp-非生鲜运费（精准达、极速达在此处理）
                	$("#presaleFreightId").html("￥0.00");
                    // 运费明细
                    var freightDetail = orderPrice.detail;
                    // 极速达
                    var jsdfreight = toNumber(freightDetail["22"]);
                    // 精准达
                    var jzdfreight = toNumber(freightDetail["24"]);
                    // 生鲜续重
                    var xuzhongSxfreight = toNumber(freightDetail["33"]);
                    // 生鲜精准达
                    var jzdSxfreight = toNumber(freightDetail["34"]);
                    // 生鲜大件极速达
                    var jzdSxDjfreight = toNumber(freightDetail["35"]);
                    // 生鲜极速达
                    var jsdSxfreight = toNumber(freightDetail["36"]);
                    // 普通续重
                    var xuzhongfreight = toNumber(freightDetail["12"]);
                    // 大家电精准达
                    var djzdfreight = toNumber(freightDetail["25"]);
                    // 生鲜基础运费
                    var baseSxFreight = toNumber(orderPrice.sxBaseFreight);
                    // 全球售续重运费
                    var baseFreightOversea = toNumber(freightDetail["41"]);
                    // 大件极速达
                    var djsdfreight = toNumber(freightDetail["70"]);
                    if (baseFreightOversea > 0) {
                    	xuzhongfreight = baseFreightOversea;
                    }
                    // 全球售燃油附加费
                    var fuelFreightOversea = toNumber(freightDetail["42"]);
                    //alert("jzdfreight:"+jzdfreight+"     jzdSxfreight:"+jzdSxfreight+"   djzdfreight:"+djzdfreight);
                    // 普通基础运费
                    var baseFreight = freightSop - xuzhongfreight - baseSxFreight - xuzhongSxfreight - jzdfreight - jsdfreight - djzdfreight - fuelFreightOversea-djsdfreight;

                    //alert("freightSop:"+freightSop+":xuzhongfreight:"+xuzhongfreight+":baseSxFreight:"+baseSxFreight+":xuzhongSxfreight:"+xuzhongSxfreight+":jzdfreight:"+jzdfreight+":jsdfreight:"+jsdfreight+":jzdSxfreight:"+jzdSxfreight+":jsdSxfreight:"+jsdSxfreight+":jzdSxDjfreight:"+jzdSxDjfreight+":djzdfreight:"+djzdfreight);
                    if (freightSop == "0.00" || freightSop == "0" || freightSop == "") { // 原有判断逻辑
                    } else {
                        if (baseFreight > 0) {
                            hasJdNormalFreight=1;
                            // 设置并展示基础运费
                            $curBaseFreight.html("￥" + Number(baseFreight).toFixed(2));
                            $curBaseFreightBlock.show();
                            $curFreeFreightBlock.hide();
                            $curFreightBlock.show();
                            $("#presaleFreightId").html("￥"+Number(baseFreight+baseFreightOversea).toFixed(2))
                        }
                        if (xuzhongfreight > 0) {
                            hasJdNormalFreight=2;
                            if (baseFreightOversea > 0) {
                            	// 设置并展示基础运费
                                $curOverseaXuZhongFreight.html("￥" + Number(xuzhongfreight).toFixed(2));
                                $curOverseaXuZhongFreightBlock.show();
                            } else {
                            	// 设置并展示基础运费
                                $curXuZhongFreight.html("￥" + Number(xuzhongfreight).toFixed(2));
                                $curXuZhongFreightBlock.show();
                            }
                            // 显示续重
                            $("#xzweight-detail").show();
                            $curFreeFreightBlock.hide();
                            $curFreightBlock.show();
                        }
                        // 全球售燃油附加费
                        if (fuelFreightOversea > 0) {
                            hasJdExtFreight = 1;
                            // 设置并展示燃油附加费
                            $curFuelFreight.html("￥" + Number(fuelFreightOversea).toFixed(2));
                            $curFuelFreightBlock.show();
                            $curFreeFreightBlock.hide();
                            $curFreightBlock.show();
                        }
                        if (jzdfreight > 0) {
                            hasJdExtFreight = 1;
                            // 显示精准达
                            $("#ext-freight-container .jzd-freight").html("￥" + Number(jzdfreight).toFixed(2));
                            $("#ext-freight-container .jzd-freight").parent().show();
                            $("#ext-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                        if (djzdfreight > 0) {
                            hasJdExtFreight = 1;
                            // 显示精准达
                            $("#ext-freight-container .djzd-freight").html("￥" + Number(djzdfreight).toFixed(2));
                            $("#ext-freight-container .djzd-freight").parent().show();
                            $("#ext-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                        if (jsdfreight > 0) {
                            hasJdExtFreight = 1;
                            // 显示极速达
                            $("#ext-freight-container .jsd-freight").html("￥" + Number(jsdfreight).toFixed(2));
                            $("#ext-freight-container .jsd-freight").parent().show();
                            $("#ext-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                        if (djsdfreight > 0) {
                            hasJdExtFreight = 1;
                            // 显示大件极速达
                            $("#ext-freight-container .djsd-freight").html("￥" + Number(djsdfreight).toFixed(2));
                            $("#ext-freight-container .djsd-freight").parent().show();
                            $("#ext-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                        if (jzdSxfreight > 0) {
                            hasJdExtFreight = 1;
                            // 显示生鲜精准达
                            $("#ext-freight-container .jzdsx-freight").html("￥" + Number(jzdSxfreight).toFixed(2));
                            $("#ext-freight-container .jzdsx-freight").parent().show();
                            $("#ext-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                        if (jzdSxDjfreight > 0) {
                            hasJdExtFreight = 1;
                            // 显示生鲜大件精准达
                            $("#ext-freight-container .jzdsxdj-freight").html("￥" + Number(jzdSxDjfreight).toFixed(2));
                            $("#ext-freight-container .jzdsxdj-freight").parent().show();
                            $("#ext-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                        if (jsdSxfreight > 0) {
                            hasJdExtFreight = 1;
                            // 显示生鲜极速达
                            $("#ext-freight-container .jsdsx-freight").html("￥" + Number(jsdSxfreight).toFixed(2));
                            $("#ext-freight-container .jsdsx-freight").parent().show();
                            $("#ext-freight-container").show();
                            $curFreeFreightBlock.hide();
                        }
                    }
                }
            });
//            xzweight-detail-bak sxweight-detail-bak normal-freight-title sx-freight-title
//            var hasJdNormalFreight = 0;
//            var hasJdSxFreight = 0;
//            var hasJdExtFreight = 0;
            if(hasJdNormalFreight && hasJdSxFreight){ // 生鲜和非生鲜都存在时，增加分隔线
                $("#sx-freight-split-line").show();
                if(hasJdExtFreight){
                    $("#ext-freight-split-line").show();
                }
                $("#normal-freight-container .normal-freight-title").show();
                $("#sx-freight-container .sx-freight-title").show();
            } else { //使用旧样式
                // 隐藏无用子块
                // 运费明细
                var freightDetail = orderPrice.detail;
                // 极速达
                var jsdfreight = toNumber(freightDetail["22"]);
                // 精准达
                var jzdfreight = toNumber(freightDetail["24"]);
                // 生鲜中小件精准达
                var jzdsxfreight = toNumber(freightDetail["34"]);
                // 生鲜大件精准达
                var jzdsxdjfreight = toNumber(freightDetail["35"]);
                // 生鲜极速达
                var jsdsxfreight = toNumber(freightDetail["36"]);
                // 大家电精准达
                var djzdfreight = toNumber(freightDetail["25"]);
                // 全球售基础运费
                var baseFreightOversea = toNumber(freightDetail["40"]);
                // 全球售续重运费
                var xzFreightOversea = toNumber(freightDetail["41"]);
                // 全球售燃油附加费
                var fuelFreightOversea = toNumber(freightDetail["42"]);
                // 大件极速达
                var djsdfreight = toNumber(freightDetail["70"]);
                if(hasJdNormalFreight){
                    $("#sx-freight-container").hide();
                    if(jsdfreight>0 || jzdfreight>0 || jzdsxfreight>0 || jzdsxdjfreight>0 || jsdsxfreight>0 || djzdfreight>0 || djsdfreight>0){
                    	$("#ext-freight-split-line").show();
                    }
                    //港澳地区不显示标题、海外不显示标题
                    if($("#freighttips").hasClass("hide") && baseFreightOversea <= 0 && xzFreightOversea <= 0 && fuelFreightOversea <= 0){
                    	//显示非生鲜标题
	                    $("#normal-freight-container .normal-freight-title").show();
                    }else{
                    	$("#normal-freight-container .normal-freight-title").hide();
                    }
                    // 隐藏生鲜标题
                    $("#sx-freight-container .sx-freight-title").hide();
                } else if(hasJdSxFreight){
                    $("#normal-freight-container").hide();
                    if(jsdfreight>0 || jzdfreight>0 || jzdsxfreight>0 || jzdsxdjfreight>0 || jsdsxfreight>0 || djzdfreight>0 || djsdfreight>0){
                    	$("#ext-freight-split-line").show();
                    }
                    //显示生鲜标题
                    $("#sx-freight-container .sx-freight-title").show();
                    // 隐藏非生鲜标题
	                $("#normal-freight-container .normal-freight-title").hide();
                } else { // 都没有运费是隐藏生鲜块，使用普通运费的“免运费”
                    $("#sx-freight-container").hide();
                    if(jsdfreight>0 || jzdfreight>0 || jzdsxfreight>0 || jzdsxdjfreight>0 || jsdsxfreight>0 || djzdfreight>0 || djsdfreight>0){
                    	$("#normal-freight-container").hide();
                    }
                    // 隐藏生鲜标题
	                $("#sx-freight-container .sx-freight-title").hide();
	                // 隐藏非生鲜标题
	                $("#normal-freight-container .normal-freight-title").hide();
                }
                
                // 备用位置显示续重重量
                if(hasJdNormalFreight == 2){
                    $("#xzweight-detail-bak").show();
                } else if(hasJdSxFreight == 2){
                    $("#sxweight-detail-bak").show();
                }
            }
            if(hasJdWmFreight){
            	var wmXjJzdfreight = toNumber(orderPrice.detail["53"]);
                var wmDjJzdfreight = toNumber(orderPrice.detail["54"]);
                var wmJsudfreight = toNumber(orderPrice.detail["55"]);
                if(wmXjJzdfreight>0 || wmDjJzdfreight>0 || wmJsudfreight>0){
                	$("#ext-wm-freight-split-line").show();
                }
            } 
        }
    }window.flushOrderFreightDetail=flushOrderFreightDetail;

/**
 * 刷新订单价格
 * 
 * @param orderPrice
 *            是一个json对象
 */
function flushOrderPrice(orderPrice, isFlushSkuList,typeFlag) {
    if (orderPrice == null) {
      return;
    }
    flushOrderFreightDetail(orderPrice, typeFlag);

  //清空运费明细
  $("#frightDetail").html("");
  // 修改运费
  if (orderPrice.freight != null) {
    if (orderPrice.freight > 0) {
      $("#frightDetail").html("总计<em class='ml5 ftx-01' >￥" + orderPrice.freight.toFixed(2) + "</em>");
      $("#freightPriceId").html("<i class='freight-icon'></i><font color='#FF6600'> ￥" + orderPrice.freight.toFixed(2) + "</font>");
      $("#freightSpan").html("<font color='#005EA7'>运费：</font>");
      
      if($(".presale-freight")){
        $(".presale-freight").html("(运费" + orderPrice.freight.toFixed(2) + "元在尾款阶段支付)");
        $(".presale-freight").removeClass("hide");
      }
      if($(".presale-freight2")){
        $(".presale-freight2").html("+<strong>运费：</strong>￥" + orderPrice.freight.toFixed(2));
      }
      $("#presaleFreightId").html("￥"+orderPrice.freight.toFixed(2));
      $("#presaleRealWeikuan").html("￥"+orderPrice.presaleRealWeikuan.toFixed(2));
    } else {
      $("#freightPriceId").html("<i class='freight-icon'></i><font color='#000000'> ￥" + orderPrice.freight.toFixed(2) + "</font>");
      $("#freightSpan").html("<font color='#000000'>运费：</font>");
      if($(".presale-freight")){
        $(".presale-freight").addClass("hide");
      }
      if($(".presale-freight2")){
        $(".presale-freight2").html("+<strong>运费：</strong>￥0.00");
      } 
      $("#presaleFreightId").html("￥0.00");
      $("#presaleRealWeikuan").html("￥"+orderPrice.presaleRealWeikuan.toFixed(2));
    }
    
    if(orderPrice.freeFreight > 0){
      $("#freeFreightPriceId").text("-￥" + orderPrice.freeFreight.toFixed(2));
      $("#showFreeFreight").css("display", "block");
      $("#showPresaleFreightDiscount").css("display", "block");
      $("#presaleFreightDiscountId").text("-￥" + orderPrice.freeFreight.toFixed(2));
    }else{
      $("#showFreeFreight").css("display", "none");
      $("#showPresaleFreightDiscount").css("display", "none");
    }
    $("#freeFreightPriceNum").val(orderPrice.freightCouponNum);
    $("#freeFreightPricehidden").val(orderPrice.freeFreight);
    $("#hiddenFreeFreight_coupon").val(orderPrice.freeFreight.toFixed(2));
    // 买家版运费险金额
    if (orderPrice.buyerFreightInsurance != null) {
    	$("#buyerFreightInsuranceId").html("<font color='#000000'> ￥" + orderPrice.buyerFreightInsurance.toFixed(2) + "</font>");
    } else {
    	$("#buyerFreightInsuranceId").html("<font color='#000000'> ￥0.00</font>");
    }
    if (!orderPrice.jzdAmount=="") {
    	$("#jzdAmount_hidden").val(orderPrice.jzdAmount);
    }
    if (!orderPrice.jsdAmount=="") {
    	$("#jsdAmount_hidden").val(orderPrice.jsdAmount);
    }
    if (!orderPrice.djzdAmount=="") {
    	$("#djzdAmount_hidden").val(orderPrice.djzdAmount);
    }
  }




  // 修改优惠券结算信息
  if (orderPrice.couponDiscount != null) {
    $("#couponPriceId").text("-￥" + orderPrice.couponDiscount.toFixed(2));
    if (orderPrice.couponDiscount == 0) {
      $("#showCouponPrice").css("display", "none");
      $("#couponPriceId").css("display", "none");
      $("#showPresaleCouponPrice").css("display", "none");
    } else {
      $("#showCouponPrice").css("display", "block");
      $("#couponPriceId").css("display", "block");
      //预售优惠券
      $("#showPresaleCouponPrice").css("display", "block");
      $("#presaleCouponPriceId").text("-￥" + orderPrice.couponDiscount.toFixed(2));
    }
  } else {
    $("#couponPriceId").css("display", "none");
    $("#showPresaleCouponPrice").css("display", "none");
  }
  $("#couponPriceNum").val(orderPrice.couponNum);
  $("#couponPricehidden").val(orderPrice.couponDiscount);


  // 修改礼品卡结算信息
  if (orderPrice.giftCardDiscount != null) {
    $("#giftCardPriceId").text("-￥" + orderPrice.giftCardDiscount.toFixed(2));
    if (orderPrice.giftCardDiscount == 0) {
      $("#showGiftCardPrice").css("display", "none");
    } else {
      $("#showGiftCardPrice").css("display", "block");
    }
  } else {
    $("#showGiftCardPrice").css("display", "none");
  }
  $("#giftCardPriceNum").val(orderPrice.giftCardNum);
  $("#giftCardPricehidden").val(orderPrice.giftCardDiscount);
    //领货码
    if (orderPrice.consignmentCardDiscount != null) {
        $("#gconsignmentCardId").text("-￥" + orderPrice.consignmentCardDiscount.toFixed(2));
        if (orderPrice.consignmentCardDiscount == 0) {
            $("#consignmentCardPrice").css("display", "none");
        } else {
            $("#consignmentCardPrice").css("display", "block");
        }
    } else {
        $("#consignmentCardPrice").css("display", "none");
    }
    $("#consignmentCardNum").val(orderPrice.consignmentCardNum);
    $("#consignmentCardDiscounthidden").val(orderPrice.consignmentCardDiscount);

  // 修改余额
  if (orderPrice.usedBalance != null) {
    $("#usedBalanceId").text("-￥" + orderPrice.usedBalance.toFixed(2));
    if (orderPrice.usedBalance == 0) {
      $("#showUsedOrderBalance").css("display", "none");
    } else {
      $("#showUsedOrderBalance").css("display", "block");
    }
     $("#useBalanceShowDiscount").val(orderPrice.usedBalance.toFixed(2));
  } else {
    $("#showUsedOrderBalance").css("display", "none");
    $("#useBalanceShowDiscount").val(0);
  }
  // 修改京豆
  if (orderPrice.usedJdBeanDiscout != null) {
    $("#usedJdBeanId").text("-￥" + orderPrice.usedJdBeanDiscout.toFixed(2));
    if (orderPrice.usedJdBeanDiscout == 0) {
      $("#showUsedJdBean").css("display", "none");
    } else {
      $("#showUsedJdBean").css("display", "block");
    }
    $("#jdBeanexChange").val(orderPrice.usedJdBeanDiscout.toFixed(2));
  } else {
    $("#jdBeanexChange").val(0);
    $("#showUsedJdBean").css("display", "none");
  }
  // 修改应付余额
  if (orderPrice.payPrice != null) {
    var curPrice = orderPrice.promotionPrice - orderPrice.cashBack;
    var prePrice = $("#warePriceId").attr("v") - $("#cachBackId").attr("v");
    if (curPrice > prePrice) {
      $("#changeAreaAndPrice").show();
    } else {
      $("#changeAreaAndPrice").hide();
    }
    $("#warePriceId").attr("v", orderPrice.promotionPrice);
    $("#cachBackId").attr("v", orderPrice.cashBack);

    modifyNeedPay(orderPrice.payPrice.toFixed(2));
  }
  //修改运费
  if (orderPrice.serviceTotalFee != null) {
	  if (orderPrice.serviceTotalFee > 0) {
	      $("#serviceFeeId").html("<font color='#000000'> ￥" + orderPrice.serviceTotalFee.toFixed(2) + "</font>");
	  } else {
		  $("#serviceFeeId").html("<font color='#000000'> ￥0.00</font>");
	  }
  }
  // 商品总金额
  if (orderPrice.skuNum != null && orderPrice.skuNum > 0) {
    $("#span-skuNum").text(orderPrice.skuNum);
  }
  if (orderPrice.promotionPrice != null) {
    $("#warePriceId").text("￥" + orderPrice.promotionPrice.toFixed(2));
    if($("#totalPresalePrice")){
      $("#totalPresalePrice").text("￥" + orderPrice.payPrice.toFixed(2));
    }
  }
  if($("#isNewVertual").val() == "true")
    refushVertualused();

  
  if (isFlushSkuList) {
	  if(typeFlag==1){
		  save_Pay(300);
	  }else{
		  save_Pay(0);
	  }
  }
  
  fulshPlusInfoByFreight(orderPrice);
  
}window.flushOrderPrice=flushOrderPrice;
/**
 * 刷新plus运费引导
 * 
 * @param orderPrice
 *            是一个json对象
 */
function fulshPlusInfoByFreight(orderPrice) {
	var total;
	if(orderPrice==null || orderPrice.detail==null){
		total = $("#totalFreight").val();
	}else{
		// 普通运费
	    //var puTongfreight = toNumber(orderPrice.detail["10"]);
	    // 普通续重
	    var puTongXuZhongfreight = toNumber(orderPrice.detail["12"]);
	    // 特殊运费
	    var teShufreight = toNumber(orderPrice.detail["20"]);
	    // 自提运费
	    var ziTifreight = toNumber(orderPrice.detail["21"]);
	    // 极速达运费
	    var jisudafreight = toNumber(orderPrice.detail["22"]);
	    // 移动仓运费
	    var yidongcangfreight = toNumber(orderPrice.detail["23"]);
	    // 大件精准达
	    var djjzdfreight = toNumber(orderPrice.detail["25"]);
	    // 中小件精准达
	    var zxjjzdfreight = toNumber(orderPrice.detail["24"]);
	   // 生鲜普通
	    var sxptfreight = toNumber(orderPrice.detail["31"]);
	    // 生鲜自提
	    var sxztfreight = toNumber(orderPrice.detail["32"]);
		// 生鲜续重
	    var xuzhongSxfreight = toNumber(orderPrice.detail["33"]);
	    // 生鲜精准达
	    var jzdSxfreight = toNumber(orderPrice.detail["34"]);
	    // 生鲜大件极速达
	    var jzdSxDjfreight = toNumber(orderPrice.detail["35"]);
	    // 生鲜极速达
	    var jsdSxfreight = toNumber(orderPrice.detail["36"]);
	    //生鲜基础
	    var sxBaseFreight = toNumber(orderPrice.sxBaseFreight);
	    var freightSop = Number(orderPrice.venderFreight["0"]).toFixed(2);
	    // 普通基础运费
        var baseFreight = freightSop - puTongXuZhongfreight - sxBaseFreight - xuzhongSxfreight - zxjjzdfreight - jisudafreight - djjzdfreight;
        //计算生鲜基础
	    sxBaseFreight = sxBaseFreight -jzdSxfreight - jsdSxfreight - jzdSxDjfreight;
	    //计算总自营运费
	    var total = puTongXuZhongfreight+teShufreight+ziTifreight+jisudafreight+yidongcangfreight+djjzdfreight+zxjjzdfreight+sxptfreight+sxztfreight+xuzhongSxfreight+jzdSxfreight+jzdSxDjfreight+jsdSxfreight+sxBaseFreight+baseFreight;

	    $("#totalFreight").val(total);
	}
    
    var FreeFreight_coupon = $("#hiddenFreeFreight_coupon").val();
    
    total = total-FreeFreight_coupon;
    var totalPrice = $("#totalPrice").val();
    if($('#plusInfo').hasClass("hide")){
    	var plusStatus = $("#plusStatus").val();
    	var plusInfo = jQuery.parseJSON($(".plusInfoConfig").html());
    	var content;
    	var url;
    	var clstag;
    	var typeContent;
    	if(plusInfo!=null && plusInfo.plusInfos.length>0){
    		if(plusStatus=="0"&& total>0){
        		content = plusInfo.plusInfos[3].content;
        		url = plusInfo.plusInfos[3].url;
        		clstag = plusInfo.plusInfos[3].clstag;
        		typeContent=plusInfo.plusInfos[3].typeContent;
        	}else if((plusStatus=="1"||plusStatus=="2"||plusStatus=="3")&&total>0){
        		content = plusInfo.plusInfos[4].content;
        		url = plusInfo.plusInfos[4].url;
        		clstag = plusInfo.plusInfos[4].clstag;
        		typeContent=plusInfo.plusInfos[4].typeContent;
        	}
    	}
    	if(content !="" && typeof content !=='undefined'){
    		var html="";
    		html+="<p class='plus ar pr20'>";
    		html+="<i class='plus-icon mr5'></i>"+content;
    		//html+="<i class='plus-tips'></i>";
    		html+="<a href='"+url+"' target='_blank' class='ftx-08 ml20' clstag='"+clstag+"'>"+typeContent+"&nbsp;&gt;</a></p>";
    		$("#plusInfoByFreight").html(html);
    		$("#plusInfoByFreight").removeClass("hide");
    		//$(".plus.ar.pr20").html();
    	}else{
    		$("#plusInfoByFreight").addClass("hide");
    	}
    }
}window.fulshPlusInfoByFreight= fulshPlusInfoByFreight;
function flushOrderPriceByCoupon() {
  // 修改运费
  if ($("#hiddenFreight_coupon")[0]) {
	$("#freightPriceId").html("<i class='freight-icon'></i><font color='#FF6600'> ￥" + $("#hiddenFreight_coupon").val() + "</font>");
  }

  // 运费券
  if($("#hiddenCouponDiscount")[0]) {
    $("#freeFreightPriceId").text("-￥" + $("#hiddenFreeFreight_coupon").val());
    $("#presaleRealWeikuan").text("￥"+$("#hiddenPresale_weikuan").val());
    $("#presaleRealDingjin").text("￥"+$("#hiddenPresale_dingjin").val());
    if($("#hiddenFreeFreight_coupon").val() == 0) {
      $("#showFreeFreight").css("display", "none");
      $("#showPresaleFreightDiscount").css("display", "none");
    } else {
      $("#showFreeFreight").css("display", "block");
      $("#showPresaleFreightDiscount").css("display", "block");
      $("#presaleFreightDiscountId").text("-￥" + $("#hiddenFreeFreight_coupon").val());
    }
  } else {
    $("#showFreeFreight").css("display", "none");
    $("#showPresaleFreightDiscount").css("display", "none");
  }
  // 修改优惠券结算信息
  if($("#hiddenCouponDiscount")[0]) {
    // 运费券金额拆分再合并
    var couponDiscount = $("#hiddenCouponDiscount").val();
    if($("#hiddenFreeFreight_coupon").val() > 0) {
      couponDiscount = eval(parseFloat(couponDiscount) + parseFloat($("#hiddenFreeFreight_coupon").val()));
    }
    $("#couponPrice").text(" " + parseFloat(couponDiscount).toFixed(2));
    $("#couponPriceId").text("-￥" + $("#hiddenCouponDiscount").val());
    $("#presaleRealWeikuan").text("￥"+$("#hiddenPresale_weikuan").val());
    $("#presaleRealDingjin").text("￥"+$("#hiddenPresale_dingjin").val());
    if($("#hiddenCouponDiscount").val() == 0) {
      $("#showCouponPrice").css("display", "none");
      $("#couponPriceId").css("display", "none");
      $("#showPresaleCouponPrice").css("display", "none");
    } else {
      $("#showCouponPrice").css("display", "block");
      $("#couponPriceId").css("display", "block");
      //预售优惠券
      $("#showPresaleCouponPrice").css("display", "block");
      $("#presaleCouponPriceId").text("-￥" + $("#hiddenCouponDiscount").val());
    }
  } else {
    $("#couponPriceId").css("display", "none");
  }

  // 修改礼品卡结算信息
  if ($("#hiddenGiftCardDiscount_coupon")[0]) {
    $("#giftCardPriceId").text("-￥" + $("#hiddenGiftCardDiscount_coupon").val());
    if ($("#hiddenGiftCardDiscount_coupon").val() == 0) {
      $("#showGiftCardPrice").css("display", "none");
    } else {
      $("#showGiftCardPrice").css("display", "block");
    }
  } else {
    $("#showGiftCardPrice").css("display", "none");
  }

  // 修改余额
  if ($("#hiddenUsedBalance_coupon")[0]) {
    $("#usedBalanceId").text("-￥" + $("#hiddenUsedBalance_coupon").val());
    if ($("#hiddenUsedBalance_coupon").val() == 0) {
      $("#showUsedOrderBalance").css("display", "none");
    } else {
      $("#showUsedOrderBalance").css("display", "block");
    }
   $("#useBalanceShowDiscount").val($("#hiddenUsedBalance_coupon").val());
  } else {
    $("#showUsedOrderBalance").css("display", "none");
    $("#useBalanceShowDiscount").val(0);
  }

  // 修改应付余额
  if ($("#hiddenPayPrice_coupon")[0]) {
	  modifyNeedPay($("#hiddenPayPrice_coupon").val());
  }
  //修改领货码
    if ($("#hiddenConsignmentCardDiscount_coupon")[0]) {
        $("#gconsignmentCardId").text("-￥" + $("#hiddenConsignmentCardDiscount_coupon").val());
        if ($("#hiddenConsignmentCardDiscount_coupon").val() == 0) {
            $("#consignmentCardPrice").css("display", "none");
        } else {
            $("#consignmentCardPrice").css("display", "block");
        }
    } else {
        $("#consignmentCardPrice").css("display", "none");
    }
  fulshPlusInfoByFreight();
}window.flushOrderPriceByCoupon= flushOrderPriceByCoupon;


function flushOrderCouponPriceByCoupon() {
  // 运费券
  if($("#hiddenCouponDiscount")[0]) {
    $("#freeFreightPriceId").text("-￥" + $("#hiddenFreeFreight_coupon").val());
    $("#presaleRealWeikuan").text("￥"+$("#hiddenPresale_weikuan").val());
    $("#presaleRealDingjin").text("￥"+$("#hiddenPresale_dingjin").val());
    if($("#hiddenFreeFreight_coupon").val() == 0) {
      $("#showFreeFreight").css("display", "none");
      $("#showPresaleFreightDiscount").css("display", "none");
    } else {
      $("#showFreeFreight").css("display", "block");
      $("#showPresaleFreightDiscount").css("display", "block");
      $("#presaleFreightDiscountId").text("-￥" + $("#hiddenFreeFreight_coupon").val());
    }
  } else {
    $("#showFreeFreight").css("display", "none");
    $("#showPresaleFreightDiscount").css("display", "none");
  }
  // 修改优惠券结算信息
  if($("#hiddenCouponDiscount")[0]) {
    // 运费券金额拆分再合并
    var couponDiscount = $("#hiddenCouponDiscount").val();
    if($("#hiddenFreeFreight_coupon").val() > 0) {
      couponDiscount = eval(parseFloat(couponDiscount) - parseFloat($("#hiddenFreeFreight_coupon").val()));
    }
    $("#couponPrice").text($("#hiddenCouponDiscount").val());
    $("#couponPriceId").text("-￥" + parseFloat(couponDiscount).toFixed(2));
    $("#presaleRealWeikuan").text("￥"+$("#hiddenPresale_weikuan").val());
    $("#presaleRealDingjin").text("￥"+$("#hiddenPresale_dingjin").val());
    if(parseFloat(couponDiscount) > 0) {
      $("#showCouponPrice").css("display", "block");
      $("#couponPriceId").css("display", "block");
      //预售优惠券
      $("#showPresaleCouponPrice").css("display", "block");
      $("#presaleCouponPriceId").text("-￥" + parseFloat(couponDiscount).toFixed(2));
    } else {
      $("#showCouponPrice").css("display", "none");
      $("#couponPriceId").css("display", "none");
      $("#showPresaleCouponPrice").css("display", "none");
    }
  } else {
    $("#couponPriceId").css("display", "none");
  }
  
  // 修改应付余额
  if ($("#hiddenPayPrice_coupon")[0]) {
	  modifyNeedPay($("#hiddenPayPrice_coupon").val());
  }
}

function changeOrderPrice(result) {
  $("#safeLpkPart").show(); // 显示开启支付密码提示框
  $("#lpk_count").text("0");// 礼品卡数量
  $("#lpk_discount").text("0.00"); // 礼品卡列表栏金额
  $("#giftCardPriceId").text("-￥0.00"); // 商品金额栏的礼品卡金额
  modifyNeedPay(result.factPrice.toFixed(2));
  $("#usedBalanceId").text("-￥" + result.usedBalance.toFixed(2));
  $("#useBalanceShowDiscount").val(result.usedBalance.toFixed(2));
  // 余额显示变化
  if (result.usedBalanceFlag) {
    $("#selectOrderBalance").attr("checked", true);
    $("#showUsedOrderBalance").show();
    checkBalancePwdResult(BALANCE_PWD_TYPE);
  } else {
    $("#selectOrderBalance").attr("checked", false);
    $("#showUsedOrderBalance").hide();
  }
  save_Pay(0);
}

function changeGiftCardState(result) {
  $("#lpk_count").text(result.giftCardNum);
  $("#lpk_discount").text(result.giftCardPrice.toFixed(2));
  $("input[id^='lpkItem_']").each(function() {
    var cardId = $(this).attr("id").split("_")[1];
    $(this).attr("checked", false); // 是否勾选
    $("#lpkCurUsed_" + cardId).html("0.00");
  });
  if (result.giftCardInfoViewList != null && result.giftCardInfoViewList.length > 0) {
    $.each(result.giftCardInfoViewList, function(i, giftCardInfo) { // 重置礼品卡列表
      $("#lpkItem_" + giftCardInfo.id).attr("checked", true); // 是否勾选
      $("#lpkCurUsed_" + giftCardInfo.id).text(giftCardInfo.curUsedMoney.toFixed(2));
      $("#lpkBalance_" + giftCardInfo.id).text(giftCardInfo.balance.toFixed(2));
    });
  }
}

/**
 * 填充结算页面余额相关的金额信息
 */
function changeBalanceState(result) {
  modifyNeedPay(result.payPrice.toFixed(2))// 实际应付金额
  var showBalance="使用余额（账户当前余额："+' <span class="ftx-01">'+result.leaveBalance.toFixed(2) +'</span>元）';
  $("#canUsedBalanceId").html(showBalance);// 剩余可用余额
  $("#usedBalanceId").text("-￥" + result.usedBalance.toFixed(2)); // 使用的余额
  $("#selectOrderBalance").attr("checked", result.checked);
  if (result.usedBalance > 0) {
    $("#showUsedOrderBalance").show();
  } else {
    $("#showUsedOrderBalance").hide();
  }
//  save_Pay(0);
  save_Pay(300);
}

/**
 * 重置所有优惠券不可用
 */
function cancelAllUsedCoupons() {
  $("input[id^='coupon_']").each(function() {
    $(this).attr("disabled", true);
    if ($(this).is(':checked')) {
      return false;
    }
  });
  var param = addFlowTypeParam();
  var url = OrderAppConfig.DynamicDomain + "/coupon/cancelAllUsedCoupons.action";
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(result) {
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (isHasMessage(result)) {
        var message = getMessage(result);
        showMessageError(message);
        return;
      }
      $("#" + OrderAppConfig.Module_Coupon).html(result);
      $("#safeJingPart").show();
      entityCouponInputEventInit();
      $("input[type=checkbox][id^='coupon_']").each(function() {
        $(this).attr("disabled", true);
      });
      flushOrderPriceByCoupon();
      hideCouponTips();
    }
  });
}window.cancelAllUsedCoupons = cancelAllUsedCoupons;
/**
 * 长密码样式
 */
var html= ""
html += "<div class='pay-pwd-cont'>";
html += "<span class='label'>支付密码： </span>";
html += "<input class='itxt' id='txt_paypassword' type='password' placeholder='为保证资产安全请输入支付密码' onkeyup='clearError()'/>";
html += "<span class='forgot-password'>";
html += "<a target='_blank' href='//safe.jd.com/user/paymentpassword/getBackPassword.action'>忘记密码？</a>";
html += "</span></div><div id='no-pwd-error' class='pay-pwd-error hide'>";
html += "<label class='error-msg' for=''>请输入支付密码</label></div>";
html += "<div id='pwd-error' class='pay-pwd-error hide' style='margin-right:16px;'>";
html += "<label class='error-msg' for=''></label></div>";
html += "<div class='payment-bt-tips hide'>";
html += "<span class='bt-tips-cont'>结算金额变动，请重新选择白条分期以及白条优惠</span><i class='bt-tips-close' onclick='closebtErrorTip();'>×</i></div></div>";

/**
 * 是否需要支付密码
 */
function isNeedPaymentPassword() {
  var onlinepaytype=$(".payment-item.item-selected").attr('onlinepaytype');
  var lastSelect = $("#jdpy_cardInfo").val();
  //if(onlinepaytype=="1"||(onlinepaytype=="3" && $("#"+lastSelect).attr("sign")=="1")){
  //  $("#paypasswordPanel").show();
  //  return;
  //}
  //$("#txt_paypassword").val("");
  var param = addFlowTypeParam();
  var url = OrderAppConfig.DynamicDomain + "/order/isNeedPaymentPassword.action";
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(result) {
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (isHasMessage(result)) {
        var message = getMessage(result);
        showMessageError(message);
        return;
      } else {
        if (result.need) {
            $("#txt_paypassword").val("");
	        if(result.shortPwdActive){
	            resetPaypassword();
	        	$("#paypasswordPanel").show();
	        }else{
	        	$("#paypasswordPanel").html(html);
	        	$("#paypasswordPanel").show();
	        }
        } else {
      	  var onlinepaytype=$(".payment-item.item-selected").attr('onlinepaytype');
    	  var lastSelect = $("#jdpy_cardInfo").val();
    	  if(onlinepaytype=="1"||(onlinepaytype=="3" && $("#"+lastSelect).attr("sign")=="1")){
    		  if(result.shortPwdActive){
    			$("#paypasswordPanel").show();
	        }else{
	        	$("#paypasswordPanel").html(html);
	        	$("#paypasswordPanel").show();
	        }
    	  }else {
    		  $("#paypasswordPanel").hide();
    	  }
        }
      }
    }
  });
}window.isNeedPaymentPassword = isNeedPaymentPassword;

/**
 * 改变优惠券、礼品卡样式
 */
function changeClassStyle(classId, classStyle) {
  $("#" + classId).removeClass();
  $("#" + classId).addClass(classStyle);
}window.changeClassStyle = changeClassStyle;

/**
 * 是否显示 输入实体券密码框
 */
function showEntityPanel() {
  if ($("#entityPanel")[0]) {
    if ($("#entityPanel").css("display") == "none") {
      $("#entityPanel").css("display", "block");
    } else {
      $("#entityPanel").css("display", "none");
    }
  }
}window.showEntityPanel = showEntityPanel;

/** ***************************************************礼品卡******************************************** */

/**
 * 礼品卡输入事件
 */
function lipinkaInputEventInit(giftCardType) {
  var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
  if (giftCardType == 3) {
    orderGiftCardModule = OrderAppConfig.Module_GiftECard;
  }

  $("#" + orderGiftCardModule + " .itxt").keyup(function() {
    var $this = $(this);
    $this.val($this.val().replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
    $this.val($this.val().replace('O', '0'));
    if ($this.val().length == 4 && $this.attr('id') != 'lpkKeyPressFourth-' + giftCardType) {
      $this.next().next().focus();
    }
  });
}window.lipinkaInputEventInit = lipinkaInputEventInit;

/**
 * 实体优惠券输入事件 FIXME 对实体券输入没有生效，事件绑定错误。没有线上bug提出来，所以是否需要修改，等上级指示。 DYY
 */
function entityCouponInputEventInit() {
  $("#entityPanel .itxt").keyup(function() {
    var $this = $(this);
    $this.val($this.val().replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
    $this.val($this.val().replace('O', '0'));
    if ($this.val().length == 4 && $this.attr('id') != 'couponKeyPressFourth') {
      $this.next().next().focus();
    }
  });
  if($("#isNewVertual").val() == "true"){
     $("#entityPanel .itxt").mouseover(function(){
      $("#couponKeyPressFirst").parent().find(".error-msg").hide();
    });
     
  }
}window.entityCouponInputEventInit = entityCouponInputEventInit;

function showGiftCard(flag)
{
  if(flag == 0){
    $("#avaiCard").attr("class","curr");
    $("#ecard-available").show();
    $("#unavaiCard").attr("class"," ");
    $("#ecard-unavailable").hide();
  }
  else if(flag == 1){
    $("#avaiCard").attr("class"," ");
    $("#ecard-available").hide();
    $("#unavaiCard").attr("class","curr");
    $("#ecard-unavailable").show();
  }
}
window.showGiftCard = showGiftCard;

function query_giftCards(giftCardType) {
  var giftCardProxyId = giftCardId;
  var orderGiftCardProxyItem = orderGiftCardItem;
  var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
  if (giftCardType == 3) {
    giftCardProxyId = giftECardId;
    orderGiftCardProxyItem = orderGiftECardItem;
    orderGiftCardModule = OrderAppConfig.Module_GiftECard;
  }

  var flag = $("#" + giftCardProxyId).attr('class') == "toggle-wrap hide";
  if (flag) {// 显示礼品卡列表
    var param = "giftCardParam.giftCardType=" + giftCardType;
    param = addFlowTypeParam(param);
    var url = OrderAppConfig.DynamicDomain + "/giftCard/getGiftCardList.action";
    jQuery.ajax({
      type : "POST",
      dataType : "text",
      url : url,
      data : param,
      async : true,
      cache : false,
      success : function(result) {
        if (isUserNotLogin(result)) {
          goToLogin();
          return;
        }
        if (isHasMessage(result)) {
          var message = getMessage(result);
          showMessageError(message);
          return;
        } else {
          checkPaymentPasswordSafe(LPK_PWD_TYPE, giftCardType);
          // 显示礼品卡样式
          $("#" + giftCardProxyId).css('display', 'block');
          changeClassStyle(giftCardProxyId, toggleWrap);

          changeClassStyle(orderGiftCardProxyItem, itemToggleActive);
          $("#" + giftCardProxyId + " " + "#" + orderGiftCardModule).html(result);
          lipinkaInputEventInit(giftCardType); // 礼品卡输入KEY限制
        }
        
        eInfoTip();
      },
      error : function(XMLHttpResponse) {
        //alert("系统繁忙，请稍后再试！");
      }
    });

    // 使用礼品卡时，关闭优惠券列表
    // 隐藏优惠券列表
    couponTip();
    // $("#" + orderCouponId).css('display', 'none');
    // 优惠券隐藏样式
    // changeClassStyle(giftCardProxyId, toggleWrapHide);
    // changeClassStyle(orderGiftCardProxyItem, item);
  } else {
    // 隐藏礼品卡列表
    // 隐藏礼品卡样式
    $("#" + giftCardProxyId).css("display", "none");
    changeClassStyle(giftCardProxyId, toggleWrapHide);
    changeClassStyle(orderGiftCardProxyItem, item);
  }

}window.query_giftCards = query_giftCards;
/**
 * 检查礼品卡安 如果使用礼品卡，必须开启支付密码
 */
function checkUsedGiftCardsPwd(type, giftCardType) {
  var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
  var param = "couponParam.fundsPwdType=" + type;
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(flag) {
      if (isUserNotLogin(flag)) {
        goToLogin();
        return;
      }
      if (!flag) {
        // 账户不安全，设置所有礼品卡不可用
        cancelAllUsedGiftCards(giftCardType);
      }
    }
  });
}window.checkUsedGiftCardsPwd = checkUsedGiftCardsPwd;

/**
 * 选择礼品卡
 * 
 * @param obj
 * @param bindFlag
 * @param key
 * @param id
 */
function selectGiftCard(obj, key, id, giftCardType) {
  var checked = obj.checked;
  if (checked) {
    useOrCancelGiftCard(OrderAppConfig.DynamicDomain + "/giftCard/useGiftCard.action", key, obj, checked, false, giftCardType);
  } else {
    useOrCancelGiftCard(OrderAppConfig.DynamicDomain + "/giftCard/cancelGiftCard.action", id, obj, checked, false, giftCardType);
  }
}window.selectGiftCard = selectGiftCard;

/**
 * 添加礼品卡
 */
function addGiftCard(obj, giftCardType) {
  if ($("#lpkKeyPressFirst" + "-" + giftCardType).val() == "" || $("#lpkKeyPressSecond" + "-" + giftCardType).val() == ""
      || $("#lpkKeyPressThird" + "-" + giftCardType).val() == "" || $("#lpkKeyPressFourth" + "-" + giftCardType).val() == "") {
    if (giftCardType == 3) {
      showMessageWarn("请输入京东E卡密码");
    } else {
      showMessageWarn("请输入京东卡密码");
    }
    return;
  }

  var param = "couponParam.fundsPwdType=GiftCard";
  var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(flag) {
      if (isUserNotLogin(flag)) {
        goToLogin();
        return;
      }
      if (flag) {
        var key = $("#lpkKeyPressFirst" + "-" + giftCardType).val() + "-" + $("#lpkKeyPressSecond" + "-" + giftCardType).val() + "-"
          + $("#lpkKeyPressThird" + "-" + giftCardType).val() + "-" + $("#lpkKeyPressFourth" + "-" + giftCardType).val();
        useOrCancelGiftCard(OrderAppConfig.DynamicDomain + "/giftCard/useMaterialGiftCard.action", key, obj, false, true, giftCardType);
      } else {
        showLargeMessage("支付密码未开启", "为保障您的账户资金安全，请先开启支付密码");
        return;
      }
    }
  });

}window.addGiftCard = addGiftCard;

/**
 * 使用或者取消礼品卡
 * 
 * @param url
 * @param key
 * @param obj
 * @param checked
 * @param bindFlag
 */
function useOrCancelGiftCard(url, key, obj, checked, bindFlag, giftCardType) {
  var param = "giftCardParam.giftCardType=" + giftCardType + "&giftCardKey=" + key + "&fundsPwdtype=" + LPK_PWD_TYPE;
  var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
  var giftCardProxyId = giftCardId;
  var orderGiftCardProxyItem = orderGiftCardItem;
  var giftCardTypeName = "京东卡";
  if (giftCardType == 3) {
    giftCardProxyId = giftECardId;
    orderGiftCardProxyItem = orderGiftECardItem;
    orderGiftCardModule = OrderAppConfig.Module_GiftECard;
    giftCardTypeName = "京东E卡";
  }
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(result) {
      // 没有登录跳登录
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (result == false || result == "false") {
        // 隐藏礼品卡列表
        // 隐藏礼品卡样式
        $("#" + giftCardProxyId).css("display", "none");
        changeClassStyle(giftCardProxyId, toggleWrapHide);
        changeClassStyle(orderGiftCardProxyItem, item);
        return;
      }
      if (isHasMessage(result)) {
        var message = getMessage(result);
        alert(message);
        if (checked == true) {
          $(obj).attr("checked", false);
        } else {
          $(obj).attr("checked", true);
        }
        return;
      }
      checkPaymentPasswordSafe(LPK_PWD_TYPE, giftCardType);
      $("#" + orderGiftCardModule).html(result);
      changeOrderInfoPrice(giftCardType);
      isNeedPaymentPassword();// 是否需要支付密码
      if (bindFlag && ($("#hiddenBindFlag" + "-" + giftCardType).val() == "true")) {

        if (confirm("密码正确！是否将该" + giftCardTypeName + "绑定至当前账号？")) {
          bindGiftCard(key, giftCardType); // 异步判断是否绑定成功
        }
      }
      lipinkaInputEventInit(giftCardType); // 礼品卡输入KEY限制
    }
  });
}window.useOrCancelGiftCard=useOrCancelGiftCard;

function changeOrderInfoPrice(giftCardType) {
  // 已优惠的礼品卡金额
  if ($("#hiddenGiftCardDiscount" + "-" + giftCardType)[0]) {
    $("#giftCardPriceId").text("-￥" + $("#hiddenGiftCardDiscount" + "-" + giftCardType).val());
    if ($("#hiddenGiftCardDiscount" + "-" + giftCardType).val() > 0) {
      $("#showGiftCardPrice").show();
    } else {
      $("#showGiftCardPrice").hide();
    }
  }

  // 余额
  if ($("#hiddenUsedBalance" + "-" + giftCardType)[0]) {
    $("#usedBalanceId").text("-￥" + $("#hiddenUsedBalance" + "-" + giftCardType).val());
    if ($("#hiddenUsedBalance" + "-" + giftCardType).val() > 0) {
      $("#showUsedOrderBalance").show();
    } else {
      $("#showUsedOrderBalance").hide();
    }
  }

  // 实际应付金额
  if ($("#hiddenPayPrice" + "-" + giftCardType)[0]) {
	modifyNeedPay($("#hiddenPayPrice" + "-" + giftCardType).val());
  }
  save_Pay(0);
}window.changeOrderInfoPrice = changeOrderInfoPrice;
/**
 * 绑定礼品卡
 */
function bindGiftCard(key, giftCardType) {
  var param = "giftCardParam.giftCardType=" + giftCardType + "&giftCardKey=" + key;
  var url = OrderAppConfig.DynamicDomain + "/giftCard/bindGiftCard.action";

  var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
  if (giftCardType == 3) {
    orderGiftCardModule = OrderAppConfig.Module_GiftECard;
  }

  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(result) {
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (isHasMessage(result)) {
        var message = getMessage(result);
        alert(message);
        return;
      }
      $("#" + orderGiftCardModule).html(result);
      isNeedPaymentPassword();// 是否需要支付密码
      lipinkaInputEventInit(giftCardType); // 礼品卡输入KEY限制
    }
  });
}window.bindGiftCard = bindGiftCard;

/**
 * 重置所有礼品卡不可用
 */
function cancelAllUsedGiftCards(giftCardType) {
  $("input[type=checkbox][id^='lpkItem_']").each(function() {
    $(this).attr("disabled", true);
    if ($(this).is(":checked")) {
    }
  });

  var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
  if (giftCardType == 3) {
    orderGiftCardModule = OrderAppConfig.Module_GiftECard;
  }

  // 发请求取消所有礼品卡的使用
  var param = "giftCardParam.giftCardType=" + giftCardType;
  param = addFlowTypeParam(param);
  var url = OrderAppConfig.DynamicDomain + "/giftCard/cancelAllGiftCard.action";
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(result) {
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (isHasMessage(result)) {
        var message = getMessage(result);
        showMessageError(message);
        $("input[type=checkbox][id^='lpkItem_']").attr("disabled", false);
        return;
      }
      $("#" + orderGiftCardModule).html(result);
      $("input[type=checkbox][id^='lpkItem_']").each(function() {
        $(this).attr("disabled", true);
      });
      $("#safeLpkPart" + "-" + giftCardType).show();
      changeOrderInfoPrice(giftCardType);
      lipinkaInputEventInit(giftCardType); // 礼品卡输入KEY限制
    }
  });
}window.cancelAllUsedGiftCards = cancelAllUsedGiftCards;
/** ***************************************************余额******************************************** */

function useOrCancelBalance(obj) {
  var url = "";
  var flag = $(obj).is(':checked') ? 1 : 0;

  if (flag) {
    url = OrderAppConfig.DynamicDomain + "/balance/useBalance.action";
  } else {
    url = OrderAppConfig.DynamicDomain + "/balance/cancelBalance.action";
  }
  var param = "fundsPwdType=" + BALANCE_PWD_TYPE;
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(result) {
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (isHasMessage(result)) {
        var message = getMessage(result);
        alert(message);
        if (flag == 1) {
          $(obj).attr("checked", false);
        } else {
          $(obj).attr("checked", true);
        }
        return;
      } else if (result != null && result == false) {
        // 开启支付密码接口失败
        cancelUsedBalance();
      } else if (result != null && result != false) {
        changeBalanceState(result);
        isNeedPaymentPassword();// 是否需要支付密码
        if ($("#selectOrderBalance").is(":checked")) { // 余额被使用时，验证是否安全
          checkBalancePwdResult(BALANCE_PWD_TYPE);
        }
      }
    }
  });
}window.useOrCancelBalance = useOrCancelBalance;
// ****************************************************订单页面相关****************************************************************

/**
 * 加载页面异步相关信息
 */
function loadOrderExt() {
  var actionUrl = OrderAppConfig.AsyncDomain + "/obtainOrderExt.action";
  var param = addFlowTypeParam();
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      // 服务器返回异常处理,如果有消息div则放入,没有则弹出
      if (isHasMessage(dataResult)) {
        var message = getMessage(dataResult);
        showMessageError(message);
      }
      // ===============3.备注==============
      if (dataResult.showOrderRemark) {
        showOrderRemark();
      }
      // ===============4.是否需要支付密码==============
      
      if (dataResult.needPayPwd) {
        if(dataResult.shortPwdActive){
	        $("#paypasswordPanel").show();
	     }else{
	        $("#paypasswordPanel").html(html);
	        $("#paypasswordPanel").show();
	     }
      } else{
    	  var onlinepaytype=$(".payment-item.item-selected").attr('onlinepaytype');
    	  var lastSelect = $("#jdpy_cardInfo").val();
    	  if(onlinepaytype!="1"&& !(onlinepaytype=="3" && $("#"+lastSelect).attr("sign")=="1")){
    		  $("#paypasswordPanel").hide();
    	  }
    	  
      }
      // ==================5.加载余额==================
      if (dataResult.balance && dataResult.balance.success) {
        var useFlag = dataResult.balance.checked;
        $("#selectOrderBalance").attr("checked", useFlag);
        var showBalance="使用余额（账户当前余额："+' <span class="ftx-01">'+ dataResult.balance.leavyMoney.toFixed(2) +'</span>元）';
        $("#canUsedBalanceId").html(showBalance);// 剩余可用余额
        if (dataResult.balance.leavyMoney > 0) {
          $('#balance-div .toggler').click();
          $('#selectOrderBalance').removeAttr('disabled');
        } else {
          $('#selectOrderBalance').attr('disabled','disabled');
        }
        // // 验证余额是否开启支付密码
        // if (dataResult.showOpenPayPwd) {
        //   cancelUsedBalance();
        // }
      }
      // 验证余额是否开启支付密码
      //位置调整
      if (dataResult.showOpenPayPwd) {
        cancelUsedBalance();
      }


      // 京豆优惠购是否足额和京豆优惠购商品id
      var showOpenPayPwd = dataResult.showOpenPayPwd;
      var existsJdbeanPromotion = dataResult.existsJdbeanPromotion;
      var checkJdbeanPromotion = dataResult.checkJdbeanPromotion;
      var shortPwdActive = dataResult.shortPwdActive;
      // 成功后如果有divID直接放入div，没有则返回结果
      checkShowOpenPwd(showOpenPayPwd, existsJdbeanPromotion, checkJdbeanPromotion, shortPwdActive);
      //优惠券异步加载可用优惠券数量
      if($("#isNewVertual").val() == "true"){
          vertualCoupontips();
          refushHasAvailableVertual(dataResult);
      }else if($("#invokeNewCouponInterface").val() == "true"){
    	  showCouponAvailableNumByRpc(dataResult.availableCouponNum);
    	  showCouponSkuList();
      }
    },
    error : function(XMLHttpResponse) {
      // ignore
    }
  });
}

/**
 * 加载商品清单库存状态数据
 */
function loadSkuListStockData(states,noAvailableSku) {
  	var hongKongId = $("#hongKongId").val();
  	var taiWanId = $("#taiWanId").val();
  	var overSeasId = $("#overSeasId").val();
	//港澳售项目
  	var consignee_area = $("#hideAreaIds").val();
  	var consignee_provinceId = 0;
  	if(consignee_area!=null){
  		consignee_provinceId = consignee_area.split("-")[0];
  	}
  	//end
  $(".p-state").each(function() {
    var skuId = $(this).attr("skuId");
    if (states) {
      for (var keyId in states) {
        if (keyId == skuId) {
          var state = parseInt(states[keyId].a);
          var info;
          switch (state) {
          case 33:
          case 39:
          case 40:
            info = "有货";
            break;
          case 34:
            info = "<span style='color:#e4393c'>无货</span>";
            break;
          case 36:
            info = "采购中";
            break;
          default:
            info = "<span style='color:#e4393c'>无货</span>";
          }
          //闪购JIT
          if(states[keyId].u && states[keyId].u == '1'){
            info = "有货";
          }
          $(this).html(info);
          //港澳售、台湾售、全球售
          var noSkuParamString = "";
          if (consignee_provinceId == hongKongId) noSkuParamString = "港澳无货";
          if (consignee_provinceId == taiWanId) noSkuParamString = "台湾无货";
          if (consignee_provinceId == overSeasId) noSkuParamString = "海外无货";
          
          if((consignee_provinceId==hongKongId || consignee_provinceId == taiWanId || consignee_provinceId == overSeasId) && noAvailableSku!=null){
      		 if(noAvailableSku[skuId]==1 || noAvailableSku[skuId]==""){
      			var a = $(this).parent().parent().parent().parent().children().first().hasClass("p-img");
      			var b = $(this).parent().parent().parent().parent().children().first().attr("class");
      			if($(this).parent().parent().parent().parent().children().first().hasClass("p-img")){
      				$(this).parent().parent().parent().parent().children().first().append("<span class='p-outofstock hknostock'>" + noSkuParamString + "</span>");
      			}else{
      				$(this).parent().parent().parent().children().first().append("<span class='p-outofstock hknostock'>" + noSkuParamString + "</span>");
      			}
      			
      		 }
//    		if(info.indexOf("无货")>0){
//    			$(this).parent().parent().parent().parent().children().first().append("<span class='p-outofstock hknostock'>港澳台无货</span>");
//    		}
    	 }
      	//end
        }
      }
    } else {
      $(this).html("有货");
    }
  });
}

/**
 * 获取库存状态，新版需要根据收货地址区分区域，如1,2,3,4
 */
function getAreaIds() {
  if("1" == $("#flowType").val()) {// 本地生活流程，地址id可用1,0,0,0，库存组王振确认
    return "1,0,0,0";
  }
  var hideAreaIds = $("#hideAreaIds").val();
  if(hideAreaIds) {
    return hideAreaIds.split('-').join(',');
  } else {
    return "1,0,0,0";
  }
}
function getCookie(name) 
{
    var bikky = document.cookie;
    name += "=";
    var i = 0; 
    while (i < bikky.length) 
    {
      var offset = i + name.length;
      if (bikky.substring(i, offset) == name) 
      { 
        var endstr = bikky.indexOf(";", offset); 
        if (endstr == -1) endstr = bikky.length;
          return unescape(bikky.substring(offset, endstr)); 
      }
        i = bikky.indexOf(" ", i) + 1; 
        if (i == 0) break; 
    }
    return null; 
}
/**
 * 获取库存状态:获取所有商品
 */
function getAllSkuListId() {
  var allSkuListId = "";
  var mainSkuIdAndNums = $("#mainSkuIdAndNums").val();
  if (mainSkuIdAndNums != null && mainSkuIdAndNums != "") {
    var mainSkuIdAndNumsAry = mainSkuIdAndNums.split(",");
    if (mainSkuIdAndNumsAry != null && mainSkuIdAndNumsAry.length > 0) {
      for (var i = 0; i < mainSkuIdAndNumsAry.length - 1; i++) {
        if (mainSkuIdAndNumsAry[i] != null && mainSkuIdAndNumsAry[i] != "") {
          var skuAndNumAry = mainSkuIdAndNumsAry[i].split("_");
          // 新版库存状态接口需要传入sku数量，且入参格式变化为 12345,1;54321,2
          if (i == 0) {
            allSkuListId += skuAndNumAry[0] + "," + skuAndNumAry[1];
          } else {
            allSkuListId += ";" + skuAndNumAry[0] + "," + skuAndNumAry[1];
          }
        }
      }
    }
  }
  return allSkuListId;
}

/**
 * 异步加载商品清单库存状态
 * app=trade_ex 库存组王振提供
 */
function loadSkuListStock(noAvailableSku) {
	  var areaIds = getAreaIds();
	  var skus = getAllSkuListId();
	  var pin = getCookie("pin");
	  if(pin==null || typeof(pin)=="undefined"){
		  pin = ""; 
	  }
	  
	  var cookies = getCookie("__jda").split(".");
	  var cookie ="";
	  if(cookies!=null && typeof(cookies)!="undefined"){
		 cookie = cookies[1]; 
	  }
	  
	  var actionUrl = OrderAppConfig.SkusStockStateUrl + "/ss/areaStockState/mget?app=trade_ex&ch=1&skuNum="+skus+"&area="+areaIds+"&pdpin="+pin+"&pduid="+cookie+"&r="+ Math.random();

        try{
            jQuery.ajax({
                type : "get",
                dataType : "jsonp",
                url : actionUrl,
                cache : false,
                success : function(dataResult) {
                    try{
                        loadSkuListStockData(dataResult,noAvailableSku);// 成功后如果有divID直接放入div，没有则返回结果
                    }catch(e){
                        if(console && console.log){
                            console.log(e);
                        }
                    }
                },
                error : function(XMLHttpResponse) {
                    // ignore no console log
                }
            });
        }catch(eo){
            if(console && console.log){
            console.log(eo);
            }
        }
}window.loadSkuListStock=loadSkuListStock;

/**
 * 添加备注
 */
function selectRemark(obj) {
  if ($("#remarkId").attr("class") == toggleWrapHide) {
    $("#remarkId").removeClass();
    $("#remarkId").addClass("toggle-wrap");
    changeClassStyle("orderRemarkItem", itemToggleActive);
    if ($("#remarkText").val() == "") {
      $("#remarkText").val("限45个字");
    }
  } else {
    $("#remarkId").removeClass();
    $("#remarkId").addClass("toggle-wrap hide");
    changeClassStyle("orderRemarkItem", item);
  }
}

/**
 * 订单页面余额
 */
function loadOrderBalance() {
  if (!$("#selectOrderBalance").is(":checked")) {
    var actionUrl = OrderAppConfig.AsyncDomain + "/isShowOrderBalance.action";
    var param = addFlowTypeParam();
    jQuery.ajax({
      type : "POST",
      dataType : "json",
      url : actionUrl,
      data : param,
      cache : false,
      success : function(result, textStatus) {
        // 没有登录跳登录
        if (isUserNotLogin(result)) {
          goToLogin();
          return;
        }
        if (result.resultFlag) {
          var useFlag = result.checked;
          $("#selectOrderBalance").attr("checked", useFlag);
          var showBalance="使用余额（账户当前余额："+' <span class="ftx-01">'+ result.leavyMoney.toFixed(2) +'</span>元）';
          $("#canUsedBalanceId").html(showBalance);// 剩余可用余额
          if (result.leavyMoney > 0) {
            $("#showOrderBalance").css("display", "block");
          } else {
            $("#showOrderBalance").css("display", "none");
          }
          checkBalancePwdResult(BALANCE_PWD_TYPE);// 验证余额是否开启支付密码
        }

      },
      error : function(XMLHttpResponse) {
      }
    });
  }
}

/**
 * 显示订单备注
 */
function showOrderRemark() {
  var remarkTemplate = "<div class='remark-tit'>添加订单备注</div>"
    + "<div id='remarkId' style='margin-bottom:7px'>"
    + "  <div class='form remark-cont'>"
    + "    <input type='text' id='remarkText' maxlength='45' size='15' class='itxt itxt01' placeholder='限45个字（定制类商品，请将购买需求在备注中做详细说明）'" 
    + "      onblur=" + "\"" + "if(this.value==''||this.value=='限45个字（定制类商品，请将购买需求在备注中做详细说明）'){this.value='限45个字（定制类商品，请将购买需求在备注中做详细说明）';this.style.color='#cccccc'}" 
    + "\"" + "onfocus=" + "\"" + "if(this.value=='限45个字（定制类商品，请将购买需求在备注中做详细说明）') {this.value='';};this.style.color='#000000';" 
    + "\"" + "  />  " 
    + "    <span class='ftx-03 ml10'>&nbsp;&nbsp;提示：请勿填写有关支付、收货、发票方面的信息</span>"
    + "  </div>" 
    + "</div>";
  $("#orderRemarkItem").show();
  $("#orderRemarkItem").html(remarkTemplate);
  // fix bug EXEX-68
  // $('.remark-tit').bind('click',function(){
  //   if($('#remarkId').is(":hidden")) {
  //     $('#remarkId').show();
  //   } else {
  //     $('#remarkId').hide();
  //   }
  // });
}

/**
 * 是否显示订单备注
 */
function loadOrderRemark() {
  var actionUrl = OrderAppConfig.AsyncDomain + "/isShowOrderRemark.action";
  var param = addFlowTypeParam();
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(result, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      if (result == true) {
        showOrderRemark();
      }else{
        $("#orderRemarkItem").hide();
        $("#orderRemarkItem").html('');
      }
    },
    error : function(XMLHttpResponse) {
    }
  });

}window.loadOrderRemark=loadOrderRemark;

function editOrderRemark(obj) {
  if ($(obj).val() == "限15个字") {
    $(obj).val("");
  }
}


// 判断是否加载验证码
function showCheckCode() {
  var showCheckCode = $("#showCheckCode").val();
  var encryptClientInfo = $("#encryptClientInfo").val();
  if (showCheckCode == "true") {
    refreshCheckCode(encryptClientInfo);
  }
}

/**
 * 获取验证码模版
 * 
 * @returns {String}
 */
function getCheckCodeTemplate(encryptClientInfo) {
  var rid = Math.random().toString() + "_" + Math.random().toString();
  var checkCodeUrl = "//captcha.jd.com/verify/image?acid=" + rid + "&srcid=trackWeb&is=" + encryptClientInfo;
  return "<span class='identifying-code'>" + "<img id='orderCheckCodeImg' src='" + checkCodeUrl + "' onclick='getNextCheckCode()' "
      + "alt='点击更换验证码' title='点击更换验证码' style='display:inline;cursor:pointer;border:#ebcca0 1px solid;' />"
      + "<input id='checkcodeTxt' type='text' style='height: 34px; width: 70px; margin: 0px 5px; padding-left: 2px; font-weight: bold; font-size: large;' />"
      + "<input id='checkcodeRid' type='hidden' value='" + rid + "' />" 
      + "<input id='encryptClientInfo' type='hidden' value='" + encryptClientInfo + "' />"
      + "</span>";
}

/**
 * 显示下一张验证码
 * 
 * @param obj
 */
function getNextCheckCode() {
  var obj = document.getElementById("orderCheckCodeImg");
  var rid = Math.random().toString() + "_" + Math.random().toString();
  var encryptClientInfo = $("#encryptClientInfo").val();

  var checkCodeUrl = "//captcha.jd.com/verify/image?acid=" + rid + "&srcid=trackWeb&is=" + encryptClientInfo;

  obj.src = checkCodeUrl;
  $("#checkcodeRid").val(rid);
  $('#checkcodeTxt').val("");
}window.getNextCheckCode = getNextCheckCode;

/**
 * 刷新验证码
 */
function refreshCheckCode(encryptClientInfo) {
  if (isEmpty($("#checkCodeDiv").html())) {
    $("#checkCodeDiv").html(getCheckCodeTemplate(encryptClientInfo));
  } else {
    getNextCheckCode();
  }
}
function obtainCopyInfoConfig(consignee_provinceId,consignee_cityId){
  var actionUrl = OrderAppConfig.AsyncDomain + "/obtainCopyInfoConfig.action";
  var provinceId = $("#consignee-list .item-selected").attr("provinceId");
  var cityId = $("#consignee-list .item-selected").attr("cityId");
  if(consignee_provinceId !=undefined && consignee_provinceId.length>0){
  		provinceId = consignee_provinceId;
  }
  if(consignee_cityId !=undefined && consignee_cityId.length>0){
  		cityId = consignee_cityId;
  }
  var param = "orderInfoParam.provinceId=" + provinceId + "&orderInfoParam.cityId=" + cityId;
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(result) {
      // 没有登录跳登录
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      var isClose = result.isClose;
      if(isClose == "true"){
      	return;
      }
      var copyInfoList = result.copyInfoList;
      if(copyInfoList[2].isUsed==1){
          $("#normalCopywritingContent").val(copyInfoList[2].copywritingContent);
          $("#needForJZD").val(copyInfoList[2].needForJZD);
          $("#workdayContent").val(copyInfoList[2].workdayContent);
          $("#weekendContent").val(copyInfoList[2].weekendContent);
          $("#supportSelfPick").val(copyInfoList[2].supportSelfPick);
          $("#supportByDay").val(copyInfoList[2].supportByDay);
          $("#supportSop").val(copyInfoList[2].supportSop);
        }else{
          $("#normalCopywritingContent").val(0);
          $("#needForJZD").val(0);
          $("#workdayContent").val(0);
          $("#workdayContent").val(0);
          $("#supportSelfPick").val(0);
          $("#supportByDay").val(0);
          $("#supportSop").val(0);
        }
        shipmentTips618();   
	      
    },
    error : function(XMLHttpResponse) {
    }
  });
}window.obtainCopyInfoConfig=obtainCopyInfoConfig;

/*
 * 首页温馨提示
 */
function orderInfoTip(){
	if($("#topTitleInfoUsed").val()=="1" && $("#topTitleInfoFor315").val()=="1" ){
		if($(".ftx-03.withouthk.notseven").length>0 || $(".withouthk.seven.ftx-03").length>0){
			$(".orderInfo-tip").show();
		}else{
			$(".orderInfo-tip").hide();
		}
	}else if($("#topTitleInfoUsed").val()=="1" && $("#topTitleInfoFor315").val()=="0" ){
		$(".orderInfo-tip").show();
	}else{
		$(".orderInfo-tip").hide();
	}
}

/**
 * 是否展开配收货人
 */
function isNewUser() {
  if (checkIsNewUser()) {
    if (isLocBuy()) {
      edit_LocConsignee();
    } else {
      use_NewConsignee();
    }
  }
}

/**
 * 检查是否是新用户
 * 
 * @returns {Boolean}
 */
function checkIsNewUser() {
  var val = $("#isOpenConsignee").val();
  if (val != undefined && (val == 1 || val == "1")) {
    return true;
  }
  return false;
}window.checkIsNewUser=checkIsNewUser;

/**
 * 是否刷新地址，针对轻松购
 * 
 * @return
 */
function isRefreshArea() {
  var val = $("#isRefreshArea").val();
  if (val != undefined && (val == 1 || val == "1")) {
    return true;
  }
  return false;
}

/**
 * 大家电换区逻辑
 */
function isBigItemChange() {
  if ($("#isChangeItemByArea").val() === "true") {
    return true;
  }
  return false;
}window.isBigItemChange=isBigItemChange;

/**
 * 是否含有糖酒
 */
function hasTang9() {
  if ($("#hasTang9").val() == "true" || $("#hasTang9").val() == true) {
    return true;
  }
  return false;
}window.hasTang9=hasTang9;

/**
 * 虚拟商品不支持退款提醒
 */
function continue_SubmitOrder_for_norefund(){
    if($("#agreeNoRefundInMain").length){
        $("#agreeNoRefundInMain").val("true");
    }
    if($("#agreeNoRefundInLoc").length){
        $("#agreeNoRefundInLoc").val("true");
    }
	submit_Order();
}window.continue_SubmitOrder_for_norefund=continue_SubmitOrder_for_norefund;

/**
 * 打开全球售协议
 */
function openOverseaAgree () {
	var hkbugTip = $(document.body).dialog({
        title: '售全球服务协议',
        width: 940,
        height:500,
        fixed: true,
        maskHas: false,
        source: $('#overseabuy-box01').html() + '',
        onReady: function(){
            $('#overseabuy-box01-btn .btn-1').click(function(event) {
            	$("#overseamtbuy").attr("checked",true);
                hkbugTip.close();
            });
        }
    });
	return false;
}window.openOverseaAgree=openOverseaAgree;

/**
 * 提交订单的方法
 */
function submit_Order(enterPriseUser) {
	//港澳售项目
	var hongKongId = $("#hongKongId").val();
	var overSeasId = $("#overSeasId").val();// 全球售ID
	var taiWanId = $("#taiWanId").val();// 台湾ID
	var canSubmitFlag=false;
  	var consignee_area = $("#hideAreaIds").val();
  	if(consignee_area!=null){
	  	var consignee_provinceId = consignee_area.split("-")[0];
	  	if(consignee_provinceId == hongKongId || consignee_provinceId == overSeasId || consignee_provinceId == taiWanId){
			//先判断是否有港澳无货标签，如果有港澳无货的，弹框：不支持配送返回购物车提示;再判断是否勾选了同意按钮，没勾选弹框：继续提交提示
			var j=$("body");
			if($(".hknostock").length>0){// 港澳台、海外公用一个无货class
				var a=$("#hkmt-box01").html();
				j.dialog({title:"\u63d0\u793a",width:420,height:125,type:"html",source:a});
			}else{
				if ((consignee_provinceId == hongKongId || consignee_provinceId == overSeasId || consignee_provinceId == taiWanId) && $("#overseamtbuy").is(":checked")) {
					canSubmitFlag=true;
				} else {
					//弹框 继续提交提示
					alert("请查阅并同意协议后继续下单");
			        return;
				}
			}
		}else{
			canSubmitFlag=true;
		}
  	}else{
  		canSubmitFlag=true;
  	}
  	
	 if($("#saveParam_promiseDate").val()=="" && $("#forcedChoice").val() && $("#saveParam_promiseType").val()==3){
		 var shipTypeId = $("#shipment_select_support").val();
		 doEdit311Time(shipTypeId,1);
		 log('gz_ord', 'gz_proc', 19, 'forcedChoice');//提交订单时弹出预约日历埋点
		 return;
	 }
  	
	if(canSubmitFlag){
		var actionUrl = OrderAppConfig.Domain + "/order/submitOrder.action";
		  var checkcodeTxt = null;
		  var checkCodeRid = null;
		  var payPassword = null;
		  var remark = null;
		  var trackID = null;
		  var mobileForPresale = null;
		  var presalePayType = null;
		  var param = "";
		  // 检查如果存在没保存，则直接弹到锚点
		  if (!$("#submit_check_info_message").is(":hidden")) {
		    var anchor = $("#anchor_info").val();
		    window.location.hash = anchor;
		    return;
		  }
		  // 验证是否输入验证码
		  if (!isEmpty($("#checkCodeDiv").html())) {
		    checkcodeTxt = $("#checkcodeTxt").val();
		    if (isEmpty(checkcodeTxt)) {
		      alert("请先填写验证码!");
		      return;
		    }
		  }
		  // 验证码的随机码
		  if (!isEmpty($("#checkCodeDiv").html())) {
		    checkCodeRid = $("#checkcodeRid").val();
		  }
		  // 验证是否输入支付密码
		  if (!$("#paypasswordPanel").is(":hidden")) {
			//短密码判断是否是6位
		    if($(".sixDigitPassword").val()!=undefined && $(".sixDigitPassword").val().length != 6){
		    	$("#no-pwd-error").show();
		    	return;
      	    }
		    payPassword = $("#txt_paypassword").val();
		    if (isEmpty(payPassword)) {
		      $("#no-pwd-error").show();
		      return;
		    }
		  }

		  // 预售验证手机号
		  if ($("#isPresale").val() == "true") {
		    if ($("#presaleStepPay").val() == "1") {// 全款支付
		      presalePayType = 1;
		    }else if ($("#presaleStepPay").val() == "3") { // 定金支付
		      presalePayType = 2;
		    }else if ($("#presaleStepPay").val() == "5") { // 定金支付
		      presalePayType = 2;
		    }else if ($("#presaleStepPay").val() == "2"||$("#presaleStepPay").val() == "4") {
		      if ($("#AllPayRadio").attr("class") == "presale-payment-item item-selected"){
		        presalePayType = 1;
		      } else {
		        presalePayType = 2;
		      }
		    }
		    if (presalePayType == 2) {// 定金支付必须要手机号码
		      if (check_presaleMobile()) {
		        if ($("#presaleMobile input").size() > 0) {
		          mobileForPresale = $("#presaleMobile input").val();
		          if(mobileForPresale.indexOf("*") > -1){
		            return false;
		          }
		        } else {
		          mobileForPresale = $("#userMobileByPresale").html();
		        }
		      } else {
		        alert("请您先输入有效的预售手机号");
		        return;
		      }
		    }
		    if ($("#presaleEarnest").prop("checked") != true) {
		      alert("请您同意交付定金");
		      return;
		    }
		  }

		  // 获取订单备注
		  if (!isEmpty($("#orderRemarkItem").html())) {
		    remark = $("#remarkText").val();
		    if (remark == "限45个字"){
		      remark = "";
		    }
		    else{
		      if(!is_order_remark_forbid(remark)){alert('订单备注中含有非法字符'); return ;}
		    }
		  }

        /**
         * 电视搭售会员时，提示用户关注不能退货的条款，避免争议
         * 主流程：使用配送方式来识别
         * loc流程：使用商家id和标记位来区分
         */
        if(($(".is-video-loc-ship").length > 0 && $("#agreeNoRefundInMain").val() == "false")
            || ($("#cartVenderIdStr").val() == "613991" && $("#agreeNoRefundInLoc").val() == "false")){
            var a = $("#virtual-box01").html();
            $("body").dialog({
                title: "\u63d0\u793a",
                width: 400,
                type: "html",
                source: a
            })
            return;
        }
        
  var venderList = jQuery.parseJSON($("#promiseSopViewList").val());   
  if(venderList != null && venderList.length>0){
	  for(var i=0;i<venderList.length;i++){
		  var venderId = venderList[i].venderId;
		  if($("#sop_pick_item_"+venderId).hasClass("curr")){
			  if($("#sopPickStoreinfo_"+venderId).hasClass("hide")){
				  showSubmitErrorMessage("您还没有选择门店哦");
				  return;
			  }
		  }
	  }
  }

  if (!isEmpty(checkcodeTxt)) {
    param = param + "submitOrderParam.checkcodeTxt=" + checkcodeTxt;
  }
    param = param +"&overseaPurchaseCookies="+$("#overseaPurchaseCookies").val();
  if (!isEmpty(checkCodeRid)) {
    param = param + "&submitOrderParam.checkCodeRid=" + checkCodeRid;
  }
  if (!isEmpty(payPassword)) {
    param = param + "&submitOrderParam.payPassword=" + encodeURIComponent(stringToHex(payPassword));
  }
  if (!isEmpty(remark)) {
    param = param + "&submitOrderParam.remark=" + remark;
  }
  if (!isEmpty($("#sopNotPutInvoice").val())) {
    param = param + "&submitOrderParam.sopNotPutInvoice=" + $("#sopNotPutInvoice").val();
  } else {
    param = param + "&submitOrderParam.sopNotPutInvoice=" + false;
  }
  if (!isEmpty(mobileForPresale)) {
    param = param + "&submitOrderParam.presaleMobile=" + mobileForPresale;
  }
  if (null != presalePayType) {
    param = param + "&submitOrderParam.presalePayType=" + presalePayType;
  }
  if (isGiftBuy()) {
    var hidePrice = false;
    if (!$("#giftBuyHidePriceDiv").is(":hidden")) {
      hidePrice = $("#giftBuyHidePrice").is(":checked");
    }
    param = param + "&submitOrderParam.giftBuyHidePrice=" + hidePrice;
  }
  trackID = $("#TrackID").val();
  if (!isEmpty(trackID)) {
    param = param + "&submitOrderParam.trackID=" + trackID;
  }
  var indexFlag = param.substring(0, 1);
  if (indexFlag == "&") {
    param = param.substring(1, param.length);
  }
  param = addFlowTypeParam(param);
  var regionId = $("#regionId").val();
  var shopId = $("#shopId").val();
  if(regionId){
    param += "&regionId=" + regionId;
  }
  if(shopId){
    param += "&shopId=" + shopId;
  }
  var easyBuyFlag = $("#easyBuyFlag").val();
  if(easyBuyFlag == "1"||easyBuyFlag=="2"){
    param += "&ebf=" + easyBuyFlag;
  }
  var ignorePriceChange = $('#ignorePriceChange').val();
  if(ignorePriceChange){
    param += "&submitOrderParam.ignorePriceChange=" + ignorePriceChange;
  }
  var onlinepaytype = $(".payment-item.item-selected").attr('onlinepaytype');
  var paymentId = $(".payment-item.item-selected").attr('payid');
  try{
	  log('ord', 'trade', '20',paymentId+onlinepaytype);
	}catch(e){
	}
  if(onlinepaytype=="1"){
      var lastneedPay=$("#lastneedPay").val();
      var limit = $("#cod_bt").attr("limit");
      if(parseFloat(lastneedPay)>parseFloat(limit)){
    	  showSubmitErrorMessage("亲爱的用户您的白条剩余额度￥"+limit+"，请选择其他支付方式！");
    	  return;
      }
	  var baitiaoInfo = $("#baitiaoPayRequest").val();
	  if(!isEmpty(baitiaoInfo)){
		  param += "&" + baitiaoInfo;
	  }
      //如果白条首次还款日期未自动设置（#baitiaoPayRequest中），则使用结算页初始化时的默认值。
	  var baitiaoPayRepayDateInfo = $("#baitiaoPayRepayDateRequest").val();
	  if(!isEmpty(baitiaoPayRepayDateInfo) && param.indexOf("repayDate") < 0){
		  param += "&" + baitiaoPayRepayDateInfo;
	  }
  }
  if($(".payment-item[onlinepaytype=1]").length==0||$(".payment-item[onlinepaytype=1]").hasClass("payment-item-disabled")){
	  param += "&submitOrderParam.btSupport=0";
  }else{
	  param += "&submitOrderParam.btSupport=1";
  }
  if(onlinepaytype=="3"){
	  var card=$("#"+$("#jdpy_cardInfo").val());
	  var cardInfo = card.attr("cardInfo");
	  var cardkey = card.attr("key");
	  if(!isEmpty(cardInfo)){
		  param += "&submitOrderParam.cardInfo=" + cardInfo;
	  }
	  if(!isEmpty(cardkey)){
		  param += "&submitOrderParam.cardkey=" + cardkey;
	  }
	  param += "&submitOrderParam.cardsign=" + card.attr("sign");
	  param += "&submitOrderParam.cardvalid=" + card.attr("valid");
	  param += "&submitOrderParam.cardid=" + card.attr("id");
  }
  var eid = $('#eid').val();
  if(eid){
	param += "&submitOrderParam.eid=" + eid;
  }
  var fp = $('#fp').val();
  if(fp){
	 param += "&submitOrderParam.fp=" + fp;
  }
  
  var riskControl = $('#riskControl').val();
  if(riskControl){
	 param += "&riskControl=" + riskControl;
  }
  
  var isBestCoupon =$('#isBestCoupon').val();
  if(isBestCoupon){
    param +="&submitOrderParam.isBestCoupon="+isBestCoupon;
  }

		  var submitButtonABTest = $('#submitButtonABTest').val();
		  if(submitButtonABTest && submitButtonABTest == 1){
		    log('ord_abtest','trade_abtest', $('#order-submit').data('data-clkwl'));
		  }
		  // 提交loading
		  $('body').append("<div id='submit_loading' class='purchase-loading'><div class='loading-cont'></div></div>");
		  jQuery.ajax({
		    type : "POST",
		    dataType : "json",
		    url : actionUrl,
		    data : param,
		    cache : false,
		    success : function(result) {
		      // 没有登录跳登录
		      if (isUserNotLogin(result)) {
		        goToLogin();
		        return;
		      }
		      $('#ignorePriceChange').val(0);
		      if (result.success) {
		    	// 企业用户合并支付
		    	if (enterPriseUser == 1) {
		    		successUrl = OrderAppConfig.Protocol +"order.jd.com/center/list.action";
				    // 等待拆单，定时450毫秒
				    window.setTimeout('window.location.href=successUrl+"?rd="+Math.random();', 450);
				    return;
		    	}
		        // 跳订单中心列表
		    	if(result.payInfo){
		    		$('#direct_pay input[name=orderId]').val(result.payInfo.orderId);
		    		$('#direct_pay input[name=orderType]').val(result.payInfo.orderType);
		    		$('#direct_pay input[name=toType]').val(result.payInfo.toType);
		    		$('#direct_pay input[name=directPayInfoJson]').val(result.payInfo.directPayInfoJson);
		    		$('#direct_pay input[name=payMethod]').val(result.payInfo.payMethod);
		    		$('#direct_pay input[name=key]').val(result.payInfo.key);
		    		$('#direct_pay input[name=countdownTime]').val(result.payInfo.countdownTime);
		    		$('#direct_pay input[name=orderSubmitTime]').val(result.payInfo.orderSubmitTime);
		    		 window.setTimeout("$('#direct_pay').submit();",450);
		    		
		    		return;
		    	}
		    	// 全球售
		    	if (result.overSea) {
		    		var payUrlForOverSeas = OrderAppConfig.Protocol + "pcashier.jd.com/cashier/index.action?";
		    		var orderIdForOverSeas = result.orderId;
		    		var reqInfoForOverSeas = result.reqInfo;
		    		var signForOverSeas = result.sign;
		    		realUrl = payUrlForOverSeas + "orderId=" + orderIdForOverSeas + "&reqInfo=" + reqInfoForOverSeas + "&sign=" + signForOverSeas;
		    		window.setTimeout('window.location.href=realUrl;', 450);
			    	return;
		    	}
		        if (result.goJumpOrderCenter) {
		          successUrl = OrderAppConfig.Protocol +"order.jd.com/center/list.action";
		          // 等待拆单，定时450毫秒
		          window.setTimeout('window.location.href=successUrl+"?rd="+Math.random();', 450);
		          return;

		        } else {
		          successUrl = "//success.jd.com/success/success.action";
		          window.location.href = successUrl + "?orderId=" + result.orderId + "&rid=" + Math.random();
		          return;
		        }

      } else {
        if (result.message != null) {
          //价格提高
          if(result.resultCode == 600160){
            $("#submit_loading").remove();
            showPriceIncreaseDialog(result.message);
          } else if(result.message.indexOf("支付密码不正确") != -1){
        	  $("#submit_loading").remove();
        	  $("#pwd-error .error-msg").text(result.message);
        	  $("#pwd-error").show();
        	  if($(".sixDigitPassword").val()!=undefined && $(".sixDigitPassword").val().length>0){
        		  resetPaypassword();
        	  }
        	  $("#txt_paypassword").val("");
        	  return;
          }else if (result.message.indexOf("商品无货") != -1 && !isLocBuy()) {
            $("#submit_loading").remove();
            var outSkus = result.noStockSkuIds;
            var resultCode = result.resultCode;
            // 对无货商品的处理
            showSubmitErrorMessage(result.message);
            if (!isEmpty(outSkus)) {
              if (isLipinkaPhysical() || isCarO2OFlow()) {
                return;
              }
              var flowType = $("#flowType").val();
              if((flowType == "" || flowType == 10) && resultCode != 600159){
                doOutSku(outSkus, resultCode,result.addressVO);
              }else{
                window.location.href = cartUrl + '?outSkus=' + outSkus + '&rid=' + Math.random();
                return;
              }
            }
          } else if (result.message.indexOf("收货人信息中的省市县选择有误") != -1) {
            var consigneeId = $("#consignee_id").val();
            //consigneeList(consigneeId);
            $("#submit_loading").remove();
            showSubmitErrorMessage("亲爱的用户，由于地址已经升级，请重新选择！");
          } else if (result.message.indexOf("由于订单金额较大") != -1) {
            $("#submit_loading").remove();
            showSubmitErrorMessage(result.message);
            return;
          } else if (result.message.indexOf("验证码不正确") != -1) {
            $("#submit_loading").remove();
            showSubmitErrorMessage(result.message);
            getNextCheckCode();// 刷新验证码
            return;
          } else if (result.message.indexOf("正在参与预售活动") != -1) {
            var a = result.message.indexOf("您购买的商品");
            var b = result.message.indexOf("正在参与预售活动");
            var outSkus = result.message.substring(a + 6, b);
            if (!isEmpty(outSkus)) {
              var tmpHtml = "";
              var skuList = outSkus.split(",");
              for (var i = 0; i < skuList.length; i++) {
                tmpHtml = tmpHtml + "<a target=\"_parent\" href=\"http://item.jd.com/" + skuList[i] + ".html\">" + skuList[i] + "</a>,";
              }
              tmpHtml = tmpHtml.substring(0, tmpHtml.length - 1);
              result.message = "您购买的商品" + tmpHtml + "正在参与预售活动,请进入商品详情页单独购买";
            }
            $("#submit_loading").remove();
            showSubmitErrorMessage(result.message);
          }else if(result.scaleSkuInfoListVO!=null && result.scaleSkuInfoListVO.length>0){ //抢购限制
        	  $("#submit_loading").remove();
        	  showScaleBuyDialog(result);
        	  return;
          }else if(result.resultCode == 600171){
        	  $("#submit_loading").remove();
        	  showSamMemberDialog(result.message);
          }else if(result.purchaseSkuInfoListVO != null && result.purchaseSkuInfoListVO.length>0){
              //限购
              $("#submit_loading").remove();
              showPurchaseList(result.purchaseSkuInfoListVO,'以下商品每人限量购买，请返回购物车修改')
          }else {
            $("#submit_loading").remove();
            showSubmitErrorMessage(result.message);
            return;
          }
        } else {
          $("#submit_loading").remove();
          showSubmitErrorMessage("亲爱的用户请不要频繁点击, 请稍后重试...");
          return;
        }
      }
    },
    error : function(error) {
      $("#submit_loading").remove();
      $('#ignorePriceChange').val(0);
      showSubmitErrorMessage("亲爱的用户请不要频繁点击, 请稍后重试...");
    }
  });
	}
}window.submit_Order = submit_Order;


function showScaleBuyDialog(result){
	 var skuArray=result.scaleSkuInfoListVO;
	 var skuList=[];
	 var content = '';
	    for(var i = 0; i < skuArray.length; i++){
	    	var name = skuArray[i].skuName;
	    	var text='';
	    	if(name.length>20){
	    		text=name.substr(0,20);
	    		text+="</br>";
	    		text+=name.substr(20,name.legth);
	    	}else{
	    		text=name;
	    	}
	    	name=text;
	        var imgUrl = skuArray[i].skuImage;
	        var price = skuArray[i].price;
	        var promoPrice = skuArray[i].promoPrice;
	        var id = skuArray[i].skuId;
	        var num = skuArray[i].num;
	        skuList.push(id);
	        content += '<div class="goods-item">'+
	        '<div class="goods-msg">'+
	        '<div class="p-img"><img src="//img12.360buyimg.com/n1/s50x50_' + imgUrl +  '" alt=""></div>'+
	        '<div class="goods-msg-gel">'+
	        '<div class="p-name">'+name+
	        '<div class="mt5"><strong class="">￥'+ promoPrice.toFixed(2)+'</strong><span class="ftx-01 ml15">原价：</span><strong class="jd-price">￥'+price.toFixed(2)+'</strong></div>'+
	        '</div>'+
	        '<div class="p-num">x'+num+'</div>'+
	        '</div></div>'+
	        '<div class="clr"></div>'+
	        '</div>';
	    }
	    var param=skuList.join(",");
	    var listBefore = '<div class="limited-pin-thickbox"><div class="tip-box icon-box-new"><span class="warn-icon-yellow-2017 m-icon"></span><div class="item-fore"><span>您以优惠价购买过以下商品， 本次需以原价购买</span></div></div><div class="goods-items">';
        var listAfter='</div><div class="op-btns ar"><a href="#none" onclick="tagSkuScaleBuy()" class="btn-1">继续购买</a><a href="#none" class="btn-9 ml10" onclick="goCart()">返回购物车</a></div>';	    var hide='<div><input type="hidden" id="skuScaleParam" value="'+param+'"></div>';
	    var hide='<div><input type="hidden" id="skuScaleParam" value="'+param+'"></div>';
	    content = listBefore + content + listAfter+hide;
	    $("body").dialog({
	          title: "\u63d0\u793a",
	          width: 600,
	          type:'text',
	          modal: true,
	          source:content,
	          onReady:function() {
	              $(".ui-dialog-close").hide();
	          }
	     });
}window.showScaleBuyDialog = showScaleBuyDialog;



/**
 * 限购商品取消使用优惠标记
 */
function tagSkuScaleBuy(skus){
  var skuParam=$("#skuScaleParam").val();
  var param = "scaleSkuData=" + skuParam;
  var actionUrl = OrderAppConfig.Domain + "/order/cancelSkuScaleBuyPrice.action";
  param = addFlowTypeParam(param);
  jQuery.ajax({
      type : "POST",
      dataType : "json",
      url : actionUrl,
      data : param,
      cache : false,
      success : function(data, textStatus) {
        if (isUserNotLogin(data)) {
          goToLogin();
          return;
        }
        if (!data) {
          showSubmitErrorMessage("取消商品优惠失败!");
        }else {
          window.location.reload();
        }
      },
      error : function(XMLHttpResponse) {
      }
    });
  
}window.tagSkuScaleBuy = tagSkuScaleBuy;


  /**
   *  价格不一致 对话框
   */
function showPriceIncreaseDialog(message){

    var skuPriceDetialInfoList = JSON.parse(message);
    if(skuPriceDetialInfoList.length == 0){
      return;
    }
    var list = '';
    for(var i = 0; i < skuPriceDetialInfoList.length; i++){
      var name = skuPriceDetialInfoList[i].name;
      var imgUrl = skuPriceDetialInfoList[i].imgUrl;
      var discountPricePrevious = skuPriceDetialInfoList[i].discountPricePrevious;
      var discountPriceNow = skuPriceDetialInfoList[i].discountPriceNow;
      var giftList = skuPriceDetialInfoList[i].giftList;
      var yanBaoList = skuPriceDetialInfoList[i].yanBaoList;
      list += '<div class="goods-item">'+
      '<div class="p-img"><a href="#none"><img src="//img14.360buyimg.com/N4/' + imgUrl + '" alt=""></a></div>'+
      '<div class="goods-msg">'+
      '<div class="p-name"><a href="#none">' + name + '</a> </div>'+
      '<div class="p-price">当前价：<strong>￥' + discountPriceNow.toFixed(2) + '</strong><span class="ftx-03">初始价：<del>￥' + discountPricePrevious.toFixed(2) + '</del></span></div>'+
      '</div>' + '<div class="clr"></div><div class="gift-items">'
      list += getGiftList(giftList);
      list += getYanBaoList(yanBaoList);
      list += '</div></div>';
    }

    var listBefore = '<div class="price-change-thickbox"><div class="tip-box icon-box"><span class="joyc-icon m-icon"></span><div class="item-fore"><h3>部分商品优惠时间已过，确定提交订单？</h3></div></div><div class="goods-items">';
    var listAfter = '</div><div class="op-btns ac"><a href="#none" class="btn-9" onclick="reCheckOrderInfo()">返回查看订单</a><a href="javascript:$.closeDialog();" class="btn-1 ml10" onclick="submitOrderIgnorePrice()">提交订单</a></div></div>';
    list = listBefore + list + listAfter;
    $('body').dialog({
      title:'价格变动提示',
      width:670,
      type:'text',
      maskIframe: true,
      source:list,
      onReady:function() {
        $(".ui-dialog-close").hide();
      }
    });

}window.showPriceIncreaseDialog = showPriceIncreaseDialog;
  /**
   * 价格不一致 重新检查一下价格
   */
function reCheckOrderInfo(){
    log('gz_ord','gz_proc',6,'szfhckdd');
    window.location.reload();
}window.reCheckOrderInfo = reCheckOrderInfo;
  /**
   * 价格不一致 不顾价格变化，直接提交订单
   */
function submitOrderIgnorePrice(){
    log('gz_ord','gz_proc',6,'sztjdd');
    $('#ignorePriceChange').val(1);
    submit_Order();
}window.submitOrderIgnorePrice = submitOrderIgnorePrice;
  /**
   * 价格不一致 组装赠品信息
   * @param giftList
   * @returns {string}
   */
function getGiftList(giftList){
    var list = '';
    if(!giftList || giftList.length == 0) {
      return list;
    }

    for(var i = 0; i < giftList.length; i++){
      var name = giftList[i].name;
      var buyNum = giftList[i].buyNum;
      list += '<div class="gift-item ftx-03">'
      +'<p>【赠品】&nbsp;' + name + '&nbsp;x&nbsp;' + buyNum + '</p>'
      +'</div>';
    }
    return list;
}window.getGiftList = getGiftList;
  /**
   * 价格不一致 组装延保信息
   * @param yanBaoList
   * @returns {string}
   */
function getYanBaoList(yanBaoList){
    var list = '';
    if(!yanBaoList || yanBaoList.length == 0) {
      return list;
    }
    for(var i = 0; i < yanBaoList.length; i++){
      var name = yanBaoList[i].name;
      var buyNum = yanBaoList[i].buyNum;
      var discountPrice = yanBaoList[i].discountPrice;
      list +='<div class="gift-item ftx-03">'
      +'<p>【延保】&nbsp;' + name + '&nbsp;￥' + discountPrice.toFixed(2) + '&nbsp;x&nbsp;' + buyNum + '</p>'
      +'</div>';
    }
    return list;
}window.getYanBaoList = getYanBaoList;
/**
* 展示提交错误提示<p>
* 延时清除提交错误信息
*/
function showSubmitErrorMessage(message) {
  $("#submit_message").html(message);
  $("#submit_message").show().css('top',($("#submit_message").height()+2)*-1);
  setTimeout(function(){
    $("#submit_message").hide();
  }, 8000);
}

/**
 * 
 * 加密数据为unicode
 * 
 */
function stringToHex(str){
  var val="";
  for(var i = 0; i < str.length; i++){
    val += "u" + str.charCodeAt(i).toString(16);
  }
  return val;
}


/**
 * 使用以旧换新逻辑
 * 
 * @return
 */
function useOldRepalceNew() {
  var isReplace = false;
  if ($("#oldReplaceNew:checked").size() > 0) {
    isReplace = true;
  } else {
    isReplace = false;
  }
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : OrderAppConfig.AsyncDomain + "/useOldReplaceNew.action",
    data : addFlowTypeParam("isReplace=" + isReplace),
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      $("#span-skulist").html(dataResult);
      var orderPrice = eval("(" + $("#orderPriceInSkuList").val() + ")");
      // 修改优惠券结算信息
      if (orderPrice.couponDiscount != null) {
        $("#couponPriceId").text("-￥" + orderPrice.couponDiscount.toFixed(2));
        if (orderPrice.couponDiscount == 0) {
          $("#showCouponPrice").css("display", "none");
          $("#couponPriceId").css("display", "none");
        } else {
          $("#showCouponPrice").css("display", "block");
          $("#couponPriceId").css("display", "block");
        }
      } else {
        $("#couponPriceId").css("display", "none");
      }

      // 修改礼品卡结算信息
      if (orderPrice.giftCardDiscount != null) {
        $("#giftCardPriceId").text("-￥" + orderPrice.giftCardDiscount.toFixed(2));
        if (orderPrice.giftCardDiscount == 0) {
          $("#showGiftCardPrice").css("display", "none");
        } else {
          $("#showGiftCardPrice").css("display", "block");
        }
      } else {
        $("#showGiftCardPrice").css("display", "none");
      }

      // 修改余额
      if (orderPrice.usedBalance != null) {
        $("#usedBalanceId").text("-￥" + orderPrice.usedBalance.toFixed(2));
        if (orderPrice.usedBalance == 0) {
          $("#showUsedOrderBalance").css("display", "none");
        } else {
          $("#showUsedOrderBalance").css("display", "block");
        }
      } else {
        $("#showUsedOrderBalance").css("display", "none");
      }

      // 修改应付余额
      if (orderPrice.payPrice != null) {
    	 modifyNeedPay(orderPrice.payPrice.toFixed(2))
      }
      // 商品总金额
      if (orderPrice.promotionPrice != null) {
        $("#warePriceId").text("￥" + orderPrice.promotionPrice.toFixed(2));
      }
    },
    error : function(XMLHttpResponse) {
    }
  });
}

/** *********************************************有货先发****************************************************** */

/**
 * 大家电换区
 * 
 * @return
 */
function bigItemChangeArea() {
  var actionUrl = OrderAppConfig.AsyncDomain + "/isBigItemChangeArea.action";
  var param = addFlowTypeParam();
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      if (dataResult.resultFlag) {
        if (dataResult.message) {
          alert(dataResult.message);
        } else {
          alert("请注意：根据您最新的收货地址，您购物车中的商品或价格发生了变化！");
        }
        bigItemGoOrder();
      } else {
        if (dataResult.message) {
          alert(dataResult.message);
        }
      }

    },
    error : function(XMLHttpResponse) {
    }
  });
}window.bigItemChangeArea=bigItemChangeArea;

/**
 * 糖酒换区
 * 
 * @return
 */
function tang9ChangeArea() {
  var actionUrl = OrderAppConfig.AsyncDomain + "/tang9ChangeArea.action";
  var param = addFlowTypeParam();
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      if (dataResult.resultFlag) {
        if (dataResult.message) {
          alert(dataResult.message);
        } else {
          alert("请注意：根据您最新的收货地址，您购物车中的商品或价格发生了变化！");
        }
        goOrder();
      } else {
        if (dataResult.message) {
          alert(dataResult.message);
        }
      }

    },
    error : function(XMLHttpResponse) {
    }
  });
}window.tang9ChangeArea=tang9ChangeArea;

/**
 * 是否走新换区流程
 * @returns {boolean}
 */
function isNewReplacedFlow() {
    if ($("#newReplacedFlow").val() == "true" || $("#newReplacedFlow").val() == true) {
        return true;
    }
    return false;
}window.isNewReplacedFlow=isNewReplacedFlow;

/**
 * 是否含有山姆
 * @returns {boolean}
 */
function isHasSam() {
    if ($("#isHasSam").val() == "true" || $("#isHasSam").val() == true) {
        return true;
    }
    return false;
}window.isHasSam=isHasSam;
/**
 * 山姆会员店换区
 */
function samChangeArea() {
var actionUrl = OrderAppConfig.AsyncDomain + "/samChangeArea.action";
var param = addFlowTypeParam();
jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    async: false,
    success : function(dataResult, textStatus) {
        if (dataResult.resultFlag) {
            var skuNum = dataResult.resultCode;
            var skuJson = dataResult.message;
            var replacedSkus = $(".replacedSkus").html();
            if(skuNum > 0 && skuJson != null && skuJson != '' && skuJson != undefined) {
            	showNewChanged(skuJson);
            }else{
            	if(replacedSkus != undefined && replacedSkus != null && replacedSkus != '' && replacedSkus.length>2){
            		showChangedSam(replacedSkus);
            	}
            }
        } else {
            if (dataResult.message) {
                alert(dataResult.message);
            }
        }

    },
    error : function(XMLHttpResponse) {
    }
});
}window.samChangeArea=samChangeArea;

/**
 * 山姆会员店、大家电同时换区
 */
function samAndBigItemChangeArea() {
var actionUrl = OrderAppConfig.AsyncDomain + "/samAndBigItemChangeArea.action";
var param = addFlowTypeParam();
jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    async: false,
    success : function(dataResult, textStatus) {
        if (dataResult.resultFlag) {
            var skuNum = dataResult.resultCode;
            var skuJson = dataResult.message;
            var replacedSkus = $(".replacedSkus").html();
            if(skuNum > 0 && skuJson != null && skuJson != '' && skuJson != undefined) {
            	showNewChanged(skuJson);
            }else{
            	if(replacedSkus != undefined && replacedSkus != null && replacedSkus != '' && replacedSkus.length>2){
            		showChangedSam(replacedSkus);
            	}
            }
        } else {
            if (dataResult.message) {
                alert(dataResult.message);
            }
        }

    },
    error : function(XMLHttpResponse) {
    }
});
}window.samAndBigItemChangeArea=samAndBigItemChangeArea;

/**
 * 山姆会员店点商品换区成功，展示提示信息
 */
function showChangedSam(skuJson) {
    var skuList = jQuery.parseJSON(skuJson);
    //换区前是否参与山姆满赠
    var isFullOfGifts = false;
    for(var i = 0; i < skuList.length; i ++) {
    	if(skuList[i].isFullOfGifts == '1'){
    		isFullOfGifts=true;
    	}
    }
    var imgRoot = "//img10.360buyimg.com/cms/s80x80_";
    var dialogDiv = ""
    dialogDiv += "<div class='psam-thickbox'>";
    dialogDiv += "	<div class='tip-box icon-box-new'>";
    dialogDiv += "		<span class='warn-icon m-icon'></span>";
    dialogDiv += "		<div class='item-fore'>";
    if(isFullOfGifts){
        dialogDiv += "			<h3>由于地址切换，以下商品价格和库存</h3>";
        dialogDiv += "			<h3>可能会发生变化，赠品请回到购物车</h3>";
        dialogDiv += "			<h3>中领取。</h3>";
    }else{
        dialogDiv += "			<h3>由于地址切换，以下商品价格和库存</h3>";
        dialogDiv += "			<h3>可能会发生变化</h3>";
    }
    dialogDiv += "		</div>";
    dialogDiv += "	</div>";
    dialogDiv += "	<div class='goods-items'>";
    for(var i = 0; i < skuList.length; i ++) {
        var imgUrl = imgRoot + skuList[i].imgUrl;
        var skuName = skuList[i].skuName;
        dialogDiv += "		<div class='goods-item'>";
        dialogDiv += "			<div class='goods-msg'>";
        dialogDiv += "				<div class='p-img'>";
        dialogDiv += "					<a href='#none'><img width='50' height='50' src='" + imgUrl + "' alt=''></a>";
        dialogDiv += "				</div>";
        dialogDiv += "				<div class='goods-msg-gel'>";
        dialogDiv += "					<div class='p-name'>";
        dialogDiv += "						<a href='#none' title='" + skuName + "'>" + skuName + "</a>";
        dialogDiv += "					</div>";
        dialogDiv += "				</div>";
        dialogDiv += "				<div class='clr'></div>";
        dialogDiv += "			</div>";
        dialogDiv += "			<div class='clr'></div>";
        dialogDiv += "		</div>";
    }
    dialogDiv += "	</div>";
    dialogDiv += "	<div class='op-btns ac'>";
    dialogDiv += "		<a href='javascript:void(0)' class='btn-1' onclick='closeSamDialogDiv()'>知道了</a>";
    dialogDiv += "	</div>";
    dialogDiv += "</div>";

    $('body').dialog({
        title:'提示',
        type:'html',
        source: dialogDiv,
        onCancel : function() {
            $.closeDialog();
            bigItemGoOrder();
        }
    });
}window.showChangedSam=showChangedSam;

/**
 * 换区弹窗
 */
function showNewChanged(skuJson) {
    var skuList = jQuery.parseJSON(skuJson);
    //换区前是否参与山姆满赠
    var isFullOfGifts = false;
    for(var i = 0; i < skuList.length; i ++) {
    	if(skuList[i].isFullOfGifts == '1'){
    		isFullOfGifts=true;
    	}
    }
    var imgRoot = "//img10.360buyimg.com/cms/s80x80_";
    var dialogDiv = ""
    dialogDiv += "<div class='psam-thickbox'>";
    dialogDiv += "	<div class='tip-box icon-box-new'>";
    dialogDiv += "		<span class='warn-icon m-icon'></span>";
    dialogDiv += "		<div class='item-fore'>";
    if(isFullOfGifts){
        dialogDiv += "			<h3>由于地址切换，以下商品价格和库存</h3>";
        dialogDiv += "			<h3>可能会发生变化，赠品请回到购物车</h3>";
        dialogDiv += "			<h3>中领取。</h3>";
    }else{
        dialogDiv += "			<h3>由于地址切换，以下商品价格和库存</h3>";
        dialogDiv += "			<h3>可能会发生变化</h3>";
    }
    dialogDiv += "		</div>";
    dialogDiv += "	</div>";
    dialogDiv += "	<div class='goods-items'>";
    for(var i = 0; i < skuList.length; i ++) {
        var imgUrl = imgRoot + skuList[i].imgUrl;
        var skuName = skuList[i].skuName;
        dialogDiv += "		<div class='goods-item'>";
        dialogDiv += "			<div class='goods-msg'>";
        dialogDiv += "				<div class='p-img'>";
        dialogDiv += "					<a href='#none'><img width='50' height='50' src='" + imgUrl + "' alt=''></a>";
        dialogDiv += "				</div>";
        dialogDiv += "				<div class='goods-msg-gel'>";
        dialogDiv += "					<div class='p-name'>";
        dialogDiv += "						<a href='#none' title='" + skuName + "'>" + skuName + "</a>";
        dialogDiv += "					</div>";
        dialogDiv += "				</div>";
        dialogDiv += "				<div class='clr'></div>";
        dialogDiv += "			</div>";
        dialogDiv += "			<div class='clr'></div>";
        dialogDiv += "		</div>";
    }
    
    var replacedSkus = $(".replacedSkus").html();
    if(isNewReplacedFlow() && replacedSkus != undefined && replacedSkus != null && replacedSkus != '' && replacedSkus.length>2){
        skuList = jQuery.parseJSON($(".replacedSkus").html());
        if(skuList !=null && skuList.length>0){
          for(var i = 0; i < skuList.length; i ++) {
                  var imgUrl = imgRoot + skuList[i].imgUrl;
                  var skuName = skuList[i].skuName;
                  dialogDiv += "    <div class='goods-item'>";
                  dialogDiv += "      <div class='goods-msg'>";
                  dialogDiv += "        <div class='p-img'>";
                  dialogDiv += "          <a href='#none'><img width='50' height='50' src='" + imgUrl + "' alt=''></a>";
                  dialogDiv += "        </div>";
                  dialogDiv += "        <div class='goods-msg-gel'>";
                  dialogDiv += "          <div class='p-name'>";
                  dialogDiv += "            <a href='#none' title='" + skuName + "'>" + skuName + "</a>";
                  dialogDiv += "          </div>";
                  dialogDiv += "        </div>";
                  dialogDiv += "        <div class='clr'></div>";
                  dialogDiv += "      </div>";
                  dialogDiv += "      <div class='clr'></div>";
                  dialogDiv += "    </div>";
              }
        }
      }
    dialogDiv += "	</div>";
    dialogDiv += "	<div class='op-btns ac'>";
    dialogDiv += "		<a href='javascript:void(0)' class='btn-1' onclick='closeSamDialogDiv()'>知道了</a>";
    dialogDiv += "	</div>";
    dialogDiv += "</div>";

    $('body').dialog({
        title:'提示',
        type:'html',
        source: dialogDiv,
        onCancel : function() {
            $.closeDialog();
            bigItemGoOrder();
        }
    });
}window.showNewChanged=showNewChanged;

function closeSamDialogDiv() {
    $.closeDialog();
}window.closeSamDialogDiv=closeSamDialogDiv;


    /** *********************************************京豆****************************************************** */
/**
 * 京豆支付展开关闭
 */
function showOrHideJdBean(types) {
  if ($("#orderBeanItem").hasClass("toggle-active")) {
    $("#orderBeanItem").removeClass("toggle-active");
    $("#jdBeans-new").hide();
  } else {
    var actionUrl = OrderAppConfig.DynamicDomain + "/jdbean/getJdBean.action";
    var params = addFlowTypeParam();
    jQuery.ajax({
      type : "POST",
      dataType : "html",
      data : params,
      url : actionUrl,
      cache : false,
      success : function(result) {
        // 没有登录跳登录
        if (isUserNotLogin(result)) {
          goToLogin();
          return;
        }
        $("#orderBeanItem").addClass("toggle-active");
        $("#jdBeans-new").html(result);
        if(types==1){
        	flushOrderPrice(eval("(" + $("#jdBeanOrderPrice").val() + ")"), false,1);
        }else{
        	flushOrderPrice(eval("(" + $("#jdBeanOrderPrice").val() + ")"), true,1);
        }
        $("#jdBeans-new").show();
        var param = "couponParam.fundsPwdType=JdBean";
        var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
        param = addFlowTypeParam(param);
        jQuery.ajax({
          type : "POST",
          dataType : "json",
          url : url,
          data : param,
          async : true,
          cache : false,
          success : function(flag) {
            if (!flag) {
              if ($("#usedJdBean").length > 0) {
                // 取消京豆
                useJdBean(0);
              }
              //未开启支付密码京豆不可用
            $("#selectJd").css("pointer-events","none");
              $("#selectJd").attr("disabled","disabled");
            $("#useBean").click(function(){
                showLargeMessage("支付密码未开启", "为保障您的账户资金安全，请先开启支付密码");
            })
          }}
        });
      },
      error : function(XMLHttpResponse) {
      }
    });
  }
}
window.showOrHideJdBean = showOrHideJdBean;
/**
 * 取消使用京豆，不展开京豆选项
 */
function cancelJdBeanWithoutOpen() {
  var actionUrl = OrderAppConfig.DynamicDomain + "/jdbean/useJdBean.action";
  var param = "jdBeanParam.usedJdBean=0";
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "html",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(result) {
      flushOrderPrice(eval("(" + $("#jdBeanOrderPrice").val() + ")"), true,1);
      isNeedPaymentPassword();// 是否需要支付密码
    },
    error : function(XMLHttpResponse) {
    }
  });
}window.cancelJdBeanWithoutOpen=cancelJdBeanWithoutOpen;
/**
 * 使用京豆
 */
function useJdBean(jdbean) {
  var actionUrl = OrderAppConfig.DynamicDomain + "/jdbean/useJdBean.action";
  var param = "jdBeanParam.usedJdBean=" + jdbean;
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "html",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(result) {
      // 没有登录跳登录
      if (isUserNotLogin(result)) {
        goToLogin();
        return;
      }
      $("#orderBeanItem").addClass("toggle-active");
      $("#jdBeans-new").html(result);
      $("#jdBeans-new").show();
      flushOrderPrice(eval("(" + $("#jdBeanOrderPrice").val() + ")"), true,1);
      isNeedPaymentPassword();// 是否需要支付密码
    },
    error : function(XMLHttpResponse) {
    }
  });
}window.useJdBean=useJdBean;

/**
 * 京豆使用取消修改
 * 
 * @return
 */
function useCancelEditJdBean(jdbean, rate, cancel) {
  if (jdbean < 0 || (cancel && $("#showUsedJdBean:visible").length == 0)) {
    return;
  }
  // 取消使用京豆，不用校验支付密码开启状态
  if (cancel) {
    useJdBean(0);
  } else {// 使用京豆，先校验支付密码开启状态
    var param = "couponParam.fundsPwdType=JdBean";
    var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
    param = addFlowTypeParam(param);
    jQuery.ajax({
      type : "POST",
      dataType : "json",
      url : url,
      data : param,
      async : true,
      cache : false,
      success : function(flag) {
        if (isUserNotLogin(flag)) {
          goToLogin();
          return;
        }
        if (flag) {
//          $("#jdBean-safe-tip").hide();
          useJdBean(jdbean);
        } 
        else {
          showLargeMessage("支付密码未开启", "为保障您的账户资金安全，请先开启支付密码");
//          $("#jdBean-safe-tip").show();
          return;
        }
      }
    });
  }
}window.useCancelEditJdBean = useCancelEditJdBean;


/** ******************************免注册下单开始******************************** */
function sendMobileCode() {
  var mobile = $("#consignee_mobile").val();

  if (!checkMobilePhone()) {
    return;
  }

  $("#sendMobileCodeBtn").attr("disabled", "disabled");
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : OrderAppConfig.DynamicDomain + "/order/sendMobileCode.action",
    data : "consigneeWithoutRegistParam.mobile=" + mobile,
    cache : false,
    success : function(dataResult) {
      if (dataResult.success) {
        $("#call_div_error").hide();
        $("#call_div").removeClass("message");
        // 倒计时
        $("#sendMobileCodeBtn").attr("disabled", "disabled");
        $("#sendMobileCodeBtn").val("120秒后重新获取");
        setTimeout(countDown, 1000);

      } else {
        var errorMessage = dataResult.message;
        if (errorMessage != null && errorMessage.indexOf("已注册") > -1) {
          errorMessage = errorMessage + "，<a href='https://passport.jd.com/new/login.aspx?ReturnUrl=http%3A%2F%2Fcart.jd.com%2Fcart%2Fcart.html' >立即登录</a>";
        }
        $("#call_div_error").html(errorMessage);
        $("#call_div_error").show();
        $("#call_div").addClass("message");
        //$("#sendMobileCodeBtn").attr("disabled", "");
        $("#sendMobileCodeBtn").removeAttr("disabled");
      }
    },
    error : function(XMLHttpResponse) {
    }
  });
}window.sendMobileCode = sendMobileCode;

function checkMobilePhone() {
  var mobile = $("#consignee_mobile").val();
  var checkFlag = true;
  var reg = /^1[3|4|5|8]\d{9}/;
  var errorMessage = "";
  if (isEmpty(mobile)) {
    errorMessage = "请输入手机号";
    checkFlag = false;
  } else {
    if (mobile.match(reg) == null) {
      checkFlag = false;
      errorMessage = "手机号格式错误";
    }
  }
  if (!checkFlag) {
    $("#call_div_error").html(errorMessage);
    $("#call_div_error").show();
    $("#call_div").addClass("message");
  } else {
    $("#call_div_error").hide();
    $("#call_div").removeClass("message");
  }
  return checkFlag;
} window.checkMobilePhone=checkMobilePhone;

/**
 * 发送验证码倒计时
 * 
 * @return
 */
function countDown() {
  var text = $("#sendMobileCodeBtn").val();
  var secondTxt = text.substring(0, text.indexOf("秒"));
  var second = parseInt(secondTxt);
  if (second <= 0) {
    //$("#sendMobileCodeBtn").attr("disabled", "");
    $("#sendMobileCodeBtn").removeAttr("disabled");
    $("#sendMobileCodeBtn").val("获取验证码");
  } else {
    second--;
    $("#sendMobileCodeBtn").val(second + "秒后重新获取");
    setTimeout(countDown, 1000);
  }
}

function checkMobileCode() {
  var code = $("#mobileCode").val();
  if (isEmpty(code)) {
    $("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
    $("#mobileCode_div").addClass("message");
    return;
  }
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : OrderAppConfig.DynamicDomain + "/order/checkMobileCode.action",
    data : "consigneeWithoutRegistParam.code=" + code,
    cache : false,
    success : function(dataResult) {
      if (dataResult) {
        $("#mobileCode_div_success").show();
        $("#mobileCode_div_error").hide();
        $("#mobileCode_div").removeClass("message");
      } else {
        $("#mobileCode_div_success").hide();
        $("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
        $("#mobileCode_div_error").show();
        $("#mobileCode_div").addClass("message");
        return;
      }
    },
    error : function(XMLHttpResponse) {
    }
  });
}window.checkMobileCode = checkMobileCode;
function save_ConsigneeWithoutRegister() {
  // 普通地址
  var consignee_id = 0;
  var consignee_type = 1;
  var consignee_provinceId = null;
  var consignee_cityId = null;
  var consignee_countyId = null;
  var consignee_townId = null;
  var consignee_name = null;
  var consignee_email = "";
  var consignee_address = null;
  var consignee_mobile = null;
  var consignee_phone = "";
  var consignee_provinceName = null;
  var consignee_cityName = null;
  var consignee_countyName = null;
  var consignee_townName = null;
  var isUpdateCommonAddress = 0;
  var mobileCode = "";

  consignee_provinceId = $("#consignee_province").find("option:selected").val();
  consignee_cityId = $("#consignee_city").find("option:selected").val();
  consignee_countyId = $("#consignee_county").find("option:selected").val();
  consignee_townId = $("#consignee_town").find("option:selected").val();
  consignee_provinceName = $("#consignee_province").find("option:selected").text().replace("*", "");
  consignee_cityName = $("#consignee_city").find("option:selected").text().replace("*", "");
  consignee_countyName = $("#consignee_county").find("option:selected").text().replace("*", "");
  if (!$("#span_town").is(":hidden")) {
    consignee_townName = $("#consignee_town").find("option:selected").text().replace("*", "");
  }

  consignee_name = $("#consignee_name").val();
  consignee_address = $("#consignee_address").val();
  consignee_mobile = $("#consignee_mobile").val();
  mobileCode = $("#mobileCode").val();
  var checkConsignee = true;
  // 验证收货人信息是否正确
  if (!check_Consignee("name_div")) {
    checkConsignee = false;
  }
  // 验证地区是否正确
  if (!check_Consignee("area_div")) {
    checkConsignee = false;
  }
  // 验证收货人地址是否正确
  if (!check_Consignee("address_div")) {
    checkConsignee = false;
  }
  // 验证手机号码是否正确
  if (!checkMobilePhone()) {
    checkConsignee = false;
  }
  if (isEmpty(mobileCode)) {
    $("#mobileCode_div_success").hide();
    $("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
    $("#mobileCode_div_error").show();
    $("#mobileCode_div").addClass("message");
    checkConsignee = false;
  }
  if (!checkConsignee) {
    return;
  }

  var param = "consigneeWithoutRegistParam.id=" + consignee_id + "&consigneeWithoutRegistParam.type=" + consignee_type + "&consigneeWithoutRegistParam.name="
      + consignee_name + "&consigneeWithoutRegistParam.provinceId=" + consignee_provinceId + "&consigneeWithoutRegistParam.cityId=" + consignee_cityId
      + "&consigneeWithoutRegistParam.countyId=" + consignee_countyId + "&consigneeWithoutRegistParam.townId=" + consignee_townId
      + "&consigneeWithoutRegistParam.address=" + consignee_address + "&consigneeWithoutRegistParam.mobile=" + consignee_mobile
      + "&consigneeWithoutRegistParam.email=" + consignee_email + "&consigneeWithoutRegistParam.phone=" + consignee_phone
      + "&consigneeWithoutRegistParam.provinceName=" + consignee_provinceName + "&consigneeWithoutRegistParam.cityName=" + consignee_cityName
      + "&consigneeWithoutRegistParam.countyName=" + consignee_countyName + "&consigneeWithoutRegistParam.townName=" + consignee_townName
      + "&consigneeWithoutRegistParam.isUpdateCommonAddress=" + isUpdateCommonAddress + "&consigneeWithoutRegistParam.code=" + mobileCode;

  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : OrderAppConfig.DynamicDomain + "/order/saveConsigneeWithoutRegist.action",
    data : param,
    cache : false,
    success : function(dataResult) {
      if (dataResult == null) {
        $("#mobileCode_div_success").hide();
        $("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
        $("#mobileCode_div_error").show();
        $("#mobileCode_div").addClass("message");
        return;
      }

      if (dataResult.success) {
        goOrder();
      } else {
        var errorMessage = dataResult.message;
        if (errorMessage.indexOf("已注册") > -1) {
          errorMessage = errorMessage + "，<a href='https://passport.jd.com/new/login.aspx?ReturnUrl=http%3A%2F%2Fcart.jd.com%2Fcart%2Fcart.html'>立即登录</a>";
          $("#call_div_error").html(errorMessage);
          $("#call_div_error").show();
          $("#call_div").addClass("message");
          //$("#sendMobileCodeBtn").attr("disabled", "");
          $("#sendMobileCodeBtn").removeAttr("disabled");
          return;
        }
        if (errorMessage.indexOf("验证失败") > -1) {
          $("#mobileCode_div_success").hide();
          $("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
          $("#mobileCode_div_error").show();
          $("#mobileCode_div").addClass("message");
          return;
        }
        //alert("系统繁忙，请稍后再试！");
      }
    },
    error : function(XMLHttpResponse) {
    }
  });
} window.save_ConsigneeWithoutRegister = save_ConsigneeWithoutRegister;

function getSkuListWithUuid() {
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : OrderAppConfig.DynamicDomain + "/order/getSkuList.action",
    data : "",
    cache : false,
    success : function(dataResult) {
      $("#span-skulist").html(dataResult);
      modifyNeedPay($("#totalFee").val());
    },
    error : function(XMLHttpResponse) {
    }
  });
}

/** ******************************免注册下单结束******************************** */

/**
 * 是否是实体礼品卡流程
 */
function isLipinkaPhysical() {
  var lpkVal = $("#flowType").val();
  if (lpkVal == "4") {
    return true;
  } else {
    return false;
  }
}
/**
 * 是否是汽车oto流程
 */
function isCarO2OFlow() {
  var carVal = $("#flowType").val();
  if (carVal == "21") {
    return true;
  } else {
    return false;
  }
}
/**
 * 是否是礼品购流程
 */
function isGiftBuy() {
  var giftBuyVal = $("#flowType").val();
  if (giftBuyVal == "2") {
    return true;
  } else {
    return false;
  }
}window.isGiftBuy=isGiftBuy;

/**
 * 是否货票分离
 */
function isShowInvoiceSeparate () {
	var isShowInvoiceSeparate = $("#showInvoiceSeparate").val();
	if (isShowInvoiceSeparate == "false") {
		return false;
	} else {
		return true;
	}
}window.isShowInvoiceSeparate=isShowInvoiceSeparate;

/**
 * 是否是礼品购流程
 */
function isLocBuy() {
  var locBuyVal = $("#flowType").val();
  if (locBuyVal == "1") {
    return true;
  } else {
    return false;
  }
}

/**
 * 加载礼品购的“是否隐藏价格”的checkBox,同时改变返回购物车的连接
 */
function loadGiftBuyHidePrice() {
  if (isGiftBuy()) {
    //cartUrl = "http://cart.gift.jd.com/cart/cart.html";
    $("#cartRetureUrl").attr("href", "http://cart.gift.jd.com/cart/cart.html");
    $("#cartRetureUrl").text("返回修改礼品购购物车");
    $("#giftBuyHidePriceDiv").show();
    $("#consigneeTitleDiv").text("收礼人信息");
  } else {
    //cartUrl = "http://cart.jd.com/cart/cart.html";
    $("#cartRetureUrl").attr("href", cartUrl);
    $("#cartRetureUrl").text("返回修改购物车");
    $("#giftBuyHidePriceDiv").hide();
    $("#consigneeTitleDiv").text("收货人信息");
  }
} window.loadGiftBuyHidePrice = loadGiftBuyHidePrice;

function addFlowTypeParam(params) {
  var flowType = $("#flowType").val();
  if (isEmpty(flowType)) {
    return params;
  } else {
    if (isEmpty(params)) {
      return "flowType=" + flowType;
    } else {
      return params + "&flowType=" + flowType;
    }
  }
}window.addFlowTypeParam=addFlowTypeParam;

// ------------------------------------------------------------页面出来后异步加载-----------------------------------------------------------
////获取优惠券信息
//if($("#isNewVertual").val() == "true"){
//  resetCoupontab();
//  query_coupons_vertual(true);
//}

if($("#useBestCoupons").val()=="1"){
	if(typeof $("#bestCouponCheck")[0] !=='undefined'){
		$("[id='bestCouponCheck']").attr("checked",'true');
		getBastCouponList($("#bestCouponCheck")[0]);
		showCouponItem(true);
	}
}else{
	//获取优惠券信息
	if($("#isNewVertual").val() == "true"){
	  resetCoupontab();
	  query_coupons_vertual(true);
	} 
}
try{
	if($("#isPresale").val() == "false"){
		if($(".payment-item[onlinepaytype=2]").length>0){
			log('ord', 'trade', '30',1);
		}else{
			log('ord', 'trade', '30',2);
		}
	}
}catch(e){
}

// 预售结算页 有message提示
if ($("#isPresale").val() == "true") {
  $("#order-submit").prop("class", "checkout-submit-disabled");
  if ($("#presaleStepPay").val() == "1") {
      $("#order-submit").prop("class", "checkout-submit btn-1");
  }
  $("#presaleEarnest").bind("click", function() {
    if ($("#presaleEarnest").prop("checked") == true) {
      $("#order-submit").prop("class", "checkout-submit btn-1");
    } else {
      $("#order-submit").prop("class", "checkout-submit-disabled");
    }
  });
}

$("#payment-list .payment-item").not(".payment-item-disabled").each(function() {
  $(this).bind("click", function() {
    if($("#paymentViewHideId").html()==null){
      $(".payment-item").removeClass("item-selected");
      $(this).addClass("item-selected");
    }
  });
});

subStrConsignee();

var isUnregister = $("#isUnregister").val();
// 如果不是免注册下单，调用异步服务
if (isUnregister || isUnregister == "true") {
  loadProvinces();
  getSkuListWithUuid();
} else {
	  //新流程
	  if(isNewReplacedFlow()){
		  if($(".replacedSkus").html().length>2){
			  if(!isBigItemChange()){
				  showChangedSam($(".replacedSkus").html());
			  }else{
				  samAndBigItemChangeArea();
			  }
		  }else{
			  if(isBigItemChange()){
				  bigItemChangeArea();
			  }
		  }
	  }else{
		  // 大家电换区
		  if (isBigItemChange() && !isHasSam()) {
		    bigItemChangeArea();
		  }
		  //山姆会员店换区
		  if(isHasSam() && !isBigItemChange()) {
		      //仅山姆旧流程
		    samChangeArea();
		  }
		  //包含山姆和大家电
		  if(isHasSam() && isBigItemChange()) {
		    samAndBigItemChangeArea();
		  }
	  }
   // 糖酒
   if (hasTang9()) {
	   tang9ChangeArea();
   }
  //isNewUser(); // 新用户展开地址
  loadOrderExt();
  //loadSkuListStock();
 if (!isLocBuy() && !checkIsNewUser()) {
     openConsignee();
     }
  // }// 异步不必加载收货人地址，无论新老用户
  if (!isLocBuy()) {
	insertEquipInfo();
    $('#reset_promise_311').val("0");
    copyFreightHtml();
    showOrHideFactoryShipCod();
    //showTangJiuSkuIcon();去除糖酒图标
    //异步调用,获取311、411、自提点等信息
    setResetFlag(0, '1');
    flushPlusInfo(1);
    flushCross(1);
    doAsynGetSkuPayAndShipInfo(0);    
    freshTips();
    freshUI();
    //doGetVendorName();
    // 加载验证码
    showCheckCode();
    obtainCopyInfoConfig();
    orderInfoTip();
  }else{
    freshTips();
  }
 

  $('#consignee-addr')
    .delegate('li','mouseenter',function(){
      $(this).addClass('li-hover');
    })
    .delegate('li','mouseleave',function(){
      $(this).removeClass('li-hover');
    });
  $('.consignee-scroll')
  .delegate('li','mouseenter',function(){
    $(this).addClass('li-hover');
  })
  .delegate('li','mouseleave',function(){
    $(this).removeClass('li-hover');
  });
  //如果是国际站，需要调用广告接口获取cookie jda、jdv
  if($("#flowType").val() == "10"){
    getOverseaPurchaseCookies();
  }
}

/**
 * 修改选中样式
 */
(function(win) {
  var RadioChecked = function(o) {
    this.obj = o.obj;
    this.init();
  };
  RadioChecked.prototype = {
    init : function() {
      this.bindEvent();
    },
    bindEvent : function() {
      var self = this;
      self.obj.find('.hookbox').bind('click', function() {
        self.obj.find('.item-selected').removeClass('item-selected');
        $(this).parents('.item').addClass('item-selected');
      });
    }
  };
  win.radioSelect = function(o) {
    new RadioChecked(o);
  };
}(window));

(function(win) {
  var PaymentBank = function(obj, fun) {
    this.obj = obj;
    this.fn = fun || function() {
    };
    this.init();
  };
  PaymentBank.prototype = {
    init : function() {
      this.bindEvent();
    },
    bindEvent : function() {
      var self = this, liNodes = self.obj.find('li');
      liNodes.bind('click', function() {
        liNodes.removeClass('selected');
        $(this).addClass('selected');
        self.fn($(this));
      });
    }
  };
  win.paymentBank = function(o, fn) {
    new PaymentBank(o, fn);
  };
}(this));

function changeCodDate(codDateOffset, isJdOrOther) {
  var bigItemInstallInfo = "";
  if (isJdOrOther || isJdOrOther == "true") {
    bigItemInstallInfo = $("#bigItemInstallDateInfoForJd").val();
  } else {
    bigItemInstallInfo = $("#bigItemInstallDateInfoForOtherShip").val();
  }
  if (!isEmpty(bigItemInstallInfo)) {
    var installDateMap = eval('(' + bigItemInstallInfo + ')');
    var installDateMapHtml = "<option value=\"-1\">请选择日期</option>";
    for ( var key in installDateMap) {
      if (key == codDateOffset) {
        var dateListStr = installDateMap[key] + "";
        var dateList = dateListStr.split(',');
        for (var i = 0; i < dateList.length; i++) {
          if (i == 0) {
            installDateMapHtml += "<option selected value='" + dateList[i].split('-')[1] + "'>" + dateList[i].split('-')[0] + "</option>";
          } else {
            installDateMapHtml += "<option value='" + dateList[i].split('-')[1] + "'>" + dateList[i].split('-')[0] + "</option>";
          }
        }
        break;
      }
    }
    installDateMapHtml += "<option value=\"-2\">暂缓安装</option>";
    if (isJdOrOther || isJdOrOther == "true") {
      $('#jd-bigItem-install-date').html(installDateMapHtml);
    } else {
      $('#other-bigItem-install-date').html(installDateMapHtml);
    }
    return;
  }

  if ($('#jd-bigItem-install-date').length > 0) {
    var actionUrl = OrderAppConfig.DynamicDomain + "/payAndShip/getInstallDateList.action";
    if (codDateOffset == -1) {
      $('#jd-bigItem-install-date').html('<option value="-1">请选择日期</option>');
    } else {
      var param = "selectedCodDateOffSet=" + codDateOffset;
      param = addFlowTypeParam(param);
      jQuery.ajax({
        type : "POST",
        url : actionUrl,
        data : param,
        cache : false,
        success : function(dataResult, textStatus) {
          $('#jd-bigItem-install-date').html(dataResult);
        },
        error : function(XMLHttpResponse) {
        }
      });
    }
  }
}
/**
 * 将payAndShip中的运费弹窗复制到orderInfo中，因为取数据是在payAndShip中，而弹窗必须放到orderInfo最下面，否则会串行
 * 
 * @return
 */

function copyFreightHtml() {
  var freightHtml = $("#payment-ship").find("#transportInPay").html();
  if (freightHtml != "") {
    $("#transport").html(freightHtml);
  }
}

function showOrHideFactoryShipCod() {
  if ($("#factoryShipCod").val() == "true") {
    $('#factoryShipCodShowDivBottom').css("display", "block");
  }
}

/**
 * 展示买家版与卖家版运费险
 * @param additResult getAdditShipment.action返回结果
 * @author baisong
 */
function showFreightInsurance(additResult) {
	// 返回结果为空的情况，直接返回
    if (additResult == null || additResult.freightInsureView == null
    		|| additResult.freightInsureView.venderInsuranceList == null
    		|| additResult.freightInsureView.venderInsuranceList.length == 0) {
	    return;
    }
    // 运费险列表（商家维度，包含买家版与卖家版）
    var venderInsuranceList = additResult.freightInsureView.venderInsuranceList;
    // 遍历
	for (var i = 0; i < venderInsuranceList.length; i++) {
		var venderInsurance = venderInsuranceList[i];
		// 商家ID
		var venderId = venderInsurance.venderId + "";
		// 卖家版运费险
		$(".yfx_div_remark").each(function() {
			if ($(this).attr("id") == venderId) {
				// 隐藏卖家版运费险
				$(this).parent().parent().hide();
				// type = 1 卖家版运费险
				if (1 == venderInsurance.type) {
					// 商家名称不为空
					if ( venderInsurance.venderName != null &&  venderInsurance.venderName != "undefined" ) {
						// 商家名称
						var showVenderName = venderInsurance.venderName;
						if (showVenderName.length > 16) {
							showVenderName = showVenderName.substring(0, 15) + "...";
						}
						if(2 === venderInsurance.insuranceType){
                            $(this).html(showVenderName + venderInsurance.insuranceCopy);
                            // 展示
                            $(this).parent().parent().show();
                        }
					}
					if(1===venderInsurance.insuranceType){
                        $(this).html(venderInsurance.insuranceCopy);
                        $(this).parent().find("span").html("退换无忧：");
                        $(this).parent().parent().show();
                    }

				}
			}
		});
		// 买家版运费险
		$("li.buyer_insurance").each(function() {
			if ($(this).attr("id") == venderId) {
				// 隐藏商品清单下的买家版运费险
				$(".service-item#vender_freight_insurance_" + $(this).attr("id")).hide();
				$(".service-item#vender_freight_insurance_" + $(this).attr("id")).parent().hide();
				$(this).css("display", "none");

				// type = 2 买家版运费险
				if (2 == venderInsurance.type) {
					if (venderInsurance.showFlag) {
					    // 自营的情况
						if (venderId == "0") {
							$(this).find("span.mode-label").html("退换无忧：");
						    $(this).find("span.fl").html("自签收后7天内退货，15天内换货，可享1次上门取件服务<i class=\"arrow-down\"></i>");
						    $(this).find("em.fr").html("￥" + venderInsurance.insuranceFee.toFixed(2));
						    $(this).find("span.mode-infor-tips").html("<i id=\"" + venderId + "\" class=\"d-arr d-arr-jd\"></i>自签收后7天内退货，15天内换货，可享1次上门取件服务，此服务不再单独收费。不在京东取件范围内可享受相应运费补偿。<a target=\"_blank\" href=\"//help.jd.com/user/issue/480-1693.html\">查看详情</a>");
						// POP的情况
						} else {
							$(this).find("span.mode-label").html("退换无忧：");
						    $(this).find("span.fl").html("自签收后7天内退货，15天内换货,可享1次运费赔付至京东小金库<i class=\"arrow-down\"></i>");
						    $(this).find("em.fr").html("￥" + venderInsurance.insuranceFee.toFixed(2));
						    $(this).find("span.mode-infor-tips").html("<i id=\"" + venderId + "\" class=\"d-arr d-arr-pop\"></i>自签收后7天内退货，15天内换货，按照赔付标准赔付一次退换货时产生的运费，赔付至京东小金库，最高可赔付25元/单。<a target=\"_blank\" href=\"//help.jd.com/user/issue/480-1694.html\">查看详情</a>");
						}
						// 根据接口返回值，确定是否勾选checkbox
						$(this).find("input").prop("checked", venderInsurance.checkedFlag);
						
						// 选中的情况
						if (venderInsurance.checkedFlag) {
							// 更新商品清单下的买家版运费险金额
							$(".service-item#vender_freight_insurance_" + venderId).find(".service-price").html("￥" + venderInsurance.insuranceFee.toFixed(2));
						} else {
							// 更新商品清单下的买家版运费险金额
							$(".service-item#vender_freight_insurance_" + venderId).find(".service-price").html("￥0.00");
						}
						// 无论是否选中，都展示左侧的勾选框与商品清单下的买家版运费险
						$(this).show();
						$(this).parent().show();
						$(this).css("display", "block");
						$(".service-item#vender_freight_insurance_" + venderId).show();
						$(".service-item#vender_freight_insurance_" + venderId).parent().show();
					}
				}
			}
		});
	}
}window.showFreightInsurance=showFreightInsurance;

function showFreight() {
  var obj = $("#freightSpan");
  if ($("#transport").html() != null) {
    $("#transport").css({
      position : "absolute",
      top : (obj.offset().top) + "px",
      left : (obj.offset().left - 345) + "px",
      display : "block"
    });
  }
}

function checkShowOpenPwd(showOpenPayPwd, existsJdbeanPromotion, checkJdbeanPromotion, shortPwdActive) {
  if (existsJdbeanPromotion == true) {
    if (showOpenPayPwd == false) {
       if(shortPwdActive == false){
	        $("#paypasswordPanel").html(html);
	        $("#paypasswordPanel").show();
	    }else{
	        $("#paypasswordPanel").show();
	    }
      if (checkJdbeanPromotion == false) {
        $("#submit_message").html("<span>京豆不足,不能使用京豆优惠购,点击<a href='//cart.jd.com/cart/cart.html?outBean=1'>返回购物车 </a></span> ").show();
      }
    } else {
      $("#submit_message").html(
          "<span>为保障您的账户资金安全，京豆暂时不可用，请先<a href='http://safe.jd.com/user/paymentpassword/safetyCenter.action' target='_blank'>开启支付密码 </a></span> ").show();
    }
  }
}

function operate_presaleMobile(thisObj) {
  if ($("#presaleMobile input").size() > 0) {// 点击保存
    var mobile = $("#presaleMobile input").val();
    if (testMobile(mobile) && mobile.indexOf("*") < 0 ) {
      $("#presaleMobile").html("<strong class=\"phone-num\" id=\"userMobileByPresale\" >" + mobile + "</strong></span>");
      $("#hiddenUserMobileByPresale").val(mobile);
      $(thisObj).html("修改");
      $("#cancelOperatePresaleMob").hide();
    } else {
      var html = "<input type=\"text\" class=\"itxt error-itxt\" maxlength=\"11\"><span class=\"error-msg\" style=\"color:red\">请输入正确的手机号</span></span>";
      $("#presaleMobile").html(html);
    }
  } else {// 点击修改
    $("#presaleMobile").html("<input type=\"text\"  class=\"itxt focus-itxt\" maxlength=\"11\"/>");
    $("#presaleMobile input").focus();
    $(thisObj).html("保存");
    if ($("#cancelOperatePresaleMob").size() > 0) {
      $("#cancelOperatePresaleMob").show();
    } else {
      var copm = $("<a href=\"#none\" class=\"a-link\" id=\"cancelOperatePresaleMob\">取消</a>");
      copm.bind("click", function() {
        $("#presaleMobile").html("<strong id=\"userMobileByPresale\" class=\"phone-num\">" + $("#hiddenUserMobileByPresale").val() + "</strong></span>");
        $("#cancelOperatePresaleMob").hide();
        $("#operatePresaleMobile").html("修改");
      });
      $(thisObj).after(copm).after("&nbsp;");
    }
  }
}
window.operate_presaleMobile = operate_presaleMobile;

function check_presaleMobile() {
  var mobile = "";
  if ($("#presaleMobile input").size() > 0) {
    mobile = $("#presaleMobile input").val();
  } else {
    mobile = $("#userMobileByPresale").html();
  }
  if (testMobile(mobile)) {
    return true;
  } else {
    return false;
  }
}

// 结算页手机号标准
function testMobile(mobile) {
  return check_mobile_new(mobile);
}

/**
 * 预售支付方式选择器
 * 
 * @param id
 */
function choosePresaleType(thisObj) {
  if ($(thisObj).prop("id") == "EarnestPayRadio") {
    $(".presaleEarnOnlyList").show();
    $("#presaleEarnOnlyInfo").show();
    $(".presaleAllPayList").hide();
    if ($("#presaleStepPay").val() == "4"){
      $("#step4Info").hide();
    }
    $(".presale-con .pay-chk").css("display", "block");
  } else {
    $(".presaleEarnOnlyList").hide();
    $("#presaleEarnOnlyInfo").hide();
    $(".presaleAllPayList").show();
    if ($("#presaleStepPay").val() == "4"){
      $("#step4Info").show();
    }
    //去掉同意支付定金checkbox
    $(".presale-con .pay-chk").css("display", "none");
    $("#presaleEarnest").attr("checked", true);
  }
  if ($("#presaleEarnest").prop("checked") == true) {
      $("#order-submit").prop("class", "checkout-submit btn-1");
  } else {
      $("#order-submit").prop("class", "checkout-submit-disabled");
  }
}window.choosePresaleType = choosePresaleType;
/**
 * 预售支付方式选择器
 * 
 * @param id
 */
function choosePresaleType2(thisObj) {
  if ($(thisObj).prop("id") == "EarnestPayRadio") {
    $(".presaleEarnOnlyList").show();
    $("#presaleEarnOnlyInfo").show();
    $(".presaleAllPayList").hide();
    $("#EarnestPayRadio").attr("class","presale-payment-item  item-selected");
    $("#AllPayRadio").attr("class","presale-payment-item");
    if ($("#presaleStepPay").val() == "4"){
      $("#step4Info").hide();
    }
    $(".presale-con .pay-chk").css("display", "inline");
    $("#presaleEarnest").attr("checked", false);
    $("#chooseAllPay").css("display", "none");
    $("#chooseEarnestPay").removeAttr("style");
    $("#chooseEarnestPay1").removeAttr("style");
    $("#pre-weikuan").removeAttr("style");
//    $("#chooseEarnestPay").css("display", "inline");
  } else {
    $(".presaleEarnOnlyList").hide();
    $("#presaleEarnOnlyInfo").hide();
    $(".presaleAllPayList").show();
    $("#EarnestPayRadio").attr("class","presale-payment-item");
    $("#AllPayRadio").attr("class","presale-payment-item item-selected");
    if ($("#presaleStepPay").val() == "4"){
      $("#step4Info").show();
    }
    $("#chooseEarnestPay").css("display", "none");
    $("#chooseEarnestPay1").css("display", "none");
    $("#pre-weikuan").css("display", "none");
    $("#chooseAllPay").css("display", "inline-block");
    //去掉同意支付定金checkbox
    $(".presale-con .pay-chk").css("display", "none");
    $("#presaleEarnest").attr("checked", true);
  }
  if ($("#presaleEarnest").prop("checked") == true) {
      $("#order-submit").prop("class", "checkout-submit btn-1");
  } else {
      $("#order-submit").prop("class", "checkout-submit-disabled");
  }
}window.choosePresaleType2 = choosePresaleType2;
/**
 * 异步请求获取唐久商品icon
 */
function showTangJiuSkuIcon() {
  var skuIdAndNums = $("#mainSkuIdAndNums").val();
  var areaIds = $("#hideAreaIds").val();
  if (isEmpty(skuIdAndNums) || isEmpty(areaIds)) {
    return;
  }
  var param = "areaIds=" + areaIds + "&skuIdAndNums=" + skuIdAndNums;
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    url : OrderAppConfig.AsyncDomain + "/showTangJiuSkuIcon.action",
    data : param,
    cache : false,
    dataType : "json",
    success : function(dataResult) {
      var skuicons = eval(dataResult);
      if (!skuicons || skuicons == 'false') {
        return;
      }
      for (var i = 0; i < skuicons.length; i++) {
        var arrIcons = skuicons[i].icons;
        if (arrIcons != null && arrIcons.length > 0) {
          for (var j = 0; j < arrIcons.length; j++) {
            if (arrIcons[j] == 1 || arrIcons[j] == "1") {
              if ($("#speedFreightNote").length > 0 && $("#speedFreightNote").html().length > 0) {
                $("#promise_" + skuicons[i].skuId).append("<a class='promisejsd' title='下单后或支付成功后2小时送达' href='javascript:void(0);'></a>");
              }
            } else if (arrIcons[j] == 2 || arrIcons[j] == "2") {
              $("#promise_" + skuicons[i].skuId).append("<a class='promisexsd' title='9:00-18:00下单，一小时内送达' href='javascript:void(0);'></a>");

            }

          }
        }
      }
    },
    error : function(XMLHttpResponse) {
    }
  });
}window.showTangJiuSkuIcon = showTangJiuSkuIcon;

/**
 * 使用兑换码兑换优惠券 Author:曹森 DateTime:2014/04/23 16:00
 * 
 * @param
 */
function exchangeCoupons(obj) {
  if ($('#couponKeyPressFirst').val() == "" || $('#couponKeyPressSecond').val() == "" || $('#couponKeyPressThrid').val() == ""
      || $('#couponKeyPressFourth').val() == "") {
    showMessageWarn("请输入优惠券兑换码！");
    return;
  }

  var param = "couponParam.fundsPwdType=Coupon";
  var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
  param = addFlowTypeParam(param);
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : url,
    data : param,
    async : true,
    cache : false,
    success : function(flag) {
      if (isUserNotLogin(flag)) {
        goToLogin();
        return;
      }
      if (flag) {
        var key = $("#couponKeyPressFirst").val() + $("#couponKeyPressSecond").val() + $("#couponKeyPressThrid").val() + $("#couponKeyPressFourth").val();
        $("input[id^='couponKeyPress']").each(function() {
          $(this).val("");
        });
        var param = "couponParam.couponKey=" + key;
        param = addFlowTypeParam(param);
        jQuery.ajax({
          type : "POST",
          dataType : "json",
          url : OrderAppConfig.AsyncDomain + "/coupon/exchangeCoupons.action",
          data : param,
          async : true,
          cache : false,
          success : function(result) {
            if (isUserNotLogin(result)) {
              goToLogin();
              return;
            }
            if (!result.resultFlag) {
              var message = result.message;
              showMessageError(message);
              if (obj.checked) {
                obj.checked = false;
              }
              return;
            }

            changeClassStyle(orderCouponId, toggleWrap);
            changeClassStyle(orderCouponItem, itemToggleActive);
            showMessageSucc(result.message);
            $("#" + orderCouponId).css('display', 'none');
            query_coupons();
            showEntityPanel();
          }
        });
      } else {
        showLargeMessage("支付密码未开启", "为保障您的账户资金安全，请先开启支付密码");
        return;
      }
    }
  });


  
}
window.exchangeCoupons = exchangeCoupons;

function shipmentToggle(th) {
  if ($(th).attr("id") == "jd-shipment") {// 选择京东配送
    $(th).parent().parent().addClass("item-selected");
    $("#pick-shipment").parent().parent().removeClass("item-selected");

    $("#jd-shipment-way-category").addClass("way-category-selected");
    $("#pick-shipment-way-category").removeClass("way-category-selected");

    $("#jd-show-sku-count").show();
    $("#jd-shipment-extend-info").show();

    if (!isEmpty($("#pick-shipment").val())) {
      $("#pick-shipment").attr("checked", false);
      $("#pick-show-sku-count").hide();
      $("#pick-shipment-extend-info").hide();
      $("#subway-sment").hide();
    }

  } else if ($(th).attr("id") == "pick-shipment") {// 选择自提
    $(th).parent().parent().addClass("item-selected");
    $("#pick-shipment-way-category").addClass("way-category-selected");

    if (!isEmpty($("#jd-shipment").val())) {
      $("#jd-shipment").parent().parent().removeClass("item-selected");
      $("#jd-shipment").attr("checked", false);
    }

    if (!isEmpty($("#other-shipment").val())) {
      $("#other-shipment").parent().parent().removeClass("item-selected");
      $("#other-shipment").attr("checked", false);
    }

    if (!isEmpty($("#jd-shipment-way-category").html())) {
      $("#jd-shipment-way-category").removeClass("way-category-selected");
    }

    if (!isEmpty($("#other-shipment-way-category").html())) {
      $("#other-shipment-way-category").removeClass("way-category-selected");
    }

    $("#pick-show-sku-count").show();
    $("#pick-shipment-extend-info").show();
    $("#subway-sment").show();
    if (!isEmpty($("#jd-shipment-extend-info").html()))
      $("#jd-shipment-extend-info").hide();
    if (!isEmpty($("#other-shipment-extend-info").html()))
      $("#other-shipment-extend-info").hide();

    if (!isEmpty($("#jd-show-sku-count").html()))
      $("#jd-show-sku-count").hide();
    if (!isEmpty($("#other-show-sku-count").html()))
      $("#other-show-sku-count").hide();

  } else if ($(th).attr("id") == "other-shipment") {// 选择京东三方配送
    $(th).parent().parent().addClass("item-selected");
    $("#pick-shipment").parent().parent().removeClass("item-selected");

    $("#other-shipment-way-category").addClass("way-category-selected");
    $("#pick-shipment-way-category").removeClass("way-category-selected");

    $("#other-shipment-extend-info").show();
    $("#other-show-sku-count").show();

    if (!isEmpty($("#pick-shipment").val())) {
      $("#pick-shipment").attr("checked", false);
      $("#pick-show-sku-count").hide();
      $("#pick-shipment-extend-info").hide();
      $("#subway-sment").hide();
    }

  }
}

/**
 * 异步请求获取loc商品门店信息
 */
function locShopInfo() {
  if(isLocBuy() || isCarO2OFlow()) {
	 return;
  }
  var locShopIdStr = $("#locShopIdStr").val();
  if (isEmpty(locShopIdStr)) {
    return;
  }
  
/*  $(".extra-item").each(function() {
      
      if ($(this).attr("id") == locShopIdStr) {
         $(this).html("<span>门店："+locShopIdStr+"</span>");
      }
    });*/
    
  var actionUrl = OrderAppConfig.AsyncDomain +"/payAndShip/getLocShopInfo.action";
  var param = "locShopIdStr=" + locShopIdStr;

  jQuery.ajax({
    type : "POST",
    url : actionUrl,
    data : param,
    cache : false,
    dataType : "json",
    success : function(dataResult, textStatus) {
        for ( var key in dataResult.locShopNameMap) {
          $(".extra-item").each(function() {
            
            if ($(this).attr("id") == key) {
                if (dataResult.locShopNameMap[key] != null && dataResult.locShopNameMap[key] != "undefined") {
                  if (dataResult.locShopNameMap[key].length > 16)
                    dataResult.locShopNameMap[key] = dataResult.locShopNameMap[key].substring(0, 15) + "";
                  	$(this).html("<span>门店："+dataResult.locShopNameMap[key]+"</span>");
                }
            }
          });
        }
      },
    error : function(XMLHttpResponse) {
    }
  });
}window.locShopInfo = locShopInfo;
/**
 * 获取商家名称
 */
function doGetVendorName(){
	
  var flowType = $("#flowType").val();
  
  if(flowType == "1" || flowType == "13"){
    return;
  }
  
  //因为异步获取的是pop商家名称，先把京东的赋值
  $(".vendor_name_yanbao").each(function() {
	  if($(this).attr("name") == 0 || $(this).attr("name") == "0"){
		  $(this).html("【京东自营】"); 
	  }
    });
  
  //end
  var actionUrl = OrderAppConfig.AsyncDomain +"/showFerightSopName.action";
  var param = "popVenderIdStr=" + $("#popVenderIdStr").val();
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
     var samVenderList = dataResult.samVenderList;
     for ( var key in dataResult.sopNameMap) {
        $(".vendor_name_h").each(function() {
          if ($(this).attr("id") == key) {
            if(key == 0){
              $(this).html("商家：京东全球购自营");
            }else{
              if (dataResult.sopNameMap[key] != null && dataResult.sopNameMap[key] != "undefined") {
                if (dataResult.sopNameMap[key].length > 16)
                  dataResult.sopNameMap[key] = dataResult.sopNameMap[key].substring(0, 15) + "";
                if(!$.isEmptyObject(samVenderList) && $.inArray(key, samVenderList)  != -1){//山姆店显示标示
                	$(this).html("商家："+'<em class="project-sam-icon project-sam-icon-b mr5"></em>' + dataResult.sopNameMap[key]);
                } else if (key == 663284 || key == 667688) {//沃尔玛店显示标识
                	$(this).html("商家："+'<em class="project-walmart-icon mr5"></em>' + dataResult.sopNameMap[key]);
                } else {
                	$(this).html("商家："+dataResult.sopNameMap[key]);
                }
              }
            }
          }
        });
      $(".vendor_name_freight").each(function() {
          if ($(this).attr("id") == key) {
            if (dataResult.sopNameMap[key] != null && dataResult.sopNameMap[key] != "undefined") {
              if (dataResult.sopNameMap[key].length > 16)
                dataResult.sopNameMap[key] = dataResult.sopNameMap[key].substring(0, 15) + "...";
                var sopName = $(this).html(); 
                if(sopName.indexOf("、") != -1)
                  $(this).html("、"+dataResult.sopNameMap[key]);
                else
                  $(this).html(dataResult.sopNameMap[key]);
            }
          }
        });
      
      $(".vendor_name_yanbao").each(function() {
    	 
    	  if($(this).attr("name") == 0 || $(this).attr("name") == "0"){
    		  $(this).html("【京东自营】"); 
    	  }else{
	          if ($(this).attr("name") == key) {
	              if (dataResult.sopNameMap[key] != null && dataResult.sopNameMap[key] != "undefined") {
	                if (dataResult.sopNameMap[key].length > 8){
	                  dataResult.sopNameMap[key] = dataResult.sopNameMap[key].substring(0, 7) + "...";
	                }
	                    $(this).html("【"+dataResult.sopNameMap[key]+"】");
	              }
	            }
    	  }
        });
      
        /*$(".yfx_div_remark").each(function() {
          if ($(this).attr("id") == key) {
            if (dataResult.sopNameMap[key] != null && dataResult.sopNameMap[key] != "undefined") {
              if (dataResult.sopNameMap[key].length > 16)
                dataResult.sopNameMap[key] = dataResult.sopNameMap[key].substring(0, 15) + "...";
              $(this).html(dataResult.sopNameMap[key] + "为您购买了运费险，最高赔付20.00元/单");
            }
          }
        });*/
      }
    },
    error : function(XMLHttpResponse) {
      //alert("系统繁忙，请稍后再试！");
    }
  });
}window.doGetVendorName=doGetVendorName;


function showPickDateList(){
  var isInvokePickDate = $("#is_invoke_pickdate").val();
  var pickId = $("#pick_sel_id").val();
  if(isInvokePickDate=="0"){
    return;
  }
  
  var param = "pickid="+pickId;
    param = addFlowTypeParam(param);
  // $(obj).parent().parent().css("class","item item-selected");
  //$(obj).parent().parent().addClass('item-selected').siblings().removeClass('item-selected');
  jQuery.ajax({
    type : "POST",
    dataType : "text",
    url : OrderAppConfig.AsyncDomain + "/payAndShip/getPickSiteDate.action",
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      var jsonO = eval("("+dataResult+")");  
      var pickDateHTML = "";
      for(var i=0;i<jsonO.length;i++){ 
        pickDateHTML = pickDateHTML+"<ul><li class='li_pick_shipment' date='"+jsonO[i].pickDate+"' picksite_date='"+jsonO[i].codDate+"' picksite_weekDay='"+jsonO[i].name+"' onclick='doSwithPickShipDate('',this)'>";
        pickDateHTML = pickDateHTML+  jsonO[i].codDate;
        pickDateHTML = pickDateHTML+  "<span class='data'>"+jsonO[i].name+"</span>";
        pickDateHTML = pickDateHTML+"</li></ul>";
      } 
      $("#pickSiteShipDate .date-box.date-list").html(pickDateHTML);
      $("#is_invoke_pickdate").val("0");
    },
    error : function(XMLHttpResponse) {
      //alert("系统繁忙，请稍后再试！");
      return false;
    }
  });
}window.showPickDateList=showPickDateList;

function showMessageSucc(c){
  showMessage(c,'succ');
}window.showMessageSucc=showMessageSucc;
function showMessageWarn(c){
  showMessage(c,'warn');
}window.showMessageWarn=showMessageWarn;
function showMessageError(c){
  showMessage(c,'error');
}window.showMessageError=showMessageError;

function showMessage(c,i){
  var showMessage = "<div class='tip-box icon-box'><span class="+i;
  showMessage = showMessage+"-icon m-icon'></span>";
  showMessage = showMessage+"<div class='item-fore'><h3 class='ftx-02'>"+c;
  showMessage = showMessage+"</h3></div><div class='op-btns ac'><a href='javascript:$.closeDialog();' class='btn-9'>确定</a></div></div>";
  $('body').dialog({
    title:'提示',
    width:320,
    height:120,
    type:'html',
    autoIframe:false,
    source:showMessage
  });
}window.showMessage=showMessage;

function showLargeMessage(title, largeMessage) {
  var showMessage = '<div class="tip-box icon-box"><span class="warn-icon m-icon"></span><div class="item-fore">'
      showMessage += '<h3>'+title+'</h3>'
      showMessage += '<div>'+largeMessage+'</div>'
      showMessage += '</div><div class="op-btns ac"><a href="javascript:$.closeDialog();" class="btn-9">关闭</a></div></div>';
  $('body').dialog({
    title:'提示',
    width:380,
    height:100,
    type:'html',
    autoIframe:false,
    source: showMessage
  });
}window.showLargeMessage = showLargeMessage;

function freshTips() {
  //页面tips展示
  var $el = $("#shipAndSkuInfo");
  $el.tips({
    trigger: '.qmark-tip',
    tipsClass: 'qmarkTip',
    mouseenterDelayTime: 300,
    autoResize:false,
    hasClose: false
  });
  // 京东大件商品tips
  $el.tips({
    trigger: '#jd-big-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdbigItem_surpportSku').html()
    sourceTrigger: '#jdbigItem_surpportSku'
  });
  // loc商品tips
  $el.tips({
    trigger: '#loc-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdbigItem_surpportSku').html()
    sourceTrigger: '#loc_surpportSku'
  });  
  // 京东非大件商品tips
  $el.tips({
    trigger: '#jd-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdbigItem_surpportSku').html()
    sourceTrigger: '#jdItem_surpportSku'
  });

  //显示京东第三方大家电列表
  $el.tips({
    trigger: '#jd-other-big-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdOtherbigItem_surpportSku').html()
    sourceTrigger: '#jdOtherbigItem_surpportSku'
  });

  //显示京东第三方中小件列表
  $el.tips({
    trigger: '#jd-other-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdOther_surpportSku').html()
    sourceTrigger: '#jdOther_surpportSku'
  });
  $el.tips({
    trigger: '#mainPaymentView-1',
    width: 260,
    type: 'click',
    // source:$('#mainPaymentViewHide').html()
    sourceTrigger: '#mainPaymentViewHide'
  });

  $el.tips({
    trigger: '#subPaymentView-1',
    width: 260,
    type: 'click',
    // source:$('#subPaymentViewHide').html()
    sourceTrigger: '#subPaymentViewHide'
  });
  $el.tips({
    trigger: '#pick_shipment_item',
    width: 260,
    type: 'click',
    // source: $("#noSupSkus_hideDiv").html()
    sourceTrigger: '#noSupSkus_hideDiv'
  });
  //展示价格说明
  $('#content').tips({
    trigger: '#price-desc',
    type:'click', 
    align:['top'],
    width: 180, 
    autoResize:true, 
    diff:6
  });
  //合并支付
  $('.checkout-submit-combine').tips({
      tipsClass: 'trade-ui-common-tips',
      type:'hover',
      align:['top'],
      width:270,
      autoResize:true,
      hasClose:true
  });
  //电子发票hover文案提醒UI
  $('.invoice-cont').tips({
    tipsClass: 'warn-tips',
    trigger: '.invoice-tips-icon',
    type: 'hover',
    hasClose: false,
    callback: function(el, tip){
        $(tip).offset({left: $(tip).offset().left - 10});
    }
  });
};
window.freshTips = freshTips;



function freshUI(){
  //初始化滑动状态
  $('.mode-tab-nav .mode-tab-item').hover(function() {
    $(this).addClass('hover');
  }, function() {
    $(this).removeClass('hover');
  });
}

function replaceStr(str,p1,p2){
  return (str == undefined || str == null || str == "")?"":str.replace(p1, p2);
}

//*******************************************************************地址和支付列表 Start ******************************
function paymentViewHide(){
  $('body').dialog({
      title:'请确认支付方式',
      width:620,
      height:320,
      type:'html',
      source:$("#paymentViewHide").html()
  });
}window.paymentViewHide=paymentViewHide;

function closeDialog(){
  $.closeDialog();
}window.closeDialog=closeDialog;

//删除收货人弹框
function deleteConsigneeDialog(id){
  $('body').dialog({
    title:'删除收货人信息',
    width:400,
    height:100,
    type:'html',
    source:'<div class="tip-box icon-box"><span class="warn-icon m-icon"></span><div class="item-fore"><h3>您确定要删除该收货地址吗？</h3></div><div class="op-btns ac"><a onclick="delete_Consignee('+id+')" href="#none" class="btn-9">确定</a><a href="javascript:$.closeDialog();" class="btn-9 ml10">取消</a></div></div>'
  });
}window.deleteConsigneeDialog=deleteConsigneeDialog;

//编辑收货人弹框
function openEditConsigneeDialog(id){
  var url = OrderAppConfig.DynamicDomain + "/consignee/editConsignee.action?consigneeId="+id;
  url = addFlowTypeParam(url); 
  $('body').dialog({
    title:'编辑收货人信息',
    width:690,
    height:430,
    type:'iframe',
    iframeTimestamp:false,
    source:url
  });
}window.openEditConsigneeDialog=openEditConsigneeDialog;


function openEditSelfPickConsigneeDialog(type){
	  var url = OrderAppConfig.DynamicDomain + "/consignee/editSelfPickConsignee.action";
	  var flowType = $("#flowType").val();
		if (isEmpty(flowType)) {
			url = url + "?consigneeParam.pickType="+type;
		} else {
			url=url+"?flowType="+flowType;
			url = url + "&consigneeParam.pickType="+type;
		}
	  url = addFlowTypeParam(url); 
	  
	  $('body').dialog({
	    title:'选择自提点',
	    width:556,
	    height:490,
	    type:'iframe',
	    iframeTimestamp:false,
	    source:url
	  });
	}window.openEditSelfPickConsigneeDialog=openEditSelfPickConsigneeDialog;

//	function openEditSelfPickConsigneeDialog(type){
//		  var url = OrderAppConfig.DynamicDomain + "/consignee/editSelfPickConsignee.action";
//		  var flowType = $("#flowType").val();
//			if (isEmpty(flowType)) {
//				url = url + "?consigneeParam.pickType="+type;
//			} else {
//				url=url+"?flowType="+flowType;
//				url = url + "&consigneeParam.pickType="+type;
//			}
//		  url = addFlowTypeParam(url); 
//		  
//		  $('body').dialog({
//		    title:'选择自提点',
//		    width:520,
//		    height:470,
//		    fixed: !0,
//		    type:'iframe',
//		    iframeTimestamp:false,
//		    source:url,
//		    onReady: function() {
//                seajs.use(["//misc.360buyimg.com/jdf/1.0.0/ui/switchable/1.0.0/switchable", "//misc.360buyimg.com/jdf/1.0.0/ui/area/1.0.0/area"], function() {
//                    $("#area_div").area({
//                        scopeLevel: 3
//                    })
//                })
//            }
//		  });
//		}window.openEditSelfPickConsigneeDialog=openEditSelfPickConsigneeDialog;
//	
	function openUseSelfPickConsigneeDialog(id){
		  var url = OrderAppConfig.DynamicDomain + "/consignee/useSelfPickConsignee.action";
		 	  
		  var flowType = $("#flowType").val();
			if (isEmpty(flowType)) {
			} else {
				url=url+"?flowType="+flowType;
			}
		  $('body').dialog({
		    title:'编辑自提点',
		    width:784,
		    height:530,
		    type:'iframe',
		    iframeTimestamp:false,
		    source:url
		  });
	}window.openUseSelfPickConsigneeDialog=openUseSelfPickConsigneeDialog;	
	
/**
 * 获取国际站cookies
 * 
 */
function getOverseaPurchaseCookies() {
  try {
    var actionUrl = "http://x.jd.com/clkinfo?rid="+Math.random()+"&callback=?";
    $.ajax({
      type : "post",
      dataType : "jsonp",
      url : actionUrl,
      jsonp : "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)  
        jsonpCallback :"jsonp",
      cache : false,
      success : function(dataResult) {
        $("#overseaPurchaseCookies").val(dataResult.data);
      },
      error : function(XMLHttpResponse) {
      }
    });
  } catch (err) {
  }
}window.getOverseaPurchaseCookies = getOverseaPurchaseCookies;

function restData() {
  // 新用户保存后将值写回
  $("#isOpenConsignee").val("0");
  $("#isRefreshArea").val("0");
  $("#beforePickRegionId").val("");
  $("#beforePickSelRegionid").val("");
  $("#beforePickSiteId").val("");
  $("#beforePickName").val("");
}

//延迟关闭loading
function delayRemoveLoading(id){
  if(!$(id)) {
    return;
  }
  setTimeout(function(){
    $(id).remove();
  }, 300);
}
//******************************************************************* 地址和支付列表 End  ******************************



function couponInfoTip(){
  $(".virtual-table-body").each(function(i) {
    if($(this).find(".virtual-desc").attr("title") != undefined){
      var desc = $(this).find(".virtual-desc").attr("title");
      var tempStr = "此限品类优惠券不能购买商品";
      var descI = desc.indexOf(tempStr);
      if(descI > -1){
        $(this).find(".virtual-desc").html("此限品类优惠券不能购买以下商品，<a id='couponInfoId"+i+"'>查看详情 </a>");
        var $el = $(".virtual-table");
        $el.tips({
            trigger: "#couponInfoId"+i,
            width: 260,
            type: 'click',
            source:desc.substring(tempStr.length)
            //sourceTrigger: '#'
        });
      }
    }
  });
}window.couponInfoTip=couponInfoTip;


function eInfoTip(){
  var desc = $(".gift-item.gift-grid .tip.mt5").html();
  if(desc) { // 增加js防护
    var tempStr1 = "说明：订单中商品";
    var tempStr2 = "，不可使用京东E卡，谢谢.";
    var tempStr3 = "";
    desc = desc.substring(tempStr1.length,desc.indexOf(tempStr2)).split(",");
    $(desc).each(function(i) {tempStr3 += desc[i] + "</br>";});
    $(".gift-item.gift-grid .tip.mt5").html("说明：以下订单中商品  <a id='eInfo'>查看详情 </a>"+tempStr2);
    var $el = $("#eCardId");
    $el.tips({
      trigger: "#eInfo",
      width: 580,
      type: 'click',
      source:tempStr3
    });
  }
}window.eInfoTip=eInfoTip;
function loadSkuList() {
  var actionUrl = OrderAppConfig.AsyncDomain + "/loadSkuList.action";
  var param = addFlowTypeParam();
   //不重置默认地址
    param+="&t=1";
  var regionId = $("#regionId").val();
  var shopId = $("#shopId").val();
  if(regionId){
    param += "&regionId=" + regionId;
  }
  if(shopId){
    param += "&shopId=" + shopId;
  }
  jQuery.ajax({
    type : "POST",
    dataType : "json",
    url : actionUrl,
    data : param,
    cache : false,
    success : function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      // 服务器返回异常处理,如果有消息div则放入,没有则弹出
      if (isHasMessage(dataResult)) {
        var message = getMessage(dataResult);
        alert(message);
      }
      if (dataResult.success) {
        if($("#flowType").val()=="1" || $("#flowType").val()=="13"){
          $("#skuListLoc").html(dataResult.skuList);
        }else{
          $("#span-skulist").html(dataResult.skuList);
        }
        loadSkuListStock();
        //showTangJiuSkuIcon();// 加载Icon
      }
    },
    error : function(XMLHttpResponse) {
    }
  });
}window.loadSkuList=loadSkuList;
//重新加载优惠券列表
function reloadCouponNew(reload, syncSign){
  if($("#isNewVertual").val() == "true"){
    if("block" != $("#orderCouponId").css("display") && reload){
      alert('由于您变更了收货地址，优惠券信息会被重置，请重新选择！');
    }
    resetCoupontab();
    query_coupons_vertual(syncSign);
  }else if($("#invokeNewCouponInterface").val() == "true"){
    if("block" != $("#orderCouponId").css("display") && reload){
    	alert('由于您变更了收货地址，优惠券信息会被重置，请重新选择！');
    }
    query_page_coupons($("#pageNum").val());
  }
}
window.reloadCouponNew = reloadCouponNew;
//重新加载优惠券列表
function reloadCoupon(reload){
  var display = $("#orderCouponId").css("display");
  var refreshOrderCouponId = false;
  if("block" == display){
    refreshOrderCouponId = true;
  }else{
    if(reload){
      refreshOrderCouponId = true;
      alert('由于您变更了收货地址，优惠券信息会被重置，请重新选择！');
    }
  }
  if(refreshOrderCouponId){
    $("#orderCouponId").css('display', 'none');
    query_coupons();
    isNeedPaymentPassword();
  }
}
window.reloadCoupon = reloadCoupon;
//处理无货弹层
var g_outSkus;
var g_noStockType;
function doOutSku(outSkus, noStockType,address){
  g_outSkus = outSkus;
  g_noStockType = noStockType;
  var outSkuArr = outSkus.split(",");
  if(noStockType == "600158"){
    //处理全部无货的情况
    try{
      var firstSku = g_outSkus.split(",")[0];
        someMoreRecommend(firstSku,'619028','trade-nostock-recommendation-render', function(hasData){
          if(!hasData){
            someMoreRecommend(firstSku,'108002','trade-nostock-recommendation-render', function(hasData2){
              if(!hasData2){
                goCart();
              }else{
                openWinForAllOutSku(670, 300, "nostock-box02");
              }
            });
          }else{
            openWinForAllOutSku(670, 300, "nostock-box02");
          }
        });
    } catch (e) {
      goCart();
    }
  }else if(noStockType == "600157"){
    //处理部分无货的情况
    try{
    	 var actionUrl="//skunotify.jd.com/order/isSupportOrderBatchSku.action?skus="+outSkuArr;
    	 $.ajax({
    	      type : "get",
    	      dataType : "jsonp",
    	      async: false,  
    	      url : actionUrl,
    	      cache : false,
    	      success : function(json) {
    	    	  var resultflag = json.resultCode;
    	    	  var ckArray = new Array();
    	    	  //返回1 调用接口成功
    	    	 if(resultflag==1){
    	    		 //根据返回的msg，将支持无货待下单的商品放到ckArray中
    	    		 var skuIds = JSON.parse(json.msg);
	       	    	  for(var p in skuIds){
	       	    	      if(skuIds[p]){
	       	    	    	  ckArray.push(p);
	       	    	      }
	       	    	  } 
    	    	 }
    	    	  var appendHtml = fillSkuList(outSkuArr,ckArray,address);
    	          if(appendHtml){
    	        	log('gz_ord', 'gz_proc', 16, 'lzwhdxdtc');
    	            openWinForOutSku(668, 450, "nostock-box03", "out-skus", appendHtml);
    	          }else{
    	            goCart();
    	          }
    	      },
    	      error : function(XMLHttpResponse) {
    	    	  var appendHtml = fillSkuList(outSkuArr,"",address);
    	          if(appendHtml){
    	            openWinForOutSku(668, 450, "nostock-box03", "out-skus", appendHtml);
    	          }else{
    	            goCart();
    	          }
    	      }
    	    });
     
    }catch (e){
      goCart();
    }
  }
}window.doOutSku = doOutSku;
//填充无货弹层中的商品信息
function fillSkuList(outSkuArr,ckArray,address){
  var allGoodsObj = cloneGoodsObj();
  var goodsObj = null;
  var isNoStock = false;
  var tel = address.mobile.substring(0,3)+"****"+ address.mobile.substring(7,11);
  var areaId = address.provinceId +"-" +address.cityId +"-" +address.countyId +"-" + address.townId;
  for(var i = 0; i < allGoodsObj.length; i++){
    var goodsItem = allGoodsObj[i];
    for(var h = 0; h < goodsItem.skuList.length; h++){
      isNoStock = false;
      goodsObj = goodsItem.skuList[h];
      for(var j = 0; j < outSkuArr.length; j++){
        if(goodsObj.skuId == outSkuArr[j]){
          goodsObj.noStock = true;
          isNoStock = true;
          
          for(var k = 0; k < ckArray.length; k++){
        	 if(goodsObj.skuId == ckArray[k]){
        	  goodsObj.ckflag = true;
        	  break;
        	 }
          }
        }
        if(goodsObj.gifts.length > 0){
          var giftObj = null;
          for(var k = 0; k < goodsObj.gifts.length; k++){
            giftObj = goodsObj.gifts[k];
            if(giftObj.skuId == outSkuArr[j]){
              giftObj.noStock = true;
              isNoStock = true;
            }
          }
        }
      }
      if(isNoStock){
        if(goodsItem.productType == "suit"){
          goodsItem.noStock = true;
        }
      }
    }
  }
  var goodsHtmls = "<input type='hidden' id='mobile' value='"+address.mobile+"'/>"
  				 + "<input type='hidden' id='tel' value='"+tel+"'/>"
                 + "<input type='hidden' id='pin' value='"+address.pin+"'/>"
                 + "<input type='hidden' id='addressDetail' value='"+address.addressDetail+"'/>"
                 + "<input type='hidden' id='areaId' value='"+areaId+"'/>"
                 + "<input type='hidden' id='fullAddress' value='"+address.fullAddress+"'/>"
                 + "<input type='hidden' id='receiver' value='"+address.name+"'/>";
  
  for(var i = 0; i < allGoodsObj.length; i++){
    var goodsItem = allGoodsObj[i];
    var goodsHtml = buildHtmlEle(goodsItem);
    goodsHtmls += goodsHtml;
  }
  return goodsHtmls;
}
//根据获取到的商品对象构建html元素
function buildHtmlEle(goodsObj){
  var goodHtml = "";
  for(var i=0; i < goodsObj.skuList.length; i++){
    goodHtml += buildItemHtml(goodsObj.skuList[i]);
  }
  if(goodsObj.productType == "suit"){
	  goodHtml = "<div class='goods-extra'>"
	        +         (goodsObj.suitName ? goodsObj.suitName : '')
	        +     "</div>"
	        +            goodHtml
	        +      "</div>";
  }
  return goodHtml;
}
function buildItemHtml(goodsObj){
  var goodsItem ="<div class='goods-item"  + (goodsObj.noStock ? " nostock-item" : "") + "'>"
        +      "<div class='goods-msg'><div class='p-img'>"
        +         "<a href='"+goodsObj.hrefUrl+"' target='_blank'><img src='" + goodsObj.skuImg + "' alt=''></a>"
        +      "</div>"
        +      "<div class='goods-msg-gel'>"
        +      "<div class='p-name'>";

    if(goodsObj.sxType && goodsObj.sxType == 1){
        goodsItem += "<em class='fresh-icon mr5'></em>"
    }
    goodsItem += " <a href='"+goodsObj.hrefUrl+"' target='_blank'>" + goodsObj.skuName + "</a><strong class='jd-price'>"+goodsObj.price+"</strong></div>"
        +      "<div class='p-num'>"+goodsObj.num+"</div>"
        +      "<div class='p-stock'>" + (goodsObj.noStock ? "<span class='ftx-01'>无货 </span>": "<span class='ftx-06'>有货 </span>") + "</div>"
        +      (goodsObj.ckflag ?"<div class='subs-trade' data-tips='商品到货时，系统自动为你抢单（秒杀、抢购商品除外）'> <input type='checkbox' onclick='javascript:outStoreOrder();' name='subs-trade' id='subs-trade"+goodsObj.skuId+"' data-id='"+goodsObj.skuId+"'><label class='J_subs_label' for='subs-trade"+goodsObj.skuId+"'>到货代下单</label></div>":"")
        +      "</div>"
        +      "</div>"
        +      "<div class='clr'></div>";
       
  if(goodsObj.gifts.length > 0){
    var giftsHtml = "<div class='gift-items'>";
    for(var i= 0; i < goodsObj.gifts.length; i++){
      var giftName = goodsObj.gifts[i].skuInfo;
      var giftHtml = "<div class='gift-item" + (goodsObj.gifts[i].noStock ? " nostock-item" : "") + "'>"
          +            "<div class='gift-name'>"
          +                 "<p>" + giftName + "</p>"
          +             "</div><div class='p-num'>"+goodsObj.num+"</div>"
          +             "<div class='p-stock'>" + (goodsObj.gifts[i].noStock ? "<span class='ftx-01'>无货</span>" : "<span class='ftx-06'>有货</span>") + "</div>"
          +       "</div>";
      giftsHtml += giftHtml;    
    }
    goodsItem += giftsHtml+"</div>";
  }
  goodsItem += "</div>";
  return goodsItem;
}
function cloneGoodsObj(){
  var goodsObjs = new Array();
  var goodsListEle = $("#skuPayAndShipment-cont  div[class^='goods-list']");
  for(var i = 0; i < goodsListEle.length; i++){
    var goodsItems = $(goodsListEle[i]).find("div[class^='goods-items']");
    for(var j = 0; j < goodsItems.length; j++){
      var goodsItem = $(goodsItems[j]);
      var goodsSuits = goodsItem.children("div[class^='goods-suit']");
      var goodsList = null;
      var goodsObj = {};
      if(goodsSuits.length > 0){
        //处理套装
        goodsObj.productType = "suit";
        var goodsSuitTit = $(goodsSuits[0]).find("div[class^='goods-suit-tit']");
        if(goodsSuitTit.length > 0){
          var suitTip = "";
          var goodsSuitTitEle = $(goodsSuitTit[0]);
          var suitType = goodsSuitTitEle.find("span[class^='sales-icon']");
          if(suitType.length <= 0){
            suitType = goodsSuitTitEle.find("span[class^='coop-cut-i']");
          }
          if(suitType.length > 0){
              suitTip += "<span class='full-icon ml20'>" + $(suitType[0]).html() + "<b></b></span>";
            }
          var suitName = goodsSuitTitEle.find("strong");
          if(suitName.length > 0){
            suitTip += "<span class='full-price ml10'>"+$(suitName[0]).html()+"</span>";
          }
          var back = goodsSuitTitEle.find("span[class^='ml20']");
          if(back.length > 0){
        	  suitTip += "<span class='full-recash ml10'>"+  $(back[0]).text()+"</span>";
          }
          goodsObj.suitName = suitTip;
        }
        goodsList = $(goodsSuits[0]).find("div[class^='goods-item']");
      }else{
        //处理单品
        goodsObj.productType = "item";
        goodsList = goodsItem.find("div[class^='goods-item']");
      }
      if(goodsList.length > 0){
        var cloneObjs = cloneProducts(goodsList);
        goodsObj.skuList = cloneObjs;
        goodsObjs.push(goodsObj);
      }
    }
  }
  return goodsObjs;
}window.cloneGoodsObj = cloneGoodsObj;
function cloneProducts(goodsEles){
  var goodsObjs = new Array();
  for(var i = 0; i < goodsEles.length; i++){
    var goodsEle = $(goodsEles[i]);
    var goodsObj = {};
    goodsObj.skuId = goodsEle.attr("goods-id");
    goodsObj.sxType = goodsEle.attr("sx-type");
    var skuImg = goodsEle.find("div[class='p-img'] img").first().attr("src");
    var skuName = goodsEle.find("div[class='p-name'] a").first().html();
    var hrefUrl = goodsEle.find("div[class='p-name'] a").first().attr("href");
    var price = goodsEle.find("strong[class='jd-price']").first().html();
    var num = goodsEle.find("span[class='p-num']").first().html();
    goodsObj.skuImg = skuImg;
    goodsObj.skuName = skuName;
    goodsObj.hrefUrl = hrefUrl;
    goodsObj.price = price;
    goodsObj.num = num;
    var gifts = goodsEle.find("div[class^='gift-item']");
    var giftArr = new Array();
    var gift;
    for(var j = 0; j < gifts.length; j++){
      gift = $(gifts[j]);
      var skuId = gift.attr("gift-id");
      var skuInfo = gift.find("p").first().html();
      giftArr.push({"skuId" :  skuId, "skuInfo" : skuInfo});
    }
    goodsObj.gifts = giftArr;
    goodsObjs.push(goodsObj);
  }
  return goodsObjs;
}window.cloneProducts = cloneProducts;
function cloneDetailAddr(){
	  var detailAddrObjs = new Array();
	  var addrObj = {};
	     
	  var name = $("#receiver").val();
	  var addrInfo = $("#fullAddress").val();
	  var addrTel = $("#tel").val();
	  addrObj.name = name;
	  addrObj.addrInfo = addrInfo;
      addrObj.addrTel = addrTel;
      detailAddrObjs.push(addrObj);
	  
	  return detailAddrObjs;
}window.cloneDetailAddr = cloneDetailAddr;

//无货代下单复选框点击事件
function outStoreOrder(){
	//1、获取设置了无货待下单的skuId
	var skuIds = chkVal();
	//2、无货待下单的skuId不为空，则显示收货人信息；为空则隐藏收货人信息
	if (!isEmpty(skuIds)){
		//2.1如果收货人信息div是隐藏状态则显示，是显示状态则不处理
		var displayFlag = $("#detailAddr").is(":hidden");
		if(displayFlag){
			
			//2.2获取收货人信息
			var detailAddr = cloneDetailAddr();
			//2.3获取收货人信息失败
			if(detailAddr.length!=1){
				alert("获取收件人地址失败，请设置默认收件人！");
				return;
			}else{
				//2.4获取收货人信息成功，并设置信息
				var addrEle = $(detailAddr[0]);
				$("#name").html(addrEle[0].name);
				$("#addrInfo").html(addrEle[0].addrInfo);
				$("#addrTel").html(addrEle[0].addrTel);
			}
			
			$("#detailAddr").show();
		}
		
	}else{
		//3、无货待下单的skuId为空，隐藏收货人信息
		$("#detailAddr").hide();
	}
	 
}window.outStoreOrder = outStoreOrder;

//获取选中复选框的值，拼接成用“，”号分割的字符串
function chkVal(){
	var result = new Array();
	var skuIds = ""; 
	$("input[name = subs-trade]:checkbox").each(function () {
        if ($(this).is(":checked")) {
            result.push($(this).data('id'));
        }
    });
	skuIds = result.join(",");
	return skuIds;  
}window.chkVal = chkVal;
//打开无货弹层
function openWinForAllOutSku(width, height, sourceId){
  var appendHtml = $("#trade-nostock-recommendation-render").html();
  if(appendHtml){
    openWinForOutSku(width, height, sourceId, "trade-nostock-recommendation", appendHtml);
    $("#trade-nostock-recommendation-render").html("");
  }else{
    goCart();
  }
  
}window.openWinForAllOutSku = openWinForAllOutSku;
function openWinForOutSku(width, height, sourceId, targetEle, appendHtml){
  var sourceHtml = $("#" + sourceId).html();
    $("body").dialog({
        title: "提示",
        width: width,
        height: height,
        type: "html",
        source: sourceHtml,
        onReady:function(){
          $(".ui-dialog-close").hide();
          $("#" + targetEle).html(appendHtml);
          $(".subs-trade").tips({ 
              type: 'hover',
              hasClose: false,
              tipsClass: 'nostock-subs-tips',
              zIndex: 100001
          });
          $('.J_subs_label').bind('click', function(){
        	    if(!$(this).prev().is(':checked')){
        	        $(this).closest('.goods-item').removeClass('nostock-item');
        	    } else {
        	        $(this).closest('.goods-item').addClass('nostock-item');
        	    }
        	});
          
          $('input[name="subs-trade"]').bind('click', function(){
              if($(this).is(':checked')){
                  $(this).closest('.goods-item').removeClass('nostock-item');
              } else {
                  $(this).closest('.goods-item').addClass('nostock-item');
              }
          });

        }
    });
}window.openWinForOutSku = openWinForOutSku;
//无货代下单弹层后处理继续购物
function continueBuy(){
  log('gz_ord', 'gz_proc', 6, 'bfwhjxjs');
  var pin = $("#pin").val();
  var areaId =$("#areaId").val();
  var mobile = $("#mobile").val();
  var skuIds = chkVal();
  var name = $("#receiver").val();
  var fullAddress = $("#fullAddress").val();
  if(isEmpty(skuIds)){
	  goOrder();
  }else{
	    log('gz_ord', 'gz_proc', 17, 'lzwhdxdqd');
	    var url = "//skunotify.jd.com/storeOrderSubMvc/storeSubBatchSku.action";
	    var param = {"pin":pin,"receiverInfo.receiver":encodeURI(name),"receiverInfo.address":encodeURI(fullAddress),"receiverInfo.receicerPhoneNo":mobile,
	    	"validTime":"THREE_MONTH","receiverInfo.area":areaId,"skuArray":skuIds,"subChannel":1
	    };
	    jQuery.ajax({
	      type : "POST",
	      dataType : "jsonp",
	      data : param,
	      url : url,
	      cache : false,
	      success : function(result) {
	        if(result.resultCode==1){
	        	openWinForOutSku(500,300,"nostock-success","","");
	        }else{
	        	openWinForOutSku(500,300,"nostock-failed","","");
	        }
	      },
	      error : function(error) {
	    	openWinForOutSku(500,300,"nostock-failed","","");
	        goCart();
	      }
	    });
  }
    
}window.continueBuy = continueBuy;
/**
*运费弹窗
*/
function freightTips(){
  var $el = $("#container");
  $el.tips({
        tipsClass: "summary-freight-tips-box",
        trigger: ".freight-icon",
        align: ['top','right'],
        width: 330,
        type: 'hover',
        zIndex: '1001',
        hasClose: false,
        sourceTrigger: '#tooltip-box06',
        callback: function(trigger, obj){
        	$('.sfb-item-goods').switchable({
                type:'focus', 
                bodyClass:'ui-switchable-panel-body',
                contentClass:'ui-switchable-panel-main',
                mainClass:'ui-switchable-panel',
                mainSelectedClass:'curr',
                prevClass:'sfb-prev',
                nextClass:'sfb-next',
                hasPage:true, 
                autoPlay:false
            });
            $(obj).css('left', ($(obj).offset().left - 3)+'px');
        }
      });
}window.freightTips=freightTips;
freightTips();

/**
*运费弹窗
*/
function crossRegionalFee(){
  var $el = $("#container");
  $el.tips({
        tipsClass: "summary-freight-tips-box",
        trigger: ".freight-icon.crossRegionalFee",
        align: ['top','right'],
        width: 330,
        type: 'hover',
        zIndex: '1001',
        hasClose: false,
        sourceTrigger: '#tooltip-box10',
        callback: function(trigger, obj){
        	$('.sfb-item-goods').switchable({
                type:'focus', 
                bodyClass:'ui-switchable-panel-body',
                contentClass:'ui-switchable-panel-main',
                mainClass:'ui-switchable-panel',
                mainSelectedClass:'curr',
                prevClass:'sfb-prev',
                nextClass:'sfb-next',
                hasPage:true, 
                autoPlay:false
            });
            $(obj).css('left', ($(obj).offset().left - 3)+'px');
        }
      });
}window.crossRegionalFee=crossRegionalFee;
crossRegionalFee();

/**
*plus弹窗
*/
function plusTips(){
  var $el = $("#container");
  $el.tips({
	    tipsClass: "plus-box",
	    trigger: ".plus-tips",
	    align: ["top", "right"],
	    width: 310,
	    type: "hover",
	    zIndex: "1001",
	    hasClose: !1,
	    sourceTrigger: "#tooltip-box09"
	});
}window.plusTips=plusTips;
plusTips();

//虚拟tab资产切换
$(".order-virtual").switchable({
  navItem:'ui-switchable-item',
  navSelectedClass:'curr',
  mainClass:'ui-switchable-panel',
  event: 'click',
  delay: 0
  //callback: showScrollVirtual
});

});////FE 模块加载 end

/**
 * 跨店铺满减点击 详情 更改背景色
 * @param promotionID 促销ID
 */
function changeBackGround(promotionID){
  if(!$("."+promotionID).hasClass("coop-cut-goods")){
    $(".coop-cut-goods").removeClass("coop-cut-goods");
    $("."+promotionID).addClass("coop-cut-goods");
  }else{
    $(".coop-cut-goods").removeClass("coop-cut-goods");
  }
}
preSaleShow();
function preSaleShow(){
	if($("#presale-type35").length>0){
		var skuId=$("#presale-type35").attr("name");
		var type=35;
		callYuShouByJsonp(type,skuId);
	}else if($("#chooseEarnestPay").length>0){
		var skuId=$("#chooseEarnestPay").attr("name"); 
		var type=24;
		callYuShouByJsonp(type,skuId);
	} 
}

/**
 * 判断用户是否登录【此方法别动】
 */
function isUserNotLogin_LOC(data) {
  if (data.error == "NotLogin") {
    return true;
  } else {
    try {
      var obj = eval("(" + data + ")");
      if (obj != null && obj.error != null && obj.error == "NotLogin") {
        return true;
      }
    } catch (e) {
    }
  }
  return false;
};
/**
 * 判断服务是否返回有消息【此方法别动】
 *
 * @param data
 * @returns {Boolean}
 */
function isHasMessage_LOC(data) {
  if (data.errorMessage) {
    return true;
  } else {
    try {
      if (data != null && data.indexOf("\"errorMessage\":") > -1) {
        var mesageObject = eval("(" + data + ")");
        if (mesageObject != null && mesageObject.errorMessage != null) {
          return true;
        }
      }
    } catch (e) {}
  }
  return false;
};


/**
* 编辑门店
* 
* @param type
*/
function edit_LocShopping(type) {
if(isEmpty(type)){
	type=$("#cur_payid").val();
}
openEditLocShopingDialog(type);
}window.edit_LocShopping=edit_LocShopping;
//编辑门店弹框
function openEditLocShopingDialog(type){
var url = OrderAppConfig.DynamicDomain + "/payAndShip/getLocShipment.action?paymentId="+type+"&"+getFlowType();
$('body').dialog({
	title:'编辑门店信息',
	width:780,
	height:400,
	type:'iframe',
	iframeTimestamp:false,
	autoIframe:false,
	source:url
});
}window.openEditLocShopingDialog=openEditLocShopingDialog;
//暂存已选
function save_newPay(payId) {
	if(payId){
		$('#cur_payid').val(payId);
	}
}window.save_newPay=save_newPay;

function isLocOrFactory() {
	if ($("#flowType").val() == "13"){
		return OrderAppConfig.Protocol + "trade.jd.com/order/getFactoryLocOrderInfo.action?rid=" + Math.random();
	}
	else if($("#flowType").val() == "21"){
		return OrderAppConfig.Protocol + "trade.jd.com/shopping/order/getCarO2OOrderInfo.action?rid=" + Math.random();
	}
	return OrderAppConfig.Protocol + "trade.jd.com/order/getLocOrderInfo.action?rid=" + Math.random();
} window.isLocOrFactory = isLocOrFactory;

function getFlowType(){
	return "flowType="+$("#flowType").val();
} window.getFlowType=getFlowType;

function callYuShouByJsonp(type,skuId) {
//http://yushou.jd.com/youshouinfo.action?sku=1229987&callback=jQuery7288465&_=1444555665528
			 var actionUrl = "//yushou.jd.com/youshouinfo.action?sku="+skuId+"&callback=?";
			    $.ajax({
			      type : "post",
			      dataType : "jsonp",
			      url : actionUrl,
			      jsonp : "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)  
			      jsonpCallback :"jsonp",
			      cache : false,
			      success : function(dataResult) {
	    			  if ($("#AllPayRadio").attr("class") == "presale-payment-item item-selected") {
	    				    $("#chooseEarnestPay").css("display", "none");
	    				    $("#chooseAllPay").css("display", "inline-block");
	  			    	  if (dataResult.ret.expAmount == undefined || dataResult.ret.expAmount == null || dataResult.ret.expAmount == "" || dataResult.ret.expAmount == 0) {
				    		  return;
				    	  }else{
				    		  if(type==35){
				    			  $('#pre-state').after('<span id="pre-weikuan" class="presale-promotion">尾款已优惠'+dataResult.ret.expAmount+'元</span>');
                                  $(".p-weight").addClass("p-weight-presale");
				    		  }else if(type==24){
				    			  $('#pre-state').after('<span id="pre-weikuan" class="presale-promotion">尾款已优惠'+dataResult.ret.expAmount+'元</span>');
                                  $(".p-weight").addClass("p-weight-presale");
				    		  }
				    	  }
	    				    $("#pre-weikuan").css("display", "none");
	    				    return;
	    			  }
			    	  if (dataResult.ret.expAmount == undefined || dataResult.ret.expAmount == null || dataResult.ret.expAmount == "" || dataResult.ret.expAmount == 0) {
			    		  return;
			    	  }else{
			    		  if(type==35){
			    			  $('#pre-state').after('<span id="pre-weikuan" class="presale-promotion">尾款已优惠'+dataResult.ret.expAmount+'元</span>');
                              $(".p-weight").addClass("p-weight-presale");
			    			 // $('#presale-type35').append('<span class="presale-promotion">尾款已优惠'+dataResult.ret.expAmount+'元</span>'); 
			    		  //alert(dataResult.ret.jdPrice);
			    		  }else if(type==24){
			    			  $('#pre-state').after('<span id="pre-weikuan" class="presale-promotion">尾款已优惠'+dataResult.ret.expAmount+'元</span>');
                              $(".p-weight").addClass("p-weight-presale");
			    			  //$('#pre-weikuan').append('<span class="presale-promotion">尾款已优惠'+dataResult.ret.expAmount+'元</span>');
			    		  //alert(dataResult.ret.jdPrice);
			    		  }
			    	  }
			       // $("#overseaPurchaseCookies").val(dataResult.data);
			      },
			      error : function(XMLHttpResponse) {
			      }
			    });
	}

/**
 * 是否获取设备信息
 * @returns {Boolean}
 */
function getEquipInfo() {
 var getEquipInfo = $("#getEquipInfo").val();
 if (getEquipInfo == "true") {
   return true;
 } else {
   return false;
 }
}
function insertEquipInfo(){
	if(getEquipInfo()){
		try{
			getJdEid(function(eid,fp){
				$("#eid").val(eid);
				$("#fp").val(fp);
			});
		}catch(e){
		}	
	}
}
$("#txt_paypassword").keyup(function(){
	$(".pay-pwd-error").hide();
});
/**
 * 选择/取消选择买家版运费险
 * @param venderId 商家ID
 * @param thisElement 当前元素
 * @author baisong
 */
function selectBuyerFreightInsurance(thisElement, venderId) {
    // 选择器
    var selector = ".buyer_freight_insurance#vender_" + venderId;
    // 操作之后状态
    var postStatus = $(thisElement).prop("checked");
    // 操作之前状态
    var preStatus = !postStatus;
	
    // 准备参数
    var param = "venderId=" + venderId + "&checkedFlag=" + postStatus;
    param = addFlowTypeParam(param);
    
    jQuery.ajax({
        type : "POST",
        url : OrderAppConfig.AsyncDomain + "/selectBuyerFreightInsure.action",
        data : param,
        cache : false,
        dataType : "json",
        success : function(dataResult) {
            // 没有登录跳登录
            if (isUserNotLogin(dataResult)) {
                goToLogin();
                return;
            }
            // 服务器返回异常处理，不做操作，直接返回
            if (isHasMessage(dataResult) || dataResult == "null" || dataResult == null || dataResult == "") {
            	// 恢复为勾选前状态
            	$(selector).prop("checked", preStatus);
                return;
            // 调用成功的情况
            } else {
                $(selector).prop("checked", postStatus);
                // 调用getAdd
                doAsynGetSkuPayAndShipInfo(3);
            }
        },
        error : function(XMLHttpResponse) {
            initResetFlag();
            // 刷新结算页面
            goOrder();
        }
    });
}
function modifyNeedPay(price){
	$("#sumPayPriceId").text("￥" + price);
	if($("#totalPresalePrice")){
	      $("#totalPresalePrice").text("￥" + price);
	}
	resetBt(price);
}
 
$('body').delegate('#nostock-failedClose', 'click', function(){ 
	$(this).parents('.ui-dialog').hide();  
});

/**
 * 选择落地配类型
 */
function selectServiceType(idSelect) {
	var show = false;
	var param = "idSelect="+idSelect;
	param = addFlowTypeParam(param);
    $.ajax({
        type : "POST",
        dataType : "json",
        url : OrderAppConfig.DynamicDomain + "/order/selectServiceType.action",
        data : param,
        cache : false,
        async: false,
        success : function(dataResult) {
        	var ids = idSelect.split('#');
        	if (ids[2] != null && ids[2] != "undefined" && dataResult.freightServiceVender[ids[2]] != null && dataResult.freightServiceVender[ids[2]] != "undefined") {
        			//所选当前店铺服务费
        			$('#'+ids[2]+'_service').children('.service-price').html("￥" + dataResult.freightServiceVender[ids[2]].serviceFeeVender.toFixed(2));
        			for(var i = 0; i < dataResult.freightServiceVender[ids[2]].freightServiceSkuResultList.length; i++){
        				if(ids[3] == dataResult.freightServiceVender[ids[2]].freightServiceSkuResultList[i].uuid){
        					$(".service-items div[name="+ids[0]+"]").each(function(){
        						$(this).children('.service-cont').children('.service-tips').remove();
        						if(dataResult.freightServiceVender[ids[2]].freightServiceSkuResultList[i].serviceName != null){
        							$(this).children('.service-cont').children('.service-info').html("【送装服务】&nbsp;"+dataResult.freightServiceVender[ids[2]].freightServiceSkuResultList[i].serviceName);
        						}
        		        		if(dataResult.freightServiceVender[ids[2]].freightServiceSkuResultList[i].change){
        		        			$(this).children('.service-cont').children('.service-main').before('<span class="service-tips"><i class="s-ico"></i><i class="s-arr"></i>原服务不支持新收货地址，已重新匹配<b class="s-cls">x</b></span>')
                					$(this).children('.service-cont').children('.service-tips').show();
            					}
        					});
        				}
        			}
        	}
        	//服务费总费用
        	$('#serviceFeeId').html("￥" + dataResult.serviceFeeAll.toFixed(2));
        	modifyNeedPay(dataResult.orderPrice.toFixed(2));
        	show = true;
        }
    });
    return show;
}window.selectServiceType=selectServiceType;

/**
 * 展现落地配名称列表
 */
function showServiceType(obj,skuId) {
	var popVenderIdStr = $("#popVenderIdStr").val();
	if (popVenderIdStr == "") {
		return false;
	}
	var show = false;
	var param = "skuId=" + skuId;
	param = addFlowTypeParam(param);
    $.ajax({
        type : "POST",
        dataType : "json",
        url : OrderAppConfig.DynamicDomain + "/order/showServiceType.action",
        data : param,
        cache : false,
        async: false,
        success : function(dataResult) {
        	var serviceFeeItemHTML = '';
        	if (dataResult.length>0) {
            	for(var i=0;i<dataResult.length;i++){
            		serviceFeeItemHTML = serviceFeeItemHTML + '<li><span class="service-list-item" value='+dataResult[i].skuId+'#'+dataResult[i].serviceItemId+'#'+dataResult[i].venderId+'#'+dataResult[i].uuid+'><i></i>'+dataResult[i].serviceName+'</span></li>';
            	}
        		$(obj).next('.service-list').children('ul').html(serviceFeeItemHTML);
        		show = true;
        	}
        }
      });
    return show;
}window.showServiceType=showServiceType;

$('body').delegate('.service-edit', 'click', function(event) {
	$('.service-list').hide();
	if(!showServiceType(this,$(this).attr("id"))){
		return;
	};
	$(this).next('.service-list').show();
});
$('#container').delegate('.service-list li', 'click', function(event) {
    var tg = event.target;
});
$('body').delegate('#container', 'click', function(event) {
	var tg = event.target;
	if($(tg).hasClass('service-edit')){
		return false;
	}
	if($(tg).closest('.service-main').length >= 1 && $(tg).hasClass('sli-disabled')){
		return false;
	}
	$('.service-list').hide();
});
$('body').delegate('.service-list li', 'click', function(event) {
    if($(this).children('span').hasClass('sli-disabled')) return;
    if(!selectServiceType($(this).children('span').attr('value'))){
    	return;
    };
    $(this).children('span').addClass('sli-selected');
    $(this).siblings().each(function(index, el) {
        $(this).children('span').each(function(index, el) {
            $(this).removeClass('sli-selected');
        });
    });
});
$('body').delegate('.s-cls', 'click', function(event) {
	$(this).parent('.service-tips').hide();
});




/**
 * 地址服务升级>>>旧四级地址推荐新四级地址
 * 用户点击 "属于" 事件
 */
function save_belong_area(id){
	//隐藏域地址信息
	var hid_consignee = $("#hid_upArea_"+id);
	// 如果不隐藏重新获取用户填写的信息
	var consignee_id = id;
	var consignee_type = hid_consignee.attr("address_type");//地址类型
	var consignee_provinceId = hid_consignee.attr("newprovinceid");
	var consignee_cityId = hid_consignee.attr("newcityid");
	var consignee_countyId = hid_consignee.attr("newcountyid");
	var consignee_townId = hid_consignee.attr("newtownid");
	var consignee_name = hid_consignee.attr("name");
	var consignee_email = hid_consignee.attr("email");
	var consignee_address = hid_consignee.attr("address");
	var consignee_mobile = hid_consignee.attr("mobile");//手机号码
	var consignee_idCard = hid_consignee.attr("idcard");//全球购添加身份证号
	var consignee_phone = hid_consignee.attr("phone");//固定电话
	var consignee_provinceName = hid_consignee.attr("newprovincename");
	var consignee_cityName = hid_consignee.attr("newcityname");
	var consignee_countyName = hid_consignee.attr("newcountyname");
	var consignee_townName = hid_consignee.attr("newtownname");
	var consignee_ceshi1 = hid_consignee.attr("ceshi1");
	var isUpdateCommonAddress = 1;//是否更新DB
	var consignee_commons_size = $("#hidden_consignees_size").val();
	var giftSender_consignee_name = "";
	var giftSender_consignee_mobile = "";
	var noteGiftSender = false;
	var addressName = hid_consignee.attr("addressname");//地址别名
  	var hongKongId = $("#hongKongId").val();
  	var taiWanId = $("#taiWanId").val();
  	var overSeasId = $("#overSeasId").val();
	//自提
	if(isGiftBuy()){
		noteGiftSender= true;
		giftSender_consignee_name   = $("#consigneeList_giftSenderConsigneeName").val();
		giftSender_consignee_mobile = $("#consigneeList_giftSenderConsigneeMobile").val();		
	}
	
	//刷新文案
	obtainCopyInfoConfig(consignee_provinceId,consignee_cityId);
	
	//固定电话(允许空)
	if (consignee_phone == null || consignee_phone == "undefined")
		consignee_phone = "";
    //邮箱(允许空)
	if (consignee_email == null || consignee_email == "undefined")
		consignee_email = "";
	//身份证号码(允许空)
	if(consignee_idCard == null || consignee_idCard == "undefined"){
		consignee_idCard = "";
	}
	
	var areaName =  consignee_provinceName + " " + consignee_cityName + " " + consignee_countyName + " " + consignee_townName;
    //类型
	if (consignee_type == "")
		consignee_type = 1;
	//地址别名
	if(isEmpty(addressName)){
		addressName=consignee_name+" "+consignee_provinceName;
	}
	var param = "consigneeParam.id=" + consignee_id + "&consigneeParam.type=" + consignee_type 
		+ "&consigneeParam.name=" + consignee_name + "&consigneeParam.provinceId=" + consignee_provinceId 
		+ "&consigneeParam.cityId=" + consignee_cityId + "&consigneeParam.countyId=" + consignee_countyId 
		+ "&consigneeParam.townId=" + consignee_townId + "&consigneeParam.address=" + consignee_address 
		+ "&consigneeParam.mobile=" + consignee_mobile + "&consigneeParam.email=" + consignee_email 
		+ "&consigneeParam.phone=" + consignee_phone + "&consigneeParam.provinceName=" + consignee_provinceName 
		+ "&consigneeParam.cityName=" + consignee_cityName + "&consigneeParam.countyName=" + consignee_countyName 
		+ "&consigneeParam.townName=" + consignee_townName + "&consigneeParam.commonConsigneeSize=" + consignee_commons_size 
		+ "&consigneeParam.isUpdateCommonAddress=" + isUpdateCommonAddress + "&consigneeParam.giftSenderConsigneeName=" + giftSender_consignee_name 
		+ "&consigneeParam.giftSendeConsigneeMobile=" + giftSender_consignee_mobile + "&consigneeParam.noteGiftSender=" + noteGiftSender
		+ "&consignee_ceshi1="+consignee_ceshi1 + "&consigneeParam.idCard="+consignee_idCard+"&consigneeParam.addressName="+addressName;
	param = addFlowTypeParam(param);
	var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/saveConsignee.action";
	jQuery.ajax({
		type: "POST",
		dataType: "json",
		url: actionUrl,
		data: param,
		cache: false,
		success: function(consigneeResult, textStatus) {
			if (isUserNotLogin(consigneeResult)) {
				goToLogin();
				return;
			}
			if (consigneeResult.success) {
				$("#beforePickName").val('');
				$("#beforePickSiteId").val('');
				$("#beforePickDate").val('');
				$("#beforePickSiteNum").val('');
				$("#beforePickRegionId").val('-1');
				$("#beforePickSelRegionid").val('');
				var invoiceHtml = $("#part-inv").html();
		        if (consigneeResult.restInvoiceByAddress == 22) {
		        	 $("#part-inv").html(invoiceHtml.replace("办公用品", "办公用品（附购物清单）"));
		        }
		        if (consigneeResult.restInvoiceByAddress == 2) {
		        	$("#part-inv").html(invoiceHtml.replace("（附购物清单）", ""));
		        }
		        if (consigneeResult.supportElectro) {
		        	if(null != consigneeResult.restInvoiceCompanyName){
		        		$("#part-inv").html("<span class='mr10'>普通发票&nbsp; </span><span class='mr10'> "+consigneeResult.restInvoiceCompanyName+"&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
		        	}else{
		        		$("#part-inv").html("<span class='mr10'>普通发票&nbsp; </span><span class='mr10'> 个人&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
		        	}
		        }
		        if (consigneeResult.defaultElectro) {
		        	$("#part-inv").html("<span class='mr10'>电子普通发票&nbsp;<i class='invoice-tips-icon' data-tips='电子普通发票与纸质发票具有同等法律效力，可支持报销入账、商品售后凭证。'></i>&nbsp; </span><span class='mr10'> 个人&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
		        }		        
				$("#isNeedOpenInvoice").val(consigneeResult.openInvoice); // 隐藏域，判断修改地址后，是否需要修改发票信息，广州机构比较特殊
				
		        //港澳售项目
		        if(consigneeResult.resetHK){
		        	$("#part-inv").html("<span class='mr10'>不开发票&nbsp;</span><a onclick='edit_Invoice()' id='invoiceEdit' class='ftx-05 invoice-edit hide' href='#none'>修改</a>");
		        }
		        if(consigneeResult.resetCommon){
		        	if(consigneeResult.selectNormalInvoiceContent=="不开发票"){
		        		$("#part-inv").html("<span class='mr10'>不开发票&nbsp;</span><a onclick='edit_Invoice()' id='invoiceEdit' class='ftx-05 invoice-edit' href='#none'>修改</a>");
		        	}else if(consigneeResult.selectInvoiceType==1){
		        		//普票 
		        		$("#part-inv").html("<span class='mr10'>普通发票&nbsp; </span><span class='mr10'> "+consigneeResult.selectInvoiceTitle+"&nbsp; </span><span class='mr10'>"+consigneeResult.selectNormalInvoiceContent+"&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
		        	}else if(consigneeResult.selectInvoiceType==2){
		        		//增值税发票
		        		$("#part-inv").html("<span class='mr10'>增值税专用发票&nbsp; </span><span class='mr10'> "+consigneeResult.selectInvoiceTitle+"&nbsp; </span><span class='mr10'>"+consigneeResult.selectNormalInvoiceContent+"&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
		        	}else if(consigneeResult.selectInvoiceType==3){
		        		//电子发票 
		        		$("#part-inv").html("<span class='mr10'>电子普通发票&nbsp;<i class='invoice-tips-icon' data-tips='电子普通发票与纸质发票具有同等法律效力，可支持报销入账、商品售后凭证。'></i>&nbsp; </span><span class='mr10'> "+consigneeResult.selectInvoiceTitle+"&nbsp; </span><span class='mr10'>"+consigneeResult.selectNormalInvoiceContent+"&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
		        	}
		        }
		        
		      	if(consignee_provinceId==hongKongId || consignee_provinceId==taiWanId || consignee_provinceId==overSeasId){
		      		$("#invoiceEdit").addClass("hide");
//		      		$(".withouthk").addClass("hide");
		      		$(".seven").text("该商品不支持7天无理由退货");
		      		$(".seven").removeClass("ftx-04");
		      		$(".seven").addClass("ftx-03");
		      		$(".sevenicon").removeClass("p-icon-w");
		      		$(".sevenicon").addClass("p-icon-no-w");
		      		
		      		if (consignee_provinceId != overSeasId && consignee_provinceId != taiWanId) {
		      			$("#freighttips").removeClass("hide");
		      		} else {
		      			$("#freighttips").addClass("hide");
		      		}
		      	}else{
		      		$("#invoiceEdit").removeClass("hide");
//		      		$(".withouthk").removeClass("hide");
		      		$(".seven").text("7天无理由退货");
		      		$(".seven").addClass("ftx-04");
		      		$(".seven").removeClass("ftx-03");
		      		$(".sevenicon").addClass("p-icon-w");
		      		$(".sevenicon").removeClass("p-icon-no-w");
		      		
		      		$("#freighttips").addClass("hide");
		      	}
		        //end
				
				if (consigneeResult.resultCode == "isRefreshArea") {
					//goOrder();//大刷新
					//四级地址推荐失败 >>> 强制弹出编辑
					openEditConsigneeDialog(id);
				} else {
					//保存成功
					consignee_mobile = consigneeResult.consigneeShowView.mobile;
					var areaIds=consigneeResult.consigneeShowView.provinceId + "-" + consigneeResult.consigneeShowView.cityId + "-" + consigneeResult.consigneeShowView.countyId + "-" + consigneeResult.consigneeShowView.townId;
					// 弹出对应提示
					$("#consignee-ret").html(consigneeResult.consigneeHtml);
					$('#consignee_id').val(consigneeResult.consigneeShowView.id);
					$('#hideAreaIds').val(areaIds);
					if (isBigItemChange())
						bigItemChangeArea();
					// 预售电话修改
					if ($("#isPresale").val() == "true") {
						$("#hiddenUserMobileByPresale").val(consignee_mobile);
						if ($("#presaleMobile input").size() > 0) {
							$("#presaleMobile input").val(consignee_mobile);
						} else if ($("#userMobileByPresale").size() > 0) {
							$("#userMobileByPresale").html(consignee_mobile);
						}
					}
					if (hasTang9())
						tang9ChangeArea();

					if (isHasSam())
						samChangeArea();

					var commonConsigeeSize = $("#hidden_consignees_size").val();
					var consigneeSize = parseInt(!commonConsigeeSize ? 0 : commonConsigeeSize);
					if (consignee_id == "") {
						goOrder();//异常情况 大刷新
					} else {
						var defAddress = "<a href='#none' class='ftx-05 setdefault-consignee " + ((consigneeSize == 0 || consigneeSize == 1) ? " hide" : "") + "' fid='" + consignee_id + "'>设为默认地址</a>";
						if($("#consignee_index_"+consignee_id).find(".op-btns").find("a").size() == 2)
							defAddress = "<span></span>";
						var divHtml="<div class='consignee-item item-selected' consigneeId='" + consignee_id + "' clstag='pageclick|keycount|trade_201602181|1' c_div_custom_label='consignee_div'>" +
										"<span limit='8'>" +addressName+ "</span><b></b>" +				
									"</div>" +
									"<div class='addr-detail'>" +
										"<span class='addr-name' limit='6'>" + consignee_name + "</span>" +
										"<span class='addr-info' limit='45'>" + areaName + consignee_address +"</span>" +
										"<span class='addr-tel'>" + consignee_mobile + "</span>" +
										(defAddress.indexOf("span")>-1?"<span class='addr-default'>" + "默认地址" + "</span>" :"") +
									"</div>" +
									"<div class='op-btns' consigneeId='" + consignee_id + "'>" + defAddress +
										"<a href='#none' class='ftx-05 edit-consignee' fid='" + consignee_id + "'>编辑</a>" +
										//"<a href='#none' class='ftx-05 del-consignee " + ((consigneeSize == 0 || consigneeSize == 1) ? " hide" : "") + "' fid='" + consignee_id + "'>删除</a>" +
										"<a href='#none' class='ftx-05 del-consignee hide' fid='" + consignee_id + "'>删除</a>" +
									"</div>";
						
				        //由于默认选中的地址不允许删除，此时已经选中了当前"属于"的地址，需要恢复之前选中地址的删除按钮
				        var itemSelectedAddressDiv = $("#consignee-list .item-selected").next().next();
				        itemSelectedAddressDiv.find(".del-consignee").removeClass("hide");
				        //移除之前选中地址的选中样式
						$("#consignee-list .consignee-item").removeClass("item-selected");
						//移除之前选中地址的选中样式,错误地址被选中的情况
						$("#consignee-list .consignee-item-disable").removeClass("item-selected");

						
						
						if (consignee_id == "-1")
							$(".consignee-item").first().html(divHtml);
						else{
							$("#consignee_index_" + consignee_id).html(divHtml);
							//修改class,将"错误地址"样式 修改为 "可用地址"样式
							$("#consignee_index_" + consignee_id).addClass("ui-switchable-panel ui-switchable-panel-selected");
							$("#consignee_index_" + consignee_id).removeClass("disabled");
						}
						
						//******移除 提示地址升级信息 以及 隐藏域地址信息 begin******
						$("#li_J_toUpgrade_" + consignee_id).remove();
						$("#hid_upArea_" + consignee_id).remove();
						//刷新样式,计算高度
						refreshConsigneeListCss();
						//******移除 提示地址升级信息 以及 隐藏域地址信息 end  ******
						
						
					}
					// 新用户保存后将值写回
					setResetFlag(0, '1');
					save_Pay();
					$("#isOpenConsignee").val("0");
					$("#isRefreshArea").val("0");
					subStrConsignee();
					consigneeInfo();
					//重新加载优惠券列表
//					reloadCoupon(consigneeResult.reloadCoupon);
					//yanwenqi 虚拟资产改版没有改这个
			          reloadCouponNew(consigneeResult.reloadCoupon);
			          reloadGiftCard();
			          //end
					
				}
				
			} else {
				if (consigneeResult.message != null && consigneeResult.message != ""){					
					showMessageWarn(consigneeResult.message);
				}
			}
			//非新用户
			if(consignee_id != "" ){
				//地址别名修改埋点
				var addressNameBef = $("#consignee_addressName_old").val();
				if(addressName != addressNameBef){
					log('changgouy', 'click',"jsydizhibieming");
				}
			}
			
			window.showRecommendSelfPickAddress();			
			  
			//setTimeout(function(){
			//});
		},
		error: function(XMLHttpResponse) {
			
		}
	});


}window.save_belong_area=save_belong_area;

/**
 * 调整收货人信息列表样式
 * 主要计算高度
 */
function refreshConsigneeListCss(){
	//更多地址
    //$("#consigneeItemAllClick");
    //收起地址
    //$("#consigneeItemHideClick");
    
    //当"收起地址"class包含hide,说明显示"更多地址",此时只需要判断选中地址是否有地址升级提示信息
    if($("#consigneeItemHideClick").hasClass("hide")){
    	//当前只有两种两种情况,正常地址和错误地址(错误地址有提示信息li)
    	//判断ul下的第一个li
	    var tempId =    $('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').first().attr("id");
	    var parent_id = $('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').first().next().attr("parent_id");
	    if(tempId == parent_id){
		   //调整高度
	       $('#consignee-addr .consignee-cont').css({'height':'84px'});
	       $('#consignee-addr .ui-scrollbar-wrap').css({'height':'84px'});
	    }else{
		  $('#consignee-addr .consignee-cont').css({'height':'42px'});
          $('#consignee-addr .ui-scrollbar-wrap').css('height', '42px');
		}
    }else{
    	//此时说明地址列表已经展开
    	//更新ul下的li计算像素(li中已经包含错误地址提示信息)
//        var _height = (($('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').length-$('.selfPickInCommon').length) * 42)+"px";
//        $('#consignee-addr .consignee-cont').css({'height': _height});
//        $('#consignee-addr .ui-scrollbar-wrap').css({'height':_height});
    	//是否有滚动条
    	if(window.consigneeScroll){
      	  var refreshSize = ($('#consignee-addr .ui-scrollbar-main .consignee-scroll ul li').length-$('.selfPickInCommon').length);
    	  consigneeScroll.resetUpdate(refreshSize);
    	}
    }
}window.refreshConsigneeListCss=refreshConsigneeListCss;
//删除选中样式
function removeConsigneeItemSelected(){
	//地址列表如果只有一条,不允许删除
	var commonConsigeeSize = $("#hidden_consignees_size").val();
	var consigneeSize = parseInt(commonConsigeeSize);
	if (consigneeSize > 1){
	    //选中的地址不允许删除，由于此时已经选中了当前地址，需要恢复之前选中地址的删除按钮
		var itemSelectedAddressDiv = $("#consignee-list .item-selected").next().next();
	    itemSelectedAddressDiv.find(".del-consignee").removeClass("hide");
	}
	//去掉现有选中地址
	$(".consignee-item.item-selected").removeClass("item-selected");
	//去除常用地址选中标记:错误常用地址选中情况
	$(".consignee-item-disable.item-selected").removeClass("item-selected");
}window.removeConsigneeItemSelected=removeConsigneeItemSelected;
/**
 *  山姆会员弹框
 */
function showSamMemberDialog(message){

  var list = '<div class="psam-warn-box ac"> <div class="icon-box-new"><i class="m-icon warn-icon-yellow"></i></div>';
  list = list +'<h3>仅限山姆会员购买</h3> <p>订单中有仅限山姆会员购买的商品，您还不是山姆会员，无法购买</p>';
  list = list +'<div class="op-btns"> <a href="//cartv.jd.com/item/200100420635.html" class="btn-1 mr5">购买山姆会员</a> <a href="#none" onclick ="goCart()" class="btn-9">返回购物车</a>';
  list = list +'</div> </div>';
  $('body').dialog({
    title:'',
    width:415,
    height:240,
    type:'html',
    maskIframe: true,
    source:list,
    onReady:function() {
    }
  });

}window.showSamMemberDialog = showSamMemberDialog;
/*lowB浏览器兼容模式   卡单提示*/
function showPurchaseList(items,errorMessage){
    var confinel='';
    var itemObjs = $('.goods-list .goods-items .goods-item');
    var dealfalg = false;
    var giftObjs = $('.gift-item');
    for( var  k = 0 ;k<items.length ; k++ ){
        itemObjs.each(function(i,itemObj){
            if(items[k].skuId === itemObj.getAttribute('goods-id')){
                dealfalg = true;
                var item_image = $(itemObj).find('img').attr('src');
                var item_uri = $(itemObj).find('a').attr('href');
                var item_name = $(itemObj).find('.p-name a').html();
                var item_price = $(itemObj).find('.p-price strong').html();
                var item_error = items[k].errorMsg ;
                var item_number = $(itemObj).find('.p-num').html();
                var showPurchaseItem = '<div class="goods-item"><div class="goods-msg"><div class="p-img"><a href="' + item_uri + '" target="_blank"><img src="' + item_image + '" alt=""></a></div>\n<div class="goods-msg-gel"><div class="p-name"><a href="'+item_uri+'" target="_blank">' + item_name + '</a>\n<div class="mt5"><strong>' + item_price + '</strong><span class="ftx-10 ml12">' + item_error + '</span></div></div><div class="p-num">' + item_number + '</div></div></div><div class="clr"></div></div>';
                confinel += showPurchaseItem;
            }
        });
        if(!dealfalg){
            //赠品处理
            giftObjs.each(function(j,giftObj){
                if(items[k].skuId === giftObj.getAttribute('gift-id')){
                    var item_image = giftObj.getAttribute('gift-img');
                    var item_uri = giftObj.getAttribute('gift-uri');
                    var item_name = giftObj.getAttribute('gift-name');
                    var item_error = items[k].errorMsg ;
                    var item_number = giftObj.getAttribute('gift-num');
                    var showPurchaseItem = '<div class="goods-item"><div class="goods-msg"><div class="p-img"><a href="' + item_uri + '" target="_blank"><img src="' + item_image + '" alt=""></a></div>\n<div class="goods-msg-gel"><div class="p-name"><a href="'+item_uri+'" target="_blank">' + item_name + '</a>\n<div class="mt5"><strong>【赠品】<span class="ftx-10 ml12">' + item_error + '</span></div></div><div class="p-num">x' + item_number + '</div></div></div><div class="clr"></div></div>';
                    confinel += showPurchaseItem;
                }
            })
        }
        dealfalg = false;
    }
    var dialog = '<div class="ui-dialog-content"><div class="limited-pin-thickbox"><div class="tip-box icon-box-new"><span class="warn-icon-yellow-2017 m-icon"></span><div class="item-fore"><span>' + errorMessage + '</span></div></div><div class="goods-items">' + confinel + '</div><div class="op-btns ac mb20"><a href="https://cart.jd.com" class="btn-1">返回购物车</a></div>';
    $('body').dialog({
        title:'提示',
        width:670,
        type:'html',
        maskIframe: true,
        source:dialog,
        onReady:function() {
        }
    });

}window.showPurchaseList = showPurchaseList;