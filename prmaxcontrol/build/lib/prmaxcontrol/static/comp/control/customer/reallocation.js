//-----------------------------------------------------------------------------
// Name:    reallocation.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
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