/**
 * 卡密码业务
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
            "$filter",
			"$timeout",
            function ($scope,$window,ajaxService,posService,getCookieService,$rootScope,modalService,$uibModal,$filter,$timeout) {
	    	//sessionId获取
			var sessionId = getCookieService.getCookie("CRMSESSIONID");
			$scope.rechargeTimeOper=1;//充值次数操作
			$scope.cosumeTimeOper=2;//消费次数操作
			//卡号信息来源默认本页填写
			$scope.entranceFrom = 0;
			//默认手机号或卡号可以编辑
			$scope.cardNoDisabled=false;
			//2. 初始化(充值VO)
	        $scope.rechargeVo={
	        		cardNo:'',//卡号
	        		time:'',
	        		tsCode:0,//流水码
	        		tsTypeId:2,//支付类型ID
	        		tsTypeName:'现金',//支付类型名称
	        		value:'',//充值金额
	        		timeBalance:0,//次数余额
	        		sessionId:sessionId,
	        		isValidTimeAccount:false,//是否是有效的积分账户
	        		forbideSave:false //保存按钮是否禁用；默认不禁用
	        }
	        //初始化(消费VO)
	        $scope.consumeVo={
	        		cardNo:'',//卡号
	        		time:'',//次数
	        		tsCode:0,//流水码
	        		timeBalance:0,//次数余额
	        		sessionId:sessionId,
	        		isValidTimeAccount:false,//是否是有效的积分账户
	        		forbideSave:false //保存按钮是否禁用；默认不禁用
	        }

				$scope.setFocus = function(eId){
					var setTimer = posService.setFocus(eId);
					$scope.$on('$destroy', function(){
						$timeout.cancel(setTimer);
					});

				};
	        /*获取次数账户信息*/
    		$scope.getTimeAccountInfo=function(cardNo){
				 
    			ajaxService.AjaxPost( {cardNo:cardNo,sessionId:sessionId},"postrade/posCardAccount/getTimeAccount.do").then(
	    			function (result) {
	    				if(result.status){
	    					 $scope.consumeVo.timeBalance = result.timeBalance;
	    					 $scope.consumeVo.isValidTimeAccount = true;
	    					 
	    					 $scope.rechargeVo.timeBalance = result.timeBalance;
	    					 $scope.rechargeVo.isValidTimeAccount = true;
	    				}
	                }
	    		);
    		}
			
			//4.当前页面获取会员信息和卡信息（快捷菜单可以从这里触发）
			$scope.getMemeberAndCardInfo=function(operationType){
				var timeVo = null;
	        	if($scope.rechargeTimeOper == operationType){
	        		timeVo=$scope.rechargeVo;
	        	}else{
	        		timeVo=$scope.consumeVo;
	        	}
	        	//赋值   为编辑页面传值
	        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	        	//定义全局当前user信息
	        	$rootScope.currentuserinfo = null;
	        	
        		$scope.consumeVo.timeBalance = 0;
			    $scope.consumeVo.isValidTimeAccount = false;
			    $scope.rechargeVo.timeBalance = 0;
			    $scope.rechargeVo.isValidTimeAccount = false;
				 
				if( !timeVo.cardNo 
					|| timeVo.cardNo == '' 
					|| !(/^(((13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8})|([1-9](\d{4,9}|\d{11,15})))$/
							.test(timeVo.cardNo))){
	        		//modalService.info({title:'提示', content:'获取不到正确手机号或卡号!', size:'sm', type: 'confirm'});
	           		return false;
	        	}
				ajaxService.AjaxPost( {paramValue:timeVo.cardNo,sessionId:sessionId},"postrade/memberhome/memberhomeinfo.do").then(
	    			function (result) {
	    				if(result.status && result.data)
	    				{
	    		    		var data = result.data;
	    		    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = data.memberInfoBean;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = data;
	    		        	$scope.currUserInfo = $rootScope.currentuserinfo;
	    		        	
	    	    			$scope.rechargeVo.cardNo =$scope.currUserInfo.cardInfoBean.number;
	    	    			
	    	    			$scope.consumeVo.cardNo =$scope.currUserInfo.cardInfoBean.number;
	    	    			
	    	    			$scope.getTimeAccountInfo($scope.currUserInfo.cardInfoBean.number);
	    				}
	                }
	    		);
			}
			//3.加载页面是 ，如果发现用户信息存在……（操作一卡多业务的情况的入口）
			if($rootScope.currentuserinfo){
				$scope.entranceFrom = 1;//数据来源传递
				$scope.currUserInfo = $rootScope.currentuserinfo;
				
				$scope.rechargeVo.cardNo = $scope.currUserInfo.cardInfoBean.number;
				$scope.consumeVo.cardNo = $scope.currUserInfo.cardInfoBean.number;
				
				$scope.cardNoDisabled=true; //改变手机号\卡号输入状态为禁用
				$scope.getTimeAccountInfo($scope.currUserInfo.cardInfoBean.number);
			}
			//4. ajax加载支付类型
			$scope.tsTypeList=[];//支付类型
	        ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/tstype/getPosTsType.do').then(function (result) {
	        	$scope.tsTypeList = result.data;
	        });
	        
	        //5.点击支付方式触发
	        $scope.changeTsType = function(tsType){
	        	$scope.rechargeVo.tsTypeId = tsType.id;
	        	$scope.rechargeVo.tsTypeName = tsType.name;
	        }
	       
	        //7.保存充值
	        
	        $scope.saveRecharge = function(){
	        	$scope.rechargeVo.forbideSave=true;
	        	if( !$scope.rechargeVo.cardNo || $scope.rechargeVo.cardNo == '' || !(/[1-9](?:\d{0,9}|\d{11,15})/.test($scope.rechargeVo.cardNo)) ){
	        		modalService.info({title:'提示', content:'获取不到正确卡号!', size:'sm', type: 'confirm'});
	        		$scope.rechargeVo.forbideSave=false;
	        		return false;
	        	}
	        	if( !$scope.rechargeVo.isValidTimeAccount){
	        		modalService.info({title:'提示', content:'未发现有效的次数账户!', size:'sm', type: 'confirm'});
	        		$scope.rechargeVo.forbideSave=false;
	        		return false;
	        	}
	        	if( !$scope.rechargeVo.time || $scope.rechargeVo.time == '' || !(/^[1-9]\d{0,6}$/.test($scope.rechargeVo.time))){
	        		modalService.info({title:'提示', content:'请输入合法充值次数!', size:'sm', type: 'confirm'});
	        		$scope.rechargeVo.forbideSave=false;
	        		return false;
	        	}
	        	if( !$scope.rechargeVo.value || $scope.rechargeVo.value == '' || !(/^[1-9]\d{0,6}(?:\.\d{1,2})?$/.test($scope.rechargeVo.value))){
	        		modalService.info({title:'提示', content:'请输入合法支付金额!', size:'sm', type: 'confirm'});
	        		$scope.rechargeVo.forbideSave=false;
	        		return false;
	        	}
	        	if( !$scope.rechargeVo.tsTypeId || !$scope.rechargeVo.tsTypeName || $scope.rechargeVo.tsTypeName ==''){
	        		modalService.info({title:'提示', content:'请选择支付方式!', size:'sm', type: 'confirm'});
	        		$scope.rechargeVo.forbideSave=false;
	        		return false;
	        	}
	        	if(!$scope.rechargeVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	                	if(result.tsCode){
	                		$scope.rechargeVo.tsCode = result.tsCode;
	                		trueSave();
	            		}else{
	            			$scope.rechargeVo.forbideSave=false;
	            		}
	                },function(){//errror
	                	$scope.rechargeVo.forbideSave=false;          
	                });
	        	}else{
	        		trueSave();
	        	}
	        }
	        //7.1 判断条件合法后，触发真实保存
	        function trueSave(){
	        	ajaxService.AjaxPost($scope.rechargeVo, 'postrade/timeCard/saveRechargeTime.do').then(function (result) {
	        		$scope.rechargeVo.forbideSave=false;//解除按钮不可用状态
	        		if(result.status){
	            		modalService.info({content:'充值次数成功!', type: 'ok'});
	            		//调用打印服务
	                	console.log(result.printInfo);
	                	
	                	//(不考虑打印的情况下)页面恢复初始化
	                	if($scope.entranceFrom == 0){
	                		$scope.rechargeVo={
	            	        		cardNo:'',//卡号
	            	        		time:'',
	            	        		tsCode:0,//流水码
	            	        		tsTypeId:2,//支付类型ID
	            	        		tsTypeName:'现金',//支付类型名称
	            	        		value:'',//充值金额
	            	        		timeBalance:0,//次数余额
	            	        		sessionId:sessionId,
	            	        		isValidTimeAccount:false,//是否是有效的积分账户
	            	        		forbideSave:false //保存按钮是否禁用；默认不禁用
	            	        }
	            	        //初始化(消费VO)
	            	        $scope.consumeVo={
	            	        		cardNo:'',//卡号
	            	        		time:'',//次数
	            	        		tsCode:0,//流水码
	            	        		timeBalance:0,//次数余额
	            	        		sessionId:sessionId,
	            	        		isValidTimeAccount:false,//是否是有效的积分账户
	            	        		forbideSave:false //保存按钮是否禁用；默认不禁用
	            	        }
	                		$scope.cardNoDisabled = false;//解除卡号栏的不可用状态
	                		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = null;
	                	}else{
	                		$scope.getMemeberAndCardInfo($scope.rechargeTimeOper);
	                		posService.goBack();
	                	}
	            	}
	            },function(){
	            	 $scope.rechargeVo.forbideSave=false;//解除按钮不可用状态       
	            });
	        }
	        
	        
	        //7.保存消费
	        
	        $scope.saveConsume= function(){
	        	$scope.consumeVo.forbideSave=true;
	        	if( !$scope.consumeVo.cardNo || $scope.consumeVo.cardNo == '' || !(/[1-9](?:\d{0,9}|\d{11,15})/.test($scope.consumeVo.cardNo)) ){
	        		modalService.info({title:'提示', content:'获取不到正确卡号!', size:'sm', type: 'confirm'});
	        		$scope.consumeVo.forbideSave=false;
	        		return false;
	        	}
	        	if( !$scope.consumeVo.isValidTimeAccount){
	        		modalService.info({title:'提示', content:'未发现有效的次数账户!', size:'sm', type: 'confirm'});
	        		$scope.consumeVo.forbideSave=false;
	        		return false;
	        	}
	        	if( !$scope.consumeVo.time || $scope.consumeVo.time == '' || !(/^[1-9]\d{0,6}$/.test($scope.consumeVo.time))){
	        		modalService.info({title:'提示', content:'请输入消费次数!', size:'sm', type: 'confirm'});
	        		$scope.consumeVo.forbideSave=false;
	        		return false;
	        	}
	        	if($scope.consumeVo.time > $scope.consumeVo.timeBalance){
	        		modalService.info({title:'提示', content:'消费余额不足!', size:'sm', type: 'confirm'});
	        		$scope.consumeVo.forbideSave=false;
	        		return false;
	        	}
	        	
	        	poppasswdModal();
	        }
	        //获取tsCode
	        function checkConsumeTsCode(){
	        	if(!$scope.consumeVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	                	if(result.tsCode){
	                		$scope.consumeVo.tsCode = result.tsCode;
	                		trueSave2();
	            		}else{
	            			$scope.consumeVo.forbideSave=false;
	            		}
	                },function(){//error
	                	$scope.consumeVo.forbideSave=false;          
	                });
	        	}else{
	        		trueSave2();
	        	}
	        }
	        //7.1 判断条件合法后，触发真实保存
	        function trueSave2(){
	        	ajaxService.AjaxPost($scope.consumeVo, 'postrade/timeCard/saveConsumeTime.do').then(function (result) {
	        		$scope.consumeVo.forbideSave=false;//解除按钮不可用状态
	        		if(result.status){
	        			
	            		modalService.info({content:'消费次数成功!', type: 'ok'});
	            		//调用打印服务
	                	console.log(result.printInfo);
	                	
	                	//(不考虑打印的情况下)页面恢复初始化
	                	if($scope.entranceFrom == 0){
	                		$scope.rechargeVo={
	            	        		cardNo:'',//卡号
	            	        		time:'',
	            	        		tsCode:0,//流水码
	            	        		tsTypeId:2,//支付类型ID
	            	        		tsTypeName:'现金',//支付类型名称
	            	        		value:'',//充值金额
	            	        		timeBalance:0,//次数余额
	            	        		sessionId:sessionId,
	            	        		isValidTimeAccount:false,//是否是有效的积分账户
	            	        		forbideSave:false //保存按钮是否禁用；默认不禁用
	            	        }
	            	        //初始化(消费VO)
	            	        $scope.consumeVo={
	            	        		cardNo:'',//卡号
	            	        		time:'',//次数
	            	        		tsCode:0,//流水码
	            	        		timeBalance:0,//次数余额
	            	        		sessionId:sessionId,
	            	        		isValidTimeAccount:false,//是否是有效的积分账户
	            	        		forbideSave:false, //保存按钮是否禁用；默认不禁用
	            	        		password:''//卡密码
	            	        }
	                		$scope.cardNoDisabled = false;//解除卡号栏的不可用状态
	                		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = null;
	                	}else{
	                		$scope.getMemeberAndCardInfo($scope.cosumeTimeOper);
	                		posService.goBack();
	                	}
	            	}
	            },function(){
	            	 $scope.consumeVo.forbideSave=false;//解除按钮不可用状态       
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
			//获取支付方式图标的url
			$scope.getPaymentUrl = function(typeName){
				return  $filter('tranPaymentMethodIconSrc')(typeName);
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
                	 $scope.consumeVo.password =popPasswd.password;
                	 //调用核对流水号
                	 checkConsumeTsCode();
                },function(data){
                	$scope.consumeVo.forbideSave=false; 
                });
            };
        
    	}];
});