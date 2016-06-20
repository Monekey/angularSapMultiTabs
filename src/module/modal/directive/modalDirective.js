/**
 * 弹出信息公共模块
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *       2016/4/19 LSZ  create
 */
define(['angular', 'ui_bootstrap', 'ng_animate'], function (angular) {
    var modalModule = angular.module("com.tcsl.crm7.modal", ['ui.bootstrap', 'ngAnimate']);
    //自定义factory
    modalModule.factory('modalService', [
        '$uibModal',
        '$q',
        function ($uibModal, $q) {
            return {
                info: function (info) {
                    var deferred = $q.defer();
                    var getSize = function(type,size){
                        switch (type){
                            case 'ok': return 'vsm';
                            case 'fail': return 'msm';
                            default: return size;
                        }
                        return size;
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'src/module/modal/template/modal.html',
                        controller: 'com.tcsl.crm7.modalController',
                        size: getSize(info.type,info.size),
                        backdrop: true,
                        resolve: {
                            info: function () {
                                var obj = {
                                    title: info.title,
                                    content: info.content,
                                    type: info.type,
                                    delay: info.delay
                                };
                                return obj;
                            }
                        }
                    });

                    modalInstance.result.then(function (info) {
                        deferred.resolve(info);
                    }, function (reason) {
                        if (info.type == 'ok' || info.type == 'fail') {
                            deferred.resolve({status: 'ok'});
                        }else{
                            deferred.reject(reason);
                        }
                    });
                    return deferred.promise;
                }
            }
        }]);
    //modal factory 加载模板对应的controller
    modalModule.controller('com.tcsl.crm7.modalController', [
        '$uibModalInstance',
        '$scope',
        'info',
        '$timeout',
        function ($uibModalInstance, $scope, info, $timeout) {
            $scope.info = info;
            $scope.ok = function () {
                //$uibModalInstance.close();
                $uibModalInstance.close({status: 'ok'});
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            if ($scope.info.type == 'ok' || $scope.info.type == 'fail') {
                var timer = $timeout(
                    function () {
                        $uibModalInstance.close({status: 'ok'});
                    },
                    (parseInt($scope.info.delay)==$scope.info.delay)?$scope.info.delay:1000
                );
                $scope.$on(
                    "$destroy",
                    function () {
                        $timeout.cancel(timer);
                    }
                );
            }
        }]);
});
