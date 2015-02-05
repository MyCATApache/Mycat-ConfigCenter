package org.opencloudb.mycat.config.client;

/**
 * 用户查询接口，可以查询具体配置信息
 *
 */
public interface IConfig {

	/**
	 * 根据给定的key获取属性值，并返回
	 * @param key
	 * @return
	 */
	public String getProp(String key);
	
	/**
	 * 根据给定的key获取属性值，若属性值为null，返回defaultValue
	 * @param key
	 * @param defaultValue
	 * @return
	 */
	public String getProp(String key,String defaultValue);
}
