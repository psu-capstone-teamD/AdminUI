angular.module('adminUI')
    .service('lambdaService', ['$http', function ($http) {

        // Send BXF to Lambda API
        this.sendBXF = function (xml) {

            var gatewayURL = "https://cy2w528ju0.execute-api.us-west-2.amazonaws.com/api/schedule";
            var config = {
                method: "POST",
                url: gatewayURL,
                data: { 'body' : xml },
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
