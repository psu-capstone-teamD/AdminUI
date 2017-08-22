/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

angular.module('adminUI')
	.service('S3Service', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

	var params;
	this.bucket;
	this.mediaObject = null;

	//Prefilled Credentials
	//Might need to be in Config, might need a Get/Set function if so.
	$rootScope.creds = {
		bucket: 'pdxteamdkrakatoa'
	}


	// Initialize the Amazon Cognito credentials provider
	AWS.config.region = 'us-west-2'; // Region
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		AccountId: 'REPLACE ME',
		IdentityPoolId: 'REPLACE ME',
		RoleArn: 'REPLACE ME'
	 });
	 


	//Prefilled Server side encryption setting, might need to be moved into config too
	var encryption = 'AES256';
	
	//Workaround to make a simple mock for the S3 object and putObject function
	this.setBucket = function (file) {
		params = { Key: file.name, ContentType: file.type, Body: file, ServerSideEncryption: encryption };
		this.bucket = new AWS.S3({ params: { Bucket: $rootScope.creds.bucket } });
		return this.bucket;
	};

	
	
	//Function to upload file to S3 bucket
	this.upload = function (file, bucket) {
		var deferred = $q.defer();
		// Let the user know the video is attempting to be uploaded
		toastr.options.showDuration = "375";
		toastr.info('Please wait for upload to finish', 'Uploading...');
		toastr.options.showDuration = "";

		this.bucket = bucket;

		this.bucket.putObject(params, function(err, data) {
			if(err) {
				toastr.error(err.message, err.code);
				deferred.reject(err);
			}
			else
			{
				toastr.success('File Uploaded Successfully', 'Done');
				deferred.resolve(data);
			}
		})
		.on('httpUploadProgress',function(progress) {
			$rootScope.$broadcast('progressEvent', progress);
			
			if(progress.loaded == progress.total)
			{
				$rootScope.$broadcast('')
			}
		});
		return deferred.promise;
	};

	// List the media in the S3 bucket (excluding thumbnails)
	this.getItemsInBucket = function(S3Objects, bucket) {
		var deferred = $q.defer();
		var getItemsParams = { Bucket: "pdxteamdkrakatoa", MaxKeys: 1000};
		//var s3 = new AWS.S3();
		var s3 = bucket;
		var itemsToReturn = [];
		s3.listObjects(getItemsParams, function(err, data) {
			if (err) {
				deferred.reject(err);
			}
			else {
				var count = data.Contents.length;
				var i = 0;
				while(i < count) {
					var title = data.Contents[i].Key;
					if(title.indexOf("_thumb.jpeg") === -1) {
						var tagId = data.Contents[i].ETag;
						getItemsParams = { Bucket: "pdxteamdkrakatoa", Key: title };
						s3.getSignedUrl('getObject', getItemsParams, function (err, url) {
							if(err) {
								toastr.error("Error", "Unable to load an object from S3");
								console.log(err);
							}
							else {
								itemsToReturn.unshift({title: title, date: data.Contents[i].LastModified, url: url, tag: tagId});
							}
						});
					}
					i++;
				}
				deferred.resolve(itemsToReturn);
			}
		});
		return deferred.promise;
	}

	// Retrieve the thumbnail from S3
	this.retrieveThumbnail = function(fileName, bucket) {
		var deferred = $q.defer();
		var thumbnailName =  fileName + "_thumb.jpeg";
		var getItemParam = { Bucket: "pdxteamdkrakatoa", Key: thumbnailName };
		//var s3 = new AWS.S3();
		var s3 = bucket;
		s3.getSignedUrl('getObject', getItemParam, function (err, data) {
			if (err) {
				console.log(err);
				toastr.error("Error retrieving video thumbnail", "Error");
				deferred.reject(err);
			}	
			else {
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	}


	// Convert the data URI to a blob so it can be uploaded to S3
	$rootScope.convertDataURIToBlob = function(URI) {
		var binary = atob(URI.split(',')[1]);
		var array = [];
		for(var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
	}

	// Upload the generated thumbnail to S3
	$rootScope.uploadThumbnailToS3 = function(blobData, fileName, bucket) {
		var deferred = $q.defer();
		var newFileName = fileName + "_thumb.jpeg";
		var params = { Key: newFileName, ContentType: 'image/jpeg', Body: blobData, ServerSideEncryption: encryption };
		//var s3 = new AWS.S3({ params: { Bucket: $rootScope.creds.bucket } });
		var s3 = bucket;
		s3.putObject(params, function (err, data) {
			if(err) {
				toastr.error("Unable to upload thumbnail to S3", "Error");
				console.log(err);
			}
			else {
				deferred.resolve("success");
			}
		});
		return deferred.promise;
	}

	this.handleS3Media = function(mediaObject) {
		this.mediaObject = mediaObject;
	}
	this.notifyComplete = function() {
		this.mediaObject = null;
		$rootScope.$emit('S3AddFinished', null);
	}
}]);
