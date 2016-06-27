/**
 * 交易记录详情页     
 * @version  		v1.0      
 * @createTime: 	2016-04-20        
 * @createAuthor 	Hyz             
 * @updateHistory  
 *                	2016-04-20  Hyz  交易记录详情页
 * @note   
 * 					  
 */
define(function (require) {
	//引入样式
    var ngAMD = require("ngAMD");
    var angular = require("angular");
    //注册control
    ngAMD.controller(
    	//control  名
		"tradeDetailCtrl", 
		//参数
		["$scope",
        "appConstant",
        "ajaxService",
        "register",
        "$rootScope",
        function ($scope, appConstant, ajaxService, register,$rootScope) {
			//得到父tab的页面数据
            var tabData = $rootScope.TabsData;
            //定义变量
            var data = angular.copy(tabData);
            //获取sessionid
            var sessionId = $rootScope.sessionId;
            //赋值
            $scope.tradeinfo = data;
            //赋值页面的来源信息
            $scope.from = data.from;
            
            var tradecustomercopy = null;
            var moneybalance = 0;
            var scorebalance = 0;
            /**
             * 显示类型为1：消费类型 4：储值
             */
            if(data.viewType===1||data.viewType===4)
            {
            	 //定义参数
                var searchkey={"txCode" : data.txCode,"sessionId": sessionId,"cardId":data.cardId}
                //接口请求详情消费内容
            	ajaxService.AjaxPost( searchkey,"trade/indexpage/tradeCustomerInfo.do").then(
        			function (result) {
        				//结果绑定奥   tradeCustomer做页面显示
        				$scope.tradeCustomers=result.data;
        				tradecustomercopy = angular.copy($scope.tradeCustomers);
        				$scope.tradeinfo.balanceMoney=result.data.cardBalance;
        				$scope.tradeinfo.balanceScroe=result.data.cardScore;
//        				alert(moneybalance);
//        				alert(scorebalance);
                    }
        		);
            }
            
            /* 返回操作 */
            $scope.cancel = function () {
                register.switchTab({id: $scope.from});
            }
        }]);
});