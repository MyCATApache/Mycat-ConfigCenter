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
	<h2>属性编辑页面</h2>
	<div><h3>${projName }</h3></div>
	<div>
		<div id="errDiv" class="error" <c:if test="${empty errMsg }">style="display: none"</c:if>>${errMsg }</div>
		
		<form id="prop_edit" name="prop_edit" action="/i18n/property_update" method="post" >
			<table cellspacing="0" cellpadding="0" border="0">
			  <tbody>
			    <tr>
			      <td class="span-3"><label>key:</label></td>
			      <td class="span-3">
			        <c:if test="${prop.key != null}">
			      	<label id="key">${prop.key }</label>
			        </c:if>
			        <c:if test="${prop.key == null}">
			      	<input id="key" name="key" value="${prop.key }" />
			        </c:if>
			      </td>
			    </tr>
			    <%-- <c:forEach items="${prop.langValueList}" var="lang" varStatus="status">
			    <tr>
			      <td class="span-3">
			      	<label>${lang.lang }:</label>
			      	<input type="hidden" name="langValueList[${status.index }].lang" value="${lang.lang }" />
			      </td>
			      <td class="span-3">
			      	<input type="text" name="langValueList[${status.index }].value" value="${lang.value }" />
			      </td>
			    </tr>
			    </c:forEach> --%>
			    <c:forEach items="${lang}" var="lang" varStatus="status">
			    <tr>
			      <td class="span-3">
			      	<label>${lang }:</label>
			      	<input type="hidden" id="langValueList_${status.index }_lang" name="langValueList[${status.index }].lang" value="${lang }" />
			      </td>
			      <td class="span-3">
			      	<textarea id="langValueList_${status.index }_value" name="langValueList[${status.index }].value">${prop.langValueList[status.index].value }</textarea>
			      </td>
			    </tr>
			    </c:forEach>
			    <tr>
                  <td class="span-3"><label>PriviewPages:</label></td>
                  <td class="span-3">
                    <textarea id="PriviewPages" name="PriviewPages">${prop.priviewPages}</textarea>
                  </td>
                </tr>
                <tr>
                  <td class="span-3"><label>PositionType:</label></td>
                  <td class="span-3">
                    <select id="PositionType">
                        <c:forEach items="${positionTypeList}" var="positionTypeList" varStatus="status">
                            <c:if test="${positionTypeList.positionType == prop.positionType}">
                                <option value="${positionTypeList.positionType }" selected>${positionTypeList.positionTypeName }</option>
                            </c:if>
                            <c:if test="${positionTypeList.positionType != prop.positionType}">
                                <option value="${positionTypeList.positionType }">${positionTypeList.positionTypeName }</option>
                            </c:if>
                        </c:forEach>
                    </select>
                  </td>
                </tr>
			    <tr>
			      <td class="span-3"><label>description:</label></td>
			      <td class="span-3">
			      	<textarea id="desc" name="desc">${prop.desc}</textarea>
			      </td>
			    </tr>
			  </tbody>
			</table>
			<div>
			    <c:if test='${key == "-1"}'>
				    <input onclick='zk.addProperty()' type="button" value="提交" />
			    </c:if>
			    <c:if test='${key != "-1"}'>
                    <input onclick='zk.updateProperty()' type="button" value="提交" />
                </c:if>
				<input type="button" value="取消" />
				<input id="projName" type="hidden" name="projName" value="${projName }" />
				<input id="pageId" type="hidden" name="pageId" value="${pageId }" />
				<input id="pageName" type="hidden" name="pageName" value="${pageName }" />
			</div>
		</form>
    </div>
</div>
</body>
</html>