/**
 * pos系统通用方法存放处
 * @version  v1.0
 * @createTime: 2016/5/17 0017
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/17 0017  LSZ   create
 */
define(["app",'ngAMD'], function (app, ngAMD) {
    app.ngAMDCtrlRegister.service("posService", [
        '$state',
        '$window',
        '$rootScope',
        '$document',
        function ($state, $window,$rootScope,$document) {
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
                }
            }
        }
    ]);
});