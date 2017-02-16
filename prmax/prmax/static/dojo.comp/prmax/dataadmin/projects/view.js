//-----------------------------------------------------------------------------
// Name:    create.js
// Author:  Chris Hoy
// Purpose:
// Created: 19/08/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.projects.view");

dojo.require("dojox.grid.DataGrid");
dojo.require("prmax.dataadmin.projects.outletwizard");
dojo.require("prmax.dataadmin.projects.edit");


dojo.declare("prmax.dataadmin.projects.view",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.projects","templates/view.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore (
			{	url:'/dataadmin/projects_list',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});
	},
	postCreate:function()
	{
		this.grid.set("structure", this.view);
		this.grid._setStore(this.model);
		this.grid.onRowClick = dojo.hitch(this,this._OnSelectRow);

		this.inherited(arguments);
	},
	_OnSelectRow:function ( e )
	{
		this._row = this.grid.getItem(e.rowIndex);
		if ( e.cellIndex == 6 )
		{
			this.edit.Load ( this._row.i );
			this.zone.selectChild ( this.edit ) ;
		}
		this.grid.selection.clickSelectEvent(e);
	},
	resize:function()
	{
		this.inherited(arguments);
		this.borderControl.resize ( arguments[0] ) ;
		//this.view.resize ( arguments[0] ) ;
	},
	view: {
		cells: [[
		{name: 'Project',width: "300px",field:"researchprojectname"},
		{name: 'Owner',width: "150px",field:"ownername"},
		{name: 'Nbr',width: "50px",field:"count", styles:'text-align: right;padding-right:5px;'},
		{name: 'Completed',width: "80px",field:"completed", styles:'text-align: right;padding-right:5px;'},
		{name: ' ', width: "12px", formatter:ttl.utilities.deleteRowCtrl},
		{name: ' ', width: "12px", formatter:ttl.utilities.editRowCtrl},
		{name: ' ', width: "12px", formatter:ttl.utilities.formatRowCtrl}
		]]
	},
	_ShowProjects:function()
	{
		this.zone.selectChild(this.projects);
	},
	_Refresh:function()
	{
		this.grid.setQuery(ttl.utilities.getPreventCache({}));
	}
});






