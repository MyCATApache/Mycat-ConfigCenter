package org.opencloudb.mycat.config.client;

import junit.framework.Assert;

import org.I0Itec.zkclient.ZkClient;
import org.apache.zookeeper.CreateMode;
import org.junit.Before;
import org.junit.Test;

public class TestZooKeeperClient {

	private String hosts = "192.168.44.136:2181";
	
	private int timeout = 30 * 1000;
	
	private IConfig client;
	
	private ZkClient zkClient;
	
	@Before
	public void setUp() {
		client = new ZooKeeperClient(hosts, timeout, "/config");
		zkClient = new ZkClient(hosts, timeout);
	}
	
	@Test
	public void testInit() {
		Assert.assertNotNull(client);
		Assert.assertNotNull(zkClient);
	}
	@Test
	public void testMonitor() {
		this.waitSecond(10000);
	}
	
	@Test
	public void testInitData() {
		String path = "/config/abc";
		if(zkClient.exists(path)) {
			zkClient.deleteRecursive(path);
		}
		zkClient.create(path, "hello", CreateMode.PERSISTENT);
		
	}
	
	@Test
	public void testCreate() {
		String path = "/config/testprop/delete1";
		if(zkClient.exists(path)) {
			zkClient.delete(path);
			waitSecond(1);
			Assert.assertNull(client.getProp("delete"));
		}
		
		zkClient.create(path, "delete=haha", CreateMode.PERSISTENT);
		waitSecond(1);
		Assert.assertTrue("haha".equals(client.getProp("delete")));
		zkClient.writeData(path, "delete=hehe");
		waitSecond(1);
		Assert.assertTrue("hehe".equals(client.getProp("delete")));
		
		zkClient.writeData(path, "delete=hehe\nhello=world");
		waitSecond(1);
		Assert.assertTrue("world".equals(client.getProp("hello")));
		
		waitSecond(1);
		Assert.assertTrue("delete=hehe\nhello=world".equals(client.getProp("/config/testprop/delete1")));
		
		waitSecond(100);
	}
	
	private void waitSecond(int sec) {
		try {
			Thread.sleep(sec * 1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
			Assert.fail(e.getMessage());
		}
	}

}
