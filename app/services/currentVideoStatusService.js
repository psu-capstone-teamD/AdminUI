angular.module('adminUI')
    .service('currentVideoStatusService', ['$http', function ($http) {

        // Call the lambda function to retrieve the status
        this.getLiveStatus = function (xml) {
            var gatewayURL = "";
            var config = {
               method: "GET",
               url: gatewayURL,
               data: { 'body' : xml },
               headers: {
                   'Content-Type': 'application/json'
               }
            };

            // Gets the response
            $http(config).then(function success(response) {
                return response;
            }, function error(response) {
               return "failure";
            });
        }
    }]);

//application/xml