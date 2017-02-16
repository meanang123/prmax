//-----------------------------------------------------------------------------
// Name:    viewer.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/08/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.crm.task.viewer");

dojo.require("prmax.iadmin.TaskAdd");

dojo.declare("prmax.crm.task.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.crm.task","templates/viewer.html"),
	constructor: function()
	{
		this.filter_db = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/tasks',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
		});
	},
	_view : { noscroll: false,
		cells: [[
		{name: 'Owner',width: "150px",field:'user_name'},
		{name: 'Date',width: "60px",field:'due_date_display'},
		{name: 'Status',width: "80px",field:'taskstatusdescription'},
		{name: 'Type',width: "80px",field:'tasktypedescription'},
		{name: 'Subject',width: "150px",field:'subject'},
		{name: 'Diary Type',width: "80px",field:'tasktagdescription'}
		]]
	},
	postCreate:function()
	{
		this.viewer_grid.set("structure", this._view);
		this.viewer_grid._setStore(this.filter_db);

		this.viewer_grid.onRowClick = dojo.hitch(this,this.onSelectRow);
		this.viewer_grid.onStyleRow = dojo.hitch(this,this.onStyleRow);

		this.inherited(arguments);
	},
	onStyleRow: function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	onSelectRow : function(e) {
		var row=this.viewer_grid.getItem(e.rowIndex);
		this.viewer_grid.selection.clickSelectEvent(e);
	},
	_Filter:function()
	{
		this.viewer_grid.setQuery(ttl.utilities.getPreventCache(
				{contacthistorysourceid: this.contacthistorysourceid.get("value"),
				icustomerid : this._customerid
				}));
	},
	Load:function( icustomerid )
	{
		this._customerid = icustomerid;
		this.refresh() ;
	},
	refresh:function (  )
	{
		var query = { icustomerid : this._customerid}

		this.viewer_grid.setQuery(ttl.utilities.getPreventCache( query ) );
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	},
	_New:function()
	{
		this.newtaskctrl.Load ( PRMAX.utils.settings.groups, this.newtaskdialog, this.filter_db, this._customerid ) ;
		this.newtaskdialog.show();
	}
});