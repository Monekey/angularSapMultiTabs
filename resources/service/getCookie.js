/**
 * 获取session。自定义filter
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *       2016/3/1 LSZ  create
 *       2016/5/27 LSZ  update 将系统锁定状态存到cookie
 */
define(function (require) {
    var angular = require("angular");
    var getCookie = angular.module("com.tcsl.crm7.service", []);
    getCookie.factory('getCookieService', ['$rootScope',
        function ($rootScope) {
            return {
                //获取cookie
                getCookie: function (cookie_name) {
                    var name = cookie_name + "=";
                    var ca = document.cookie.split(';');
                    for(var i=0; i<ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0)==' ') c = c.substring(1);
                        if (c.indexOf(name) != -1){
                            var sessionId = c.substring(name.length, c.length);
                            if(cookie_name === 'CRMSESSIONID'){//CRMSESSIONID时给sessionId赋值
                                $rootScope.sessionId = sessionId;
                            }
                            return c.substring(name.length, c.length);
                        }
                    }
                    return "";
                },

                setCookie: function(cookie_name,sessionId){//将sessionId保存在cookie内
                    var d = new Date();
                    d.setTime(d.getTime() + (30*24*60*60*1000));//有效期默认30天
                    var expires = "expires="+d.toUTCString();
                    document.cookie = cookie_name + "=" + sessionId + "; " + expires;
                    if(cookie_name === 'CRM7LOCK'){//根据传过来的CRM7LOCK值判断是否锁定系统
                        if(sessionId){
                            $rootScope.lockSys = true;
                        }else{
                            delete $rootScope.lockSys;
                        }
                    }
                },

                cleanCookie: function(cookie_name){//清除cookie，暂时未用
                    document.cookie = cookie_name + "=" + "" + "; " + -1;
                }
            };
        }
    ]);

    getCookie.filter('getIconNomal', ['$sce',function($sce){//转换图标
            return function (icon) {
                return $sce.trustAsHtml(icon);
            }
    }])
    .filter('tranScoreRuleType', function () {//转换积分规则积分方式
        return function (type) {
            if (type == 0) {
                return "按金额";
            }
            return "按操作";
        }
    }).filter('tranScoreRuleContent', function () {//转换积分规则积分内容
        return function (type, money, score) {
            if (type == 0) {
                return "每" + money + "元积" + score + "分";
            }
            return "每次积" + score + "分";
        }
    }).filter('tranScoreRuleIsAble', function () {//转换积分规则启用状态
        return function (isable) {
            if (isable == 1) {
                return "已启用";
            }
            return "未启用";
        }
    }).filter('tranScoreRuleIsAble2', function () {
        return function (isable) {
            if (isable == 0) {
                return "启用";
            }
            return "停用";
        }
    }).filter('tranScoreRuleIsAble3', function () {//转换员工启用状态
        return function (isAccess) {
            if (isAccess == 0) {
                return "重新邀请";
            } else if (isAccess == 1) {
                return "停用";
            } else if (isAccess == 2){
                return "启用";
            }
        }
    }).filter('tranScoreRuleIsAble4', function () {//转换员工启用状态
        return function (isAccess) {
            if (isAccess == 0) {
                return "未加入";
            } else if (isAccess == 1) {
                return "已加入";
            } else if (isAccess == 2){
                return "已停用";
            }
        }
    }).filter('tranScoreRuleIsTime', function () { //转换积分规则有效期状态
            return function (isDate,isTime, startTime, endTime) {
                //开启有效期限制
                if (isDate==1&&isTime == 1) {
                	
                    var today = new Date();
                    if (today.getTime() > new Date(endTime).getTime() ) {
                        return "已过期";
                    } else if (today.getTime() <new Date(startTime).getTime() ) {
                        return "未生效";
                    } else {
                        return "已生效";
                    }
                }
                return "已生效";
            }
        })
        .filter('tranSavingRuleType', function () {//转换储值规则储值方式
            return function (type) {
                if (type == 0) {
                    return "线上储值";
                }
                return "线下储值";
            }
        })
        .filter('tranGiftType', function () {//转换兑换规则兑换类型
            return function (type) {
                if (type == 0) {
                    return "电子券";
                }
                return "实物";
            }
        })
        .filter('sum', function () {//转换兑换规则兑换类型
            return function (a, b) {
                return a + b;
            }
        })
        .filter('getMore', function () {
            return function (more) {
                if (more) {
                    return '更多';
                }
                return '收起';
            }
        })
        .filter('getAbs', function () {
            return function (abs) {
                return Math.abs(parseInt(abs));
            }
        })
        .filter('tranTerminalStatus', function () {//转换积分规则启用状态
            return function (isable) {
                if (isable == 1) {
                    return "已开通";
                }
                return "已停用";
            }
        })
        .filter('formatDateToDay', function () {//终端列表时间显示到月
            return function (date) {
                return date.substr(0,10);
            }
        }).filter('cardUpgradeType', function () {
        //1：消费总额  2：积分总额   3：充值金额  4：余额
        return function (type) {
            if (type == 1) {
                return "消费满";
            } else if (type == 3) {
                return "积分满";
            } else if (type == 2) {
                return "充值满";
            } else if (type == 4) {
                return "剩余满";
            }
        }
    }).filter('tranCss',function(){ //列表状态信息样式 中文对应css
        return function(text){
            var css = "";
            switch (text){
                case '已生效': css="scoreRuleIsTime-1"; break;
                case '已过期': css="scoreRuleIsTime-0"; break;
                case '未生效': css="scoreRuleIsTime-2"; break;
                case '已启用': css="scoreRuleIsAble-1"; break;
                case '未启用': css="scoreRuleIsAble-0"; break;
                case '未加入': css="scoreRuleIsAble4-0"; break;
                case '已加入': css="scoreRuleIsAble4-1"; break;
                case '已停用': css="scoreRuleIsAble4-2"; break;
                case '已开通': css="terminalStatus-1"; break;
            }
           // console.log(text+":"+css);
            return css;
        }
    }).filter('tranListIconFont', function ($sce) {//pagelist操作按钮图标切换(iconFont)
        return function (state,type) {
            if(type=='isAccess'){
                if (state == 1) {
                    return $sce.trustAsHtml("&#xe617;");
                }else if(state==2){
                    return $sce.trustAsHtml("&#xe616;");
                }else{
                    return $sce.trustAsHtml("&#xe614;");
                }
            }else{
                if (state == 0) {
                    return $sce.trustAsHtml("&#xe616;");
                }else{
                    return $sce.trustAsHtml("&#xe617;");
                }
            }
        }
    }).filter('tranPaymentMethodIconSrc', function () {//pos支付方式图标
        return function (typeName) {
            var src = "";
            switch (typeName){
                case '支付宝': src="resources/assets/images/pos/payment/zhifubao.png"; break;
                case '现金': src="resources/assets/images/pos/payment/xianjin.png"; break;
                case '微信': src="resources/assets/images/pos/payment/weixinzhifu.png"; break;
                case '闪惠': src="resources/assets/images/pos/payment/shanhui.png"; break;
                case '信用卡': src="resources/assets/images/pos/payment/creditcard.png"; break;
                case '支票': src="resources/assets/images/pos/payment/piao.png"; break;
                case '其它': src="resources/assets/images/pos/payment/other.png";break;
            }
            // console.log(text+":"+css);
            return src;
        }
    });
});