define(function( require ){
	var app = require( "app" );
	app.ngAMDCtrlRegister.controller( "scoreRuleDetail",["$scope","$rootScope","ajaxService","register",function( $scope,$rootScope,ajaxService,register ){
       
		var sessionId = $rootScope.sessionId;
		$scope.edit = register.getRoot('修改');
		//true 按金额 false 按操作
		$scope.typeShow=true;
		//生日倍数积分
		$scope.multipleShow=false;
		$scope.operationlist=[{"name":"消费","operationId":1,"type":0,"scoreRuleId":1}];
		$scope.initWeeks=[
			    			{"date":"星期一","state":false,"value":1},
			    			{"date":"星期二","state":false,"value":2},
			    			{"date":"星期三","state":false,"value":3},
			    			{"date":"星期四","state":false,"value":4},
			    			{"date":"星期五","state":false,"value":5},
			    			{"date":"星期六","state":false,"value":6},
			    			{"date":"星期日","state":false,"value":7}
			    		];
		
		$scope.weekDate=[];
		$scope.rule_data={
				"type":0,
				"terminal":[],
				"operation":[],
				"week":[],
				"scoreRule" : {
					"name": "",
					"howMoney": 1,
					"howScore": 1,
					"multiple": 1,
					"handling": 1,
					"isTerminal": 0,
					"isTime": 0,
					"isBirthday": 0,
					"isWeek": 0,
					"startTime": null,
					"endTime": null,
					"note": "",
					"isAble": 0
				}
		};
		
		//1不积分，2四舍五入，3去尾法.
		$scope.handling=function (i){
            if (i==1){
                return '不积分';
            }
            else if (i==2){
                return '四舍五入';
            }else if (i==3) {
            	return '去尾法';
            }
        };


		 var data = $rootScope.TabsData;
		$scope.rule_data.scoreRule =data;
		$scope.from = data.from;
		$scope.date_start = FormatDate(new Date(data.startTime));
		$scope.date_end = FormatDate(new Date(data.endTime));
		
		function FormatDate (strTime) {
    		var date = new Date(strTime);
			var year = date.getFullYear();
			var month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
			var day = date.getDate()<10?"0"+date.getDate():date.getDate();
   			 return year+"-"+month+"-"+day;
		}
        //按金额
        if(data.type==1){
        	//按操作
        	$scope.typeShow=false;
        }
        //生日倍数积分
        if(data.isBirthday==1){
        	$scope.multipleShow=true;
        }
        
        var searchkey={"sessionId":sessionId,"id" : data.id,"type":data.type}
        //获取操作内容
		ajaxService.AjaxPost( searchkey,"memberEquity/scoreRule/operationlist.do").then(
			function (result) {
				$scope.operationlist=result.operations;
				
		        //获取有效星期
				ajaxService.AjaxPost( {sessionId: $rootScope.sessionId,id:data.id}, "memberEquity/scoreRule/weeklist.do").then(
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
							$scope.weekDate.push(x);
						}
						//console.log($scope.weekDate);
	                }
				);
            }
		);
        
      //获取操作内容
		ajaxService.AjaxPost( searchkey,"memberEquity/scoreRule/relTerminals.do").then(
			function (result) {
				$scope.relTerminals=result.relTerminals;
            }
		);

		/* 返回操作 */
		$scope.cancel = function () {
			register.switchTab({id: $scope.from});
		};


		/**
		 * 跳转到修改页面
		 * @param
		 */
		$scope.gotoEdit = function(ruledata){
			var editTab ={
				title:"修改积分规则",
				ctrlName:"scoreRuleEdit",
				ctrl:"memberequity/scorerule/scoreRuleEdit",
				template:"memberequity/scorerule/scoreRuleEdit.html",
				id: "scoreEdit"+ruledata.scoreRule.id,
				from: $scope.from,
				type: 'single',
				ng_show:false};
			register.addToTabs(editTab, ruledata.scoreRule);
		};



		//获取星期
//		ajaxService.AjaxPost( {},"comm/week/initWeeklist.do").then(
//			function (result) {
//				$scope.initWeeks=result;
//				//console.log($scope.initWeeks);
//            }
//		);
	}]);
});