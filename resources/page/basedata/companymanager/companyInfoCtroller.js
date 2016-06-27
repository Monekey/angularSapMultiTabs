/**
 * 集团信息显示页    
 * @version  v1.0      
 * @createTime: 2016-04-19         
 * @createAuthor lxp             
 * @updateHistory  
 *                
 * @note   文件命名规则 ：company  
 *          编辑页：companyEdit    
 */
define(function(require) {
	
	// 引用样式
    var app = require("css!score_rule_css");
    var shopCss = require("css!company_css");
    return [
            //必须引用
            '$scope',
            //可选引用  顺序要和function中顺序一致
            "ajaxService",
            "$rootScope",
            "register",
            "appConstant",
            "$state",
            "getCookieService",
            function ($scope,ajaxService,$rootScope,register, appConstant,$state,cookie) {
                var sessionId = cookie.getCookie("CRMSESSIONID");
                //var sessionId = $rootScope.sessionId;
                var result={};

                $scope.edit = true;
                // 获取集团信息
                ajaxService.AjaxPost({sessionId: sessionId}, "baseData/companyManager/load.do").then(function (result) {

                	$scope.company=result.data;
                	$scope.company.city = "";
                	
                	// 状态转换显示
                    if($scope.company.ifEnable==1) {
                    	$scope.company.ifEnable=="已开通"
                    } else {
                    	$scope.company.ifEnable=="未开通"
                    }
                    
                    var cityId = ($scope.company.cityId + "").substr(0, 4);
                    var cityName;
                    
                    // 通过cityId获得城市信息显示
                    require(['../../../../../lib/city/' + ($scope.company.cityId + "").substr(0, 2)], function (city, callBack) {
                        city.subAreas.forEach(function (cityed) {
                            if (cityed.id == cityId) {
                            	 $scope.company.city = cityed.name;
                            	 $scope.$apply();
                            	 return;
                            }
                        });
                    });
                });


                $scope.gotoEdit = function(company){
                    $rootScope.company = company;
                    $state.go("editcompany");
                };
                
                // 点击打开集团修改页面
                $scope.openNew = function(company){
                	company.callback=function a(callback){
                        //callback();
                    };
                    var param = {
                            title:"修改集团信息",
                            id: "company" + company.id,
                            template:"basedata/companymanager/companyEdit.html",
                            ctrl: 'basedata/companymanager/companyEdit',//删除require路径，改为动态配置
                            ctrlName:"companyUpdateCtrl",//对应编辑页controller的名字
                            ng_show:false,
                            type: 'single',
                            from: 10009
                        };
                    //打开新建积分规则的tab
                    register.addToTabs(param, company);
                };
            }];


});
