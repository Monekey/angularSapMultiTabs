/**
 * 终端列表页    
 * @version  v1.0      
 * @createTime: 2016-04-19         
 * @createAuthor lxp             
 * @updateHistory  
 *                
 * @note   文件命名规则 ：terminal  
 */
define(function (require) {
	
	// 引用样式
    var app = require("css!score_rule_css");
    var shopCss = require("css!../../../assets/css/shops");
    var ngAMD = require("ngAMD");
    ngAMD.controller("terminalCtrl", [//模块依赖
            '$scope',
            //可选引用  顺序要和function中顺序一致
            'appConstant',
            "register",
            "$rootScope",
            function ($scope, appConstant,register, $rootScope) {
                var sessionId = $rootScope.sessionId;
                $scope.conditions = {
                    ajaxUrl: 'baseData/terminalManager/list.do',
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
                    filter:[],
                // 下拉搜索框
                select: {requestFiled:'searchType', 
                	options: [{"name": "门店名称", "state": true, "value": 1},//按照门店名称搜索
                              {"name": "门店号", "state": false, "value": 3}, //按照终端id搜索
                              {"name": "终端号", "state": false, "value": 2} //按照门店id搜索
                          ]},
                search: {requestFiled: 'searchTypeValue', request: {"sessionId": sessionId}}//表头里的搜索框，不需要可不配置此项
                };
                
                // 分页设置
                $scope.pageSet = {
                    title:"终端列表",
                    currentPage: appConstant.pageSet.currentPage,
                    maxSize: appConstant.pageSet.maxSize,
                    numPerPage: appConstant.pageSet.numPerPage,
                    
                    // 页面展现字段配置
                    table: [
                            {field : 'index',desc : '编号'},
                            {field: 'id', desc: '终端号码'}, 
                            {field: 'name', desc: '终端名称', column:'name'},
                            {field: ['openTime'],desc: '开通时间',filter: 'formatDateToDay',column:'open_time'},
                            {
                            	desc: '状态',
                                field: 'ifEnable',
                                filter: 'tranTerminalStatus', //页面字段转换显示
                                column:'if_enable',
                                isRender:true
                            },
                        {field: 'shopId', desc: '门店编号',column:'shop_id'}, {field: 'shopName', desc: '门店名称', column:'shopName'}
                    ],
                    task: []
                };

                //跳转到门店修改页面
                $scope.openNew = function(shop){
                    shop.callback=function a(callback){
                        callback();
                    };
                    //打开新建积分规则的tab
                    register.addToTabs({
                        title:"修改门店信息",
                        id: "shop" + shop.id,
                        template:"basedata/shopmanager/shopEdit.html",
                        ctrl: 'basedata/shopmanager/shopEdit',//删除require路径，改为动态配置
                        ctrlName:"shopUpdateCtrl",//对应编辑页controller的名字
                        ng_show:false,
                        type: 'single',
                        from: 10010
                    }, shop);
                };
            }
        ]);


    return 'terminalCtrl';
});

