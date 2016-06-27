/**
 * 集团会员列表页
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
define(function (require) {
	//引用样式  样式名：config.js中配置
    var score_rule_css = require("css!score_rule_css");
    //引用自定义样式
    var membersCss = require("css!../../../assets/css/members");
    var ngAMD = require('ngAMD');
    
    //引入拉入黑名单模态框页面及js
    var memberBacklistCtrl = require( "business/membermanage/memberBacklist" );
    var memberBacklistTemp = require( "text!business/membermanage/memberBacklist.html" );
    //定义controller

        ngAMD.controller("memberListCtrl", [
            '$scope',
            '$rootScope',
            '$uibModal',
            //自定义模块注入，与回调函数顺序应一致
            "register",
            'appConstant',
            "ajaxService",
            "modalService",
            function ($scope, $rootScope,$uibModal, register, appConstant, ajaxService, modalService) {
            	 
            	//获取按钮权限
            	$scope.memberCardBtn = register.getRoot('会员卡');
            	$scope.sendMsgBtn = register.getRoot('发送消息');
            	$scope.editBtn = register.getRoot('修改');
            	$scope.detailBtn = register.getRoot('详情');
            	$scope.blackListBtn = register.getRoot('黑名单操作');
            	
            	var allDate=true;
            	var toDay=false;
            	var param=null;
            	if (typeof($rootScope.searchRequest) != "undefined"
            			&&typeof($rootScope.searchRequest.select) != "undefined"){
            	
            		if($rootScope.searchRequest.select=='toDay'){
            			allDate=false;
            			toDay=true;
            			param=0;
            		} 
            		if($rootScope.searchRequest.select=='all'){
            			allDate=true;
            			toDay=false;
            		}
                }
            	//获取sessionId
                var sessionId = $rootScope.sessionId;
                /*
                 * 筛选条件定义
                 */
                $scope.conditions = {
                    ajaxUrl: 'businessmanage/memberManage/list.do',// 请求后台url
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage,"joinDays":param},
                    filter: [
                        { //增加卡状态过滤条件
                            type: 'normal',
                            field: '状态：',
                            requestFiled: 'memberStatus',
                            value: [{"name": "全部", "state": true, "value": null},
                                {"name": "正常", "state": false, "value": 0},
                                {"name": "黑名单", "state": false, "value": 1}]
                        },
                        { //增加加入时间过滤条件，类型为dateFlex类型，后面会自动产生时间范围选择 memberBeginTime、memberEndTime
                          //加入时间用joinDays获取
                            type: 'dateFlex',
                            field: '加入时间：',
                            requestFiled: 'joinDays',
                            value: [{"name": "全部", "state": allDate, "value": null},
                                {"name": "今天", "state": toDay, "value": 0},
                                {"name": "昨天", "state": false, "value": 1},
                                {"name": "近7天", "state": false, "value": 7},
                                {"name": "近15天", "state": false, "value": 15},
                                {"name": "近30天", "state": false, "value": 30}],
                            requestFiled: ['joinDays', 'memberBeginDate', 'memberEndDate']//分别对应普通按钮时间，开始时间和结束时间
                        }
                    ],
                    //筛选头增加条件查询（姓名、手机号、卡号、会员标识），类型值用searchType承载
                    select: {requestFiled:'searchType', options: [
                        {"name": "手机号", "state": false, "value": 2},
                        {"name": "卡号", "state": false, "value": 3},
                        {"name": "姓名", "state": true, "value": 1}//表头里下拉选择，不需要可不配置此项


                    ]},
                    //搜索框展现，点击搜索按钮，获取其他所有的筛选条件，以及输入值用searchTypeValue承载
                    search: {requestFiled: 'searchTypeValue', request: {"sessionId": sessionId}}//表头里的搜索框，不需要可不配置此项
                };
                /* 列表 */
                $scope.pageSet = {
                    title: "会员管理",
                    currentPage: appConstant.pageSet.currentPage,//当前页
                    maxSize: appConstant.pageSet.maxSize,//最大页
                    numPerPage: appConstant.pageSet.numPerPage //每页显示条数
                };
                
               /* 会员修改操作 */
                $scope.doMemeberEdit = function (member) {
                    member.callback = function a(callback) {
                    	$scope.pageChanged();//回调页码改变函数，实现页面数据刷新
                    };
                    //新建Tab页
                    register.addToTabs({
                        title: "完善会员资料",//TAB页面标题
                        id: "mbemberUpdate" + member.id,//Tab唯一ID
                        template: "business/membermanage/memberEdit.html",//关联Tab的html页面
                        ctrl: 'business/membermanage/memberEdit',//关联html的js文件
                        ctrlName: "memberEditCtrl",//关联html的js中定义的controller名称
                        ng_show: false,
                        type: 'single',
                        from: 10013 //function数据库功能（会员管理）ID保持一致
                    }, member);//member传递参数，将对象传递到Tab页面
                };
                
                /*会员详情操作*/
                $scope.doMemeberDetail = function (member) {
                    member.callback = function a(callback) {
                        callback();
                    };
                    register.addToTabs({
                        title: "查看会员详情",//TAB页面标题
                        id: "mbemberDetail" + member.id,//Tab唯一ID
                        template: "business/membermanage/memberDetail.html",//关联Tab的html页面
                        ctrl: 'business/membermanage/memberDetail',//关联html的js文件
                        ctrlName: "memberDetailCtrl",//关联html的js中定义的controller名称
                        ng_show: false,
                        type: 'single',
                        from: 10013 //function数据库功能（会员管理）ID保持一致
                    }, member); //member传递参数，将对象传递到Tab页面
                };
               
                /*加入黑名单|移除黑名单操作*/
                $scope.doMemberStatus = function (member) {
                	//会员参数
                	if(!member.status){
                		//拉黑操作
                		showMemberBacklistModal(member);
                	}else{
                		//移除黑名单操作
                		var data={
                    			id:member.id,
                    			status:member.status
                    	}
                		//参数声明
                        var param = {member: data, sessionId: $rootScope.sessionId};
                        //调用ajax服务实现会员状态更改
                        ajaxService.AjaxPost(param, 'businessmanage/memberManage/updateMemberStatus.do').then(function (result) {
                        	//调用成功的回调方法
                            member.status = result.member.status;//将会员状态改为返回结果中的会员状态
                            if(member.status){
                                modalService.info({title:'提示', content:'加入黑名单成功!', size:'sm', type: 'confirm'});
                            }else{
                                modalService.info({title:'提示', content:'移除黑名单成功!', size:'sm', type: 'confirm'});//size:lg or sm; type: confirm or cancel or task
                            }
                        });
                		
                	}
                	
                };
                
                /**
                 * 唤起拉入黑名单操作的的模态窗口
                 */
               var showMemberBacklistModal = function(member) {
                    var modalInstance = $uibModal.open({
                        //受否加载动画
                        animation: true,
                        //模态框页面
                        template: memberBacklistTemp,
                        //模态框的尺寸
                        size: "sm",
                        //模态框对应的controller
                        controller: 'memberBacklistCtrl',
                        //向模态框传递参数
                        resolve: {
                            memberObjModel: function () {
                                return member;
                            }
                        }

                    });
                    //处理模态框返回到当前页面的数据
                    modalInstance.result.then(function (updateMember) {
                    	 member.status = updateMember.status;//将会员状态改为返回结果中的会员状态
                         if(member.status){
                             modalService.info({title:'提示', content:'加入黑名单成功!', size:'sm', type: 'confirm'});
                         }else{
                             modalService.info({title:'提示', content:'移除黑名单成功!', size:'sm', type: 'confirm'});//size:lg or sm; type: confirm or cancel or task
                         }

                    });
                };
                /*切换页面操作*/
                $scope.pageChanged = function () {
                	//一个页面多tab情况下，获得第一个Tab中的请求内容
                    var postObj = $scope.$$childTail.$$childHead.requestObj.request;
                    postObj.pageNo = $scope.pageSet.currentPage;//设置当前页面
                    postObj.pageCount = $scope.pageSet.numPerPage; //设置每页显示数量
                    //调用ajax服务查询新数据，并将结果集赋值给当前Tab的resultList
                    ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                    	  $scope.$$childTail.$$childHead.resultList = result;
                    });
                };
                /*会员卡详情*/
                $scope.doCardDetail=function(member){
                	/*if(!member.mobile || member.mobile == ''){
                		modalService.info({title:'提示', content:'未检测到会员的手机号!', size:'sm', type: 'confirm'});
                		return false;
                	}*/
                    register.openTabWithRequest({id: 10014},{searchType: 4,searchTypeValue: member.id});//穿透时调用的方法,id为目标tab功能id,第二个参数为显示类型及显示条件（searchType搜索的下拉条件 searchTypeValue搜索框内的内容）
                }
                
               /* 黑名单操作详情*/
                $scope.popBacklistInfo =function(member){
	            	 ajaxService.AjaxPost({memberId:member.id, sessionId: $rootScope.sessionId}, 'businessmanage/memberBacklist/getLastBackListRec.do').then(function (result) {
	                 	if(result.data){
	                 		var lastBacklist = result.data;
	                 		var message=" 操作人："+lastBacklist.createUserName
	                 					+" 操作时间："+lastBacklist.createTime
	                 					+" 备注："+lastBacklist.note;
                            modalService.info({title:'操作详情', content:message, size:'sm', type: 'confirm'});
                        }
	                 });
                }
            }
        ]);
    return 'memberListCtrl';
});

