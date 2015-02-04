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
	<h2>模块管理</h2>
	<div>
		<table cellspacing="0" cellpadding="0" border="0">
		  <caption class="prepend-22"><a href="/i18n/project_edit?projectName=">新建模块</a></caption>
		  <thead>
			<tr>
			  <th class="span-4">模块名</th>
			  <th class="span-4">语言</th>
			  <th class="span-4 last">操作</th>
			</tr>
		  </thead>
		  <tbody>
		  	<c:forEach var="project" items="${projectList}">
				<tr>
				  <td><a href="/i18n/property_list?p=${project.name }">${project.name}</a></td>
				  <td>
				  	<c:forEach var="lang" items="${project.languages}" varStatus="status">
				  		<c:if test="${status.index != 0}"> | </c:if>${lang }
				  	</c:forEach>
				  </td>
				  <td><a href="/i18n/project_edit?projectName=${project.name }">edit</a> | <a href="/i18n/project_delete?projName=${project.name }">delete</a></td>
				</tr>
		  	</c:forEach>
		  </tbody>
		</table>
    </div>
</div>
</body>
</html>