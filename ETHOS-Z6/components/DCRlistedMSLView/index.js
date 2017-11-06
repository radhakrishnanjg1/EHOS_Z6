
'use strict';

(function () {
    var view = app.DCRlistedMSLView = kendo.observable();
    var DCRlistedMSLViewModel = kendo.observable({
        onShow: function () {
            disableBackButton();
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRlistedMSLView");
            }
            app.navigation.logincheck();

        },
        afterShow: function () {
            disableBackButton();
            var render_dcrmaster_doctor = function (tx, rs) {
                $('#hdn_employee_repeat_doctor_count').val(rs.rows.item(0).doctor_master_count);
            }
            app.select_dcr_doctor_master_count(render_dcrmaster_doctor); 
            fun_get_dcr_doctor_msl_ids();

            var render_dcrmaster_chemist = function (tx, rs) {
                $('#hdn_employee_repeat_chemist_count').val(rs.rows.item(0).chemist_master_count);
            }
            app.select_dcr_chemist_master_count(render_dcrmaster_chemist); 
            fun_get_dcr_chemist_msl_ids();

            get_dcr_listedmsl_doctor_values();

            get_dcr_listedmsl_chemist_values(); 
            get_list_dcr_selected_worked_with();
            fun_load_listedmsl_page();
        },
        fun_close_txtlisteddoctor: function () {
            $('#txtlisteddoctor').val('');
            setTimeout(function () {
                $("#txtlisteddoctor").blur();
                var autocomplete = $("#txtlisteddoctor").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        },
        fun_close_txtlistedchemist: function () {
            $('#txtlistedchemist').val('');
            setTimeout(function () {
                $("#txtlistedchemist").blur();
                var autocomplete = $("#txtlistedchemist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        },
        savelisteddcrdetails: function () { 
            var msl_repeat_details = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcr_repeat_listed_msl_count_details")))
            .ToJSON());
            var tabpanellistedmsl = $("#tabpanellistedmsl").find('li.active').attr("id");
            if (tabpanellistedmsl == "tabpanellistedmsl-doctor") {
                //alert(tabpanellistedmsl); 
                //doctor
                var txtlisteddoctor = $("#txtlisteddoctor").val();
                var txtlisteddoctorpob = parseInt($("#txtlisteddoctorpob").val());
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_doctor_details"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Doctor_Name=='" + txtlisteddoctor + "'")
               .ToJSON());  
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid doctor in list!");
                    return false;
                }
                else
                {
                    var doctor_msl_id = parseInt(ethosmastervaluesrecords[0].Doctor_MSL_ID);
                     var doctor_msl_id_records = JSON.parse(Enumerable.From(JSON.parse($("#hdn_doctor_msl_ids").val()))
                            .Where("$.doctor_msl_id==" + doctor_msl_id + "")
                            .ToJSON());
                     if (doctor_msl_id_records.length > 0) {
                         app.notify.error("Doctor name already exist!");
                         return false;
                     }
                     else if (msl_repeat_details[0].Doctor_Output_ID == 1) {
                        var dcr_repeat_listed_msl_doctor_details = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcr_repeat_listed_msl_doctor_details")))
                       .Where("$.Doctor_MSL_ID=='" + doctor_msl_id + "'")
                       .ToJSON());
                        if (dcr_repeat_listed_msl_doctor_details.length > 0)
                        {
                            var Employee_Repeat_Doctor_Count = parseInt($("#hdn_employee_repeat_doctor_count").val());
                            var Repeat_Doctor_Count = parseInt(msl_repeat_details[0].Repeat_Doctor_Count);
                            if (Employee_Repeat_Doctor_Count > Repeat_Doctor_Count) {
                                app.notify.error("Repeat msl count is exceed for this month");
                                return false;
                            }
                        }
                    } 
                }
                if (txtlisteddoctorpob < 0) {
                    app.notify.error("POB should not be less than zero!");
                    return false;
                }
                else {
                    // check higher quantity
                    var checkflag_balancequantity_gift = true;
                    var checkflag_negative_entered_quantity_gift = true;
                    var grid_listeddoctor_brandremainer = $("#grid_listeddoctor_brandremainer")
                    .data("kendoGrid").dataItems();
                    $.each(grid_listeddoctor_brandremainer, function (i, item) {
                        var entered_quantity = grid_listeddoctor_brandremainer[i].quantity;
                        var balance_quantity = grid_listeddoctor_brandremainer[i].balance_quantity;
                        if (parseInt(entered_quantity) <= 0) {
                            checkflag_negative_entered_quantity_gift = false;
                            return false;
                        }
                        if (parseInt(balance_quantity) < parseInt(entered_quantity)) {
                            checkflag_balancequantity_gift = false;
                            return false;
                        }
                    });
                    if (!checkflag_negative_entered_quantity_gift) {
                        app.notify.error("Quantity must be greater than zero for brand reminder!");
                        return false;
                    }
                    if (!checkflag_balancequantity_gift) {
                        app.notify.error("Quantity must be less than or equal to balance quantity for brand reminder!");
                        return false;
                    } 
                    var checkflag_balancequantity_sample = true;
                    var checkflag_negative_entered_quantity_sample = true;
                    var grid_listeddoctor_sample = $("#grid_listeddoctor_sample")
                    .data("kendoGrid").dataItems();
                    $.each(grid_listeddoctor_sample, function (i, item) {
                        var entered_quantity = grid_listeddoctor_sample[i].quantity;
                        var balance_quantity = grid_listeddoctor_sample[i].balance_quantity;
                        if (parseInt(entered_quantity) <= 0) {
                            checkflag_negative_entered_quantity_sample = false;
                            return false;
                        }
                        if (parseInt(balance_quantity) < parseInt(entered_quantity)) {
                            checkflag_balancequantity_sample = false;
                            return false;
                        }
                    });
                    if (!checkflag_negative_entered_quantity_sample) {
                        app.notify.error("Quantity must be greater than zero for sample!");
                        return false;
                    }
                    if (!checkflag_balancequantity_sample) {
                        app.notify.error("Quantity must be less than or equal to balance quantity for sample!");
                        return false;
                    }
                    //save dcr listed details
                    var doctor_msl_id = parseInt(ethosmastervaluesrecords[0].Doctor_MSL_ID);
                    if (msl_repeat_details[0].Doctor_Output_ID == 1) {
                        var dcr_repeat_listed_msl_doctor_details = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcr_repeat_listed_msl_doctor_details")))
                       .Where("$.Doctor_MSL_ID=='" + doctor_msl_id + "'")
                       .ToJSON());
                        if (dcr_repeat_listed_msl_doctor_details.length > 0) { 
                            var abc = parseInt($("#hdn_employee_repeat_doctor_count").val());
                            abc = abc + 1;
                            $("#hdn_employee_repeat_doctor_count").val(abc);
                        }
                    }
                    fun_save_dcr_listedmsl_doctor();
                    fun_get_dcr_doctor_msl_ids();
                    //get_filter_except_listed_doctor_msl_data();
                    fun_dcr_listedmsl_doctor_clearcontrols();
                    app.notify.success('Doctor details saved successfully.');
                    $("#collapse-dcr-listeddoctor-brandremainer").
                    removeClass("in");
                    $("#collapse-dcr-listeddoctor-brandremainer").
                        addClass("collapse");
                    $("#collapse-dcr-listeddoctor-sample").
                    removeClass("in");
                    $("#collapse-dcr-listeddoctor-sample").
                        addClass("collapse");
                }
            }
            else if (tabpanellistedmsl == "tabpanellistedmsl-chemist") {
                //chemist 
                // alert(tabpanellistedmsl);
                var txtlistedchemist = $("#txtlistedchemist").val();
                var txtlistedchemistpob = parseInt($("#txtlistedchemistpob").val());
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_chemist_details"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Chemist_Name=='" + txtlistedchemist + "'")
               .ToJSON());
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid chemist in list!");
                    return false;
                }
                else
                {
                    var chemist_msl_id = parseInt(ethosmastervaluesrecords[0].Chemist_MSL_ID);
                    var chemist_msl_id_records = JSON.parse(Enumerable.From(JSON.parse($("#hdn_chemist_msl_ids").val()))
                           .Where("$.chemist_msl_id==" + chemist_msl_id + "")
                           .ToJSON());
                    if (chemist_msl_id_records.length > 0) {
                        app.notify.error("Chemist name already exist!");
                        return false;
                    }
                    else if (msl_repeat_details[0].chemist_Output_ID == 1) {
                        var dcr_repeat_listed_msl_chemist_details = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcr_repeat_listed_msl_chemist_details")))
                       .Where("$.Chemist_MSL_ID=='" + chemist_msl_id + "'")
                       .ToJSON());
                        if (dcr_repeat_listed_msl_chemist_details.length > 0)
                        {
                            var Employee_Repeat_chemist_Count = parseInt($("#hdn_employee_repeat_chemist_count").val());
                            var Repeat_Chemist_Count = parseInt(msl_repeat_details[0].Repeat_chemist_Count);
                            if (Employee_Repeat_chemist_Count > Repeat_Chemist_Count) {
                                app.notify.error("Repeat msl count is exceed for this month");
                                return false;
                            }
                        }
                    } 
                }
                //else if (txtlistedchemistpob == "") {
                    //    app.notify.error("Select valid POB!");
                //    return false;
                //}
                //else if (isNaN(txtlistedchemistpob)) {
                    //    app.notify.error("Select valid POB!");
                //    return false;
                //}  
                if (txtlistedchemistpob < 0) {
                    app.notify.error("POB should not be less than zero!");
                    return false;
                } 
                else {
                    // check higher quantity
                    var grid_listedchemist_brandremainer = $("#grid_listedchemist_brandremainer")
                    .data("kendoGrid").dataItems();
                    var checkflag_balancequantity_gift = true;
                    var checkflag_negative_entered_quantity_gift = true;
                    $.each(grid_listedchemist_brandremainer, function (i, item) {
                        var entered_quantity = grid_listedchemist_brandremainer[i].quantity;
                        var balance_quantity = grid_listedchemist_brandremainer[i].balance_quantity;
                        if (parseInt(entered_quantity) <= 0) {
                            checkflag_negative_entered_quantity_gift = false;
                            return false;
                        }
                        if (parseInt(balance_quantity) < parseInt(entered_quantity)) {
                            checkflag_balancequantity_gift = false;
                            return false;
                        }
                    });
                    if (!checkflag_negative_entered_quantity_gift) {
                        app.notify.error("Quantity must be greater than zero for brand reminder!");
                        return false;
                    }
                    if (!checkflag_balancequantity_gift) {
                        app.notify.error("Quantity must be less than or equal to balance quantity for brand reminder!");
                        return false;
                    }
                    //save dcr listed details 
                    var chemist_msl_id = parseInt(ethosmastervaluesrecords[0].Chemist_MSL_ID);
                    if (msl_repeat_details[0].Chemist_Output_ID == 1) {
                        var dcr_repeat_listed_msl_chemist_details = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcr_repeat_listed_msl_chemist_details")))
                       .Where("$.Chemist_MSL_ID=='" + chemist_msl_id + "'")
                       .ToJSON());
                        if (dcr_repeat_listed_msl_chemist_details.length > 0) {
                            var abc = parseInt($("#hdn_employee_repeat_chemist_count").val());
                            abc = abc + 1;
                            $("#hdn_employee_repeat_chemist_count").val(abc);
                        }
                    }
                    fun_save_dcr_listedmsl_chemist();
                    fun_get_dcr_chemist_msl_ids();
                    fun_dcr_listedmsl_chemist_clearcontrols();
                    app.notify.success('Chemist details saved successfully.');
                    $("#collapse-dcr-chemist-brandremainer").
                    removeClass("in");
                    $("#collapse-dcr-chemist-brandremainer").
                        addClass("collapse");
                }
            }
            $(".km-scroll-container").css("transform", "none");
        },
        navigateDCRunlistedMSLView: function () {
            app.navigation.navigateDCRunlistedMSLView();
        },
        navigateDCRfinaentryView: function () {
            app.navigation.navigateDCRfinaentryView();
        },
    });
    view.set('DCRlistedMSLViewModel', DCRlistedMSLViewModel);
}());

function fun_get_dcr_doctor_msl_ids() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdn_doctor_msl_ids").val(JSON.stringify(valuedata));
    }
    app.select_dcr_doctor_master_doctor_msl_ids(renderstr);
}

function fun_get_dcr_chemist_msl_ids() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdn_chemist_msl_ids").val(JSON.stringify(valuedata));
    }
    app.select_dcr_chemist_master_chemist_msl_ids(renderstr);
}
 
function openmodalview_dcr_selected_workwith() {
    $("#modalview-dcr-selected-workwith").kendoMobileModalView("open");
}

function closemodalview_dcr_selected_workwith() {
    $("#modalview-dcr-selected-workwith").kendoMobileModalView("close");
}

function openmodalview_dcr_selected_market_areas() {
    $("#modalview-dcr-selected-market-areas").kendoMobileModalView("open");
}

function closemodalview_dcr_selected_market_areas() {
    $("#modalview-dcr-selected-market-areas").kendoMobileModalView("close");
}

function fun_load_dcr_listedmsl_pageinit() {
    $('#txtlisteddoctor').val('');
    $('#txtlisteddoctorpob').val('');
    $('#txtlistedchemist').val('');
    $('#txtlistedchemistpob').val('');
    localStorage.setItem("dcrs_listedmsl_details_live", 1);
}

function fun_load_listedmsl_page() {
    //if (localStorage.getItem("dcrs_listedmsl_details_live") == null ||
    //            localStorage.getItem("dcrs_listedmsl_details_live") != 1) {
        var user = JSON.parse(localStorage.getItem("userdata"));
        var Employee_ID = user.Employee_ID;
        var Own_Sub_Territory_ID = user.Sub_Territory_ID;
        var Sub_Territory_ID = $("#hdn_dcr_selected_worked_with").val(); 
        var Designation_ID = user.Designation_ID;
        var Division_ID = user.Division_ID;
        var Authentication = user.Authentication;
        var Category_ID = $("#hdn_dcr_category_id").val();
        var Market_Area_ID = $("#hdn_dcr_selected_market_areas").val(); 
        app.utils.loading(true);
        fun_db_APP_Get_Z6_DCR_Listed_MSL_Information(Own_Sub_Territory_ID,
            Employee_ID, Sub_Territory_ID,
        Designation_ID, Division_ID, Category_ID, Authentication, Market_Area_ID);
    //}
    //else {
    //    fun_load_dcr_listedmsl_pageinit();
    //    fun_load_dcr_listedmsl_doctor_pageload();
    //    fun_load_dcr_listedmsl_chemist_pageload();
    //}
}
 
// doctor start 
function get_dcr_listedmsl_doctor_values() {
    var render_dcr_ins_master = function (tx1, rs1) {
        $("#hdndcr_doctor_master_id").val(rs1.rows.item(0).dcr_doctor_master_id);
    }
    app.select_count_dcr_doctor_master_by_dcr_master_id(render_dcr_ins_master, 1);
}

function fun_load_dcr_listedmsl_doctor_pageload() {

    fun_load_dcr_listedmsl_doctors();
    fun_dcr_listed_msl_doctor_promos_gift(413);
    fun_dcr_listed_msl_doctor_promos_sample(414);
}

function fun_load_dcr_listedmsl_doctors() {
    $("#txtlisteddoctor").kendoAutoComplete({
        clearButton: false
    });
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_doctor_details"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON()); 
    $("#txtlisteddoctor").kendoAutoComplete({
        dataSource: ethosmastervaluesrecords,
        dataTextField: "Doctor_Name",
        valuePrimitive: true,
        ignoreCase: true,
        minLength: 1,
        filter: "contains",
        placeholder: "Type doctor name",
        clearButton: false, 
        change: function (e) {
            var value = this.value();
            if (value.length > 6) {
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_doctor_details"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Doctor_Name=='" + value + "'")
               .ToJSON());
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid doctor in list!");
                    return false;
                }
            }
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#txtlisteddoctor").blur();
                var autocomplete = $("#txtlisteddoctor").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}

function fun_save_dcr_listedmsl_doctor() {
    // need to save dcr dcotor data in sql lite db
    var dcr_master_id = 1;
    var txtlisteddoctor = $('#txtlisteddoctor').val();
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_doctor_details"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Doctor_Name=='" + txtlisteddoctor + "'")
   .ToJSON());
    var doctor_id = ethosmastervaluesrecords[0].Doctor_ID;
    var doctor_msl_id = ethosmastervaluesrecords[0].Doctor_MSL_ID;
    var doctor_name = $('#txtlisteddoctor').val();//.split('|')[0];
    var doctor_number = ethosmastervaluesrecords[0].Doctor_MSL_Number;
    var pob = parseInt($('#txtlisteddoctorpob').val());
    if (isNaN(pob)) {
        pob = 0;
    }
    //var options = {
    //    enableHighAccuracy: true,
    //    timeout: 10000
    //};
    //var geolo = navigator.geolocation.getCurrentPosition(function () {
    //    app.addto_dcr_doctor_master(dcr_master_id, doctor_id,doctor_msl_id, doctor_name, doctor_number, pob,
    //        JSON.stringify(arguments[0].coords.latitude),
    //        JSON.stringify(arguments[0].coords.longitude));
    //}, function () {
    //    app.addto_dcr_doctor_master(dcr_master_id, doctor_id,doctor_msl_id, doctor_name, doctor_number, pob,
    //        "", "");
    //}, options);
    app.addto_dcr_doctor_master(dcr_master_id, doctor_id, doctor_msl_id, doctor_name, doctor_number, pob,
            "", "");

    var hdndcr_doctor_master_id = parseInt($("#hdndcr_doctor_master_id").val());

    //Add to Brand Reminder details  
    var user = JSON.parse(localStorage.getItem("userdata"));
    var Sub_Territory_ID = user.Sub_Territory_ID;
    var grid_listeddoctor_brandremainer = $("#grid_listeddoctor_brandremainer")
                    .data("kendoGrid").dataItems();
    $.each(grid_listeddoctor_brandremainer, function (i, item) {
        var gift_id = grid_listeddoctor_brandremainer[i].promoitem_value_id;
        var gift_name = grid_listeddoctor_brandremainer[i].collaterals;
        var quantity = grid_listeddoctor_brandremainer[i].quantity;
        var balance_quantity = parseInt(grid_listeddoctor_brandremainer[i].balance_quantity) -
            parseInt(grid_listeddoctor_brandremainer[i].quantity);
        if (parseInt(quantity) >= 0) {
            app.update_promo_balance_details_by_sub_territory_id_promoitem_value_id(Sub_Territory_ID, gift_id, balance_quantity);
            app.addto_dcr_doctor_gift_details(hdndcr_doctor_master_id, gift_id, gift_name, quantity);
        }
    });
      
    //Add to Sample details   
    var grid_listeddoctor_sample = $("#grid_listeddoctor_sample")
                    .data("kendoGrid").dataItems();
    $.each(grid_listeddoctor_sample, function (i, item) {
        var gift_id = grid_listeddoctor_sample[i].promoitem_value_id;
        var gift_name = grid_listeddoctor_sample[i].collaterals;
        var quantity = grid_listeddoctor_sample[i].quantity;
        var balance_quantity = parseInt(grid_listeddoctor_sample[i].balance_quantity) -
            parseInt(grid_listeddoctor_sample[i].quantity);
        if (parseInt(quantity) >= 0) {
            app.update_promo_balance_details_by_sub_territory_id_promoitem_value_id(Sub_Territory_ID, gift_id, balance_quantity);
            app.addto_dcr_doctor_sample_details(hdndcr_doctor_master_id, gift_id, gift_name, quantity);
        }
    });

    //Add to ww details  
    //var ddlwwrecords = $("#ddlworkwithinst")
    //                       .data("kendoMultiSelect").dataItems();
    //$.each(ddlwwrecords, function (i, item) {
    //    var emp_id = ddlwwrecords[i].Employee_Name.split('|')[1];
    //    var emp_name = ddlwwrecords[i].Employee_Name.split('|')[0];
    //    app.addto_dcr_ins_ww_details(hdndcr_doctor_master_id , emp_id, emp_name);
    //});

    // Add new type work with

    var render_control = function (tx1, rs1) {
        for (var i = 0; i < rs1.rows.length; i++) {
            var emp_id = rs1.rows.item(i).ww_id;
            var emp_name = rs1.rows.item(i).ww_name;
            app.addto_dcr_doctor_ww_details(hdndcr_doctor_master_id - 1, emp_id, emp_name);
        }
        if (rs1.rows.length == 0) {
            var emp_id = $("#hdnEmployee_ID").val();
            var emp_name = $("#dvusername").html();
            app.addto_dcr_doctor_ww_details(hdndcr_doctor_master_id - 1, emp_id, emp_name);
        }
    }
    app.select_dcr_master_ww_details_by_dcr_master_id(render_control, 1);

    //app.delete_dcr_master_ww_details_temp_institution();
    //fun_reload_dcr_master_ww_details_temp_institution();
    //setTimeout(get_list_dcr_selected_worked_with, 1000);

    hdndcr_doctor_master_id = hdndcr_doctor_master_id + 1;
    $("#hdndcr_doctor_master_id").val(hdndcr_doctor_master_id);
}

function fun_dcr_listedmsl_doctor_clearcontrols() {
    $("#hdn_doctor_msl_id_count").val('0');
    $('#txtlisteddoctor').val('');
    $('#txtlisteddoctorpob').val('');
    //$("#grid_listeddoctor_brandremainer").data("kendoGrid").dataSource.data([]);
    fun_dcr_listed_msl_doctor_promos_gift(413);
    fun_dcr_listed_msl_doctor_promos_sample(414);
    fun_dcr_listed_msl_chemist_promos_gift(413);

}

function fun_dcr_listed_msl_doctor_promos_gift(promoitem_id) {

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
                    promoitem_value_id: "promoitem_value_id",
                    fields: {
                        sub_territory_id: { type: "number", editable: false, nullable: false },
                        promoitem_value_id: { type: "number", editable: false, nullable: false },
                        promoitem_id: { type: "number", editable: false, nullable: false },
                        collaterals: { type: "string", editable: false },
                        balance_quantity: { type: "number", editable: false, nullable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_listeddoctor_brandremainer").kendoGrid({
            dataSource: dataSource,
            columns: [
                { hidden: true, title: "sub_territory_id", field: "sub_territory_id", editable: false },
               { hidden: true, title: "promoitem_value_id", field: "promoitem_value_id", editable: false },
               { hidden: true, title: "promoitem_id", field: "promoitem_id", editable: false },
               { enabled: false, title: "Product", field: "collaterals", editable: false },
               { width:70, enabled: false, title: "Balance", field: "balance_quantity", editable: false, },
               {

                   width:50, title: "Qty",
                   field: "quantity",
                   editor: function (container, options) {
                       // create an input element
                       var input = $("<input/>");
                       // set its name to the field to which the column is bound ('name' in this case)
                       input.attr("name", options.field);
                       input.attr("id", options.field);
                       input.attr("type", "number");
                       // append it to the container
                       input.appendTo(container);
                   },
               }],
            editable: true,
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_dcr_promo_balance_details_by_promoitem_id(render_control, promoitem_id);
}

function fun_dcr_listed_msl_doctor_promos_sample(promoitem_id) {
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
                    promoitem_value_id: "promoitem_value_id",
                    fields: {
                        sub_territory_id: { type: "number", editable: false, nullable: false },
                        promoitem_value_id: { type: "number", editable: false, nullable: false },
                        promoitem_id: { type: "number", editable: false, nullable: false },
                        collaterals: { type: "string", editable: false },
                        balance_quantity: { type: "number", editable: false, nullable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_listeddoctor_sample").kendoGrid({
            dataSource: dataSource,
            columns: [
                { hidden: true, title: "sub_territory_id", field: "sub_territory_id", editable: false },
               { hidden: true, title: "promoitem_value_id", field: "promoitem_value_id", editable: false },
               { hidden: true, title: "promoitem_id", field: "promoitem_id", editable: false },
               { enabled: false, title: "Product", field: "collaterals", editable: false },
               { width:70, enabled: false, title: "Balance", field: "balance_quantity", editable: false, },
               {

                   width:50, title: "Qty",
                   field: "quantity",
                   editor: function (container, options) {
                       // create an input element
                       var input = $("<input/>");
                       // set its name to the field to which the column is bound ('name' in this case)
                       input.attr("name", options.field);
                       input.attr("id", options.field);
                       input.attr("type", "number");
                       // append it to the container
                       input.appendTo(container);
                   },
               }],
            editable: true,
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_dcr_promo_balance_details_by_promoitem_id(render_control, promoitem_id);
}

// doctor end 

// chemist start
function get_dcr_listedmsl_chemist_values() {
    var render_dcr_ins_master = function (tx1, rs1) {
        $("#hdndcr_chemist_master_id").val(rs1.rows.item(0).dcr_chemist_master_id);
    }
    app.select_count_dcr_chemist_master_by_dcr_master_id(render_dcr_ins_master, 1);
}

function fun_load_dcr_listedmsl_chemist_pageload() {

    fun_load_dcr_listedmsl_chemists();
    fun_dcr_listed_msl_chemist_promos_gift(413);
}

function fun_load_dcr_listedmsl_chemists() {
    $("#txtlistedchemist").kendoAutoComplete({
        clearButton: false
    });
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_chemist_details"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());

    $("#txtlistedchemist").kendoAutoComplete({
        dataSource: ethosmastervaluesrecords,
        dataTextField: "Chemist_Name",
        valuePrimitive: true,
        ignoreCase: true,
        minLength: 1,
        filter: "contains",
        placeholder: "Type chemist name",
        clearButton: false,
        //separator: ", "
        //noDataTemplate: 'No records found!',
        change: function (e) {
            var value = this.value();
            if (value.length > 6) {
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_chemist_details"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Chemist_Name=='" + value + "'")
               .ToJSON());
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid chemist in list!");
                    return false;
                }
            }
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#txtlistedchemist").blur();
                var autocomplete = $("#txtlistedchemist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}

function fun_save_dcr_listedmsl_chemist() {
    // need to save dcr dcotor data in sql lite db
    var dcr_master_id = 1;
    var txtlistedchemist=$('#txtlistedchemist').val();
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_chemist_details"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Chemist_Name=='" + txtlistedchemist + "'")
   .ToJSON());
    var chemist_id = ethosmastervaluesrecords[0].Chemist_ID;
    var chemist_msl_id = ethosmastervaluesrecords[0].Chemist_MSL_ID;
    var chemist_name = txtlistedchemist;//.split('|')[0];
    var chemist_number = ethosmastervaluesrecords[0].Chemist_MSL_Number;
    var pob = parseInt($('#txtlistedchemistpob').val());
    if (isNaN(pob)) {
        pob = 0;
    }
    //var options = {
    //    enableHighAccuracy: true,
    //    timeout: 10000
    //};
    //var geolo = navigator.geolocation.getCurrentPosition(function () {
    //    app.addto_dcr_chemist_master(dcr_master_id, chemist_id,chemist_msl_id, chemist_name, chemist_number, pob,
    //        JSON.stringify(arguments[0].coords.latitude),
    //        JSON.stringify(arguments[0].coords.longitude));
    //}, function () {
    //    app.addto_dcr_chemist_master(dcr_master_id, chemist_id,chemist_msl_id, chemist_name, chemist_number, pob,
    //        "", "");
    //}, options);
    app.addto_dcr_chemist_master(dcr_master_id, chemist_id, chemist_msl_id, chemist_name, chemist_number, pob,
            "", "");
    var hdndcr_chemist_master_id = parseInt($("#hdndcr_chemist_master_id").val());

    //Add to Brand Reminder details  
    var user = JSON.parse(localStorage.getItem("userdata"));
    var Sub_Territory_ID = user.Sub_Territory_ID;
    var grid_listedchemist_brandremainer = $("#grid_listedchemist_brandremainer")
                    .data("kendoGrid").dataItems();
    $.each(grid_listedchemist_brandremainer, function (i, item) {
        var gift_id = grid_listedchemist_brandremainer[i].promoitem_value_id;
        var gift_name = grid_listedchemist_brandremainer[i].collaterals;
        var quantity = grid_listedchemist_brandremainer[i].quantity;
        var balance_quantity = parseInt(grid_listedchemist_brandremainer[i].balance_quantity) -
            parseInt(grid_listedchemist_brandremainer[i].quantity);
        if (parseInt(quantity) >= 0) {
            app.update_promo_balance_details_by_sub_territory_id_promoitem_value_id(Sub_Territory_ID, gift_id, balance_quantity);
            app.addto_dcr_chemist_gift_details(hdndcr_chemist_master_id, gift_id, gift_name, quantity);
        }
    });

    // Add new type work with 
    var render_control = function (tx1, rs1) {
        for (var i = 0; i < rs1.rows.length; i++) {
            var emp_id = rs1.rows.item(i).ww_id;
            var emp_name = rs1.rows.item(i).ww_name;
            app.addto_dcr_chemist_ww_details(hdndcr_chemist_master_id - 1, emp_id, emp_name);
        }
        if (rs1.rows.length == 0) {
            var emp_id = $("#hdnEmployee_ID").val();
            var emp_name = $("#dvusername").html();
            app.addto_dcr_chemist_ww_details(hdndcr_chemist_master_id - 1, emp_id, emp_name);
        }
    }
    app.select_dcr_master_ww_details_by_dcr_master_id(render_control,1);
    //app.select_dcr_master_ww_details_temp_institution(render_control);
    //app.delete_dcr_master_ww_details_temp_institution();
    //fun_reload_dcr_master_ww_details_temp_institution();
    //setTimeout(get_list_dcr_selected_worked_with, 1000);

    hdndcr_chemist_master_id = hdndcr_chemist_master_id + 1;
    $("#hdndcr_chemist_master_id").val(hdndcr_chemist_master_id);
}

function fun_dcr_listedmsl_chemist_clearcontrols() {
    $('#txtlistedchemist').val('');
    $('#txtlistedchemistpob').val(''); 
    fun_dcr_listed_msl_doctor_promos_gift(413);
    fun_dcr_listed_msl_doctor_promos_sample(414);
    fun_dcr_listed_msl_chemist_promos_gift(413);
}

function fun_dcr_listed_msl_chemist_promos_gift(promoitem_id) {

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
                    promoitem_value_id: "promoitem_value_id",
                    fields: {
                        sub_territory_id: { type: "number", editable: false, nullable: false },
                        promoitem_value_id: { type: "number", editable: false, nullable: false },
                        promoitem_id: { type: "number", editable: false, nullable: false },
                        collaterals: { type: "string", editable: false },
                        balance_quantity: { type: "number", editable: false, nullable: false },
                        quantity: { type: "number", editable: true }
                    }
                }
            }
        });
        $("#grid_listedchemist_brandremainer").kendoGrid({
            dataSource: dataSource,
            columns: [
                { hidden: true, title: "sub_territory_id", field: "sub_territory_id", editable: false },
               { hidden: true, title: "promoitem_value_id", field: "promoitem_value_id", editable: false },
               { hidden: true, title: "promoitem_id", field: "promoitem_id", editable: false },
               { enabled: false, title: "Product", field: "collaterals", editable: false },
               { width:70, enabled: false, title: "Balance", field: "balance_quantity", editable: false, },
               {

                   width:50, title: "Qty",
                   field: "quantity",
                   editor: function (container, options) {
                       // create an input element
                       var input = $("<input/>");
                       // set its name to the field to which the column is bound ('name' in this case)
                       input.attr("name", options.field);
                       input.attr("id", options.field);
                       input.attr("type", "number");
                       // append it to the container
                       input.appendTo(container);
                   },
               }],
            editable: true,
            noRecords: {
                template: "No records found!"
            },
        });
    }
    app.select_dcr_dcr_promo_balance_details_by_promoitem_id(render_control, promoitem_id);
}

// chemist end 
function fun_reload_dcr_master_ww_details_temp_institution() {
    var render_control_ = function (tx2, rs2) {
        for (var i = 0; i < rs2.rows.length; i++) {
            var emp_id = rs2.rows.item(i).ww_id;
            var emp_name = rs2.rows.item(i).ww_name;
            app.addto_dcr_master_ww_details_temp_institution(emp_id, emp_name);
        }
    }
    app.select_dcr_master_ww_details_temp_master(render_control_);
    get_list_dcr_selected_worked_with();
}
 
function fun_delete_dcr_listedinstutition_ww_temp(e) {
    var data = e.button.data();
    var dcr_master_ww_detail_temp_institution_id = data.dcr_master_ww_detail_temp_institution_id;
    app.delete_dcr_master_ww_details_temp_institution_by_id(dcr_master_ww_detail_temp_institution_id);
    get_list_dcr_selected_worked_with();
}

function fun_db_APP_Get_Z6_DCR_Listed_MSL_Information(Own_Sub_Territory_ID, Employee_ID,
    Sub_Territory_ID, Designation_ID,
    Division_ID, Category_ID,
    Authentication, Market_Area_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_Listed_MSL_Information",
                type: "POST",
                dataType: "json",
                data: {
                    "Own_Sub_Territory_ID": Own_Sub_Territory_ID,
                    "Employee_ID": Employee_ID, "Sub_Territory_ID": Sub_Territory_ID,
                    "Designation_ID": Designation_ID, "Division_ID": Division_ID,
                    "Category_ID": Category_ID, "Authentication": Authentication,
                    "Market_Area_ID": Market_Area_ID
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

        localStorage.setItem("dcr_doctor_details", JSON.stringify(data[0])); // doc details 

        localStorage.setItem("dcr_chemist_details", JSON.stringify(data[1])); // chemist details

        localStorage.setItem("dcr_repeat_listed_msl_count_details", JSON.stringify(data[2])); // repeat list msl count details
         
        var sqllite_employee_repeat_doctor_count=parseInt($('#hdn_employee_repeat_doctor_count').val());
        var sqldb_employee_repeat_doctor_count = parseInt(data[2][0].Employee_Repeat_Doctor_Count);
        var total_doctor = sqllite_employee_repeat_doctor_count + sqldb_employee_repeat_doctor_count;
        $('#hdn_employee_repeat_doctor_count').val(total_doctor);
         
        var sqllite_employee_repeat_chemist_count = parseInt($('#hdn_employee_repeat_chemist_count').val());
        var sqldb_employee_repeat_chemist_count = parseInt(data[2][0].Employee_Repeat_Chemist_Count);
        var total_chemist = sqllite_employee_repeat_chemist_count + sqldb_employee_repeat_chemist_count;

        $('#hdn_employee_repeat_chemist_count').val(total_chemist);

        localStorage.setItem("dcr_repeat_listed_msl_doctor_details", JSON.stringify(data[3])); // repeat list msl doctor details

        localStorage.setItem("dcr_repeat_listed_msl_chemist_details", JSON.stringify(data[4])); // repeat list msl chemist details

        fun_load_dcr_listedmsl_pageinit();
        fun_load_dcr_listedmsl_doctor_pageload();
        fun_load_dcr_listedmsl_chemist_pageload();
        app.utils.loading(false);

    });
}

