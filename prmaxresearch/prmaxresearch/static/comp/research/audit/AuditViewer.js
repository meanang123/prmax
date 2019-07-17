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
	"dojo/text!../audit/templates/AuditViewer.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dijit/layout/ContentPane",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable){
 return declare("research.audit.AuditViewer",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	objecttypeid:-1,
	objectisbase:false,
	constructor: function()
	{
		this.results = new JsonRest( {target:'/research/admin/audit_trail',idProperty:"activityid"});
		this.details = new JsonRest( {target:'/research/admin/audit_details'});
	},
	postCreate:function()
	{
		var cells = null;
		if (this.objectisbase==true)
		{
			cells = [
				{label: 'Date',className:"standard", field:"activitydate"},
				{label: 'Action',className:"dgrid-column-status-small", field:"actiontypedescription"},
				{label: 'Reason',className:"standard",field:"reasoncodedescription"},
				{label: 'User',className:"standard",field:"display_name"},
				//{label: 'Reason Details',className:"standard",field:"reason"},
				{label: 'Type',className:"standard",field:"objecttypename"}
				];
		}
		else
		{
			cells = [
				{label: 'Date',className:"standard", field:"activitydate"},
				{label: 'Action',className:"dgrid-column-status-small", field:"actiontypedescription"},
				{label: 'Reason',className:"standard",field:"reasoncodedescription"},
				{label: 'User',className:"standard",field:"display_name"},
				//{label: 'Reason Details',className:"standard",field:"reason"}
			];
		}

		this.result_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.results
		})

		this.result_grid_view.set("content", this.result_grid);
		this.result_grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		cells = [
				{label: 'Field',className:"standard", field:"fieldname"},
				{label: 'From', className:"standard", field:"fromvalue"},
				{label: 'To', className:"standard",field:"tovalue"}
			];
		this.details_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.details
		})

		this.details_grid_view.set("content", this.details_grid);

		this.filterdate.set("value", new Date());

		this.inherited(arguments);
	},
	_on_cell_call : function(e)
	{
		this.details_grid.set("query",{ activityid: e.rows[0].data.activityid});
	},
	load:function(  objectid )
	{
		this.clear();
		this._objectid = objectid;
	},
	_filter:function()
	{
		var d = this.filterdate.get("value");
		this.result_grid.set("query",{filterdate:d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate(),
				objecttypeid: this.objecttypeid,
				objectisbase: this.objectisbase,
				objectid: this._objectid});
	},
	clear:function()
	{
		this.result_grid.set("query",{});
		this.details_grid.set("query",{});
	}
});
});





