package org.opencloudb.mycat.config.client.spring;

import org.I0Itec.zkclient.ZkClient;
import org.apache.zookeeper.CreateMode;
import org.junit.Before;
import org.junit.Test;
import org.opencloudb.mycat.config.client.IConfig;
import org.opencloudb.mycat.config.client.ZooKeeperClient;


public class TestCachPropertyConfigurer {

	private String hosts = "192.168.198.170:2181";
	
	private int timeout = 30 * 1000;
	
	private IConfig client;
	
	private ZkClient zkClient;
	private String path = "/config/testprop";
	
	@Before
	public void setUp() {
		client = new ZooKeeperClient(hosts, timeout, path);
		zkClient = new ZkClient(hosts, timeout);
	}
	
	@Test
	public void testAddConfig() {
		String ip = "10.45.253.163";
		String port = "9090";
		String timeout = "1000";
		String maxActive = "100";
		String maxIdle = "8";
		String minIdle = "8";
		String maxWaitMill = "1000";
		
		if(!zkClient.exists(path)) {
			zkClient.createPersistent(path);
		}
		
		if(!zkClient.exists(path + "/" + "thriftserver.ip")) {
			zkClient.create(path + "/" + "thriftserver.ip", ip, CreateMode.PERSISTENT);
		}
		
		if(!zkClient.exists(path + "/" + "thriftserver.port")) {
			zkClient.create(path + "/" + "thriftserver.port", port, CreateMode.PERSISTENT);
		}
		if(!zkClient.exists(path + "/" + "thriftserver.conTimeOut")) {
			zkClient.create(path + "/" + "thriftserver.conTimeOut", timeout, CreateMode.PERSISTENT);
		}
		if(!zkClient.exists(path + "/" + "thriftserver.maxActive")) {
			zkClient.create(path + "/" + "thriftserver.maxActive", maxActive, CreateMode.PERSISTENT);
		}
		if(!zkClient.exists(path + "/" + "thriftserver.maxIdle")) {
			zkClient.create(path + "/" + "thriftserver.maxIdle", maxIdle, CreateMode.PERSISTENT);
		}
		if(!zkClient.exists(path + "/" + "thriftserver.minIdle")) {
			zkClient.create(path + "/" + "thriftserver.minIdle", minIdle, CreateMode.PERSISTENT);
		}
		if(!zkClient.exists(path + "/" + "thriftserver.maxWaitMillis")) {
			zkClient.create(path + "/" + "thriftserver.maxWaitMillis", maxWaitMill, CreateMode.PERSISTENT);
		}
		
	}
}
