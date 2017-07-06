// Service to send XML data to the AWS Lambda endpoint that has been
// set up. If an unexpected response is given, it is sent to the controller.
//angular.module('app.services',[]).service('lambdaService', ['$http', function() {
//app.service('lambdaService', ['$http', function() {
angular.module('adminUI', []).service('lambdaService', ['$http', lambdaService]);
function lambdaService($http) {
    this.sendBXF = function () {
        $http.post("https://05habpy49l.execute-api.us-east-2.amazonaws.com/testing/", { "xml": "hey" })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return data;
        });
    };
}