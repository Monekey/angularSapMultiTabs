define(function(require) {
	
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
	            $scope.consumeVo={
	            		sessionId:sessionId,
	            		tsCode:0,//流水码
	            		cardNo:'',//卡号
	            		allMoney:null,//
	            		cardAllMoney:0,
	            		consumeMoney:0,//卡实际付款 
	            		consumeScore:0,//支付类型ID
	            		scoreMoney:0,
	            		ableMoney:0,//可用余额
	            		ableScore:0,//可用积分
	            		posCardType:{},
	            		posScoreRule:{}
	            		
	            }
	            
	            //开关控制对象
	            $scope.flg={
	            		isCardNo:true,//是否允许输入卡号或者手机号
	            		isScore:false,//积分是否开启
	            		isScoreFirst:false,//是否优先使用积分
	            		isContinue:true,
	            		isSave:true
	            }
	          
	         
	            $scope.getMemeberAndCardInfo=function(){
	            	//赋值   为编辑页面传值
		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
		        	//定义全局当前user信息
		        	$rootScope.currentuserinfo = null;
	    			if( !$scope.consumeVo.cardNo 
						|| $scope.consumeVo.cardNo == '' 
	    				|| !(/^(((13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8})|([1-9](\d{4,9}|\d{11,15})))$/.test($scope.consumeVo.cardNo)) ){
	            	
		          
	            	}else{
	            		
	            		ajaxService.AjaxPost( {paramValue:$scope.consumeVo.cardNo,sessionId:sessionId},"postrade/memberhome/memberhomeinfo.do").then(
		    	    			function (result) {
		    	    				if(result.data!==null)
		    	    				{
		    	    		    		var data = result.data;
		    	    		    		//赋值   为编辑页面传值
		    	    		        	$rootScope.cardoperatetoeditusrmemberinfo = data.memberInfoBean;
		    	    		        	//定义全局当前user信息
		    	    		        	$rootScope.currentuserinfo = data;
		    	    		        	$scope.currUserInfo = angular.copy($rootScope.currentuserinfo);
		    	    	    			$scope.consumeVo.cardNo =$scope.currUserInfo.cardInfoBean.number;
		    	    	    			$scope.consumeVo.ableScore =$scope.currUserInfo.cardInfoBean.cardScore;
		    	    	    			$scope.consumeVo.ableMoney =$scope.currUserInfo.cardInfoBean.cardBalance;
		    	    	    			//$scope.flg.isCardNo=false; //改变手机号\卡号输入状态
		    	    	    			//$scope.entranceFrom = 1;//数据来源页面直接查询
		    	    	    			if($scope.consumeVo.cardNo!=''){
		    	    	    				$scope.getConsumeInfo();
		    	    	    			}
		    	    	    			
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
	            
	            $scope.getConsumeInfo=function(){
	            	ajaxService.AjaxPost( {cardNo:$scope.consumeVo.cardNo,sessionId:sessionId},"postrade/consume/getConsume.do").then(
	    	    			function (result) {
	    	    				$scope.consumeVo.posCardType=result.posCardType;
	    	    				$scope.consumeVo.posScoreRule=result.posScoreRule;
	    	    				//开启积分功能，开启积分消费
	    	    				if($scope.consumeVo.posCardType.isScore==1&&$scope.consumeVo.posCardType.bmCardTypeScoreSet.isSocreMoney==1){
	    	    					   $scope.flg.isScore=true;//允许输入积分
	    	    					   if($scope.consumeVo.posCardType.bmCardTypeScoreSet.isScoreMoneyFirst==1){
	    	    						   $scope.flg.isScoreFirst=true;//优先使用积分
	    	    					   }
	    	    				}else{
	    	    					$scope.flg.isScore=false;//关闭允许输入积分
	    	    					$scope.flg.isScoreFirst=false;//关闭优先使用积分
	    	    				}
	    	    					
	    	    				if(Number($scope.consumeVo.allMoney)>0){
	    	    					$scope.allMoneyChange();
	    	    				}
	    	    				
	    	    				
	    	                }
	    	    		);
	            }
	            
	            //如果属于一卡多业务的情况，用户信息自动带入
	    		if($rootScope.currentuserinfo){
	    			$scope.flg.isContinue = false;//数据来源传递
	    			$scope.flg.isCardNo = false;
	    			//$scope.entranceFrom = 1;//数据来源页面直接查询
	    			$scope.currUserInfo = angular.copy($rootScope.currentuserinfo);
	    			$scope.consumeVo.cardNo = $scope.currUserInfo.cardInfoBean.number;
	    			$scope.consumeVo.ableScore =$scope.currUserInfo.cardInfoBean.cardScore;
	    			$scope.consumeVo.ableMoney =$scope.currUserInfo.cardInfoBean.cardBalance;
	    			
	    			if($scope.consumeVo.cardNo!=''){
	    				$scope.getConsumeInfo();
	    			}
	    		}
	    		
	            //保存充值
	            $scope.doConsume = function(){
	            	
	            	//账单金额数字化
	            	$scope.consumeVo.cardAllMoney = Number($scope.consumeVo.allMoney);
	            	if($scope.consumeVo.cardAllMoney<=0){
	            		alert("账单金额不能为零");
            			return false;
	            	}

            		if($scope.consumeVo.consumeScore>$scope.consumeVo.ableScore){
            			$scope.consumeVo.consumeScore=$scope.consumeVo.ableScore;
            			alert("付款积分超出卡积分余额");
            			return false;
            		}
	            
	            	if($scope.consumeVo.consumeMoney>$scope.consumeVo.ableMoney){
	            		alert("付款金额超出卡余额");
	            		return false;
	            	}
	            	$scope.consumeVo.cardAllMoney=Number($scope.consumeVo.consumeMoney)+Number($scope.consumeVo.scoreMoney);
	            	if($scope.consumeVo.cardAllMoney!=$scope.consumeVo.allMoney){
	            	console.log($scope.consumeVo.cardAllMoney);
	            	console.log($scope.consumeVo.allMoney);
	            		alert("实付总金额与账单金额不匹配");
	            		return false;
	            	}
	            	if(!$scope.flg.isSave){
	            		return false;
	            	}else{
	            		$scope.flg.isSave=false;
	            	}
	            	poppasswdModal();
	            }

	            $scope.allMoneyChange = function(){
	            	//不符合规则，操作无效
	            	
	            	
	            	if($scope.consumeVo.allMoney==undefined){
	            		$scope.consumeVo.scoreMoney=0;
	            		$scope.consumeVo.consumeScore=0;
	            		$scope.consumeVo.consumeMoney=0.00;
	            		return;
	            	}
	            	console.log(typeof($scope.consumeVo.allMoney));
	            	console.log($scope.consumeVo.allMoney);
	            	while($scope.consumeVo.allMoney!=''&&!$scope.consumeVo.allMoney.match(/^([1-9]\d{0,9}|0)(\.\d{0,2})?$/)){
	            		//document.execCommand("undo");
	            		console.log("ppp:"+$scope.consumeVo.allMoney);
	            		$scope.consumeVo.allMoney=$scope.consumeVo.allMoney.substring(0,$scope.consumeVo.allMoney.length-1);
	            		//return;
	            	}
	            	/*$scope.consumeVo.allMoney=Number($scope.consumeVo.allMoney);
	            
	            	if(isNaN($scope.consumeVo.allMoney)){
	            		$scope.consumeVo.allMoney=0;
	            	}*/
	            	
            		//积分对应的金钱
	            	$scope.consumeVo.consumeScore=0;
	            	$scope.consumeVo.scoreMoney=0;
            		var tepScoreMoney=$scope.consumeVo.scoreMoney;
            		
	            	if($scope.flg.isScoreFirst){
	            		var scale =$scope.consumeVo.posCardType.bmCardTypeScoreSet.scoreMoneyScale;
	            		var tempScore = $scope.consumeVo.allMoney*scale;
	            		tempScore = Math.floor(tempScore);
	            		tempScore = Math.min(tempScore,$scope.consumeVo.ableScore);
	            		$scope.consumeVo.consumeScore=tempScore;
	            		tepScoreMoney=(tempScore/scale).toFixed(2);
	            	}
	            	$scope.consumeVo.scoreMoney=tepScoreMoney;
	            	//余额对应的金钱
            		$scope.consumeVo.consumeMoney=Number($scope.consumeVo.allMoney)-tepScoreMoney;
            		$scope.consumeVo.consumeMoney=$scope.consumeVo.consumeMoney.toFixed(2);
	            	if($scope.consumeVo.consumeMoney>$scope.consumeVo.ableMoney){
	            		$scope.consumeVo.consumeMoney=$scope.consumeVo.ableMoney;
	            	}
	                
	            }
	            

	            $scope.scoreChange = function(){
            		//当前显示积分
	            	
	            	$scope.consumeVo.consumeScore=Number($scope.consumeVo.consumeScore);
		            
	            	if(isNaN($scope.consumeVo.consumeScore)){
	            		$scope.consumeVo.consumeScore=0;
	            	}
            		if($scope.consumeVo.consumeScore>$scope.consumeVo.ableScore){
            			$scope.consumeVo.consumeScore=$scope.consumeVo.ableScore;
            		}
            		
	            	var scale =$scope.consumeVo.posCardType.bmCardTypeScoreSet.scoreMoneyScale;
	            	var tSm=($scope.consumeVo.consumeScore/scale).toFixed(2);
	            	$scope.consumeVo.scoreMoney=tSm;
	        
	            	//余额对应的金钱
	            	var tAm =Number($scope.consumeVo.allMoney);
	            	tAm=isNaN(tAm)?0:tAm;
            		$scope.consumeVo.consumeMoney=tAm-tSm;
            		$scope.consumeVo.consumeMoney=$scope.consumeVo.consumeMoney.toFixed(2);
	            	if($scope.consumeVo.consumeMoney>$scope.consumeVo.ableMoney){
	            		$scope.consumeVo.consumeMoney=$scope.consumeVo.ableMoney;
	            	}
	            	if($scope.consumeVo.consumeMoney<0){
	            		$scope.consumeVo.consumeMoney=0;
	            		//alert("实付金额超过账单金额");
	            	}
	                
	            }
	            
	            $scope.caldiff = function(){
	            	var diffMoney=0;
	            	var tAm=Number($scope.consumeVo.allMoney);
	            	tAm=isNaN(tAm)?0:tAm;
	            	diffMoney=tAm-$scope.consumeVo.scoreMoney-$scope.consumeVo.consumeMoney;
	            	return diffMoney.toFixed(2);
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
	                	 $scope.consumeVo.pwd =popPasswd.password;
	                	 //调用核对流水号
	                	 if(!$scope.consumeVo.tscode){
	 		            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	 		                	$scope.consumeVo.tsCode = result.tsCode;
	 		                	trueSave();
	 		                });
	 	            	}else{
	 	            		trueSave();
	 	            	}
	                },function(data){
	                	$scope.flg.isSave=true;
	                });
	            };
	            /**
				 * 判断条件合法后，触发真实保存
				 */
	            function trueSave(){
	            	
	            	ajaxService.AjaxPost($scope.consumeVo, 'postrade/consume/doConsume.do').then(function (result) {
	            		
	            		if(result.status){
	                		modalService.info({content:'消费成功!', type: 'ok'});
	                		//调用打印服务
	                    	//console.log(result.printInfo);
	                    	//页面恢复初始化
	                		if($scope.flg.isContinue){
	                			 $scope.consumeVo={
	 	          	            		tsCode:0,//流水码
	 	          	            		cardNo:'',//卡号
	 	          	            		consumeMoney:0,//卡实际付款
	 	          	            		consumeScore:0,//消费积分  	
	 	          	            		scoreMoney:0,
	 	          	            		sessionId:sessionId
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