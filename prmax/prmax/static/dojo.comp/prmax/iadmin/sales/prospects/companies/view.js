//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 25/07/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.sales.prospects.companies.view");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.Toolbar");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.grid.DataGrid");
dojo.require("prmax.iadmin.sales.prospects.companies.add");


dojo.declare("prmax.iadmin.sales.prospects.companies.view",
	[ ttl.BaseWidget, dijit.layout.BorderContainer ],
	{
	widgetsInTemplate: true,
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/companies/templates/view.html"),
	constructor: function()
	{
		this._store = new dojox.data.JsonRestStore( {target:"/iadmin/prospects/companies/list", idAttribute:"prospectcompanyid"});
		dojo.subscribe("/prospect/comp/add", dojo.hitch(this, this._add_event));
	},
	_add_event:function( company )
	{
		this._store.newItem ( company ) ;
	},
	clear:function()
	{
	},
	postCreate:function()
	{
		this.result_grid.set("structure",this.view);
		this.result_grid._setStore(this._store );

		this.result_grid.onStyleRow = dojo.hitch(this,ttl.GridHelpers.onStyleRow);
		this.result_grid.onRowClick = dojo.hitch(this,this._on_select_row);

		this.inherited(arguments);
	},
	_on_select_row : function(e)
	{
		this._row = this.result_grid.getItem(e.rowIndex);

		this.result_grid.selection.clickSelectEvent(e);

	},
	view: {
		cells: [[
		{name: " ",width: "12px",field:"",formatter:ttl.utilities.formatRowCtrl},
		{name: 'Company',width: "400px",field:"prospectcompanyname"}
		]]
	},
	_add:function()
	{
		this.addctrl.load( this.adddialog);
		this.adddialog.show();
	}
});





