/**
 * 门店积分结算
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory
 * 
 * @note 列表页:shopDetailed 
 */
define(function(require) {
	//引用样式
	var app = require("app");
	var angular = require("angular");
	var upload = require("uploadService");
	var echart = require("echart");
	//模块依赖
	app.ngAMDCtrlRegister.controller("detailed1", [
	      "$scope", //必须引用
	      "appConstant", 
	      "ajaxService", 
	      "register", 
	      "uploadService", 
	      "$rootScope",
	function($scope, 
			appConstant, 
			ajaxService, 
			register, 
			uploadService, 
			$rootScope) {
	    //初始化查询参数
		var tabData = $rootScope.TabsData;
		var data = angular.copy(tabData);
		$scope.shop = data;
		$scope.from = data.from;
		var param = {};
		for (var x in data) {
			param[x] = data[x];
		}
		param["pageNo"] = "1";
		param["pageCount"] = appConstant.pageSet.numPerPage;
		param["otherShop"] = data.isOtherShop;
		param["shopId"] = data.id;
		//取sessionid
		var sessionId = $rootScope.sessionId;
		
		$scope.conditions = {
			ajaxUrl: 'reportcenter/integration/detailedList.do',//请求URL
			request: param,//筛选条件
			filter: [{//按钮型 后台获取条件
				type: 'normal',
				field: '终端',
				requestFiled: 'terminalId',
				value: [],
				ajaxUrl: 'reportcenter/terminal/list.do',
				request: {
					"sessionId": sessionId
				}
			}]
		};
		//表格配置项
		$scope.openIntegration = function(shop, flag) {

			var shops = {};
			var postObj = $scope.requestObj.request;
			for (var x in postObj) {
				shops[x] = postObj[x];
			}
			for (var x in shop) {
				shops[x] = shop[x];
			}
			
			try {
				shops.date = $scope.requestObj.request.date;
			} catch(e) {
				shops.date = 0;
			}		
			shops.shopId=0;
			
			if(flag==1){
				shops.openShopId=shop.shopId;
				shops.xfShopId=shop.id;
			}
			else if(flag==2){				
				shops.openShopId=shop.id;
				shops.xfShopId=shop.shopId;
			}

			//打开新建积分规则的tab
			register.addToTabs({
				title: "积分明细",
				id: "integrationDesc" + shop.id,
				template: "reportcenter/integration/integrationDesc.html",
				ctrl: 'reportcenter/integration/integrationDesc',
				//删除require路径，改为动态配置
				ctrlName: "integrationDesc",
				//对应编辑页controller的名字
				ng_show: false,
				type: 'single',
				from: 1002
			},
			shops);
		};
		//引用分页控件
		$scope.pageSet = {
			title: "列表",
			currentPage: appConstant.pageSet.currentPage,//显示当前
			maxSize: appConstant.pageSet.maxSize,//可显示最大页码
			numPerPage: appConstant.pageSet.numPerPage//每页条数
		};

		$scope.pageChanged = function() {
			//var postObj = {"sessionId": sessionId};
			var postObj = $scope.requestObj.request;
			postObj.pageNo = $scope.pageSet.currentPage;
			postObj.pageCount = $scope.pageSet.numPerPage;
			ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function(result) {
				$scope.resultList = result;
			});
		};

		$scope.openExchange = function(shop, flag) {
			var shops = {};
			var postObj = $scope.requestObj.request;
			for (var x in postObj) {
				shops[x] = postObj[x];
			}
			for (var x in shop) {
				shops[x] = shop[x];
			}
			
			try {
				shops.date = $scope.requestObj.request.date;
			} catch(e) {
				shops.date = 0;
			}
			
			shops.shopId=0;
			if(flag==1){
				shops.openShopId=shop.shopId;
				shops.xfShopId=shop.id;
			}
			else if(flag==2){				
				shops.openShopId=shop.id;
				shops.xfShopId=shop.shopId;
			}
			//打开新建积分规则的tab
			register.addToTabs({
				title: "兑换明细",
				id: "integrationExchange" + shop.id,
				template: "reportcenter/integration/integrationExchange.html",
				ctrl: 'reportcenter/integration/integrationExchange',
				//删除require路径，改为动态配置
				ctrlName: "integrationExchange",
				//对应编辑页controller的名字
				ng_show: false,
				type: 'single',
				from: 1003
			},
			shops);
		};

	}]);
});