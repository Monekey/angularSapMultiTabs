/**
 * 基础已售卡详情页
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
define(function (require) {
    var ngAMD = require("ngAMD");
    var angular = require("angular");
    //注册controller
    ngAMD.controller("cardDetailCtrl", [
        "$scope",
        "appConstant",
        "ajaxService",
        "register",
        "$rootScope",//加载模块，顺序与function顺序一致
        function ($scope, appConstant, ajaxService, register,$rootScope) {
        	//获取父页面操作记录的数据
            var tabData = $rootScope.TabsData;
            //为避免修改父页面数据，复制数据
            var data = angular.copy(tabData);
            //将副本数据赋值给当前scope中的对象
            $scope.baseCardUsed = data;
            //获取当前Tab页面的父Tab页面归属，后边使用定位
            $scope.from = data.from;
            
            $scope.title='';
           
            //本金账户
            $scope.chargeAccountObj={};
            //积分账户
            $scope.scoreAccountObj={};
            //赠送账户
            $scope.donateAccountObj={};
            //次数账户
            $scope.timesAccountObj={};
            
            /*获得基础已售卡的所有卡账户信息*/
            ajaxService.AjaxPost({sessionId: $rootScope.sessionId,cardId:$scope.baseCardUsed.id}, 
            		'cardmanage/bmCardAccount/cardAccountDetail.do')
            .then(function (result) {
                var resultArray = result.data;
                //分离出1:本金、3:赠送、2:积分、4:次数账户
                if(resultArray && resultArray.length>0){
                	for (var i = 0; i < resultArray.length; i++) {
                		if(resultArray[i].cardAccountTypeId == 1){
                			$scope.chargeAccountObj =resultArray[i];
                		}else if(resultArray[i].cardAccountTypeId == 2){
                			$scope.scoreAccountObj =resultArray[i];
                		}else if(resultArray[i].cardAccountTypeId == 3){
                			$scope.donateAccountObj =resultArray[i];
                		}else if(resultArray[i].cardAccountTypeId == 4){
                			$scope.timesAccountObj =resultArray[i];
                		}
					}
                }
            });
            /* 返回操作 */
            $scope.cancel = function () {
                register.switchTab({id: $scope.from});
            }
            
            /*卡详情穿透到交易界面*/
            $scope.doTradeDetail = function(baseCardUsed){
            	//穿透时调用的方法,id为目标tab功能id,第二个参数为显示类型及显示条件（searchType搜索的下拉条件 searchTypeValue搜索框内的内容）
            	register.openTabWithRequest({id: 10015},{searchType: 1,searchTypeValue: baseCardUsed.number});
            	
            }
        }]);
});