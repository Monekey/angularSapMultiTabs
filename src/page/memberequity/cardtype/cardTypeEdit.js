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
    //加载所需模块
    var app = require( "app" );
    var angular = require("angular");
    var savingSelectorCtrl = require( "memberequity/cardtype/savingSelector" );
    var savingSelectorTemp = require( "text!memberequity/cardtype/savingSelector.html" );
    var scoreSelectorCtrl = require( "memberequity/cardtype/scoreSelector" );
    var scoreSelectorTemp = require( "text!memberequity/cardtype/scoreSelector.html" );
    var exchangeSelectorCtrl = require( "memberequity/cardtype/exchangeSelector" );
    var exchangeSelectorTemp = require( "text!memberequity/cardtype/exchangeSelector.html" );
    app.ngAMDCtrlRegister.controller( "cardTypeEdit",["$scope","$rootScope","ajaxService",'register','shopSelectorService','$uibModal','modalService',function( $scope,$rootScope,ajaxService, register,shopSelectorService,$uibModal,modalService ){
        $scope.from = $rootScope.TabsData.from;
        console.log($rootScope.TabsData);
        var sessionId = $rootScope.sessionId;

        //定义panel开启关闭的标记，true开启，false关闭，默认全部关闭
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
            if(type==="score"&&$scope.cardTypeUpdate.baseInfo.isScore===1){
                $scope.status.score = true;
            }
            if(type==="exchange"&&$scope.cardTypeUpdate.baseInfo.isExchange===1){
                $scope.status.exchange = true;
            }
            if(type==="recharge"&&$scope.cardTypeUpdate.baseInfo.isSaving===1){
                $scope.status.recharge = true;
            }
            if(type==="limit"&&$scope.cardTypeUpdate.baseInfo.isUseLimit===1){
                $scope.status.limit = true;
            }
            if(type==="remind"&&$scope.cardTypeUpdate.baseInfo.isRemind===1){
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
        //定义卡型规则详情对象
        $scope.cardTypeUpdate = {
            //基本信息，到期提醒
            "baseInfo": {
                //"name": "",
                //"note": "",
                //"cardCharge": "",
                //"isScore":"",
                //"isExchange":"",
                //"isSaving":"",
                //"isUseLimit":"",
                //"isRemind":"",
                //"remindBeforeDay":""
            },
            ////积分功能
            //"scoreSet":{
            //    //"isClear":"",
            //    //"clearDate":"",
            //    //"clearWayFlg":"",
            //    //"clearBeforeYear":"",
            //    //"clearNoticeBeforeDay":"",
            //    //"isSocreMoney":"",
            //    //"isScoreMoneyFirst":"",
            //    //"isInvestmentScore":"",
            //    //"isFreeMoneyScore":"",
            //    //"scoreMoneyScale":"",
            //    //"relScoreRules":[]
            //},
            ////使用限制
            //"limitSet":{
            //    //"isFirstConsume":"",
            //    //"firstConsumeScale":"",
            //    //"isMinRecharge":"",
            //    //"minRechargeAmount":"",
            //    //"isShopLimit":"",
            //    //"relShops":[]
            //},
            ////储值功能
            //"relSavingRules":[],
            ////兑换功能
            //"relExchangeRules":[]
        };

        //从卡型列表页面获取当前卡型的对象
        var data = angular.copy($rootScope.TabsData);
        //获取当前卡型的id
        var cardTypeId = data.id;
        var testParam = {
            "sessionId": sessionId,
            "id": cardTypeId,
            "isEdit":1
        };
        var initItems = [];

        //获取卡型的基本信息
        ajaxService.AjaxPost(testParam,"memberequity/cardtype/baseInfo.do").then(
            function (result) {
                $scope.cardTypeUpdate.baseInfo = angular.copy(result.baseInfo);
                //备份卡型规则基本信息
                $scope.initBaseInfo = angular.copy(result.baseInfo);
                //根据卡型基本信息的字段，判断对应panel是否需要开启
                if($scope.cardTypeUpdate.baseInfo.isRemind &&  $scope.cardTypeUpdate.baseInfo.isRemind ===1){
                    $scope.status.remind = true;
                }
                if( $scope.cardTypeUpdate.baseInfo.isScore &&  $scope.cardTypeUpdate.baseInfo.isScore ===1){
                    $scope.status.score = true;
                }
                if($scope.cardTypeUpdate.baseInfo.isExchange &&  $scope.cardTypeUpdate.baseInfo.isExchange ===1){
                    $scope.status.exchange = true;
                }
                if($scope.cardTypeUpdate.baseInfo.isSaving &&  $scope.cardTypeUpdate.baseInfo.isSaving ===1){
                    $scope.status.recharge = true;
                }
                if($scope.cardTypeUpdate.baseInfo.isUseLimit &&  $scope.cardTypeUpdate.baseInfo.isUseLimit ===1){
                    $scope.status.limit = true;
                }
            }
        );
        //获取卡型的限制规则
        ajaxService.AjaxPost(testParam,"memberequity/cardtype/limitSet.do").then(
            function (result) {

                $scope.cardTypeUpdate.limitSet = angular.copy(result.limitSet);
                //备份卡型规则限制信息
                $scope.initLimitSet = angular.copy($scope.cardTypeUpdate.limitSet);
                //备份初始的门店数组
                initItems = angular.copy($scope.cardTypeUpdate.limitSet.relShops);
                $scope.changeItems = [];
            }
        );
        //获取卡型的储值规则
        ajaxService.AjaxPost(testParam,"memberequity/cardtype/relSavingRules.do").then(
            function (result) {

                $scope.cardTypeUpdate.relSavingRules = angular.copy(result.relSavingRules);
                //备份卡型规则储值信息
                $scope.initRelSavingRules = angular.copy($scope.cardTypeUpdate.relSavingRules);
            }
        );
        //获取卡型的兑换规则
        ajaxService.AjaxPost(testParam,"memberequity/cardtype/relExchangeRules.do").then(
            function (result) {
                $scope.cardTypeUpdate.relExchangeRules = angular.copy(result.relExchangeRules);
                //备份卡型规则兑换信息
                $scope.initRelExchangeRules = angular.copy($scope.cardTypeUpdate.relExchangeRules);
            }
        );
        //获取卡型的积分规则
        ajaxService.AjaxPost(testParam,"memberequity/cardtype/scoreSet.do").then(
            function (result) {
                $scope.cardTypeUpdate.scoreSet = angular.copy(result.scoreSet);
                if(result.scoreSet.clearDate && result.scoreSet.clearDate.length>0){
                    var month = getMonth(result.scoreSet.clearDate);
                    var day = getDay(result.scoreSet.clearDate);
                    $scope.cardTypeUpdate.scoreSet.clearMonth = month;
                    $scope.cardTypeUpdate.scoreSet.clearDay = day;
                }else{
                    $scope.cardTypeUpdate.scoreSet.clearMonth = "";
                    $scope.cardTypeUpdate.scoreSet.clearDay = "";
                }
                //备份卡型规则积分信息
                $scope.initScoreSet = angular.copy($scope.cardTypeUpdate.scoreSet);

            }
        );
     

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
                days.push(i<10?"0"+i: i+"");
            }
            return days;
        }

        /**
         * 将卡型规则的清除日期拆分出天数和月数
         * @param date
         * @returns {string}
         */
        function getMonth(date){
            return date.substring(0,date.indexOf("-"));
        }
        function getDay(date){
            return date.substring(date.indexOf("-") + 1,date.length);
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
         * 开启门店选择模态框
         */
        $scope.showModal = function() {
            //showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
            var showFlg = 1;
            //将当前对象转换成对应模态框的对象的字段
            var currentItems = $scope.cardTypeUpdate.limitSet.relShops;
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
                $scope.cardTypeUpdate.limitSet.relShops = convertModalShop(result.allSelectedItems);
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
         * 取消编辑
         */
        $scope.cancelIn = function(){
            register.switchTab({id: $scope.from});
        };

        /**
         * 校验对象是否被修改过
         * @param obj
         * @param newObj
         * @returns {number}
         */
        function isChange(obj,newObj){
            var objStr = JSON.stringify(obj);
            var newObjStr = JSON.stringify(newObj);

            var objHashCode = hashCode(objStr);
            var newObjHashCode = hashCode(newObjStr);
            if(objHashCode === newObjHashCode){
                return 0
            }else{
                return 1
            }
        }

        /**
         * 将对象转成hash值
         * @param str
         * @returns {number}
         */
        function hashCode(str){
            var hash = 0;
            if (str.length == 0) return hash;
            for (var i = 0; i < str.length; i++) {
                var char = str.charCodeAt(i);
                hash = ((hash<<5)-hash)+char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }

        /**
         * 删除数组中由于ng-repeat产生的"$$hashKey"字段
         * @param arr
         * @returns {*}
         */
        function deletePropertyHashKey(arr){
            for(var i = 0;i<arr.length;i++){
                delete arr[i].$$hashKey;
            }
            return arr;
        }


        //提交要更新的卡型数据
        $scope.confirmUpdate = function(){
            //根据标记判断字段是否被改变过，方便后台判断需要处理的数据
            $scope.cardTypeUpdate.isBaseInfoChange = isChange($scope.initBaseInfo,$scope.cardTypeUpdate.baseInfo);
            if($scope.cardTypeUpdate.scoreSet.clearMonth && $scope.cardTypeUpdate.scoreSet.clearDay){
                $scope.cardTypeUpdate.scoreSet.clearDate = $scope.cardTypeUpdate.scoreSet.clearMonth+ "-" + $scope.cardTypeUpdate.scoreSet.clearDay;
            }
            
            $scope.cardTypeUpdate.scoreSet.relScoreRules = deletePropertyHashKey($scope.cardTypeUpdate.scoreSet.relScoreRules);
            $scope.cardTypeUpdate.isScoreChange = isChange($scope.initScoreSet,$scope.cardTypeUpdate.scoreSet);
            
            $scope.cardTypeUpdate.relExchangeRules = deletePropertyHashKey($scope.cardTypeUpdate.relExchangeRules);
            $scope.cardTypeUpdate.isRelExchangeChange = isChange($scope.initRelExchangeRules,$scope.cardTypeUpdate.relExchangeRules);
            
            $scope.cardTypeUpdate.relSavingRules = deletePropertyHashKey($scope.cardTypeUpdate.relSavingRules);
            $scope.cardTypeUpdate.isRelSavingChange = isChange($scope.initRelSavingRules,$scope.cardTypeUpdate.relSavingRules);
            
            $scope.cardTypeUpdate.limitSet.relShops = deletePropertyHashKey($scope.cardTypeUpdate.limitSet.relShops);
            $scope.cardTypeUpdate.islimitSetChange = isChange($scope.initLimitSet,$scope.cardTypeUpdate.limitSet);
            
            //if( $scope.cardTypeUpdate.islimitSetChange === 1 && $scope.changeItems && $scope.changeItems.length>0){
            //    $scope.cardTypeUpdate.limitSet.relShops = $scope.changeItems;
            //}else{
            //    $scope.cardTypeUpdate.limitSet.relShops = [];
            //}
            if($scope.cardTypeUpdate.baseInfo.isUseLimit === 1){
                var checkOneItem = false;
                for(var p in $scope.cardTypeUpdate.limitSet){
                    if(p==='isFirstConsume'&&$scope.cardTypeUpdate.limitSet[p]===1){
                        checkOneItem = true;
                    }
                    if(p==='isMinRecharge'&&$scope.cardTypeUpdate.limitSet[p]===1){
                        checkOneItem = true;
                    }
                    //if(p==='isUnSellRecharge'&&$scope.cardTypeUpdate.limitSet[p]===1){
                    //    checkOneItem = true;
                    //}
                    if(p==='isShopLimit'&&$scope.cardTypeUpdate.limitSet[p]===1){
                        checkOneItem = true;
                    }

                }
                if(checkOneItem === false){
                    modalService.info({title:'提示', content:'您已开启使用限制，请至少选择一条使用限制!', size:'sm', type: 'confirm'});
                    return;
                }
            }
            $scope.ruleData = angular.copy($scope.cardTypeUpdate);
            if( $scope.cardTypeUpdate.islimitSetChange === 1 && $scope.changeItems && $scope.changeItems.length>0){
                $scope.ruleData.limitSet.relShops = $scope.changeItems;
            }else{
                $scope.ruleData.limitSet.relShops = [];
            }
            $scope.ruleData.sessionId = sessionId;
            $scope.ruleData.id = cardTypeId;
            /**
             * 执行更新操作
             */
            ajaxService.AjaxPost( $scope.ruleData,"memberequity/cardtype/update.do").then(function (result) {
                if(result&&result.status===1){
                    selectExchanges = [];
                    modalService.info({content:'修改成功', type: 'ok'}).then(function(obj){
                        if(obj.status == 'ok'){
                            $rootScope.TabsData.callback();
                            register.switchTab({id: $scope.from});
                        }
                    },function(){
                        $rootScope.TabsData.callback();
                        register.switchTab({id: $scope.from});
                    });
                }
            });
        };
        
        /**
         * 关联列表中的删除上升下降操作
         */
        $scope.minus = function(rules,$index){
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
                    	$scope.cardTypeUpdate.relSavingRules.forEach(function(v){
                    		ruleIds.push(v.id);
                    	});
                        return ruleIds;
                    }
                }

            });
            //处理模态框返回到当前页面的数据
            modalInstance.result.then(function (selectedItem) {
            	selectedItem.forEach(function(v){
            		$scope.cardTypeUpdate.relSavingRules.push(v);
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
                    	$scope.cardTypeUpdate.scoreSet.relScoreRules.forEach(function(v){
                    		ruleIds.push(v.id);
                    	});
                        return ruleIds;
                    }
                }

            });
            //处理模态框返回到当前页面的数据
            modalInstance.result.then(function (selectedItem) {
            	selectedItem.forEach(function(v){
            		$scope.cardTypeUpdate.scoreSet.relScoreRules.push(v);
            	});
            });
        };
        $scope.stopPropagation = function($event){
            $event.stopPropagation();
        }
        /**
         * 选择积分规则模态框
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
                    	$scope.cardTypeUpdate.relExchangeRules.forEach(function(v){
                    		ruleIds.push(v.id);
                    	});
                        return ruleIds;
                    }
                }

            });
            //处理模态框返回到当前页面的数据
            modalInstance.result.then(function (selectedItem) {
            	selectedItem.forEach(function(v){
            		$scope.cardTypeUpdate.relExchangeRules.push(v);
            	});
            });
        };


    }]);
});
