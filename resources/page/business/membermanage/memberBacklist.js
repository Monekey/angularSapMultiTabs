/**
 * 集团会员黑名单
 * @version  v1.0
 * @createTime: 2016-05-06
 * @createAuthor zuoxh
 * @updateHistory
 *
 *
 */
define(function( require ){
    var ngAMD = require( "ngAMD" );

    ngAMD.controller( "memberBacklistCtrl",
    	["$scope",
    	 "$rootScope",
    	 "ajaxService",
		 "memberObjModel",
		 "modalService",
		 "$uibModalInstance", 
       function($scope,$rootScope,ajaxService,memberObjModel,modalService,$uibModalInstance){

        //声明会员实体
        $scope.member={
        		id : memberObjModel.id,//会员标识
        		status:memberObjModel.status,//会员状态
        		note:''//备注
        }
        
        /**
         * 保存操作，保存成功后，提示信息，并关闭模态框
         */
        $scope.saveBackList = function(){
        	//参数声明
            var param = {member: $scope.member, sessionId: $rootScope.sessionId};
            //调用ajax服务实现会员状态更改
            ajaxService.AjaxPost(param, 'businessmanage/memberManage/updateMemberStatus.do').then(function (result) {
            	//调用成功的回调方法
            	var resultMember={
            			status:result.member.status//将会员状态改为返回结果中的会员状态
            	};
                $uibModalInstance.close(resultMember);
            });
        };
        /**
         * 取消操作，关闭模态框
         */
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
        
        /*计算字符串长度*/
        $scope.disabledSubmit=true;
        $scope.calcCharacterCount =function(){
        	var noteLen=$scope.member.note.length;
        	if($scope.member.note && noteLen>0 && noteLen<=20){
        		$scope.disabledSubmit=false
        	}else{
        		$scope.disabledSubmit=true;
        	}
        }
    }]);
});