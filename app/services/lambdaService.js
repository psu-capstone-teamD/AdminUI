// Service to send XML data to the AWS Lambda endpoint that has been
// set up. If an unexpected response is given, it is sent to the controller.
adminui.service('lambdaService', ['$http', function() {
    // Set the URL to the Lambda endpoint
    this.endpointURL = "https://05habpy49l.execute-api.us-east-2.amazonaws.com/testing/";

    this.sendBXF = function(xml) {
        $http.post(this.endpointURL, xml).then(
            function(success) {
                console.log(success);
            },
            function(failure) {
                console.log(failure)
            }
        ); // <-- config is the API authentication thing
    };
}]);