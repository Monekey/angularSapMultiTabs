/**
 * 员工管理显示页 
 * @version  v1.0
 * @createTime: 2016-04-19
 * @createAuthor lxp
 * @updateHistory
 *
 * @note   文件命名规则 ：employee
 *          修改页：empUpdate
 *          创建页：empCreat
 */
define(function (require) {
    // 引用样式
    var app = require("css!score_rule_css");
    var rtObj = {
        ctrl: "empQueryCtrl", arrFunc: [//模块依赖
            //必须引用
            '$scope',
            //可选引用  顺序要和function中顺序一致
            '$rootScope',
            function ($scope, $rootScope) {
                var sessionId = $rootScope.sessionId;
                var testParam1 = {
                    sessionId: sessionId
                }

                var rule = {
                    eachSum: 1000, 			//每笔限额
                    daySum: 10000, 			//每天限额
                    dayCount: 100,				//每天次数
                    weekSum: 1000000,			//每周限额
                    weekCount: 1000				//每周次数
                }

                var rule2 = {
                    inputlimitTime: 10,		//输入时间限制
                    passwordInputErrorCount: 10,		//密码输入错误次数
                    payLimitTime: 10,		//支付限制时间
                }
                var rule3 = {
                    smsBalance: 10000				//短信余额不足
                }
                var testParam2 = {

                    alertCreateBean: [
                        {
                            id: 10003,
                            type: 3,
                            operation: 5,
//		    					lockFlg : 0,
                            ruleInfo: JSON.stringify(rule3),
//		        				cardTypes : []
                        }
                    ],

                    sessionId: sessionId
                }

                var testParam3 = {

                    roleId: 10001,

                    sessionId: sessionId
                }

                var testParam4 = {

                    alertNoticeRelationConfig: [
                        {type: "DELETE", empId: 40169, businessFlg: 1, orderFlg: 1, smsFlg: 0}, {
                            type: "UPDATE",
                            empId: 40133,
                            businessFlg: 0,
                            orderFlg: 0,
                            smsFlg: 1
                        }, {type: "UPDATE", empId: 40162, businessFlg: 1, orderFlg: 0, smsFlg: 1}, {
                            type: "ADD",
                            empId: 40170,
                            businessFlg: 1,
                            orderFlg: 1,
                            smsFlg: 1
                        }
                    ],

                    sessionId: sessionId
                }
                // 获取员工信息分页显示
                $scope.conditions = {
                    ajaxUrl: 'userManager/empManager/list.do',
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": "10"},
                    filter : [],
                    select : {
	                			requestFiled:'searchType', 
	                			options: [
	                			      {"name": "姓名", "state": true, "value": "name"},
	                                  {"name": "手机号", "state": false, "value": "phone"},
	                                  {"name": "邮箱", "state": false, "value": "email"},
	                                  
	                                  ]
                    		 },
                    search: {
                    			requestFiled: 'searchTypeValue', request: {"sessionId": sessionId}
                    		 }
                };
                
               
                $scope.pageSet = {
                    currentPage: 1,//当前页码
                    maxSize: 10,  //显示多少页
                    numPerPage: 10,//每页显示数量
                    title: '员工列表',
                    // 点击打开添加员工页面
                    button: {
                        title: '添加员工',
                        newtab: {
                            title: "新建员工",
                            id: "invationController",
                            ctrlName: "invationController",
                            ctrl: 'usermanager/empmanager/empCreate',
                            template: "usermanager/empmanager/empCreate.html",
                            type: 'multiple',
                            from: 10026,
                            ng_show: false
                        }
                    },
                    //创建表格显示员工信息
                    table: [{field: 'index', desc: '编号'}, {field: 'empName', desc: '员工姓名', column: 'ae.name'},
                        {field: 'roleName', desc: '所属角色', column: 'ar.name'},
                        {field: 'phone', desc: '电话', column: 'phone'},
                        {field: 'email', desc: '邮箱', column: 'email'},
                        {field: 'isAccess', desc: '启用状态', filter: 'tranScoreRuleIsAble4', column: 'isAccess',isRender:true}
                    ],
                    //对员工的操作
                    task: [{
                        type: 'toAjax',
                        content: 'empState',
                        ajaxUrl: 'userManager/empManager/changeStateInfo.do',
                        field: 'isAccess',
                        filter: 'tranScoreRuleIsAble3'
                    },
                        {
                            type: 'toChange',
                            desc: '修改',
                            newtab: {
                                title: "修改员工信息",
                                id: "editEmpController",
                                from: 10026,
                                ctrlName: "editEmpController",
                                ctrl: 'usermanager/empmanager/empUpdate',
                                template: "usermanager/empmanager/empUpdate.html",
                                ng_show: false
                            }
                        },
                        {type: 'delete', content: 'delete', ajaxUrl: 'userManager/empManager/delete.do', desc: '删除'}
                    ]
                };
                
                $scope.$watch('resultList', function(resultList){
                	if(resultList){
                		$scope.pageSet.title = 
                			'员工列表' +
                			' ( 已加入:' +resultList.showJoinBean.joinedNum + ' 未加入:' + resultList.showJoinBean.unJoinedNum+' )';
                	}
                });

            }
        ]
    };

    return rtObj;
});

