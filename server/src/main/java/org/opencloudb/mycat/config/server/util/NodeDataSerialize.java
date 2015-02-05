package org.opencloudb.mycat.config.server.util;

public class NodeDataSerialize {
	private static byte[] preContent = new byte[]{-84,-19,0,5,116,0,4};
	
	public static byte[] getSrcContent(byte[] content) {
		if(content == null) {
			return null;
		}
		byte[] srcContent = null;
		
		if(startWith(content)) {
			srcContent = new byte[content.length - preContent.length];
			System.arraycopy(content, preContent.length, srcContent, 0, srcContent.length);
			return srcContent;
		}
		return content;
	}

	
	public static byte[] getDestContent(byte[] content) {
		if(content == null || content.length == 0) {
			return preContent;
		}
		byte[] destContent = null;
		if(!startWith(content)) {
			destContent = new byte[content.length + preContent.length];
			System.arraycopy(preContent, 0, destContent, 0, preContent.length);
			System.arraycopy(content, 0, destContent, preContent.length, content.length);
			return destContent;
		} else {
			return content;
		}
	}
	
	private static boolean startWith(byte[] content) {
		if(content != null && content.length >= preContent.length) {
			for(int i = 0;i < preContent.length;i++) {
				if(preContent[i] != content[i]) {
					return false;
				}
			}
			return true;
		}
		
		return false;
	}
}
