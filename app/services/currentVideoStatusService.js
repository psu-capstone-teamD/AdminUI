angular.module('adminUI')
    .service('currentVideoStatusService', ['$http', function ($http) {

        //$rootScope.testUUID = ""; // <-- uncomment this line to debug uuid
        // Call the lambda function to retrieve the status
        this.getLiveStatus = function (xml) {
            var gatewayURL = "https://cy2w528ju0.execute-api.us-west-2.amazonaws.com/api/getliveevent";
            var config = {
               method: "GET",
               url: gatewayURL
            };

            // Gets the response
            return $http(config).then(function success(response) {
                //console.log(response.data);
                return response.data;
                //return {statusCode: "200", pending: $rootScope.testUUID, running: ""}; // <-- uncomment this line to debug uuid
            }, function error(err) {
                console.log(err);
                return "failure";
            });
        }
    }]);

//application/xml