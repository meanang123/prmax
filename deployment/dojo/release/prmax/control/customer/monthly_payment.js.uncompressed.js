require({cache:{
'url:control/customer/templates/monthly_payment.html':"<div>\r\n<form data-dojo-attach-point=\"form\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n<table width=\"500px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t<tr><td colspan=\"4\"><div data-dojo-props='\"class\":\"prmaxrowdisplaylarge\",style:\"text-align:center;display:inline\"'>Monthly Payment (Inc Vat.)</div><div data-dojo-props='\"class\":\"prmaxrowdisplaylarge\",style:\"display:inline\"' data-dojo-attach-point=\"customername\"></div></td>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\">Amount (Inc Vat.)</td>\r\n\t\t<td><input data-dojo-props='type:\"text\",name:\"value\",required:true,trim:true' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"payment\" /></td>\r\n\t</tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\">Paid Month</td>\r\n\t<td><select data-dojo-props='\"class\":\"prmaxinput\",name:\"monthid\",style:\"width:10em\",autoComplete:\"true\"' data-dojo-attach-point=\"monthid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td>\r\n\t<td class=\"prmaxrowlabel\" align=\"right\">Paid Year</td><td><select data-dojo-props='\"class\":\"prmaxinput\",name:\"yearid\",style:\"width:5em\",autoComplete:\"true\"' data-dojo-attach-point=\"yearid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\" valign=\"top\">Message</td><td><div class=\"dialogprofileframe\" >\r\n\t<textarea data-dojo-attach-point=\"message\" data-dojo-props='name:\"message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' data-dojo-type=\"dijit/form/Textarea\" ></textarea></div></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Email Address</td><td><input class=\"prmaxinput\"  data-dojo-props='name:\"email\",type:\"text\",trim:true,required:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:\"40\",maxLength:\"85\"' data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\r\n\t<tr><td class=\"prmaxrowlabel\" align=\"right\">Payment Date</td><td><input data-dojo-props='type:\"text\",name:\"payment_date\"'  data-dojo-attach-point=\"payment_date\" data-dojo-type=\"dijit/form/DateTextBox\" ></td>\r\n\t</tr>\r\n\t<tr><td class=\"prmaxrowlabel\" colspan=\"4\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_take_payment\">Take Payment</button></td>\r\n</table></form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    monthly_payment.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------


define("control/customer/monthly_payment", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/monthly_payment.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/CurrencyTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Textarea",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore){

return declare("control/customer/monthly_payment",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._payment_taken_call_back = lang.hitch(this,this._payment_taken_call);
		this._months = new ItemFileReadStore ( { url:"/common/lookups?searchtype=months"});
		this._years = new ItemFileReadStore ( { url:"/common/lookups?searchtype=years"});
	},
	setCustomer:function( customerid , customername , email , dialog, defaultvalue )
	{
		this._customerid = customerid;
		this._customername = customername;

		domattr.set( this.customername , "innerHTML" , this._customername ) ;
		this.email.set("value",email);
		this._dialog = dialog;
		this.payment.set("value", defaultvalue ) ;
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
		if (utilities2.form_validator( this.form ) == false)
		{
			alert("Please Enter Details");
			return false;
		}

		var content = this.form.get("value");

		// fix up the date
		var d = this.payment_date.get("value");
		if ( d != null )
			content["payment_date"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		content["icustomerid"] = this._customerid;
			
		request.post("/payment/payment_monthly_take",
			utilities2.make_params({ data : content})).
			then(this._payment_taken_call_back);				

	},
	clear:function()
	{
		this.payment.set("value","");
		this.email.set("value","");
	},
	postCreate:function()
	{
		this.monthid.set("store", this._months);
		this.yearid.set("store", this._years);
		var date = new Date();
		var year = date.getFullYear() ;
		var month  = date.getMonth() + 1;

		this.monthid.set("value", month) ;
		this.yearid.set("value", year) ;

		this.inherited(arguments);
	}
});
});

