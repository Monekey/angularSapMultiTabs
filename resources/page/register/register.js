/**
 * 用户注册
 * @version  v1.0
 * @createTime: 2016-6-20
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
/**
 * @param require
 */
define(function () {
    return ["$scope",
            "appConstant",
            "ajaxService",
            "register",
            "modalService",
            '$state',
            "$rootScope",//加载模块，顺序与function参数顺序一致
            function ($scope, appConstant, ajaxService, register, modalService,$state,$rootScope) {
            	//隐藏加载遮罩
    			$rootScope.overlay = true;
            	//禁止保存，防重复提交
            	$scope.forbideSave=false;
            	//初始化用户
            	$scope.newUser={
            		'mobile':'',//手机号：与Email不能同时出现
            		'email':'',//Email：与手机号不能同时出现
            		'smsCode':'',//手机短信校验码
            		'name':'',//姓名
            		'password':'',//密码
            		'repassword':'',//确认密码
            		'showMobile':true,//是否显示手机号，默认显示
            		'isValidSmsCode':false, //是否是有效的校验码
            		'isValidPassword':false, //密码与确认密码是否相同（默认否）
            		'isValidMobile':false,//是否有效的手机号格式，为了验证表单是否可以提交
            		'isValidEmail':false//是否有效的电子邮箱格式，为了验证表单是否可以提交
            	};
            	
            	//切换显示手机号账户和Email账户
            	$scope.taggleAccountType =function(isMobile){
            		$scope.newUser.mobile='';
            		$scope.newUser.email='';
            		$scope.newUser.smsCode='';
            		$scope.newUser.isValidSmsCode=false;
            		$scope.newUser.isValidMobile=false;
            		$scope.newUser.isValidEmail=false;
            		if(isMobile){//切换到手机号账户
            			$scope.newUser.showMobile = true;
            		}else{//切换到Email账户
            			$scope.newUser.showMobile = false;
            		}
            	}
            	
            	//验证邮箱格式
            	$scope.validateEmailFormat=function(newUser){
            		newUser.isValidEmail=false;
            		if(newUser.email && /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(newUser.email)){
            			newUser.isValidEmail= true;
            		}
            	}
            	
            	//验证手机号格式
            	$scope.validateMobileFormat=function(newUser){
            		newUser.isValidMobile=false;
            		if(newUser.mobile && /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(newUser.mobile)){
            			newUser.isValidMobile= true;
            		}
            	}
            	
            	//获取手机校验码
            	$scope.getSellCardSmsCode = function(newUser){
            		newUser.smsCode = '';
            		newUser.isValidSmsCode=false;
            		if(newUser.mobile && newUser.mobile != '' && /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(newUser.mobile)){
                		//调用获取短信
                		ajaxService.AjaxPost({mobile: newUser.mobile}, 'common/sms/getSmsCode.do').then(function (result) {
                            if(result.status){
                            	modalService.info({content:'发送验证码成功！', type: 'ok'});
                            }
                        });
                	}else{
                		modalService.info({title:'提示', content:'请输入11位手机号！', size:'sm', type: 'confirm'});
                	}
            	}
            	
            	//验证手机校验码
            	$scope.checkSmsCode = function(newUser){
            		newUser.isValidSmsCode=false;
                	if(newUser.smsCode && newUser.smsCode != ''){
                		//参数
                		var param ={
        					smsCode: newUser.smsCode,
        					mobile: newUser.mobile
                		};
                		ajaxService.AjaxPost(param, 'common/sms/checkSmsCode.do').then(function (result) {
	            			if(result.status && result.smsCodeStatus){
	                            	newUser.isValidSmsCode=true;
	                        }
                        });
            		}
            	}
            	//初始化警告、错误等提示信息
        		$scope.tipMsg={};
        		//验证密码
            	$scope.validatePasswd=function(newUser){
            		newUser.isValidPassword=false;
                 	var result =false;
                 	if( !(/^[0-9a-zA-Z]{1,20}$/.test(newUser.repassword))){
                 		$scope.tipMsg.repassword="请输入确认密码！";
                 		result = true;
                 	}else{
                 		if(newUser.repassword != newUser.password){
	             			$scope.tipMsg.repassword="两次输入密码不一致！";
	                 		 result = true;
                 		}else{
                 			newUser.isValidPassword=true;
                 		}
                 	}
                 	return result;
                 }
            	
            	//保存注册
            	$scope.saveUser = function(newUser){
            		$scope.forbideSave=true;
            		if(newUser.showMobile){
            			$scope.validateMobileFormat(newUser);
            			if(!newUser.isValidMobile){
            				$scope.forbideSave=false;
            				modalService.info({title:'提示', content:'请输入11位手机号！', size:'sm', type: 'confirm'});
            				return false;
            			}
            		}else{
            			$scope.validateEmailFormat(newUser);
            			if(!newUser.isValidEmail){
            				$scope.forbideSave=false;
            				modalService.info({title:'提示', content:'请输入有效邮箱！', size:'sm', type: 'confirm'});
            				return false;
            			}
            		}
            		
            		if(!newUser.password || newUser.password == ''){
            			$scope.forbideSave=false;
            			modalService.info({title:'提示', content:'密码不允许为空！', size:'sm', type: 'confirm'});
        				return false;
            		}
            		if(!newUser.repassword || newUser.repassword == ''){
            			$scope.forbideSave=false;
            			modalService.info({title:'提示', content:'确认密码不允许为空！', size:'sm', type: 'confirm'});
        				return false;
            		}
            		if(newUser.repassword != newUser.password){
            			$scope.forbideSave=false;
            			modalService.info({title:'提示', content:'两次输入的密码不一致！', size:'sm', type: 'confirm'});
        				return false;
            		}
            		//ajax保存
            		ajaxService.AjaxPost(newUser, 'register/registerUser.do').then(function (result) {
                        if(result.status ){
                        	modalService.info({content:'用户注册成功！', type: 'ok'});
                        	$state.go('login');
                        }else{
                        	$scope.forbideSave=false;
                        }
                    },function(data){
                    	$scope.forbideSave=false;
                    });
            		
            	}
            	//去登录页
            	$scope.goLogin = function(){
            		$state.go('login');
            	}
            }];
        
});