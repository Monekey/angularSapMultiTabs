代码如下：
    $scope.logoutSystem = function (user) {
              ajaxService.AjaxPost({sessionId: sessionId}, "login/logout.do").then(function (message) {
                  if (message.status === 1) {
                      cookie.cleanCookie("CRMSESSIONID");
                      $state.go('login');
                  }
              });
          };