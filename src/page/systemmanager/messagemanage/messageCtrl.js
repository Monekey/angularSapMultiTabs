/**
 * 短信管理
 * @version  v1.0
 * @createTime: 2016/4/28 0028
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/6   liuzy  update
 */
define(function (require) {
    var score_rule_css = require("css!score_rule_css");
    var message_manage_css = require("css!message_manage_css");
    var angular = require("angular");
    var rtObj = {
        ctrl: "messageCtrl", arrFunc: [
            '$scope',
            '$rootScope',
            'ajaxService',
            'modalService',
            'register',
            function ($scope, $rootScope, ajaxService,modalService, register) {
                var sessionId = $rootScope.sessionId;
                var cardAll = {};
                $scope.edit = register.getRoot('编辑');

                loadData();
                function loadData(){
                    /**
                     * 查询所有卡型
                     */
                    ajaxService.AjaxPost({"sessionId": sessionId}, 'memberequity/cardtype/getCardTypeCombo.do').then(function (result) {
                        if (result) {
                            $scope.cards = result.data;
                            cardAll  = selectAll($scope.cards);
                        }
                    });
                    /**
                     * 查询业务通知短信和生日短信
                     */
                    ajaxService.AjaxPost({"sessionId": sessionId}, 'systemmanager/smsmanager/load.do').then(function (result) {
                        if (result) {
                            if (result.data.sysSMSBirthday&&result.data.sysSMSBirthday!==null) {
                                $scope.sysSMSBirthday = result.data.sysSMSBirthday;
                                $scope.initSysSMSBirthday = angular.copy($scope.sysSMSBirthday);
                            } else {
                                $scope.sysSMSBirthday = {
                                    "status":0,
                                    "day":7,
                                    "memberTemplate":"尊敬的会员，在您生日到来之际，【集团简称】祝您生日快乐，非常期待您的光临哦！",
                                    "relativesTemplate":"尊敬的会员，您的【亲友名称】生日即将到来，祝生日快乐!【集团简称】非常期待您的光临哦！"
                                };
                                $scope.initSysSMSBirthday = {
                                    "status":0,
                                    "day":7,
                                    "memberTemplate":"尊敬的会员，在您生日到来之际，【集团简称】祝您生日快乐，非常期待您的光临哦！",
                                    "relativesTemplate":"尊敬的会员，您的【亲友名称】生日即将到来，祝生日快乐!【集团简称】非常期待您的光临哦！"
                                };
                            }
                            if (result.data.sysSMSBusiness && result.data.sysSMSBusiness.length > 0) {
                                $scope.sysSMSBusiness = result.data.sysSMSBusiness;
                                $scope.initSysSMSBusiness = splitBusiness($scope.sysSMSBusiness);
                            } else {
                                var sysSMSBusines = {
                                    "sellCardFlg": 1,
                                    "consumeAmountFlg": 1,
                                    "consumeTimesFlg": 1,
                                    "savingAmountFlg": 1,
                                    "savingTimesFlg": 1,
                                    "reportLossFlg": 1,
                                    "modifyPasswordFlg": 1,
                                    "resetPasswordFlg": 1,
                                    "addIntegralFlg": 1,
                                    "exchangeFlg": 1,
                                    "cardUpgradeFlg": 1,
                                    "cancelFlg": 1,
                                    "cardTypeName": cardAll.cardTypeName?cardAll.cardTypeName:"",
                                    "typeIds": cardAll.typeIds?cardAll.typeIds:[]
                                };
                                $scope.sysSMSBusiness = [sysSMSBusines];
                                $scope.initSysSMSBusiness = [];
                            }

                        }
                    });
                }


                /**
                 * 初始化业务选中卡型
                 * @param cards
                 * @returns {{}}
                 */
                function selectAll(cards){
                    var cardSelect = {};
                    cardSelect.typeIds = [];
                    cardSelect.cardTypeName='';
                    for(var i=0;i<cards.length;i++){
                        if (cardSelect.cardTypeName==='') {
                            cardSelect.cardTypeName = cards[i].showName;
                        } else if (cardSelect.cardTypeName && cardSelect.cardTypeName.indexOf(cards[i].showName) === -1) {
                            cardSelect.cardTypeName = cardSelect.cardTypeName + "," + cards[i].showName;
                        }
                        cardSelect.typeIds.push(cards[i].value);
                    }
                    return cardSelect;
                }
                $scope.status = {
                    open: false,
                    templateType: 0
                };

                /**
                 * 将原始业务通知数组拆分成单个卡的业务数组
                 * @param arr
                 * @returns {Array}
                 */
                function splitBusiness(arr) {
                    var newArr = [];
                    if (arr && arr.length > 0) {
                        for (var i = 0; i < arr.length; i++) {

                            if (arr[i].typeIds && arr[i].typeIds.length > 0) {
                                for (var j = 0; j < arr[i].typeIds.length; j++) {
                                    var newBusines = {
                                        "sellCardFlg": arr[i].sellCardFlg,
                                        "consumeAmountFlg": arr[i].consumeAmountFlg,
                                        "consumeTimesFlg": arr[i].consumeTimesFlg,
                                        "savingAmountFlg": arr[i].savingAmountFlg,
                                        "savingTimesFlg": arr[i].savingTimesFlg,
                                        "reportLossFlg": arr[i].reportLossFlg,
                                        "modifyPasswordFlg": arr[i].modifyPasswordFlg,
                                        "resetPasswordFlg": arr[i].resetPasswordFlg,
                                        "addIntegralFlg": arr[i].addIntegralFlg,
                                        "exchangeFlg": arr[i].exchangeFlg,
                                        "cardUpgradeFlg": arr[i].cardUpgradeFlg,
                                        "cancelFlg": arr[i].cancelFlg
                                    }
                                    if (arr[i].id) {
                                        var id = arr[i].id;
                                        newBusines.id = id
                                    } else {
                                        newBusines.groupId = "new" + i;
                                    }
                                    newBusines.cardTypeId = arr[i].typeIds[j];
                                    newArr.push(newBusines);
                                    newBusines = {};
                                }
                            }
                        }
                    }

                    return newArr;
                }

                $scope.checked = false;

                /**
                 * 根据chexk操作更改当前对象选中和未选中状态，具体操作
                 * @param action
                 * @param data
                 */
                var updateSelected = function (action, card, sysSMSBusines) {
                    if (action == 'add' && sysSMSBusines.typeIds.indexOf(card.value) === -1) {
                        sysSMSBusines.typeIds.push(card.value);
                        if (!sysSMSBusines.cardTypeName) {
                            sysSMSBusines.cardTypeName = card.showName;
                        } else if (sysSMSBusines.cardTypeName && sysSMSBusines.cardTypeName.indexOf(card.showName) === -1) {
                            sysSMSBusines.cardTypeName = sysSMSBusines.cardTypeName + "," + card.showName;
                        }

                    }
                    if (action == 'remove' && sysSMSBusines.typeIds.indexOf(card.value) !== -1) {
                        var idx = sysSMSBusines.typeIds.indexOf(card.value);
                        sysSMSBusines.typeIds.splice(idx, 1);
                        if (sysSMSBusines.cardTypeName.indexOf(card.showName) !== -1) {
                            sysSMSBusines.cardTypeName = sysSMSBusines.cardTypeName.replace(card.showName, "");
                            //window.console.log(sysSMSBusines.cardTypeName);
                            var cardTypeNamesArr = sysSMSBusines.cardTypeName.split(",");
                            var newArr = [];
                            for (var i = 0; i < cardTypeNamesArr.length; i++) {
                                if (cardTypeNamesArr[i] !== "") {
                                    newArr.push(cardTypeNamesArr[i])
                                }
                            }
                            sysSMSBusines.cardTypeName = newArr.join(",");
                        }

                    }
                };
                /**
                 * 执行check操作
                 * @param $event
                 * @param data
                 */
                $scope.updateSelection = function ($event, card, sysSMSBusines) {
                    var checkbox = $event.target;
                    var action = (checkbox.checked ? 'add' : 'remove');
                    if (action === 'add') {
                        for (var i = 0; i < $scope.sysSMSBusiness.length; i++) {
                            for (var j = 0; j < $scope.sysSMSBusiness[i].typeIds.length; j++) {
                                if (card.value === $scope.sysSMSBusiness[i].typeIds[j]) {
                                    checkbox.checked = false;
                                    modalService.info({title:'提示', content:'该卡型已被设置，请选择其他卡型！', size:'sm', type: 'confirm'});
                                    return;
                                }
                            }
                        }
                    }
                    updateSelected(action, card, sysSMSBusines);
                };
                /**
                 * 判断当前元素是否在选中元素的数组里
                 * @param id
                 * @returns {boolean}
                 */
                $scope.isCardSelected = function (id, sysSMSBusines) {
                    return sysSMSBusines.typeIds.indexOf(id) >= 0;

                };

                /**
                 * 增加一行业务通知短信设置
                 */
                $scope.addRow = function () {
                    var tempArr = [];
                    var abledCard = {};
                    for (var i = 0; i < $scope.sysSMSBusiness.length; i++) {
                        for (var j = 0; j < $scope.sysSMSBusiness[i].typeIds.length; j++) {
                            if (tempArr.indexOf($scope.sysSMSBusiness[i].typeIds[j]) == -1){
                                tempArr.push($scope.sysSMSBusiness[i].typeIds[j]);
                            }
                        }
                    }
                    var tempCard = angular.copy($scope.cards);
                    for(var j=0;j<$scope.cards.length;j++){
                        var isExist = false;
                        for(var k=0;k<tempArr.length;k++){
                            if($scope.cards[j].value === tempArr[k]){
                                isExist = true;
                            }
                        }
                        if(isExist){
                            var index = checkArray(tempCard,$scope.cards[j]);
                            tempCard.splice(index,1);
                        }
                    }

                    abledCard = selectAll(tempCard);
                    var sysSMSBusines = {
                        "sellCardFlg": 1,
                        "consumeAmountFlg": 1,
                        "consumeTimesFlg": 1,
                        "savingAmountFlg": 1,
                        "savingTimesFlg": 1,
                        "reportLossFlg": 1,
                        "modifyPasswordFlg": 1,
                        "resetPasswordFlg": 1,
                        "addIntegralFlg": 1,
                        "exchangeFlg": 1,
                        "cardUpgradeFlg": 1,
                        "cancelFlg": 1,
                        "cardTypeName": abledCard.cardTypeName,
                        "typeIds": abledCard.typeIds
                    };
                    $scope.sysSMSBusiness.push(sysSMSBusines);
                };

                /**
                 * 判断元素事都存在在数组中
                 * @param arr
                 * @param item
                 * @returns {number}
                 */
                function checkArray(arr, item) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] && arr[i].showName === item.showName) {
                            return i;
                        }
                    }
                    return -1;
                }
                /**
                 * 删除一行业务通知短信设置
                 */
                $scope.minusRow = function (index) {
                    $scope.sysSMSBusiness.splice(index, 1);
                };

                /**
                 * 保存业务短信通知配置
                 */
                $scope.saveSysSMSBusiness = function () {
                    var addSMSBusiness = [];
                    var updateSMSBusiness = [];
                    var deleteSMSBusiness = [];
                    var currentBusiness = splitBusiness($scope.sysSMSBusiness);
                    if (!currentBusiness || currentBusiness.length === 0 && $scope.initSysSMSBusiness && $scope.initSysSMSBusiness.length > 0) {
                        for (var j = 0; j < $scope.initSysSMSBusiness.length; j++) {
                            deleteSMSBusiness.push($scope.initSysSMSBusiness[j]);
                        }
                    } else if (currentBusiness && currentBusiness.length > 0 && !$scope.initSysSMSBusiness || $scope.initSysSMSBusiness.length === 0) {
                        for (var i = 0; i < currentBusiness.length; i++) {
                            addSMSBusiness.push(currentBusiness[i]);
                        }
                    } else {
                        for (var i = 0; i < currentBusiness.length; i++) {
                            if (!currentBusiness[i].id) {
                                addSMSBusiness.push(currentBusiness[i]);
                            } else {
                                var index = inArray($scope.initSysSMSBusiness, currentBusiness[i]);
                                if (index !== -1) {
                                    if (isChange(currentBusiness[i], $scope.initSysSMSBusiness[index]) === false) {
                                        updateSMSBusiness.push(currentBusiness[i]);
                                    }
                                } else {
                                    addSMSBusiness.push(currentBusiness[i]);
                                }
                            }
                        }
                        for (var j = 0; j < $scope.initSysSMSBusiness.length; j++) {
                            var seat = inArray(currentBusiness, $scope.initSysSMSBusiness[j]);
                            if (seat === -1) {
                                deleteSMSBusiness.push($scope.initSysSMSBusiness[j]);
                            }
                        }
                    }
                    var param = {
                        "sessionId": sessionId,
                        "addSMSBusiness": addSMSBusiness,
                        "updateSMSBusiness": updateSMSBusiness,
                        "deleteSMSBusiness": deleteSMSBusiness
                    };
                    ajaxService.AjaxPost(param, 'systemmanager/smsmanager/edit.do').then(function (result) {
                        if (result && result.status === 1) {
                            modalService.info({content:'添加成功!', type: 'ok'});
                            ajaxService.AjaxPost({"sessionId": sessionId}, 'systemmanager/smsmanager/load.do').then(function (result) {
                                if (result) {
                                    if (result.data.sysSMSBusiness && result.data.sysSMSBusiness.length > 0) {
                                        $scope.sysSMSBusiness = result.data.sysSMSBusiness;
                                        $scope.initSysSMSBusiness = splitBusiness($scope.sysSMSBusiness);
                                    } else {
                                        var sysSMSBusines = {
                                            "sellCardFlg": 1,
                                            "consumeAmountFlg": 1,
                                            "consumeTimesFlg": 1,
                                            "savingAmountFlg": 1,
                                            "savingTimesFlg": 1,
                                            "reportLossFlg": 1,
                                            "modifyPasswordFlg": 1,
                                            "resetPasswordFlg": 1,
                                            "addIntegralFlg": 1,
                                            "exchangeFlg": 1,
                                            "cardUpgradeFlg": 1,
                                            "cancelFlg": 1,
                                            "cardTypeName": cardAll.cardTypeName?cardAll.cardTypeName:"",
                                            "typeIds": cardAll.typeIds?cardAll.typeIds:[]
                                        };
                                        $scope.sysSMSBusiness = [sysSMSBusines];
                                        $scope.initSysSMSBusiness = [];
                                    }


                                }
                            });

                        }
                    })
                };

                /**
                 * 保存生日短信通知配置
                 */
                $scope.saveSysSMSBirthday = function () {

                    if ($scope.sysSMSBirthday.id) {
                        if ($scope.sysSMSBirthday !== $scope.initSysSMSBirthday) {
                            $scope.sysSMSBirthday.type = 2;
                        }
                    } else {
                        $scope.sysSMSBirthday.type = 1;
                    }

                    var param = {
                        "sessionId": sessionId,
                        "smsBirthday": $scope.sysSMSBirthday
                    };
                    ajaxService.AjaxPost(param, 'systemmanager/smsmanager/edit.do').then(function (result) {
                        if (result && result.status === 1) {
                            modalService.info({title:'提示', content:'保存成功!', size:'sm', type: 'ok'});
                            ajaxService.AjaxPost({"sessionId": sessionId}, 'systemmanager/smsmanager/load.do').then(function (result) {
                                if (result) {
                                    if (result.data.sysSMSBirthday) {
                                        $scope.sysSMSBirthday = result.data.sysSMSBirthday;
                                        $scope.initSysSMSBirthday = angular.copy($scope.sysSMSBirthday);
                                    }
                                }
                            });
                        }
                    })
                };
                /**
                 * 判断元素事都存在在数组中
                 * @param arr
                 * @param item
                 * @returns {number}
                 */
                function inArray(arr, item) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].cardTypeId && arr[i].cardTypeId === item.cardTypeId) {
                            return i;
                        }
                    }
                    return -1;
                }

                /**
                 * 判断字段是否变化
                 * @param item1
                 * @param item2
                 * @returns {boolean}
                 */
                function isChange(item1, item2) {
                    if (item1.sellCardFlg === item2.sellCardFlg &&
                        item1.consumeAmountFlg === item2.consumeAmountFlg &&
                        item1.consumeTimesFlg === item2.consumeTimesFlg &&
                        item1.savingAmountFlg === item2.savingAmountFlg &&
                        item1.savingTimesFlg === item2.savingTimesFlg &&
                        item1.reportLossFlg === item2.reportLossFlg &&
                        item1.modifyPasswordFlg === item2.modifyPasswordFlg &&
                        item1.addIntegralFlg === item2.addIntegralFlg &&
                        item1.exchangeFlg === item2.exchangeFlg &&
                        item1.cardUpgradeFlg === item2.cardUpgradeFlg &&
                        item1.cancelFlg === item2.cancelFlg &&
                        item1.resetPasswordFlg === item2.resetPasswordFlg) {
                        return true;

                    }
                    return false;
                }

            }
        ]
    };

    return rtObj;

});