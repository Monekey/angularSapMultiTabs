/**
 * 门店列表页    
 * @version  v1.0      
 * @createTime: 2016-04-19         
 * @createAuthor lxp             
 * @updateHistory  
 *                
 * @note   文件命名规则 ：shop  
 *          编辑页：shopEdit    
 */
define(function (require) {
	
	// 引用样式
    var app = require("css!score_rule_css");
    var shopCss = require("css!../../../assets/css/company");

    var rtObj = {ctrl: "shopsCtrl", arrFunc: [//模块依赖
                                              
             //必须引用                                  
            '$scope',
            //可选引用  顺序要和function中顺序一致
            'appConstant',
            "register",
            "$rootScope",
            "ajaxService",
            function ($scope, appConstant,register, $rootScope, ajaxService) {
                var sessionId = $rootScope.sessionId;
                $scope.conditions = {
                    ajaxUrl: 'baseData/shopManager/list.do',
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage},
                    filter: [
                        {
                            type: 'normal',
                            field: '省市：',
                            requestFiled: 'cityId',
                            value: [],
                            ajaxUrl: 'baseData/shopManager/cityCount.do',
                            request: {"sessionId": sessionId, pageNo: 1, pageCount   : 20}
                        }]
                };
                
                $scope.edit = register.getRoot('修改');
                
                // 分页框架
                $scope.pageSet = {
                    title:"门店列表",
                    currentPage: appConstant.pageSet.currentPage,
                    maxSize: appConstant.pageSet.maxSize,
                    numPerPage: appConstant.pageSet.numPerPage
                };
                
                // 取得城市列表
                $scope.division = appConstant.division;

                // 取得地域信息
                $scope.getArea = function(cityId){
                    var provinceId = (cityId + "").substr(0, 2);
                    var areas;
                    $scope.division.forEach(function (province) {
                        if (province.id == provinceId) {
                           areas = province.areas;
                            return;
                        }
                    });
                    return areas;
                };
                
                // 点击编辑按钮跳转
                $scope.openNew = function(shop){
                    shop.callback=function a(callback){
                        console.log($scope);
                        ajaxService.AjaxPost({"sessionId": sessionId, pageNo: 1, pageCount   : 20}, "baseData/shopManager/cityCount.do").then(function (result) {
                        	var total = 0;
                        	
                        	var data = result.pageInfo.list;
                        	var params = [];
                    		var param = {name:"全部",state: true,value: null,count:'0'};
                    		params.push(param);
                        	for(var i=0;i<data.length; i++) {
                        		var param = {}
                        		param.name = data[i].cityName;
                        		param.state = false;
                        		param.value = data[i].id;
                        		param.count = data[i].count;
                        		total = total + Number(data[i].count)
                        		params.push(param);
                        	}
                        	params[0].count = total;

                        	$scope.conditions.filter[0].value=params;

                        });
                        
                        $scope.pageChanged();
                    };
                    //打开新建积分规则的tab
                    register.addToTabs({
                        title:"修改门店信息",
                        id: "shop" + shop.id,
                        template:"basedata/shopmanager/shopEdit.html",
                        ctrl: 'basedata/shopmanager/shopEdit',//删除require路径，改为动态配置
                        ctrlName:"shopUpdateCtrl",//对应编辑页controller的名字
                        ng_show:false,
                        type: 'single',
                        from: 10010
                    }, shop);
                };
                
                /*终端穿透操作*/
                $scope.doTeminal = function (shop) {
                    register.openTabWithRequest({id: 10012},{searchType: 1,searchTypeValue: shop.name});//穿透时调用的方法,id为目标tab功能id,第二个参数为显示类型及显示条件（searchType搜索的下拉条件 searchTypeValue搜索框内的内容）
                };

                // 分页跳转
                $scope.pageChanged = function(){
                    //var postObj = {"sessionId": sessionId};
                    var postObj = $scope.requestObj.request;
                    postObj.pageNo = $scope.pageSet.currentPage;
                    postObj.pageCount = $scope.pageSet.numPerPage;
                    ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                        $scope.resultList = result;
                    });
                };
            }
        ]
    };

    return rtObj;
});

