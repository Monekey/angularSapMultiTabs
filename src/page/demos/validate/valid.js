define(function (require) {
    //定义controller
    var rtObj = {
        ctrl: "valid",//controller名称
        arrFunc: [
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
            }]
    };
    return rtObj;
});

