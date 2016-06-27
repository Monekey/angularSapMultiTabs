/**
 * 新建兑换规则tabs
 * author：程永飞
 */
define(function (require) {
    var ngAMD = require("ngAMD");
    var shopselector = require("shopSelector");
    var exchange_rule_css = require("css!exchange_rule_css");
    ngAMD.controller("newExchangeRule", ["$scope", "$rootScope", "ajaxService", "getCookieService", 'register','shopSelectorService','modalService', function ($scope, $rootScope, ajaxService, getCookieService, register,shopSelectorService,modalService) {

        $scope.from = $rootScope.TabsData.from;
        //定义panel开启关闭标记
        $scope.status = {
            "terminal": false,
            "date": false

        };
        /**
         * 定义开启panel的方法，防止事件冒泡
         * @param type
         */
        $scope.openPanel = function(type){
            if(type==="terminal"){
                $scope.status.terminal = true;
            }
            if(type==="date"){
                $scope.status.date = true;
            }
            var event = window.event||event;
            if( document.all){
                event.cancelBubble = true;
            }else{
                event.stopPropagation();
            }
        };
        //初始化，从母tab上接收数据
        var self = this;

        //电子兑换项目（临时写死）
        $scope.giftData = [
            {"name": "30元兑换券", "id": 1, "type": 0},
            {"name": "50元兑换券", "id": 2, "type": 0},
            {"name": "100元兑换券", "id": 3, "type": 0}
        ];
        //新建兑换规则默认数据
        $scope.rule_data = {
            "sessionId": $rootScope.sessionId,
            "terminal": [],
            "relTerminals": [],
            "week": [],
            "exchangeRule": {
                "name": "",
                "giftType": 1,
                "giftId": "1",
                "giftName": "",
                "exchangeOnLine": 0,
                "exchangeOffLine": 1,
                "limitScore": 0,
                "castScore": 1,
                "isTerminal": 0,
                "isDate": 0,
                "isTime": 0,
                "isWeek": 0,
                "startTime": "",
                "endTime": "",
                "note": "",
                "isAble": 1
            }
        };


        $scope.getWeeks = function () {
            var choseWeeks = [];
            angular.forEach($scope.date_seven, function (j) {
                if (j.state == true) {
                    choseWeeks.push(j.value)
                }
            });
            this.rule_data.week = choseWeeks;
        }

        $scope.date_seven = [
            {"date": "星期一", "state": false, "value": 1},
            {"date": "星期二", "state": false, "value": 2},
            {"date": "星期三", "state": false, "value": 3},
            {"date": "星期四", "state": false, "value": 4},
            {"date": "星期五", "state": false, "value": 5},
            {"date": "星期六", "state": false, "value": 6},
            {"date": "星期日", "state": false, "value": 7}
        ];
        /**
		 * 有效星期选择
		 */
		$scope.date_seven_click=function (i){
			i.state=!i.state;
			//具体生效星期和开关的校验
			if(i.state==false&&$scope.rule_data.exchangeRule.isWeek==1){
				var tempFlg=false;
				angular.forEach($scope.date_seven, function (j) {
					if(j.state==true){
						tempFlg=true;

					}
				});
				if(!tempFlg){
					i.state=!i.state;
                    modalService.info({title:'提示', content:'开启有效星期，具体生效星期X至少有一个!', size:'sm', type: 'confirm'});
				}
			}
			
			
			
		}
		/**
		 * 有效星期开关change
		 */
		$scope.isWeekChange = function(){
			if($scope.rule_data.exchangeRule.isWeek==1){
				var tempFlg=false;
				angular.forEach($scope.date_seven, function (j) {
					if(j.state==true){
						tempFlg=true;
		
					}
					console.log(j.state);
					
				});
				if(!tempFlg){
					angular.forEach($scope.date_seven, function (j) {
						j.state=true;
					});
				}
				
			};
		}

        $scope.getGiftName = function (id) {
            for (var i = 0; i < $scope.giftData.length; i++) {
                if ($scope.giftData[i].id == id) {
                    return $scope.giftData[i].name;
                }
            }
        };


        $scope.checkExchangeType = function () {
            if ($scope.rule_data.exchangeRule.exchangeOnLine == 0 && $scope.rule_data.exchangeRule.exchangeOffLine == 0) {
                return false;
            }
            return true;
        };
        /**
         * 验证开启有效期限制，是否设置限制条件
         * @returns {boolean}
         */
        $scope.checkDateLimit = function(){
            if ($scope.rule_data.exchangeRule.isDate == 1 && $scope.rule_data.exchangeRule.isTime == 0&&$scope.rule_data.exchangeRule.isWeek == 0) {
                return false;
            }
            return true;
        };

        $scope.confirmIn = function () {
            $scope.getWeeks();
            if($scope.rule_data.exchangeRule.startTime===""){
                var startDate = new Date();
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);
                startDate.setMilliseconds(000);
                $scope.rule_data.exchangeRule.startTime=startDate.getTime();
            }

            if($scope.rule_data.exchangeRule.endTime===""){
                var endDate = new Date();
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);
                endDate.setMilliseconds(000);
                $scope.rule_data.exchangeRule.endTime=endDate.getTime();
            }
            if (!$scope.checkExchangeType()) {
                modalService.info({title:'提示', content:'请勾选兑换方式!', size:'sm', type: 'confirm'});
                return;
            }
            if (!$scope.checkDateLimit()){
                modalService.info({title:'提示', content:'您已开启有效期限制，请至少选中和设置一个限制条件!', size:'sm', type: 'confirm'});
                return;
            }
            if($scope.rule_data.exchangeRule.isTime == 1&& $scope.rule_data.exchangeRule.startTime==""&&$scope.rule_data.exchangeRule.endTime==""){
                modalService.info({title:'提示', content:'有效日期已经开启，请填写起止时间！', size:'sm', type: 'confirm'});
                return;
            }
            $scope.rlueEdit=$scope.rule_data;
			if($scope.changeItems && $scope.changeItems.length>0){
	                $scope.rlueEdit.relTerminals = $scope.changeItems;
	        }
			//console.log($scope.rule_data);
            $scope.disabledBtn = true;
            //获取操作内容
            ajaxService.AjaxPost($scope.rlueEdit, "memberEquity/exchangeRule/create.do").then(
            		
            		
                function (result) {
                	 if(result&&result.status===1){
	                    modalService.info({title:'提示', content:'新建成功!', size:'sm', type: 'ok'}).then(function(obj){
	                        if(obj.status == 'ok'){
	                            $rootScope.TabsData.callback();
	                            register.switchTab({id: $scope.from});
	                        }
	                    });
                	 }

                }

            );
            $scope.disabledBtn = false;

        };

        $scope.cancelIn = function () {
            register.switchTab({id: $scope.from});
        };
        
        
        /**
		 * 开启终端选择模态框
		 */
		$scope.showModal = function() {
			//将当前对象转换成对应模态框的对象的字段
			//showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
			var showFlg = 1;
			//模态框需要传入两个值，一个是最初始的数据库加载的选中对象数组，创建的时候初始数组为空
			var initItems = [];
			//模态框需要传入两个值，一个是当前页面显示的对象数组
			var currentItems = $scope.rule_data.relTerminals;
			
			var selectorParam = {
					"serviceType": "terminal", //terminal
					"terminal":{
						"ajaxUrl":"baseData/terminalManager/treeList.do"
					},
					"initItems":initItems,
					"currentItems":currentItems,
					"showFlg": 1,
                    "title":"选择终端"
				};
			shopSelectorService.openShopModal(selectorParam).then(function(result){
				//result中含有全部已选元素数组，和变化的元素数组
				$scope.rule_data.relTerminals = convertModalShop(result.allSelectedItems);
				$scope.changeItems = result.changeItems;
			});
			

		};
		/**
		 * 当前页面元素与模态框元素字段同步
		 * @param shops
		 * @returns {Array}
		 */
		function convertModalShop(shops){
			var newShops = [];
			for(var i=0;i<shops.length;i++){
				var shop = {};
				shop.code = shops[i].code;
				shop.showName = shops[i].showName;
				shop.bindFlg = shops[i].bindFlg;
                shop.shopName = shops[i].shopName;
				newShops.push(shop);
			}
			return newShops;
		}

        $scope.stopPropagation = function($event){
            $event.stopPropagation();
        }


    }]);
});