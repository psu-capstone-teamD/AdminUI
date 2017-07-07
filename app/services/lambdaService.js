angular.module('adminUI')
    .service('lambdaService', ['$http', function ($http) {

        this.sendBXF = function (xml) {

            var gatewayURL = "https://05habpy49l.execute-api.us-east-2.amazonaws.com/testing/";
            var config = {
                method: "POST",
                url: gatewayURL,
                data: { "xml": xml },
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http(config).then(function success(response) {
                //return response.data;
                console.log('[lambdaService]\tThe response was: ' + response.data);
                this.result = response.data;
                return "success";
            }, function error(response) {
                //return response.data;
                console.log('[lambdaService]\tThe response was: ' + response.data);
                return "failure";
            });
        }
    }]);
