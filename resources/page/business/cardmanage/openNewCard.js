/**
 * 开卡操作页
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
/**
 * @param require
 */
define(function (require) {
	//加载模块
    var ngAMD = require("ngAMD");
    var angular = require("angular");
    //注册开卡模块controller
	ngAMD.controller("openNewCardCtrl", [
        "$scope",
        "appConstant",
        "ajaxService",
        "register",
        "modalService",
        "$rootScope",//加载模块，顺序与function参数顺序一致
        function ($scope, appConstant, ajaxService, register, modalService,$rootScope) {
        	//获取父页面操作记录的数据
            var tabData = $rootScope.TabsData;
            //为避免修改父页面数据，复制数据
            var data = angular.copy(tabData);
            //获取当前Tab页面的父Tab页面归属，后边使用定位
            $scope.from = data.from;
            $scope.changPage = data;
            //保存按钮是否禁用；默认不禁用
    		$scope.forbideSave = false;
            //起始卡号前缀数字
            $scope.preNumList=[1,2,3,4,5,6,7,8,9];
           //初始化新卡对象
            $scope.newCard={
            				prefixInitNum:'1',//起始卡号前缀数字
        					initNum:null,//开始卡号
            				openCount:null,//开发数量
            				isShield:0,//是否屏蔽数字
            				shieldTailCount:null,//屏蔽卡号末几位
            				shieldTailNums:null,//屏蔽数字
            				endNum:null,//截止卡号
            				shopId:null,//门店id
            				cardTypeId:null,//卡类型
            				validateType:'1',//有效期类型,默认永久有效
            				validateBeginTime:null,//有效开始时间
            				validateEndTime:null,//有效截止时间
            				relativeDays:null//相对有效天数
            				};
            
            /*查询所有的门店,构建门店下拉框*/
            ajaxService.AjaxPost({sessionId: $rootScope.sessionId}, 'baseData/shopManager/getAllShopsForCompany.do').then(function (result) {
            	$scope.allShopList = result.data;
            });
            
            /*查询所有的卡类型所有可用卡类型，构建卡类型下拉框*/
        	ajaxService.AjaxPost({sessionId: $rootScope.sessionId}, 'memberequity/cardtype/getCardTypeCombo.do').then(function (result) {
        		$scope.allCardTypeList = result.data;
            });
        	/*验证起始卡号结构是否是手机号*/
        	$scope.checkInitNum=function(newCard){
        		if(!/^\d{4,15}$/.test(newCard.initNum)){
        			modalService.info({title:'提示', content:'请输入4到15位数字作为起始卡号！', size:'sm', type: 'confirm'})
        		}
        		if(newCard.prefixInitNum == '1' && /^\d{10}$/.test(newCard.initNum)){
        			modalService.info({title:'提示', content:'该卡号段可能与手机号冲突，请重新选择！', size:'sm', type: 'confirm'});
        		}
        	}
        	/*产生截止卡尾号*/
        	$scope.generateEndNum = function(){
        		$scope.newCard.endNum =null;
        		$scope.suffixCardNoList =[];
        		if(!$scope.newCard.prefixInitNum || $scope.newCard.prefixInitNum == ''){
        			modalService.info({title:'提示', content:'起始卡号前缀不能为空！', size:'sm', type: 'confirm'});
        			return false;
        		}
        		if(!/^[0-9]{4,15}$/.test($scope.newCard.initNum)){
        			modalService.info({title:'提示', content:'起始卡号不合法！', size:'sm', type: 'confirm'});
        			return false;
        		}
        		if($scope.newCard.openCount == null || $scope.newCard.openCount <1){
        			modalService.info({title:'提示', content:'张数必须大于零！', size:'sm', type: 'confirm'});
        			return false;
        		}
        		if($scope.newCard.shieldTailCount !=null && $scope.newCard.shieldTailCount <0){
        			modalService.info({title:'提示', content:'屏蔽卡号末几位不能为负数！', size:'sm', type: 'confirm'});
        			return false;
        		}
        		ajaxService.AjaxPost({sessionId: $rootScope.sessionId,bmOpenCardBean:$scope.newCard}, 'opencardmanage/bmOpenCard/generateCardsNos.do').then(function (result) {
        			var status =result.status;
        			if(status == 0){
        				//var errMessage =result.errMessage;
        				//var resbmOpenCardBean = result.bmOpenCardBean;
        				//$scope.newCard.openCount =resbmOpenCardBean.openCount;
        				//ajax服务已经对status==0的情况做了处理，若存在errMessage则自动弹出，不需要手动唤起提示框
        				//modalService.info({title:'提示', content:errMessage, size:'sm', type: 'confirm'});
        				return false;
        			}else{
        				var resbmOpenCardBean = result.bmOpenCardBean;
        				//回显起始卡号、结束卡号
                		$scope.newCard.initNum = resbmOpenCardBean.initNum;
                		$scope.newCard.endNum = resbmOpenCardBean.endNum;
                		//存储卡号集合
                		$scope.suffixCardNoList= result.suffixCardNoList;
                		//存储产生截止卡号的条件，用于比较
                		var hadGenerateCondtion ={};
                		hadGenerateCondtion.prefixNum =resbmOpenCardBean.prefixNum;
                		hadGenerateCondtion.initNum =resbmOpenCardBean.initNum;
                		hadGenerateCondtion.endNum =resbmOpenCardBean.endNum;
                		hadGenerateCondtion.openCount=resbmOpenCardBean.openCount;
                		hadGenerateCondtion.isShield =resbmOpenCardBean.isShield;
                		hadGenerateCondtion.shieldTailCount=resbmOpenCardBean.shieldTailCount;
                		hadGenerateCondtion.shieldTailNums=resbmOpenCardBean.shieldTailNums;
                		$scope.hadGenerateCondtion= hadGenerateCondtion;
        			}
                });
        	}
            
        	
        	/*判断生一次生成卡号的条件是否发生变化*/
        	function isChangeGenerateCondition(){
        		var isChange=false;
        		if($scope.hadGenerateCondtion.prefixNum != $scope.newCard.prefixNum ||
        				$scope.hadGenerateCondtion.initNum != $scope.newCard.initNum ||
        				$scope.hadGenerateCondtion.endNum != $scope.newCard.endNum ||
        				$scope.hadGenerateCondtion.openCount != $scope.newCard.openCount ||
        				$scope.hadGenerateCondtion.isShield != $scope.newCard.isShield ||
        				$scope.hadGenerateCondtion.shieldTailCount != $scope.newCard.shieldTailCount ||
        				$scope.hadGenerateCondtion.shieldTailNums != $scope.newCard.shieldTailNums){
        				isChange =true;
        		}
        		return isChange;
        	}
        	/* 保存操作 */
        	$scope.saveNewCard=function(newCard){
        		$scope.forbideSave = true;
        		//1.判断是否获取过卡号
        		if($scope.hadGenerateCondtion == null){
        			modalService.info({title:'提示', content:'未生成卡号！', size:'sm', type: 'confirm'});
        			$scope.forbideSave=false;
        			return false;;
        		}
        		//2.判断保存的时，获取卡号的条件是否发生变化，若变化需要重新生成
        		if(isChangeGenerateCondition()){
        			modalService.info({title:'提示', content:'获取卡号条件发生变化，需要重新获取！', size:'sm', type: 'confirm'});
        			$scope.forbideSave=false;
        			return false;
        		}
        		//3.判断卡号集合
        		if($scope.suffixCardNoList == null || $scope.suffixCardNoList.length <1){
        			modalService.info({title:'提示', content:'未能正确获取卡号！', size:'sm', type: 'confirm'});
        			$scope.forbideSave=false;
        			return false;
        		}
        		//4.判断有效期类型
        		if(newCard.validateType == '2'){
        			//固定有效期时，判断是否存在时间间隔，并判断签收时间是否合理
        			
        			if(newCard.validateBeginTime == null && newCard.validateEndTime == null){
        				modalService.info({title:'提示', content:'有效开始、结束时间不能为空！', size:'sm', type: 'confirm'});
        				$scope.forbideSave=false;
        				return false;
        			}
        			if(newCard.validateBeginTime > newCard.validateEndTime){
        				modalService.info({title:'提示', content:'开始时间不能大于结束时间！', size:'sm', type: 'confirm'});
        				$scope.forbideSave=false;
        				return false;
        			}
        		}else if(newCard.validateType == '3'){
        			//相对有效期时，相对有效天数是否合理
        			if(newCard.relativeDays == null || newCard.relativeDays < 1){
        				modalService.info({title:'提示', content:'相对有效期必须大于0！', size:'sm', type: 'confirm'});
        				$scope.forbideSave=false;
        				return false;
        			}
        		}
        		if(newCard.validateBeginTime){
        			newCard.validateBeginTime = new Date(newCard.validateBeginTime).getTime();
        		}
        		if(newCard.validateEndTime){
        			newCard.validateEndTime = new Date(newCard.validateEndTime).getTime();
        		}
        		//5.保存生成卡号
        		//5.1声明参数
        		var params={};
        		params.bmOpenCardBean = newCard;
        		params.suffixCardNoList = $scope.suffixCardNoList;
        		params.sessionId = $rootScope.sessionId;
        		//5.2调用保存方法，监听返回结果
        		ajaxService.AjaxPost(params, 'opencardmanage/bmOpenCard/saveOpenCards.do').then(function (result) {
        			$scope.forbideSave=false;
        			var status =result.status;
        			if(status){
        				modalService.info({title:'提示', content:'开卡成功！', size:'sm', type: 'ok'});
        				$scope.changPage.callback();
        				register.switchTab({id: $scope.from});
        			}
        		},function(data){
        			$scope.forbideSave=false;
        		});
        		
        	}
        	/*新建卡型*/
        	$scope.doCreateCardType=function(){
        		/*member.callback = function a(callback) {
                    callback();
                };*/
                register.addToTabs({
                	title:"新建卡型规则",
                    id:"cardTypeCreate",
                    ctrlName:"cardTypeCreate",
                    ctrl: 'memberequity/cardtype/cardTypeCreate',
                    template:"memberequity/cardtype/cardTypeCreate.html",
                    from: 10023,
                    type: 'multiple',
                    ng_show:false
                }, {}); //member传递参数，将对象传递到Tab页面
        	}
        	
        	/*取消保存操作*/
            $scope.cancel = function () {
                register.switchTab({id: $scope.from});
            }
            /*
             *控制有效期类型切换的方法 
             */
            $scope.hideBetweenTime=true;//默认隐藏时间段显示
            $scope.hideRelatvieDays=true;//默认隐藏相对有效天数显示
            $scope.changeValidateType = function(validateType){
            	if(validateType =='1'){
            		 $scope.hideBetweenTime=true;
                     $scope.hideRelatvieDays=true;
                     $scope.newCard.validateBeginTime=null;
                     $scope.newCard.validateEndTime=null;
                     $scope.newCard.relativeDays=null;
            	}else if(validateType =='2'){
            		$scope.hideBetweenTime=false;
                    $scope.hideRelatvieDays=true;
                    $scope.newCard.relativeDays=null;
            	}else if(validateType =='3'){
            		$scope.hideBetweenTime=true;
                    $scope.hideRelatvieDays=false;
                    $scope.newCard.validateBeginTime=null;
                    $scope.newCard.validateEndTime=null;
            	}
            }
        }]);
});