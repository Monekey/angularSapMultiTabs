/**
 * 后台和报表内容区通用页面
 * @version  v1.0
 * @createTime: 2016/5/5 0005
 * @createAuthor LSZ
 * @updateHistory
 *                2016/5/5 0005  LSZ   create
 */
define(['ng_animate', 'css!login_css'], function () {
    return ["$scope", '$rootScope', 'ajaxService', '$state', 'getCookieService'
        , function ($scope, $rootScope, ajaxService, $state, getCookieService) {
            console.info("一张网页，要经历怎样的过程，才能抵达用户面前？\n一位新人，要经历怎样的成长，才能站在技术之巅？\n 加入商龙，你，可以影响世界。");
            console.log("请将简历发送至   %chr@tcsl.com.cn （ 邮件标题请以“姓名-应聘XX职位-来自CRM7”命名）", "color:red");

            $scope.slides = [
                {
                    active: true,
                    image: 'src/assets/images/login/banner01.png',
                    id: 0
                },
                {
                    active: false,
                    image: 'src/assets/images/login/banner02.png',
                    id: 1
                },
                {
                    active: false,
                    image: 'src/assets/images/login/banner03.png',
                    id: 2
                }
            ];

            $scope.changeCarusel = function (currentindex) {
                if (currentindex === 2) {
                        var backgrounder =  "linear-gradient(#092554 , #155385)";
                } else if (currentindex === 1) {
                        var backgrounder = "linear-gradient(#2a7ce7, #49a9f5)";
                } else {
                    var backgrounder = "linear-gradient(#5a60d3, #916bf1)";
                }
                $scope.gbkCss = {
                    "background": backgrounder
                };
            };


            $rootScope.overlay = true;
            $scope.user = {
                name: getCookieService.getCookie('CRMLASTUSERNAME') ? getCookieService.getCookie('CRMLASTUSERNAME') : '',
                password: getCookieService.getCookie('CRMRPASSWORD') ? getCookieService.getCookie('CRMRPASSWORD') : ''
            };
            $scope.isRmbPassword = getCookieService.getCookie('CRMRPASSWORD') ? true : false;
            $scope.getValid = function (name) {
                if (name) {
                    if (name.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/) || name.match(/^1[3|4|5|7|8]\d{9}$/)) {
                        return false;
                    }
                    return true;
                }
                if ($scope.focu == true) {
                    return true;
                }
            };

            $scope.loginSystem = function (user) {
                var request = {
                    sessionId: $rootScope.sessionId,
                    password: user.password
                };
                if (user.name.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)) {
                    request.email = user.name;
                } else {
                    request.phone = user.name;
                }
                ajaxService.AjaxPost(request, "login/login.do").then(function (users) {
                    if (users.status == 1) {
                        $rootScope.user = users.data;
                        getCookieService.setCookie('CRMSESSIONID', users.sessionId);
                        getCookieService.setCookie('CRMLASTUSERNAME', user.name);
                        if ($scope.isRmbPassword) {
                            getCookieService.setCookie('CRMRPASSWORD', user.password);
                        } else {
                            getCookieService.setCookie('CRMRPASSWORD', '');
                        }
                        $rootScope.sessionFlag = true;
                        console.log($rootScope.sessionFlag);
                        $rootScope.overlay = false;
                        $state.go('home');
                    }
                });
            };
        }];
});