// Define the PlaylistController on the adminUI module
controllers.controller('PlaylistController', function PlaylistController($scope) {
    $scope.videos = [

    ];

    $scope.uploadProgress = 0;

    //Prefilled Credentials
    $scope.creds = {
        bucket: 'pdxteamdkrakatoa',
        access_key: 'AKIAJC5MDFR5KM46FQOA',
        secret_key: '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'

    }

    $scope.upload = function () {
        AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
        AWS.config.region = 'us-west-2';
        var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

        if ($scope.file) {
            var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };

            bucket.putObject(params, function (err, data) {
                if (err) {
                    toastr.error(err.message, err.code);
                    return false;
                }
                else {
                    // Upload Successfully Finished
                    toastr.success('File Uploaded Successfully', 'Done');

                    // Reset The Progress Bar
                    setTimeout(function () {
                        $scope.uploadProgress = 0;
                        $scope.$digest();
                    }, 4000);
                }
            })
                .on('httpUploadProgress', function (progress) {
                    $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
                    $scope.$digest();
                });
        }
        else {
            // No File Selected
            toastr.error('Please select a file to upload');
        }
    }
});