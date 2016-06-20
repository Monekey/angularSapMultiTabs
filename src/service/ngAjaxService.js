/**
 * ajax请求的包装（get,post）
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *       2016/3/8  LSZ  create
 */
define(['angular','modal'],function (angular) {
    var ajaxmodule = angular.module("ajaxmodule", ['com.tcsl.crm7.modal']);

    ajaxmodule.service("ajaxService", ['$http', '$q', 'appConstant', 'modalService','$state','$rootScope',
        function ($http, $q, appConstant, modalService, $state, $rootScope) {
            var flag = true;
            return {
                AjaxPost: function (data, ajaxUrl) {
                   /* bsLoadingOverlayService.start({
                        referenceId: 'overlay-div'
                    });*/
                    var deferred = $q.defer();
                    var prefix = appConstant.servers['local'];
                    $http({
                        method: 'POST',
                        url: prefix + ajaxUrl,
                        cache: true,
                        data: data
                    }).success(function (response, status, headers, config) {
                        deferred.resolve(response);
                        if (response.status == 0) {
                            if(response.errCode == '1'){//session超时统一处理
                                delete $rootScope.imgServer;

                                if($rootScope.sessionFlag){
                                    delete $rootScope.sessionFlag;
                                    //确定信息后跳出系统
                                    /*modalService.info({title: '提示', content: response.errMessage +',需重新登录！', size: 'sm', type: 'confirm'}).then(function(response){
                                        if(response.status === 'ok'){
                                            $state.go('login');
                                        }
                                    });*/
                                    modalService.info({content: response.errMessage +',请重新登录！', type: 'fail', delay: 1500}).then(function(response){
                                        if(response.status === 'ok'){
                                            $state.go('login');
                                        }
                                    });
                                }
                            }else{
                                if(response.errMessage == '' && flag == true){
                                    flag = false;
                                    modalService.info({title: '提示', content: '系统异常,cause reason from:'+ ajaxUrl, size: 'sm', type: 'confirm'});
                                }
                                if(response.errMessage !== ''){
                                    modalService.info({title: '提示', content: response.errMessage, size: 'sm', type: 'confirm'});
                                }
                            }
                        }
                       /* bsLoadingOverlayService.stop({
                            referenceId: 'overlay-div'
                        });*/
                    }).error(function (response, status) {
                        deferred.reject("Can't search upload data.");
                        modalService.info({title: '提示', content: '请求失败,请重试,cause reason from:'+ ajaxUrl +'\n'+'status:'+ status, size: 'sm', type: 'confirm'});
                       /* bsLoadingOverlayService.stop({
                            referenceId: 'overlay-div'
                        });*/
                    });
                    return deferred.promise;
                },

                AjaxGet: function (ajaxUrl) {
                    bsLoadingOverlayService.start({
                        referenceId: 'overlay-div'
                    });
                    var deferred = $q.defer();
                    var prefix = appConstant.servers['local'];
                    $http({
                        method: 'GET',
                        url: prefix + ajaxUrl,
                        cache: true
                    }).success(function (response, status, headers, config) {
                        deferred.resolve(response);
                        bsLoadingOverlayService.stop({
                            referenceId: 'overlay-div'
                        })
                    }).error(function (response) {
                        //window.console.log(response);
                        deferred.reject("Can't search upload data.");
                        modalService.info({title: '提示', content: '请求失败,请重试', size: 'sm', type: 'confirm'});
                        bsLoadingOverlayService.stop({
                            referenceId: 'overlay-div'
                        });
                    });
                    return deferred.promise;
                }
            };
        }]);
        return ajaxmodule;
});