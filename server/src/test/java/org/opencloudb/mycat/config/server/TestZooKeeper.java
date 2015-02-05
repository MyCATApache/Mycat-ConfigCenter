package org.opencloudb.mycat.config.server;

import java.io.IOException;
import java.util.List;

import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.EventType;
import org.apache.zookeeper.ZooDefs.Ids;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;
import org.junit.Before;
import org.junit.Test;
import org.springframework.util.Assert;

public class TestZooKeeper {

	private String hosts = "192.168.44.136:2181";
	
	private int timeout = 30 * 1000;
	
	private ZooKeeper zk;
	@Before
	public void init() {
		try {
			Watcher watcher = new MyWatcher();
			zk = new ZooKeeper(hosts, timeout, watcher);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void testClient() {
		try {
			Thread t = new Thread(new ZkWatcher());
			t.start();
			Thread.sleep(100 * 1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	class ZkWatcher implements Runnable {

		@Override
		public void run() {
			try {
				List<String> list = zk.getChildren("/", true);
				for(String s : list) {
					System.out.println(s);
				}
				while(true) {
					watch("/config");
					Thread.sleep(5 * 1000);
				}
			} catch (KeeperException e) {
				e.printStackTrace();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			
		}
		
		private void watch(String path) throws KeeperException, InterruptedException {
			
			System.out.println("path:" + path);
			Stat stat = zk.exists(path, true);
			
			if(stat == null) {
				return ;
			}
			List<String> list = zk.getChildren(path, true);
			for(String p : list) {
				if(!path.endsWith("/")) {
					watch(path + "/" + p);
				} else {
					watch(path + p);
				}
			}
		}
		
	}
	@Test
	public void testInitData() {
		String path = "/config";
		try {
			if(zk.exists(path, true) == null) {
				zk.create(path, "hello".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
			}
		} catch(Exception e) {
			e.printStackTrace();
			org.junit.Assert.fail();
		}
	}
	
	@Test
	public void testCreateNode() {
		String path = "/config/ttt";
		
		
		try {
			if(zk.exists(path, true) == null) {
				zk.create(path, "hello".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
			}
			for(int i = 0;i < 100;i++) {
				zk.create(path + "/" + System.currentTimeMillis(), ("hello" + i).getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
			}
			Thread.sleep(10 * 1000);
			List<String> list = zk.getChildren(path, true);
			for(String p : list) {
				if(zk.exists(path + "/" + p, true) != null) {
					zk.delete(path + "/" + p, -1);
				}
			}
		} catch (KeeperException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		
	}
	
	
	
	
	@Test
	public void testCreate() {
		try {
			Assert.notNull(zk);
			zk.exists("/config", true);
			zk.setData("/config", ("hello" + System.currentTimeMillis()).getBytes(), -1);
			String path = "/config/test";
			for(int i = 0;i < 5;i++) {
				System.out.println("the " + i + " times");
				if(zk.exists(path, true) != null) {
					
					zk.setData(path, "hello".getBytes(), -1);
					
					zk.exists(path, true);
					zk.delete(path, -1);
				}
				zk.exists(path, true);
				String res = zk.create(path, "test".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
				
				zk.exists("/config/test1", true);
				zk.create("/config/test1", "hello".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
				zk.exists("/config/test1", true);
				zk.delete("/config/test1", -1);
				
				System.out.println("res:" + res);
				Thread.sleep(10 * 1000);
			}
			
			zk.setData(path, "change".getBytes(), -1);
			
		} catch (KeeperException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}

class MyWatcher implements Watcher {
	@Override
	public void process(WatchedEvent event) {
		EventType type = event.getType();
		switch(type) {
			case NodeCreated:
				System.out.println("created.." + event.getPath());
				break;
			case NodeDeleted:
				System.out.println("deleted.." + event.getPath());
				break;
			case NodeDataChanged:
				System.out.println("changing.." + event.getPath());
				break;
			case NodeChildrenChanged:
				System.out.println("nodeChildrenChanged" + event.getPath());
				break;
			default:
				System.out.println("default...");
				break;
		}
		System.out.println("节点发生变化：" + event.getType() + ":" + event.getPath());
	}
}
