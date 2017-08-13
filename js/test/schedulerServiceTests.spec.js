describe('schedulerService', function(){
	var schedulerService, $rootScope;
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
		$rootScope = $injector.get('$rootScope');
        createService = function($rootScope) {
            return $injector.get('schedulerService');
        }
    }));
	

	
	describe('Initial Loading Config Test', function() {
        it('should have 6 keys on load', function() {
			schedulerService = createService($rootScope);
			var length = Object.keys(schedulerService.configOptions).length;
            expect(length).toBe(6);
        });
    });
	
	describe('Initial Loading Test', function() {
        it('should have empty/default parameters on load', function() {
            schedulerService = createService($rootScope);
            expect(schedulerService.videos.length).toBe(0);
			expect(schedulerService.initialStartTime).toBe('');
			expect($rootScope.playlistEmpty).toBe(true);
			expect(Object.keys(schedulerService.videoTitleCounts).length).toBe(0);
        });
    });

	describe('saveConfig() Test', function() {
        it('should Set the JSON parameter as configOptions', function() {
            var mockParam = {'test': '123'};
			expect(schedulerService.configOptions).not.toEqual(mockParam);
			schedulerService.saveConfig(mockParam);
			expect(schedulerService.configOptions).toEqual(mockParam);
        });
    });
	
});