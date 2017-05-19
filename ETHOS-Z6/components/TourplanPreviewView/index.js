
'use strict';

(function () {
    var view = app.TourplanPreviewView = kendo.observable();
    var TourplanPreviewViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("TourplanPreviewView");
            }
            app.navigation.logincheck();

        },
        afterShow: function () {
            fun_get_tour_all_details();
            var render_dcrmaster = function (tx, rs) {
                $("#dvtourplanmaster_date").html(rs.rows.item(0).tp_date);
                $("#hdntourplanmaster_periodid").val(rs.rows.item(0).activity_peroid_id);
                $("#dvtourplanmaster_period").html(rs.rows.item(0).activity_peroid_name);
                $("#hdntourplanmaster_activityid").val(rs.rows.item(0).activity_id);
                $("#dvtourplanmaster_activity").html(rs.rows.item(0).activity_name);

                $("#dvtourplanmaster_category").html(rs.rows.item(0).category_name);
                $("#hdntourplanmaster_categoryid").val(rs.rows.item(0).category_id);
                $("#dvtourplanmaster_mode").html(rs.rows.item(0).mode_name);
                $("#hdntourplanmaster_modeid").val(rs.rows.item(0).mode_id);

                $("#dvtourplanmaster_tp_contact").html(rs.rows.item(0).tp_contact);
                $("#dvtourplanmaster_tp_objective").html(rs.rows.item(0).tp_objective);
                fun_load_tourplan_master_ww(1);
                fun_load_tourplan_master_mj(1);
            }
            app.select_tourplan_master(render_dcrmaster);
        },
        submitdcrdetails: function () {
            var hdndcr_ins_master_string = $('#hdndcr_ins_master_string').val();
            var hdndcr_unlisted_ins_master_string = $('#hdndcr_unlisted_ins_master_string').val();
            var hdnactivity_id = $("#hdnactivity_id").val();
            if (hdnactivity_id == 235 && (hdndcr_ins_master_string == "[]" || hdndcr_unlisted_ins_master_string == "[]")) {
                app.notify.error("MSL or unlisted should not be empty!");
                return false;
            }
            var confirmation = "Are you sure you want to save the details?";
            app.notify.confirmation(confirmation, function (confirm) {
                if (!confirm) {
                    return;
                }
                fun_save_dcr_all_details();
            })
        },

        cleardcrdetails: function () {
            var confirmation = "Are you sure you want to clear the enteries?";
            app.notify.confirmation(confirmation, function (confirm) {
                if (!confirm) {
                    return;
                }
                fun_delete_all_dcrrecords();
                fun_set_dcr_fields();
                app.navigation.navigateDCRstartView();
            })
        },
    });

    view.set('TourplanPreviewViewModel', TourplanPreviewViewModel);
}());

function fun_save_dcr_all_details() {

    var userdata = JSON.parse(localStorage.getItem("userdata"));
    var Login_ID = parseInt(userdata.Login_ID);
    var Employee_ID = parseInt(userdata.Employee_ID);
    var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);

    app.utils.loading(true);
    var Activity_ID = parseInt($("#hdnactivity_id").val());
    fun_db_APP_Insert_Z6_TP_Details(Login_ID,
Employee_ID,
Sub_Territory_ID,
$("#dvtourplanmaster_date").html(),
$("#hdntourplanmaster_periodid").val(),

$("#hdntourplanmaster_activityid").val(),
$("#hdntourplanmaster_categoryid").val(),
$("#hdntourplanmaster_modeid").val(),
$("#dvtourplanmaster_tp_contact").html(),
$("#dvtourplanmaster_tp_objective").html(),

$("#hdntourplan_master_string").val(),
$("#hdntourplan_master_ww_details_string").val(),
$("#hdntourplan_master_mj_details_string").val()
    );
}
function fun_get_tour_all_details() {
    fun_get_tourplan_master_data();
    fun_get_tourplan_master_ww_data();
    fun_get_tourplan_master_mj_data();
}


function fun_clear_tp_entry_all_details() {
    $("#hdntourplan_master_string").val('');
    $("#hdntourplan_master_ww_details_string").val('');
    $("#hdntourplan_master_mj_details_string").val('');

    $("#hdntourplanmaster_periodid").val('');
    $("#hdntourplanmaster_activityid").val('');
    $("#hdntourplanmaster_categoryid").val('');
    $("#hdntourplanmaster_modeid").val('');
}

function fun_get_tourplan_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdntourplan_master_string").val(JSON.stringify(valuedata));
    }
    app.select_tourplan_master(renderstr);
}

function fun_get_tourplan_master_ww_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdntourplan_master_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_tourplan_master_ww_details(renderstr);
}

function fun_get_tourplan_master_mj_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdntourplan_master_mj_details_string").val(JSON.stringify(valuedata));
    }
    app.select_tourplan_master_mj_details(renderstr);
}

function fun_load_tourplan_master_ww(hdntourplan_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-tp_entrymasterww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-tp_entrymasterww").append("<li>No records found!</li>");
                }
            },
            template: $("#template-tp_entrymasterww").html(),
        });
    }
    app.select_tourplan_master_ww_details(render_control, 1);
}

function fun_load_tourplan_master_mj(hdntourplan_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-tp_entrymastermj").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-tp_entrymastermj").append("<li>No records found!</li>");
                }
            },
            template: $("#template-tp_entrymastermj").html(),
        });
    }
    app.select_tourplan_master_mj_details(render_control, hdntourplan_master_id);
}
 
function fun_db_APP_Insert_Z6_TP_Details(Login_ID, Employee_ID, Sub_Territory_ID,
    TourPlan_Date, Activity_Period_ID, Activity_ID,
        Mode_ID, Category_ID, Contact_Details,
        Specific_Objective, TP_Master_String, TP_Master_WW_Details_String,
        TP_Master_MJ_Details_String
        ) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Insert_Z6_TP_Details",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": Login_ID, "Employee_ID": Employee_ID, "Sub_Territory_ID": Sub_Territory_ID,
                    "TourPlan_Date": TourPlan_Date, "Activity_Period_ID": Activity_Period_ID, "Activity_ID": Activity_ID,
                    "Mode_ID": Mode_ID, "Category_ID": Category_ID, "Contact_Details": Contact_Details,
                    "Specific_Objective": Specific_Objective, "TP_Master_String": TP_Master_String,
                    "TP_Master_WW_Details_String": TP_Master_WW_Details_String,
                    "TP_Master_MJ_Details_String": TP_Master_MJ_Details_String
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
            fun_clear_tp_entry_all_details();  
            fun_delete_existing_tourplan_details();
            app.navigation.navigateTourplanEntryView();
        }
        else if (data[0].Output_ID == 0) {
            app.notify.error(data[0].Output_Message);
        }
        else {
            app.notify.error(data[0].Output_Message);
            fun_db_adderrorlog(parseInt($('#hdnLogin_ID').val()), app.constants.appname,
                data[0].Output_Message, data[0].ErrorMessage);
        }
    });
}


function fun_db_adderrorlog(Login_ID, App_Name, Error_key, Error_Message) {
    var errorlogds = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Insert_Error_Log",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": Login_ID,
                    "App_Name": App_Name,
                    "Error_key": Error_key,
                    "Error_Message": Error_Message,
                }
            }
        },
        schema: {
            parse: function (response) {
                var errordetails = response.Result.Data[0];
                return errordetails;
            }
        },
        error: function (e) {
            app.utils.loading(false); // alert(e);
            app.notify.error('Error loading data please try again later!');
        }
    });
    errorlogds.fetch();
}

