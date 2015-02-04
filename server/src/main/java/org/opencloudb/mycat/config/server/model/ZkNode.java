package org.opencloudb.mycat.config.server.model;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.zookeeper.data.Stat;

public class ZkNode {

    // 节点ID
    private String id;

    // 节点名称
    private String name;

    // 节点路径
    private String path;

    // 节点内容
    private String data;

    // 节点状态
    private Stat stat;

    // 节点创建时间
    private String ctime;

    // 节点修改时间
    private String mtime;

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id
     *            the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name
     *            the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the path
     */
    public String getPath() {
        return path;
    }

    /**
     * @param path
     *            the path to set
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * @return the stat
     */
    public Stat getStat() {
        return stat;
    }

    /**
     * @param stat
     *            the stat to set
     */
    public void setStat(Stat stat) {
        this.stat = stat;
    }

    /**
     * @return the data
     */
    public String getData() {
        return data;
    }

    /**
     * @param data
     *            the data to set
     */
    public void setData(String data) {
        this.data = data;
    }

    /**
     * @return the ctime
     */
    public String getCtime() {
        return ctime;
    }

    /**
     * @param ctime
     *            the ctime to set
     */
    public void setCtime(String ctime) {
        this.ctime = ctime;
    }

    /**
     * @return the mtime
     */
    public String getMtime() {
        return mtime;
    }

    /**
     * @param mtime
     *            the mtime to set
     */
    public void setMtime(String mtime) {
        this.mtime = mtime;
    }

    @Override
    public String toString() {
    	return ToStringBuilder.reflectionToString(this);
    }
}
