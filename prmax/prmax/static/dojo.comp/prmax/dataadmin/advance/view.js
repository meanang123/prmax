//-----------------------------------------------------------------------------
// Name:    AdvanceDelete.js
// Author:  Chris Hoy
// Purpose:
// Created: 13/01/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.advance.view");

dojo.require("prcommon.date.DateSearchExtended");
dojo.require("prcommon.advance.advance");

dojo.declare("prmax.dataadmin.advance.view",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.advance","templates/view.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore (
			{	url:'/advance/viewpage',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});

		this._LoadCallBack = dojo.hitch(this, this._LoadCall);
		this._getModelItemCall = dojo.hitch(this,this._getModelItem);
	},
	postCreate:function()
	{
		this.searchgrid.set("structure",this.view);
		this.searchgrid._setStore(this.model );
		dojo.connect( this.search_form_pane,"onLoad", dojo.hitch(this,this._ConnectPane));

		this.searchgrid['onStyleRow'] = dojo.hitch(this,ttl.GridHelpers.onStyleRow);
		this.searchgrid['onRowClick'] = dojo.hitch(this,this.onSelectRow);
		this.searchgrid['onCellClick'] = dojo.hitch(this,this.onCellClick);

		this.inherited(arguments);
	},
	view:{
		cells: [[
			{name: 'Outlet Name',width: "200px",field:"outletname"},
			{name: 'Publication Date',width: "150px",field:"pub_date_display"},
			{name: 'Feature',width: "auto",field:"feature"}
			]]
	},
	onSelectRow : function(e) {
		var row=this.searchgrid.getItem(e.rowIndex);

		this.outlet_advance_ctrl.Load( row.i.advancefeatureid, row.i.outletid )
		dojo.removeClass(this.outlet_advance_ctrl.domNode,"prmaxhidden");
		this.searchgrid.selection.clickSelectEvent(e);
	},
	onCellClick : function(e)
	{
		this.onSelectRow(e);
	},
	_getModelItem:function()
	{
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	_ConnectPane:function( )
	{
		dojo.connect( dijit.byId(this.form_name),"onSubmit",dojo.hitch(this,this._Submit));
	},
	_Submit:function()
	{
		this._DoSearch();
	},
	_ClearSearch:function()
	{
		var form = this._getForm();
		dojo.every(form.getDescendants(),
			function(widget){
				if ( widget.Clear != null)
				{
					widget.Clear();
				}
				return true;
			});

		this.searchbutton.cancel();
	},
	_ClearSearchResults:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: dojo.hitch(this,this._ClearAllCall),
				url:'/advance/delete_list_all'
		}));
	},
	_ClearAllCall:function( response )
	{
		this.searchgrid.selection.clear();
		this.searchgrid.setQuery(ttl.utilities.getPreventCache({}));
		dojo.addClass(this.outlet_advance_ctrl.domNode,"prmaxhidden");
	},
	_Search:function()
	{
		this._DoSearch();
	},
	_DoSearch:function()
	{
		var form = this._getForm();
		form.setExtendedMode(false);
		var content = form.get("value");

		content["mode"] = 1 ;
		content['search_partial'] = 2;
		content['searchtypeid'] = 3 ;
		content['research'] = 1;

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadCallBack,
						url:'/search/dosearch',
						content: content
						}));
	},
	_LoadCall:function( response )
	{
		this.searchgrid.selection.clear();
		this.searchgrid.setQuery(ttl.utilities.getPreventCache({}));
		this.searchbutton.cancel();
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},
	_getForm:function()
	{
		var form = null;
		dojo.every(this.search_form_pane.selectedChildWidget.getDescendants(),
			function(widget)
			{
				if ( widget.formid != null)
					form = widget;
			});
		return form;
	}
});