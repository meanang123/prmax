//-----------------------------------------------------------------------------
// Name:    PrePayInvoice.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------


dojo.provide("prmax.iadmin.accounts.PrePayInvoice");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.PrePayInvoice",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/PrePayInvoice.html"),
	constructor: function()
	{
		this._SendInvoiceCallBack = dojo.hitch ( this , this._SendInvoiceCall );
		this._advancefeatures = false;
		this._updatum = false;
	},
	_SendInvoiceCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Invoice Sent");
			dojo.publish(PRCOMMON.Events.Financial_ReLoad, []);
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
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		var content = this.form.get("value");

		content["licence_start_date"] = ttl.utilities.toJsonDate ( this.licence_start_date.get("value"));
		content["advance_licence_start"] = ttl.utilities.toJsonDate ( this.advance_licence_start.get("value"));
		content["invoice_date"] = ttl.utilities.toJsonDate ( this.invoice_date.get("value"));
		content["updatum_start_date"] = ttl.utilities.toJsonDate ( this.updatum_start_date.get("value"));

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._SendInvoiceCallBack),
			url:'/iadmin/invoice_send',
			content:content}));

	},
	setCustomer:function( cust , dialog )
	{
		this._advancefeatures = cust.advancefeatures;
		this._updatum = cust.updatum;

		this.paymentfreqid.set("value", 1);
		this.isdd.set("value", false);

		dojo.attr ( this.customername , "innerHTML" , cust.customername ) ;

		this.email.set("value",cust.invoiceemail? cust.invoiceemail:cust.email)
		this.licence_start_date.set("value", ttl.utilities.fromObjectDate ( cust.licence_start_date_d));
		this.purchase_order.set("value",cust.purchase_order);
		this._ShowHideAdvance ( this._advancefeatures );
		this._ShowHideUpdatum ( this._updatum);
		this.logins.set("value", cust.logins);

		this.licence_start_date.set("value" , ttl.utilities.fromObjectDate ( cust.licence_start_date_d ));
		this.advance_licence_start.set("value", ttl.utilities.fromObjectDate ( cust.advance_licence_start_d ));
		this.updatum_start_date.set("value", ttl.utilities.fromObjectDate ( cust.updatum_start_date_d ));

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
			dojo.addClass(this.view_dd_1,"prmaxhidden");
			dojo.addClass(this.view_dd_2,"prmaxhidden");
			dojo.addClass(this.view_dd_3,"prmaxhidden");
			dojo.addClass(this.view_dd_4,"prmaxhidden");
			dojo.addClass(this.features_view_2,"prmaxhidden");
			dojo.addClass(this.features_view_3,"prmaxhidden");
			dojo.addClass(this.updatum_view_2,"prmaxhidden");
			dojo.addClass(this.updatum_view_3,"prmaxhidden");
		}
		else
		{
			dojo.removeClass(this.view_dd_1,"prmaxhidden");
			dojo.removeClass(this.view_dd_2,"prmaxhidden");
			dojo.removeClass(this.view_dd_3,"prmaxhidden");
			dojo.removeClass(this.view_dd_4,"prmaxhidden");
			if ( advancefeatures)
			{
				dojo.removeClass(this.features_view_2,"prmaxhidden");
				dojo.removeClass(this.features_view_3,"prmaxhidden");
			}
			else
			{
				dojo.addClass(this.features_view_2,"prmaxhidden");
				dojo.addClass(this.features_view_3,"prmaxhidden");
			}
			if ( updatum )
			{
				dojo.removeClass(this.updatum_view_2,"prmaxhidden");
				dojo.removeClass(this.updatum_view_3,"prmaxhidden");
			}
			else
			{
				dojo.addClass(this.updatum_view_2,"prmaxhidden");
				dojo.addClass(this.updatum_view_3,"prmaxhidden");
			}
		}
	},
	_ShowHideAdvance:function ( status )
	{
		if ( status )
		{
			dojo.removeClass(this.features_view,"prmaxhidden");
			dojo.removeClass(this.features_view_1,"prmaxhidden");
			dojo.removeClass(this.features_view_5,"prmaxhidden");
			if ( this.isdd.get("checked") == false )
			{
				dojo.removeClass(this.features_view_2,"prmaxhidden");
				dojo.removeClass(this.features_view_3,"prmaxhidden");
			}
		}
		else
		{
			dojo.addClass(this.features_view,"prmaxhidden");
			dojo.addClass(this.features_view_1,"prmaxhidden");
			dojo.addClass(this.features_view_2,"prmaxhidden");
			dojo.addClass(this.features_view_3,"prmaxhidden");
			dojo.addClass(this.features_view_5,"prmaxhidden");
		}
	},
	_ShowHideUpdatum:function ( status )
	{
		if ( status )
		{
			dojo.removeClass(this.updatum_view,"prmaxhidden");
			dojo.removeClass(this.updatum_view_1,"prmaxhidden");
			dojo.removeClass(this.updatum_view_5,"prmaxhidden");
			if ( this.isdd.get("checked") == false )
			{
				dojo.removeClass(this.updatum_view_2,"prmaxhidden");
				dojo.removeClass(this.updatum_view_3,"prmaxhidden");
			}
		}
		else
		{
			dojo.addClass(this.updatum_view,"prmaxhidden");
			dojo.addClass(this.updatum_view_1,"prmaxhidden");
			dojo.addClass(this.updatum_view_2,"prmaxhidden");
			dojo.addClass(this.updatum_view_3,"prmaxhidden");
			dojo.addClass(this.updatum_view_5,"prmaxhidden");
		}
	}
});