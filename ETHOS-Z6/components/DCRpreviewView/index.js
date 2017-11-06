
'use strict';

(function () {
    var view = app.DCRpreviewView = kendo.observable();
    var DCRpreviewViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRpreviewView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            fun_get_all_dcr_preview_details();
            var hdndcr_master_id = 1;
            var render_dcrmaster = function (tx, rs) {
                $("#dvdcrmaster_date").html(rs.rows.item(0).dcr_date);
                $("#dvdcrmaster_period").html(rs.rows.item(0).activity_period_name);
                $("#dvdcrmaster_activity").html(rs.rows.item(0).activity_name);
                $("#dvdcrmaster_deviationreason").html(rs.rows.item(0).deviation_reason);
                $("#dvdcrmaster_description").html(rs.rows.item(0).deviation_description);

                // master value ids
                $("#hdndcr_periodid").val(rs.rows.item(0).activity_period_id);
                $("#hdndcr_activityid").val(rs.rows.item(0).activity_id);
                $("#hdndcr_categoryid").val(rs.rows.item(0).category_id);
                $("#hdndcr_modeid").val(rs.rows.item(0).mode_id);

                var ddlactivity = rs.rows.item(0).activity_id
                if (ddlactivity == 235)  // field staff 
                {

                    $("#dvdcrmaster_category").html(rs.rows.item(0).category_name);
                    $("#dvdcrmaster_mode").html(rs.rows.item(0).mode_name);
                    $("#dvdcrmaster_sfcroute").html(rs.rows.item(0).sfcroute_place);
                    fun_load_dcr_master_ww(hdndcr_master_id);
                    fun_load_dcr_master_mj(hdndcr_master_id);
                    fun_load_dcr_listeddoctor(hdndcr_master_id);
                    fun_load_dcr_unlisteddoctor(hdndcr_master_id);
                    fun_load_dcr_listedchemist(hdndcr_master_id);
                    fun_load_dcr_unlistedchemist(hdndcr_master_id);
                    $(".dv_dcr_fiedstaffandsecond_condition").show(); 
                    $(".dv_dcr_fiedstaff_condition").show();
                    $("#dv_dcr_ww_mj_condition").show();
                }
                else if (ddlactivity == 236 || ddlactivity == 239
               || ddlactivity == 240 || ddlactivity == 241
                || ddlactivity == 247
               || ddlactivity == 248 || ddlactivity == 249
               || ddlactivity == 250 || ddlactivity == 251
               || ddlactivity == 252 || ddlactivity == 253
               || ddlactivity == 254 || ddlactivity == 255
               || ddlactivity == 256 || ddlactivity == 258)  //247
                    //248 , 249 250 251 252 ,253
                    // 254 , 255, 256, 258
                {
                    fun_load_dcr_master_ww(hdndcr_master_id);
                    fun_load_dcr_master_mj(hdndcr_master_id); 
                    $(".dv_dcr_fiedstaffandsecond_condition").show();
                    $(".dv_dcr_fiedstaff_condition").hide();
                    $("#dv_dcr_ww_mj_condition").show();
                    $("#dvdcrmaster_category").html(rs.rows.item(0).category_name);
                    $("#dvdcrmaster_mode").html(rs.rows.item(0).mode_name);
                    $("#dvdcrmaster_sfcroute").html(rs.rows.item(0).sfcroute_place);
                }
                else if (ddlactivity == 237 || ddlactivity == 238
                    || ddlactivity == 242 || ddlactivity == 243
                    || ddlactivity == 244 || ddlactivity == 1131) // other option Sunday / Holiday/cl/sl/el/lta/nyjd
                {
                    $(".dv_dcr_fiedstaffandsecond_condition").hide(); 
                    $(".dv_dcr_fiedstaff_condition").hide();
                    $("#dv_dcr_ww_mj_condition").hide();
                }
            }
            app.select_dcr_master_by_dcr_master_id(render_dcrmaster, hdndcr_master_id);
        },
        submitdcrdetails: function () {
            var hdndcr_activityid = $("#hdndcr_activityid").val();
            var hdndcr_doctor_string = $('#hdndcr_doctor_string').val();
            var hdndcr_unlisted_doctor_string = $('#hdndcr_unlisted_doctor_string').val();
            var hdndcr_chemist_string = $('#hdndcr_chemist_string').val();
            var hdndcr_unlisted_chemist_string = $('#hdndcr_unlisted_chemist_string').val();
             
            if (hdndcr_activityid == 235) {
                if (hdndcr_doctor_string == "[]"
                    && hdndcr_unlisted_doctor_string == "[]"
                    && hdndcr_chemist_string == "[]"
                    && hdndcr_unlisted_chemist_string == "[]") {
                    app.notify.error("MSL or unlisted should not be empty!");
                    return false;
                }
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
            var confirmation = "Are you sure you want to clear the entries?";
            app.notify.confirmation(confirmation, function (confirm) {
                if (!confirm) {
                    return;
                }
                fun_delete_all_dcr_records();
                fun_set_all_dcr_fields();
                app.navigation.navigateDCRstartView();
            })
        },
    });

    view.set('DCRpreviewViewModel', DCRpreviewViewModel);
}());

//all hidden fields start 

function fun_get_all_dcr_preview_details() {
    fun_get_dcr_master_data();
    fun_get_dcr_master_ww_data();
    fun_get_dcr_master_mj_data();

    //doctor
    fun_get_dcr_doctor_master_data();
    fun_get_dcr_doctor_ww_details();
    fun_get_dcr_doctor_gift_details();
    fun_get_dcr_doctor_sample_details();

    fun_get_dcr_unlisted_doctor_master_data();
    fun_get_dcr_unlisted_doctor_ww_details();
    fun_get_dcr_unlisted_doctor_pp_details();
    fun_get_dcr_unlisted_doctor_gift_details();
    fun_get_dcr_unlisted_doctor_sample_details();

    //chemist 
    fun_get_dcr_chemist_master_data();
    fun_get_dcr_chemist_ww_details();
    fun_get_dcr_chemist_gift_details();

    fun_get_dcr_unlisted_chemist_master_data();
    fun_get_dcr_unlisted_chemist_ww_details();
    fun_get_dcr_unlisted_chemist_pp_details();
    fun_get_dcr_unlisted_chemist_gift_details();

    fun_get_dcr_promo_balance_details();
}

function fun_get_dcr_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_master_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_master_by_dcr_master_id(renderstr, 1);
}

function fun_get_dcr_master_ww_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_master_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_master_ww_details(renderstr);
}

function fun_get_dcr_master_mj_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_master_mj_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_master_mj_details(renderstr);
}

//doctor start 
function fun_get_dcr_doctor_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_doctor_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_doctor_master(renderstr);
}

function fun_get_dcr_doctor_ww_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_doctor_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_doctor_ww_details(renderstr);
}

function fun_get_dcr_doctor_gift_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_doctor_gift_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_doctor_gift_details(renderstr);
}

function fun_get_dcr_doctor_sample_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_doctor_sample_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_doctor_sample_details(renderstr);
}

function fun_get_dcr_unlisted_doctor_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_doctor_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_doctor_master(renderstr);
}

function fun_get_dcr_unlisted_doctor_ww_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_doctor_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_doctor_ww_details(renderstr);
}

function fun_get_dcr_unlisted_doctor_pp_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_doctor_pp_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_doctor_pp_details(renderstr);
}

function fun_get_dcr_unlisted_doctor_gift_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_doctor_gift_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_doctor_gift_details(renderstr);
}

function fun_get_dcr_unlisted_doctor_sample_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_doctor_sample_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_doctor_sample_details(renderstr);
}
//doctor end 


//chemist start 
function fun_get_dcr_chemist_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_chemist_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_chemist_master(renderstr);
}

function fun_get_dcr_chemist_ww_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_chemist_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_chemist_ww_details(renderstr);
}

function fun_get_dcr_chemist_gift_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_chemist_gift_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_chemist_gift_details(renderstr);
}

function fun_get_dcr_unlisted_chemist_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_chemist_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_chemist_master(renderstr);
}

function fun_get_dcr_unlisted_chemist_ww_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_chemist_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_chemist_ww_details(renderstr);
}

function fun_get_dcr_unlisted_chemist_pp_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_chemist_pp_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_chemist_pp_details(renderstr);
}

function fun_get_dcr_unlisted_chemist_gift_details() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_chemist_gift_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_chemist_gift_details(renderstr);
}


//chemist end 

function fun_get_dcr_promo_balance_details() {
    var user = JSON.parse(localStorage.getItem("userdata"));
    var Sub_Territory_ID = user.Sub_Territory_ID;
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_promo_balance_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_updated_promo_balance_details_by_sub_territory_id(renderstr, Sub_Territory_ID);
}

//all hidden fields end 

//master start 

function fun_load_dcr_master_ww(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcrmasterww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcrmasterww").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcrmasterww").html(),
        });
    }
    app.select_dcr_master_ww_details_by_dcr_master_id(render_control, hdndcr_master_id);
}

function fun_load_dcr_master_mj(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcrmastermj").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcrmastermj").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcrmastermj").html(),
        });
    }
    app.select_dcr_master_mj_details_by_dcr_master_id(render_control, hdndcr_master_id);
}

//master start 

// doctor start
function fun_load_dcr_listeddoctor(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr-listeddoctor").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr-listeddoctor").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr-listeddoctor").html(),
        });
    }
    app.select_dcr_doctor_master_by_dcr_master_id(render_control, hdndcr_master_id);
}

function fun_dcr_listeddoctor_modelopen(e) {
    var data = e.button.data();
    var dcr_doctor_master_id = data.dcr_doctor_master_id; 
    //fun_load_dcr_listeddoctor_ww(dcr_doctor_master_id);
    fun_dcr_preview_listed_msl_doctor_promos_gift(dcr_doctor_master_id);
    fun_dcr_preview_listed_msl_doctor_promos_sample(dcr_doctor_master_id);
    //fun_load_dcr_listeddoctor_pp(dcr_doctor_master_id);
    $("#modalview-dcr_listeddoctor").kendoMobileModalView("open");
}

function fun_load_dcr_listeddoctor_ww(dcr_doctor_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_listeddoctor_ww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_listeddoctor_ww").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr_listeddoctor_ww").html(),
        });
    }
    app.select_dcr_doctor_ww_details_by_dcr_doctor_master_id(render_control, dcr_doctor_master_id);
}

function fun_dcr_preview_listed_msl_doctor_promos_gift(dcr_doctor_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        var dataSource = new kendo.data.DataSource({
            data: data1,
            batch: true,
            schema: {
                model: {
                    fields: {
                        gift_name: { type: "string", editable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_preview_listeddoctor_brandremainer").kendoGrid({
            dataSource: dataSource,
            columns: [
               { enabled: false, title: "Brand Reminder Product", field: "gift_name", editable: false },
               { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
            ],
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_doctor_gift_details_by_dcr_doctor_master_id(render_control, dcr_doctor_master_id);
}

function fun_dcr_preview_listed_msl_doctor_promos_sample(dcr_doctor_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        var dataSource = new kendo.data.DataSource({
            data: data1,
            batch: true,
            schema: {
                model: {
                    fields: {
                        product_name: { type: "string", editable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_preview_listeddoctor_sample").kendoGrid({
            dataSource: dataSource,
            columns: [
               { enabled: false, title: "Sample Product", field: "product_name", editable: false },
               { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
            ],
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_doctor_sample_details_by_dcr_doctor_master_id(render_control, dcr_doctor_master_id);
}

function fun_dcr_listeddoctor_modelclose() {
    $("#modalview-dcr_listeddoctor").kendoMobileModalView("close");
}

function fun_load_dcr_unlisteddoctor(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr-unlisteddoctor").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr-unlisteddoctor").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr-unlisteddoctor").html(),
        });
    }
    app.select_dcr_unlisted_doctor_master_by_dcr_master_id(render_control, hdndcr_master_id);
}

function fun_dcr_unlisteddoctor_modelopen(e) {
    var data = e.button.data();
    var dcr_unlisted_doctor_master_id = data.dcr_unlisted_doctor_master_id;
    //fun_load_dcr_unlisteddoctor_ww(dcr_unlisted_doctor_master_id);
    //fun_load_dcr_unlisteddoctor_pp(dcr_unlisted_doctor_master_id);
    fun_dcr_preview_unlisted_msl_doctor_promos_gift(dcr_unlisted_doctor_master_id);
    fun_dcr_preview_unlisted_msl_doctor_promos_sample(dcr_unlisted_doctor_master_id);
    $("#modalview-dcr_unlisteddoctor").kendoMobileModalView("open");
}

function fun_load_dcr_unlisteddoctor_ww(dcr_doctor_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_unlisteddoctor_ww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_unlisteddoctor_ww").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr_unlisteddoctor_ww").html(),
        });
    }
    app.select_dcr_unlisted_doctor_ww_details_by_dcr_unlisted_doctor_master_id(render_control, dcr_doctor_master_id);
}

function fun_load_dcr_unlisteddoctor_pp(dcr_doctor_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_unlisteddoctor_pp").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_unlisteddoctor_pp").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr_unlisteddoctor_pp").html(),
        });
    }
    app.select_dcr_unlisted_doctor_pp_details_by_dcr_unlisted_doctor_master_id(render_control, dcr_doctor_master_id);
}

function fun_dcr_preview_unlisted_msl_doctor_promos_gift(dcr_unlisted_doctor_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        var dataSource = new kendo.data.DataSource({
            data: data1,
            batch: true,
            schema: {
                model: {
                    fields: {
                        gift_name: { type: "string", editable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_preview_unlisteddoctor_brandremainer").kendoGrid({
            dataSource: dataSource,
            columns: [
               { enabled: false, title: "Brand Reminder Product", field: "gift_name", editable: false },
               { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
            ],
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_unlisted_doctor_gift_details_by_dcr_unlisted_doctor_master_id(render_control, dcr_unlisted_doctor_master_id);
}

function fun_dcr_preview_unlisted_msl_doctor_promos_sample(dcr_unlisted_doctor_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        var dataSource = new kendo.data.DataSource({
            data: data1,
            batch: true,
            schema: {
                model: {
                    fields: {
                        product_name: { type: "string", editable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_preview_unlisteddoctor_sample").kendoGrid({
            dataSource: dataSource,
            columns: [
               { enabled: false, title: "Sample Product", field: "product_name", editable: false },
               { width:100,enabled: false, title: "Qty", field: "quantity", editable: false, },
            ],
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_unlisted_doctor_sample_details_by_dcr_unlisted_doctor_master_id(render_control, dcr_unlisted_doctor_master_id);
}

function fun_dcr_unlisteddoctor_modelclose() {
    $("#modalview-dcr_unlisteddoctor").kendoMobileModalView("close");
}
// doctor end

// chemist start 
function fun_load_dcr_listedchemist(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr-listedchemist").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr-listedchemist").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr-listedchemist").html(),
        });
    }
    app.select_dcr_chemist_master_by_dcr_master_id(render_control, hdndcr_master_id);
}

function fun_dcr_listedchemist_modelopen(e) {
    var data = e.button.data();
    var dcr_chemist_master_id = data.dcr_chemist_master_id;
    //fun_load_dcr_listedchemist_ww(dcr_chemist_master_id);
    fun_dcr_preview_listed_msl_chemist_promos_gift(dcr_chemist_master_id);
    $("#modalview-dcr_listedchemist").kendoMobileModalView("open");
}

function fun_load_dcr_listedchemist_ww(dcr_chemist_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_listedchemist_ww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_listedchemist_ww").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr_listedchemist_ww").html(),
        });
    }
    app.select_dcr_chemist_ww_details_by_dcr_chemist_master_id(render_control, dcr_chemist_master_id);
}

function fun_dcr_preview_listed_msl_chemist_promos_gift(dcr_chemist_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        var dataSource = new kendo.data.DataSource({
            data: data1,
            batch: true,
            schema: {
                model: {
                    fields: {
                        gift_name: { type: "string", editable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_preview_listedchemist_brandremainer").kendoGrid({
            dataSource: dataSource,
            columns: [
               { enabled: false, title: "Brand Reminder Product", field: "gift_name", editable: false },
               { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
            ],
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_chemist_gift_details_by_dcr_chemist_master_id(render_control, dcr_chemist_master_id);
}

function fun_dcr_listedchemist_modelclose() {
    $("#modalview-dcr_listedchemist").kendoMobileModalView("close");
}

function fun_load_dcr_unlistedchemist(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr-unlistedchemist").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr-unlistedchemist").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr-unlistedchemist").html(),
        });
    }
    app.select_dcr_unlisted_chemist_master_by_dcr_master_id(render_control, hdndcr_master_id);
}

function fun_dcr_unlistedchemist_modelopen(e) {
    var data = e.button.data();
    var dcr_unlisted_chemist_master_id = data.dcr_unlisted_chemist_master_id;
    //fun_load_dcr_unlistedchemist_ww(dcr_unlisted_chemist_master_id);
    //fun_load_dcr_unlistedchemist_pp(dcr_unlisted_chemist_master_id);
    fun_dcr_preview_unlisted_msl_chemist_promos_gift(dcr_unlisted_chemist_master_id);
    $("#modalview-dcr_unlistedchemist").kendoMobileModalView("open");
}

function fun_load_dcr_unlistedchemist_ww(dcr_chemist_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_unlistedchemist_ww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_unlistedchemist_ww").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr_unlistedchemist_ww").html(),
        });
    }
    app.select_dcr_unlisted_chemist_ww_details_by_dcr_unlisted_chemist_master_id(render_control, dcr_chemist_master_id);
}

function fun_load_dcr_unlistedchemist_pp(dcr_chemist_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_unlistedchemist_pp").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_unlistedchemist_pp").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcr_unlistedchemist_pp").html(),
        });
    }
    app.select_dcr_unlisted_chemist_pp_details_by_dcr_unlisted_chemist_master_id(render_control, dcr_chemist_master_id);
}

function fun_dcr_preview_unlisted_msl_chemist_promos_gift(dcr_unlisted_chemist_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        var dataSource = new kendo.data.DataSource({
            data: data1,
            batch: true,
            schema: {
                model: {
                    fields: {
                        gift_name: { type: "string", editable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_preview_unlistedchemist_brandremainer").kendoGrid({
            dataSource: dataSource,
            columns: [
               { enabled: false, title: "Brand Reminder Product", field: "gift_name", editable: false },
               { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
            ],
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_unlisted_chemist_gift_details_by_dcr_unlisted_chemist_master_id(render_control, dcr_unlisted_chemist_master_id);
}

function fun_dcr_unlistedchemist_modelclose() {
    $("#modalview-dcr_unlistedchemist").kendoMobileModalView("close");
}
// chemist end

function fun_clearcontrols_dcrmaster_finalentry() {

    $("#hdndcr_periodid").val('');
    $("#hdndcr_activityid").val('');
    $("#hdndcr_categoryid").val('');
    $("#hdndcr_modeid").val('');


    $("#hdndcr_master_string").val('');
    $("#hdndcr_master_ww_details_string").val('');
    $("#hdndcr_master_mj_details_string").val('');

    //doctor
    $("#hdndcr_doctor_string").val('');
    $("#hdndcr_doctor_ww_details_string").val('');
    $("#hdndcr_doctor_gift_details_string").val('');
    $("#hdndcr_doctor_sample_details_string").val('');

    $("#hdndcr_unlisted_doctor_string").val('');
    $("#hdndcr_unlisted_doctor_ww_details_string").val('');
    $("#hdndcr_unlisted_doctor_pp_details_string").val('');
    $("#hdndcr_unlisted_doctor_gift_details_string").val('');
    $("#hdndcr_unlisted_doctor_sample_details_string").val('');

    //chemist
    $("#hdndcr_chemist_string").val('');
    $("#hdndcr_chemist_ww_details_string").val('');
    $("#hdndcr_chemist_gift_details_string").val('');

    $("#hdndcr_unlisted_chemist_string").val('');
    $("#hdndcr_unlisted_chemist_ww_details_string").val('');
    $("#hdndcr_unlisted_chemist_pp_details_string").val('');
    $("#hdndcr_unlisted_chemist_gift_details_string").val('');

    //promo balance
    $("#hdndcr_promo_balance_details_string").val('');
}

function fun_save_dcr_all_details() {

    var userdata = JSON.parse(localStorage.getItem("userdata"));
    var Login_ID = parseInt(userdata.Login_ID);
    var Employee_ID = parseInt(userdata.Employee_ID);
    var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
    var Category_ID = 0;
    if ($("#hdndcr_categoryid").val() != '') {
        Category_ID = parseInt($("#hdndcr_categoryid").val());
    }
    var Mode_ID = 0;
    if ($("#hdndcr_modeid").val() != '') {
        Mode_ID = parseInt($("#hdndcr_modeid").val());
    }
    app.utils.loading(true);
     

    fun_db_APP_Insert_Z6_DCR_Report(Login_ID,
Employee_ID,
Sub_Territory_ID,
$("#dvdcrmaster_date").html(),
parseInt($("#hdndcr_periodid").val()),

parseInt($("#hdndcr_activityid").val()),
Category_ID,
Mode_ID,
$("#dvdcrmaster_deviationreason").html(),
$("#dvdcrmaster_description").html(),


$("#hdndcr_master_string").val(),
$("#hdndcr_master_ww_details_string").val(),
$("#hdndcr_master_mj_details_string").val(),
$("#hdndcr_doctor_string").val(),
$("#hdndcr_doctor_ww_details_string").val(),

$("#hdndcr_doctor_gift_details_string").val(),
$("#hdndcr_doctor_sample_details_string").val(),
$("#hdndcr_unlisted_doctor_string").val(),
$("#hdndcr_unlisted_doctor_ww_details_string").val(),
$("#hdndcr_unlisted_doctor_pp_details_string").val(),

$("#hdndcr_unlisted_doctor_gift_details_string").val(),
$("#hdndcr_unlisted_doctor_sample_details_string").val(),
$("#hdndcr_chemist_string").val(),
$("#hdndcr_chemist_ww_details_string").val(),
$("#hdndcr_chemist_gift_details_string").val(),

$("#hdndcr_unlisted_chemist_string").val(),
$("#hdndcr_unlisted_chemist_ww_details_string").val(),
$("#hdndcr_unlisted_chemist_pp_details_string").val(),
$("#hdndcr_unlisted_chemist_gift_details_string").val(),
$("#hdndcr_promo_balance_details_string").val()
    );
     
}

function fun_db_APP_Insert_Z6_DCR_Report(Login_ID, Employee_ID, Sub_Territory_ID, DCR_Date, Activity_Period_ID,
    Activity_ID, Mode_ID, Category_ID, Deviation_Reason, Deviation_Description,
    DCR_Master_String, DCR_Master_WW_Details_String, DCR_Master_MJ_Details_String, DCR_Doctor_Master_String, DCR_Doctor_WW_String,
    DCR_Doctor_Gift_String, DCR_Doctor_Sample_String, DCR_Unlisted_Doctor_Master_String, DCR_Unlisted_Doctor_WW_String, DCR_Unlisted_Doctor_PP_String,
    DCR_Unlisted_Doctor_Gift_String, DCR_Unlisted_Doctor_Sample_String, DCR_Chemist_Master_String, DCR_Chemist_WW_String, DCR_Chemist_Gift_String,
    DCR_Unlisted_Chemist_Master_String, DCR_Unlisted_Chemist_WW_String, DCR_Unlisted_Chemist_PP_String, DCR_Unlisted_Chemist_Gift_String, DCR_Promo_Balance_String) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Insert_Z6_DCR_Report",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": Login_ID,
                    "Employee_ID": Employee_ID,
                    "Sub_Territory_ID": Sub_Territory_ID,
                    "DCR_Date": DCR_Date,
                    "Activity_Period_ID": Activity_Period_ID, 
                    "Activity_ID": Activity_ID,
                    "Mode_ID": Mode_ID,
                    "Category_ID": Category_ID,
                    "Deviation_Reason": Deviation_Reason,
                    "Deviation_Description": Deviation_Description, 
                    "DCR_Master_String": DCR_Master_String,
                    "DCR_Master_WW_Details_String": DCR_Master_WW_Details_String,
                    "DCR_Master_MJ_Details_String": DCR_Master_MJ_Details_String,
                    "DCR_Doctor_Master_String": DCR_Doctor_Master_String,
                    "DCR_Doctor_WW_String": DCR_Doctor_WW_String, 
                    "DCR_Doctor_Gift_String": DCR_Doctor_Gift_String,
                    "DCR_Doctor_Sample_String": DCR_Doctor_Sample_String,
                    "DCR_Unlisted_Doctor_Master_String": DCR_Unlisted_Doctor_Master_String,
                    "DCR_Unlisted_Doctor_WW_String": DCR_Unlisted_Doctor_WW_String,
                    "DCR_Unlisted_Doctor_PP_String": DCR_Unlisted_Doctor_PP_String, 
                    "DCR_Unlisted_Doctor_Gift_String": DCR_Unlisted_Doctor_Gift_String,
                    "DCR_Unlisted_Doctor_Sample_String": DCR_Unlisted_Doctor_Sample_String,
                    "DCR_Chemist_Master_String": DCR_Chemist_Master_String,
                    "DCR_Chemist_WW_String": DCR_Chemist_WW_String,
                    "DCR_Chemist_Gift_String": DCR_Chemist_Gift_String, 
                    "DCR_Unlisted_Chemist_Master_String": DCR_Unlisted_Chemist_Master_String,
                    "DCR_Unlisted_Chemist_WW_String": DCR_Unlisted_Chemist_WW_String,
                    "DCR_Unlisted_Chemist_PP_String": DCR_Unlisted_Chemist_PP_String,
                    "DCR_Unlisted_Chemist_Gift_String": DCR_Unlisted_Chemist_Gift_String,
                    "DCR_Promo_Balance_String": DCR_Promo_Balance_String,
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
            localStorage.setItem("Activity_Period_ID", 0);
            localStorage.setItem("Activity_ID", 0);
            localStorage.setItem("DCR_isavailable", 0);
            app.notify.success(data[0].Output_Message); 
            $('#dvDCRstartView').show();
            fun_clearcontrols_dcrmaster_finalentry();
            fun_delete_all_dcr_records();
            fun_set_all_dcr_fields();
            $(".km-scroll-container").css("transform", "none");
            app.navigation.navigateDCRstartView();
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

 

