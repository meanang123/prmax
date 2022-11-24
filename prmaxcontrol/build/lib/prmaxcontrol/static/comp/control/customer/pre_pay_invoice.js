//-----------------------------------------------------------------------------
// Name:    pre_pay_invoice.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/pre_pay_invoice.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"ttl/DateTextBox2",
	"dijit/form/Textarea",
	"dijit/form/NumberTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/CheckBox",
	"dijit/form/DateTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"dojox/validate/regexp"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/pre_pay_invoice",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._SendInvoiceCallBack = lang.hitch ( this , this._SendInvoiceCall );
		this._advancefeatures = false;
		this._updatum = false;
	},
	_SendInvoiceCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Invoice Sent");
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem Sending Invoice");
		}
		this.btn.cancel();
	},
	_Send:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		var content = this.form.get("value");

		content["licence_start_date"] = utilities2.to_json_date ( this.licence_start_date.get("value"));
		content["advance_licence_start"] = utilities2.to_json_date ( this.advance_licence_start.get("value"));
		content["invoice_date"] = utilities2.to_json_date ( this.invoice_date.get("value"));
		content["updatum_start_date"] = utilities2.to_json_date ( this.updatum_start_date.get("value"));

		request.post("/payment/invoice_send",
			utilities2.make_params({ data : content})).
			then(this._SendInvoiceCallBack);			

	},
	setCustomer:function( cust , dialog )
	{
		this._advancefeatures = cust.advancefeatures;
		this._updatum = cust.updatum;

		this.paymentfreqid.set("value", 1);
		this.isdd.set("value", false);

		domattr.set( this.customername , "innerHTML" , cust.customername ) ;

		this.email.set("value",cust.invoiceemail? cust.invoiceemail:cust.email)
		this.licence_start_date.set("value", utilities2.from_object_date ( cust.licence_start_date_d));
		this.purchase_order.set("value",cust.purchase_order);
		this._ShowHideAdvance ( this._advancefeatures );
		this._ShowHideUpdatum ( this._updatum);
		this.logins.set("value", cust.logins);

		this.licence_start_date.set("value" , utilities2.from_object_date ( cust.licence_start_date_d ));
		this.advance_licence_start.set("value", utilities2.from_object_date ( cust.advance_licence_start_d ));
		this.updatum_start_date.set("value", utilities2.from_object_date ( cust.updatum_start_date_d ));

		this.months_free.set("value", cust.months_free);
		this.months_paid.set("value", cust.months_paid);
		this.adv_months_free.set("value", cust.adv_months_free);
		this.adv_months_paid.set("value", cust.adv_months_paid);
		this.updatum_months_free.set("value", cust.updatum_months_free);
		this.updatum_months_paid.set("value", cust.updatum_months_paid);

		this._dialog = dialog;
		this.message.set("value","");
		this.icustomerid.set("value",cust.customerid);
		this.invoice_date.set("value", new Date());
		this._ChangePayment();
		this.btn.cancel();
		this.advcost.set("value","0.00");
		this.cost.set("value","0.00");
		this.updatumcost.set("value", "0.00");
	},
	_ChangePayment:function()
	{
		this._Show_Hide_DD ( this._advancefeatures, this._updatum, this.isdd.get("checked"));
	},
	_Show_Hide_DD:function( advancefeatures, updatum, isdd)
	{
		if (isdd)
		{
			domclass.add(this.view_dd_1,"prmaxhidden");
			domclass.add(this.view_dd_2,"prmaxhidden");
			domclass.add(this.view_dd_3,"prmaxhidden");
			domclass.add(this.view_dd_4,"prmaxhidden");
			domclass.add(this.features_view_2,"prmaxhidden");
			domclass.add(this.features_view_3,"prmaxhidden");
			domclass.add(this.updatum_view_2,"prmaxhidden");
			domclass.add(this.updatum_view_3,"prmaxhidden");
		}
		else
		{
			domclass.remove(this.view_dd_1,"prmaxhidden");
			domclass.remove(this.view_dd_2,"prmaxhidden");
			domclass.remove(this.view_dd_3,"prmaxhidden");
			domclass.remove(this.view_dd_4,"prmaxhidden");
			if ( advancefeatures)
			{
				domclass.remove(this.features_view_2,"prmaxhidden");
				domclass.remove(this.features_view_3,"prmaxhidden");
			}
			else
			{
				domclass.add(this.features_view_2,"prmaxhidden");
				domclass.add(this.features_view_3,"prmaxhidden");
			}
			if ( updatum )
			{
				domclass.remove(this.updatum_view_2,"prmaxhidden");
				domclass.remove(this.updatum_view_3,"prmaxhidden");
			}
			else
			{
				domclass.add(this.updatum_view_2,"prmaxhidden");
				domclass.add(this.updatum_view_3,"prmaxhidden");
			}
		}
	},
	_ShowHideAdvance:function ( status )
	{
		if ( status )
		{
			domclass.remove(this.features_view,"prmaxhidden");
			domclass.remove(this.features_view_1,"prmaxhidden");
			domclass.remove(this.features_view_5,"prmaxhidden");
			if ( this.isdd.get("checked") == false )
			{
				domclass.remove(this.features_view_2,"prmaxhidden");
				domclass.remove(this.features_view_3,"prmaxhidden");
			}
		}
		else
		{
			domclass.add(this.features_view,"prmaxhidden");
			domclass.add(this.features_view_1,"prmaxhidden");
			domclass.add(this.features_view_2,"prmaxhidden");
			domclass.add(this.features_view_3,"prmaxhidden");
			domclass.add(this.features_view_5,"prmaxhidden");
		}
	},
	_ShowHideUpdatum:function ( status )
	{
		if ( status )
		{
			domclass.remove(this.updatum_view,"prmaxhidden");
			domclass.remove(this.updatum_view_1,"prmaxhidden");
			domclass.remove(this.updatum_view_5,"prmaxhidden");
			if ( this.isdd.get("checked") == false )
			{
				domclass.remove(this.updatum_view_2,"prmaxhidden");
				domclass.remove(this.updatum_view_3,"prmaxhidden");
			}
		}
		else
		{
			domclass.add(this.updatum_view,"prmaxhidden");
			domclass.add(this.updatum_view_1,"prmaxhidden");
			domclass.add(this.updatum_view_2,"prmaxhidden");
			domclass.add(this.updatum_view_3,"prmaxhidden");
			domclass.add(this.updatum_view_5,"prmaxhidden");
		}
	}
});
});