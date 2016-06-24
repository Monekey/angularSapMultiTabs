/**
 * 后台和报表内容区通用页面
 * @version  v1.0
 * @createTime: 2016/5/5 0005
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/5 0005  LSZ   create
 *                2016/6/16  LSZ  update 优化tab系列的操作
 */
define(["rippleButton"], function (rippleButton) {
    // var ripple = require("rippleButton");
    return ["$scope", "$rootScope", "register", "$timeout",function ($scope, $rootScope, register, $timeout) {

        $scope.tabStatus = "pullRight"; //左侧菜单显示方式有两种 默认是展开状态 还有一种缩进形式的pullLeft
        $scope.dynamicPopover = {
            templateUrl: 'src/page/home/menuPopover.html' //pullLeft菜单鼠标悬停在图标上pop出的子菜单
        };

        $scope.setCurrentGroup= function(group){
            $scope.currentGroup = group;
        };

        $scope.onClickLeftTab = function(group,tab){
            $scope.currentGroup = group;
            $scope.onClickTab(tab);
        };

        $scope.onClickGroup = function(group){
            if(group.id == 10035 || group.id == 10049){
                $scope.onClickTab(group);
            }
        };

        $scope.onClickTab = function (tab) { //点击菜单后新建tab页签
            var index = false;
            var tabs = $rootScope.tabs;
            for (var i = 0; i < tabs.length; i++) {
                if (tab.id == tabs[i].id) {
                    index = i;
                    break;
                }
            }

            if (index !== false) {
                $rootScope.tabs[index].ng_show = true;
            } else {
                register.getViewAndCtrl(tab);
            }
            register.commonFunction(tab);
            register.checkTabsScale();
        };

        $scope.changeTab = function (tab,e) {
            register.commonFunction(tab);
        };

        $scope.closeTab = function (trueIndex, tab, e) {
            var id = tab.id;
            var ctrl = tab.ctrl;
            requirejs.undef(ctrl);
            angular.element(register.getDomObjById(id)).remove();
            //angular.element(register.getDomObjById(id)).addClass('ng-hide');

            $rootScope.tabs.splice(trueIndex, 1);

            tab.ng_show = false;
           register.commonFunction($rootScope.tabs[trueIndex-1]);

            register.checkTabsScale();
            e.stopPropagation();
        }

        $scope.tabGrpTurnLeft = function () { //tab菜单向左滚动
            angular.element(document.getElementById("tabScrollor"))[0].scrollLeft -= 100;
        }
        $scope.tabGrpTurnRight = function () {//tab菜单向右滚动
            angular.element(document.getElementById("tabScrollor"))[0].scrollLeft += 100;
        }
        
        angular.element( window ).on("resize",function(){
            register.checkTabsScale();
        });


        $scope.rightClickIndex = 0;
        $scope.showRightClickMenu = function( e,index ){ //tab菜单右键菜单
            //console.log(e);
            $scope.rightClickIndex = index;
            angular.element( document.getElementById( "rightClickmenu" ) ).css( { top:e.clientY+'px',left:e.clientX+'px',display:"block" } );
            angular.element( document.getElementById( "rightClickmenu_backdrop" ) ).css("display","block");
        }

        $scope.closeSelf = function(){ //关闭tab右键菜单
            angular.element( document.getElementById( "rightClickmenu" ) ).css("display","none");
            angular.element( document.getElementById( "rightClickmenu_backdrop" ) ).css("display","none");
        }

        $scope.getByteLen = function(val) { //获取tab标题的字节数
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                var length = val.charCodeAt(i);
                if(length>=0&&length<=128)
                {
                    len += 1;
                }
                else
                {
                    len += 2;
                }
            }
            return len;
        }
        $scope.closeOther = function(direction){ //tab右键菜单关闭其他功能
            if(direction === 'left'){
                var needClose = $rootScope.tabs.splice( 1,$scope.rightClickIndex-1 );
            }else{
                var needClose = $rootScope.tabs.splice( $scope.rightClickIndex + 1 );
            }
            for( var i = 0 ; i < needClose.length ; i++ ){
                var id = needClose[i].id;
                var ctrl = needClose[i].ctrl;
                requirejs.undef(ctrl);
                angular.element(register.getDomObjById(id)).remove();
                needClose[i].ng_show = false;
            }
            register.commonFunction($rootScope.tabs[$rootScope.tabs.length-1]);

            register.checkTabsScale();
            $scope.closeSelf();
        };

    }];
});