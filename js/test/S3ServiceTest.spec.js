describe('S3Service', function(){
	
	var S3Service, $rootScope;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	
	//Load adminUI module
	beforeEach(angular.mock.module('adminUI'));
	
	//Inject rootScope dependency for service
	
	beforeEach(inject(function($injector){
		$rootScope = $injector.get('$rootScope');
		
		//Create function that will inject S3Service
		createService = function($httpBackend) {
            return $injector.get('S3Service');
        }
	}));

	
	describe(', Upload Tests', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            S3Service = createService($rootScope);
        });

        it(', Valid Test, should show return code 0.', function() {
            var file = mockFile;
			returnVal = S3Service.upload(file);
			expect(returnVal).toEqual(0);
        })
		
		it(', AWS bucket.put Fail Test, should show return code 1.', function() {
			var file = mockFile;
			S3Service.creds = {
				bucket: 'pdxteamdkrakatoa',
				access_key: 'Invalid',
				secret_key: 'Invalid'
			}
            returnVal = S3Service.upload(file);
            expect(returnVal).toEqual(1);
        })
		
		it(', Invalid File Test, should show return code 2.', function() {
			var file;
            returnVal = S3Service.upload(file);
            expect(returnVal).toEqual(2);
        })
    });
});