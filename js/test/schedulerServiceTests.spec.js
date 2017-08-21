/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

describe('schedulerService', function(){
	var schedulerService, $rootScope;
    beforeEach(angular.mock.module('adminUI'));
    
    beforeEach(inject(function($injector) {
		$rootScope = $injector.get('$rootScope');
        createService = function($rootScope) {
            return $injector.get('schedulerService');
        }
    }));
	

	
	describe('Initial Loading Config Test', function() {
        it('should have 6 keys on load', function() {
			schedulerService = createService($rootScope);
			var length = Object.keys(schedulerService.configOptions).length;
            expect(length).toBe(6);
        });
    });
	
	describe('Initial Loading Test', function() {
        it('should have empty/default parameters on load', function() {
            schedulerService = createService($rootScope);
            expect(schedulerService.videos.length).toBe(0);
			expect(schedulerService.initialStartTime).toBe('');
			expect($rootScope.playlistEmpty).toBe(true);
			expect(Object.keys(schedulerService.videoTitleCounts).length).toBe(0);
        });
    });

    describe('getCurrentlyRunningVideos() test', function() {
        beforeEach(function() {
            schedulerService = createService($rootScope);
        });

        it('should return an empty list when nothing is inside', function() {
            var result = schedulerService.getCurrentlyRunningVideos();
            expect(result.length).toBe(0);
        });
    });

    describe('setCurrentlyRunningVideos() test', function() {
        beforeEach(function() {
            schedulerService = createService($rootScope);
        });

        it('should return -1 when the parameters are invalid', function() {
            var testList = undefined;
            var result = schedulerService.setCurrentlyRunningVideos(testList);
            expect(result).toBe(-1);

            testList = [];
            result = schedulerService.setCurrentlyRunningVideos(testList);
            expect(result).toBe(-1);
        });

        it('should correctly set currentlyRunningVideos', function() {
            var testList = [1, 2];
            schedulerService.setCurrentlyRunningVideos(testList);
            var result = schedulerService.getCurrentlyRunningVideos();
            expect(result).toEqual(testList);
        });
    });
	describe('saveConfig() Test', function() {
        it('should Set the JSON parameter as configOptions', function() {
            var mockParam = {'test': '123'};
            expect(schedulerService.configOptions).not.toEqual(mockParam);

            schedulerService.saveConfig(mockParam);

			expect(schedulerService.configOptions).toEqual(mockParam);
        });
    });


    describe('playlistChanged() tests', function() {
        it('should correctly set the variables if the videoCount is 0', function() {
			schedulerService = createService($rootScope);
            schedulerService.videos = [];            
            schedulerService.playlistChanged();

            expect(schedulerService.initialStartTime).toBe('');
            expect($rootScope.playlistEmpty).toBeTruthy();
        });
        it('should set the date of the first video to the initial start time', function() {
            schedulerService = createService($rootScope);
            schedulerService.initialStartTime = "1234";
            schedulerService.videos = [{title: 'test video', date: '0000', totalSeconds: 15}];
            schedulerService.playlistChanged();

            expect(schedulerService.videos[0].date).toBe(schedulerService.initialStartTime);
        });

        it('should dynamically set the date for cascading videos', function() {
            schedulerService = createService($rootScope);
            schedulerService.initialStartTime = new Date();
            var resultDate = new Date(schedulerService.initialStartTime);
            resultDate.setSeconds(resultDate.getSeconds() + 15);
            schedulerService.videos = [{title: 'test video', date: new Date(), totalSeconds: 15},
                                       {title: 'test video 2', date: new Date(), totalSeconds: 20}];
            schedulerService.playlistChanged();

            expect($rootScope.playlistEmpty).toBeFalsy();
            expect(schedulerService.videos[1].date).toEqual(resultDate);
        });
    });

    describe('validateVideoTitle() tests', function() {
        it('should return the same videoTitle and add it to the videoCount list', function() {
            schedulerService = createService($rootScope);
            var testTitle = "test";
            var result = schedulerService.validateVideoTitle(testTitle);

            var expectedVideoCounts = {"test": 1};
            
            expect(schedulerService.videoTitleCounts).toEqual(expectedVideoCounts);
            expect(result).toBe("test");
        });

        it('should return the title plus the next number when it already exists', function() {
            schedulerService = createService($rootScope);
            var testTitle = "test";
            schedulerService.videoTitleCounts = {"test": 1}
            var result = schedulerService.validateVideoTitle(testTitle);

            var expectedVideoCounts = {"test": 2};
            expect(schedulerService.videoTitleCounts).toEqual(expectedVideoCounts);
            expect(result).toBe("test_2");
        });
        it('should return Video when nothing is given', function() {
            schedulerService = createService($rootScope);
            var testTitle = "";
            schedulerService.videoTitleCounts = {};
            var result = schedulerService.validateVideoTitle(testTitle);

            var expectedVideoCounts = {"Video": 1};
            expect(schedulerService.videoTitleCounts).toEqual(expectedVideoCounts);
            expect(result).toBe("Video");
        });
    });

    describe('setVideoStatus() tests', function() {
        beforeEach(function() {
            schedulerService = createService($rootScope);
        });

        it('should return -1 with an empty video list', function() {
            schedulerService.videos = [];
            var testUUIDs = ["uuid1", "uuid2", "uuid3"];
            var testStatus = "running";

            var result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(result).toBe(-1);
        });

        it('should return -1 when the list of uuids is null or empty', function() {
            schedulerService.videos = [{uuid: "uuid1", liveStatus: "ok"}, {uuid: "uuid2", liveStatus: "ok"}, {uuid: "uuid3", liveStatus: "ok"}];
            var testUUIDs = [];
            var testStatus = "running";

            var result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(result).toBe(-1);

            testUUIDs = null;
            result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(result).toBe(-1);

            testUUIDs = undefined;
            result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(result).toBe(-1);
        });

        it('should correctly set the video status on match', function() {
            schedulerService.videos = [{uuid: "uuid1", liveStatus: "ok", order: 1}, {uuid: "uuid2", liveStatus: "ok", order: 2}, {uuid: "uuid3", liveStatus: "ok", order: 3}];
            var testUUIDs = ["uuid3"];
            var testStatus = "pending";

            var result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(schedulerService.videos[2].liveStatus).toBe("pending");
        });

        it('should return -1 when no match is found', function() {
            schedulerService.videos = [{uuid: "uuid1", liveStatus: "ok", order: 1}, {uuid: "uuid2", liveStatus: "ok", order: 2}, {uuid: "uuid3", liveStatus: "ok", order: 3}];
            var testUUIDs = ["uuid4"];
            var testStatus = "pending";

            var result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(result).toBe(-1);
        });

        it('should be able to set the status with commas in the testUUIDs', function() {
            schedulerService.videos = [{uuid: "uuid1", liveStatus: "ok", order: 1}, {uuid: "uuid2", liveStatus: "ok", order: 2}, {uuid: "uuid3", liveStatus: "ok", order: 3}];
            var testUUIDs = ["uuid3,"];
            var testStatus = "pending";
            var result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(schedulerService.videos[2].liveStatus).toBe("pending");
        });

        it('should return the order of a video on match', function() {
            schedulerService.videos = [{uuid: "uuid1", liveStatus: "ok", order: 1}, {uuid: "uuid2", liveStatus: "ok", order: 2}, {uuid: "uuid3", liveStatus: "ok", order: 3}];
            var testUUIDs = ["uuid3,"];
            var testStatus = "pending";

            var result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(result).toBe(3);
        });

        it('should not change the status of a video if it is the same', function() {
            schedulerService.videos = [{uuid: "uuid1", liveStatus: "ok", order: 1}, {uuid: "uuid2", liveStatus: "ok", order: 2}, {uuid: "uuid3", liveStatus: "ok", order: 3}];
            var testUUIDs = ["uuid3,"];
            var testStatus = "pending";
            schedulerService.videos[2].liveStatus = "pending";

            var result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(result).toBe(-1);
        });

        it('should push a video to the currentlyRunningVideos queue when set to running', function() {
            schedulerService.videos = [{uuid: "uuid1", liveStatus: "ok", order: 1}, {uuid: "uuid2", liveStatus: "ok", order: 2}, {uuid: "uuid3", liveStatus: "ok", order: 3}];
            var testUUIDs = ["uuid1,"];
            var testStatus = "running";

            var result = schedulerService.setVideoStatus(testUUIDs, testStatus);
            expect(result).toBe(1);

            var expectedQueue = [{uuid: "uuid1", order: 1}];
            var actualQueue = schedulerService.getCurrentlyRunningVideos();
            expect(actualQueue).toEqual(expectedQueue);
        });
    });

    describe('checkForRemoval() tests', function() {
        beforeEach(function() {
            schedulerService = createService($rootScope);
        });

        it('should return an empty list if both lists are empty', function() {
            var result = schedulerService.checkForRemoval([]);
            expect(result.length).toBe(0);
        });

        it('should return the video orders in the currentlyRunningVideos when the runningUUIDs queue is empty', function() {
            schedulerService.setCurrentlyRunningVideos([{uuid: "uuid1", order: 1}]);
            var result = schedulerService.checkForRemoval([]);
            expect(result).toEqual([1]);
        });

        it('should not return anything when the queue is empty but the input is not', function() {
            var testUUIDs = ["uuid1"];
            var result = schedulerService.checkForRemoval(testUUIDs);
            expect(result.length).toBe(0);
        });

        it('should not return anything when the lists match', function() {
            var testUUIDs = ["uuid1"];
            schedulerService.setCurrentlyRunningVideos([{uuid: "uuid1", order: 1}]);
            var result = schedulerService.checkForRemoval(testUUIDs);
            expect(result.length).toBe(0);
        });

        it('should pop off the first item in the queue if the lists differ', function() {
            var testUUIDs = ["uuid2"];
            schedulerService.setCurrentlyRunningVideos([{uuid: "uuid1", order: 1}, {uuid: "uuid2", order: 2}]);
            var result = schedulerService.checkForRemoval(testUUIDs);
            expect(result).toEqual([1]);

            var check = schedulerService.getCurrentlyRunningVideos();
            expect(check).toEqual([{uuid: "uuid2", order: 2}]);
        });
    });
	
});