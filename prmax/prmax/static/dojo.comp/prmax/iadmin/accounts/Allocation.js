//-----------------------------------------------------------------------------
// Name:    Allocation.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/04/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.Allocation");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("prmax.iadmin.accounts.ManualAllocateAmount");

dojo.declare("prmax.iadmin.accounts.Allocation",
	null,{
	alloc_cols:{
		cells: [[
			{name: 'Type',width: "160px", field:"typedescription"},
			{name: 'Nbr',width: "50px", field:"invoicenbr",styles:"text-align: right;padding-right:2px;"},
			{name: 'Ref',width: "60px", field:"invoiceref"},
			{name: 'Date',width: "70px", field:"invoicedate"},
			{name: 'Value',width: "60px", field:"invoiceamount_display", styles:"text-align: right;padding-right:2px;",formatter:ttl.utilities.Display_Money},
			{name: 'Unpaid',width: "60px", field:"unpaidamount_display", styles:"text-align: right;padding-right:2px;",formatter:ttl.utilities.Display_Money},
			{name: 'Allocate',width: "60px",field:"allocated",styles:"text-align: right;padding-right:2px;", formatter:ttl.utilities.Display_Money},
			{name: ' ',width: "1em",formatter:ttl.utilities.formatRowCtrl}
			]]
	},
	_AllocateInvoice:function()
	{
		this.alloc_store.setValue ( this._allocted_row , "allocated" , this._allocted_row.i.unallocated/100.0,true );
		this._onBlurAmount();
	},
	_AllocateAmount:function()
	{
		this.alloc_manual.setValues ( this, this._allocted_row.i.unallocated/100.0 );
	},
	onCellClick : function(e)
	{
		if ( e.cellIndex == 7 )
		{
			this._allocted_row = this.alloc_grid.getItem(e.rowIndex);

			if (this.private_menu ==null)
			{
				this.private_menu = new dijit.Menu();
				this.private_menu.addChild(new dijit.MenuItem({label:"Allocate Invoice", onClick:dojo.hitch(this,this._AllocateInvoice)}));
				this.private_menu.addChild(new dijit.MenuItem({label:"Allocate Amount", onClick:dojo.hitch(this,this._AllocateAmount)}));
			}

			this.private_menu._openMyself(e);
		}
	},
	_doallocation:function()
	{
		var amount = Math.abs(this.payment.get("value"));
		var amount_allocated = 0.0;

		for (var c = 0 ;  c < this.alloc_store._items.length; c++)
		{
			if ( this.alloc_store._items[c] == null ) continue;

			amount_allocated += dojo.number.round(parseFloat(this.alloc_store._items[c].i.allocated),2)
		}

		this.toallocate.set("value",dojo.number.round(amount - amount_allocated,2));
	},
	_postCreate:function()
	{
		this.alloc_grid.set("structure",this.alloc_cols );
		this.alloc_store = new prcommon.data.QueryWriteStore ( {url:'/iadmin/customer_to_allocate', clearOnClose:true, urlPreventCache:true, nocallback:true});
		this.alloc_grid._setStore( this.alloc_store );
		this.alloc_grid['onCellClick'] = dojo.hitch(this,this.onCellClick);
	},
	getAllocations:function()
	{
		var allocation = []
		count = 0

		for (var c = 0 ;  c < this.alloc_store._items.length; c++)
		{
			if ( this.alloc_store._items[c] == null ) continue;

			allocation[count]  = {
					keyid : this.alloc_store._items[c].i.key,
					amount : this.alloc_store._items[c].i.allocated
			};
			count += 1 ;
		}

		return dojo.toJson(allocation);

	}

});