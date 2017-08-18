angular.module('adminUI')
    .service('lambdaService', ['$http', function ($http) {

		this.inputRedirectDNS = "127.0.0.1:4949";
	
		this.setInputRedirectDNS = function(inputRedirectDNS) {
				this.inputRedirectDNS = "udp://" + inputRedirectDNS.first + "." 
								+ inputRedirectDNS.second + "." 
								+ inputRedirectDNS.third + "." 
								+ inputRedirectDNS.fourth + ":"
								+ inputRedirectDNS.port;
		};
	
        // Send BXF to Lambda API
        this.sendBXF = function (xml) {
            var gatewayURL = "https://cy2w528ju0.execute-api.us-west-2.amazonaws.com/api/schedule";
            var config = {
               method: "POST",
               url: gatewayURL,
               data: { 'body' : xml, 'url' : this.inputRedirectDNS },
               headers: {
                   'Content-Type': 'application/json'
               }
            };

            // Posts the XML string to the API gateway, returns success / failure
            // depending on the response
            $http(config).then(function success(response) {
               toastr.success('BXF Successfully Sent', 'Done');
               console.log('[lambdaService]\tThe response was: ' + response.data);
               return "success";
            }, function error(response) {
               toastr.error('BXF Send Failed', 'Error');
               console.log('[lambdaService]\tThe response was: ' + response.data);
               return "failure";
            });
        }
    }]);

//application/xml