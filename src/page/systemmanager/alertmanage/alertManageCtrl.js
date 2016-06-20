/**
 * 预警管理页面
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor liuzy
 * @updateHistory
 *
 *
 */
define(function (require) {
    //引用样式
    var score_rule_css = require("css!score_rule_css");
    var alert_manage_css = require("css!alert_manage_css");
    //加载angular模块
    var angular = require("angular");
    //引入模态框页面及js
    var recipientCtrl = require( "systemmanager/alertmanage/recipientSelector" );
    var recipientTemp = require( "text!systemmanager/alertmanage/recipientSelector.html" );
    var rtObj = {

        ctrl: "alertManageCtrl",
        //模块依赖
        arrFunc: [
            '$scope',
            '$rootScope',
            'ajaxService',
            'appConstant',
            '$uibModal',
            'register',
            'modalService',
            function ($scope, $rootScope, ajaxService, appConstant, $uibModal,register,modalService) {
            	
                $scope.edit = register.getRoot('编辑');
                $scope.ignore = register.getRoot('忽略');
                $scope.ignoreAll = register.getRoot('全部忽略');
                $scope.ignoreByCard = register.getRoot('本卡忽略');
                $scope.detail = register.getRoot('详情');

                //取sessionId
                var sessionId = $rootScope.sessionId;
                //定义预警对象
                $scope.warning = {};
                //备份原始的预警通知人
                var initRecipients = [];
                /*
                获取预警通知人列表
                 */
                ajaxService.AjaxPost({"sessionId": sessionId}, 'systemmanager/alertmanager/getNoticeEmpList.do').then(function (result) {
                    if (result) {
                        $scope.recipients = result.data;
                        initRecipients = angular.copy($scope.recipients);
                    }
                });

                /*
                    用与刷新预警配置数据
                 */
                function refreshWarnings(){
                    //定义全部的预警对象数组
                    $scope.warnings = [];
                    //定义订单预警通知对象
                    $scope.oderWarning = {};
                    //定义短信预警通知对象
                    $scope.smsWarning = {};
                    //定义储值预警阈值对象
                    $scope.saleWarning = {};
                    //定义消费预警阈值对象
                    $scope.consumeWarning = {};
                    //定义错误预警对象
                    $scope.errorCountWarning = {};
                    //加载全部预警信息
                    ajaxService.AjaxPost({"sessionId": sessionId}, 'systemmanager/alertmanager/load.do').then(function (result) {
                        if (result) {
                            $scope.warnings = result.data;
                            var warnings = $scope.warnings;
                            for(var i = 0; i< warnings.length; i++){
                                warnings[i].ruleInfo = JSON.parse(warnings[i].ruleInfo);
                                /*
                                根据type区分交易预警，订单预警，短信预警
                                 */
                                if(warnings[i].type == 1){
                                    /*
                                    根据operation区分消费预警阈值，储值预警阈值，操作预警阈值
                                     */
                                    if(warnings[i].operation == 1){
                                        $scope.consumeWarning = warnings[i];
                                    }
                                    if(warnings[i].operation == 2){
                                        $scope.saleWarning = warnings[i];
                                    }
                                    if(warnings[i].operation == 3){
                                        $scope.errorCountWarning = warnings[i];
                                    }
                                    //获取是否开启锁定的值
                                    $scope.lockFlg =  $scope.consumeWarning.lockFlg ? $scope.consumeWarning.lockFlg : 0;
                                }else if(warnings[i].type == 2 && warnings[i].operation == 4){
                                    $scope.oderWarning = warnings[i];
                                }else if(warnings[i].type == 3 && warnings[i].operation == 5){
                                    $scope.smsWarning = warnings[i];
                                }
                            }
                        }
                    });
                }

                //执行刷新函数
                refreshWarnings();


                /*
                保存预警数据按钮
                 */
                $scope.saveWarning = function(warning){
                    $scope.warning = warning;
                    $scope.warnings.push($scope.warning);
                    $scope.showAdd = false;

                };
                /*
                保存并新增预警信息按钮
                 */
                $scope.saveAndAddWarning = function(warning){
                    $scope.warning = warning;
                    $scope.warnings.push($scope.warning);
                    $scope.showAdd = true;
                };

                /**
                 *更新预警信息按钮
                 */
                $scope.updateWarning = function(warning){
                    $scope.warning = warning;
                    //$scope.warnings.push($scope.warning);
                    $scope.cancelWarning();
                };
                /*
                取消预警信息操作按钮
                 */
                $scope.cancelWarning = function(){
                    $scope.showAdd = false;
                    $scope.isShow = true;
                };
                /*
                新增预警信息按钮
                 */
                $scope.addWarning = function(){
                    $scope.isShow = false;
                    $scope.showAdd = true;
                };

                /*
                    保存交易预警操作
                 */
                $scope.saveTransactionWarning = function(consumeWarning, saleWarning, errorCountWarning){
                    var updateArr = [];
                    var createArr = [];
                    //开启锁定分别控制充值预警配置，消费预警配置，操作预警配置，分别给其他对象的lockFlg字段赋值
                    if(consumeWarning.lockFlg === 1){
                        saleWarning.lockFlg = consumeWarning.lockFlg;
                        errorCountWarning.lockFlg = consumeWarning.lockFlg;
                    }else{
                        consumeWarning.lockFlg = 0;
                        saleWarning.lockFlg = 0;
                        errorCountWarning.lockFlg = 0;
                    }
                    consumeWarning.ruleInfo = JSON.stringify(consumeWarning.ruleInfo);
                    saleWarning.ruleInfo = JSON.stringify(saleWarning.ruleInfo);
                    errorCountWarning.ruleInfo = JSON.stringify(errorCountWarning.ruleInfo);
                    var testParam1 = {
                        "sessionId": sessionId
                    };
                    var testParam2 = {
                        "sessionId": sessionId
                    };
                    if(consumeWarning.id){
                        updateArr.push(consumeWarning);
                    }else{
                        consumeWarning.type = 1;
                        consumeWarning.operation = 1;
                        createArr.push(consumeWarning);
                    }
                    if(saleWarning.id){
                        updateArr.push(saleWarning);
                    }else{
                        saleWarning.type = 1;
                        saleWarning.operation = 2;
                        createArr.push(saleWarning);
                    }
                    if(errorCountWarning.id){
                        updateArr.push(errorCountWarning);
                    }else{
                        errorCountWarning.type = 1;
                        errorCountWarning.operation = 3;
                        createArr.push(errorCountWarning);
                    }
                    if(updateArr.length !== 0){
                        testParam1.alertCreateBean = updateArr;
                        updateWarning(testParam1);
                    }
                    if(createArr.length !== 0){
                        testParam2.alertCreateBean = createArr;
                        createWarning(testParam2);
                    }
                };
                /*
                保存订单预警
                 */
                $scope.saveOrderWarning = function(orderWarning){

                    var alertCreateBean = [];
                    var testParam = {
                        "sessionId": sessionId
                    };
                    orderWarning.ruleInfo = JSON.stringify(orderWarning.ruleInfo);
                    //根据id值的存在判断是更新还是新增
                    if(orderWarning.id){
                        alertCreateBean.push(orderWarning);
                        testParam.alertCreateBean = alertCreateBean;
                        updateWarning(testParam);
                    }else{
                        orderWarning.type = 2;
                        orderWarning.operation = 4;
                        alertCreateBean.push(orderWarning);
                        testParam.alertCreateBean = alertCreateBean;
                        createWarning(testParam);
                    }
                };
                /*
                保存消息预警
                 */
                $scope.saveMessageWarning = function(smsWarning){ 
                    var alertCreateBean = [];
                    var testParam = {
                        "sessionId": sessionId
                    };
                    smsWarning.ruleInfo = JSON.stringify(smsWarning.ruleInfo);
                    //根据id值的存在判断是更新还是新增
                    if(smsWarning.id){
                        alertCreateBean.push(smsWarning);
                        testParam.alertCreateBean = alertCreateBean;
                        updateWarning(testParam);
                    }else{
                        smsWarning.type = 3;
                        smsWarning.operation = 5;
                        alertCreateBean.push(smsWarning);
                        testParam.alertCreateBean = alertCreateBean;
                        createWarning(testParam);
                    }
                };

                /*
                    执行更新预警信息函数，供其他方法调用
                 */
                function updateWarning(testParam){
                    ajaxService.AjaxPost(testParam, 'systemmanager/alertmanager/edit.do').then(function (result) {
                        if (result && result.status == 1) {
                            modalService.info({content:'保存成功！', type: 'ok'});
                            refreshWarnings();
                        }
                    });
                }
                /*
                 执行创建预警信息函数，供其他方法调用
                 */
                function createWarning(testParam){
                    ajaxService.AjaxPost(testParam, 'systemmanager/alertmanager/create.do').then(function (result) {
                        if (result && result.status == 1) {
                            modalService.info({content:'保存成功！', type: 'ok'});
                            refreshWarnings();

                        }
                    });
                }

                /**
                 * 定义弹出模态框的模型
                 */
                $scope.showRecipientModal = function() {
                    var modalInstance = $uibModal.open({
                        //受否加载动画
                        animation: true,
                        //模态框页面
                        template: recipientTemp,
                        //模态框的尺寸
                        size: "lg",
                        //模态框对应的controller
                        controller: 'recipientSelectorCtrl',
                        //向模态框传递参数
                        resolve: {
                            noticeEmps: function () {
                                return $scope.recipients;
                            }
                        }

                    });
                    //处理模态框返回到当前页面的数据
                    modalInstance.result.then(function (selectedItem) {
                        for(var i = 0; i< selectedItem.length; i++){
                            var recipient = {};
                            recipient.empId = selectedItem[i].empId;
                            recipient.empName = selectedItem[i].empName;
                            recipient.businessFlg = 1;
                            recipient.orderFlg = 1;
                            recipient.smsFlg = 1;
                            $scope.recipients.push(recipient);
                        }
                    });
                };
                /**
                 * 预警通知人表格里的删除操作
                 * @param $index 数组中的索引
                 */
                $scope.minusNotice = function($index){
                    $scope.recipients.splice($index, 1);
                };
                /**
                 * 保存预警通知人操作，区分出哪些数据是删除的，哪些数据是更新的，哪些数据是新增的，分别用标签标记后执行更新操作
                 */
                $scope.saveNotice = function(){
                    var testParam = {"sessionId": sessionId};
                    //变化的预警通知人数组
                    var alertNoticeRelationConfig = [];
                    //新的预警通知人数组
                    var recipients = angular.copy($scope.recipients);
                    var excuteRecipients = angular.copy(recipients);
                    var initRecipientsArr = angular.copy(initRecipients);
                    var excuteInitRecipientsArr = angular.copy(initRecipientsArr);
                    for(var i = 0; i< recipients.length; i++){
                        var isExist = false;
                        for(var j = 0; j < initRecipientsArr.length; j++){
                            if(recipients[i].empId === initRecipientsArr[j].empId){
                                if (recipients[i].businessFlg !== initRecipientsArr[j].businessFlg ||
                                    recipients[i].orderFlg !== initRecipientsArr[j].orderFlg ||
                                    recipients[i].smsFlg !== initRecipientsArr[j].smsFlg){
                                    var recipient = recipients[i];
                                    recipient.type = "UPDATE";
                                    alertNoticeRelationConfig.push(recipient);
                                }
                                if(inArray(excuteInitRecipientsArr,initRecipientsArr[j])!==-1){
                                    excuteInitRecipientsArr.splice(inArray(excuteInitRecipientsArr,initRecipientsArr[j]),1);
                                    isExist = true;
                                    break;
                                }
                            }

                        }
                        if(isExist === true){
                            if(inArray(excuteRecipients,recipients[i])!==-1){
                                excuteRecipients.splice(inArray(excuteRecipients,recipients[i]),1);
                            }

                        }
                    }
                    updateArr(excuteRecipients, "ADD");
                    alertNoticeRelationConfig = alertNoticeRelationConfig.concat(excuteRecipients);
                    updateArr(excuteInitRecipientsArr, "DELETE");
                    alertNoticeRelationConfig = alertNoticeRelationConfig.concat(excuteInitRecipientsArr);
                    testParam.alertNoticeRelationConfig = alertNoticeRelationConfig;
                    ajaxService.AjaxPost(testParam, 'systemmanager/alertmanager/alertNoticeEdit.do').then(function (result) {
                        if(result&&result.status === 1){
                            modalService.info({content:'保存成功！', type: 'ok'});
                            ajaxService.AjaxPost({"sessionId": sessionId}, 'systemmanager/alertmanager/getNoticeEmpList.do').then(function (result) {
                                if (result&&result.status === 1) {
                                    $scope.recipients = result.data;
                                    initRecipients = angular.copy($scope.recipients);

                                }
                            });
                        }
                    })
                };

                function inArray( arr,item ){
                    for( var i = 0 ; i < arr.length ; i++ ){
                        if( arr[i].empId == item.empId ){
                            return i;
                        }
                    }
                    return -1;
                }

                //检测操作的item和数组里的item是否含有相同的元素
                function updateArr(arr, type){
                    for( var i = 0 ; i < arr.length ; i++ ){
                        arr[i].type = type;
                    }
                }
                
                $scope.alertType = {"1":"业务预警","2":"订单预警", "3":"短信预警"};

                /**
                 * 定义预警记录tab的筛选器
                 * @type {{ajaxUrl: string, request: {sessionId: *, pageNo: string, pageCount: number}, filter: *[], select: {requestFiled: string, options: *[]}, search: {requestFiled: string, request: {sessionId: *}}}}
                 */
                $scope.conditions = {
                    ajaxUrl: 'systemmanager/alertlog/list.do',
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
                    filter: [
                        {
                            type: 'normal',
                            field: '预警类型：',
                            requestFiled: 'alertType',
                            value: [{"name": "全部", "state": true, "value": null},
                                {"name": "交易预警", "state": false, "value": 1},
                                {"name": "订单预警", "state": false, "value": 2},
                                {"name": "短信预警", "state": false, "value": 3}]
                        },
                        {
                            type: 'normal',
                            field: '状态：',
                            requestFiled: 'statusType',
                            value: [{"name": "全部", "state": true, "value": null},
                                {"name": "未忽略", "state": false, "value": "1"},
                                {"name": "已忽略", "state": false, "value": "0"}]
                        },
                        {
                            type: 'dateFlex',
                            field: '选择时间：',
                            value: [
                                {"name": "全部", "state": true, "value": null},
                                {"name": "今天", "state": false, "value": 0},
                                {"name": "昨天", "state": false, "value": 1},
                                {"name": "近7天", "state": false, "value": 7}//,
                                //{"name": "近15天", "state": false, "value": 15},
                                //{"name": "近30天", "state": false, "value": 30}
                            ],
                            requestFiled: ['tradeTime', 'startDate', 'endDate']//分别对应普通按钮时间，开始时间和结束时间
                        }],
                    select: {requestFiled:'searchType', options: [{"name": "卡号", "state": false, "value": 3}]},
                    search: {requestFiled: 'searchTypeValue', request: {"sessionId": sessionId}}
                };
                /**
                 * 表格panel列表
                 * @type {{title: string, currentPage: number, maxSize: number, numPerPage: number}}
                 */
                $scope.pageSet = {
                    //panel显示名称
                    title:"预警记录",
                    //当前页面
                    currentPage: appConstant.pageSet.currentPage,
                    //显示多少页
                    maxSize: appConstant.pageSet.maxSize,
                    //每页显示数量
                    numPerPage: appConstant.pageSet.numPerPage
                };

                /*列表checkbox选择，全选和反选
                * */
                $scope.selected = [];
                $scope.checkAll = false;
                $scope.checked = false;
                /**
                 *预警记录实现全选和反选方法
                 * @param checkall
                 * @param datas
                 */
                $scope.selectAllRecords = function(checkall, datas){
                    if(checkall === true){
                        $scope.checked = true;
                        $scope.selected = [];
                        for(var i = 0; i < datas.length ; i++){
                            $scope.selected.push(datas[i]);
                        }
                    }else{
                        $scope.checked = false;
                        $scope.selected = [];
                    }
                };

                /**
                 * 根据chexk操作更改当前对象选中和未选中状态，具体操作
                 * @param action
                 * @param data
                 */
                var updateSelected = function(action,data){
                    if(action == 'add' && $scope.selected.indexOf(data) === -1){
                        $scope.selected.push(data);
                    }
                    if(action == 'remove' && $scope.selected.indexOf(data)!== -1){
                        var idx = $scope.selected.indexOf(data);
                        $scope.selected.splice(idx,1);
                    }
                    if($scope.selected.length == 0){
                        $scope.checkAll = false;
                    }
                };
                /**
                 * 执行check操作
                 * @param $event
                 * @param data
                 */
                $scope.updateSelection = function($event, data){
                    var checkbox = $event.target;
                    var action = (checkbox.checked ? 'add' : 'remove');
                    updateSelected(action,data);
                };
                /**
                 * 判断当前元素是否在选中元素的数组里
                 * @param id
                 * @returns {boolean}
                 */
                $scope.isDataSelected = function(id){
                    return $scope.selected.indexOf(id)>= 0;
                };

                /**
                 * 本卡忽略操作
                 */
                $scope.ignoreThisCard = function(){
                    var cardNums = [];
                    if($scope.selected.length===0){
                        modalService.info({title:'提示', content:'请至少选中一个卡！', size:'sm', type: 'confirm'});
                        return;
                    }
                    for(var i = 0; i<$scope.selected.length; i++){
                        if($scope.selected[i].cardId && $scope.selected[i].cardId !== null){
                            if(cardNums.indexOf($scope.selected[i].cardId)== -1){
                                cardNums.push($scope.selected[i].cardId);
                            }
                        }
                    }
                    var testParam = {"sessionId": sessionId,"cardNums": cardNums};
                    ajaxService.AjaxPost(testParam, 'systemmanager/alertlog/edit.do').then(function (result) {
                        if(result){
                            refreshlogs();
                            $scope.selected = [];
                        }
                    })
                };
                /**
                 * 忽略操作
                 */
                $scope.ignoreLog = function(){
                    var ids = [];
                    for(var i = 0; i<$scope.selected.length; i++){
                        if(ids.indexOf($scope.selected[i].id)== -1){
                            ids.push($scope.selected[i].id);
                        }
                    }
                    if (ids.length == 0) {
                    	modalService.info({title:'提示', content:'请选择预警记录！', size:'sm', type: 'confirm'});
                    	return;
                    }
                    var testParam = {"sessionId": sessionId,"ids": ids};
                    ajaxService.AjaxPost(testParam, 'systemmanager/alertlog/edit.do').then(function (result) {
                        if(result){
                            refreshlogs();
                            $scope.selected = [];
                        }
                    })
                };

                /**
                 * 忽略本条记录操作
                 */
                $scope.ignoreThisLog = function(id){
                    var ids = [id];
                    var testParam = {"sessionId": sessionId,"ids": ids};
                    ajaxService.AjaxPost(testParam, 'systemmanager/alertlog/edit.do').then(function (result) {
                        if(result){
                            refreshlogs();
                            $scope.selected = [];
                        }
                    })
                };
                /**
                 * 全部忽略操作
                 */
                $scope.allIgnore = function(){
                    var testParam = {"sessionId": sessionId,"flag": 0};
                    ajaxService.AjaxPost(testParam, 'systemmanager/alertlog/edit.do').then(function (result) {
                        if(result){
                            refreshlogs();
                            $scope.selected = [];

                        }
                    })
                };

                /**
                 * 刷新预警记录数据
                 * @param testParam
                 */
                function refreshlogs(){
                    ajaxService.AjaxPost($scope.conditions.request, 'systemmanager/alertlog/list.do').then(function (result) {
                        if(result){
                            $scope.$$childTail.$$childHead.resultList = result;
                            if(!$scope.$$phase){
                                $scope.$apply();
                            }
                        }
                    })
                }

                /**
                 * 定义到跳转交易详情页面的tab
                 * @param tsid
                 */
                $scope.goTradeDetail = function (tsid) {
                    register.openTabWithRequest({id: 10015},{searchType: 3,searchTypeValue: tsid});//穿透时调用的方法,id为目标tab功能id,第二个参数为显示类型及显示条件（searchType搜索的下拉条件 searchTypeValue搜索框内的内容）

                };


            }
        ]
    };

    return rtObj;
});

