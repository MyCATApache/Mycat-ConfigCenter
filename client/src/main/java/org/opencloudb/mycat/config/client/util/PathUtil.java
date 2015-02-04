package org.opencloudb.mycat.config.client.util;

public class PathUtil {
	
	public static final String NODE_SEPERATOR = "/";
	
	public static String concatPath(String root,String node) {
		if(root == null) {
			root = NODE_SEPERATOR;
		}
		if(!root.startsWith(NODE_SEPERATOR)) {
			throw new RuntimeException("path should be start with a /");
		}
		
		if(!root.endsWith(NODE_SEPERATOR)) {
			root = root + NODE_SEPERATOR;
		}
		
		return root + node;
	}
}
