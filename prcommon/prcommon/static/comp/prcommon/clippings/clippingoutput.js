//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.clippingoutput
// Author:  Chris Hoy
// Purpose:
// Created: 04/09/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.clippingoutput");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.layout.TabContainer");
dojo.require("prmax.common.ReportBuilder");

dojo.declare("prcommon.clippings.clippingoutput",
	[ ttl.BaseWidget ],
	{
	templatePath: dojo.moduleUrl( "prcommon.clippings","templates/clippingoutput.html"),
	widgetsInTemplate: true,
	constructor: function()
	{
		this._pp_reports = new dojo.data.ItemFileReadStore ({ url:"/common/lookups_restricted?searchtype=clippingreports&set=1"});
		this._complete_call_back = dojo.hitch(this, this._complete_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.crppid.set("store", this._pp_reports);
	},
	startup:function()
	{
		this.inherited(arguments);
	},
	resize:function()
	{
		this.tabcont.resize( {w:600, h:280} );
	},
	_report:function()
	{
		var content = {};

		content['reporttemplateid'] = -2 ;

		//done on tab !
		content['clippingsreportid'] = this.crppid.get("value");

		this.report_node.SetCompleted(this._complete_call_back);
		this.report_node.StartNoDialog(content);
	},
		_complete_call:function()
	{
		this.reportbtn.cancel();
		this.report_node.hide();
	},
});
