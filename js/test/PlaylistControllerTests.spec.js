describe('PlaylistControllerTests', function(){
	var S3Service, schedulerService, PlaylistController, $scope, $q, uuid;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	var mockVideo = new Blob([""], { type: 'video/mp4', size: 1024, duration: 60});
	
    beforeEach(angular.mock.module('adminUI'));

    beforeEach(inject(function($injector, $rootScope, $controller, _$q_, _S3Service_, _schedulerService_, _uuid_) {
        $scope = $rootScope;
        createS3Service = function($rootScope) {
            return $injector.get('S3Service');
        };
        createSchedulerService = function($rootScope) {
            return $injector.get('schedulerService');
        };

       $q = _$q_;
       uuid = _uuid_;
       S3Service = createS3Service($scope);
       schedulerService = createSchedulerService($scope);
       createPlaylistController = function() {
           return $controller('PlaylistController', {
               '$scope': $scope,
               '$rootScope': $rootScope,
               'S3Service': S3Service,
               '$q': $q,
               'uuid': uuid,
               'schedulerService': schedulerService
           });
       }
    }));
    
    describe('initial load tests', function() {
        it('should correctly bind $scope variables', function() {
            // Bind $scope's variables to different things to ensure bindings are correct
            $scope.videos = 123;
            $scope.uploadProgress = 123;
            $scope.fileDuration = 123;
            $scope.fileThumbnail = 123;
            $scope.startTime = 11122223333;
            $scope.videoLength = 123;

            // Create the controller, which binds $scope's variables
            PlaylistController = createPlaylistController($scope, S3Service, $q, uuid, schedulerService);
            expect($scope.videos).toEqual(schedulerService.videos);
            expect($scope.uploadProgress).toBe(0);
            expect($scope.fileDuration).toBe("");
            expect($scope.fileThumbnail).toBeNull();
            expect($scope.startTime).toBe("");
            expect($scope.videoLength).toBe(0);
        });
    })
    describe('resetForm() tests', function() {
        it('should correctly reset the form', function() {
            // Bind $scope's variables to different things to ensure bindings are correct
            $scope.title = 123;
            $scope.category = 123;
            $scope.order = 123;
            $scope.uploadProgress = 123;
            $scope.startTime = 11122223333;
            $scope.videoStartTime = 1123;
            $scope.file = 123;

            PlaylistController = createPlaylistController($scope, S3Service, $q, uuid, schedulerService);

            $scope.resetForm();
            expect($scope.title).toBeNull();
            expect($scope.category).toBe("");
            expect($scope.order).toBe("");
            expect($scope.uploadProgress).toBe(0);
            expect($scope.startTime).toBe("");
            expect($scope.file).toBeNull();
        });
    });
    describe('findDuration() tests', function() {
        it('should generate the correct duration given a file', function() {
            PlaylistController = createPlaylistController($scope, S3Service, $q, uuid, schedulerService);
            // Need to be able to create a mock video file to successfully test...
        });
    });
});