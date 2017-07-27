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
                toastr.success('BXF Successfully Sent', 'Done');
               console.log('[lambdaService]\tSuccessful. The response was: ' + response.data);
               return "success";
            }, function error(response) {
                toastr.error('BXF Send Failed', 'Error');
               console.log('[lambdaService]\tFailed. The response was: ' + response.data);
               return "failure";
            });
        }
    }]);
