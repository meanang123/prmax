require({cache:{
'url:control/customer/templates/send_dd_conf.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\"><div data-dojo-props='\"class\":\"prmaxrowdisplaylarge\",style:\"text-align:center;display:inline\"'>Send DD Conformation For</div><div data-dojo-props='\"class\":\"prmaxrowdisplaylarge\",style:\"display:inline\"' data-dojo-attach-point=\"customername\"></div></td>\r\n\t\t\t<tr><td colspan=\"2\"><td><br/></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Email Address</td><td><input class=\"prmaxinput\" data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"email\",type:\"text\",style:\"width:100%\",trim:\"true\",required:\"true\",regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:\"40\",maxlength:\"70\"'/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-point=\"btn\" data-dojo-props='busylabel:\"Sending ...\",type:\"button\"' data-dojo-attach-event=\"onClick:_send_dd_conf\">Send DD Confirmation</button></td>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    send_dd_conf.js
// Author:  
// Purpose:
// Created: Dec 2016
//
// To do:
//
//-----------------------------------------------------------------------------
define("control/customer/send_dd_conf", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/send_dd_conf.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control.customer.send_dd_conf",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._send_dd_conf_call_back = lang.hitch(this,this._send_dd_conf_call);
	},
	set_customer:function( customer, dialog)
	{
		this.btn.cancel();

		this._customerid = customer.customerid;
		this._customername = customer.customername;

		domattr.set( this.customername , "innerHTML" , customer.customername ) ;
		this.email.set("value", customer.email);
		this._dialog = dialog;

	},
	_send_dd_conf_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Confirmation DD Sent");
			this._dialog.hide();
		}
		else
		{
			alert("Problem Sending");
		}
		this.btn.cancel();
	},
	_send_dd_conf:function( )
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["icustomerid"] = this._customerid;

		request.post("/orderconfirmation/send_conf_dd", 
			utilities2.make_params({data: content})).
			then(this._send_dd_conf_call_back)
			
	}
});
});