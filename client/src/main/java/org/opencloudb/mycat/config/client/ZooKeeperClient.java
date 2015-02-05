package org.opencloudb.mycat.config.client;

import java.util.List;

import org.I0Itec.zkclient.ZkClient;
import org.apache.zookeeper.CreateMode;
import org.opencloudb.mycat.config.client.listener.DataMonitor;
import org.opencloudb.mycat.config.client.store.ConfigMap;
import org.opencloudb.mycat.config.client.util.PathUtil;
import org.opencloudb.mycat.config.client.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 查询接口的zookeeper实现，主要功能：
 * 1.监控zookeeper节点变化，并将变化同步至缓存；
 * 2.提供属性查询服务；
 *
 */
public class ZooKeeperClient implements IConfig {
	
	private static Logger logger = LoggerFactory.getLogger(ZooKeeperClient.class);
	
	private ZkClient zkClient;
	
	private String path;
	
	private String hosts;
	
	private int timeout;
	
	private DataMonitor monitor = DataMonitor.getInstance(this);
	
	public ZooKeeperClient(String hosts,int timeout,String path) {
		this.hosts = hosts;
		this.timeout = timeout;
		this.path = path;
		if(StringUtils.isEmpty(path) || !path.startsWith(PathUtil.NODE_SEPERATOR)) {
			throw new RuntimeException("路径配置有误");
		}
		
		init();
	}
	

	private void init() {
//		初始化zk客户端
		initZk();
//		初始化节点信息
		initData(this.path);
//		初始化监听器
		register(this.path);
	}
	
	private void initZk() {
		zkClient = new ZkClient(this.hosts, this.timeout);
	}
	
	private void initData(String dataPath) {
		logger.info("初始加载数据：" + dataPath);
		ConfigMap map = ConfigMap.getInstance();
		
		if(!exists(dataPath)) {
			zkClient.create(dataPath, "", CreateMode.PERSISTENT);
		}
		
		List<String> childList = zkClient.getChildren(dataPath);
		
//		若存在子节点，遍历子节点注册监听
		for(String child : childList) {
			String node = PathUtil.concatPath(dataPath, child);
			String value = read(node);
			map.put(node, value == null ? "":value);
		}
		logger.info("加载后的数据：" + ConfigMap.getInstance().getPropsmap());
	}

//	将路径dataPath注册到监听器中
	public void register(String dataPath) {
		logger.info("注册监听：" + dataPath);
		
		if(zkClient == null) {
			initZk();
		}
		
		zkClient.subscribeDataChanges(dataPath, monitor);
		
		zkClient.subscribeChildChanges(dataPath, monitor);
		
		List<String> childList = zkClient.getChildren(dataPath);
		
//		若存在子节点，遍历子节点注册监听
		for(String child : childList) {
			register(PathUtil.concatPath(dataPath, child));
		}
		
	}
//	取消节点dataPath的监听
	public void unregister(String dataPath) {
		zkClient.unsubscribeChildChanges(dataPath, monitor);
		zkClient.unsubscribeDataChanges(dataPath, monitor);
	}
//	判断节点是否存在
	public boolean exists(String dataPath) {
		return zkClient.exists(dataPath);
	}
//	读取节点内容
	public String read(String dataPath) {
		Object obj = zkClient.readData(dataPath);
		return obj == null ? "" : obj.toString();
	}
	
	@Override
	public String getProp(String key) {
		return getProp(key,null);
	}

	@Override
	public String getProp(String key, String defaultValue) {
		String value = ConfigMap.getInstance().getProp(key);
		return value == null ? defaultValue:value;
	}

}
