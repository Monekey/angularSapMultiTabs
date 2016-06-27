/**
 * 修改卡型升级规格页面js    
 * @version  		v1.0      
 * @createTime: 	2016-04-20        
 * @createAuthor 	Hyz             
 * @updateHistory  
 *                	2016-04-20  Hyz  修改卡型升级规格页面js
 * @note   
 * 					  
 */
define(function( require ){
	//引入angular
	var ngAMD = require( "ngAMD" );
	var angular = require("angular");
	//注册control
	ngAMD.controller( "cardUpgradeRuleEditCtrl",
			["$scope",
			 "$rootScope",
			 "ajaxService",
			 'register',
			 "modalService",
			 function( $scope,$rootScope,ajaxService, register,modalService ){
		//升级规格初始化数据模型
		$scope.card_upgrade_editdata = {
				"sessionId":$rootScope.sessionId,
				"upgradeType":1,
				"upgradeStatus":0,
				"name":"",
				"initList":[
	         				{"value":0,"cardtype":0}
	                 		]

		};
		//获得父类页面的值
		var tabdata = $rootScope.TabsData;
		var data = angular.copy(tabdata);
//		alert($rootScope.TabsData.id);
		$scope.card_upgrade_editdata =data;
		$scope.card_upgrade_editdata.name = data.name;
		$scope.card_upgrade_editdata.upgradeType=data.upgradeType;
		$scope.card_upgrade_editdata.upgradeStatus=data.upgradeStatus;
		$scope.from = data.from;
		//获取操作规格内容    接口请求传入参数
        var searchkey={sessionId: $rootScope.sessionId,"id" : data.id,pageCount:1000}
        ////获取操作规格内容    
		ajaxService.AjaxPost(searchkey,"memberequity/cardupgrade/cardUpgradeDetailById.do").then(
			function (result) {
				//将结果赋值给页面参数initList
				$scope.card_upgrade_editdata.initList = result.pageInfo.list;
				//规格列表不为空
				if(result.pageInfo.size>0)
				{
					//设置count参数为规格列表参数size        count用于控制+-显示
					$scope.Count=result.pageInfo.size;
				}
				//规格列表为空的时候     初始化为card_upgrade_detaildata加一条数据
				else
				{
					//设置count 为1
					$scope.Count=1;
					var addObj={"value":0};
					$scope.card_upgrade_editdata.initList.push(addObj);
				}
            }
		);
        //某个升级规格占用的卡型   和处于空闲状态的卡型  下拉数据
        //接口传入参数
        var comboSearchkey={"id" : data.id,sessionId: $rootScope.sessionId,pageCount:1000}
        ajaxService.AjaxPost(comboSearchkey, 'memberequity/cardupgrade/cardTypeByIdCombo.do').then(function (result) {
            $scope.comboList = result.pageInfo.list;
        });
        
        //+...一个规格内容
		$scope.add=function(type){
			if(type==0){
				$scope.Count++;
			}
			var addObj={"value":"","upCardTypeId":""};
			$scope.card_upgrade_editdata.initList.push(addObj);
		};
		//-...一个规格内容
		$scope.reduce=function(index,type)
		{
			if(type==0){
				$scope.Count--;
			}
			$scope.card_upgrade_editdata.initList.splice(index, 1);
		};
		//底端更新   提交按钮
		$scope.confirmIn = function(){
			$scope.card_upgrade_editdata.sessionId = $rootScope.sessionId;
	        //提交修改内容
			ajaxService.AjaxPost( $scope.card_upgrade_editdata,"memberequity/cardupgrade/update.do").then(
				function (result) {
					//1：提示成功    0：提示失败原因
					if(result.status==1)
					{
						modalService.info({content:'修改成功!', type: 'ok'}).then(function(obj){
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
		};
		//底端确认  取消按钮
		$scope.cancelIn = function(){
			register.switchTab({id: $scope.from});
		}
		
		//初始化----检测规格列表value是否是升序=false       false不显示错误信息    true显示错误信息
		$scope.checkTag = false;
		//检测----设置卡型升级规则金额校验标签，金额要大于当前已设置金额
		$scope.checkThisValue = function(index,value){
			//初始化
			$scope.checkTag = false;
			//当前位置有上一个对象        拿到上一个对象的值标记为最小
			if($scope.card_upgrade_editdata.initList[index-1]){
			var	min = parseFloat($scope.card_upgrade_editdata.initList[index-1].value)+1;
			}
			//当前位置有下一个对象        拿到下一个对象的值标记为最大
			if($scope.card_upgrade_editdata.initList[index+1]){
				var max = parseFloat($scope.card_upgrade_editdata.initList[index+1].value)-1;
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
			var rule = angular.copy($scope.card_upgrade_editdata.initList);
			rule.splice(index,1);
			//循环遍历集合对象
			for(var i=0;i<rule.length;i++){
				//存在一样的    卡型规格标记为true    显示错误信息
				if(one.upCardTypeId === rule[i].upCardTypeId){
					$scope.checkSelect = true;
				}
			}
		};
	}]);
});
