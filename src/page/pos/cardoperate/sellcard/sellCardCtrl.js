/**
 * pos前台售卡操作
 * @version  v1.0
 * @createTime: 2016/5/25 
 * @createAuthor zuoxh
 * @updateHistory
 * 
 */
define(function (require) {
	var posService = require('posService');
	//加载取消绑定页面
	var cancelCardBindCtrl = require("pos/cardoperate/cancelbind/cancelCardBindCtrl");
    var cancelCardBindTemp = require("text!pos/cardoperate/cancelbind/cancelCardBind.html");
    return[
            '$scope',
            '$uibModal',
            'posService',
            'ajaxService',
            'register',
            'getCookieService',
            'appConstant',
            'modalService',
            '$rootScope',
            function ($scope,$uibModal,posService,ajaxService, register, getCookieService, appConstant,modalService, $rootScope) {
            	
            	//sessionId
            	var sessionId = getCookieService.getCookie("CRMSESSIONID");
            	//初始化警告、错误等提示信息
            	$scope.tipMsg={};
            	
            	$scope.relCard=0;//实体化
            	$scope.eleCard=1;//电子卡
            	//sessionId
                var sessionId = $rootScope.sessionId;
                //常量生日类型获取
                $scope.birthdayTypeList = appConstant.birthdayTypeList;
                //常量中获取证件类型列表
                $scope.cardKindList = appConstant.cardKindList;
                //常量中获取民族列表
                $scope.nationList = appConstant.nationList;
                
                
                //初始化实体卡模型
                $scope.relCardSell={
                		cardInfo:{	//卡信息
                			mobile:"",	//手机号
                			cardNo:"",	//卡号
                			password:"",	//密码
                			repassword:"",	//确认密码
                			cardTypeInfo:"", //卡类型信息
                			cardTypeName:"", //卡类型名称
                			smsCode:"",	//短信验证码
                			//cardCharge:0, //工本费
                			mobileCopy:""//手机号副本
                		},
                		memberInfo:{	//会员信息
                			name:"",	//会员姓名
                			sex:1,		//性别 1:男 0:女
                			birthdayType:'0',//生日类型 0：阳历 1：阴历
                			birthday:null, //生日
                			byInviteCode:"", //邀请码
                			byInviteName:"",//邀请我的会员的名字
                			nation:'0',	//民族
                			cardKind:'', //证件类型
                			certificateNo:"", //证件号码
                			workUnit:"",	//工作单位
                			job:"", //岗位
                			address:"",//地址
                			note:"" //备注
                		},
                		sellType:'1',//售卡类型  1：实体卡 2：电子卡
                		isRegistered:true,//是否注册的结果
                		isValidCode:false,//是否有效的验证码
                		isValidCardNo:false,//是否是有效的卡账号
                		isValidInvite:false,//是否是有效的邀请人
                    	displayValidateCode:false,//初始化是否显示验证码校验（默认不校验）
                    	displayCancelBind:false,//初始化是否取消绑定（默认不取消）
                    	invalidCardNoInfo:"",//初始化卡号无效的信息（默认为空）
                		sessionId:sessionId
                }
                /*查询所有的卡类型所有可用卡类型，构建卡类型下拉框*/
                $scope.allCardTypeList =[];//卡类型
    			$scope.allCardTypeList2 =[];//重构卡类型
            	ajaxService.AjaxPost({sessionId: $rootScope.sessionId}, 'memberequity/cardtype/getCardTypeCombo.do').then(function (result) {
            		if(result.data){
            			$scope.allCardTypeList = result.data;
            			$scope.cardTypeList2 =[];
            			for (var i = 0; i < result.data.length; i++) {
							var oType=result.data[i];
							var temp =oType.value+','+oType.cardCharge;
							var cardTypeObj={value:temp,showName:oType.showName};
							$scope.allCardTypeList2.push(cardTypeObj);
						}
            			$scope.relCardSell.cardInfo.cardTypeInfo =$scope.allCardTypeList2[0].value;
                		$scope.eleCardSell.cardInfo.cardType = $scope.allCardTypeList[0].value;
            			
            		}
                });
            	
               
                
                //验证密码
                //note:实体卡与电子卡公用函数
                $scope.validatePasswd=function(sellCardType){
                	
                	var cardSellObj = null
                	if($scope.eleCard == sellCardType){//电子卡
                		cardSellObj=$scope.eleCardSell;
                	}else{//实体卡
                		cardSellObj=$scope.relCardSell;
                	}
                	
                	var result =false;
                	if( !(/^\d{6}$/.test(cardSellObj.cardInfo.repassword))){
                		$scope.tipMsg.repassword="请输入6位数字密码！";
                		result = true;
                	}else{
                		if(cardSellObj.cardInfo.repassword != cardSellObj.cardInfo.password){
            			$scope.tipMsg.repassword="两次输入密码不一致！";
                		 result = true;
                		}
                	}
                	return result;
                }
                
                //验证手机号输入格式是否有效 以及是否已注册
                //note:实体卡与电子卡公用函数
                $scope.validateMobile=function(sellCardType){
                	var cardSellObj = null
                	if($scope.eleCard == sellCardType){//电子卡
                		cardSellObj=$scope.eleCardSell;
                	}else{//实体卡
                		cardSellObj=$scope.relCardSell;
                	}
                	//判断手机号发生变化时，才验证手机号
                	if(cardSellObj.cardInfo.mobileCopy == cardSellObj.cardInfo.mobile){
                		return false;
                	}
                	cardSellObj.cardInfo.mobileCopy = cardSellObj.cardInfo.mobile;
                	//初始化手机号被注册、验证码有效
                	cardSellObj.isRegistered=true;
                	cardSellObj.isValidCode=false;
                	cardSellObj.cardInfo.smsCode = '';
                	//1、验证手机号结构
                	if(cardSellObj.cardInfo.mobile && cardSellObj.cardInfo.mobile != ''
                		&& /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(cardSellObj.cardInfo.mobile)){
                		//2、验证手机号是否绑定会员卡
                        //调用ajax服务
                        ajaxService.AjaxPost({mobile: cardSellObj.cardInfo.mobile, sessionId: sessionId}, 'postrade/posCardUsed/isMobileRegisted.do').then(function (result) {
                            if(result.isMobileRegisted){
                            	//手机号被注册
                            	cardSellObj.isRegistered=true;
                            	//显示取消绑定提示
                            	cardSellObj.displayCancelBind = true;
                            	cardSellObj.displayValidateCode = false;
                            }else{
                            	//手机号没被注册
                            	cardSellObj.isRegistered=false;
                            	//显示验证码获取
                            	cardSellObj.displayValidateCode = true;
                            	cardSellObj.displayCancelBind = false;
                            }
                        });
                	}else{
                		//去掉验证码、去掉取消绑定的显示
                		cardSellObj.displayCancelBind = false;
                		cardSellObj.displayValidateCode = false;
                	}
                }
                
                //获取手机验证码
                //note:实体卡与电子卡公用函数
                $scope.getSellCardSmsCode = function(sellCardType){
                	
                	var cardSellObj = null
                	if($scope.eleCard == sellCardType){//电子卡
                		cardSellObj=$scope.eleCardSell;
                	}else{//实体卡
                		cardSellObj=$scope.relCardSell;
                	}
                	cardSellObj.cardInfo.smsCode = '';
                	cardSellObj.isValidCode=false;
                	if(cardSellObj.cardInfo.mobile && cardSellObj.cardInfo.mobile != ''
                		&& /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(cardSellObj.cardInfo.mobile)){
                		//调用获取短信
                		ajaxService.AjaxPost({mobile: cardSellObj.cardInfo.mobile, sessionId: sessionId}, 'postrade/posSms/getSellCardSmsCode.do').then(function (result) {
                            if(result.status){
                            	//modalService.info({title:'提示', content:'发送验证码成功！', size:'sm', type: 'confirm'});
                            	modalService.info({content:'发送验证码成功！', type: 'ok'});
                            }
                        });
                	}else{
                		modalService.info({title:'提示', content:'请输入11位手机号！', size:'sm', type: 'confirm'});
                	}
                }
                
                //验证验证码是否有效
                //note:实体卡与电子卡公用函数
                $scope.checkSellCardSmsCode = function(sellCardType){
                	
                	var cardSellObj = null
                	if($scope.eleCard == sellCardType){//电子卡
                		cardSellObj=$scope.eleCardSell;
                	}else{//实体卡
                		cardSellObj=$scope.relCardSell;
                	}
                	
                	cardSellObj.isValidCode=false;
                	if(cardSellObj.cardInfo.smsCode && cardSellObj.cardInfo.smsCode != ''){
                		//参数
                		var param ={
                					smsCode: cardSellObj.cardInfo.smsCode,
                					mobile: cardSellObj.cardInfo.mobile,
                					sessionId: sessionId
                					};
                		ajaxService.AjaxPost(param, 'postrade/posSms/checkSellCardSmsCode.do').then(function (result) {
                            if(result.status && result.smsCodeStatus){
                            	cardSellObj.isValidCode=true;
                            }else{
                            	/*modalService.info({title:'提示', content:'手机短信验证失败！', size:'sm', type: 'confirm'});
                            	cardSellObj.cardInfo.smsCode='';*/
                            }
                        });
                	}else{
                		//modalService.info({title:'提示', content:'请输入短信验证码！', size:'sm', type: 'confirm'});
                	}
                }
                
                //验证是否是当前集团的待售的卡账号（实体卡使用）
                $scope.checkCardNo=function(){
                	$scope.relCardSell.isValidCardNo =false;
                	$scope.relCardSell.invalidCardNoInfo="";
                	if($scope.relCardSell.cardInfo.cardNo && $scope.relCardSell.cardInfo.cardNo != ''
                		&& /^[1-9](\d{4,9}|\d{11,15})$/.test($scope.relCardSell.cardInfo.cardNo)){
                        ajaxService.AjaxPost({cardNo:$scope.relCardSell.cardInfo.cardNo, sessionId: sessionId}, 'postrade/posCardUsed/isCardUnsaled.do').then(function (result) {
                            if(result){
                            	if(result.cardNoStatus){
                        			 $scope.relCardSell.isValidCardNo =true;
                        			 $scope.relCardSell.cardInfo.cardTypeInfo=result.data.cardTypeId+','+result.data.cardCharge;
                            	}else{
                            		 $scope.relCardSell.invalidCardNoInfo = result.errCardNoMsg;
                            	}
                            }
                        });
                	}
                }
                
                //验证邀请码的有效性
                //note:实体卡与电子卡公用函数
                $scope.checkByInviteCode = function(sellCardType){
                	var cardSellObj = null
                	if($scope.eleCard == sellCardType){//电子卡
                		cardSellObj=$scope.eleCardSell;
                	}else{//实体卡
                		cardSellObj=$scope.relCardSell;
                	}
                	
                	cardSellObj.isValidInvite =false;
                	
                	if(cardSellObj.memberInfo.byInviteCode && cardSellObj.memberInfo.byInviteCode !="" && /^[0-9A-Z]{6}$/.test(cardSellObj.memberInfo.byInviteCode)){
                		//验证是否有效的验证码
                		ajaxService.AjaxPost({byInviteCode:cardSellObj.memberInfo.byInviteCode,sessionId:sessionId}, 'postrade/posMember/checkMemberByInviteCode.do').then(function (result) {
                            if(result.status){
                            	cardSellObj.isValidInvite =true;
                            	cardSellObj.memberInfo.byInviteName=result.byInviteName;
                            }else{
                            	cardSellObj.memberInfo.byInviteName='';
                            }
                        },function(data){
                        	cardSellObj.memberInfo.byInviteName='';
                        });
                	}else{
                		cardSellObj.memberInfo.byInviteName='';
                	}
                }
                //保存实体卡售卡操作
                $scope.saveRelSellCard =function(){
                	if($scope.relCardSell.cardInfo.mobile && $scope.relCardSell.cardInfo.mobile != ''){
                		if(!(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test($scope.relCardSell.cardInfo.mobile))){
                			modalService.info({title:'提示', content:'请输入11位手机号!', size:'sm', type: 'confirm'});
                			return false;
                		}
                		if($scope.relCardSell.isRegistered){
                			modalService.info({title:'提示', content:'该手机号已和其它会员卡绑定，无法办新卡！', size:'sm', type: 'confirm'});
                			return false;
                		}
                		if(!$scope.relCardSell.isValidCode){
                			modalService.info({title:'提示', content:'请输入验证码验证手机号！', size:'sm', type: 'confirm'});
                			return false;
                		}
                	}
                	if(!$scope.relCardSell.cardInfo.cardNo || $scope.relCardSell.cardInfo.cardNo == ""){
                		modalService.info({title:'提示', content:'请读取或输入卡号！', size:'sm', type: 'confirm'});
            			return false;
                	}
                	if(!$scope.relCardSell.isValidCardNo){
                		modalService.info({title:'提示', content:'会员卡不存在或已被出售！', size:'sm', type: 'confirm'});
            			return false;
                	}
                	if(!(/^\d{6}$/.test($scope.relCardSell.cardInfo.password))){
                		modalService.info({title:'提示', content:'请输入6位密码！', size:'sm', type: 'confirm'});
            			return false;
                	}
                	if(!(/^\d{6}$/.test($scope.relCardSell.cardInfo.repassword))){
                		modalService.info({title:'提示', content:'请输入6位确认密码！', size:'sm', type: 'confirm'});
            			return false;
                	}
                	
                	if($scope.relCardSell.cardInfo.repassword != $scope.relCardSell.cardInfo.password ){
                		modalService.info({title:'提示', content:'两次输入的密码不一致！', size:'sm', type: 'confirm'});
            			return false;
                	}
                	if(!$scope.relCardSell.memberInfo.birthday){
                		modalService.info({title:'提示', content:'请选择生日！', size:'sm', type: 'confirm'});
            			return false;
                	}
                	if($scope.relCardSell.memberInfo.cardKind && $scope.relCardSell.memberInfo.cardKind != '' &&
                		(!$scope.relCardSell.memberInfo.certificateNo ||$scope.relCardSell.memberInfo.certificateNo =='')){
                		modalService.info({title:'提示', content:'请填写证件编号！', size:'sm', type: 'confirm'});
            			return false;
                	}
                	if($scope.relCardSell.memberInfo.certificateNo && $scope.relCardSell.memberInfo.certificateNo != '' &&
                		(!$scope.relCardSell.memberInfo.cardKind ||$scope.relCardSell.memberInfo.cardKind =='')){
                		modalService.info({title:'提示', content:'请选择证照类型！', size:'sm', type: 'confirm'});
            			return false;
                    }
                	if($scope.relCardSell.memberInfo.byInviteCode &&  $scope.relCardSell.memberInfo.byInviteCode !=""
                		&& !$scope.relCardSell.isValidInvite){
                		modalService.info({title:'提示', content:'请填写有效的邀请码！', size:'sm', type: 'confirm'});
            			return false;
                	}
                	$scope.relCardSell.memberInfo.birthday=new Date($scope.relCardSell.memberInfo.birthday).getTime();
                	$scope.relCardSell.cardInfo.cardTypeName=$("#cardType").find("option:selected").text();
                	//调用保存按钮 
                	ajaxService.AjaxPost($scope.relCardSell, 'postrade/posCardUsed/saveSellCard.do').then(function (result) {
                        if(result.status){
                        	//modalService.info({title:'提示', content:'售卡成功！', size:'sm', type: 'confirm'});
                        	modalService.info({content:'售卡成功！', type: 'ok'});
                        	posService.goBack();
                        }
                    });
                }
                
                
                //解除绑定
                //note:实体卡与电子卡公用函数
                $scope.cancelBindCard =function(sellCardType){
                	
                	var cardSellObj = null
                	if($scope.eleCard == sellCardType){//电子卡
                		cardSellObj=$scope.eleCardSell;
                	}else{//实体卡
                		cardSellObj=$scope.relCardSell;
                	}
                	showCancelCardBindModal(cardSellObj);
                };
                
                /**
                 * 解除会员卡与手机号绑定的模态窗口
                 * note:实体卡与电子卡公用函数
                 */
               var showCancelCardBindModal = function(cardSellObj) {
                    var modalInstance = $uibModal.open({
                        //受否加载动画
                        animation: true,
                        //模态框页面
                        template: cancelCardBindTemp,
                        //模态框的尺寸
                        size: "lg",
                        //模态框对应的controller
                        controller: 'cancelCardBindCtrl',
                        //向模态框传递参数
                        resolve: {
                        	cancelBindModal: function () {
                        		var param = {mobile:cardSellObj.cardInfo.mobile};
                                return param;
                            }
                        }

                    });
                    //处理模态框返回到当前页面的数据
                    modalInstance.result.then(function (cancelResult) {
                         if(cancelResult.status){
                        	 cardSellObj.isRegistered =false; 
                        	 cardSellObj.isValidCode =false;
                        	 cardSellObj.displayCancelBind=false;
                        	 cardSellObj.displayValidateCode =true;
                             //modalService.info({title:'提示', content:'解除绑定成功!', size:'sm', type: 'confirm'});
                        	 modalService.info({content:'解除绑定成功!', type: 'ok'});
                         }
                    });
                };
                
                //取消按钮
                //note:实体卡与电子卡公用函数
                $scope.cancel=function(){
                	posService.goBack();
                }
                
			/**
			 * ==============================================================================================
			 * 电子卡
			 * ==============================================================================================
			 * 
			 */
                
                //初始化电子卡模型
                $scope.eleCardSell={
                		cardInfo:{	//卡信息
                			mobile:"",	//手机号
                			cardType:"",
                			cardNo:"",	//卡号
                			password:"",	//密码
                			repassword:"",	//确认密码
                			cardTypeName:"", //卡类型名称
                			smsCode:"",	//短信验证码
                			cardCharge:0, //工本费
                			mobileCopy:""//手机号副本
                		},
                		memberInfo:{	//会员信息
                			name:"",	//会员姓名
                			sex:1,		//性别 1:男 0:女
                			birthdayType:'0',//生日类型 0：阳历 1：阴历
                			birthday:null, //生日
                			byInviteCode:"", //邀请码
                			byInviteName:"",//邀请我的会员的名字
                			nation:'0',	//民族
                			cardKind:'', //证件类型
                			certificateNo:"", //证件号码
                			workUnit:"",	//工作单位
                			job:"", //岗位
                			address:"",//地址
                			note:"" //备注
                		},
                		sellType:'2',//售卡类型  1：实体卡 2：电子卡
                		isRegistered:true,//是否注册的结果
                		isValidCode:false,//是否有效的验证码
                		isValidCardNo:true,//是否是有效的卡账号(电子卡无效)
                		isValidInvite:false,//是否是有效的邀请人
                    	displayValidateCode:false,//初始化是否显示验证码校验（默认不校验）
                    	displayCancelBind:false,//初始化是否取消绑定（默认不取消）
                    	invalidCardNoInfo:"",//初始化卡号无效的信息(电子卡无效)
                		sessionId:sessionId
                }
                
                
                
                /*通过卡类型获取卡的工本费以及推荐一个可售卡号*/
                $scope.getCardNoAndTypeInfo=function(cardInfo){
                	cardInfo.cardCharge=0;
                	cardInfo.cardNo = "";
                	if(cardInfo.cardType){
                		ajaxService.AjaxPost({cardType:cardInfo.cardType,sessionId:sessionId}, 'postrade/posCardUsed/getCardNoAndTypeInfo.do').then(function (result) {
                            if(result.status){
                            	cardInfo.cardCharge= result.cardCharge;
                            	cardInfo.cardNo = result.cardNo;
                            }
                        });
                	}
                }
                /*点击电子卡Tab获取卡号以及工本费*/
               $scope.changeElectronicTab = function(){
            	   $scope.getCardNoAndTypeInfo($scope.eleCardSell.cardInfo);
               }
               /*保存电子卡*/
               $scope.saveEelSellCard =function(){
            	   /*手机号验证*/
            	   	if(!$scope.eleCardSell.cardInfo.mobile || $scope.eleCardSell.cardInfo.mobile == ''){
            	   		modalService.info({title:'提示', content:'手机号码不允许为空!', size:'sm', type: 'confirm'});
               			return false;
            	   	}
	               	
               		if(!(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test($scope.eleCardSell.cardInfo.mobile))){
               			modalService.info({title:'提示', content:'请输入11位手机号!', size:'sm', type: 'confirm'});
               			return false;
               		}
               		if($scope.eleCardSell.isRegistered){
               			modalService.info({title:'提示', content:'该手机号已和其它会员卡绑定，无法办新卡！', size:'sm', type: 'confirm'});
               			return false;
               		}
               		
               		if(!$scope.eleCardSell.isValidCode){
               			modalService.info({title:'提示', content:'请输入验证码验证手机号！', size:'sm', type: 'confirm'});
               			return false;
               		}
               		
	               	/*卡号验证*/
	               	if(!$scope.eleCardSell.cardInfo.cardNo || $scope.eleCardSell.cardInfo.cardNo == ""){
	               		modalService.info({title:'提示', content:'不能获取卡号，请核实！', size:'sm', type: 'confirm'});
	           			return false;
	               	}
	               	
	               	/*密码校验*/
	               	if(!(/^\d{6}$/.test($scope.eleCardSell.cardInfo.password))){
	               		modalService.info({title:'提示', content:'请输入6位密码！', size:'sm', type: 'confirm'});
	           			return false;
	               	}
	               	if(!(/^\d{6}$/.test($scope.eleCardSell.cardInfo.repassword))){
	               		modalService.info({title:'提示', content:'请输入6位确认密码！', size:'sm', type: 'confirm'});
	           			return false;
	               	}
	               	
	               	if($scope.eleCardSell.cardInfo.repassword != $scope.eleCardSell.cardInfo.password ){
	               		modalService.info({title:'提示', content:'两次输入的密码不一致！', size:'sm', type: 'confirm'});
	           			return false;
	               	}
	               	if(!$scope.eleCardSell.memberInfo.birthday){
	               		modalService.info({title:'提示', content:'请选择生日！', size:'sm', type: 'confirm'});
	           			return false;
	               	}
	               	if($scope.eleCardSell.memberInfo.cardKind && $scope.eleCardSell.memberInfo.cardKind != '' &&
	            		(!$scope.eleCardSell.memberInfo.certificateNo ||$scope.eleCardSell.memberInfo.certificateNo =='')){
	            		modalService.info({title:'提示', content:'请填写证件编号！', size:'sm', type: 'confirm'});
	        			return false;
                	}
                	if($scope.eleCardSell.memberInfo.certificateNo && $scope.eleCardSell.memberInfo.certificateNo != '' &&
                		(!$scope.eleCardSell.memberInfo.cardKind ||$scope.eleCardSell.memberInfo.cardKind =='')){
                		modalService.info({title:'提示', content:'请选择证照类型！', size:'sm', type: 'confirm'});
            			return false;
                    }
	               	if($scope.eleCardSell.memberInfo.byInviteCode &&  $scope.eleCardSell.memberInfo.byInviteCode !=""
	               		&& !$scope.eleCardSell.isValidInvite){
	               		modalService.info({title:'提示', content:'请填写有效的邀请码！', size:'sm', type: 'confirm'});
	           			return false;
	               	}
	               	$scope.eleCardSell.memberInfo.birthday=new Date($scope.eleCardSell.memberInfo.birthday).getTime();
	               	//调用保存按钮 
	               	ajaxService.AjaxPost($scope.eleCardSell, 'postrade/posCardUsed/saveSellCard.do').then(function (result) {
	                       if(result.status){
	                       	modalService.info({content:'售卡成功！', type: 'ok'});
	                       	posService.goBack();
	                       }
	                   });
               }
            }];
});
