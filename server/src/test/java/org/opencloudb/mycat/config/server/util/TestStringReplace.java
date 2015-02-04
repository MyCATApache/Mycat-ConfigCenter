package org.opencloudb.mycat.config.server.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.apache.commons.lang3.StringUtils;
import org.junit.Test;

public class TestStringReplace {

	String path = "/config/delete/t.1.2.3";
	@Test
	public void testReplace() {
		String nodeId = StringUtils.replace(path, "/", "△");
		nodeId = StringUtils.replace(nodeId, ".", "☆");
		System.out.println(nodeId);
	}
	
	@Test
	public void testUrlEncode() {
		try {
			String s = URLEncoder.encode(path,"utf-8");
			System.out.println(s);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
	
	protected TestStringReplace(){}
}
class t extends TestStringReplace {
	
}
