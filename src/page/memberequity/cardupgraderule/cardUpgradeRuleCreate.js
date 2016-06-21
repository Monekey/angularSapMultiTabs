/**
 * 创建卡型升级规格页面js    
 * @version  		v1.0      
 * @createTime: 	2016-04-20        
 * @createAuthor 	Hyz             
 * @updateHistory  
 *                	2016-04-20  Hyz  创建卡型升级规格页面js
 * @note   
 * 					  
 */
define(function( require ){
	//引入angular
	var app = require( "app" );
	//注册control
	var angular = require("angular");
	app.ngAMDCtrlRegister.controller( "cardUpgradeRuleCreateCtrl",
			["$scope","$rootScope","ajaxService","getCookieService",'register',"modalService",
			 function( $scope,$rootScope,ajaxService,getCookieService,register,modalService ){
		//拿父页面数据
		var tabData = $rootScope.TabsData;
		 //为避免修改父页面数据，复制数据
        var data = angular.copy(tabData);
		//页面来源  用于跳转会父页
		$scope.from = data.from;
		 //升级规格初始化默认数据
		$scope.card_upgrade_data = {
				"sessionId":$rootScope.sessionId,
				"upgradeType":1,
				"upgradeStatus":1,
				"name":"",
				"initList":[
	         				{"value":"","upCardTypeId":""}
	                 		]

			};
		$scope.card_upgrade_data.sessionId = $rootScope.sessionId;
		//提交按钮
		$scope.confirmIn = function(){
			$scope.disabledBtn = true;
	        //ajax请求创建新的卡型升级规格接口
			ajaxService.AjaxPost( $scope.card_upgrade_data,"memberequity/cardupgrade/create.do").then(
				function (result) {
					//1：提示成功    0：提示失败原因
					if(result.status==1)
					{
						modalService.info({content:'新建成功!', type: 'ok'}).then(function(obj){
							if(obj.status == 'ok'){
								$rootScope.TabsData.callback();
								register.switchTab({id: $scope.from});
							}
						},function(obj){
								$rootScope.TabsData.callback();
								register.switchTab({id: $scope.from});
						});
					}

                }

			);
			$scope.disabledBtn = false;
		};
		//查询未被占用的卡型规格combo   下拉数据
        ajaxService.AjaxPost({sessionId: $rootScope.sessionId,pageCount:1000}, 'memberequity/cardupgrade/cardTypeCombo.do').then(function (result) {
            $scope.comboList = result.pageInfo.list;
        });
		//初始化----检测规格列表value是否是升序=false       false不显示错误信息    true显示错误信息
		$scope.checkTag = false;
		//设置卡型升级规则金额校验标签，金额要大于当前已设置金额
		$scope.checkThisValue = function(index,value){
			//初始化
			$scope.checkTag = false;
			//当前位置有上一个对象        拿到上一个对象的值标记为最小
			if($scope.card_upgrade_data.initList[index-1]){
			var	min = parseFloat($scope.card_upgrade_data.initList[index-1].value)+1;
			}
			//当前位置有下一个对象        拿到下一个对象的值标记为最大
			if($scope.card_upgrade_data.initList[index+1]){
				var max = parseFloat($scope.card_upgrade_data.initList[index+1].value)-1;
			}
			//有上   没下        为最后一个    value不得小于最小值
			if(min && !max){
				if(value<min){
					$scope.checkTag = true;
				}
			}
			//有上   有下        为中间    value不得大于最大值  && 不得小于最小值
			if(min && max){
				if(value<min || value>max){
					$scope.checkTag = true;
				}
			}
			//没上   有下   说明是第一个元素    value不得大于最大值
			if(!min && max){
				if(value>max){
					$scope.checkTag = true;
				}
			}
		};
		//设置卡型升级规则卡型校验标签，已选卡型不可重复选中
		//初始化  标示为false
		$scope.checkSelect = false;
		//验证函数
		$scope.checkIsSelected = function(index, one){
			//初始化
			$scope.checkSelect = false;
			//拿到当前页的规格列表集合
			var rule = angular.copy($scope.card_upgrade_data.initList);
			rule.splice(index,1);
			//循环遍历集合对象
			for(var i=0;i<rule.length;i++){
				if(one.upCardTypeId === rule[i].upCardTypeId){
					//存在一样的    卡型规格标记为true    显示错误信息
					$scope.checkSelect = true;
				}
			}
		};
        //+...一个规格内容
		$scope.Count=1;
		$scope.add=function(type){
			if(type==0){
				$scope.Count++;
			}
			var addObj={"value":"","upCardTypeId":""};
			$scope.card_upgrade_data.initList.push(addObj);
		};
		//-...一个规格内容
		$scope.reduce=function(index,type)
		{
			if(type==0){
				$scope.Count--;
			}
			$scope.card_upgrade_data.initList.splice(index, 1);
		};
		//底端确认  取消
		$scope.cancelIn = function(){
			register.switchTab({id: $scope.from});
		}
		
		
	}]);
});