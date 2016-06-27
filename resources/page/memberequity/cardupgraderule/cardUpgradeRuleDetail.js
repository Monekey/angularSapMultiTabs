/**
 * 卡型升级规格详情页面js    
 * @version  		v1.0      
 * @createTime: 	2016-04-20        
 * @createAuthor 	Hyz             
 * @updateHistory  
 *                	2016-04-20  Hyz  卡型升级规格详情页面js
 * @note   
 * 					  
 */
define(function( require ){
	//引入angular
	var ngAMD = require( "ngAMD" );
	//注册control
	ngAMD.controller( "cardUpgradeRuleDetailCtrl",
			["$scope",
			 "$rootScope",
			 "ajaxService",
			 'register',
			 function( $scope,$rootScope,ajaxService, register ){

				 $scope.edit = register.getRoot('修改');
		//升级规格初始化数据模型
		$scope.card_upgrade_detaildata = {
				"sessionId":$rootScope.sessionId,
				"upgradeType":1,
				"upgradeStatus":0,
				"name":"",
				"initList":[
	         				{"value":0,"cardtype":0}
	                 		]

		};
		//获得父类页面的值
		var tagdata = $rootScope.TabsData;
		var data = angular.copy(tagdata);
//		alert($rootScope.TabsData.id);
		//赋值给本页面参数
		$scope.card_upgrade_detaildata =data;
		$scope.card_upgrade_detaildata.name = data.name;
		$scope.card_upgrade_detaildata.upgradeType=data.upgradeType;
		$scope.card_upgrade_detaildata.upgradeStatus=data.upgradeStatus;
		$scope.from = data.from;
		//获取操作规格内容    接口请求传入参数
        var searchkey={"id" : data.id,pageCount:1000,"sessionId":$rootScope.sessionId}
        //获取操作规格内容
		ajaxService.AjaxPost(searchkey,"memberequity/cardupgrade/cardUpgradeDetailById.do").then(
			function (result) {
				//将结果赋值给页面参数initList
				$scope.card_upgrade_detaildata.initList = result.pageInfo.list;
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
//					$scope.card_upgrade_detaildata.initList=
//					             	         				{"value":0,"cardtype":0}
//					            	                 		;
					$scope.card_upgrade_detaildata.initList=null;
				}
            }
		);
        //某个升级规格占用的卡型   和处于空闲状态的卡型  下拉数据
        //接口传入参数
        var comboSearchkey={"id" : data.id,"sessionId":$rootScope.sessionId,pageCount:1000}
        ajaxService.AjaxPost(comboSearchkey, 'memberequity/cardupgrade/cardTypeByIdCombo.do').then(function (result) {
        	//赋值
            $scope.comboList = result.pageInfo.list;
        });
        
        //+...一个规格内容
		$scope.add=function(type){
			if(type==0){
				$scope.Count++;
			}
			var addObj={"value":0};
			$scope.card_upgrade_detaildata.initList.push(addObj);
		};
		//-...一个规格内容
		$scope.reduce=function(index,type)
		{
			if(type==0){
				$scope.Count--;
			}
			$scope.card_upgrade_detaildata.initList.splice(index, 1);
		};
		
		 /* 返回操作 */
        $scope.cancel = function () {
            register.switchTab({id: $scope.from});
        };


				 /**
				  * 跳转到修改页面
				  * @param cardTypeDetail
				  */
				 $scope.gotoEdit = function(cardUpgrade){
					 console.log(cardUpgrade);
					 //cardTypeDetail.callback = function a(callback){};
					 //var cardType = {"id":cardTypeDetail.baseInfo.id};
					 var editTab ={
						 title:"升级规则修改",
						 id: "cardUpgradeRuleEditCtrl"+cardUpgrade.id,
						 from: $scope.from,
						 //control 名称
						 ctrlName:"cardUpgradeRuleEditCtrl",
						 //control
						 ctrl:"memberequity/cardupgraderule/cardUpgradeRuleEdit",
						 //html
						 template:"memberequity/cardupgraderule/cardUpgradeRuleEdit.html",
						 type: 'single',
						 ng_show:false};
					 register.addToTabs(editTab, cardUpgrade);
				 };

			 }]);
});
