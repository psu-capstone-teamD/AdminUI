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
});