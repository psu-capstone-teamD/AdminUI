angular.module('adminUI')
	.service('S3Service', ['$rootScope', function($rootScope) {
	
	var uploadProgress = 0;
	
	//Prefilled Credentials
	//Might need to be in Config, might need a Get/Set function if so.
    var creds = {
        bucket: 'pdxteamdkrakatoa',
        access_key: 'KEY',
        secret_key: 'KEY'
    }
	
	//Server side encryption, might need to be moved into config too
	var encryption = 'AES256'
	
	//Function to upload file to S3 bucket
	this.upload = function (file) {
		
		//Same as credentials above, might need to be moved to Config
        AWS.config.update({ accessKeyId: creds.access_key, secretAccessKey: creds.secret_key });
        AWS.config.region = 'us-west-2';
 
		var bucket = new AWS.S3({ params: { Bucket: creds.bucket } });
        
		if(file) {
			var params = { Key: file.name, ContentType: file.type, Body: file, ServerSideEncryption: encryption };

			bucket.putObject(params, function(err, data) {
			if(err) {
				//Since services usually doesn't involve any View/DOM element, toastr doesn't support services by design
				/*
					toastr.error(err.message,err.code);
				*/
				
				alert(err.message);
				return false;
			}
			else {
				// Upload Successfully Finished
				alert('File Uploaded Successfully');
				
			//Since services usually doesn't involve any View/DOM element, toastr doesn't support services by design
			/*
				toastr.success('File Uploaded Successfully', 'Done');
			*/

				// Reset The Progress Bar
				setTimeout(function() {
				this.uploadProgress = 0;
				$rootScope.$digest();
				}, 4000);
			}
			})
			.on('httpUploadProgress',function(progress) {
			this.uploadProgress = Math.round(progress.loaded / progress.total * 100);
			$rootScope.$digest();
			});
		}

    }
}]);