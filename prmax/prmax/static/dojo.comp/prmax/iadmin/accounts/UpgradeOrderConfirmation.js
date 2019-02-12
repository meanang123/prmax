//-----------------------------------------------------------------------------
// Name:    UpgradeOrderConfirmation.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/04/2012
//
// To do:
//
//-----------------------------------------------------------------------------


dojo.provide("prmax.iadmin.accounts.UpgradeOrderConfirmation");
dojo.require("ttl.BaseWidget");
dojo.require("dojo.number");

dojo.declare("prmax.iadmin.accounts.UpgradeOrderConfirmation",
	[ ttl.BaseWidget ],
	{
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/UpgradeOrderConfirmation.html"),

	constructor: function()
	{
		this._SendConfirmationCallBack = dojo.hitch ( this , this._SendConfirmationCall );
		this._pricecodes_core =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=core"});
		this._pricecodes_adv =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=adv"});
		this._pricecodes_updatum =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=updatum"});
		this._paymentmethods =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=paymentmethods"});
		this._send_conifirmation_call_back = dojo.hitch ( this, this._send_conifirmation_call );
		this._preview_call_back = dojo.hitch(this, this._preview_call);
		this._get_prices_call_back = dojo.hitch ( this, this._get_prices_call ) ;

	},
	postCreate:function()
	{
		this.paymentmethodid.store = this._paymentmethods;
		this.pricecodeid.set("store",this._pricecodes_core);
		this.pricecoderenewalid.set("store",this._pricecodes_core);
		this.advpricecodeid.set("store",this._pricecodes_adv);
		this.advpricecoderenewalid.set("store",this._pricecodes_adv);
		this.updatumpricecoderenewalid.set("store", this._pricecodes_updatum);
		this.updatumpricecodeid.set("store", this._pricecodes_updatum);

		this.pricecodeid.set("value",1);
		this.pricecoderenewalid.set("value",1);
		this.advpricecodeid.set("value",2);
		this.advpricecoderenewalid.set("value",2);
		this.updatumpricecoderenewalid.set("value",3);
		this.updatumpricecodeid.set("value",3);


		this.inherited(arguments);
	},
	resize:function()
	{
	this.frame.resize(arguments[0]);
	},
	_change_media_view:function()
	{
		if (this.media_upgrade.get("checked"))
			dojo.removeClass(this.media_core_view,"prmaxhidden");
		else
			dojo.addClass(this.media_core_view,"prmaxhidden");
	},
	_change_advance_view:function()
	{
		if (this.advance_upgrade.get("checked"))
			dojo.removeClass(this.advance_view,"prmaxhidden");
		else
			dojo.addClass(this.advance_view,"prmaxhidden");
	},
	_change_monitoring_view:function()
	{
		if (this.monitoring_upgrade.get("checked"))
			dojo.removeClass(this.monitoring_view,"prmaxhidden");
		else
			dojo.addClass(this.monitoring_view,"prmaxhidden");
	},
	_send_conifirmation_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Upgrade Confirmation Sent");
			this.sendbtn.cancel();
			this._dialog.hide();
			dojo.publish(PRCOMMON.Events.Financial_ReLoad, []);
		}
		else
		{
			alert("Problem Sending Upgrade Confirmation");
		}
	},
	_Validate:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.sendbtn.cancel();
			return null;
		}
		if (this.media_upgrade.get("value") == false &&
				this.advance_upgrade.get("value") == false &&
				this.monitoring_upgrade.get("value") == false &&
				this.international_upgrade.get("value") == false )
		{
			alert("No Upgrades Selected ");
			return null;
		}

		var content = this.form.get("value");
		content["updatum_start_date"] = ttl.utilities.toJsonDate(this.updatum_start_date.get("value"));
		content["icustomerid"] = this._customerid;
		content["media_upgrade"] = this.media_upgrade.get("value");
		content["advance_upgrade"] = this.advance_upgrade.get("value");
		content["monitoring_upgrade"] = this.monitoring_upgrade.get("value");

		return content;
	},

	_Send:function()
	{
		var content = this._Validate();

		if ( content == null ) return ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._send_conifirmation_call_back,
			url:'/iadmin/upgrade_confirmation',
			content:content}));
	},
	set_customer:function( customerid , dialog , cust )
	{
		this._clear();
		this._customerid = customerid;
		this._dialog = dialog;

		this.paymentmethodid.set("value",cust.paymentmethodid);
		this.orderpaymentfreqid.set("value",cust.orderpaymentfreqid);
		this.email.set("value",cust.email);

		// show/hide fields
		this._show_hide_dd(cust.paymentmethodid);

		// load the start dates if possible into the system
		var tdate = new Date();
		this.updatum_start_date.set("value", (cust.updatum_start_date_d)?ttl.utilities.fromObjectDate(cust.updatum_start_date_d):tdate);

		this.cost.set("value",ttl.utilities.Display_Int_Money(cust.order_confirmation_media_cost));
		this.advcost.set("value",ttl.utilities.Display_Int_Money(cust.order_confirmation_adv_cost));
		this.updatumcost.set("value",ttl.utilities.Display_Int_Money(cust.order_confirmation_updatum_cost));
		this.internationalcost.set("value",ttl.utilities.Display_Int_Money(cust.order_confirmation_international_cost));

	},
	_clear:function()
	{
		this.media_upgrade.set("checked", false);
		this.advance_upgrade.set("checked", false);
		this.monitoring_upgrade.set("checked", false);
		this.purchase_order.set("value", "");
		this.emailtocustomer.set("checked",true);
		this.email.set("value","");
		this.upgrade_confirmation_accepted.set("checked",false);
		this.order_confirmation_message.set("value","");
		dojo.addClass(this.media_core_view,"prmaxhidden");
		dojo.addClass(this.advance_view,"prmaxhidden");
		dojo.addClass(this.monitoring_view,"prmaxhidden");
		dojo.addClass(this.international_view,"prmaxhidden");
		this.sendbtn.cancel();
	},
	_Preview:function()
	{
		var content = this._Validate();

		if ( content == null ) return ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._preview_call_back,
			url:'/iadmin/upgrade_confirmation_preview',
			content:content}));

	},
	_preview_call:function( response)
	{
		if (response.success == "OK")
		{
			var head = "\t\t<meta http-equiv='Content-Type' content='text/html; charset='UTF-8'>\n";
			var content = "<html>\n\t<head>\n" + head + "\t</head>\n\t<body><div style='width:640px;height:100%;overflow:auto;overflow-x:hidden;padding-right:15px'>\n" + response.html_preview + "\n\t</div></body>\n</html>";
			var win = window.open("javascript: ''", "_blank", "status=0,menubar=0,location=0,toolbar=0,",true);
			win.document.open();
			win.document.write(content);
			win.document.close();
		}
		else
		{
			alert("problem doing preview")
		}
	},
	_show_hide_dd:function( paymentmethodid )
	{
		switch ( paymentmethodid )
		{
			case 2:
			case 3:
				for (x = 1 ; x<3 ; x++)
					dojo.addClass(this["view_dd_"+x],"prmaxhidden");
				dojo.addClass(this.updatum_view_2,"prmaxhidden");
				dojo.addClass(this.updatum_view_3,"prmaxhidden");
				this.sendinvoice.set("checked",false);
				dojo.addClass(this.sendinvoice_view,"prmaxhidden");
				break;
			default:
				for (x = 1 ; x<3 ; x++)
					dojo.removeClass(this["view_dd_"+x],"prmaxhidden");
				dojo.removeClass(this.updatum_view_2,"prmaxhidden");
				dojo.removeClass(this.updatum_view_3,"prmaxhidden");
				this.sendinvoice.set("checked",true);
				dojo.removeClass(this.sendinvoice_view,"prmaxhidden");
				break;
		}
	},
	_Close:function()
	{
		this._dialog.hide();
		this._clear();
	},
	_PriceChange:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._get_prices_call_back,
			url:'/iadmin/prices_get',
			content:this.form.get("value")}));
	},
	_get_prices_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			if (this.media_upgrade.get("checked"))
				this.cost.set("value" , dojo.number.format (response.cost.media/100.00, {places:2}));
			if (this.advance_upgrade.get("checked"))
				this.advcost.set("value" , dojo.number.format (response.cost.advance/100.00, {places:2}));
			if (this.monitoring_upgrade.get("checked"))
				this.updatumcost.set("value" , dojo.number.format (response.cost.updatum/100.00, {places:2}));
		}
	},
	_change_international_view:function()
	{
		if (this.international_upgrade.get("checked"))
			dojo.removeClass(this.international_view,"prmaxhidden");
		else
			dojo.addClass(this.international_view,"prmaxhidden");

	}
});
