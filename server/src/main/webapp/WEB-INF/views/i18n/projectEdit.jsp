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
	<h2>模块编辑</h2>
	<div>
		<div id="errDiv" class="error" <c:if test="${empty errMsg }">style="display: none"</c:if>>${errMsg }</div>
		
		<form id="project_edit" name="project_edit" action="/i18n/project_update?oldProjName=${projName }" method="post" >
			<table cellspacing="0" cellpadding="0" border="0">
			  <tbody>
			    <tr>
			      <td class="span-3"><label>模块名称:</label></td>
			      <td class="span-3">
			      	<input type="text" id="name" name="name" value="${project.name }" />
			      </td>
			    </tr>
			    <c:if test="${empty project.name}">
			    <tr>
			      <td class="span-3"><label>Copy From:</label></td>
			      <td class="span-3">
			      	<input type="text" id="copyName" name="copyName" />
			      </td>
			    </tr>
			    </c:if>
			    <tr>
			      <td><label>语言:</label></td>
			      <td><input type="text" id="inputTempLang" size="30" /></td>
			      <td><input class="added" id="addTempLang" type="button" value="追加语言" /></td>
			    </tr>
			    <c:if test="${empty project.languages}">
			    <tr class="quiet">
			    	<td></td>
			    	<td>
			    		default
			    		<input class="hide" type="hidden" id="languages" name="languages" value="default" />
			    	</td>
			    </tr>
			    </c:if>
			    <c:forEach var="language" items="${project.languages}" >
				    <tr class="quiet">
				      <td></td>
				      <td>
				      	${language }
				      	<input class="hide" type="hidden" id="languages" name="languages" value="${language }" />
				      </td>
				      <c:if test="${language != 'default'}">
				      <td><input class="removed" type="button" value="删除" /></td>
				      </c:if>
				    </tr>
			    </c:forEach>
			  </tbody>
			</table>
			<div>
				<input id="submitProject" type="button" value="提交" />
				<input id="cancelProject" type="button" value="取消" />
			</div>
		</form>
    </div>
</div>
</body>
</html>