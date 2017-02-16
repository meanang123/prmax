//-----------------------------------------------------------------------------
// Name:    ManualAllocateAmount.js
// Author:  Chris Hoy
// Purpose:
// Created: 18/04/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.ManualAllocateAmount");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.ManualAllocateAmount",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/ManualAllocateAmount.html"),
	setValues:function( pctrl , maxvalue )
	{
		this.pctrl = pctrl ;
		this.Clear();
		this.toallocate_value.constraints.max = maxvalue;
		this.popup_view.show();
	},
	Clear:function()
	{
		this.toallocate_value.set("value",0.01);
	},
	_Close:function()
	{
		this.popup_view.hide();
		this.Clear();
	},
	_Allocate:function()
	{
		// verify amount
		if ( this.toallocate_value.isValid() == false )
			return;

		// check
		if ( this.pctrl._allocted_row.i.unpaidamount/100 < this.toallocate_value.get("value") )
		{
			alert("Over Allocation");
			return false ;
		}

		this.pctrl.alloc_store.setValue ( this.pctrl._allocted_row , "allocated" , this.toallocate_value.get("value"),true );
		this.pctrl._onBlurAmount();
		this._Close();
	}
});