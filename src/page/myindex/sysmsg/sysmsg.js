/**
 * 系统消息详情页
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory   
 * 
 * @note 列表页:myindexfour
 */
define(function(require) {
	//引用样式
	var app = require("app");
	var angular = require("angular");
	var upload = require("uploadService");
	//模块依赖
	app.ngAMDCtrlRegister.controller("add2ctrl", ["$scope", //必须引用
	"appConstant", "ajaxService", "register", "uploadService", "$rootScope",
	function($scope, appConstant, ajaxService, register, uploadService, $rootScope) {

		var tabData = $rootScope.TabsData;
		var data = angular.copy(tabData);
		$scope.shop = data;
		$scope.from = data.from;

		var sessionId = $rootScope.sessionId;

		ajaxService.AjaxPost({
			sessionId: sessionId
		},
		"index/sysMsg/list.do").then(function(result) {
			$scope.resultList = {};
			$scope.resultList = result;
		});

		//引用分页控件
		$scope.pageSet = {
			title: "列表",
			currentPage: appConstant.pageSet.currentPage,
			//显示当前
			maxSize: appConstant.pageSet.maxSize,
			//可显示最大页码
			numPerPage: appConstant.pageSet.numPerPage //每页条数
		};

		$scope.pageChanged = function() {
			//var postObj = {"sessionId": sessionId};
			var postObj = {};
			postObj.pageNo = $scope.pageSet.currentPage;
			postObj.pageCount = $scope.pageSet.numPerPage;
			postObj.sessionId=sessionId;
			ajaxService.AjaxPost(postObj, "index/sysMsg/list.do").then(function(result) {
				$scope.resultList = {};
				$scope.resultList = result;
			});
		};

	}]);

});