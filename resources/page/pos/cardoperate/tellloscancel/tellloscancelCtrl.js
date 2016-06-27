/**
 * 挂失&取消挂失业务
 * @version  v1.0
 * @createTime: 2016-06-02
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
define(['posService'], function () {
	var angular = require("angular");
    return ["$scope",'$window',"ajaxService","posService","getCookieService","$rootScope","modalService","$timeout",
            function ($scope,$window,ajaxService,posService,getCookieService,$rootScope,modalService,$timeout) {
    		//sessionId获取
    		var sessionId = getCookieService.getCookie("CRMSESSIONID");
    		//初始化警告、错误等提示信息
        	$scope.tipMsg={};
    		//卡号信息来源默认本页填写
    		$scope.entranceFrom = 0;
    		//默认手机号或卡号可以编辑
    		$scope.cardNoDisabled=false;


    		//1. 初始化挂失对象
    		$scope.doLossVo={
            		cardNo:'',//卡号
            		tsCode:'', //流水号
            		operationType:'1',//挂失
            		sessionId:sessionId,
            		forbideSave:false //保存按钮是否禁用；默认不禁用
            }
            
          
    		//2. 初始化取消挂失
            $scope.cancelLossVo={
            		cardNo:'',//卡号
            		tsCode:'', //流水号
            		operationType:'2',//取消挂失
            		sessionId:sessionId,
            		forbideSave:false //保存按钮是否禁用；默认不禁用
            }
				$scope.setFocus = function(eId){
					var setTimer = posService.setFocus(eId);
					$scope.$on('$destroy', function(){
						$timeout.cancel(setTimer);
					});

				};
            
            //3.加载页面是 ，如果发现用户信息存在……（操作一卡多业务的情况的入口）
    		if($rootScope.currentuserinfo){
    			$scope.entranceFrom = 1;//数据来源传递
    			$scope.currUserInfo = $rootScope.currentuserinfo;
    			$scope.doLossVo.cardNo = $scope.currUserInfo.cardInfoBean.number;//卡号
    			
    			$scope.cancelLossVo.cardNo = $scope.currUserInfo.cardInfoBean.number;//卡号
    			
    			$scope.cardNoDisabled=true; //改变手机号\卡号输入状态为禁用
    		}
            
            
    		//4.当前页面获取会员信息和卡信息（快捷菜单可以从这里触发）
    		$scope.getMemeberAndCardInfo=function(cardNo){
            	//赋值   为编辑页面传值
	        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	        	//定义全局当前user信息
	        	$rootScope.currentuserinfo = null;
    			
    			if( !cardNo 
					|| cardNo == '' 
    				|| !(/^(((13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8})|([1-9](\d{4,9}|\d{11,15})))$/
    						.test(cardNo))){
            		//modalService.info({title:'提示', content:'获取不到正确手机号或卡号!', size:'sm', type: 'confirm'});
	           		return false;
            	}
    			ajaxService.AjaxPost( {paramValue:cardNo,sessionId:sessionId},"postrade/memberhome/memberhomeinfo.do").then(
	    			function (result) {
	    				if(result.status && result.data)
	    				{
	    		    		var data = result.data;
	    		    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = data.memberInfoBean;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = data;
	    		        	$scope.currUserInfo = $rootScope.currentuserinfo;
	    		        	
	    	    			$scope.doLossVo.cardNo =$scope.currUserInfo.cardInfoBean.number;//卡号
	    	    			$scope.cancelLossVo.cardNo = $scope.currUserInfo.cardInfoBean.number;//卡号
	    	    			
	    				}
	                }
	    		);
    		}
    		
           
            //9.返回操作
            $scope.goBack = function(){
            	if($scope.entranceFrom ==0){
            		//赋值   为编辑页面传值
		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
		        	//定义全局当前user信息
		        	$rootScope.currentuserinfo = null;
            	}
                posService.goBack();
            };
            
            //10 保存操作
            $scope.saveLossOperation = function(lossVo){
            	lossVo.forbideSave=true;
            	
            	if( !lossVo.cardNo || lossVo.cardNo == '' || !(/^[1-9](?:\d{0,9}|\d{11,15})$/.test(lossVo.cardNo)) ){
            		modalService.info({title:'提示', content:'获取不到正确卡号!', size:'sm', type: 'confirm'});
            		lossVo.forbideSave=false;
            		return false;
            	}
            	
            	if(!lossVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	                	if(result.tsCode){
	                		lossVo.tsCode = result.tsCode;
	                		trueSave(lossVo);
	            		}else{
	            			lossVo.forbideSave=false;
	            		}
	                },function(){//errror
	                	lossVo.forbideSave=false;          
	                });
            	}else{
            		trueSave(lossVo);
            	}
            }
            //7.1 判断条件合法后，触发真实重置密码
            function trueSave(lossVo){
            	ajaxService.AjaxPost(lossVo, 'postrade/posCardUsed/saveLossOperate.do').then(function (result) {
            		lossVo.forbideSave=false;//解除按钮不可用状态
            		if(result.status){
            			if(lossVo.operationType == '1'){
            				//modalService.info({title:'提示', content:'会员卡挂失成功!', size:'sm', type: 'confirm'});
            				modalService.info({content:'会员卡挂失成功!', type: 'ok'});
            			}else{
            				//modalService.info({title:'提示', content:'会员卡取消挂失成功!', size:'sm', type: 'confirm'});
            				modalService.info({content:'会员卡取消挂失成功!', type: 'ok'});
            			}
                		//调用打印服务
                    	//console.log(result.printInfo);
                    	
                    	//(不考虑打印的情况下)页面恢复初始化
                    	if($scope.entranceFrom == 0){
                    		//1. 初始化挂失对象
                    		$scope.doLossVo={
                            		cardNo:'',//卡号
                            		tsCode:'', //流水号
                            		operationType:'1',//挂失
                            		sessionId:sessionId,
                            		forbideSave:false //保存按钮是否禁用；默认不禁用
                            }
                    		//2. 初始化取消挂失
                            $scope.cancelLossVo={
                            		cardNo:'',//卡号
                            		tsCode:'', //流水号
                            		operationType:'2',//取消挂失
                            		sessionId:sessionId,
                            		forbideSave:false //保存按钮是否禁用；默认不禁用
                            }
                    		$scope.cardNoDisabled = false;//解除卡号栏的不可用状态
                    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = null;
                    	}else{
                    		$scope.getMemeberAndCardInfo(lossVo.cardNo);
                    		posService.goBack();
                    	}
                	}
                },function(){
                	 $scope.lossVo.forbideSave=false;//解除按钮不可用状态       
                });
            }
           
    	}];
});