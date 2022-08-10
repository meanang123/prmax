require({cache:{
'url:control/customer/templates/dd_return_payment.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t<input type=\"hidden\" name=\"icustomerid\" data-dojo-attach-point=\"icustomerid\" data-dojo-type=\"dijit/form/TextBox\">\r\n\t\t<table width=\"700px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\"><div class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Reject Last DD for </div><div class=\"prmaxrowdisplaylarge\" style=\"display:inline\" data-dojo-attach-point=\"customername\"></div></td>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\">Reason Code</td><td><select data-dojo-props='\"class\":\"prmaxinput\",name=\"paymentreturnreasonid\",style:\"width:10em\",autoComplete:\"true\"' data-dojo-attach-point=\"paymentreturnreasonid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" valign=\"top\">Reason</td><td><div class=\"dialogprofileframe\" ><textarea data-dojo-attach-point=\"reason\" data-dojo-props='name:\"reason\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' data-dojo-type=\"dijit/form/Textarea\"></textarea></div></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" colspan=\"4\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='busyLabel:\"Please Wait\",type:\"button\"' data-dojo-attach-event=\"onClick:_cancel_payment\" data-dojo-attach-point=\"okbtn\">Cancel DD Payment</button></td>\r\n\t\t</table>\r\n\t</form>\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    dd_return_payment.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/dd_return_payment", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/dd_return_payment.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/Button",
	"dijit/form/Textarea",
	"dijit/form/TextBox",
	"dojox/form/BusyButton",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/dd_return_payment",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._failed_call_back = lang.hitch(this, this._failed_call);
		this.paymentreturnreasons = new ItemFileReadStore (
				{url:'/common/lookups?searchtype=paymentreturnreasons',
				onError:utilities2.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true
				});

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.paymentreturnreasonid.store = this.paymentreturnreasons;
		this.paymentreturnreasonid.set("value",1);

		this.inherited(arguments);
	},
	_clear:function()
	{
		this.icustomerid.set("value",null);
		this.reason.set("value","");
		this.okbtn.cancel();

	},
	_failed_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("DD cancelled");
			this._clear();
			this._dialog.hide();
		}
		else
		{
			alert("Problem Failing Last DD");
		}
		this.okbtn.cancel();
	},
	_cancel_payment:function()
	{
		if ( confirm("Fail Last DD Payment"))
		{
			var content = this.form.get("value");

			request.post("/payment/payment_dd_failed",
				utilities2.make_params({ data : content})).
				then(this._failed_call_back);				
		}
		else
		{
			this.okbtn.cancel();
		}
	},
	setCustomer:function( customerid , customername , email , dialog)
	{
		this.okbtn.cancel();
		this.icustomerid.set("value", customerid ) ;
		this._email = email;

		domattr.set( this.customername , "innerHTML" , customername ) ;
		this._dialog = dialog;
	}
});
});