/**
 * 储值结算首页
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory 
 * 
 * @note 列表页:savemoney  
 */
define(function(require) {
	//引用样式
	var app = require("css!score_rule_css");
	//模块依赖
	var ngAMD = require('ngAMD');
	ngAMD.controller("saveMoneyCtrl", [
		         '$scope',//必须引用
		          '$rootScope', 
		          "register", 
		          'appConstant',
		          "ajaxService",
		function($scope, 
				$rootScope, 
				register, 
				appConstant,
				ajaxService) {
			//取sessionid
			var sessionId = $rootScope.sessionId;
			$scope.conditions = {
				ajaxUrl: 'reportcenter/savemoney/list.do',//请求URL
				request: {//筛选条件
					"sessionId": sessionId,
					"pageNo": "1",
					"pageCount": appConstant.pageSet.numPerPage
				},
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
				},
				{//按钮型 后台获取条件
					type: 'normal',
					field: '付款方式：',
					requestFiled: 'tsTypeId',
					value: [],
					ajaxUrl: 'reportcenter/bttype/list.do',
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
				
				//var postObj = $scope.requestObj.request;
				shops.isOtherShop = flag;
				/*for (var x in postObj) {
					shop[x] = postObj[x];
				}
				postObj.isOtherShop = flag;
				try {
					shop.date = $scope.requestObj.request.date;
				} catch(e) {
					shop.date = 0;
				}*/
				shops.shopId = shop.id;
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
				
				//var postObj = $scope.requestObj.request;
/*				for (var x in postObj) {
					shop[x] = postObj[x];
				}*/
				shops.isOtherShop = flag;
				/*try {
					shop.date = $scope.requestObj.request.date;
				} catch(e) {
					shop.date = 0;
				}*/
				shops.shopId = shop.id;
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
					id: "detailed" + shop.id,
					template: "reportcenter/savemoney/detailed.html",
					ctrl: 'reportcenter/savemoney/detailed',
					//删除require路径，改为动态配置
					ctrlName: "detailed",
					//对应编辑页controller的名字
					ng_show: false,
					type: 'single',
					from: 1001
				},
				shops);
			};
		}]);

	return 'saveMoneyCtrl';
});