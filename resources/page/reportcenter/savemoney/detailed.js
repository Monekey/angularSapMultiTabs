/**
 * 储值门店结算
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory  
 * 
 * @note 列表页:shopDetailed  
 */
define(function(require) {
	//引用样式
	var ngAMD = require("ngAMD");
	var angular = require("angular");
	var upload = require("uploadService");
	var echart = require("echart");
	//模块依赖
	ngAMD.controller("detailed", [
	      "$scope",//必须引用
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
			$rootScope){
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
			ajaxUrl: 'reportcenter/savemoney/detailedList.do',//请求URL
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

		$scope.openSaveMoney = function(shop, flag) {

			var shops = {};
			var postObj = $scope.requestObj.request;
			for (var x in postObj) {
				shops[x] = postObj[x];
			}
			for (var x in shop) {
				shops[x] = shop[x];
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
			
			try {
				shops.date = $scope.requestObj.request.date;
			} catch(e) {
				shops.date = 0;
			}
			//postObj.shopId = shop.id;
			//打开新建积分规则的tab
			register.addToTabs({
				title: "储值明细",
				id: "saveMoneyDesc" + shop.id,
				template: "reportcenter/savemoney/saveMoneyDesc.html",
				ctrl: 'reportcenter/savemoney/saveMoneyDesc',
				//删除require路径，改为动态配置
				ctrlName: "saveMoneyDesc",
				//对应编辑页controller的名字
				ng_show: false,
				type: 'single',
				from: 1001
			},
			shops);
		};

		$scope.openConsume = function(shop, flag) {
			
			var shops = {};
			var postObj = $scope.requestObj.request;
			for (var x in postObj) {
				shops[x] = postObj[x];
			}
			for (var x in shop) {
				shops[x] = shop[x];
			}
			
			shops.shopId=0;
			if(flag==1){
				shops.openShopId=shop.id;
				shops.xfShopId=shop.shopId;
			}
			else if(flag==2){
				shops.openShopId=shop.shopId;
				shops.xfShopId=shop.id;
			}
			
			try {
				shops.date = $scope.requestObj.request.date;
			} catch(e) {
				shops.date = 0;
			}
			/*try {
				shop.date = $scope.requestObj.request.date;
			} catch(e) {
				shop.date = 0;
			}
			shop.shopId = shop.id;*/
			//打开新建积分规则的tab
			register.addToTabs({
				title: "消费明细",
				id: "memberConsume" + shop.id,
				template: "reportcenter/savemoney/memberConsume.html",
				ctrl: 'reportcenter/savemoney/memberConsume',
				//删除require路径，改为动态配置
				ctrlName: "memberConsume",
				//对应编辑页controller的名字
				ng_show: false,
				type: 'single',
				from: 1001
			},
			shops);
		};

	}]);
});