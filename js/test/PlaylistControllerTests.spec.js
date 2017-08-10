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
	describe('reorder() tests', function() {
		beforeEach((function(){
			PlaylistController = createPlaylistController($scope, S3Service, $q, uuid, schedulerService);
		}));
		it('should return 0 when there are no video on the playlist', function() {
			expect($scope.reorder(1)).toBe(0);
		});
		it('should return 1 on neworder value lesser than 0', function(){
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'} ];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = -1;
			expect($scope.reorder(1)).toBe(1);
		});
		it('should return 1 when the newOrder value greater than $scope.videoCount', function(){
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'} ];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = 99;
			expect($scope.reorder(1)).toBe(1);
		});
		it('should return 1 when the newOrder value is equivalent to the oldOrder value', function(){
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'} ];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = 1;
			expect($scope.reorder(1)).toBe(2);
		});
		it('should call schedulerService.playlistChanged after reordering', function(){
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = 2;
			spyOn(schedulerService, 'playlistChanged');
			
			expect($scope.reorder(1)).toBe(0);
			
			expect(schedulerService.playlistChanged).toHaveBeenCalled();
		});
		it('should reorder from a lower order to a higher order properly', function(){
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'}, {num: 4, order: '4'}, {num: 5, order: '5'} ];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = 4;
			
			expect($scope.reorder(2)).toBe(0);
			
			expect($scope.videos[0].num).toBe(1);
			expect($scope.videos[0].order).toBe('1');
			expect($scope.videos[1].num).toBe(3);
			expect($scope.videos[1].order).toBe('2');
			expect($scope.videos[2].num).toBe(4);
			expect($scope.videos[2].order).toBe('3');
			expect($scope.videos[3].num).toBe(2);
			expect($scope.videos[3].order).toBe('4');			
			expect($scope.videos[4].num).toBe(5);
			expect($scope.videos[4].order).toBe('5');
		});
		it('should reorder from to a higher order to a lower order properly', function(){
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'}, {num: 4, order: '4'}, {num: 5, order: '5'} ];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = 2;
			
			expect($scope.reorder(4)).toBe(0);
			
			expect($scope.videos[0].num).toBe(1);
			expect($scope.videos[0].order).toBe('1');
			expect($scope.videos[1].num).toBe(4);
			expect($scope.videos[1].order).toBe('2');
			expect($scope.videos[2].num).toBe(2);
			expect($scope.videos[2].order).toBe('3');
			expect($scope.videos[3].num).toBe(3);
			expect($scope.videos[3].order).toBe('4');			
			expect($scope.videos[4].num).toBe(5);
			expect($scope.videos[4].order).toBe('5');
		});
	});
	describe('remove() tests', function() {
		it('should remove a video from the playlist properly', function(){
			PlaylistController = createPlaylistController($scope, S3Service, $q, uuid, schedulerService);
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'} ];
			var preCount = $scope.videoCount = $scope.videos.length;
			spyOn(schedulerService, 'playlistChanged');
			
			$scope.remove(2);
			
			expect(schedulerService.playlistChanged).toHaveBeenCalled();
			expect($scope.videoCount).toBe(preCount-1);
			expect($scope.videos[0].num).toBe(1);
			expect($scope.videos[0].order).toBe('1');
			expect($scope.videos[1].num).toBe(3);
			expect($scope.videos[1].order).toBe('2');
		});
	});
});