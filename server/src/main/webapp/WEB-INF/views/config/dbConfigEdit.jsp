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
		<div id="errDiv" class="error" <c:if test="${empty errMsg }">style="display: none"</c:if>>${errMsg }</div>
		
		<form id="dbConfig" name="dbConfig" action="/dbConfig/update?oldDbName=${dbConfig.dbname }" method="post" >
			<table cellspacing="0" cellpadding="0" border="0">
			  <caption><em>${path } db config edit</em></caption>
			  <tbody>
			    <tr>
			      <td class="span-3"><label>dbname:</label></td>
			      <td class="span-3">
			      	<input type="text" id="dbname" name="dbname" value="${dbConfig.dbname }" />
			      </td>
			    </tr>
			    <tr>
			      <td><label>mode:</label></td>
			      <td>
				      <select id="mode" name="mode" >
				        <option>--selected--</option>
				      	<option value="1" <c:if test="${dbConfig.mode == 1 }">selected="selected"</c:if> >1</option>
				      	<option value="2" <c:if test="${dbConfig.mode == 2 }">selected="selected"</c:if> >2</option>
				      </select>
			      </td>
			    </tr>
			    <tr>
			      <td><label>Connection Pool:</label></td>
			    </tr>
			    <tr>
			      <td class="prepend-1"><label >initialSize:</label></td>
			      <td><input type="text" id="initialSize" name="initialSize" value="${dbConfig.initialSize }" /></td>
			      <td>0&lt;N&lt;30 ,default:1</td>
			    </tr>
			    <tr>
			      <td class="prepend-1"><label >maxActive:</label></td>
			      <td><input type="text" id="maxActive" name="maxActive" value="${dbConfig.maxActive }" /></td>
			      <td>0&lt;N&lt;2000，default:100</td>
			    </tr>
			    <tr>
			      <td class="prepend-1"><label >maxWait(ms):</label></td>
			      <td><input type="text" id="maxWait" name="maxWait" value="${dbConfig.maxWait }" /></td>
			      <td>1000&lt;N&lt;60000，default:10000</td>
			    </tr>
			    <c:forEach var="server" items="${dbConfig.serverList}" varStatus="status" >
					<tr>
				      <td><label>Server${status.count }:</label></td>
				    </tr>
				    <tr>
				      <td class="prepend-1"><label >host:</label></td>
				      <td><input type="text" id="serverList[${status.index }].host" name="serverList[${status.index }].host" value="${server.host }" /></td>
				    </tr>
				    <tr>
				      <td class="prepend-1"><label >port:</label></td>
				      <td><input type="text" id="serverList[${status.index }].port" name="serverList[${status.index }].port" value="${server.port }" /></td>
				      <td>default:3306</td>
				    </tr>
				    <tr>
				      <td class="prepend-1"><label >user:</label></td>
				      <td><input type="text" id="serverList[${status.index }].user" name="serverList[${status.index }].user" value="${server.user }" /></td>
				    </tr>
				    <tr>
				      <td class="prepend-1"><label >passwd:</label></td>
				      <td><input type="text" id="serverList[${status.index }].password" name="serverList[${status.index }].password" value="${server.password }" /></td>
				    </tr>
				    <tr>
				      <td class="prepend-1"><label >status:</label></td>
				      <td>
						<select id="serverList[${status.index }].status" name="serverList[${status.index }].status" >
					        <option>--selected--</option>
					      	<option value="enabled" <c:if test="${server.status == 'enabled' }">selected="selected"</c:if> >enabled</option>
					      	<option value="disabled" <c:if test="${server.status == 'disabled' }">selected="selected"</c:if> >disabled</option>
					      	<option value="ready" <c:if test="${server.status == 'ready' }">selected="selected"</c:if> >ready</option>
				        </select>
				      </td>
				    </tr>
				    <tr>
				      <td class="prepend-1"><label >wrflag:</label></td>
				      <td>
				      	<select id="serverList[${status.index }].wrflag" name="serverList[${status.index }].wrflag" >
					        <option>--selected--</option>
					      	<option value="wr" <c:if test="${server.wrflag == 'wr' }">selected="selected"</c:if> >wr</option>
					      	<option value="w" <c:if test="${server.wrflag == 'w' }">selected="selected"</c:if> >w</option>
					      	<option value="r" <c:if test="${server.wrflag == 'r' }">selected="selected"</c:if> >r</option>
					      	<option value="" <c:if test="${server.wrflag == '' }">selected="selected"</c:if> >[empty]</option>
				        </select>
				      </td>
				    </tr>
				    <tr>
				      <td class="prepend-1"><label >token:</label></td>
				      <td>
				      	<select id="serverList[${status.index }].token" name="serverList[${status.index }].token" >
					        <option>--selected--</option>
					      	<option value="Y" <c:if test="${server.token == 'Y' }">selected="selected"</c:if> >Y</option>
					      	<option value="N" <c:if test="${server.token == 'N' }">selected="selected"</c:if> >N</option>
				        </select>
				      </td>
				      <td>default:N</td>
				    </tr>
			    </c:forEach>
			  </tbody>
			  <tfoot id="dbConfigTfoot">
			    <tr>
			      <td><label>bizNames:</label></td>
			      <td><input type="text" id="inputTempBizName" size="30" /></td>
			      <td><input class="added" id="addTempBizName" type="button" value="add" /></td>
			    </tr>
			    <c:forEach var="bizName" items="${dbConfig.bizNameList}" >
				    <tr class="quiet">
				      <td></td>
				      <td>
				      	${bizName }
				      	<input class="hide" type="hidden" id="bizNameList" name="bizNameList" value="${bizName }" />
				      </td>
				      <td><input class="removed" type="button" value="delete" /></td>
				    </tr>
			    </c:forEach>
			  </tfoot>
			</table>
			<input id="oldBizNameList" type="hidden" value="${dbConfig.bizNameList}" />
			
			<p><input id="saveBtn" type="button" value="Save" /></p>
		</form>
    </div>
</div>
</body>
</html>