package org.opencloudb.mycat.config.client.store;

import org.junit.Assert;
import org.junit.Test;

public class TestConfigMap {

	@Test
	public void testAdd() {
		ConfigMap cm = ConfigMap.getInstance();
		cm.put("/home/ext", "a=1\nb=2");
		Assert.assertTrue("1".equals(cm.getProp("a")));
	}
	
	@Test
	public void testUpdate() {
		ConfigMap cm = ConfigMap.getInstance();
		String v1 = "a=1\nb=2\nc=3";
		String v2 = "a=1\nb=2\nc=31";
		String path = "/home/ext/sbin";
		cm.put(path, v1);
		Assert.assertTrue("3".equals(cm.getProp("c")));
		cm.put(path, v2);
		Assert.assertTrue("31".equals(cm.getProp("c")));
	}
	@Test
	public void testMorePath() {
		ConfigMap cm = ConfigMap.getInstance();
		String v1 = "a=1\nb=2\nc=3";
		String v2 = "a1=1\nb1=2\nc1=31";
		String path1 = "/home/ext/sbin";
		String path2 = "/home/sbin";
		cm.put(path1, v1);
		cm.put(path2, v2);
		Assert.assertTrue("3".equals(cm.getProp("c")));
		Assert.assertTrue("31".equals(cm.getProp("c1")));
	}
}
