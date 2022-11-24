//-----------------------------------------------------------------------------
// Name:    AuditViewer.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../audit/templates/AuditDelete.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore,lang,topic ){
 return declare("research.audit.AuditDelete",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	objecttypeid:1,
	constructor: function()
	{

		this._activities = new JsonRest( {target:'/research/admin/audit_delete_trail_list', labelAttribute:"name",idProperty:"activityid"});
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Date',className:"standard",field:"activitydate"},
			{label: 'Outlet Name', className:"standard",field:"name"},
			{label: 'Action',width: "60px",field:"actiontypedescription"},
			{label: 'Reason',className:"standard",field:"reasoncodedescription"},
			{label: 'Reason Details',className:"standard",field:"reason"}
			];

		this.result_grid = new Grid({
			columns: cells,
			selectionMode: "none",
			store: new JsonRest( {target:'/research/admin/audit_delete_trail',idProperty:"activityid"}),
			query: {objecttypeid: this.objecttypeid}
		});

		this.result_grid_view.set("content", this.result_grid);
		this.filterdate.set("value", new Date());
		this.filteroutlet.set("value", "");

		this.inherited(arguments);
	},
	load:function(objectid)
	{
		this.clear();
		this._objectid = objectid;
	},
	clear:function()
	{
		this.result_grid.set("query",{});
	},
	_clear_filter:function()
	{
		this.filterdate.set("value", Date.now());
		this.filteroutlet.set("value", "");	
	},
	_execute:function()
	{
		var query = {};
		query["objecttypeid"] = this.objecttypeid;
		if (arguments[0].filterdate != null)
			query["filterdate"] = arguments[0].filterdate.getFullYear() + "-" + (arguments[0].filterdate.getMonth() + 1 )  + "-" + arguments[0].filterdate.getDate();
		if (arguments[0].filteroutlet != "")
			query["filteroutlet"] = arguments[0].filteroutlet;
		this.result_grid.set( "query",query);
	},
});
});





