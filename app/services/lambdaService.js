// Service to send XML data to the AWS Lambda endpoint that has been
// set up. If an unexpected response is given, it is sent to the controller.
//angular.module('app.services',[]).service('lambdaService', ['$http', function() {
//app.service('lambdaService', ['$http', function() {
angular.module('adminUI', []).service('lambdaService', function ($http) {
    this.sendBXF = function ($http) {
        /*
        $http.post("https://05habpy49l.execute-api.us-east-2.amazonaws.com/testing/", { "xml": "hey" })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return data;
        });*/
        //return "test";
        var config = {headers: {'Accept': 'application/json'}};
        var url = "https://05habpy49l.execute-api.us-east-2.amazonaws.com/testing/";

        /*
        return $http.post(url, { "xml": "hey" }, config)
        .success(function (data, status, headers, config) {
            return "hey";
        })
        .error(function (data, status, header, config) {
            return "hey";
        });*/

        $http.post(url, {"xml":"hey"}, config)
        .success(function (data, status, headers, config) {
            return "hey";
        })
        .error(function (data, status, headers, config) {
            return "hi";
        });
    };
});
