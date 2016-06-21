define(function (require) {
    //定义controller
    var rtObj = {
        id: "tabsCtrl",
        ctrl: "tabsCtrl",//controller名称
        arrFunc: [
            '$scope',
            '$rootScope',
            '$uibModal',
            //自定义模块注入，与回调函数顺序应一致
            "register",
            'appConstant',
            "ajaxService",
            "modalService",
            function ($scope, $rootScope,$uibModal, register, appConstant, ajaxService, modalService) {
                $scope.pageTitle = "主要功能";
                $scope.tabId = '123456';
                $scope.closeCurTab = function(){
                    register.closeCurrentTab();
                }
                $scope.addOrSwtichTab = function(){
                    var tab = register.getCurrentTab(); //获取当前tab的信息
                    var data = {id:$scope.tabId};
                    register.addToTabs({
                        title: "TabDemo",//TAB页面标题
                        id: "tabsDemo" + $scope.tabId,//Tab唯一ID
                        template: "tabsDemo/tabsChild.html",//关联Tab的html页面
                        ctrl: 'tabsDemo/tabsChild',//关联html的js文件
                        ctrlName: "tabsChildCtrl",//关联html的js中定义的controller名称
                        ng_show: false,
                        type: 'single',
                        from: tab.id //function数据库功能 ID保持一致
                    }, data);//data传递参数，将对象传递到Tab页面
                }
            }]
    };
    return rtObj;
});

