define(function (require) {
    //定义controller
    var rtObj = {
        id: "flexDemoCtrl",
        ctrl: "flexDemo",//controller名称
        arrFunc: [
            '$scope',
            function ($scope) {
                $scope.collapse = [false,false];//伸缩菜单的控制开关
            }]
    };
    return rtObj;
});

