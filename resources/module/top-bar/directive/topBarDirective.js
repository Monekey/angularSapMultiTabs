/**
 * 页面顶部通用navigation
 * @version  v1.0
 * @createTime: 2016/5/5 0005
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/5 0005  LSZ   create
 *                2016/5/17 LSZ edit
 *                2016/5/27 LSZ  加载系统后判断是否系统锁定
 */
define(function (require) {
    var angular = require("angular");
    var ngAMD = require("ngAMD");
    var appConst = require("ngConstant");
    ngAMD.directive('topBar', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    "systems": '=',
                    "systemNow": '=',
                    "tabStatus": '='
                },
                replace: 'true',
                templateUrl: 'resources/module/top-bar/template/topBar.html',
                controller: 'com.tcsl.crm7.topBarController'
            };
        }]);

    ngAMD.directive('flex', [//页面模块按钮通用伸缩事件
        function () {
            return {
                restrict: 'E',
                scope: {
                    "flexData": '='
                },
                replace: 'true',
                template: ' <i class=" rules-head-right iconfont" aria-hidden="true" ng-click="click(flexData,$event)" data-ng-bind-html="getArrowIcon(flexData)"></i>',
                controller: ['$scope', '$sce', function ($scope, $sce) {
                    $scope.click = function(flexData,$event){
                        $event.stopPropagation();
                        $scope.flexData = !$scope.flexData;
                    }
                    $scope.getArrowIcon = function (val) {
                        if (val) {
                            return $sce.trustAsHtml("&#xe646;");
                        }
                        else {
                            return $sce.trustAsHtml("&#xe647;");
                        }
                    }
                }]
            };
        }]);

    ngAMD.controller('com.tcsl.crm7.topBarController', [
        '$scope',
        '$rootScope',
        '$state',
        'appConstant', "ajaxService", "getCookieService", 'register',
        function ($scope, $rootScope, $state, appConstant, ajaxService, cookie, register) {
            var sessionId = cookie.getCookie("CRMSESSIONID");

            if(sessionId === ''){
                $state.go('login');
            }else{
                $rootScope.sessionFlag = true;
                $scope.user = $rootScope.user;

                $scope.status = {
                    isopen: false,
                    isopenSystem: false,
                    isopenMessage: false
                };
                $scope.messageAcount = 0;
                $scope.messages = [];
                if (!$rootScope.imgServer || !angular.isUndefined($rootScope.imgServer)) {
                    //菜单树查询，权限查询
                    var _navsTrees = [];
                    ajaxService.AjaxPost({sessionId: sessionId}, "Init/getPages.do").then(function (resp) {
                        if (resp) {
                            $rootScope.imgServer = appConstant.servers.imgServer;
                            $scope.companyImgServer = $rootScope.imgServer;

                            if (resp.data) {
                                var res = resp.data.page;
                                for (var i = 0; i < res.childTree.length; i++) {
                                    var firstLevelNode = {};
                                    firstLevelNode.system = res.childTree[i].showName;
                                    firstLevelNode.code = res.childTree[i].code;
                                    firstLevelNode.id = res.childTree[i].id;

                                    firstLevelNode.navs = [];
                                    for (var j = 0; j < res.childTree[i].childTree.length; j++) {
                                        var secondLevelNode = {};
                                        secondLevelNode.title = res.childTree[i].childTree[j].showName;
                                        secondLevelNode.isShow = true;
                                        secondLevelNode.icon = res.childTree[i].childTree[j].img;
                                        secondLevelNode.id = res.childTree[i].childTree[j].code;
                                        secondLevelNode.template = res.childTree[i].childTree[j].template;
                                        secondLevelNode.ctrl = res.childTree[i].childTree[j].ctrl;

                                        secondLevelNode.content = [];
                                        if (res.childTree[i].childTree[j].childTree !== null) {
                                            for (var k = 0; k < res.childTree[i].childTree[j].childTree.length; k++) {
                                                var thirdLevelNode = {};
                                                thirdLevelNode.title = res.childTree[i].childTree[j].childTree[k].showName;
                                                thirdLevelNode.id = res.childTree[i].childTree[j].childTree[k].code;
                                                thirdLevelNode.template = res.childTree[i].childTree[j].childTree[k].template;
                                                thirdLevelNode.ctrl = res.childTree[i].childTree[j].childTree[k].ctrl;
                                                //thirdLevelNode.type = "single";
                                                thirdLevelNode.ng_show = false;
                                                secondLevelNode.content.push(thirdLevelNode);
                                            }
                                        }
                                        firstLevelNode.navs.push(secondLevelNode);
                                    }

                                    _navsTrees.push(firstLevelNode);
                                }
                                $rootScope.systems = _navsTrees;


                                register.switchSystemName();//给当前页的menu树赋值
                                if (cookie.getCookie('CRM7LOCK') == 'true') {//是否系统锁定
                                    $rootScope.lockSys = true;
                                }

                                if ($state.current.name === 'home' || $state.current.name === 'report' || $state.current.name === 'company') {
                                    if ($state.current.name === 'home' || $state.current.name === 'report') {
                                        register.openChildTab($rootScope.navs[0]);//打开我的首页
                                    }
                                    $rootScope.authority = resp.data.buttons;  //记录button权限
                                }

                                $scope.user = resp.data.userInfo;
                            }
                        }

                    });
                    ajaxService.AjaxPost({sessionId: sessionId}, "Init/getSysMsg.do").then(function (resp) {
                        if (resp.data) {
                            $scope.messageResult = resp.data;
                            if ($scope.messageResult.data !== [] && $scope.messageResult.data.length > 0) {
                                for (var i = 0; i < $scope.messageResult.data.length; i++) {
                                    var text = JSON.parse($scope.messageResult.data[i].text);
                                    $scope.messageResult.data[i].$text = text;
                                }
                            }

                            $scope.messages = $scope.messageResult.data;
                            $scope.messageAcount = $scope.messageResult.count;
                        }
                    });
                } else {
                    register.switchSystemName();//给当前页的menu树赋值
                    if ($state.current.name === 'home' || $state.current.name === 'report') {
                        register.openChildTab($rootScope.navs[0].content[0]);//打开我的首页
                    }
                }

            }


            $scope.toggleTab = function () {
                if ($scope.tabStatus === 'pullRight') {
                    $scope.tabStatus = 'pullLeft';
                } else {
                    $scope.tabStatus = 'pullRight';
                }

            };


            $scope.switchSystem = function (system) {
                if (system.system !== $rootScope.systemNow.system) {
                    if (parseInt(system.code) !== appConstant.systemCode.pos) {// 这个地方不要判断纯的数值，要用有意义的常量替代，在const里面
                        $rootScope.systemNow = system;
                        $rootScope.navs = system.navs;
                        $rootScope.tabs.forEach(function (tab) {
                            angular.element(document.getElementById(tab.id)).remove();
                            requirejs.undef(tab.ctrl);
                            tab.ng_show = false;
                        });
                        $rootScope.tabs = [];
                        if (system.code == appConstant.systemCode.home) {// 这个地方不要判断纯的数值，要用有意义的常量替代，在const里面
                            $state.go("home");
                        } else {
                            $state.go("report");
                        }
                        angular.element(document.getElementsByTagName("body")[0]).css("background", "#fff");
                    } else {
                        $rootScope.tabs = [];
                        $rootScope.systemNow = system;
                        $state.go("pos");
                        angular.element(document.getElementsByTagName("body")[0]).css("background", "#dee6f2");
                    }
                }
            };

            $scope.logoutSystem = function (user) {
                ajaxService.AjaxPost({sessionId: sessionId}, "login/logout.do").then(function (message) {
                    if (message.status === 1) {
                        cookie.cleanCookie("CRMSESSIONID");
                        $state.go('login');
                    }
                });
            };

            $scope.gotoCompany = function () {
                //$rootScope.systemNow = {};
                //$rootScope.navs = [];
                $rootScope.tabs.forEach(function (tab) {
                    angular.element(document.getElementById(tab.id)).remove();
                    requirejs.undef(tab.ctrl);
                    tab.ng_show = false;
                });
                $rootScope.tabs = [];
                //$rootScope.tabs = [];
                //$rootScope.systemNow = system;
                $state.go("company");
                angular.element(document.getElementsByTagName("body")[0]).css("background", "#fff");
                //register.openTabWithRequest({id: 10009},{});
            };
            $scope.changeStatus = function(val,$event) {
                $event.preventDefault();
                // $event.stopPropagation();
                val = !val;
            };
            $scope.getIcon = function (val) {
                if (val) {
                    return $sce.trustAsHtml("&#xe601;");
                }
                else {
                    return $sce.trustAsHtml("&#xe600;");
                }
            }
        }
    ]);
});