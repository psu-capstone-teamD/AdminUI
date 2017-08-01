angular.module('adminUI')
	.service('BXFGeneratorService', ['$http', 'uuid', 'lambdaService', function($http, uuid, lambdaService) {
	
	var configSettings = [];	//Variable for storing values such as stream settings
	var videoSchedule = [];		//Variable for storing the video schedule/ playlist details
	
	//function to set configSettings values
	//Called by ConfigController
	this.setConfig = function(configSettings) {
		angular.copy(configSettings, this.configSettings);
	};
	
	//function to set videoSchedule values
	//Called by PlaylistController
	this.setSchedule = function(videoSchedule) {
		angular.copy(schedule, this.videoSchedule);
	};
	
	//Getters to be used when switching views (e.g. switch views from config.html to index.html)
	//Called by activate function in controllers
	//Called by ConfigController
	this.getConfig = function( ) {
		return configSettings;
	};
	
	//Called by PlaylistController
	this.getSchedule = function( ) {
		return videoSchedule;
	};
	
	
	//Placeholder function for generating the BXF using values in configSettings and videoSchedule
	//Returns the BXF file
	this.generateBXF = function(videos) {
        // BXF Base Template
        // and Generate UUID for Schedule ID
        var bxf = {
            "BxfData": {
                "@": {
                    "action": "add"
                },
                "Schedule": {
                    "@": {
                        "action": "add",
                        "ScheduleEnd": "",
                        "ScheduleStart": "",
                        "ScheduleId": uuid.v4(),
                        "type": "Primary"
                    },
                    "Channel": {
                        "@": {
                            "action": "add",
                            "type": "digital_television",
                            "outOfBand": "true",
                            "shortName": "PSU",
                            "ca": "false",
                            "status": "active",
                            "channelNumber": "0-1"
                        }
                    },
                    "ScheduleName": "PSU Test Channel",
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
                    "StartMode": "Duration",
                    "EndMode": "Duration",
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
                                "Format": "1080i",
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

        // POST JSON string to BXF Generate Node module
        $http(config).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            toastr.success('BXF Successfully Generated', 'Done');
            lambdaService.sendBXF(response.data);
            videoSchedule = [];
            return response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            toastr.error('BXF Generation Error', 'Error');
        });
	};

}]);