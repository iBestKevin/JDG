function generateVerifyCode() {
	var rand = $("#randomCode").val();
	var url = $("#codeUrl").val()+rand+"&rid="+Math.random();
	$("#captcha").attr("src",url);
}

function generateUserPhoneNumber(){
	jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: '/check/getUserPhoneNum.action',
        data: '',
        cache: false,
        success: function(dataResult) {
			if(dataResult.success){
				var mobile = dataResult.mobile;
				$("#consigneeMobile").val(mobile);
			}else{
				$("#consigneeMobile").val("");
			}
        },
        error: function(XMLHttpResponse) {}
    });
}

function loadSkuPriceForM(sku){
    try {
    	var skuStr = sku+"";
    	var skuArray = new Array();
    	var skuids = "";
    	if(skuStr.indexOf(",") != -1){
    		skuArray = skuStr.split(",");
    		for(i=0;i<skuArray.length;i++){
        		skuids = skuids+"J_"+skuArray[i]+","
        	}
        	skuids = skuids.substring(0,skuids.length-1);
    	}else{
    		skuids = "J_"+skuStr;
    	}    	
        jQuery.ajax({
            url:'//p.3.cn/prices/mgets?skuids='+skuids+'&source=buyNum&callback=?',
            dataType: "jsonp",
            scriptCharset: "utf-8",
            'success':function(data){
            	if(data && data.length > 0){
					$.each(data, function (n, value) {
						var sku = value.id.replace("J_","");
		                var price = value.p;
//		                var temp = parseInt(price);
		                if(price!="" && price!="-1" && price!="0"){
		                	$("#price_"+sku).html("￥"+price);
		                    $(".jcode_skuPrice_"+sku).html('￥'+price);
		                }else{
		                	
		                	$("#price_"+sku).html("已下柜");
		                    $(".jcode_skuPrice_"+sku).html("已下柜");
		                    $("#hot_"+sku).remove();
		                }
//		                $("#price_"+sku).html("￥"+price);
					});
					
				}
            }
        });
    } catch (e) {
    }
}


function loadSkuPriceForHot(sku,list){
    try {
    	var skuStr = sku+"";
    	var skuArray = new Array();
    	var skuids = "";
    	if(skuStr.indexOf(",") != -1){
    		skuArray = skuStr.split(",");
    		for(i=0;i<skuArray.length;i++){
        		skuids = skuids+"J_"+skuArray[i]+","
        	}
        	skuids = skuids.substring(0,skuids.length-1);
    	}else{
    		skuids = "J_"+skuStr;
    	} 
    	skuids = skuids.substring(0,skuids.length-1);
        jQuery.ajax({
            url:'//p.3.cn/prices/mgets?skuids='+skuids+'&source=buyNum&callback=?',
            dataType: "jsonp",
            scriptCharset: "utf-8",
            'success':function(data){
            	if(data && data.length > 0){
					$.each(data, function (n, value) {
						var sku = value.id.replace("J_","");
		                var price = value.p;
//		                var temp = parseInt(price);
		                $.each(list, function (m, entity) {
							var sku_entity = entity.id;
							if(sku_entity == sku){
								if(price!="" && price!="-1" && price!="0"){
									entity.price ="￥"+price;
				                }else{
				                	entity.price = "-1";
				                }
								return false;
							}
						});
					});
					
					return list;
				}
            }
        });
    } catch (e) {
    }
}

function getPresellInfoGroup(){
	var sku = $("#sku").val();
	var flag = $("#flag").val();
	jQuery.ajax({
		type:"POST",
        dataType: "json",
        url: '/check/getPresellInfoGroup.action',
        data: 'sku='+sku+'&flag='+flag,
        cache: false,
        success: function(data) {
			if(data){
				var u = '//img11.360buyimg.com/n6/';
				var skuid = data[0].sku;
				var name = data[0].name;
				var url = data[0].url;
				var time = data[0].time;
				var itemUrl = '//item.jd.com/'+skuid+'.html';
				var html1='<div class="bd-left-up clearfix">'
					   +     '<div class="bd-img-wrap">'
					   +         '<a href="'+itemUrl+'" target="_blank" clstag="pageclick|keycount|201602011|1">'
					   +            '<img src="'+u+'s160x160_'+url+'" style="width: 160px;height: 160px;" id="share_'+skuid+'"></a>'
					   +      '</div>'
					   +      '<div class="bd-content">'
					   +          '<p class="bd-content-intro">'+ name +'</p>'
					   +           '<span class="bd-content-price" id="price_'+skuid+'"></span>'
					   +       '</div>'
					   +   '</div>';
				
				if(flag == 1 && data.length > 1){
					html1 = html1 + '<div class="bd-left-down"> <p class="down-title">同时也享有以下商品抢购资格</p>    <ul class="clearfix">';
					$.each(data, function (n, value) {
						if(n != 0){
							var skuid1 = value.sku;
							var name1 = value.name;
							var url1 = value.url;
							var index1 = n + 1;
							html1 = html1 + '<li> <a href="//item.jd.com/'+skuid1+'.html" target="_blank" clstag="pageclick|keycount|201602011|'+index1+'">   <img src="'+u+'s66x66_'+url1+'" style="width: 66px;height: 66px;" title="'+name1+'"></a> </li>' ;
						}
			        });
					
					html1 = html1 + "</ul> </div>";
				}
				
				$("#yuyueInfo").text("");
				$("#yuyueInfo").append(html1);
//				if(time && time != undefined && time != "undefined"){
//					$("#panictimearea").append('商品将于<span class="time-details">'+ time +'</span>准时开售');
//				}
				
				loadSkuPriceForM(skuid);
				
				
			}
        },
        error: function(XMLHttpResponse) {}
    });
}

function init_recommd() {
	
	var sku = $("#sku").val();
	var type = $("#type").val();
	var redirecturl;
	var arr = type.split("_");
	if(arr[0] == 0){
		redirecturl = '//iaccy.jd.com/accessories/accessoryCenter/'+sku+'.html';
	}else if(arr[0]==1){
		redirecturl = '//kong.jd.com/mobile/accyCenter?sku='+sku+'&category=7';
	}else{
		redirecturl = '//yxpeijian.jd.com/accyCenter/selfChoose?sku='+sku;
	}
	$.ajax({
		url : "//iaccy.jd.com/accRecommd/"+arr[1]+"/"+sku,
		dataType : "jsonp",
		success : function(data){
			if(data && data.list.length > 0){
				var u = '//img11.360buyimg.com/n6/s160x160_';
			    var list = data.list;
				var skus = "";
				var htmltab = "";
				var htmlul="";
				var htmlLeft="";
				
				htmlLeft = htmlLeft +  '<div class="recommend match clearfix">'
			    			+	    '<div class="recommend-line"></div>'
			    			+		'<div class="recommend-title"></div>'
			    			+  '</div>'
				            + '<div class="left-bar left-bar-match">'
				            +    '<img src="//misc.360buyimg.com/user/discovery/1.0.1/widget/recommend/i/left-bar-match.png" style="width: 230px;height: 350px;">'
				            +    '<div class="left-bar-btn">'
				            +        ' <a href="'+redirecturl+'" clstag="pageclick|keycount|201602011|40">发现好搭档去逛逛<i></i></a>'
				            +    '</div>';
				            
				
				htmltab = htmltab + '<div class="match-bar">';
				
				var firstTab = -1;
				var totalTab = 0;
				$.each(list, function (n, value) {
					if(totalTab == 6){
						return false;
					}
					var accessoryShows = value.accessoryShows;
					if(accessoryShows.length == 0){
							return true;
					}
					
					totalTab = totalTab + 1;
					if(firstTab == -1){
						firstTab = n;
					}
					
					var typeName = value.typeName;//设置标签名字
					if(n == firstTab){
						htmltab = htmltab + '<div class="match-bar-item init selected  recommendtab" id="'+n+'">'+typeName+'</div>';
					}else{
						htmltab = htmltab + '<div class="match-bar-item  recommendtab" id="'+n+'" >'+typeName+'</div>';
					}
					
					htmlul = htmlul + '<div class="recommend-list-wrap"> <ul class="recommend-list familarul" id="familarul_'+n+'">';
					
					var logindex = 40;
					$.each(accessoryShows,function (m,product){
						logindex = logindex + 1;
						if(m > 3){
							return false;
						}
						
						var li='<li>';
						if(m ==2){
						    li = '<li class="li-r-z">';
						}
						if(m ==3){
							 li = '<li class="li-r">';
						}
						
						var img = product.imageUrl;
						var price = product.wMaprice.toFixed(2);
						var name = product.wName;
						var sku = product.wid;
						skus = skus + "," + sku;
						var itemUrl = '//item.jd.com/'+sku+'.html';
		                htmlul = htmlul + li
						+      '<a href="'+itemUrl+'" clstag="pageclick|keycount|201602011|'+logindex+'">'
						+         '<p class="item-name">'+name+'</p>'
						+         '<p class="item-img"> <img src="'+u+img+'" alt="" width=160 height=160></p>'
						+         '<p class="item-price">￥'+price+'</p>'
						+         '<p class="item-evaluate">已有<span class="item-evaluate-num" id="'+sku+'_comment1"></span>人评价&nbsp;&nbsp;好评<span class="item-evaluate-ratio" id="'+sku+'_rate1"></span></p>'
						+      '</a>'
						+      '<div class="item-buy">'
						+         '<p class="item-price">￥'+price+'</p>'
						+         '<p class="item-evaluate">已有<span class="item-evaluate-num" id="'+sku+'_comment2"></span>人评价</p>'
						+         '<p class="item-evaluate">好评<span class="item-evaluate-ratio" id="'+sku+'_rate2"></span></p>'
						+         '<p class="item-buy-btn">'
						+            '<a href="'+itemUrl+'" clstag="pageclick|keycount|201602011|'+logindex+'" class="buy-btn-a">立即购买</a>'
						+         '</p>'
						+       '</div>'
						+     '</li>';
					});
					
					htmlul = htmlul + '</ul> </div> ';
					
		        });
			
			htmltab = htmltab + "</div>";
			
			htmlLeft = htmlLeft + htmltab + '</div>' + htmlul + '<div style="clear:both"></div>';
			
			$("#recommend_list_all").text("");
			$("#recommend_list_all").append(htmlLeft);
			
			RecommendList.init();
			RecommendTab.init();
			if(skus && skus.length > 0){
				var skuStr = skus.substring(1);
				get_comment(skuStr);
			}
			
			$(".familarul").hide();
			$("#familarul_"+firstTab).show();
			
			if(firstTab == -1){
				$("#recommend_list_all").hide();
			}
			
		 }
		},
		error: function(XMLHttpResponse) {}
	});
}
function init_similar(){
	var sku = $("#sku").val();
	var type = $("#type").val();
	var arr = type.split("_");
	if(arr[0] == 0 || arr[0] == 2){
		return;
	}
	var url = "//diviner.jd.com/diviner?p=619032&uuid=124463704&sku="+sku+"&skus=&pin=&c1=&c2=&c3=&lid=1&lim=16&sp=&hi=&fe=&fne=&ro=&ec=utf-8";
	$.ajax({
		url : url,
		dataType : "jsonp",
		success : function(result){
			var list;
			if(result && result.data && result.data.length > 0){
			  list = result.data;
			  if(list && list.length > 0){
					var u = '//img11.360buyimg.com/n6/s160x160_';
					var skus = "";
					var outerimpr = result.impr;//
					var html = '';
					var html1 = '';
					var html2 ='';
					var htmltemp="";
					
					html = html + '<div class="recommend recommend-index clearfix">'
					            +      '<div class="recommend-line"></div>'
					            +      '<div class="recommend-title"></div>'
					            +      '<div class="recommend-tab clearfix">'
					            +      '<div class="recommend-tab-1" id = "familar_1" onclick="setTab(1)">1</div>'
					            +      '<div class="recommend-tab-2" id = "familar_2" onclick="setTab(2)">2</div>'
					            +      '</div>  </div>'
					            + '<div class="left-bar left-bar-recommend">'
					            +      '<img src="//misc.360buyimg.com/user/discovery/1.0.1/widget/recommend/i/left-bar-discovery.png" style="width: 230px;height: 715px;">'
					            +      '<div class="left-bar-btn">'
					            +           '<a href="//shouji.jd.com/" clstag="pageclick|keycount|201602011|20">发现好货去逛逛<i></i></a>'
					            +      '</div>'
					            + '</div>';
					            
				$.each(list, function (n, value) {
					if(n > 15){
						return false;
					}
					var sku = value.sku;
					var img = value.img;
					var clk = value.clk;
					var innerimpr = value.impr;
					var price = value.jp;
					var name = value.t;
					
					var logindex = n + 21;
					
					if(n > 7){
						logindex = logindex - 8;
					}
					
					var itemUrl = '//item.jd.com/'+sku+'.html';
					skus = skus + "," + sku;
					
					var li='<li>';
					if(n ==2 || n == 6 || n== 10 || n== 14){
					    li = '<li class="li-r-z">';
					}
					if(n ==3 || n == 7 || n== 11 || n== 15){
						 li = '<li class="li-r">';
					}
					
					htmltemp = htmltemp + li
							+      '<a href="'+itemUrl+'" clstag="pageclick|keycount|201602011|'+logindex+'">'
							+         '<p class="item-name">'+name+'</p>'
//							+         '<p class="item-intro">好到违反广告法的玩家神器</p>'
							+         '<p class="item-img"> <img src="'+u+img+'" alt="" width=160 height=160></p>'
							+         '<p class="item-price">￥'+price+'</p>'
							+         '<p class="item-evaluate">已有<span class="item-evaluate-num" id="'+sku+'_comment1"></span>人评价&nbsp;&nbsp;好评<span class="item-evaluate-ratio" id="'+sku+'_rate1"></span></p>'
							+      '</a>'
							+      '<div class="item-buy">'
							+         '<p class="item-price">￥'+price+'</p>'
							+         '<p class="item-evaluate">已有<span class="item-evaluate-num" id="'+sku+'_comment2"></span>人评价</p>'
							+         '<p class="item-evaluate">好评<span class="item-evaluate-ratio" id="'+sku+'_rate2"></span></p>'
							+         '<p class="item-buy-btn">'
							+            '<a href="'+itemUrl+'" clstag="pageclick|keycount|201602011|'+logindex+'" class="buy-btn-a">立即购买</a>'
							+         '</p>'
							+       '</div>'
							+     '</li>';
					
					
					if(n > 7 && n==(list.length-1)){
						html2 = htmltemp;
					}
					
					if(n==7 || (n < 8 && n==(list.length-1))){
					    html1 = htmltemp;
						htmltemp ='';
					}
			    });
				
				if(html1){
					html = html + '<div class="recommend-list-wrap">  <ul class="recommend-list" id="familar_1ul">'
					            + html1
					            + '</ul>  </div>';
				}
				
				if(html2){
					html = html + '<div class="recommend-list-wrap">  <ul class="recommend-list" id="familar_2ul">'
					            + html2
					            + '</ul>  </div>';
				}
				$("#familar_list_all").text("");
				$("#familar_list_all").append(html + '<div style="clear:both"></div>');
				if(skus && skus.length > 0){
					var skuStr = skus.substring(1);
					get_comment(skuStr);
				}
				
//				if(!html2){
//					$("#familar_2").hide();
//				}
				$("#familar_1ul").show();
				$("#familar_2ul").hide();
				RecommendList.init();
				Recommend.init();
			 }
			}else{
				$.ajax({
					url : '//diviner.jd.com/diviner?p=619001&uuid=69021425&sku=655&skus=&pin=&c1=&c2=&c3=655&lid=1&lim=16&sp=&hi=&fe=&fne=yes&ro=&ec=utf-8',
					dataType : "jsonp",
					success : function(result1){
						if(result1 && result1.data.length > 0){
							  list = result1.data;
							  if(list && list.length > 0){
									var u = '//img11.360buyimg.com/n6/s160x160_';
									var skus = "";
									var outerimpr = result.impr;//
									var html = '';
									var html1 = '';
									var html2 ='';
									var htmltemp="";
									
									html = html + '<div class="recommend recommend-index clearfix">'
									            +      '<div class="recommend-line"></div>'
									            +      '<div class="recommend-title"></div>'
									            +      '<div class="recommend-tab clearfix">'
									            +      '<div class="recommend-tab-1" id = "familar_1" onclick="setTab(1)">1</div>'
									            +      '<div class="recommend-tab-2" id = "familar_2" onclick="setTab(2)">2</div>'
									            +      '</div>  </div>'
									            + '<div class="left-bar left-bar-recommend">'
									            +      '<img src="//misc.360buyimg.com/user/discovery/1.0.1/widget/recommend/i/left-bar-discovery.png" style="width: 230px;height: 715px;">'
									            +      '<div class="left-bar-btn">'
									            +           '<a href="//shouji.jd.com/" clstag="pageclick|keycount|201602011|20">发现好货去逛逛<i></i></a>'
									            +      '</div>'
									            + '</div>';
									            
								$.each(list, function (n, value) {
									if(n > 15){
										return false;
									}
									var sku = value.sku;
									var img = value.img;
									var clk = value.clk;
									var innerimpr = value.impr;
									var price = value.jp;
									var name = value.t;
									
									var logindex = n + 21;
									
									if(n > 7){
										logindex = logindex - 8;
									}
									
									var itemUrl = '//item.jd.com/'+sku+'.html';
									skus = skus + "," + sku;
									
									var li='<li>';
									if(n ==2 || n == 6 || n== 10 || n== 14){
									    li = '<li class="li-r-z">';
									}
									if(n ==3 || n == 7 || n== 11 || n== 15){
										 li = '<li class="li-r">';
									}
									
									htmltemp = htmltemp + li
											+      '<a href="'+itemUrl+'" clstag="pageclick|keycount|201602011|'+logindex+'">'
											+         '<p class="item-name">'+name+'</p>'
//											+         '<p class="item-intro">好到违反广告法的玩家神器</p>'
											+         '<p class="item-img"> <img src="'+u+img+'" alt="" width=160 height=160></p>'
											+         '<p class="item-price">￥'+price+'</p>'
											+         '<p class="item-evaluate">已有<span class="item-evaluate-num" id="'+sku+'_comment1"></span>人评价&nbsp;&nbsp;好评<span class="item-evaluate-ratio" id="'+sku+'_rate1"></span></p>'
											+      '</a>'
											+      '<div class="item-buy">'
											+         '<p class="item-price">￥'+price+'</p>'
											+         '<p class="item-evaluate">已有<span class="item-evaluate-num" id="'+sku+'_comment2"></span>人评价</p>'
											+         '<p class="item-evaluate">好评<span class="item-evaluate-ratio" id="'+sku+'_rate2"></span></p>'
											+         '<p class="item-buy-btn">'
											+            '<a href="'+itemUrl+'" clstag="pageclick|keycount|201602011|'+logindex+'" class="buy-btn-a">立即购买</a>'
											+         '</p>'
											+       '</div>'
											+     '</li>';
									
									
									if(n > 7 && n==(list.length-1)){
										html2 = htmltemp;
									}
									
									if(n==7 || (n < 8 && n==(list.length-1))){
									    html1 = htmltemp;
										htmltemp ='';
									}
							    });
								
								if(html1){
									html = html + '<div class="recommend-list-wrap">  <ul class="recommend-list" id="familar_1ul">'
									            + html1
									            + '</ul>  </div>';
								}
								
								if(html2){
									html = html + '<div class="recommend-list-wrap">  <ul class="recommend-list" id="familar_2ul">'
									            + html2
									            + '</ul>  </div>';
								}
								$("#familar_list_all").text("");
								$("#familar_list_all").append(html + '<div style="clear:both"></div>');
								if(skus && skus.length > 0){
									var skuStr = skus.substring(1);
									get_comment(skuStr);
								}
								
//								if(!html2){
//									$("#familar_2").hide();
//								}
								$("#familar_1ul").show();
								$("#familar_2ul").hide();
								RecommendList.init();
								Recommend.init();
							 }
						}
					}
				});
			
			}
		},
		 error: function(XMLHttpResponse) {}
	});
}

function init_hot(){
	var sku = $("#sku").val();
	$.ajax({
		type:"POST",
		url : '/check/getHotPresell.action',
		data: 'sku='+sku,
		dataType : "json",
		success : function(result){
			if(result && result.length > 0){
				var u = '//img11.360buyimg.com/n6/s160x160_';
				var skus = "";
				var outerimpr = result.impr;//
				var htmlHead = '';
				var htmlUl = '';
				var htmlLi ='';
				var htmlTotal="";
				
				htmlHead = htmlHead + '<div class="recommend booking clearfix">'
				            +      '<div class="recommend-line"></div>'
				            +      '<div class="recommend-title"></div>'
				            + '</div>'
				            + '<div class="left-bar left-bar-booking">'
				            +      '<img src="//misc.360buyimg.com/user/discovery/1.0.1/widget/recommend/i/left-bar-booking.png" style="width: 230px;height: 350px;">'
				            +      '<div class="left-bar-btn">'
				            +           '<a href="//xinpin.jd.com/" clstag="pageclick|keycount|201602011|70">京东新发现去逛逛<i></i></a>'
				            +      '</div>'
				            + '</div>';
				
				htmlUl = htmlUl   + '<div class="recommend-list-wrap">'
				                  +      '<ul class="recommend-list" >';
				
				var logindex = 70;
			$.each(result, function (n, value) {
				var sku = value.sku;
				var url = value.url;
				var name = value.name;
				var time = value.time;
				var count = value.count;
				logindex = logindex + 1;
				
				var itemUrl = '//item.jd.com/'+sku+'.html';
				skus = skus + "," + sku;
				
				var li='<li id="hot_'+sku+'">';
				
				if(n ==2){
				    li = '<li class="li-r-z" id="hot_'+sku+'">';
				}
				if(n ==3){
					 li = '<li class="li-r" id="hot_'+sku+'">';
				}
				
				htmlLi = htmlLi + li
						+      '<a href="'+itemUrl+'" clstag="pageclick|keycount|201602011|'+logindex+'">'
						+         '<p class="item-name">'+name+'</p>'
//						+         '<p class="item-intro">好到违反广告法的玩家神器</p>'
						+         '<p class="item-img"> <img src="'+u+url+'" alt="" width=160 height=160></p>'
						+         '<p class="item-price jcode_skuPrice_'+sku+'"></p>'
						+         '<p class="item-evaluate">已有<span class="item-evaluate-num">'+count+'</span>人预约</p>'
						+      '</a>'
						+      '<div class="item-buy">'
						+         '<p class="item-price jcode_skuPrice_'+sku+'"></p>'
						+         '<p class="item-evaluate">已有<span class="item-evaluate-num">'+count+'</span>人预约</p>'
						+         '<p class="item-evaluate p-countdown" id="'+sku+'_time"><span class="item-evaluate-ratio"></span></p>'
						+         '<p class="item-buy-btn">'
						+            '<a href="'+itemUrl+'" clstag="pageclick|keycount|201602011|'+logindex+'" class="buy-btn-a">立即抢购</a>'
						+         '</p>'
						+       '</div>'
						+     '</li>';
	        });
			
			htmlTotal = htmlHead + htmlUl + htmlLi +  '</ul> </div>' + '<div style="clear:both"></div>';
			$("#hot_list_all").hide();
			$("#hot_list_all").text("");
			$("#hot_list_all").append(htmlTotal);
			$.each(result, function (n, value) {
				var sku1 = value.sku;
				var time = value.time;
				timeLeft(time,$("#"+sku1+"_time"));
	        });
			var skuStr = skus.substring(1);
			loadSkuPriceForM(skuStr);
			$("#hot_list_all").show();
			RecommendList.init();
		 }
		},
		 error: function(XMLHttpResponse) {}
	});
}

function timeLeft(left,target){
	if(left>0){
		var now = new Date((left*1000) + (new Date()).getTime()); 
		target.attr("data-time",now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds());
		//target.html("<em>icon</em><span></span>");
		
		pTimeCountDown(target);
	}
}
function change_button(node) {}

function pTimeCountDown(_this){
	seajs.use(['//misc.360buyimg.com/jdf/1.0.0/ui/countdown/1.0.0/countdown'],function(countdown){
		//创建组件
		_this.countdown({
			isTwoDigits:true,
			endTime:_this.attr('data-time'),
			onEnd:function() {
				//$('span',this.el).html("已开始");
//				change_button(this.el.parent().parent());
			},
			onChange:function(leaveTime){
				_this.find("span").html("剩余 " + leaveTime.day + "天 " + leaveTime.hour + ":" + leaveTime.minute + ":" + leaveTime.second);
			}
		});
	});
};

var RecommendList = {
		init: function() {
			var that = this;
			//购买弹出
			var timer1;
			$('.recommend-list-wrap').delegate('li','mouseenter',function(event) {
				$(this).find('.item-buy').stop(false, true);
				$(this).removeClass('hoverout').find('.item-buy').animate({
					top: 170
				},300);
				timer1 = setTimeout(function() {
					$(this).addClass('hoverin');
				}, 300);
			}).delegate('li','mouseleave',function(event) {
				$(this).find('.item-buy').stop(false, true);
				clearTimeout(timer1);
				$(this).removeClass('hoverin').addClass('hoverout').find('.item-buy').animate({
					top: 350
				},300);
			});
		}
	};

var RecommendTab = {
		init: function() {
			var that = this;
			var timer1;
			$('.match-bar').delegate('div','mouseenter',function(event) {
				
			$('.match-bar').find('.selected').css({"margin-left": "0px", "width": "105px"});
			$('.match-bar').find('.selected').removeClass('selected');
		    $(this).addClass('selected');
		    $(this).css({"margin-left": "-20px", "width": "125px"});
			var id = $(this).attr('id');
			$(".familarul").hide();
			$("#familarul_"+id+"").show();
			}).delegate('div','mouseleave',function(event) {
				
			});
		}
	};

var Recommend = {
		init: function() {
			var that = this;
//			if ($('.match-bar').length != 0) {
//				$('.match-bar').delegate('.match-bar-item','mouseenter',function(event) {
//					$('.init').removeClass('init');
//                    $('.selected').stop(false,true).animate({
//                        marginLeft: 0,
//                        width: 105
//                    },300).removeClass('selected');
//                    $(this).stop(false, true).addClass('selected').animate({
//                        marginLeft: -20,
//                        width: 125
//                    },300);
//				})
//			}
            //tab切换
            if ($('.recommend-tab').length != 0) {
                $('.recommend-tab').find('div').each(function(index, el) {
                    $(el).click(function() {
                        $('.recommend-tab-1').removeClass('recommend-tab-1');
                        $('.recommend-tab-2').removeClass('recommend-tab-2');
                        $(el).addClass('recommend-tab-1').siblings('div').addClass('recommend-tab-2');
                    })
                });
            }
		}
	};


function setTab(index){
	if(index==1){
		$("#familar_1ul").show();
		$("#familar_2ul").hide();
	}else{
		$("#familar_1ul").hide();
		$("#familar_2ul").show();
	}
}

//function setfamilar(index){
//	$(".familarul").hide();
//	$("#familarul_"+index+"").show();
//}

function get_comment(params){
	var result = {};
	$.ajax({
		url : "//club.jd.com/clubservice/summary-m-"+params+".html",
		dataType : "jsonp",
		success : function(data){
			if(data && data.CommentsCount.length > 0){	
			$.each(data.CommentsCount, function (n, value) {
//				result[value.SkuId + "_count"] = value.CommentCount;
//				result[value.SkuId + "_rate"] = value.GoodRate.toPercent();
				$("#"+value.SkuId+"_comment1").text(value.CommentCount);
				$("#"+value.SkuId+"_comment2").text(value.CommentCount);
				$("#"+value.SkuId+"_rate1").text(value.GoodRate.toPercent());
				$("#"+value.SkuId+"_rate2").text(value.GoodRate.toPercent());
	        });
		 }
			return result;
		},
		 error: function(XMLHttpResponse) {}
	});
}

Number.prototype.toPercent = function(){
	return Math.round(this * 10000/100) + '%';
}

function checkMobile(){
	 var mobile = $("#consigneeMobile").val();
     var isError = false;
     var errorMessage ="";
	 if(isEmpty(mobile)){
	 	   isError = true;
		   errorMessage = "请输入手机号";
	 }else{
		  var regu = /^\d{11}$/;
		  var re = new RegExp(regu);
		  if(!re.test(mobile)){
			  isError = true;
		      errorMessage = "请输入正确格式的手机号";
		  }
	 }
	 
//	 class="null error"
	 if(isError){
	 	$("#consigneeMobileErrorDiv").show();
	 	$("#consigneeMobileErrorDivSub").text(errorMessage);
	 }else{
	 	$("#consigneeMobileErrorDiv").hide();
	 }
	 return !isError;
}


function sendMobileCode(){
		var mobile=$("#consigneeMobile").val();
		if(!checkMobile()){
			return ;
		}
		$("#sendMobileCodeBtn").attr("class","btn-gray");
		var sku =$("#sku").val();
		var key =$("#keyForSku").val();
		jQuery.ajax({
	        type: "POST",
	        dataType: "json",
	        url: '/sendMobileCode.action',
	        data: 'mobile='+mobile+'&sku='+sku+'&key='+key,
	        cache: false,
	        success: function(dataResult) {
				if(dataResult.success){
					$("#consigneeMobileErrorDiv").hide();
					//倒计时
					$("#sendMobileCodeBtn").attr("class","btn-gray");
					$("#sendMobileCodeBtn").text("120秒后重新获取");
					setTimeout(countDown,1000);
				}else{
					var errorMessage=dataResult.errorMessage;
					$("#consigneeMobileErrorDivSub").text(errorMessage);
					$("#consigneeMobileErrorDiv").show();
	                $("#sendMobileCodeBtn").attr("class","btn-comm");
				}
	        },
	        error: function(XMLHttpResponse) {}
	    });
}

/**
 * 发送验证码倒计时
 * 
 * @return
 */
function countDown(){
	var text=$("#sendMobileCodeBtn").text();
	var secondTxt=text.substring(0,text.indexOf("秒"));
	var second=parseInt(secondTxt);
	if(second<=0){
		$("#sendMobileCodeBtn").attr("class","btn-comm");
		$("#sendMobileCodeBtn").text("获取验证码");
	}else{
		second--;
		$("#sendMobileCodeBtn").text(second+"秒后重新获取");
		setTimeout(countDown,1000);
	}
}


function checkMobileCode(){
	var code=$("#consigneeMobileCode").val();
	var mobile=$("#consigneeMobile").val();
	var sku =$("#sku").val();
	var key =$("#keyForSku").val();
	if(isEmpty(code)){
		$("#consigneeMobileCodeErrorDiv").text("验证失败，请核对手机号和验证码，必要时重新获取");
		$("#consigneeMobileCodeErrorDiv").show();
        return;
	}
	jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: '/validateMobileCode.action',
        data: 'code='+code+'&mobile='+mobile+'&sku='+sku+'&key='+key,
        cache: false,
        success: function(dataResult) {
			if(dataResult.success){
				$("#consigneeMobileCodeErrorDiv").text("");
				$("#consigneeMobileCodeErrorDiv").hide();
			}else{
				$("#consigneeMobileCodeErrorDiv").text("验证失败，请核对手机号和验证码，必要时重新获取");
				$("#consigneeMobileCodeErrorDiv").show();
				return;
			}
		},
        error: function(XMLHttpResponse) {}
    });
}




function isEmpty(value){
	if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
		return true;
	}
	else{
		value = value.replace(/\s/g,"");
		if(value == ""){
			return true;
		}
		return false;
	}
}

function yuyue(){
	if(!checkMobile()){
		return;
	}
	var sku =$("#sku").val();
	var key =$("#keyForSku").val();
	var mobile=$("#consigneeMobile").val();
	var mobileCode=$("#consigneeMobileCode").val();
	if(isEmpty(mobileCode)){
		mobileCode="";
	}
	
	var $me = $(this).attr("disabled", true);
	var value = $('#vvalue').val();
	jQuery.ajax({
				type: "POST",
		        dataType: "json",
		        url: '/check/validateRandomCode.action',
		        data: 'vvalue=' + value+ "&sku="+$("#sku").val(),
				success : function(data) {
					$me.attr("disabled", false);
					if (data ==true || data =="true") {
						$("#captchaErrorDiv").hide();
						if(isEmpty(mobile)){
							mobile="";
						}
						location.href="//yushou.jd.com/yuyue.action?"+'mobileCode='+mobileCode+'&mobile='+mobile+'&sku='+sku+'&key='+key+"&vvalue="+value;
						return;
					} else {
						$("#captchaErrorDiv").show();
//						$("#captchaErrorDiv").text("验证码错误");
						generateVerifyCode();
						return;
					}
				},
				error: function(data){
					$("#captchaErrorDiv").show();
//					$("#captchaErrorDiv").text("验证码错误");
					generateVerifyCode();
					return;
				}
	});
}

function shareYushou(){
	var sku = $("#sku").val();
	var link = '//fenxiang.jd.com/shareFront/initShareIcons.action?sku='+sku+'&flag=3';
	seajs.use(['jdf/1.0.0/ui/dialog/1.0.0/dialog'],function(){ 
        $('body').dialog({
            title:"分享",
            width:576, 
            type:'iframe', 
            source:link
        }); 
    });
}

//页面初始化
$(document).ready(function() {
	$("#consigneeMobileErrorDiv").hide();
	$("#captchaErrorDiv").hide();
	generateVerifyCode();
	//generateUserPhoneNumber();
	getPresellInfoGroup();
	init_recommd();
	init_similar();
	init_hot();
});