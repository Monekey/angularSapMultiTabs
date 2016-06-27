define(function (require) {
    var ngAMD = require('ngAMD');
    //定义controller
    ngAMD.controller('menu',[
        '$scope',
        function ($scope) {
            $scope.collapse = [true,true];//伸缩菜单的控制开关
        }]);
    return "menu";
});

