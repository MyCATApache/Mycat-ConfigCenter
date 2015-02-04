$(document).ready(function() {
	$("#browser").treeview({
	  collapsed: true
	});
	function replaceToPath(nodeId) {
		var nodePath = nodeId;
//		alert("before nodeId:" + nodePath);
		nodePath = nodePath.replace(new RegExp("△","gm"),"/");
		nodePath = nodePath.replace(new RegExp("☆","gm"),".");
		
		
//		alert("after nodeId:" + nodePath);
		
		return nodePath;
	}
	
	function replaceFromPath(nodePath) {
		var nodeId = nodePath;
//		alert("before nodeId:" + nodeId);
		nodeId = nodeId.replace(new RegExp("/","gm"),"△");
		nodeId = nodeId.replace(new RegExp("\\.","gm"),"☆");
//		alert("after nodeId:" + nodeId);
		return nodeId;
	}
	
	// 设置节点信息
	setZNodeInfo(null);

	/**
	 * 点击文件夹或文件
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	$("span.folder, span.file").live("click", function() {
		if (!this.id) {
		  alert("该节点不存在，页面将进行刷新！");
		  window.location.reload();
		  return;
		}
		
		$("input:disabled").removeAttr("disabled");
		$(".isShow").show();
		$("#znode_name").attr("disabled", "disabled");
		$("#znode_path").attr("disabled", "disabled");
		$("#addZNode").hide();
		$("#deleteZNode").hide();
		var nodeId = this.id;
		var path = replaceToPath(nodeId);
		
		// 选择节点
		selectZNode($("#" + nodeId));
		// 取得节点信息
		$.getJSON(basePath + "/configAjax/getZNode", {path: path}, function(resultMap) {
		  var msg = resultMap.msg;
		  var znode = resultMap.znode;
		  
		  // 设置节点信息
		  setZNodeInfo(znode);
		  
		  if (msg != "succ") {
			  $("#errDiv").html(msg);
			  $("#errDiv").fadeIn("slow");
			  return;
		  }
		});

		// 取得子节点，展开文件夹
		$.getJSON(basePath + "/configAjax/getChildren", {path: path}, function(resultMap) {
		var msg = resultMap.msg;
		var znodeList = resultMap.znodeList;
		if (msg != "succ") {
		  $("#errDiv").html(msg);
		  $("#errDiv").fadeIn("slow");
		  return;
		}

		// 清空该节点下的ul内容
		$("#" + nodeId).next("ul").empty();

		if (znodeList == null || znodeList.length == 0) {
		  // 点击文件
		  $("#" + nodeId).removeAttr("class");
		  $("#" + nodeId).addClass("file");
		  
		  // 编辑时，name、path、add不可修改
		  $("input:disabled").removeAttr("disabled");
		  $(".isShow").show();
		  $("#znode_name").attr("disabled", "disabled");
		  $("#znode_path").attr("disabled", "disabled");
		  $("#addZNode").hide();
		  $("#addZNode").hide();
		} else {
			
		  // 当文件夹前为加号时
		  if ($("#" + nodeId).prev().hasClass("collapsable-hitarea")) {
			// 点击文件夹
			$("#" + nodeId).removeAttr("class");
			$("#" + nodeId).addClass("folder");

			// 编辑时，name、path、add、delete不可修改
			
			// 添加分支
			var items = [];
			items.push("<ul>");
			$.each(znodeList, function(key, znode) {
			  if (znode.stat.numChildren == 0) {
				  items.push('<li><span id="' + znode.id + '" class="file">' + znode.name + '</span></li>');
			  } else {
				  items.push('<li class="closed"><span id="' + znode.id + '" class="folder">' + 
					  znode.name + '</span><ul></ul></li>');
			  }
			});
			items.push("</ul>");

			var branches = $(items.join('')).insertAfter("#" + nodeId);
			$("#browser").treeview({
				add: branches
			});
		  }
		}
		});
		
	});

	/**
	 * 点击更新
	 */
	$("#updateZNode").click(function() {
		
		if(!confirm("确认修改吗？")){
			return false;
		}
		var path = $("#znode_path").val();
		var data = $("#znode_data").val();
		
		//$.post("/configAjax/updateZNode", {path: path, data: data}, function(msg) {
		//	if (msg == "succ") {
		//		$("#succDiv").html(path + "节点更新成功！");
		//		$("#succDiv").fadeIn("slow");
		//	} else {
		//		$("#errDiv").html(msg);
		//		$("#errDiv").fadeIn("slow");
		//	}
		//});
		$.ajax({
			url: basePath + "/configAjax/updateZNode",
			data: {
				"path": path,
				"data": data
			},
			type: "POST",
			contentType:"application/x-www-form-urlencoded",
			success: function(msg) {
				if (msg == "succ") {
					$("#succDiv").html(path + "节点更新成功！");
					$("#succDiv").fadeIn("slow");
				} else {
					$("#errDiv").html(msg);
					$("#errDiv").fadeIn("slow");
				}
			}
		});
	});

	/**
	 * 点击删除
	 */
	$("#deleteZNode").click(function() {
		
	 if(!confirm("确认删除吗？")){
	 	return false;
	 }
	  var path = $("#znode_path").val();
	  $.get(basePath + "/configAjax/deleteZNode", {path: path}, function(msg) {
		  if (msg == "succ") {
			  $("#succDiv").html(path + "节点删除成功！");
			  $("#succDiv").fadeIn("slow");
			  
			  // 清除节点信息
			  setZNodeInfo(null);
			  
			  var parentPath = path.substring(0, path.lastIndexOf("/"));
			  if (parentPath == null || parentPath == "") {
				  var delNodeId = replaceFromPath(path);
				  $("#" + delNodeId).parent("li").remove();
			  } else {
				  var parentZnodeId = replaceFromPath(parentPath);
				  $("#" + parentZnodeId).click();
			  }
		  } else {
			  $("#errDiv").html(msg);
			  $("#errDiv").fadeIn("slow");
		  }
	  });
	});

	/**
	 * 点击添加
	 */
	$("#addZNode").click(function() {
		if(!confirm("确认添加吗？")){
			return false;
		}
		var path = $("#znode_path").val();
		var data = $("#znode_data").val();
		$.post(basePath + "/configAjax/addZNode", {path: path, data: data}, function(msg) {
			if (msg == "succ") {
				$("#succDiv").html(path + "节点添加成功！");
				$("#succDiv").fadeIn("slow");
				var znodeId = replaceFromPath(path);
				$("span[selected='selected']").attr("id", znodeId);
				var name = path.substring(path.lastIndexOf("/") + 1);
				$("span[selected='selected']").html(name);
				$("span[selected='selected']").click();
			} else {
				$("#errDiv").html(msg + "aaaaa");
				$("#errDiv").fadeIn("slow");
			}
		});
	});
	
	

	/**
	 * 提示信息消失
	 */
	$("span, input").live("click", function() {
	  $("#succDiv").fadeOut("slow");
	  $("#errDiv").fadeOut("slow");
	});

	/**
	 * 点击添加临时根节点
	 */
	$("#addZNodeRoot").click(function() {
	  $("span.folder, span.file").removeAttr("style");
	  $("span.folder, span.file").removeAttr("selected");
	  var newRootZNode = $("<li><span class='file' style='color: red; font-weight: bolder;' selected='selected'>temp</span></li>");
	  newRootZNode.appendTo("#browser");
	  $("#browser").treeview({
		  add: newRootZNode
	  });
	  
	  // 添加时，path、delete、update不可修改
	  $("input:disabled").removeAttr("disabled");
	  $(".isShow").show();
	  $("#znode_path").attr("disabled", "disabled");
	  $("#deleteZNode").hide();
	  $("#updateZNode").hide();
	 
	  // 节点信息初始化
	  setZNodeInfo(null);
	  $("#znode_name").val("temp");
	  $("#znode_path").val("/temp");
	});

	/**
	 * 点击添加临时子节点
	 */
	$("#addZNodeSub").click(function() {
	  var parentNode = $("span[selected='selected']");
	  if (parentNode == null || parentNode == undefined || parentNode.length == 0) {
		  alert("请选择一个节点");
	  } else {
		  $("span.folder, span.file").removeAttr("style");
		  $("span.folder, span.file").removeAttr("selected");
		  
		  var newRootZNode = $("<ul><li><span class='file' style='color: red; font-weight: bolder;' selected='selected'>temp</span></li></ul>");
		  newRootZNode.insertAfter(parentNode);
		  
		  var divHitArea = $('<div class="hitarea"></div>');
		  divHitArea.insertBefore(parentNode);
		  
		  parentNode.removeClass("file");
		  parentNode.addClass("folder");
		  
		  $("#browser").treeview({
			  add: newRootZNode
		  });
		  
		  // 添加时，path、delete、update不可修改
		  $("input:disabled").removeAttr("disabled");
		  $(".isShow").show();
		  $("#znode_path").attr("disabled", "disabled");
		  $("#deleteZNode").hide();
		  $("#updateZNode").hide();
		  
		  // 节点信息初始化
		  setZNodeInfo(null);
		  $("#znode_name").val("temp");
		  var parentNodeId = parentNode.attr("id");
		  var parentPath = replaceToPath(parentNodeId);
		  $("#znode_path").val(parentPath + "/temp");
	  }
	});
	
	/**
	 * 点击添加配置文件作为节点的子属性
	 */
	$("#fileUpload").submit(function() {
		var path = $("#znode_path").val();
		$("#path").val(path);
		
		var propertiesFile = $("#propertiesFile").val();
		if(propertiesFile == "") {
			alert("请选择文件");
			return false;
		}
		
		$(this).ajaxSubmit(function(msg) {
			if (msg == "succ") {
				$("#succDiv").html(path + "子节点添加成功！");
				$("#succDiv").fadeIn("slow");
				var znodeId = path.replace(new RegExp("/","gm"),"△");
				$("span[selected='selected']").attr("id", znodeId);
				var name = path.substring(path.lastIndexOf("/") + 1);
				$("span[selected='selected']").html(name);
				$("span[selected='selected']").click();
				window.location.reload();
			} else {
				$("#errDiv").html(msg);
				$("#errDiv").fadeIn("slow");
			}
		});
		return false;
	});
	

	/**
	 * 编辑name时，path同步
	 */
	$("#znode_name").keyup(function() {
	  var path = $("#znode_path").val();
	  var parentPath = path.substring(0, 1 + path.lastIndexOf("/"));
	  $("#znode_path").val(parentPath + $("#znode_name").val());
	});
	
	/**
	 * 点击加号时，取得子节点，展开文件夹
	 * 
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	$("div.hitarea").live("click", function() {
		if ($(this).hasClass("collapsable-hitarea")) {
		  var nodeId = $(this).next().attr("id");
			var path = replaceToPath(nodeId);
		
			$.getJSON(basePath + "/configAjax/getChildren", {path: path}, function(resultMap) {
			  var msg = resultMap.msg;
			  var znodeList = resultMap.znodeList;
			  if (msg != "succ") {
				  $("#errDiv").html(msg);
				  $("#errDiv").fadeIn("slow");
				  return;
			  }
			  
			  // 清空该节点下的ul内容
			  $("#" + nodeId).next("ul").empty();
			  
			  if (znodeList == null || znodeList.length == 0) {
				  // 点击文件
				  $("#" + nodeId).removeAttr("class");
				  $("#" + nodeId).addClass("file");
				  
				  // 编辑时，name、path、add不可修改
				  $("input:disabled").removeAttr("disabled");
				  $(".isShow").show();
				  $("#znode_name").attr("disabled", "disabled");
				  $("#znode_path").attr("disabled", "disabled");
				  $("#addZNode").hide();
			  } else {
					// 点击文件夹
					$("#" + nodeId).removeAttr("class");
					$("#" + nodeId).addClass("folder");
		
					// 编辑时，name、path、add、delete不可修改
					$("input:disabled").removeAttr("disabled");
					$(".isShow").show();
					$("#znode_name").attr("disabled", "disabled");
					$("#znode_path").attr("disabled", "disabled");
					$("#addZNode").hide();
					$("#deleteZNode").hide();
		
					// 添加分支
					var items = [];
					items.push("<ul>");
					$.each(znodeList, function(key, znode) {
					  if (znode.stat.numChildren == 0) {
						  items.push('<li><span id="' + znode.id + '" class="file">' + znode.name + '</span></li>');
					  } else {
						  items.push('<li class="closed"><span id="' + znode.id + '" class="folder">' + 
							  znode.name + '</span><ul></ul></li>');
					  }
					});
					items.push("</ul>");
		
					var branches = $(items.join('')).insertAfter("#" + nodeId);
					$("#browser").treeview({
						add: branches
					});
			  }
			});
		}
	});
	
	/**
	 * 数据库配置编辑页面，临时添加BizName
	 */
	$("#addTempBizName").click(function() {
		var tmpBizName = $("#inputTempBizName").val();
		
		if (tmpBizName == undefined || tmpBizName == "") {
			alert("请输入添加的bizName");
			return;
		} else {
			if ($("input.hide") != undefined && $("input.hide") != null) {
				for (i = 0; i < $("input.hide").length; i++) {
					if ($("input.hide")[i].value == tmpBizName) {
						alert("bizName 不能重复");
						return;
					}
				}
			}
		}
		
		var tmpBizNameTr = '<tr class="quiet">';
		tmpBizNameTr = tmpBizNameTr + '<td></td>';
		tmpBizNameTr = tmpBizNameTr + "<td>";
		tmpBizNameTr = tmpBizNameTr + tmpBizName;
		tmpBizNameTr = tmpBizNameTr + '<input class="hide" type="hidden" id="bizNameList" name="bizNameList" value="'+ tmpBizName +'" />';
		tmpBizNameTr = tmpBizNameTr + "</td>";
		tmpBizNameTr = tmpBizNameTr + '<td><input class="removed" type="button" value="delete" /></td>';
		tmpBizNameTr = tmpBizNameTr + "</tr>";
		$("#dbConfigTfoot").append(tmpBizNameTr);
	});
	
	/**
	 * 模块编辑页面，临时添加语言
	 */
	$("#addTempLang").click(function() {
		var tmpLang = $("#inputTempLang").val();
		
		if (tmpLang == undefined || tmpLang == "") {
			alert("请输入语言");
			return;
		} else {
			if ($("input.hide") != undefined && $("input.hide") != null) {
				for (i = 0; i < $("input.hide").length; i++) {
					if ($("input.hide")[i].value == tmpLang) {
						alert("语言重复");
						return;
					}
				}
			}
		}
		
		var tmpLangTr = '<tr class="quiet">';
		tmpLangTr = tmpLangTr + '<td></td>';
		tmpLangTr = tmpLangTr + "<td>";
		tmpLangTr = tmpLangTr + tmpLang;
		tmpLangTr = tmpLangTr + '<input class="hide" type="hidden" id="languages" name="languages" value="'+ tmpLang +'" />';
		tmpLangTr = tmpLangTr + "</td>";
		tmpLangTr = tmpLangTr + '<td><input class="removed" type="button" value="删除" /></td>';
		tmpLangTr = tmpLangTr + "</tr>";
		$("tbody").append(tmpLangTr);
	});
	
	/**
	 * 数据库配置编辑页面，临时删除BizName
	 * 模块编辑页面, 临时删除语言
	 */
	$(".removed").live("click", function() {
		if (confirm("确定删除该节点吗？")) {
			$(this).parents(".quiet").remove();
		}
	});
	
	/**
	 * 数据库配置编辑页面，提交form
	 */
	$("#saveBtn").click(function() {
		if (confirm("确定提交变更吗？")) {
			this.form.submit();
		}
	});
	
	/**
	 * 多语言系统——模块编辑页面，提交form
	 * @memberOf {TypeName} 
	 */
	$("#submitProject").click(function() {
		var name = $("#name").val();
		if (name = null || name == '') {
			alert("请输入模块名称");
			return false;
		}
		
		if (confirm("确定提交模块信息？")) {
			this.form.submit();
		}
	});
	
	/**
	 * 多语言系统——模块编辑页面，取消按钮
	 */
	$("#cancelProject").click(function() {
		if (confirm("确定取消模块编辑？")) {
			location.href = "/i18n";
		}
	});
	
	/**
	 * 删除模块确定
	 * @return {TypeName} 
	 */
	$("a[href^='/i18n/project_delete']").click(function() {
		return confirm("确定删除模块？");
	});
	
	/**
	 * 多语言系统——属性编辑页面，提交form
	 * @memberOf {TypeName} 
	 */
	$("#submitProp").click(function() {
		if (confirm("确定提交属性信息？")) {
			this.form.submit();
		}
	});
	
	/**
	 * 多语言系统——属性编辑页面，取消按钮
	 */
	$("#cancelProp").click(function() {
		var projName = $("#projName").val();
		if (confirm("确定取消属性编辑？")) {
			location.href = "/i18n/property_list?p=" + projName;
		}
	});
	
	/**
	 * 多语言系统_属性列表页面，添加新属性
	 */
	$("#new_prop").click(function() {
		var projName = $("#projName").val();
		location.href = "/i18n/property_new?projName=" + projName;
	});
	
	/**
	 * 属性添加页面，临时添加属性key
	 */
	$("#addTempKey").click(function() {
		var tmpKey = $("#inputTempKey").val();
		
		if (tmpKey == undefined || tmpKey == "") {
			alert("请输入 key");
			return;
		} else {
			if ($("input.hide") != undefined && $("input.hide") != null) {
				for (i = 0; i < $("input.hide").length; i++) {
					if ($("input.hide")[i].value == tmpKey) {
						alert("key 重复");
						return;
					}
				}
			}
		}
		
		var tmpKeyTr = '<tr class="quiet">';
		tmpKeyTr = tmpKeyTr + '<td></td>';
		tmpKeyTr = tmpKeyTr + "<td>";
		tmpKeyTr = tmpKeyTr + tmpKey;
		tmpKeyTr = tmpKeyTr + '<input class="hide" type="hidden" name="keyList" value="'+ tmpKey +'" />';
		tmpKeyTr = tmpKeyTr + "</td>";
		tmpKeyTr = tmpKeyTr + '<td><input class="removed" type="button" value="删除" /></td>';
		tmpKeyTr = tmpKeyTr + "</tr>";
		$("thead").append(tmpKeyTr);
	});
	
	/**
	 * 多语言系统_属性添加页面，提交form
	 * @memberOf {TypeName} 
	 */
	$("#addProp").click(function() {
		if (confirm("确定提交属性信息？")) {
			this.form.submit();
		}
	});
	
	/**
	 * 多语言系统_属性列表页面，点击删除按钮
	 * @memberOf {TypeName} 
	 */
	$("#del_prop").click(function() {
		if (confirm("确定删除选择的属性信息？")) {
			this.form.submit();
		}
	});
	
	/**
	 * 多语言系统_属性列表页面，自动完成
	 * 
	 * @return {TypeName} 
	 */
	$("#search_input").autocomplete("/i18n/property_autocomplete", {
		extraParams: {
			p: function() {
				return $("#projName").val();
			},
			t: function() {
				return $("input[name=type]:radio:checked").val();
			}
		}
	});
	
	/**
	 * 多语言系统_属性添加页面，key自动完成
	 * 
	 * @return {TypeName} 
	 */
	$("#inputTempKey").autocomplete("/i18n/property_autocomplete", {
		extraParams: {
			p: function() {
				return $("#projName").val();
			},
			t: 0
		}
	});
	
	/**
	 * 多语言系统_属性添加页面、属性编辑页面，value自动完成
	 * 
	 * @return {TypeName} 
	 */
	$("input[type=text][name^=langValueList]").autocomplete("/i18n/property_autocomplete", {
		extraParams: {
			p: function() {
				return $("#projName").val();
			},
			t: 1
		}
	});
	
	/**
	 * 多语言系统_属性列表页面，点击Search按钮
	 * 
	 * @return {TypeName} 
	 */
	$("#search_btn").click(function() {
		var p = $("#projName").val();
		var t = $("input[name=type]:radio:checked").val();
		var q = $("#search_input").val();
		location.href = "/i18n/property_list_search?p=" + p + "&t=" + t + "&q=" + q;
	});
	
	// 属性列表页面分页
	if ($("#Pagination").length != 0) {
		initPagination_propList();
	}
	
	$("#selectModule").change(function() {
		if ($("#selectModule").val() == "all") {
			location.href = "/i18n";
		} else {			
			location.href = "/i18n/show_page_by_module?moduleName=" + $("#selectModule").val();
		}
	});
});

/**
 * 选择一个节点
 * 
 * @param {Object} znode
 */
function selectZNode(znode) {
  $("span.folder, span.file").removeAttr("style");
  $("span.folder, span.file").removeAttr("selected");
  
  znode.css({"color": "red", "font-weight": "bolder"});
  znode.attr("selected", "selected");
}
  
/**
 * 设置节点信息
 * 
 * @param {Object} znode
 */
function setZNodeInfo(znode) {
  if (znode == null) {
	  $("#znode_name").val("");
	  $("#znode_path").val("");
	  $("#znode_data").val("");
	  $("#znode_stat_czxid").text("");
	  $("#znode_stat_mzxid").text("");
	  $("#znode_ctime").text("");
	  $("#znode_mtime").text("");
	  $("#znode_stat_version").text("");
	  $("#znode_stat_cversion").text("");
	  $("#znode_stat_aversion").text("");
	  $("#znode_stat_ephemeralOwner").text("");
	  $("#znode_stat_dataLength").text("");
	  $("#znode_stat_numChildren").text("");
	  $("#znode_stat_pzxid").text("");
  } else {
	  $("#znode_name").val(znode.name);
	  $("#znode_path").val(znode.path);
	  $("#znode_data").val(znode.data);
	  $("#znode_stat_czxid").text(znode.stat.czxid);
	  $("#znode_stat_mzxid").text(znode.stat.mzxid);
	  $("#znode_ctime").text(znode.ctime);
	  $("#znode_mtime").text(znode.mtime);
	  $("#znode_stat_version").text(znode.stat.version);
	  $("#znode_stat_cversion").text(znode.stat.cversion);
	  $("#znode_stat_aversion").text(znode.stat.aversion);
	  $("#znode_stat_ephemeralOwner").text(znode.stat.ephemeralOwner);
	  $("#znode_stat_dataLength").text(znode.stat.dataLength);
	  $("#znode_stat_numChildren").text(znode.stat.numChildren);
	  $("#znode_stat_pzxid").text(znode.stat.pzxid);
  }
}

/**
 * 属性列表页面分页初始化
 */
function initPagination_propList() {
	var totleNum = $("#totleNum").val();
	$("#Pagination").pagination(totleNum, {
		callback: pageselectCallback,
		items_per_page:5,
		num_display_entries:2,
		num_edge_entries:1,
		load_first_page:true
	});
 }

/**
 * 分页信息加载
 * 
 * @param {Object} page_index
 * @param {Object} jq
 * @return {TypeName} 
 */
function pageselectCallback(page_index, jq) {
	var projName = $("#projName").val();
	var pageSize = 5;
	var query = $("#search_input").val();
	var type = $("input[name=type]:radio:checked").val();
	if (type == undefined) {
		type = 0;
	}
	
	$.getJSON("/i18n/property_page", {p:projName, pi:page_index, ps:pageSize, q:query, t:type}, function(resultMap) {
		var propList = resultMap.propList;
		var langList = resultMap.langList;
		
		var items = [];
		$.each(propList, function(idx, prop) {
			var item = '<tr>';
			item = item + '<td><input name="keyArr" type="checkbox" value="' + prop.key + '" /></td>';
			item = item + '<td>' + prop.key + '</td>';
			
			$.each(langList, function(idx, langStr) {
				if (prop.langValueList != null) {
					$.each(prop.langValueList, function(idx, lang) {
						if (lang.lang == langStr) {
							item = item + '<td>' + lang.value + '</td>';
						}
					});
				}
			});
			
			item = item + '<td>' + prop.createTime + '</td>';
			item = item + '<td>' + prop.updateTime + '</td>';
			item = item + '<td>' + prop.desc + '</td>';
			item = item + '<td><a href="/i18n/property_edit?projName=' + projName + '&key=' + prop.key + '">edit</a></td>';
			item = item + '</tr>';
			items.push(item);
		});
		$("tbody").empty().append(items.join(''));
	});
	
	return false;
}

var zk = {
	addPageDialog : null,
	openAddPageDialog : function(pageID) {
		if (pageID == null) {
			zk.addPageDialog = window.open("http://zk.biz-iq.jp/i18n/page_edit?pageId=-1","_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=820, height=595");
		} else {
			zk.addPageDialog = window.open("http://zk.biz-iq.jp/i18n/page_edit?pageId=" + pageID,"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=820, height=595");
		}
	},
	showPropertiesDetail : function(pageID, module, pageName) {
		$.getJSON("/i18n/showPropertiesDetail", 
				{"pageId":pageID, "module":module, "pageName":pageName}, 
				function(resultMap) {
					var propList = resultMap.propertyList;
					var langList = resultMap.langList;
					var module = resultMap.module;
					var items = [];
					var title = "key/";
					
					$("#property_module").html(module);
					
					$.each(langList, function(idx, langStr) {
						title = title + "/" + langStr;
					});
					
					title += "/Desc";
					
					if ($("#title").html() == "") {						
						$("#title").append(title);
					}
					
					$("#property_pageName").html(pageName);
					$("#property_pageId").html(pageID);
					
					$.each(propList, function(idx, prop) {
						var titleItem = prop.key;
						var item = '<tr>';
						
						$.each(langList, function(idx, langStr) {
							if (prop.langValueList != null) {
								$.each(prop.langValueList, function(idx, lang) {
									if (lang.lang == langStr) {
										titleItem = titleItem + '<br />' + lang.value;
									}
								});
							}
						});
						
						titleItem = titleItem + "<br />" + prop.desc;
						
						item = item + '<td>' + titleItem + '</td>';
						item = item + '<td>' + prop.positionType + '</td>';
						item = item + '<td>' + prop.createTime + '</td>';
						item = item + '<td>' + prop.updateTime + '</td>';
						item = item + '<td><a href="javascript:zk.openAddPorpertyDialog(\'' + prop.key + '\')">edit</a> | <a href="javascript:zk.delProperty(\'' + prop.key + '\')">del</a></td>';
						item = item + '</tr>';
						items.push(item);
					});
					$("#propertiesTab").empty().append(items.join(''));
					$("#modules").show();
				}
		);
	},
	addPage : function() {
		var pageID = $("#pageID").val();
		var pageName = $("#pageName").val();
		var url = $("#url").val();
		var moduleName = $("#moduleName").val();
		var desciption = $("#desciption").val();
		$.post("/i18n/page_insert", 
				{"pageID":pageID, "pageName":pageName, "url":url, "moduleName":moduleName, "desciption":desciption}, 
				function(resultMap) {
					window.opener.location.href = window.opener.location.href;
					if (window.opener.progressWindow)
					{
						window.opener.progressWindow.close();
					}
					window.close();
				}
		);
	},
	delPage:function(pageId) {
		$.post("/i18n/page_delete", 
				{"pageId":pageId}, 
				function(resultMap) {
					location.reload();
				}
		);
	},
	updatePage:function(pageId) {
		var pageID = $("#pageID").html();
		var pageName = $("#pageName").val();
		var url = $("#url").val();
		var moduleName = $("#moduleName").html();
		var desciption = $("#desciption").val();
		$.post("/i18n/page_update", 
				{"pageId":pageID, "pageName":pageName, "url":url, "moduleName":moduleName, "desciption":desciption}, 
				function(resultMap) {
					window.opener.location.href = window.opener.location.href;
					if (window.opener.progressWindow)
					{
						window.opener.progressWindow.close();
					}
					window.close();
				}
		);
	},
	searchPage:function() {
		var input = $("#pagekeyword").val();
		location.href = "/i18n/page_search?input=" + input;
	},
	openAddPorpertyDialog : function(porpertyKey) {
		var module = $("#property_module").html();
		var pageId = $("#property_pageId").html();
		var pageName = $("#property_pageName").html();
		if (porpertyKey == null) {
			window.open("http://zk.biz-iq.jp/i18n/property_edit_page?key=-1&pageId=" + pageId + "&projName=" + module + "&pageName=" + pageName,"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=820, height=595");
		} else {
			window.open("http://zk.biz-iq.jp/i18n/property_edit_page?key=" + porpertyKey + "&pageId=" + pageId +  "&projName=" + module + "&pageName=" + pageName,"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=820, height=595");
		}
	},
	addProperty:function() {
		var key = $("#key").val();
		var lang1 = $("#langValueList_0_lang").val();
		var value1 = $("#langValueList_0_value").val();
		var lang2 = $("#langValueList_1_lang").val();
		var value2 = $("#langValueList_1_value").val();
		var PriviewPages = $("#PriviewPages").val();
		var positionType = $("#PositionType").val();
		var desc = $("#desc").val();
		var moduleName = $("#projName").val();
		var pageId = $("#pageId").val();
		var pageName = $("#pageName").val();
		$.post("/i18n/property_insert", 
				{"key":key, "lang1":lang1, "value1":value1, "lang2":lang2, "value2":value2, 
					"PriviewPages":PriviewPages, "positionType":positionType, "desc":desc, "moduleName":moduleName, "pageId":pageId}, 
				function(resultMap) {
					window.opener.zk.showPropertiesDetail(pageId, moduleName, pageName);
					if (window.opener.progressWindow)
					{
						window.opener.progressWindow.close();
					}
					window.close();
				}
		);
	},
	delProperty:function(key) {
		var moduleName = $("#property_module").html();
		var pageName = $("#property_pageName").html();
		var pageID = $("#property_pageId").html();
		$.post("/i18n/property_delete", 
				{"moduleName":moduleName, "propertyKey":key}, 
				function(resultMap) {
					zk.showPropertiesDetail(pageID, moduleName, pageName);
				}
		);
	},
	updateProperty:function(key) {
		var moduleName = $("#projName").val();
		var pageID = $("#pageId").val();
		var key = $("#key").html();
		var lang1 = $("#langValueList_0_lang").val();
		var value1 = $("#langValueList_0_value").val();
		var lang2 = $("#langValueList_1_lang").val();
		var value2 = $("#langValueList_1_value").val();
		var PriviewPages = $("#PriviewPages").val();
		var positionType = $("#PositionType").val();
		var pageName = $("#pageName").val();
		var desc = $("#desc").val();
		$.post("/i18n/property_update_onpage", 
				{"key":key, "lang1":lang1, "value1":value1, "lang2":lang2, "value2":value2, 
			"PriviewPages":PriviewPages, "positionType":positionType, "desc":desc, "moduleName":moduleName, "pageId":pageID},
				function(resultMap) {
					window.opener.zk.showPropertiesDetail(pageID, moduleName, pageName);
					if (window.opener.progressWindow)
					{
						window.opener.progressWindow.close();
					}
					window.close();
				}
		);
	},
	searchProperty:function() {
		var input = $("#propertykeyword").val();
		$.post("/i18n/property_search", 
				{"input":input},
				function(resultMap) {
					var propList = resultMap.propertyList;
					var langList = resultMap.langList;
					var module = resultMap.module;
					var items = [];
					var title = "key/";
					
					$("#property_module").html(module);
					
					$.each(langList, function(idx, langStr) {
						title = title + "/" + langStr;
					});
					
					title += "/Desc";
					
					if ($("#title").html() == "") {						
						$("#title").append(title);
					}
					
					$("#property_pageName").html(pageName);
					$("#property_pageId").html(pageID);
					
					$.each(propList, function(idx, prop) {
						var titleItem = prop.key;
						var item = '<tr>';
						
						$.each(langList, function(idx, langStr) {
							if (prop.langValueList != null) {
								$.each(prop.langValueList, function(idx, lang) {
									if (lang.lang == langStr) {
										titleItem = titleItem + '<br />' + lang.value;
									}
								});
							}
						});
						
						titleItem = titleItem + "<br />" + prop.desc;
						
						item = item + '<td>' + titleItem + '</td>';
						item = item + '<td>' + prop.positionType + '</td>';
						item = item + '<td>' + prop.createTime + '</td>';
						item = item + '<td>' + prop.updateTime + '</td>';
						item = item + '<td><a href="javascript:zk.openAddPorpertyDialog(\'' + prop.key + '\')">edit</a> | <a href="javascript:zk.delProperty(\'' + prop.key + '\')">del</a></td>';
						item = item + '</tr>';
						items.push(item);
					});
					$("#propertiesTab").empty().append(items.join(''));
					$("#modules").show();
				}
		);
	}
}