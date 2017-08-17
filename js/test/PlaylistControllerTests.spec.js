describe('PlaylistControllerTests', function(){
	var S3Service, schedulerService, PlaylistController, $scope, $rootScope, $q, $interval, uuid, BXFGeneratorService, mediaAssetsService, currentVideoStatusService, mediaProcessingService;
	var mockFile = {file:[{"name":"file.bin", "size":1024, "type":"application/binary"}]};
	var mockVideo = new Blob([""], { type: 'video/mp4', size: 1024, duration: 60});
	
	beforeEach(angular.mock.module('adminUI'));

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
		creatMediaProcessingService = function($rootScope) {
			return $injector.get("mediaProcessingService");
		};

       $q = _$q_;
	   uuid = _uuid_;
	   $interval = _$interval_;
       S3Service = createS3Service($scope);
	   schedulerService = createSchedulerService($scope);
	   mediaAssetsService = createMediaAssetsService($scope);
	   BXFGeneratorService = createBXFGeneratorService($scope);
	   currentVideoStatusService = createCurrentVideoStatusService($scope);
	   mediaProcessingService = creatMediaProcessingService($scope);
	
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
			   'currentVideoStatusService': currentVideoStatusService,
			   'mediaProcessingService': mediaProcessingService
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
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
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

            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);

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
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
            // Need to be able to create a mock video file to successfully test...
        });
    });
	
	describe('reorder() tests', function() {
		beforeEach((function(){
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
		}));
		it('should return 0 when there are no videos in the playlist', function() {
			expect($scope.reorder(1)).toBe(0);
		});
		it('should return 0 when the source video is locked', function() {
			$scope.videos = [{num: 1, order: '1', liveStatus: "running"}, {num: 2, order: '2', liveStatus: "pending"}];
			$scope.videoCount = $scope.videos.length;
			$scope.newOrder = 2;
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
		beforeEach((function(){
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
		}));
		it('should return -1 on a null order', function(){
			spyOn(toastr, 'error');
			var returnValue = $scope.remove(null);
			expect(returnValue).toBe(-1);
			expect(toastr.error).toHaveBeenCalled();
		});
		it('should return -1 if video is playing in Live', function(){
			$scope.videos = [{liveStatus: "running", videoPlayed: false}];
			spyOn(toastr, 'error');
			var returnValue = $scope.remove(1);
			expect(returnValue).toBe(-1);
			expect(toastr.error).toHaveBeenCalled();
		});

		it('should return -1 if video is pending in Live', function(){
			$scope.videos = [{liveStatus: "pending", videoPlayed: false}];
			spyOn(toastr, 'error');
			var returnValue = $scope.remove(1);
			expect(returnValue).toBe(-1);
			expect(toastr.error).toHaveBeenCalled();
		});
		
		it('should remove a video from the playlist properly', function(){
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
            PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
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
	
    describe('verifyOrder() tests', function() {
		beforeEach((function(){
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
		}));

		it('should return true when the videos are in correct order', function() {
			$scope.videos = [{order: 1}, {order: 2}, {order: 3}];
			var result = $scope.verifyOrder();
			expect(result).toBeTruthy();
		});

		it('should return false when the videos are in incorrect order', function() {
			$scope.videos = [{order: 1}, {order: 3}, {order: 2}];
			var result = $scope.verifyOrder();
			expect(result).toBeFalsy();
		});
	});
	
	describe('setRowColor() tests', function() {
		beforeEach((function(){
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
		}));	
		
		it('should set the color to red', function() {
			var expectedResult = {'background-color': "#e0827b"}
			var result = $scope.setRowColor("running");
			expect(result).toEqual(expectedResult);
		});

		it('should set the color to yellow', function() {
            var expectedResult = {'background-color': "#eef27b"} 
			var result = $scope.setRowColor("pending");
			expect(result).toEqual(expectedResult);
		});

		it('should set the color to green', function() {
			var expectedResult = {'background-color': '#42f483'} 
			var result = $scope.setRowColor("done");
			expect(result).toEqual(expectedResult);
		});

		it('should return nothing for anything else', function() {
			var result = $scope.setRowColor("foobar");
			expect(result).toBe(undefined);
		});
	});
	
	describe('markVideosAsDone() tests', function() {
		beforeEach((function(){
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
		}));		
		it('should just return the videos back on invalid input', function() {
			schedulerService.videos = [{order: 1, liveStatus: "ok"}, {order: 2, liveStatus: "ok"}, {order: 3, liveStatus: "ok"}];
			var order = -1;
			var result = $scope.markVideosAsDone(order);
			expect(result).toEqual(schedulerService.videos);

			order = 10;
			result = $scope.markVideosAsDone(order);
			expect(result).toEqual(schedulerService.videos);

		});
		it('should only mark videos 1 and 2 as done if 2 is given', function() {
			schedulerService.videos = [{order: 1, liveStatus: "ok"}, {order: 2, liveStatus: "ok"}, {order: 3, liveStatus: "ok"}];
			var expectedResult = schedulerService.videos;
			expectedResult[0].liveStatus = "done";
			expectedResult[1].liveStatus = "done";

			var result = $scope.markVideosAsDone(2);
			expect(result).toEqual(expectedResult);
		});
		it('should mark everything as done if 3 is given', function() {
			schedulerService.videos = [{order: 1, liveStatus: "ok"}, {order: 2, liveStatus: "ok"}, {order: 3, liveStatus: "ok"}];
			var expectedResult = schedulerService.videos;
			expectedResult[0].liveStatus = "done";
			expectedResult[1].liveStatus = "done";
			expectedResult[2].liveStatus = "done";

			var result = $scope.markVideosAsDone(3);
			expect(result).toEqual(expectedResult);
		})
	});
	describe('generateStartTime() tests', function() {
		beforeEach(function() {
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
		});
		it('should not do anything if the videos exist', function() {
			schedulerService.videos = [1, 2, 3];
			$scope.videos = schedulerService.videos;
			var result = $scope.generateStartTime();
			expect(result).toBe(0);
		});
		it('should correctly set schedulerService.initialStartTime if it has not been set', function() {
			var possibleValues = ["00:00:30",
								  "00:05:00",
								  "00:10:00",
								  "00:30:00",
								  "01:00:00",
								  "24:00:00",
								  "99:99:99"
								 ];
			possibleValues.forEach(function(val) {
				schedulerService.initialStartTime = '';
				$scope.videoStartTime = val;
				var expectedResult = new Date();
				switch ($scope.videoStartTime) {
							case "00:00:30":
								expectedResult.setSeconds(expectedResult.getSeconds() + 30);
								break;
							case "00:05:00":
								expectedResult.setMinutes(expectedResult.getMinutes() + 5);
								break;
							case "00:10:00":
								expectedResult.setMinutes(expectedResult.getMinutes() + 10);
								break;
							case "00:30:00":
								expectedResult.setMinutes(expectedResult.getMinutes() + 30);
								break;
							case "01:00:00":
								expectedResult.setHours(expectedResult.getHours() + 1);
								break;
							case "24:00:00":
								expectedResult.setDate(expectedResult.getDate() + 1);
								break;
							default:
								expectedResult.setDate(expectedResult.getDate() + 1);
								break;
				}	
				var result = $scope.generateStartTime();	
				expect(result).toBe(1);
			    expect(schedulerService.initialStartTime.getDate()).toEqual(expectedResult.getDate());
			});
		});
		it('should correct set scheudlerService.initialStartTime if it is already set', function() {
			schedulerService.initialStartTime = new Date();
			var expectedResult = schedulerService.initialStartTime.getDate();

			var result = $scope.generateStartTime();
			expect(result).toBe(1);
			expect($scope.startTime).toEqual(expectedResult);
		});
	});

	describe('addToPlaylist() tests', function() {
		beforeEach(function() {
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
			$rootScope.fileDuration = "00:00:10";
			$rootScope.fileThumbnail = null;
			$rootScope.videoLength = 10;
			$scope.startTime = new Date();
			$scope.title = "test";
			$scope.file = {name: "test_file.mp4"};
			$scope.videos = [];
			$scope.order = "";
			$scope.videoCount = "";

			spyOn($rootScope, '$broadcast');
		});

		it('should correctly set default values for empty category and order values', function() {
			$scope.category = "";
			$scope.order = "";
			$scope.addToPlaylist();
			$scope.videoCount = null;

			expect($scope.videos[0].category).toEqual("TV Show");
			expect($scope.videos[0].order).toEqual(1);

		});

		it('should correctly set the order if it already exists', function() {
			$scope.order = "";
			$scope.videoCount = 1;
			$scope.addToPlaylist();

			expect($scope.videos[0].order).toEqual(2);
		});

		it('should correctly set the order and category if provided, along with the other values', function() {
			$scope.category = "Advertisement";
			$scope.order = 2;
			$scope.videoCount = 1;
			$scope.addToPlaylist();

			expect($scope.videos[0].title).toEqual($scope.title);
			expect($scope.videos[0].file).toEqual($scope.file.name);
			expect($scope.videos[0].category).toEqual($scope.category);
			expect($scope.videos[0].order).toEqual(2);
			expect($scope.videos[0].duration).toEqual($rootScope.fileDuration);
			expect($scope.videos[0].thumbnail).toBeNull();
			expect($scope.videos[0].date).toEqual($scope.startTime);
			expect($scope.videos[0].totalSeconds).toEqual($rootScope.videoLength);
			expect($scope.videos[0].liveStatus).toEqual("ok");
			expect($scope.videos[0].videoPlayed).toEqual(false);
			expect($scope.videos[0].uuid).not.toBeNull();
			
			expect($scope.videoCount).toEqual(2);

			expect($rootScope.$broadcast).toHaveBeenCalledWith('VideoCountChanged', $scope.videoCount);
		});

		it('should correctly reorder the playlist if added somewhere else in the playlist', function() {
			$scope.category = "Advertisement";
			$scope.order = "";
			$scope.videoCount = "";
			$scope.addToPlaylist();
			expect($scope.videoCount).toEqual(1);

			$scope.category = "TV Show";
			$scope.order = 1;
			$scope.newOrder = 1;
			$scope.addToPlaylist();
			expect($scope.videoCount).toEqual(2);
			expect($scope.videos[0].category).toBe("TV Show");
		});
	});

	describe('publish() tests', function() {
		beforeEach(function() {
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
			spyOn(BXFGeneratorService, 'generateBXF').and.callFake(function() {
				console.log("sent playlist");
			});
		});

		it('should call the function from BXFGenerator', function() {
			$scope.publish();
			expect(BXFGeneratorService.generateBXF).toHaveBeenCalled();
		});

		it('should correctly set the variables', function() {
			$scope.videoCount = 1;
			$scope.publish();
			expect($scope.lastVideoOrder).toEqual(1);
			expect($scope.eventRunning).toEqual(true);
		});
	});

	// Contains the mocked out service call return values
	describe('checkLiveStatus() tests', function() {
		beforeEach(function() {
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
			schedulerService.videos = [{order: 1, liveStatus: "ok", uuid: "123"},
									   {order: 2, liveStatus: "ok", uuid: "456"},
									   {order: 3, liveStatus: "ok", uuid: "789"},
										];
			$scope.videos = schedulerService.videos;
			$scope.eventRunning = true;
		});	
		it('should return 0 if there are no videos or the event is not running', function() {
			var result;
			schedulerService.videos = [];
			result = $scope.checkLiveStatus();
			expect(result).toEqual(0);

			$scope.videos = [];
			result = $scope.checkLiveStatus();
			expect(result).toEqual(0);

			$scope.eventRunning = false;
			result = $scope.checkLiveStatus();
			expect(result).toEqual(0);
		});
		describe('test cases based on failure', function() {
			beforeEach(function() {
				schedulerService.videos = [{order: 1, liveStatus: "ok", uuid: "123"},
										{order: 2, liveStatus: "ok", uuid: "456"},
										{order: 3, liveStatus: "ok", uuid: "789"},
											];
				$scope.videos = schedulerService.videos;
				$scope.eventRunning = true;			

				spyOn(currentVideoStatusService, 'getLiveStatus').and.callFake(function() {
					var deferred = $q.defer();
					deferred.resolve("failure");
					return deferred.promise;
				});
			});
			it('should return 0 if there is a failure', function() {

				var result = $scope.checkLiveStatus();
				$scope.$digest(); // This is needed to call the mock function
				result.then(function() {
					expect(result).toEqual(0);
				})
			});
		});
		describe('test cases based on error messages', function() {
			beforeEach(function() {
				schedulerService.videos = [{order: 1, liveStatus: "ok", uuid: "123"},
										{order: 2, liveStatus: "ok", uuid: "456"},
										{order: 3, liveStatus: "ok", uuid: "789"},
											];
				$scope.videos = schedulerService.videos;
				$scope.eventRunning = true;			

				spyOn(currentVideoStatusService, 'getLiveStatus').and.callFake(function() {
					var deferred = $q.defer();
					deferred.resolve({errorMessage: "The function timed out!"});
					return deferred.promise;
				});
			});
			it('should return -1 if there is an error message', function() {

				var result = $scope.checkLiveStatus();
				$scope.$digest(); // This is needed to call the mock function
				result.then(function() {
					expect(result).toEqual(-1);
				})
			});
		});
		describe('test cases based on 400 status code', function() {
			beforeEach(function() {
				schedulerService.videos = [{order: 1, liveStatus: "ok", uuid: "123"},
										{order: 2, liveStatus: "ok", uuid: "456"},
										{order: 3, liveStatus: "ok", uuid: "789"},
											];
				$scope.videos = schedulerService.videos;
				$scope.eventRunning = true;			
				$scope.lastVideoOrder = 3;

				spyOn(currentVideoStatusService, 'getLiveStatus').and.callFake(function() {
					var deferred = $q.defer();
					deferred.resolve({statusCode: "400"});
					return deferred.promise;
				});
				spyOn(schedulerService, 'checkForRemoval').and.callFake(function() {
					return [1, 2, 3];
				});
			});
			it('should return 0 on success and set the variables correctly', function() {

				var result = $scope.checkLiveStatus();
				$scope.$digest(); // This is needed to call the mock function
				result.then(function() {
					$scope.videos.forEach(function(item) {
						expect(item.liveStatus).toEqual("done");
					});
					expect($scope.eventRunning).toEqual(false);
					expect(result).toEqual(0);
				})
			});
		});
		describe('test cases based on 200 status code', function() {
			describe('nothing running, but everything is pending', function() {
				beforeEach(function() {
					schedulerService.videos = [{order: 1, liveStatus: "ok", uuid: "123"},
											{order: 2, liveStatus: "ok", uuid: "456"},
											{order: 3, liveStatus: "ok", uuid: "789"},
												];
					$scope.videos = schedulerService.videos;
					$scope.eventRunning = true;			
					$scope.lastVideoOrder = 3;

					spyOn(currentVideoStatusService, 'getLiveStatus').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve({running: "", pending: "123,456,789", statusCode: "200"});
						return deferred.promise;
					});
					spyOn(schedulerService, 'checkForRemoval').and.callFake(function() {
						return [];
					});
				});
				it('should set all of the videos to pending', function() {
					var result = $scope.checkLiveStatus();
					$scope.$digest(); // This is needed to call the mock function
					result.then(function() {
						$scope.videos.forEach(function(item) {
							expect(item.liveStatus).toEqual("pending");
						});
						expect($scope.eventRunning).toEqual(true);
						expect(result).toEqual(1);
					})
				});
			});
			describe('the first video is running, but everything else is pending', function() {
				beforeEach(function() {
					schedulerService.videos = [{order: 1, liveStatus: "ok", uuid: "123"},
											{order: 2, liveStatus: "ok", uuid: "456"},
											{order: 3, liveStatus: "ok", uuid: "789"},
												];
					$scope.videos = schedulerService.videos;
					$scope.eventRunning = true;			
					$scope.lastVideoOrder = 3;

					spyOn(currentVideoStatusService, 'getLiveStatus').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve({running: "123", pending: "456,789", statusCode: "200"});
						return deferred.promise;
					});
					spyOn(schedulerService, 'checkForRemoval').and.callFake(function() {
						return [];
					});
				});
				it('should set all of the video statuses correctly', function() {
					var result = $scope.checkLiveStatus();
					$scope.$digest(); // This is needed to call the mock function
					result.then(function() {
						expect($scope.videos[0].liveStatus).toEqual("running");
						expect($scope.videos[1].liveStatus).toEqual("pending");
						expect($scope.videos[2].liveStatus).toEqual("pending");
						expect($scope.eventRunning).toEqual(true);
						expect(result).toEqual(1);
					})
				});
			});
			describe('the second video is running, the first is done, and the third is pending', function() {
				beforeEach(function() {
					schedulerService.videos = [{order: 1, liveStatus: "ok", uuid: "123"},
											{order: 2, liveStatus: "ok", uuid: "456"},
											{order: 3, liveStatus: "ok", uuid: "789"},
												];
					$scope.videos = schedulerService.videos;
					$scope.eventRunning = true;			
					$scope.lastVideoOrder = 3;

					spyOn(currentVideoStatusService, 'getLiveStatus').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve({running: "456", pending: "789", statusCode: "200"});
						return deferred.promise;
					});
					spyOn(schedulerService, 'checkForRemoval').and.callFake(function() {
						return [1];
					});
				});
				it('should set all of the video statuses correctly', function() {
					var result = $scope.checkLiveStatus();
					$scope.$digest(); // This is needed to call the mock function
					result.then(function() {
						expect($scope.videos[0].liveStatus).toEqual("done");
						expect($scope.videos[1].liveStatus).toEqual("running");
						expect($scope.videos[2].liveStatus).toEqual("pending");
						expect($scope.eventRunning).toEqual(true);
						expect(result).toEqual(1);
					})
				});
			});
			describe('the last video is finished running', function() {
				beforeEach(function() {
					schedulerService.videos = [{order: 1, liveStatus: "ok", uuid: "123"},
											{order: 2, liveStatus: "ok", uuid: "456"},
											{order: 3, liveStatus: "ok", uuid: "789"},
												];
					$scope.videos = schedulerService.videos;
					$scope.eventRunning = true;			
					$scope.lastVideoOrder = 3;

					spyOn(currentVideoStatusService, 'getLiveStatus').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve({running: "456", pending: "789", statusCode: "200"});
						return deferred.promise;
					});
					spyOn(schedulerService, 'checkForRemoval').and.callFake(function() {
						return [3];
					});
				});
				it('should set all of the video statuses correctly', function() {
					var result = $scope.checkLiveStatus();
					$scope.$digest(); // This is needed to call the mock function
					result.then(function() {
						expect($scope.videos[0].liveStatus).toEqual("done");
						expect($scope.videos[1].liveStatus).toEqual("done");
						expect($scope.videos[2].liveStatus).toEqual("done");
						expect($scope.eventRunning).toEqual(false);
						expect(result).toEqual(1);
					})
				});			
			});
		});
	});
	describe('rootScope.$on(addS3ToPlaylist) tests', function() {
		beforeEach(function() {
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
		});
		describe('args are invalid', function() {
			beforeEach(function() {
				spyOn(toastr, 'error');	
			});
			it('should throw an error and return false if the args are invalid', function() {
				$rootScope.$broadcast('addS3ToPlaylist', null);
				$rootScope.$digest();
				expect(toastr.error).toHaveBeenCalled();
			});
		});
		describe('args are valid', function() {
			beforeEach(function() {
				$scope.videos = [];
			});
			describe('mocked out (successful) tests', function() {
				beforeEach(function() {
					spyOn(mediaProcessingService, 'findDuration').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve("00:00:10");
						return deferred.promise;
					});
					spyOn(S3Service, 'retrieveThumbnail').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve("foo.com");
						return deferred.promise;
					});
					spyOn(AWS, 'S3').and.callFake(function() {
						return "ok";
					});
					spyOn(schedulerService, 'validateVideoTitle').and.callFake(function() {
						return "testTitle";
					});
					spyOn(uuid, 'v4').and.callFake(function() {
						return "foo";
					});
					spyOn($scope, 'verifyOrder').and.callFake(function() {
						return false;
					});
					spyOn($scope, 'reorder').and.callFake(function() {
						return;
					});
				});
				describe('category and order have not been set', function() {
					beforeEach(function() {
						S3Service.mediaObject = {fileName: "test.mp4", title: "testTitle", category: "", order: ""}
						$scope.fileDuration = "00:00:10";
						$scope.startTime = new Date();
						$scope.videoLength = 10;
						$scope.newOrder = "";
						$rootScope.$broadcast('addS3ToPlaylist', true);
						$rootScope.$digest();
					});
					it('correctly set the given variables', function() {
						var expectedResult = [{title: "testTitle",
											   file: "test.mp4",
											   category: "TV Show",
											   order: 1,
											   duration: "00:00:10",
											   thumbnail: "foo.com",
											   date: $scope.startTime,
											   totalSeconds: 10,
											   liveStatus: "ok",
											   videoPlayed: false,
											   uuid: "foo"
											  }];
						expect($scope.videos).not.toBeNull();
						expect($scope.videoCount).toEqual(1);
						expect($scope.newOrder).toEqual(1);
						expect($scope.videos).toEqual(expectedResult);
					});
				});
				describe('category has not been set, order has not', function() {
					beforeEach(function() {
						S3Service.mediaObject = {fileName: "test.mp4", title: "testTitle", category: "", order: 1};
						$scope.fileDuration = "00:00:10";
						$scope.startTime = new Date();
						$scope.videoLength = 10;
						$scope.newOrder = "";
						$rootScope.$broadcast('addS3ToPlaylist', true);
						$rootScope.$digest();
					});
					it('correctly set the given variables', function() {
						var expectedResult = [{title: "testTitle",
											   file: "test.mp4",
											   category: "TV Show",
											   order: 1,
											   duration: "00:00:10",
											   thumbnail: "foo.com",
											   date: $scope.startTime,
											   totalSeconds: 10,
											   liveStatus: "ok",
											   videoPlayed: false,
											   uuid: "foo"
											  }];
						expect($scope.videos).not.toBeNull();
						expect($scope.videoCount).toEqual(1);
						expect($scope.videos).toEqual(expectedResult);
					});
				});
				describe('category has not been set, order has not been set, but the videoCount exists', function() {
					beforeEach(function() {
						schedulerService.videos = [1];
						$scope.videoCount = schedulerService.videos.length;
						S3Service.mediaObject = {fileName: "test.mp4", title: "testTitle", category: "", order: ""};
						$scope.fileDuration = "00:00:10";
						$scope.startTime = new Date();
						$scope.videoLength = 10;
						$rootScope.$broadcast('addS3ToPlaylist', true);
						$rootScope.$digest();
					});
					it('correctly set the given variables', function() {
						var expectedResult = [{title: "testTitle",
											   file: "test.mp4",
											   category: "TV Show",
											   order: 2,
											   duration: "00:00:10",
											   thumbnail: "foo.com",
											   date: $scope.startTime,
											   totalSeconds: 10,
											   liveStatus: "ok",
											   videoPlayed: false,
											   uuid: "foo"
											  }];
						expect($scope.videos).not.toBeNull();
						expect($scope.videoCount).toEqual(2);
						expect($scope.videos).toEqual(expectedResult);
					});
				});
				describe('category has been set, order has been set', function() {
					beforeEach(function() {
						schedulerService.videos = [1];
						$scope.videoCount = schedulerService.videos.length;
						S3Service.mediaObject = {fileName: "test.mp4", title: "testTitle", category: "Advertisement", order: 2};
						$scope.fileDuration = "00:00:10";
						$scope.startTime = new Date();
						$scope.videoLength = 10;
						jasmine.clock().uninstall();
						jasmine.clock().install();
						$rootScope.$broadcast('addS3ToPlaylist', true);
						$rootScope.$digest();
						jasmine.clock().tick(1000);
					});
					it('correctly set the given variables', function() {
						var expectedResult = [{title: "testTitle",
											   file: "test.mp4",
											   category: "Advertisement",
											   order: 2,
											   duration: "00:00:10",
											   thumbnail: "foo.com",
											   date: $scope.startTime,
											   totalSeconds: 10,
											   liveStatus: "ok",
											   videoPlayed: false,
											   uuid: "foo"
											  }];
						expect($scope.videos).not.toBeNull();
						expect($scope.videoCount).toEqual(2);
						expect($scope.videos).toEqual(expectedResult);
					});
				});
			});
			describe('tests error out', function() {
				beforeEach(function() {
					spyOn(toastr, 'error');
				});
				describe('mediaProcessingSerivce.findDuration() fails', function() {
					beforeEach(function() {
						spyOn(mediaProcessingService, 'findDuration').and.callFake(function() {
							var deferred = $q.defer();
							deferred.reject("err");
							return deferred.promise;
						});
						schedulerService.videos = [1];
						$scope.videoCount = schedulerService.videos.length;
						S3Service.mediaObject = {fileName: "test.mp4", title: "testTitle", category: "Advertisement", order: 2};
						$scope.fileDuration = "00:00:10";
						$scope.startTime = new Date();
						$scope.videoLength = 10;
						jasmine.clock().uninstall();
						jasmine.clock().install();
						$rootScope.$broadcast('addS3ToPlaylist', true);
						$rootScope.$digest();
						jasmine.clock().tick(1000);
					});
					it('should fail on findDuration and call toastr.error', function() {
						expect(toastr.error).toHaveBeenCalled();
					});
				});
				describe('S3Service.retrieveThumbnail() fails', function() {
					beforeEach(function() {
						spyOn(mediaProcessingService, 'findDuration').and.callFake(function() {
							var deferred = $q.defer();
							deferred.resolve("ok");
							return deferred.promise;
						});
						spyOn(S3Service, 'retrieveThumbnail').and.callFake(function() {
							var deferred = $q.defer();
							deferred.reject("err");
							return deferred.promise;
						});

						schedulerService.videos = [1];
						$scope.videoCount = schedulerService.videos.length;
						S3Service.mediaObject = {fileName: "test.mp4", title: "testTitle", category: "Advertisement", order: 2};
						$scope.fileDuration = "00:00:10";
						$scope.startTime = new Date();
						$scope.videoLength = 10;
						jasmine.clock().uninstall();
						jasmine.clock().install();
						$rootScope.$broadcast('addS3ToPlaylist', true);
						$rootScope.$digest();
						jasmine.clock().tick(1000);
					});
					it('should fail on findDuration and call toastr.error', function() {
						expect(toastr.error).toHaveBeenCalled();
					});
				});
			});
		});
	});

	describe('upload() tests', function() {
		beforeEach(function() {
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
		});
		describe('file is invalid', function() {
			beforeEach(function() {
				spyOn(toastr, 'error');	
			});
			it('should throw an error and return false if the file is invalid', function() {
				var result = $scope.upload();
				expect(result).toEqual(false);
				expect(toastr.error).toHaveBeenCalled();
			});
		});

		describe('file is valid', function() {
			beforeEach(function() {
				$scope.file = {file:[{"name":"test.mp4", "size":1024, "type":"video/mp4"}]};
			});
			describe('mocked out (successful) tests', function() {
				beforeEach(function() {
					spyOn(toastr, 'info');
					spyOn(S3Service, 'setBucket').and.callFake(function() {
						return "success";
					});
					spyOn(S3Service, 'upload').and.callFake(function() {
						var deferred = $q.defer();
						$rootScope.$broadcast('progressEvent', {total: 100});
						deferred.resolve("success");
						return deferred.promise;
					});
					spyOn(mediaProcessingService, 'findDuration').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve("00:00:10");
						return deferred.promise;
					});
					spyOn($scope, 'generateStartTime').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve(new Date());
						return deferred.promise;
					});
					spyOn(mediaProcessingService, 'generateThumbnail').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve(null);
						return deferred.promise;
					});
					spyOn(AWS, 'S3').and.callFake(function() {
						return "success";
					});
					spyOn($rootScope, 'convertDataURIToBlob').and.callFake(function() {
						return "blob";
					});
					spyOn($scope, 'uploadThumbnailToS3').and.callFake(function() {
						var deferred = $q.defer();
						deferred.resolve("success");
						return deferred.promise;
					});
					spyOn($scope, 'addToPlaylist').and.callFake(function() {
						return "success";
					});

					spyOn($scope, 'resetForm').and.callFake(function() {
						return "success";
					});
					jasmine.clock().uninstall();
					jasmine.clock().install();
				});
				it('should broadcast progressEvent', function() {
					var result = $scope.upload();
					$scope.$digest();
					jasmine.clock().tick(1000);
					expect($scope.resetForm).toHaveBeenCalled();
					expect($scope.uploadProgress).toBe(0);
					expect(toastr.info).toHaveBeenCalled();
				});
			});
			describe('tests error out', function() {
				beforeEach(function() {
					spyOn(S3Service, 'setBucket').and.callFake(function() {
						return "success";
					});
					spyOn(toastr, 'error');
					jasmine.clock().uninstall();
					jasmine.clock().install();
				});
				describe('S3Service.upload() fails', function() {
					beforeEach(function() {
						spyOn($scope, 'resetForm').and.callFake(function() {
							return "success";
						});
						spyOn(S3Service, 'upload').and.callFake(function() {
							var deferred = $q.defer();
							deferred.reject("error");
							return deferred.promise;
						});
					});
					it('should fail and call the timeout function', function() {
						var result = $scope.upload();
						$scope.$digest();
						jasmine.clock().tick(1000);
						expect($scope.resetForm).toHaveBeenCalled();
						expect($scope.uploadProgress).toBe(0);
						expect(toastr.error).toHaveBeenCalled();
					});
				});
				describe('mediaProcessingSerivce.findDuration() fails', function() {
					beforeEach(function() {
						spyOn($scope, 'resetForm').and.callFake(function() {
							return "success";
						});
						spyOn(S3Service, 'upload').and.callFake(function() {
							var deferred = $q.defer();
							deferred.resolve("ok");
							return deferred.promise;
						});
						spyOn(mediaProcessingService, 'findDuration').and.callFake(function() {
							var deferred = $q.defer();
							deferred.reject("error");
							return deferred.promise;
						});
					});
					it('should fail and call toastr as well as reset the form', function() {
						var result = $scope.upload();
						$scope.$digest();
						jasmine.clock().tick(1000);
						expect($scope.resetForm).toHaveBeenCalled();
						expect($scope.uploadProgress).toBe(0);
						expect(toastr.error).toHaveBeenCalled();
					});
				});
				describe('mediaProcessingSerivce.generateThumbnail() fails', function() {
					beforeEach(function() {
						spyOn($scope, 'resetForm').and.callFake(function() {
							return "success";
						});
						spyOn(S3Service, 'upload').and.callFake(function() {
							var deferred = $q.defer();
							deferred.resolve("ok");
							return deferred.promise;
						});
						spyOn(mediaProcessingService, 'findDuration').and.callFake(function() {
							var deferred = $q.defer();
							deferred.resolve("ok");
							return deferred.promise;
						});
						spyOn(mediaProcessingService, 'generateThumbnail').and.callFake(function() {
							var deferred = $q.defer();
							deferred.reject("error");
							return deferred.promise;						
						});
					});
					it('should fail and call toastr as well as reset the form', function() {
						var result = $scope.upload();
						$scope.$digest();
						jasmine.clock().tick(1000);
						expect($scope.resetForm).toHaveBeenCalled();
						expect($scope.uploadProgress).toBe(0);
						expect(toastr.error).toHaveBeenCalled();
					});
				});
				describe('$scope.uploadThumbnailToS3() fails', function() {
					beforeEach(function() {
						spyOn($scope, 'resetForm').and.callFake(function() {
							return "success";
						});
						spyOn(S3Service, 'upload').and.callFake(function() {
							var deferred = $q.defer();
							deferred.resolve("ok");
							return deferred.promise;
						});
						spyOn(mediaProcessingService, 'findDuration').and.callFake(function() {
							var deferred = $q.defer();
							deferred.resolve("ok");
							return deferred.promise;
						});
						spyOn(mediaProcessingService, 'generateThumbnail').and.callFake(function() {
							var deferred = $q.defer();
							deferred.resolve("ok");
							return deferred.promise;						
						});
						spyOn($rootScope, 'convertDataURIToBlob').and.callFake(function() {
							return "blob";
						});
						spyOn($scope, 'uploadThumbnailToS3').and.callFake(function() {
							var deferred = $q.defer();
							deferred.reject("err");
							return deferred.promise;						
						});
					});
					it('should fail and call toastr as well as reset the form', function() {
						var result = $scope.upload();
						$scope.$digest();
						jasmine.clock().tick(1000);
						expect($scope.resetForm).toHaveBeenCalled();
						expect($scope.uploadProgress).toBe(0);
						expect(toastr.error).toHaveBeenCalled();
					});
				});
			});
		});
	});

	describe('$interval tests', function() {
		beforeEach(function() {
			PlaylistController = createPlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService, mediaProcessingService);
			spyOn($scope, 'checkLiveStatus').and.callThrough();
			spyOn(S3Service, 'setBucket').and.callFake(function() {
				return 
			});
		});
		it('should call the function during the interval sequence', function() {
			$interval.flush(3000);
			expect($scope.checkLiveStatus).toHaveBeenCalled();
		});
	});
});