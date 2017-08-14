describe('currentVideoStatusSerivceTests', function(){
	var currentVideoStatusSerivce, $httpBackend;
    beforeEach(angular.mock.module('adminUI'));
    
    // Inject the $httpBackend to create 'fake' http responses,
    // create a function that will inject the lambdaService
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        createService = function($httpBackend) {
            return $injector.get('currentVideoStatusService');
        }
    }));

    // Ensure there are no requests trying to be made
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getLiveStatus() tests', function() {
        beforeEach(function() {
            currentVideoStatusSerivce = createService($httpBackend);
        });

        it('should correctly return a successful message', function() {
            var gatewayURL = "https://cy2w528ju0.execute-api.us-west-2.amazonaws.com/api/getliveevent";
            var msg = { pending: '', running: '', statusCode: 200};
            var result = '';
            $httpBackend.expectGET(gatewayURL).respond(function() {
                result = msg;
                return [200, msg];
            });
            result = currentVideoStatusSerivce.getLiveStatus();
            $httpBackend.flush();
            expect(result).toBe(msg);
        });
        it('should correctly return an error message', function() {
            var gatewayURL = "https://cy2w528ju0.execute-api.us-west-2.amazonaws.com/api/getliveevent";
            var msg = { errorMessage: "Couldn't get Live events", statusCode: 400};
            var result = '';
            $httpBackend.expectGET(gatewayURL).respond(function() {
                result = msg;
                return [400, msg];
            });
            result = currentVideoStatusSerivce.getLiveStatus();
            $httpBackend.flush();
            expect(result).toBe(msg);
        });
    });
});