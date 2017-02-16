//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.analysis.edit
// Author:  Chris Hoy
// Purpose:
// Created: 7/06/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.analysis.edit");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.clippings.analysis.edit",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings.analysis","templates/edit.html"),
	constructor: function()
	{
		this._save_call_back=dojo.hitch(this,this._save_call);
		dojo.subscribe("/clipping/update", dojo.hitch(this,this._update_clipping_event));
		this._ignore=false;
	},
	clear:function()
	{
		this.display_zone.set("href","");
		this.display_zone.set("content","");
	},
	load:function(clippingid)
	{
		this.clear();
		this._clippingid = clippingid;
		this.display_zone.set("href",dojo.string.substitute("/clippings/analyse/analysis_clip_view?clippingid=${clippingid}",{clippingid:clippingid}));
	},
	_update_clipping_event:function(clipping)
	{
		if ( this._ignore==false )
			this.load(clipping.clippingid);
	},
	_save:function()
	{
		var formobj=dijit.byId("form_clip_"+ this._clippingid);

		if ( ttl.utilities.formValidator(formobj)==false)
		{
			alert("Invalid Value");
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._save_call_back,
			url:'/clippings/analyse/update',
			content: formobj.get("value")}));

	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._ignore=true;
			dojo.publish("/clipping/update", [response.data]);
			this._ignore=false;
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	}
});
