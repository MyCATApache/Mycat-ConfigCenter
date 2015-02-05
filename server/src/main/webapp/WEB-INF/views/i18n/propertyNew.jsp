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
	<h2>属性添加</h2>
	<div><h3>${projName }</h3></div>
	<div>
		<div id="errDiv" class="error" <c:if test="${empty errMsg }">style="display: none"</c:if>>${errMsg }</div>
		
		<form id="prop_add" name="prop_add" action="/i18n/property_add" method="post" >
			<table cellspacing="0" cellpadding="0" border="0">
			  <thead>
			    <tr>
			      <td class="span-3"><label>key:</label></td>
			      <td class="span-3">
			      	<input type="text" id="inputTempKey" />
			      </td>
			      <td>
			      	<input class="added" id="addTempKey" type="button" value="add" />
			      </td>
			    </tr>
			    <c:forEach items="${keyList}" var="key">
			    <tr class="quiet">
			      <td></td>
			      <td>${key }
			      	<input class="hide" type="hidden" name="keyList" value="${key }" />
			      </td>
			      <td><input class="removed" type="button" value="删除" /></td>
			    </tr>
			    </c:forEach>
			  </thead>
			  <tbody>
			    <c:forEach items="${langList}" var="lang" varStatus="status">
			    <tr>
			      <td class="span-3">
			      	<label>${lang.lang }:</label>
			      	<input type="hidden" name="langValueList[${status.index }].lang" value="${lang.lang }" style="width:500px"/>
			      </td>
			      <td class="span-3">
			      	<input type="text" name="langValueList[${status.index }].value" value="${lang.value }" style="width:500px"/>
			      </td>
			    </tr>
			    </c:forEach>
			    <tr>
			      <td class="span-3"><label>description:</label></td>
			      <td class="span-3">
			      	<textarea name="desc">${desc }</textarea>
			      </td>
			    </tr>
			  </tbody>
			</table>
			<div>
				<input id="addProp" type="button" value="提交" />
				<input id="cancelProp" type="button" value="取消" />
				<input id="projName" type="hidden" name="projName" value="${projName }" />
			</div>
		</form>
    </div>
</div>
</body>
</html>