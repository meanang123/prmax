require({cache:{
'url:control/customer/templates/manual_invoice.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\" method=\"post\" name=\"form\" enctype=\"multipart/form-data\" onSubmit=\"return false;\">\r\n\t\t<input type=\"hidden\" data-dojo-attach-point=\"icustomerid\" name=\"icustomerid\" data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n\t\t<input type=\"hidden\" data-dojo-attach-point=\"invoice_date2\" name=\"invoice_date\" data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Manual Invoice</label><div data-dojo-props='style:\"display:inline\",\"class\":\"prmaxrowdisplaylarge\"' data-dojo-attach-point=\"customername\">Name</div></td></tr>\r\n\t\t\t<tr><td style=\"width:150px\" class=\"prmaxrowlabel\" align=\"right\">Invoice Ref</td><td><input data-dojo-props='type:\"text\",name:\"invoice_ref\",style:\"width:8em\",required:true'  data-dojo-attach-point=\"invoice_ref\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\">Invoice Date</td><td><input data-dojo-props='type:\"text\",style:\"width:8em\",required:true' data-dojo-attach-point=\"invoice_date\" data-dojo-type=\"ttl/DateTextBox2\"></td></tr>\r\n\t\t\t<tr><td align=\"right\"><label class=\"prmaxrowlabel\">Gross Amount</label></td><td><input data-dojo-props='type:\"text\",name:\"amount\",style:\"width:8em\",required:true,trim:true,constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"amount\" data-dojo-attach-event=\"onBlur:_amounts\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\"><label class=\"prmaxrowlabel\">Vat</label></td><td><input data-dojo-props='type:\"text\",name:\"vat\",style:\"width:8em\",required:true,trim:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"vat\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\"><label class=\"prmaxrowlabel\" >Unpaid Amount</label></td><td><input data-dojo-props='type:\"text\",name:\"unpaidamount\",style:\"width:8em\",required:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"unpaidamount\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowlabel\">Invoice File (pdf)</td><td><input class=\"prmaxinput\" type=\"file\" name=\"invoice_file\" size=\"50\" data-dojo-attach-point=\"invoice_file\"></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" colspan=\"2\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_send\">Enter Manual Invoice</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    manual_invoice.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/manual_invoice", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/manual_invoice.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/number",
	"dojo/io/iframe",
	"dojo/request/iframe",
	"dojox/form/FileInput",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"ttl/DateTextBox2",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button",
	"dijit/form/DateTextBox"	
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/manual_invoice",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._add_call_back = lang.hitch ( this , this._add_call );
	},
	_add_call:function( response )
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
	},
	_send:function()
	{
		if ( this.invoice_ref.isValid() == false ||
				this.invoice_date.isValid() == false ||
			this.amount.isValid() == false ||
			this.vat.isValid() == false ||
			this.unpaidamount.isValid() == false)
		{
			return false ;
		}

		var filename = domattr.get(this.invoice_file,"value").toLowerCase ();
		if ( filename.indexOf(".pdf") == -1)
		{
			alert("This must be a pdf file");
			return false ;
		}

		this.invoice_date2.set("value", this.invoice_date.get("ValueISO"));

		dojo.io.iframe.send(
		{
			url: "/payment/add_manual_invoice",
			handleAs:"json",
				load: this._add_call_back,
				form : this.form
		});
	},
	setCustomer:function( customerid , customername , dialog )
	{
		this.icustomerid.set("value",customerid);
		this.invoice_date.set("value",new Date());
		this.invoice_ref.set("value","");
		this.amount.set("value",0.0);
		this.unpaidamount.set("value",0.0);
		this.vat.set("value",0.0);
		domattr.set(this.invoice_file, "value","");

		domattr.set( this.customername , "innerHTML" , customername ) ;
		this._dialog = dialog;
	},
	_amounts:function()
	{
		var amount = this.amount.get("value");

		var vat = amount - (amount / ( 1.00 + (20.00/ 100.00 )));

		this.unpaidamount.set("value",amount);
		this.vat.set("value",dojo.number.format(vat, {places:2}))
	}
});
});