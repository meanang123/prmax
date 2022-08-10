require({cache:{
'url:control/customer/templates/upgrade_order_confirmation.html':"<div style=\"width:800px;height:500px;padding:0px;margin:0px\">\r\n\t<div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\"' >\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",style:\"width:150px;height:100%\"'>\r\n\t\t<input class=\"prmaxinput\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"media_upgrade\",type:\"checkbox\"' data-dojo-attach-point=\"media_upgrade\" data-dojo-attach-event=\"onClick:_change_media_view\"/><label class=\"prmaxrowtag\">Media Core</label><br/>\r\n\t\t<input class=\"prmaxinput\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"advance_upgrade\",type:\"checkbox\"' data-dojo-attach-point=\"advance_upgrade\" data-dojo-attach-event=\"onClick:_change_advance_view\"/><label class=\"prmaxrowtag\">Advance Features</label><br/>\r\n\t\t<input class=\"prmaxinput\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"monitoring_upgrade\",type:\"checkbox\"' data-dojo-attach-point=\"monitoring_upgrade\" data-dojo-attach-event=\"onClick:_change_monitoring_view\"/><label class=\"prmaxrowtag\">Monitoring</label><br/>\r\n\t\t<input class=\"prmaxinput\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"international_upgrade\",type:\"checkbox\"' data-dojo-attach-point=\"international_upgrade\" data-dojo-attach-event=\"onClick:_change_international_view\"/><label class=\"prmaxrowtag\">International</label><br/>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",\"class\":\"scrollpanel\"'>\r\n\t\t\t<form data-dojo-attach-point=\"form\"  data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse\" >\r\n\t\t\t\t<input data-dojo-attach-point=\"orderpaymentfreqid\" data-dojo-props='type:\"hidden\",name:\"orderpaymentfreqid\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t\t<tr><td colspan=\"2\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\"><div style=\"display:inline;text-align:center\" class=\"prmaxrowdisplaylarge\" data-dojo-attach-point=\"customername\">Name</div></label></td>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Payment Method</td><td><select data-dojo-props='\"class\":\"prmaxinput\",name:\"paymentmethodid\",style:\"width:15em\",autoComplete:true,readonly:\"readonly\"' data-dojo-attach-point=\"paymentmethodid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Purchase Order</td><td><input data-dojo-attach-point=\"purchase_order\" data-dojo-props='\"class\":\"prmaxinput\",name:\"purchase_order\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Email Confirmation</td><td><input data-dojo-attach-point=\"emailtocustomer\" data-dojo-type=\"dijit.form.CheckBox\" data-dojo-props='name:\"emailtocustomer\", type:\"checkbox\",\"class\":\"prmaxinput\", checked:\"checked\"' /><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",style:\"width:20em\",trim:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\"' /></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"sendinvoice_view\"><td class=\"prmaxrowtag\" align=\"right\">Send Invoice</td><td><input data-dojo-attach-point=\"sendinvoice\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='name:\"sendinvoice\", type:\"checkbox\",\"class\":\"prmaxinput\"' /></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Confirmation On Login</td><td><input data-dojo-attach-point=\"upgrade_confirmation_accepted\" data-dojo-props='\"class\":\"prmaxinput\",name:\"upgrade_confirmation_accepted\",type:\"checkbox\"' data-dojo-type=\"dijit/form/CheckBox\" checked /></td></tr>\r\n\t\t\t\t\t<tr><td valign=\"top\" align=\"right\" ><label class=\"prmaxrowtag\">Message</label></td><td><div class=\"stdframe\" ><textarea data-dojo-attach-point=\"order_confirmation_message\" data-dojo-props='name:\"order_confirmation_message\", \"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' data-dojo-type=\"dijit/form/Textarea\"></textarea></div></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Ordered By</td><td><input data-dojo-props='\"class\":\"prmaxrequired\",type:\"text\",name:\"orderedby\",trim:true,required:true' data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"orderedby\"></input></td></tr>\r\n\r\n\t\t\t\t</table>\r\n\t\t\t<div data-dojo-attach-point=\"media_core_view\" class=\"prmaxhidden\" style=\"padding-top:10px\">\r\n\t\t\t\t<hr/>\r\n\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse\" >\r\n\t\t\t\t\t<tr><td colspan=\"2\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Core Media Settings</label></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" width=\"150px\" align=\"right\" >Concurrent Licence</td><td ><input data-dojo-attach-point=\"logins\" data-dojo-type=\"dijit/form/NumberTextBox\"data-dojo-props='\"class\":\"prmaxrequired\",type:\"text\",name:\"logins\",value:\"1\",style:\"width:4em\",required:true,constraints:{min:1,max:50}'></td></tr>\r\n\t\t\t\t\t<tr><td width=\"12%\">Price Code</td><td width=\"12%\">Price ex VAT</td><td width=\"12%\">Rnwl Code</td></tr>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td><select data-dojo-props='\"class\":\"prmaxinput\",name:\"pricecodeid\",autoComplete:true,style:\"width:8em\"' data-dojo-attach-point=\"pricecodeid\"  data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-event=\"onChange:_PriceChange\" ></select></td>\r\n\t\t\t\t\t\t<td><input data-dojo-type=\"dijit.form.CurrencyTextBox\" data-dojo-attach-point=\"cost\" data-dojo-props='type:\"text\",name:\"cost\",required:true,trim:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:6em\"'></input></td>\r\n\t\t\t\t\t\t<td><select data-dojo-props='\"class\":\"prmaxinput\",name:\"pricecoderenewalid\",autoComplete:true,style:\"width:8em\"' data-dojo-attach-point=\"pricecoderenewalid\"  data-dojo-type=\"dijit/form/FilteringSelect\" ></select></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-point=\"advance_view\" class=\"prmaxhidden\">\r\n\t\t\t\t<hr/>\r\n\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse\" >\r\n\t\t\t\t\t<tr><td colspan=\"4\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Advance Features Settings</label></td></tr>\r\n\t\t\t\t\t<tr><td width=\"12%\">Price Code</td><td width=\"12%\">Price ex VAT</td><td width=\"12%\">Rnwl Code</td></tr>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"features_view_4\"><select data-dojo-attach-point=\"advpricecodeid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-event=\"onChange:_PriceChange\" data-dojo-props='\"class\":\"prmaxinput\",name:\"advpricecodeid\",autoComplete:true, required:false,style:\"width:8em\"'  ></select></td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"features_view_5\"><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"advcost\" data-dojo-props='type:\"text\",name:\"advcost\",trim:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:6em\"'></input></td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"features_view_6\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"advpricecoderenewalid\",autoComplete:true,required:false,style:\"width:8em\"' data-dojo-attach-point=\"advpricecoderenewalid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-point=\"international_view\" class=\"prmaxhidden\">\r\n\t\t\t\t<hr/>\r\n\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse\" >\r\n\t\t\t\t\t<tr><td colspan=\"4\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">International Settings</label></td></tr>\r\n\t\t\t\t\t<tr><td width=\"12%\">Price Code</td><td width=\"12%\">Price ex VAT</td><td width=\"12%\">Rnwl Code</td></tr>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"international_view_4\">&nbsp;</td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"international_view_5\"><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"internationalcost\" data-dojo-props='type:\"text\",name:\"internationalcost\",trim:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:6em\"'></input></td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"international_view_6\">&nbsp;</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-point=\"monitoring_view\" class=\"prmaxhidden\">\r\n\t\t\t\t<hr/>\r\n\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse\" >\r\n\t\t\t\t\t<tr><td colspan=\"2\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Monitoring Settings</label></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Monitoring Count</td><td><input data-dojo-attach-point=\"maxmonitoringusers\" data-dojo-props='\"class\":\"prmaxrequired\",type:\"text\",name:\"maxmonitoringusers\",value:\"1\",style:\"width:4em\",constraints:{min:0,max:50}' data-dojo-type=\"dijit/form/NumberTextBox\"></td></tr>\r\n\t\t\t\t\t<tr><td width=\"12%\">Start Date</td><td width=\"12%\" data-dojo-attach-point=\"view_dd_1\">Free Mths</td><td width=\"12%\" data-dojo-attach-point=\"view_dd_2\">Paid Mths</td><td width=\"12%\">Price Code</td><td width=\"12%\">Price ex VAT</td><td width=\"12%\">Rnwl Code</td></tr>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"updatum_view_1\"><input data-dojo-attach-point=\"updatum_start_date\" data-dojo-type=\"dijit/form/DateTextBox\" data-dojo-props='name:\"updatum_start_date\",type:\"text\",style:\"width:8em\"'></td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"updatum_view_2\"><input data-dojo-attach-point=\"updatum_months_free\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='type:\"text\",name:\"updatum_months_free\",value:0,constraints:{min:0,max:36},required:true,style:\"width:6em\"'></td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"updatum_view_3\"><input data-dojo-attach-point=\"updatum_months_paid\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='name:\"updatum_months_paid\",type:\"text\",value:12,constraints:{min:3,max:36},required:true,style:\"width:6em\"'></td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"updatum_view_4\"><select data-dojo-attach-event=\"onChange:_PriceChange\" data-dojo-attach-point=\"updatumpricecodeid\"  data-dojo-type=\"dijit.form.FilteringSelect\" data-dojo-props='\"class\":\"prmaxinput\",name:\"updatumpricecodeid\",autoComplete:true,required:false,style:\"width:8em\"' ></select></td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"updatum_view_5\"><input data-dojo-attach-point=\"updatumcost\" data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props='type:\"text\",name:\"updatumcost\",trim:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:6em\"'></input></td>\r\n\t\t\t\t\t\t<td  data-dojo-attach-point=\"updatum_view_6\"><select data-dojo-attach-point=\"updatumpricecoderenewalid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='\"class\":\"prmaxinput\",name:\"updatumpricecoderenewalid\",autoComplete:true,required:false,style:\"width:8em\"'></select></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:2.5em\"'>\r\n\t\t\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_Close\">Close</button>\r\n\t\t\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_Preview\">Preview</button>\r\n\t\t\t<button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-point=\"sendbtn\" data-dojo-props='busyLabel:\"Sending upgrade confirmation ...\",type:\"button\",style:\"float:right;padding-right:10px\"' data-dojo-attach-event=\"onClick:_Send\">Send Upgrade Confirmation</button>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    upgrade_order_confirmation.js
// Author:  
// Purpose:
// Created: Dec/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define("control/customer/upgrade_order_confirmation", [
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