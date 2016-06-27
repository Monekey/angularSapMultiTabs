define(function (require) {

	var ngAMD = require("ngAMD");
	ngAMD.controller("savingRuleDetail", ["$scope", "$rootScope", "ajaxService", "getCookieService", 'register', function ($scope, $rootScope, ajaxService, getCookieService, register) {
		$scope.edit = register.getRoot('修改');
		$scope.weekDate = [];
		$scope.initWeeks = [
			{ "date": "星期一", "state": false, "value": 1 },
			{ "date": "星期二", "state": false, "value": 2 },
			{ "date": "星期三", "state": false, "value": 3 },
			{ "date": "星期四", "state": false, "value": 4 },
			{ "date": "星期五", "state": false, "value": 5 },
			{ "date": "星期六", "state": false, "value": 6 },
			{ "date": "星期日", "state": false, "value": 7 }
		    		];
		//初始数据
		$scope.rule_data = {
			"id": $rootScope.TabsData.id,
			"sessionId": $rootScope.sessionId,
			"terminal": [],
			"relTerminals": [],
			"week": [],
			"givingInfo": [{ "limitMoney": null, "givingType": 0, "givingMoney": null, "givingProportion": null }, { "limitMoney": null, "givingType": 1, "givingMoney": null, "givingProportion": null }],
			"savingRule": {
				"name": "",
				"savingType": 0,
				"givingType": 0,
				"isTerminal": 0,
				"isTime": 0,
				"isWeek": 0,
				"startTime": null,
				"endTime": null,
				"note": "",
				"isAble": 1
			}
		};

		var data = $rootScope.TabsData;
		console.log(data);
		$scope.rule_data.savingRule = data;
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
        //获取详细内容
		ajaxService.AjaxPost({ "sessionId": $rootScope.sessionId, "id": data.id, "type": data.givingType }, "memberEquity/savingRule/detaillist.do").then(
			function (result) {
				$scope.rule_data.givingInfo = result.savingRuleDetails;
			}
		);

        //获取有效星期
		ajaxService.AjaxPost({ "sessionId": $rootScope.sessionId, "id": data.id }, "memberEquity/savingRule/weeklist.do").then(
			function (result) {
				for (var i in $scope.initWeeks) {
					var x = {};
					x["date"] = $scope.initWeeks[i].date;
					x["value"] = $scope.initWeeks[i].value;
					x["state"] = false;
					for (var j = 0; j < result.week.length; j++) {
						if (result.week[j] == $scope.initWeeks[i].value) {
							x["state"] = true;
							break;
						}
					}
					$scope.weekDate.push(x);
				}
			}
		);
		//获取终端列表
		ajaxService.AjaxPost($scope.rule_data, "memberEquity/savingRule/relTerminals.do").then(
			function (result) {
				$scope.rule_data.relTerminals = result.relTerminals;
            }
		);

		/* 返回操作 */
		$scope.cancel = function () {
			register.switchTab({ id: $scope.from });
		};


		/**
		 * 跳转到修改页面
		 * @param
		 */
		$scope.gotoEdit = function () {
			var editTab = {
				title: "修改储值规则",
				ctrlName: "savingRuleEdit",
				ctrl: "memberequity/savingrule/savingRuleEdit",
				template: "memberequity/savingrule/savingRuleEdit.html",
				id: "savingEdit" + $scope.rule_data.savingRule.id,
				from: $scope.from,
				type: 'single',
				ng_show: false
			};
			register.addToTabs(editTab, $scope.rule_data.savingRule);
		};



	}]);
});
