define(["angular","posService"],function(angular){return["$scope","ajaxService","getCookieService","$rootScope","posService","$document","$state",function($scope,ajaxService,getCookieService,$rootScope,posService,$document,$state){var sessionId=getCookieService.getCookie("CRMSESSIONID");$scope.ruledata={cutmenu:[{template:"",fatherCode:"",showName:"",shortcutMenu:"",img:"",orderby:"",hasChildTree:"",code:"",type:"",ctrl:"",childTree:[]}]},posService.listenerKey($rootScope.routeruledata);var ruledata=angular.copy($rootScope.routeruledata);$scope.ruledata=ruledata,$scope.ruledata.forEach(function(rule){var icon=rule.img.split(":")[0],color=rule.img.split(":")[1],clickColor=rule.img.split(":")[2];rule.icon=icon,rule.color=color,rule.clickColor=clickColor}),$scope.getColor=function(color){return{background:linear-gradient(color,blue)}},$scope.gotoPos=function(one){posService.gotoPos(one)},$scope.isPosHome=function(){return $state.current.name=="pos.selectedpos"||$state.current.name=="pos.default"?!1:!0},$scope.goselectedpos=function(){$rootScope.cardoperatetoeditusrmemberinfo=null,$rootScope.currentuserinfo=null,$state.go("pos.selectedpos")}}]});