<%@page contentType="text/html;charset=UTF-8"%>
<%@page pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
	<%@include file="../common/head.jsp" %>
</head>
<body>
<div class="container">
	<h1>I18N</h1>
   	<%@include file="../common/menu.jsp" %>
	<hr>
	<h2>属性管理</h2>
	<div><h3>${projName }</h3></div>
	<div>
		<input type="text" id="search_input" value="${query }" style="width:500px"/>
		<input type="button" id="search_btn" value="Search" />
		<input type="radio" name="type" <c:if test="${type == null || type == 0 }">checked="checked"</c:if> value="0" />key
		<input type="radio" name="type" <c:if test="${type == 1 }">checked="checked"</c:if> value="1" />value
	</div>
	<div>
	<form action="/i18n/property_del" method="post">
		<table cellspacing="0" cellpadding="0" border="0">
		  <caption class="prepend-22"><a href="/i18n/property_refresh?projName=${projName}">Refresh</a></caption>
		  <thead>
			<tr>
			  <th class="span-1"></th>
			  <th class="span-3">Key</th>
			  <c:forEach items="${langList}" var="lang">
			  <th class="span-3">${lang }</th>
			  </c:forEach>
			  <th class="span-5">Create Time</th>
			  <th class="span-5">Update Time</th>
			  <th class="span-8">Description</th>
			  <th class="span-2 last">Action</th>
			</tr>
		  </thead>
		  <tbody>
		  </tbody>
		</table>
		<div id="Pagination" style="float: right"></div>
		<div>
    	  <input id="projName" type="hidden" value="${projName}" />
		  <input id="del_prop" type="button" value="删除" />
		  <input id="new_prop" type="button" value="添加" />
		  <input type="hidden" id="projName" name="projName" value="${projName}" />
		  <input type="hidden" id="totleNum" name="totleNum" value="${totleNum}" />
		</div>
    </form>
    </div>
</div>
</body>
</html>