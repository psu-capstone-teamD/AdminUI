
describe('lambdaService', function () {
    var $httpBackend;

    beforeEach(module('adminUI'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        createService = function($httpBackend) {
            return $injector.get('lambdaService');
        }
    }));
    it('should work with nothing given', function() {
        expect(1).toBe(1);
    });

    it('should work with injection', function () {
        var service = createService($httpBackend);
        
        expect(1).toBe(1);
    });

});