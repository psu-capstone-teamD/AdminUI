angular.module('adminUI')
    .service('currentVideoStatusService', ['$http', function ($http) {

        // Call the lambda function to retrieve the status
        this.getLiveStatus = function (xml) {
            var gatewayURL = "https://cy2w528ju0.execute-api.us-west-2.amazonaws.com/api/getliveevent";
            var config = {
               method: "GET",
               url: gatewayURL
            };

            // Gets the response
            return $http(config).then(function success(response) {
                return response.data;
            }, function error(response) {
               return "failure";
            });
        }
    }]);

//application/xml