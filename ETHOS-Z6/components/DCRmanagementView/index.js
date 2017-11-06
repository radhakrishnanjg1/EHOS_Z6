
'use strict';

(function () {
    var view = app.DCRmanagementView = kendo.observable();
    var DCRmanagementViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRmanagementView");
            }
            app.navigation.logincheck();   
        },
        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var DCR_Type = parseInt(userdata.DCR_Type);
            if (DCR_Type == 0) { 
                $("#dvnavigatedcrstartview").show();  
            }
            else {
                $("#dvnavigatedcrstartview").hide(); 
            }
        },
        onRefresh: function () {  
        },

    });

    view.set('DCRmanagementViewModel', DCRmanagementViewModel);
}());

function fun_call_dcr_validation() {
    var userdata = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = parseInt(userdata.Employee_ID);
    var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
    var Designation_ID = parseInt(userdata.Designation_ID);
    var Division_ID = parseInt(userdata.Division_ID);
    var Authentication = parseInt(userdata.Authentication);
    var Login_ID = parseInt(userdata.Login_ID); 
    app.utils.loading(true);
    fun_db_APP_Get_Z6_DCR_Validation(Employee_ID, Sub_Territory_ID, Designation_ID,
    Division_ID, Authentication, Login_ID)
}
 
function fun_db_APP_Get_Z6_DCR_Validation(Employee_ID, Sub_Territory_ID, Designation_ID,
    Division_ID, Authentication, Login_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_Validation",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID,
                    "Sub_Territory_ID": Sub_Territory_ID,
                    "Designation_ID": Designation_ID,
                    "Division_ID": Division_ID,
                    "Authentication": Authentication,
                    "Login_ID": Login_ID, 
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data[0];
                return getdata;
            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        //DCR_Possible - 1 Valid | 0 InValid
        if (data[0].Output_ID == 1) {
            app.utils.loading(false);
            app.navigation.navigateDCRstartView();
        }
        else {
            app.notify.error(data[0].Output_Message); 
            app.utils.loading(false);
        }
    });
}
