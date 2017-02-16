//-----------------------------------------------------------------------------
// Name:    FinancialControl.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.accounts.FinancialControl");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.iadmin.accounts.Payment");
dojo.require("prmax.iadmin.accounts.MonthlyPayment");
dojo.require("prmax.iadmin.accounts.Proforma");
dojo.require("prmax.iadmin.accounts.DDPayment");
dojo.require("prmax.iadmin.accounts.DDInvoices");
dojo.require("prmax.iadmin.accounts.DDCsv");
dojo.require("prmax.iadmin.accounts.DDReturnPayment");
dojo.require("prmax.iadmin.accounts.OrderConfirmation");
dojo.require("prmax.iadmin.accounts.UpgradeOrderConfirmation");
dojo.require("prmax.iadmin.accounts.ManualInvoice");
dojo.require("prmax.iadmin.accounts.FinancialView");
dojo.require("prmax.iadmin.accounts.Adjustments");
dojo.require("prmax.iadmin.accounts.Credit");
dojo.require("prmax.iadmin.accounts.PrePayInvoice");
dojo.require("prmax.iadmin.accounts.OneOffInvoice");
dojo.require("prmax.iadmin.accounts.ManualCredit");
dojo.require("prmax.iadmin.accounts.SendDDConf");

dojo.declare("prmax.iadmin.accounts.FinancialControl",
	[ttl.BaseWidget],{
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/FinancialControl.html"),
	constructor: function()
	{
		this._FinancialResponseCall = dojo.hitch(this,this._FinancialResponse);
		this._paymentmethods =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=paymentmethods"});
		this._financialstatus =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=financialstatus"});
		this._daysofmonth =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=daysofmonth"});
		this._customerorderstatus =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=customerorderstatus"});
		this._seopaymenttypes =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=seopaymenttypes"});

		this._pricecodes_core =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=core"});
		this._pricecodes_adv =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=adv"});
		this._pricecodes_updatum =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=updatum"});
		this._pricecodes_int =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=int"});
		this._pricecodes_clippings =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=clippings"});

		this._SendOrderCallBack = dojo.hitch ( this, this._SendOrderCall);
		this._LoadInvoiceCallBack = dojo.hitch(this, this._LoadInvoiceCall);
		this._LoadCreditCallBack = dojo.hitch(this, this._LoadCreditCall);
		this._LoadOneOffCallBack = dojo.hitch(this, this._LoadOneOffCall);
		this._LoadCustomerCallBack = dojo.hitch(this, this._LoadCustomerCall);
		this._ManualCreditCallBack = dojo.hitch(this, this._ManualCreditCall);
		this._upgrade_load_confirmation_call_back = dojo.hitch(this,this._upgrade_load_confirmation_call);
		this._send_dd_conf_call_back = dojo.hitch(this,this._send_dd_conf_call);
		this._take_payment_call_back = dojo.hitch(this, this._take_payment_call);
		this._manual_payment_call_back = dojo.hitch(this, this._manual_payment_call);
	},
	postCreate:function()
	{
		this.paymentmethodid.store = this._paymentmethods;
		this.financialstatusid.store = this._financialstatus;
		this.pay_montly_day.store = this._daysofmonth;
		this.sub_start_day.store = this._daysofmonth;
		this.customerorderstatusid.store = this._customerorderstatus;
		this.seopaymenttypeid.store = this._seopaymenttypes;
		this.dd_start_day.set("store", this._daysofmonth);

		this.pricecodeid.set("store",this._pricecodes_core);
		this.advpricecodeid.set("store",this._pricecodes_adv);
		this.updatumpricecodeid.set("store",this._pricecodes_updatum);
		this.intpricecodeid.set("store",this._pricecodes_int);
		this.clippingspricecodeid.set("store",this._pricecodes_clippings);

		//dojo.xhrPost(
		//ttl.utilities.makeParams({
	//	load: dojo.hitch(this, this._load_prices_call),
	//	url:'/iadmin/get_prices_list',
	//	content:{}
	//	}));

		this.inherited(arguments);

	},
	_load_prices_call:function( response )
	{
		// load lookups and assign to direct debit

	},
	Load:function( data )
	{
		this.paymentmethodid.set("value", data.cust.paymentmethodid);
		this.financialstatusid.set("value", data.cust.financialstatusid);
		this.customerorderstatusid.set("value", data.cust.customerorderstatusid);

		this.next_invoice_message.set("value", data.cust.next_invoice_message);
		this.bank_name.set("value", data.cust.bank_name);
		if ( data.cust.renewal_date_d != null )
			this.renewal_date.set("value", new Date(data.cust.renewal_date_d.year, data.cust.renewal_date_d.month-1, data.cust.renewal_date_d.day));
		else
			this.renewal_date.set("value",null);
		if ( data.cust.renewal_date_features_d != null )
			this.renewal_date_features.set("value", new Date(data.cust.renewal_date_features_d.year, data.cust.renewal_date_features_d.month-1, data.cust.renewal_date_features_d.day));
		else
			this.renewal_date_features.set("value",null);

		this.invoiceemail.set("value", data.cust.invoiceemail);
		this.bank_account_name.set("value", data.cust.bank_account_name);
		this.bank_sort_code.set("value", data.cust.bank_sort_code);
		this.bank_account_nbr.set("value", data.cust.bank_account_nbr);

		this.pay_monthly_value.set("value", dojo.number.round( data.cust.pay_monthly_value/100.0,2));
		this.dd_monitoring_value.set("value", dojo.number.round( data.cust.dd_monitoring_value/100.0,2));
		this.dd_advance_value.set("value", dojo.number.round( data.cust.dd_advance_value/100.0,2));
		this.dd_international_data_value.set("value", dojo.number.round( data.cust.dd_international_data_value/100.0,2));

		this.last_paid_date.set("value", data.cust.last_paid_date_display);
		this.dd_ref.set("value", data.cust.dd_ref);
		this.dd_collectiondate.set("value", data.cust.dd_collectiondate_display);
		this.pay_montly_day.set("value", data.cust.pay_montly_day);
		this.sub_start_day.set("value", data.cust.sub_start_day);
		this.purchase_order.set("value", data.cust.purchase_order);
		this.next_month_value.set("value", dojo.number.round( data.cust.next_month_value/100.0,2));
		this.seopaymenttypeid.set("value", data.cust.seopaymenttypeid);
		this.seonbrincredit.set("value", data.cust.seonbrincredit);
		this.dd_start_day.set("value", data.cust.dd_start_day);
		this.dd_start_month.set("value", data.cust.dd_start_month);
		this.has_bundled_invoice.set("checked", data.cust.has_bundled_invoice);

		this.pricecodeid.set("value",data.cust.pricecodeid);
		this.advpricecodeid.set("value",data.cust.advpricecodeid);
		this.updatumpricecodeid.set("value",data.cust.updatumpricecodeid);
		this.intpricecodeid.set("value",data.cust.intpricecodeid);
		this.clippingspricecodeid.set("value",data.cust.clippingspricecodeid);

		this._data = data;
		this.Show_Hide_Fields (data.cust );

	},
	_take_payment_call:function( response)
	{
		if ( response.success == "OK")
		{
			this.takepaymentctrl.setCustomer (
					response.data.cust,
					this.takepaymentdialog ) ;
			this.takepaymentdialog.show();
		}
		else
		{
			alert("Problem Loading");
		}
	},
	_TakePayment:function()
	{
		var tmp = this.paymentmethodid.get("value");

		if ( tmp == 1  || tmp == null)
		{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._take_payment_call_back,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._data.cust.customerid}
			}));
		}
		else
		{
			this.monthlypaymentctrl.setCustomer (
				this._data.cust.customerid,
				this._data.cust.customername,
				this._data.cust.email ,
				this.monthlypaymentdialog,
				this.pay_monthly_value.get("value")) ;

			this.monthlypaymentdialog.show();
		}
	},
	_SendProforma:function()
	{
		this.sendproformactrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this._data.cust.email ,
			this.sendproformadialog ) ;

		this.sendproformadialog.show();
	},

	_getEmailAddress:function()
	{
		var email = this.invoiceemail.get("value");
		if (email == "" )
			email = this._data.cust.email;

		return email;
	},
	_TakeFirstPayment:function()
	{
		this.ddpaymentctrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this._getEmailAddress() ,
			this.monthlypaymentdialog,
			0) ;
			this.ddpaymentdialog.show();
	},
	_ManualInvoice:function()
	{
		this.manualinvoicectrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this.manualinvoicedialog ) ;
		this.manualinvoicedialog.show();
	},
	_Invoice:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadInvoiceCallBack,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._data.cust.customerid}
			}));
	},
	_LoadInvoiceCall:function( response )
	{
		if (response.success == "OK")
		{
			this.invctrl.setCustomer ( response.data.cust, this.invdialog ) ;
			this.invdialog.show();
		}
		else
		{
			alert("Problem Loading Data");
		}
	},
	_manual_payment_call:function (response)
	{
		if (response.success== "OK")
		{
			this.allocpaymentctrl.setCustomer (
				response.data.cust,
				this.allocpaymentdialog);
			this.allocpaymentdialog.show();
		}
		else
		{
			alert("Problem Loading");
		}
	},
	_ManualPayment:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._manual_payment_call_back,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._data.cust.customerid}
			}));

	},
	_CreditNote:function()
	{
			dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCreditCallBack,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._data.cust.customerid}
			}));
	},
	_LoadCreditCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.creditctrl.setCustomer ( response.data.cust, this.creditdialog ) ;
			this.creditdialog.show();
		}
	},
	_Adjustment:function()
	{
		this.adjustctrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this.adjustdialog ) ;

			this.adjustdialog.show();
	},
		_UpdateFinancial:function()
	{
		if ( ttl.utilities.formValidator ( this.financialForm ) == false )
		{
			this.saveFinancialNode.cancel();
			return;
		}

		var content = this.financialForm.get("value");
		content["icustomerid"] = this._data.cust.customerid ;
		content["renewal_date"] = ttl.utilities.toJsonDate ( this.renewal_date.get("value") );
		content["renewal_date_features"] = ttl.utilities.toJsonDate ( this.renewal_date_features.get("value") );

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._FinancialResponseCall,
			url:'/iadmin/update_customer_financial',
			content:content
		}));
	},
	_FinancialResponse:function( response )
	{
		if (response.success=="OK")
		{
			alert("Customer Financial Details Updated");
		}
		else
		{
			if ( response.message )
			{
				alert(response.message );
			}
			else
			{
				alert("Problem Updating Financial Details");
			}
		}

		this.saveFinancialNode.cancel();
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},
	_SendConfirmation:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCustomerCallBack,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._data.cust.customerid}
			}));
	},
	_LoadCustomerCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.sendorderconfirmationctrl.setCustomer (
				response.data.cust.customerid,
				this.sendorderconfirmationdialog,
				response.data.cust) ;

			this.sendorderconfirmationdialog.show();
		}
		else
		{
			alert("Problem Loading Customer Details");
		}
	},
	_SendUpdateConfirmation:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._upgrade_load_confirmation_call_back,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._data.cust.customerid}
			}));
	},
	_upgrade_load_confirmation_call:function( response )
	{
		if ( response.success == "OK" )
		{
			this.upgradeconfirmationctrl.set_customer (
				response.data.cust.customerid,
				this.upgradeconfirmationdialog,
				response.data.cust) ;

			this.upgradeconfirmationdialog.show();
		}
		else
		{
			alert("Problem Loading Customer Details");
		}
	},
	_LoadOneOffCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.onceoffinvoicectrl.setCustomer ( response.data.cust, this.onceoffinvoicedialog ) ;
			this.onceoffinvoicedialog.show();
		}
	},
	_OneOffInvoice:function()
	{
			dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadOneOffCallBack,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._data.cust.customerid}
			}));
	},
	_ManualCreditCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.manualcreditctrl.setCustomer ( response.data.cust, this.manualcreditdialog ) ;
			this.manualcreditdialog.show();
		}
	},
	_ManualCredit:function()
	{
			dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._ManualCreditCallBack,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._data.cust.customerid}
			}));
	},
	Show_Hide_Fields:function( customer )
	{
		if (customer.updatum)
		{
			dojo.removeClass(this.monitoring_1, "prmaxhidden");
		}
		else
		{
			dojo.addClass(this.monitoring_1, "prmaxhidden");
		}
		if (customer.advancefeatures)
		{
			dojo.removeClass(this.adv_1, "prmaxhidden");
		}
		else
		{
			dojo.addClass(this.adv_1, "prmaxhidden");
		}
		if (customer.has_international_data)
		{
			dojo.removeClass(this.int_1, "prmaxhidden");
		}
		else
		{
			dojo.addClass(this.int_1, "prmaxhidden");
		}
	},
	_send_dd_conf_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.dd_conf_ctrl.set_customer (
					response.data.cust,
					this.dd_conf_dialog ) ;
			this.dd_conf_dialog.show();
		}
		else
		{
			alert("Problem Loading");
		}
	},
	_dd_received_confirm:function()
	{
		if ( this.dd_ref.get("value").length>0)
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._send_dd_conf_call_back,
				url:'/iadmin/get_internal',
				content:{'icustomerid':this._data.cust.customerid}
				}));
		}
		else
		{
			alert("No DD Ref");
		}
	},
	_update_sales_analysis:function()
	{

	}
});
