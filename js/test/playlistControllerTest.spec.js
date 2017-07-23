describe('PlaylistController', function () {
    beforeEach(angular.mock.module('adminUI'));

    var $controller;
    var mockFile = { file: [{ "name": "file.bin", "size": 1018, "type": "application/binary" }] };

    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('$scope.upload uploads file', function () {
        var $scope, $q, deferred, controller, S3Service;

        beforeEach(function () {
			inject(function($injector) {
				$q = $injector.get('$q');
				deferred = $q.defer();
				S3Service = $injector.get('S3Service');
				spyOn(S3Service, 'setBucket').and.returnValue('ok');
				spyOn(S3Service, 'upload').and.callFake(function() {
					return deferred.promise;
				});
				$scope = $injector.get('$rootScope').$new();
				controller = $controller('PlaylistController', { $scope: $scope, S3Service: S3Service});
			});
        });

        it('uploads form', function () {
            $scope.title = "Some title";
            $scope.file = mockFile;
            $scope.category = "Some category";
            $scope.order = "1";
			deferred.resolve('ok');
			$scope.$apply();
            returnVal = $scope.upload();
            expect($scope.title).toEqual(null);
            expect($scope.category).toEqual('');
            expect($scope.order).toEqual('');
        })
    });

    describe('$scope.upload fails to upload file', function () {
        var $scope, $q, deferred, controller;

        beforeEach(function () {
			inject(function($injector) {
				$scope = $injector.get('$rootScope').$new();
				controller = $controller('PlaylistController', { $scope: $scope });
			});
        });

        it('uploads form', function () {
            $scope.title = "Some title";
            $scope.category = "Some category";
            $scope.order = "1";
            returnVal = $scope.upload();
            expect($scope.title).toEqual("Some title");
            expect($scope.category).toEqual("Some category");
            expect($scope.order).toEqual("1");
        })
    });
});


