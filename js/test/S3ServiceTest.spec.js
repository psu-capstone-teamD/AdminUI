describe('S3Service', function(){
	var S3Service, $rootScope, $q;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
        createService = function() {
            return $injector.get('S3Service');
        }
		$q = $injector.get('$q');
		$rootScope = $injector.get('$rootScope');
    }));
	
	describe('Upload Test', function() {
		beforeEach((function(){
			S3Service = createService();
		}));
		
        it('should exist', function() {
            expect(S3Service.upload).toBeDefined();
		});
    });
	
	describe('SetBucket Test', function() {
		beforeEach((function(){
			S3Service = createService();
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
});