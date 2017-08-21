/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

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
                return response.data;
            }, function error(err) {
                console.log(err);
                return "failure";
            });
        }
    }]);