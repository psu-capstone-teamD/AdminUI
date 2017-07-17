describe('PlaylistController', function () {
    beforeEach(angular.mock.module('adminUI'));

    var $controller;
    var mockFile = { file: [{ "name": "file.bin", "size": 1018, "type": "application/binary" }] };

    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('$scope.upload uploads file', function () {
        var $scope, controller;

        beforeEach(function () {
            $scope = {};
            controller = $controller('PlaylistController', { $scope: $scope });
        });

        it('uploads form', function () {
            $scope.title = "Some title";
            $scope.file = mockFile;
            $scope.category = "Some category";
            $scope.order = "1";
            returnVal = $scope.upload();
            expect($scope.title).toEqual(null);
            expect($scope.category).toEqual('');
            expect($scope.order).toEqual('');
        })
    });

    describe('$scope.upload fails to upload file', function () {
        var $scope, controller;

        beforeEach(function () {
            $scope = {};
            controller = $controller('PlaylistController', { $scope: $scope });
        });

        it('uploads form', function () {
            $scope.title = "Some title";
            $scope.category = "Some category";
            $scope.order = "1";
            returnVal = $scope.upload();
            console.log($scope);
            spyon(controller, "upload");
            expect($scope.title).toEqual("Some title");
            expect($scope.category).toEqual("Some category");
            expect($scope.order).toEqual("1");
        })
    });
});


