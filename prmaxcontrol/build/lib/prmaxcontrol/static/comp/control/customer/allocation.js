//-----------------------------------------------------------------------------
// Name:    allocation.js
// Author:  
// Purpose:
// Created: 23/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dijit/Menu",
	"dijit/MenuItem",
	"ttl/grid/Grid",
	"dojo/store/util/SimpleQueryEngine",	
	"dojo/store/Memory",
	"control/customer/manual_allocate_amount"
	], function(declare, BaseWidgetAMD,request,utilities2,lang,topic,domclass,domattr,JsonRest,Observable,Menu,MenuItem, Grid, SimpleQueryEngine, MemoryStore){

return declare("control.customer.allocation", null,	{
	constructor: function()
	{
		this._allocation = null;
		this._load_allocation_call_back = lang.hitch ( this, this._load_allocation_call);
	},	
	_postCreate:function()
	{
		var cells =
		[
			{label: 'Type',className:"dgrid-column-status-small", field:"typedescription"},
			{label: 'Nbr',className:"dgrid-column-nbr-right", field:"invoicenbr"},
			{label: 'Ref',className:"dgrid-column-status-small", field:"invoiceref"},
			{label: 'Date',className:"dgrid-column-date", field:"invoicedate"},
			{label: 'Value',className:"dgrid-column-money", field:"invoiceamount_display",formatter:utilities2.display_money},
			{label: 'Unpaid',className:"dgrid-column-money", field:"unpaidamount_display", formatter:utilities2.display_money},
			{label: 'Allocate',className:"dgrid-column-money",field:"allocated",formatter:utilities2.display_money},
			{label: ' ',className:"dgrid-column-type-boolean",formatter:utilities2.format_row_ctrl}
		];		

		this.alloc_grid = new Grid({
			columns:cells,
			selectionMode: "single",
			store: this._allocation
		});

		this.alloc_grid_view.set("content", this.alloc_grid);
		this.alloc_grid.on(".dgrid-cell:click", lang.hitch(this, this.onCellClick));
	},
	load_allocation:function(customerid, source)
	{	
		this._customerid = customerid;
		this._source = source;
		request.post('/allocation/customer_to_allocate',
			utilities2.make_params({ data : {icustomerid:customerid, source:this._source}})).
			then(this._load_allocation_call_back);
				
	},
	_load_allocation_call:function(response)
	{
		this._allocation = new Observable(new MemoryStore());	
		
		if (response.length > 0)
		{
			for (var i = 0; i < response.length; i++)
			{
				this._allocation.put(response[i]);
			}
		}
		
		this.alloc_grid.set("store", this._allocation);
	},
	_AllocateInvoice:function()
	{
		this._allocted_row.allocated = this._allocted_row.unallocated/100.0;
		this._allocation.put(this._allocted_row);
	},
	_AllocateAmount:function()
	{
		this.alloc_manual.setValues ( this, this._allocted_row.unallocated/100.0 );
	},
	onCellClick : function(e)
	{
		var cell = this.alloc_grid.cell(e);
		
		if (cell.column.id == 7 )
		{
			this._allocted_row = cell.row.data;

			if (this.private_menu ==null)
			{
				this.private_menu = new Menu();
				this.private_menu.addChild(new MenuItem({label:"Allocate Invoice", onClick:lang.hitch(this,this._AllocateInvoice)}));
				this.private_menu.addChild(new MenuItem({label:"Allocate Amount", onClick:lang.hitch(this,this._AllocateAmount)}));
			}

			this.private_menu._openMyself(e);
		}
	},
	_doallocation:function()
	{
		var amount = Math.abs(this.payment.get("value"));
		var amount_allocated = 0.0;

		var line = SimpleQueryEngine(function(object){return true; })(this._allocation.data);

 		for (var c = 0 ;  c < line.length; c++)
		{
			if ( line[c] == null ) continue;
			amount_allocated += dojo.number.round(parseFloat(line[c].allocated),2)
		}

		this.toallocate.set("value",dojo.number.round(amount - amount_allocated,2));
	},
	getAllocations:function()
	{
		var allocation = []
		var count = 0

		var line = SimpleQueryEngine(function(object){return true; })(this._allocation.data);

		for (var c = 0 ;  c < line.length; c++)
		{
			if ( line[c] == null ) continue;

			allocation[count]  = {
					keyid : line[c].key,
					amount : line[c].allocated
			};
			count += 1 ;
		}

		return dojo.toJson(allocation);

	}
});
});