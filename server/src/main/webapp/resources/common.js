/*util.js只用于提供工具方法，这次方法里不包含任何业务逻辑*/

/**
 * @version 0.0.1
 * @namespace Namespace
 * @author:sunmm
 * @description 创建一个命名空间,命名空间的父子关系使用半角点号"."隔开
 * @param {} namespacePath String 例："a.b.c"
 * @example <br/><br/>
 * 	Namespace.create("a.b.c");
 * 	a.b.c.num = 12;
 * 	a.b.c.str = "12";
 * 	a.b.c.Fun = function(){
 * 					alert("dd");
 * 				}
 * a.b.c.Obj = {a:"",c:""};
 * .....
 * @return {void}
 */
var Namespace = {};
Namespace.create =function(namespacePath){
	//以window为根
	var rootObject =window;
	//对命名空间路径拆分成数组
	var namespaceParts =namespacePath.split('.');
	for (var i =0;i <namespaceParts.length;i++) {
	   var currentPart =namespaceParts[i];
	   //如果当前命名空间下不存在，则新建一个Object对象，等效于一个关联数组。
	   if (!rootObject[currentPart]){
	      rootObject[currentPart]={};
	   }
	   rootObject =rootObject[currentPart];
	}
}; 

Namespace.create("util.ui");  //以下是实现UI效果的方法
util.ui = {    
	menuList : function(onedom,onedomli,twodom) {
				$(onedom).find(twodom).addClass("subnav").css("display","none"); 
				$(onedomli).hover(
					function(){
						$(this).addClass("hover");
						$(this).find(twodom).show('50');
					},
					function(){
						$(this).find(twodom).hide('10');
						$(this).removeClass("hover");
				});
	}, //menulist下拉二级菜单实现 如：menuList("ul.navmenu","ul>li","ul")
	
	switchTab : function (dot,block) {
					$(block).css("display","none"); 
					$(dot).first().addClass("on");
					$(block).first().css("display","block").addClass("current-panes");  
					$(dot).click(function() {
						var num = $(this).index();
						$(this).addClass("on");
						$(this).siblings().removeClass("on");
						$(block+':eq('+num+')').css("display","block").addClass("current-panes");
						$(block+':eq('+num+')').siblings(block).css("display","none").removeClass("current-panes");
				});
	}, //tabs切换效果实现 如：switchTab("ul.tabslist li",".tabsdiv")

	showOrHide : function (clickdom,showblock,jiantouUp,jiantouDowm,textb,textp) {
					$(clickdom).click(function(){
						if($(showblock).css("display") != "none"){
							$(showblock).hide();
							if(jiantouDowm){ 
								$(clickdom).find("i").removeClass(jiantouDowm).addClass(jiantouUp);
							}
							if(textb){
								$(clickdom).find("."+textb).show();
								$(clickdom).find("."+textp).hide();
							}
							
						}else{
							$(showblock).show();
							if(jiantouUp){
								$(clickdom).find("i").removeClass(jiantouUp).addClass(jiantouDowm);
							}
							if(textp){
								$(clickdom).find("."+textp).show();
								$(clickdom).find("."+textb).hide();
							}
						}
					});
	},//如：showOrHide(".ui-show-detail",".ui-order-detail-info","icon-ddxqp","icon-ddxqp")//后两个参数可缺省

	switchSelected : function (parentDot, crrentdot) {
					$(parentDot).each(function(){
						$(this).find(crrentdot).first().addClass("on"); 
						$(this).find(crrentdot).click(function() { 
							$(this).addClass("on");
							$(this).siblings().removeClass("on"); 
						}); 
					}); 
	}, //鼠标点击选中效果 switchSelected("ul","li")

	hoverSelected : function (parentDot, crrentdot) {
					$(parentDot).each(function(){
						$(this).find(crrentdot).hover(function() { 
							$(this).addClass("hover"); 
						},function () {
							$(this).removeClass("hover");
						}); 
					}); 
	}, //鼠标经过选中效果 hoverSelected("ul","li")

/*	inputBlur : function () { 
					$(".user-input").each(function(){
						var setvalue,valuenow;
						setvalue = $(this).attr("defaultValue"); 
						valuenow = $(this).attr("value"); 
						$(this).focus(function(){ 
							if((setvalue == valuenow)||valuenow==""){
								$(this).attr("value","").css({"color":"#555"}); 
							}
							valuenow = $(this).attr("value"); 
						});

						$(this).change(function(){
							valuenow = $(this).attr("value");
						});

						$(this).blur(function(){  
							if(valuenow==""){	 
								$(this).attr("value",setvalue).css({"color":"#CDCDCD"});
							}  
						}); 

					}); 
					
	}, //input输入框点击value清除 */


	inputBlur : function (inputDom) { 
					$(inputDom).each(function(){
						var setvalue,valuenow;
						setvalue = $(this).attr("value"); 
						valuenow = $(this).attr("value"); 
						$(this).focus(function(){ 
							if((setvalue == valuenow)||valuenow==""){
								$(this).attr("value","").css({"color":"#555"}); 
								if($(this).attr("type") == "password"){
									$(this).removeClass("password-input");
								}
							} 
							valuenow = $(this).attr("value"); 
						});

						$(this).change(function(){
							valuenow = $(this).attr("value");
						});

						$(this).blur(function(){  
							if(valuenow==""){	 
								$(this).attr("value",setvalue).css({"color":"#999"});
								if($(this).attr("type") == "password"){ 
									$(this).addClass("password-input");
								}
							}  
						}); 

					}); 
					
	} //input输入框点击value清除 
 
};

//自定义jquery的扩展方法
$.fn.noSelect = function(p) {
    if (p == null){
        prevent = true;
	}else{
        prevent = p;
	}
    if (prevent) {
        return this.each(function() {
            if ($.browser.msie || $.browser.safari) $(this).bind('selectstart', function() { return false; });
            else if ($.browser.mozilla) {
                $(this).css('MozUserSelect', 'none');
                $('body').trigger('focus');
            }
            else if ($.browser.opera) $(this).bind('mousedown', function() { return false; });
            else $(this).attr('unselectable', 'on');
        });
 
    } else {
        return this.each(function() {
            if ($.browser.msie || $.browser.safari) $(this).unbind('selectstart');
            else if ($.browser.mozilla) $(this).css('MozUserSelect', 'inherit');
            else if ($.browser.opera) $(this).unbind('mousedown');
            else $(this).removeAttr('unselectable', 'on');
        });
 
    }
}//实现文字不能被选中效果，如：$(".ui-show-detail").noSelect();

$(function(){   
	$("table.ui-record-table").find("tr:even").addClass("split");//td隔行显示不同底色
	//处理ie6透明
	if($.browser.version == "6.0"){
		DD_belatedPNG.fix(".icon, background");
	}  
	/*屏蔽不能修改部分不被选中效果*/
	$(".btn,.btn-white,.btn-large,.btn-large-white,.disabled").noSelect();//不可选中文字
	
	var borderBottomValue = $(window).height()-$("header").height() - $("nav.iconrept").height() - $(".rightbk").height() - 16;
	$(".rightbk").css("border-bottom",borderBottomValue+"px solid #E5E5E5");

	//左边栏点击收进去和展开
	$(".barline").find("span").click(function(){ 
		if($(this).hasClass("leftbar_hide")){
			$(".rightbk").animate({"margin-left":"12px"},400); 
			$(this).parents(".ui-leftbar").animate({"margin-left":"-190px"},400,function(){
				$(this).find(".leftbar_hide").addClass("leftbar_show").removeClass("leftbar_hide");   
			}); 
		}else{
			$(".rightbk").animate({"margin-left":"202px"},400);
			$(this).parents(".ui-leftbar").animate({"margin-left":"0"},"normal",function(){
				$(this).find(".leftbar_show").addClass("leftbar_hide").removeClass("leftbar_show");  	
			}); 
		}
	});
	//左一级菜单点击展开二级
	$(".left-menu").find(".pane").click(function(){
		if($(this).find(".icon").hasClass("pane-icon")){ 
			$(this).siblings(".paneli").hide();
			$(this).next(".paneli").show(); 
			$(this).find(".icon").addClass("pane-iconon").removeClass("pane-icon"); 
			$(this).siblings(".pane").find(".icon").addClass("pane-icon").removeClass("pane-iconon"); 
		}else{
			$(this).next(".paneli").hide();
			$(this).find(".icon").addClass("pane-icon").removeClass("pane-iconon"); 
		}
	});
	//左二级菜单点击展开三级
	$(".left-menu").find(".pane2").click(function(){
		if($(this).find(".icon").hasClass("pane2-icon")){ 
			$(this).siblings(".pane2li").hide();
			$(this).next(".pane2li").show(); 
			$(this).find(".icon").addClass("pane2-iconon").removeClass("pane2-icon"); 
			$(this).siblings(".pane2").find(".icon").addClass("pane2-icon").removeClass("pane2-iconon"); 
		}else{
			$(this).next(".pane2li").hide();
			$(this).find(".icon").addClass("pane2-icon").removeClass("pane2-iconon"); 
		}
	});
	//左菜单点击全展开
	$(".unflod-flod").find(".icon-unflod").click(function(){
		$(this).css("background-color","#fff").siblings(".icon-flod").css("background-color","#e7e7e7");
		$(".left-menu").find("span.pane-icon").addClass("pane-iconon").removeClass("pane-icon");
		$(".left-menu").find(".paneli").show();
		$(".left-menu").find(".left2menu").find("span.pane2-icon").addClass("pane2-iconon").removeClass("pane2-icon");
		$(".left-menu").find(".left2menu").find(".pane2li").show();
	});
	//左菜单点击全收起
	$(".unflod-flod").find(".icon-flod").click(function(){
		$(this).css("background-color","#fff").siblings(".icon-unflod").css("background-color","#e7e7e7");
		$(".left-menu").find("span.pane-iconon").addClass("pane-icon").removeClass("pane-iconon");
		$(".left-menu").find(".paneli").hide();  
		$(".left-menu").find(".left2menu").find("span.pane2-iconon").addClass("pane2-icon").removeClass("pane2-iconon");
		$(".left-menu").find(".left2menu").find(".pane2li").hide();
		$(".left-menu").find("a.current").parents(".paneli").show().prev(".pane").find("span.pane-icon").addClass("pane-iconon").removeClass("pane-icon");
		$(".left-menu").find("a.current").parent(".pane2li").show().prev(".pane2").find("span.pane2-icon").addClass("pane2-iconon").removeClass("pane2-icon");
	});
});