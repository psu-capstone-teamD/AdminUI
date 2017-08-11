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
        it('should have 12 keys on load', function() {
			schedulerService = createService($rootScope);
			var length = Object.keys(schedulerService.configOptions).length;
            expect(length).toBe(12);
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

    describe('playlistChanged() tests', function() {
        it('should correctly set the variables if the videoCount is 0', function() {
			schedulerService = createService($rootScope);
            schedulerService.videos = [];            
            schedulerService.playlistChanged();

            expect(schedulerService.initialStartTime).toBe('');
            expect($rootScope.playlistEmpty).toBeTruthy();
        });
        it('should set the date of the first video to the initial start time', function() {
            schedulerService = createService($rootScope);
            schedulerService.initialStartTime = "1234";
            schedulerService.videos = [{title: 'test video', date: '0000', totalSeconds: 15}];
            schedulerService.playlistChanged();

            expect(schedulerService.videos[0].date).toBe(schedulerService.initialStartTime);
        });

        it('should dynamically set the date for cascading videos', function() {
            schedulerService = createService($rootScope);
            schedulerService.initialStartTime = new Date();
            var resultDate = new Date(schedulerService.initialStartTime);
            resultDate.setSeconds(resultDate.getSeconds() + 15);
            schedulerService.videos = [{title: 'test video', date: new Date(), totalSeconds: 15},
                                       {title: 'test video 2', date: new Date(), totalSeconds: 20}];
            schedulerService.playlistChanged();

            expect($rootScope.playlistEmpty).toBeFalsy();
            expect(schedulerService.videos[1].date).toEqual(resultDate);
        });
    });

    describe('validateVideoTitle() tests', function() {
        it('should return the same videoTitle and add it to the videoCount list', function() {
            schedulerService = createService($rootScope);
            var testTitle = "test";
            var result = schedulerService.validateVideoTitle(testTitle);

            var expectedVideoCounts = {"test": 1};
            
            expect(schedulerService.videoTitleCounts).toEqual(expectedVideoCounts);
            expect(result).toBe("test");
        });

        it('should return the title plus the next number when it already exists', function() {
            schedulerService = createService($rootScope);
            var testTitle = "test";
            schedulerService.videoTitleCounts = {"test": 1}
            var result = schedulerService.validateVideoTitle(testTitle);

            var expectedVideoCounts = {"test": 2};
            expect(schedulerService.videoTitleCounts).toEqual(expectedVideoCounts);
            expect(result).toBe("test_2");
        });
    });
	
});