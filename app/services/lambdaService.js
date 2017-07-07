angular.module('adminUI')
    .service('lambdaService', ['$http', function ($http) {

        this.sendBXF = function (xml) {

            // Change the gatewayURL to the real URL when the time comes
            var gatewayURL = "https://05habpy49l.execute-api.us-east-2.amazonaws.com/testing/";
            var config = {
                method: "POST",
                url: gatewayURL,
                data: { "xml": xml },
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Posts the XML string to the API gateway, returns success / failure
            // depending on the response
            $http(config).then(function success(response) {
                console.log('[lambdaService]\tThe response was: ' + response.data);
                return "success";
            }, function error(response) {
                console.log('[lambdaService]\tThe response was: ' + response.data);
                return "failure";
            });
        }
    }]);
