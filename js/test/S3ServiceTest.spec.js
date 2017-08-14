describe('S3Service', function(){
	var S3Service, $rootScope, $q, $httpBackend;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	var mockVideo = {file:[{"name":"testFile.mp4", "size":1024, "type":"video/mp4"}]};
	
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
		$rootScope = $injector.get('$rootScope');
		$q = $injector.get('$q');
		$httpBackend = $injector.get('$httpBackend');
        createService = function($httpBackend, $rootScope, $q) {
            return $injector.get('S3Service');
        }
    }));
	
	describe('SetBucket Test', function() {
		beforeEach((function(){
			S3Service = createService($httpBackend, $rootScope, $q);
		}));
		
        it('should exist', function() {
            expect(S3Service.setBucket).toBeDefined();
		});
		
		it('should make the bucket defined', function() {
			expect(S3Service.bucket).toBeUndefined();
			spyOn(S3Service, 'setBucket').and.callThrough();
			S3Service.setBucket(mockFile);
			expect(S3Service.setBucket).toHaveBeenCalled();
			expect(S3Service.bucket).toBeDefined();
		});
	});

	describe('Upload Test', function() {
		
		beforeEach((function(){
			S3Service = createService($httpBackend, $rootScope, $q);
		}));
		
		it('should let notify the user that upload has started', function() {
			var mockBucket = { putObject: function (param, callback) {
												callback(false, "Ok"); 
												return mockBucket;
											},
								 on: function(eventname, callback) {
										return mockBucket;
									}
			};
			spyOn(toastr, "info");
			spyOn(mockBucket, "putObject").and.callThrough();
			spyOn(mockBucket, "on");
			S3Service.upload(mockVideo, mockBucket);

			expect(mockBucket.putObject).toHaveBeenCalled();
			expect(mockBucket.on).toHaveBeenCalled();
			expect(S3Service.bucket).toBe(mockBucket);
			expect(toastr.info).toHaveBeenCalled();
			
		});
		
		it('should return rejected promise', function(done) {
			var rejected;
			var promise;
			var mockBucket = { putObject: function (param, callback) {
												var err = {message: "OK", code: 123};
												callback(err, null); 
												return mockBucket;
											},
								 on: function(eventname, callback) {
										return mockBucket;
									}
			};
			spyOn(mockBucket, "putObject").and.callThrough();
			spyOn(mockBucket, "on");
			promise = S3Service.upload(mockVideo, mockBucket);
			promise.then(function(result) {
				rejected = "NotOK";
			}, function(error) {
				rejected = error.message;
			})
			$rootScope.$digest();
			done();
			expect(rejected).toBe("OK");
		});
		
		it('should return resolved promise', function(done) {
			S3Service = createService($httpBackend, $rootScope, $q);
			var resolved;
			var promise;
			var mockBucket = { putObject: function(param, callback) {
									var data = {message: "OK", code: 123};
									callback(false, data); 
									return mockBucket;
								},
								 on: function(eventname, callback) {
										return mockBucket;
									}
			};
			spyOn(mockBucket, "putObject").and.callThrough();
			spyOn(mockBucket, "on");
			promise = S3Service.upload(mockVideo, mockBucket)
			promise.then(function(result) {
				resolved = result.message;
			}, function(error) {
				resolved = "NotOK";
			})
			$rootScope.$digest();
			done();
			expect(resolved).toBe("OK");
			
		});
		
		it('should broadcast progress', function() {
			spyOn($rootScope, '$broadcast');
			var mockBucket = { putObject: function (param, callback) {
									return S3Service.bucket;
								},
								 on: function(eventname, callback) {
										var progress = {loaded: 100, total: 100}; 
										callback(progress);
										return progress;
									}
			};
			var result = S3Service.upload(mockVideo, mockBucket);
			spyOn(mockBucket, 'putObject').and.callThrough();
			spyOn(mockBucket, 'on').and.callThrough();
			expect($rootScope.$broadcast).toHaveBeenCalledWith('progressEvent', {loaded: 100, total: 100});
		});
	});
	
	describe('getItemsInBucket() tests', function() {
		beforeEach((function(){
			S3Service = createService($httpBackend, $rootScope, $q);
		}));
		
		it('should return rejected promise', function(done) {
			var promise;
			var rejected;
			var mockBucket = { listObjects: function(param, callback) {
									var err = {message: "OK", code: 123};
									callback(err, null); 
									return mockBucket;
								}
			};
			spyOn(mockBucket, "listObjects").and.callThrough();
			promise = S3Service.getItemsInBucket(null, mockBucket); // Not sure what S3Objects in param is for
			promise.then(function(result) {
				rejected = "NotOK";
			}, function(err) {
				rejected = err.message;
			})
			$rootScope.$digest();
			done();
			expect(rejected).toBe("OK");
		});
		it('toastr error method should have been called', function(done) {
			var promise;
			var resolved;
			var mockBucket = { listObjects: function(param, callback) {
									var data = {message: "OK", code: 123, 
												Contents: [{length: 1, Key: "123", ETag: 123}]
												};
									callback(null, data); 
									return mockBucket;
								},
								getSignedUrl: function(type, target, callback) {
									var err = "OK"
									callback(err, null);
								}
			};
			spyOn(toastr, "error");
			spyOn(mockBucket, "getSignedUrl").and.callThrough();
			spyOn(mockBucket, "listObjects").and.callThrough();
			promise = S3Service.getItemsInBucket(null, mockBucket); // Not sure what S3Objects in param is for
			expect(mockBucket.getSignedUrl).toHaveBeenCalled();
			promise.then(function(result) {
				resolved = result;
			}, function(err) {
				resolved = "NotOk";
			})
			$rootScope.$digest();
			done();
			expect(resolved.length).toBe(0);
			expect(toastr.error).toHaveBeenCalled();
		});
		it('should return resolved promise with the item to return', function(done){
			var promise;
			var resolved;
			var mockContent = [{length: 1, Key: "123", ETag: "123", LastModified : "Now"}];
			var mockUrl = "mockUrl";
			var mockBucket = { 	listObjects: function(param, callback) {
												var data = {message: "OK", code: 123, 
														Contents: mockContent
														};
												callback(null, data); 
												return mockBucket;
											},
											
								getSignedUrl: function(type, target, callback) {
									var mockUrl2 = mockUrl;
									var err = "OK";
									callback(null, mockUrl2);
								}
			};
			spyOn(toastr, "error");
			spyOn(mockBucket, "getSignedUrl").and.callThrough();
			spyOn(mockBucket, "listObjects").and.callThrough();
			promise = S3Service.getItemsInBucket(null, mockBucket); // Not sure what S3Objects in param is for
			promise.then(function(result) {
				resolved = result;
			}, function(err) {
				resolved = "NotOk";
			})
			expect(mockBucket.getSignedUrl).toHaveBeenCalled();
			expect(toastr.error).not.toHaveBeenCalled();
			$rootScope.$digest();
			done();
			expect(resolved.length).toBe(1);
			expect(resolved).toEqual([{title: mockContent[0].ETag, date: mockContent[0].LastModified, url: mockUrl, tag: mockContent[0].ETag}]);
		});
	});
	
	describe('retrieveThumbnail() tests', function() {
		beforeEach((function(){
			S3Service = createService($httpBackend, $rootScope, $q);
		}));
		
		it('should return rejected promise and called toastr error', function(done) {
			var promise;
			var rejected;
			var mockFilename = "123";
			var mockBucket = {getSignedUrl: function(type, target, callback) {
												var err = "OK";
												callback(err, null);
											}
			};
			spyOn(toastr, "error");
			spyOn(mockBucket, "getSignedUrl").and.callThrough();
			promise = S3Service.retrieveThumbnail(mockFilename, mockBucket);
			promise.then(function(result) {
				rejected = "NotOK";
			}, function(err) {
				rejected = err;
			})
			expect(mockBucket.getSignedUrl).toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
			$rootScope.$digest();
			done();
			expect(rejected).toBe("OK");
		});
		it('should return resolved promise', function(done) {
			var promise;
			var resolved;
			var mockFilename = "123";
			var mockUrl = "mockUrl";
			var mockBucket = {getSignedUrl: function(type, target, callback) {
												var data = "Thumbnail";											
												callback(null, data);
											}
			};
			spyOn(toastr, "error");
			spyOn(mockBucket, "getSignedUrl").and.callThrough();
			promise = S3Service.retrieveThumbnail(mockFilename, mockBucket);
			promise.then(function(result) {
				resolved = result;
			}, function(err) {
				resolved = "NotOk";
			})
			expect(mockBucket.getSignedUrl).toHaveBeenCalled();
			expect(toastr.error).not.toHaveBeenCalled();
			$rootScope.$digest();
			done();
			expect(resolved).toEqual("Thumbnail");
		});
	});
	
	describe('convertDataURIToBlob() tests', function() {
		beforeEach((function(){
			S3Service = createService($httpBackend, $rootScope, $q);
		}));
		it('should return a Blob object', function() {
			var mockURI = "base64,MTIzNDU=";
			var result = $rootScope.convertDataURIToBlob(mockURI);
			expect((result instanceof Blob)).toEqual(true);
		});
	});
});