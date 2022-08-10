require({cache:{
'url:control/customer/templates/dd_invoices.html':"<div>\r\n\t<table width=\"500px\" cellpadding=\"0\" cellpadding=\"0\">\r\n\t\t<tr><td colspan=\"2\"><div class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Create DD Invoices for next 10 Working days (Ignores Bank Holidays)</div></td>\r\n\t\t<tr>\r\n\t\t\t<td class=\"prmaxrowlabel\" align=\"right\" >DD Day</td>\r\n\t\t\t<td>\r\n\t\t\t\t<select data-dojo-props='\"class\":\"prmaxrequired\",required:\"true\",name:\"pay_montly_day\",autoComplete:\"true\",style:\"width:3em\"' data-dojo-attach-point=\"pay_montly_day\" data-dojo-type=\"dijit/form/FilteringSelect\" >\r\n\t\t\t\t\t<option value=\"1\">1</option>\r\n\t\t\t\t\t<option value=\"8\">8</option>\r\n\t\t\t\t\t<option value=\"15\">15</option>\r\n\t\t\t\t\t<option value=\"22\">22</option>\r\n\t\t\t\t</select>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >DD Date</td><td><input data-dojo-props='type:\"text\",name:\"take_date\",required:true' data-dojo-attach-point=\"take_date\" data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t<tr><td colspan=\"2\"><br/><br/><br/></td></tr>\r\n\t\t<tr><td class=\"prmaxrowlabel\" colspan=\"2\" align=\"center\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busylabel:\"Please Wait\" ' data-dojo-attach-event=\"onClick:_create_invoices\" data-dojo-attach-point=\"invbtn\">Create Invoices And Setup Payment</button></td></tr>\r\n\t\t<tr><td colspan=\"2\" ><br/><br/><br/></td></tr>\r\n\t\t<tr><td>\r\n\t\t\t<form target=\"_newtab\" action=\"/payment/payment_dd_invoices_draft\" method=\"post\" data-dojo-attach-event=\"onsubmit:_draft_invoices\" >\r\n\t\t\t\t<input type=\"hidden\"  data-dojo-attach-point=\"tmp_cache\" name = \"tmp_cache\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t<input type=\"hidden\"  data-dojo-attach-point=\"pay_montly_day2\" name = \"pay_montly_day\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t<input type=\"hidden\"  data-dojo-attach-point=\"take_date2\" name = \"take_date\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t<button type=\"submit\" data-dojo-type=\"dijit/form/Button\" label=\"See Draft List\" ></button>\r\n\t\t\t</form>\r\n\t\t</td></tr>\r\n\t</table>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    dd_invoices.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/dd_invoices", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/dd_invoices.html",
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
	"dijit/form/Button",
	"dijit/form/Textarea",
	"dijit/form/ComboBox",
	"dijit/form/DateTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control/customer/dd_invoices",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._invoice_call_back = lang.hitch(this,this._invoice_call);

	},
	_create_invoices:function()
	{
		if ( confirm("Create Payment Run"))
		{
			var content = { pay_montly_day: this.pay_montly_day.get("value"),
											take_date: utilities2.to_json_date( this.take_date.get("value"))};

			request.post("/payment/payment_dd_invoices",
				utilities2.make_params({ data : content})).
				then(this._invoice_call_back);				
		}
		else
		{
			this.invbtn.cancel();
		}
	},
	_invoice_call:function(response)
	{

		if ( response.success == "OK" )
		{
			alert("Invoice Run Created");
		}
		else
		{
			alert("Problem creating Invoice Run");
		}

		this.invbtn.cancel();
	},
	_draft_invoices:function()
	{
		this.tmp_cache.set("value", new Date());
		this.pay_montly_day2.set("value", this.pay_montly_day.get("value"));
		if ( this.take_date.get("value"))
		{
			var d = this.take_date.get("value");
			this.take_date2.set("value", d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate() );
		}
		else
		{
			this.take_date2.set("value", null );
		}
		return true;
	}

});
});
	