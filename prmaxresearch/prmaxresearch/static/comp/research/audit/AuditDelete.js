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
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Date',className:"standard",field:"activitydate"},
			{label: 'Outlet Name', className:"standard",field:"name"},
			{label: 'Action',width: "60px",field:"actiontypedescription"},
			{label: 'Reason',className:"standard",field:"reasoncodedescription"},
			{label: 'User',className:"standard",field:"display_name"},
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

		this.inherited(arguments);
	},
	load:function(  objectid )
	{
		this.clear();
		this._objectid = objectid;
	},
	_filter:function()
	{
		var d = this.filterdate.get("value");
		this.result_grid.set( "query",{filterdate:d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate(),
				objecttypeid: this.objecttypeid});
	},
	clear:function()
	{
		this.result_grid.set("query",{});
	}
});
});





