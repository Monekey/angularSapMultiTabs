requirejs.config({

    baseUrl: 'src/page',
    paths: {
        app: "../app",
        //配置lib目录下的第三方公共包
        angular: "../lib/angular",
        jquery: "../lib/jquery.min",
        text: "../lib/text.min",
        css: "../lib/css",
        echart: '../lib/echarts-all',
        
        ui_bootstrap: "../lib/bootstrap/ui-bootstrap-tpls-1.2.1.min",
        ui_bootstrap_css: "../lib/bootstrap/bootstrap.min",
        ng_upload:"../lib/ng-file-upload.min",
        router: "../lib/angular-ui-router.min",
        //ng_upload_shim:"../lib/ng-file-upload-shim",
        ng_overlay: "../lib/angular-loading-overlay.min",
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
        jedate:'../lib/jedate/jedate.min'
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
   // urlArgs: "version=" + (new Date()).getTime(),
    waitSeconds: 0,
    deps: ["app"]

});