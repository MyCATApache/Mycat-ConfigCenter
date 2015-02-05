package org.opencloudb.mycat.config.client.listener;

import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;

import org.I0Itec.zkclient.IZkChildListener;
import org.I0Itec.zkclient.IZkDataListener;
import org.opencloudb.mycat.config.client.ZooKeeperClient;
import org.opencloudb.mycat.config.client.store.ConfigMap;
import org.opencloudb.mycat.config.client.util.CollectionsUtil;
import org.opencloudb.mycat.config.client.util.PathUtil;
import org.opencloudb.mycat.config.client.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Zookeeper监听器
 *
 */
public class DataMonitor implements IZkChildListener, IZkDataListener {

	private static Logger logger = LoggerFactory.getLogger(DataMonitor.class);
	
	private static ZooKeeperClient zookeeperClient;
	
	private static DataMonitor instance;
	
	private DataMonitor(){}
	
	public static DataMonitor getInstance(ZooKeeperClient zk) {
		zookeeperClient = zk;
		if(instance == null) {
			instance = new DataMonitor();
		}
		return instance;
	}
	
	@Override
	public void handleDataChange(String dataPath, Object data) throws Exception {
		logger.info("数据发生变化：" + dataPath);
		ConfigMap map = ConfigMap.getInstance();
		map.put(dataPath, data == null ? "" : data.toString());
		logger.info("变化后数据：" + map.getPathMap());
	}

	@Override
	public void handleDataDeleted(String dataPath) throws Exception {
		logger.info("删除节点：" + dataPath);
		ConfigMap map = ConfigMap.getInstance();
		map.remove(dataPath);
		zookeeperClient.unregister(dataPath);
		logger.info("变化后数据：" + map.getPathMap());
	}

	@Override
	public void handleChildChange(String parentPath, List<String> currentChilds) throws Exception {
		logger.info("子节点发生变动：" + parentPath + "::::::" + zookeeperClient.exists(parentPath));
		logger.debug("currentChilds:" + currentChilds);
		ConfigMap allMap = ConfigMap.getInstance();
		List<String> oldChild = new CopyOnWriteArrayList<String>();
		Set<String> keys = allMap.getPathMap().keySet();
		for(String key : keys) {
			if(key.startsWith(parentPath) && !key.equals(parentPath)) {
				oldChild.add(key.substring((parentPath + PathUtil.NODE_SEPERATOR).length()));
			}
		}
		
		List<String> changeList = CollectionsUtil.unionList(oldChild, currentChilds);
		logger.debug(oldChild + "changeList:" + changeList);
		for(String path : changeList) {
			String dataPath = PathUtil.concatPath(parentPath, path);
			if(zookeeperClient.exists(dataPath)) {
				zookeeperClient.register(dataPath);
				String value = zookeeperClient.read(dataPath);
				if(StringUtils.isNotEmpty(value)) {
					allMap.put(dataPath, value);
				}
				
			} else {
				allMap.remove(dataPath);
			}
		}
		logger.info("变化后的数据：" + allMap);
		
	}

}
