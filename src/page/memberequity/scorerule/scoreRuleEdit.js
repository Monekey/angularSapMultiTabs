define(['app','shopSelector'],function( app, shopSelector ){

		app.ngAMDCtrlRegister.controller( "scoreRuleEdit",["$scope","$rootScope","ajaxService",'register','shopSelectorService','modalService',function( $scope,$rootScope,ajaxService, register,shopSelectorService,modalService ){

			var sessionId = $rootScope.sessionId;
			$scope.isGetId = false;
			$scope.date_seven=[];
			$scope.showChar="消费";
			//操作项目（临时写死）
			$scope.operationData=[
				{"name":"消费","state":false,"id":1,"type":0},
				{"name":"充值","state":false,"id":2,"type":0},
				{"name":"售卡","state":false,"id":3,"type":1},
				{"name":"微信分享","state":false,"id":4,"type":1},
				{"name":"菜品评价","state":false,"id":5,"type":1},
				{"name":"好友邀请","state":false,"id":6,"type":1},
				{"name":"微信签到","state":false,"id":7,"type":1}
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


			$scope.choice_div_state=true;
			//console.log($rootScope.TabsData);
			//初始数据
			$scope.rule_data = {
				"id":$rootScope.TabsData.id,
				"sessionId":sessionId,
				"type":0,
				"terminal":[],
				"relTerminals":[],
				"operation":[],
				"week":[],
				"scoreRule" : {
					"id":$rootScope.TabsData.id,
					"name": "",
					"howMoney": 1,
					"howScore": 1,
					"multiple": 1,
					"handling": 1,
					"isTerminal": 0,
					"isDate": 0,
					"isTime": 0,
					"isBirthday": 0,
					"isWeek": 0,
					"startTime": "",
					"endTime": "",
					"note": "",
					"isAble": 0
				}
			};
			var initItems = [];

			var data = angular.copy($rootScope.TabsData);
			$scope.rule_data.scoreRule =data;
			$scope.from = data.from;
			data.handling = data.handling + '';
			$scope.rule_data.scoreRule.type=data.type;

			$scope.rule_data.scoreRule.startTime = FormatDate(new Date(data.startTime));
			$scope.rule_data.scoreRule.endTime = FormatDate(new Date(data.endTime));

			function FormatDate (strTime) {
				var date = new Date(strTime);
				var year = date.getFullYear();
				var month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
				var day = date.getDate()<10?"0"+date.getDate():date.getDate();
				return year+"-"+month+"-"+day;
			}

			//定义panel开启关闭标记
			$scope.status={
				terminal: $scope.rule_data.scoreRule&&$scope.rule_data.scoreRule.isTerminal===1?true:false,
				date:$scope.rule_data.scoreRule&&$scope.rule_data.scoreRule.isDate===1?true:false
			};
			/**
			 * 定义开启panel的方法，防止事件冒泡
			 * @param type
			 */
			$scope.openPanel = function(type){
				if(type==="terminal"&&$scope.rule_data.scoreRule.isTerminal===1){
					$scope.status.terminal = true;
				}
				if(type==="date"&&$scope.rule_data.scoreRule.isDate===1){
					$scope.status.date = true;
				}
				var event = window.event||event;
				if( document.all){
					event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}
			};


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
			}


			if(data.type==1){
				//按操作
				$scope.typeShow=false;
				$scope.operationData[0].state=true;
			}

			var searchkey={"sessionId":sessionId,"id" : data.id,"type":data.type}
			//获取操作内容
			ajaxService.AjaxPost( searchkey,"memberEquity/scoreRule/operationlist.do").then(
				function (result) {
					for (var i in $scope.operationData) {
						for(var j=0;j<result.operations.length;j++)
						{
							if(result.operations[j].operationId==$scope.operationData[i].id){
								$scope.operationData[i].state=true;
								if(result.operations[j].type==0){
									$scope.showChar=result.operations[j].name;
								}
								break;
							}
						}
					}
				}
			);

			//获取终端内容
			ajaxService.AjaxPost( {sessionId: $rootScope.sessionId,id:data.id},"memberEquity/scoreRule/relTerminals.do").then(
				function (result) {
					$scope.rule_data.relTerminals=result.relTerminals;
					initItems =angular.copy($scope.rule_data.relTerminals);
				}
			);
			//获取有效星期
			ajaxService.AjaxPost( {sessionId: $rootScope.sessionId,id:data.id},"memberEquity/scoreRule/weeklist.do").then(
				function (result) {
					for (var i in $scope.initWeeks) {
						var x={};
						x["date"]=$scope.initWeeks[i].date;
						x["value"]=$scope.initWeeks[i].value;
						x["state"]=false;
						for(var j=0;j<result.data.length;j++)
						{

							if(result.data[j]==$scope.initWeeks[i].value){
								x["state"]=true;
								break;
							}
						}
						$scope.date_seven.push(x);
					}
				}
			);

			$scope.getWeeks=function(){
				var choseWeeks=[];
				angular.forEach($scope.date_seven, function (j) {
					if(j.state==true){
						choseWeeks.push(j.value)
					}
				});
				$scope.rule_data.week=choseWeeks;
			}

			$scope.getOperations=function(){
				var t=$scope.rule_data.scoreRule.type;
				var choseOperations=[];
				angular.forEach($scope.operationData, function (j) {
					if(j.type==t && j.state==true){
						choseOperations.push(j.id)
					}
				});
				
				$scope.rule_data.operation=choseOperations;
			}
			/**
			 * 开启终端选择模态框
			 */
			$scope.showModal = function() {
				//将当前对象转换成对应模态框的对象的字段
				//showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
				var showFlg = 1;
				//模态框需要传入两个值，一个是最初始的数据库加载的选中对象数组，创建的时候初始数组为空
				//var initItems = [];
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
					$scope.rule_data.relTerminals = convertModal(result.allSelectedItems);
					$scope.changeItems = result.changeItems;
				});

			};
			/**
			 * 当前页面元素与模态框元素字段同步
			 * @param 选中元素
			 * @returns {Array}
			 */
			function convertModal(selectedItems){
				var newItems = [];
				for(var i=0;i<selectedItems.length;i++){
					var items = {};
					items.code = selectedItems[i].code;
					items.showName = selectedItems[i].showName;
					items.bindFlg = selectedItems[i].bindFlg;
					items.shopName = selectedItems[i].shopName;
					newItems.push(items);
				}
				return newItems;
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
				var startDate = new Date();
				var endDate = new Date();
				if($scope.rule_data.scoreRule.startTime!==""){
					startDate = new Date($scope.rule_data.scoreRule.startTime);
				}
				startDate.setHours(0);
				startDate.setMinutes(0);
				startDate.setSeconds(0);
				startDate.setMilliseconds(000);
				$scope.rule_data.scoreRule.startTime=startDate.getTime();

				if($scope.rule_data.scoreRule.endTime!==""){
					endDate = new Date($scope.rule_data.scoreRule.endTime);
				}
				endDate.setHours(23);
				endDate.setMinutes(59);
				endDate.setSeconds(59);
				endDate.setMilliseconds(000);
				$scope.rule_data.scoreRule.endTime=endDate.getTime();
				$scope.scoreRlueEdit= angular.copy($scope.rule_data);

				if($scope.changeItems && $scope.changeItems.length>0){
					$scope.scoreRlueEdit.relTerminals = $scope.changeItems;
				}else{
					$scope.scoreRlueEdit.relTerminals=[];
				}
				//提交修改内容
				ajaxService.AjaxPost( $scope.scoreRlueEdit,"memberEquity/scoreRule/update.do").then(
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
			$scope.stopPropagation = function($event){
				$event.stopPropagation();
			}
		}]);

});
