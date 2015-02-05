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
	<h2>属性编辑</h2>
	<div><h3>${projName }</h3></div>
	<div>
		<div id="errDiv" class="error" <c:if test="${empty errMsg }">style="display: none"</c:if>>${errMsg }</div>
		
		<form id="prop_edit" name="prop_edit" action="/i18n/property_update" method="post" >
			<table cellspacing="0" cellpadding="0" border="0">
			  <tbody>
			    <tr>
			      <td class="span-3"><label>key:</label></td>
			      <td class="span-3">
			      	<label>${prop.key }</label>
			      	<input type="hidden" name="key" value="${prop.key }" />
			      </td>
			    </tr>
			    <c:forEach items="${prop.langValueList}" var="lang" varStatus="status">
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
			      	<textarea name="desc">${prop. desc}</textarea>
			      </td>
			    </tr>
			  </tbody>
			</table>
			<div>
				<input id="submitProp" type="button" value="提交" />
				<input id="cancelProp" type="button" value="取消" />
				<input id="projName" type="hidden" name="projName" value="${projName }" />
			</div>
		</form>
    </div>
</div>
</body>
</html>