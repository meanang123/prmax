//-----------------------------------------------------------------------------
// Name:    viewers.js
// Author:  Chris Hoy
// Purpose:
// Created: 16/06/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.solidsocial.viewercoverage");

dojo.require("dijit.layout.BorderContainer");
dojo.require("prcommon.crm.solidsocial.addsearchprofile");

dojo.declare("prcommon.crm.solidsocial.viewercoverage",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	issue_view:"/crm/issues/coverage_view?issueid=${issueid}",
	templatePath: dojo.moduleUrl( "prcommon.crm.solidsocial","templates/viewercoverage.html"),
	constructor: function()
	{
		this._load_call_back = dojo.hitch(this,this._load_call);
		dojo.subscribe("/crm/issue/profile_new", dojo.hitch(this,this._profile_new_event));
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	load:function(issueid)
	{
		this._issueid = issueid;
		this.addsearchprofile.load(issueid);

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._load_call_back,
				url:"/crm/issues/has_coverage" ,
				content: {issueid:issueid}
			}));
	},
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			if (response.has_coverage)
			{
				this._show_coverage();
			}
			else
			{

			}
		}
		else
		{

		}
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	_profile_new_event:function(issueid)
	{
		if (this._issueid == issueid)
		{
			this._show_coverage();
		}
	},
	_show_coverage:function()
	{
		this.issue_view_ctrl.set("href",dojo.string.substitute(this.issue_view,{issueid:this._issueid}));
		this.controls.selectChild(this.issue_view_ctrl);
	}
});





