
describe('lambdaService', function () {
    var lambdaService, $httpBackend;
    var gatewayURL = "https://05habpy49l.execute-api.us-east-2.amazonaws.com/testing/";
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        createService = function($httpBackend) {
            return $injector.get('lambdaService');
        }
    }));
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
 
    it('should work with nothing given', function() {
        var result = 1;
        expect(result).toEqual(1);
    });

    it('should echo the data back', function () {
        $httpBackend.expectPOST(gatewayURL).respond(200, "hey");
        lambdaService = createService($httpBackend);

        lambdaService.sendBXF("hey");
        $httpBackend.flush();
        //console.log(result);
    });

 });