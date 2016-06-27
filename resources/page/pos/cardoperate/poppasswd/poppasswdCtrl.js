/**
 * 弹窗密码框输入密码
 * @version  v1.0
 * @createTime: 2016-06-07
 * @createAuthor zuoxh
 * @updateHistory
 *
 *
 */
define(function( require ){
    var ngAMD = require( "ngAMD" );
    var posServive = require( "posService" );
	ngAMD.controller( "poppasswdCtrl",
    	["$scope",
    	 "$state",
    	 "$rootScope",
    	 "ajaxService",
		 "modalService",
		 "$uibModalInstance",
		 'getCookieService',
		 'posService',
       function($scope,$state,$rootScope,ajaxService,modalService,$uibModalInstance,getCookieService,posService){
    	
		//sessionId
    	var sessionId = getCookieService.getCookie("CRMSESSIONID");
        //声明会员实体
        $scope.popPasswd={
    		password:''//密码
        }
        
        /**
         * 将密码传递到父页面的回调方法中
         */
        $scope.transferPWD = function(){
        	
        	if( !$scope.popPasswd.password || $scope.popPasswd.password == '' || !/^\d{6}$/.test($scope.popPasswd.password)){
       		 modalService.info({title:'提示', content:'请输入6位密码!', size:'sm', type: 'confirm'});
       		 return false;
        	}
        	$uibModalInstance.close($scope.popPasswd);
            
        };
        
        /**
         * 取消操作，关闭模态框
         */
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
		   $scope.canceInputPwd = function(){
			   $scope.cancel();
		   }

        
    }]);
});