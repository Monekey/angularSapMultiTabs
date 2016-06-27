define(function (require) {
    var ngAMD = require('ngAMD');
    //定义controller
    ngAMD.controller('valid',[
        '$scope',
        'modalService',
        function ($scope, modalService) {
            $scope.collapse = [true];
            $scope.cardInfo = {}
            $scope.submitForm = function () {
                modalService.info({
                    content: '保存成功',
                    type: 'ok'
                })
            }
        }]);
    return "valid";
});

