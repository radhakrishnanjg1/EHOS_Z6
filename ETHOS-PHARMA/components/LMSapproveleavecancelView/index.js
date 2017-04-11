
'use strict';

(function () {
    var view = app.LMSapproveleavecancelView = kendo.observable();
    var LMSapproveleavecancelViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("LMSapproveleavecancelView");
            }
            app.navigation.logincheck();
            app.utils.loading(true);
            fun_db_APP_Get_Ethos_Leave_Cancel_Approve(parseInt($('#hdnEmployee_ID').val())); 
        },  
    }); 
    view.set('LMSapproveleavecancelViewModel', LMSapproveleavecancelViewModel);
}());


function fun_load_leave_cancel_details(records) {
    var alldivision = JSON.parse(records);
    $("#listview-leavecancelapproval").kendoMobileListView({
        dataSource: alldivision,
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-leavecancelapproval").append("<li>No records found!</li>");
            }
        },
        template: $("#template-leavecancelapproval").html(),
    });
}
 
function fun_leavecancelapprove(e) {
    var data = e.button.data();
    var ethos_leave_master_id = data.ethos_leave_master_id;
    var employee_id = data.employee_id;
    var leave_type_id = data.leave_type_id;  
    var confirmation = "Are you sure you want to approve?";
    app.notify.confirmation(confirmation, function (confirm) {
        if (!confirm) {
            return;
        }
        app.utils.loading(true);
        fun_db_APP_Update_Ethos_Leave_Cancel_Approve(ethos_leave_master_id, parseInt($("#hdnLogin_ID").val()),
       employee_id, leave_type_id);
    });
}
 

function fun_db_APP_Get_Ethos_Leave_Cancel_Approve(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Ethos_Leave_Cancel_Approve",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID
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
        fun_load_leave_cancel_details(JSON.stringify(data));
        app.utils.loading(false);
    });

}

function fun_db_APP_Update_Ethos_Leave_Cancel_Approve(Ethos_leave_master_id, Cancel_Approved_By,
    Employee_ID, Leave_Type_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Update_Ethos_Leave_Cancel_Approve",
                type: "POST",
                dataType: "json",
                data: {
                    "Ethos_leave_master_id": Ethos_leave_master_id,
                    "Cancel_Approved_By": Cancel_Approved_By, "Employee_ID": Employee_ID,
                    "Leave_Type_ID": Leave_Type_ID,
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data[0];
                return getdata;
            }
        },
        error: function (e) {
            app.utils.loading(false); // alert(e);
            app.notify.error('Error loading data please try again later!');
        }
    });
    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        if (data[0].Output_ID == 1) {
            app.notify.success(data[0].Output_Message);
            app.navigation.navigateLMSleavemanagementView();
        }
        else {
            app.notify.error(data[0].Output_Message);
        }
    });
}

