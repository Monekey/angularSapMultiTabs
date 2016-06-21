/**
 * 储值二级穿透信息展示页
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory   
 * 
 * @note 列表页:saveMoneyDesc  
 */
var index=0;
define(function(require) {
	//引用样式
	var app = require("app");
	var angular = require("angular");
	var upload = require("uploadService");
	var echart = require("echart");
	//模块依赖
	app.ngAMDCtrlRegister.controller("saveMoneyDesc",
			["$scope", //必须引用
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
		index=index+1;
		$scope.index=index;
		//取sessionid
		var sessionId = $rootScope.sessionId;		
        //初始化查询参数
		var tabData = $rootScope.TabsData;
		var data = angular.copy(tabData);
		$scope.shop = data;
		$scope.from = data.from;
		var param = {};
		for (var x in data) {
			param[x] = data[x];
		}
		param["sessionId"]=sessionId;
		param["name"] = "getSaveMonryQuery";//后台方法名称
		param["pageNo"] = "1";//第几页开始
		param["pageCount"] = appConstant.pageSet.numPerPage;//分页设置
		param["otherShop"] = data.isOtherShop;//查询条件

		$scope.setPie =function(documentId, result) {
		    try{
			var param = new Array();
			for (var i = 1; i < result.data.length; i++) {
				param[i - 1] = result.data[i];
			}

			var myChart1 = echarts.init(document.getElementById(documentId));
			myChart1.clear();
			option1 = {
				title: {
					text: '付款方式分布',
					x: 'center'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				calculable: true,
				series: [{
					name: '支付方式',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: param,
					itemStyle: {
						emphasis: {
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}]
			};
			myChart1.setOption(option1);
			myChart1.setTheme('macarons');
		    }catch(e){
		    	
		    }
		};
		
		ajaxService.AjaxPost(param, "reportcenter/compDetailed/load.do").then(function(result) {
			$scope.data = result.data;
			$scope.setPie('bttype'+index, result);
			$scope.bishu = result.data[0].bishu;
			$scope.benjin = result.data[0].value;
			$scope.zengsongjine = result.data[0].zengsongjine;
		});
		
		//筛选条件
		$scope.conditions = {
			ajaxUrl: 'reportcenter/compDetailed/list.do',//请求URL
			request: param,
			filter: [
                 //按钮型 后台获取条件
			    {
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
			title:'储值明细表',
			currentPage: appConstant.pageSet.currentPage,
			//显示当前
			maxSize: appConstant.pageSet.maxSize,
			//可显示最大页码
			numPerPage: appConstant.pageSet.numPerPage,
			//每页条数 
			table: [ //表格字段
			{field: 'index', desc: '编号'
	        },{
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
				field: 'value',
				desc: '储值本金(元)'
			},
			{
				field: 'zongsongjine',
				desc: '储值赠送金额(元)'
			},
			{
				field: 'opname',
				desc: '操作类型',
				column: 'opname'
			},
			{
				field: 'ts_type_name',
				desc: '付款方式'
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
				field: 'balance',
				desc: '本次剩余金额(元)'
			}]
		};

	}]);
});