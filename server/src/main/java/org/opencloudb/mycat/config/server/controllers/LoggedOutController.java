package org.opencloudb.mycat.config.server.controllers;

import org.opencloudb.mycat.config.server.util.Constant;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@RequestMapping(value = "/loggedout")
public class LoggedOutController {

    @RequestMapping(method = RequestMethod.GET)
    public String show(Model model) {
        return Constant.PAGE_LOGOUT;
    }

}
