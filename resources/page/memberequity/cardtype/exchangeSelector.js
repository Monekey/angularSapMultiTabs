/**
 * 预警通知人选择模态框页面
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor liuzy
 * @updateHistory
 *
 *
 */
define(function( require ){
    var ngAMD = require( "ngAMD" );

    ngAMD.controller( "exchangeSelectorCtrl",["$scope","ajaxService","getCookieService", "ruleIds", "$uibModalInstance", function($scope,ajax,cookie,ruleIds,$uibModalInstance){

       //获取sessionId
        var sessionId = cookie.getCookie("CRMSESSIONID");

		//分页初始化信息						        
        $scope.pageSet = {
							"sessionId" : sessionId,
							 //显示多少页
							"maxSize" : 6,
							//当前页码
			                "currentPage": 1,
			                //每页显示数量
			                "numPerPage": 5,
					     };
        //后台分页参数需要
        $scope.pageSet.ruleIds = ruleIds;
        $scope.pageSet.pageCount =$scope.pageSet.numPerPage;
        $scope.pageSetInit=function(){
            $scope.pageSet.pageNo = $scope.pageSet.currentPage;
        }
        //方式转换
        $scope.exchangeWay = {"0":"电子券","1":"实物"};
        //后台调用返回的页面信息
        $scope.pageInfo = {};
        //页面布局展现的规则列表
        $scope.rules = [];
        //以选中的规则，以id为key值存成对象
        $scope.selectMap={};
        //处理selectMap得到的最终选择列表
        $scope.selectList=[];
        //全选标志
        $scope.isCheckAll = false;
        /**
         * 分页获取储值规则
         */
        $scope.pageChanged = function () {
        	 $scope.pageSetInit();
        	 ajax.AjaxPost($scope.pageSet, "memberequity/cardtype/selectExchangeRules.do" ).then(function( result ){
                 $scope.pageInfo = result.pageInfo;
                 $scope.rules = result.pageInfo.list;
                 $scope.isCheckAll = false;
             });
        };
        /**
         * 初始化页面
         */
        $scope.pageChanged();
        /**
         * 选择或取消全部规则。
         * @param isCheckAll
         * @param rules
         */
        $scope.selectAllRule = function(isCheckAll, rules){
        	console.log(rules);
            if(isCheckAll === true){
                for(var index in rules){
                	console.log(rules[index].id);
                    $scope.selectMap[rules[index].id]=rules[index];
                }
            }else{
            	for(var index in rules){
                    delete $scope.selectMap[rules[index].id];
                }
            }
        };
        /**
         * 获取以选择数量
         * @return count
         */
        $scope.getSelectCount=function(){
        	return Object.getOwnPropertyNames($scope.selectMap).length;
        }
        
        
        /**
         * 单选规则操作
         * @param $event
         * @param rule
         */
        $scope.updateSelection = function($event, rule){
            var checkbox = $event.target;
            if(checkbox.checked){
            	$scope.selectMap[rule.id]=rule;
            }else{
            	delete $scope.selectMap[rule.id];
            }
        };
        /**
         * 判断规则是否已存在于已选规则对象中
         * @param rule
         * @returns {boolean}
         */
        $scope.isRuleSelected = function(rule){
            return $scope.selectMap[rule.id] != undefined;
        };
        
        /**
         * 回传参数获得
         */
        $scope.getSelectList = function(){
            for(var index in $scope.selectMap ){
            	$scope.selectList.push($scope.selectMap[index]);
            }
        };
        /**
         * 确定操作，并将已选列表传回主页面，并关闭模态框
         */
        $scope.confirm = function(){
        	$scope.getSelectList();
            $uibModalInstance.close($scope.selectList);
            $scope.selectList = [];
        };
        /**
         * 取消操作，关闭模态框
         */
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
    }]);
});