/**
 * 批量售卡操作
 * @version  v1.0
 * @createTime: 2016-05-09
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
/**
 * @param require
 */
define(function (require) {
	//加载模块
    var app = require("app");
    var angular = require("angular");
    //注册开卡模块controller
	app.ngAMDCtrlRegister.controller("batchSellCardCtrl", [
        "$scope",
        "appConstant",
        "ajaxService",
        "register",
        "modalService",
        "bmOpenCardModel",//加载开卡页面传送的开卡记录模型
        "$rootScope",//加载模块，顺序与function参数顺序一致
        "$uibModalInstance", 
        function ($scope, appConstant, ajaxService, register, modalService,bmOpenCardModel,$rootScope,$uibModalInstance) {
        	//获取开卡标识
        	var productionCardId = bmOpenCardModel.id;
        	//记录批售消息
        	$scope.baseCardForSellVo={
    			productionCardId:bmOpenCardModel.id,
    			sellCount:0,
            	startNo:'',
            	endNo:'',
            	saledShopId:'',
            	saledShopName:'',
            	cardCharge:0
        	};
        	
        	/*默认加载未售卡序列默认卡号从小到大排序*/
        	getCardInfoForBatchSell({productionCardId:productionCardId,sessionId: $rootScope.sessionId});
        	
        	/*查询开卡对应的卡类型的工本费*/
            ajaxService.AjaxPost({productionCardId:productionCardId,sessionId: $rootScope.sessionId}, 'basecard/bmBasecard/getCardCharge.do').then(function (result) {
            	$scope.baseCardForSellVo.cardCharge = result.cardCharge ? result.cardCharge : 0;
            });
        	
        	/*查询所有的门店,构建门店下拉框*/
            ajaxService.AjaxPost({sessionId: $rootScope.sessionId}, 'baseData/shopManager/getAllShopsForCompany.do').then(function (result) {
            	$scope.allShopList = result.data;
            });
        	
        	/*改变批量售卡数量时*/
        	var timeoutTimer=null;
        	var lastDateTime=null;
        	var timeGap=600;
        	$scope.sellCountKeyUp = function(){
        		if(!$scope.baseCardForSellVo.sellCout){
        			$scope.baseCardForSellVo.sellCout =0;
        		}
        		//初始化开始卡号、结束卡号
        		$scope.baseCardForSellVo.startNo = '';
           		$scope.baseCardForSellVo.endNo = '';
           		//开卡数量变化<600ms时，不触发查询事件
           		//=600ms时，触发查询事件
        		var now =new Date();
        		if(timeoutTimer != null && lastDateTime != null){
        			var secondDiff=now.getTime()-lastDateTime;
        			if(secondDiff <timeGap){
        				clearTimeout(timeoutTimer);
        				timeoutTimer = setTimeout(changeSellCount,timeGap);
        			}
        		}else if(lastDateTime == null){
        			timeoutTimer = setTimeout(changeSellCount,timeGap);
        		}
        		lastDateTime=now.getTime();
        	}
        	
        	/*售卡数量变化，并变化时间超过指定时间后触发的查询事件*/
        	function changeSellCount(){
        		//清除定时器，并清除上一次变化时间
        		clearTimeout(timeoutTimer);
        		lastDateTime=null;
        		if($scope.baseCardForSellVo.sellCount>0){
        			//调用ajax查询事件
        			getCardInfoForBatchSell({productionCardId:productionCardId,sellCount:$scope.baseCardForSellVo.sellCount,sessionId: $rootScope.sessionId});
        		}else{
    				$scope.baseCardForSellVo.sellCount =0;
        		}
        	}
        	
        	//获取未售卡序列默认卡号从小到大排序
           function getCardInfoForBatchSell(obj){
        	   ajaxService.AjaxPost(obj,'basecard/bmBasecard/getCardInfoForBatchSell.do').then(function (result) {
               	//调用成功的回调方法
           		$scope.baseCardForSellVo.sellCount = result.sellCount;
           		$scope.baseCardForSellVo.startNo = result.startNo;
           		$scope.baseCardForSellVo.endNo = result.endNo;
               }); 
        	   
           }
           
           /**
            * 取消操作，关闭模态框
            */
           $scope.cancel=function(){
        	   $uibModalInstance.dismiss('cancel');
           }
           /*保存批售*/
           $scope.saveBatchSellCard =function(baseCardForSellVo){
        	   //售卡门店名称
        	   var saledShopName = $("#saledShopId").find("option:selected").text();
        	   baseCardForSellVo.saledShopName=saledShopName;
        	   if(baseCardForSellVo.sellCount <0){
	    		   modalService.info({title:'提示', content:'售卡张数必须大于零！', size:'sm', type: 'confirm'});
	       		   return false;
        	   }
        	   if(!baseCardForSellVo.startNo ||baseCardForSellVo.startNo == '' || !baseCardForSellVo.endNo || baseCardForSellVo.endNo == ''){
        		   modalService.info({title:'提示', content:'不能获取起始、截止卡号！', size:'sm', type: 'confirm'});
	       		   return false;
        	   }
        	   if(!baseCardForSellVo.saledShopId ||baseCardForSellVo.saledShopId == ''){
        		   modalService.info({title:'提示', content:'请选择售卡门店！', size:'sm', type: 'confirm'});
	       		   return false;
        	   }
        	   baseCardForSellVo.sessionId=$rootScope.sessionId;
        	   ajaxService.AjaxPost(baseCardForSellVo,'basecard/bmBasecard/saveBatchSellCard.do').then(function (result) {
                  	//调用成功的回调方法
        		   if(result.status == 1){
        			   $uibModalInstance.close(result);
        		   }
              }); 
           }
        }]);
});