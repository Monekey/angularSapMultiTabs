/**
 * 卡型规则详情页面
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor liuzy
 * @updateHistory
 *
 *
 */

define(function( require ){
    //加载模块
    var app = require( "app" );
    var angular = require("angular");
    app.ngAMDCtrlRegister.controller( "cardTypeDetail",["$scope","$rootScope","ajaxService","register",function( $scope,$rootScope,ajaxService,register ){
        //获取sessionId
        var sessionId = $rootScope.sessionId;
        //定义表格中需要转换显示的内容
        $scope.scoreWay = {"0":"按金额","1":"按操作"};
        $scope.exchangeWay = {"0":"电子券","1":"实物"};
        $scope.savingWay = {"0":"线上储值","1":"线下储值"};

        $scope.edit = register.getRoot('修改');

        //定义卡型规则详情对象
        $scope.cardTypeDetail = {
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
            //积分功能
            "scoreSet":{
                //"isClear":"",
                //"clearDate":"",
                //"clearWayFlg":"",
                //"clearBeforeYear":"",
                //"clearNoticeBeforeDay":"",
                //"isSocreMoney":"",
                //"isScoreMoneyFirst":"",
                //"isInvestmentScore":"",
                //"isFreeMoneyScore":"",
                //"scoreMoneyScale":"",
                //"relScoreRules":[]
            },
            //使用限制
            "limitSet":{
                //"isFirstConsume":"",
                //"firstConsumeScale":"",
                //"isMinRecharge":"",
                //"minRechargeAmount":"",
                //"isShopLimit":"",
                //"relShops":[]
            },
            //储值功能
            "relSavingRules":[],
            //兑换功能
            "relExchangeRules":[]
        };

        //从卡型列表页面获取当前卡型的对象
       var data = angular.copy($rootScope.TabsData);
        console.log(data);
        //获取当前卡型的id
        var cardTypeId = data.id;
        $scope.from = data.from;
        //post的参数
        var testParam = {
            "sessionId": sessionId,
            "id": cardTypeId,
            "isEdit":0
        };

        /**
         *  获取卡型的基本信息
         */

        ajaxService.AjaxPost(testParam,"memberequity/cardtype/baseInfo.do").then(
            function (result) {
                $scope.cardTypeDetail.baseInfo = result.baseInfo;
                if( $scope.cardTypeDetail.baseInfo.isScore &&  $scope.cardTypeDetail.baseInfo.isScore ===1){
                    //获取卡型的积分规则
                    ajaxService.AjaxPost(testParam,"memberequity/cardtype/scoreSet.do").then(
                        function (result) {
                                $scope.cardTypeDetail.scoreSet = result.scoreSet;
                            if(result.scoreSet.clearDate && result.scoreSet.clearDate.length>0){
                                var month = getMonth(result.scoreSet.clearDate);
                                var day = getDay(result.scoreSet.clearDate);
                                $scope.cardTypeDetail.scoreSet.clearMonth = month;
                                $scope.cardTypeDetail.scoreSet.clearDay = day;
                            }else{
                                    $scope.cardTypeDetail.scoreSet.clearMonth = "";
                                    $scope.cardTypeDetail.scoreSet.clearDay = "";
                            }

                        }
                    );
                }
                if($scope.cardTypeDetail.baseInfo.isExchange &&  $scope.cardTypeDetail.baseInfo.isExchange ===1){
                    //获取卡型的兑换规则
                    ajaxService.AjaxPost(testParam,"memberequity/cardtype/relExchangeRules.do").then(
                        function (result) {
                            $scope.cardTypeDetail.relExchangeRules = result.relExchangeRules;
                        }
                    );
                }
                if($scope.cardTypeDetail.baseInfo.isSaving &&  $scope.cardTypeDetail.baseInfo.isSaving ===1){
                    //获取卡型的储值规则
                    ajaxService.AjaxPost(testParam,"memberequity/cardtype/relSavingRules.do").then(
                        function (result) {
                            $scope.cardTypeDetail.relSavingRules = result.relSavingRules;
                        }
                    );
                }
                if($scope.cardTypeDetail.baseInfo.isUseLimit &&  $scope.cardTypeDetail.baseInfo.isUseLimit ===1){
                    //获取卡型的限制规则
                    ajaxService.AjaxPost(testParam,"memberequity/cardtype/limitSet.do").then(
                        function (result) {
                            $scope.cardTypeDetail.limitSet = result.limitSet;
                        }
                    );
                }
            }
        );

        //根据清空日期获取月
        function getMonth(date){
            return date.substring(0,date.indexOf("-"));
        }
        //根据清空日期获取天
        function getDay(date){
            return date.substring(date.indexOf("-") + 1,date.length);
        }

        /**
         * 返回按钮
         */
        $scope.cancelIn = function(){
            register.switchTab({id: $scope.from});
        };


        /**
         * 跳转到修改页面
         * @param cardTypeDetail
         */
        $scope.gotoEdit = function(cardTypeDetail){
            console.log(cardTypeDetail);
            //cardTypeDetail.callback = function a(callback){};
            var cardType = {"id":cardTypeDetail.baseInfo.id,callback:$rootScope.TabsData.callback};
            var editTab ={
                title:"修改卡型规则",
                id: "cardTypeEdit"+cardType.id,
                from: $scope.from,
                ctrlName:"cardTypeEdit",
                ctrl: 'memberequity/cardtype/cardTypeEdit',
                template:"memberequity/cardtype/cardTypeEdit.html",
                type: 'single',
                ng_show:false};
            register.addToTabs(editTab, cardType);
        };

    }]);
});
