/**
 * pos页面次顶部通用navigation
 * @version  v1.0
 * @createTime: 2016/5/12 1002
 * @createAuthor 张海
 * @updateHistory
 *                2016/5/12 0005  张海   create
 *                2016/5/17   hyz   edit
 *                2016/5/27 LSZ  update 触发事件lockSystem将系统锁定
 */
define(['ngAMD','css!pos_css'], function(ngAMD) {

    ngAMD.directive("posTopbar", [function () {
        return {
            restrict: 'E',
            scope: {
                userTerminal: '=',
                shopTerminals:'='
            },
            replace: 'true',
            templateUrl: 'src/page/pos/module/pos-topbar/posTopbar.html',
            controller: 'com.tcsl.crm7.posTopbarController'
        };
    }]);

    ngAMD.controller('com.tcsl.crm7.posTopbarController', [
        '$scope', "$rootScope", "ajaxService", "getCookieService",'$state','$interval',"modalService",
        function ($scope, $rootScope, ajaxService, getCookieService, $state,$interval,modalService) {

            //接口查询客户终端号
            var data={"sessionId":$rootScope.sessionId};
            ajaxService.AjaxPost(data,"postrade/memberhome/userterminal.do").then(function (result) {
                    //结果绑定奥   tradeCustomer做页面显示
                    if(result.data!=null)
                    {
                        $scope.userTerminal = result.data;
                        var search = {"shopId": result.data.shopId, "sessionId": $rootScope.sessionId};
                        $state.go('pos.selectedpos');
                    }else {
                        $scope.userTerminal=null;
                        var search = {"shopId": result.shopId, "sessionId": $rootScope.sessionId};
                        $state.go('pos.default');
                    }
                    //接口查询客户选中账户的终端号
                    ajaxService.AjaxPost(search, "postrade/memberhome/usershopterminal.do").then(
                        function (result) {
                            //结果绑定奥   tradeCustomer做页面显示
                            if (result.data != null) {
                                $scope.shopTerminals = result.data;
                            }
                        }
                    );
                }
            );



            //$scope.isPosHome = function(){
            //    if($state.current.name == 'pos.selectedpos' || $state.current.name == 'pos.default'){
            //        return false;
            //    }
            //    return true;
            //};

            $scope.switchTerminal = function(){
            	//赋值   为编辑页面传值
	        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	        	//定义全局当前user信息
	        	$rootScope.currentuserinfo = null;
                $state.go('pos.default');
            };
            //打印
            $scope.posPrint = function(){
//                $scope.posPrinter = true;
            	modalService.info({title:'提示', content:'未找到打印机!', size:'sm', type: 'confirm'});
            };
            //打印设置
            $scope.posPrintSet = function(){
//                $scope.posPrinter = true;
            	modalService.info({title:'提示', content:'未找到打印机!', size:'sm', type: 'confirm'});
            };
            $scope.closePosPrint = function(){
                $scope.$parent.posPrinter = false;
            };
            //$scope.goselectedpos = function()
            //{
            //	//赋值   为编辑页面传值
	        	//$rootScope.cardoperatetoeditusrmemberinfo = null;
	        	////定义全局当前user信息
	        	//$rootScope.currentuserinfo = null;
	        	//$state.go('pos.selectedpos');
            //}
            $scope.currDate=
            {
            		"year":"",
            		"mouth":"",
            		"date":"",
            		"day":"",
            		"time":""
            }
            var today = new Date(); //新建一个Date对象
            var year = today.getFullYear();//查询年份  
            var month = today.getMonth()+1;//查询月份
            var date = today.getDate();//查询当月日期
            var day = today.getDay();//查询当前星期几
        	var week="";                               
            if (day==0) week='星期日';
            if (day==1) week='星期一';
            if (day==2) week='星期二';
            if (day==3) week='星期三';
            if (day==4) week='星期四';
            if (day==5) week='星期五';
            if (day==6) week='星期六';
            $scope.currDate.year = year;//查询年份  
            $scope.currDate.month = month;//查询月份
            $scope.currDate.date = date;//查询当月日期
            $scope.currDate.day = week;//查询当前星期几
            
            $interval(function() {
            	 var myDate = new Date();
                 var hours = myDate.getHours()<10?"0"+myDate.getHours():myDate.getHours();
                 var minutes = myDate.getMinutes()<10?"0"+myDate.getMinutes():myDate.getMinutes();
                 var seconds = myDate.getSeconds()<10?"0"+myDate.getSeconds():myDate.getSeconds();
                 $scope.currDate.time=hours+":"+minutes+":"+seconds;
            }, 1000);

            $scope.lockSystem = function(){
                getCookieService.setCookie('CRM7LOCK', true);
            };
        }
    ]);

});