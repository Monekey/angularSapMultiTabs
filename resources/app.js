var appBaseUrl = 'resources/dist/page';
requirejs.config({
    baseUrl: 'resources/dist/page',
    paths: {
        app: "../app",
        //配置lib目录下的第三方公共包
        angular: "../lib/angular",
        jquery: "../lib/jquery.min",
        text: "../lib/text.min",
        css: "../lib/css",
        echart: '../lib/echarts/echarts.min',
        macarons: '../lib/echarts/macarons',

        ui_bootstrap: "../lib/bootstrap/ui-bootstrap-tpls-1.2.1",
        ui_bootstrap_css: "../lib/bootstrap/bootstrap.min",
        ng_upload:"../lib/ng-file-upload.min",
        router: "../lib/angular-ui-router.min",
        //ng_upload_shim:"../lib/ng-file-upload-shim",
        ng_overlay: "../lib/angular-loading-overlay.min",
        ng_message: "../lib/angular-messages.min",
        ngAMD:"../lib/angularAMD.min",
        ngload:"../lib/ngload",
        zTree: '../lib/zTree/jquery.ztree.all.min',
        zTree_css:'../assets/css/ztree-style',
        ng_animate: '../lib/bootstrap/angular-animate.min',

        esegece: '../lib/esegece',
        sgc: '../lib/sgcWebSockets',
        base64:'../lib/Base64',
        //配置service目录下自定义angular公共service
        getCookie: "../service/getCookie",
        publicService: "../service/publicService",
        ngAjaxService: "../service/ngAjaxService",
        uploadService: "../service/upload",
        ngConstant: "../service/constant",//constant

        //配置pos/service目录下自定义pos公共service
        posService: "pos/service/posService",

        //配置module目录下公共common module
        topBar:"../module/top-bar/directive/topBarDirective",
        period: "../module/period-module/directive/periodDirect",
        conditionFilterDit:"../module/filter-module/directive/conditionDirective",
        listDit:"../module/list-module/directive/listDirective",
        modal: "../module/modal/directive/modalDirective",
        shopSelector:"../module/shopselector/directive/shopSelectorDirective",

        rippleButton:"home/ripple-button/directive/rippleDirective",

        //配置pos/module目录下pos系统公共common module
        posTopbar: 'pos/module/pos-topbar/posTopbarDirective',
        devices:"pos/module/devices/directive/devicesDirective",

        //配置assets/css目录下css样式
        login_css: "../assets/css/login",
        score_rule_css: "../assets/css/score-rule",
        comprehensive_css: "../assets/css/comprehensive",
        myindex_css: "../assets/css/my-index",
        card_type_css:"../assets/css/card-type",
        alert_manage_css: "../assets/css/alert-manage",
        company_css:"../assets/css/company",
        shop_selector_css: "../assets/css/shop-selector",
        role_css:"../assets/css/role",
        message_manage_css:"../assets/css/message-manage",
        pos_css:"../assets/css/pos",
        emp_css:"../assets/css/emp",
        trade_css:"../assets/css/trade",
        exchange_rule_css: "../assets/css/exchange-rule",
        saving_rule_css:"../assets/css/saving-rule",
        upgrade_rule_css:"../assets/css/card-upgrade-rule",
        card_manage_css:"../assets/css/card-manage",

        //datepicker
        jedate:'../lib/jedate/jedate.min',
    },
    shim: {
        angular: {
            deps: [],
            exports: "angular"
        },
        ui_bootstrap: {
            deps: ["angular"],
            exports: "uibootstrap"
        },
        ng_animate:{
            deps: ["angular"],
            exports: "ng_animate"
        },
        ng_upload:{
            deps: ["angular"],
            exports: "ng_upload"
        },
        ng_route:{
            deps: ["angular"],
            exports:"ng_route"
        },
        ngAMD:{
            deps: ["angular"],
            exports:"ngAMD"
        },
        ng_message:{
            deps: ["angular"],
            exports:"ng_message"
        },
        ngload:{
            deps: ["angular"],
            exports:"ngload"
        },
        router:{
            deps: ["angular"],
            exports: "router"
        },
        zTree:{
            deps:["jquery"],
            exports:"zTree"
        }
    },
    //urlArgs: "version=" + (new Date()).getTime(),
   /* waitSeconds: 0,
    deps: ["app"]*/

});
define(function (require) {
    var angular = require("angular");
    var router = require("router");
    var ngAMD = require("ngAMD");
    var ng_message = require("ng_message");
    var topBar = require("topBar");
    var public = require("publicService");
    var ngConstant = require("ngConstant");
    var getcookie = require("getCookie");
    var list1 = require("conditionFilterDit");
    var list2 = require("listDit");
    var ajaxmodule = require("ngAjaxService");
    var $ = require("jquery");

    //var upload = require("uploadService");
    //var shopselector = require("shopSelector");

    //var ngload = require("ngload");
    //var ng_overlay = require("ng_overlay");



    var test = angular.module("test", ["public", "com.tcsl.crm7.list", "com.tcsl.crm7.list2", "com.tcsl.crm7.service",'ajaxmodule','ui.router','ngMessages']);

    /*    test.run(function (bsLoadingOverlayService) {
     bsLoadingOverlayService.setGlobalConfig({
     delay: 0,
     //activeClass: "",
     templateUrl: 'resources/service/overlay.html'
     });
     bsLoadingOverlayService.start({
     referenceId: 'overlay-div'
     });
     });*/
/*    test.directive('onFinishRender', function ($timeout) {//处理加载渲染的问题
        return {
            restrict: 'A',
            scope: {
                overr:'=onFinishRender'
            },
            link: function(scope, element, attr) {
                console.log(scope.$parent.$last);
                if (scope.$parent.$last === true) {
                    console.log("fhsd");
                    $timeout(function() {
                        scope.overr = true;
                    });
                }
                console.log("return");
            }
        };
    });*/

    test.run(function($rootScope) {
        $rootScope.stateProvider = test.stateProvider;
    });

    test.controller('testCtrl',[
        '$scope',
        '$rootScope',
        'getCookieService',
        "ajaxService",
        '$state',
        function($scope, $rootScope, getCookieService,ajaxService,$state){
            $scope.clearLock = function(password){//系统解锁事件
            	var sessionId = getCookieService.getCookie("CRMSESSIONID");
            	 ajaxService.AjaxPost({"password":password,"sessionId": sessionId}, "postrade/memberhome/verifyUserPassword.do").then(
                         function (result) {
                             //如果验证通过
                             if (result.status) {
                            	 //清空锁
                            	 getCookieService.setCookie('CRM7LOCK', false);
                             }
                         }
                     );
            };
            //退出
            $scope.logoutSystem = function () {
            	var sessionId = getCookieService.getCookie("CRMSESSIONID");
                ajaxService.AjaxPost({"sessionId": sessionId}, "login/logout.do").then(function (message) {
                    if (message.status === 1) {
                    	getCookieService.cleanCookie("CRMSESSIONID");
	                      //清空锁
	                   	getCookieService.setCookie('CRM7LOCK', false);
	                   	$state.go('login');
                    }
                });
            };
            $scope.hotEnterKey = function(pwd,event){
                var keyCode = window.event?event.keyCode:event.which;
                if(keyCode===13){
                    $scope.clearLock(pwd);
                }
                event.stopPropagation();
            };
            
        }
    ]);

    //前台软pos路由设置
    test.config( ["$stateProvider","$urlRouterProvider",function( $stateProvider,$urlRouterProvider){
        test.stateProvider =$stateProvider;

        $urlRouterProvider.otherwise("home");

        console.log(appBaseUrl);
        $stateProvider
            .state("login",ngAMD.route({//登录页
                url: "/login",
                templateUrl: appBaseUrl + "/login/login.html",
                controllerUrl: appBaseUrl + "/login/login.js"
            }))
            .state("register",ngAMD.route({//注册页
                url: "/register",
                templateUrl: appBaseUrl+"/register/register.html",
                controllerUrl: appBaseUrl+"/register/register.js"
            }))
            .state("home",ngAMD.route({//后台
                url: "/home",
                templateUrl: appBaseUrl +"/home/home.html",
                controllerUrl: appBaseUrl +"/home/home.js"
            }))
            .state("report",ngAMD.route({//报表
                url: "/report",
                templateUrl: appBaseUrl +"/home/home.html",
                controllerUrl: appBaseUrl +"/home/home.js"
            }))
            .state("pos", ngAMD.route({//pos页
                url: "/pos",
                templateUrl: appBaseUrl + "/pos/pos.html",
                controllerUrl: appBaseUrl + "/pos/posCtrl.js"//只在pos系统中加载posTopbar,其它系统无需加载
            }))
            .state("pos.default", ngAMD.route({//pos页
                url: "/default",
                templateUrl: appBaseUrl + "/pos/default.html",
                controllerUrl: appBaseUrl + "/pos/posCtrl.js"
            }))

            .state("pos.selectedpos", ngAMD.route({//pos选择终端页
                url: "/selectedpos",
                templateUrl: appBaseUrl + "/pos/selectedpos/selectedpos.html",
                controllerUrl: appBaseUrl + "/pos/selectedpos/selectedposCtrl.js"
            }))
            .state("pos.cardoperte",ngAMD.route({//卡操作公共页（左侧共享信息页）
                url:"/cardoperte",
                templateUrl:appBaseUrl +"/pos/cardoperate/cardoperate.html",
                controllerUrl:appBaseUrl +"/pos/cardoperate/cardoperateCtrl.js"
            }))
            .state("pos.cardoperte.mainpage",ngAMD.route({//卡操作主页（右侧动态切换页）
                url:"/mainpage",
                templateUrl:appBaseUrl +"/pos/cardoperate/mainpage/mainpage.html",
                controllerUrl:appBaseUrl +"/pos/cardoperate/mainpage/mainpageCtrl.js"
            }))
            .state("pos.editusr",ngAMD.route({//编辑user页
                url:"/editusr",
                templateUrl:appBaseUrl +"/pos/editusr/editusr.html",
                controllerUrl:appBaseUrl +"/pos/editusr/editusrCtrl.js"
            }))
            .state("pos.postradedetail",ngAMD.route({//pos交易管理
                url:"/postrademanage/detail",
                templateUrl:appBaseUrl +"/pos/postrademanage/tradeDetail.html",
                controllerUrl:appBaseUrl +"/pos/postrademanage/tradeDetail.js"
            }))
            .state("company",ngAMD.route({//集团页
                url:"/company",
                templateUrl:appBaseUrl +"/basedata/companymanager/companyInfo.html",
                controllerUrl:appBaseUrl +"/basedata/companymanager/companyInfoCtroller.js"
            }));
    }] );


    var ngAMDCtrlRegister = ngAMD.bootstrap(test);
});