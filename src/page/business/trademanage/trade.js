/**
 * 交易管理列表页     
 * @version  		v1.0      
 * @createTime: 	2016-04-20        
 * @createAuthor 	Hyz             
 * @updateHistory  
 *                	2016-04-20  Hyz  创建交易管理列表页
 * @note   
 * 					  
 */
define(function (require) {
	//引用样式
    var app = require("css!score_rule_css");
    var trade_css = require("css!trade_css");
    //注册controller
    var rtObj = {
    		//controller 名称
            ctrl: "tradeCtrl", 
            //参数
            arrFunc: [
            '$scope',
            "register",
            'getCookieService',
            'appConstant',
            '$rootScope',
            "ajaxService",
            function ($scope, register, getCookieService, appConstant, $rootScope ,ajaxService) {
                var sessionId = $rootScope.sessionId;
                var tradeTypeParam = {"sessionId": sessionId,"pageCount":100};           
                var allDate=true;
            	var toDay=false;
            	var tradeTime=null;
            	var tradeTypeId=null;
            	if (typeof($rootScope.searchRequest) != "undefined"
            			&&typeof($rootScope.searchRequest.select) != "undefined"){
            		tradeTypeId=1;
            		if($rootScope.searchRequest.select=='toDay'){
            			allDate=false;
            			toDay=true;
            			tradeTime=0;
            		} 
            		if($rootScope.searchRequest.select=='all'){
            			allDate=true;
            			toDay=false;
            		}
            		tradeTypeParam['elementSelect']=1;
                }
                
                //交易记录搜索panel
                $scope.conditions = {
                	//页面数据请求接口
                    ajaxUrl: 'trade/indexpage/list.do',
                    //接口传入参数
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage,"tradeTime":tradeTime,"tradeTypeId":tradeTypeId},
                    //交易记录搜索panel   搜索条件控件
                    filter: [
                        {
                        	//控件类型
                        	type: 'dateFlex',
                        	//搜索条件   名称
                            field: '交易时间：',
                            //值
                            value: [
                                {"name": "全部", "state": allDate, "value": ""}, 
                                {"name": "今天", "state": toDay, "value": 0},
                                {"name": "昨天","state": false,"value": 1},
                                {"name": "近7天", "state": false, "value": 7},
                                {"name": "近15天", "state": false, "value": 15},
                                {"name": "近30天", "state": false, "value": 30},
                                ],
                            //页面数据请求接口           传入参数
                            requestFiled: ['tradeTime', 'startTradeTime', 'endTradeTime']//分别对应普通按钮时间，开始时间和结束时间
                        },
//                        {
//                            type: 'normal',
//                            field: '交易状态',
//                            requestFiled: 'tradeStatus',
//                            value: [
//                                    {"name": "全部", "state": true, "value": "0"}, 
//                                    {"name": "正常","state": false,"value": "1"}, 
//                                    {"name": "已撤销", "state": false, "value": "2"}]
//                        },
                        {
                        	//控件类型
                            type: 'normal',
                            //参数名称
                            field: '交易类型：',
                            //页面数据请求接口           传入参数
                            requestFiled: 'tradeTypeId',
                            value: [],
                            //当前控件数据接口
                            ajaxUrl:'trade/tradeType/list.do',
                            //当前控件数据接口     传入参数
                            request: tradeTypeParam
                        }
                        ],
                        //搜索框    控件
    					select:{
    						//页面数据请求接口           传入参数
    						requestFiled:'searchType', 
    						options:[
    						         {"name": "卡号", "state": false, "value": 1},
        							 {"name": "手机号", "state": false, "value": 2},
        							 {"name": "流水号", "state": true, "value": 3},
    					]},
    					search:{
    						//页面数据请求接口           传入参数
    						requestFiled: 'searchTypeValue',
//    	                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
    		                }
                };
                //交易记录数据分页
                $scope.pageSet = {
                        title:"交易列表",
                        currentPage: appConstant.pageSet.currentPage,
                        maxSize: appConstant.pageSet.maxSize,
                        numPerPage: appConstant.pageSet.numPerPage
                 };
                //交易记录翻页
                $scope.pageChanged = function(){
                    var postObj = $scope.$$childTail.$$childHead.requestObj.request;
                    postObj.pageNo = $scope.pageSet.currentPage;
                    postObj.pageCount = $scope.pageSet.numPerPage;
                    ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                    	  $scope.$$childTail.$$childHead.resultList = result;
                    });
                };
                //打开一个新的tab   交易消费明细详情页
                $scope.opentradeInfoPan = function(trade){
                	trade.callback=function a(callback){
                        callback();
                    };
                    //增加行tab
                    register.addToTabs({
                    	//新tab名称
                        title:"交易详情",
                        //tab--id
                        id: "tradeinfo" + trade.txCode,
                        //tab模板
                        template:"business/trademanage/tradeDetail.html",
                        //tab--control
                        ctrl: 'business/trademanage/tradeDetail',
                        //tab--control名
                        ctrlName:"tradeDetailCtrl",
                        ng_show:false,
                        type: 'single',
                        from: 10015
                    }, trade);
                };
                //批量充值搜索panel      -----临时数据     不属于           
                $scope.conditions1 = {
                        ajaxUrl: 'trade/indexpage/list.do',
                        request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
                        filter: [
                            {
                            	type: 'dateFlex',
                                field: '交易时间',
                                value: [
                                    {"name": "全部", "state": true, "value": 0}, 
                                    {"name": "昨天","state": false,"value": -1}, 
                                    {"name": "今天", "state": false, "value": 1}, 
                                    {"name": "最近7天", "state": false, "value": 7},
                                    {"name": "最近15天", "state": false, "value": 15},
                                    {"name": "最近30天", "state": false, "value": 30},
                                    ],
                                requestFiled: ['tradeTime', 'startTradeTime', 'endTradeTime']//分别对应普通按钮时间，开始时间和结束时间
                            }
                            ]
                    };

                //批量充值数据分页
                $scope.pageSet1 = {
                    title:"批量充值",
                    currentPage: appConstant.pageSet.currentPage,
                    maxSize: appConstant.pageSet.maxSize,
                    numPerPage: appConstant.pageSet.numPerPage,
                    button:{
                        title: '软pos会员首页测试',
                        newtab: {
                            title:"会员首页",
                            id:"memberHomeCtrl",
                            template:"postrade/memberhome/memberHome.html",
                            ctrlName:"memberHomeCtrl",
                            ctrl: 'postrade/memberhome/memberHome',
                            from: 10005,
                            type: 'multiple',
                            ng_show:false
                        }
                    },
                    table: [{field: 'createTime', desc: '交易时间'},
                        {field: 'txCode', desc: '流水号'},
                        {field: 'terminalCode', desc: '终端号'},
                        {field: 'operationName', desc: '操作员名称'},
                        {field: 'cardNo', desc: '卡号'},
                        {field: 'cardType', desc: '卡类型'},
                        {field: 'tradeType', desc: '交易类型'},
                        {field: 'openShopName', desc: '开卡门店'},
                        {field: 'xfShopName', desc: '交易门店'},
                        {field: 'userName', desc: '用户名'},
                        {field: 'userPhone', desc: '电话'}
                    ],
                };

            }
        ]
    };
    return rtObj;
});





