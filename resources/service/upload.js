/**
 * 文件上传的公共方法
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *       2016/3/8  LSZ  create
 */
define(['angular','ng_upload'],function (angular) {
   // var ngUploadShim = require("ng_upload_shim");
    var upload = angular.module('upload', ['ngFileUpload']);

    upload.factory('uploadService', [
        'Upload',
        '$q',
        'modalService',
        function (Upload, $q, modalService) {
            return {
                uploadFile: function (file, url, param) {
                    var deferred = $q.defer();
                    var dataStr = JSON.stringify(param);
                    if(parseInt(file.size*(1/1024)*(1/1024)) <= 2){
                        Upload.upload({
                            url: url,
                            method: 'POST',
                            data: {file: file, data: dataStr}
                        }).then(function (resp) {
                            deferred.resolve(resp);
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        });
                    }else{
                        modalService.info({title:'提示', content:'图片大于2M,请重新上传图片!', size:'sm', type: 'confirm'});
                    }
                    return deferred.promise;
                }
            };
        }]);

});