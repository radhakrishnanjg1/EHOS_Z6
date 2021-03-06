  
//document.addEventListener("deviceready", onDeviceReady, false);
 
function id(element) {
    return document.getElementById(element);
} 
function cameraApp(){}

cameraApp.prototype={
    _pictureSource: null,
    
    _destinationType: null,
    
    run: function(){
        var that=this;
	    that._pictureSource = navigator.camera.PictureSourceType;
	    that._destinationType = navigator.camera.DestinationType;
	    id("capturephotobutton").addEventListener("click", function(){
            that._capturePhoto.apply(that,arguments);
        }); 
    },
    
    _capturePhoto: function() {
        var that = this;
        
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        },function(){
            that._onFail.apply(that,arguments);
        },{
            quality: 50,
            destinationType: that._destinationType.DATA_URL
        });
    },
    
    _capturePhotoEdit: function() {
        var that = this;
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string. 
        // The allowEdit property has no effect on Android devices.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        }, function(){
            that._onFail.apply(that,arguments);
        }, {
            quality: 20, allowEdit: true,
            destinationType: cameraApp._destinationType.DATA_URL
        });
    },
    
    _getPhotoFromLibrary: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.PHOTOLIBRARY);         
    },
    
    _getPhotoFromAlbum: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },
    
    _getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function(){
            that._onPhotoURISuccess.apply(that,arguments);
        }, function(){
            cameraApp._onFail.apply(that,arguments);
        }, {
            quality: 50,
            destinationType: cameraApp._destinationType.FILE_URI,
            sourceType: source
        });
    },
    
    _onPhotoDataSuccess: function(imageData) {
        var smallImage = document.getElementById('img_user_profile');
        smallImage.style.display = 'block';
    
        // Show the captured photo.
        smallImage.src = "data:image/jpeg;base64," + imageData;
        // read Resource file Value
        var UserProfileImage_SizeError = "Please upload file size of {0} MB!";
        var UserProfileImage_SizeAllowed = "1";
        var UserProfileImage_ExtensionError = "Please upload file with any of the .{0} extension!";
        var UserProfileImage_ExtensionAllowed = "JPEG|JPG|JPE|PNG|GIF";
        var UserProfileImage_Failur_Error = "Failed to Update profile image!";

        //read Uploaded file Value
        var obj = imageData;
        //get Image Name
        var UserProfileImage_ImageName = obj.name;
        //calculate Image size
        var UserProfileImage_ImageSize = obj.size / 1024 / 1024;
        // get Image extension
        var UserProfileImage_ImageExtension = UserProfileImage_ImageName.substring(UserProfileImage_ImageName.lastIndexOf(".") + 1, UserProfileImage_ImageName.length).toUpperCase();

        // Split the Extension with '|' 
        UserProfileImage_ExtensionAllowed = UserProfileImage_ExtensionAllowed.split("|");
        //  First check extension
        if (jQuery.inArray(UserProfileImage_ImageExtension, UserProfileImage_ExtensionAllowed) > -1) {
            //next file size
            if (UserProfileImage_SizeAllowed >= UserProfileImage_ImageSize) {
                var fileTransfer = new FileTransfer();
                var uri = encodeURI(smallImage.src);
                var user = JSON.parse(localStorage.getItem("userdata"));
                var Login_ID = user.Login_ID;
                var Employee_ID = user.Employee_ID;
                var fileURL = cordova.file.cacheDirectory + "/" + Login_ID + ".png";
                fileTransfer.download(
                    uri, fileURL,
                    function (entry) {
                        // $("#info").html("download complete: " + entry.toURL());
                        //var uri2 = encodeURI("http://137.116.157.40/EthosFilesUpload/UploadedFiles/Ethos_App/upload.php");
                        //var uri2 = encodeURI("http://210.18.113.115/csrtree/upload.php");
                        var uri2 = encodeURI("http://himalayasql.cloudapp.net/EthosFilesUpload/UploadedFiles/Ethos_App/upload.php");
                        var options = new FileUploadOptions();
                        options.fileKey = "file";
                        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                        options.mimeType = "image/webp";
                        options.chunkedMode = false;

                        options.headers = {
                            Connection: "close"
                        };
                        var ft = new FileTransfer();
                        ft.onprogress = function (progressEvent) {
                            if (progressEvent.lengthComputable) {
                                loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                            } else {
                                loadingStatus.increment();
                            }
                        };
                        ft.upload(fileURL, uri2, onSuccess, onError, options);
                        function onSuccess(r) {
                            var suc;
                            suc = "Code = " + r.responseCode;
                            suc = suc + " <br> Response = " + r.response;
                            suc = suc + " <br> Sent = " + r.bytesSent;
                            // $("#info").html(suc);
                        }

                        function onError(error) {
                            var err;
                            alert("An error has occurred: Code = " + error.code);
                            err = "upload error source " + error.source;
                            err = err + " <br> upload error target " + error.target;

                            // $("#info").html(err);
                        }
                    },

                    function (error) {
                        var err;
                        err = "download error source " + error.source;
                        err = err + " <br> download error target " + error.target;
                        err = err + " <br> download error code" + error.code;

                        // $("#info").html(err);
                    },

                    false, {
                        headers: {
                            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        }
                    }
                );
            }
            else {
                app.notify.error(UserProfileImage_SizeError.replace("{0}", UserProfileImage_SizeAllowed));
                return false;
            }
        }
        else {
            app.notify.error(UserProfileImage_ExtensionError.replace("{0}", UserProfileImage_ExtensionAllowed));
            return false;
        } 
    },
    
    //_onPhotoURISuccess: function(imageURI) {
    //    var smallImage = document.getElementById('img_user_profile');
    //    smallImage.style.display = 'block';
         
    //    // Show the captured photo.
    //    smallImage.src = imageURI;
		
	//	var fileTransfer = new FileTransfer();
    //    var uri = encodeURI("data:image/webp;base64," + smallImage.src);
    //    //var fileURL ="///storage/emulated/0/DCIM/Screenshots/sample3.png"; 
    //    var fileURL = cordova.file.cacheDirectory + "/" + Login_ID + ".png";
    //    fileTransfer.download(
    //        uri, fileURL,
    //        function(entry) {
    //            // $("#info").html("download complete: " + entry.toURL());
    //            var uri2 = encodeURI("http://210.18.113.115/csrtree/upload.php");
    //            var options = new FileUploadOptions();

    //            options.fileKey = "file";
    //            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    //            options.mimeType = "image/webp";
    //            options.chunkedMode = false;
                
    //            options.headers = {
    //                Connection: "close"
    //            };
    //            var ft = new FileTransfer();
    //            ft.onprogress = function(progressEvent) {
    //                if (progressEvent.lengthComputable) {
    //                    loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
    //                } else {
    //                    loadingStatus.increment();
    //                }
    //            };
    //            ft.upload(fileURL, uri2, onSuccess, onError, options);
    //            function onSuccess(r) {
    //                var suc;
    //                suc = "Code = " + r.responseCode;
    //                suc = suc +" <br> Response = " + r.response;
    //                suc = suc +" <br> Sent = " + r.bytesSent;
    //                alert(suc);

    //            }

    //            function onError(error) {
    //                var err;
    //                alert("An error has occurred: Code = " + error.code);
    //                err = "upload error source " + error.source;
    //                err = err +" <br> upload error target " + error.target;

    //                // $("#info").html(err);
    //            }
    //        },

    //        function(error) {
    //            var err;
    //            err="download error source " + error.source;
    //            err = err + " <br> download error target " + error.target;
    //            err = err + " <br> download error code" + error.code;

    //            // $("#info").html(err);
    //        },

    //        false, {
    //            headers: {
    //                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
    //            }
    //        }
    //    );
		
    //},
    
    _onFail: function(message) {
        alert(message);
    }
}