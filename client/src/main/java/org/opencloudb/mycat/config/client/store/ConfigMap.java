package org.opencloudb.mycat.config.client.store;

import java.io.IOException;
import java.io.StringReader;
import java.util.Map;
import java.util.Map.Entry;
import java.util.HashMap;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 存储所有配置属性
 *
 */
public class ConfigMap {

	private static Logger logger = LoggerFactory.getLogger(ConfigMap.class);
	
	private static final Map<String, Map<String,String>> propsMap = new ConcurrentHashMap<String, Map<String,String>>();
	
	private static final Map<String,String> pathMap = new ConcurrentHashMap<String, String>();
	
	public Map<String, String> getPathMap() {
		return pathMap;
	}

	public Map<String, Map<String,String>> getPropsmap() {
		return propsMap;
	}

	/**
	 * 遍历各节点的map，查找该key对应的值
	 * @param key
	 * @return
	 */
	public String getProp(String key) {
		logger.debug("获取值：",key);
		String value = null;
		Set<Entry<String,Map<String,String>>> entryProps = propsMap.entrySet();
		for(Entry<String,Map<String,String>> e : entryProps) {
			value = e.getValue().get(key);
			if(value != null) {
				logger.debug("返回值：",value);
				return value;
			}
		}
		
		Set<Entry<String,String>> entryPath = pathMap.entrySet();
		for(Entry<String,String> e : entryPath) {
			if(key.equals(e.getKey())) {
				value = e.getValue();
			}
			if(value != null) {
				logger.debug("返回值：",value);
				return value;
			}
		}
		return value;
	}
	
	public void put(String path,String value) {
		logger.debug("更新数据，节点路径：" + path);
		logger.debug("节点值：" + value);
		pathMap.put(path, value);
		updateProps(path,value);
	}
	
	public void remove(String path) {
		logger.debug("删除节点：" + path);
		pathMap.remove(path);
		propsMap.remove(path);
	}
	
	
	private void updateProps(String path,String value) {
		
		StringReader reader = new StringReader(value);
		Map<String,String> nodeMap = new HashMap<String, String>();
		try {
			Properties ps = new Properties();
			ps.load(reader);
			nodeMap.clear();
			Set<Object> keys = ps.keySet();
			for(Object key : keys) {
				String k = (String) key;
				String v = ps.getProperty(k);
				nodeMap.put(k, v);
			}
			propsMap.put(path, nodeMap);
		} catch(ClassCastException e) {
			e.printStackTrace();
			logger.error(e.getClass().getName(),e.getMessage());
		} catch(IOException e) {
			e.printStackTrace();
			logger.error(e.getClass().getName(),e.getMessage());
		} catch(Exception e) {
			e.printStackTrace();
			logger.error(e.getClass().getName(),e.getMessage());
		}
		logger.debug("更新后的数据：" + propsMap);
	}



	private static ConfigMap instance;
	
	public static ConfigMap getInstance() {
		if(instance == null) {
			synchronized (ConfigMap.class){
				if(instance == null) {
					instance = new ConfigMap();
				}
			}
			instance = new ConfigMap();
		}
		return instance;
	}
	
	private ConfigMap(){}
}
