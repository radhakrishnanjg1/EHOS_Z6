
'use strict';

(function () {
    var view = app.LMScancelleaveView = kendo.observable();
    var LMScancelleaveViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("LMScancelleaveView");
            }
            app.navigation.logincheck();
            app.utils.loading(true);
              fun_db_APP_Get_Ethos_Leave_Cancel(parseInt($('#hdnEmployee_ID').val())); 
            $('#hdn_leavecancel_ethos_leave_master_id').val('0');
        },  
    }); 
    view.set('LMScancelleaveViewModel', LMScancelleaveViewModel);
}());


function fun_cancelleave_canceldetails(records) {
    var alldivision = JSON.parse(records);
    $("#listview-leavecanceldetail").kendoMobileListView({
        dataSource: alldivision,
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-leavecanceldetail").append("<li>No records found!</li>");
            }
        },
        template: $("#template-leavecanceldetail").html(),
    });
}
 
function fun_leavecancel_openmodalview(e) {
    var data = e.button.data();
    $('#hdn_leavecancel_ethos_leave_master_id').val(data.ethos_leave_master_id);
    $("#modalview-cancelleave").kendoMobileModalView("open");
}

function fun_leavecancel_savedetails() {
    var remarks = $('#txtremarks').val();
    if (remarks != "") {
        var ethos_leave_master_id = parseInt($('#hdn_leavecancel_ethos_leave_master_id').val());
        if (ethos_leave_master_id != 0) {
            app.utils.loading(true);
            fun_db_APP_Update_Ethos_Leave_Cancel(ethos_leave_master_id, remarks, parseInt($("#hdnLogin_ID").val()));
        }
    }
    else {
        app.notify.error('Enter the reason for cancellation!');
    }
}

function fun_leavecancel_closemodalview() {
    $("#modalview-cancelleave").kendoMobileModalView("close");
}

function fun_db_APP_Get_Ethos_Leave_Cancel(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/App_Get_Ethos_Leave_Cancel",
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
        fun_cancelleave_canceldetails(JSON.stringify(data));
        app.utils.loading(false);
    });

}

function fun_db_APP_Update_Ethos_Leave_Cancel(Ethos_leave_master_id, Reason_For_Cancel, cancelled_by) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Update_Ethos_Leave_Cancel",
                type: "POST",
                dataType: "json",
                data: {
                    "Ethos_leave_master_id": Ethos_leave_master_id, "Reason_For_Cancel": Reason_For_Cancel, "cancelled_by": cancelled_by, 
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

