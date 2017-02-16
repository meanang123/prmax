//-----------------------------------------------------------------------------
// Name:    Credit.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/04/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.ReAllocation");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("prmax.iadmin.accounts.Allocation");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.ReAllocation",
	[ ttl.BaseWidget, prmax.iadmin.accounts.Allocation ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/reallocation.html"),
	constructor: function()
	{
		this._LoadCallBack = dojo.hitch ( this, this._LoadCall );
		this._ReAllocateCallBack = dojo.hitch ( this, this._ReAllocateCall );
		this._source = "";
	},
	Load:function( customerid, keyid )
	{
		this._customerid = customerid;
		this.alloc_grid.resize( {w:590, h:300});

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._LoadCallBack),
			url:'/iadmin/allocation_get_details',
			content:{keyid:keyid}}));
		this.keyid.set("value",keyid);
	},
	_LoadCall:function ( response )
	{
		if ( response.success == "OK")
		{
			this._source = response.data.source;
			this.alloc_grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(), {
				icustomerid:this._customerid,
				source:response.data.source	}));

			this.payment.set("value",response.data.unallocated);
			this.toallocate.set("value",response.data.unallocated);
			this.allocate.cancel();

			this.dialog.show();
		}
	},
	_onBlurAmount:function()
	{
		this._doallocation();
	},
	postCreate:function()
	{
		this._postCreate();
		this.inherited(arguments);
	},
	_ReAllocateCall:function ( response )
	{
		if ( response.success == "OK")
		{
			alert("Re Allocated Done");
			this.dialog.hide();
			dojo.publish(PRCOMMON.Events.Financial_ReLoad, []);
		}
		else
		{
			alert("Problem with allocations");
		}
		this.allocate.cancel();
	},
	_ReAllocate:function()
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

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._ReAllocateCallBack),
			url:'/iadmin/allocation_reallocate',
			content:content}));
	}
});