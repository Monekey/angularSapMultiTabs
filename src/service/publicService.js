/**
 * tab切换的所有方法
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *       2016/3/8  LSZ  create
 *       2016/5/6  LSZ  update 增加切换顶部系统显示方法
 */
define(function (require) {
    var angular = require("angular");

    var publicService = angular.module("public", []);
    //为不是左侧主导航的其他按钮，比如修改，新增按钮，弹出的新tabs注册controller用的
    publicService.service("register", ["$rootScope", "$compile", '$state', function ($rootScope, $compile, $state) {
        var self = this;
        //可以多开tabs的id的后缀
        this.tabindex = 0;

        this.getViewAndCtrl = function (tab) {
            tab.ng_show = true;
            $rootScope.tabs.push(tab);
            require(['text!' + tab.template], function (html) {

                require([tab.ctrl], function (rtObj) {
                    $rootScope.ctrlRegister(rtObj.ctrl, rtObj.arrFunc);

                    // var st = document.getElementById("container").children[document.getElementById("container").children.length-1];
                    angular.element(self.getDomObjById("container")).append(html);
                    angular.element(self.getLastChild("container")).attr("ng-controller", rtObj.ctrl);
                    angular.element(self.getLastChild("container")).attr("id", tab.id);
                    $compile(self.getDomObjById(tab.id))($rootScope);
                });
            });
        };

        this.openTabWithRequest = function (tab, request) {//穿透时关闭旧页面，打开新页面
            $rootScope.searchRequest = request;
            $rootScope.navs.forEach(function (group) {
                group.content.forEach(function (tabIt) {
                    if (tab.id == tabIt.id) {
                        tab = tabIt;
                    }
                });
            });
            var tabs = $rootScope.tabs;
            for (var i = 0; i < tabs.length; i++) {
                if (tab.id == tabs[i].id) {
                    angular.element(document.getElementById(tabs[i].id)).remove();
                    requirejs.undef(tabs[i].ctrl);
                    $rootScope.tabs.splice(i, 1);
                } else {
                    tabs[i].ng_show = false;
                    angular.element(this.getDomObjById(tabs[i].id)).addClass('ng-hide');
                }
            }
            this.getViewAndCtrl(tab);
        };

        //打开新的tab
        this.addToTabs = function (obj, data) {
            var aNewObj = angular.copy(obj);
            var tabs = $rootScope.tabs;
            var flag = false;
            for (var i = 0; i < tabs.length; i++) {
                if (aNewObj.id === tabs[i].id) {
                    flag = true;
                    break;
                }
            }

            if (aNewObj.type === 'multiple') {
                aNewObj.id = aNewObj.id + "_" + self.tabindex;
                self.tabindex++;
                openChildTab(aNewObj, data);
            } else {
                if (flag) {
                    this.switchTab(aNewObj, 'switch');
                } else {
                    openChildTab(aNewObj, data);
                }
            }
            self.checkTabsScale();
        };

        function openChildTab(ctrlObj, data) {
            $rootScope.tabs.push(ctrlObj);
            require(['text!' + ctrlObj.template], function (html) {
                $rootScope.$apply(function(){
                    data.from = ctrlObj.from;
                    $rootScope.TabsData = data;
                });
                require([ctrlObj.ctrl], function (rtObj) {
                    $rootScope.$apply(function(){
                        angular.element(self.getDomObjById("container")).append(html);
                        angular.element(self.getLastChild("container")).attr("ng-controller", ctrlObj.ctrlName);
                        angular.element(self.getLastChild("container")).attr("id", ctrlObj.id);

                        $compile(self.getDomObjById(ctrlObj.id))($rootScope);
                        self.commonFunction(ctrlObj);
                    });
                });

            });

            self.checkTabsScale();
        };

        this.checkTabsScale = function () {
            if (Number(window.getComputedStyle(document.getElementById("tabScrollor")).width.slice(0, -2)) < ($rootScope.tabs.length * 128)) {
                angular.element(document.getElementById("turnleft")).css("display", "block");
                angular.element(document.getElementById("turnright")).css("display", "block");
                var tabs = $rootScope.tabs;
                var index = 0;
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].ng_show === true) {
                        index = i; break;
                    }
                }
                angular.element(document.getElementById("tabScrollor"))[0].scrollLeft
                    = (index+1) * 128 + 64 - Number(window.getComputedStyle(document.getElementById("tabScrollor")).width.slice(0, -2));
            } else {
                angular.element(document.getElementById("turnleft")).css("display", "none");
                angular.element(document.getElementById("turnright")).css("display", "none");
            }
        };

        this.getDomObjById = function (selector) {
            return document.getElementById(selector);
        };
        this.getLastChild = function (selector) {
            var length = document.getElementById("container").children.length;
            return document.getElementById("container").children[length - 1];
        };

        this.commonFunction = function (tab) {
            var tabs = $rootScope.tabs;
            for (var i = 0; i < tabs.length; i++) {
                if (tab.id !== tabs[i].id) {
                    tabs[i].ng_show = false;
                    angular.element(this.getDomObjById(tabs[i].id)).addClass('ng-hide');
                } else {
                    tabs[i].ng_show = true;
                    angular.element(this.getDomObjById(tabs[i].id)).removeClass('ng-hide');
                }
            }
            self.checkTabsScale();
        };
        //获取当前页签信息
        this.getCurrentTab = function () {
            var tabs = $rootScope.tabs;
            var curTab = null;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].ng_show === true) {
                    curTab = tabs[i];
                }
            }
            return curTab;
        }
        //关闭当前页签
        this.closeCurrentTab = function () {
            var tabs = $rootScope.tabs;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].ng_show === true) {
                    requirejs.undef(tabs[i].ctrl);
                    angular.element(document.getElementById(tabs[i].id)).remove();
                    tabs[i].ng_show = false;
                    $rootScope.tabs.splice(i, 1);
                    this.commonFunction($rootScope.tabs[i - 1]);
                    this.checkTabsScale();
                    $('.content-main').animate({scrollTop: 0}, 600);
                }
            }
        }
        //切换tab,分为关闭当前标签和直接跳转
        this.switchTab = function (tab, type) {
            var tabs = $rootScope.tabs;
            var flag = false;
            if (type === 'switch') {
                this.commonFunction(tab);
            } else {
                for (var i = 0; i < tabs.length; i++) {
                    if (tab.id == tabs[i].id) {
                        flag = true;
                        tabs[i].ng_show = true;
                        angular.element(this.getDomObjById(tabs[i].id)).removeClass('ng-hide');
                    } else {
                        if (tabs[i].ng_show) {//删除标签页
                            requirejs.undef(tabs[i].ctrl);
                            angular.element(document.getElementById(tabs[i].id)).remove();
                            $rootScope.tabs.splice(i, 1);
                        }
                    }
                }
                if (!flag) {
                    this.commonFunction(tabs[0]);
                }
            }
            $('.content-main').animate({scrollTop: 0}, 200);
        };

        /*切换顶部系统显示*/
        this.switchSystemName = function () {
            $rootScope.tabs = [];
            $rootScope.overlay = true;
            if ($state.current.name === 'home') {
                $rootScope.systemNow = $rootScope.systems[0];
                $rootScope.navs = $rootScope.systemNow.navs;
            } else if ($state.current.name === 'report') {
                $rootScope.systemNow = $rootScope.systems[1];
                $rootScope.navs = $rootScope.systemNow.navs;
            } else if ($state.current.name === 'company') {
                $rootScope.systemNow = {
                    system: "集团信息",
                    navs: []
                };
                $rootScope.navs = [];
            } else {
                $rootScope.systemNow = $rootScope.systems[2];
                $rootScope.navs = $rootScope.systemNow.navs;
            }
        };

        /*公共的获取按钮权限方法*/
        this.getRoot = function (name) {
            var flag = false;

            $rootScope.tabs.forEach(function (tab) {
                if (tab.ng_show == true) {

                    if ($rootScope.authority[tab.id]) {
                        $rootScope.authority[tab.id].forEach(function (root) {
                            if (root.showName === name) {
                                flag = true;
                                return false;
                            }
                        });
                    }
                }
            });
            if (flag) {
                return true;
            }
            return false;
        };
    }]);
    //增加右键事件
    publicService.directive('ngRightclick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightclick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {$event: event});
                });
            });
        };
    });

    return publicService;
});