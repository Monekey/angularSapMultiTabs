/**
 * 集团编辑页
 * @version  v1.0
 * @createTime: 2016-04-19
 * @createAuthor lxp
 * @updateHistory
 *
 * @note   文件命名规则 ：company
 *          编辑页：companyEdit
 */
define(function (require) {
    // 引用工具包依赖
    var ngAMD = require("ngAMD");
    var angular = require("angular");
    var upload = require("uploadService");

    ngAMD.controller("companyUpdateCtrl", [//模块依赖
        //必须引用
        "$scope",
        //可选引用  顺序要和function中顺序一致
        "appConstant",
        "ajaxService",
        "register",
        "uploadService",
        "$rootScope",
        'modalService',
        function ($scope, appConstant, ajaxService, register, uploadService, $rootScope, modalService) {
            var tabData = $rootScope.TabsData;
            var data = angular.copy(tabData);
            $scope.company = data;
            $scope.from = data.from;

            // 获得省市列表并通过列表获得区域信息
            $scope.division = appConstant.division;
            var provinceId = (data.cityId + "").substr(0, 2);
            $scope.division.forEach(function (province) {
                if (province.id == provinceId) {
                    $scope.province = province;
                    $scope.area = province.areas;

                }
            });

            // 通过城市列表获得城市信息下拉框
            var cityId = (data.cityId + "").substr(0, 4);
            require(['../../../lib/city/' + provinceId], function (city) {
                $scope.province.subAreas = city.subAreas;
                city.subAreas.forEach(function (cityed) {
                    if (cityed.id == cityId) {
                        $scope.city = cityed;

                        cityed.subAreas.forEach(function (district) {
                            if (district.id == data.cityId) {
                                $scope.district = district;
                                $scope.$apply();
                            }
                        });
                    }
                });
            });

            // 修改省份信息，联动修改区域信息
            $scope.changeProvince = function (province) {
                $scope.city = '';
                $scope.district = '';
                $scope.division.forEach(function (item) {
                    if (province.id == item.id) {
                        areas = item.areas;
                        $scope.area = areas;
                        return;
                    }
                });

                if (province.id) {
                    require(['../../../lib/city/' + province.id], function (city) {
                        province.subAreas = city.subAreas;
                        $scope.$apply();
                    });
                }
            };

            // 保存集团信息
            $scope.saveCompany = function (company) {
                var data = {
                    id: company.id,
                    note: company.note,
                    companyName: company.companyName,
                    address: company.address,
                    linkMan: company.linkMan,
                    phone: company.phone,
                    email:company.email,
                    cityId: parseInt($scope.district.id)
                };
                var param = {companyBean: data, sessionId: $rootScope.sessionId};

                // 不上传集团图片
                if($scope.company.logo || $scope.company.logo == null){
                    param.companyBean.logo = $scope.company.logo;
                    ajaxService.AjaxPost(param, 'baseData/companyManager/update.do').then(function (result) {
                        modalService.info({content:'修改成功!', type: 'ok'}).then(function(obj){
                            if(obj.status == 'ok'){
                                $scope.company.callback();
                                register.switchTab({id: $scope.from});
                            }
                        },function(){
                                $scope.company.callback();
                                register.switchTab({id: $scope.from});
                        });
                    });
                }else{// 上传集团图片
                    uploadService.uploadFile($scope.file, 'baseData/companyManager/updateHasFile.do',param).then(function (result) {
                        modalService.info({content:'修改成功!', type: 'ok'}).then(function(obj){
                            if(obj.status == 'ok'){
                                $scope.company.callback();
                                register.switchTab({id: $scope.from});
                            }
                        },function(){
                            $scope.company.callback();
                            register.switchTab({id: $scope.from});
                        });
                    });
                }
            };

            // 点击上传图片按钮
            $scope.uploadCompanyImg = function (file, picId, fileId){

                $scope.company.logo = '';
                $scope.file = file;
            };

            // 点击取消按钮返回前一页面
            $scope.cancel = function () {
                register.switchTab({id: $scope.from});
            }
        }]);
});