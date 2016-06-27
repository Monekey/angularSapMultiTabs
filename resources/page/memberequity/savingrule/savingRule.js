/**
 * Created by Administrator on 2016/2/29 0029.
 */
define(function (require) {
    var app = require("css!score_rule_css");
    var saving_rule_css = require("css!saving_rule_css");
    var ngAMD = require('ngAMD');
    ngAMD.controller("savingRuleCtrl", [
            '$scope',
            'getCookieService',
            'appConstant',
            '$rootScope',
            'register',
            function ($scope, getCookieService, appConstant, $rootScope,register) {
                var sessionId = $rootScope.sessionId;
                //详情页面修改按钮权限
                $rootScope.editSavingRule = register.getRoot("修改");
                $scope.conditions = {
                    ajaxUrl: 'memberEquity/savingRule/list.do',
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
                    title: '储值规则列表',
                    currentPage: appConstant.pageSet.currentPage,
                    maxSize: appConstant.pageSet.maxSize,
                    numPerPage: appConstant.pageSet.numPerPage,
                    button:{
                        title: '新建',
                        newtab: {
                            title:"新建储值规则",
                            id:"newSavingRule",
                            ctrl:"memberequity/savingrule/newSavingRule",
                            ctrlName:"newSavingRule",
                            template:"memberequity/savingrule/newSavingRule.html",
                            from:10022,
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
									desc : '储值规则名称'
								},
								{
									field : 'savingType',
									column: 'saving_type',
									desc : '储值方式',
									filter : 'tranSavingRuleType'
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
									isRender : true
								} ],
                    task: [{
                        type: 'toAjax',
                        ajaxUrl: 'memberEquity/savingRule/update.do',
                        field: 'isAble',
                        content:'savingRule', 
                        filter: 'tranScoreRuleIsAble2',
                        isRender:'true'
                    }, {
                        type:'toChange',
                        desc: '修改',
                        newtab:{
                            title:"修改储值规则",
                            id:"savingEdit",
                            from: 10022,
                            ctrlName:"savingRuleEdit",
                            ctrl:"memberequity/savingrule/savingRuleEdit",
                            template:"memberequity/savingrule/savingRuleEdit.html",
                            ng_show:false
                        }
                    },{ type: 'delete',
                        content:'savingRule', 
                    	ajaxUrl: 'memberEquity/savingRule/delete.do', 
                    	desc: '删除'
                    }, {
                        type: 'toDetail',
                        desc: '详情',
                        newtab:{
                                title:"储值规则详情",
                                ctrlName:"savingRuleDetail",
                                ctrl:"memberequity/savingrule/savingRuleDetail",
                                from: 10022,
                                id:"savingRuleDetail",
                                template:"memberequity/savingrule/savingRuleDetail.html",
                                ng_show:false
                            }
                    }]
                };
            }
        ]);

    return 'savingRuleCtrl';
});

