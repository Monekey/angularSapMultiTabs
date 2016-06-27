/**
 * 基础已售卡以及开卡记录列表页面
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
define(function (require) {
	//加载CSS样式
    var app = require("css!score_rule_css");
    var card_manage_css = require("css!card_manage_css");
    var ngAMD = require('ngAMD');
    //引入批量售卡模态框页面及js
    var batchSellCardCtrl = require( "business/cardmanage/batchSellCard" );
    var batchSellCardTemp = require( "text!business/cardmanage/batchSellCard.html" );

        ngAMD.controller("cardCtrl", [
            '$scope',
            "register",
            'getCookieService',
            'appConstant',
            '$rootScope',
            '$uibModal',
            "modalService",
            "ajaxService",//加载模块，顺序与function中的顺序一致
            function ($scope, register, getCookieService, appConstant, $rootScope,$uibModal,modalService,ajaxService) {
            	//获取sessionId
                var sessionId = $rootScope.sessionId;
                //获取按钮权限
            	$scope.openCardBtn = register.getRoot('开卡');
            	$scope.cancelOpenCardBtn = register.getRoot('取消开卡');
            	$scope.batchSellBtn = register.getRoot('批量售卡');
            	$scope.detailBtn = register.getRoot('详情');


                
                //1、定义基础已售卡列表的过滤条件
                $scope.conditions = {
                    ajaxUrl: 'cardmanage/baseCardUsed/list.do',//请求连接
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
                    filter: [
                        {//搜索条件中的卡类型定义，实时获取
                            type: 'normal',
                            field: '卡类型：',
                            requestFiled: 'cardTypeId',
                            value: [],
                            ajaxUrl: 'memberequity/cardtype/getCardTypeForSearch.do',
                            request: {"sessionId": sessionId}
                        },
                        {//搜索条件中定义卡状态
                            type: 'normal',
                            field: '卡状态：',
                            requestFiled: 'cardStatus',
                            value: [{"name": "全部", "state": true, "value": null}, 
                                    /*{"name": "已开卡","state": false,"value": 100}, */
                                    {"name": "已售卡", "state": false, "value":101}, 
                                    {"name": "已挂失", "state": false, "value":102},
                                    {"name": "已退卡", "state": false, "value":103},
                                    {"name": "已作废", "state": false, "value":104},
                                    {"name": "黑名单", "state": false, "value":105}
                                    ]
                        },
                        {//搜索条件中定义卡过期状态
                            type: 'normal',
                            field: '过期状态：',
                            requestFiled: 'isOutOfDate',
                            value: [{"name": "全部", "state": true, "value": null}, 
                                    {"name": "正常","state": false,"value": "0"}, 
                                    {"name": "过期", "state": false, "value":"1"}]
                        }
                    ],
                    select:{ //筛选头增加条件查询（卡号、手机号、门店名称），类型值用searchType承载
                        requestFiled:'searchType',
                        options:[
                            {"name": "卡号", "state": true, "value": 1},
                            {"name": "手机号", "state": false, "value": 2},
                            {"name": "门店名称", "state": false, "value": 3},
                            {"name": "会员标识", "state": false, "value": 4}
                        ]},
                    search:{  //搜索框展现，点击搜索按钮，获取其他所有的筛选条件，以及输入值用searchTypeValue承载
                        requestFiled: 'searchTypeValue',
                        request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
                    }
                };

                
                /*1.1基础已售卡的pageSet结果集*/
                $scope.pageSet = {
                    title:"卡列表",//列表标题
                    currentPage: appConstant.pageSet.currentPage,//当前页面
                    maxSize: appConstant.pageSet.maxSize, //最大页码
                    numPerPage: appConstant.pageSet.numPerPage //每页显示最大条数
                };
                
                /*1.2 改变页码操作*/
                $scope.pageChanged = function(){
                	//一个页面多tab情况下，获得第一个Tab中的请求内容
                    var postObj = $scope.$$childTail.$$childHead.requestObj.request;
                    postObj.pageNo = $scope.pageSet.currentPage; //设置当前页面
                    postObj.pageCount = $scope.pageSet.numPerPage; //设置每页显示数量
                  //调用ajax服务查询新数据，并将结果集赋值给当前Tab的resultList
                    ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                        $scope.$$childTail.$$childHead.resultList = result;
                    });
                };
                
                /* 1.3 基础已收卡的详情信息*/
                $scope.doCardDetail = function(baseCardUsed){
                	baseCardUsed.callback=function a(callback){
                        callback();
                    };
                    //新建Tab
                    register.addToTabs({
                        title:"卡账户详情", //TAB页面标题
                        id: "cardDetail" + baseCardUsed.id,//Tab唯一ID
                        template:"business/cardmanage/cardDetail.html",//关联Tab的html页面
                        ctrl: 'business/cardmanage/cardDetail',//关联html的js文件
                        ctrlName:"cardDetailCtrl",//关联html的js中定义的controller名称
                        ng_show:false,
                        type: 'single',//function数据库功能（卡管理）ID保持一致
                        from: 10014
                    }, baseCardUsed);//baseCardUsed传递参数，将对象传递到Tab页面
                };
                
                /* 2、定义开卡记录列表的过滤条件 */
                $scope.conditions1 = {
                        ajaxUrl: 'opencardmanage/bmOpenCard/getOpenCardList.do',
                        request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage}//,
                };
                /* 2.1 开卡记录列表的pageSet结果集*/
                $scope.pageSet1 = {
                        currentPage: appConstant.pageSet.currentPage,//当前页面
                        maxSize: appConstant.pageSet.maxSize, //最大页码
                        numPerPage: appConstant.pageSet.numPerPage //每页显示最大条数
               };
                /* 2.2开新卡操作 */
                $scope.changPage={};//为了刷新页面
                $scope.doOpenNewCard = function(){
                	$scope.changPage.callback=function a(callback){
                		$scope.pageChanged1();
                    };
                	//新建Tab
                    register.addToTabs({
                        title:"开卡", //TAB标识
                        id: "openNewCard", // //Tab唯一ID
                        template:"business/cardmanage/openNewCard.html",//关联Tab的html页面
                        ctrl: 'business/cardmanage/openNewCard',//关联html的js文件
                        ctrlName:"openNewCardCtrl",//关联html的js中定义的controller名称
                        ng_show:false,
                        type: 'single',
                        from: 10014 //function数据库功能（卡管理）ID保持一致
                    }, $scope.changPage);
                }
               
                /*2.2 改变页码操作*/
                $scope.pageChanged1 = function(){
                	//一个页面多tab情况下，获得第一个Tab中的请求内容
                	var postObj = $scope.$$childTail.$$childHead.openCardResultListRequest.request;
                    
                    postObj.pageNo = $scope.pageSet1.currentPage; //设置当前页面
                    postObj.pageCount = $scope.pageSet1.numPerPage; //设置每页显示数量
                  //调用ajax服务查询新数据，并将结果集赋值给当前Tab的resultList
                    ajaxService.AjaxPost(postObj, $scope.conditions1.ajaxUrl).then(function (result) {
                        $scope.$$childTail.$$childHead.openCardResultList = result;
                    });
                };
                /*2.3 取消开卡操作*/
                $scope.doCancelOpenCard = function(bmOpenCard){
                    modalService.info({title:'提示', content:'是否取消此卡？', size:'sm', type: 'todo'}).then(function(){
                        ajaxService.AjaxPost({openCardBean:bmOpenCard,"sessionId": sessionId},'opencardmanage/bmOpenCard/removeOpenCard.do').then(function (result) {
                            var status =result.status;
                            if(status){
                                $scope.pageChanged1();
                                //modalService.info({content:'操作成功', type: 'ok'});
                            }
                        });
                    });
                }
                /*2.4 未售出卡查询操作*/
                $scope.doUnsaledCard=function (bmOpenCard){
                	$scope.changPage.callback=function a(callback){
                		//$scope.pageChanged1();
                    };
                	//新建Tab
                    register.addToTabs({
                        title:"未售卡", //TAB标识
                        id: "unSaledCards", // //Tab唯一ID
                        template:"business/cardmanage/unsaledCard.html",//关联Tab的html页面
                        ctrl: 'business/cardmanage/unsaledCard',//关联html的js文件
                        ctrlName:"unsaledCardCtrl",//关联html的js中定义的controller名称
                        ng_show:false,
                        type: 'multiple',
                        from: 10014 //function数据库功能（卡管理）ID保持一致
                    }, bmOpenCard);
                }
                
                /*2.5 批量售卡操作*/
                $scope.doBatchSellCard =function (bmOpenCard){
                	showBatchSellCardModal(bmOpenCard);
                }
                /**
                 * 唤起批量销售的模态窗口
                 */
               var showBatchSellCardModal = function(bmOpenCard) {
                    var modalInstance = $uibModal.open({
                        //受否加载动画
                        animation: true,
                        //模态框页面
                        template: batchSellCardTemp,
                        //模态框的尺寸
                        size: "md",
                        //模态框对应的controller
                        controller: 'batchSellCardCtrl',
                        //向模态框传递参数
                        resolve: {
                            bmOpenCardModel: function () {
                                return bmOpenCard;
                            }
                        }

                    });
                    //处理模态框返回到当前页面的数据
                    modalInstance.result.then(function (result) {
                         if(result.status){
                             $scope.pageChanged();//刷新卡列表
                             $scope.pageChanged1();//刷新开卡列表
                         }
                    });
                };
            }
        ]);
    return 'cardCtrl';
});





