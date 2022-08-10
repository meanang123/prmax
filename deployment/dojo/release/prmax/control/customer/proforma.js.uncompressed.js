require({cache:{
'url:control/customer/templates/proforma.html':"<div>\r\n<form data-dojo-attach-point=\"form\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n<table width=\"500px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t<tr><td colspan=\"2\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Take Payment for <div data-dojo-props='style:\"display:inline\",\"class\":\"prmaxrowdisplaylarge\"' data-dojo-attach-point=\"customername\">Name</div></td>\r\n\t<tr><td width=\"200px\" ><label class=\"prmaxrowlabel\">Text</label></td>\r\n\t<td><input data-dojo-props='type:\"text\",name:\"proformatext\",required:true,trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"proformatext\"></td></tr>\r\n\t<tr><td><label class=\"prmaxrowlabel\">Value (Excluding Vat)</label></td>\r\n\t\t<td><input data-dojo-props='type:\"text\",name:\"value\",required:true,trim:true' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"payment\"></input></td>\r\n\t</tr>\r\n\t<tr><td class=\"prmaxrowlabel\">Email Address</td>\r\n\t\t<td><input data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",style:\"width:100%\",trim:true,required:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:\"40\",maxlength:\"70\"' data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" /></td>\r\n\t</tr>\r\n\t<tr><td class=\"prmaxrowlabel\" colspan=\"2\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_send_proforma\">Send Proforma</button></td>\r\n</table></form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    proforma.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/proforma", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/proforma.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control/customer/proforma",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._send_proforma_call_back = lang.hitch ( this , this._send_proforma_call );
	},
	_send_proforma_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Proforma Sent ");
			this._dialog.hide();
		}
		else
		{
			alert("Problem Sending Proforma");
		}
	},
	_send_proforma:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;

		request.post("/orderconfirmation/proforma_send",
			utilities2.make_params({ data : content})).
			then(this._send_proforma_call_back);				
	},
	setCustomer:function( customerid , customername , email , dialog)
	{
		this._customerid = customerid;
		this._customername = customername;

		domattr.set( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
	}
});
});

