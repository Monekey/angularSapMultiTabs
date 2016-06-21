/**
 * 我的首页
 * @version  v1.0      
 * @createTime: 2016-04-20         
 * @createAuthor liyd             
 * @updateHistory 
 * 
 * @note 列表页:myindex
 */
var jquery1;
var companyId;
var titleName="会员数";
function init_setEchars(id,data,url,label){
	data.companyId=companyId;
	jquery1.AjaxPost(data, url).then(function (result) {
		var chart = window.echarts.init(document.getElementById(id));
        chart.clear();
    	chart.setOption({
    		//trigger: 'axis',
    		tooltip: {
                trigger: 'axis',	
                formatter: "{a} {b} {c}"+label
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
 		    toolbox: {
 		        show : true,
 		        x: '1090',
 		        y: '20',
 		        feature : {
 		            saveAsImage : {show: true}
 		        }
 		    },
            calculable : true,
           /* legend: {
    			data: ['会员数','会员消费','会员积分','会员储值']
    		},*/
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: result.name,
				splitLine:{
					show: false
				}
            }],
            yAxis: [{
                type: 'value',
                //name:titleName,
                splitLine: {
                    show: true,
					lineStyle:
					{
						color: ['#ddd'],
						width: 1,
						type: 'solid'
					}
                },
            }],
            series: [{
                type: 'line',
                stack: '总量',
                name:titleName,
                data: result.value,
				smooth:true,
				itemStyle: {normal: {
					label: {
						show : true,
						formatter: function(p) {
							return p.value > 0 ? (p.value) : '';
						}
					},
					areaStyle: {type: 'default'}
					}
                }
            }]
        });
		window.onresize = chart.resize;
		chart.setTheme('macarons');
        //console.log(result);
    });
}
define(function (require) {
    var app = require("css!myindex_css");
    var echart = require("echart");
    var $_true = require("jquery");
    $_true(".tab li").click(
    		function() {
    	        $_true(this).addClass("blue").siblings().removeClass("blue");
    	        var tab = $_true(this).attr("title");
    	        $_true("#" + tab).show().siblings().hide();

    	    }
    );

    function tab() {
        $_true(this).addClass("blue").siblings().removeClass("blue");
        var tab = $_true(this).attr("title");
        $_true("#" + tab).show().siblings().hide();

    };

	//var add2ctrl = require( "myindex/myindexfour/myindexfour" );

    var rtObj = {
        id: "myindex", ctrl: "list_module", arrFunc: [
            '$scope',
            "ajaxService",
            "$rootScope",
            "register",
            function ($scope,ajaxService,$rootScope,register) {
                var sessionId = $rootScope.sessionId;

                jquery1=ajaxService;
                //var sessionId = getCookie("CRMSESSIONID");

                ajaxService.AjaxPost({
                    sessionId: sessionId,
                    data: 1
                }, "index/busiSMS/load.do").then(function (result) {

                	$scope.surplusCount = result.showCount;
                    $scope.showName = result.showName;
                    $scope.showURL = result.showLogo;

                });

                ajaxService.AjaxPost({
                	showCount: 5,
                	sessionId: sessionId
                }, "index/sysMsg/load.do").then(function (result) {
                	$scope.list = result.pageInfo.list;
                });

                $scope.isShow=function(hot){
                	if(hot==1){
                		return "block";
                	}
                	else{
                		return "none";
                	}
                };
                //var companyId=0;

                ajaxService.AjaxPost({
                    sessionId: sessionId
                }, "index/memberReport/load.do").then(function (result) {
                	$scope.memberCount = result.data.memberCount;
                    $scope.toDayMemberCount = result.data.toDayMemberCount;
                    $scope.toDayConsume = result.data.toDayConsume;

                    if(result.data.addMemberCount=='-'){
                    	$scope.addMemberCount = result.data.addMemberCount;
                    	$_true("#addMemberCount").remove();
                    }else if(result.data.addMemberCount>=0){
                    	$scope.addMemberCount = result.data.addMemberCount+'%';
                    	$scope.addMemberCountImg='&#xe62e;';
                        $scope.addMemberCountChose='1';
                    }else{
                    	$scope.addMemberCount = -result.data.addMemberCount+'%';
                    	$scope.addMemberCountImg='&#xe62d';
                        $scope.addMemberCountChose='2';
                    }

                    if(result.data.addDayConsume=='-'){
                    	$scope.addDayConsume = result.data.addDayConsume;
                    	$_true("#addDayConsume").remove();
                    }else if(result.data.addDayConsume>=0){
                    	$scope.addDayConsume = result.data.addDayConsume+'%';
                    	$scope.addDayConsumeImg='&#xe62e;';
                        $scope.addDayConsumeChose='1';
                    }else{
                    	$scope.addDayConsume = -result.data.addDayConsume+'%';
                    	$scope.addDayConsumeImg='&#xe62d;';
                        $scope.addDayConsumeChose='2';
                    }



                    companyId=result.companyId;

                    init_setEchars('main',{
                    	sessionId:sessionId,
                    	reportName:'memberCountReportDay',
                    	companyId:result.companyId,
                    	date:7,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:7
                    },'index/memberReport/list.do','个');

                });


                $scope.click1_1=function() {
                	init_setEchars('main',{
                    	reportName:'memberCountReportDay',
                    	sessionId:sessionId,
                    	date:7,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:7
                    },'index/memberReport/list.do','个');
                };
                $scope.click1_2=function(){
                	init_setEchars('main',{
                    	reportName:'memberCountReportDay',
                    	sessionId:sessionId,
                    	date:15,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:15
                    },'index/memberReport/list.do','个');
                };
                $scope.click1_3=function(){
                	init_setEchars('main',{
                    	reportName:'memberCountReportDay',
                    	sessionId:sessionId,
                    	date:30,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:30
                    },'index/memberReport/list.do','个');
                };
                $scope.click1_4=function(){
                	init_setEchars('main',{
                    	reportName:'memberCountReportMonth',
                    	sessionId:sessionId,
                    	date:11,
                    	dateExecute:true,
                    	format:'yyyy年MM月',
                    	toDay:true	,
                    	type:'MONTH',
                    	size:-1,
                    	count:11
                    },'index/memberReport/list.do','个');
                };

                /*setEchars(echarts.init(document.getElementById('maina')),{
                	reportName:'memberConsumeReportDay',
                	sessionId:sessionId,
                	date:7,
                	dateExecute:true,
                	format:'MM月dd日',
                	toDay:false	,
                	type:'DAY',
                	size:-1,
                	count:7
                },"index/memberReport/list.do",'元');*/

                $scope.click2_1=function() {
                	init_setEchars('maina',{
                    	reportName:'memberConsumeReportDay',
                    	sessionId:sessionId,
                    	date:7,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:7
                    },'index/memberReport/list.do','元');
                };
                $scope.click2_2=function() {
                	init_setEchars('maina',{
                    	reportName:'memberConsumeReportDay',
                    	sessionId:sessionId,
                    	date:15,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:15
                    },'index/memberReport/list.do','元');
                };
                $scope.click2_3=function() {
                	init_setEchars('maina',{
                    	reportName:'memberConsumeReportDay',
                    	sessionId:sessionId,
                    	date:30,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:30
                    },'index/memberReport/list.do','元');
                };
                $scope.click2_4=function(){
                	init_setEchars('maina',{
                    	reportName:'memberConsumeReportMonth',
                    	sessionId:sessionId,
                    	date:11,
                    	dateExecute:true,
                    	format:'yyyy年MM月',
                    	toDay:true	,
                    	type:'MONTH',
                    	size:-1,
                    	count:11
                    },'index/memberReport/list.do','元');
                };

                /*setEchars(echarts.init(document.getElementById('mainb')),{
                	reportName:'memberScoreReportDay',
                	sessionId:sessionId,
                	date:7,
                	dateExecute:true,
                	format:'MM月dd日',
                	toDay:false	,
                	type:'DAY',
                	size:-1,
                	count:7
                },"index/memberReport/list.do",'分');*/

                $scope.click3_1=function() {
                	init_setEchars('mainb',{
                    	reportName:'memberScoreReportDay',
                    	sessionId:sessionId,
                    	date:7,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:7
                    },'index/memberReport/list.do','分');
                };
                $scope.click3_2=function() {
                	init_setEchars('mainb',{
                    	reportName:'memberScoreReportDay',
                    	sessionId:sessionId,
                    	date:15,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:15
                    },'index/memberReport/list.do','分');
                };
                $scope.click3_3=function() {
                	init_setEchars('mainb',{
                    	reportName:'memberScoreReportDay',
                    	sessionId:sessionId,
                    	date:30,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:30
                    },'index/memberReport/list.do','分');
                };
                $scope.click3_4=function() {
                	init_setEchars('mainb',{
                    	reportName:'memberScoreReportMonth',
                    	sessionId:sessionId,
                    	date:11,
                    	dateExecute:true,
                    	format:'yyyy年MM月',
                    	toDay:true	,
                    	type:'MONTH',
                    	size:-1,
                    	count:11
                    },'index/memberReport/list.do','分');
                };

               /* setEchars(echarts.init(document.getElementById('maind')),{
                	reportName:'memberSaveMonryReportDay',
                	sessionId:sessionId,
                	date:7,
                	dateExecute:true,
                	format:'MM月dd日',
                	toDay:false	,
                	type:'DAY',
                	size:-1,
                	count:7
                },"index/memberReport/list.do",'元');*/

                $scope.click4_1=function() {
                	init_setEchars('maind',{
                    	reportName:'memberSaveMonryReportDay',
                    	sessionId:sessionId,
                    	date:7,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:7
                    },'index/memberReport/list.do','元');
                };
                $scope.click4_2=function(){
                	init_setEchars('maind',{
                    	reportName:'memberSaveMonryReportDay',
                    	sessionId:sessionId,
                    	date:15,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:15
                    },'index/memberReport/list.do','元');
                };

                $scope.click4_3=function() {
                	init_setEchars('maind',{
                    	reportName:'memberSaveMonryReportDay',
                    	sessionId:sessionId,
                    	date:30,
                    	dateExecute:true,
                    	format:'MM月dd日',
                    	toDay:false	,
                    	type:'DAY',
                    	size:-1,
                    	count:30
                    },'index/memberReport/list.do','元');
                };

                $scope.click4_4=function() {
                	init_setEchars('maind',{
                    	reportName:'memberSaveMonryReportMonth',
                    	sessionId:sessionId,
                    	date:11,
                    	dateExecute:true,
                    	format:'yyyy年MM月',
                    	toDay:true	,
                    	type:'MONTH',
                    	size:-1,
                    	count:11
                    },'index/memberReport/list.do','元');
                };

                $scope.addTab1 = function(){

    				register.addToTabs( {
    					title:"系统消息",
    					id:"add2ctrl",
    					template:"myindex/sysmsg/sysmsg.html",
						ctrl:"myindex/sysmsg/sysmsg",
						ctrlName: "add2ctrl",
    					ng_show:false,
						type: 'single',
						from:10001
    				},{a:1});
    			};

    			$scope.addWarning = function(){
    				$scope.conditions={};
    				register.openTabWithRequest({id: 10043},{});//穿透时调用的方法,id为目标tab功能id,第二个参数为显示类型及显示条件（searchType搜索的下拉条件 searchTypeValue搜索框内的内容）
//    				register.addToTabs( {
//    					title:"预警管理",
//    					id:"10043",
//    					template:"systemmanager/alertmanage/alertManage.html",
//						ctrl:"systemmanager/alertmanage/alertManageCtrl",
//					    ctrlName: "alertManageCtrl",
//    					ng_show:false,
//    	                type: 'single',
//						from:"10037"
//    				},{});
    			};
    			
    			$scope.allMember = function(){
    				register.openTabWithRequest({id: 10013},{select:'all'});
    			};
    			
    			$scope.todayMember = function(){
    				register.openTabWithRequest({id: 10013},{select:'toDay'});
    			};
    			
    			$scope.todayTrans = function(){
    				register.openTabWithRequest({id: 10015},{select:'toDay'});
    			};
                
    			 $scope.dates=[{name:'近7天',statu: true,title:1},{name:'近15天',statu:false,title:2},{name:'近30天',statu:false,title:3},{name:'近12个月',statu:false,title:4}];
                 $scope.setDateColor=function(date,title){
                     $scope.dates.forEach(function(date){
                         date.statu=false;
                     });
                     date.statu=true;
                     var fun_name = "$scope.click"+title+'_'+date.title+"()";
                     eval(fun_name);
                 };

				$scope.typers = [{name:'会员数',statu: true,title:"d1"},{name:'会员消费',statu: false,title:"d2"},{name:'会员积分',statu: false,title:"d3"},{name:'会员储值',statu: false,title:"d4"}];
				$scope.setColor = function(typer){
					$scope.typers.forEach(function(typer){
						typer.statu = false;
						var tab = typer.title;					
						$_true("#" + tab).hide();
				        //$_true("#maind").show();
					});
					typer.statu = true;
					titleName=typer.name;
					$scope.dates.forEach(function(date){
                        date.statu=false;
                    });
					$scope.dates[0].statu = true;
					//$_true(this).addClass("blue").siblings().removeClass("blue");
			        var tab = typer.title;
			        $_true("#" + tab).show();
			        if(tab=='d1'){
			        	init_setEchars('main',{
			                	reportName:'memberCountReportDay',
			                	sessionId:sessionId,
			                	date:7,
			                	dateExecute:true,
			                	format:'MM月dd日',
			                	toDay:false	,
			                	type:'DAY',
			                	size:-1,
			                	count:7
			                },'index/memberReport/list.do','个');
			        	$_true("#main").show();
			        }
			        if(tab=='d2'){
			        	init_setEchars('maina',{
		                	reportName:'memberConsumeReportDay',
		                	sessionId:sessionId,
		                	date:7,
		                	dateExecute:true,
		                	format:'MM月dd日',
		                	toDay:false	,
		                	type:'DAY',
		                	size:-1,
		                	count:7
		                },'index/memberReport/list.do','元');
			        	$_true("#maina").show();
			        }
			        if(tab=='d3'){
			        	init_setEchars('mainb',{
		                	reportName:'memberScoreReportDay',
		                	sessionId:sessionId,
		                	date:7,
		                	dateExecute:true,
		                	format:'MM月dd日',
		                	toDay:false	,
		                	type:'DAY',
		                	size:-1,
		                	count:7
		                },'index/memberReport/list.do','分');
			        	$_true("#mainb").show();
			        }
			        if(tab=='d4'){
			        	init_setEchars('maind',{
		                	reportName:'memberSaveMonryReportDay',
		                	sessionId:sessionId,
		                	date:7,
		                	dateExecute:true,
		                	format:'MM月dd日',
		                	toDay:false	,
		                	type:'DAY',
		                	size:-1,
		                	count:7
		                },'index/memberReport/list.do','元');
			        	$_true("#maind").show();
			        }
			     
				};
            }
        ]
    };

    return rtObj;
});