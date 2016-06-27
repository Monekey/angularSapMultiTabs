/**
 * 卡型规则列表页面
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor liuzy
 * @updateHistory
 *
 *
 */
define(function (require) {
    var score_rule_css = require("css!score_rule_css");
    var card_type_css = require("css!card_type_css");
    var ngAMD = require('ngAMD');
    ngAMD.controller("cardTypeCtrl", [
            '$scope',
            '$rootScope',
            'getCookieService',
            'appConstant',
            "register",
            function ($scope,$rootScope, getCookieService, appConstant,register) {
                //获取sessionId
                var sessionId = getCookieService.getCookie("CRMSESSIONID");
                //定义筛选器，由于不需要具体筛选，所以只需配置加载数据的url和request
                $scope.conditions = {
                    ajaxUrl: 'memberequity/cardtype/list.do',
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage}
                };
                //详情页面修改按钮权限
                $rootScope.editCardType = register.getRoot("修改");

                //定义获取卡型列表的table样式
                $scope.pageSet = {
                    //panel的显示名称
                    title: '卡型规则列表',
                    //当前页码
                    currentPage: appConstant.pageSet.currentPage,
                    //显示多少页
                    maxSize: appConstant.pageSet.maxSize,
                    //每页显示数量
                    numPerPage: appConstant.pageSet.numPerPage,
                    //列表上面的button
                    button:{
                        title: '新建',//button显示名称
                        //新建卡型的tab对象
                        newtab: {
                            title:"新建卡型规则",
                            id:"cardTypeCreate",
                            ctrlName:"cardTypeCreate",
                            ctrl: 'memberequity/cardtype/cardTypeCreate',
                            template:"memberequity/cardtype/cardTypeCreate.html",
                            from: 10023,
                            type: 'multiple',
                            ng_show:false
                        }
                    },
                    //table显示内容，根据不同的值转换要显示的内容
                    table: [{field: 'index', desc: '编号'
                    },{
                    	field: 'typeName', 
                    	column: 'name',
                    	desc: '卡型名称'
                    }, {
                        field: 'isBondScoreRule',
                        column: 'is_score',
                        desc: '开启积分功能'
                    },{
                        field: 'isBondSavingRule',
                        column: 'is_saving',
                        desc: '开启储值功能'
                    },{
                        field: 'isBondExchangeRule',
                        column: 'is_exchange',
                        desc: '开启兑换功能'
                    },{
                        field: 'isBondDiscountRule',
                        desc: '开启打折功能'
                    }],
                    //表格中的操作列表的button，已经对应的ctrl和url
                    task: [{
                        type: 'toChange',
                        desc: '修改',
                        newtab:{
                            title:"修改卡型规则",
                            id:"cardTypeEdit",
                            from: 10023,
                            ctrlName:"cardTypeEdit",
                            ctrl: 'memberequity/cardtype/cardTypeEdit',
                            template:"memberequity/cardtype/cardTypeEdit.html",
                            ng_show:false
                        }
                    }, {type: 'delete',
                        content:'baseInfo',
                        ajaxUrl: 'memberequity/cardtype/delete.do',
                        desc: '删除'},
                        {
                            type: 'toDetail',
                            desc: '详情',
                            newtab:{
                                title:"卡型规则详情",
                                id:"cardTypeDetail",
                                from:10023,
                                ctrlName:"cardTypeDetail",
                                ctrl: 'memberequity/cardtype/cardTypeDetail',
                                template:"memberequity/cardtype/cardTypeDetail.html",
                                ng_show:false
                            }
                        }]
                };
            }
        ]);
    return 'cardTypeCtrl';
});

