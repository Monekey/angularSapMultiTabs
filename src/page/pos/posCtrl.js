/**
 * pos系统主页
 * @version  v1.0
 * @createTime: 2016/5/5 0005
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/5 0005  LSZ   create
 *                2016/5/11 hyz edit
 *                  2016/5/13 张海 edit
 *                  2017/5/17 LSZ edit
 */
define(['angular','posTopbar'],function (angular, posTopbar) {

    return ["$scope", "ajaxService", "getCookieService", "$rootScope", "modalService", '$state',
        function ($scope, ajaxService, getCookieService, $rootScope, modalService, $state) {
            angular.element(document.getElementsByTagName("body")[0]).css("background", "#dee6f2");

            $scope.userterminal = angular.copy($scope.terminal);
            $scope.usershopterminal = angular.copy($scope.shopterminals);

            var sessionId = getCookieService.getCookie("CRMSESSIONID");
            var data = {"sessionId": sessionId};



            //接口查询客户可操作店铺
            ajaxService.AjaxPost(data, "postrade/memberhome/usershopcombo.do").then(
                function (result) {
                    //结果绑定奥   tradeCustomer做页面显示
                    if (result.data != null) {
                        $scope.usershopcombo = result.data;
                    }
                }
            );


            //获取shop终端列表
            $scope.getShopTerminal = function (shopId) {
                var search = {"shopId": shopId, "sessionId": $rootScope.sessionId};
                //设置用户终端属性值为空
                $scope.userterminal.terminalId = "";
                $scope.userterminal.terminaName = "";
                $scope.userterminal.terminalCode = "";
                $scope.userterminal.shopName = $('select[name="shopid"]').find("option:selected").text();
                //接口查询客户选中账户的终端号
                ajaxService.AjaxPost(search, "postrade/memberhome/usershopterminal.do").then(
                    function (result) {
                        //结果绑定usershopterminal做页面显示
                        if (result.data != null) {
                            $scope.usershopterminal = result.data;
                        }
                    }
                );
            };

            //开始营业
            $scope.confirmIn = function () {
                $scope.userterminal.sessionId = $rootScope.sessionId;
                var userterminal = $scope.userterminal;
                if (!userterminal.shopId || !userterminal.terminalId || !userterminal.shopName) {
                    modalService.info({title: '提示', content: '请选择终端！!', size: 'sm', type: 'confirm'});
                    return;
                }

                //提交修改内容
                ajaxService.AjaxPost(userterminal, "postrade/memberhome/modifyuserterminal.do").then(
                    function (result) {
                        //1：提示成功    0：提示失败原因
                        if (result.status == 1) {
                            //$scope.terminal = $scope.userterminal;
                            $scope.$parent.terminal = result;
                            $scope.$parent.shopterminals=$scope.usershopterminal;
//						 modalService.info({title:'提示', content:'成功!', size:'sm', type: 'confirm'});
                            $state.go('pos.selectedpos');
                        }
                    }
                );
            };
            //终端选中时间
            $scope.clickterminal = function (index, one) {
                $scope.userterminal.terminalId = one.teminalId;
                $scope.userterminal.terminalCode = one.teminalCode;
                $scope.userterminal.terminaName = one.name;
            };

            $scope.isPosHome = function(){
                if($state.current.name == 'pos.selectedpos'){
                    return false;
                }
                return true;
            };
            $scope.goselectedpos = function()
            {
                //赋值   为编辑页面传值
                $rootScope.cardoperatetoeditusrmemberinfo = null;
                //定义全局当前user信息
                $rootScope.currentuserinfo = null;
                $state.go('pos.selectedpos');
            }
        }];
});