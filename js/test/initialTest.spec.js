
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
        var msg = "Testing";
        var result = '';
        //$httpBackend.expectPOST(gatewayURL).respond(200, "hey");
        $httpBackend.expectPOST(gatewayURL).respond(function () {
            result = msg;
            return [200, msg];
        });
        lambdaService = createService($httpBackend);

        lambdaService.sendBXF(msg);
        $httpBackend.flush();
        console.log('[$httpBackend]\tThe response was: ' + result);
        expect(result).toBe(msg);
    });

 });