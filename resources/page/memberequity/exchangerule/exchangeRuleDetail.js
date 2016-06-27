define(function (require) {

	var ngAMD = require("ngAMD");
	ngAMD.controller("exchangeRuleDetail", ["$scope", "$rootScope", "ajaxService", "getCookieService", 'register', function ($scope, $rootScope, ajaxService, getCookieService, register) {

		$scope.weekDate=[];
		$scope.edit = register.getRoot('修改');
		//电子兑换项目（临时写死）
		$scope.giftData = [
			{ "name": "30元兑换券", "id": 1, "type": 0 },
			{ "name": "50元兑换券", "id": 2, "type": 0 },
			{ "name": "100元兑换券", "id": 3, "type": 0 }
		];

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
			"sessionId": getCookieService.getCookie("CRMSESSIONID"),
			"terminal": [],
			"week": [],
			"exchangeRule": {
				"name": "",
				"giftType": 0,
				"giftId": "1",
				"giftName": "",
				"exchangeOnLine": 0,
				"exchangeOffLine": 0,
				"limitScore": null,
				"castScore": null,
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
		data.giftId = data.giftId + '';
		$scope.rule_data.exchangeRule = data;
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
        //获取有效星期
		ajaxService.AjaxPost({ "sessionId": $rootScope.sessionId, "id": data.id }, "memberEquity/exchangeRule/weeklist.do").then(
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
		ajaxService.AjaxPost($scope.rule_data, "memberEquity/exchangeRule/relTerminals.do").then(
			function (result) {
				$scope.relTerminals = result.relTerminals;
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
				title: "修改兑换规则",
				ctrlName: "exchangeRuleEdit",
				ctrl: 'memberequity/exchangerule/exchangeRuleEdit',
				template: "memberequity/exchangerule/exchangeRuleEdit.html",
				id: "exchangeRuleEdit" + $scope.rule_data.exchangeRule.id,
				from: $scope.from,
				type: 'single',
				ng_show: false
			};
			register.addToTabs(editTab, $scope.rule_data.exchangeRule);
		};


	}]);
});
