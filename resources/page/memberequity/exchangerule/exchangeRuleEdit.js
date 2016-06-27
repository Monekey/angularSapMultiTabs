define(function( require ){

	var ngAMD = require( "ngAMD" );
	var shopselector = require("shopSelector");
	ngAMD.controller( "exchangeRuleEdit",["$scope","$rootScope","ajaxService","getCookieService",'register','shopSelectorService','modalService',function( $scope,$rootScope,ajaxService,getCookieService, register,shopSelectorService,modalService ){


		//定义panel开启关闭标记
		$scope.status = {
			"terminal": false,
			"date": false

		};
		/**
		 * 定义开启panel的方法，防止事件冒泡
		 * @param type
		 */
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
		$scope.date_seven=[];
		//电子兑换项目（临时写死）
		$scope.giftData=[
				{"name":"30元兑换券","id":1,"type":0},
				{"name":"50元兑换券","id":2,"type":0},
				{"name":"100元兑换券","id":3,"type":0}
		];
		
		$scope.initWeeks=[
			    			{"date":"星期一","state":false,"value":1},
			    			{"date":"星期二","state":false,"value":2},
			    			{"date":"星期三","state":false,"value":3},
			    			{"date":"星期四","state":false,"value":4},
			    			{"date":"星期五","state":false,"value":5},
			    			{"date":"星期六","state":false,"value":6},
			    			{"date":"星期日","state":false,"value":7}
			    		];



		//初始数据
		$scope.rule_data = {
				"id":$rootScope.TabsData.id,
				"sessionId":getCookieService.getCookie("CRMSESSIONID"),
				"terminal":[],
				"relTerminals":[],
				"week":[],
				"exchangeRule" : {
					"name": "",
					"giftType": 0,
					"giftId": "1",
					"giftName": "",
					"exchangeOnLine": 0,
					"exchangeOffLine": 0,
					"limitScore": null,
					"castScore": 1,
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

		var data = angular.copy($rootScope.TabsData);
		data.giftId = data.giftId + '';
		$scope.rule_data.exchangeRule =data;
		$scope.from = data.from;
		$scope.rule_data.exchangeRule.startTime = FormatDate(new Date(data.startTime));
		$scope.rule_data.exchangeRule.endTime = FormatDate(new Date(data.endTime));

		function FormatDate (strTime) {
			var date = new Date(strTime);
			var year = date.getFullYear();
			var month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
			var day = date.getDate()<10?"0"+date.getDate():date.getDate();
			return year+"-"+month+"-"+day;
		}
		
		if(data.giftType == 0){
			$scope.rule_data.exchangeRule.giftName=null;
		}

		//定义panel开启关闭标记
		$scope.status={
			terminal: $scope.rule_data.exchangeRule&&$scope.rule_data.exchangeRule.isTerminal===1?true:false,
			date:$scope.rule_data.exchangeRule&&$scope.rule_data.exchangeRule.isDate===1?true:false
		};
		/**
		 * 定义开启panel的方法，防止事件冒泡
		 * @param type
		 */
		$scope.openPanel = function(type){
			if(type==="terminal"&&$scope.rule_data.exchangeRule.isTerminal===1){
				$scope.status.terminal = true;
			}
			if(type==="date"&&$scope.rule_data.exchangeRule.isDate===1){
				$scope.status.date = true;
			}
			var event = window.event||event;
			if( document.all){
				event.cancelBubble = true;
			}else{
				event.stopPropagation();
			}
		};
        //获取有效星期
		ajaxService.AjaxPost( {"sessionId":$rootScope.sessionId,"id":data.id},"memberEquity/exchangeRule/weeklist.do").then(
			function (result) {
				for (var i in $scope.initWeeks) {
					var x={};
					x["date"]=$scope.initWeeks[i].date;
					x["value"]=$scope.initWeeks[i].value;
					x["state"]=false;
					for(var j=0;j<result.week.length;j++)
					{
						if(result.week[j]==$scope.initWeeks[i].value){
							x["state"]=true;
							break;
						}
					}
					$scope.date_seven.push(x);
				}
			}
		);

		/**
		 * 有效星期选择
		 */
		$scope.date_seven_click=function (i){
			i.state=!i.state;
			//具体生效星期和开关的校验
			if(i.state==false&&$scope.rule_data.exchangeRule.isWeek==1){
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
			if($scope.rule_data.exchangeRule.isWeek==1){
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
		}
		$scope.getWeeks=function(){
			var choseWeeks=[];
			angular.forEach($scope.date_seven, function (j) {
					if(j.state==true){
						choseWeeks.push(j.value)
					}
			});
			$scope.rule_data.week=choseWeeks;
		} 
		$scope.getGiftName=function(id){	
			for (var i=0;i<$scope.giftData.length;i++){
				if($scope.giftData[i].id==id){
					return $scope.giftData[i].name;
				}
			}
		}
		/**
		 * 验证开启有效期限制，是否设置限制条件
		 * @returns {boolean}
         */
		$scope.checkDateLimit = function(){
			if ($scope.rule_data.exchangeRule.isDate == 1 && $scope.rule_data.exchangeRule.isTime == 0&&$scope.rule_data.exchangeRule.isWeek == 0) {
				return false;
			}
			return true;
		};
		
		
		$scope.confirmIn = function(){
			$scope.getWeeks();
			if ($scope.rule_data.exchangeRule.giftType==0){
				$scope.rule_data.exchangeRule.giftName=$scope.getGiftName(parseInt($scope.rule_data.exchangeRule.giftId));
			}
			if (!$scope.checkDateLimit()){
				modalService.info({title:'提示', content:'您已开启有效期限制，请至少选中和设置一个限制条件!', size:'sm', type: 'confirm'});
				return;
			}
			if($scope.rule_data.exchangeRule.isTime === 1&& $scope.rule_data.exchangeRule.startTime===""&&$scope.rule_data.exchangeRule.endTime===""){
				modalService.info({title:'提示', content:'有效日期已经开启，请填写起止时间！', size:'sm', type: 'confirm'});
				return;
			}
			var startDate = new Date();
			var endDate = new Date();
			if($scope.rule_data.exchangeRule.startTime!==""){
				startDate = new Date($scope.rule_data.exchangeRule.startTime);
			}
			startDate.setHours(0);
			startDate.setMinutes(0);
			startDate.setSeconds(0);
			startDate.setMilliseconds(000);
			$scope.rule_data.exchangeRule.startTime=startDate.getTime();

			if($scope.rule_data.exchangeRule.endTime!==""){
				endDate = new Date($scope.rule_data.exchangeRule.endTime);
			}
			endDate.setHours(23);
			endDate.setMinutes(59);
			endDate.setSeconds(59);
			endDate.setMilliseconds(000);
			$scope.rule_data.exchangeRule.endTime=endDate.getTime();
			$scope.rlueEdit= angular.copy($scope.rule_data);
			if($scope.changeItems && $scope.changeItems.length>0){
	                $scope.rlueEdit.relTerminals = $scope.changeItems;
	        }else{
	        	$scope.rlueEdit.relTerminals=[];
	        }
	        //提交修改内容
			ajaxService.AjaxPost( $scope.rlueEdit,"memberEquity/exchangeRule/update.do").then(
				function (result) {
					
					 if(result&&result.status===1){
		                    modalService.info({title:'提示', content:'修改成功!', size:'sm', type: 'ok'}).then(function(obj){
		                        if(obj.status == 'ok'){
		                            $rootScope.TabsData.callback();
		                            register.switchTab({id: $scope.from});
		                        }
		                    });
	                	 }
				
                }
			);
		};

		$scope.cancelIn = function(){
			register.switchTab({id: $scope.from});
		}
		//模态框需要传入两个值，一个是最初始的数据库加载的选中对象数组，创建的时候初始数组为空
		var initItems = [];
		//获取终端列表
		ajaxService.AjaxPost({"sessionId":$rootScope.sessionId,"id":data.id},"memberEquity/exchangeRule/relTerminals.do").then(
			function (result) {
				$scope.rule_data.relTerminals=result.relTerminals;
				initItems = angular.copy(result.relTerminals);
            }
		);
		
		
		
		 /**
		 * 开启终端选择模态框
		 */
		$scope.showModal = function() {
			//将当前对象转换成对应模态框的对象的字段
			//showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
			var showFlg = 1;
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
		$scope.stopPropagation = function($event){
			$event.stopPropagation();
		}
		
	}]);
});
