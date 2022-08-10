require({cache:{
'url:control/customer/templates/pre_pay_invoice.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\"  data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t<input data-dojo-attach-point=\"icustomerid\" data-dojo-props='type:\"hidden\",name:\"icustomerid\"' data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\">\r\n\t\t\t\t<label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Enter Invoice</label>\r\n\t\t\t\t<div style=\"display:inline\" class=\"prmaxrowdisplaylarge\" data-dojo-attach-point=\"customername\">Name</div>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td width=\"28%\" class=\"prmaxrowtag\" align=\"right\" width=\"120px\">Invoice Date</td><td><input data-dojo-attach-point=\"invoice_date\" data-dojo-type=\"ttl/DateTextBox2\" data-dojo-props='type:\"text\",style:\"width:8em\",required:true'></td></tr>\r\n\t\t\t<tr><td valign=\"top\" align=\"right\" ><label class=\"prmaxrowtag\">Message</label></td><td><div class=\"stdframe\" ><textarea data-dojo-attach-point=\"message\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' ></textarea></div></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"150px\" align=\"right\" >Concurrent Licence</td><td ><input data-dojo-attach-point=\"logins\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='type:\"text\",name:\"logins\",value:\"1\",style:\"width:8em\",required:true,constraints:{min:1,max:50}' ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Payment Freq</td><td><select data-dojo-props='\"class\":\"prmaxinput\",autoComplete:true,name:\"paymentfreqid\",style:\"width:15em\"' data-dojo-attach-point=\"paymentfreqid\" data-dojo-type=\"dijit/form/FilteringSelect\"><options><option value=\"1\">Fixed Term</option><option value=\"2\">Monthly</option></options></select></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Is Direct Debit</td><td><input data-dojo-attach-point=\"isdd\" data-dojo-props='\"class\":\"prmaxinput\",name:\"isdd\",type:\"checkbox\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_ChangePayment\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Purchase Order</td><td><input data-dojo-attach-point=\"purchase_order\" data-dojo-props='\"class\":\"prmaxinput\",name:\"purchase_order\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n\t\t</td></tr>\r\n\t\t<tr><td colspan=\"2\"><table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t<tr><td width=\"28%\">&nbsp;</td><td width=\"12%\">Start Date</td><td width=\"12%\" data-dojo-attach-point=\"view_dd_1\">Free Mths</td><td width=\"12%\" data-dojo-attach-point=\"view_dd_2\">Paid Mths</td><td width=\"12%\">Price ex VAT</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\"  align=\"right\" >Media DB</td>\r\n\t\t\t<td><input data-dojo-type=\"dijit/form/DateTextBox\" data-dojo-attach-point=\"licence_start_date\" data-dojo-props='type:\"text\",name:\"licence_start_date\",required:true,style:\"width:8em\"'></td>\r\n\t\t\t<td data-dojo-attach-point=\"view_dd_3\"><input data-dojo-attach-point=\"months_free\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='type:\"text\",name:\"months_free\",value:\"0\",required:true,constraints:{min:0,max:6},style:\"width:6em\"'></td>\r\n\t\t\t<td data-dojo-attach-point=\"view_dd_4\"><input data-dojo-attach-point=\"months_paid\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='name:\"months_paid\",type:\"text\",value:\"12\",required:true,constraints:{min:1,max:36},style:\"width:6em\"'></td>\r\n\t\t\t<td><input data-dojo-props='type:\"text\",name:\"cost\",required:true,trim:true,constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:6em\"' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"cost\"></input></td>\r\n\t\t</tr>\r\n\t\t<tr data-dojo-attach-point=\"features_view\" class=\"prmaxhidden\" ><td class=\"prmaxrowtag\"  align=\"right\" >Features</td>\r\n\t\t\t<td data-dojo-attach-point=\"features_view_1\" class=\"prmaxhidden\"><input data-dojo-attach-point=\"advance_licence_start\" data-dojo-type=\"dijit/form/DateTextBox\" data-dojo-props='type:\"text\",name:\"advance_licence_start\",style:\"width:8em\"'></td>\r\n\t\t\t<td data-dojo-attach-point=\"features_view_2\" class=\"prmaxhidden\"><input data-dojo-attach-point=\"adv_months_free\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='name:\"adv_months_free\",type:\"text\",value:\"0\",constraints:{min:0,max:36},style:\"width:6em\"'></td>\r\n\t\t\t<td data-dojo-attach-point=\"features_view_3\" class=\"prmaxhidden\"><input data-dojo-attach-point=\"adv_months_paid\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='type:\"text\",name:\"adv_months_paid\",value:\"12\",constraints:{min:0,max:36},style:\"width:6em\"'></td>\r\n\t\t\t<td data-dojo-attach-point=\"features_view_5\" class=\"prmaxhidden\"><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"advcost\" data-dojo-props='trim:true,type:\"text\",name:\"advcost\",constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:6em\",required:true'></input></td>\r\n\t\t</tr>\r\n\t\t<tr data-dojo-attach-point=\"updatum_view\" class=\"prmaxhidden\" ><td class=\"prmaxrowtag\"  align=\"right\" >Monitoring</td>\r\n\t\t\t<td data-dojo-attach-point=\"updatum_view_1\" class=\"prmaxhidden\"><input data-dojo-attach-point=\"updatum_start_date\" data-dojo-type=\"dijit/form/DateTextBox\" data-dojo-props='type:\"text\",name:\"updatum_start_date\",style:\"width:8em\"'></td>\r\n\t\t\t<td data-dojo-attach-point=\"updatum_view_2\" class=\"prmaxhidden\"><input data-dojo-attach-point=\"updatum_months_free\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='type:\"text\",name:\"updatum_months_free\",value:\"0\",constraints:{min:0,max:36},style:\"width:6em\"'></td>\r\n\t\t\t<td data-dojo-attach-point=\"updatum_view_3\" class=\"prmaxhidden\"><input data-dojo-attach-point=\"updatum_months_paid\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='type:\"text\",name:\"updatum_months_paid\",value:\"12\",constraints:{min:1,max:36},style:\"width:6em\"'></td>\r\n\t\t\t<td data-dojo-attach-point=\"updatum_view_5\" class=\"prmaxhidden\"><input data-dojo-attach-point=\"updatumcost\" data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props='name:\"updatumcost\",type:\"text\",trim:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:6em\",required:true'></input></td>\r\n\t\t</tr>\r\n\t\t</table></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Email Address</td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"email\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",style:\"width:100%\",trim:true,required:true,regExpGen:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",size:\"40\",maxlength:\"70\"'/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" colspan=\"2\" align=\"right\">\r\n\t\t\t<button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-point=\"btn\" data-dojo-props='busyLabel:\"Sending ... \",type:\"button\"' data-dojo-attach-event=\"onClick:_Send\">Send Invoice</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    pre_pay_invoice.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/pre_pay_invoice", [
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