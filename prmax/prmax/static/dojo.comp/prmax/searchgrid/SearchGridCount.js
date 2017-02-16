//-----------------------------------------------------------------------------
// Name:    searchgrid.SearchGridCount.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/07/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.searchgrid.SearchGridCount");

dojo.declare("prmax.searchgrid.SearchGridCount",
	[ ttl.BaseWidget ],
	{
		templateString: '<div class="prmaxsearchgridcount" dojoAttachPoint="dataNode"></div>',
		constructor: function()
		{
		this._data = new PRMAX.SearchGridCount();
		},
		// styandard clear function
		Clear:function()
		{
			this._data.Clear();
			this._setMessage();

		},
		_setValueAttr:function( obj )
		{
			this._data.Set(obj);
			this._setMessage();
		},
		_setMessage:function()
		{
			var message = "Total: "+ this._data.total ;
			if ( this._data.appended>0 )
				message+="<br/>Appended: " + this._data.appended;
			if ( this._data.selected>0 )
					message+="<br/>Selected: " + this._data.selected;

			this.dataNode.innerHTML = message;
		}
	}
);





