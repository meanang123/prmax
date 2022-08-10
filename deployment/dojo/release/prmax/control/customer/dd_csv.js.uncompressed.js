require({cache:{
'url:control/customer/templates/dd_csv.html':"<div>\r\n\t<form target=\"_newtab\" action=\"/payment/payment_dd_csv\" data-dojo-attach-event=\"onsubmit:_create_csv\" >\r\n\t\t<table width=\"700px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr>\r\n\t\t\t\t<td colspan=\"2\">\r\n\t\t\t\t\t<div class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Create DD Csv </div>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"prmaxrowlabel\" align=\"right\" >DD Day</td>\r\n\t\t\t\t<td>\r\n\t\t\t\t\t<select data-dojo-props='\"class\":\"prmaxrequired\",required:\"true\",name:\"pay_montly_day\",autoComplete:\"true\",style:\"width:3em\"' data-dojo-attach-point=\"pay_montly_day\" data-dojo-type=\"dijit/form/FilteringSelect\" >\r\n\t\t\t\t\t\t<option value=\"1\">1</option>\r\n\t\t\t\t\t\t<option value=\"8\">8</option>\r\n\t\t\t\t\t\t<option value=\"15\">15</option>\r\n\t\t\t\t\t\t<option value=\"22\">22</option>\r\n\t\t\t\t\t</select>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td colspan=\"2\"><br/><br/><br/></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td>\r\n\t\t\t\t\t<button data-dojo-props='type:\"button\",label:\"Reset Monthly Figures\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_clear_down\" ></button>\r\n\t\t\t\t</td>\r\n\t\t\t\t<td class=\"prmaxrowlabel\" align=\"left\">\r\n\t\t\t\t\t<button type=\"submit\" data-dojo-type=\"dijit/form/Button\" label=\"Create DD Csv\" ></button>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</form>\r\n\r\n\r\n\r\n\t<br/><br/><br/>\r\n\t<table width=\"700px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t<tr>\r\n\t\t\t<td>\r\n\t\t\t\t<form target=\"_newtab\" action=\"/payment/payment_dd_csv_draft\" method=\"post\" data-dojo-attach-event=\"onsubmit:_draft_invoices\" >\r\n\t\t\t\t\t<input data-dojo-props='\"class\":\"prmaxhidden\", name:\"tmp_cache\" ' data-dojo-attach-poin=\"tmp_cache\" data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t\t\t<input type=\"hidden\"  data-dojo-attach-poin=\"pay_montly_day2\" name = \"pay_montly_day\" data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t\t\t<button type=\"submit\" data-dojo-type=\"dijit/form/Button\" label=\"See Draft List\" ></button>\r\n\t\t\t\t</form>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    dd_cvs.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/dd_csv", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/dd_csv.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/TextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr){

return declare("control/customer/dd_csv",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	_create_csv:function()
	{

		if ( confirm("Create DD Csv"))
			return true ;

		return false;
	},
	_draft_invoices:function()
	{
		this.tmp_cache.set("value", new Date());
		this.pay_montly_day2.set("value", this.pay_montly_day.get("value"));

		return true;
	},
	_clear_down:function()
	{
		if ( confirm("Reset the Montly Payment Values to the Default Values"))
		{
			request.post("/payment/payment_dd_reset",
				utilities2.make_params({ data : {'pay_montly_day':this.pay_montly_day.get("value")}})).
				then(this._LoadCustomerCall);			
		}
	}
});
});