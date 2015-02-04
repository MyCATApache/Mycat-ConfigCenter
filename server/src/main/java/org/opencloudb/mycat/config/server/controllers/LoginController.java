package org.opencloudb.mycat.config.server.controllers;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.zookeeper.KeeperException;
import org.opencloudb.mycat.config.server.model.ZkNode;
import org.opencloudb.mycat.config.server.services.ZkBaseService;
import org.opencloudb.mycat.config.server.util.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@RequestMapping(value = "/")
public class LoginController {
	
	private final static Logger LOGGER = LoggerFactory.getLogger(LoginController.class);
	@Autowired
	private ZkBaseService zkAjaxService;
	
    @RequestMapping(value="/login",method = RequestMethod.GET)
    public String login(HttpServletRequest request,Model model) {
    	LOGGER.info("{web-method:index}","{进入系统首页面方法}");
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

}
