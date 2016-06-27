/**
 * 报表中心首页
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory
 * 
 * @note 列表页:reportIndex    
 */

define(['macarons','echart','css!myindex_css','jquery'],function(macarons, echart) {


	echart.registerTheme("macarons", macarons);

	var jquery1;
	function setEchars( param) {

		jquery1.AjaxPost(param.data, param.url).then(function(result) {
			//chart.clear();
			setInit(result);
		});
	}
	function setInit(result){
		myChart4 = echart.init(document.getElementById('main4'), 'macarons');

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
	}
	function setEcharArrays(param) {
		jquery1.AjaxPost(param.data, param.url).then(function(result) {
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

				window.onresize = function () {
					myChart1.resize();
					myChart2.resize();
					myChart3.resize();
					myChart4.resize();
				}

		});
	}

	function setEcharArraysMonth(param) {
		jquery1.AjaxPost(param.data, param.url).then(function(result) {
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

				window.onresize = function () {
					myChart1.resize();
					myChart2.resize();
					myChart3.resize();
					myChart4.resize();
				}

		});
	}
	var myChart2;
	function set_echars2(data, name, value) {
		myChart2 = echart.init(document.getElementById(name), 'macarons');
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
							color:'rgba(218, 208, 238,.7)'
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
	}
	var myChart1;
	function set_echars1(data, name, value) {
		myChart1 = echart.init(document.getElementById(name), 'macarons');
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
					areaStyle:{normal: {opacity:.3}} ,
					data: value[2]
				}]
		};
		myChart1.setOption(option);
	}
	var myChart3;
	function set_echars3(data, name, value) {
		myChart3 = echart.init(document.getElementById(name), 'macarons');
		var option = {
			title: {
				text: '客单价'
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
					data: value[2],
					areaStyle:{normal: {opacity:.3}}
				},
			]
		};

		myChart3.setOption(option);
	}
	var ngAMD = require('ngAMD');
	ngAMD.controller("inCtrl",[ '$scope', //必须引用
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
			$scope.dates=[
				{name:'近7天',statu: true,title:1,date:7,format:'MM/dd',toDay: false,type:'DAY',count: 7},
				{name:'近15天',statu:false,title:2,date:15,format:'MM/dd',toDay: false,type:'DAY',count: 15},
				{name:'近30天',statu:false,title:3,date:30,format:'MM/dd',toDay: false,type:'DAY',count: 30},
				{name:'近12个月',statu:false,title:4,date:11,format:'yyyy/MM',toDay: true,type:'MONTH',count: 11}];
            $scope.setDateColor=function(date,title){
                $scope.dates.forEach(function(date){
                    date.statu=false;
                });
                date.statu=true;
                // var fun_name = "$scope.click"+date.title+"()";
                // eval(fun_name);
				$scope.clickDate(date);
            };
			$scope.chartParam = {
				data:{
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
				url:'reportcenter/index/list.do'
			};
			$scope.chartArrParam = {
				data:{
					sessionId:sessionId,
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
					}
				]},
				url:'reportcenter/index/arraylist.do'
			};
			setEchars($scope.chartParam);

			setEcharArrays($scope.chartArrParam);

			$scope.clickDate = function(date){
				$scope.chartParam.data.date = date.date;
				$scope.chartParam.data.format = date.format;
				$scope.chartParam.data.toDay = date.toDay;
				$scope.chartParam.data.type = date.type;
				$scope.chartParam.data.count = date.count;
				if(date.title===4){
					$scope.chartParam.data.reportName = 'memberSaveMonryReportMonth';
				}else{
					$scope.chartParam.data.reportName = 'memberSaveMonryReportDay';
				}
				setEchars($scope.chartParam);
				angular.forEach($scope.chartArrParam.data.mainReportArray,function(mainReport){
					mainReport.date = date.date;
					mainReport.format = date.format;
					mainReport.toDay = date.toDay;
					mainReport.type = date.type;
					mainReport.count = date.count;
				});
				if(date.title===4){
					$scope.chartArrParam.data.mainReportArray[0].reportName = 'memberConsumeReportMonth';
					$scope.chartArrParam.data.mainReportArray[1].reportName = 'turnoverReportMonth';
					setEcharArraysMonth($scope.chartArrParam);
				}else{
					$scope.chartArrParam.data.mainReportArray[0].reportName = 'memberConsumeReportDay';
					$scope.chartArrParam.data.mainReportArray[1].reportName = 'turnoverReportDay';
					setEcharArrays($scope.chartArrParam);
				}

			};
		}]);

	return 'inCtrl';
});