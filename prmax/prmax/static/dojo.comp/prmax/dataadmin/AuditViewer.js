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
dojo.provide("prmax.dataadmin.AuditViewer");

dojo.declare("prmax.dataadmin.AuditViewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	objecttypeid:-1,
	objectisbase:false,
	templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/AuditViewer.html"),
	constructor: function()
	{
		this.results = new dojox.data.QueryReadStore ( {url:'/dataadmin/audit_trail'} );
		this.details = new dojox.data.QueryReadStore ( {url:'/dataadmin/audit_details'} );
	},
	postCreate:function()
	{
		if (this.objectisbase==true)
			this.result_grid.set("structure",this.view_ext);
		else
			this.result_grid.set("structure",this.view);

		this.result_grid._setStore(this.results );

		this.details_grid.set("structure",this.view_details);
		this.details_grid._setStore(this.details );
		this.filterdate.set("value", new Date());


		dojo.connect(this.filterform, "onSubmit", dojo.hitch(this,this._Filter));
		this.result_grid.onRowClick = dojo.hitch(this,this._OnSelectRow);
		this.inherited(arguments);
	},
	_OnSelectRow : function(e) {

		this._row = this.result_grid.getItem(e.rowIndex);

		this.details_grid.setQuery( ttl.utilities.getPreventCache({ activityid: this._row.i.activityid}));

		this.result_grid.selection.clickSelectEvent(e);
	},
	view: {
		cells: [[ {name: 'Date',width: "120px",field:"activitydate"},
		{name: 'Action',width: "100px",field:"actiontypedescription"},
		{name: 'Reason',width: "auto",field:"reasoncodedescription"},
		{name: 'User',width: "auto",field:"display_name"},
		{name: 'Reason Details',width: "auto",field:"reason"}
		]]
	},
	view_ext: {
		cells: [[ {name: 'Date',width: "120px",field:"activitydate"},
		{name: 'Action',width: "100px",field:"actiontypedescription"},
		{name: 'Reason',width: "auto",field:"reasoncodedescription"},
		{name: 'User',width: "auto",field:"display_name"},
		{name: 'Reason Details',width: "auto",field:"reason"},
		{name: 'Type',width: "auto",field:"objecttypename"}
		]]
	},
	view_details: {
		cells: [[ {name: 'Field',width: "auto",field:"fieldname"},
		{name: 'From',width: "auto",field:"fromvalue"},
		{name: 'To',width: "auto",field:"tovalue"}
		]]
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
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
				objecttypeid: this.objecttypeid,
				objectisbase: this.objectisbase,
				objectid: this._objectid}));
	},
	Clear:function()
	{
		this.result_grid.setQuery( ttl.utilities.getPreventCache({}));
		this.details_grid.setQuery( ttl.utilities.getPreventCache({}));
	}
});





