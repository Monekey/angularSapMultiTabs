/**
 * 综合账单首页
 *
 * @version v1.0
 * @createTime: 2016-04-20
 * @createAuthor liyd
 * @updateHistory
 *
 * @note 列表页:comprehensive
 */
var selectMain;
var param;
var score;
var flag=0;
var label=[
"all_money_sum",
"member_money_sum",
"money_out_sum",
"givemoney_out_sum",

"v1",
"all_money_count",
"member_money_count",
"v2",

"money_in_count",
"money_in_sum",
"givemoney_in_sum",
"integration_in_count",

"integration_in_sum",
"integration_out_count",
"integration_out_sum",
"buy_card_count",

"buy_card_sum",
"cancel_card_count",
"cancel_card_sum",
"change_crad_type_count",

"update_card_count",
"change_crad_date_count"
];
function resetTab() {
    var tab = document.getElementById("dataTable");
    var columnLength = tab.rows[0].cells.length; 
    for (var i = 0; i < tab.rows.length; i++) {		
    	for(var len=2;len<tab.rows[i].cells.length;len++){
			tab.rows[i].cells[len].style.display="";
	    }		
    }
    
}

function DeleteSignColumn(col) {
    var tab = document.getElementById("dataTable");
    var columnLength = tab.rows[0].cells.length;
    //删除指定单元格 
    for (var i = 0; i < tab.rows.length; i++) {		
    	for(var len=2;len<tab.rows[i].cells.length;len++){
			tab.rows[i].cells[len].style.display="none";
	    }
    	
    	for(var len=0;len<col.length;len++){
    		tab.rows[i].cells[col[len]].style.display="";
    	}
    		
    }
    
}

function execute(a, b) {
	if (b == 0) {
		return '-';
	} else {
		return (a * 100 / b).toFixed(2) + '%';
	}
}

function loadtable(datas,v1,v2) {

    var tab = document.getElementById("dataTable");
    var columnLength = tab.rows[0].cells.length;
    //删除指定单元格 
    for (var i = 1; i < tab.rows.length; i++) {		
    	for(var len=2;len<tab.rows[i].cells.length;len++){
    		if(label[len-2]=='v1'){
    			//percentage(member_money_sum,all_money_sum)
    			if(v1)
    			tab.rows[i].cells[len].innerHTML=execute(datas[i-1]['member_money_sum'],datas[i-1]['all_money_sum']);
    		}else if(label[len-2]=='v2'){
    			//percentage(member_money_count,all_money_count)
    			if(v2)
    			tab.rows[i].cells[len].innerHTML=execute(datas[i-1]['member_money_count'],datas[i-1]['all_money_count']);
    		}else if(label[len-2]=='member_money_sum'){
    			//percentage(member_money_count,all_money_count)
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openConsume(data)'>"+datas[i-1]['member_money_sum']+"</a>";
    			//tab.rows[i].cells[len].onclick=score.openConsume(datas[i-1]);
    		}else if(label[len-2]=='money_in_count'){
    			//percentage(member_money_count,all_money_count)
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openSaveMoney(data)'>"+datas[i-1]['money_in_count']+"</a>";
    			//tab.rows[i].cells[len].onclick=score.openConsume(datas[i-1]);
    		}else if(label[len-2]=='integration_in_sum'){
    			//percentage(member_money_count,all_money_count)
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openIntegration(data)'>"+datas[i-1]['integration_in_sum']+"</a>";
    			//tab.rows[i].cells[len].onclick=score.openConsume(datas[i-1]);
    		}else if(label[len-2]=='integration_out_sum'){
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openExchange(data)'>"+datas[i-1]['integration_out_sum']+"</a>";
    		}else if(label[len-2]=='buy_card_count'){
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openBuyCard(data)'>"+datas[i-1]['buy_card_count']+"</a>";
    		}else if(label[len-2]=='cancel_card_count'){
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openCancelCard(data)'>"+datas[i-1]['cancel_card_count']+"</a>";
    		}else if(label[len-2]=='change_crad_type_count'){
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openChangeCardType(data)'>"+datas[i-1]['change_crad_type_count']+"</a>";
    		}else if(label[len-2]=='update_card_count'){
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openUpdateCard(data)'>"+datas[i-1]['update_card_count']+"</a>";
    		}else if(label[len-2]=='change_crad_date_count'){
    			tab.rows[i].cells[len].innerHTML="<a ng-click='openChangeCardDate(data)'>"+datas[i-1]['change_crad_date_count']+"</a>";
    		}else{
    			tab.rows[i].cells[len].innerHTML=datas[i-1][label[len-2]];
    		}
			
	    }
    		
    }
	
}

define(function (require) {
    // 引用样式
    var apdp = require("css!score_rule_css");
    var css = require("css!trade_css");
    var $ = require("jquery");
    var echart = require("echart");
    var module = angular.module("ajaxmodule");
    // 模块依赖
    var ngAMD = require('ngAMD');
    ngAMD.controller("comprehensive", ['$scope', // 必须引用
            '$rootScope',
            "ajaxService",
            'appConstant',
            "register",
            "$uibModal",
            "getCookieService",
            "$q",
            function ($scope,
                      $rootScope,
                      ajaxService,
                      appConstant,
                      register,
                      $uibModal,
                      getCookieService,
                      $q) {
        	    score=$scope;
                // 取sessionid
                var sessionId = $rootScope.sessionId;

                var tabLabel1 = {
                    all_money_sum: 2,
                    member_money_sum: 3,
                    money_out_sum: 4,
                    givemoney_out_sum: 5,
                    v1: 6,
                    all_money_count: 7,
                    member_money_count: 8,
                    v2: 9,
                    money_in_count: 10,
                    money_in_sum: 11,
                    givemoney_in_sum: 12,
                    integration_in_count: 13,
                    integration_in_sum: 14,
                    integration_out_count: 15,
                    integration_out_sum: 16,
                    buy_card_count: 17,
                    buy_card_sum: 18,
                    cancel_card_count: 19,
                    cancel_card_sum: 20,
                    change_crad_type_count: 21,
                    update_card_count: 22,
                    change_crad_date_count: 23
                };

                var param = null;
                try {
                    param = JSON.parse(getCookieService.getCookie("COMPSELECTKPI"));
                } catch (e) {
                    param = {
                        all_money_sum: true,
                        member_money_sum: true,
                        money_out_sum: true,
                        givemoney_out_sum: true,
                        all_money_count: true,
                        member_money_count: true,
                        money_in_count: true,
                        money_in_sum: true,
                        givemoney_in_sum: true,
                        integration_in_count: true,
                        integration_in_sum: true,
                        integration_out_count: true,
                        integration_out_sum: true,
                        buy_card_count: true,
                        buy_card_sum: true,
                        cancel_card_count: true,
                        cancel_card_sum: true,
                        change_crad_type_count: true,
                        update_card_count: true,
                        change_crad_date_count: true,
                        v1:true,
                        v2:true
                    };
                }

                var labels = new Array();
                var arrays = new Array();
                var len = 0;
                for (var x in param) {
                    if (param[x]) {
                        arrays[len] = x;

                        labels[len] = tabLabel1[x];
                        len = len + 1;


                    }
                }
                if(param['v1']==true){
                labels[len] = tabLabel1["v1"];
                len = len + 1;
                }
                if(param['v2']==true){
                labels[len] = tabLabel1["v2"];
                len = len + 1;
                }

                DeleteSignColumn(labels);


                ajaxService.AjaxPost({
                        sessionId: sessionId
                    },
                    "reportcenter/comprehensive/load.do").then(function (result) {

                   /* for (var x in result.data) {
                        $scope.resultList.data = result.data;
                    }*/

                });

                $scope.conditions = {
                    isCollapsed: false,
                    ajaxUrl: 'reportcenter/comprehensive/list.do',// 请求URL
                    request: {
                        "shopGroupFlag": true,
                        "sessionId": sessionId,
                        "pageNo": "1",
                        "pageCount": appConstant.pageSet.numPerPage,
                        "field": arrays,
                        "shopFieldVo": param
                    },// 筛选条件
                    filter: [{
                        type: 'normal',// 按钮型 后台获取条件
                        field: '卡型：',
                        requestFiled: 'cardTypes',
                        value: [],
                        ajaxUrl: 'memberequity/cardtype/list.do',
                        request: {
                            "sessionId": sessionId
                        }
                    },
                        {
                            type: 'normal',// 按钮型 后台获取条件
                            field: '会员来源：',
                            requestFiled: 'memberOrigins',
                            value: [],
                            ajaxUrl: 'reportcenter/memberOrigin/list.do',
                            request: {
                                "sessionId": sessionId
                            }
                        }],
                    datePicker: { // 表头里的时间配置，不需要可不配置此项
                        requestFiled: ['date', 'beginDate', 'endDate'],
                        // 分别对应普通按钮时间，开始时间和结束时间
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
                    /*
                     * select: [{"name": "卡号", "state": true, "value":
                     * 0},//表头里下拉选择，不需要可不配置此项 {"name": "手机号", "state": false,
                     * "value": 1}, {"name": "门店名称", "state": false, "value": 2} ],
                     * search: {requestFiled: 'date', ajaxUrl: '', request:
                     * {"sessionId": sessionId}},//表头里的搜索框，不需要可不配置此项
                     */
                    more: true
                };

                $scope.percentage = function (a, b) {
                	try{
                    if (b == 0) {
                        return '-';
                    } else {
                    	return (a * 100 / b).toFixed(2) + '%';
                    }
                	}catch(e){
                		return '-';
                	}
                }

                $scope.openSelectParam = function(){
 	               var deferred = $q.defer();
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'resources/page/reportcenter/comprehensive/selectParam.html',
                        controller: ['$scope','$rootScope','$uibModalInstance','$state',"ajaxService","getCookieService",
                                 	 function($scope,$rootScope,$uibModalInstance,$state,ajaxService,getCookieService){
                     	
                         try{
                         window.param=JSON.parse(getCookieService.getCookie("COMPSELECTKPI"));                  
                         
                         var param = window.param;
                        $scope.all_money_sum = param["all_money_sum"];
                        $scope.member_money_sum = param["member_money_sum"];
                  		$scope.money_out_sum = param["money_out_sum"];
                  		$scope.givemoney_out_sum = param["givemoney_out_sum"];
                  		$scope.all_money_count = param["all_money_count"];
                  		$scope.member_money_count = param["member_money_count"];
                  		$scope.money_in_count = param["money_in_count"];
                  		$scope.money_in_sum = param["money_in_sum"];
                  		$scope.givemoney_in_sum = param["givemoney_in_sum"];
                  		$scope.integration_in_count = param["integration_in_count"];
                  		$scope.integration_in_sum = param["integration_in_sum"];
                  		$scope.integration_out_count = param["integration_out_count"];
                  		$scope.integration_out_sum = param["integration_out_sum"];
                  		$scope.buy_card_count = param["buy_card_count"];
                  		$scope.buy_card_sum = param["buy_card_sum"];
                  		$scope.cancel_card_count = param["cancel_card_count"];
                  		$scope.cancel_card_sum = param["cancel_card_sum"];
                  		$scope.change_crad_type_count = param["change_crad_type_count"];
                  		$scope.update_card_count = param["update_card_count"];
                  		$scope.change_crad_date_count = param["change_crad_date_count"];
                 		
                  		$scope.v1= param["v1"];
                  		$scope.v2= param["v2"];
                 /* 		document.getElementById("v1").checked = param["v1"];
                 		document.getElementById("v2").checked = param["v2"]; */
                 		}catch(e){
                 			$scope.all_money_sum = true;
                            $scope.member_money_sum = true;
                      		$scope.money_out_sum = true;
                      		$scope.givemoney_out_sum = true;
                      		$scope.all_money_count = true;
                      		$scope.member_money_count = true;
                      		/*$scope.money_in_count = true;
                      		$scope.money_in_sum = true;
                      		$scope.givemoney_in_sum = true;
                      		$scope.integration_in_count = true;
                      		$scope.integration_in_sum = true;
                      		$scope.integration_out_count = true;
                      		$scope.integration_out_sum = true;
                      		$scope.buy_card_count = true;
                      		$scope.buy_card_sum = true;
                      		$scope.cancel_card_count = true;
                      		$scope.cancel_card_sum = true;
                      		$scope.change_crad_type_count = true;
                      		$scope.update_card_count = true;
                      		$scope.change_crad_date_count = true;*/
                     		
                      		$scope.v1= true;
                      		$scope.v2= true;
                 		}
                         
                         $scope.closeTab=function(){
                         	$uibModalInstance.dismiss('cancel');
                         }
              
                        	$scope.oo=function(){
                      		    flag=1;
                      		  var all_money_sum= $scope.all_money_sum;
                      		var member_money_sum= $scope.member_money_sum;
                      		var money_out_sum= $scope.money_out_sum;
                      		var givemoney_out_sum= $scope.givemoney_out_sum;
                      		var all_money_count= $scope.all_money_count;
                      		var member_money_count= $scope.member_money_count;
                      		var money_in_count= $scope.money_in_count;
                      		var money_in_sum= $scope.money_in_sum;
                      		var givemoney_in_sum= $scope.givemoney_in_sum;
                      		var integration_in_count= $scope.integration_in_count;
                      		var integration_in_sum= $scope.integration_in_sum;
                      		var integration_out_count= $scope.integration_out_count;
                      		var integration_out_sum= $scope.integration_out_sum;
                      		var buy_card_count= $scope.buy_card_count;
                      		var buy_card_sum= $scope.buy_card_sum;
                      		var cancel_card_count= $scope.cancel_card_count;
                      		var cancel_card_sum= $scope.cancel_card_sum;
                      		var change_crad_type_count= $scope.change_crad_type_count;
                      		var update_card_count= $scope.update_card_count;
                      		var change_crad_date_count= $scope.change_crad_date_count;                      		
                      		var v1 = $scope.v1;
                      		var v2 = $scope.v2;
                        		
                        		//getCookieService.setCookie('CRMSESSIONID', users.sessionId);
                        		/**
                        		 * if(label[len-2]=='v1'){
    			//percentage(member_money_sum,all_money_sum)
    			if(v1)
    			tab.rows[i].cells[len].innerHTML=execute(datas[i-2]['member_money_sum'],datas[i-2]['all_money_sum']);
    		}else if(label[len-2]=='v2'){
    			//percentage(member_money_count,all_money_count)
    			if(v2)
    			tab.rows[i].cells[len].innerHTML=execute(datas[i-2]['member_money_count'],datas[i-2]['all_money_count']);
    		}
                        		 */
                        		if(v1){
                        			if(member_money_sum&&all_money_sum){
                        				
                        			}else{
                        				alert("必须勾选上会员消费总数与总消费数");
                        				return;
                        			}
                        		}
                        		
                        		if(v2){
                        			if(member_money_count&&all_money_count){
                        				
                        			}else{
                        				alert("必须勾选上会员消费额与总消费额");
                        				return;
                        			}
                        		}
                        		
                        		param={
                        				all_money_sum:all_money_sum,
                         			member_money_sum:member_money_sum,
                         		    money_out_sum:money_out_sum,
                         			givemoney_out_sum:givemoney_out_sum,
                         			all_money_count:all_money_count,
                         			member_money_count:member_money_count,
                         		    money_in_count:money_in_count,
                         			money_in_sum:money_in_sum,
                         			givemoney_in_sum:givemoney_in_sum,
                         			integration_in_count:integration_in_count,
                         		    integration_in_sum:integration_in_sum,
                         			integration_out_count:integration_out_count,
                         			integration_out_sum:integration_out_sum,
                         			buy_card_count:buy_card_count,
                         		    buy_card_sum:buy_card_sum,
                         			cancel_card_count:cancel_card_count,
                         		    cancel_card_sum:cancel_card_sum,
                         			change_crad_type_count:change_crad_type_count,
                         		    update_card_count:update_card_count,
                         			change_crad_date_count:change_crad_date_count,
                         			v1:v1,
                         			v2:v2
                        		};
                        		
                        		labels = new Array();
                        		arrays = new Array();
                        		len=0;
                        		for(var x in param){
                        			/*alert(param[x]);*/
                        		    if(param[x]){
                        		    	arrays[len]=x;
                        		    	
                        		    	labels[len]=tabLabel1[x];
                        		    	len=len+1;
                        		    	
                        		    	
                        		    }
                        		}
                        		if(v1){
                        			labels[len]=tabLabel1["v1"];
                        			len=len+1;
                        		}
                        		if(v2){
                        			labels[len]=tabLabel1["v2"];
                        			len=len+1;
                        		}
                        		
                        		//$route.reload();
                        		
                        		DeleteSignColumn(labels);
                        		
                        		/*var postObj = $scope.requestObj.request;
             				postObj.pageNo = $scope.pageSet.currentPage;
             				postObj.pageCount = $scope.pageSet.numPerPage;
             				postObj.field=arrays;
             				postObj.shopFieldVo=param;*/
             				
             				ajaxService.AjaxPost(
             						{
             							"shopGroupFlag": true,
             							"sessionId": sessionId,
             							"pageNo": "1",
             							"pageCount": appConstant.pageSet.numPerPage,
                         				"field":arrays,
                     				    "shopFieldVo":param
             						}
             						,'reportcenter/comprehensive/list.do').then(function(result) {
             							//resetTab();		
             					$scope.resultList = result;
             					loadtable(result.pageInfo.list,v1,v2);
             					getCookieService.setCookie('COMPSELECTKPI', JSON.stringify(param));
             				});
             				$uibModalInstance.dismiss('cancel');
                    
                        	}  
   
                     	}],
                        size: 'lg'
                        /*resolve: {
                            //将当前页面的值传给模态框
                            paramSet: function () {

                                return paramSet;
                            }
                        }*/
                    });
                                                                    
 			}
                selectMain = function (obj) {
                    var index = obj.selectedIndex;
                    var value = obj.options[index].value;

                    var postObj = $scope.requestObj.request;
                    postObj.pageNo = $scope.pageSet.currentPage;
                    postObj.pageCount = $scope.pageSet.numPerPage;

                    postObj.shopGroupFlag = false;
                    postObj.cityGroupFlag = false;
                    postObj.brandGroupFlag = false;
                    postObj.monthGroupFlag = false;
                    postObj.weekGroupFlag = false;
                    postObj.workDayGroupFlag = false;

                    postObj[value] = true;

                    $("#title_name").text(obj.options[index].text);

                    ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                        $scope.resultList = result;
                    });

          /*          ajaxService.AjaxPost(postObj, "reportcenter/comprehensive/load.do").then(function (result) {

                        for (var x in result.data) {
                            $scope[x] = result.data[x];
                        }

                    });*/
                }
                // 引用分页控件
                $scope.pageSet = {
                    title: "列表",
                    currentPage: appConstant.pageSet.currentPage,// 显示当前
                    maxSize: appConstant.pageSet.maxSize,// 可显示最大页码
                    numPerPage: appConstant.pageSet.numPerPage// 每页条数
                };

                $scope.pageChanged = function () {
                    // var postObj = {"sessionId": sessionId};
                    var postObj = $scope.requestObj.request;
                    postObj.pageNo = $scope.pageSet.currentPage;
                    postObj.pageCount = $scope.pageSet.numPerPage;
                    postObj.field = arrays;
                    postObj.shopFieldVo = param;
                    postObj.change=true;
                    ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                        $scope.resultList = result;
                        if(flag==1){
                        	loadtable(result.pageInfo.list,param.v1,param.v2);
                        }
                        /*DeleteSignColumn(labels);*/
                    });
                };

                $scope.exportFile = function () {
                    alert('报表功能正在开发中。。。');
                };

                $scope.openSaveMoney = function (shop) {

                    var postObj = $scope.requestObj.request;
                    for (var x in postObj) {
                        shop[x] = postObj[x];
                    }
                    shop.isOtherShop = 0;
                    try {
                        shop.date = $scope.requestObj.request.date;
                    } catch (e) {
                        shop.date = 0;
                    }

                    var index = document.getElementById("selectKPI").selectedIndex;
                    var value = document.getElementById("selectKPI").options[index].value;
                    if (value == 'shopGroupFlag') {
                        shop.shopId = shop.id;
                    } else if (value == 'cityGroupFlag') {
                        shop.cityId = shop.id;
                    } else if (value == 'brandGroupFlag') {
                        shop.brandId = shop.id;
                    }

                    // 打开新建积分规则的tab
                    register.addToTabs({
                            title: "储值明细",
                            id: "saveMoneyDesc" + shop.id,
                            template: "reportcenter/savemoney/saveMoneyDesc.html",
                            ctrl: 'reportcenter/savemoney/saveMoneyDesc',
                            // 删除require路径，改为动态配置
                            ctrlName: "saveMoneyDesc",
                            // 对应编辑页controller的名字
                            ng_show: false,
                            type: 'single',
                            from: 1001
                        },
                        shop);
                };

                $scope.openConsume = function (shop) {

                    var postObj = $scope.requestObj.request;
                    for (var x in postObj) {
                        shop[x] = postObj[x];
                    }
                    shop.isOtherShop = 0;
                    try {
                        shop.date = $scope.requestObj.request.date;
                    } catch (e) {
                        shop.date = 0;
                    }

                    var index = document.getElementById("selectKPI").selectedIndex;
                    var value = document.getElementById("selectKPI").options[index].value;
                    if (value == 'shopGroupFlag') {
                        shop.shopId = shop.id;
                    } else if (value == 'cityGroupFlag') {
                        shop.cityId = shop.id;
                    } else if (value == 'brandGroupFlag') {
                        shop.brandId = shop.id;
                    }

                    // 打开新建积分规则的tab
                    register.addToTabs({
                            title: "消费明细",
                            id: "memberConsume" + shop.id,
                            template: "reportcenter/savemoney/memberConsume.html",
                            ctrl: 'reportcenter/savemoney/memberConsume',
                            // 删除require路径，改为动态配置
                            ctrlName: "memberConsume",
                            // 对应编辑页controller的名字
                            ng_show: false,
                            type: 'single',
                            from: 1001
                        },
                        shop);
                };
                
    			$scope.openIntegration = function(shop) {

    				var postObj = $scope.requestObj.request;
    				for (var x in postObj) {
    					shop[x] = postObj[x];
    				}
  
    				try {
    					shop.date = $scope.requestObj.request.date;
    				} catch(e) {
    					shop.date = 0;
    				}
    				shop.shopId = shop.id;
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
    				shop);
    			};

                $scope.openExchange = function (shop) {

                    var postObj = $scope.requestObj.request;
                    for (var x in postObj) {
                        shop[x] = postObj[x];
                    }
                    shop.isOtherShop = 0;
                    try {
                        shop.date = $scope.requestObj.request.date;
                    } catch (e) {
                        shop.date = 0;
                    }

                    var index = document.getElementById("selectKPI").selectedIndex;
                    var value = document.getElementById("selectKPI").options[index].value;
                    if (value == 'shopGroupFlag') {
                        shop.shopId = shop.id;
                    } else if (value == 'cityGroupFlag') {
                        shop.cityId = shop.id;
                    } else if (value == 'brandGroupFlag') {
                        shop.brandId = shop.id;
                    }

                    // 打开新建积分规则的tab
                    register.addToTabs({
                            title: "兑换明细",
                            id: "integrationExchange" + shop.id,
                            template: "reportcenter/integration/integrationExchange.html",
                            ctrl: 'reportcenter/integration/integrationExchange',
                            // 删除require路径，改为动态配置
                            ctrlName: "integrationExchange",
                            // 对应编辑页controller的名字
                            ng_show: false,
                            type: 'single',
                            from: 1003
                        },
                        shop);
                };

                // 卡操作相关
                $scope.openBuyCard = function (shop) {

                    var postObj = $scope.requestObj.request;
                    for (var x in postObj) {
                        shop[x] = postObj[x];
                    }
                    shop.isOtherShop = 0;
                    try {
                        shop.date = $scope.requestObj.request.date;
                    } catch (e) {
                        shop.date = 0;
                    }

                    var index = document.getElementById("selectKPI").selectedIndex;
                    var value = document.getElementById("selectKPI").options[index].value;
                    if (value == 'shopGroupFlag') {
                        shop.shopId = shop.id;
                    } else if (value == 'cityGroupFlag') {
                        shop.cityId = shop.id;
                    } else if (value == 'brandGroupFlag') {
                        shop.brandId = shop.id;
                    }
                    // 打开新建积分规则的tab
                    register.addToTabs({
                            title: "售卡记录",
                            id: "buyCard" + shop.id,
                            template: "reportcenter/comprehensive/buyCard.html",
                            ctrl: 'reportcenter/comprehensive/buyCard',
                            // 删除require路径，改为动态配置
                            ctrlName: "buyCard",
                            // 对应编辑页controller的名字
                            ng_show: false,
                            type: 'single',
                            from: 1003
                        },
                        shop);
                };
                $scope.openCancelCard = function (shop) {

                    var postObj = $scope.requestObj.request;
                    for (var x in postObj) {
                        shop[x] = postObj[x];
                    }
                    shop.isOtherShop = 0;
                    try {
                        shop.date = $scope.requestObj.request.date;
                    } catch (e) {
                        shop.date = 0;
                    }

                    var index = document.getElementById("selectKPI").selectedIndex;
                    var value = document.getElementById("selectKPI").options[index].value;
                    if (value == 'shopGroupFlag') {
                        shop.shopId = shop.id;
                    } else if (value == 'cityGroupFlag') {
                        shop.cityId = shop.id;
                    } else if (value == 'brandGroupFlag') {
                        shop.brandId = shop.id;
                    }
                    // 打开新建积分规则的tab
                    register.addToTabs({
                            title: "退卡记录",
                            id: "cancelCard" + shop.id,
                            template: "reportcenter/comprehensive/cancelCard.html",
                            ctrl: 'reportcenter/comprehensive/cancelCard',
                            // 删除require路径，改为动态配置
                            ctrlName: "cancelCard",
                            // 对应编辑页controller的名字
                            ng_show: false,
                            type: 'single',
                            from: 1003
                        },
                        shop);
                };
                $scope.openChangeCardDate = function (shop) {

                    var postObj = $scope.requestObj.request;
                    for (var x in postObj) {
                        shop[x] = postObj[x];
                    }
                    shop.isOtherShop = 0;
                    try {
                        shop.date = $scope.requestObj.request.date;
                    } catch (e) {
                        shop.date = 0;
                    }

                    var index = document.getElementById("selectKPI").selectedIndex;
                    var value = document.getElementById("selectKPI").options[index].value;
                    if (value == 'shopGroupFlag') {
                        shop.shopId = shop.id;
                    } else if (value == 'cityGroupFlag') {
                        shop.cityId = shop.id;
                    } else if (value == 'brandGroupFlag') {
                        shop.brandId = shop.id;
                    }
                    // 打开新建积分规则的tab
                    register.addToTabs({
                            title: "修改有效期",
                            id: "changeCardDate" + shop.id,
                            template: "reportcenter/comprehensive/changeCardDate.html",
                            ctrl: 'reportcenter/comprehensive/changeCardDate',
                            // 删除require路径，改为动态配置
                            ctrlName: "changeCardDate",
                            // 对应编辑页controller的名字
                            ng_show: false,
                            type: 'single',
                            from: 1003
                        },
                        shop);
                };
                $scope.openChangeCardType = function (shop) {

                    var postObj = $scope.requestObj.request;
                    for (var x in postObj) {
                        shop[x] = postObj[x];
                    }
                    shop.isOtherShop = 0;
                    try {
                        shop.date = $scope.requestObj.request.date;
                    } catch (e) {
                        shop.date = 0;
                    }

                    var index = document.getElementById("selectKPI").selectedIndex;
                    var value = document.getElementById("selectKPI").options[index].value;
                    if (value == 'shopGroupFlag') {
                        shop.shopId = shop.id;
                    } else if (value == 'cityGroupFlag') {
                        shop.cityId = shop.id;
                    } else if (value == 'brandGroupFlag') {
                        shop.brandId = shop.id;
                    }
                    // 打开新建积分规则的tab
                    register.addToTabs({
                            title: "修改卡型",
                            id: "changeCardType" + shop.id,
                            template: "reportcenter/comprehensive/changeCardType.html",
                            ctrl: 'reportcenter/comprehensive/changeCardType',
                            // 删除require路径，改为动态配置
                            ctrlName: "changeCardType",
                            // 对应编辑页controller的名字
                            ng_show: false,
                            type: 'single',
                            from: 1003
                        },
                        shop);
                };

                $scope.showTab = function (param, name) {
                    if (param.shopFieldVo[name] == true) {
                        return "";
                    } else {
                        return "display:none";
                    }
                };

                $scope.showTab1 = function (params, x, y,name) {
                    if ( param[name]==true) {
                    	//alert('1');
                        return "";
                    } else {
                    	//alert('2');
                        return "display:none";
                    }
                };

                $scope.openUpdateCard = function (shop) {

                    var postObj = $scope.requestObj.request;
                    for (var x in postObj) {
                        shop[x] = postObj[x];
                    }
                    shop.isOtherShop = 0;
                    try {
                        shop.date = $scope.requestObj.request.date;
                    } catch (e) {
                        shop.date = 0;
                    }

                    var index = document.getElementById("selectKPI").selectedIndex;
                    var value = document.getElementById("selectKPI").options[index].value;
                    if (value == 'shopGroupFlag') {
                        shop.shopId = shop.id;
                    } else if (value == 'cityGroupFlag') {
                        shop.cityId = shop.id;
                    } else if (value == 'brandGroupFlag') {
                        shop.brandId = shop.id;
                    }
                    // 打开新建积分规则的tab
                    register.addToTabs({
                            title: "换卡",
                            id: "updateCard" + shop.id,
                            template: "reportcenter/comprehensive/updateCard.html",
                            ctrl: 'reportcenter/comprehensive/updateCard',
                            // 删除require路径，改为动态配置
                            ctrlName: "updateCard",
                            // 对应编辑页controller的名字
                            ng_show: false,
                            type: 'single',
                            from: 1003
                        },
                        shop);
                };

            }]);

    return 'comprehensive';
});