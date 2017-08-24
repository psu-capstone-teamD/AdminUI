/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

describe('mediaProcessingService', function(){
	var mediaProcessingService, $rootScope, $q;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	var mockVideo = {file:[{name:"testFile.mp4", 
							size:1024, 
							type:"video/mp4", 
							duration:10,
							id: "",
							style: {},
							src: ""
						}]};
	
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
			spyOnEvent(mediaProcessingService.video, 'onloadedmetadata');
			$(mediaProcessingService.video).trigger('onloadedmetadata');
			findDuration.then(function() {
				$(mediaProcessingService.video).trigger('onloadedmetadata');
				expect($rootScope.videoLength).toBe(10);
				expect($rootScope.fileDuration).toBe("00:00:10");
			}, function(error) {
				console.log("Unable to generate the duration");
			});
		});
		it('should have 01:01:01 duration', function() {
			mockVideo = {file:[{name:"testFile.mp4", 
							size:1024, 
							type:"video/mp4", 
							duration:0,
							id: "",
							style: {},
							src: ""
						}]};
			var findDuration = mediaProcessingService.findDuration(mockVideo, false);
			spyOnEvent(mediaProcessingService.video, 'onloadedmetadata');
			$(mediaProcessingService.video).trigger('onloadedmetadata');
			findDuration.then(function() {
				$(mediaProcessingService.video).trigger('onloadedmetadata');
				expect($rootScope.videoLength).toBe(0);
				expect($rootScope.fileDuration).toBe("00:00:00");
			}, function(error) {
				console.log("Unable to generate the duration");
			});
		});
		it('should have 00:00:00 duration', function() {
			mockVideo = {file:[{name:"testFile.mp4", 
							size:1024, 
							type:"video/mp4", 
							duration:7201,
							id: "",
							style: {},
							src: ""
						}]};
			var findDuration = mediaProcessingService.findDuration(mockVideo, false);
			spyOnEvent(mediaProcessingService.video, 'onloadedmetadata');
			$(mediaProcessingService.video).trigger('onloadedmetadata');
			findDuration.then(function() {
				$(mediaProcessingService.video).trigger('onloadedmetadata');
				expect($rootScope.videoLength).toBe(7201);
				expect($rootScope.fileDuration).toBe("01:01:01");
			}, function(error) {
				console.log("Unable to generate the duration");
			});
		});
		it('should successfully find the duration with isFromS3 set to true', function() {
			var findDuration = mediaProcessingService.findDuration("foo.com", true);
			findDuration.then(function() {

			});
		});
		it('should call the prependLeadingZero functions', function() {
			mockVideo = {file:[{name:"testFile.mp4", 
							size:1024, 
							type:"video/mp4", 
							duration: 4205,
							id: "",
							style: {},
							src: ""
						}]};
			spyOn(document, 'createElement').and.callFake(function() {
				var obj = {src: '', preload: '', duration: 4205};
				return obj;

			});
			var findDuration = mediaProcessingService.findDuration(mockVideo, false);
			spyOnEvent(mediaProcessingService.video, 'onloadedmetadata');
			$(mediaProcessingService.video).trigger('onloadedmetadata');
			findDuration.then(function() {
				$(mediaProcessingService.video).trigger('onloadedmetadata');
				expect($rootScope.fileDuration).toEqual("01:10:05");
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
	describe('generateThumbnail() tests', function() {
		beforeEach(function() {
			mediaProcessingService = createService($rootScope, $q);
			spyOn($rootScope, 'screenshot').and.callFake(function() {
				return null;
			});
		});

		it('should load', function() {
			var generateThumbnail = mediaProcessingService.generateThumbnail(mockVideo, false);
			spyOnEvent(mediaProcessingService.video, "onloadedmetadata");
			spyOnEvent(mediaProcessingService.video, "onloadeddata");
			$(mediaProcessingService.video).trigger('onloadedmetadata');
			$(mediaProcessingService.video).trigger('onloadeddata');
			generateThumbnail.then(function(result) {
				$(mediaProcessingService.video).trigger('onloadedmetadata');
				$(mediaProcessingService.video).trigger('onloadeddata');
			});
			var generateThumbnail = mediaProcessingService.generateThumbnail("foo.com", true);
			generateThumbnail.then(function(result) {
			});
		});
	});
	describe('$rootscope.screenshot() tests', function() {
		beforeEach(function() {
			mediaProcessingService = createService($rootScope, $q);

			// Create a mock canvas object
			spyOn(document, 'createElement').and.callFake(function() {
				var obj = new Object();
				obj.getContext = function(arg) {
					var obj2 = new Object();
					obj2.drawImage = function() {
						return "0";
					}
					return obj2;
				}
				obj.style = {width: "", height: ""};
				obj.toDataURL = function(arg) {
					return "abcd1234";
				}
				return obj;
			})
		});
		it('should load correctly', function() {
			var screenshot = $rootScope.screenshot(mockVideo);
			expect(screenshot).not.toBeNull();
		});
	});
});