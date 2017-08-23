
'use strict';

(function () {
    var view = app.DCRunlistedMSLView = kendo.observable();
    var DCRunlistedMSLViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRunlistedMSLView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            get_dcrmaster_unlistedmsl_doctor_values();
            get_dcrmaster_unlistedmsl_chemist_values();
            //if (localStorage.getItem("dcrs_unlistedmsl_details_live") == null ||
            //   localStorage.getItem("dcrs_unlistedmsl_details_live") != 1) {
                var user = JSON.parse(localStorage.getItem("userdata"));
                var Employee_ID = user.Employee_ID;
                var Sub_Territory_ID = user.Sub_Territory_ID;
                var Designation_ID = user.Designation_ID;
                var Division_ID = user.Division_ID;
                app.utils.loading(true);
                fun_db_APP_Get_Z6_DCR_UnListed_MSL_Information(Employee_ID, Sub_Territory_ID,
                    Designation_ID, Division_ID);
            //}
            //else {
            //    fun_load_dcr_unlistedmsl_doctor_pageinit();
            //    fun_load_dcr_unlistedmsl_doctor_pageload();

            //    fun_load_dcr_unlistedmsl_chemist_pageinit();
            //    fun_load_dcr_unlistedmsl_chemist_pageload();
            //}
        },
        saveunlistedscrdetails: function () {

            var tabpanelunlistedmsl = $("#tabpanelunlistedmsl").find('li.active').attr("id");
            if (tabpanelunlistedmsl == "tabpanelunlistedmsl-doctor") {
                //alert(tabpanelunlistedmsl);
                //doctor 
                var txtunlisteddoctorname = ($("#txtunlisteddoctorname").val());
                var txtunlisteddoctorregno = ($("#txtunlisteddoctorregno").val());
                var ddlunlisteddoctorqual1 = parseInt($("#ddlunlisteddoctorqual1").val());
                var ddlunlisteddoctorspeciality = parseInt($("#ddlunlisteddoctorspeciality").val());
                var ddlunlisteddoctormajortown = parseInt($("#ddlunlisteddoctormajortown").val());

                  var txtunlisteddoctorpobsingle = parseInt($("#txtunlisteddoctorpobsingle").val());
                var user = JSON.parse(localStorage.getItem("userdata"));
                var Own_Sub_Territory_ID = user.Sub_Territory_ID;
                if (txtunlisteddoctorname == "") {
                    app.notify.error("Enter doctor name!");
                    return false;
                }
                else if (txtunlisteddoctorregno == "") {
                    app.notify.error("Select registration number!");
                    return false;
                }
                else if (ddlunlisteddoctorqual1 == "" || isNaN(ddlunlisteddoctorqual1)) {
                    app.notify.error("Select qualification1!");
                    return false;
                }
                else if (ddlunlisteddoctorspeciality == "" || isNaN(ddlunlisteddoctorspeciality)) {
                    app.notify.error("Select speciality!");
                    return false;
                }
                else if (ddlunlisteddoctormajortown == "" || isNaN(ddlunlisteddoctormajortown)) {
                    app.notify.error("Select major town!");
                    return false;
                }  
                else if (txtunlisteddoctorpobsingle < 0) {
                    app.notify.error("POB should not be less than zero!");
                    return false;
                }  
                else {
                    // check higher quantity
                    var checkflag_balancequantity_gift = true;
                    var checkflag_negative_entered_quantity_gift = true;
                    var grid_unlisteddoctor_brandremainer = $("#grid_unlisteddoctor_brandremainer")
                    .data("kendoGrid").dataItems();
                    $.each(grid_unlisteddoctor_brandremainer, function (i, item) {
                        var entered_quantity = grid_unlisteddoctor_brandremainer[i].quantity;
                        var balance_quantity = grid_unlisteddoctor_brandremainer[i].balance_quantity;
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
                    var grid_unlisteddoctor_sample = $("#grid_unlisteddoctor_sample")
                    .data("kendoGrid").dataItems();
                    $.each(grid_unlisteddoctor_sample, function (i, item) {
                        var entered_quantity = grid_unlisteddoctor_sample[i].quantity;
                        var balance_quantity = grid_unlisteddoctor_sample[i].balance_quantity;
                        if (parseInt(balance_quantity) < parseInt(entered_quantity)) {
                            checkflag_balancequantity_sample = false;
                            return false;
                        }
                    });
                    if (!checkflag_negative_entered_quantity_gift) {
                        app.notify.error("Quantity must be greater than zero for brand reminder!");
                        return false;
                    }
                    if (!checkflag_balancequantity_sample) {
                        app.notify.error("Quantity must be less than or equal to balance quantity for sample!");
                        return false;
                    }
                    //save dcr unlisteddetails
                    fun_save_dcrmaster_unlistedmsl_doctor();
                    fun_unlistedmsl_doctor_clearcontrols();
                    app.notify.success('Unlisted doctor details saved successfully.');
                }
            }
            else if (tabpanelunlistedmsl == "tabpanelunlistedmsl-chemist") {
                //chemist 
                //alert(tabpanelunlistedmsl);
                var txtunlistedchemistname = ($("#txtunlistedchemistname").val());
                var txtunlistedchemistcontactperson = ($("#txtunlistedchemistcontactperson").val());
                var ddlunlistedchemistmajortown = parseInt($("#ddlunlistedchemistmajortown").val());
                var txtunlistedchemistpobsingle = parseInt($("#txtunlistedchemistpobsingle").val());

                var user = JSON.parse(localStorage.getItem("userdata"));
                var Own_Sub_Territory_ID = user.Sub_Territory_ID;
                if (txtunlistedchemistname == "") {
                    app.notify.error("Enter chemisy name!");
                    return false;
                }
                else if (txtunlistedchemistcontactperson == "") {
                    app.notify.error("Select chemist contact person!");
                    return false;
                }
                else if (ddlunlistedchemistmajortown == "" || isNaN(ddlunlistedchemistmajortown)) {
                    app.notify.error("Select major town!");
                    return false;
                } 
                else if (txtunlistedchemistpobsingle < 0) {
                    app.notify.error("Orders should not be less than zero!");
                    return false;
                } 
                else {
                    // check higher quantity
                    var checkflag_balancequantity_gift = true;
                    var checkflag_negative_entered_quantity_gift = true; 
                    var grid_unlistedchemist_brandremainer = $("#grid_unlistedchemist_brandremainer")
                    .data("kendoGrid").dataItems();
                    $.each(grid_unlistedchemist_brandremainer, function (i, item) {
                        var entered_quantity = grid_unlistedchemist_brandremainer[i].quantity;
                        var balance_quantity = grid_unlistedchemist_brandremainer[i].balance_quantity;
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
                    //save dcr unlisteddetails
                    fun_save_dcrmaster_unlistedmsl_chemist();
                    fun_dcr_unlistedmsl_chemist_clearcontrols();
                    app.notify.success('Unlisted chemist details saved successfully.');
                }
            }
            $(".km-scroll-container").css("transform", "none");
        },
    });

    view.set('DCRunlistedMSLViewModel', DCRunlistedMSLViewModel);
}());


// unlisted doctor start 
function get_dcrmaster_unlistedmsl_doctor_values() {
    var render_dcr_unlisted_ins_master = function (tx2, rs2) {
        $("#hdndcr_unlisted_doctor_master_id").val(rs2.rows.item(0).dcr_unlisted_doctor_master_id);
    }
    app.select_count_dcr_unlisted_doctor_master_by_dcr_master_id(render_dcr_unlisted_ins_master, 1);
}
function fun_load_dcr_unlistedmsl_doctor_pageinit() {
    fun_dcr_unlistedmsl_doctor_marketareas();
     
    //$("#ddlunlisteddoctorproductspromoted").kendoMultiSelect({
    //    index: 0,
    //    dataTextField: "ProductGroup_Name",
    //    dataValueField: "ProductGroup_ID",
    //    dataSource: [],
    //    optionLabel: "---Select---",
    //    autoClose: true,
    //    clearButton: false,
    //});
}

function fun_load_dcr_unlistedmsl_doctor_pageload() {
    fun_dcr_unlistedmsl_doctor_qualifications();
    fun_dcr_unlistedmsl_doctor_specialities();
    fun_dcr_unlistedmsl_doctor_marketareas();
    fun_dcr_unlistedmsl_doctor_chiefs();
    fun_dcr_unlistedmsl_doctor_productspromoted();

    fun_dcr_unlisted_msl_doctor_promos_gift(413);
    fun_dcr_unlisted_msl_doctor_promos_sample(414);
}

function fun_dcr_unlistedmsl_doctor_qualifications() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcr_qualifications_specialities")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 12)
        .ToJSON());

    $("#ddlunlisteddoctorqual1").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "---Select---",
    });

    $("#ddlunlisteddoctorqual2").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "NONE",
    });

    $("#ddlunlisteddoctorqual3").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "NONE",
    });

    var ddlunlisteddoctorqual2 = $("#ddlunlisteddoctorqual2").data("kendoDropDownList");
    ddlunlisteddoctorqual2.value("195");
    var ddlunlisteddoctorqual3 = $("#ddlunlisteddoctorqual3").data("kendoDropDownList");
    ddlunlisteddoctorqual3.value("195");

}

function fun_dcr_unlistedmsl_doctor_specialities() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcr_qualifications_specialities")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 14)
        .ToJSON());

    $("#ddlunlisteddoctorspeciality").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "---Select---",
    });
}

function fun_dcr_unlistedmsl_doctor_marketareas() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcr_marketareas_details")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());

    $("#ddlunlisteddoctormajortown").kendoDropDownList({
        index: 0,
        dataTextField: "Market_Area_Name",
        dataValueField: "Market_Area_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "---Select---",
    });
}

function fun_dcr_unlistedmsl_doctor_chiefs() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcrchiefdetails")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
     
}

function fun_dcr_unlistedmsl_doctor_productspromoted() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_product_promot_details"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    //var ddlunlisteddoctorproductspromoted = $("#ddlunlisteddoctorproductspromoted").data("kendoMultiSelect");
    //ddlunlisteddoctorproductspromoted.setDataSource(ethosmastervaluesrecords);
    //ddlunlisteddoctorproductspromoted.refresh();
}

function fun_dcr_unlisted_msl_doctor_promos_gift(promoitem_id) {
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
        $("#grid_unlisteddoctor_brandremainer").kendoGrid({
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

function fun_dcr_unlisted_msl_doctor_promos_sample(promoitem_id) {
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
        $("#grid_unlisteddoctor_sample").kendoGrid({
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

function fun_save_dcrmaster_unlistedmsl_doctor() {
    //  parent  table data and need to save dcr master data in sql lite db


    var dcr_master_id = 1;
    var doctor_name = $("#txtunlisteddoctorname").val();
    var sex_id = $("#dvrbunlisteddoctorgender input[type='radio']:checked").attr('id');
    var sex_name = $("#dvrbunlisteddoctorgender input[type='radio']:checked").val();
    var registration_number = $("#txtunlisteddoctorregno").val();

    var qualification1 = parseInt($("#ddlunlisteddoctorqual1").val());
    var qualification1_name = $("#ddlunlisteddoctorqual1 option:selected").text();
    var qualification2 = parseInt($("#ddlunlisteddoctorqual2").val());
    var qualification2_name = $("#ddlunlisteddoctorqual2 option:selected").text();
    var qualification3 = parseInt($("#ddlunlisteddoctorqual3").val());

    var qualification3_name = $("#ddlunlisteddoctorqual3 option:selected").text();
    var other_qualification = "";
    var other_qualification_name = "";
    var speciality = parseInt($("#ddlunlisteddoctorspeciality").val());
    var speciality_name = $("#ddlunlisteddoctorspeciality option:selected").text();

    var user = JSON.parse(localStorage.getItem("userdata"));
    var city_id = user.City_ID;
    var city_name = "";
    var state_id = user.State_ID;
    var state_name = "";
    var mj_id = parseInt($("#ddlunlisteddoctormajortown").val());


    var mj_name = $("#ddlunlisteddoctormajortown option:selected").text();
    var address = $("#txtunlisteddoctoraddress").val();
    var pincode = $("#txtunlisteddoctorpincode").val();
    var phone = $("#txtunlisteddoctorphone").val();
    var mobile = $("#txtunlisteddoctormobile").val();

    var email = $("#txtunlisteddoctoremail").val();
    var pob = $("#txtunlisteddoctorpobsingle").val();


    var options = {
        enableHighAccuracy: true,
        timeout: 10000
    };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        app.addto_dcr_unlisted_doctor_master(dcr_master_id, doctor_name, sex_id, sex_name, registration_number,
        qualification1, qualification1_name, qualification2, qualification2_name, qualification3,
        qualification3_name, other_qualification, other_qualification_name, speciality, speciality_name,
        city_id, city_name, state_id, state_name, mj_id,
        mj_name, address, pincode, phone, mobile,
        email, pob,
        JSON.stringify(arguments[0].coords.latitude), JSON.stringify(arguments[0].coords.longitude));
    }, function () {
        app.addto_dcr_unlisted_doctor_master(dcr_master_id, doctor_name, sex_id, sex_name, registration_number,
        qualification1, qualification1_name, qualification2, qualification2_name, qualification3,
        qualification3_name, other_qualification, other_qualification_name, speciality, speciality_name,
        city_id, city_name, state_id, state_name, mj_id,
        mj_name, address, pincode, phone, mobile,
        email, pob,
      "", "");
    }, options);

    var hdndcr_unlisted_doctor_master_id = parseInt($("#hdndcr_unlisted_doctor_master_id").val());

    //work with details  
    // Add new type work with 
    var render_control = function (tx1, rs1) {
        for (var i = 0; i < rs1.rows.length; i++) {
            var emp_id = rs1.rows.item(i).ww_id;
            var emp_name = rs1.rows.item(i).ww_name;
            app.addto_dcr_unlisted_doctor_ww_details(hdndcr_unlisted_doctor_master_id - 1, emp_id, emp_name);
        }
        if (rs1.rows.length == 0) {
            var emp_id = $("#hdnEmployee_ID").val();
            var emp_name = $("#dvusername").html();
            app.addto_dcr_unlisted_doctor_ww_details(hdndcr_unlisted_doctor_master_id - 1, emp_id, emp_name);
        }
    }
    app.select_dcr_master_ww_details_by_dcr_master_id(render_control, 1);

    //app.delete_dcr_master_ww_details_temp_institution();
    //fun_reload_dcr_master_ww_details_temp_institution();
    //setTimeout(get_list_dcr_selected_worked_with, 1000);

    // product promote details 
    //var ddlunlisteddoctorproductspromoted = $("#ddlunlisteddoctorproductspromoted")
    //    .data("kendoMultiSelect").dataItems();
    //$.each(ddlunlisteddoctorproductspromoted, function (i, item) {
    //    var pp_id = ddlunlisteddoctorproductspromoted[i].ProductGroup_ID;
    //    var pp_name = ddlunlisteddoctorproductspromoted[i].ProductGroup_Name;
    //    app.addto_dcr_unlisted_doctor_pp_details(hdndcr_unlisted_doctor_master_id, pp_id, pp_name);
    //});

    //Add to Brand Reminder details  
    var user = JSON.parse(localStorage.getItem("userdata"));
    var Sub_Territory_ID = user.Sub_Territory_ID;
    var grid_unlisteddoctor_brandremainer = $("#grid_unlisteddoctor_brandremainer")
                    .data("kendoGrid").dataItems();
    $.each(grid_unlisteddoctor_brandremainer, function (i, item) {
        var gift_id = grid_unlisteddoctor_brandremainer[i].promoitem_value_id;
        var gift_name = grid_unlisteddoctor_brandremainer[i].collaterals;
        var quantity = grid_unlisteddoctor_brandremainer[i].quantity;
        var balance_quantity = parseInt(grid_unlisteddoctor_brandremainer[i].balance_quantity) -
            parseInt(grid_unlisteddoctor_brandremainer[i].quantity);
        if (parseInt(quantity) >= 0) {
            app.update_promo_balance_details_by_sub_territory_id_promoitem_value_id(Sub_Territory_ID, gift_id, balance_quantity);
            app.addto_dcr_unlisted_doctor_gift_details(hdndcr_unlisted_doctor_master_id, gift_id, gift_name, quantity);
        }
    });

    //Add to Sample details   
    var grid_unlisteddoctor_sample = $("#grid_unlisteddoctor_sample")
                    .data("kendoGrid").dataItems();
    $.each(grid_unlisteddoctor_sample, function (i, item) {
        var gift_id = grid_unlisteddoctor_sample[i].promoitem_value_id;
        var gift_name = grid_unlisteddoctor_sample[i].collaterals;
        var quantity = grid_unlisteddoctor_sample[i].quantity;
        var balance_quantity = parseInt(grid_unlisteddoctor_sample[i].balance_quantity) -
            parseInt(grid_unlisteddoctor_sample[i].quantity);
        if (parseInt(quantity) >= 0) {
            app.update_promo_balance_details_by_sub_territory_id_promoitem_value_id(Sub_Territory_ID, gift_id, balance_quantity);
            app.addto_dcr_unlisted_doctor_sample_details(hdndcr_unlisted_doctor_master_id, gift_id, gift_name, quantity);
        }
    });
    hdndcr_unlisted_doctor_master_id = hdndcr_unlisted_doctor_master_id + 1;
    $("#hdndcr_unlisted_doctor_master_id").val(hdndcr_unlisted_doctor_master_id);
}

function fun_unlistedmsl_doctor_clearcontrols() {
    $("#txtunlisteddoctorname").val('');
    //$("input[name='rbunlisteddoctorgender']").removeAttr('checked');
    $("#txtunlisteddoctorregno").val('');

    var ddlunlisteddoctorqual1 = $("#ddlunlisteddoctorqual1").data("kendoDropDownList");
    ddlunlisteddoctorqual1.value("---Select---");
    var ddlunlisteddoctorqual2 = $("#ddlunlisteddoctorqual2").data("kendoDropDownList");
    ddlunlisteddoctorqual2.value("195");
    var ddlunlisteddoctorqual3 = $("#ddlunlisteddoctorqual3").data("kendoDropDownList");
    ddlunlisteddoctorqual3.value("195");

    var ddlunlisteddoctorspeciality = $("#ddlunlisteddoctorspeciality").data("kendoDropDownList");
    ddlunlisteddoctorspeciality.value("---Select---");
    var ddlunlisteddoctormajortown = $("#ddlunlisteddoctormajortown").data("kendoDropDownList");
    ddlunlisteddoctormajortown.value("---Select---");
    $("#txtunlisteddoctoraddress").val('');

    $("#txtunlisteddoctorpincode").val('');
    $("#txtunlisteddoctorphone").val('');
    $("#txtunlisteddoctormobile").val('');

    $("#txtunlisteddoctoremail").val('');
    $("#txtunlisteddoctorpobsingle").val(''); 
    //var ddlunlisteddoctorproductspromoted = $("#ddlunlisteddoctorproductspromoted").data("kendoMultiSelect");
    //ddlunlisteddoctorproductspromoted.value("");

    fun_dcr_unlisted_msl_doctor_promos_gift(413);
    fun_dcr_unlisted_msl_doctor_promos_sample(414);
    fun_dcr_unlisted_msl_chemist_promos_gift(413);
}

// unlisted doctor end

// unlisted chemist start 
function get_dcrmaster_unlistedmsl_chemist_values() {
    var render_dcr_unlisted_ins_master = function (tx2, rs2) {
        $("#hdndcr_unlisted_chemist_master_id").val(rs2.rows.item(0).dcr_unlisted_chemist_master_id);
    }
    app.select_count_dcr_unlisted_chemist_master_by_dcr_master_id(render_dcr_unlisted_ins_master, 1);
}

function fun_load_dcr_unlistedmsl_chemist_pageinit() {

    fun_dcr_unlistedmsl_chemist_marketareas();
     

    //$("#ddlunlistedchemistproductspromoted").kendoMultiSelect({
    //    index: 0,
    //    dataTextField: "ProductGroup_Name",
    //    dataValueField: "ProductGroup_ID",
    //    dataSource: [],
    //    optionLabel: "---Select---",
    //    autoClose: true,
    //    clearButton: false,
    //});
}

function fun_dcr_unlistedmsl_chemist_marketareas() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcr_marketareas_details")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());

    $("#ddlunlistedchemistmajortown").kendoDropDownList({
        index: 0,
        dataTextField: "Market_Area_Name",
        dataValueField: "Market_Area_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "---Select---",
    });
}

function fun_load_dcr_unlistedmsl_chemist_pageload() {
    fun_dcr_unlistedmsl_chemist_chiefs();
    fun_dcr_unlistedmsl_chemist_productspromoted();
    fun_dcr_unlisted_msl_chemist_promos_gift(413);
}

function fun_dcr_unlistedmsl_chemist_chiefs() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcrchiefdetails")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
     
}

function fun_dcr_unlistedmsl_chemist_productspromoted() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcr_product_promot_details"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    //var ddlunlistedchemistproductspromoted = $("#ddlunlistedchemistproductspromoted").data("kendoMultiSelect");
    //ddlunlistedchemistproductspromoted.setDataSource(ethosmastervaluesrecords);
    //ddlunlistedchemistproductspromoted.refresh();
}

function fun_dcr_unlisted_msl_chemist_promos_gift(promoitem_id) {
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
        $("#grid_unlistedchemist_brandremainer").kendoGrid({
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

function fun_save_dcrmaster_unlistedmsl_chemist() {
    //  parent  table data and need to save dcr master data in sql lite db


    var dcr_master_id = 1;
    var chemist_name = $("#txtunlistedchemistname").val();
    var contact_person_name = $("#txtunlistedchemistcontactperson").val();
    var drug_license_no = $("#txtunlistedchemistdruglincenseno").val();
    var vat_no = $("#txtunlistedchemistvatno").val();

    var user = JSON.parse(localStorage.getItem("userdata"));
    var city_id = user.City_ID;
    var city_name = "";
    var state_id = user.State_ID;
    var state_name = "";

    var mj_id = parseInt($("#ddlunlistedchemistmajortown").val());
    var mj_name = $("#ddlunlistedchemistmajortown option:selected").text();

    var address = $("#txtunlistedchemistaddress").val();
    var pincode = $("#txtunlistedchemistpincode").val();
    var phone = $("#txtunlistedchemistphone").val();
    var mobile = $("#txtunlistedchemistmobile").val();

    var email = $("#txtunlistedchemistemail").val();
    var pob = $("#txtunlistedchemistpobsingle").val();


    var options = {
        enableHighAccuracy: true,
        timeout: 10000
    };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        app.addto_dcr_unlisted_chemist_master(dcr_master_id, chemist_name, contact_person_name, drug_license_no, vat_no,
        city_id, city_name, state_id, state_name, mj_id,
        mj_name, address, pincode, phone, mobile, email,
        pob,
        JSON.stringify(arguments[0].coords.latitude), JSON.stringify(arguments[0].coords.longitude));
    }, function () {
        app.addto_dcr_unlisted_chemist_master(dcr_master_id, chemist_name, contact_person_name, drug_license_no, vat_no,
        city_id, city_name, state_id, state_name, mj_id,
        mj_name, address, pincode, phone, mobile, email,
        pob,
      "", "");
    }, options);
    var hdndcr_unlisted_chemist_master_id = parseInt($("#hdndcr_unlisted_chemist_master_id").val()); 
    
    //work with details
    // Add new type work with 
    var render_control = function (tx1, rs1) {
        for (var i = 0; i < rs1.rows.length; i++) {
            var emp_id = rs1.rows.item(i).ww_id;
            var emp_name = rs1.rows.item(i).ww_name;
            app.addto_dcr_unlisted_chemist_ww_details(hdndcr_unlisted_chemist_master_id - 1, emp_id, emp_name);
        }
        if (rs1.rows.length == 0) {
            var emp_id = $("#hdnEmployee_ID").val();
            var emp_name = $("#dvusername").html();
            app.addto_dcr_unlisted_chemist_ww_details(hdndcr_unlisted_chemist_master_id - 1, emp_id, emp_name);
        }
    }
    app.select_dcr_master_ww_details_by_dcr_master_id(render_control, 1);
    //app.select_dcr_master_ww_details_temp_institution(render_control);
    //app.delete_dcr_master_ww_details_temp_institution();
    //fun_reload_dcr_master_ww_details_temp_institution();
    //setTimeout(get_list_dcr_selected_worked_with, 1000);

    // product promote details 
    //var ddlunlistedchemistproductspromoted = $("#ddlunlistedchemistproductspromoted")
    //    .data("kendoMultiSelect").dataItems();
    //$.each(ddlunlistedchemistproductspromoted, function (i, item) {
    //    var pp_id = ddlunlistedchemistproductspromoted[i].ProductGroup_ID;
    //    var pp_name = ddlunlistedchemistproductspromoted[i].ProductGroup_Name;
    //    app.addto_dcr_unlisted_chemist_pp_details(hdndcr_unlisted_chemist_master_id, pp_id, pp_name);
    //});

    //Add to Brand Reminder details  
    var user = JSON.parse(localStorage.getItem("userdata"));
    var Sub_Territory_ID = user.Sub_Territory_ID;
    var grid_unlistedchemist_brandremainer = $("#grid_unlistedchemist_brandremainer")
                    .data("kendoGrid").dataItems();
    $.each(grid_unlistedchemist_brandremainer, function (i, item) {
        var gift_id = grid_unlistedchemist_brandremainer[i].promoitem_value_id;
        var gift_name = grid_unlistedchemist_brandremainer[i].collaterals;
        var quantity = grid_unlistedchemist_brandremainer[i].quantity;
        var balance_quantity = parseInt(grid_unlistedchemist_brandremainer[i].balance_quantity) -
            parseInt(grid_unlistedchemist_brandremainer[i].quantity);
        if (parseInt(quantity) >= 0) {
            app.update_promo_balance_details_by_sub_territory_id_promoitem_value_id(Sub_Territory_ID, gift_id, balance_quantity);
            app.addto_dcr_unlisted_chemist_gift_details(hdndcr_unlisted_chemist_master_id, gift_id, gift_name, quantity);
        }
    });
     
    hdndcr_unlisted_chemist_master_id = hdndcr_unlisted_chemist_master_id + 1;
    $("#hdndcr_unlisted_chemist_master_id").val(hdndcr_unlisted_chemist_master_id);
}

function fun_dcr_unlistedmsl_chemist_clearcontrols() {

    $("#txtunlistedchemistname").val('');
    //$("input[name='rbunlisteddoctorgender']").removeAttr('checked');
    $("#txtunlistedchemistcontactperson").val('');
    var ddlunlistedchemistmajortown = $("#ddlunlistedchemistmajortown").data("kendoDropDownList");
    ddlunlistedchemistmajortown.value("---Select---");
    $("#txtunlistedchemistaddress").val('');
    $("#txtunlistedchemistpincode").val('');
    $("#txtunlistedchemistphone").val('');
    $("#txtunlistedchemistmobile").val('');

    $("#txtunlistedchemistemail").val('');
    $("#txtunlistedchemistdruglincenseno").val('');
    $("#txtunlistedchemistvatno").val('');
    $("#txtunlistedchemistpobsingle").val('');
    //var ddlunlisteddoctorproductspromoted = $("#ddlunlisteddoctorproductspromoted").data("kendoMultiSelect");
    //ddlunlisteddoctorproductspromoted.value("");

    fun_dcr_unlisted_msl_doctor_promos_gift(413);
    fun_dcr_unlisted_msl_doctor_promos_sample(414);
    fun_dcr_unlisted_msl_chemist_promos_gift(413);
}
// unlisted chemist end 
function fun_db_APP_Get_Z6_DCR_UnListed_MSL_Information(Sub_Territory_ID, Employee_ID, Designation_ID, Division_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_UnListed_MSL_Information",
                type: "POST",
                dataType: "json",
                data: {
                    "Sub_Territory_ID": Sub_Territory_ID, "Employee_ID": Employee_ID,
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
        localStorage.setItem("dcr_qualifications_specialities", JSON.stringify(data[0])); // qualifications specialities 

        localStorage.setItem("dcr_marketareas_details", JSON.stringify(data[1])); // market area details

        localStorage.setItem("dcrchiefdetails", JSON.stringify(data[2])); // chief details

        localStorage.setItem("dcr_product_promot_details", JSON.stringify(data[3])); // product promote details

        //localStorage.setItem("dcrs_unlistedmsl_details_live", 1);
        fun_load_dcr_unlistedmsl_doctor_pageinit();
        fun_load_dcr_unlistedmsl_doctor_pageload();

        fun_load_dcr_unlistedmsl_chemist_pageinit()
        fun_load_dcr_unlistedmsl_chemist_pageload();


    });
}

