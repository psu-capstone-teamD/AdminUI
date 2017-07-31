angular.module('adminUI')
	.service('S3Service', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var $scope = $rootScope;
	var params;
	this.bucket;
	
	//Prefilled Credentials
	//Might need to be in Config, might need a Get/Set function if so.
	$scope.creds = {
	    bucket: 'pdxteamdkrakatoa',
	    access_key: 'REPLACE ME',
	    secret_key: 'REPLACE ME'
	}

	
	AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
	AWS.config.region = 'us-west-2';
	//Prefilled Server side encryption setting, might need to be moved into config too
	var encryption = 'AES256';
	
	//Workaround to make a simple mock for the S3 object and putObject function
	this.setBucket = function (file) {
		params = { Key: file.name, ContentType: file.type, Body: file, ServerSideEncryption: encryption };
		this.bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
	};

	
	
	//Function to upload file to S3 bucket
	this.upload = function (file) {
		var deferred = $q.defer();
		// Let the user know the video is attempting to be uploaded
		toastr.options.showDuration = "375";
		toastr.info('Please wait for upload to finish', 'Uploading...');
		toastr.options.showDuration = "";

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
	$scope.retrieveObjectFromBucket = function(key, S3Objects) {
		var params = { Bucket: "pdxteamdkrakatoa", Key: key };
		var s3 = new AWS.S3();
		var deferred = $q.defer();
		s3.getObject(params, function(err, data) {
			if (err) {
				console.log(err);
				deferred.reject(err);
			}
			else {
				console.log(2);
				s3.getSignedUrl('getObject', params, function (err, url) {
					S3Objects.unshift({title: key, date: data.LastModified, url: url});
					console.log(S3Objects);
					deferred.resolve(S3Objects);
				});
			}
		});
		return deferred.promise;
	};
	this.getItemsInBucket = function(S3Objects) {
		var deferred = $q.defer();
		var getItemsParams = { Bucket: "pdxteamdkrakatoa", MaxKeys: 1000};
		var s3 = new AWS.S3();
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
					getItemsParams = { Bucket: "pdxteamdkrakatoa", Key: title };
					s3.getSignedUrl('getObject', getItemsParams, function (err, url) {
						if(err) {
							toastr.error("Error", "Unable to load an object from S3");
							console.log(err);
						}
						else {
							itemsToReturn.unshift({title: title, date: data.Contents[i].LastModified, url: url});
						}
					});

					i++;
				}
				deferred.resolve(itemsToReturn);
			}
		});
		return deferred.promise;
	}
}]);
