<%@page contentType="text/html;charset=UTF-8"%>
<%@page pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@include file="../common/head.jsp" %>
</head>
<body>
<%@ include file="../common/top.jsp"%> 


<div class="main fn-clear">
<div class="container">
	<div class="span-10 colborder">
	<%--<input id="addZNodeRoot" type="button" value="根节点新增"  />
	<br>
	 --%>
    <input id="addZNodeSub" type="button" value="子节点新增" />
	  	<ul id="browser" class="filetree">
	  		<c:forEach var="znode" items="${znodeList}">
	  			<c:if test="${znode.stat.numChildren == 0}">
	  				<li>
	  					<span id="${znode.id}" class="file" >${znode.name}</span>
	  				</li>
	  			</c:if>
	  			<c:if test="${znode.stat.numChildren != 0}">
	  				<li>
	  					<span id="${znode.id}" class="folder" >${znode.name}</span>
	  					<ul></ul>
	  				</li>
	  			</c:if>
	  		</c:forEach>
		</ul>
    </div>
    <div class="span-11 prepend-1 last">
		<div id="errDiv" class="error" style="display: none"></div>
		<div id="succDiv" class="success" style="display: none"></div>
        <p>
          <label for="znode_name">节点名: </label><br>
          <input type="text" id="znode_name" name="znode_name" class="title">
        </p>
        <p>
          <label for="znode_path">节点路径: </label><br>
          <input type="text" id="znode_path" name="znode_path" class="title">
        </p>
        <p>
          <label for="znode_data">节点数据: </label><br>
          <textarea rows="2" cols="10" name="znode_data" id="znode_data"></textarea>
        </p>
    	  <input class="isShow"  id="addZNode" type="button" value="添加节点" style="display: none" />
    	  &nbsp;&nbsp;
          <input class="isShow" id="updateZNode" type="button" value="修改节点" style="display: none" />
		  &nbsp;&nbsp;
		  <input class="isShow" id="deleteZNode" type="button" value="删除节点" style="display: none" />
		  &nbsp;&nbsp;
		  <br/>
        <ul>
		   <li><label for="znode_name">说明：</label></li>
		   <li><label for="znode_name">1.节点添加成功后，节点名与路径将不能进行修改或删除。</label></li>	
		   <li><label for="znode_name">2.节点名与路径不能修改。</label></li>	
		   <li><label for="znode_name">3.有子节点的节点不能删除。</label></li>	
	    </ul>
    </div>
    
    <span class="span-9 prepend-1 last">
         <br>
          <label for="znode_stat_czxid">czxid: </label><br>
          <span id="znode_stat_czxid"></span>
       <br>
          <label for="znode_stat_mzxid">mzxid: </label><br>
          <span id="znode_stat_mzxid"></span>
      <br>
          <label for="znode_ctime">ctime: </label><br>
          <span id="znode_ctime"></span>
       <br>
          <label for="znode_mtime">mtime: </label><br>
          <span id="znode_mtime"></span>
   	 <br>
          <label for="znode_stat_version">version: </label><br>
          <span id="znode_stat_version"></span>
       <br>
          <label for="znode_stat_cversion">cversion: </label><br>
          <span id="znode_stat_cversion"></span>
        <br>
          <label for="znode_stat_aversion">aversion: </label><br>
          <span id="znode_stat_aversion"></span>
       <br>
          <label for="znode_stat_ephemeralOwner">ephemeralOwner: </label><br>
          <span id="znode_stat_ephemeralOwner"></span>
    	<br>
          <label for="znode_stat_dataLength">dataLength: </label><br>
          <span id="znode_stat_dataLength"></span>
        <br>
          <label for="znode_stat_numChildren">numChildren: </label><br>
          <span id="znode_stat_numChildren"></span>
        <br>
          <label for="znode_stat_pzxid">pzxid: </label><br>
          <span id="znode_stat_pzxid"></span>
    </span>
</div>
<br>
</div>
</body>
</html>