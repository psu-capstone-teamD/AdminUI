describe('mediaProcessingService', function(){
	var mediaProcessingService, $rootScope, $q;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	var mockVideo = {file:[{"name":"testFile.mp4", "size":1024, "type":"video/mp4", "duration":10}]};
	
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
		$rootScope = $injector.get('$rootScope');
		$q = $injector.get('$q');
        createService = function($rootScope, $q) {
            return $injector.get('mediaProcessingService');
        }
	}));
	
	describe('findDuration() tests', function() {
		beforeEach(function() {
			mediaProcessingService = createService($rootScope, $q);
			$rootScope.videoLength = "";
			$rootScope.fileDuration = "";
		});
		it('should successfully find the duration', function() {
			var findDuration = mediaProcessingService.findDuration(mockVideo, false);
			findDuration.then(function() {
			$(document).trigger(onloadedmetadata);
				console.log($rootScope.fileDuration);
				expect($rootScope.videoLength).toBe(10);
				expect($rootScope.fileDuration).toBe("00:00:10");
			}, function(error) {
				console.log("Unable to generate the duration");
			});
		});
	});
	
	describe('prependLeadingZero() tests', function() {
		beforeEach(function() {
			mediaProcessingService = createService($rootScope, $q);
		});

		it('should attach a leading zero if the input is less than 10', function() {
			var result = $rootScope.prependLeadingZero(5);
			expect(result).toBe("05");

		});
		it('should just return the number if the input is greater than 10', function() {
			var result = $rootScope.prependLeadingZero(10);
			expect(result).toBe(10);

			result = $rootScope.prependLeadingZero(123);
			expect(result).toBe(123);
		});

		it("should return the number even if negative", function() {
			var result = $rootScope.prependLeadingZero(-1);
			expect(result).toBe(-1);
		});
	});
});