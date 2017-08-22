/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

angular.module('adminUI')
	.service('BXFGeneratorService', ['$http', 'uuid', 'lambdaService', '$rootScope', function($http, uuid, lambdaService, $rootScope) {
	
	this.configSettings = {
			"startMode": "Duration",
			"endMode": "Duration",
			"scheduleType": "Primary",
			"scheduleName": "Default Name",
			"channelType": "digital_television",
			"channelShortName": "Default Name"
		};
		
	this.videoSchedule = [];		//Variable for storing the video schedule/ playlist details
	
	//function to set configSettings values
	//Called by ConfigController
	this.setConfig = function(configSettings) {
		this.configSettings = JSON.parse(JSON.stringify(configSettings));
	};
	
	//function to set videoSchedule values
	//Called by PlaylistController
	this.setSchedule = function(videoSchedule) {
		angular.copy(videoSchedule, this.videoSchedule);
	};
	
	//Getters to be used when switching views (e.g. switch views from config.html to index.html)
	//Called by activate function in controllers
	//Called by ConfigController
	this.getConfig = function( ) {
		return this.configSettings;
	};
	
	//Called by PlaylistController
	this.getSchedule = function( ) {
		return this.videoSchedule;
	};

	// Calculate video end time
    this.calculateEnd = function(lastVideo) {
        var endTime = new Date(lastVideo.date);
        endTime.setSeconds(endTime.getSeconds() + lastVideo.totalSeconds);
        return new Date(endTime);
    }
	
	//Placeholder function for generating the BXF using values in configSettings and videoSchedule
	//Returns the BXF file
	this.generateBXF = function(videos) {
        // BXF Base Template
        // and Generate UUID for Schedule ID
		var configSettings = this.configSettings;
		var videoSchedule = this.videoSchedule;
        var bxf = {
            "BxfData": {
                "@": {
                    "action": "add"
                },
                "Schedule": {
                    "@": {
                        "action": "add",
                        "ScheduleEnd": this.calculateEnd(videos[videos.length - 1]),
                        "ScheduleStart": videos[0].date,
                        "ScheduleId": uuid.v4(),
                        "type": configSettings.scheduleType
                    },
                    "Channel": {
                        "@": {
                            "action": "add",
                            "type": configSettings.channelType,
                            "outOfBand": "true",
                            "shortName": configSettings.channelShortName,
                            "ca": "false",
                            "status": "active",
                            "channelNumber": "0-1"
                        }
                    },
                    "ScheduleName": configSettings.scheduleName,
                    "ScheduledEvent": [ ]
                }
            }
        }

        // Generate BXF Event Objects for Playlist Videos
        angular.forEach(videos, function(value, key) {
            var event = {
                "EventData": {
                    "@": {
                        "action": "add",
                        "eventType": "primary"
                    },
                    "EventId": {
                        "EventId": "urn:uuid:" + value.uuid
                    },
                    "PrimaryEvent": {
                        "ProgramEvent": {
                            "SegmentNumber": value.order,
                            "ProgramName": value.title
                        }
                    },
                    "StartDateTime": {
                        "SmpteDateTime": {
                            "@": {
                                "broadcastDate": ""
                            },
                            "SmpteTimeCode": value.date
                        }
                    },
                    "LengthOption": {
                        "Duration": {
                            "SmpteDuration": {
                                "@": {
                                    "frameRate": "30"
                                },
                                "SmpteTimeCode": value.duration
                            }
                        }
                    },
                    "StartMode": configSettings.startMode,
                    "EndMode": configSettings.endMode,
                    "Transitions": {
                        "VideoTransitions": {
                            "TransitionOutType": "Cut",
                            "TransitionOutRate": "Medium"
                        }
                    }
                },
                "Content": {
                    "ContentId": {
                        "HouseNumber": value.file
                    },
                    "Name": value.title,
                    "Description": "program description",
                    "Media": {
                        "PrecompressedTS": {
                            "TSVideo": {
                                "DigitalVideo": "true",
                                "Format": "1080p",
                                "AspectRatio": "16:9"
                            },
                            "TSCaptioning": "true"
                        },
                        "MediaLocation": {
                            "Location": {
                                "AssetServer": {
                                    "@": {
                                        "playoutAllowed": "true",
                                        "fileTransferAllowed": "true",
                                    },
                                    "PathName": "https:\/\/s3-us-west-2.amazonaws.com\/pdxteamdkrakatoa\/" + encodeURIComponent(value.file)
                                }
                            }
                        }
                    }
                }
            }
            videoSchedule.push(event);
        });

        // Save events to BXF template
        bxf.BxfData.Schedule.ScheduledEvent = videoSchedule;

        // Convert JSON Object to String
        var objJson = angular.toJson(bxf);

        // POST Config for generating BXF with Node
        var url = "/generatebxf";

        var config = {
            method: 'POST',
            url: url,
            data: { 'json': objJson },
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Reset videoSchedule to empty array
        this.videoSchedule = [];
        // POST JSON string to BXF Generate Node module
        $http(config).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            toastr.success('BXF Successfully Generated', 'Done');

            // Send BXF to LambdaService
            lambdaService.sendBXF(response.data);


            $rootScope.playlistPublished = true;
            return response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            toastr.error('BXF Generation Error', 'Error');
        });
	};

}]);