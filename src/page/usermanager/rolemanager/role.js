/**
 * 角色管理列表
 * @version  v1.0
 * @createTime: 2016-04-25
 * @createAuthor liuzy
 * @updateHistory
 *
 *
 */
define(function (require) {
    var role_css = require("css!role_css");
    var angular = require("angular");
    var zTree_css = require("css!zTree_css");
    var $ = require("jquery");
    var zTree = require("zTree");

    var rtObj = { ctrl: "roleManager", arrFunc: [
            "$scope", //必须引用
            "$rootScope",
            "appConstant",
            "ajaxService",
            "modalService",
            "$timeout",
            "register",
            function ($scope, $rootScope, appConstant, ajaxService,modalService, $timeout,register) {
            	$scope.createOrEdit=-1;//记录是创建或者是修改 1：创建；2：修改。
                $scope.createRole = register.getRoot('新建');
                $scope.editRole = register.getRoot('修改');
                $scope.deleteRole = register.getRoot('删除');
                $scope.updateRole = register.getRoot('修改权限');
                
                //获取sessionId
                var sessionId = $rootScope.sessionId;
                //查询参数
                var testParam1 = {
                    "sessionId" : sessionId
                };
                //定义操作节点type类型
                $scope.type = 3;
                //控制新建输入框开关
                $scope.status = {
                  "open": false
                };

                $scope.roleEdit = {};
                /**
                 * 获取全部角色
                 */
                ajaxService.AjaxPost(testParam1,"usermanager/rolemanager/list.do").then(function(result){
                    if(result){
                        $scope.roles = result.data;
                        if($scope.roles.length>0){
                             $scope.clickedRole=$scope.roles[0];
                             loadAuthority($scope.roles[0].id);
                        }
                        

                    }
                });
                /**
                 * 根据角色加载对应的子系统
                 * @param role
                 */
                $scope.setRole = function(role){
                    $scope.clickedRole = role;
                    loadAuthority(role.id);
                };
                
                /**
                 * 打开创建输入框
                 */
                $scope.openCreate = function(){
                    $scope.status.open = true;
                    $scope.createOrEdit=1;
                    /*$scope.roleEdit = $scope.clickedRole;*/
                };

                /**
                 * 打开编辑输入框
                 */
                $scope.openEdit = function(){
                    $scope.status.open = true;
                    $scope.createOrEdit=2;
                    $scope.roleEdit = angular.copy($scope.clickedRole);
                };
                /**
                 * 关闭编辑输入框
                 */
                $scope.colseEdit= function(){
                	$scope.status.open = false;
                    $scope.roleEdit = {};
                }
                /**
                 * 加载子系统
                 * @param roleId
                 */
                function loadAuthority(roleId){
                    $scope.roleId = roleId;
                    var testParam = {
                        "sessionId": sessionId,
                        "roleId": roleId
                    }
                    ajaxService.AjaxPost(testParam,"usermanager/rolemanager/GetFunctionTree.do").then(function(result){
                        if(result){
                            $scope.menus = result.data;
                             $scope.clickChildSystem = $scope.menus[0];
                            for(var i=0;i< $scope.menus.length;i++){
                                if($scope.menus[i].authority === 1){
                                    $scope.menus[i].authority = true;
                                }else{
                                    $scope.menus[i].authority = false;
                                }
                                $scope.menus[i].$tag = $scope.menus[i].authority;
                                //获取后台管理系统目录树
                                if($scope.menus[i].code==='10001'){
                                    $scope.backManage = $scope.menus[i];
                                    if($scope.clickChildSystem){
                                        if($scope.clickChildSystem.showName===$scope.backManage.showName){
                                            $scope.clickChildSystem = $scope.backManage;
                                        }
                                    }
                                    $scope.backMenuTree = getMenuTrees($scope.backManage.childTree);
                                    $scope.backOperationTree = getOperationTrees($scope.backManage.childTree);
                                    $scope.backSonCount = getAllLastNode($scope.backMenuTree).length;
                                    $scope.backSelectSonCount = getAllSelectNode(getAllLastNode($scope.backMenuTree)).length;
                                    $scope.checkAllBack = ($scope.backSonCount===$scope.backSelectSonCount?true:false);
                                }
                                //获取报表中心目录树
                                if($scope.menus[i].code==='10002'){
                                    $scope.reportManage = $scope.menus[i];
                                     if($scope.clickChildSystem){
                                        if($scope.clickChildSystem.showName===$scope.reportManage.showName){
                                            $scope.clickChildSystem = $scope.reportManage;
                                        }
                                    }
                                    $scope.reportMenuTree = getMenuTrees($scope.reportManage.childTree);
                                    $scope.reportOperationTree = getOperationTrees($scope.reportManage.childTree);
                                    $scope.reportSonCount = getAllLastNode($scope.reportMenuTree).length;
                                    $scope.reportSelectSonCount = getAllSelectNode(getAllLastNode($scope.reportMenuTree)).length;
                                    //if($scope.reportSonCount===$scope.reportSelectSonCount){
                                    //    $scope.checkAllReport = true;
                                    //}else{
                                    //    $scope.checkAllReport = false;
                                    //}
                                    $scope.checkAllReport = ($scope.reportSonCount===$scope.reportSelectSonCount?true:false);
                                }
                                //获取前台软pos目录树
                                if($scope.menus[i].code==='10003'){
                                    $scope.frontManage = $scope.menus[i];
                                      if($scope.clickChildSystem){
                                        if($scope.clickChildSystem.showName===$scope.frontManage.showName){
                                            $scope.clickChildSystem = $scope.frontManage;
                                        }
                                    }
                                    $scope.frontMenuTree = getMenuTrees($scope.frontManage.childTree);
                                    $scope.frontOperationTree = getOperationTrees($scope.frontManage.childTree);
                                    $scope.frontSonCount = getAllLastNode($scope.frontMenuTree).length;
                                    $scope.frontSelectSonCount = getAllSelectNode(getAllLastNode($scope.frontMenuTree)).length;
                                    //if($scope.frontSonCount===$scope.frontSelectSonCount){
                                    //    $scope.checkAllFront = true;
                                    //}else{
                                    //    $scope.checkAllFront = false;
                                    //}
                                    $scope.checkAllFront = ($scope.frontSonCount===$scope.frontSelectSonCount?true:false);
                                }
                            }
                            $.fn.zTree.init($("#backTree"),$scope.backSetting,$scope.backMenuTree);
                            $.fn.zTree.init($("#reportTree"),$scope.reportSetting,$scope.reportMenuTree);
                            $.fn.zTree.init($("#frontTree"),$scope.frontSetting,$scope.frontMenuTree);
                        }
                    });
                }

                /**
                 * 获取所有菜单节点
                 * @param trees
                 * @returns {Array}
                 */
                function getMenuTrees(trees){
                    var menuTrees = [];
                    for(var i=0;i<trees.length;i++){
                        if(trees[i].type !== 3){
                            if(trees[i].authority === 1){
                                trees[i].authority = true;
                            }else{
                                trees[i].authority = false;
                            }
                            trees[i].$tag = trees[i].authority;
                            menuTrees.push(trees[i]);
                        }
                    }
                    return menuTrees;
                }

                /**
                 * 获取所有操作节点
                 * @param trees
                 * @returns {Array}
                 */
                function getOperationTrees(trees){
                    var operationTrees = [];
                    for(var i=0;i<trees.length;i++){

                        if(trees[i].type === 3){
                            if(trees[i].authority === 1){
                                trees[i].authority = true;
                            }else{
                                trees[i].authority = false;
                            }
                            trees[i].$tag = trees[i].authority;
                            operationTrees.push(trees[i]);
                        }
                    }
                    return operationTrees;
                }

                /**
                 * 获取所有最后子节点
                 * @param trees
                 * @returns {Array}
                 */
                function getAllLastNode(trees){
                    var allSonNode = [];
                    for(var i =0;i<trees.length;i++){
                        if(trees[i].type!==3 && findSonNode(trees[i],trees) === false){
                            allSonNode.push(trees[i]);
                        }
                    }
                    return allSonNode;
                }

                /**
                 * 判断当前节点是不是最后节点
                 * @param node
                 * @param trees
                 * @returns {boolean}
                 */
                function findSonNode(node,trees){
                    for(var i =0;i<trees.length;i++){
                        if(node.code === trees[i].fatherCode){
                            return true;
                        }
                    }
                    return false;
                }

                /**
                 * 获取所有被选中的子节点
                 * @param trees
                 * @returns {Array}
                 */
                function getAllSelectNode(trees){
                    var allSelectNode = [];
                    for(var i =0;i<trees.length;i++){
                        if(trees[i].authority === true){
                            allSelectNode.push(trees[i]);
                        }
                    }
                    return allSelectNode;
                }

                //目录树设置
                $scope.setting = {
                    data: {
                        key: {
                            name:"showName",
                            title: "showName",
                            checked:"authority"
                        },
                        simpleData: {
                            enable: true,
                            idKey: "code",
                            pIdKey: "fatherCode",
                            rootPId: null
                        }
                    },
                    check: {
                        enable: true,
                        autoCheckTrigger: true
                    },
                    callback:{
                    },
                    view:{
                        showIcon: false
                    }
                };

                /**
                 * 设置后台管理系统目录树
                 * @type {{treeId: string, data: {key: {name: string, title: string, checked: string}, simpleData: {enable: boolean, idKey: string, pIdKey: string, rootPId: null}}, check: {enable: boolean, autoCheckTrigger: boolean}}|*}
                 */
                $scope.backSetting = angular.copy($scope.setting);
                $scope.backSetting.callback.onClick = function setFilterCode(event, treeId, treeNode){
                    $timeout(function(){
                        if(treeNode){
                            $scope.backFilterCode = treeNode.code;
                            $scope.operationParentNode = treeNode;
                        }
                    });
                };
                $scope.backSetting.callback.onCheck=function changeSonChild(event, treeId, treeNode){
                    $timeout(function(){
                        if(treeNode){
                            for(var i = 0;i<$scope.backOperationTree.length;i++){
                                if($scope.backOperationTree[i].fatherCode === treeNode.code){
                                    $scope.backOperationTree[i].authority = treeNode.authority;
                                }
                            }
                            var backTreeObj = $.fn.zTree.getZTreeObj("backTree");
                            $scope.backMenuTree = removeChildren(backTreeObj.transformToArray(backTreeObj.getNodes()));
                            backTreeObj.destroy();
                            $.fn.zTree.init($("#backTree"),$scope.backSetting,$scope.backMenuTree);
                            $scope.backSelectSonCount = getAllSelectNode(getAllLastNode($scope.backMenuTree)).length;
                            $scope.checkAllBack = ($scope.backSonCount===$scope.backSelectSonCount?true:false);
                        }
                    });
                };
                $scope.checkFatherNode = function(operation){
                    if(operation.authority===true){
                        operation.authority=false;
                    }else{
                        operation.authority=true;
                    }
                    var treeNode = $scope.operationParentNode;
                    var flag = true;
                    var unchecked = 0;
                    var allOp = 0;
                    for(var i = 0;i<$scope.backOperationTree.length;i++){
                        if($scope.backOperationTree[i].fatherCode === treeNode.code){
                            if(!$scope.backOperationTree[i].authority){
                                flag = false;
                                unchecked++;
                            }
                            allOp++;
                        }
                    }
                    var backTreeObj = $.fn.zTree.getZTreeObj("backTree");
                    if(unchecked>0&&unchecked!=allOp){
                       // treeNode.halfCheck = true;
                        backTreeObj.checkNode(treeNode,true);
                    }else if(unchecked==allOp){
                        //treeNode.halfCheck = false;
                        backTreeObj.checkNode(treeNode,false);
                            //treeNode.checked = false;
                    }else{
                        //treeNode.halfCheck = false;
                        backTreeObj.checkNode(treeNode,true);
                            //treeNode.checked = true;
                    }
                };
                /**
                 * 设置报表中心目录树
                 * @type {{treeId: string, data: {key: {name: string, title: string, checked: string}, simpleData: {enable: boolean, idKey: string, pIdKey: string, rootPId: null}}, check: {enable: boolean, autoCheckTrigger: boolean}}|*}
                 */
                $scope.reportSetting = angular.copy($scope.setting);
                $scope.reportSetting.callback.onClick = function setFilterCode(event, treeId, treeNode){
                    $timeout(function(){
                        if(treeNode){
                            $scope.reportFilterCode = treeNode.code;
                            $scope.operationReportParentNode = treeNode;
                        }
                    });
                };
                $scope.reportSetting.callback.onCheck=function changeSonChild(event, treeId, treeNode){
                    $timeout(function(){
                        if(treeNode){
                            for(var i = 0;i<$scope.reportOperationTree.length;i++){
                                if($scope.reportOperationTree[i].fatherCode === treeNode.code){
                                    $scope.reportOperationTree[i].authority = treeNode.authority;
                                }
                            }
                            var reportTreeObj =  $.fn.zTree.getZTreeObj("reportTree");
                            $scope.reportMenuTree = removeChildren(reportTreeObj.transformToArray(reportTreeObj.getNodes()));
                            reportTreeObj.destroy();
                            $.fn.zTree.init($("#reportTree"),$scope.reportSetting,$scope.reportMenuTree);
                            $scope.reportSelectSonCount = getAllSelectNode(getAllLastNode($scope.reportMenuTree)).length;
                            $scope.checkAllReport = ($scope.reportSonCount===$scope.reportSelectSonCount?true:false);
                        }
                    });
                };

                $scope.checkReportFatherNode = function(operation){
                    if(operation.authority===true){
                        operation.authority=false;
                    }else{
                        operation.authority=true;
                    }
                    var treeNode = $scope.operationReportParentNode;
                    var flag = true;
                    var unchecked = 0;
                    var allOp = 0;
                    for(var i = 0;i<$scope.reportOperationTree.length;i++){
                        if($scope.reportOperationTree[i].fatherCode === treeNode.code){
                            if(!$scope.reportOperationTree[i].authority){
                                flag = false;
                                unchecked++;
                            }
                            allOp++;
                        }
                    }
                    var backTreeObj = $.fn.zTree.getZTreeObj("reportTree");
                    if(unchecked>0&&unchecked!=allOp){
                        // treeNode.halfCheck = true;
                        backTreeObj.checkNode(treeNode,true);
                    }else if(unchecked==allOp){
                        //treeNode.halfCheck = false;
                        backTreeObj.checkNode(treeNode,false);
                        //treeNode.checked = false;
                    }else{
                        //treeNode.halfCheck = false;
                        backTreeObj.checkNode(treeNode,true);
                        //treeNode.checked = true;
                    }
                };
                /**
                 * 设置前台软pos目录树
                 * @type {{treeId: string, data: {key: {name: string, title: string, checked: string}, simpleData: {enable: boolean, idKey: string, pIdKey: string, rootPId: null}}, check: {enable: boolean, autoCheckTrigger: boolean}}|*}
                 */
                $scope.frontSetting = angular.copy($scope.setting);
                $scope.frontSetting.callback.onClick = function setFilterCode(event, treeId, treeNode){
                    $timeout(function(){
                        if(treeNode){
                            $scope.frontFilterCode = treeNode.code;
                            $scope.operationFrontParentNode = treeNode;
                        }
                    });
                };
                $scope.frontSetting.callback.onCheck=function changeSonChild(event, treeId, treeNode){
                    $timeout(function(){
                        if(treeNode){
                            for(var i = 0;i<$scope.frontOperationTree.length;i++){
                                if($scope.frontOperationTree[i].fatherCode === treeNode.code){
                                    $scope.frontOperationTree[i].authority = treeNode.authority;
                                }
                            }
                            var frontTreeObj =  $.fn.zTree.getZTreeObj("frontTree");
                            $scope.frontMenuTree = removeChildren(frontTreeObj.transformToArray(frontTreeObj.getNodes()));
                            frontTreeObj.destroy();
                            $.fn.zTree.init($("#frontTree"),$scope.frontSetting,$scope.frontMenuTree);
                            $scope.frontSelectSonCount = getAllSelectNode(getAllLastNode($scope.frontMenuTree)).length;
                            $scope.checkAllFront = ($scope.frontSonCount===$scope.frontSelectSonCount?true:false);
                        }
                    });
                };
                $scope.checkFrontFatherNode = function(operation){
                    if(operation.authority===true){
                        operation.authority=false;
                    }else{
                        operation.authority=true;
                    }
                    var treeNode = $scope.operationFrontParentNode;
                    var flag = true;
                    var unchecked = 0;
                    var allOp = 0;
                    for(var i = 0;i<$scope.frontOperationTree.length;i++){
                        if($scope.frontOperationTree[i].fatherCode === treeNode.code){
                            if(!$scope.frontOperationTree[i].authority){
                                flag = false;
                                unchecked++;
                            }
                            allOp++;
                        }
                    }
                    var backTreeObj = $.fn.zTree.getZTreeObj("reportTree");
                    if(unchecked>0&&unchecked!=allOp){
                        // treeNode.halfCheck = true;
                        backTreeObj.checkNode(treeNode,true);
                    }else if(unchecked==allOp){
                        //treeNode.halfCheck = false;
                        backTreeObj.checkNode(treeNode,false);
                        //treeNode.checked = false;
                    }else{
                        //treeNode.halfCheck = false;
                        backTreeObj.checkNode(treeNode,true);
                        //treeNode.checked = true;
                    }
                };

                /**
                 * 删除组件生成的children字段
                 * @param arr
                 * @returns {*}
                 */
                function removeChildren( arr){
                    for( var i = 0 ; i < arr.length ; i++ ){
                       if(arr[i].children){
                           delete arr[i].children
                       }
                    }
                    return arr;
                }
                ///**
                // * 获取全部子节点数
                // * @param allMenus
                // * @returns {Array}
                // */
                //function getAllCount(allMenus){
                //    var result = new Array();
                //    var result1 = new Array();
                //    if(allMenus&&allMenus.childTree&&allMenus.childTree.length>0){
                //        for(var i = 0;i<allMenus.childTree.length;i++){
                //            if(allMenus.childTree[i].childTree&&allMenus.childTree[i].childTree.length>0 &&allMenus.childTree[i].type !== 3){
                //                var add = getAllCount(allMenus.childTree[i]);
                //                result = result1.concat(add);
                //                result1 = result;
                //            }else{
                //                if(allMenus.childTree[i].type !== 3) {
                //                    result.push(allMenus.childTree[i]);
                //                } else {
                //                    result.push(allMenus);
                //                    break;
                //                }
                //            }
                //        }
                //    }else{
                //        return result;
                //    }
                //    return result;
                //}
                //function getAllSelectCount(result){
                //    var arr = [];
                //    if(result&&result.length>0){
                //        for(var i=0;i<result.length;i++){
                //            if(result[i].authority === 1){
                //                arr.push(result[i]);
                //            }
                //        }
                //    }
                //    return arr;
                //
                //}
                /**
                 * 加载菜单
                 * @param childSystem
                 */
                $scope.openMenus = function(childSystem){

                    $scope.clickChildSystem = childSystem;
                };

                /**
                 *  操作全部checkbox
                 */
                $scope.checkAllBackManage = function(){
                    if($scope.checkAllBack===true){
                        $scope.checkAllBack=false;
                    }else{
                        $scope.checkAllBack=true;
                    }
                   //$scope.checkAllBack = checkAll;
                    var backTreeObj = $.fn.zTree.getZTreeObj("backTree");
                    backTreeObj.checkAllNodes($scope.checkAllBack);
                    $scope.backMenuTree = removeChildren(backTreeObj.transformToArray(backTreeObj.getNodes()));
                    backTreeObj.destroy();
                    $.fn.zTree.init($("#backTree"),$scope.backSetting,$scope.backMenuTree);
                    $scope.backSelectSonCount = getAllSelectNode(getAllLastNode($scope.backMenuTree)).length;
                };
                /**
                 *  操作全部checkbox
                 */
                $scope.checkAllReportManage = function(){
                    if($scope.checkAllReport===true){
                        $scope.checkAllReport=false;
                    }else{
                        $scope.checkAllReport=true;
                    }
                    var reportTreeObj = $.fn.zTree.getZTreeObj("reportTree");
                    reportTreeObj.checkAllNodes($scope.checkAllReport);
                    $scope.reportMenuTree = removeChildren(reportTreeObj.transformToArray(reportTreeObj.getNodes()));
                    reportTreeObj.destroy();
                    $.fn.zTree.init($("#reportTree"),$scope.reportSetting,$scope.reportMenuTree);
                    $scope.reportSelectSonCount = getAllSelectNode(getAllLastNode($scope.reportMenuTree)).length;
                };
                /**
                 *  操作全部checkbox
                 */
                $scope.checkAllFrontManage = function(){
                    if($scope.checkAllFront===true){
                        $scope.checkAllFront=false;
                    }else{
                        $scope.checkAllFront=true;
                    }
                    var frontTreeObj = $.fn.zTree.getZTreeObj("frontTree");
                    frontTreeObj.checkAllNodes($scope.checkAllFront);
                    $scope.frontMenuTree = removeChildren(frontTreeObj.transformToArray(frontTreeObj.getNodes()));
                    frontTreeObj.destroy();
                    $.fn.zTree.init($("#frontTree"),$scope.frontSetting,$scope.frontMenuTree);
                    $scope.frontSelectSonCount = getAllSelectNode(getAllLastNode($scope.frontMenuTree)).length;
                };




                /**
                 * 保存角色权限的设置
                 */
                $scope.saveAuthority = function(){
                    //定义改变的权限的设置数组
                    var authorityList = [];
                    //判断后台管理根节点时候改变
                    if($scope.backSelectSonCount===0){
                        $scope.backManage.authority =false;
                    }else{
                        $scope.backManage.authority = true;
                    }
                    if($scope.backManage.authority !== $scope.backManage.$tag){
                        var author = {};
                        author.roleId = $scope.roleId;
                        author.functionId = $scope.backManage.code;
                        author.functionFlg = $scope.backManage.authority===true?1:0;
                        authorityList.push(author);
                    }
                    //判断报表根节点是否改变
                    if($scope.reportSelectSonCount === 0){
                        $scope.reportManage.authority = false;
                    }else{
                        $scope.reportManage.authority = true;
                    }
                    if($scope.reportManage.authority !== $scope.reportManage.$tag){
                        var author = {};
                        author.roleId = $scope.roleId;
                        author.functionId = $scope.reportManage.code;
                        author.functionFlg = $scope.reportManage.authority===true?1:0;
                        authorityList.push(author);
                    }
                    //判断软pos系统根节点时候改变
                    if($scope.frontSelectSonCount === 0){
                        $scope.frontManage.authority = false;
                    }else{
                        $scope.frontManage.authority = true;
                    }
                    if($scope.frontManage.authority !== $scope.frontManage.$tag){
                        var author = {};
                        author.roleId = $scope.roleId;
                        author.functionId = $scope.frontManage.code;
                        author.functionFlg = $scope.frontManage.authority===true?1:0;
                        authorityList.push(author);
                    }
                    getChangeAuthority($scope.backMenuTree,authorityList);
                    getChangeAuthority($scope.reportMenuTree,authorityList);
                    getChangeAuthority($scope.frontMenuTree,authorityList);
                    getChangeAuthority($scope.backOperationTree,authorityList);
                    getChangeAuthority($scope.reportOperationTree,authorityList);
                    getChangeAuthority($scope.frontOperationTree,authorityList);
                    window.console.log(authorityList);
                    var param = {
                        sessionId: sessionId,
                        roleId:$scope.roleId,
                        functions:authorityList
                    };
                    ajaxService.AjaxPost(param,"usermanager/rolemanager/edit.do").then(function(result){
                        if(result&&result.status===1){
                            modalService.info({title:'提示', content:'保存成功！', size:'sm', type: 'ok'});
                            //loadAuthority( $scope.clickedRole.id);
                        }
                    })

                };
                /**
                 * 获取改变过的权限
                 * @param arr
                 * @param arr2
                 */
                function getChangeAuthority(arr,arr2){
                    for(var i= 0;i<arr.length;i++){
                        if(arr[i].authority !== arr[i].$tag){
                            var author = {};
                            author.roleId = $scope.roleId;
                            author.functionId = arr[i].code;
                            author.functionFlg = arr[i].authority===true?1:0;
                            arr2.push(author);
                        }
                    }
                }

                /**
                 * 编辑角色
                 *
                 */
                $scope.editRole = function(){

                    var editParam = {
                        "sessionId": sessionId,
                        "createOrEdit":$scope.createOrEdit, //1：创建；2：修改。
                        "roleName": $scope.roleEdit.name,
                        "roleId": $scope.roleEdit.id
                    };
                    ajaxService.AjaxPost(editParam,"usermanager/rolemanager/edit.do").then(function(result){
                        if(result && result.status){
                            ajaxService.AjaxPost(testParam1,"usermanager/rolemanager/list.do").then(function(result){
                                if(result){
                                    $scope.roles = result.data;
                                    
                                    $scope.status.open = false;
                                    $scope.createOrEdit=-1;
                                    $scope.setRole($scope.roleEdit);
                                    $scope.roleEdit = {};
                                }
                            });
                            
                        }
                    });
                };
                /**
                 * 删除角色
                 */
                $scope.deleteRole = function(){
                    modalService.info({title:'提示', content:'确定要删除角色'+$scope.clickedRole.name+'吗？', size:'sm', type: 'todo'}).then(function() {
                        var deleteParam = {
                            "sessionId": sessionId,
                            "roleId": $scope.clickedRole.id
                        };
                        ajaxService.AjaxPost(deleteParam, "usermanager/rolemanager/delete.do").then(function (result) {
                            if (result) {
                                modalService.info({content: '删除成功！', type: 'ok',delay: 1000});
                                ajaxService.AjaxPost(testParam1, "usermanager/rolemanager/list.do").then(function (result) {
                                    if (result) {
                                        $scope.roles = result.data;
                                        $scope.status.open = false;
                                    }
                                });
                            }
                        });
                    });
                };


            }
        ]
    };

    return rtObj;
});

