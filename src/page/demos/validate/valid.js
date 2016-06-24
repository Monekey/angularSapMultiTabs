define(function (require) {
    //定义controller
    var rtObj = {
        ctrl: "valid",//controller名称
        arrFunc: [
            '$scope',
            function ($scope) {
                $scope.collapse = [true,true];//伸缩菜单的控制开关
            }]
    };
    return rtObj;
});

