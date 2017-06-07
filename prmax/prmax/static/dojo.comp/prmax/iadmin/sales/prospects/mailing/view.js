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
dojo.provide("prmax.iadmin.sales.prospects.mailing.view");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.Toolbar");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.grid.DataGrid");
dojo.require("dijit.layout.StackContainer");
dojo.require("prmax.iadmin.sales.prospects.mailing.create");
dojo.require("dijit.Dialog");

dojo.declare("prmax.iadmin.sales.prospects.mailing.view",
	[ ttl.BaseWidget,dijit.layout.BorderContainer ],
	{
	widgetsInTemplate: true,
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/mailing/templates/view.html"),
	constructor: function()
	{
		this._store = new dojox.data.JsonRestStore( {target:"/iadmin/prospects/mailing/list", idAttribute:"mailingid"});
		dojo.subscribe("/prospect/mailing/add", dojo.hitch(this, this._add_event));
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

		dojo.attr(this.csv_mailingid,"value", this._row.mailingid);
		dojo.attr(this.csv_mailing_form, "action","/iadmin/prospects/mailing/to_csv/" + this._row.mailingid);

		this.csv_mailing_form.submit();

		this.result_grid.selection.clickSelectEvent(e);

	},
	view: {
		cells: [[
		{name: " ",width: "12px",field:"",formatter:ttl.utilities.formatRowCtrl},
		{name: 'Mailing',width: "200px",field:"mailingname"}
		]]
	},
	_refresh:function()
	{
		this._clear_filter();
	},
	_clear_filter:function()
	{
		this.emailaddress.set("value","");
	},
	_execute_filter:function()
	{
		var filter = {};

		if ( arguments[0].emailaddress.length > 0 )
			filter["emailaddress"] = arguments[0].emailaddress;

		this.result_grid.setQuery( filter );
		this.clear();
	},
	_create:function()
	{
		this.createctrl.load( this.createdialog );
		this.createdialog.show();
	},
	_add_event:function( mailing )
	{
		this._store.newItem( mailing );

	}
});





