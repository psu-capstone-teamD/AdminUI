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
		var returnVal = 0;

        beforeEach(function() {
            $scope = {};
            S3Service = createService($rootScope);
        });

        it(', Valid Test, should show return code 0.', function() {
            var file = mockFile;
			file.name = "valid.bin";
			
			S3Service.bucket = { putObject: jasmine.createSpy('putObject') };
			S3Service.bucket.putObject.and.callFake(function(param, someFunction) {
				if(file)
					if (file.name == "valid.bin")
						throw 0;
					else
						throw 1;
			});
			
			expect(S3Service.upload(file)).toThrow(0);
        })
		
		it(', AWS bucket.put Fail Test, should show return code 1.', function() {
			var file = mockFile;
			bucket = jasmine.createSpyObj('bucket', ['putObject']);
			bucket.putObject.and.callFake(function(param, someFunction) {
				if(file)
					if (file.name == "valid.bin")
						throw 0;
					else
						throw 1;
			});
			
			expect(S3Service.upload(file)).toThrow(1);

        })
		
		it(', Invalid File Test, should show return code 2.', function() {
			var file;
            returnVal = S3Service.upload(file);
            expect(returnVal).toEqual(false);
        })
    });
});