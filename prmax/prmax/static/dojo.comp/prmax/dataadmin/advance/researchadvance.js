//-----------------------------------------------------------------------------
// Name:    advance.js
// Author:  Chris Hoy
// Purpose:
// Created: 05/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.advance.researchadvance");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.date.DateExtended");

dojo.declare("prmax.dataadmin.advance.researchadvance",
	[  ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.advance","templates/researchadvance.html"),
	constructor: function()
	{
		this.inherited(arguments);
		this._SaveCallBack = dojo.hitch(this, this._SaveCall ) ;
		this._LoadCallBack = dojo.hitch(this, this._LoadCall ) ;
		this._advancefeaturestatusid = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=advancefeaturestatus"});
	},
	postCreate:function()
	{
		this.advancefeaturestatusid.store = this._advancefeaturestatusid;
		this.inherited(arguments);
	},
	_SaveCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Research Details Updated");
		}
		else
		{
			alert("Problem saving Research Details");
		}
		this.saveNode.cancel();
	},
	_Save:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		var d = this.advance_last_contact.get("value");
		var content = this.form.get("value");

		content["advance_last_contact"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveCallBack,
				url:"/advance/research_details_save" ,
				content: content
			}));
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},
	Load:function( outletid )
	{
		this.outletid.set("value", outletid );

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._LoadCallBack,
				url:"/advance/getResearchExt" ,
				content: {outletid:outletid}
		}));
	},
	_LoadCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.advance_last_contact.set("value" , new Date(response.data.advance_last_contact.year, response.data.advance_last_contact.month-1, response.data.advance_last_contact.day));
			this.advance_url.set("value" , response.data.advance_url);
			this.advance_notes.set("value", response.data.advance_notes);
			this.advancefeaturestatusid.set("value", response.data.advancefeaturestatusid);
		}
		else
		{
			alert("Problem Loading Research Details");
		}
	}
});





