require({cache:{
'url:control/customer/templates/one_off_invoice.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\"  data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"icustomerid\"' data-dojo-attach-point=\"icustomerid\" data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Enter Invoice</label><div style=\"display:inline\" class=\"prmaxrowdisplaylarge\" data-dojo-attach-point=\"customername\">Name</div></td></tr>\r\n\t\t\t<tr><td width=\"28%\" class=\"prmaxrowtag\" align=\"right\" width=\"120px\">Invoice Date</td><td><input data-dojo-attach-point=\"invoice_date\" data-dojo-type=\"ttl/DateTextBox2\" data-dojo-props='type:\"text\",style:\"width:8em\",required:true' ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" valign=\"top\" align=\"right\" >Message</td><td><div class=\"stdframe\" ><textarea data-dojo-attach-point=\"message\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"'></textarea></div></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Purchase Order</td><td><input data-dojo-attach-point=\"purchase_order\" data-dojo-props='\"class\":\"prmaxinput\",name:\"purchase_order\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Gross Amount</td><td><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props='type:\"text\",name:\"amount\",required:true,trim:true,constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:8em\" ' data-dojo-attach-point=\"amount\" data-dojo-attach-event=\"onBlur:_Amounts\"></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Vat</td><td><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props='type:\"text\",name:\"vat\",required:true,trim:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:8em\"' data-dojo-attach-point=\"vat\" ></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Email Address</td><td><input data-dojo-attach-point=\"email\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",style:\"width:100%\",trim:true,required:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:\"40\",maxlength:\"70\"' data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-point=\"btn\" data-dojo-props='busyLabel:\"Sending ... \",type:\"button\"' data-dojo-attach-event=\"onClick:_Send\">Send Invoice</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    one_off_invoice.js
// Author:  
// Purpose:
// Created: Dec 2016
//
// To do:
//
//--------------------------------------------------------------g---------------

define("control/customer/one_off_invoice", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/one_off_invoice.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"ttl/DateTextBox2",
	"dijit/form/Textarea",
	"dijit/form/CurrencyTextBox",
	"dojox/form/BusyButton",
	"dijit/form/ValidationTextBox",
	"dojo/io/iframe",
	"dojox/form/FileInput",
	"dojo/number"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control.customer.one_off_invoice",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._SendInvoiceCallBack = lang.hitch ( this , this._SendInvoiceCall );
	},
	_SendInvoiceCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Invoice Added");
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem Adding Invoice");
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
		content["invoice_date"] = utilities2.to_json_date ( this.invoice_date.get("value"));

		request.post('/payment/invoice_one_off_send',
			utilities2.make_params({data: content})).
			then(this._SendInvoiceCallBack);
	},
	setCustomer:function( cust , dialog )
	{
		this.icustomerid.set("value",cust.customerid);
		this.invoice_date.set("value",new Date());
		this.amount.set("value",0.01);
		this.vat.set("value",0.0);

		domattr.set ( this.customername , "innerHTML" , cust.customername ) ;
		this._dialog = dialog;
		this.btn.cancel();
	},
	_Amounts:function()
	{
		var amount = this.amount.get("value");

		var vat = amount - (amount / ( 1.00 + (20.00/ 100.00 )));

		this.vat.set("value",dojo.number.format (vat, {places:2}))
	}
});
});