//-----------------------------------------------------------------------------
// Name:    AuditViewer.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.AuditDelete");

dojo.declare("prmax.dataadmin.AuditDelete",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	objecttypeid:1,
	templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/AuditDelete.html"),
	constructor: function()
	{
		this.results = new dojox.data.QueryReadStore ( {url:'/dataadmin/audit_delete_trail'} );
	},
	postCreate:function()
	{
		this.result_grid.set("structure",this.view);
		this.result_grid._setStore(this.results );
		this.filterdate.set("value", new Date());
		dojo.connect(this.filterform, "onSubmit", dojo.hitch(this,this._Filter));
		this.inherited(arguments);
	},
	view: {
		cells: [[ {name: 'Date',width: "100px",field:"activitydate"},
		{name: 'Outlet Name',width: "auto",field:"name"},
		{name: 'Action',width: "60px",field:"actiontypedescription"},
		{name: 'Reason',width: "auto",field:"reasoncodedescription"},
		{name: 'User',width: "auto",field:"display_name"},
		{name: 'Reason Details',width: "auto",field:"reason"}
		]]
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	},
	Load:function(  objectid )
	{
		this.Clear();
		this._objectid = objectid;
	},
	_Filter:function()
	{
		var d = this.filterdate.get("value");
		this.result_grid.setQuery( ttl.utilities.getPreventCache({filterdate:d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate(),
				objecttypeid: this.objecttypeid}));
	},
	Clear:function()
	{
		this.result_grid.setQuery( ttl.utilities.getPreventCache({}));
	}
});





