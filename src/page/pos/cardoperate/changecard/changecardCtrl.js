/**
 * 软POS换卡业务
 * @version  v1.0
 * @createTime: 2016-06-03
 * @createAuthor Hyz
 * @updateHistory  
 *
 */
define(['posService'], function () {
	var angular = require("angular");
    return ["$scope",'$window',"ajaxService","posService","getCookieService","$rootScope","modalService","$filter","$uibModal","$state",
            function ($scope,$window,ajaxService,posService,getCookieService,$rootScope,modalService,$filter,$uibModal,$state) {
    		//sessionId获取
    		var sessionId = getCookieService.getCookie("CRMSESSIONID");
    		$scope.changeCardVo=
    		{
    				"oldCardNo":"",
    				"newCardNo":"",
    				"password":"",
    				"repassword":"",
    				"memberHomeBean":"",
    				"sessionId": $rootScope.sessionId,
    				"verifyOldPass":"",
    				"cardChargeType":1
    		}
    		$scope.newCardInfo={};
    		$scope.validatePasswdMsg="请输入6位数字密码"
    		//验证密码
            $scope.validatePasswd=function(){
            	$scope.validatePasswdMsg=""
            	if(!(/^\d{6}$/.test($scope.changeCardVo.repassword))||$scope.changeCardVo.repassword==''){
            		$scope.validatePasswdMsg="请输入6位数字密码";
            		$scope.validatePasswdresult = true;
            		return;
            	}else{
            		if($scope.changeCardVo.repassword != $scope.changeCardVo.password){
	        			$scope.validatePasswdMsg="两次输入密码不一致！";
	        			$scope.validatePasswdresult = true;
	        			return;
            		}
            	}
            	 $scope.validatePasswdresult = false;
            }
    		//
    		 $scope.isValidCardNo =false;
    		//验证新卡是否是开卡状态
    		$scope.verifyNewCard=function(newCardNo)
    		{
            	if(newCardNo && newCardNo != ''
            		&& /^[1-9](\d{4,9}|\d{11,15})$/.test(newCardNo)){
                    ajaxService.AjaxPost({cardNo:newCardNo, sessionId: sessionId}, 
                    		'postrade/posCardUsed/isCardUnsaled.do').then(function (result) {
                        if(result){
                        	//有此卡
                        	if(result.cardNoStatus){
                        		 $scope.invalidCardNoInfo ="";
                        		 $scope.isValidCardNo =false;
                        		 $scope.newCardInfo = result.data;
                        	}else{
                        		 $scope.isValidCardNo =true;
                        		 $scope.invalidCardNoInfo = result.errCardNoMsg;
                        	}
                        }
                    });
            	}
    		}
    		//标记用户信息来源
            if($rootScope.currentuserinfo){
    			$scope.entranceFrom = 1;//数据来源传递
    			$scope.currUserInfo = angular.copy($rootScope.currentuserinfo);
    			$scope.changeCardVo.oldCardNo = $scope.currUserInfo.cardInfoBean.number;
    			$scope.oldCardNoDisabled=true; 
    			if($scope.currUserInfo.cardInfoBean.cardStatus!==101)
    			{
    				$scope.isOldCardStatus=true;
    			}
    		}
            //获取用户信息
            $scope.getMemeberAndCardInfo=function(){
            	//赋值   为编辑页面传值
	        	$rootScope.cardoperatetoeditusrmemberinfo = null;
	        	//定义全局当前user信息
	        	$rootScope.currentuserinfo = null;
	        	
    			if( !$scope.changeCardVo.oldCardNo 
					|| $scope.changeCardVo.oldCardNo == '' 
    				|| !(/^(([1-9](\d{4,9}|\d{11,15})))$/
    						.test($scope.changeCardVo.oldCardNo))){
            		//modalService.info({title:'提示', content:'获取不到正确手机号或卡号!', size:'sm', type: 'confirm'});
	           		return;
            	}
    			ajaxService.AjaxPost( {paramValue:$scope.changeCardVo.oldCardNo,sessionId:sessionId},"postrade/memberhome/memberhomeinfo.do").then(
	    			function (result) {
	    				if(result.status && result.data)
	    				{
	    		    		var data = result.data;
	    		    		//赋值   为编辑页面传值
	    		        	$rootScope.cardoperatetoeditusrmemberinfo = data.memberInfoBean;
	    		        	//定义全局当前user信息
	    		        	$rootScope.currentuserinfo = data;
	    		        	$scope.oldCardNoDisabled = true;
	    		        	if(data.cardInfoBean.cardStatus!==101)
	    	    			{
	    	    				$scope.isOldCardStatus=true;
	    	    			}
	    		        	$scope.entranceFrom = 0;//快捷进来的   数据卡号获得的用户信息，返回pos时候将用户信息清空
	    		        	$scope.currUserInfo = data;//赋值给本地
	    				}
	                }
	    		);
    		}
            //回退
            $scope.goBack = function(){
            	if($scope.entranceFrom ==0){
            		//赋值   为编辑页面传值
		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
		        	//定义全局当前user信息
		        	$rootScope.currentuserinfo = null;
            	}
                posService.goBack();
            };
            //提交
            $scope.saveChangeCard = function(changeCardVo)
            {
   			 var html = ['<div>',
   			          '			<div class="modal-header">',
   			       '				请输入原卡密码',
   			       '			<i class="iconfont" style="float:right;" ng-click="cancelVerifyOldPass()">&#xe63c;</i>',
   			       '			</div>',
   			       '		    <div class="modal-body">',
   			       '			    <form class="form-horizontal" autocomplete="off" name="veryifyOldPassForm" id="veryifyOldPassForm" ng-submit="veryifyOldPass()">',
   			       '			         <div class="form-group">',
   			       '		                  <input type="password" class="form-control  form-control-input consume-text-size" ',
   			       '		                  			name="oldPass" id="oldPass" placeholder="请输入6位数字密码,不输入默认6个1"',
   			       '		                           ng-model="veryifyOldPassVo.oldPass"',
   			       '		                           ng-pattern="/^\\d{6}$|^$/"',
   			       '		                           tooltip-trigger="blur" ',
   			       '		                           uib-tooltip="{{veryifyOldPassForm.oldPass.$invalid ?\'请输入6位数字密码\':\'\'}}"',
   			       '		                           tooltip-placement="bottom"/>',
   			       '            		</div>',
   			       '		            <div class="modal-footer">',
   			       '				        <div class="col-sm-6">',
   			       '				            <button type="submit"  class="btn btn-primary btn-default pos-btn" ng-disabled="veryifyOldPassForm.oldPass.$invalid">确定(Enter)</button>',
   			       '				        </div>',
   			       '				        <div class="col-sm-6">',
   			       '				            <button type="button"  class="btn btn-default pos-btn" ng-click="cancelVerifyOldPass()">取消(Esc)</button>',
   			       '				        </div>',
   			       '				   </div>',
   			       '		   	</form>',
   			       '          </div>',
   			       '		</div>'].join("");
   			 var modalInstance = $uibModal.open({
                    animation: true,
                    template:html,
                    size: "sm",
                    resolve: {
                    	 ModelParamData: function () {
                             return changeCardVo;
                         }
                    },
                    controller:
                    	['$scope','$rootScope','$uibModalInstance','$state',"ajaxService","ModelParamData",
                    	 function($scope,$rootScope,$uibModalInstance,$state,ajaxService,ModelParamData){
                    		$scope.veryifyOldPassVo=
                    		{
                    				oldPass:""
                    		}
                    		//验证密码
                    		$scope.veryifyOldPass = function()
                    		{
                    			var flag = false;
                    			var oldcardNo = ModelParamData.oldCardNo;
                    			var vpass = $scope.veryifyOldPassVo.oldPass==""?111111:$scope.veryifyOldPassVo.oldPass;
//                    			alert(vpass);
                    			var param = {"oldCardNo":oldcardNo,"sessionId": $rootScope.sessionId,"verifyOldPass":vpass};
//                    			alert(param);
                    			ajaxService.AjaxPost( param,
                    					"postrade/card/verifyCardPass.do").then(
                    	    			function (result) {
                    	    				if(result.status)
                    	    				{
                    	    					flag = true;
                    	    				}
                    	    				//跳出模态返回值
                	    					$uibModalInstance.close(flag);
                    	                }
                    	    		);
                    		}
                    		
                    		//取消操作
                    		 $scope.cancelVerifyOldPass = function () {
                             	$uibModalInstance.dismiss('cancel');
                             }
                    	}]
                });
   			 
   			 //处理模态框返回到当前页面的数据
             modalInstance.result.then(function (veryifyStatus) {
                  if(veryifyStatus){
                	  //新卡信息有效           老卡密码验证正确
                      if($scope.newCardInfo&&veryifyStatus)
                      {
                    	  var param = {
                    			  "oldCardNo":$scope.changeCardVo.oldCardNo,
                    			  "password": $scope.changeCardVo.password,
                    			  "repassword":$scope.changeCardVo.repassword,
                    			  "memberHomeBean":$scope.currUserInfo,
                    			  "posCardUnsaled": $scope.newCardInfo,
                    			  "sessionId": $rootScope.sessionId,
                    			  "cardChargeType":$scope.changeCardVo.cardChargeType
                    			  };
              				ajaxService.AjaxPost( param,
              					"postrade/card/changeCard.do").then(
              	    			function (result) {
              	    				if(result.status===1)
              	    				{
              	    					modalService.info({content:'成功!', type: 'ok'})
				    		        	ajaxService.AjaxPost( {paramValue:$scope.newCardInfo.number,sessionId:sessionId},
				    		        			"postrade/memberhome/memberhomeinfo.do").then(
				    			    			function (result) {
				    			    				if(result.status && result.data)
				    			    				{
				    			    		    		var data = result.data;
				    			    		    		//赋值   为编辑页面传值
				    			    		        	$rootScope.cardoperatetoeditusrmemberinfo = data.memberInfoBean;
				    			    		        	//定义全局当前user信息
				    			    		        	$rootScope.currentuserinfo = data;
				    			    				}
				    			                }
				    			    		);
              	    					$state.go('pos.cardoperte.mainpage');
              	    				}
              	                }
              	    		);
                      }
                  }
             });
   		 
            }
    	}];
});