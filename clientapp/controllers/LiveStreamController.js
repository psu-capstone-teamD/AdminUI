// Define the LiveStreamController on clientUI module
angular.module('clientUI')
	.controller('LiveStreamController', ['$scope', function ($scope) {
        $scope.loadVideo = function() {
              if(Hls.isSupported()) {
                var video = document.getElementById('video');
                var hls = new Hls();
                hls.loadSource('http://delta-1-yanexx65s8e5.live.elementalclouddev.com/out/p/9/it%20me.m3u8');
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                  video.play();
              });
            }
        }
}]);