var SECKILL_DOMAIN = "//"+window.location.host +"/";

/**
 * 特别说明，所有请求参数后都要带skuId，ngxin有用到url里的这个字段
 * ************************************************************************
 */

function edit_Consignee(){
	//隐藏支付方式的修改
	$('#payment-ship_edit_action').hide();
	$("#consignee_edit_action").html("<a href=\"#none\" onclick=\"save_Consignee()\">[保存]</a>");
	$("#consigneeEditDiv").show();
	$("#consigneeInfoDiv").hide();
	loadProvinces();
	showUsualAddressList();
	
	var provinceId = $("#submitProvinceId").val();
	var cityId = $("#submitCityId").val();
	var countyId = $("#submitCountyId").val();
	var townId = $("#submitTownId").val();
	if(isEmpty(townId)){
		townId = 0;
	}
	if(!isEmpty(provinceId) && !isEmpty(cityId) && !isEmpty(countyId)){
		loadAllArea(provinceId, cityId, countyId, townId);
	}
	$("#submitTownId").val("");
}

/**
 * 显示常用地址
 */
function showUsualAddressList(){
	var skuId = $("#skuId").val();
	var actionUrl = SECKILL_DOMAIN + "async/getUsualAddressList.action?skuId="+skuId;
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : null,
		cache : false,
		success : function(dataResult) {
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if(!isEmpty(dataResult)){
				var addressListHtml="";
				var defaultId = 0;
				if(dataResult.length>5){
					$("#moreAddressDiv").show();
				}else{
					$("#moreAddressDiv").hide();
				}
				for(var i=0;i<dataResult.length;i++){
					var addressInfo = dataResult[i];
					if(i==0){
						addressListHtml +="<div id=\"addressItem_"+addressInfo.id+"\" class=\"item  item-selected\" index=\""+i+"\">";
						addressListHtml +="<input type=\"radio\" value='"+addressInfo.id+"' onclick=\"choseUsualAddress('"+addressInfo.id+"')\" id=\"addressInfo_"+addressInfo.id+"\" checked=\"true\" name=\"consignee_radio\" class=\"hookbox\">";
						defaultId =addressInfo.id;
					}else{
						if(i>=5){
							addressListHtml +="<div id=\"addressItem_"+addressInfo.id+"\" class=\"item\" style=\"display:none\" index=\""+i+"\">";
						}else{
							addressListHtml +="<div id=\"addressItem_"+addressInfo.id+"\" class=\"item\" index=\""+i+"\">";
						}
						addressListHtml +="<input type=\"radio\" value='"+addressInfo.id+"' onclick=\"choseUsualAddress('"+addressInfo.id+"')\" id=\"addressInfo_"+addressInfo.id+"\" name=\"consignee_radio\" class=\"hookbox\">";
					}
					
					addressListHtml +="<label for=\"addressInfo_"+addressInfo.id+"\">";
					addressListHtml +="<b>"+addressInfo.name+"</b>&nbsp; "+addressInfo.provinceName+addressInfo.cityName+addressInfo.countyName+addressInfo.townName+addressInfo.addressDetail
						+" &nbsp; "+ addressInfo.mobileWithXing +" &nbsp;";
					addressListHtml +="</label>";
					addressListHtml +="<input type=\"hidden\" id=\"name_hidden_"+addressInfo.id+"\" value=\""+addressInfo.name+"\" />";
					addressListHtml +="<input type=\"hidden\" id=\"provinceId_hidden_"+addressInfo.id+"\" value=\""+addressInfo.provinceId+"\" />";
					addressListHtml +="<input type=\"hidden\" id=\"cityId_hidden_"+addressInfo.id+"\" value=\""+addressInfo.cityId+"\" />";
					addressListHtml +="<input type=\"hidden\" id=\"countyId_hidden_"+addressInfo.id+"\" value=\""+addressInfo.countyId+"\" />";
					addressListHtml +="<input type=\"hidden\" id=\"townId_hidden_"+addressInfo.id+"\" value=\""+addressInfo.townId+"\" />";
					addressListHtml +="<input type=\"hidden\" id=\"addressDetail_hidden_"+addressInfo.id+"\" value=\""+addressInfo.addressDetail+"\" />";
					addressListHtml +="<input type=\"hidden\" id=\"mobile_hidden_"+addressInfo.id+"\" value=\""+addressInfo.mobileWithXing+"\" />";
					addressListHtml +="<input type=\"hidden\" id=\"mobile_key_hidden_"+addressInfo.id+"\" value=\""+addressInfo.mobileKey+"\" />";
					addressListHtml +="<input type=\"hidden\" id=\"email_hidden_"+addressInfo.id+"\" value=\""+addressInfo.email+"\" />";
					addressListHtml +="</div>";
				}
				$("#consignee-list").html(addressListHtml);
				$("#consignee-list").show();
				$("#use-new-address").show();
				choseUsualAddress(defaultId);
			}else{
				$("#consignee-list").html("");
				$("#consignee-list").hide();
				$("#use-new-address").hide();
			}
		},
		error : function(XMLHttpResponse) {
			return false;
		}
	});
}

function openMoreConsignee(){
	$("#select-more").removeClass("select-expand").addClass("select-collapse")
		.html("<span onclick=\"closeMoreConsignee()\">收起常用地址</span><s></s>");
	$("#consignee-list").find(".item").each(function() {
		$(this).show();
	});
	
}
function closeMoreConsignee(){
	$("#select-more").html("<span onclick=\"openMoreConsignee()\">更多常用地址</span><s></s>");
	$("#consignee-list").find(".item").each(function() {
		if(parseInt($(this).attr("index"))>=5){
			$(this).hide();
		}else{
			$(this).show();
		}
	});
}

function useNewConsignee(){
	$("#consignee_name").val("");
	$("#consignee_address").val("");
	$("#consignee_mobile").val("");
	$("#consignee_email").val("");
	$("#consignee-list").find(".item").each(function() {
			$(this).attr("class", "item");
	});
	$("input[name='consignee_radio']").attr("checked","");
	loadProvinces();
}

function choseUsualAddress(id){
	if(id=="0"){
		return;
	}
	$("#consignee-list").find(".item").each(function() {
			var indexNum = $(this).attr("id").split("_")[1];
			if (id == indexNum) {
				$(this).attr("class", "item item-selected");
			} else {
					$(this).attr("class", "item");
			}
	});
	$("#consignee_radio_new").attr("checked","");
	var name = $("#name_hidden_"+id).val();
	var provinceId = $("#provinceId_hidden_"+id).val();
	var cityId = $("#cityId_hidden_"+id).val();
	var countyId = $("#countyId_hidden_"+id).val();
	var townId = $("#townId_hidden_"+id).val();
	var mobile = $("#mobile_hidden_"+id).val();
	var mobileKey = $("#mobile_key_hidden_"+id).val();
	var email = $("#email_hidden_"+id).val();
	
	if(email.toLowerCase() == 'null'){
		email="";//非法值设为空
		$("#email_hidden_"+id).val('');
	}
	
	
	var addressDetail = $("#addressDetail_hidden_"+id).val();
	$("#consignee_name").val(name);
	$("#consignee_address").val(addressDetail);
	$("#consignee_mobile").val(mobile);
	$("#consignee_mobile_key").val(mobileKey);
	$("#consignee_email").val(email);
	
	
	$("#span_province").html("<select  id=\"consignee_province\" onchange=\"loadCitys()\"><option value=''>请选择：</option></select>");
	$("#span_city").html("<select id=\"consignee_county\"><option value=''>请选择：</option></select>");
	$("#span_county").html("<select id=\"consignee_county\"><option value=''>请选择：</option></select>");
	$("#span_town").hide();
	
	
	var skuId = $("#skuId").val();
	var actionUrl = SECKILL_DOMAIN + "seckill/loadProvinces.action?skuId="+skuId;
	jQuery.ajax( {
		type : "POST",
		dataType : "text",
		url : actionUrl,
		data : null,
		cache : false,
		success : function(dataResult) {
				// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (!isEmpty(dataResult)) {
				var provinceHtml = "<select onchange=\"loadCitys()\" id=\"consignee_province\">"+dataResult+"</select>";
				$("#span_province").html(provinceHtml);
				$("#span_city").html("<select id=\"consignee_county\"><option value=''>请选择：</option></select>");
				$("#span_county").html("<select id=\"consignee_county\"><option value=''>请选择：</option></select>");
				$("#span_town").hide();
			}
			loadAllArea(provinceId,cityId,countyId,townId);
		},
		error : function(XMLHttpResponse) {
			return false;
		}
	});
	
}

function save_Consignee(){
	if(!checkConsignee('name_div')){
		return;
	}
	if(!checkConsignee('email_div')){
		return;
	}
	if(!checkConsignee('area_div')){
		return;
	}
	if(!checkConsignee('address_div')){
		return;
	}
	if(!checkConsignee('call_mobile_div')){
		return;
	}
	var submitUsualAddressId = $("input:radio[name='consignee_radio']:checked").val();
	$("#submitUsualAddressId").val(submitUsualAddressId);
	$("#submitName").val($("#consignee_name").val());
	$("#submitMobile").val($("#consignee_mobile").val());
	$("#submitMobileKey").val($("#consignee_mobile_key").val());
	$("#submitProvinceId").val($("#consignee_province").find("option:selected").val());
	$("#submitCityId").val($("#consignee_city").find("option:selected").val());
	$("#submitCountyId").val($("#consignee_county").find("option:selected").val());
	
	var townName = "";
	if($("#span_town").is(":hidden")){
		$("#submitTownId").val("");
	}else{
		$("#submitTownId").val($("#consignee_town").find("option:selected").val());
		townName = $("#consignee_town").find("option:selected").text().replace('*','');
	}
	$("#submitEmail").val($("#consignee_email").val());
	var addressDetail = $("#consignee_address").val();
	var provinceName = $("#consignee_province").find("option:selected").text().replace('*','');
	var cityName = $("#consignee_city").find("option:selected").text().replace('*','');
	var countyName = $("#consignee_county").find("option:selected").text().replace('*','');
	
	if(isEmpty(townName) || townName=="请选择："){
		townName="";
	}
	$("#submitProvinceName").val(provinceName);
	$("#submitCityName").val(cityName);
	$("#submitCountyName").val(countyName);
	$("#submitTownName").val(townName);
	$("#submitAddress").val(addressDetail);
	
	$("#consigneeInfoDiv").html("<p>"+$("#consignee_name").val()+"&nbsp;&nbsp;&nbsp;"+$("#consignee_mobile").val()+"<br/>"+provinceName+cityName+countyName+townName+addressDetail+"</p>");
	
	$("#consignee_edit_action").html("<a href=\"#none\" onclick=\"edit_Consignee()\">[修改]</a>");
	$("#consigneeEditDiv").hide();
	$("#consigneeInfoDiv").show();
	$('#payment-ship_edit_action').show();//使支付方式修改显示
	edit_Payment();
	//根据地区确定库存状态
	loadSkuStockState();
}


/**
 * 验证收货地址消息提示
 * 
 * @param divId
 * @param value
 */
function checkConsignee(divId) {
	var errorFlag = false;
	var errorMessage = "";
	var value = "";
	// 验证收货人名称
	if (divId == "name_div") {
		value = $("#consignee_name").val();
		errorMessage = checkConsigneeName(value);
		if(!isEmpty(errorMessage)){
			errorFlag = true;
		}
	}
	// 验证邮箱格式
	else if (divId == "email_div") {
		value = $("#consignee_email").val();
		errorMessage = checkConsigneeEmail(value);
		if(!isEmpty(errorMessage)){
			errorFlag = true;
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
				|| ($("#span_town").html()!=null&&$("#span_town").html()!=""&&!$("#span_town").is(":hidden") && isEmpty(townId))) {
			errorFlag = true;
			errorMessage = "请您填写完整的地区信息";
		}
	}
	// 验证收货人地址
	else if (divId == "address_div") {
		value = $("#consignee_address").val();
		errorMessage = checkConsigneeAddress(value);
		if(!isEmpty(errorMessage)){
			errorFlag = true;
		}
	}
	// 验证手机号码
	else if (divId == "call_mobile_div") {
		value = $("#consignee_mobile").val();
		divId = "call_div";
		errorMessage = checkConsigneeMobile(value);
		if(!isEmpty(errorMessage)){
			errorFlag = true;
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
}


/**
 * 获取省份列表
 */
function loadProvinces() {
	var skuId = $("#skuId").val();
	var actionUrl = SECKILL_DOMAIN + "seckill/loadProvinces.action?skuId="+skuId;
	jQuery.ajax( {
		type : "POST",
		dataType : "text",
		url : actionUrl,
		data : null,
		cache : false,
		success : function(dataResult) {
				// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (!isEmpty(dataResult)) {
				var provinceHtml = "<select onchange=\"loadCitys()\" id=\"consignee_province\">"+dataResult+"</select>";
				$("#span_province").html(provinceHtml);
				$("#span_city").html("<select id=\"consignee_county\"><option value=''>请选择：</option></select>");
				$("#span_county").html("<select id=\"consignee_county\"><option value=''>请选择：</option></select>");
				$("#span_town").hide();
			}
		},
		error : function(XMLHttpResponse) {
			return false;
		}
	});
}

/**
 * 获取二级列表
 */
function loadCitys() {
	var skuId = $("#skuId").val();
	var actionUrl = SECKILL_DOMAIN + "seckill/loadCitys.action?skuId="+skuId;
	var provinceId = $("#consignee_province").find("option:selected").val();
	jQuery.ajax( {
		type : "POST",
		dataType : "text",
		url : actionUrl,
		data : "provinceId="+provinceId,
		cache : false,
		success : function(dataResult) {
				// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (!isEmpty(dataResult)) {
				var cityHtml = "<select onchange=\"loadCountys()\" id=\"consignee_city\">"+dataResult+"</select>";
				$("#span_city").html(cityHtml);
				$("#span_county").html("<select id=\"consignee_county\"><option value=''>请选择：</option></select>");
				$("#span_town").hide();
			}
		},
		error : function(XMLHttpResponse) {
			return false;
		}
	});
}

/**
 * 获取三级列表
 */
function loadCountys() {
	var skuId = $("#skuId").val();
	var actionUrl = SECKILL_DOMAIN + "seckill/loadCountys.action?skuId="+skuId;
	var cityId = $("#consignee_city").find("option:selected").val();
	jQuery.ajax( {
		type : "POST",
		dataType : "text",
		url : actionUrl,
		data : "cityId="+cityId,
		cache : false,
		success : function(dataResult) {
				// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (!isEmpty(dataResult)) {
				var countyHtml = "<select onchange=\"loadTowns()\" id=\"consignee_county\">"+dataResult+"</select>";
				$("#span_county").html(countyHtml);
				$("#span_town").hide();
			}
		},
		error : function(XMLHttpResponse) {
			return false;
		}
	});
}
/**
 * 获取四级列表
 */
function loadTowns() {
	var skuId = $("#skuId").val();
	var actionUrl = SECKILL_DOMAIN + "seckill/loadTowns.action?skuId="+skuId;
	var countyId = $("#consignee_county").find("option:selected").val();
	jQuery.ajax( {
		type : "POST",
		dataType : "text",
		url : actionUrl,
		data : "countyId="+countyId,
		cache : false,
		success : function(dataResult) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (!isEmpty(dataResult)) {
				var townHtml = "<select id=\"consignee_town\">"+dataResult+"</select>";
				$("#span_town").html(townHtml);
				$("#span_town").show();
			}else{
				$("#span_town").hide();
			}
		},
		error : function(XMLHttpResponse) {
			return false;
		}
	});
}

function loadAllArea(provinceId,cityId,countyId,townId){
	var skuId = $("#skuId").val();
	var actionUrl = SECKILL_DOMAIN + "seckill/loadAllArea.action?skuId="+skuId;
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : "provinceId="+provinceId+"&cityId="+cityId+"&countyId="+countyId,
		cache : false,
		success : function(dataResult) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (!isEmpty(dataResult)) {
				var cityHtml = dataResult[1];
				var countyHtml = dataResult[2];
				var townHtml = dataResult[3];
				$("#consignee_province  option[value='"+provinceId+"']").attr("selected","selected");
				if(!isEmpty(cityHtml)){
					$("#span_city").html( "<select onchange=\"loadCountys()\" id=\"consignee_city\">"+cityHtml+"</select>");
					$("#consignee_city  option[value='"+cityId+"']").attr("selected","selected");
					if(!isEmpty(countyHtml)){
						$("#span_county").html( "<select onchange=\"loadTowns()\" id=\"consignee_county\">"+countyHtml+"</select>");
						$("#consignee_county  option[value='"+countyId+"']").attr("selected","selected");
						if(!isEmpty(townHtml)){
							$("#span_town").show();
							$("#span_town").html( "<select id=\"consignee_town\">"+townHtml+"</select>");
							$("#consignee_town  option[value='"+townId+"']").attr("selected","selected");
						}else{
							$("#span_town").hide();
						}
					}
				}
			}
		},
		error : function(XMLHttpResponse) {
			return false;
		}
	});
}


function edit_Payment(){
	$("#payment-ship_edit_action").html("<a href=\"#none\" onclick=\"save_Payment()\">[保存]</a>");
	$("#payAndShipEditDiv").show();
	$("#payAndShipInfoDiv").hide();
	showCodPayment();
	chosePayment(4);
}

function chosePayment(paymentType){
	$("#submitPaymentType").val(paymentType);
}

function save_Payment(){
	$("#payment-ship_edit_action").html("<a href=\"#none\" onclick=\"edit_Payment()\">[修改]</a>");
	$("#payAndShipEditDiv").hide();
	$("#payAndShipInfoDiv").show();
	$("#submitPaymentType").val($("input:radio[name='payment']:checked").val());
	$("#submitCodTimeType").val($("input:radio[name='codTimeType']:checked").val());
	
	var payAndShipInfo = "";
	if($("#submitPaymentType").val()=='4'){
		payAndShipInfo = "<p>在线支付<br/>";
	}else{
		payAndShipInfo = "<p>货到支付<br/>";
	}
	if($("#submitCodTimeType").val()=="1"){
		payAndShipInfo+="只工作日送货(双休日、假日不用送)</p>";
	}else if($("#submitCodTimeType").val()=="2"){
		payAndShipInfo+="只双休日、假日送货(工作日不用送)</p>";
	}else if($("#submitCodTimeType").val()=="3"){
		payAndShipInfo+="工作日、双休日与假日均可送货</p>";
	}else if($("#submitCodTimeType").val()=="5"){
		payAndShipInfo+="极速达（下单后或支付成功后3小时送达）</p>";
	}
	$("#payAndShipInfoDiv").html(payAndShipInfo);
	showOrderPrice();
}

function edit_Invoice(){
	$("#invoice_edit_action").html("<a href=\"#none\" onclick=\"save_Invoice()\">[保存]</a>");
	$("#invoiceEditDiv").show();
	$("#invoiceInfoDiv").hide();
}

function showCompaynName(flag){
	if(flag || flag =='true'){
		$("#companyName").show();
		$("#invoice_taxpayer").show();
	}else{
		$("#companyName").hide();
		$("#invoice_taxpayer").hide();
	}
}

function save_Invoice(){
	var invoiceTitle = $("input:radio[name='invoiceTitle']:checked").val();
	var invoiceContent = $("input:radio[name='normal-normalContent']:checked").val();
	var companyName =$("#companyName").val(); 
	var taxpayerNO = $("#taxpayerNO").val(); 
	if(invoiceTitle == '5'){
		var errorMessage = checkInvoiceCompanyName(companyName);
		if(!isEmpty(errorMessage)){
			alert(errorMessage);
			return;
		}
		if(jQuery.trim(taxpayerNO) != ""){
			var taxpayerNOErrorMsg = checkInvoiceTaxpayerNO(taxpayerNO);
			if(!isEmpty(taxpayerNOErrorMsg)){
				alert(taxpayerNOErrorMsg);
				return;
			}
			if(!checkInvoiceTaxpayerNoBack(taxpayerNO)){
				alert("请填写准确的纳税人识别号或统一社会信用代码");
				return;
			}
		}
	}else{
		taxpayerNO = "";
	}
	$("#invoice_edit_action").html("<a href=\"#none\" onclick=\"edit_Invoice()\">[修改]</a>");
	$("#invoiceEditDiv").hide();
	$("#invoiceInfoDiv").show();
	$("#submitInvoiceTitle").val(invoiceTitle);
	$("#submitInvoiceContent").val(invoiceContent);
	$("#submitInvoiceCompany").val(companyName);
	$("#submitInvoiceTaxpayerNO").val(taxpayerNO);
	var titleName = (invoiceTitle=='4')?"个人":companyName+"&nbsp;&nbsp;&nbsp;"+taxpayerNO;
	var contentName =$("#for-content-"+invoiceContent).text();
	$("#invoiceInfoDiv").html("<p>普通发票&nbsp;&nbsp;&nbsp;"+titleName+"&nbsp;&nbsp;&nbsp;"+contentName+"</p>");
	
}

function checkInvoiceTaxpayerNoBack(taxpayerNO){
	var actionUrl = SECKILL_DOMAIN + "async/checkInvoiceTaxpayer.action";
	var result = true;
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		url : actionUrl,
		async: false,
		data : "taxpayerNO="+taxpayerNO,
		cache : false,
		success : function(dataResult) {
			result = dataResult;
		},
		error : function(XMLHttpResponse) {
			result = true;
		}
	});
	return result;
}



function showCodPayment(){
	var skuId = $("#skuId").val();
	var actionUrl = SECKILL_DOMAIN + "async/isSupportCodPayment.action?skuId="+skuId;
	var provinceId = $("#submitProvinceId").val();
	var cityId = $("#submitCityId").val();
	var countyId = $("#submitCountyId").val();
	var townId = $("#submitTownId").val();
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : "orderParam.provinceId="+provinceId+"&orderParam.cityId="+cityId+"&orderParam.countyId="+countyId+"&orderParam.townId="+townId,
		cache : false,
		success : function(dataResult) {
				// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if(dataResult){
				$("#codPaymentDiv").show();
			}else{
				$("#codPaymentDiv").hide();
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}



function showOrderPrice(){
	var skuId = $("#skuId").val();
	var num = $("#num").val();
	var provinceId = $("#submitProvinceId").val();
	var cityId = $("#submitCityId").val();
	var countyId = $("#submitCountyId").val();
	var townId = $("#submitTownId").val();
	if(isEmpty(townId)){
		townId=0;
	}
	var paymentType= $("#submitPaymentType").val();
	var codTimeType = $("#submitCodTimeType").val();
	var actionUrl = SECKILL_DOMAIN + "async/calcuOrderPrice.action?skuId="+skuId+"&num="+num;
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : "provinceId="+provinceId+"&cityId="+cityId+"&countyId="+countyId+"&townId="+townId+"&paymentType="+paymentType+"&codTimeType="+codTimeType,
		cache : false,
		success : function(dataResult) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if(dataResult){
				if(dataResult.productTotalPrice){
					$("#warePriceId").html("￥"+dataResult.productTotalPrice);
					$("#skuPriceDiv").show();
				}else{
					$("#skuPriceDiv").hide();
				}
				if(dataResult.freight){
					$("#freightPriceId").html("￥" + dataResult.freight);
					$("#showFreightPrice").show();
				}else{
					$("#showFreightPrice").hide();
				}
				if(dataResult.totalPrice){
					$("#sumPayPriceId").html("￥" + dataResult.totalPrice);
					$("#skuTotalPriceDiv").show();
				}else{
					$("#sumPayPriceId").html("￥0.00");
				}
				
				if(dataResult.totalPrice){
					$("#payPriceId").html("￥"+dataResult.totalPrice);
					$("#payPriceIdDiv").show();
				}else{
					$("#payPriceId").html("￥0.00");
					$("#payPriceIdDiv").show();
				}
				if(dataResult.couponDiscount){
					$("#couponPriceId").html("-￥"+dataResult.couponDiscount);
					$("#showCouponPrice").show();
				}else{
					$("#couponPriceId").html("");
					$("#showCouponPrice").hide();
				}
				if(dataResult.jingdouDiscount){	
					$("#showJingdouPrice").show();
					$("#jingdouPriceId").html("-￥"+dataResult.jingdouDiscount);
				}else{
					$("#showJingdouPrice").hide();
					$("#jingdouPriceId").html("");
				}
				if(dataResult.giftCardDiscount){
					$("#showGiftCardPrice").show();
					$("#giftCardPriceId").html("-￥"+dataResult.giftCardDiscount);
				}else{
					$("#showGiftCardPrice").hide();
					$("#giftCardPriceId").html("");
					$("#lpk_discount").text(0);
				}
				if(dataResult.showXuZhongInfo && dataResult.xuZhongFreight>0){
					$("#showXuzhongPrice").show();
					$("#xuzhongPriceId").text("￥"+dataResult.xuZhongFreight);
					$("#showXuzhongInfo").show();
					if(dataResult.overXuZhongWeight){
						$("#xuzhongInfo").text("(超重"+dataResult.overXuZhongWeight+",超重部分1元/kg)");
					}
				}else{
					$("#showXuzhongPrice").hide();
					$("#xuzhongPriceId").text("￥0.00");
					$("#showXuzhongInfo").hide();
					$("#xuzhongInfo").text("");
				}
				
				showPassword();
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}
function showOrHideJingdouInfo(){
	if ($("#jdBeans-new").css('display') == 'none') {
		$("#orderBeanItem").removeClass();
		$("#orderBeanItem").addClass("item toggle-active");
		$("#jdBeans-new").show();
		var actionUrl = SECKILL_DOMAIN + "async/getJBeanInfo.action?skuId="+$("#skuId").val();
		jQuery.ajax( {
			type : "POST",
			dataType : "json",
			url : actionUrl,
			cache : false,
			success : function(dataResult) {
				if(dataResult){
					$("#jingdouInfoNote").html("共<span class=\"total\" >"+dataResult.totalCount+"</span>个京豆，本次可用 <span class=\"available\" >"+dataResult.canUseCount+"</span>个京豆");
					$("#jingdouTotalNote").text(dataResult.totalCount);
					$("#jingdouCanUseNote").text(dataResult.canUseCount);
					if(dataResult.canUseCount<=0){
						$("#jingdouNote").show();
						$("#usedJingdou").val(0);
						$("#jingdouEditDiv").attr("class","cho-bar disabled");
						$("#checkJingdouBox").attr("checked",false);
					}else{
						$("#jingdouNote").hide();
						$("#jingdouEditDiv").attr("class","cho-bar");
						$("#canUseJingdou").val(dataResult.canUseCount);
						if(dataResult.usedCount>0){
							$("#checkJingdouBox").attr("checked",true);
							$("#usedJingdou").val(dataResult.usedCount);
						}else{
							$("#checkJingdouBox").attr("checked",false);
							$("#usedJingdou").val(1000);
						}
					}
				}
			},
			error : function(XMLHttpResponse) {
			}
		});
	}else{
		$("#jdBeans-new").hide();
		$("#orderBeanItem").removeClass();
		$("#orderBeanItem").addClass("item");
	}
}

function updateJingdouCount(action){
	var usedJingdou = parseInt($("#usedJingdou").val());
	var canUsedJingdou = parseInt($("#canUseJingdou").val());
	if(action=='add' && (usedJingdou+1000)<=canUsedJingdou){
		$("#usedJingdou").val(usedJingdou+1000);
	}else if(action=='minus' && (usedJingdou-1000)>=0 ){
		$("#usedJingdou").val(usedJingdou-1000);
	}
	var checked = $("#checkJingdouBox").is(":checked");
	if(checked){
		useJingdou(false);
	}
}

function checkJingdou(){
	var checked = $("#checkJingdouBox").is(":checked");
	if(checked){
		$("#plusJingdou").attr("class","plus");
		$("#minusJingdou").attr("class","minus");
	}else{
		$("#plusJingdou").attr("class","plus disabled");
		$("#minusJingdou").attr("class","minus disabled");
	}
	useJingdou(!checked);
}

function useJingdou(cancel){
	var usedJingdou = $("#usedJingdou").val();
	if(cancel){
		usedJingdou = 0;
	}
	var actionUrl = SECKILL_DOMAIN + "async/useJBean.action?useCount="+usedJingdou;
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		url : actionUrl,
		cache : false,
		success : function(dataResult) {
			showOrderPrice();
		},
		error : function(XMLHttpResponse) {
			showOrderPrice();
		}
	});
}

/**
 * 显示支付密码
 * @return
 */
function showPassword(){
	if(!isEmpty($("#couponPriceId").html()) || !isEmpty($("#jingdouPriceId").html()) || !isEmpty($("#giftCardPriceId").html())){
		$("#paypasswordPanel").show();
	}else{
		$("#paypasswordPanel").hide();
	}
}
function loadSkuStockState(){
	try{
		var skuId = $("#skuId").val();
		var num = $("#num").val();
		var provinceId = $("#consignee_province").val();
		var cityId = $("#consignee_city").val();
		var countyId = $("#consignee_county").val();
		var townId = $("#consignee_town").val();//四级地址
		if(!!!townId){
			townId=0;
		}
		var jdaOfCookie = readCookie("__jda");
		var uuid = "";
		if(jdaOfCookie!=null && jdaOfCookie!="" && jdaOfCookie.split('.').length>2){
			uuid = jdaOfCookie.split('.')[1];
		}
		var pin = readCookie("pin");
		var actionUrl ="//ss.jd.com/ss/areaStockState/mget?app=skill_sys&ch=1&skuNum="+skuId+"&pdpin="+pin+"&pduid="+uuid;
		actionUrl+="&area="+provinceId+","+cityId+","+countyId+","+townId;
		actionUrl+="&&callback=?";
		$.getJSON(actionUrl, function(result){
			if(result[skuId]['a'] == 34){
				$("#stotcStateDiv").text("无货");
			}
		});
	}catch(e){
		$("#stotcStateDiv").text("有货");
	}
}

function submitOrder(){
	//校验支付密码
	var errorMessage = "";
	var usualAddressId = $("#submitUsualAddressId").val();
	var consigneeName = $("#submitName").val();
	var consigneeMobile = $("#submitMobile").val();
	var consigneeMobileKey = $("#submitMobileKey").val();
	var consigneeAddressDetail = $("#submitAddress").val();
	var provinceId = $("#submitProvinceId").val();
	var cityId = $("#submitCityId").val();
	var countyId = $("#submitCountyId").val();
	var townId = $("#submitTownId").val();
	var provinceName = $("#submitProvinceName").val();
	var cityName = $("#submitCityName").val();
	var countyName = $("#submitCountyName").val();
	var townName = $("#submitTownName").val();
	var email = $("#submitEmail").val();
	var paymentType =$("#submitPaymentType").val();
	var invoiceTitle = $("#submitInvoiceTitle").val();
	var invoiceContent = $("#submitInvoiceContent").val();
	var invoiceCompanyName = $("#submitInvoiceCompany").val();
	var invoiceTaxpayer = $("#submitInvoiceTaxpayerNO").val();
	var skuId=$("#skuId").val();
	var num =$("#num").val();
	var vid =$("#vid").val();
	var codTimeType = $("#submitCodTimeType").val();
	var eid = $("#eid").val();
	var fp = $("#fp").val();
	//校验地址信息
	if(isEmpty(errorMessage)){
		errorMessage = checkConsigneeName(consigneeName);
	}
	if(isEmpty(errorMessage)){
		errorMessage = checkConsigneeAddress(consigneeAddressDetail);
	}
	if(isEmpty(errorMessage)){
		errorMessage = checkConsigneeMobile(consigneeMobile);
	}
	if(isEmpty(errorMessage)){
		errorMessage = checkConsigneeEmail(email);
	}
	if(isEmpty(errorMessage)){
		if(isEmpty(provinceId) || isEmpty(cityId) || isEmpty(countyId)){
				errorMessage = "请您填写完整的地区信息";
		}
	}
	if(isEmpty(errorMessage)){
		if(isEmpty(paymentType)){
			errorMessage = "请您选择支付方式和配送方式";
		}
	}
	if(isEmpty(errorMessage)){
		if(isEmpty(invoiceTitle)){
			errorMessage="请您选择发票抬头";
		}else{
			if(invoiceTitle =="5"){
				if(isEmpty(invoiceCompanyName) && !isEmpty(checkInvoiceCompanyName(invoiceCompanyName))){
					errorMessage = "请您填写正确发票抬头的公司名称";
				}
				if(isEmpty(errorMessage)){
					if(!isEmpty(checkInvoiceTaxpayerNO(invoiceTaxpayer))){
						errorMessage = "请填写准确的纳税人识别号或统一社会信用代码";
					}
				}
			}
			
		}
	}
	var paywd=$("#paypasswordPanel").css("display")=="block";
	if(paywd && !!!$("#txt_paypassword").val()){
		errorMessage = "请输入支付密码";
	}
	if(!isEmpty(errorMessage)){
		$("#submit_message").text(errorMessage);
		$("#submit_message").show();
		return;
	}else{
		$("#submit_message").hide();
	}
	
	$("#order-submit").attr("disabled","disabled");
	
	var param = "orderParam.name="+consigneeName +"&orderParam.addressDetail="+consigneeAddressDetail
				+"&orderParam.mobile="+consigneeMobile+"&orderParam.email="+email+"&orderParam.provinceId="+provinceId
				+"&orderParam.cityId="+cityId+"&orderParam.countyId="+countyId+"&orderParam.townId="+townId
				+"&orderParam.paymentType="+paymentType+"&orderParam.password="+$("#txt_paypassword").val()
				+"&orderParam.invoiceTitle="+invoiceTitle+"&orderParam.invoiceContent="+invoiceContent+"&orderParam.invoiceCompanyName="+invoiceCompanyName+"&orderParam.invoiceTaxpayerNO="+invoiceTaxpayer
				+"&orderParam.usualAddressId="+usualAddressId
				+"&skuId="+skuId+"&num="+num+"&orderParam.provinceName="+provinceName
				+"&orderParam.cityName="+cityName+"&orderParam.countyName="+countyName+"&orderParam.townName="+townName
				+"&orderParam.codTimeType="+codTimeType
				+"&orderParam.mobileKey="+consigneeMobileKey+"&eid="+eid+"&fp="+fp;
	var actionUrl = SECKILL_DOMAIN + "seckill/submitOrder.action?skuId="+skuId+"&vid="+vid;
	jQuery.ajax( {
		type : "POST",
		dataType : "text",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult) {
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (!isEmpty(dataResult)) {
				if("price_Expire" == dataResult){
					errorMessage = "您所抢购的商品优惠时间已过，请刷新重新提交订单？";
					$("#submit_message").text(errorMessage);
					$("#submit_message").show();
					return;
				}
				if("taxpayer_invalid" == dataResult){
					errorMessage = "请填写准确的纳税人识别号或统一社会信用代码";
					$("#submit_message").text(errorMessage);
					$("#submit_message").show();
					$("#order-submit").removeAttr("disabled");
					return;
				}
				window.location.href = dataResult;
				return;
			}else{
				window.location.href = SECKILL_DOMAIN + "koFail.html";
				return;
			}
		},
		error : function(XMLHttpResponse) {
			return false;
		}
	});
}


function isUserNotLogin(data){
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
}


/**
 * 去登录页面
 */
function goToLogin() {
	    var loginUrl = "https://passport.jd.com/new/login.aspx";
		window.location.href = loginUrl + "?rid=" + Math.random();
}


/**
 * 进入结算页异步加载信息
 */
function loadSeckillPage(){
	if($("#pageName").val()=="order"){
		if(isEmpty($("#submitName").val())){
			edit_Consignee();
		}else{
			var provinceName = $("#submitProvinceName").val();
			var cityName = $("#submitCityName").val();
			var countyName = $("#submitCountyName").val();
			var townName = $("#submitTownName").val();
			$("#consigneeInfoDiv").html("<p>"+$("#submitName").val()+"&nbsp;&nbsp;&nbsp;"+$("#submitMobile").val()
					+"<br/>" +provinceName + cityName + countyName + townName +$("#submitAddress").val()+"</p>");
		}
		showOrderPrice();
	}
}

function addNum(){
	var skuNum = parseInt($("#numberId").val());
	var limitNum = parseInt($("#limitNumId").val());
	if(isNaN(skuNum)){
		alert('请输入正确的商品数量');
		return;
	}
	if(isNaN(limitNum)){
		limitNum = 999;
	}
	skuNum = skuNum + 1;
	//做个数量限制
	if(skuNum > limitNum){
		alert('此商品限购'+limitNum+'件');
		return;
	}
	$("#numberId").val(skuNum);
	redirectNum();
}

function reduceNum(){
	var skuNum = parseInt($("#numberId").val());
	if(isNaN(skuNum)){
		alert('请输入正确的商品数量');
		return;
	}
	//做数量限制
	if(skuNum == 1){
		alert('请输入正确的商品数量');
		return;
	}
	skuNum = skuNum - 1;
	$("#numberId").val(skuNum);
	redirectNum();
}

function redirectNum(){
	var skuNum = parseInt($("#numberId").val());
	var limitNum = parseInt($("#limitNumId").val());
	var num = parseInt($("#num").val());
	if(isNaN(skuNum)){
		alert('请输入正确的商品数量');
		return;
	}
	if(skuNum == num){
		return;
	}
	if(isNaN(limitNum)){
		limitNum = 999;
	}
	if(skuNum <= 0){
		alert('请输入正确的商品数量');
		return;
	}
	if(skuNum > limitNum){
		alert('此商品限购'+limitNum+'件');
		return;
	}
	var sid = $("#sid").val();
	var skuId = $("#skuId").val();
	var pru = $("#vid").val();
	window.location.href = SECKILL_DOMAIN+ "seckill/seckill.action?&skuId="+skuId+"&num="+skuNum +"&rid="+ Math.random() +"&pru="+pru;
}

loadSeckillPage();