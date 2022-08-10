require({cache:{
'url:control/customer/templates/dd_payment.html':"<div>\r\n<form data-dojo-attach-point=\"form\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t<tr><td colspan=\"4\"><div data-dojo-props='\"class\":\"prmaxrowdisplaylarge\",style:\"text-align:center;display:inline\"'>Monthly Payment (Inc Vat.)</div><div data-dojo-props='\"class\":\"prmaxrowdisplaylarge\",style:\"display:inline\"' data-dojo-attach-point=\"customername\"></div></td>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\">DD Reference</td><td><input data-dojo-props='type:\"text\",name:\"dd_ref\",required:true,trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"dd_ref\"></input></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\">First Month Amount(Inc Vat.)</td><td><input data-dojo-props='type:\"text\",name:\"first_month_value\",required:true,trim:true' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"first_month_value\"></input></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\">Standard Amount (Inc Vat.)</td><td><input data-dojo-props='type:\"text\",name:\"value\",required:true,trim:true' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"payment\"></input></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Monthly Day</td><td width=\"70%\"><select data-dojo-props='style:\"width:50px\",\"class\":\"prmaxinput\",name:\"pay_montly_day\",type:\"text\"' data-dojo-attach-point=\"pay_montly_day\" data-dojo-type=\"dijit/form/ComboBox\"></select></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Sub Day of Month</td><td width=\"70%\"><select data-dojo-props='style:\"width:50px\",\"class\":\"prmaxinput\",name:\"sub_start_day\",type:\"text\"' data-dojo-attach-point=\"sub_start_day\" data-dojo-type=\"dijit/form/ComboBox\"></select></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\" valign=\"top\">Message</td><td><div class=\"dialogprofileframe\" ><textarea data-dojo-attach-point=\"message\" data-dojo-props='name:\"message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' data-dojo-type=\"dijit/form/Textarea\" ></textarea></div></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Email Address</td><td><input data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",style:\"width:100%\",trim:true,required:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:\"40\",maxlength:\"70\"' data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Collection Date</td><td><input data-dojo-props='type:\"text\",name:\"dd_collectiondate\",requiredtrue' data-dojo-attach-point=\"dd_collectiondate\" data-dojo-type=\"dijit/form/DateTextBox\" ></td>\r\n\t</tr>\r\n\t<tr><td class=\"prmaxrowlabel\" colspan=\"4\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_take_payment\">Take Payment</button></td>\r\n</table></form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    dd_payment.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/dd_payment", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/dd_payment.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button",
	"dijit/form/Textarea",
	"dijit/form/ComboBox",
	"dijit/form/DateTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/dd_payment",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._payment_taken_call_back = lang.hitch(this,this._payment_taken_call);
		this._daysofmonth =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=daysofmonth"});

	},
	postCreate:function()
	{
		this.pay_montly_day.store = this._daysofmonth;
		this.sub_start_day.store = this._daysofmonth;
		this.inherited(arguments);
	},
	setCustomer:function( customerid , customername , email , dialog, defaultvalue )
	{
		this._customerid = customerid;
		this._customername = customername;

		domattr.set( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
		this.payment.set("value", defaultvalue ) ;
		this.first_month_value.set("value",defaultvalue );
	},
	_payment_taken_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Payment Taken and invoice sent");
			this.clear();
			topic.publish(PRCOMMON.Events.Monthly_Payments, [ response.data] ) ;
			this._dialog.hide();
		}
		else
		{
			alert("Problem taking payment");
		}
	},
	_take_payment:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		var content = this.form.get("value");

		// fix up the date
		var d = this.dd_collectiondate.get("value");
		if ( d != null )
			content["dd_collectiondate"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		content["icustomerid"] = this._customerid;

		request.post("/iadmin/payment_dd_first",
			utilities2.make_params({ content : content})).
			then(this._payment_taken_call_back);
	},
	clear:function()
	{
		this.payment.set("value","");
		this.first_month_value.set("value","");
		this.email.set("value","");
	}
});
});
