/**
 * 解除会员卡与手机号绑定
 * @version  v1.0
 * @createTime: 2016-05-06
 * @createAuthor zuoxh
 * @updateHistory
 *
 *
 */
define(function( require ){
    var app = require( "app" );
    var posServive = require( "posService" );
    app.ngAMDCtrlRegister.controller( "cancelCardBindCtrl",
    	["$scope",
    	 "$state",
    	 "$rootScope",
    	 "ajaxService",
		 "cancelBindModal",
		 "modalService",
		 "$uibModalInstance",
		 'getCookieService',
		 'posService',
       function($scope,$state,$rootScope,ajaxService,cancelBindModal,modalService,$uibModalInstance,getCookieService,posService){
    	
		//sessionId
    	var sessionId = getCookieService.getCookie("CRMSESSIONID");
        //声明会员实体
        $scope.card={
        		mobile:cancelBindModal.mobile, //手机号
        		cardNo:'',//卡号
        		cardId:'',//卡标识
        		cardTypeName:'',//卡类型名称
        		memberName:'',//会员姓名
        		password:'',//原卡密码
        		sessionId:sessionId
        }
        
        //获取与手机号绑定的卡的信息
        ajaxService.AjaxPost({mobile:$scope.card.mobile,sessionId:sessionId}, 'postrade/posCardUsed/getCardInfoByMobile.do').then(function (result) {
        	if(result.status){
    			 $scope.card.cardId =result.cardId;
        		 $scope.card.cardNo =result.cardNo;
        		 $scope.card.cardTypeName = result.cardTypeName;
        		 $scope.card.memberName = result.memberName;
        	}
        });
        
        /**
         * 保存操作，保存成功后，提示信息，并关闭模态框
         */
        $scope.saveCancelBind = function(){
        	if( !$scope.card.cardNo || $scope.card.cardNo == ''){
        		 modalService.info({title:'提示', content:'不能获取卡信息!', size:'sm', type: 'confirm'});
        		 return false;
        	}
        	if( !$scope.card.password || $scope.card.password == '' || !/^\d{6}$/.test($scope.card.password)){
       		 modalService.info({title:'提示', content:'请输入6位数原密码!', size:'sm', type: 'confirm'});
       		 return false;
        	}
            ajaxService.AjaxPost($scope.card, 'postrade/posCardUsed/cancelCardBind.do').then(function (result) {
            	//调用成功的回调方法
            	if(result.status){
            		var cancelResult={
                		status:result.status
                	};
                    $uibModalInstance.close(cancelResult);
            	}else{
            		$uibModalInstance.dismiss('cancel');
            	}
            	
            },function(data){
            	$uibModalInstance.dismiss('cancel');
            });
        };
        
        /**
         * 取消操作，关闭模态框
         */
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.resetPasswd=function(cardNo){
        	var routeruledata =$rootScope.routeruledata;
        	var target = null;
        	for (var i = 0; i < routeruledata.length; i++) {
				if(routeruledata[i].code == "10045"){//卡密码
					target = routeruledata[i];
				}
			}
        	if(target){
        		//注册并跳转到对应页面
        		posService.gotoPos(target);
        		//在rootScope中注册要重置密码的卡号；密码页面接收后，需置空操作！
        		$rootScope.cardNoForResetPasswd= cardNo;
        		//关闭掉模态弹窗……
        		$uibModalInstance.dismiss('cancel');
        	}
        	
        }
        
    }]);
});