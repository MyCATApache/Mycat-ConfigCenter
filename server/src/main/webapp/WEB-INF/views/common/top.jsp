<%@page contentType="text/html;charset=UTF-8"%>
<%@page pageEncoding="UTF-8"%>

<header>
	<span class="logo fn-left"></span>
	<div class="user-info fn-right"><span class="user ft-gray mr10">欢迎您，${sessionScope.SSO_USER_SESSION_KEY.username}</span><span class="mr10">|</span><a href="<%=request.getContextPath()%>/logout" class="mr10">退出</a><span class="mr10">|</span><a href="#" class="mr10">帮助中心</a></div>
</header>
<nav class="iconrept">
	<ul class="menulist fn-clear">
		<li class="current"><a href="<%=request.getContextPath()%>/login">首&nbsp;&nbsp;页</a></li>
	</ul>
</nav>