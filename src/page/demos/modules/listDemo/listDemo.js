define(['css!score_rule_css'],function () { //加载score_rule.css
    var rtObj = {
        ctrl: "list_module", arrFunc: [
            '$scope',
            'getCookieService',
            'appConstant',
            "register",
            "$rootScope",
            function ($scope, getCookieService, appConstant,register, $rootScope) {
                var sessionId = $rootScope.sessionId;
                //详情页面修改按钮权限
                $rootScope.editScoreRule = register.getRoot("修改");
                //筛选组件配置
                $scope.conditions = {
                    ajaxUrl: 'memberEquity/scoreRule/list.do',//查询的接口
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},//查询条件
                    filter: [ //筛选的条件
                        {
                            type: 'normal',
                            field: '适用卡型：', //显示的标题
                            requestFiled: 'cardTypeId',
                            value: [],
                            ajaxUrl: 'memberequity/cardtype/getCardTypeForSearch.do',//筛选内容从服务器获取
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
                //列表组件的配置
                $scope.pageSet = {
                    title:"积分规则列表", //标题
                    currentPage: appConstant.pageSet.currentPage, //当前页码 默认为1
                    maxSize: appConstant.pageSet.maxSize,  //显示多少页 默认为10
                    numPerPage: appConstant.pageSet.numPerPage, //每页显示数量 默认为10
                    button:{ //标题右侧的按钮
                        title: '新建',
                        newtab: {
                            title:"新建积分规则",
                            id:"newScoreRule",
                            template:"memberequity/scorerule/newScoreRule.html",
                            ctrlName:"newScoreRule",
                            ctrl: 'memberequity/scorerule/newScoreRule',
                            from: 10020,
                            type: 'multiple',
                            ng_show:false
                        }
                    },
                    table : [ { //表格配置
                        field : 'index',//ID
                        desc : '编号' //name
                    }, {
                        field : 'name',
                        desc : '积分规则名称',
                        column: 'name' //排序
                    }, {
                        field : 'type',
                        desc : '积分方式',
                        column: 'type',
                        filter : 'tranScoreRuleType'//过滤器 过滤器内容写在getCookie.js
                    }, {
                        field : [ 'type', 'howMoney', 'howScore' ],
                        desc : '积分内容',
                        filter : 'tranScoreRuleContent'
                    }, {
                        field : [ 'isDate','isTime', 'startTime', 'endTime' ],
                        desc : '有效期',
                        filter : 'tranScoreRuleIsTime',
                        isRender : 'true' //替换状态类的样式 效果在页面 配置内容写在getCookie.js
                        // cssFilter:'tranScoreRuleIsTimeCss'
                    }, {
                        field : 'isAble',
                        desc : '启用状态',
                        column: 'is_able',
                        filter : 'tranScoreRuleIsAble',
                        isRender : 'true'
                        // ,cssFilter:'tranScoreRuleIsAbleCss'
                    } ],
                    task: [{ //列表操作列的四个功能按钮 依次为 快捷操作 修改 删除 详情
                        type: 'toAjax',
                        content:'scoreRule',
                        ajaxUrl: 'memberEquity/scoreRule/update.do',
                        field: 'isAble',
                        filter: 'tranScoreRuleIsAble2'
                    }, {
                        type:'toChange',
                        desc: '修改',
                        newtab:{
                            title:"修改积分规则",
                            id:"scoreEdit",
                            from: 10020,
                            ctrlName:"scoreRuleEdit",
                            ctrl:"memberequity/scorerule/scoreRuleEdit",
                            template:"memberequity/scorerule/scoreRuleEdit.html",
                            ng_show:false
                        }
                    }, {
                        type: 'delete',
                        content:'scoreRule',
                        ajaxUrl: 'memberEquity/scoreRule/delete.do',
                        desc: '删除'
                    }, {
                        type:'toDetail',
                        desc: '详情',
                        newtab:{
                            title:"积分规则详情",
                            ctrlName:"scoreRuleDetail",
                            ctrl:"memberequity/scorerule/scoreRuleDetail",
                            from: 10020,
                            id:"scoreDetail",
                            template:"memberequity/scorerule/scoreRuleDetail.html",
                            ng_show:false
                        }
                    }]
                };
            }
        ]
    };

    return rtObj;
});

