/**
 * 新建储值规则tabs
 * author：程永飞
 */
define(function( require ){
	var app = require( "app" );
	var angular = require("angular");
	var shopselector = require("shopSelector");
	var saving_rule_css = require("css!saving_rule_css");
	app.ngAMDCtrlRegister.controller( "newSavingRule",["$scope","$rootScope","ajaxService","getCookieService",'register','shopSelectorService','modalService',function( $scope,$rootScope,ajaxService,getCookieService,register,shopSelectorService,modalService ){

		$scope.from = $rootScope.TabsData.from;
		//console.log($scope.from);
		//新建储值规则默认数据
		$scope.rule_data = {
				"sessionId":$rootScope.sessionId,
				"terminal":[],
				"relTerminals":[],
				"week":[],
				"givingInfo":[{"limitMoney":null,"givingType":0,"givingMoney":null,"givingProportion":null},{"limitMoney":null,"givingType":1,"givingMoney":null,"givingProportion":null}],
				"savingRule" : {
					"name": "",
					"savingType": 0,
					"givingType": 0,
					"isTerminal": 0,
					"isDate": 0,
					"isTime": 0,
					"isWeek": 0,
					"startTime": "",
					"endTime": "",
					"note": "",
					"isAble": 1
				}
			};
		
		$scope.moneyTypeCount=1;
		$scope.poportionTypeCount=1;
		$scope.add=function(type){
			if(type==0){
				$scope.moneyTypeCount++;
			}else if(type==1){
				$scope.poportionTypeCount++;
			}
			var addObj={"money":null,"givingType":type,"givingMoney":null,"givingProportion":null};
			$scope.rule_data.givingInfo.push(addObj);
		};


		$scope.reduce=function(index,type)
		{
			if(type==0){
				$scope.moneyTypeCount--;
			}else if(type==1){
				$scope.poportionTypeCount--;
			}
			$scope.rule_data.givingInfo.splice(index, 1);
		};

		$scope.getWeeks=function(){
			
			var t=$scope.rule_data.type;
			var choseWeeks=[];
			angular.forEach($scope.date_seven, function (j) {
					if(j.state==true){
						choseWeeks.push(j.value)
					}
			});
			this.rule_data.week=choseWeeks;
		};
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
			if(i.state==false&&$scope.rule_data.savingRule.isWeek==1){
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
			if($scope.rule_data.savingRule.isWeek==1){
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
				
			}
		};

		$scope.confirmDetail=function (){
			var type=$scope.rule_data.savingRule.givingType;
			var choseDetail=[];
			angular.forEach($scope.rule_data.givingInfo, function (j) {
					if(j.givingType==type){
						choseDetail.push(j)
					}
			});
			$scope.rule_data.givingInfo=choseDetail;
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
			var selectorParam = {
					"serviceType": "terminal", //terminal
					"terminal":{
						"ajaxUrl":"baseData/terminalManager/treeList.do"
					},
					"initItems":initItems,
					"currentItems":currentItems,
					"showFlg": 1,
					"title":"选择终端"
				};
			shopSelectorService.openShopModal(selectorParam).then(function(result){
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
			if ($scope.rule_data.savingRule.isDate == 1 && $scope.rule_data.savingRule.isTime == 0&&$scope.rule_data.savingRule.isWeek == 0) {
				return false;
			}
			return true;
		};
		/**
		 * 校验规则内容是否含有重复项
		 * @returns {boolean}
         */
		$scope.checkGivingHasRepeat = function(){
			var givingInfo = $scope.rule_data.givingInfo;
			var fullMoneys = [];
			angular.forEach(givingInfo,function(j){
				fullMoneys.push(j.limitMoney);
			});
			var nary=fullMoneys.sort();
			for(var i=0;i<fullMoneys.length;i++){
				if (nary[i]==nary[i+1]){
					return true;
				}
			}
			return false;
		};
		$scope.confirmIn = function(){
			$scope.getWeeks();
			$scope.confirmDetail();
			if($scope.rule_data.savingRule.startTime===""){
				var startDate = new Date();
				startDate.setHours(0);
				startDate.setMinutes(0);
				startDate.setSeconds(0);
				startDate.setMilliseconds(000);
				$scope.rule_data.savingRule.startTime=startDate.getTime();
			}

			if($scope.rule_data.savingRule.endTime===""){
				var endDate = new Date();
				endDate.setHours(23);
				endDate.setMinutes(59);
				endDate.setSeconds(59);
				endDate.setMilliseconds(000);
				$scope.rule_data.savingRule.endTime=endDate.getTime();
			}
			if($scope.checkGivingHasRepeat()){
				modalService.info({title:'提示', content:'赠送规则内容里，充值金额列不应有重复项，请修改！', size:'sm', type: 'confirm'});
				return;
			}
			if (!$scope.checkDateLimit()){
				modalService.info({title:'提示', content:'您已开启有效期限制，请至少选中和设置一个限制条件!', size:'sm', type: 'confirm'});
				return;
			}
			if($scope.rule_data.savingRule.isTime == 1&& $scope.rule_data.savingRule.startTime==""&&$scope.rule_data.savingRule.endTime==""){
				modalService.info({title:'提示', content:'有效日期已经开启，请填写起止时间！', size:'sm', type: 'confirm'});
				return;
			}
			$scope.disabledBtn = true;
	        //获取操作内容
			ajaxService.AjaxPost( $scope.rule_data,"memberEquity/savingRule/create.do").then(
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
		}
		$scope.stopPropagation = function($event){
			$event.stopPropagation();
		}
		
	}]);
});