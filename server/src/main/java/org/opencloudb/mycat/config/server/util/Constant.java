package org.opencloudb.mycat.config.server.util;

public class Constant {

    // 斜线
    public static final String SLASH = "/";

    // 回车换行
    public static final String CRLF = "\n";

    // 等号
    public static final String EQUAL = "=";

    // tab
    public static final String TAB = "\t";

    // 默认语言
    public static final String LANGUAGE_DEFAULT = "default";

    // zk 数据库配置信息路径
    public static final String PATH_DB_CONFIG = "/configuration/dbInstance";

    // zk 多语言系统配置信息路径
    public static final String PATH_I18N = "/i18n";

    public static final String PAGE_COMMON = "config/configAdminAjax";

    public static final String PAGE_DBCONFIG = "config/dbConfig";

    public static final String PAGE_DBCONFIG_EDIT = "config/dbConfigEdit";

    public static final String PAGE_LOGIN = "login";

    public static final String PAGE_LOGOUT = "loggedout";

    // 多语言系统_项目列表
    public static final String PAGE_I18N_PROJECT_LIST = "i18n/projectList";

    // 多语言系统_项目编辑
    public static final String PAGE_I18N_PROJECT_EDIT = "i18n/projectEdit";

    // 多语言系统_属性列表
    public static final String PAGE_I18N_PROPERTY_LIST = "i18n/propertyList";

    // 多语言系统_属性编辑
    public static final String PAGE_I18N_PROPERTY_EDIT = "i18n/propertyEdit";

    // 多语言系统_编辑新属性
    public static final String PAGE_I18N_PROPERTY_NEW = "i18n/propertyNew";

    // 模块节点注释信息
    public static final String PROPERTIES_COMMENTS_PROJNODE = "recorder is language key's detail message. format is\nkey=createTime\tupdateTime\tdescription";

    // 语言节点注释信息
    public static final String PROPERTIES_COMMENTS_LANGNODE = "recorder is language key's value. format is\nkey=value";

    // 属性检索类型——键
    public static final int PROPERTIES_SEARCH_TYPE_KEY = 0;

    // 属性检索类型——值
    public static final int PROPERTIES_SEARCH_TYPE_VALUE = 1;
    
    // 多语言系统_综合显示页
    public static final String PAGE_I18N_PAGE_LIST = "i18n/pageList";
    
    // 多语言系统_page编辑页
    public static final String PAGE_I18N_PAGE_EDIT = "i18n/pageEdit";
    
    // 多语言系统_属性编辑
    public static final String PAGE_I18N_PROPERTY_UPDATE = "i18n/propertyUpdate";
}
