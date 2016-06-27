define(function (require) {
    var ngAMD = require('ngAMD');
    //注册会员修改controller
    ngAMD.controller("tabsChildCtrl", [
        "$scope",
        "register",
        "modalService",
        "$rootScope",//加载模块，顺序与function中的参数一致
        function ($scope, register,modalService,$rootScope) {
            //获取父页面操作记录的数据
            var tabData = $rootScope.TabsData;
            //为避免修改父页面数据，复制数据
            var data = angular.copy(tabData);
            //将副本数据赋值给当前scope中的对象
            $scope.tabId = data.id;
            $scope.from = data.from;//传入父页面的ID
            /*取消操作，切换到父TAB*/
            $scope.back = function () {
                //关闭当前页并切换到父页面
                register.switchTab({id: $scope.from});
            }
        }]);
});