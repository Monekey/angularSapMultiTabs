/**
 * Created by Administrator on 2016/2/29 0029.
 */

define(function (require) {
    var app = require("css!score_rule_css");
    var $ = require("jquery");

    var ngAMD = require('ngAMD');
    ngAMD.controller("monthCtrl", [
        '$scope',
        'getCookieService',
        'appConstant',
        "ajaxService",
        "register",
        function ($scope, getCookieService, appConstant, ajaxService, register) {

            $scope.titleName = 'shopName';

            var sessionId = getCookieService.getCookie("CRMSESSIONID");
            $scope.conditions = {
                ajaxUrl: 'reportcenter/monthly/list.do',
                request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
                filter: [
                    {
                        type: 'normal',
                        field: '卡型：',
                        requestFiled: 'cardTypeId',
                        value: [],
                        ajaxUrl: 'memberequity/cardtype/list.do',
                        request: {"sessionId": sessionId}
                    }
                ],
                datePicker: { //表头里的时间配置，不需要可不配置此项
                    requestFiled: ['date', 'month'],//必须是数组
                    //分别对应普通按钮时间，开始时间和结束时间
                    value: [
                        {
                            "name": "本月",
                            "state": true,
                            "value": 'M0'
                        },
                        {
                            "name": "上月",
                            "state": false,
                            "value": 'M1'
                        }]
                },
                more: true
            };

            changeGroup = function (obj) {

                var index = obj.selectedIndex;
                var groupBy = obj.options[index].value;
                //console.log(groupBy.value);
                var postObj = $scope.requestObj.request;
                postObj.pageNo = $scope.pageSet.currentPage;
                postObj.pageCount = $scope.pageSet.numPerPage;
                postObj.groupBy = groupBy;

                if (groupBy == 'shop') {
                    $("#titleName").text('门店');
                    $scope.titleName = 'shopName';
                }
                if (groupBy == 'city') {
                    $("#titleName").text('城市');
                    $scope.titleName = 'cityName';
                }
                if (groupBy == 'brand') {
                    $("#titleName").text('品牌');
                    $scope.titleName = 'brandName';
                }

                ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                    $scope.resultList = result;
                });
            }

            $scope.getValue = function (value) {
                if (value == null) {
                    return 0;
                } else {
                    return value;
                }
            }

            //引用分页控件
            $scope.pageSet = {
                title: "列表",
                currentPage: appConstant.pageSet.currentPage,//显示当前
                maxSize: appConstant.pageSet.maxSize,//可显示最大页码
                numPerPage: appConstant.pageSet.numPerPage//每页条数
            };

            $scope.pageChanged = function () {
                //var postObj = {"sessionId": sessionId};
                var postObj = $scope.requestObj.request;
                postObj.pageNo = $scope.pageSet.currentPage;
                postObj.pageCount = $scope.pageSet.numPerPage;
                ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                    $scope.resultList = result;
                });
            };

            $scope.openSaveMoney = function (shop, flag) {

                var postObj = $scope.requestObj.request;
                for (var x in postObj) {
                    shop[x] = postObj[x];
                }
                shop.isOtherShop = flag;
                try {
                    shop.date = $scope.requestObj.request.date;
                } catch (e) {
                    shop.date = 0;
                }
                shop.shopId = shop.id;
                //打开新建积分规则的tab
                register.addToTabs({
                        title: "储值明细",
                        id: "saveMoneyDesc" + shop.id,
                        template: "reportcenter/savemoney/saveMoneyDesc.html",
                        ctrl: 'reportcenter/savemoney/saveMoneyDesc',
                        //删除require路径，改为动态配置
                        ctrlName: "saveMoneyDesc",
                        //对应编辑页controller的名字
                        ng_show: false,
                        type: 'single',
                        from: 1001
                    },
                    shop);
            };

            $scope.openConsume = function (shop, flag) {
                var postObj = $scope.requestObj.request;
                for (var x in postObj) {
                    shop[x] = postObj[x];
                }
                shop.isOtherShop = flag;
                try {
                    shop.date = $scope.requestObj.request.date;
                } catch (e) {
                    shop.date = 0;
                }
                shop.shopId = shop.id;
                //打开新建积分规则的tab
                register.addToTabs({
                        title: "消费明细",
                        id: "memberConsume" + shop.id,
                        template: "reportcenter/savemoney/memberConsume.html",
                        ctrl: 'reportcenter/savemoney/memberConsume',
                        //删除require路径，改为动态配置
                        ctrlName: "memberConsume",
                        //对应编辑页controller的名字
                        ng_show: false,
                        type: 'single',
                        from: 1001
                    },
                    shop);
            };


        }
    ]);
return 'monthCtrl';
})
;