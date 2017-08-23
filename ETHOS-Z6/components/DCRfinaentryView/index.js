
'use strict';

(function () {
    var view = app.DCRfinaentryView = kendo.observable();
    var DCRfinaentryViewModel = kendo.observable({
        dcrfinalentryValidator: null,
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRfinaentryView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            var render_dcrmaster = function (tx, rs) {
                $("#txtdeviationreason").val(rs.rows.item(0).deviation_reason);
                $("#txtdescription").val(rs.rows.item(0).deviation_description);
                $("#hdn_dcr_master_date").val(rs.rows.item(0).dcr_date);
                $("#hdn_dcr_master_activity_id").val(rs.rows.item(0).activity_id);
                $("#hdn_dcr_master_activity_period").val(rs.rows.item(0).activity_peroid_id);
            }
            app.select_dcr_master_by_dcr_master_id(render_dcrmaster, 1);
            fun_get_dcr_master_ww_data_finalentry();
            fun_get_dcr_ins_master_data_finalentry();
        },
        savefinalentrydetails: function () {
            //update dcr master deviaion details n description 
            var txtdeviationreason = $('#txtdeviationreason').val();
            app.update_dcr_master_deviation(1, txtdeviationreason, $('#txtdescription').val());
            if (localStorage.getItem("dcrtourplandetails_live") == null ||
                localStorage.getItem("dcrtourplandetails_live") != 1) {
                fun_get_assign_check_deviation();
            }
            else {
                fun_check_deviation_details();
            }

        }
    });
    view.set('DCRfinaentryViewModel', DCRfinaentryViewModel);
}());
function fun_clearcontrols_dcrmaster_finalentry() {
    $("#txtdeviationreason").val('');
    $("#txtdescription").val('');
}

function fun_get_dcr_master_ww_data_finalentry() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_master_ww_details_string_finalentry").val(JSON.stringify(valuedata));
    }
    app.select_dcr_master_ww_details(renderstr);
}

function fun_get_dcr_ins_master_data_finalentry() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_ins_master_string_finalentry").val(JSON.stringify(valuedata));
    }
    app.select_dcr_master_by_dcr_master_id(renderstr, 1);
}

function fun_check_deviation_details() {

    var data = JSON.parse(localStorage.getItem("dcrtourplandetails"));
    if (data[0].Output_ID == 1) {
        app.navigation.navigateDCRpreviewView();
    }
    else {
        var txtdeviationreason = $('#txtdeviationreason').val();
        if (data[0].Output_ID == 0 && txtdeviationreason == "") {
            app.notify.error(data[0].Output_Message);
            return false;
        }
        //update dcr master deviaion details n description 
        app.update_dcr_master_deviation(1, txtdeviationreason, $('#txtdescription').val());
        //fun_clearcontrols_dcrmaster_finalentry();
        app.navigation.navigateDCRpreviewView();
    }
}
function fun_get_assign_check_deviation() {
    var user = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = user.Employee_ID
    var Sub_Territory_ID = user.Sub_Territory_ID;
    var DailyReport_Date = $('#hdn_dcr_master_date').val();
    var Activity_Period_ID = $('#hdn_dcr_master_activity_period').val();
    var Activity_ID = $('#hdn_dcr_master_activity_id').val();
    var DCR_Master_WW_Details_String = $('#hdndcr_master_ww_details_string_finalentry').val();
    //var DCR_Ins_Master_String = $('#hdndcr_ins_master_string_finalentry').val();
    app.utils.loading(true);
    fun_db_APP_Get_Z6_DCR_Check_Deviation(Employee_ID, Sub_Territory_ID, DailyReport_Date,
    Activity_Period_ID, Activity_ID, DCR_Master_WW_Details_String);
}

function fun_db_APP_Get_Z6_DCR_Check_Deviation(Employee_ID, Sub_Territory_ID, DailyReport_Date,
    Activity_Period_ID, Activity_ID, DCR_Master_WW_Details_String, DCR_Ins_Master_String) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_Check_Deviation",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID, "Sub_Territory_ID": Sub_Territory_ID,
                    "DailyReport_Date": DailyReport_Date, "Activity_Period_ID": Activity_Period_ID,
                    "Activity_ID": Activity_ID, "DCR_Master_WW_Details_String": DCR_Master_WW_Details_String 
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data;
                return getdata;
            }
        },
        error: function (e) {
            // alert(e);
            app.utils.loading(false);
            app.notify.error('Error loading data please try again later!');
        }
    });
    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        localStorage.setItem("dcrtourplandetails", JSON.stringify(data[0])); // tourplan details  based on empid,sub id,reported date
        localStorage.setItem("dcrtourplandetails_live", 1);
        fun_check_deviation_details();
    });
}

