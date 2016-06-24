/**
 * Created by Administrator on 2016/6/23 0023.
 */
//路由设置
define(function (require) {
    var angular = require("angular");
    var public = require("publicService");
    var ngConstant = require("ngConstant");
    var getcookie = require("getCookie");
    var list1 = require("conditionFilterDit");
    var list2 = require("listDit");

    var ajaxmodule = require("ngAjaxService");
    //var upload = require("uploadService");
    //var shopselector = require("shopSelector");
    var router = require("router");
    var ngAMD = require("ngAMD");
    //var ngload = require("ngload");
    //var ng_overlay = require("ng_overlay");
    var topBar = require("topBar");
    var test =  angular.module("test", ["public", "com.tcsl.crm7.list", "com.tcsl.crm7.list2", "com.tcsl.crm7.service",'ajaxmodule','ui.router']);
    test.config(["$stateProvider", "$urlRouterProvider", '$controllerProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $controllerProvider, $locationProvider) {
        test.registerController = $controllerProvider.register;
        test.stateProvider = $stateProvider;
        //$locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("home"); //表示其他

        $stateProvider
            .state("login", ngAMD.route({//登录页
                url: "/login",
                templateUrl: "src/page/login/login.html",
                controllerUrl: "src/page/login/login.js"
            }))
            .state("home", ngAMD.route({//后台
                url: "/home",
                templateUrl: "src/page/home/home.html",
                controllerUrl: "src/page/home/home.js"
            }))
            .state("report", ngAMD.route({//报表
                url: "/report",
                templateUrl: "src/page/home/home.html",
                controllerUrl: "src/page/home/home.js"
            }))
            .state("pos", ngAMD.route({//pos页
                url: "/pos",
                templateUrl: "src/page/pos/pos.html",
                controllerUrl: "src/page/pos/posCtrl.js"//只在pos系统中加载posTopbar,其它系统无需加载
            }))
            .state("pos.default", ngAMD.route({//pos页
                url: "/default",
                templateUrl: "src/page/pos/default.html",
                controllerUrl: "src/page/pos/posCtrl.js"
            }))

            .state("pos.selectedpos", ngAMD.route({//pos选择终端页
                url: "/selectedpos",
                templateUrl: "src/page/pos/selectedpos/selectedpos.html",
                controllerUrl: "src/page/pos/selectedpos/selectedposCtrl.js"
            }))
            .state("pos.cardoperte", ngAMD.route({//卡操作公共页（左侧共享信息页）
                url: "/cardoperte",
                templateUrl: "src/page/pos/cardoperate/cardoperate.html",
                controllerUrl: "src/page/pos/cardoperate/cardoperateCtrl.js"
            }))
            .state("pos.cardoperte.mainpage", ngAMD.route({//卡操作主页（右侧动态切换页）
                url: "/mainpage",
                templateUrl: "src/page/pos/cardoperate/mainpage/mainpage.html",
                controllerUrl: "src/page/pos/cardoperate/mainpage/mainpageCtrl.js"
            }))
            .state("pos.editusr", ngAMD.route({//编辑user页
                url: "/editusr",
                templateUrl: "src/page/pos/editusr/editusr.html",
                controllerUrl: "src/page/pos/editusr/editusrCtrl.js"
            }))
            .state("pos.postradedetail", ngAMD.route({//pos交易管理
                url: "/postrademanage/detail",
                templateUrl: "src/page/pos/postrademanage/tradeDetail.html",
                controllerUrl: "src/page/pos/postrademanage/tradeDetail.js"
            }))
            .state("company", ngAMD.route({//集团页
                url: "/company",
                templateUrl: "src/page/basedata/companymanager/companyInfo.html",
                controllerUrl: "src/page/basedata/companymanager/companyInfoCtroller.js"
            }));
    }]);
    test.run(function($rootScope) {
        $rootScope.ctrlRegister = test.registerController;
        $rootScope.stateProvider = test.stateProvider;
    });
});