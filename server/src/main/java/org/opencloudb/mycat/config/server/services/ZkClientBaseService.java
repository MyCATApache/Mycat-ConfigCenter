package org.opencloudb.mycat.config.server.services;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Stack;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.ZooDefs.Ids;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;
import org.opencloudb.mycat.config.server.model.ZkNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


@Service
public class ZkClientBaseService {

	private static Logger logger = LoggerFactory.getLogger(ZkClientBaseService.class);
	
	private static ZooKeeper zk;
	/**
	 * 初始化：创建连接
	 */
	public ZkClientBaseService() {

		try {
			Properties zkConfig = new Properties();
			InputStream is = this.getClass().getClassLoader()
					.getResourceAsStream("/zookeeper.properties");
			if (is == null) {
				throw new RuntimeException(
						"XCache config file not found. Please make sure 'zookeeper.properties' is in in your classpath");
			}
			zkConfig.load(is);
			String connectString = zkConfig.getProperty("connectString");
			int sessionTimeout = Integer.parseInt(zkConfig
					.getProperty("sessionTimeout"));
			
			zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
				// 监控所有被触发的事件
				public void process(WatchedEvent event) {
					System.out.println("已经触发了" + event.getType() + "事件！");
					if (event.getState() == KeeperState.Expired) {
						new ZkClientBaseService();
					}
				}
			});

		} catch (Exception e) {
			logger.error("zk初始化异常：",e.getMessage());
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
		Stat stat = zk.exists(path,true);
		if (stat == null) {
			return null;
		} else {
			ZkNode znode = new ZkNode();
			
			znode.setStat(stat);
			try {
				System.out.println(">>>>>>>>>> zk:" + zk);
				System.out.println(">>>>>>>>>> zkpath:" + path);
				System.out.println(">>>>>>>>>> zkNode:"
						+ zk.getData(path, false, null));
				byte[] data = zk.getData(path, false, null);

				znode.setData(data == null || data.length <= 0 ? ""
						: new String(zk.getData(path, false, null), "utf-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			znode.setPath(path);
			znode.setName("/".equals(path) ? "/" : path.substring(path
					.lastIndexOf("/") + 1));
			znode.setId(StringUtils.replace(path, "/", "△"));
			znode.setCtime(DateFormatUtils.format(stat.getCtime(),
					"yyyy-MM-dd HH:mm:ss"));
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
			for (String name : nameList) {
				znodeList
						.add(this.getZNode(StringUtils.endsWith(path, "/") ? path
								+ name
								: path + "/" + name));
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
		// ZookeeperManager.getInstance().setData(path, data);
		zk.setData(path, data.getBytes(Charset.forName("utf-8")), -1);
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
		zk.delete(path, -1);
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
		zk.create(path, data.getBytes(Charset.forName("utf-8")),
				Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
	}

}
