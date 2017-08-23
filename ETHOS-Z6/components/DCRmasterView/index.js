'use strict';

(function () {
    var view = app.DCRmasterView = kendo.observable();
    var DCRmasterViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRmasterView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            fun_load_dcr_master_pageinit();
            var user = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = user.Employee_ID;
            var Sub_Territory_ID = user.Sub_Territory_ID;
            var Designation_ID = user.Designation_ID;
            var Division_ID = user.Division_ID;
            app.utils.loading(true);
            fun_db_APP_Get_Z6_DCR_Master_Information(Employee_ID, Sub_Territory_ID,
            Designation_ID, Division_ID);

        },
        fun_load_master_mj: function () {
            var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect");
            var Sub_Territory_ID = ddlworkwithmaster.value().toString();
            ddlworkwithmaster.close();
            var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect").value().toString();
            var ddlcategory = parseInt($("#ddlcategory").val()); 
            var user = JSON.parse(localStorage.getItem("userdata"));
            var Own_Sub_Territory_ID = user.Sub_Territory_ID;
            var Authentication = user.Authentication;
            if (ddlcategory == "" || isNaN(ddlcategory)) {
                app.notify.error("Select category!");
                return false;
            }
            else if (ddlworkwithmaster == "") {
                app.notify.error("Select work with!");
                return false;
            } 
            else if (Sub_Territory_ID.match(',') && !check_isexist(Sub_Territory_ID, Own_Sub_Territory_ID, ',')) {
                app.notify.error("You can't select alone and some one at same time!");
                return false;
            } 
            else {
                app.utils.loading(true);
                fun_db_dcr_master_APP_Get_Market_Area_Names_Based_On_Category(Own_Sub_Territory_ID,
                    Sub_Territory_ID, ddlcategory, Authentication);
            }
        },
        //savedcrmsterdetails
        savedcrmsterdetails: function () {
            var ddlactivityperiod = parseInt($("#ddlactivityperiod").val());
            var ddlactivity = parseInt($("#ddlactivity").val());
            if (ddlactivityperiod == "" || isNaN(ddlactivityperiod)) {
                app.notify.error("Select period!");
                return false;
            }
            if (ddlactivity == "" || isNaN(ddlactivity)) {
                app.notify.error("Select activity!");
                return false;
            }
            else {
                var ddlcategory = parseInt($("#ddlcategory").val());
                var ddlmode = parseInt($("#ddlmode").val());
                var ddlsfcroute = parseInt($("#ddlsfcroute").val());
                var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect").value().toString();
                var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect").value().toString();
                if (ddlactivity == 235) //Field Work
                {
                    if (ddlworkwithmaster == "") {
                        app.notify.error("Select work with!");
                        return false;
                    }
                    else if (ddlcategory == "" || isNaN(ddlcategory)) {
                        app.notify.error("Select category!");
                        return false;
                    }
                    else if (ddlmode == "" || isNaN(ddlmode)) {
                        app.notify.error("Select mode!");
                        return false;
                    }
                    else if (ddlsfcroute == "" || isNaN(ddlsfcroute)) {
                        app.notify.error("Select SFC route!");
                        return false;
                    }
                    else if (ddlmajortownmaster == "") {
                        app.notify.error("Select major town!");
                        return false;
                    }
                    else {
                        var user = JSON.parse(localStorage.getItem("userdata"));
                        var Own_Sub_Territory_ID = user.Sub_Territory_ID;
                        if (ddlworkwithmaster.match(',') && !check_isexist(ddlworkwithmaster, Own_Sub_Territory_ID, ',')) {
                            app.notify.error("You can't select alone and some one at same time!");
                            return false;
                        }
                        fun_save_dcrmaster_fieldstaff();  
                        app.navigation.navigateDCRlistedMSLView();
                    }
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
                { // second options 
                    var ddlcategory = parseInt($("#ddlcategory").val());
                    var ddlmode = parseInt($("#ddlmode").val());
                    var ddlsfcroute = parseInt($("#ddlsfcroute").val());
                    var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect").value().toString();
                    if (ddlcategory == "" || isNaN(ddlcategory)) {
                        app.notify.error("Select category!");
                        return false;
                    }
                    else if (ddlmode == "" || isNaN(ddlmode)) {
                        app.notify.error("Select mode!");
                        return false;
                    }
                    else if (ddlsfcroute == "" || isNaN(ddlsfcroute)) {
                        app.notify.error("Select SFC route!");
                        return false;
                    }
                    else if (ddlworkwithmaster == "") {
                        app.notify.error("Select work with!");
                        return false;
                    }
                    else if (ddlmajortownmaster == "") {
                        app.notify.error("Select major town!");
                        return false;
                    }
                    else {

                        var user = JSON.parse(localStorage.getItem("userdata"));
                        var emp_Sub_Territory_ID = user.Sub_Territory_ID;
                        var Sub_Territory_ID = ddlworkwithmaster;
                        if (Sub_Territory_ID.match(',') && Sub_Territory_ID.match(emp_Sub_Territory_ID)) {
                            app.notify.error("You can't select alone and some one at same time!");
                            return false;
                        }
                        fun_save_dcrmaster_secondflow();
                        fun_clearcontrols_dcrmaster_secondflow();
                        //app.notify.success('Master details saved successfully.'); 
                        app.navigation.navigateDCRfinaentryView();
                    }
                }
                else if (ddlactivity == 237 || ddlactivity == 238
                    || ddlactivity == 242 || ddlactivity == 243
                    || ddlactivity == 244 || ddlactivity == 1131) // other option Sunday / Holiday/cl/sl/el/lta/nyjd
                {
                    if (ddlactivityperiod == 228) // other option Sunday / Holiday/cl/sl/el/lta/nyjd
                    {
                        app.notify.error("Activity period and activity combination is not allowed!");
                        return false;
                    }
                    fun_save_dcrmaster_otherflow();
                    fun_clearcontrols_dcrmaster_otherflow();
                    //app.notify.success('Master details saved successfully.');
                    app.navigation.navigateDCRfinaentryView();
                }
            }
            get_dcr_master_category_id();
            get_dcr_selected_worked_with();
            get_list_dcr_selected_worked_with();
            get_dcr_selected_market_areas_values();
            get_list_dcr_selected_market_areas_values();
            $(".km-scroll-container").css("transform", "none");
            //after validate n save n redirect next page
        },
    });

    view.set('DCRmasterViewModel', DCRmasterViewModel);
}());



function fun_clearcontrols_dcrmaster_fieldstaff() {
    var ddlactivityperiod = $("#ddlactivityperiod").data("kendoDropDownList");
    ddlactivityperiod.value("---Select---");
    var ddlactivity = $("#ddlactivity").data("kendoDropDownList");
    ddlactivity.value("---Select---");
    var ddlcategory = $("#ddlcategory").data("kendoDropDownList");
    ddlcategory.value("---Select---");
    var ddlmode = $("#ddlmode").data("kendoDropDownList");
    ddlmode.value("---Select---");
    var ddlsfcroute = $("#ddlsfcroute").data("kendoDropDownList");
    ddlsfcroute.value("---Select---");
}

function fun_clearcontrols_dcrmaster_secondflow() {
    var ddlactivityperiod = $("#ddlactivityperiod").data("kendoDropDownList");
    ddlactivityperiod.value("---Select---");
    var ddlactivity = $("#ddlactivity").data("kendoDropDownList");
    ddlactivity.value("---Select---");
    var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect");
    ddlworkwithmaster.value("");
    var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect");
    ddlmajortownmaster.value("");
}

function fun_clearcontrols_dcrmaster_otherflow() {
    var ddlactivityperiod = $("#ddlactivityperiod").data("kendoDropDownList");
    ddlactivityperiod.value("---Select---");
    var ddlactivity = $("#ddlactivity").data("kendoDropDownList");
    ddlactivity.value("---Select---");
}

function fun_load_dcr_master_pageinit() {
    $("#ddlactivityperiod").kendoDropDownList().data("kendoDropDownList");
    $("#ddlactivity").kendoDropDownList().data("kendoDropDownList");
    $("#ddlcategory").kendoDropDownList().data("kendoDropDownList");
    $("#ddlmode").kendoDropDownList().data("kendoDropDownList");
    $("#ddlsfcroute").kendoDropDownList().data("kendoDropDownList");

    $("#ddlmajortownmaster").kendoMultiSelect({
        index: 0,
        dataTextField: "Market_Area_Name",
        dataValueField: "Market_Area_ID",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: true,
        clearButton: false,
        change: function (e) {
            //$("#ddlmajortownmaster").blur();
        },
    });
    $("#ddlworkwithmaster").kendoMultiSelect({
        index: 0,
        dataTextField: "Employee_Name",
        dataValueField: "Sub_Territory_ID",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: true,
        clearButton: false,
        filter: "contains",
        change: function (e) {
            var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect");
            ddlmajortownmaster.value("");
            ddlmajortownmaster.setDataSource([]);
            ddlmajortownmaster.refresh();
            //$(".k-widget .k-multiselect ").blur();
        },
    });
}

function fun_load_dcr_master_pageload() {
    fun_dcr_load_activityperiod();
    fun_dcr_load_activity();
    fun_dcr_load_category();
    fun_dcr_load_mode();
}

function fun_save_dcrmaster_fieldstaff() {
    // need to save dcr master data in sql lite db
    var dcr_date = $("#txtdcrdate").val();
    var activity_peroid_id = parseInt($("#ddlactivityperiod").val());
    var activity_peroid_name = $("#ddlactivityperiod option:selected").text();
    var activity_id = parseInt($("#ddlactivity").val());
    var activity_name = $("#ddlactivity option:selected").text();
    var category_id = parseInt($("#ddlcategory").val());;
    var category_name = $("#ddlcategory option:selected").text();
    var mode_id = parseInt($("#ddlmode").val());;
    var mode_name = $("#ddlmode option:selected").text();
    var sfcroute_id = parseInt($("#ddlsfcroute").val());;//ddlsfcroute;
    var sfcroute_place = $("#ddlsfcroute option:selected").text();
    var deviation_reason = "";
    var deviation_description = "";
    //alert("dcr_date:" + dcr_date + "|activity_peroid_id:" + activity_peroid_id + "|activity_peroid_name:" + activity_peroid_name + "|activity_id:" + activity_id + "|activity_name:" + activity_name + "|category_id:" +
    //category_id + "|category_name:" + category_name + "|mode_id:" + mode_id + "|mode_name:" + mode_name + "|sfcroute_id:" + sfcroute_id + "|sfcroute_place:" +
    //sfcroute_place + "|deviation_reason:" + deviation_reason + "|deviation_description:" + deviation_description);

    //app.addto_dcr_master(Employee_ID, Sub_Territory_ID,dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
    //category_id, category_name, mode_id, mode_name, sfcroute_id,
    //sfcroute_place, deviation_reason, deviation_description);

    var user = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = user.Employee_ID;
    var Sub_Territory_ID = user.Sub_Territory_ID;
    app.addto_dcr_master(Employee_ID, Sub_Territory_ID, dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
        category_id, category_name, mode_id, mode_name, sfcroute_id,
        sfcroute_place, deviation_reason, deviation_description,
        "", "");

    var dcr_master_id = $("#hdndcr_master_id").val();
    var ddlwwrecords = $("#ddlworkwithmaster")
                            .data("kendoMultiSelect").dataItems();
    var empids = "";
    $.each(ddlwwrecords, function (i, item) {
        var emp_id = ddlwwrecords[i].Employee_Name.split('|')[1];
        empids += emp_id + ",";
        var emp_name = ddlwwrecords[i].Employee_Name.split('|')[0];
        app.addto_dcr_master_ww_details(dcr_master_id, emp_id, emp_name);
        app.addto_dcr_master_ww_details_temp_master(emp_id, emp_name);
        app.addto_dcr_master_ww_details_temp_institution(emp_id, emp_name);
    });
    //$("#hdn_dcr_selected_worked_with").val(empids);

    var ddlmjrecords = $("#ddlmajortownmaster")
        .data("kendoMultiSelect").dataItems();
    var mj_ids = "";
    $.each(ddlmjrecords, function (i, item) { 
        var mj_id = ddlmjrecords[i].Market_Area_ID;
        mj_ids += mj_id + ","; 
        var mj_name = ddlmjrecords[i].Market_Area_Name;
        app.addto_dcr_master_mj_details(dcr_master_id, mj_id, mj_name);
    });
    $("#hdn_dcr_selected_market_areas").val(mj_ids);

    setTimeout(fun_update_dcr_master_geo, 1000);
}

function fun_save_dcrmaster_secondflow() {

    // need to save dcr master data in sql lite db
    var dcr_date = $("#txtdcrdate").val();
    var activity_peroid_id = parseInt($("#ddlactivityperiod").val());
    var activity_peroid_name = $("#ddlactivityperiod option:selected").text();
    var activity_id = parseInt($("#ddlactivity").val());
    var activity_name = $("#ddlactivity option:selected").text();
    var category_id = parseInt($("#ddlcategory").val());;
    var category_name = $("#ddlcategory option:selected").text();
    var mode_id = parseInt($("#ddlmode").val());;
    var mode_name = $("#ddlmode option:selected").text();
    var sfcroute_id = parseInt($("#ddlsfcroute").val());;//ddlsfcroute;
    var sfcroute_place = $("#ddlsfcroute option:selected").text();
    var deviation_reason = "";
    var deviation_description = "";
    //alert("dcr_date:" + dcr_date + "|activity_peroid_id:" + activity_peroid_id + "|activity_peroid_name:" + activity_peroid_name + "|activity_id:" + activity_id + "|activity_name:" + activity_name + "|category_id:" +
    //category_id + "|category_name:" + category_name + "|mode_id:" + mode_id + "|mode_name:" + mode_name + "|sfcroute_id:" + sfcroute_id + "|sfcroute_place:" +
    //sfcroute_place + "|deviation_reason:" + deviation_reason + "|deviation_description:" + deviation_description);

    var user = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = user.Employee_ID;
    var Sub_Territory_ID = user.Sub_Territory_ID;
    app.addto_dcr_master(Employee_ID, Sub_Territory_ID, dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
        category_id, category_name, mode_id, mode_name, sfcroute_id,
        sfcroute_place, deviation_reason, deviation_description,
        "", "");
    setTimeout(fun_update_dcr_master_geo, 1000);
    // get_dcr_master_id();
    var dcr_master_id = $("#hdndcr_master_id").val();
    var ddlwwrecords = $("#ddlworkwithmaster")
                            .data("kendoMultiSelect").dataItems();
    var empids = "";
    $.each(ddlwwrecords, function (i, item) {
        var emp_id = ddlwwrecords[i].Employee_Name.split('|')[1];
        empids += emp_id + ",";
        var emp_name = ddlwwrecords[i].Employee_Name.split('|')[0];
        app.addto_dcr_master_ww_details(dcr_master_id, emp_id, emp_name);
        app.addto_dcr_master_ww_details_temp_master(emp_id, emp_name);
        app.addto_dcr_master_ww_details_temp_institution(emp_id, emp_name);
    });
    $("#hdn_dcr_selected_worked_with").val(empids);

    var ddlmjrecords = $("#ddlmajortownmaster")
        .data("kendoMultiSelect").dataItems();
    var mj_ids = "";
    $.each(ddlmjrecords, function (i, item) {
        var mj_id = ddlmjrecords[i].Market_Area_ID;
        mj_ids += mj_id + ","; 
        var mj_name = ddlmjrecords[i].Market_Area_Name; 
        app.addto_dcr_master_mj_details(dcr_master_id, mj_id, mj_name);
    });
    $("#hdn_dcr_selected_market_areas").val(mj_ids);

    setTimeout(fun_update_dcr_master_geo, 1000);
}

function fun_save_dcrmaster_otherflow() {

    // need to save dcr master data in sql lite db
    var dcr_date = $("#txtdcrdate").val();
    var activity_peroid_id = parseInt($("#ddlactivityperiod").val());
    var activity_peroid_name = $("#ddlactivityperiod option:selected").text();
    var activity_id = parseInt($("#ddlactivity").val());
    var activity_name = $("#ddlactivity option:selected").text();
    var category_id = 0;
    var category_name = "";
    var mode_id = 0;;
    var mode_name = "";
    var sfcroute_id = 0;//ddlsfcroute;
    var sfcroute_place = "";
    var deviation_reason = "";
    var deviation_description = "";
    var user = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = user.Employee_ID;
    var Sub_Territory_ID = user.Sub_Territory_ID;

    app.addto_dcr_master(Employee_ID, Sub_Territory_ID, dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
        category_id, category_name, mode_id, mode_name, sfcroute_id,
        sfcroute_place, deviation_reason, deviation_description,
        "", "");
    setTimeout(fun_update_dcr_master_geo, 1000);
}

function fun_update_dcr_master_geo() {
    var options = {
        enableHighAccuracy: false,
        timeout: 10000
    };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        app.update_dcr_master_geo(1,
                JSON.stringify(arguments[0].coords.latitude),
                JSON.stringify(arguments[0].coords.longitude));
    }, function () {
        app.update_dcr_master_geo(1,
                "",
                "");
    }, options);
}

function fun_dcr_load_activityperiod() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrlastreporteddetails"));
    var records = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    $("#ddlactivityperiod").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: records,
        //change: onChange
        optionLabel: "---Select---",
    });
    $("#txtdcrdate").val(records[0].Last_Date);
}

function fun_dcr_load_activity() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcractivitytypedetails"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
       .Where("$.Master_Value_ID!=" + 262)
        .ToJSON());
    $("#ddlactivity").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
        change: function (e) {
            // Use the value of the widget

            var activity = this.value();
            if (activity == 235) //Field Work
            {

                fun_dcr_master_chiefs();
                $("#dvdcrmasterdata").show();
                $("#dvdcrmasterdata_ww").show();
                $("#dvdcrworkwithmaster").show();
            }
            else if (activity == 236 || activity == 239
                || activity == 240 || activity == 241
                 || activity == 247
                || activity == 248 || activity == 249
                || activity == 250 || activity == 251
                || activity == 252 || activity == 253
                || activity == 254 || activity == 255
                || activity == 256 || activity == 258)  //247
                //248 , 249 250 251 252 ,253
                // 254 , 255, 256, 258
            { // others options 


                fun_dcr_master_chiefs();
                $("#dvdcrmasterdata").show();
                $("#dvdcrmasterdata_ww").show();
                $("#dvdcrworkwithmaster").show();
            }
            else if (activity == 237 || activity == 238
                || activity == 242 || activity == 243
                || activity == 244 || activity == 1131) // other option Sunday / Holiday/cl/sl/el/lta/nyjd
            {
                $("#dvdcrmasterdata").hide();
                $("#dvdcrmasterdata_ww").hide();
                $("#dvdcrworkwithmaster").hide();
            }

        },
    });
}

function fun_dcr_load_category() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 17 + " && $.Master_Value_ID!=" + 264)
   .ToJSON());
    $("#ddlcategory").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Short_Form",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
        change: function (e) {
            //var leavetype = this.value();
            // Use the value of the widget 
            fun_dcr_load_sfcroute();
        },
    });
}

function fun_dcr_load_mode() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 2 + " && $.Master_Value_ID!=" + 263)
   .ToJSON());
    $("#ddlmode").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
        change: function (e) {
            //var leavetype = this.value();
            // Use the value of the widget 
            fun_dcr_load_sfcroute();
        },
    });
}

function fun_dcr_load_sfcroute() {
    var userdata = JSON.parse(localStorage.getItem("userdata"));
    var Sub_Territory_ID = userdata.Sub_Territory_ID;
    var Employee_ID = userdata.Employee_ID;

    var Category_ID = parseInt($('#ddlcategory').val());
    var Mode_ID = parseInt($('#ddlmode').val());
    if (isNaN(Category_ID)) {
        Category_ID = 0;
    }
    if (isNaN(Mode_ID)) {
        Mode_ID = 0;
    }

    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrsfcroutedetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
        .Where("$.Category_ID==" + Category_ID + " && $.Mode_ID==" + Mode_ID).ToJSON());
    $("#ddlsfcroute").kendoDropDownList({
        index: 0,
        dataTextField: "Place",
        dataValueField: "SFC_GoogleMap_Fare_Master_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "---Select---",
    });
}

function fun_dcr_master_chiefs() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrchiefdetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());

    var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect");
    ddlworkwithmaster.setDataSource(ethosmastervaluesrecords);
    ddlworkwithmaster.refresh();
}

function fun_show_dcr_master() {
    app.utils.loading(true);
    var options = {
        enableHighAccuracy: false,
        timeout: 10000
    };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        $("#dvDCRmasterView").show();
        $("#dvDCRmasterView_offgps").hide();
    }, function () {
        $("#dvDCRmasterView_offgps").show();
        $("#dvDCRmasterView").hide();
    }, options);
    app.utils.loading(false);
}
function load_promo_balance_details(data)
{
    app.delete_dcr_promo_balance_details();
    var promo_balace_details = data;
    var totlength = parseInt(promo_balace_details.length);
    var i;
    for (i = 0; i < totlength; i++) {
        app.addto_dcr_dcr_promo_balance_details
        (promo_balace_details[i].Sub_Territory_ID,
        promo_balace_details[i].PromoItem_Value_ID,
        promo_balace_details[i].PromoItem_Id,
        promo_balace_details[i].Collaterals,
        promo_balace_details[i].Balance_Quantity,
        "");
    }
}
function fun_db_APP_Get_Z6_DCR_Master_Information(Employee_ID, Sub_Territory_ID, Designation_ID, Division_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_Master_Information",
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
        localStorage.setItem("dcrlastreporteddetails", JSON.stringify(data[0])); // last reported details  

        // localStorage.setItem("dcrtourplandetails", JSON.stringify(data[1])); // tourplan details  based on empid,sub id,reported date

        localStorage.setItem("dcractivitytypedetails", JSON.stringify(data[1])); // ActivityType details 

        localStorage.setItem("dcrsfcroutedetails", JSON.stringify(data[2])); // sfcroutes details 

        localStorage.setItem("dcrchiefdetails", JSON.stringify(data[3])); // chief details 

        load_promo_balance_details(data[4]);// promo balance

        fun_load_dcr_master_pageload();
    });
}

function fun_db_dcr_master_APP_Get_Market_Area_Names_Based_On_Category(Own_Sub_Territory_ID,
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
        app.utils.loading(false);
        var records = JSON.parse(JSON.stringify(data));
        var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect");
        ddlmajortownmaster.setDataSource(records);
        ddlmajortownmaster.refresh();
    });
}

//function fun_db_dcr_master_APP_Get_Market_Area_Names(Sub_Territory_ID) {
//    var datasource = new kendo.data.DataSource({
//        transport: {
//            read: {
//                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Market_Area_Names",
//                type: "POST",
//                dataType: "json",
//                data: {
//                    "Sub_Territory_ID": Sub_Territory_ID
//                }
//            }
//        },
//        schema: {
//            parse: function (response) {
//                var getdata = response.Result.Data[0];
//                return getdata;
//            }
//        },
//        error: function (e) {
//            // alert(e);
//            app.notify.error('Error loading data please try again later!');
//            app.utils.loading(false);
//        }
//    });
//    datasource.fetch(function () {
//        var data = this.data();
//        app.utils.loading(false);
//        var records = JSON.parse(JSON.stringify(data));
//        var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect");
//        ddlmajortownmaster.setDataSource(records);
//        ddlmajortownmaster.refresh();
//    });
//}
