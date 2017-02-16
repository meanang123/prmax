//-----------------------------------------------------------------------------
// Name:    search.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.search");

dojo.require("prmax.dataadmin.employees.ContactInterests");

dojo.declare("prmax.dataadmin.search",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	searchtypeid:3,
	templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/search.html"),
	form_name:"std_search_outlet_form",
	constructor: function()
	{

		this.model = new prcommon.data.QueryWriteStore (
			{	url:'/search/list?searchtypeid=' + this.searchtypeid + '&research=1',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});

		this._LoadCallBack = dojo.hitch(this, this._LoadCall);
		this._getModelItemCall = dojo.hitch(this,this._getModelItem);

		dojo.subscribe(PRCOMMON.Events.SearchSession_Changed, dojo.hitch(this,this._SearchUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.Outlet_Updated, dojo.hitch(this,this._OutletUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.Outlet_Deleted, dojo.hitch(this,this._OutletDeletedEvent));
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._CloseDialogEvent));
	},
	postCreate:function()
	{
		this.searchgrid.set("structure",this.view);
		this.searchgrid._setStore(this.model );
		dojo.connect( this.search_form_pane,"onLoad", dojo.hitch(this,this._ConnectPane));

		this.baseonCellClick = this.searchgrid['onCellClick'];
		this.searchgrid['onStyleRow'] = dojo.hitch(this,ttl.GridHelpers.onStyleRow);
		this.searchgrid['onRowClick'] = dojo.hitch(this,this.onSelectRow);
		this.searchgrid['onCellClick'] = dojo.hitch(this,this.onCellClick);

		this.inherited(arguments);
	},
	_ConnectPane:function( )
	{
		dojo.connect( dijit.byId(this.form_name),"onSubmit",dojo.hitch(this,this._Submit));
	},
	_Submit:function()
	{
		this._DoSearch();
	},
	_Search:function()
	{
		this._DoSearch();
	},
	_LoadCall:function( response )
	{
		dojo.publish(PRCOMMON.Events.SearchSession_Changed , [response.data]);
		this.searchbutton.cancel();
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
	view: {
		cells: [[
		{name: ' ',width: "6px",styles: 'text-align: center;', width: "6px",field:'prmax_outletgroupid',formatter:ttl.utilities.outletType},//type: dojox.grid.cells.Bool},
		{name: 'Name',width: "auto",field:"outletname"},
		{name: 'Contact',width: "auto",field:"contactname"},
		{name: 'Source',width: "50px",field:"sourcename"},
		{name: 'Id',width: "50px",field:"outletid"}
		]]
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	destroy:function()
	{
		try
		{
			this.inherited(arguments);
		}
		catch(e){}
	},
	_SearchUpdateEvent:function( data )
	{
		this.refresh( data );
	},
	refresh:function()
	{
		this.searchgrid.selection.clear();
		this.searchgrid.setQuery(ttl.utilities.getPreventCache({}));
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
				url:'/search/sessionclear',
				content:{searchtypeid:3}
		}));
	},
	_ClearAllCall:function( response )
	{
		if ( response.success=="OK")
		{
			this.refresh({ outletid : -1 ,  employeeid: -1, outlettypeid:-1 } );
		}
	},
	onSelectRow : function(e) {
		var row=this.searchgrid.getItem(e.rowIndex);
		dojo.publish(PRCOMMON.Events.Display_Load , [ row.i.outletid, row.i.prmax_outletgroupid] );
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
	_OutletUpdateEvent:function( outlet )
	{
		for ( var key in outlet.search )
		{
			this.tmp_row = null;
			var item  = {identity:outlet.search[key],
						onItem: this._getModelItemCall};
			this.model.fetchItemByIdentity(item);
			if (this.tmp_row)
			{
				this.model.SetNoCallBackMode(true);
				this.model.setValue(  this.tmp_row, "contactname" , outlet.employee.contactname, true );
				this.model.setValue(  this.tmp_row, "outletname" , outlet.outlet.outletname, true );
			}
		}
	},
	_OutletDeletedEvent:function( outlet )
	{
		for ( var key in outlet.search )
		{
			this.tmp_row = null;
			var item  = {identity:outlet.search[key],
						onItem:  this._getModelItemCall};
			this.model.fetchItemByIdentity(item);
			if (this.tmp_row)
				this.model.deleteItem(this.tmp_row);
		}
	},
	_ContactInterests:function()
	{
		this.contact_interest_dlg.show();
	},
	_CloseDialogEvent:function()
	{
		this.contact_interest_dlg.hide();
	}
});





