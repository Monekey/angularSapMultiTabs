/**
 * 卡密码业务
 * @version  v1.0
 * @createTime: 2016-05-29
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

				$scope.setFocus = function(eId){
					var setTimer = posService.setFocus(eId);
					$scope.$on('$destroy', function(){
						$timeout.cancel(setTimer);
					});

				};
    		//1. 初始化修改密码
            $scope.editPasswdVo={
            		cardNo:'',//卡号
            		tsCode:'', //流水号
            		oldPasswd:'',//旧密码
            		newPasswd:'',//新密码
            		rePasswd:'',//确认密码
            		isValidNewPasswd:false,//是否有效新密码（校验新密码与确认密码是否一致）
            		sessionId:sessionId,
            		forbideSave:false //保存按钮是否禁用；默认不禁用
            }
            
          
    		//2. 初始化重置密码
            $scope.resetPasswdVo={
            		cardNo:'',//卡号
            		tsCode:'', //流水号
            		sessionId:sessionId,
            		forbideSave:false //保存按钮是否禁用；默认不禁用
            }
            
            //3.加载页面是 ，如果发现用户信息存在……（操作一卡多业务的情况的入口）
    		if($rootScope.currentuserinfo){
    			$scope.entranceFrom = 1;//数据来源传递
    			$scope.currUserInfo = $rootScope.currentuserinfo;
    			$scope.editPasswdVo.cardNo = $scope.currUserInfo.cardInfoBean.number;//卡号
    			
    			$scope.resetPasswdVo.cardNo = $scope.currUserInfo.cardInfoBean.number;//卡号
    			
    			$scope.cardNoDisabled=true; //改变手机号\卡号输入状态为禁用
    		}
            
            
    		//4.当前页面获取会员信息和卡信息（快捷菜单可以从这里触发）
    		$scope.getMemeberAndCardInfo=function(cardNo){
            	//赋值   为编辑页面传值
	        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	        	//定义全局当前user信息
	        	$rootScope.currentuserinfo = null;
	        	
    			//$scope.editPasswdVo.isValidCard =false;
    			
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
	    		        	
	    	    			$scope.editPasswdVo.cardNo =$scope.currUserInfo.cardInfoBean.number;//卡号
	    	    			$scope.resetPasswdVo.cardNo = $scope.currUserInfo.cardInfoBean.number;//卡号
	    	    			
	    				}
	                }
	    		);
    		}
    		
    		 //验证密码
            $scope.validatePasswd=function(){
            	$scope.editPasswdVo.isValidNewPasswd =false;
            	var result =false;
            	if( !(/^\d{6}$/.test($scope.editPasswdVo.rePasswd))){
            		$scope.tipMsg.repassword="请输入6位确认密码！";
            		result = true;
            	}else{
            		if($scope.editPasswdVo.rePasswd != $scope.editPasswdVo.newPasswd){
            			$scope.tipMsg.repassword="新密码与确认密码不一致！";
            			result = true;
            		}else{
            			$scope.editPasswdVo.isValidNewPasswd =true;
            		}
            	}
            	return result;
            }
            
            
            //保存修改密码
            $scope.saveEditPasswd = function(){
            	$scope.editPasswdVo.forbideSave=true;
            	
            	if( !$scope.editPasswdVo.cardNo || $scope.editPasswdVo.cardNo == '' || !(/^[1-9](?:\d{0,9}|\d{11,15})$/.test($scope.editPasswdVo.cardNo)) ){
            		modalService.info({title:'提示', content:'获取不到正确卡号!', size:'sm', type: 'confirm'});
            		$scope.editPasswdVo.forbideSave=false;
            		return false;
            	}
            	
            	if( !$scope.editPasswdVo.oldPasswd || $scope.editPasswdVo.oldPasswd == '' || !(/^\d{6}$/.test($scope.editPasswdVo.oldPasswd)) ){
            		modalService.info({title:'提示', content:'请输入6位旧密码!', size:'sm', type: 'confirm'});
            		$scope.editPasswdVo.forbideSave=false;
            		return false;
            	}
            	
            	if( !$scope.editPasswdVo.newPasswd || $scope.editPasswdVo.newPasswd == '' || !(/^\d{6}$/.test($scope.editPasswdVo.newPasswd)) ){
            		modalService.info({title:'提示', content:'请输入6位新密码!', size:'sm', type: 'confirm'});
            		$scope.editPasswdVo.forbideSave=false;
            		return false;
            	}
            	
            	if( !$scope.editPasswdVo.rePasswd || $scope.editPasswdVo.rePasswd == '' 
            		|| $scope.editPasswdVo.rePasswd != $scope.editPasswdVo.newPasswd){
            		modalService.info({title:'提示', content:'新密码与确认密码不一致!', size:'sm', type: 'confirm'});
            		$scope.editPasswdVo.forbideSave=false;
            		return false;
            	}
            	
            	if(!$scope.editPasswdVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	                	$scope.editPasswdVo.tsCode = result.tsCode;
	                	trueSave();
	                },function(){//errror
	                	$scope.editPasswdVo.forbideSave=false;          
	                });
            	}else{
            		trueSave();
            	}
            }
            //7.1 判断条件合法后，触发真实保存
            function trueSave(){
            	ajaxService.AjaxPost($scope.editPasswdVo, 'postrade/posCardUsed/saveEditPasswd.do').then(function (result) {
            		$scope.editPasswdVo.forbideSave=false;//解除按钮不可用状态
            		if(result.status){
            			modalService.info({content:'修改密码成功!', type: 'ok'});
                		//modalService.info({title:'提示', content:'修改密码成功!', size:'sm', type: 'confirm'});
                		//调用打印服务
                    	//console.log(result.printInfo);
                    	
                    	//(不考虑打印的情况下)页面恢复初始化
                    	if($scope.entranceFrom == 0){
                    		 $scope.editPasswdVo={
                             		cardNo:'',//卡号
                             		tsCode:'', //流水号
                             		oldPasswd:'',//旧密码
                             		newPasswd:'',//新密码
                             		rePasswd:'',//确认密码
                             		isValidNewPasswd:false,//是否有效新密码（校验新密码与确认密码是否一致）
                             		sessionId:sessionId,
                             		forbideSave:false //保存按钮是否禁用；默认不禁用
                             }
                    		 $scope.resetPasswdVo={
                             		cardNo:'',//卡号
                             		tsCode:'', //流水号
                             		sessionId:sessionId,
                             		forbideSave:false //保存按钮是否禁用；默认不禁用
                             }
                    		$scope.cardNoDisabled = false;//解除卡号栏的不可用状态
                    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = null;
                    	}else{
                    		$scope.getMemeberAndCardInfo($scope.editPasswdVo.cardNo);
                    		posService.goBack();
                    	}
                	}
                },function(){
                	 $scope.editPasswdVo.forbideSave=false;//解除按钮不可用状态       
                });
            }
            //6.返回操作
            $scope.goBack = function(){
            	if($scope.entranceFrom ==0){
            		//赋值   为编辑页面传值
		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
		        	//定义全局当前user信息
		        	$rootScope.currentuserinfo = null;
            	}
                posService.goBack();
            };
            
            //保存重置密码
            $scope.saveResetPasswd = function(){
            	$scope.resetPasswdVo.forbideSave=true;
            	
            	if( !$scope.resetPasswdVo.cardNo || $scope.resetPasswdVo.cardNo == '' || !(/^[1-9](?:\d{0,9}|\d{11,15})$/.test($scope.resetPasswdVo.cardNo)) ){
            		modalService.info({title:'提示', content:'获取不到正确卡号!', size:'sm', type: 'confirm'});
            		$scope.resetPasswdVo.forbideSave=false;
            		return false;
            	}
            	
            	if(!$scope.resetPasswdVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	                	$scope.resetPasswdVo.tsCode = result.tsCode;
	                	trueSave2();
	                },function(){//errror
	                	$scope.resetPasswdVo.forbideSave=false;
	                });
            	}else{
            		trueSave2();
            	}
            }
            //7.1 判断条件合法后，触发真实重置密码
            function trueSave2(){
            	ajaxService.AjaxPost($scope.resetPasswdVo, 'postrade/posCardUsed/saveResetPasswd.do').then(function (result) {
            		$scope.resetPasswdVo.forbideSave=false;//解除按钮不可用状态
            		if(result.status){
                		//modalService.info({title:'提示', content:'重置密码成功!', size:'sm', type: 'confirm'});
                		modalService.info({content:'重置密码成功!', type: 'ok'});
                		//调用打印服务
                    	//console.log(result.printInfo);
                    	
                    	//(不考虑打印的情况下)页面恢复初始化
                    	if($scope.entranceFrom == 0){
                    		$scope.editPasswdVo={
                             		cardNo:'',//卡号
                             		tsCode:'', //流水号
                             		oldPasswd:'',//旧密码
                             		newPasswd:'',//新密码
                             		rePasswd:'',//确认密码
                             		isValidNewPasswd:false,//是否有效新密码（校验新密码与确认密码是否一致）
                             		sessionId:sessionId,
                             		forbideSave:false //保存按钮是否禁用；默认不禁用
                             }
                    		$scope.resetPasswdVo={
                            		cardNo:'',//卡号
                            		tsCode:'', //流水号
                            		sessionId:sessionId,
                            		forbideSave:false //保存按钮是否禁用；默认不禁用
                            }
                    		$scope.cardNoDisabled = false;//解除卡号栏的不可用状态
                    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = null;
                    	}else{
                    		$scope.getMemeberAndCardInfo($scope.resetPasswdVo.cardNo);
                    		posService.goBack();
                    	}
                	}
                },function(){
                	 $scope.editPasswdVo.forbideSave=false;//解除按钮不可用状态       
                });
            }
           
    	}];
});