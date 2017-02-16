//-----------------------------------------------------------------------------
// Name:    prcommon.documents.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 17/09/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.documents.view");


dojo.require("ttl.GridHelpers");
dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojox.form.BusyButton");
dojo.require("dijit.form.Button");


dojo.require("prcommon.documents.adddialog");
dojo.require("prcommon.documents.update");

dojo.declare("prcommon.documents.view",
	[ ttl.BaseWidget ],
	{
	templatePath: dojo.moduleUrl( "prcommon.documents","templates/view.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore ( {
				url:'/crm/documents/document_list',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true } );

		this._show_func_call = dojo.hitch(this,this._show_func);

		dojo.subscribe(PRCOMMON.Events.Document_Deleted, dojo.hitch(this, this._delete_event));
		dojo.subscribe(PRCOMMON.Events.Document_Add, dojo.hitch(this, this._add_event));
		dojo.subscribe(PRCOMMON.Events.Document_Updated, dojo.hitch(this, this._update_event));
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view);

		this.grid['onStyleRow'] = dojo.hitch(this,this._on_style_row);
		this.grid['onCellClick'] = dojo.hitch(this,this._on_click_cell);

		this.grid._setStore(this.model);
	},
	_on_style_row:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	_on_click_cell : function(e)
	{
		// user click on a general display row
		this.grid.selection.clickSelectEvent(e);
		this._row = this.grid.getItem(e.rowIndex);
		this.details.load( this._row.i.documentid,this._show_func_call);

	},
	view: {
		cells: [[
		{name: 'Description',width: "200px",field:"description"},
		{name: 'Created Date',width: "100px",field:"created_display"},
		{name: 'Created By',width: "100px",field:"user_name"}

		]]
	},
	clear:function()
	{
		this.grid.setQuery(ttl.utilities.getPreventCache({}));
		this.controls.selectChild(this.blank);
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	_add_document:function()
	{
		this.addctrl.show();
	},
	_show_func:function(commandid)
	{
		switch(commandid)
		{
			case 1:
				this.controls.selectChild(this.details);
				break;
			case 2:
				this.controls.selectChild(this.blank);
				this.details.clear();
		}
	},
	_delete_event:function( documentid )
	{
		if ( this._row )
		{
			this.model.deleteItem ( this._row ) ;
			this._row = null;
		}

		this._show_func(2);
	},
	_add_event:function( ldocument )
	{
		this.model.newItem ( ldocument ) ;
	},
	_update_event:function( ldocument )
	{
		this.model.setValue(this._row,"description", ldocument.description, true);
	},
	_filter:function()
	{
		var query = {};

		if ( arguments[0].description != "" )
			query["filter_description"] = arguments[0].description;

		this.grid.setQuery(ttl.utilities.getPreventCache( query ));
		this._show_func(2);

	},
	_clear_filter:function()
	{

		this.description.set("value","");

	}
});





