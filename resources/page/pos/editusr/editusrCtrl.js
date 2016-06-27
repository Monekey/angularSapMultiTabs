/**
 * 会员编辑页面
 * @version  v1.0
 * @createTime: 2016/5/20 
 * @createAuthor hyz
 * @updateHistory
 *                2016/5/20  hyz create 
 */
define(['posService'], function () {
    return [
            "$scope",
            "appConstant",
            "ajaxService",
            "modalService",
            "$rootScope",//加载模块，顺序与function中的参数一致
            '$state',
            'posService',
            function ($scope, appConstant, ajaxService,modalService,$rootScope,$state, posService) {
    	
            	
    	//初始化是否显示验证码校验（默认不校验）
    	$scope.displayValidateCode =false;    	//获取父页面操作记录的数据
        var tabData = $rootScope.cardoperatetoeditusrmemberinfo;
        //为避免修改父页面数据，复制数据
        var data = angular.copy(tabData);
        //将副本数据赋值给当前scope中的对象
        $scope.member = data;
        /*
         * 不更新使用
         */
        var oldmobile = undefined==$scope.member.mobile?null:$scope.member.mobile;
        //为了避免卡类型、民族下拉框select不到值的情况，将当前卡类型的值、以及民族值转换为字符串
        $scope.member.cardKind=$scope.member.cardKind+"";
        $scope.member.nation=$scope.member.nation+"";
        //规定页面默认展示阳历生日
        $scope.member.birthdayType='0';
        //常量中获取民族列表
        $scope.nationList = appConstant.nationList;
        //常量中获取证件类型列表
        $scope.cardKindList = appConstant.cardKindList;
        //常量中获取生日类型列表
        $scope.birthdayTypeList = appConstant.birthdayTypeList;
        $scope.member.birthdayStr = new Date($scope.member.birthday).getTime();
        /*保存更新操作*/
        $scope.updateMember = function (member) {
        	member.birthday = new Date(member.birthday).getTime();
            member.createTime = new Date(member.createTime).getTime();
            member.updateTime = new Date(member.updateTime).getTime();
            /**
             * 0：不作操作
             * 1：更新绑定
             * 2：解绑
             * 3：新增绑定
             */
            var ifUpdateMobile = 0;
            //当前电话为空     原电话不位空  ----为解绑
            if(member.mobile==''&&oldmobile!==null&&oldmobile!=='')
            {
            	ifUpdateMobile=2;
            }
            //当前电话不为空     原电话不为空     当前电话不为原电话  ----更新绑定关系
            if(member.mobile!==''&&oldmobile!==null&&oldmobile!==''&&member.mobile!==oldmobile)
            {
            	ifUpdateMobile=1;
            }
            //当前电话不为空     原电话不为空      ----增加绑定关系
            if(member.mobile!==''&&oldmobile==null)
            {
            	ifUpdateMobile=3;
            }
        	//声明
        	//声明参数
            var param = {"member": member, 
            		"sessionId": $rootScope.sessionId,
            		"ifUpdateMobile":ifUpdateMobile,
            		"oldMobile":oldmobile,
            		"memberHomeBean":$rootScope.currentuserinfo};
            //调用ajax服务，保存更新内容
            ajaxService.AjaxPost(param, 'postrade/memberhome/modifyuserinfo.do').then(function (result) {
            	if(result.status)
            	{
            		modalService.info({content:'更新成功!', type: 'ok'});
            		//不是解绑
//            		if(ifUpdateMobile!==2)
//            		{
//            			//向主页传搜索值
//                		$rootScope.paramValue=member.mobile;
//                    	$state.go('pos.cardoperte.mainpage');
//            		}
//            		else
//            		{
            			$rootScope.paramValue=$rootScope.currentuserinfo.cardInfoBean.number;
            			$state.go('pos.cardoperte.mainpage');
//            		}
            	}
            });
        };
        $scope.cancel = function () {
//        	$rootScope.paramValue=oldmobile;
            posService.goBack();
        }
        
        $scope.validateMobile=function(){
        	//1、验证手机号结构$scope.member
        	if($scope.member.mobile && $scope.member.mobile != ''
        		&& /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test($scope.member.mobile)
        		&&$scope.member.mobile!==oldmobile){
        		//2、验证手机号是否绑定会员卡
        		$scope.displayValidateCode = true;
                //调用ajax服务
        	}else{
        		//去掉验证码、去掉取消绑定的显示
            	$scope.displayValidateCode = false;
        	}
        }
        
        $scope.getValidateCode=function(){
        	//1、验证手机号结构$scope.member
        	alert("发送验证码！");
        }
        
        $scope.checkValidateCode=function(code,phone){
        	//1、验证手机号结构$scope.member
        	if(code==1234&&phone)
        	{
        		alert("验证成功！");
        		$scope.displayValidateCode = false;
        		$scope.member.validatCode = '';
        	}
        	else
        	{
        		alert("验证失败！");
        	}
        }
    }];
});