//-----------------------------------------------------------------------------
// Name:    viewer_only.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.viewer_only");

dojo.require("prcommon.crm.add");
dojo.require("prcommon.crm.output");

dojo.declare("prcommon.crm.viewer_only",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm","templates/viewer_only.html"),
	mode:"contact",
	basic_details_page:"/crm/basic_details_page?contacthistoryid=${contacthistoryid}",
	constructor: function()
	{
		this.filter_db = new prcommon.data.QueryWriteStore (
			{url:'/crm/filter_by_object',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
		});

		this._outletid = null;
		this._employeeid = null;
		dojo.subscribe("/crm/newnote", dojo.hitch(this, this._new_issue_event));

	},
	view1:{
		cells: [[
			{name: 'Date',width: "80px",field:'taken_display'},
			{name: 'Subject',width: "auto",field:'subject'},
			{name: 'Contact',width: "auto",field:'contactname'},
			{name: 'Status',width: "auto",field:'contacthistorystatusdescription'}
			]]
	},
	view2:{
		cells: [[
			{name: 'Date',width: "80px",field:'taken_display'},
			{name: 'Subject',width: "auto",field:'subject'},
			{name: 'Status',width: "auto",field:'contacthistorystatusdescription'}
			]]
	},
	postCreate:function()
	{
		if ( this.mode == "contact")
			this.view_grid.set("structure", this.view2);
		else
			this.view_grid.set("structure", this.view1);

		this.view_grid._setStore(this.filter_db);
		this.view_grid.onRowClick = dojo.hitch(this, this.on_select_row);

		this.inherited(arguments);
	},
	on_select_row:function(e)
	{
		var row = this.view_grid.getItem(e.rowIndex);

		console.log(row);

		if ( row )
			this.view_details.set("href",dojo.string.substitute(this.basic_details_page,{contacthistoryid:row.i.contacthistoryid}));

	},
	load_outlet:function(outletid)
	{
		this._outletid = outletid;
		this.view_grid.setQuery(ttl.utilities.getPreventCache({outletid:this._outletid}));
		this.crm_add.show_selection(false);
		this.crm_add.set("dialog",this.crm_dlg);
		this.view_details.set("content","");
	},
	load_employee:function(employeeid,outletid)
	{
		this._employeeid = employeeid;
		this._outletid = (outletid ==-1)?null:outletid;
		this.view_grid.setQuery( ttl.utilities.getPreventCache({employeeid:this._employeeid}));
		this.crm_add.show_selection(false);
		this.crm_add.set("dialog",this.crm_dlg);
		this.view_details.set("content","");
	},
	_new_note:function()
	{
		this.crm_add.clear();
		this.crm_add.set("dialog", this.crm_dlg);
		this.crm_add.load(this._outletid, this._employeeid);
		this.crm_dlg.show();
	},
	refresh:function ( )
	{
		this._filter();
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	_output_function:function()
	{
		this.output_ctrl.clear();
		this.output_ctrl.set("dialog", this.output_dlg);
		this.output_dlg.show();
	},
	_new_issue_event:function( issue )
	{

		if (( this.mode == "contact" && this._employeeid === issue.employeeid) ||
		    ( this.mode != "contact" && this._outletid === issue.outletid ))
			this.filter_db.newItem( issue );

		this.view_details.set("content","");
	}
});





