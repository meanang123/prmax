//-----------------------------------------------------------------------------
// Name:    AdvanceView.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/10/2010
//
// To do:
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/AdvanceView.html",
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
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"prcommon2/advance/advance",
	"research/advance/researchadvance",
	"research/advance/AdvanceDelete",
	"research/advance/AdvanceDuplicate"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic ){
 return declare("research.advance.AdvanceView",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this.advance_feature_model =  new Observable( new JsonRest( {target:'/advance/listoutlet_all', idProperty:"advancefeatureid"}));
		this._outletid = -1;

		topic.subscribe(PRCOMMON.Events.Feature_Added, lang.hitch(this,this._advance_add_event));
		topic.subscribe(PRCOMMON.Events.Feature_Deleted, lang.hitch(this,this._advance_delete_event));
		topic.subscribe(PRCOMMON.Events.Feature_Updated, lang.hitch(this,this._advance_update_event));
	},
	postCreate:function()
	{
		this.inherited(arguments);

		var cells =
		[
			{label: 'Description',className: "dgrid-column-address-short",field:"feature"},
			{label: 'Publication Date',className: "dgrid-column-address-short",field:"pub_date_display"},
			{label: " ",className:"grid-field-image-view",field:"",formatter:utilities2.format_row_ctrl},
			{label: ' ',className:"grid-field-image-view",field:"", formatter:utilities2.delete_row_ctrl},
			{label: " ",className:"grid-field-image-view",field:"",formatter:utilities2.format_copy_ctrl}
		];

		this.outlet_advance_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.advance_feature_model,
			sort: [{ attribute: "pub_date_display", descending: false }]
		});

		this.advance_feature_view.set("content", this.outlet_advance_grid);
		this.outlet_advance_grid.on(".dgrid-row:click", lang.hitch(this,this._on_cell_call));
		this.advance_delete_ctrl.set("dialog", this.advance_delete_dlg);
		this.advance_duplicate_ctrl.set("dialog", this.advance_duplicate_dlg);

		this.newfeature.newmode();
	},
	_on_cell_call:function(e)
	{
		var cell = this.outlet_advance_grid.cell(e);

		if ( cell.column.id == "0" || cell.column.id == "1" || cell.column.id == "2")
		{
			this.viewfeature.load ( cell.row.data.advancefeatureid , this._outletid ) ;
		}
		if ( cell.column.id == "3")
		{
			this.advance_delete_ctrl.load ( cell.row.data.advancefeatureid, cell.row.data.feature );
			this.advance_delete_dlg.show();
		}
		if ( cell.column.id == "4" )
		{
			this.advance_duplicate_ctrl.load ( cell.row.data.advancefeatureid, cell.row.data.feature );
			this.advance_duplicate_dlg.show();
		}
	},
	load:function( outletid )
	{
		this._outletid = outletid;
		this.viewfeature.load(-1, outletid ) ;
		this.newfeature.load(-1, outletid ) ;
		this.researchadvance.load ( outletid ) ;
		this.outlet_advance_grid.set("query",{outletid:this._outletid});
	},
	_advance_add_event:function ( newdata)
	{
		this.advance_feature_model.add ( newdata ) ;
	},
	_advance_delete_event:function( deleteData )
	{
		this.advance_feature_model.remove(deleteData.advancefeatureid);
	},
	_advance_update_event:function ( advdata )
	{
		this.advance_feature_model.put( advdata );
	}
});
});
