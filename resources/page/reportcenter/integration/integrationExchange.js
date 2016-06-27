/**
 * 积分兑换穿透二级
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory 
 * 
 * @note 列表页:integrationExchange   
 */
define(function(require) {
	//引用样式
	var ngAMD = require("ngAMD");
	var angular = require("angular");
	var upload = require("uploadService");
	//模块依赖
	ngAMD.controller("integrationExchange", [
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
		param["name"] = "getIntegExchangeQuery";
		param["pageNo"] = "1";
		param["pageCount"] = appConstant.pageSet.numPerPage;
		param["otherShop"] = data.isOtherShop;
		//取sessionid
		var sessionId = $rootScope.sessionId;
		$scope.conditions = {
			ajaxUrl: 'reportcenter/compDetailed/list.do',//请求URL
			request: param,//筛选条件
			filter: [{//按钮型 后台获取条件
				type: 'normal',
				field: '终端',
				requestFiled: 'terminalId',
				value: [],
				ajaxUrl: 'reportcenter/terminal/list.do',
				request: param
			}]
		};
		//表格配置项
		$scope.pageSet = {
			//引用分页控件
			title:'兑换积分明细',
			currentPage: appConstant.pageSet.currentPage,//显示当前
			maxSize: appConstant.pageSet.maxSize,//可显示最大页码
			numPerPage: appConstant.pageSet.numPerPage,//每页条数
			table: [{field: 'index', desc: '编号'
            },{//表格字段
				field: 'ts_code',
				desc: '流水号',
				column: 'ts_code'
			},
			{
				field: 'member_name',
				desc: '姓名'
			},
			{
				field: 'number',
				desc: '卡号'
			},
			{
				field: 'typename',
				desc: '卡类型',
				column: 'typename'
			},
			{
				field: 'opname',
				desc: '操作类型',
				column: 'opname'
			},
			{
				field: 'createTime',
				desc: '操作时间',
				column: 'createTime'
			},
			{
				field: 'terminal_code',
				desc: '终端号'
			},
			{
				field: 'operation_name',
				desc: '操作人',
				column: 'operation_name'
			},
			{
				field: 'open_shop_name',
				desc: '开卡门店'
			},
			{
				field: 'xf_shop_name',
				desc: '交易门店'
			},
			{
				field: 'value',
				desc: '兑换积分'
			},
			{
				field: 'balance',
				desc: '本次剩余积分'
			}]
		};
	}]);
});