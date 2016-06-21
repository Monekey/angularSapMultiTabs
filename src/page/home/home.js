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

        $scope.tabStatus = "pullRight";
        $scope.dynamicPopover = {
            templateUrl: 'src/page/home/menuPopover.html'
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

        $scope.onClickTab = function (tab) {
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

        $scope.tabGrpTurnLeft = function () {
            angular.element(document.getElementById("tabScrollor"))[0].scrollLeft -= 100;
        }
        $scope.tabGrpTurnRight = function () {
            angular.element(document.getElementById("tabScrollor"))[0].scrollLeft += 100;
        }
        
        angular.element( window ).on("resize",function(){
            register.checkTabsScale();
        });


        $scope.rightClickIndex = 0;
        $scope.showRightClickMenu = function( e,index ){
            //console.log(e);
            $scope.rightClickIndex = index;
            angular.element( document.getElementById( "rightClickmenu" ) ).css( { top:e.clientY,left:e.clientX,display:"block" } );
        }

        $scope.closeSelf = function(){
            angular.element( document.getElementById( "rightClickmenu" ) ).css("display","none");
        }

        $scope.closeOther = function(direction){
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