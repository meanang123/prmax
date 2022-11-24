
//-----------------------------------------------------------------------------
// Name:    FinancialControl.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/financial.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",	
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/FilteringSelect",
	"dijit/form/DateTextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/ComboBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/Button",
	"dijit/Dialog",
	"control/customer/payment",
	"control/customer/monthly_payment",
	"control/customer/proforma",
	"control/customer/dd_invoices",
	"control/customer/order_confirmation",
	"control/customer/upgrade_order_confirmation",
	"control/customer/manual_invoice",
	"control/customer/adjustments",
	"control/customer/credit",
	"control/customer/pre_pay_invoice",
	"control/customer/one_off_invoice",
	"control/customer/manual_credit",
	"control/customer/send_dd_conf"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,ItemFileReadStore){

 return declare("control.customer.financial",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._FinancialResponseCall = lang.hitch(this,this._FinancialResponse);
		this._update_salesanalysis_call_back = lang.hitch(this,this._update_salesanalysis_call);
		this._update_address_call_back = lang.hitch(this,this._update_address_call);
		this._paymentmethods =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=paymentmethods"});
		this._financialstatus =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=financialstatus"});
		this._daysofmonth =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=daysofmonth"});
		this._customerorderstatus =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=customerorderstatus"});
		this._seopaymenttypes =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=seopaymenttypes"});

		this._pricecodes_core =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=core"});
		this._pricecodes_adv =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=adv"});
		this._pricecodes_updatum =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=updatum"});
		this._pricecodes_int =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=int"});
		this._pricecodes_clippings =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=clippings"});

		this._LoadInvoiceCallBack = lang.hitch(this, this._LoadInvoiceCall);
		this._LoadCreditCallBack = lang.hitch(this, this._LoadCreditCall);
		this._LoadOneOffCallBack = lang.hitch(this, this._LoadOneOffCall);
		this._LoadCustomerCallBack = lang.hitch(this, this._LoadCustomerCall);
		this._ManualCreditCallBack = lang.hitch(this, this._ManualCreditCall);
		this._upgrade_load_confirmation_call_back = lang.hitch(this,this._upgrade_load_confirmation_call);
		this._send_dd_conf_call_back = lang.hitch(this,this._send_dd_conf_call);
		this._take_payment_call_back = lang.hitch(this, this._take_payment_call);
		this._manual_payment_call_back = lang.hitch(this, this._manual_payment_call);
	},
	postCreate:function()
	{
		this.paymentmethodid.set("store", this._paymentmethods);
		this.financialstatusid.set("store",this._financialstatus);
		this.pay_montly_day.set("store",this._daysofmonth);
		this.sub_start_day.set("store",this._daysofmonth);
		this.customerorderstatusid.set("store",this._customerorderstatus);
		this.seopaymenttypeid.set("store",this._seopaymenttypes);
		this.dd_start_day.set("store", this._daysofmonth);

		this.pricecodeid.set("store",this._pricecodes_core);
		this.advpricecodeid.set("store",this._pricecodes_adv);
		this.updatumpricecodeid.set("store",this._pricecodes_updatum);
		this.intpricecodeid.set("store",this._pricecodes_int);
		this.clippingspricecodeid.set("store",this._pricecodes_clippings);

		this.inherited(arguments);
	},
	load:function( data )
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
	_take_payment:function()
	{
		var tmp = this.paymentmethodid.get("value");

		if ( tmp == 1  || tmp == null)
		{
			request.post("/customer/get_internal",
				utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
				then(this._take_payment_call_back);			
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
	_manual_payment:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
			then(this._manual_payment_call_back);		
	},
	_adjustment:function()
	{
		this.adjustctrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this.adjustdialog ) ;

			this.adjustdialog.show();
	},
	_LoadOneOffCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.onceoffinvoicectrl.setCustomer ( response.data.cust, this.onceoffinvoicedialog ) ;
			this.onceoffinvoicedialog.show();
		}
	},
	_one_off_invoice:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data: {'icustomerid':this._data.cust.customerid}})).
			then(this._LoadOneOffCallBack);			
	},
	_dd_received_confirm:function()
	{
		if ( this.dd_ref.get("value").length>0)
		{
			request.post("/customer/get_internal",
				utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
				then(this._send_dd_conf_call_back);			
		}
		else
		{
			alert("No DD Ref");
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
	_send_confirmation:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
			then(this._LoadCustomerCallBack);						
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
	_send_update_confirmation:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
			then(this._upgrade_load_confirmation_call_back);			
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
	_credit_note:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {icustomerid:this._data.cust.customerid}})).
			then(this._LoadCreditCallBack);			
	},
	_LoadCreditCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.creditctrl.setCustomer ( response.data.cust, this.creditdialog ) ;
		}
	},
	_ManualCreditCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.manualcreditctrl.setCustomer ( response.data.cust, this.manualcreditdialog ) ;
			this.manualcreditdialog.show();
		}
	},	
	_manual_credit:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {icustomerid:this._data.cust.customerid}})).
			then(this._ManualCreditCallBack);				
	},
	_manual_invoice:function()
	{
		this.manualinvoicectrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this.manualinvoicedialog ) ;
		this.manualinvoicedialog.show();
	},	
	_invoice:function()
	{
		request.post('/customer/get_internal',
			utilities2.make_params({ data : {icustomerid:this._data.cust.customerid}})).
			then(this._LoadInvoiceCallBack);			
			
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
	_send_proforma:function()
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
	_UpdateFinancial:function()
	{
		if ( utilities2.form_validator ( this.financialForm ) == false )
		{
			this.saveFinancialNode.cancel();
			return;
		}

		var content = this.financialForm.get("value");
		content["icustomerid"] = this._data.cust.customerid ;
		content["renewal_date"] = utilities2.to_json_date ( this.renewal_date.get("value") );
		content["renewal_date_features"] = utilities2.to_json_date ( this.renewal_date_features.get("value") );

		request.post("/customer/update_customer_financial",
			utilities2.make_params({ data : content})).
			then(this._FinancialResponseCall);				
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
	Show_Hide_Fields:function( customer )
	{
		if (customer.updatum)
		{
			domclass.remove(this.monitoring_1, "prmaxhidden");
		}
		else
		{
			domclass.add(this.monitoring_1, "prmaxhidden");
		}
		if (customer.advancefeatures)
		{
			domclass.remove(this.adv_1, "prmaxhidden");
		}
		else
		{
			domclass.add(this.adv_1, "prmaxhidden");
		}
		if (customer.has_international_data)
		{
			domclass.remove(this.int_1, "prmaxhidden");
		}
		else
		{
			domclass.add(this.int_1, "prmaxhidden");
		}
	},
	_update_sales_analysis:function()
	{
		if ( utilities2.form_validator ( this.salesform ) == false )
		{
			this.savesalesanalysis.cancel();
			return;
		}

		var content = this.salesform.get("value");
		content["icustomerid"] = this._data.cust.customerid ;

		request.post("/customer/update_customer_salesanalysis",
			utilities2.make_params({ data : content})).
			then(this._update_salesanalysis_call_back);				
	},
	_update_salesanalysis_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Customer Sales Analysis Updated");
		}
		else
		{
			if ( response.message )
			{
				alert(response.message );
			}
			else
			{
				alert("Problem Updating Sales Analysis Details");
			}
		}
		this.savesalesanalysis.cancel();
	},
	_update_address:function()
	{

		if ( utilities2.form_validator ( this.addressform ) == false )
		{
			this.saveaddress.cancel();
			return;
		}

		var content = this.addressform.get("value");
		content["icustomerid"] = this._data.cust.customerid ;

		request.post("/customer/update_customer_address",
			utilities2.make_params({ data : content})).
			then(this._update_address_call_back);				
	},
	_update_address_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Customer Address Details Updated");
		}
		else
		{
			if ( response.message )
			{
				alert(response.message );
			}
			else
			{
				alert("Problem Updating Address Details");
			}
		}
		this.saveaddress.cancel();
	}
});
});

