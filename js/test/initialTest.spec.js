'use strict';

describe('lambdaService', function () {
    var lambdaService;
    beforeEach(module('adminUI', function($provide) {
        console.log("Beginning a test...");
    }));
    beforeEach(inject(function(_lambdaService_) {
        lambdaService = _lambdaService_;
    }));

    it('should get a response', function() {
       var result = lambdaService.sendBXF();
        console.log(result);
        expect(result).not.toBe(null);
    })
})