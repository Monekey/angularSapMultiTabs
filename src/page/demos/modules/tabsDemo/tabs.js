define(function (require) {
    //定义controller
    var rtObj = {
        id: "tabsCtrl",
        ctrl: "tabsCtrl",//controller名称
        arrFunc: [
            '$scope',
            '$rootScope',
            //自定义模块注入，与回调函数顺序应一致
            "register",
            function ($scope, $rootScope, register) {
                $scope.pageTitle = "tabs页签";
                $scope.tabId = '123456';
                //关闭当前tab
                $scope.closeCurTab = function () {
                    register.closeCurrentTab();
                }
                //新增或切换到指定标签
                $scope.addOrSwtichTab = function (index) {
                    var tab = register.getCurrentTab(); //获取当前tab的信息
                    var tabId = index ? index : $scope.tabId;
                    var data = {
                            id: tabId
                        };
                    register.addToTabs({
                        title: "子Tab",//TAB页面标题
                        id: "tabsDemo" + tabId,//Tab唯一ID
                        template: "demos/modules/tabsDemo/tabsChild.html",//关联Tab的html页面
                        ctrl: 'demos/modules/tabsDemo/tabsChild',//关联html的js文件
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

