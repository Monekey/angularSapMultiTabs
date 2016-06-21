/**
 * 创建员工页
 * @version  v1.0
 * @createTime: 2016-04-19
 * @createAuthor lxp
 * @updateHistory
 *
 * @note   文件命名规则 ：employee
 *          修改页：empUpdate
 *          创建页：empCreat
 */
define(function (require) {
    var emp_css = require("css!emp_css");
    var submitFlg = false;
    //引用样式 
    var app = require("app");
    var angular = require("angular");
    var shopselector = require("shopSelector");
    app.ngAMDCtrlRegister.controller("invationController", [//模块依赖
        //必须引用
        "$scope",
        //可选引用  顺序要和function中顺序一致
        "$rootScope", "ajaxService", "$uibModal", "$log", 'register', 'shopSelectorService', 'modalService',
        function ($scope, $rootScope, ajaxService, $uibModal, $log, register, shopSelectorService, modalService) {
            $scope.employeeCreate = {
                "empInfos": [],
                "roleId": "",
                "sessionId": $rootScope.sessionId,
                "shopIds": {}
            };
            var sessionId = $rootScope.sessionId;
            var data = $rootScope.TabsData;
            $scope.changeItems = [];
            $scope.accountTypes = [{text: "手机号码", value: 'phone'},
                {text: "电子邮箱", value: 'email'}];

            $scope.from = data.from;
            $scope.tempObj = {value: 1};

            var param = {
                sessionId: sessionId
            };
            var empBusines = {
                "accountType": "phone",
                "phone": "",
                "email": "",
                "empName": "",
            };
            //var addEmpBusines = angular.copy(empBusines);
            // var addEmpBusines = empBusines;
            $scope.empBusiness = [empBusines];
            /**
             * 增加一行业务通知短信设置
             */
            $scope.addRow = function () {
                $scope.empBusiness.push({
                    "accountType": "phone",
                    "phone": "",
                    "email": "",
                    "empName": ""
                });
            };
            /**
             * 删除一行业务通知短信设置
             */
            $scope.minusRow = function (index) {
                $scope.empBusiness.splice(index, 1);
            };

            $scope.OnInput = function (name) {
                if (name) {
                    name += "";
                    if (name.match(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g)) {
                        return true;
                    }
                    return false;
                }
                if ($scope.focu == true) {
                    return true;
                }
            };

            $scope.InputPE = function (value, name) {

                if (value == 1 && !angular.isUndefined(name)) {
                    if (name.match(/^1[3|4|5|7|8]\d{9}$/)) {
                        console.log(value);
                        return true;
                    }
                    return false;
                }
                if (value == 2 && !angular.isUndefined(name)) {
                    if (name.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
                        return true;
                        console.log(name);
                    }
                    return false;
                }
                if ($scope.focu == true) {
                    return true;
                }
            };
            //验证邮箱、手机
            $scope.getValid = function (name) {
                if (name) {
                    name += '';
                    if(/.*[\u4e00-\u9fa5]+.*$/.test(name)) {
	                    return true;
                    }
                    if (name.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/) || name.match(/^1[3|4|5|7|8]\d{9}$/)) {
                        return false;
                    }
                    return true;
                }
                if ($scope.focu == true) {
                    return true;
                }
            };
            //验证所有姓名邮箱和手机
            $scope.validAll = function () {
                var f = true;
                angular.forEach($scope.empBusiness, function (item, index) {
                    if ($scope.getValid(item.email)) {
                        // console.log(true||$scope.empEditForm.$invalid||$scope.changeItems.length<=0);
                        f = false;
                        return true;
                    }
                    if (($scope.getValidNm(item.empName)==""?false:true)) {
                    	f = false;
                        return true;
                    }
                    //  console.log(false);
                });
                if (f) {
                    return false;
                }
                else {
                    return true;
                }
            }
            //验证姓名
            $scope.getValidNm = function (name) {
                if (name) {
                    name += '';
                    var cnum = 0;
                	for (var v = 0; v < name.length; v++) {
                        var c = name.charAt(v);
                		var ccode = name.charCodeAt(v);
                        if (!c.match(/^([a-zA-Z0-9\u4E00-\u9FA5])/)) {
                            return "请正确填写姓名,不能含有特殊字符";
                        }
                        if (ccode > 255) {
                        	cnum += 2;
                        }
                        else {
                        	cnum += 1;
                        }
                        if (cnum > 16) {
                        	return "请正确填写姓名,长度最大16字节";
                        }
                    }
                    return "";
                }
                if ($scope.focu == true) {
                    return "";
                }
            };
            //根据sessionId获取员工所属角色
            ajaxService.AjaxPost(param, "usermanager/rolemanager/getRoleCombo.do").then(
                function (result) {
                    $scope.roleList = result.data;
                }
            );
            //底端取消按钮
            $scope.cancelIn = function () {
                register.switchTab({id: $scope.from});
            };
            /**
             * 监听状态，加载列表数据
             */
            $scope.$watch("status.limit", function (limit) {
                if (limit && limit === true) {
                    ajaxService.AjaxPost({"sessionId": sessionId}, 'memberequity/cardtype/limitSet.do').then(function (result) {
                        if (result) {
                            $scope.limitSet = result.limitSet;
                        }
                    })
                }
            });
   		 	/**
            * 开启门店选择模态框
            */
            $scope.showModal = function () {
                //将当前对象转换成对应模态框的对象的字段
                //showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
                var showFlg = 1;
                //模态框需要传入两个值，一个是最初始的数据库加载的选中对象数组，创建的时候初始数组为空
                var initItems = [];
                //模态框需要传入两个值，一个是当前页面显示的对象数组
                var currentItems = $scope.shopIds ? convertModalShop1($scope.shopIds) : [];
                console.log(currentItems);
                var paramSet = {
                    "serviceType": "shop", //terminal
                    "shop": {
                        "brand": 1,
                        "city": 2,
                        "ajaxUrl": "baseData/shopManager/getShopTree.do"
                    },
                    "initItems": initItems,
                    "currentItems": currentItems,
                    "showFlg": 1
                };
                shopSelectorService.openShopModal(paramSet).then(function (result) {
                    //result中含有全部已选元素数组，和变化的元素数组
                    $scope.shopIds = convertModalShop(result.allSelectedItems);
                    console.log($scope.shopIds);
                    $scope.changeItems = convertModalShop(result.changeItems);
                });

            };
            /**
             * 批量导入
             */
             $scope.showImport = function () {
            	 var empImportCtrl = require("usermanager/empmanager/empImport");
            	 var empImportPage = require("text!usermanager/empmanager/empImport.html");
            	 var modalInstance = $uibModal.open({
                     //受否加载动画
                     animation: false,
                     //模态框页面
                     template: empImportPage,
                     //模态框的尺寸
                     size: "sm",
                     //模态框对应的controller
                     controller: 'empImportCtrl',
                     //向模态框传递参数
                     resolve: {
                    	 noticeEmps: function () {
                             return null;
                         }
                     }

                 });
                 //处理模态框返回到当前页面的数据
                 modalInstance.result.then(function (penm) {
                     for (var i=0; i<penm.length; i++) {
                    	 var row = penm[i];	console.log(row[0] + " " + row[1]);
                    	 var pe = row[0];
                    	 var nm = row[1];
                    	 var at = pe.indexOf("@")>0?"email":"phone";
                    	 var row = null;
                    	 if (i==0) {
                    		 $scope.empBusiness.length = 0;
                    	 }
                    	 $scope.empBusiness.push(row={
                                 "accountType": "",
                                 "phone": "",
                                 "email": "",
                                 "empName": ""
                             });
                    	 row["accountType"] = at;
                    	 //at=="phone"?row["phone"]=pe:row["email"]=pe;
                    	 row["email"]=pe;//phone于email公用，前端都叫email
                    	 row["empName"] = nm;
                     }
                 });
            	 
             };
             /**
              * 批量导入
              */
             $scope.getTemplate = function () {
	             var a = document.createElement("a");
				 document.body.appendChild(a);			
				 a.href = 'src/page/usermanager/empmanager/empbatch.xlsx';
				 a.target = "_blank";	
				 a.click();
             }
            /**
             * 当前页面元素与模态框元素字段同步
             * @param shops
             * @returns {Array}
             */
            function convertModalShop(shops) {
                var newShops = [];
                for (var i = 0; i < shops.length; i++) {
                    var shop = {};
                    shop.shopId = shops[i].code;
                    shop.shopName = shops[i].showName;
                    shop.bindFlg = shops[i].bindFlg;
                    newShops.push(shop);
                }

                return newShops;
            }
            function convertModalShop1(shops){
                var newShops1 = [];
                for(var i=0;i<shops.length;i++){
                    var shop = {};
                    shop.code = shops[i].shopId;
                    shop.showName = shops[i].shopName;
                    shop.bindFlg = 1;
                    newShops1.push(shop);
                }
                return newShops1;
            }
            /**
             * 实现规则列表新建页面的跳转
             * @param type
             */
            $scope.createNew = function () {
                register.openTabWithRequest({id: 10025}, {});
            };

            var empInfo = {
                "empInfos": [],
                "sessionId": sessionId
            };
            $scope.submitForm = function () {
                var contactInfo = [];
                var sessionId = $rootScope.sessionId;
                var roleList = $scope.roleList;
                //将选中角色的名字转换为角色id
                for (var a = 0; a < roleList.length; a++) {
                    if ($scope.roleName == roleList[a].showName) {
                        $scope.employeeCreate.roleId = roleList[a].value;
                    }
                }
                if ($scope.changeItems && $scope.changeItems.length > 0) {
                    $scope.employeeCreate.shopIds = $scope.changeItems;
                }
//				var invationEmpVo = {
//				roleId : roleId,
//				shopIds : shoplist,
//				empInfos: contactInfo,
//				//sessionId: sessionId
//			};
                $scope.invationEmpVo = $scope.employeeCreate;
                console.log($scope.invationEmpVo);
                $scope.employeeCreate.empInfos = [];
                //修改员工信息model的格式-->接口格式
                angular.forEach($scope.empBusiness, function (item, index, array) {
                    var curItem = {
                        email: null,
                        phone: null,
                        empName: item.empName
                    };
                    if (item.accountType == 'phone') {
                        curItem.phone = item.email;
                    } else {
                        curItem.email = item.email;
                    }
                    empInfo.empInfos.push(curItem);
                    $scope.employeeCreate.empInfos.push(curItem);
                });
                
                var sub = function () {
                	ajaxService.AjaxPost(empInfo, "userManager/empManager/checkExist.do").then(//验证员工信息的唯一性
                            function (result) {
                                /*console.log(result);
                                if (result.status == 0) {
                                    console.log('参数错误|代码未更新');
                                } else {*/
                                    /*if (result.phoneOrEmailExistFlg == 1) { // 用户名重复
                                        modalService.info({title: '提示', content: '手机或邮箱已存在，请重新输入！', size: 'sm', type: 'confirm'});
                                        return;
                                    } else*/ 
                                    if (result.nameExistFlg == 1) {// 姓名重复
                                        modalService.info({
                                            title: '提示',
                                            content: '姓名已存在，是否继续？',
                                            size: 'sm',
                                            type: 'dialog'
                                        }).then(function (result) {
                                            //提交新增员工信息
                                            ajaxService.AjaxPost($scope.invationEmpVo, "userManager/empManager/create.do").then(
                                                function (result) {
                                                    if (result.status == 1) {
                                                    	modalService.info({title: '提示', content: result.msg, size: 'sm', type: 'confirm'}).then(function (result) {
                                                    		register.switchTab({id: $scope.from});
                                                    	});
                                                    } 
                                                }
                                            );
                                        });
                                    } 
                                    else {
                                        //提交新增员工信息
                                        ajaxService.AjaxPost($scope.invationEmpVo, "userManager/empManager/create.do").then(
                                            function (result) {
                                                if (result.status == 1) {
                                                    //alert("添加成功，系统会自动给您添加的员工发送系统消息，在他们注册进入系统后呈现。");
                                                	modalService.info({title: '提示', content: result.msg, size: 'sm', type: 'confirm'}).then(function (result) {
                                                		register.switchTab({id: $scope.from});
                                                	});
                                                } 
                                            }
                                        );
                                    }
                                }
                            //}
                        );
                        /*
                        if(submitFlg) {
                        alert("名称不能为空！");
                        return;
                        }
                        */
                };
                
                //检查列表中姓名是否重复
                for (var k=0; k<$scope.employeeCreate.empInfos.length; k++) {
                	var thiEmp = $scope.employeeCreate.empInfos[k];
                	for (var p=0; p<$scope.employeeCreate.empInfos.length; p++) {
                    	var othEmp = $scope.employeeCreate.empInfos[p];
                    	if (k != p && thiEmp.empName == othEmp.empName) {
                    		modalService.info({
                                title: '提示',
                                content: '不能输入重复姓名，是否继续？',
                                size: 'sm',
                                type: 'dialog'
                            }).then(function () {
                            	
                            	sub();
                            	
                            });
                    		return;
                    	}
                    }
                }
                
                sub();

            };
        }]);


});

