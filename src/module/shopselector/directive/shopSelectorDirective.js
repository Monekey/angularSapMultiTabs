/**
 * 门店选择模态框
 * @version  v1.0
 * @createAuthor Liuzy
 * @createTime: 2016-04-21
 * @updateHistory
 */
define(['ngAjaxService','angular','jquery','zTree','css!shop_selector_css','css!zTree_css'],function (ngAjaxService, angular,$,zTree) {
  var module= angular.module("ajaxmodule");

    //自定义门店选择器factory
    ngAjaxService.factory('shopSelectorService', [
        '$uibModal',
        '$q',
        function ($uibModal,$q) {
            return {
                /**
                 * 开启模态框方法
                 * @param initItems从数据库加载的最原始关联对象数组
                 * @param currentItems当前页面关联对象数组
                 * @returns {*}
                 */
                openShopModal: function (paramSet) {
                    var deferred = $q.defer();
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'resources/module/shopselector/template/shopSelector.html',
                        controller: 'shopSelectorController',
                        size: 'lg',
                        resolve: {
                            //将当前页面的值传给模态框
                            paramSet: function () {

                                return paramSet;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        //将模态框的值传给当前页面
                        deferred.resolve(result);

                     });
                    return deferred.promise;
                }
            }
        }]);
    //modal factory 加载模板对应的controller
    module.controller('shopSelectorController',[
        "$scope","$rootScope","ajaxService","paramSet", "$uibModalInstance","$timeout",
        function($scope,$rootScope,ajaxService,paramSet,$uibModalInstance,$timeout){

            $scope.paramSet = paramSet;
            //获取sessionID
            var sessionId = $rootScope.sessionId;
            $scope.modalTitle =  $scope.paramSet.title? $scope.paramSet.title:"选择窗口";
            loadDatas($scope.paramSet);
            function loadDatas(dataSet){
                if(dataSet.serviceType==="shop"){
                    //定义品牌请求参数
                    var testParam1 = {
                        //showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
                        showFlg : dataSet.showFlg?dataSet.showFlg:1,
                        //1按照品牌，2按照城市
                        type: dataSet.shop.brand,
                        sessionId : sessionId
                    };

                    //定义城市请求参数
                    var testParam2 = {
                        //showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
                        showFlg : dataSet.showFlg?dataSet.showFlg:1,
                        //1按照品牌，2按照城市
                        type: dataSet.shop.city,
                        sessionId : sessionId
                    };
                    /**
                     * 按品牌获取门店列表结构
                     */
                    ajaxService.AjaxPost( testParam1, paramSet.shop.ajaxUrl ).then(function( res ){
                        $scope.brandList = res.data;
                        for(var i=0;i< $scope.brandList.length;i++){
                            $scope.brandItems = $scope.brandItems.concat($scope.brandList[i].shopBrandBeans);
                        }
                        $scope.brandItems = addTag($scope.brandItems);
                        $scope.brandItems = changeOperationItems($scope.brandItems, operationInitItems,operationCurrentItems);
                        $scope.operationItems = $scope.brandItems;
                        if($scope.brandList){
                            $.fn.zTree.init($("#brand"),$scope.brandSetting,$scope.brandList);
                        }
                    });

                    /**
                     * 按城市获取门店列表结构
                     */
                    ajaxService.AjaxPost( testParam2, paramSet.shop.ajaxUrl ).then(function( res ){
                        $scope.tree = res;
                        $scope.cityItems = $scope.tree.data.data;
                        $scope.cityItems = addTag($scope.cityItems);
                        $scope.cityItems = changeOperationItems($scope.cityItems, operationInitItems,operationCurrentItems);
                        //统计每个节点的门店数
                        calculateLeafNum( $scope.tree.data.treeList );
                        if($scope.tree.data.treeList){
                            $.fn.zTree.init($("#shop"),$scope.shopSetting,$scope.tree.data.treeList);
                        }

                    });
                }
                if(dataSet.serviceType==="terminal"){
                    var terminalParam = {
                        showFlg : dataSet.showFlg?dataSet.showFlg:1,
                        sessionId : sessionId
                    };
                    /**
                     * 按终端列表结构
                     */
                    ajaxService.AjaxPost( terminalParam, paramSet.terminal.ajaxUrl ).then(function( res ){
                        $scope.tree = res;
                        $scope.terminalItems = $scope.tree.data.data;
                        $scope.terminalItems = addTag($scope.terminalItems);
                        $scope.terminalItems = changeOperationItems($scope.terminalItems, operationInitItems,operationCurrentItems);
                        $scope.operationItems = angular.copy($scope.terminalItems);
                        //window.console.log( $scope.operationItems);
                        calculateLeafNum( $scope.tree.data.treeList );
                        if($scope.tree.data.treeList){
                            $.fn.zTree.init($("#terminal"),$scope.terminalSetting,$scope.tree.data.treeList);
                        }



                    });
                }
            }


            var operationInitItems = angular.copy($scope.paramSet.initItems);
            operationInitItems = addTag(operationInitItems);
            var operationCurrentItems = angular.copy($scope.paramSet.currentItems);
            operationCurrentItems = addTag(operationCurrentItems);

            /**
             * 切换按门店还是按品牌选择列表
             * @type {number}
             */
            $scope.status = 1;
            $scope.switchSelectTab = function(type){
                $scope.filterCode = undefined;
                if(type){
                    $scope.status = type;
                }
                if($scope.status===1){
                    $scope.operationItems = angular.copy($scope.brandItems);
                }
                if($scope.status===2){
                    $scope.operationItems = angular.copy($scope.cityItems);
                }
                $scope.currentBrand = {};
                $scope.clickedItem = {};
            };

            $scope.brandItems = [];
            $scope.cityItems = [];
            $scope.terminalItems=[];


            ///**
            // *点击每个节点显示对应的门店，并将当前已选列表与模态框备选列表做重组，分出已选备选
            // * @param item
            // */
            //$scope.itemClicked = function( item ){
            //    $scope.clickedItem = item;
            //    $scope.filterCode = item.code;
            //
            //};
            ///**
            // *点击每个节点显示对应的门店，并将当前已选列表与模态框备选列表做重组，分出已选备选
            // * @param item
            // */
            //$scope.itemBrandClicked = function( item ){
            //    $scope.currentBrand = item;
            //    $scope.filterCode = item.brandId;
            //};

            /**
             * 改变可选数组的初始状态
             * @param arr0
             * @param arr1
             * @param arr2
             * @returns {*}
             */
            function changeOperationItems(arr0, arr1, arr2){
                    for(var i = 0; i < arr0.length ; i++){
                        var index1 = checkArray(arr1,arr0[i]);
                        var index2 = checkArray(arr2,arr0[i]);
                        if(index1 !== -1 && index2 == -1){
                            arr0[i].$selectTag = arr1[index1].$selectTag;
                        }
                        if(index1 == -1 && index2 !== -1){
                            arr0[i].bindFlg = arr2[index2].bindFlg;
                        }
                        if(index1 !== -1 && index2 !== -1){
                            arr0[i].bindFlg = arr1[index1].bindFlg;
                            arr0[i].$selectTag = arr1[index1].$selectTag;
                        }
                    }

                return arr0;
            }


            /**
             * 为每个表格添加一个标记字段，为后续只拿到变化的表格字段做辅助操作用
             * @param datas
             * @returns {*}
             */
            function addTag(datas){
                if(datas&&datas.length>0){
                    for(var i = 0;i<datas.length; i++){
                        if(!datas[i].$selectTag){
                            datas[i].$selectTag = datas[i].bindFlg;
                        }
                        if(!datas[i].$clickTag){
                            datas[i].$clickTag = 0;
                        }
                    }
                }

                return datas;
            }

            $scope.itemCheckedChanged = function( item ){
                console.log( item );
            };

            $scope.optionalSearch = "";
            $scope.setSearchOptionalValue = function(value){
                $scope.inputOptional = value;
            };
            $scope.selectedSearch = "";
            $scope.setSearchSelectedValue = function(value){
                $scope.inputSelected = value;
            };
            //全部已选元素
            var allSelectedItems = [];
            //改变过的元素
            var changeItems = [];
            $scope.itemSelected = [];
            /**
             * 选中要移动的门店
             * @param item
             */
            $scope.selectItem = function(item){
                if(item.$clickTag !== 1){
                    item.$clickTag = 1;
                }else{
                    item.$clickTag = 0;
                }
                var index = checkArray($scope.itemSelected,item);
                if(index ==-1){
                    $scope.itemSelected.push(item);
                }else{
                    $scope.itemSelected.splice(index,1);
                }
            };
            /**
             * 向右移动一个元素，即选择该元素
             */
            $scope.moveToRight = function(){
                var unbindAbleFlag = 1;
                moveMulti(unbindAbleFlag);
            };

            /**
             * 向左移动一个元素，即不选择该元素
             */
            $scope.moveToLeft = function(){
                var bindAbleFlag = 0;
                moveMulti(bindAbleFlag);
            };
            /**
             * 将备选元素全部移动到已选表
             */
            $scope.moveAllToRight = function(){
                var unbindAbleFlag = 1;
                moveAll($scope.operationItems, unbindAbleFlag);

            };

            /**
             *将全部已选元素移入备选表
             */
            $scope.moveAllToLeft = function(){
                var bindAbleFlag = 0;

                moveAll($scope.operationItems, bindAbleFlag);
            };

            /**
             * 移动一个元素具体操作
             * @param arr
             * @param flag
             */
            function moveMulti(flag){
                for(var i = 0;i<$scope.itemSelected.length;i++){
                    var index = checkArray($scope.operationItems,$scope.itemSelected);
                    if(index!==-1){
                        $scope.operationItems[index].bindFlg = flag;
                    }

                    $scope.itemSelected[i].bindFlg = flag;
                    $scope.itemSelected[i].$clickTag = 0;
                }
                    $scope.itemSelected = [];
            }

            /**
             * 移动全部元素具体操作
             * @param arr
             * @param flag
             */
            function moveAll(arr, flag){
                if(!$scope.filterCode){
                    return
                }else{
                    if($scope.paramSet.serviceType==="shop"&&$scope.status === 1){
                        if($scope.status === 1){
                            for(var i=0;i<arr.length;i++){
                                if(arr[i].brandId === $scope.filterCode){
                                    if(arr[i].bindFlg !== flag){
                                        arr[i].bindFlg = flag;
                                        arr[i].$clickTag = 0;
                                    }
                                }
                            }
                        }
                    }else{
                         for(var i=0;i<arr.length;i++){
                            for(var j=0;j<arr[i].leftIds.length;j++){
                                if(arr[i].leftIds[j]===$scope.filterCode){
                                    if(arr[i].bindFlg !== flag){
                                        arr[i].bindFlg = flag;
                                        arr[i].$clickTag = 0;
                                    }
                                }
                            }
                        }
                    }
                }
                $scope.itemSelected = [];
            }

            /**
             * 模态框确定操作，并将变化的元素传回当前页面
             */
            $scope.confirmSelect = function(){
                var returnItem = {};
                changeItems = getAllChangeItems();
                allSelectedItems = getAllSelectedItems(operationInitItems,changeItems);
                returnItem.allSelectedItems = removeTag(allSelectedItems);
                returnItem.changeItems = removeTag(changeItems);
                $uibModalInstance.close(returnItem);
                changeItems = [];
            };

            /**
             * 清空本地无用标签
             * @param arr
             * @returns {*}
             */
            function removeTag(arr){
                for(var i = 0;i<arr.length;i++){
                    delete arr[i].$selectTag;
                    delete arr[i].$clickTag;
                }
                return arr;
            }
            /**
             * 获取全部变化的元素
             * @returns {Array}
             */
            function getAllChangeItems(){
                var items = [];
                for(var i=0;i<$scope.operationItems.length;i++){
                    if($scope.operationItems[i].bindFlg !== $scope.operationItems[i].$selectTag){
                        items.push($scope.operationItems[i]);
                    }
                }
                return items;
            }

            /**
             * 获取全部已选中的元素
             * @param arr1
             * @param arr2
             * @returns {Array}
             */
            function getAllSelectedItems(arr1,arr2){
                var newArr1 = angular.copy(arr1);
                var newArr2 = angular.copy(arr2);
                var lastArr = [];
                for(var i = 0;i<arr1.length;i++){
                    var isSame = false;
                    for(var j=0;j<arr2.length;j++){
                        if(arr1[i].code === arr2[j].code){
                            var index1 = checkArray(newArr2,arr2[j]);
                            if(index1 !==-1){
                                newArr2.splice(index1,1);
                                isSame =true;
                            }

                        }
                    }
                    if(isSame === true){
                        var index2 = checkArray(newArr1,arr1[i]);
                        if(index2!==-1){
                            newArr1.splice(index2,1);
                        }

                    }
                }

                lastArr = newArr1.concat(newArr2);

                return lastArr;

            }
            /**
             * 取消选择关闭模态框
             */
            $scope.cancelSelect = function(){
                $uibModalInstance.dismiss('cancel');
                changeItems = [];
            };
            /**
             * 检测操作的item和数组里的item是否含有相同code值
             * @param arr
             * @param item
             * @returns {number}
             */
            function checkArray(arr, item){
                if(arr&&arr.length>0){
                    for( var i = 0 ; i < arr.length ; i++ ){
                        if( arr[i].code == item.code ){
                            return i;
                        }
                    }
                }

                return -1;
            }
            /**
             * 统计节点含有门店的数量
             * @param object
             */
            function calculateLeafNum( object ){
                var loop = 0;
                object.leafGroup = [];
                object.leafNum = loopData( object );
                for ( loop = 0; loop < object.childTree.length; loop++ )
                {
                    if ( object.childTree[ loop ].childTree ){
                        calculateLeafNum( object.childTree[ loop ] );
                    }else{
                        object.childTree[ loop ].leafGroup = [];
                        object.childTree[ loop ].leafNum = loopData( object.childTree[ loop ] )
                    }
                }
            }

            /**
             * 为每一个节点计算叶子节点数
             * @param codeObj
             * @returns {number}
             */
            function loopData( codeObj ){
                var code = codeObj.code;
                var num = 0;
                for (var i = $scope.tree.data.data.length - 1; i >= 0; i--) {
                    if( inArray( $scope.tree.data.data[i].leftIds,code ) !== -1 ){
                        codeObj.leafGroup.push( $scope.tree.data.data[i] );
                        num ++;
                    }
                };
                return num;
            }

            /**
             * 判断元素是否存在在数组中
             * @param arr
             * @param item
             * @returns {number}
             */
            function inArray( arr,item ){
                if(arr&&arr.length>0){
                    for( var i = 0 ; i < arr.length ; i++ ){
                        if( arr[i] == item ){
                            return i;
                        }
                    }
                }

                return -1;
            }
            $scope.myFilter = function(item){
                if($scope.paramSet.serviceType==="shop"&&$scope.status === 1){
                        return item.brandId === $scope.filterCode
                }else{
                    return inArray(item.leftIds,$scope.filterCode)!==-1
                }
            };
            //目录树设置
            $scope.terminalSetting = {
                data: {
                    key: {
                        children: "childTree",
                        name:"showName",
                        title: "showName"
                    }
                },
                callback:{
                    onClick:function setFilterCode(event, treeId, treeNode){
                        $timeout(function(){
                            if(treeNode){
                                $scope.filterCode = treeNode.code;
                            }
                        });
                    }
                },
                view:{
                    showIcon: false,
                    addDiyDom: addDiyDom
                }
            };
            //目录树设置
            $scope.shopSetting = {
                data: {
                    key: {
                        children: "childTree",
                        name:"showName",
                        title: "showName"
                    }
                },
                callback:{
                    onClick:function setFilterCode(event, treeId, treeNode){
                        $timeout(function(){
                            if(treeNode){
                                $scope.filterCode = treeNode.code;
                            }
                        });
                    }
                },
                view:{
                    showIcon: false,
                    addDiyDom: addDiyDom
                }
            };
            //目录树设置
            $scope.brandSetting = {
                data: {
                    key: {
                        name:"brandName",
                        title: "brandName"
                    },
                    simpleData: {
                        enable: true,
                        idKey: "brandId"
                    }
                },
                callback:{
                    onClick:function setFilterCode(event, treeId, treeNode){
                        $timeout(function(){
                            if(treeNode){
                                $scope.filterCode = treeNode.brandId;
                            }
                        });
                    }
                },
                view:{
                    showIcon: false,
                    addDiyDom: addDiyBrandDom
                }
            };
            function addDiyDom(treeId, treeNode) {
                var aObj = $("#" + treeNode.tId + "_a");
                if ($("#diySpan_"+treeNode.code).length>0) return;
                var editStr = "<span id='diySpan_space_" +treeNode.code+ "' style='color:#666;' ></span>";
                aObj.append(editStr);
                $("#diySpan_space_"+treeNode.code).html("("+treeNode.leafNum+")");

            }

            function addDiyBrandDom(treeId, treeNode){
                var aObj = $("#" + treeNode.tId + "_a");
                if ($("#diySpan_"+treeNode.brandId).length>0) return;
                var editStr = "<span id='diySpan_space_" +treeNode.brandId+ "'style='color:#666;' ></span>";
                aObj.append(editStr);
                $("#diySpan_space_"+treeNode.brandId).html("("+treeNode.shopBrandBeans.length+")");
            }

        }]);

    return module;
});
