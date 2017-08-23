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
        },
        homepage: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var IsManager = userdata.IsManager;
            if (IsManager)
            {
                return app.mobileApp.navigate('components/teamcoverageView/view.html');
            }
            return app.mobileApp.navigate('components/dashboardView/view.html'); 
        },
        navigateNoAppId: function () {
            return app.mobileApp.navigate('components/missingSettingsView/noappidView.html');
        },
        navigateAuthentication: function () {
            return app.mobileApp.navigate('components/authenticationView/view.html');
        },
        navigateAppDashboardView: function () {
            return app.mobileApp.navigate('components/AppDashboardView/view.html');
        },
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
        navigateTeamAbsensesView: function () {
            return app.mobileApp.navigate('components/TeamAbsensesView/view.html');
        },
        //LMS start end

        //DCR start
        navigateDCRmanagementView: function () {
            return app.mobileApp.navigate('components/DCRmanagementView/view.html');
        },
        navigateDCRstartView: function () {
            return app.mobileApp.navigate('components/DCRstartView/view.html');
        },
        navigateDCRmasterView: function () {
            return app.mobileApp.navigate('components/DCRmasterView/view.html');
        },
        navigateDCRlistedMSLView: function () {
            return app.mobileApp.navigate('components/DCRlistedMSLView/view.html');
        },
        navigateDCRunlistedMSLView: function () {
            return app.mobileApp.navigate('components/DCRunlistedMSLView/view.html');
        },
        navigateDCRfinaentryView: function () {
            return app.mobileApp.navigate('components/DCRfinaentryView/view.html');
        },
        navigateDCRpreviewView: function () {
            return app.mobileApp.navigate('components/DCRpreviewView/view.html');
        },
        navigateDCRreportView: function () {
            return app.mobileApp.navigate('components/DCRreportView/view.html');
        },
        //DCR end  
        navigateGPSworklocationsView: function () {
            return app.mobileApp.navigate('components/GPSworklocationsView/view.html');
        },
        
        navigateLastActivitiesView: function () {
            return app.mobileApp.navigate('components/LastActivitiesView/view.html');
        },

        //Master Start 

        navigateMastermanagementView: function () {
            return app.mobileApp.navigate('components/MastermanagementView/view.html');
        },
        navigateMSLView: function () {
            return app.mobileApp.navigate('components/MSLView/view.html');
        },
        navigateMSLDoctorView: function () {
            return app.mobileApp.navigate('components/MSLDoctorView/view.html');
        },

        navigateMSLChemistView: function () {
            return app.mobileApp.navigate('components/MSLChemistView/view.html');
        },
        navigateMarketAreaView: function () {
            return app.mobileApp.navigate('components/MarketAreaView/view.html');
        },
        navigateMyTeamView: function () {
            return app.mobileApp.navigate('components/MyTeamView/view.html');
        },
        navigateMasterPromoBalanceView: function () {
            return app.mobileApp.navigate('components/MasterPromoBalanceView/view.html');
        },
        //Master End 

        //TP Start 

        navigateTourplanmanagementView: function () {
            return app.mobileApp.navigate('components/TourplanmanagementView/view.html');
        },
        navigateTourplanEntryView: function () {
            return app.mobileApp.navigate('components/TourplanEntryView/view.html');
        },
        navigateTourplanPreviewView: function () {
            return app.mobileApp.navigate('components/TourplanPreviewView/view.html');
        },
        navigateTourplanView: function () {
            return app.mobileApp.navigate('components/TourplanView/view.html');
        },
        //TP end  

        

        navigateholidays: function () {
            return app.mobileApp.navigate('components/holidaysView/view.html');
        },
        navigateEDetailingView: function () {
            return app.mobileApp.navigate('components/EDetailingView/view.html');
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