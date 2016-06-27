/**
 * 门店编辑页
 * @version  v1.0
 * @createTime: 2016-04-19
 * @createAuthor lxp
 * @updateHistory
 *
 * @note   文件命名规则 ：shop
 *          编辑页：shopEdit
 */
define(function (require) {

	// 引用工具包依赖
    var ngAMD = require("ngAMD");
    var angular = require("angular");
    var upload = require("uploadService");

    ngAMD.controller("shopUpdateCtrl", [//模块依赖
        //必须引用
        "$scope",

        //可选引用  顺序要和function中顺序一致
        "appConstant",
        "ajaxService",
        "register",
        "uploadService",
        "$rootScope",
        '$uibModal',
        "modalService",
        function ($scope, appConstant, ajaxService, register, uploadService, $rootScope,$uibModal,modalService) {

            var tabData = $rootScope.TabsData;
            var data = angular.copy(tabData);
            $scope.shop = data;
            $scope.from = data.from;

            // 获得品牌下拉列表
            ajaxService.AjaxPost({sessionId: $rootScope.sessionId}, 'baseData/brandManager/combo.do').then(function (result) {
                $scope.brandList = result.data;
            });

            // 获得城市列表
            $scope.division = appConstant.division;
            var provinceId = (data.cityId + "").substr(0, 2);
            $scope.division.forEach(function (province) {
                if (province.id == provinceId) {
                    $scope.province = province;
                    $scope.area = province.areas;

                }
            });

            // 根据城市id获取城市联动下拉框
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

            $scope.createBrand = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    //template:
                    template:
                    "<div>" +
	                    "<div class='modal-header'>" +
	                    "	<span class='modal-title'>新建品牌</span><i class='iconfont shops-edit-creat-i' ng-click='cancel()' style='cursor:pointer'>&#xe633;</i> " +
	                    "</div>"+
	                    "<div class='modal-body'>" +
	                    	"<form class='form-horizontal' autocomplete='off' name='insertBrandForm' ng-submit='addBrand(brandOne)' novalidate>"+
		                    "<div class='form-group'>" +
			                    "<div class='col-sm-8' style='padding-left:30px;padding-right:0px;'>" +
			                    	"<input ng-model='brandOne' class='form-control' id='brandName' name='brandName' required ng-pattern='/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/' placeholder='请输入品牌名' " +
			                    	" tooltip-trigger='blur' uib-tooltip='{{insertBrandForm.brandName.$invalid?\"品牌名由数字、中文、英文组成\":\"\"}}' tooltip-placement='bottom'/>" +
			                    "</div>" +
			                    "<div class='col-sm-3'>" +
			                    	"<button type='submit' class='btn btn-primary main-all-btn-b' ng-disabled='insertBrandForm.$invalid' >添加</button>" +
			                    "</div>" +
		                    "</div></form>" +
		                    "<div class='shop-edit-creat'>" +
		                    	"<table class='table table-striped table-style-all'>" +
		                    		"<tr ng-repeat='brand in brandList'>" +
		                    			"<td><input ng-model='brand.showName' class='form-control' ng-blur='saveEditBrand(brand)' ng-disabled='!brand.isAbled'/></td>"+
	                    				"<td>" +
	                    					"<i class='iconfont' ng-click='editBrand(brand)' style='cursor:pointer'>&#xe63f;</i>" +
	                    					"<i class='iconfont' ng-click='deleteBrand(brand)' style='cursor:pointer'>&#xe633;</i>" +
	                    				"</td>" +
	                    			"</tr>" +
	            				"</table>" +
	        				"</div>" +
	    				"</div>"
	        				+
	                   /* "<div class='modal-footer'>" +
	                    	"<div><button  class='btn btn-default' ng-click='cancel()'>关闭</button></div>" +
	                	"</div>" +*/
                	"</div>",
                    size: "sm",
                    resolve: {
                        brandList: function () {
                            return $scope.brandList;
                        }
                    },
                    controller:['$scope','$uibModalInstance','brandList',function($scope, $uibModalInstance, brandList){
                    	//这一步的目的是让scope统一
                    	 $scope.brandList = brandList;
                    	 ajaxService.AjaxPost({sessionId: $rootScope.sessionId}, 'baseData/brandManager/combo.do').then(function (result) {
                    		 brandList = result.data;//给父页面的scope的brandList赋值
                         });
                        $scope.brandOne='';//新建品牌绑定的品牌名字
                        $scope.priviousBrand = {};//记录编辑之前的品牌对象
                        
                        $scope.addBrand = function(brandOne){
                            ajaxService.AjaxPost({sessionId: $rootScope.sessionId, bmBrand: {name: brandOne}}, 'baseData/brandManager/create.do').then(function (result) {
                                if(result.status == 1){
                                    $scope.brandList.unshift({showName: result.bmBrand.name, value: result.bmBrand.id});
                                    $scope.brandOne='';
                                }
                            });
                        };
                        $scope.deleteBrand = function(brand){
                            ajaxService.AjaxPost({sessionId: $rootScope.sessionId, id: brand.value}, 'baseData/brandManager/delete.do').then(function (result) {
                                if(result.status == 1){
                                    var brandList = $scope.brandList;
                                    for(var i=0;i<brandList.length;i++){
                                        if(brandList[i].value == brand.value){
                                            brandList.splice(i,1);
                                            break;
                                        }
                                    }
                                }
                            });
                        };
                        /*点击修改品牌*/
                        $scope.editBrand = function(brand){
                        	//防止品牌已获编辑状态，再次点击同一品牌的编辑按钮，不响应
                        	if($scope.priviousBrand && $scope.priviousBrand.value == brand.value && brand.isAbled){
                        		brand.isAbled = false;
                        		return false;
                        	}
                        	//记录该品牌未修改的原始值
                        	$scope.priviousBrand = angular.copy(brand);
                        	if($scope.brandList && $scope.brandList.length>0){
                        		for (var i = 0; i < $scope.brandList.length; i++) {
									var brandTemp = $scope.brandList[i];
									if(brandTemp.value == brand.value){
										brandTemp.isAbled =true;//当前品牌 编辑状态
									}else{
										brandTemp.isAbled =false;//其他品牌 不可编辑状态
									}
								}
                        	}
                        	
                        }
                        /*保存品牌修改*/
                        $scope.saveEditBrand = function(brand){
                        	if($scope.priviousBrand.showName == brand.showName){
                        		brand.isAbled = false;
                                $scope.priviousBrand ={};
                        		return false;
                        	}
                        	if(!(/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/.test(brand.showName))){
                        		modalService.info({title:'提示', content:'品牌名由数字、中文、英文组成', size:'sm', type: 'confirm'});
                        		brand.showName= $scope.priviousBrand.showName;
                        		return false;
                        	}
                            ajaxService.AjaxPost({sessionId: $rootScope.sessionId, bmBrand: {id: brand.value,name:brand.showName}}, 'baseData/brandManager/update.do').then(function (result) {
                                if(result.status){
                                    brand.isAbled = false;
                                    $scope.priviousBrand ={};
                                }else{
                                	brand.showName= $scope.priviousBrand.showName;
                                }
                            },function(data){
                            	brand.showName= $scope.priviousBrand.showName;
                            });
                        };

                        $scope.cancel = function(){
                        	$scope.priviousBrand={};
                        	if($scope.brandList && $scope.brandList.length>0){
                        		for (var i = 0; i < $scope.brandList.length; i++) {
									var brandTemp = $scope.brandList[i];
									if(brandTemp.showName == ''){
										return false;
									}
								}
                        	}
                            $uibModalInstance.dismiss('cancel');
                        };
                    }]
                });
                //处理模态框返回到当前页面的数据
                modalInstance.result.then(function (obj) {
                   console.log(obj);
                });
            };

            // 改变省份按钮后切换操作逻辑
//            $scope.changeProvince = function (province) {
//                $scope.city = '';
//                $scope.district = '';
//                if (province.id) {
//                    require(['../../../lib/city/' + province.id], function (city) {
//                        province.subAreas = city.subAreas;
//                        $scope.$apply();
//                    });
//                }
//            };


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

            $scope.getValid = function(name){
                if(name){
                   if(name.match(/^1[3|4|5|7|8]\d{9}$/)){
                       return false;
                   }
                    return true;
                }
            };

            // 保存门店信息按钮处理
            $scope.saveShop = function (shop) {
                var data = {
                    id: shop.id,
                    name: shop.name,
                    brandId: shop.brandId,
                    address: shop.address,
                    linkMan: shop.linkMan,
                    phone: shop.phone,
                    cityId: parseInt($scope.district.id),
                };
                var param = {shopBean: data, sessionId: $rootScope.sessionId};

                // 无文件上传处理
                if($scope.shop.img || $scope.shop.img == null){
                    param.shopBean.img = $scope.shop.img;
                    ajaxService.AjaxPost(param, 'baseData/shopManager/update.do').then(function (result) {
                        modalService.info({content:'修改成功!', type: 'ok'}).then(function(obj){
                            if(obj.status == 'ok'){
                                $scope.shop.callback();
                                register.switchTab({id: $scope.from});
                            }
                        },function(){
                            $scope.shop.callback();
                            register.switchTab({id: $scope.from});
                        });
                    });
                }else{// 文件上传处理
                    uploadService.uploadFile($scope.file, 'baseData/shopManager/updateHasFile.do',param).then(function (result) {
                        modalService.info({content:'修改成功!', type: 'ok'}).then(function(obj){
                            if(obj.status == 'ok'){
                                $scope.shop.callback();
                                register.switchTab({id: $scope.from});
                            }
                        },function(){
                            $scope.shop.callback();
                            register.switchTab({id: $scope.from});
                        });
                    });
                }
            };

            // 点击上传按钮
            $scope.uploadShopImg = function (file, picId, fileId){
                if(file==null) {
                    return;
                }
                $scope.shop.img = '';
                $scope.file = file;
            };

            // 点击取消按钮
            $scope.cancel = function () {
                register.switchTab({id: $scope.from});
            }
        }]);
});