define(function (require) {
    var ngAMD = require('ngAMD');
    //定义controller
    ngAMD.controller('flexDemoCtrl',[
        '$scope',
        function ($scope) {
            $scope.collapse = [false,false];//伸缩菜单的控制开关
        }]);
    return 'flexDemoCtrl';
});

