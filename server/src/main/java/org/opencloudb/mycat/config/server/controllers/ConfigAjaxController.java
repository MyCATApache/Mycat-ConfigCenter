package org.opencloudb.mycat.config.server.controllers;

import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.zookeeper.KeeperException;
import org.opencloudb.mycat.config.server.model.ZkNode;
import org.opencloudb.mycat.config.server.services.ZkBaseService;
import org.opencloudb.mycat.config.server.util.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;


@Controller
@RequestMapping(value = "/configAjax")
public class ConfigAjaxController {

	private Logger log = LoggerFactory.getLogger(ConfigAjaxController.class);

	@Resource
	private ZkBaseService zkAjaxService;

	/**
	 * 页面初始化
	 * 
	 * @param model
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET)
	public String show(HttpServletRequest request,Model model) {
		
		try {
			List<ZkNode> znodeList = zkAjaxService.getChildZNodes("/");
			model.addAttribute("znodeList", znodeList);
		} catch (KeeperException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return Constant.PAGE_COMMON;
	}

	/**
	 * 取得节点信息
	 * 
	 * @param path
	 * @return
	 */
	@RequestMapping(value = "/getZNode", method = RequestMethod.GET)
	public @ResponseBody
	Map<String, ? extends Object> getZNode(HttpServletRequest request,@RequestParam String path) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		ZkNode znode = null;
		String msg = null;
		
		try {
			znode = zkAjaxService.getZNode(path);
		} catch (KeeperException e) {
			msg = e.getMessage();
		} catch (InterruptedException e) {
			msg = e.getMessage();
		} catch (Exception e) {
			msg = e.getMessage();
		}

		if (msg == null) {
			msg = "succ";
		}

		resultMap.put("msg", msg);
		resultMap.put("znode", znode);

		return resultMap;
	}

	/**
	 * 取得子节点信息
	 * 
	 * @param path
	 * @return
	 */
	@RequestMapping(value = "/getChildren", method = RequestMethod.GET)
	public @ResponseBody
	Map<String, ? extends Object> getChildren(@RequestParam String path) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String msg = null;
		List<ZkNode> znodeList = null;
		try {
			znodeList = zkAjaxService.getChildZNodes(path);
		} catch (KeeperException e) {
			msg = e.getMessage();
		} catch (InterruptedException e) {
			msg = e.getMessage();
		} catch (Exception e) {
			msg = e.getMessage();
		}

		if (msg == null) {
			msg = "succ";
		}

		resultMap.put("msg", msg);
		resultMap.put("znodeList", znodeList);
		return resultMap;
	}

	/**
	 * 更新节点信息
	 * 
	 * @param path
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updateZNode", method = { RequestMethod.POST })
	public @ResponseBody
	String updateZNode(@RequestParam("path") String path, @RequestParam("data") String data) {
		try {
			log.info("path >>" + path + "; data >>" + data);
			zkAjaxService.updateZNode(path, data);
		} catch (KeeperException e) {
			return e.getMessage();
		} catch (InterruptedException e) {
			return e.getMessage();
		} catch (Exception e) {
			return e.getMessage();
		}

// Map<String, String> resultMap = new HashMap<String, String>();
// resultMap.put("msg", "succ");
		return "succ";
	}

	/**
	 * 删除节点信息
	 * 
	 * @param path
	 * @return
	 */
	@RequestMapping(value = "/deleteZNode", method = RequestMethod.GET)
	public @ResponseBody
	String deleteZNode(@RequestParam String path) {
		try {
			zkAjaxService.deleteZNode(path);
		} catch (KeeperException e) {
			return e.getMessage();
		} catch (InterruptedException e) {
			return e.getMessage();
		} catch (Exception e) {
			return e.getMessage();
		}

		return "succ";
	}

	/**
	 * 新增节点信息
	 * 
	 * @param path
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/addZNode", method = { RequestMethod.POST })
	public @ResponseBody
	String addZNode(@RequestParam String path, @RequestParam String data) {
		try {
			log.info("path >>" + path + "; data >>" + data);
			zkAjaxService.addZNode(path, data);
		} catch (KeeperException e) {
			e.getMessage();
			return e.getMessage();
		} catch (InterruptedException e) {
			return e.getMessage();
		} catch (Exception e) {
			return e.getMessage();
		}

		return "succ";
	}
	@RequestMapping(value = "/addChildren",method = {RequestMethod.POST})
	public @ResponseBody String addProperties(@RequestParam(required=false) String path,@RequestParam(required=false) MultipartFile propertiesFile,HttpServletRequest req) {
		
		log.info(path + ":" + propertiesFile + ":" + ToStringBuilder.reflectionToString(propertiesFile));
		CommonsMultipartFile cmf = (CommonsMultipartFile) propertiesFile;
		try {
			if(propertiesFile == null) {
				log.warn("file uploaded is null");
				throw new FileNotFoundException("file not found");
			}
			if(StringUtils.isEmpty(path)) {
				log.warn("path is empty");
				throw new IllegalAccessException("path cannot be empty");
			}
			String fileName = cmf.getFileItem().getName();
			if(!fileName.endsWith("properties")) {
				log.warn("file should be properties file");
				throw new IllegalAccessException("file should be properties file");
			}
			
			log.info("path:" + path + ";file:" + fileName + "," + propertiesFile.getInputStream().available());
			boolean isSucc = zkAjaxService.addProperties(path, propertiesFile.getInputStream());
			if(isSucc) {
				return "succ";
			}
		} catch (NullPointerException e) {
			log.error(e.getMessage());
			return "error";
		} catch (KeeperException e) {
			log.error(e.getMessage());
			return e.getMessage();
		} catch (InterruptedException e) {
			log.error(e.getMessage());
			return e.getMessage();
		} catch (FileNotFoundException e) {
			log.error(e.getMessage());
			return e.getMessage();
		} catch(Exception e) {
			log.error(e.getMessage());
			return e.getMessage();
		}
		return "fail";
	}
}
