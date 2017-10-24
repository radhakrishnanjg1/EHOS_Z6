'use strict';

(function () {
    var view = app.TourplanEntryView = kendo.observable();
    var TourplanEntryViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("TourplanEntryView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            $(".km-scroll-container").css("transform", "none");
            $("#dv_tourplan_entry_mainscreen").show();
            $("#dv_tourplan_entry_mj_details").hide();  
            fun_delete_existing_tourplan_details();
            fun_load_tourplan_master_pageinit();
            var user = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(user.Employee_ID);
            var Sub_Territory_ID = parseInt(user.Sub_Territory_ID);
            var Designation_ID = parseInt(user.Designation_ID);
            var Division_ID = parseInt(user.Division_ID);
            app.utils.loading(true);
            fun_db_APP_Get_Z6_TP_Master_Information(Employee_ID, Sub_Territory_ID,
            Designation_ID, Division_ID);

        },
        fun_load_master_tourplan_mj: function () {
            var ddlactivityperiod_tp = parseInt($("#ddlactivityperiod_tp").val());
            var ddlactivity_tp = parseInt($("#ddlactivity_tp").val());
            var ddlcategory_tp = parseInt($("#ddlcategory_tp").val());
            var ddlmode_tp = parseInt($("#ddlmode_tp").val());
            var ddlworkwithmaster_tp = $("#ddlworkwithmaster_tp").data("kendoMultiSelect");
            var Sub_Territory_ID = ddlworkwithmaster_tp.value().toString();
            ddlworkwithmaster_tp.close();
            var ddlworkwithmaster_tp = $("#ddlworkwithmaster_tp").data("kendoMultiSelect").value().toString();
            var user = JSON.parse(localStorage.getItem("userdata"));
            var Own_Sub_Territory_ID = parseInt(user.Sub_Territory_ID);
            var Authentication = parseInt(user.Authentication);
            if (ddlactivityperiod_tp == "" || isNaN(ddlactivityperiod_tp)) {
                app.notify.error("Select period!");
                return false;
            }
            else if (ddlactivity_tp == "" || isNaN(ddlactivity_tp)) {
                app.notify.error("Select activity!");
                return false;
            }
            else if (ddlcategory_tp == "" || isNaN(ddlcategory_tp)) {
                app.notify.error("Select category!");
                return false;
            }
            else if (ddlmode_tp == "" || isNaN(ddlmode_tp)) {
                app.notify.error("Select mode!");
                return false;
            }
            else if (ddlworkwithmaster_tp == "") {
                app.notify.error("Select work with!");
                return false;
            }
            if (Sub_Territory_ID.match(',') && !check_isexist(Sub_Territory_ID, Own_Sub_Territory_ID, ',')) {
                app.notify.error("You can't select alone and some one at same time!");
                return false;
            } 
            else {
                app.utils.loading(true);
                fun_db_tp_master_APP_Get_Market_Area_Names_Based_On_Category(Own_Sub_Territory_ID, Sub_Territory_ID,
                    ddlcategory_tp, Authentication);
            }
        }, 
        //save_tourplan_details
        save_tourplan_details: function () {
            var ddlactivityperiod_tp = parseInt($("#ddlactivityperiod_tp").val());
            var ddlactivity_tp = parseInt($("#ddlactivity_tp").val());
            var ddlcategory_tp = parseInt($("#ddlcategory_tp").val());
            var ddlmode_tp = parseInt($("#ddlmode_tp").val());
            var ddlworkwithmaster_tp = $("#ddlworkwithmaster_tp").data("kendoMultiSelect").value().toString();
            var ddlmajortownmaster_tp = $("#ddlmajortownmaster_tp").data("kendoMultiSelect").value().toString();

             
            var user = JSON.parse(localStorage.getItem("userdata"));
            var emp_Sub_Territory_ID = user.Sub_Territory_ID;
            var Sub_Territory_ID = ddlworkwithmaster_tp;
            if (ddlactivityperiod_tp == "" || isNaN(ddlactivityperiod_tp)) {
                app.notify.error("Select period!");
                return false;
            }
            else if (ddlactivity_tp == "" || isNaN(ddlactivity_tp)) {
                app.notify.error("Select activity!");
                return false;
            }
                // 235 - Field work
            else if (ddlactivity_tp == "235") {
                if (ddlcategory_tp == "" || isNaN(ddlcategory_tp)) {
                    app.notify.error("Select category!");
                    return false;
                }
                else if (ddlmode_tp == "" || isNaN(ddlmode_tp)) {
                    app.notify.error("Select mode!");
                    return false;
                }
                else if (ddlworkwithmaster_tp == "") {
                    app.notify.error("Select work with!");
                    return false;
                }
                else if (Sub_Territory_ID.match(',') && Sub_Territory_ID.match(emp_Sub_Territory_ID)) {
                    app.notify.error("You can't select alone and some one at same time!");
                    return false;
                }
                else if (ddlmajortownmaster_tp == "") {
                    app.notify.error("Select major town!");
                    return false;
                } 
            }
                // 237,238,242,1131,243,244 Sunday,Casual Leave,Sick Leave,Earned Leave,LTA
            else if (ddlactivity_tp == "237" || ddlactivity_tp == "238"
                || ddlactivity_tp == "242" || ddlactivity_tp == "1131"
                || ddlactivity_tp == "243" || ddlactivity_tp == "244") {
                if ($("#txtspecificobjective").val() == "") {
                    app.notify.error("Enter the specific objective / remarks!");
                    return false;
                }
            }
                // other activity types 
            else {
                if (ddlcategory_tp == "" || isNaN(ddlcategory_tp)) {
                    app.notify.error("Select category!");
                    return false;
                }
                else if (ddlmode_tp == "" || isNaN(ddlmode_tp)) {
                    app.notify.error("Select mode!");
                    return false;
                }
                else if (ddlcategory_tp == "232" || ddlcategory_tp == "233") {
                    if ($("#txtcontact_tp").val() == "") {
                        app.notify.error("Enter the contact details on category is OS/EX-OS!");
                        return false;
                    }
                }
                else if (ddlworkwithmaster_tp == "") {
                    app.notify.error("Select work with!");
                    return false;
                }
                else if (Sub_Territory_ID.match(',') && Sub_Territory_ID.match(emp_Sub_Territory_ID)) {
                    app.notify.error("You can't select alone and some one at same time!");
                    return false;
                }
                else if (ddlmajortownmaster_tp == "") {
                    app.notify.error("Select major town!");
                    return false;
                }
            }
            fun_save_tourplan_details();
            fun_clearcontrols_tourplan_entrydetails();
            //app.notify.success('Tourplan details saved successfully.');
            app.navigation.navigateTourplanPreviewView();
        },
    });

    view.set('TourplanEntryViewModel', TourplanEntryViewModel);
}());

function fun_delete_existing_tourplan_details() {
    app.delete_tourplan_master();
    app.delete_tourplan_master_ww_details();
    app.delete_tourplan_master_mj_details(); 
}

function fun_clearcontrols_tourplan_entrydetails() {
    var ddlactivityperiod_tp = $("#ddlactivityperiod_tp").data("kendoDropDownList");
    ddlactivityperiod_tp.value("---Select---");
    var ddlactivity = $("#ddlactivity_tp").data("kendoDropDownList");
    ddlactivity.value("---Select---");
    var ddlcategory_tp = $("#ddlcategory_tp").data("kendoDropDownList");
    ddlcategory_tp.value("---Select---");
    var ddlmode_tp = $("#ddlmode_tp").data("kendoDropDownList");
    ddlmode_tp.value("---Select---");
    var ddlworkwithmaster_tp = $("#ddlworkwithmaster_tp").data("kendoMultiSelect");
    ddlworkwithmaster_tp.value("");
    var ddlmajortownmaster_tp = $("#ddlmajortownmaster_tp").data("kendoMultiSelect");
    ddlmajortownmaster_tp.value("");

    $('#txtcontact_tp').val('');
    $('#txtspecificobjective').val('');
}


function fun_load_tourplan_master_pageinit() {
    $("#ddlactivityperiod_tp").kendoDropDownList().data("kendoDropDownList");
    $("#ddlactivity_tp").kendoDropDownList().data("kendoDropDownList");
    $("#ddlcategory_tp").kendoDropDownList().data("kendoDropDownList");
    $("#ddlmode_tp").kendoDropDownList().data("kendoDropDownList");

    $("#ddlmajortownmaster_tp").kendoMultiSelect({
        index: 0,
        dataTextField: "Market_Area_Name",
        dataValueField: "Sub_MarketArea_Id",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: true,
        clearButton: false, 
    });
    $("#ddlworkwithmaster_tp").kendoMultiSelect({
        index: 0,
        dataTextField: "Employee_Name",
        dataValueField: "Sub_Territory_ID",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: true,
        clearButton: false,
        filter: "contains",
        change: function (e) {
            var ddlmajortownmaster_tp = $("#ddlmajortownmaster_tp").data("kendoMultiSelect");
            ddlmajortownmaster_tp.value("");
            ddlmajortownmaster_tp.setDataSource([]);
            ddlmajortownmaster_tp.refresh();
            //$(".k-widget .k-multiselect ").blur();
        },
    });
}

function fun_load_tourplan_pageload() {
    fun_tourplan_load_category();
    fun_tourplan_load_mode();
    fun_tourplan_master_chiefs();
}

function fun_save_tourplan_details() {
    // need to save dcr master data in sql lite db
    var txt_lasttp_date = $("#txt_lasttp_date").val();
    var activity_peroid_id = parseInt($("#ddlactivityperiod_tp").val());
    var activity_peroid_name = $("#ddlactivityperiod_tp option:selected").text();
    var activity_id = parseInt($("#ddlactivity_tp").val());
    var activity_name = $("#ddlactivity_tp option:selected").text();
    var category_id = parseInt($("#ddlcategory_tp").val());;
    var category_name = $("#ddlcategory_tp option:selected").text();
    var mode_id = parseInt($("#ddlmode_tp").val());;
    var mode_name = $("#ddlmode_tp option:selected").text();
    var txtcontact_tp = $("#txtcontact_tp").val();
    var txtspecificobjective = $("#txtspecificobjective").val();

    var user = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = user.Employee_ID;
    var Sub_Territory_ID = user.Sub_Territory_ID;
    app.addto_tourplan_master(Employee_ID, Sub_Territory_ID, txt_lasttp_date, activity_peroid_id, activity_peroid_name,
        activity_id, activity_name, category_id, category_name, mode_id,
        mode_name, txtcontact_tp, txtspecificobjective);

    var ddlwwrecords = $("#ddlworkwithmaster_tp")
                           .data("kendoMultiSelect").dataItems();
    var empids = "";
    $.each(ddlwwrecords, function (i, item) {
        var emp_id = ddlwwrecords[i].Employee_Name.split('|')[1];
        empids += emp_id + ",";
        var emp_name = ddlwwrecords[i].Employee_Name.split('|')[0];
        app.addto_tourplan_master_ww_details(1, emp_id, emp_name);
    });

    var ddlmjrecords = $("#ddlmajortownmaster_tp")
        .data("kendoMultiSelect").dataItems();
    $.each(ddlmjrecords, function (i, item) {
        var mj_id = ddlmjrecords[i].Market_Area_ID;
        var mj_name = ddlmjrecords[i].Market_Area_Name;
        app.addto_tourplan_master_mj_details(1, mj_id, mj_name);
    });
      
}

function fun_tourplann_load_activityperiod(data) {
    var ethosmastervaluesdata = JSON.parse(data);
    var records = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    $("#ddlactivityperiod_tp").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: records,
        //change: onChange
        optionLabel: "---Select---",
    });
    $("#txt_lasttp_date").val(records[0].Last_Date);
}

function fun_tourplan_load_activity(data) {
    var ethosmastervaluesdata = JSON.parse(data);
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
       .Where("$.Master_Value_ID!=" + 262)
        .ToJSON());
    $("#ddlactivity_tp").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
        change: function (e) {
            var ddlactivity_tp = this.value();
            if (ddlactivity_tp == "" || isNaN(ddlactivity_tp)) {
                app.notify.error("Select activity!");
                return false;
            }
            // 235 - field staff
            if (ddlactivity_tp == "235") {
                $('#dv_tourplan_entry_master_details').show();
                $('#dv_tourplan_entry_mj_details').show(); 
            }
                // 237,238,242,1131,243,244 Sunday,Casual Leave,Sick Leave,Earned Leave,LTA
            else if (ddlactivity_tp == "237" || ddlactivity_tp == "238"
                || ddlactivity_tp == "242" || ddlactivity_tp == "1131"
                || ddlactivity_tp == "243" || ddlactivity_tp == "244") {
                $('#dv_tourplan_entry_master_details').hide();
                $('#dv_tourplan_entry_mj_details').hide(); 
            }
            else {
                $('#dv_tourplan_entry_master_details').show();
                $('#dv_tourplan_entry_mj_details').show(); 
            }
        }
    });
}

function fun_tourplan_load_category() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 17 + " && $.Master_Value_ID!=" + 264)
   .ToJSON());
    $("#ddlcategory_tp").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Short_Form",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
        change: function (e) {
            var ddlmajortownmaster_tp = $("#ddlmajortownmaster_tp").data("kendoMultiSelect");
            ddlmajortownmaster_tp.value("");
            ddlmajortownmaster_tp.setDataSource([]);
            ddlmajortownmaster_tp.refresh();
        },
    });
}

function fun_tourplan_load_mode() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 2 + " && $.Master_Value_ID!=" + 263)
   .ToJSON());
    $("#ddlmode_tp").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
    });
}

function fun_tourplan_master_chiefs() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("tourplan_ww_details"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    var ddlworkwithmaster_tp = $("#ddlworkwithmaster_tp").data("kendoMultiSelect");
    ddlworkwithmaster_tp.setDataSource(ethosmastervaluesrecords);
    ddlworkwithmaster_tp.refresh();
}

function fun_db_APP_Get_Z6_TP_Master_Information(Employee_ID, Sub_Territory_ID, Designation_ID, Division_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_TP_Master_Information",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID, "Sub_Territory_ID": Sub_Territory_ID,
                    "Designation_ID": Designation_ID, "Division_ID": Division_ID
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

        fun_tourplann_load_activityperiod(JSON.stringify(data[0]));

        fun_tourplan_load_activity(JSON.stringify(data[1]));

        localStorage.setItem("tourplan_ww_details", JSON.stringify(data[2])); // chief details 

        fun_load_tourplan_pageload();
    });
}

function fun_db_tp_master_APP_Get_Market_Area_Names_Based_On_Category(Own_Sub_Territory_ID,
    Sub_Territory_ID, Category_ID, Authentication) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Market_Area_Names_Based_On_Category",
                type: "POST",
                dataType: "json",
                data: {
                    "Own_Sub_Territory_ID": Own_Sub_Territory_ID,
                    "Sub_Territory_ID": Sub_Territory_ID,
                    "Category_ID": Category_ID,
                    "Authentication": Authentication
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
            // alert(e);
            app.notify.error('Error loading data please try again later!');
            app.utils.loading(false);
        }
    });
    datasource.fetch(function () {
        var data = this.data();
        $("#dv_tourplan_entry_mj_details").show();
        //$("#dv_tourplan_entry_mainscreen").hide();
        app.utils.loading(false);
        var records = JSON.parse(JSON.stringify(data));
        var ddlmajortownmaster_tp = $("#ddlmajortownmaster_tp").data("kendoMultiSelect");
        ddlmajortownmaster_tp.setDataSource(records);
        ddlmajortownmaster_tp.refresh();
    });
}
 

 
