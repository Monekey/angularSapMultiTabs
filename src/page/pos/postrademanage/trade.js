/**
 * pos前台交易管理页面
 * @version  v1.0
 * @createTime: 2016/5/24 
 * @createAuthor hyz
 * @updateHistory
 *                2016/5/24  hyz create 
 */
define(['posService'], function () {
    return[
            '$scope',
            "register",
            'getCookieService',
            'appConstant',
            '$rootScope',
            "ajaxService",
            "$state",
            function ($scope, register, getCookieService, appConstant, $rootScope ,ajaxService,$state) {
                var sessionId = $rootScope.sessionId;
                var allDate=true;
            	var toDay=false;
            	var tradeTime=0;
            	if (typeof($rootScope.searchRequest) != "undefined"
            			&&typeof($rootScope.searchRequest.select) != "undefined"){
            	
            		if($rootScope.searchRequest.select=='toDay'){
            			allDate=false;
            			toDay=true;
            			tradeTime=1;
            		} 
            		if($rootScope.searchRequest.select=='all'){
            			allDate=true;
            			toDay=false;
            		}
                }
                //交易记录搜索panel
                $scope.conditions = {
                	//页面数据请求接口
                    ajaxUrl: 'postrade/indexpage/list.do',
                    //接口传入参数
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage,"tradeTime":tradeTime},
                    //交易记录搜索panel   搜索条件控件
                    filter: [
//                        {
//                            type: 'normal',
//                            field: '交易状态',
//                            requestFiled: 'tradeStatus',
//                            value: [
//                                    {"name": "全部", "state": true, "value": "0"}, 
//                                    {"name": "正常","state": false,"value": "1"}, 
//                                    {"name": "已撤销", "state": false, "value": "2"}]
//                        },
//                        {
//                            type: 'normal',
//                            field: '开票状态',
//                            requestFiled: 'tradeStatus',
//                            value: [
//                                    {"name": "全部", "state": true, "value": "0"}, 
//                                    {"name": "已开票","state": false,"value": "1"}, 
//                                    {"name": "未开票", "state": false, "value": "2"}]
//                        }
                        ],
                        //搜索框    控件
    					select:{
    						//页面数据请求接口           传入参数
    						requestFiled:'searchType', 
    						options:[
        							 {"name": "手机号", "state": false, "value": 1},
        							 {"name": "流水号", "state": false, "value": 2},
        							 {"name": "卡号", "state": true, "value": 3},
    					]},
    					search:{
    						//页面数据请求接口           传入参数
    						requestFiled: 'searchTypeValue',
    		                }
                };
                //交易记录数据分页
                $scope.pageSet = {
                        title:"交易列表",
                        currentPage: appConstant.pageSet.currentPage,
                        maxSize: appConstant.pageSet.maxSize,
                        numPerPage: appConstant.pageSet.numPerPage
                 };
                //交易记录翻页
                $scope.pageChanged = function(){
//                    var postObj = $scope.$$childTail.$$childHead.requestObj.request;
                	var postObj = $scope.requestObj.request;
                    postObj.pageNo = $scope.pageSet.currentPage;
                    postObj.pageCount = $scope.pageSet.numPerPage;
//                    ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
//                    	  $scope.$$childTail.$$childHead.resultList = result;
//                    });
                    ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                        $scope.resultList = result;
                    });
                };
                //打开一个新的tab   交易消费明细详情页
                $scope.opentradeInfoPan = function(trade){
                	$rootScope.TabsData=trade;
                	$state.go('pos.postradedetail');
                };
                $scope.isPosHome = function(){
                    if($state.current.name == 'pos.selectedpos' || $state.current.name == 'pos.default'){
                        return false;
                    }
                    return true;
                };
                $scope.goselectedpos = function()
                {
                    //赋值   为编辑页面传值
                    $rootScope.cardoperatetoeditusrmemberinfo = null;
                    //定义全局当前user信息
                    $rootScope.currentuserinfo = null;
                    $state.go('pos.selectedpos');
                }
            }
        ];
});




