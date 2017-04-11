
'use strict';

(function () {
    var view = app.LMSapproveleaveView = kendo.observable();
    var validator;
    var LMSapproveleaveViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("LMSapproveleaveView");
            }
            app.navigation.logincheck();
            app.utils.loading(true);
            fun_db_APP_Get_Ethos_Leave_Approve(parseInt($('#hdnEmployee_ID').val()));
            $('#hdnaprvleave_ethos_leave_master_id').val('0');
            //fun_db_APP_Get_Ethos_Leave_Approve(2478); 
        },  
    });

    view.set('LMSapproveleaveViewModel', LMSapproveleaveViewModel);
}());

 

function load_leave_approve_details(records) { 
    var alldivision = JSON.parse(records);  
    $("#listview-leaveapprovedetail").kendoMobileListView({
        dataSource: alldivision,
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-leaveapprovedetail").append("<li>No records found!</li>");
            }
        },
        template: $("#template-leaveapprovedetail").html(), 
    });
}

function fun_leave_approve(e) {
    var data = e.button.data();
    var ethos_leave_master_id = data.ethos_leave_master_id;
    var remarks = "";
    var employee_id = data.employee_id;
    var leave_type_id = data.leave_type_id; 
    var confirmation = "Are you sure you want to approve?";
    app.notify.confirmation(confirmation, function (confirm) {
        if (!confirm) {
            return;
        }
        app.utils.loading(true);
        fun_db_APP_Update_Ethos_Leave_Approval(ethos_leave_master_id, "", employee_id,
        leave_type_id, 1, parseInt($("#hdnLogin_ID").val()), parseInt($("#hdnLogin_ID").val()));
    });
}

function fun_leave_reject(e) {
    var data = e.button.data();
    $('#hdnaprvleave_ethos_leave_master_id').val(data.ethos_leave_master_id);  
    $("#modalview-approveleave").kendoMobileModalView("open");
}

function closemodalviewapproveleave() {
    $("#modalview-approveleave").kendoMobileModalView("close");
}

function fun_leave_reject_submit() {
    var remarks = $('#txtremarks').val();
    if (remarks != "") {
        var ethos_leave_master_id = parseInt($('#hdnaprvleave_ethos_leave_master_id').val());
        if (ethos_leave_master_id != 0) {
            app.utils.loading(true);
            fun_db_APP_Update_Ethos_Leave_Rejected(ethos_leave_master_id, remarks, 1,
                parseInt($("#hdnLogin_ID").val()), parseInt($("#hdnLogin_ID").val()));
        }
    }
    else
    {
        app.notify.error('Enter the remarks to proceed!');
    } 
}

function fun_db_APP_Get_Ethos_Leave_Approve(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Ethos_Leave_Approve",
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
        load_leave_approve_details(JSON.stringify(data));
        app.utils.loading(false);
    });

}

function fun_db_APP_Update_Ethos_Leave_Approval(Ethos_leave_master_id, Remarks, Employee_ID,
    Leave_Type_ID, isapproved, approved_by,
    last_modified_by) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Update_Ethos_Leave_Approval",
                type: "POST",
                dataType: "json",
                data: {
                    "Ethos_leave_master_id": Ethos_leave_master_id, "Remarks": Remarks, "Employee_ID": Employee_ID,
                    "Leave_Type_ID": Leave_Type_ID, "isapproved": isapproved, "approved_by": approved_by,
                    "last_modified_by": last_modified_by
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


function fun_db_APP_Update_Ethos_Leave_Rejected(Ethos_leave_master_id, Remarks, isrejected,
    rejected_by, last_modified_by) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Update_Ethos_Leave_Rejected",
                type: "POST",
                dataType: "json",
                data: {
                    "Ethos_leave_master_id": Ethos_leave_master_id, "Remarks": Remarks, "isrejected": isrejected,
                    "rejected_by": rejected_by,"last_modified_by": last_modified_by
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
            app.navigation.navigateleavemanagement();
        }
        else {
            app.notify.error(data[0].Output_Message);
        }
    });
}

