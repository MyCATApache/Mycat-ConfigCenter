package org.opencloudb.mycat.config.server.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Stack;

import org.I0Itec.zkclient.ZkClient;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;
import org.opencloudb.mycat.config.server.model.ZkNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


@Service
public class ZkBaseService {

	private static ZooKeeper zk;
	private static ZkClient client;

	private static Logger logger = LoggerFactory.getLogger(ZkBaseService.class);
	
	private String rootPath;
	
	/**
	 * 初始化：创建连接
	 */
	public ZkBaseService() {

		
		try {
			Properties zkConfig = new Properties();
			InputStream is = this.getClass().getClassLoader()
					.getResourceAsStream("/zookeeper.properties");
			if (is == null) {
				logger.error("file not found：zookeeper.properties");
				throw new RuntimeException(
						"XCache config file not found. Please make sure 'zookeeper.properties' is in in your classpath");
			}
			zkConfig.load(is);
			rootPath = zkConfig.getProperty("zookeeper.rootPath");
			String connectString = zkConfig.getProperty("connectString");
			int sessionTimeout = Integer.parseInt(zkConfig
					.getProperty("sessionTimeout"));
			zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
				// 监控所有被触发的事件
				public void process(WatchedEvent event) {
					logger.debug("已经触发了" + event.getType() + "事件！");

					if (event.getState() == KeeperState.Expired) {
						new ZkBaseService();
					}
				}
			});
			client = new ZkClient(connectString, sessionTimeout);
		} catch (IOException e) {
			logger.error("IOException:" + e.getMessage());
		}
	}

	/**
	 * 取得节点信息
	 * 
	 * @param path
	 * @return
	 * @throws KeeperException
	 * @throws InterruptedException
	 */
	public ZkNode getZNode(String path) throws KeeperException,
			InterruptedException {
		Stat stat = zk.exists(path, false);
		if (stat == null) {
			return null;
		} else {
//			TODO:是否有必要获取stat属性
			ZkNode znode = new ZkNode();
			znode.setStat(stat);
			try {
//				byte[] data = NodeDataSerialize.getSrcContent(zk.getData(path, false, null));
//				byte[] data = ((String)client.readData(path)).getBytes();
//				Zookeeper客户端与ZkClient客户端在写入和读取时，序列化方式不一样，应用中统一使用zkClient存取数据
				String data = client.readData(path);
				
				logger.debug(">>>>>>>>>> zkpath:" + path);
				logger.debug(">>>>>>>>>> zkpathData:" + data);
				
				znode.setData(data == null ? "": data);
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("path:" + path + "," + e.getMessage());
			}
			znode.setPath(path);
			znode.setName("/".equals(path) ? "/" : path.substring(path.lastIndexOf("/") + 1));
			
			String nodeId = StringUtils.replace(path, "/", "△");
			nodeId = StringUtils.replace(nodeId, ".", "☆");
			
			
			znode.setId(nodeId);
			znode.setCtime(DateFormatUtils.format(stat.getCtime(),"yyyy-MM-dd HH:mm:ss"));
			znode.setMtime(DateFormatUtils.format(stat.getMtime(),
					"yyyy-MM-dd HH:mm:ss"));

			return znode;
		}
	}

	/**
	 * 取得子节点信息
	 * 
	 * @param path
	 * @return
	 * @throws InterruptedException
	 * @throws KeeperException
	 */
	public List<ZkNode> getChildZNodes(String path) throws KeeperException,
			InterruptedException {
		List<String> nameList = zk.getChildren(path, false);
		if (nameList == null || nameList.size() == 0) {
			return null;
		} else {
			List<ZkNode> znodeList = new ArrayList<ZkNode>();
			path = StringUtils.endsWith(path, "/") ? path : (path + "/");
			for (String name : nameList) {
				if(path.startsWith(this.rootPath) || this.rootPath.endsWith(name)) {
					znodeList.add(this.getZNode(path + name));
				}
			}
			return znodeList;
		}
	}

	/**
	 * 取得某一节点及递归子节点的路径栈
	 * 
	 * @param pathStack
	 * @param path
	 * @return
	 * @throws KeeperException
	 * @throws InterruptedException
	 */
	public Stack<String> getZnodePathStack(Stack<String> pathStack, String path)
			throws KeeperException, InterruptedException {
		List<ZkNode> children = this.getChildZNodes(path);
		if (children == null) {
			pathStack.push(path);
		} else {
			pathStack.push(path);
			for (ZkNode child : children) {
				this.getZnodePathStack(pathStack, child.getPath());
			}
		}

		return pathStack;
	}

	/**
	 * 更新节点信息
	 * 
	 * @param path
	 * @param data
	 * @return
	 * @throws KeeperException
	 * @throws InterruptedException
	 */
	public void updateZNode(String path, String data) throws KeeperException,
			InterruptedException {
//		zk.setData(path, NodeDataSerialize.getDestContent(data.getBytes(Charset.forName("utf-8"))), -1);
		client.writeData(path, data);
	}

	/**
	 * 删除节点
	 * 
	 * @param path
	 * @throws InterruptedException
	 * @throws KeeperException
	 */
	public void deleteZNode(String path) throws InterruptedException,
			KeeperException {
//		zk.delete(path, -1);
		client.delete(path);
	}
	
	/**
	 * 判断节点是否存在
	 * @param path
	 * @return
	 * @throws KeeperException
	 */
	public boolean existsNode(String path) throws KeeperException {
		return client.exists(path);
	}

	/**
	 * 删除节点及所有递归子节点
	 * 
	 * @param path
	 * @throws KeeperException
	 * @throws InterruptedException
	 */
	public void deleteZnodeByIte(String path) throws KeeperException,
			InterruptedException {
		Stack<String> pathStack = new Stack<String>();

		pathStack = this.getZnodePathStack(pathStack, path);

		while (!pathStack.empty()) {
			this.deleteZNode(pathStack.pop());
		}
	}

	/**
	 * 增加节点
	 * 
	 * @param path
	 * @param data
	 * @throws InterruptedException
	 * @throws KeeperException
	 */
	public void addZNode(String path, String data) throws KeeperException,
			InterruptedException {
//		zk.create(path, data.getBytes(Charset.forName("utf-8")),
//				Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
		
		client.create(path, data, CreateMode.PERSISTENT);
	}
	
	/**
	 * 将property文件中属性，以节点形式添加到当前path下
	 * @param path
	 * @param file
	 * @return
	 * @throws KeeperException
	 * @throws InterruptedException
	 */
	public boolean addProperties(String path,InputStream is) throws KeeperException, InterruptedException {
		try {
//			path = StringUtils.endsWith(path, "/") ? path : (path + "/");
			
			byte[] content = new byte[is.available()];
			is.read(content);
			
			if(client.exists(path)) {
				this.updateZNode(path, new String(content));
			} else {
				this.addZNode(path, new String(content));
			}
			
//			Properties prop = new Properties();
//			prop.load(is);
//			
//			Set<Entry<Object,Object>> entrySet = prop.entrySet();
//			
//			for(Entry<Object,Object> entry : entrySet) {
//				String key = (String) entry.getKey();
//				String value = (String) entry.getValue();
//				if(!existsNode(path + key)) {
//					this.addZNode(path + key, value);
//				} else {
//					this.updateZNode(path + key, value);
//				}
//			}
			
		} catch (IOException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			return false;
		} catch (KeeperException e) {
			throw e;
		} catch (InterruptedException e) {
			throw e;
		}
		return true;
	}

}
