/**
 * 卡型规则编辑页面
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor liuzy
 * @updateHistory
 *
 *
 */
define(function( require ){
    var app = require("app");
    var angular = require("angular");
    var shopselector = require("shopSelector");
    var savingSelectorCtrl = require( "memberequity/cardtype/savingSelector" );
    var savingSelectorTemp = require( "text!memberequity/cardtype/savingSelector.html" );
    var scoreSelectorCtrl = require( "memberequity/cardtype/scoreSelector" );
    var scoreSelectorTemp = require( "text!memberequity/cardtype/scoreSelector.html" );
    var exchangeSelectorCtrl = require( "memberequity/cardtype/exchangeSelector" );
    var exchangeSelectorTemp = require( "text!memberequity/cardtype/exchangeSelector.html" );
    app.ngAMDCtrlRegister.controller( "cardTypeCreate",["$scope","$rootScope","ajaxService",'register','shopSelectorService','$uibModal','modalService',function( $scope,$rootScope,ajaxService,register,shopSelectorService,$uibModal,modalService ){
        $scope.from = $rootScope.TabsData.from;
        var sessionId = $rootScope.sessionId;
            //定义panel开启关闭标记
            $scope.status = {
                "score": false,
                "exchange": false,
                "recharge": false,
                "limit": false,
                "remind": false
            };
        /**
         * 定义开启panel的方法，防止事件冒泡
         * @param type
         */
        $scope.openPanel = function(type){
            if(type==="score"){
                $scope.status.score = true;
            }
            if(type==="exchange"){
                $scope.status.exchange = true;
            }
            if(type==="recharge"){
                $scope.status.recharge = true;
            }
            if(type==="limit"){
                $scope.status.limit = true;
            }
            if(type==="remind"){
                $scope.status.remind = true;
            }
            var event = window.event||event;
            if( document.all){
                event.cancelBubble = true;
            }else{
                event.stopPropagation();
            }
        };

        //定义表格中需要转换显示的内容
        $scope.scoreWay = {"0":"按金额","1":"按操作"};
        $scope.exchangeWay = {"0":"电子券","1":"实物"};
        $scope.savingWay = {"0":"线上储值","1":"线下储值"};

        $scope.cardTypeEdit = {
            "baseInfo":{},
            "scoreSet":{},
            "relSavingRules":[],
            "relExchangeRules":[],
            "limitSet":{}
        };
        //初始化数据
        $scope.relSavingRules=[];
        $scope.scoreSet={};
        $scope.scoreSet.relScoreRules=[];
        $scope.relExchangeRules=[];
        
       
       
        /**
         * 监听有效限制panel状态，加载限制列表数据
         */
        $scope.$watch("status.limit",function(limit){
            if(limit && limit === true){
                ajaxService.AjaxPost({"sessionId": sessionId}, 'memberequity/cardtype/limitSet.do').then(function (result) {
                    if(result){
                        $scope.limitSet = result.limitSet;
                    }
                })
            }
        });

        /**
         * 为每个表格添加一个标记字段，为后续只拿到变化的表格字段做辅助操作用
         * @param datas
         * @returns {*}
         */
        function addSelectTag(datas){
            for(var i = 0;i<datas.length; i++){
                datas[i].$selectTag = datas[i].isBound;
            }
            return datas;
        }

        $scope.tables = [{"id":1,"name":"dsfgfd"},{"id":2,"name":"dsfgfd"},{"id":3,"name":"dsfgfd"},{"id":4,"name":"dsfgfd"},
            {"id":5,"name":"dsfgfd"},{"id":6,"name":"dsfgfd"},{"id":7,"name":"dsfgfd"},{"id":8,"name":"dsfgfd"},
            {"id":9,"name":"dsfgfd"},{"id":10,"name":"dsfgfd"},{"id":11,"name":"dsfgfd"},{"id":12,"name":"dsfgfd"}];

        //创建清零日期选择器数据，需要单独选择月和日，根据月份不同，得到当月的天数
        $scope.months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        $scope.days = getDays(new Date().getMonth());
        /**
         *  根据月数的变化，获取当月的天数
         * @param month
         */
        $scope.changeMonth = function(month){
            $scope.days = getDays(month);
        };
        /**
         * 获取天数的具体操作
         * @param month
         * @returns {Array}
         */
        function getDays(month){
            var days = [];
            var date = new Date(new Date().getFullYear(),month,0);
            var daysCount = date.getDate();
            for(var i=1;i<=daysCount;i++){
                days.push(i<10?"0"+i:i+"");
            }
            return days;
        }

  
        /**
         * 根据id判断该对象是否存在在当前数组中
         * @param arr
         * @param item
         * @returns {number}
         */
        function inArray( arr,item ){
            for( var i = 0 ; i < arr.length ; i++ ){
                if( arr[i].id == item.id ){
                    return i;
                }
            }
            return -1;
        }

        function getCurrentTabId(){
            var tabs = $rootScope.tabs;
            for(var i=0;i<tabs.length;i++){
                if(tabs[i].ng_show===true){
                    return tabs[i].id;
                }
            }
            return $scope.from;
        }
        var currentTabId = getCurrentTabId();
        //创建新建积分规则的tab
        var newScoreTab = {
            title:"新建积分规则",
                id:"newScoreRule",
                template:"memberequity/scorerule/newScoreRule.html",
                ctrlName:"newScoreRule",
                ctrl: 'memberequity/scorerule/newScoreRule',
                from: currentTabId,
                type: 'multiple',
                ng_show:false
        };
        //创建新建兑换规则的tab
        var newExcahngeTab = {
            title:"新建兑换规则",
                id:"newExchangeRule",
                ctrlName:"newExchangeRule",
                ctrl: 'memberequity/exchangerule/newExchangeRule',
                template:"memberequity/exchangerule/newExchangeRule.html",
                from: currentTabId,
                type: 'multiple',
                ng_show:false
        };
        //创建新建储值规则的tab
        var newRechargeTab = {
            title:"新建储值规则",
                id:"newSavingRule",
                ctrl:"memberequity/savingrule/newSavingRule",
                ctrlName:"newSavingRule",
                template:"memberequity/savingrule/newSavingRule.html",
                from:currentTabId,
                type: 'multiple',
                ng_show:false
        };
        /**
         * 实现规则列表新建页面的跳转
         * @param type
         */

        $scope.createNew = function (type) {
            if(type){
                if(type === 'score'){
                    register.addToTabs(newScoreTab, {callback:function a(){
                        //$scope.pageChanged();
                    }});
                }
                if(type === 'exchange'){
                    register.addToTabs(newExcahngeTab, {callback:function a(){
                        //$scope.pageChanged();
                    }});
                }
                if(type === 'recharge'){
                    register.addToTabs(newRechargeTab, {callback:function a(){
                        //$scope.pageChanged();
                    }});
                }
            }
        };

        /**
         * 开启门店选择模态框
         */
        $scope.showModal = function() {
            //将当前对象转换成对应模态框的对象的字段
            //showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
            var showFlg = 1;
            //模态框需要传入两个值，一个是最初始的数据库加载的选中对象数组，创建的时候初始数组为空
            var initItems = [];
            //模态框需要传入两个值，一个是当前页面显示的对象数组
            var currentItems = $scope.limitSet.relShops;
            /**
             * 模态框参数，serviceType可以为门店shop，可以为终端terminal
             *  门店对象
             *  var paramSet = {
                "serviceType": "shop", //terminal
                "shop":{
                    "brand":1,
                    "city":2,
                    "ajaxUrl":"baseData/shopManager/getShopTree.do"
                },
                "initItems":initItems,
                "currentItems":currentItems,
                "showFlg": 1,
                "title":"选择门店"
            };
             终端对象
             var paramSet = {
                "serviceType": "terminal", //terminal
                "terminal":{
                    "ajaxUrl":"baseData/shopManager/getShopTree.do"
                },
                "initItems":initItems,
                "currentItems":currentItems,
                "showFlg": 1，
                "title":"选择终端"
            };
             * @type {{serviceType: string, shop: {brand: number, city: number, ajaxUrl: string}, initItems: Array, currentItems, showFlg: number}}
             */
            var paramSet = {
                "serviceType": "shop", //terminal
                "shop":{
                    "brand":1,
                    "city":2,
                    "ajaxUrl":"baseData/shopManager/getShopTree.do"
                },
                "initItems":initItems,
                "currentItems":currentItems,
                "showFlg": 1,
                "title":"选择门店"
            };
            shopSelectorService.openShopModal(paramSet).then(function(result){
                //result中含有全部已选元素数组，和变化的元素数组
                $scope.limitSet.relShops = convertModalShop(result.allSelectedItems);
                $scope.changeItems = result.changeItems;
            });
        };
        /**
         * 当前页面元素与模态框元素字段同步
         * @param shops
         * @returns {Array}
         */
        function convertModalShop(shops){
            var newShops = [];
            for(var i=0;i<shops.length;i++){
                var shop = {};
                shop.code = shops[i].code;
                shop.showName = shops[i].showName;
                shop.bindFlg = shops[i].bindFlg;
                newShops.push(shop);
            }
            return newShops;
        }

        /**
         * 取消新建
         */
        $scope.cancelIn = function(){
            register.switchTab({id: $scope.from});
        };
        //提交要创建的卡型数据
        $scope.confirmSave = function(){
           if($scope.scoreSet.relScoreRules.length>0){
               $scope.cardTypeEdit.scoreSet.relScoreRules = $scope.scoreSet.relScoreRules;
           }
            if($scope.cardTypeEdit.scoreSet.clearMonth && $scope.cardTypeEdit.scoreSet.clearDay){
                $scope.cardTypeEdit.scoreSet.clearDate = $scope.cardTypeEdit.scoreSet.clearMonth+ "-" + $scope.cardTypeEdit.scoreSet.clearDay;
            }
            if($scope.relExchangeRules.length>0){
                $scope.cardTypeEdit.relExchangeRules = $scope.relExchangeRules;
            }
            if($scope.relSavingRules.length>0){
                $scope.cardTypeEdit.relSavingRules = $scope.relSavingRules;
            }
            if($scope.changeItems && $scope.changeItems.length>0){
                $scope.cardTypeEdit.limitSet.relShops = $scope.changeItems;
            }

            if($scope.cardTypeEdit.baseInfo.isUseLimit === 1){
                var checkOneItem = false;
                for(var p in $scope.cardTypeEdit.limitSet){
                    if(p==='isFirstConsume'&&$scope.cardTypeEdit.limitSet[p]===1){
                        checkOneItem = true;
                    }
                    if(p==='isMinRecharge'&&$scope.cardTypeEdit.limitSet[p]===1){
                        checkOneItem = true;
                    }
                    //if(p==='isUnSellRecharge'&&$scope.cardTypeEdit.limitSet[p]===1){
                    //    checkOneItem = true;
                    //}
                    if(p==='isShopLimit'&&$scope.cardTypeEdit.limitSet[p]===1){
                        checkOneItem = true;
                    }

                }
                if(checkOneItem === false){
                    modalService.info({title:'提示', content:'您已开启使用限制，请至少选择一条使用限制!', size:'sm', type: 'confirm'});
                    return;
                }
            }
            $scope.ruleData = $scope.cardTypeEdit;
            $scope.ruleData.sessionId = sessionId;
            $scope.disabledBtn = true;
            ajaxService.AjaxPost( $scope.ruleData,"memberequity/cardtype/create.do").then(function (result) {
                if(result&&result.status===1){
                    selectRelScoreRules = [];
                    selectExchanges = [];
                    modalService.info({content:'新建成功', type: 'ok'}).then(function(obj){
                        if(obj.status == 'ok'){
                            $rootScope.TabsData.callback();
                            register.switchTab({id: $scope.from});
                        }
                    });
                }
                }
            );
            $scope.disabledBtn = false;
        };
        /**
         * 关联列表中的删除上升下降操作
         */
        $scope.minus = function(rules,$index){
        	//$scope.cardTypeUpdate.relSavingRules.splice($index, 1);
        	rules.splice($index, 1);
        	
        };
        $scope.up = function(rules,$index){
        	var tempRule = rules[$index];
        	rules[$index]=rules[$index-1];
        	rules[$index-1]=tempRule;
        };
        $scope.down = function(rules,$index){
        	var tempRule = rules[$index];
        	rules[$index]=rules[$index+1];
        	rules[$index+1]=tempRule;
        };
        /**
         * 选择储值规则模态框
         */
        $scope.showSavingModal = function() {
            var modalInstance = $uibModal.open({
                //受否加载动画
                animation: true,
                //模态框页面
                template: savingSelectorTemp,
                //模态框的尺寸
                size: "lg",
                //模态框对应的controller
                controller: 'savingSelectorCtrl',
                //向模态框传递参数
                resolve: {
                	ruleIds: function () {
                    	var ruleIds=[];
                    	$scope.relSavingRules.forEach(function(v){
                    		ruleIds.push(v.id);
                    	});
                        return ruleIds;
                    }
                }

            });
            //处理模态框返回到当前页面的数据
            modalInstance.result.then(function (selectedItem) {
            	selectedItem.forEach(function(v){
            		$scope.relSavingRules.push(v);
            	});
            });
        };
        
        /**
         * 选择积分规则模态框
         */
        $scope.showScoreModal = function() {
            var modalInstance = $uibModal.open({
                //受否加载动画
                animation: true,
                //模态框页面
                template: scoreSelectorTemp,
                //模态框的尺寸
                size: "lg",
                //模态框对应的controller
                controller: 'scoreSelectorCtrl',
                //向模态框传递参数
                resolve: {
                	ruleIds: function () {
                    	var ruleIds=[];
                    	$scope.scoreSet.relScoreRules.forEach(function(v){
                    		ruleIds.push(v.id);
                    	});
                        return ruleIds;
                    }
                }

            });
            //处理模态框返回到当前页面的数据
            modalInstance.result.then(function (selectedItem) {
            	selectedItem.forEach(function(v){
            		$scope.scoreSet.relScoreRules.push(v);
            	});
            });
        };
        $scope.stopPropagation = function($event){
            $event.stopPropagation();
        }
        /**
         * 选择兑换规则模态框
         */
        $scope.showExchangeModal = function() {
            var modalInstance = $uibModal.open({
                //受否加载动画
                animation: true,
                //模态框页面
                template: exchangeSelectorTemp,
                //模态框的尺寸
                size: "lg",
                //模态框对应的controller
                controller: 'exchangeSelectorCtrl',
                //向模态框传递参数
                resolve: {
                	ruleIds: function () {
                    	var ruleIds=[];
                    	$scope.relExchangeRules.forEach(function(v){
                    		ruleIds.push(v.id);
                    	});
                        return ruleIds;
                    }
                }

            });
            //处理模态框返回到当前页面的数据
            modalInstance.result.then(function (selectedItem) {
            	selectedItem.forEach(function(v){
            		$scope.relExchangeRules.push(v);
            	});
            });
        };
    }]);
});