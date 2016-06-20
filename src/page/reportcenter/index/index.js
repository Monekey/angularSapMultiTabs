/**
 * 报表中心首页
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory
 * 
 * @note 列表页:reportIndex    
 */
var jquery1;
function setEchars( data, url) {
	
	jquery1.AjaxPost(data, url).then(function(result) {
		//chart.clear();
		setInit(result);
	});
}
function setInit(result){
	myChart4 = echarts.init(document.getElementById('main4'));
	
	var option={
		title: {
			text: '储值'
		},
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		toolbox: {
		        show : true,
		        x: '1100',
		        feature : {
		            saveAsImage : {show: true}
		        }
		},
		calculable: true,
		legend: {
			data: ['储值笔数', '储值金额']
		},
		xAxis: [{
			type: 'category',
			data: result.data.showDate,
			splitLine:{
				show: false
			}
		}],
		yAxis: [{
			type: 'value',
			name: '单位:元',
			axisLabel: {
				formatter: '{value}'
			}
		},
		{
			type: 'value',
			
			axisLabel: {
				formatter: '{value}'
			}
		}],
		series: [

		{
			name: '储值笔数',
			type: 'bar',
			smooth: true,
			barWidth : 40,
			data: result.data.saveMoneyCount
		},

		{
			name: '储值金额',
			type: 'line',
			yAxisIndex: 1,
			smooth: true,
			data: result.data.saveMoneySum
		}]
	};
	myChart4.setOption(option);
	myChart4.setTheme('macarons');
}
function setEcharArrays(data, url) {
	jquery1.AjaxPost(data, url).then(function(result) {
		//console.log(result);
		set_echars1(result, 'main1', [result.memberConsumeReportDay.data.showDate, result.memberConsumeReportDay.data.memberMoney, result.turnoverReportDay.data.turnoverMoney]);

		var arrays = new Array();
		for (var i = 0; i < result.memberConsumeReportDay.data.memberConsumeCount.length; i++) {
			if (parseInt(result.turnoverReportDay.data.turnoverCount[i]) == 0) {
				arrays[i] = 0;
			} else {
				//alert(parseInt(result.memberConsumeReportDay.data.memberConsumeCount[i])*100/parseInt(result.turnoverReportDay.data.turnoverCount[i]));
				arrays[i] = parseInt(result.memberConsumeReportDay.data.memberConsumeCount[i]) * 100 / parseInt(result.turnoverReportDay.data.turnoverCount[i]);
				arrays[i] = arrays[i].toFixed(2);
			}
		}
		//alert(arrays);
		set_echars2(result, 'main2', [result.memberConsumeReportDay.data.showDate, result.memberConsumeReportDay.data.memberConsumeCount, result.turnoverReportDay.data.turnoverCount, arrays]);
		set_echars3(result, 'main3', [result.turnoverReportDay.data.showDate, result.memberConsumeReportDay.data.memberAvg, result.turnoverReportDay.data.turnoverAvg]);
		setTimeout(function (){
			window.onresize = function () {
				myChart1.resize();
				myChart2.resize();
				myChart3.resize();
				myChart4.resize();
			}
		},200);
	});
	/* var errorFun = function(result) {
        //console.log(result);
    };
    jquery1.AjaxPost(data,url, successFun, errorFun);*/
}

function setEcharArraysMonth(data, url) {
	jquery1.AjaxPost(data, url).then(function(result) {
		//console.log(result);
		set_echars1(result, 'main1', [result.memberConsumeReportMonth.data.showDate, result.memberConsumeReportMonth.data.memberMoney, result.turnoverReportMonth.data.turnoverMoney]);

		var arrays = new Array();
		for (var i = 0; i < result.memberConsumeReportMonth.data.memberConsumeCount.length; i++) {
			if (parseInt(result.turnoverReportMonth.data.turnoverCount[i]) == 0) {
				arrays[i] = 0;
			} else {
				//alert(parseInt(result.memberConsumeReportDay.data.memberConsumeCount[i])*100/parseInt(result.turnoverReportDay.data.turnoverCount[i]));
				arrays[i] = parseInt(result.memberConsumeReportMonth.data.memberConsumeCount[i]) * 100 / parseInt(result.turnoverReportMonth.data.turnoverCount[i]);
				arrays[i] = arrays[i].toFixed(2);
			}
		}

		set_echars2(result, 'main2', [result.memberConsumeReportMonth.data.showDate, result.memberConsumeReportMonth.data.memberConsumeCount, result.turnoverReportMonth.data.turnoverCount, arrays]);
		set_echars3(result, 'main3', [result.turnoverReportMonth.data.showDate, result.memberConsumeReportMonth.data.memberAvg, result.turnoverReportMonth.data.turnoverAvg]);
		setTimeout(function (){
			window.onresize = function () {
				myChart1.resize();
				myChart2.resize();
				myChart3.resize();
				myChart4.resize();
			}
		},200);
	});
	/* var errorFun = function(result) {
        //console.log(result);
    };
    jquery1.AjaxPost(data,url, successFun, errorFun);*/
}
var myChart2;
function set_echars2(data, name, value) {
	myChart2 = echarts.init(document.getElementById(name));
	var option = {
		title: {
			text: '消费笔数'
		},
		tooltip: {
			trigger: 'axis'
		},
		   toolbox: {
		        show : true,
		        x: '1100',
		        feature : {
		            saveAsImage : {show: true}
		        }
		    },
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		calculable: true,
		legend: {
			data: ['会员笔数', '总笔数', '刷卡会员占比']
		},
		xAxis: [{
			type: 'category',
			data: value[0]
		    //boundaryGap: false,
		   
		},
		{
			type: 'category',
            axisLine: {show:false},
            axisTick: {show:false},
            axisLabel: {show:false},
            splitArea: {show:false},
            splitLine: {show:false},
			data: value[0]
		}],
		yAxis: [{
			type: 'value',
			name: '单位:笔',
			 splitLine: {
                 show: true,
					lineStyle:
					{
						color: ['#ddd'],
						width: 1,
						type: 'solid'
					}
             },
		},
		{
			type: 'value',
			 splitLine:{
					show: false
			},
			axisLabel: {
				formatter: '{value}%'
					
		}
		}],
		series: [

		{
			name: '会员笔数',
			type: 'bar',
			itemStyle: {
				normal: {
					label: {
						show: true,
						formatter: function(p) {
							return p.value > 0 ? (p.value) : '';
						}
					},
					/*color:'rgba(218, 208, 238,1)'*/
				}
			},
			xAxisIndex: 0,
			barWidth : 20,
			data: value[1]
		},
		{
			name: '总笔数',
			type: 'bar',
			itemStyle: {
				normal: {
					label: {
						show: true,
						formatter: function(p) {
							return p.value > 0 ? (p.value) : '';
						}
					},
					color:'rgba(218, 208, 238,1)'
				}
			},
			xAxisIndex: 1,
			barWidth : 40,
			data: value[2]

		},
		{
			name: '刷卡会员占比',
			type: 'line',
			yAxisIndex: 1,
			smooth: true,
			data: value[3]
		}]

	};

	myChart2.setOption(option);
	myChart2.setTheme('macarons');
}
var myChart1;
function set_echars1(data, name, value) {
	//var myChart = echarts.init(document.getElementById('main_chart'));
	myChart1 = echarts.init(document.getElementById(name));
	var option = {
		title: {
			text: '营业额'
		},
		tooltip: {
			trigger: 'axis'
		},
	    toolbox: {
		        show : true,
		        x: '1100',
		        feature : {
		            saveAsImage : {show: true}
		        }
		    },
		legend: {
			data: ['会员账单', '营业额']
		},
		calculable: true,
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: value[0],
			boundaryGap: false,
			splitLine:{
				show: false
			}
		}],
		yAxis: [{
			type: 'value',
			name: '单位:元',
			splitLine: {
                show: true,
				lineStyle:
				{
					width: 1,
					type: 'solid'
				}
            }
		}],
		series: [{
			name: '会员账单',
			type: 'line',

			smooth: true,
			itemStyle: {normal: {areaStyle: {type: 'default'}}},
			data: value[1]
		},
		{
			name: '营业额',
			type: 'line',

			smooth: true,
			itemStyle: {normal: {areaStyle: {type: 'default'}}},
			data: value[2]
		}]
	};
	myChart1.setOption(option);
	myChart1.setTheme('macarons');
}
var myChart3;
function set_echars3(data, name, value) {
	myChart3 = echarts.init(document.getElementById(name));
	var option = {
		title: {
			text: '客单价',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis'
		},
		   toolbox: {
		        show : true,
		        x: '1100',
		        feature : {
		            saveAsImage : {show: true}
		        }
		    },
		legend: {
			left: 'left',
			data: ['会员客单价', '客单价']
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: value[0],
		    splitLine:{
			show: false
		    }
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		yAxis: [{
			type: 'value',
			name: '单位:元',
			splitLine: {
                show: true,
				lineStyle:
				{
					width: 1,
					type: 'solid'
				}
            }
		}],
		series: [{
			name: '会员客单价',
			type: 'line',
			smooth: true,
			itemStyle: {normal: {areaStyle: {type: 'default'}}},
			data: value[1]
		},
		{
			smooth: true,
			name: '客单价',
			type: 'line',
			itemStyle: {normal: {areaStyle: {type: 'default'}}},
			data: value[2]
		},
		]
	};

	myChart3.setOption(option);
	myChart3.setTheme('macarons');
}

function setEcharArraysMonthSelect(data, url) {
	    jquery1.AjaxPost(data, url).then(function(result) {
		//console.log(result);
		set_echars1(result, 'main1', [result.select_memberConsumeReportDay.data.showDate, result.select_memberConsumeReportDay.data.memberMoney, result.select_turnoverReportDay.data.turnoverMoney]);

		var arrays = new Array();
		for (var i = 0; i < result.select_memberConsumeReportDay.data.memberConsumeCount.length; i++) {
			if (parseInt(result.select_turnoverReportDay.data.turnoverCount[i]) == 0) {
				arrays[i] = 0;
			} else {
				//alert(parseInt(result.memberConsumeReportDay.data.memberConsumeCount[i])*100/parseInt(result.turnoverReportDay.data.turnoverCount[i]));
				arrays[i] = parseInt(result.select_memberConsumeReportDay.data.memberConsumeCount[i]) * 100 / parseInt(result.select_turnoverReportDay.data.turnoverCount[i]);
				arrays[i] = arrays[i].toFixed(2);
			}
		}

		set_echars2(result, 'main2', [result.select_memberConsumeReportDay.data.showDate, result.select_memberConsumeReportDay.data.memberConsumeCount, result.select_turnoverReportDay.data.turnoverCount, arrays]);
		set_echars3(result, 'main3', [result.select_turnoverReportDay.data.showDate, result.select_memberConsumeReportDay.data.memberAvg, result.select_turnoverReportDay.data.turnoverAvg]);
			setTimeout(function (){
				window.onresize = function () {
					myChart1.resize();
					myChart2.resize();
					myChart3.resize();
				}
			},200);
	});
	/* var errorFun = function(result) {
        //console.log(result);
    };
    jquery1.AjaxPost(data,url, successFun, errorFun);*/
}

define(function(require) {
	//引用样式
	var app = require("css!myindex_css");
	var $ = require("jquery");
	var echart = require("echart");
	//模块依赖
	var rtObj = {
		id: "index",
		ctrl: "list_module",
		arrFunc: ['$scope', //必须引用
		          '$rootScope', 
		          "ajaxService",
		function($scope, 
				$rootScope, 
				ajaxService) {
			jquery1 = ajaxService;
			//取sessionid
			var sessionId = $rootScope.sessionId;

			ajaxService.AjaxPost({
				sessionId: sessionId
			},
			"reportcenter/index/load.do").then(function(result) {
				$scope.list = result.data;
			});
			
			$scope.beginDate;
			$scope.endDate;
			
			$scope.dates=[{name:'近7天',statu: true,title:1},{name:'近15天',statu:false,title:2},{name:'近30天',statu:false,title:3},{name:'近12个月',statu:false,title:4}];
            $scope.setDateColor=function(date,title){
                $scope.dates.forEach(function(date){
                    date.statu=false;
                });
                date.statu=true;
                var fun_name = "$scope.click"+date.title+"()";
                eval(fun_name);
            };

			setEchars( {
				reportName: 'memberSaveMonryReportDay',
				sessionId: sessionId,
				date: 7,
				dateExecute: true,
				format: 'MM/dd',
				toDay: false,
				type: 'DAY',
				size: -1,
				count: 7,
				label: 'showDate',
				field: ['showDate', 'saveMoneySum', 'saveMoneyCount']
			},
			"reportcenter/index/list.do");

			setEcharArrays({
				sessionId: sessionId,
				mainReportArray: [{
					reportName: 'memberConsumeReportDay',
					sessionId: sessionId,
					date: 7,
					dateExecute: true,
					format: 'MM/dd',
					toDay: false,
					type: 'DAY',
					size: -1,
					count: 7,
					label: 'showDate',
					field: ['showDate', 'memberMoney', 'memberConsumeCount', 'memberAvg']
				},
				{
					reportName: 'turnoverReportDay',
					sessionId: sessionId,
					date: 7,
					dateExecute: true,
					format: 'MM/dd',
					toDay: false,
					type: 'DAY',
					size: -1,
					count: 7,
					label: 'showDate',
					field: ['showDate', 'turnoverMoney', 'turnoverCount', 'turnoverAvg']
				}]
			},
			"reportcenter/index/arraylist.do");

			$scope.click1 = function() {
				setEchars( {
					reportName: 'memberSaveMonryReportDay',
					sessionId: sessionId,
					date: 7,
					dateExecute: true,
					format: 'MM/dd',
					toDay: false,
					type: 'DAY',
					size: -1,
					count: 7,
					label: 'showDate',
					field: ['showDate', 'saveMoneySum', 'saveMoneyCount']
				},
				"reportcenter/index/list.do");

				setEcharArrays({
					sessionId: sessionId,
					mainReportArray: [{
						reportName: 'memberConsumeReportDay',
						sessionId: sessionId,
						date: 7,
						dateExecute: true,
						format: 'MM/dd',
						toDay: false,
						type: 'DAY',
						size: -1,
						count: 7,
						label: 'showDate',
						field: ['showDate', 'memberMoney', 'memberConsumeCount', 'memberAvg']
					},
					{
						reportName: 'turnoverReportDay',
						sessionId: sessionId,
						date: 7,
						dateExecute: true,
						format: 'MM/dd',
						toDay: false,
						type: 'DAY',
						size: -1,
						count: 7,
						label: 'showDate',
						field: ['showDate', 'turnoverMoney', 'turnoverCount', 'turnoverAvg']
					}]
				},
				"reportcenter/index/arraylist.do");
			};
			$scope.click2 = function() {
				setEchars( {
					reportName: 'memberSaveMonryReportDay',
					sessionId: sessionId,
					date: 15,
					dateExecute: true,
					format: 'MM/dd',
					toDay: false,
					type: 'DAY',
					size: -1,
					count: 15,
					label: 'showDate',
					field: ['showDate', 'saveMoneySum', 'saveMoneyCount']
				},
				"reportcenter/index/list.do");

				setEcharArrays({
					sessionId: sessionId,
					mainReportArray: [{
						reportName: 'memberConsumeReportDay',
						sessionId: sessionId,
						date: 15,
						dateExecute: true,
						format: 'MM/dd',
						toDay: false,
						type: 'DAY',
						size: -1,
						count: 15,
						label: 'showDate',
						field: ['showDate', 'memberMoney', 'memberConsumeCount', 'memberAvg']
					},
					{
						reportName: 'turnoverReportDay',
						sessionId: sessionId,
						date: 15,
						dateExecute: true,
						format: 'MM/dd',
						toDay: false,
						type: 'DAY',
						size: -1,
						count: 15,
						label: 'showDate',
						field: ['showDate', 'turnoverMoney', 'turnoverCount', 'turnoverAvg']
					}]
				},
				"reportcenter/index/arraylist.do");
			};
			$scope.click3 = function() {
				setEchars({
					reportName: 'memberSaveMonryReportDay',
					sessionId: sessionId,
					date: 30,
					dateExecute: true,
					format: 'MM/dd',
					toDay: false,
					type: 'DAY',
					size: -1,
					count: 30,
					label: 'showDate',
					field: ['showDate', 'saveMoneySum', 'saveMoneyCount']
				},
				"reportcenter/index/list.do");

				setEcharArrays({
					sessionId: sessionId,
					mainReportArray: [{
						reportName: 'memberConsumeReportDay',
						sessionId: sessionId,
						date: 30,
						dateExecute: true,
						format: 'MM/dd',
						toDay: false,
						type: 'DAY',
						size: -1,
						count: 30,
						label: 'showDate',
						field: ['showDate', 'memberMoney', 'memberConsumeCount', 'memberAvg']
					},
					{
						reportName: 'turnoverReportDay',
						sessionId: sessionId,
						date: 30,
						dateExecute: true,
						format: 'MM/dd',
						toDay: false,
						type: 'DAY',
						size: -1,
						count: 30,
						label: 'showDate',
						field: ['showDate', 'turnoverMoney', 'turnoverCount', 'turnoverAvg']
					}]
				},
				"reportcenter/index/arraylist.do");
			};
			$scope.click4 = function() {
				//Monry
				setEchars({
					reportName: 'memberSaveMonryReportMonth',
					sessionId: sessionId,
					date: 11,
					dateExecute: true,
					format: 'yyyy/MM',
					toDay: true,
					type: 'MONTH',
					size: -1,
					count: 11,
					label: 'showDate',
					field: ['showDate', 'saveMoneySum', 'saveMoneyCount']
				},
				"reportcenter/index/list.do");

				setEcharArraysMonth({
					sessionId: sessionId,
					mainReportArray: [{
						reportName: 'memberConsumeReportMonth',
						sessionId: sessionId,
						date: 11,
						dateExecute: true,
						format: 'yyyy/MM',
						toDay: true,
						type: 'MONTH',
						size: -1,
						count: 11,
						label: 'showDate',
						field: ['showDate', 'memberMoney', 'memberConsumeCount', 'memberAvg']
					},
					{
						reportName: 'turnoverReportMonth',
						sessionId: sessionId,
						date: 11,
						dateExecute: true,
						format: 'yyyy/MM',
						toDay: true,
						type: 'MONTH',
						size: -1,
						count: 11,
						label: 'showDate',
						field: ['showDate', 'turnoverMoney', 'turnoverCount', 'turnoverAvg']
					}]
				},
				"reportcenter/index/arraylist.do");
			};

			$scope.click5 = function() {
				
				var beginDate = new Date($scope.beginDate).getTime();
				var endDate = new Date($scope.endDate).getTime();
				if((endDate-beginDate)>31536000000){
					alert('选择日期不得大于一年！');
					return;
				}
				var textFormat = 'yyyy-MM-dd';
				//Monry
				setEchars({
					reportName: 'select_memberSaveMonryReportDay',
					sessionId: sessionId,
					date: 11,
					beginDate: beginDate,
					endDate: endDate,
					textFormat: textFormat,
					dateExecute: true,
					format: 'MM/dd',
					toDay: true,
					type: 'DAY',
					size: -1,
					count: 11,
					label: 'showDate',
					field: ['showDate', 'saveMoneySum', 'saveMoneyCount']
				},
				"reportcenter/index/list.do");

				setEcharArraysMonthSelect({
					sessionId: sessionId,
					mainReportArray: [{
						reportName: 'select_memberConsumeReportDay',
						sessionId: sessionId,
						date: 11,
						dateExecute: true,
						format: 'MM/dd',
						beginDate: beginDate,
						endDate: endDate,
						textFormat: textFormat,
						toDay: true,
						type: 'DAY',
						size: -1,
						count: 11,
						label: 'showDate',
						field: ['showDate', 'memberMoney', 'memberConsumeCount', 'memberAvg']
					},
					{
						reportName: 'select_turnoverReportDay',
						sessionId: sessionId,
						date: 11,
						dateExecute: true,
						format: 'MM/dd',
						beginDate: beginDate,
						endDate: endDate,
						textFormat: textFormat,
						toDay: true,
						type: 'DAY',
						size: -1,
						count: 11,
						label: 'showDate',
						field: ['showDate', 'turnoverMoney', 'turnoverCount', 'turnoverAvg']
					}]
				},
				"reportcenter/index/arraylist.do");
			};

		}]
	};

	return rtObj;
});