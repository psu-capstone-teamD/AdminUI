describe('S3Service', function(){
	var S3Service, $rootScope, $q, $httpBackend;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	var mockVideo = {file:[{"name":"testFile.mp4", "size":1024, "type":"video/mp4"}]};
	
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
		$rootScope = $injector.get('$rootScope');
        createService = function($rootScope) {
            return $injector.get('S3Service');
        }
		$q = $injector.get('$q');
		$httpBackend = $injector.get('$httpBackend');
    }));
	
	describe('SetBucket Test', function() {
		beforeEach((function(){
			S3Service = createService($rootScope);
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
		/*
		beforeEach((function(){

		}));
		
        it('should exist', function() {
            expect(S3Service.upload).toBeDefined();
		});*/
		/*
		it('should resolve the promise on success', function() {
			$rootScope.creds = {

				bucket : 'pdxteamdkrakatoa',
				access_key : 'replace',
				secret_key: 'replace'
			};
			S3Service = createService($rootScope);
			S3Service.setBucket(mockFile);
			var promise = S3Service.upload(mockFile);
			$rootScope.$digest();
			console.log(promise);
			promise.then(function (success) {
				expect(success).toBe(true);
				console.log("success");
			}, function (error) {
				expect(error).toBe(false);
				console.log("error");
			});
		});*/
	});
});