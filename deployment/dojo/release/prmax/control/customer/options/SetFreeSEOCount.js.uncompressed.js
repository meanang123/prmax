require({cache:{
'url:control/customer/options/templates/SetFreeSEOCount.html':"<div>\r\n\t<div data-dojo-attach-point=\"dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Set Nbr of Free SEO for Customer\"'>\r\n\t\t<form data-dojo-attach-point=\"form\"  data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t<input data-dojo-attach-point=\"icustomerid\" data-dojo-props='name:\"icustomerid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\">\r\n\t\t\t<table style=\"width:400px;border-collapse:collapse;\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t\t<tr ><td class=\"prmaxrowtag\" align=\"right\" >SEO Credit Qty</td><td><input data-dojo-props='\"class\":\"prmaxinput\",name:\"seonbrincredit\",type:\"text\",trim:true' data-dojo-attach-point=\"seonbrincredit\" data-dojo-type=\"dijit/form/NumberTextBox\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" valign=\"top\" class=\"prmaxrowtag\">Reason</td><td colspan=\"2\"><div class=\"stdframe prmaxrequired\" style=\"height:150px;\"><textarea data-dojo-attach-point=\"reason\" data-dojo-props='\"class\":\"prmaxrequired\", name:\"reason\", trim:true, required:true, style:\"width:99%;height:80%\"' data-dojo-type=\"dijit/form/Textarea\" ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td colspan=\"2\"><br/></td></tr>\r\n\t\t\t\t<tr><td><button data-dojo-attach-event=\"onClick:_Close\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Close\", type:\"button\"' ></button></td><td align=\"right\"><button data-dojo-attach-point=\"updBtn\" data-dojo-attach-event=\"onClick:_Update\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\", label:\"Set Free SEO Qty\",busyLabel:\"Please wait Updating\"' ></button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n</div>"}});
define("control/customer/options/SetFreeSEOCount", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/SetFreeSEOCount.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",	
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/NumberTextBox",
	"dojox/form/BusyButton",
	"dijit/form/CheckBox",
	"dijit/form/SimpleTextarea"],
	function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.customer.options.SetFreeSEOCount",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._UpdatedCallBack = dojo.hitch(this,this._UpdatedCall);
		this._LoadedCallBack = dojo.hitch(this, this._LoadedCall);
	},
	Load:function( customerid)
	{
		this.icustomerid.set("value", customerid);

		request.post ('/customer/get_internal',
			utilities2.make_params({ data : {icustomerid:customerid}})).then
			(this._LoadedCallBack);
	},
	_LoadedCall:function ( response )
	{
		if ( response.success == "OK")
		{
			this.Clear();
			this.reason.set("value", "");
			this.seonbrincredit.set("value", response.data.cust.seonbrincredit);
			this.dlg.show();
		}
		else
		{
			alert("Problem Loading SEO Value");
		}
	},
	Clear:function()
	{
		this.updBtn.cancel();
		this.reason.set("value, ");
		this.seonbrincredit.set("value", 0);

	},
	_UpdatedCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("SEO Free Count Updated");
			this.dlg.hide();
			this.Clear();
		}
		else
		{
			if ( response.message)
				alert( response.message ) ;
			else
				alert("Problem Upating");
		}
		this.updBtn.cancel();
	},
	_Update:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Missing Data");
			this.updBtn.cancel();
			return false;
		}

		request.post ('/customer/customer_seo_qty_update',
			utilities2.make_params({ data : this.form.get("value")})).then
			(this._UpdatedCallBack);
	},
	_Close:function()
	{
		this.dlg.hide();
		this.Clear();
	}
});
});
