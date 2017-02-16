//-----------------------------------------------------------------------------
// Name:    OutletDesk.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/02/2013
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletDesks.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"prcommon2/outlet/desks/DeskAdd"
	], function(declare, BaseWidgetAMD, template, BorderContainer,topic,  lang, utilities2, request , JsonRest, ItemFileReadStore, Grid, JsonRest, Observable){
 return declare("research.outlets.OutletDesk",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{

		this._outletdesks = new Observable( new JsonRest( {target:'/research/admin/desks/list', idProperty:"outletdeskid"}));

		topic.subscribe(PRCOMMON.Events.Desk_Updated, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Desk_Added, lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Desk_Deleted, lang.hitch(this, this._delete_event));

	},
		postCreate:function()
	{
		this.inherited(arguments);

		this.outlet_desk_grid = new Grid({
			columns: [ {label: 'Outlet Desk', className:"standard",field:"deskname"} ],
			selectionMode: "single",
			store: this._outletdesks
		});

		this.grid_view.set("content", this.outlet_desk_grid);
		this.outlet_desk_grid.on(" .dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		this.desk_add_ctrl.set("dialog", lang.hitch(this, this._show_add_function));
		this.desk_update_ctrl.set("dialog", lang.hitch(this, this._show_update_function));
	},
	_show_add_function:function(command)
	{
		if (command =="show")
		{
			this.desk_add_dlg.show();
		}
		else
		{
			this.desk_add_dlg.hide();
		}
	},
	_show_update_function:function(command)
	{
		if (command =="show")
		{
			this.controls.selectChild(this.desk_update_ctrl);
		}
		else
		{
			this.controls.selectChild(this.blank);
		}
	},
	load:function( outletid )
	{
		this.desk_add_ctrl.set("outletid", outletid);
		this.outlet_desk_grid.set("query", {outletid:outletid});
		this.controls.selectChild(this.blank);
		this.desk_update_ctrl.clear();
	},
	clear:function()
	{
		this.desk_add_ctrl.set("outletid", -1);
		this.outlet_desk_grid.set("query",{});
	},
	_on_cell_call:function( e )
	{
		var cell = this.outlet_desk_grid.cell(e);

		if ( cell != null)
			this.desk_update_ctrl.load ( cell.row.data.outletdeskid );

	},
	_add_desk:function()
	{
		this.desk_add_ctrl.clear();
		this.desk_add_dlg.show();
	},
	_update_event:function( outletdesk )
	{
		this._outletdesks.put( outletdesk );
	},
	_add_event:function( outletdesk )
	{
		this._outletdesks.add( outletdesk );
	},
	_delete_event:function( outletdeskid )
	{
		this._outletdesks.remove( outletdeskid );
	}
});
});





