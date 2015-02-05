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
	<div>
	   <h2>PrivewPage Search</h2>
	   <div>Modules:
	       <select id="selectModule">
	           <option value="all" selected>all</option>
	           <c:forEach var="module" items="${moduleList}">
	               <c:if test="${moduleName == module.name}">
	               <option value="${module.name}" selected>${module.name}</option>
	               </c:if>
	               <c:if test="${moduleName != module.name}">
                   <option value="${module.name}">${module.name}</option>
                   </c:if>
	           </c:forEach>
	       </select>	   
	   <div style="float:right"><input id="pagekeyword" type="text" /><input id="searchPage" type="button" onclick="zk.searchPage()" value="搜索" /></div></div>
		<table cellspacing="0" cellpadding="0" border="0">
		  <caption class="prepend-22"><a href="/i18n/project_edit?projectName=">新建模块</a></caption>
		  <thead>
			<tr>
			  <th class="span-4">pageID</th>
			  <th class="span-4">pageName</th>
			  <th class="span-4">URL</th>
			  <th class="span-4">modules</th>
			  <th class="span-4 last">Action</th>
			</tr>
		  </thead>
		  <tbody>
		  	<c:forEach var="page" items="${pageList}">
				<tr>
				  <td><a href="javascript:zk.showPropertiesDetail(${page.pageID}, '${page.modulesName}', '${page.pageName}');">${page.pageID}</a></td>
				  <td>${page.pageName}</td>
				  <td>${page.url}</td>
				  <%-- <td>
				  	<c:forEach var="lang" items="${project.languages}" varStatus="status">
				  		<c:if test="${status.index != 0}"> | </c:if>${lang }
				  	</c:forEach>
				  </td> --%>
				  <td>${page.modulesName}</td>
				  <td><a href="javascript:zk.openAddPageDialog(${page.pageID});">edit</a> | <a href="javascript:zk.delPage(${page.pageID})">delete</a></td>
				</tr>
		  	</c:forEach>
		  </tbody>
		</table>
    </div>
    <div><a href="javascript:zk.openAddPageDialog();">添加</a></div>
    <hr />
    <div id='modules' style="display:none;">
        <h2>Propeties Search</h2>
        <div>Modules:<span id="property_module"></span><br />page:<span id="property_pageName"></span><input id="property_pageId" type="hidden" />    
        <div style="float:right"><input id="propertykeyword" type="text" /><input id="searchPage" type="button" onclick="javascript:zk.searchProperty()" value="搜索" /></div></div>
        <table cellspacing="0" cellpadding="0" border="0">
          <thead>
            <tr>
              <th class="span-4" id="title"></th>
              <th class="span-4">posType</th>
              <th class="span-4">createTime</th>
              <th class="span-4">updateTime</th>
              <th class="span-4 last">Action</th>
            </tr>
          </thead>
          <tbody id="propertiesTab">
            <%-- <c:forEach var="project" items="${projectList}">
                <tr>
                  <td><a href="/i18n/property_list?p=${project.name }">${project.name}</a></td>
                  <td>
                    <c:forEach var="lang" items="${project.languages}" varStatus="status">
                        <c:if test="${status.index != 0}"> | </c:if>${lang }
                    </c:forEach>
                  </td>
                  <td><a href="/i18n/project_edit?projectName=${project.name }">edit</a> | <a href="/i18n/project_delete?projName=${project.name }">delete</a></td>
                </tr>
            </c:forEach> --%>
          </tbody>
        </table>
        <div><a href="javascript:zk.openAddPorpertyDialog();">添加</a></div>
    </div>
</div>
</body>
</html>