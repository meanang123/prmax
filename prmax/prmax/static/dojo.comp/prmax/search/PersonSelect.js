//-----------------------------------------------------------------------------
// Name:    PersonSelect.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2014
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.search.PersonSelect");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Dialog");
dojo.require("ttl.Form");
dojo.require("prmax.search.standard");

dojo.require("prcommon.crm.add");

dojo.declare("prmax.search.PersonSelect",
	[ ttl.BaseWidget],
	{
	templatePath: dojo.moduleUrl( "prmax.search","templates/PersonSelect.html"),
	constructor: function()
	{
			this.filter_db= new prcommon.data.QueryWriteStore(
				{	url:'/search/list?searchtypeid=7',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
				});

			this._load_call_back = dojo.hitch(this,this._load_call);
			this._clear_call_back = dojo.hitch(this,this._clear_call);

	},
	start_search:function( on_select_func )
	{
		this.on_select_func = on_select_func;
		this.search_people_dlg.show();
	},
	_search:function()
	{
		this.form_name.setExtendedMode(false);
		var content = this.form_name.get("value");

		content["mode"] = 1 ;
		content['search_partial'] = 2;
		content['searchtypeid']=7

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._load_call_back,
				url:'/search/dosearch',
				content:content}));
	},
	_load_call:function(response)
	{
		this.viewer_grid.setQuery(ttl.utilities.getPreventCache({}));
	},
	view:{
		cells: [[
			{name: 'Outlet',width: "auto",field:'outletname'},
			{name: 'Contact',width: "auto",field:'contactname'}
			]]
	},
	postCreate:function()
	{
		this.viewer_grid.resize( {w:580, h:250,t:3} );

		this.viewer_grid.set("structure", this.view);
		this.viewer_grid._setStore(this.filter_db);
		this.viewer_grid.onRowClick = dojo.hitch(this, this._on_select_row);

		this.inherited(arguments);
	},
	_on_select_row:function(e)
	{
		this._row = this.viewer_grid.getItem(e.rowIndex);

		if ( this._row)
		{
			this.on_select_func(this._row.i.employeeid,this._row.i.outletid, this._row.i.contactname, this._row.i.outletname );
			this.search_people_dlg.hide();
		}
	},
	_clear:function()
	{
		this.std_search_outlet_contact_name.clear();
		this.std_search_outlet_outlet_name.clear();

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: dojo.hitch(this,this._clear_call_back),
				url:'/search/sessionclear',
				content:{searchtypeid:7}
			}));
	},
	_clear_call:function()
	{
		this.viewer_grid.setQuery(ttl.utilities.getPreventCache({}));
	}
});





