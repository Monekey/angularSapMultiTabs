/**
 * Created by Administrator on 2016/2/29 0029.
 */
define(function (require) {
    var app = require("css!score_rule_css");
    var exchange_rule_css = require("css!exchange_rule_css");
    var ngAMD = require('ngAMD');
    ngAMD.controller("exchangeRuleCtrl", [
            '$scope',
            '$rootScope',
            'getCookieService',
            'appConstant',
            'register',
            function ($scope,$rootScope, getCookieService, appConstant,register) {
                var sessionId = getCookieService.getCookie("CRMSESSIONID");
                //详情页面修改按钮权限
                $rootScope.editExchangeRule = register.getRoot("修改");
                $scope.conditions = {
                    ajaxUrl: 'memberEquity/exchangeRule/list.do',
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
                    filter: [
                        {
                            type: 'normal',
                            field: '适用卡型：',
                            requestFiled: 'cardTypeId',
                            value: [],
                            ajaxUrl: 'memberequity/cardtype/list.do',
                            request: {"sessionId": sessionId}
                        },
//                        {type: 'date', field: '使用有效期', requestFiled: 'aliableTime', value: []},
                        {
                            type: 'normal',
                            field: '有效状态：',
                            requestFiled: 'ruleStatus',
                            value: [{"name": "全部", "state": true, "value": null}, {
                                "name": "已生效",
                                "state": false,
                                "value": 1
                            }, {"name": "未生效", "state": false, "value": 0}, {"name": "已过期", "state": false, "value": 2}]
                        },
                        {
                            type: 'normal',
                            field: '启用状态：',
                            requestFiled: 'isAble',
                            value: [{"name": "全部", "state": true, "value": null}, {
                                "name": "已启用",
                                "state": false,
                                "value": "1"
                            }, {"name": "未启用", "state": false, "value": "0"}]
                        }]
                };

                $scope.pageSet = {
                    title: '兑换规则列表',
                    currentPage: appConstant.pageSet.currentPage,
                    maxSize: appConstant.pageSet.maxSize,
                    numPerPage: appConstant.pageSet.numPerPage,
                    button:{
                        title: '新建',
                        newtab: {
                            title:"新建兑换规则",
                            id:"newExchangeRule",
                            ctrlName:"newExchangeRule",
                            ctrl: 'memberequity/exchangerule/newExchangeRule',
                            template:"memberequity/exchangerule/newExchangeRule.html",
                            from: 10021,
                            type: 'multiple',
                            ng_show:false
                        }
                    },
                    

					table : [
								{
									field : 'index',
									desc : '编号'
								},
								{
									field : 'name',
									column: 'name',
									desc : '兑换规则名称'
								},
								{
									field : 'giftType',
									column: 'gift_type',
									desc : '兑换类型',
									filter : 'tranGiftType'
								},
								{
									field : 'giftName',
									column: 'gift_name',
									desc : '兑换内容'
								}

								,
								{
									field : 'castScore',
									column: 'cast_score',
									desc : '兑换额'
								},
								{
									field : [ 'isDate', 'isTime', 'startTime',
											'endTime' ],
									desc : '有效期',
									filter : 'tranScoreRuleIsTime',
									isRender : 'true'
								}, {
									field : 'isAble',
									column: 'is_able',
									desc : '启用状态',
									filter : 'tranScoreRuleIsAble',
									isRender : 'true'
								} ],
                    task: [{
                        type: 'toAjax',
                        content:'exchangeRule',
                        ajaxUrl: 'memberEquity/exchangeRule/update.do',
                        field: 'isAble',
                        filter: 'tranScoreRuleIsAble2'
                    }, {
                        type: 'toChange',
                        desc: '修改',
                        newtab:{
                            title:"修改兑换规则",
                            id:"exchangeRuleEdit",
                            from: 10021,
                            ctrlName:"exchangeRuleEdit",
                            ctrl: 'memberequity/exchangerule/exchangeRuleEdit',
                            template:"memberequity/exchangerule/exchangeRuleEdit.html",
                            ng_show:false
                        }
                    }, {type: 'delete',
                    	content:'exchangeRule', 
                    	ajaxUrl: 'memberEquity/exchangeRule/delete.do', 
                    	desc: '删除'}, 
                    {
                        type: 'toDetail',
                        desc: '详情',
                        newtab:{
                            title:"兑换规则详情",
                            id:"exchangeRuleDetail",
                            from:10021,
                            ctrlName:"exchangeRuleDetail",
                            ctrl: 'memberequity/exchangerule/exchangeRuleDetail',
                            template:"memberequity/exchangerule/exchangeRuleDetail.html",
                            ng_show:false
                        }
                    }]
                };
            }
        ]);

    return 'exchangeRuleCtrl';
});

