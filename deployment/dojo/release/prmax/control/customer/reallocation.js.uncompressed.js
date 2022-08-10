require({cache:{
'url:control/customer/templates/reallocation.html':"<div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"dialog\" data-dojo-props='title:\"Allocate\"'>\r\n\t\t<form data-dojo-attach-point=\"form\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t<input type=\"hidden\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"keyid\" name=\"keyid\" >\r\n\t\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t\t<tr><td colspan=\"2\"><div class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\"></div><div class=\"prmaxrowdisplaylarge\" style=\"display:inline\" data-dojo-attach-point=\"customername\"></div></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Value</td><td>\r\n\t\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" ><tr>\r\n\t\t\t\t\t\t<td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",readOnly:\"readonly\",style:\"width:8em\"' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"payment\" ></input></td>\r\n\t\t\t\t\t\t<td class=\"prmaxrowlabel\">Amount to Allocate</td>\r\n\t\t\t\t\t\t<td class=\"prmaxrowlabel\"><input data-dojo-props='type:\"text\",style:\"width:8em\",readOnly:\"readonly\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"toallocate\"  ></input></td>\r\n\t\t\t\t\t</tr></table>\r\n\t\t\t\t</td></tr>\r\n\t\t\t\t<tr><td colspan=\"2\">\r\n\t\t\t\t\t<div data-dojo-attach-point=\"alloc_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:590px;height:300px\"'></div>\r\n\t\t\t\t</td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowlabel\" colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",labelBusy:\"Re-Allocation\"' data-dojo-attach-point=\"allocate\" data-dojo-attach-event=\"onClick:_reallocate\">Allocate</button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\r\n<div data-dojo-attach-point=\"alloc_manual\" data-dojo-type=\"control/customer/manual_allocate_amount\"></div>\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    reallocation.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/reallocation", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/reallocation.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/data/ItemFileWriteStore",
	"control/customer/allocation",	
	"dijit/form/Form",
	"dijit/form/CurrencyTextBox",
	"dojox/form/BusyButton",
	"dijit/form/TextBox",
	"control/customer/manual_allocate_amount"

	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore,ItemFileWriteStore, Allocation){

return declare("control.customer.reallocation",
	[BaseWidgetAMD,Allocation],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._load_call_back = lang.hitch ( this, this._load_call);
		this._reallocate_call_back = lang.hitch ( this, this._reallocate_call);
		this._source = "";
	},
	Load:function( customerid, keyid )
	{
		this._customerid = customerid;
		this.alloc_grid_view.resize( {w:590, h:300});

		request.post("/allocation/allocation_get_details",
			utilities2.make_params({ data : {keyid:keyid}})).
			then(this._load_call_back);
			
		this.keyid.set("value",keyid);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this._source = response.data.source;
			this.load_allocation(this._customerid, response.data.source);
		
			this.payment.set("value",response.data.unallocated);
			this.toallocate.set("value",response.data.unallocated);
			this.allocate.cancel();

			this.dialog.show();
		}
	},
	_on_blur_amount:function()
	{
		this._doallocation();
	},
	postCreate:function()
	{
		this._postCreate();
		this.inherited(arguments);
	},
	_reallocate_call:function ( response )
	{
		if ( response.success == "OK")
		{
			alert("Re Allocated Done");
			this.dialog.hide();
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
		}
		else
		{
			alert("Problem with allocations");
		}
		this.allocate.cancel();
	},
	_reallocate:function()
	{
		if ( this.toallocate.get("value") > this.payment.get("value"))
		{
			alert("Over Allocation");
			this.allocate.cancel();
			return ;
		}
		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;
		content["unpaidamount"] = this.toallocate.get("value");
		content['allocations'] = this.getAllocations();

		request.post("/allocation/allocation_reallocate",
			utilities2.make_params({ data : content})).
			then(this._reallocate_call_back);
	}
});
});