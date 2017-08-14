describe('PlaylistControllerTests', function(){
	var S3Service, schedulerService, PlaylistController, $scope, $rootScope, $q, $interval, uuid, BXFGeneratorService, mediaAssetsService, currentVideoStatusService;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	var mockVideo = new Blob([""], { type: 'video/mp4', size: 1024, duration: 60});
	
	beforeEach(angular.mock.module('adminUI'));
	/*
$scope', 
                                       '$rootScope', 
                                       'S3Service', 
                                       'BXFGeneratorService', 
                                       '$q',
                                       '$interval', 
                                       'uuid', 
                                       'schedulerService', 
                                       'currentVideoStatusService', 
                                       'mediaAssetsService',
	*/

    beforeEach(inject(function($injector, _$rootScope_, $controller, _$q_, _$interval_, _S3Service_, _BXFGeneratorService_, _mediaAssetsService_, _schedulerService_, _uuid_, _currentVideoStatusService_) {
		$rootScope = _$rootScope_;
		$scope = $rootScope;
        createS3Service = function($rootScope) {
            return $injector.get('S3Service');
        };
        createSchedulerService = function($rootScope) {
            return $injector.get('schedulerService');
		};
		createBXFGeneratorService = function($rootScope) {
			return $injector.get('BXFGeneratorService');
		};
		createMediaAssetsService = function($rootScope) {
			return $injector.get('mediaAssetsService');
		};
		createCurrentVideoStatusService = function($rootScope) {
			return $injector.get('currentVideoStatusService');
		};

       $q = _$q_;
	   uuid = _uuid_;
	   $interval = _$interval_;
       S3Service = createS3Service($scope);
	   schedulerService = createSchedulerService($scope);
	   mediaAssetsService = createMediaAssetsService($scope);
	   BXFGeneratorService = createBXFGeneratorService($scope);
	   currentVideoStatusService = createCurrentVideoStatusService($scope);
	
       createPlaylistController = function() {
           return $controller('PlaylistController', {
               '$scope': $scope,
               '$rootScope': $rootScope,
               'S3Service': S3Service,
			   '$q': $q,
			   '$interval': $interval,
               'uuid': uuid,
			   'schedulerService': schedulerService,
			   'mediaAssetsService': mediaAssetsService,
			   'BXFGeneratorService': BXFGeneratorService,
			   'currentVideoStatusService': currentVideoStatusService

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
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService);
            expect($scope.videos).toEqual(schedulerService.videos);
            expect($scope.uploadProgress).toBe(0);
            expect($scope.fileDuration).toBe("");
            expect($scope.fileThumbnail).toBeNull();
            expect($scope.startTime).toBe("");
            expect($scope.videoLength).toBe(0);
        });
    });
	
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

            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService);

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
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService);
            // Need to be able to create a mock video file to successfully test...
        });
    });
	
	describe('reorder() tests', function() {
		beforeEach((function(){
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService);
		}));
		it('should return 0 when there are no videos in the playlist', function() {
			expect($scope.reorder(1)).toBe(0);
		});
		it('should return 0 on neworder value lesser than 0', function(){
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'} ];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = -1;
			expect($scope.reorder(2)).toBe(0);
		});
		it('should return 0 when the newOrder value greater than $scope.videoCount', function(){
			$scope.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'} ];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = 99;
			expect($scope.reorder(1)).toBe(0);
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
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService);
			schedulerService.videos = [{num: 1, order: '1'}, {num: 2, order: '2'}, {num: 3, order: '3'} ];
			$scope.videos = schedulerService.videos;
			$scope.videoCount = $scope.videos.length;
			var preCount = $scope.videos.length;
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
	
	describe('statusFilter() tests', function() {
		beforeEach((function(){
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService);
		}));
		it('should return true with "ok" video lifeStatus', function() {
			var mockVideo = {liveStatus: "ok"};
			var returnValue = $rootScope.statusFilter(mockVideo);
			expect(returnValue).toBe(true);
		});
		it('should return true with "pending" video lifeStatus', function() {
			var mockVideo = {liveStatus: "ok"};
			var returnValue = $rootScope.statusFilter(mockVideo);
			expect(returnValue).toBe(true);
		});
		it('should return false with other video lifeStatus', function() {
			var mockVideo = {liveStatus: "foo"};
			var returnValue = $rootScope.statusFilter(mockVideo);
			expect(returnValue).toBe(false);
		});
	});
});