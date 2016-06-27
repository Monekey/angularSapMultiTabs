/**
 * 会员首页
 * @version  v1.0
 * @createTime: 2016/5/5 0005
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/5 0005  LSZ   create
 *                2016/5/12 hyz edit
 *                2017/5/17 LSZ edit
 */
define(['angular','posService'],function (angular) {

    return ["$scope","ajaxService","getCookieService","$rootScope",'posService','$document','$state',function ($scope,ajaxService,getCookieService,$rootScope, posService,$document,$state) {
    	var sessionId = getCookieService.getCookie("CRMSESSIONID");
    	//权限数据模型
    	$scope.ruledata={
				"cutmenu":[
				           {"template": "",
				           "fatherCode": "",
				           "showName": "",
				           "shortcutMenu": "",
				           "img": "",
				           "orderby": "",
				           "hasChildTree": "",
				           "code": "",
				           "type": "",
				           "ctrl": "",
				           "childTree": []
				        	}
	                 	]
			};
		posService.listenerKey($rootScope.routeruledata);
    	var ruledata = angular.copy($rootScope.routeruledata);
    	$scope.ruledata=ruledata;
    	$scope.ruledata.forEach(function(rule){
			var icon = rule.img.split(":")[0];
			var color = rule.img.split(":")[1];
			var clickColor = rule.img.split(":")[2];
			rule.icon = icon;
			rule.color = color;
			rule.clickColor = clickColor;
		});

		$scope.getColor = function(color){
			//console.log("dgdg");
			return {background: linear-gradient(color, blue)};
		};

		$scope.gotoPos = function(one){
			posService.gotoPos(one);
		};

		$scope.isPosHome = function(){
			if($state.current.name == 'pos.selectedpos' || $state.current.name == 'pos.default'){
				return false;
			}
			return true;
		};
		$scope.goselectedpos = function()
		{
			//赋值   为编辑页面传值
			$rootScope.cardoperatetoeditusrmemberinfo = null;
			//定义全局当前user信息
			$rootScope.currentuserinfo = null;
			$state.go('pos.selectedpos');
		}
    }];
});