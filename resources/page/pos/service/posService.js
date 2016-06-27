/**
 * pos系统通用方法存放处
 * @version  v1.0
 * @createTime: 2016/5/17 0017
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/17 0017  LSZ   create
 *                2016/6/20 0017  liuzy   update
 */
define(['ngAMD'], function (ngAMD) {
    ngAMD.service("posService", [
        '$state',
        '$window',
        '$rootScope',
        '$document',
        '$timeout',
        function ($state, $window,$rootScope,$document,$timeout) {
            function gotoPosPage(one){
                var state = one.routing.split(';')[0];
                var url = one.routing.split(';')[1];

                if (!$state.get(state)) {
                    $rootScope.stateProvider.state(state, ngAMD.route({
                        url: url,
                        templateUrl: 'resources/page/' + one.template,
                        controllerUrl: one.ctrl
                    }));
                }
                $state.go(state);
            }
            return {
                gotoPos: function (one) {//pos系统打开菜单操作方法
                    gotoPosPage(one);
                },

                goBack: function(){//返回上一页按钮
                    $window.history.back();
                },
                listenerKey:function(mewnuShot){
                    $document.bind("keydown", function(event) {
                        if(event&&event.target.nodeName==='INPUT'){
                            return;
                        }else{

                                var keyCode = window.event?event.keyCode:event.which;
                                angular.forEach(mewnuShot,function(menu){
                                    if(keyCode+"" ===menu.keyCode){
                                        gotoPosPage(menu);
                                    }
                                });

                        }

                    });
                },
                setFocus: function(elementId){
                    return $timeout(function () {
                        var element = angular.element(document.getElementById(elementId));
                        element[0].focus();
                    },200);

                }
            }
        }
    ]);

    ngAMD.directive('autoFocus', [
        "$timeout",
        function($timeout){
            return function(scope, element){
                var timer = $timeout(function(){
                    element[0].focus();
                },200);
                scope.$on('$destroy', function(){
                    $timeout.cancel(timer);
                });
            };
    }]);
    
    // /**
    //  * 页面打开第一个输入框获取焦点
    //  * set-focus="true"
    //  */
    // ngAMD.directive('setFocus', [
    //     "$timeout",
    //     function($timeout) {
    //     return {
    //         link: function (scope, element, attrs) {
    //             var timer;
    //             scope.$watch(attrs.setFocus, function(newValue){
    //                 if (newValue === true){
    //                     timer = $timeout(function(){
    //                             element[0].focus();
    //                     },200);
    //                 }
    //
    //             });
    //
    //             scope.$on("$destroy",
    //                 function() {
    //                     $timeout.cancel( timer );
    //                 }
    //             );
    //         }
    //     };
    // }]);

});