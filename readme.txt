这是一个基于angularJs的框架
代码如下：
    $scope.logoutSystem = function (user) {
              ajaxService.AjaxPost({sessionId: sessionId}, "login/logout.do").then(function (message) {
                  if (message.status === 1) {
                      cookie.cleanCookie("CRMSESSIONID");
                      $state.go('login');
                  }
              });
          };
