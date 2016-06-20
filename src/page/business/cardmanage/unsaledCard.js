/**
 * 未售卡列表    
 * @version  v1.0      
 * @createTime: 2016-04-27         
 * @createAuthor zuoxh             
 * @updateHistory  
 *                
 * @note
 */
define(function (require) {
//加载模块
    var app = require("app");
    var angular = require("angular");
    //未售卡列表
    app.ngAMDCtrlRegister.controller("unsaledCardCtrl", [
        "$scope",
        "appConstant",
        "ajaxService",
        "register",
        "modalService",
        "$rootScope",//加载模块，顺序与function中的参数一致
        function ($scope, appConstant, ajaxService, register,modalService,$rootScope) {
        	
	        	//获取父页面操作记录的数据
	            var tabData = $rootScope.TabsData;
	            //为避免修改父页面数据，复制数据
	            var data = angular.copy(tabData);
	            //将副本数据赋值给当前scope中的对象
	            $scope.bmOpenCard = data;
	            
	            //获取sessionId
	            var sessionId = $rootScope.sessionId;
	            
                $scope.conditions = {
                    ajaxUrl: 'basecard/bmBasecard/unsaledListForOnceOpen.do',
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage
                    	,productionCardId:$scope.bmOpenCard.id},
                    filter:[],
	                // 下拉搜索框
	                select: {requestFiled:'searchType', 
	                	options: [{"name": "卡号", "state": true, "value": 1}//按照卡号搜索
	                ]},
	                search: {requestFiled: 'cardNumber', request: {"sessionId": sessionId}}//表头里的搜索框，不需要可不配置此项
                };
                
                // 分页设置
                $scope.pageSet = {
                    title:"未售卡",
                    currentPage: appConstant.pageSet.currentPage,
                    maxSize: appConstant.pageSet.maxSize,
                    numPerPage: appConstant.pageSet.numPerPage,
                    
                    // 页面展现字段配置
                    table: [{field: 'id', desc: '编号',width:'35%'},
                            {field: 'number', desc: '卡号',column:'number',width:'auto'}
                    ],
                    task: []
                };
	    }
	]);
});