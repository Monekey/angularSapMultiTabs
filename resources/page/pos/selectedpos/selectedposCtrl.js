/**
 * 搜索首页
 * @version  v1.0
 * @createTime: 2016/5/5 0005
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/5 0005  LSZ   create
 *                2016/5/12 hyz edit
 *                  2016/5/16 zh edit
 *                 2016/5/17 LSZ edit
 */
define(['angular', 'posService'], function (angular) {

    return ["$scope", "ajaxService", "getCookieService", "$rootScope", "modalService", '$state', 'posService',
        function ($scope, ajaxService, getCookieService, $rootScope, modalService, $state, posService) {
            angular.element(document.getElementsByTagName("body")[0]).css("background", "#dee6f2");
            var sessionId = getCookieService.getCookie("CRMSESSIONID");
            var data = {"sessionId": sessionId};
            $scope.paramValue = '';
            $scope.searchdata = {"paramValue": ""};
            //进入此页面的时候清空数据
            $rootScope.searchuserresult = null;
            //结果绑定奥   tradeCustomer做页面显示,下面的变量为显示已经显示出来的功能
            $scope.shortcutmenu = [];
            //得到一个弹层中的操作对象
            $scope.popupOperteMenu = [];

            //接口请求快捷菜单
            ajaxService.AjaxPost(data, "postrade/memberhome/shortcutmenu.do").then(
                function (result) {
                    //数据回来初始化页面
                    setDataToPage(result);
                }
            );
            
            //软posbutten权限
            ajaxService.AjaxPost(data, "postrade/memberhome/posbuttenmenu.do").then(
                function (result) {
                    //数据回来初始化页面
                	if(result.status===1)
                	{
                		$rootScope.posbuttens = result.data;
                	}
                }
            );
            //点击快捷列表事件

            $scope.checked = function (index, one) {
                var fix = 0;
                $scope.popupOperteMenu.forEach(function (menu) {
                    if (menu.shortcutMenu) {
                        if (menu.shortcutMenu == 1) {
                            fix++;
                        }
                    }
                });
                if ($scope.popupOperteMenu[index].shortcutMenu == 1) {
                    $scope.popupOperteMenu[index].shortcutMenu = 0;
                } else {
                    if (fix < 3) {
                        $scope.popupOperteMenu[index].shortcutMenu = 1;
                    }else{
                        $scope.isEnough=false;
                    }
                }
            };

            $scope.gotoPos = function (one) {
            	 //赋值   为编辑页面传值
		         $rootScope.cardoperatetoeditusrmemberinfo = null;
		         //定义全局当前user信息
		         $rootScope.currentuserinfo = null;
                posService.gotoPos(one);
            };

            $scope.updatedata = {
                "cutmenu": [
                    {
                        "template": "",
                        "fatherCode": "",
                        "showName": "",
                        "shortcutMenu": "",
                        "img": "",
                        "orderby": "",
                        "hasChildTree": "",
                        "code": "",
                        "type": "",
                        "ctrl": "",
                        "childTree": []
                    }
                ]
            };
            //确定修改快捷标签
            $scope.confirmIn = function () {
                $scope.updatedata.cutmenu = $scope.popupOperteMenu;
                $scope.updatedata.sessionId = sessionId;
                //提交修改内容
                ajaxService.AjaxPost($scope.updatedata, "postrade/memberhome/modifyusercutmenu.do").then(
                    function (result) {
                        //1：提示成功    0：提示失败原因
                        if (result.status == 1) {
                            result.data = result.cutmenu;
                            //数据回来初始化页面
                            setDataToPage(result);
                            //隐藏页面
                            $scope.isShowCustomPanel = false;
                        }
                    }
                );
            };
            /*取消操作 */
            $scope.cancel = function () {
                //复制对象操作用
                $scope.popupOperteMenu = copyArr($scope.tempshortcutmenu);

                //隐藏页面
                $scope.isShowCustomPanel = false;

            }

            $scope.enterKey = function(searchValue,event){
                var keyCode = window.event?event.keyCode:event.which;
                if(keyCode===13){
                    $scope.clicksearch(searchValue);
                }
                event.stopPropagation();
            };
            /*search */
            $scope.clicksearch = function (searchValue) {
            	if((/^(((13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8})|([1-9](\d{4,9}|\d{11,15})))$/
						.test(searchValue)))
            	{
            		$scope.searchdata.paramValue = searchValue;
                    $scope.searchdata.sessionId = sessionId;
                    //接口请求详情消费内容
                    ajaxService.AjaxPost($scope.searchdata, "postrade/memberhome/memberhomeinfo.do").then(
                        function (result) {
                            //数据不为空路由到主页  否则提示
                            if (result.status) {
         		        	//绑定查出来的数据到主页   避免二次查询
                                $rootScope.searchuserresult = result.data;
                                $state.go('pos.cardoperte.mainpage');
                            }
                        }
                    );
            	}
            	else
            	{
            		modalService.info({title:'提示', content:'请输入正确手机号或卡号!', size:'sm', type: 'confirm'});
	           		return;
            	}
                //隐藏页面
            };

            $scope.isShowCustomPanel = false;
            $scope.customBtn = function () {
                $scope.isShowCustomPanel = !$scope.isShowCustomPanel;
            }

            $scope.getBtnColor = function (img) {
                var icon = img.split(":")[0];
                var color = img.split(":")[1];
                return {background: color};
            }

            //tool
            function copyArr(src) {
                var des = [];
                for (var i = 0; i < src.length; i++) {
                    des.push(angular.copy(src[i]));
                }
                return des;
            }

            function setDataToPage(result) {
            	//系统功能数量标示   用于控制前端显示// <div class="col-xs-12">系统功能</div>
            	var systemShortCutcount =0;
            	var memberShortCutcount =0;
                $scope.shortcutmenu = [];
                $scope.tempshortcutmenu = result.data;
                $scope.tempshortcutmenu.forEach(function (menu) {
                    if (menu.shortcutMenu == 1 || menu.shortcutMenu == 2) {
                        $scope.shortcutmenu.push(menu);
                    }
                    if(menu.shortcutMenu == 2)
                    {
                    	systemShortCutcount++;
                    }
                    memberShortCutcount++;
                });
                $scope.shortcutmenu.forEach(function(shotMenu){
                    var icon = shotMenu.img.split(":")[0];
                    var color = shotMenu.img.split(":")[1];
                    var clickColor = shotMenu.img.split(":")[2];
                    shotMenu.icon = icon;
                    shotMenu.color = color;
                    shotMenu.clickColor = clickColor;
                });
                $scope.systemShortCutcount=systemShortCutcount;
                $scope.memberShortCutcount=memberShortCutcount;
                //绑定操作人权限路由到主页 //嘛意思？？ -sea
                $rootScope.routeruledata = $scope.tempshortcutmenu;
                //复制对象操作用
                $scope.popupOperteMenu = copyArr(result.data);
                posService.listenerKey($scope.shortcutmenu);
            }

            //交易管理跳转
            $scope.postrademanage = function () {
                //权限数据模型
                var data = {
                    "code": "",
                    "showName": "",
                    "fatherCode": "",
                    "childTree": "",
                    "orderby": "",
                    "maxLevel": "",
                    "hasChildTree": "",
                    "template": "",
                    "ctrl": "",
                    "img": "",
                    "routing": "",
                    "authority": "",
                    "type": "",
                    "shortcutMenu": ""
                };
                $state.go('postrademanage');
            }
            //售卡操作
            $scope.posSellCard = function () {
                //权限数据模型
                var data = {
                    "code": "",
                    "showName": "",
                    "fatherCode": "",
                    "childTree": "",
                    "orderby": "",
                    "maxLevel": "",
                    "hasChildTree": "",
                    "template": "",
                    "ctrl": "",
                    "img": "",
                    "routing": "",
                    "authority": "",
                    "type": "",
                    "shortcutMenu": ""
                };
                $state.go('pos.possellcard');
            }
        }];
});