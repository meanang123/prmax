//-----------------------------------------------------------------------------
// Name:   prmax.prrequest.viewer
// Author:  Chris Hoy
// Created: 23/03/2014
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.prrequest.viewer");

dojo.require("prmax.prrequest.view");
dojo.require("ttl.utilities");

function _row_image_local(profile_image_url)
{
	return "<img src='"+profile_image_url+"'></img>";
}

dojo.declare("prmax.prrequest.viewer",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.prrequest","templates/viewer.html"),
	constructor: function() {
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_execute_filter:function()
	{
		var filter = {};

		var phrase = this.pprrequest.get("value");
		if (phrase.length > 0 )
			filter["phrase"] = phrase;

		this.ppr_request_ctrl.filter(filter);
	},
	_clear_filter:function()
	{
		this.pprrequest.set("value","");
	},
	_refresh:function()
	{
		this.ppr_request_ctrl.filter({});
	},
	resize:function()
	{
		this.borderCtrl.resize(arguments[0]);
	}
});
