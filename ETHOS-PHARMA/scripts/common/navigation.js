(function () {
    app.navigation = {
        logincheck: function () {
            //alert(app.user);
            if ($('#hdnLogin_ID').val() === 0) {
                return app.mobileApp.navigate('components/authenticationView/view.html');
            }
        }, 
        back: function () {
            app.mobileApp.navigate('#:back');
            app.utils.loading(false);
        },
        navigateNoAppId: function () {
            return app.mobileApp.navigate('components/missingSettingsView/noappidView.html');
        },
        navigateAuthentication: function () {
            return app.mobileApp.navigate('components/authenticationView/view.html');
        }, 
        //right side menu start
        navigatedashboard: function () {
            return app.mobileApp.navigate('components/dashboardView/view.html');
        },
        navigateteamcoverage: function () {
            return app.mobileApp.navigate('components/teamcoverageView/view.html');
        },
        //LMS start
        navigateLMSleavemanagementView: function () {
            return app.mobileApp.navigate('components/LMSleavemanagementView/view.html');
        },
        navigateLMSapplyleaveView: function () {
            return app.mobileApp.navigate('components/LMSapplyleaveView/view.html');
        },
        navigateLMScancelleaveView: function () {
            return app.mobileApp.navigate('components/LMScancelleaveView/view.html');
        },
        navigateLMSleavehistoryView: function () {
            return app.mobileApp.navigate('components/LMSleavehistoryView/view.html');
        },
        navigateLMSapproveleaveView: function () {
            return app.mobileApp.navigate('components/LMSapproveleaveView/view.html');
        },
        navigateLMSapproveleavecancelView: function () {
            return app.mobileApp.navigate('components/LMSapproveleavecancelView/view.html');
        },
        //LMS start end

        //DCR start
        navigateDCRstartView: function () {
            return app.mobileApp.navigate('components/DCRstartView/view.html');
        },
        navigateDCRmasterView: function () {
            return app.mobileApp.navigate('components/DCRmasterView/view.html');
        },
        navigateDCRinstitutionView: function () {
            return app.mobileApp.navigate('components/DCRinstitutionView/view.html');
        },
        navigateDCRunlistedinstitutionView: function () {
            return app.mobileApp.navigate('components/DCRunlistedinstitutionView/view.html');
        },
        navigateDCRfinaentryView: function () {
            return app.mobileApp.navigate('components/DCRfinaentryView/view.html');
        },
        navigateDCRpreviewView: function () {
            return app.mobileApp.navigate('components/DCRpreviewView/view.html');
        },
        //DCR end  
        navigateGPSworklocationsView: function () {
            return app.mobileApp.navigate('components/GPSworklocationsView/view.html');
        },
        navigateholidays: function () {
            return app.mobileApp.navigate('components/holidaysView/view.html');
        }, 
        //left side menu  start 
        navigateProfile: function () {
            return app.mobileApp.navigate('components/updateprofileView/view.html');
        },
        navigatechangepassword: function () {
            return app.mobileApp.navigate('components/changepasswordView/view.html');
        },
        navigatesignout: function () {
            var confirmation = "Are you sure you want to log out?";
            app.notify.confirmation(confirmation, function (confirm) {
                if (!confirm) {
                    return;
                }
                return app.mobileApp.navigate('components/authenticationView/view.html?action=logout');
            })
        },

        navigatesupport: function () {
            return app.mobileApp.navigate('components/supportView/view.html');
        },
        //left side menu  end         
        
        //common page for offline and GPS disabled
        navigateoffline: function (redirect) {
            return app.mobileApp.navigate('components/offlineView/view.html?pageid=' + redirect);
        },  
    };
}());