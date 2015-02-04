<%@page contentType="text/html;charset=UTF-8"%>
<%@page pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<html>
<head>
	<%@include file="common/head.jsp" %>
</head>
<body>
<div class="container">  
	<h2>
	You have been logged out. <a href="<c:url value='/'/>">Start again</a>.
	</h2>
</div>
</body>
</html>