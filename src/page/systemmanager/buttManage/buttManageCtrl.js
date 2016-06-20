/**
 * Created by Administrator on 2016/3/28 0028.
 */
define(function (require) {

    var rtObj = {ctrl: "buttCtrl", arrFunc: [
            '$scope',
            '$rootScope',
            'ajaxService',
            function ($scope, $rootScope, ajaxService) {
                var sessionId = $rootScope.sessionId;

                ajaxService.AjaxPost({"sessionId": sessionId}, 'memberEquity/cardType/list.do').then(function (result) {
                    if (result) {
                        $scope.cards = result.pageInfo.list;
                    }
                });
            }
        ]
    };

    return rtObj;
});
