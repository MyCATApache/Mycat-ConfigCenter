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
	<h1> 
		ZK Configration Admin 
	</h1>
   	<%@include file="../common/menu.jsp" %>
	<hr>	
	<div>
		<table cellspacing="0" cellpadding="0" border="0">
		  <caption><em>${path }</em></caption>
		  <thead>
		    <tr>
		      <th class="span-2" rowspan="2">dbname</th>
		      <th class="span-2" rowspan="2">mode</th>
		      <th class="span-8" colspan="4">server1</th>
		      <th class="span-8" colspan="4">server2</th>
		      <th class="span-2" rowspan="2">bizNames</th>
		      <th class="span-2" rowspan="2">dbstatus</th>
		      <th class="span-2 last" rowspan="2">op</th>
		    </tr>
		    <tr>
		      <th class="span-2">host:port</th>
		      <th class="span-2">status</th>
		      <th class="span-2">wrflag</th>
		      <th class="span-2">token</th>
		      <th class="span-2">host:port</th>
		      <th class="span-2">status</th>
		      <th class="span-2">wrflag</th>
		      <th class="span-2">token</th>
		    </tr>
		  </thead>
		  <tfoot>
		    <tr>
		      <td colspan="2"><a href="/dbConfig/edit?dbname=">create</a></td>
		    </tr>
		  </tfoot>
		  <tbody>
		    <c:forEach var="dbConfig" items="${dbConfigList}">
			    <tr>
			      <td>${dbConfig.dbname}</td>
			      <td>${dbConfig.mode}</td>
			      <c:forEach var="server" items="${dbConfig.serverList}">
			      <td>${server.host }:${server.port }</td>
			      <td>${server.status }</td>
			      <td>${server.wrflag }</td>
			      <td>${server.token }</td>
			      </c:forEach>
			      <td>
			      	<c:forEach var="bizName" items="${dbConfig.bizNameList}">
			      		${bizName }<br/>
			      	</c:forEach>
			      </td>
			      <td>${dbConfig.dbstatus }</td>
			      <td><a href="/dbConfig/edit?dbname=${dbConfig.dbname }">edit</a></td>
			    </tr>
		    </c:forEach>
		  </tbody>
		</table>
    </div>
</div>
</body>
</html>