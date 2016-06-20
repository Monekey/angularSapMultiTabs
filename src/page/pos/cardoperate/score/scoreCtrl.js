/**
 * 软POS积分业务
 * @version  v1.0
 * @createTime: 2016-05-29
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
define(function (require) {
	var angular = require("angular");
	var posService = require('posService');
	//加载密码弹窗
	var poppasswdCtrl = require("pos/cardoperate/poppasswd/poppasswdCtrl");
    var poppasswdTemp = require("text!pos/cardoperate/poppasswd/poppasswd.html");
    
    return ["$scope",
            '$window',
            "ajaxService",
            "posService",
            "getCookieService",
            "$rootScope",
            "modalService", 
            '$uibModal',
            function ($scope,$window,ajaxService,posService,getCookieService,$rootScope,modalService,$uibModal) {
    		$scope.rechargeScoreOper=1;//充值积分操作
    		$scope.consumeScoreOper=2;//扣减积分操作
    		//sessionId获取
    		var sessionId = getCookieService.getCookie("CRMSESSIONID");
    		//卡号信息来源默认本页填写
    		$scope.entranceFrom = 0;
    		//默认手机号或卡号可以编辑
    		$scope.cardNoDisabled=false;
    		
    		//2. 初始化
            $scope.rechargeScoreVo={
            		cardNo:'',//卡号
            		tsCode:'', //流水号
            		changeScore:'',//增加积分
            		scoreBalance:0,//积分余额
            		isValidScoreAccount:false,//是否是有效的积分账户（默认否）
            		sessionId:sessionId,
            		forbideSave:false ////保存按钮是否禁用；默认不禁用
            }
            $scope.consumeScoreVo={
            		cardNo:'',//卡号
            		tsCode:'', //流水号
            		changeScore:'',//扣减积分
            		scoreBalance:0,//积分余额
            		isValidScoreAccount:false,//是否是有效的积分账户（默认否）
            		sessionId:sessionId,
            		password:'',//密码
            		forbideSave:false ////保存按钮是否禁用；默认不禁用
            }
            /*获取积分账户信息*/
    		$scope.getScoreAccountInfo=function(cardNo){
    			ajaxService.AjaxPost( {cardNo:cardNo,sessionId:sessionId},"postrade/posCardAccount/getScoreAccount.do").then(
	    			function (result) {
	    				if(result.status){
	    					 $scope.rechargeScoreVo.scoreBalance = result.scoreBalance;
	    					 $scope.rechargeScoreVo.isValidScoreAccount = true;
	    					 
	    					 $scope.consumeScoreVo.scoreBalance = result.scoreBalance;
	    					 $scope.consumeScoreVo.isValidScoreAccount = true;
	    				}
	                }
	    		);
    		}
            //3.加载页面是 ，如果发现用户信息存在……（操作一卡多业务的情况的入口）
    		if($rootScope.currentuserinfo){
    			$scope.entranceFrom = 1;//数据来源传递
    			$scope.currUserInfo = $rootScope.currentuserinfo;
    			$scope.rechargeScoreVo.cardNo = $scope.currUserInfo.cardInfoBean.number;//卡号
    			$scope.consumeScoreVo.cardNo = $scope.currUserInfo.cardInfoBean.number;//卡号

    			$scope.cardNoDisabled=true; //改变手机号\卡号输入状态为禁用
    			$scope.getScoreAccountInfo($scope.rechargeScoreVo.cardNo);//获取积分账户信息
    		}
            
    		//4.当前页面获取会员信息和卡信息（快捷菜单可以从这里触发）
    		$scope.getMemeberAndCardInfo=function(operationType){
    			
    			var scoreVo = null;
	        	if($scope.rechargeScoreOper == operationType){
	        		scoreVo=$scope.rechargeScoreVo;
	        	}else{
	        		scoreVo=$scope.consumeScoreVo;
	        	}
            	//赋值   为编辑页面传值
	        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	        	//定义全局当前user信息
	        	$rootScope.currentuserinfo = null;
	        	
	        	$scope.rechargeScoreVo.scoreBalance = 0;
			    $scope.rechargeScoreVo.isValidScoreAccount = false;
			    $scope.consumeScoreVo.scoreBalance = 0;
				$scope.consumeScoreVo.isValidScoreAccount = false;
    			
    			if( !scoreVo.cardNo 
					|| scoreVo.cardNo == '' 
    				|| !(/^(((13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8})|([1-9](\d{4,9}|\d{11,15})))$/
    						.test(scoreVo.cardNo))){
            		//modalService.info({title:'提示', content:'获取不到正确手机号或卡号!', size:'sm', type: 'confirm'});
	           		return false;
            	}
    			ajaxService.AjaxPost( {paramValue:scoreVo.cardNo,sessionId:sessionId},"postrade/memberhome/memberhomeinfo.do").then(
	    			function (result) {
	    				if(result.status && result.data)
	    				{
	    		    		var data = result.data;
	    		    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = data.memberInfoBean;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = data;
	    		        	$scope.currUserInfo = $rootScope.currentuserinfo;
	    	    			$scope.rechargeScoreVo.cardNo =$scope.currUserInfo.cardInfoBean.number;//卡号
	    	    			$scope.consumeScoreVo.cardNo =$scope.currUserInfo.cardInfoBean.number;//卡号
	    	    			//获取积分信息
	    	    			$scope.getScoreAccountInfo($scope.currUserInfo.cardInfoBean.number);
	    				}
	                }
	    		);
    		}
    		
            
            //7.保存充值积分
            $scope.saveRechargeScore = function(){
            	$scope.rechargeScoreVo.forbideSave=true;
            	if( !$scope.rechargeScoreVo.cardNo || $scope.rechargeScoreVo.cardNo == '' || !(/[1-9](?:\d{0,9}|\d{11,15})/.test($scope.rechargeScoreVo.cardNo)) ){
            		modalService.info({title:'提示', content:'获取不到正确卡号!', size:'sm', type: 'confirm'});
            		$scope.rechargeScoreVo.forbideSave=false;
            		return false;
            	}
            	if( !$scope.rechargeScoreVo.changeScore || $scope.rechargeScoreVo.changeScore == '' || !(/^[1-9]\d*$/.test($scope.rechargeScoreVo.changeScore))){
            		modalService.info({title:'提示', content:'请输入正确的增加积分!', size:'sm', type: 'confirm'});
            		$scope.rechargeScoreVo.forbideSave=false;
            		return false;
            	}
            	if(!$scope.rechargeScoreVo.isValidScoreAccount){//验证积分账户有效性
            		modalService.info({title:'提示', content:'该会员卡没有开通积分功能或不存在积分账户，请核实!', size:'sm', type: 'confirm'});
            		$scope.rechargeScoreVo.forbideSave=false;
            		return false;
            	}
            	
            	if(!$scope.rechargeScoreVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	                	if(result.tsCode){
	            			$scope.rechargeScoreVo.tsCode = result.tsCode;
	            			trueSave();
	            		}else{
	            			$scope.rechargeScoreVo.forbideSave=false;
	            		}
	                },function(){//errror
	                	$scope.rechargeScoreVo.forbideSave=false;          
	                });
            	}else{
            		trueSave();
            	}
            }
            //7.1 判断条件合法后，触发真实保存
            function trueSave(){
            	ajaxService.AjaxPost($scope.rechargeScoreVo, 'postrade/posCardAccount/saveRechargeScore.do').then(function (result) {
            		$scope.rechargeScoreVo.forbideSave=false;//解除按钮不可用状态
            		if(result.status){
                		//modalService.info({title:'提示', content:'增加积分成功!', size:'sm', type: 'confirm'});
            			modalService.info({content:'增加积分成功!', type: 'ok'});
                		//调用打印服务
                    	console.log(result.printInfo);
                    	
                    	//(不考虑打印的情况下)页面恢复初始化
                    	if($scope.entranceFrom == 0){
                    		$scope.rechargeScoreVo={
                            		cardNo:'',//卡号
                            		tsCode:'', //流水号
                            		changeScore:'',//增加积分
                            		scoreBalance:0,//积分余额
                            		isValidScoreAccount:false,//是否是有效的积分账户（默认否）
                            		sessionId:sessionId,
                            		forbideSave:false ////保存按钮是否禁用；默认不禁用
                            }
                            $scope.consumeScoreVo={
                            		cardNo:'',//卡号
                            		tsCode:'', //流水号
                            		changeScore:'',//扣减积分
                            		scoreBalance:0,//积分余额
                            		isValidScoreAccount:false,//是否是有效的积分账户（默认否）
                            		sessionId:sessionId,
                            		password:'',//密码
                            		forbideSave:false ////保存按钮是否禁用；默认不禁用
                            }
                    		$scope.cardNoDisabled = false;//解除卡号栏的不可用状态
                    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = null;
                    	}else{
                    		$scope.getMemeberAndCardInfo($scope.rechargeScoreOper);
                    		posService.goBack();
                    	}
                	}
                },function(){
                	 $scope.rechargeScoreVo.forbideSave=false;//解除按钮不可用状态       
                });
            }
            
            //保存扣减积分
            $scope.saveConsumeScore=function(){
            	$scope.consumeScoreVo.forbideSave=true;
            	if( !$scope.consumeScoreVo.cardNo || $scope.consumeScoreVo.cardNo == '' || !(/[1-9](?:\d{0,9}|\d{11,15})/.test($scope.consumeScoreVo.cardNo)) ){
            		modalService.info({title:'提示', content:'获取不到正确卡号!', size:'sm', type: 'confirm'});
            		$scope.consumeScoreVo.forbideSave=false;
            		return false;
            	}
            	if( !$scope.consumeScoreVo.changeScore || $scope.consumeScoreVo.changeScore == '' || !(/^[1-9]\d*$/.test($scope.consumeScoreVo.changeScore))){
            		modalService.info({title:'提示', content:'请输入正确的扣减积分!', size:'sm', type: 'confirm'});
            		$scope.consumeScoreVo.forbideSave=false;
            		return false;
            	}
            	if( $scope.consumeScoreVo.changeScore > $scope.consumeScoreVo.scoreBalance){
            		modalService.info({title:'提示', content:'积分账户余额不足!', size:'sm', type: 'confirm'});
            		$scope.consumeScoreVo.forbideSave=false;
            		return false;
            	}
            	if(!$scope.consumeScoreVo.isValidScoreAccount){//验证积分账户有效性
            		modalService.info({title:'提示', content:'该会员卡没有开通积分功能或不存在积分账户，请核实!', size:'sm', type: 'confirm'});
            		$scope.consumeScoreVo.forbideSave=false;
            		return false;
            	}
            	
            	poppasswdModal();
            	
            }
            //核对验证码
            var checkConsumeTsCode=function(){
            	if(!$scope.consumeScoreVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	                	if(result.tsCode){
	            			$scope.consumeScoreVo.tsCode = result.tsCode;
	            			trueSave2();
	            		}else{
	            			$scope.consumeScoreVo.forbideSave=false;
	            		}
	                },function(){//errror
	                	$scope.consumeScoreVo.forbideSave=false;          
	                });
            	}else{
            		trueSave2();
            	}
            }
            //真实消费保存
            function trueSave2(){
            	ajaxService.AjaxPost($scope.consumeScoreVo, 'postrade/posCardAccount/saveConsumeScore.do').then(function (result) {
            		$scope.consumeScoreVo.forbideSave=false;//解除按钮不可用状态
            		if(result.status){
                		//modalService.info({title:'提示', content:'扣减积分成功!', size:'sm', type: 'confirm'});
            			modalService.info({content:'扣减积分成功!', type: 'ok'});
                		//调用打印服务
                    	console.log(result.printInfo);
                    	
                    	//(不考虑打印的情况下)页面恢复初始化
                    	if($scope.entranceFrom == 0){
                    		$scope.rechargeScoreVo={
                            		cardNo:'',//卡号
                            		tsCode:'', //流水号
                            		changeScore:'',//增加积分
                            		scoreBalance:0,//积分余额
                            		isValidScoreAccount:false,//是否是有效的积分账户（默认否）
                            		sessionId:sessionId,
                            		forbideSave:false ////保存按钮是否禁用；默认不禁用
                            }
                            $scope.consumeScoreVo={
                            		cardNo:'',//卡号
                            		tsCode:'', //流水号
                            		changeScore:'',//扣减积分
                            		scoreBalance:0,//积分余额
                            		isValidScoreAccount:false,//是否是有效的积分账户（默认否）
                            		sessionId:sessionId,
                            		password:'',//密码
                            		forbideSave:false ////保存按钮是否禁用；默认不禁用
                            }
                    		$scope.cardNoDisabled = false;//解除卡号栏的不可用状态
                    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = null;
                    	}else{
                    		$scope.getMemeberAndCardInfo($scope.consumeScoreOper);
                    		posService.goBack();
                    	}
                	}
                },function(){
                	 $scope.consumeScoreVo.forbideSave=false;//解除按钮不可用状态       
                });
            }
            
            /**
			 * 密码模态弹窗
			 */
           var poppasswdModal = function() {
                var modalInstance = $uibModal.open({
                    //受否加载动画
                    animation: true,
                    //模态框页面
                    template: poppasswdTemp,
                    //模态框的尺寸
                    size: "sm",
                    //模态框对应的controller
                    controller: 'poppasswdCtrl',
                    //向模态框传递参数
                    resolve: {
                    	
                    }

                });
                //处理模态框返回到当前页面的数据
                modalInstance.result.then(function (popPasswd) {
                	 $scope.consumeScoreVo.password =popPasswd.password;
                	 //调用核对流水号
                	 checkConsumeTsCode();
                },function(data){
                	$scope.consumeScoreVo.forbideSave=false; 
                });
            };
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
            
            
    	}];
});