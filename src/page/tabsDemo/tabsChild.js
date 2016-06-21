define(function (require) {
    var app = require("app");
    var angular = require("angular");
    //注册会员修改controller
    app.ngAMDCtrlRegister.controller("tabsChildCtrl", [
        "$scope",
        "register",
        "modalService",
        "$rootScope",//加载模块，顺序与function中的参数一致
        function ($scope, register,modalService,$rootScope) {
            //获取父页面操作记录的数据
            var tabData = $rootScope.TabsData;
            //为避免修改父页面数据，复制数据
            var data = angular.copy(tabData);
            console.log(tabData);
            //将副本数据赋值给当前scope中的对象
            $scope.tabId = data.id;
            $scope.from = data.from;
            /*取消操作，切换到父TAB*/
            $scope.back = function () {
                register.switchTab({id: $scope.from});
            }
        }]);
});