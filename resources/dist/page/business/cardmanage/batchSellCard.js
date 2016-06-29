define(["require","ngAMD","angular"],function(require){var ngAMD=require("ngAMD"),angular=require("angular");ngAMD.controller("batchSellCardCtrl",["$scope","appConstant","ajaxService","register","modalService","bmOpenCardModel","$rootScope","$uibModalInstance",function($scope,appConstant,ajaxService,register,modalService,bmOpenCardModel,$rootScope,$uibModalInstance){function changeSellCount(){clearTimeout(timeoutTimer),lastDateTime=null,$scope.baseCardForSellVo.sellCount>0?getCardInfoForBatchSell({productionCardId:productionCardId,sellCount:$scope.baseCardForSellVo.sellCount,sessionId:$rootScope.sessionId}):$scope.baseCardForSellVo.sellCount=0}function getCardInfoForBatchSell(obj){ajaxService.AjaxPost(obj,"basecard/bmBasecard/getCardInfoForBatchSell.do").then(function(result){$scope.baseCardForSellVo.sellCount=result.sellCount,$scope.baseCardForSellVo.startNo=result.startNo,$scope.baseCardForSellVo.endNo=result.endNo})}var productionCardId=bmOpenCardModel.id;$scope.baseCardForSellVo={productionCardId:bmOpenCardModel.id,sellCount:0,startNo:"",endNo:"",saledShopId:"",saledShopName:"",cardCharge:0},getCardInfoForBatchSell({productionCardId:productionCardId,sessionId:$rootScope.sessionId}),ajaxService.AjaxPost({productionCardId:productionCardId,sessionId:$rootScope.sessionId},"basecard/bmBasecard/getCardCharge.do").then(function(result){$scope.baseCardForSellVo.cardCharge=result.cardCharge?result.cardCharge:0}),ajaxService.AjaxPost({sessionId:$rootScope.sessionId},"baseData/shopManager/getAllShopsForCompany.do").then(function(result){$scope.allShopList=result.data});var timeoutTimer=null,lastDateTime=null,timeGap=600;$scope.sellCountKeyUp=function(){$scope.baseCardForSellVo.sellCout||($scope.baseCardForSellVo.sellCout=0),$scope.baseCardForSellVo.startNo="",$scope.baseCardForSellVo.endNo="";var now=new Date;if(timeoutTimer!=null&&lastDateTime!=null){var secondDiff=now.getTime()-lastDateTime;secondDiff<timeGap&&(clearTimeout(timeoutTimer),timeoutTimer=setTimeout(changeSellCount,timeGap))}else lastDateTime==null&&(timeoutTimer=setTimeout(changeSellCount,timeGap));lastDateTime=now.getTime()},$scope.cancel=function(){$uibModalInstance.dismiss("cancel")},$scope.saveBatchSellCard=function(baseCardForSellVo){var saledShopName=$("#saledShopId").find("option:selected").text();baseCardForSellVo.saledShopName=saledShopName;if(baseCardForSellVo.sellCount<0)return modalService.info({title:"提示",content:"售卡张数必须大于零！",size:"sm",type:"confirm"}),!1;if(!baseCardForSellVo.startNo||baseCardForSellVo.startNo==""||!baseCardForSellVo.endNo||baseCardForSellVo.endNo=="")return modalService.info({title:"提示",content:"不能获取起始、截止卡号！",size:"sm",type:"confirm"}),!1;if(!baseCardForSellVo.saledShopId||baseCardForSellVo.saledShopId=="")return modalService.info({title:"提示",content:"请选择售卡门店！",size:"sm",type:"confirm"}),!1;baseCardForSellVo.sessionId=$rootScope.sessionId,ajaxService.AjaxPost(baseCardForSellVo,"basecard/bmBasecard/saveBatchSellCard.do").then(function(result){result.status==1&&modalService.info({content:"批量售卡成功!",type:"ok"}).then(function(){$uibModalInstance.close(result)})})}}])});