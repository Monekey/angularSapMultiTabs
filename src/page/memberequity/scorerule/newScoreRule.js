/**
 * 新建积分规则tabs
 * author：张海
 */
define(function( require ){
	var app = require( "app" );
	// var score_rule_css = require("css!score_rule_css");
    // var card_type_css = require("css!card_type_css");
	
	app.ngAMDCtrlRegister.controller( "newScoreRule",["$scope","$rootScope","ajaxService","getCookieService",'register','shopSelectorService','modalService',function( $scope,$rootScope,ajaxService,getCookieService,register,shopSelectorService,modalService ){


		$scope.from = $rootScope.TabsData.from;
		//定义panel开启关闭标记
		$scope.status = {
			"terminal": false,
			"date": false

		};
		//操作项目（临时写死）
		$scope.operationData=[
				{"name":"消费","state":true,"id":1,"type":0},
				{"name":"充值","state":false,"id":2,"type":0},
				{"name":"售卡","state":false,"id":3,"type":1},
				{"name":"微信分享","state":false,"id":4,"type":1},
				{"name":"菜品评价","state":false,"id":5,"type":1},
				{"name":"好友邀请","state":false,"id":6,"type":1},
				{"name":"微信签到","state":false,"id":7,"type":1}
		];
		//新建积分规则默认数据
		$scope.rule_data = {
				"sessionId":$rootScope.sessionId,
				"terminal":[],
				"relTerminals":[],
				"operation":[],
				"week":[],
				"scoreRule" : {
					"name": "",
					"howMoney": 1,
					"howScore": 1,
					"multiple": 2,
					"handling": "1",
					"isTerminal": 0,
					"isDate": 0,
					"isTime": 0,
					"isBirthday": 0,
					"isWeek": 0,
					"startTime": "",
					"endTime": "",
					"note": "",
					"type":0,
					"isAble": 1
				}
			};
		
		$scope.choseOperations=[];
		
		$scope.showChar="消费";
		
		$scope.operation=function(i,type){
			//按金额
				angular.forEach($scope.operationData, function (j) {
					if(j.type==type){
						j.state=false;
					}
				});
				i.state=!i.state;
				$scope.showChar=i.name;
		}
		
		$scope.getOperations=function(){
			
			var type=$scope.rule_data.scoreRule.type;
			var choseOperations=[];
			angular.forEach($scope.operationData, function (j) {
					if(j.type==type && j.state==true){
						choseOperations.push(j.id)
					}
			});
			$scope.rule_data.operation=choseOperations;
		} 
		
		$scope.getWeeks=function(){
			
			var t=$scope.rule_data.scoreRule.type;
			var choseWeeks=[];
			angular.forEach($scope.date_seven, function (j) {
					if(j.state==true){
						choseWeeks.push(j.value)
					}
			});
			$scope.rule_data.week=choseWeeks;
		} 

		$scope.date_seven=[
			{"date":"星期一","state":false,"value":1},
			{"date":"星期二","state":false,"value":2},
			{"date":"星期三","state":false,"value":3},
			{"date":"星期四","state":false,"value":4},
			{"date":"星期五","state":false,"value":5},
			{"date":"星期六","state":false,"value":6},
			{"date":"星期日","state":false,"value":7}
		];
		
		/**
		 * 有效星期选择
		 */
		$scope.date_seven_click=function (i){
			i.state=!i.state;
			//具体生效星期和开关的校验
			if(i.state==false&&$scope.rule_data.scoreRule.isWeek==1){
				var tempFlg=false;
				angular.forEach($scope.date_seven, function (j) {
					if(j.state==true){
						tempFlg=true;

					}
				});
				if(!tempFlg){
					i.state=!i.state;
					modalService.info({title:'提示', content:'开启有效星期，具体生效星期X至少有一个!', size:'sm', type: 'confirm'});
				}
			}
			
			
			
		}
		/**
		 * 有效星期开关change
		 */
		$scope.isWeekChange = function(){
			if($scope.rule_data.scoreRule.isWeek==1){
				var tempFlg=false;
				angular.forEach($scope.date_seven, function (j) {
					if(j.state==true){
						tempFlg=true;
		
					}
					console.log(j.state);
					
				});
				if(!tempFlg){
					angular.forEach($scope.date_seven, function (j) {
						j.state=true;
					});
				}
				
			};
		};

		/**
		 * 开启终端选择模态框
		 */
		$scope.showModal = function() {
			//将当前对象转换成对应模态框的对象的字段
			//showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
			var showFlg = 1;
			//模态框需要传入两个值，一个是最初始的数据库加载的选中对象数组，创建的时候初始数组为空
			var initItems = [];
			//模态框需要传入两个值，一个是当前页面显示的对象数组
			var currentItems = $scope.rule_data.relTerminals;
			var paramSet = {
				"serviceType": "terminal", //terminal
				"terminal":{
					"ajaxUrl":"baseData/terminalManager/treeList.do"
				},
				"initItems":initItems,
				"currentItems":currentItems,
				"showFlg": 1,
				"title":"选择终端"
			};
			shopSelectorService.openShopModal(paramSet).then(function(result){
				//result中含有全部已选元素数组，和变化的元素数组
				$scope.rule_data.relTerminals = convertModalShop(result.allSelectedItems);
				$scope.changeItems = result.changeItems;
			});

		};
		/**
		 * 当前页面元素与模态框元素字段同步
		 * @param shops
		 * @returns {Array}
		 */
		function convertModalShop(shops){
			var newShops = [];
			for(var i=0;i<shops.length;i++){
				var shop = {};
				shop.code = shops[i].code;
				shop.showName = shops[i].showName;
				shop.bindFlg = shops[i].bindFlg;
				shop.shopName = shops[i].shopName;
				newShops.push(shop);
			}
			return newShops;
		}

		/**
		 * 验证开启有效期限制，是否设置限制条件
		 * @returns {boolean}
		 */
		$scope.checkDateLimit = function(){
			if ($scope.rule_data.scoreRule.isDate == 1 && $scope.rule_data.scoreRule.isTime == 0&&$scope.rule_data.scoreRule.isWeek == 0) {
				return false;
			}
			return true;
		};
		$scope.confirmIn = function(){
			$scope.getOperations();
			if($scope.rule_data.scoreRule.startTime===""){
				var startDate = new Date();
				startDate.setHours(0);
				startDate.setMinutes(0);
				startDate.setSeconds(0);
				startDate.setMilliseconds(000);
				$scope.rule_data.scoreRule.startTime=startDate.getTime();
			}

			if($scope.rule_data.scoreRule.endTime===""){
				var endDate = new Date();
				endDate.setHours(23);
				endDate.setMinutes(59);
				endDate.setSeconds(59);
				endDate.setMilliseconds(000);
				$scope.rule_data.scoreRule.endTime=endDate.getTime();
			}
			if($scope.rule_data.operation.length==0){
				modalService.info({title:'提示', content:'请至少勾选一个积分操作', size:'sm', type: 'confirm'});
				return false;
			}
			$scope.getWeeks();
			if (!$scope.checkDateLimit()){
				modalService.info({title:'提示', content:'您已开启有效期限制，请至少选中和设置一个限制条件!', size:'sm', type: 'confirm'});
				return;
			}
			if($scope.rule_data.scoreRule.isTime == 1&& $scope.rule_data.scoreRule.startTime==""&&$scope.rule_data.scoreRule.endTime==""){
				modalService.info({title:'提示', content:'有效日期已经开启，请填写起止时间！', size:'sm', type: 'confirm'});
				return;
			}
			$scope.scoreRlueEdit=$scope.rule_data;
			if($scope.changeItems && $scope.changeItems.length>0){
	                $scope.scoreRlueEdit.relTerminals = $scope.changeItems;
	        }
			//console.log($scope.rule_data);
			$scope.disabledBtn = true;
	        //获取操作内容
			ajaxService.AjaxPost( $scope.scoreRlueEdit,"memberEquity/scoreRule/create.do").then(
				function (result) {
					if(result&&result.status===1){
	                    modalService.info({title:'提示', content:'新建成功!', size:'sm', type: 'ok'}).then(function(obj){
	                        if(obj.status == 'ok'){
	                            $rootScope.TabsData.callback();
	                            register.switchTab({id: $scope.from});
	                        }
	                    });
                 }
					

                }
			);
			$scope.disabledBtn = false;
		};

		$scope.cancelIn = function(){
			register.switchTab({id: $scope.from});
		};
		
		$scope.openPanel = function(type){
			if(type==="terminal"){
				$scope.status.terminal = true;
			}
			if(type==="date"){
				$scope.status.date = true;
			}
			var event = window.event||event;
			if( document.all){
				event.cancelBubble = true;
			}else{
				event.stopPropagation();
			}
		};
		$scope.stopPropagation = function($event){
			$event.stopPropagation();
		}
	
		
	}]);
});