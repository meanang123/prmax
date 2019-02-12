//-----------------------------------------------------------------------------
// Name:    upgrade_order_confirmation.js
// Author:  
// Purpose:
// Created: Dec/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/upgrade_order_confirmation.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileWriteStore",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/CheckBox",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/ValidationTextBox",
	"dijit/form/Textarea",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/Button",
	"dojox/form/BusyButton"

	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr, ItemFileWriteStore, ItemFileReadStore){

return declare("control.customer.upgrade_order_confirmation",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._SendConfirmationCallBack = lang.hitch ( this , this._SendConfirmationCall );
		this._pricecodes_core =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=core"});
		this._pricecodes_adv =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=adv"});
		this._pricecodes_updatum =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=updatum"});
		this._paymentmethods =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=paymentmethods"});
		this._send_conifirmation_call_back = lang.hitch ( this, this._send_conifirmation_call );
		this._preview_call_back = lang.hitch(this, this._preview_call);
		this._get_prices_call_back = lang.hitch ( this, this._get_prices_call ) ;

	},
	postCreate:function()
	{
		this.paymentmethodid.set("store", this._paymentmethods);
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
			domclass.remove(this.media_core_view,"prmaxhidden");
		else
			domclass.add(this.media_core_view,"prmaxhidden");
	},
	_change_advance_view:function()
	{
		if (this.advance_upgrade.get("checked"))
			domclass.remove(this.advance_view,"prmaxhidden");
		else
			domclass.add(this.advance_view,"prmaxhidden");
	},
	_change_monitoring_view:function()
	{
		if (this.monitoring_upgrade.get("checked"))
			domclass.remove(this.monitoring_view,"prmaxhidden");
		else
			domclass.add(this.monitoring_view,"prmaxhidden");
	},
	_send_conifirmation_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Upgrade Confirmation Sent");
			this.sendbtn.cancel();
			this._dialog.hide();
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
		}
		else
		{
			alert("Problem Sending Upgrade Confirmation");
		}
	},
	_Validate:function()
	{
		if (utilities2.form_validator( this.form ) == false )
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
		content["updatum_start_date"] = utilities2.to_json_date(this.updatum_start_date.get("value"));
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
			
		request.post("/orderconfirmation/upgrade_confirmation",
			utilities2.make_params({ data : content})).
			then(this._send_conifirmation_call_back);			
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
		this.updatum_start_date.set("value", (cust.updatum_start_date_d)?utilities2.from_object_date(cust.updatum_start_date_d):tdate);

		this.cost.set("value",utilities2.display_int_money(cust.order_confirmation_media_cost));
		this.advcost.set("value",utilities2.display_int_money(cust.order_confirmation_adv_cost));
		this.updatumcost.set("value",utilities2.display_int_money(cust.order_confirmation_updatum_cost));
		this.internationalcost.set("value",utilities2.display_int_money(cust.order_confirmation_international_cost));

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
		domclass.add(this.media_core_view,"prmaxhidden");
		domclass.add(this.advance_view,"prmaxhidden");
		domclass.add(this.monitoring_view,"prmaxhidden");
		domclass.add(this.international_view,"prmaxhidden");
		this.sendbtn.cancel();
	},
	_Preview:function()
	{
		var content = this._Validate();

		if ( content == null ) return ;

		request.post("/orderconfirmation/upgrade_confirmation_preview",
			utilities2.make_params({ data : content})).
			then(this._preview_call_back);	
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
					domclass.add(this["view_dd_"+x],"prmaxhidden");
				domclass.add(this.updatum_view_2,"prmaxhidden");
				domclass.add(this.updatum_view_3,"prmaxhidden");
				this.sendinvoice.set("checked",false);
				domclass.add(this.sendinvoice_view,"prmaxhidden");
				break;
			default:
				for (x = 1 ; x<3 ; x++)
					domclass.remove(this["view_dd_"+x],"prmaxhidden");
				domclass.remove(this.updatum_view_2,"prmaxhidden");
				domclass.remove(this.updatum_view_3,"prmaxhidden");
				this.sendinvoice.set("checked",true);
				domclass.remove(this.sendinvoice_view,"prmaxhidden");
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
		request.post("/payment/prices_get",
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._get_prices_call_back);				
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
			domclass.remove(this.international_view,"prmaxhidden");
		else
			domclass.add(this.international_view,"prmaxhidden");

	}
});
});