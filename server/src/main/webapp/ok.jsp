<%@page contentType="text/html"%>
<%@page pageEncoding="GB2312"%>
<%@page info="author:XiaoNing"%>
<%@ page import="java.util.Calendar" %>
<%@ page import="java.text.SimpleDateFormat" %>
<% 

Calendar cal= Calendar.getInstance(); 
 

int dayOfMonth = cal.get(Calendar.DAY_OF_MONTH); 
out.print("<br>Day of Month: " + dayOfMonth + " <br>"); 
 
SimpleDateFormat formatter1 = new SimpleDateFormat("yyyy-MM-dd"); 
String b=formatter1.format(cal.getTime()); 
out.print(b);
%>