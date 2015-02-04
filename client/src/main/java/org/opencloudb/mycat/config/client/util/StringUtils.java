package org.opencloudb.mycat.config.client.util;

public class StringUtils {
	
	public static boolean isNotEmpty(String s) {
		return !isEmpty(s);
	}
	
	public static boolean isEmpty(String s) {
		return s == null || "".equals(s.trim());
	}
}
