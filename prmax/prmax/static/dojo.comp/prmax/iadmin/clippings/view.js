//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.clippings.view");

dojo.require("prmax.iadmin.clippings.add_order");
dojo.require("prmax.iadmin.clippings.update_order");
dojo.require("prmax.iadmin.clippings.update_expiry_date");

dojo.require("dojox.data.JsonRestStore");

dojo.declare("prmax.iadmin.clippings.view",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.clippings","templates/view.html"),
	constructor: function()
	{
		this._clippings_orders_model = new dojox.data.JsonRestStore( {target:'/iadmin/clippings/list_orders', idAttribute:"clippingsorderid"});
		this._get_model_item_call=dojo.hitch(this,this._get_model_item);
		dojo.subscribe("/clippings/order/add",dojo.hitch(this,this._add_order_event));
		dojo.subscribe("/clippings/order/upd",dojo.hitch(this,this._update_order_event));
		dojo.subscribe("/clippings/order/update_expiry_date",dojo.hitch(this,this._update_expiry_date_event));

		this._icustomerid = null;
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view1 );
		this.grid._setStore ( this._clippings_orders_model ) ;
		this.grid["onCellClick"] = dojo.hitch(this, this._on_cell_click_call);
		this.grid.onStyleRow = dojo.hitch(this, this._on_style_row_call);

		this.inherited(arguments);
	},
	_on_style_row_call:function(row)
	{
		try
		{
			var d = this._clippings_orders_model.getValue(this.grid.getItem(row.index), "enddate", null).split('-');
			var dd = new Date(d[0], d[1]-1, d[2]);

			if (dd < new Date())
			{
				row.customClasses += " prmaxOverDueRow";
			}
		}
		catch(e)
		{
		}
	},
	_on_cell_click_call:function ( e )
	{
		this._row = this.grid.getItem(e.rowIndex);

		this.clipping_upd_ctrl.load(this._row.clippingsorderid, this.clipping_upd_dialog, this._icustomerid, this.end_date );

		this.grid.selection.clickSelectEvent(e);
	},
	view1:{
		cells: [[
			{name: 'Clipping Order',width: "auto",field:"description"},
			{name: 'Source',width: "auto",field:"clippingsourcedescription"},
			{name: 'Price Level',width: "auto",field:"clippingpriceserviceleveldescription"},
			{name: 'Keywords',width: "auto",field:"keywords"},
			{name: 'Status',width: "auto",field:"clippingorderstatusdescription"},
			{name: 'Expiry Date',width: "auto",field:"enddate"},
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.formatRowCtrl}
			]]
	},
	resize:function()
	{
		this.border_control.resize(arguments[0]);
	},
	_add:function()
	{
		this.clipping_add_ctrl.clear();
		this.clipping_add_dialog.show();
	},
	load:function(icustomerid, end_date)
	{
		this.end_date = end_date;
		this._icustomerid = icustomerid;
		this.grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{icustomerid:icustomerid}));
		this.clipping_add_ctrl.load(this.clipping_add_dialog, icustomerid, end_date );

	},
	_add_order_event:function(order)
	{
		this._clippings_orders_model.newItem(order);
	},
	_update_order_event:function(order)
	{
		this.tmp_row = null;
		var item  = {identity:order.clippingsorderid,
				onItem:  this._get_model_item_call};
		this._clippings_orders_model.fetchItemByIdentity(item);
		if (this.tmp_row)
		{
			this._clippings_orders_model.setValue(  this.tmp_row, "description", order.description, true );
			this._clippings_orders_model.setValue(  this.tmp_row, "nbrclips", order.nbrclips, true );
			this._clippings_orders_model.setValue(  this.tmp_row, "clippingpriceserviceleveldescription", order.clippingpriceserviceleveldescription, true );
			this._clippings_orders_model.setValue(  this.tmp_row, "keywords", order.keywords, true );
			this._clippings_orders_model.setValue(  this.tmp_row, "enddate", order.enddate, true );
		}
	},
	_update_expiry_date_event:function(enddate)
	{
		for (var x =0; x <= this.grid._by_idx.length -1; x++ )
		{
			this._clippings_orders_model.setValue(  this.grid._by_idx[x].item, "enddate", enddate, true );
		}
	},
	_get_model_item:function()
	{
		this.tmp_row = arguments[0];
	},
	_update_expiry_date:function()
	{
		this.update_expiry_date_ctrl.clear();
		this.update_expiry_date_ctrl.load(this.update_expiry_date_dialog, this._icustomerid);
		this.update_expiry_date_dialog.show();
	}
});
