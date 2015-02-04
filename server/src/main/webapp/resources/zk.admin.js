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
