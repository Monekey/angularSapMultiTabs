/**
 * 软POS充值业务
 * @version  v1.0
 * @createTime: 2016-05-19
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
define(['posService'], function () {
	var angular = require("angular");
    return ["$scope",'$window',"ajaxService","posService","getCookieService","$rootScope","modalService","$filter","devicesService",
            function ($scope,$window,ajaxService,posService,getCookieService,$rootScope,modalService,$filter,devicesService) {
    		//sessionId获取
    		var sessionId = getCookieService.getCookie("CRMSESSIONID");
    		//卡号信息来源默认本页填写
    		$scope.entranceFrom = 0;
    		//默认手机号或卡号可以编辑
    		$scope.cardNoDisabled=false;
    		//保存按钮是否禁用；默认不禁用
    		$scope.forbideSave = false;
    		//2. 初始化
            $scope.rechargeVo={
            		cardNo:'',//卡号
            		tsCode:0,//流水码
            		tsTypeId:2,//支付类型ID
            		tsTypeName:'现金',//支付类型名称
            		value:'',//充值金额
            		sessionId:sessionId
            }
            
    		
    		//4.当前页面获取会员信息和卡信息（快捷菜单可以从这里触发）
    		$scope.getMemeberAndCardInfo=function(){
            	
            	//赋值   为编辑页面传值
	        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	        	//定义全局当前user信息
	        	$rootScope.currentuserinfo = null;
	        	
    			if( !$scope.rechargeVo.cardNo 
					|| $scope.rechargeVo.cardNo == '' 
    				|| !(/^(((13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8})|([1-9](\d{4,9}|\d{11,15})))$/
    						.test($scope.rechargeVo.cardNo))){
            		//modalService.info({title:'提示', content:'获取不到正确手机号或卡号!', size:'sm', type: 'confirm'});
	           		return false;
            	}
    			ajaxService.AjaxPost( {paramValue:$scope.rechargeVo.cardNo,sessionId:sessionId},"postrade/memberhome/memberhomeinfo.do").then(
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
	    	    			/*if($scope.entranceFrom == 1){
	    	    				$scope.cardNoDisabled=true; //改变手机号\卡号输入状态为禁用
	    	    			}*/
	    	    			
	    				}
	                }
	    		);
    		}
    		//3.加载页面是 ，如果发现用户信息存在……（操作一卡多业务的情况的入口）
    		if($rootScope.currentuserinfo){
    			$scope.entranceFrom = 1;//数据来源传递
    			$scope.currUserInfo = $rootScope.currentuserinfo;
    			$scope.rechargeVo.cardNo = $scope.currUserInfo.cardInfoBean.number;
    			$scope.cardNoDisabled=true; //改变手机号\卡号输入状态为禁用
    			//$scope.getMemeberAndCardInfo();
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
            //6.获取流水号
            $scope.getTsCode=function(){
            	if(!$scope.rechargeVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	                	$scope.rechargeVo.tsCode = result.tsCode;
	                });
            	}
            	
            }
            //7.保存充值
            
            $scope.saveRecharge = function(){
            	$scope.forbideSave=true;
            	if( !$scope.rechargeVo.cardNo || $scope.rechargeVo.cardNo == '' || !(/[1-9](?:\d{0,9}|\d{11,15})/.test($scope.rechargeVo.cardNo)) ){
            		modalService.info({title:'提示', content:'获取不到正确卡号!', size:'sm', type: 'confirm'});
            		$scope.forbideSave=false;
            		return false;
            	}
            	if( !$scope.rechargeVo.value || $scope.rechargeVo.value == '' || !(/^[1-9]\d{0,6}(?:\.\d{1,2})?$/.test($scope.rechargeVo.value))){
            		modalService.info({title:'提示', content:'请输入合法支付金额!', size:'sm', type: 'confirm'});
            		$scope.forbideSave=false;
            		return false;
            	}
            	if( !$scope.rechargeVo.tsTypeId || !$scope.rechargeVo.tsTypeName || $scope.rechargeVo.tsTypeName ==''){
	        		modalService.info({title:'提示', content:'请选择支付方式!', size:'sm', type: 'confirm'});
	        		$scope.forbideSave=false;
	        		return false;
            	}
            	if(!$scope.rechargeVo.tsCode){
	            	ajaxService.AjaxPost({sessionId: sessionId}, 'postrade/postscode/generatorTsCode.do').then(function (result) {
	            		if(result.tsCode){
	            			$scope.rechargeVo.tsCode = result.tsCode;
	            			trueSave();
	            		}else{
	            			$scope.forbideSave=false;
	            		}
	                },function(){//errror
	                	$scope.forbideSave=false;          
	                });
            	}else{
            		trueSave();
            	}
            }
            //7.1 判断条件合法后，触发真实保存
            function trueSave(){
            	ajaxService.AjaxPost($scope.rechargeVo, 'postrade/recharge/rechargeMoney.do').then(function (result) {
            		$scope.forbideSave=false;//解除按钮不可用状态
            		if(result.status){
            			
                		modalService.info({content:'充值成功!', type: 'ok'});
                		//调用打印服务
                    	console.log(result.printInfo);
                    	//打印
                    	var data = {
                    			"businessType":1,
                    			"printSetInfosBeans":$rootScope.printSetInfos,
                    			"dataPkgObj":$scope.rechargeVo.tsCode,
                    			"sessionId":$rootScope.sessionId};
                    	ajaxService.AjaxPost(data,"pos/print/printBill.do").then(function (result) {
        		                    if(result.status===1)
        		                    {
        		                   	 devicesService.design(result.data);
        		                    }
        		                }
        		         );
                    	//(不考虑打印的情况下)页面恢复初始化
                    	if($scope.entranceFrom == 0){
                    		$scope.rechargeVo={
                    				cardNo:'',//卡号
                            		tsCode:0,//流水码
                            		tsTypeId:2,//支付类型ID
                            		tsTypeName:'现金',//支付类型名称
                            		value:'',//充值金额
                            		sessionId:sessionId
    	                    }
                    		$scope.cardNoDisabled = false;//解除卡号栏的不可用状态
                    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = null;
                    	}else{
                    		$scope.getMemeberAndCardInfo();
                    		posService.goBack();
                    	}
                	}
                },function(){
                	 $scope.forbideSave=false;//解除按钮不可用状态       
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
            
    	}];
});