
'use strict';

(function () {
    var view = app.DCRstartView = kendo.observable();
    var DCRstartViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRstartView");
            } 
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            //fun_show_dcr_startView();
           //$("#dvDCRstartView").show();
            get_dcr_master_values();
            get_dcr_master_category_id();
            get_dcr_selected_worked_with();
            get_list_dcr_selected_worked_with();
            get_dcr_selected_market_areas_values();
            get_list_dcr_selected_market_areas_values();
        },
        redirecttocontinuedcr: function () { 
             redirectDCRView();
            //app.navigation.navigateDCRmasterView();
        }
    });

    view.set('DCRstartViewModel', DCRstartViewModel);
}());


function redirectDCRView() {
    var dcr_isavailable = parseInt($("#hdn_old_dcr_master_id").val());
    var activity_id = parseInt($("#hdn_old_activity_id").val());
    var activity_period_id = parseInt($("#hdn_old_activity_period_id").val());

    if (dcr_isavailable == 1 && activity_id == 235) {
        //redirect to instiution page as default    
        app.navigation.navigateDCRlistedMSLView();
    }
    else if (dcr_isavailable == 1
        && (activity_id == 236 || activity_id == 239
       || activity_id == 240 || activity_id == 241
        || activity_id == 247
       || activity_id == 248 || activity_id == 249
       || activity_id == 250 || activity_id == 251
       || activity_id == 252 || activity_id == 253
       || activity_id == 254 || activity_id == 255
       || activity_id == 256 || activity_id == 258
        || activity_id == 237 || activity_id == 238
            || activity_id == 242 || activity_id == 243
            || activity_id == 244 || activity_id == 1131)) { //redirect to final entry page
        app.navigation.navigateDCRfinaentryView(); 
    }
    else if (dcr_isavailable == 1 ||
        isNaN(dcr_isavailable) ||
        activity_period_id == 0 ||
        isNaN(activity_period_id) == null ||
        activity_id == 0 ||
        isNaN(activity_id) == null
        ) {
        fun_delete_all_dcr_records();
        fun_set_all_dcr_fields();
        app.navigation.navigateDCRmasterView();
    }
}


function get_dcr_master_category_id() { 
     var render_dcr_master_id = function (tx, rs) {
        if (rs.rows.length > 0) { 
            $("#hdn_dcr_category_id").val(rs.rows.item(0).category_id); 
        }
    }
    app.select_old_dcr_master(render_dcr_master_id);
}

function get_dcr_master_values() {
    // $("#spandcrstartpage").html('start');
    $("#spandcrstartpage").attr('src', "images/start.png");
    var render_dcr_master_id = function (tx, rs) {
        if (rs.rows.length > 0) {
            $("#hdn_old_dcr_master_id").val(rs.rows.item(0).dcr_master_id);
            $("#hdn_old_activity_period_id").val(rs.rows.item(0).activity_period_id);
            $("#hdn_old_activity_id").val(rs.rows.item(0).activity_id);
            $("#hdn_dcr_category_id").val(rs.rows.item(0).category_id);
            $("#spandcrstartpage").html('continue');
            $("#spandcrstartpage").attr('src', "images/continue.png");
        }
    }
    app.select_old_dcr_master(render_dcr_master_id);
}

function get_dcr_selected_worked_with() {

    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i).ww_id);
        }
        $("#hdn_dcr_selected_worked_with").val(valuedata);
    }
    app.select_dcr_master_ww_details_by_dcr_master_id(renderstr, 1);
}

function get_list_dcr_selected_worked_with() {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr-selected-worked-with").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr-selected-worked-with").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr-selected-worked-with").html(),
        });
    }
    app.select_dcr_master_ww_details_by_dcr_master_id(render_control,1);
}

function get_dcr_selected_market_areas_values() {

    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i).mj_id);
        }
        $("#hdn_dcr_selected_market_areas").val(valuedata);
    }
    app.select_dcr_master_mj_details_by_dcr_master_id(renderstr, 1);
}

function get_list_dcr_selected_market_areas_values() {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr-selected-market-areas").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr-selected-market-areas").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr-selected-market-areas").html(),
        });
    }
    app.select_dcr_master_mj_details_by_dcr_master_id(render_control,1);
}

function fun_delete_all_dcr_records() {
    app.delete_dcr_master();
    app.delete_dcr_master_ww_details();
    app.delete_dcr_master_mj_details();

    //doctor
    app.delete_dcr_doctor_master();
    app.delete_dcr_doctor_ww_details();
    app.delete_dcr_doctor_gift_details();
    app.delete_dcr_doctor_sample_details();

    app.delete_dcr_unlisted_doctor_master();
    app.delete_dcr_unlisted_doctor_ww_details();
    app.delete_dcr_unlisted_doctor_pp_details();
    app.delete_dcr_unlisted_doctor_gift_details();
    app.delete_dcr_unlisted_doctor_sample_details();
    
    //chemist
    app.delete_dcr_chemist_master();
    app.delete_dcr_chemist_ww_details();
    app.delete_dcr_chemist_gift_details();

    app.delete_dcr_unlisted_chemist_master();
    app.delete_dcr_unlisted_chemist_ww_details();
    app.delete_dcr_unlisted_chemist_pp_details();
    app.delete_dcr_unlisted_chemist_gift_details();


    app.delete_dcr_master_ww_details_temp_master();
    app.delete_dcr_master_ww_details_temp_institution();
}

function fun_set_all_dcr_fields() {
    $('#hdndcr_master_id').val(1);
    $('#hdndcr_doctor_master_id').val(1);
    $('#hdndcr_unlisted_doctor_master_id').val(1);
    $('#hdndcr_chemist_master_id').val(1);
    $('#hdndcr_unlisted_chemist_master_id').val(1);

    $('#hdn_old_dcr_master_id').val(0);
    $('#hdn_old_activity_id').val(0);
    $('#hdn_old_activity_period_id').val(0); 
    $('#hdn_dcr_category_id').val(0);

    //localStorage.removeItem("dcrs_listedmsl_details_live");

    //localStorage.removeItem("dcrs_unlistedmsl_details_live"); 

    localStorage.removeItem("dcrtourplandetails_live");
}

function fun_show_dcr_startView() {
    app.utils.loading(true);
    var options = {
        enableHighAccuracy: false,
        timeout: 5000
    };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        $("#dvDCRstartView").show();
        $("#dvDCRstartView_offgps").hide();
    }, function () {
        $("#dvDCRstartView_offgps").show();
        $("#dvDCRstartView").hide();
    }, options);
    app.utils.loading(false);
}
