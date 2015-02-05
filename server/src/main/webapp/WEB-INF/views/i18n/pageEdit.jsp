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
	<h2>PrivewPage编辑页</h2>
	<div>
		<div id="errDiv" class="error" <c:if test="${empty errMsg }">style="display: none"</c:if>>${errMsg }</div>
		
		<form id="project_edit" name="project_edit" action="/i18n/project_update?oldProjName=${projName }" method="post" >
			<table cellspacing="0" cellpadding="0" border="0">
			  <tbody>
                  <c:if test='${pageId != "-1"}'>
				    <tr>
	                  <td class="span-3"><label>modules:</label></td>
	                  <td class="span-3">
	                    <label id="moduleName" name="moduleName">${project.module.modulesName}</label>
	                  </td>
	                </tr>
                  </c:if>
                <tr>
                  <td class="span-3"><label>pageID:</label></td>
                  <td class="span-3">
                    <c:if test='${pageId != "-1"}'>
                        <label id="pageID">${project.pageID}</label>
                    </c:if>
                    <c:if test='${pageId == "-1"}'>
                        <input type="text" id="pageID" name="pageID" value="${project.pageID}" />
                    </c:if>
                  </td>
                </tr>
                <tr>
                  <td class="span-3"><label>pageName:</label></td>
                  <td class="span-3">
                    <input type="text" id="pageName" name="pageName" value="${project.pageName}" />
                  </td>
                </tr>
                <tr>
                  <td class="span-3"><label>URL:</label></td>
                  <td class="span-3">
                    <input type="text" id="url" name="url" value="${project.url}" />
                  </td>
                </tr>
                <c:if test='${pageId == "-1"}'>
                <tr>
                  <td class="span-3"><label>modules:</label></td>
                  <td class="span-3">
                    <input type="text" id="moduleName" name="moduleName" value="${project.module.modulesName}" />
                  </td>
                </tr>
                </c:if>
                <tr>
                  <td class="span-3"><label>desciption:</label></td>
                  <td class="span-3">
                    <input type="text" id="desciption" name="desciption" value="${project.desciption}" />
                  </td>
                </tr>
			  </tbody>
			</table>
			<div>
			    <c:if test='${pageId == "-1"}'>
					<input type="button" value="提交" onclick="zk.addPage()" />
			    </c:if>
			    <c:if test='${pageId != "-1"}'>
			        <input type="button" value="提交" onclick="zk.updatePage()" />
			    </c:if>
				<input type="button" value="取消" />
			</div>
		</form>
    </div>
</div>
</body>
</html>