/**
 * 左侧会员及卡信息
 * @version  v1.0
 * @createTime: 2016/5/16 
 * @createAuthor hyz
 * @updateHistory
 *                2016/5/16  hyz create 
 */
define(['angular'], function (angular) {
	angular.element( document. getElementsByTagName("body")[0] ).css("background","#dee6f2");
	return ["$scope","ajaxService","getCookieService","$rootScope","modalService",'appConstant','$uibModal',"register",
	        function ($scope,ajaxService,getCookieService,$rootScope,modalService, appConstant,$uibModal,register) {
		var sessionId = getCookieService.getCookie("CRMSESSIONID");
		//搜索参数模型
    	$scope.searchdata = {
    			"paramValue":"",
    			"sessionId":""
    				};
    	//编辑卡参数模型
    	$scope.editcard = {
    			"cardTypeId":"",
    			"validateBeginTime":"",
    			"validateEndTime":""
    				};
    	//退卡参数模型
    	$scope.annulcard = {
    			"cardnumber":"",
    			"capitalamount":"",
    			"presentedamount":"",
    			"annulamount":"",
    			"sessionId":"",
    			"cardstatus":""
    				};
    	
    	//按钮权限
    	$scope.editUserBtn = false;
    	$scope.editCardBtn = false;
    	$scope.annulCardBtn = false;
    	if($rootScope.posbuttens){
    		$rootScope.posbuttens.forEach(function (btn) {
                 if (btn.code==10100) {
                	 $scope.editUserBtn = true;
                 }
                 if (btn.code==10101) {
                	 $scope.editCardBtn = true;
                 }
                 if (btn.code==10102) {
                	 $scope.annulCardBtn = true;
                 }
             });
    	}
    	
    	$scope.editcarddiv = false;
    	//检测是否是从selectedpos过来的search操作
    	var searchuserresult = $rootScope.searchuserresult;
    	if(searchuserresult!=null)
    	{
    		//复制数据
    		var data = angular.copy(searchuserresult);
    		//清空
    		$rootScope.searchuserresult = null;
    		$scope.memberhomeinfo=data;
    		//赋值   为编辑页面传值
        	$rootScope.cardoperatetoeditusrmemberinfo = $scope.memberhomeinfo.memberInfoBean;
        	//定义全局当前user信息
        	$rootScope.currentuserinfo = $scope.memberhomeinfo;
    	}
    	//获取搜索参数     搜索条件部位空的时候查询
    	var searchparam = angular.copy($rootScope.paramValue);
    	if(searchparam)
    	{
    		//复制
        	$scope.searchdata.paramValue=searchparam;
        	//清空
        	$rootScope.paramValue="";
    		$scope.searchdata.sessionId=$rootScope.sessionId;
    		//接口请求详情消费内容 
        	ajaxService.AjaxPost( $scope.searchdata,"postrade/memberhome/memberhomeinfo.do").then(
    			function (result) {
    				if(result.data!==null)
    				{
    		    		var data = angular.copy(result.data);
//    		    		alert(data);
    		    		$scope.memberhomeinfo=data;
    		    		//赋值   为编辑页面传值
    		        	$rootScope.cardoperatetoeditusrmemberinfo = $scope.memberhomeinfo.memberInfoBean;
    		        	//定义全局当前user信息
    		        	$rootScope.currentuserinfo = $scope.memberhomeinfo;
    				}
    				else
    				{
    					//赋值   为编辑页面传值
    		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
    		        	//定义全局当前user信息
    		        	$rootScope.currentuserinfo = null;
    				}
                }
    		);
    	}


		$scope.getNation = function(type){
			if(type){
				return appConstant.nationList[type].name;
			}
		};
		/**
		 * 更改卡资料模态封装
		 */
		 $scope.editcard = function()
		 {
			 var html = ['    <div class="card-update-modal">',
			             '        <div class="modal-header">',
			             '            卡修改',
			             '            <i class="iconfont" class="modal-close-icon" style="margin: 0px;font-size: 8px" ng-click="canceleditcard()">&#xe63c;</i>',
			             '        </div>',
			             '        <div class="modal-body ">',
			             '            <form class="form-horizontal" style="font-size: 14px;" autocomplete="off">',
			             '                <div class="form-group">',
			             '                    <label>卡类型：</label>',
			             '                    <div class="select-input-div">',
			             '                        <select class="form-control" name="editcardtype" id="editcardtype"',
			             '                                ng-selected="editcard.cardTypeId == selectcardtype.id"',
			             '                                ng-options="selectcardtype.id as selectcardtype.name for selectcardtype in editcardcomboList"',
			             '                                ng-model="editcard.cardTypeId" style="width:160px;">',
			             '                        </select>',
			             '                    </div>',
			             '                </div>',
			             '                <div class="form-group" ng-if="memberhomeinfo.cardInfoBean.validateType!==1">',
			             '                    <label style="">有效期：</label>',
			             '                    <div class="select-input-div" style="margin-bottom: -14px" >',
			             '                        <period start-time="editcard.validateBeginTimestr"',
			             '                                end-time="editcard.validateEndTimestr"></period>',
			             '                    </div>',
			             '                </div>',
			             '                <div class="modal-footer">',
			             '                    <button type="submit" class="btn btn-default main-all-btn-b" ng-click="confirmIneditcard()">',
			             '                        确定',
			             '                    </button>',
			             '                    <button type="button" class="btn btn-default main-all-btn-w" ng-click="canceleditcard()">',
			             '                        取消',
			             '                    </button>',
			             '                </div>',
			             '            </form>',
			             '        </div>',
			             '    </div>'].join("");
			 var modalInstance = $uibModal.open({
                 animation: true,
                 template:html,
                 size: "editCard",
                 resolve: {},
                 controller:
                 	['$scope','$rootScope','$uibModalInstance',"modalService",
                 	 function($scope,$rootScope,$uibModalInstance,modalService){
                 		//编辑卡信息按钮事件
                		if($rootScope.currentuserinfo)
                    	{
                			$scope.memberhomeinfo = angular.copy($rootScope.currentuserinfo);
                    		$scope.editcard = angular.copy($scope.memberhomeinfo.cardInfoBean);
                    		$scope.editcard.validateBeginTimestr = $scope.editcard.validateBeginTime;
                    		$scope.editcard.validateEndTimestr = $scope.editcard.validateEndTime;
							console.log($scope.editcard.validateBeginTimestr);
							console.log($scope.editcard.validateEndTimestr);
                    		$scope.editcard.cardTypeId = $scope.editcard.cardTypeId+"";
                    		//查询下拉列表卡型规格combo   下拉数据
                            ajaxService.AjaxPost({sessionId: $rootScope.sessionId,pageCount:1000}, 
                            		'postrade/memberhome/allCardTypeCombo.do').then(function (result) {
                                $scope.editcardcomboList = result.data;
                            });
                    	}
                    	 //确定修改卡信息
                        $scope.confirmIneditcard = function () {
                        	var oldeditcard = angular.copy($scope.memberhomeinfo.cardInfoBean);
                        	/*
                        	 * 更新卡型
                        	 */
                        	var newcardtype=$('select[id="editcardtype"]').find("option:selected").text();
                        	if($scope.editcard&&$scope.editcard.cardTypeId!=oldeditcard.cardTypeId)
                        	{
                                ajaxService.AjaxPost({"sessionId": $rootScope.sessionId,
                                	"memberHomeBean":$scope.memberhomeinfo,
                                	"newCardTypeId":$scope.editcard.cardTypeId,
                                	"oldCardTypeId":oldeditcard.cardTypeId}, 
                                		'postrade/card/modifyCardType.do').then(function (result) {
                                			if(result.status===1)
                        					{
                                				//赋值给上一层
                                				$rootScope.currentuserinfo.cardInfoBean.cardTypeId=$scope.editcard.cardTypeId;
                                				$rootScope.currentuserinfo.cardInfoBean.cardType=newcardtype;
                        					}
                                });
                        	}
                        	/*
                        	 * 更新卡型有效期
                        	 */
                        	//原有效期
                        	var oldvalidateBeginTimestr = new Date(oldeditcard.validateBeginTime).getTime();
                        	var oldvalidateEndTimestr = new Date(oldeditcard.validateEndTime).getTime();
                        	//当前有效期
                        	var currvalidateBeginTimestr = new Date($scope.editcard.validateBeginTimestr).getTime();
                        	var currvalidateEndTimestr = new Date($scope.editcard.validateEndTimestr).getTime();
                        	if(oldvalidateBeginTimestr!=currvalidateBeginTimestr
                        			 ||oldvalidateEndTimestr!=currvalidateEndTimestr)
                        	{
                        		 ajaxService.AjaxPost({"sessionId": $rootScope.sessionId,
                                 	"memberHomeBean":$scope.memberhomeinfo,
                                 	"newValidateEndTime":currvalidateEndTimestr,
                                 	"newValidateBeginTime":currvalidateBeginTimestr,
                                 	"oldValidateBeginTime":oldvalidateBeginTimestr,
                                 	"oldValidateEndTime":oldvalidateEndTimestr}, 
                                 		'postrade/card/modifyCardValiDate.do').then(function (result) {
                                 			if(result.status===1)
                         					{
                                 				//赋值给上一层
                                 				$rootScope.currentuserinfo=result.data;
                         					}
                                 });
                        	}
                        	$uibModalInstance.dismiss('cancel');
                        	modalService.info({content:'修改成功!', type: 'ok'});
                        };
                        /*取消操作 */
                        $scope.canceleditcard = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                 	}]
             });
		 }
		
		
		 /**
		  * 退卡模态封装
		  */
		 $scope.annulCard = function()
		 {

			 var html = ['<div class="card-update-modal">',
			             '        <div class="modal-header">',
			             '            退卡',
			             '            <i class="iconfont" class="modal-close-icon" ng-click="cancelannulcard()">&#xe63c;</i>',
			             '        </div>',
			             '        <div class="modal-body">',
			             '            <form class="form-horizontal" style="font-size:16px;margin-top: 20px;" autocomplete="off">',
			             '           <div class="form-group" style="margin-left: 15px;">',
			             '                <span>卡号：</span>',
			             '                <span ng-bind="annulcard.cardnumber"></span>',
			             '            </div>',
			             '           <div class="form-group" style="margin-left: 15px;">',
			             '                <span>剩余本金(元)：</span>',
			             '                <span ng-bind="annulcard.capitalamount"></span>',
			             '            </div>',
			             '           <div class="form-group" style="margin-left: 15px;">',
			             '                <span>剩余赠送金额(元)：</span>',
			             '                <span ng-bind="annulcard.presentedamount"></span>',
			             '            </div>',
			             '            <div class="form-group" style="margin-left: 15px;">',
			             '                <span>退卡金额(元)：</span>',
			             '                <span ng-bind="annulcard.annulamount" style="color:#4ec261;"></span>',
			             '            </div>',
			             '            <div class="modal-footer">',
			             '                <button type="submit" class="btn btn-default main-all-btn-b" ng-click="confirmannulcard()">',
			             '                    确定',
			             '                </button>',
			             '                <button type="button" class="btn btn-default main-all-btn-w" ng-click="cancelannulcard()">',
			             '                    取消',
			             '                </button>',
			             '            </div>',
			             '            </form>',
			             '        </div>',
			             '    </div>'].join("");
			 var modalInstance = $uibModal.open({
                 animation: true,
                 template:html,
                 size: "sm",
                 resolve: {},
                 controller:
                 	['$scope','$rootScope','$uibModalInstance','$state',"ajaxService","modalService",
                 	 function($scope,$rootScope,$uibModalInstance,$state,ajaxService,modalService){
                 		//退卡参数模型
                    	$scope.annulcard = {
                    			"cardnumber":"",
                    			"capitalamount":"",
                    			"presentedamount":"",
                    			"annulamount":"",
                    			"sessionId":"",
                    			"cardstatus":"",
                    			"saving":""
                    				};
                 		 //退卡按钮事件
                    	$scope.memberhomeinfo = angular.copy($rootScope.currentuserinfo);
                		$scope.annulcard.cardnumber = $scope.memberhomeinfo.cardInfoBean.number;//getAnnulCardAmount
                		ajaxService.AjaxPost({"cardNumber":$scope.annulcard.cardnumber,
                			"sessionId": sessionId}, 
                         		'postrade/card/getAnnulCardAmount.do').then(function (result) {
                         			if(result.data!==null&&result.status===1)
                 					{
                         				$scope.annulcard.capitalamount=result.data.capitalAmount;
                         				$scope.annulcard.presentedamount=result.data.presentedAmount;
                         				$scope.annulcard.annulamount=result.data.capitalAmount;
                         				$scope.annulcard.saving=result.data.saving;
                         				$scope.annulcard.cardstatus=$scope.memberhomeinfo.cardInfoBean.cardStatus;
                 					}
                         });
                    		
                   	 	//确定退卡
                        $scope.confirmannulcard = function () {
                        	var updata = {
                        			"capitalAmount":"",
                        			"presentedAmount":"",
                        			"cardNumber":""
                        				};
                        	if($scope.annulcard.cardstatus!==101)
                        	{
                        		$uibModalInstance.dismiss('cancel');
                        		modalService.info({title:'提示', content:'此卡状态不满足退卡条件！', size:'sm', type: 'confirm'});
                        		return;
                        	}
                        	if($scope.annulcard.saving!==1)
                        	{
                        		$uibModalInstance.dismiss('cancel');
                        		modalService.info({title:'提示', content:'此卡无储值功能不允许退卡！', size:'sm', type: 'confirm'});
                        		return;
                        	}
                        	updata.capitalAmount =$scope.annulcard.capitalamount;
                        	updata.presentedAmount = $scope.annulcard.presentedamount;
                        	updata.cardNumber = $scope.annulcard.cardnumber;
                        	ajaxService.AjaxPost(
                        		{
                        		"annulCardBean":updata,
                        		"memberHomeBean":$scope.memberhomeinfo,
                        		"sessionId": $rootScope.sessionId}, 
                             		'postrade/card/annulCard.do').then(function (result) {
                         			if(result.status===1)
                             		{
                         				modalService.info({content:'退卡成功!', type: 'ok'});
                                		//接口请求用户数据内容 
                                    	ajaxService.AjaxPost( {"sessionId":$rootScope.sessionId,
                                    		"paramValue":$scope.memberhomeinfo.cardInfoBean.number},
                                    		"postrade/memberhome/memberhomeinfo.do").then(
                                			function (result) {
                                				if(result.data!==null)
                                				{
                                		    		var data = angular.copy(result.data);
//                                		    		alert(data);
                                		    		$scope.memberhomeinfo=data;
                                		    		//赋值   为编辑页面传值
                                		        	$rootScope.cardoperatetoeditusrmemberinfo = $scope.memberhomeinfo.memberInfoBean;
                                		        	//定义全局当前user信息
                                		        	$rootScope.currentuserinfo = $scope.memberhomeinfo;
                                				}
                                				else
                                				{
                                					//赋值   为编辑页面传值
                                		        	$rootScope.cardoperatetoeditusrmemberinfo = null;
                                		        	//定义全局当前user信息
                                		        	$rootScope.currentuserinfo = null;
                                				}
                                            }
                                		);
                         				$uibModalInstance.dismiss('cancel');
                             		}
                         			$uibModalInstance.dismiss('cancel');
                             });
                        };
                        /*退卡取消操作 */
                        $scope.cancelannulcard = function () {
                        	$uibModalInstance.dismiss('cancel');
                        }
                 	}]
             });
		 
		 }
		
		
    }];
});