/**
 * 积分结算首页
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory
 * 
 * @note 列表页:integrationIndex     
 */
define(function(require) {
	//引用样式
	var app = require("css!score_rule_css");
	//模块依赖
		var ngAMD = require('ngAMD');
	ngAMD.controller("integrationCtrl", [
			     '$scope', //必须引用
		          'appConstant', 
		          "$rootScope", 
		          "register",
		          "ajaxService",
		function($scope, 
				appConstant, 
				$rootScope, 
				register,
				ajaxService) {
			//取sessionid
			var sessionId = $rootScope.sessionId;
			
			$scope.conditions = {
				ajaxUrl: 'reportcenter/integration/list.do',//请求URL
				request: {
					"sessionId": sessionId,
					"pageNo": "1",
					"pageCount": appConstant.pageSet.numPerPage
				},//筛选条件
				isCollapsed: false,
				filter: [{//按钮型 后台获取条件
					type: 'normal',
					field: '卡型：',
					requestFiled: 'cardTypes',
					value: [],
					ajaxUrl: 'memberequity/cardtype/list.do',
					request: {
						"sessionId": sessionId
					}
				}],
				datePicker: { //表头里的时间配置，不需要可不配置此项
					requestFiled: ['date', 'beginDate', 'endDate'],
					//分别对应普通按钮时间，开始时间和结束时间
					value: [
					{
						"name": "今天",
						"state": true,
						"value": 0
					},
					{
						"name": "昨天",
						"state": false,
						"value": 1
					},
					{
						"name": "近7天",
						"state": false,
						"value": 7
					},
					{
						"name": "近15天",
						"state": false,
						"value": 15
					},
					{
						"name": "近30天",
						"state": false,
						"value": 30
					}]
				},
				more: true
			};

			$scope.openDetailed = function(shop) {

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
				//打开新建积分规则的tab
				register.addToTabs({
					title: "门店结算",
					id: "detailed1" + shop.id,
					template: "reportcenter/integration/detailed.html",
					ctrl: 'reportcenter/integration/detailed',
					//删除require路径，改为动态配置
					ctrlName: "detailed1",
					//对应编辑页controller的名字
					ng_show: false,
					type: 'single',
					from: 1001
				},
				shops);
			};

			$scope.openIntegration = function(shop, flag) {

				var shops = {};
				var postObj = $scope.requestObj.request;
				for (var x in postObj) {
					shops[x] = postObj[x];
				}
				for (var x in shop) {
					shops[x] = shop[x];
				}
				shops.isOtherShop = flag;
				
				try {
					shops.date = $scope.requestObj.request.date;
				} catch(e) {
					shops.date = 0;
				}
				shops.shopId = shop.id;
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
				shops.isOtherShop = flag;
				try {
					shops.date = $scope.requestObj.request.date;
				} catch(e) {
					shops.date = 0;
				}
				shops.shopId = shop.id;
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

	return 'integrationCtrl';
});