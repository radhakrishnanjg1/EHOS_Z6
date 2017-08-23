(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.config = {
        everlive: {
            appId: 'demtnkv7hvet83u0', // Put your Backend Services App ID here
            scheme: 'http'
        },
        views: {
            init: '#initView'
        }
    };

    app.androidProjectNumber = '944328119073'; // Put your Google API project number here
    

    app.constants = {
        NO_APP_ID_MESSAGE: '<h3>Telerik Platform <strong>App ID</strong> is not set.</h3><p><span>App ID</span> ' +
        'links the sample mobile app to a Telerik Platform app.</p><p>To set the <span>App ID</span> ' +
        'open the <span>/scripts/config.js</span> file and replace <strong>$TELERIK_APP_ID$</strong> with the ' +
        '<span>App ID</span> of your Telerik app.</p>',

        NO_GOOGLE_API_PROJECT_NUMBER: '<h3>Missing Google API Project Number!</h3> ' +
        '<p>It appears that you have not filled in your Google API project number. ' +
        'It is required for push notifications on Android.</p> ' +
        '<p>Please go to <span>/scripts/config.js</span> and replace <strong>$ANDROID_PROJECT_NUMBER$</strong> whit the ' +
        '<span>Google API project number</span> at the beginning of the file.</p>',

        SUCCESS_TEXT: 'SUCCESS!<br /><br />The device has been registered for push notifications.<br /><br />',
        UNREGISTERED_TEXT: 'Device successfully unregistered.',
        EMULATOR_MODE: false
    };
    
    app.everlive = new Everlive({
        appId: app.config.everlive.appId,
        scheme: app.config.everlive.scheme
    });
	
    
    app.showAlert = function(message, title, callback) {
        app.navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };

    app.showError = function(message) {
        app.showAlert(message, 'Error occured');
    };
    
    app.showLoading = function () {
        app.mobile.showLoading();
    };
    
    app.hideLoading = function () {
        app.mobile.hideLoading();
    };
    
    app.isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    app.isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !app.isNullOrEmpty(key) && !regEx.test(key);
    };
    
    app.getYear = function () {
        return new Date().getFullYear();
    };
    
    // if (!app.isKeySet(app.config.everlive.appId)) {
    //     $(app.config.views.init).hide();
    //     $('#kendoUiMobileApp').addClass('noappid-scrn').html(app.constants.NO_APP_ID_MESSAGE);
    //     return;
    // } else if (!app.isKeySet(app.androidProjectNumber) && app.device.platform.toLowerCase() === 'android') {
    //     $(app.config.views.init).hide();
    //     $('#kendoUiMobileApp').addClass('noappid-scrn').html(app.constants.NO_GOOGLE_API_PROJECT_NUMBER);
    //     return;
    // }
   
}(window));


