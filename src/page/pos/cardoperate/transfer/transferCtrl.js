define(function (require){
	
	var angular = require("angular");
	var posService = require('posService');
	//加载密码弹窗
	var poppasswdCtrl = require("pos/cardoperate/poppasswd/poppasswdCtrl");
    var poppasswdTemp = require("text!pos/cardoperate/poppasswd/poppasswd.html");
   
	return [
			"$scope",
			'$window',
			"ajaxService",
			"posService",
			"getCookieService",
			"$rootScope",
			"modalService",
			'$uibModal',
			function($scope, $window, ajaxService, posService,
					getCookieService, $rootScope, modalService,$uibModal) {
				
				//获取sessionId
	    		var sessionId = getCookieService.getCookie("CRMSESSIONID");
	    		//初始化页面数据
	            $scope.transferVo={
	            		sessionId:sessionId,
	            		tsCode:null,//流水码
	            		tsCodes:null,
	            		outCardNo:null,//卡号
	            		inCardNo:null,//
	            		value:null,
	            		pwd:null,
	            		type:0
	            		
	            }
	            $scope.changeType = function(type){
	            	 $scope.transferVo.type=type;
	            	 $scope.transferVo.value=null;
	            }
	            
	            //开关控制对象
	            $scope.flg={
	            		isCardNo:true,//是否允许输入卡号或者手机号
	            		isContinue:true,
	            		isSave:true
	            }
	          
	         
	            $scope.getMemeberAndCardInfo=function(){
	            	//赋值   为编辑页面传值
		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
		        	//定义全局当前user信息
		        	$rootScope.currentuserinfo = null;
	    			if( !$scope.transferVo.outCardNo 
						|| $scope.transferVo.outCardNo == '' 
	    				|| !(/^(((13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8})|([1-9](\d{4,9}|\d{11,15})))$/.test($scope.transferVo.outCardNo)) ){
	            	
		          
	            	}else{
	            		
	            		ajaxService.AjaxPost( {paramValue:$scope.transferVo.outCardNo,sessionId:sessionId},"postrade/memberhome/memberhomeinfo.do").then(
		    	    			function (result) {
		    	    				if(result.data!==null)
		    	    				{
		    	    		    		var data = result.data;
		    	    		    		//赋值   为编辑页面传值
		    	    		        	$rootScope.cardoperatetoeditusrmemberinfo = data.memberInfoBean;
		    	    		        	//定义全局当前user信息
		    	    		        	$rootScope.currentuserinfo = data;
		    	    		        	$scope.currUserInfo = angular.copy($rootScope.currentuserinfo);
		    	    	    			$scope.transferVo.outCardNo =$scope.currUserInfo.cardInfoBean.number;
		    	    	    			
		    	    				}
		    	    				else
		    	    				{
		    	    					//赋值   为编辑页面传值
		    	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
		    	    		        	//定义全局当前user信息
		    	    		        	$rootScope.currentuserinfo = null;
		    	    				}
		    	                }
		    	    		);
	            	}
	    			
	    		}
	            
	            //如果属于一卡多业务的情况，用户信息自动带入
	    		if($rootScope.currentuserinfo){
	    			$scope.flg.isContinue = false;//数据来源传递
	    			$scope.flg.isCardNo = false;
	    			$scope.currUserInfo = $rootScope.currentuserinfo;
	    			$scope.transferVo.outCardNo = $scope.currUserInfo.cardInfoBean.number;
	    		}
	    		
	            //保存充值
	            $scope.doTransfer = function(){
	            	if(!$scope.flg.isSave){
	            		return false;
	            	}else{
	            		$scope.flg.isSave=false;
	            	}
	            	poppasswdModal();
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
	                	 $scope.transferVo.pwd =popPasswd.password;
	                	 //调用核对流水号
	                	 if(!$scope.transferVo.tscode){
	 		            	ajaxService.AjaxPost({sessionId: sessionId,tsCount:2}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	 		                	$scope.transferVo.tsCode = result.tsCode;
	 		                	$scope.transferVo.tsCodes= result.tsCodes;
	 		                	trueSave();
	 		                });
	 	            	}else{
	 	            		trueSave();
	 	            	}
	                },function(data){
	                	$scope.flg.isSave=true;; 
	                });
	            };

	            // 判断条件合法后，触发真实保存
	            function trueSave(){
	            	
	            	ajaxService.AjaxPost($scope.transferVo, 'postrade/transfer/doTransfer.do').then(function (result) {
	            		
	            		if(result.status){
	                		modalService.info({content:'转账成功!', type: 'ok'});
	                		//调用打印服务
	                    	//console.log(result.printInfo);
	                    	//页面恢复初始化
	                		if($scope.flg.isContinue){
	                			//初始化页面数据
	            	            $scope.transferVo={
	            	            		sessionId:sessionId,
	            	            		tsCode:null,//流水码
	            	            		tsCodes:null,
	            	            		outCardNo:null,//卡号
	            	            		inCardNo:null,//
	            	            		value:null,
	            	            		type:0
	            	            		
	            	            }
	 	                		 //赋值   为编辑页面传值
	 		    		         $rootScope.cardoperatetoeditusrmemberinfo = null;
	 		    		         //定义全局当前user信息
	 		    		         $rootScope.currentuserinfo = null;
	                		}else{
	                			$scope.getMemeberAndCardInfo();
	                			$scope.goBack();
	                		}
	                		 
	                	}
	            		
	            		$scope.flg.isSave=true;
	            		
	                });
	            	
	            }
	            
				$scope.goBack = function() {
					posService.goBack();
				};
			} ];
});