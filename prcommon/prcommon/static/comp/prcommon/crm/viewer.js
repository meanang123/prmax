//-----------------------------------------------------------------------------
// Name:    viewer.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.viewer");

dojo.require("prcommon.crm.add");
dojo.require("prcommon.crm.update");
dojo.require("prcommon.crm.output");
dojo.require("prcommon.crm.settings");

dojo.require("prcommon.date.daterange");

dojo.declare("prcommon.crm.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm","templates/viewer.html"),
	constructor: function()
	{
		this.filter_db = new prcommon.data.QueryWriteStore (
			{url:'/crm/filter',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
		});

		this._issues = new dojox.data.QueryReadStore (
			{url:'/crm/issues/issues_list',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true});

		dojo.subscribe("/crm/newnote", dojo.hitch(this, this._new_crm_event));
		dojo.subscribe("/crm/update_note", dojo.hitch(this, this._update_crm_event));
		dojo.subscribe("/crm/update_note_close", dojo.hitch(this, this._close_update_crm_event));


		this._users = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});
		this._contacthistorystatus = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=contacthistorystatus&nofilter=1'});

		this._get_model_item_call = dojo.hitch(this,this._get_model_item);

		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});

	},
	view:{
		cells: [[
			{name: 'Date',width: "60px",field:'taken_display'},
			{name: 'Subject',width: "auto",field:'subject'},
			{name: 'Outlet',width: "auto",field:'outletname'},
			{name: 'Contact',width: "auto",field:'contactname'},
			{name: 'User',width: "120px",field:'display_name'},
			{name: 'Status',width: "120px",field:'contacthistorystatusdescription'}
			]]
	},
	postCreate:function()
	{
		this.viewer_grid.set("structure", this.view);
		this.viewer_grid._setStore(this.filter_db);
		this.viewer_grid.onRowClick = dojo.hitch(this, this.on_select_row);

		this.filter_taken_by.store = this._users;
		this.filter_followup_by.store = this._users;
		this.filter_issueid.store = this._issues;
		this.filter_contacthistorystatusid.store = this._contacthistorystatus;
		this.filter_contacthistorystatusid.set("value",-1);

		this.clientid.set("store",this._clients);
		this.clientid.set("value",-1);

		dojo.attr(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);

		this.inherited(arguments);
	},
	on_select_row:function(e)
	{
		this._selected_row = this.viewer_grid.getItem(e.rowIndex);

		this.update_crm_ctrl.load( this._selected_row.i.contacthistoryid, this._selected_row.i.contactemail);

	},
	_new_note:function()
	{
		this.crm_add.set("dialog",this.crm_dlg);
		this.crm_add.clear();
		this.crm_dlg.show();
	},
	refresh:function ( )
	{
		this._filter();
	},
	resize:function()
	{
		this.update_crm_ctrl.set("tmpsize",arguments[0]);
		this.frame.resize(arguments[0]);
	},
	_clear_filter:function()
	{
		this.filter_contacthistorystatusid.set("value", -1);
		this.filter_taken_by.set("value", null);
		this.filter_followup_by.set("value", null);
		this.filter_issueid.set("value", null);
		this.filter_subject.set("value", "");
		this.clientid.set("value",null);
	},
	_execute_filter:function()
	{
		var filter = { drange: this.drange.get("value")};
		this.filter = filter;

		if ( arguments[0].subject.length > 0 )
			filter["subject"] = arguments[0].subject;

		if ( arguments[0].contacthistorystatusid.length > 0 &&
					arguments[0].contacthistorystatusid != "" &&
					arguments[0].contacthistorystatusid != "-1")
			filter["contacthistorystatusid"] = arguments[0].contacthistorystatusid;

		if ( arguments[0].taken_by.length > 0 &&
					arguments[0].taken_by != "" &&
					arguments[0].taken_by != "-1")
			filter["taken_by"] = arguments[0].taken_by;

		if ( arguments[0].followup_by.length > 0 &&
					arguments[0].followup_by != "" &&
					arguments[0].followup_by != "-1")
			filter["followup_by"] = arguments[0].followup_by;

		if ( arguments[0].issueid.length > 0 &&
					arguments[0].issueid != "" &&
					arguments[0].issueid != "-1")
			filter["issueid"] = arguments[0].issueid;

		if ( arguments[0].clientid.length > 0 &&
				arguments[0].clientid != "" &&
				arguments[0].clientid != "-1")
			filter["clientid"] = arguments[0].clientid;

		this.update_crm_ctrl.clear();
		this.viewer_grid.setQuery( filter );

	},
	_output_function:function()
	{
		this.output_ctrl.clear();
		this.output_ctrl.set("dialog", this.output_dlg);
		this.output_dlg.show();
	},
	_new_crm_event:function( issue )
	{
		this.filter_db.newItem( issue );
	},
	_update_crm_event:function( data )
	{
		this.tmp_row = null;
		var item  = {identity:data.ch.contacthistoryid,
					onItem:  this._get_model_item_call};
			this.filter_db.fetchItemByIdentity(item);
			if (this.tmp_row)
			{
				this.filter_db.setValue(  this.tmp_row, "subject" , data.ch.crm_subject, true );
				this.filter_db.setValue(  this.tmp_row, "contacthistorystatusdescription" , data.status, true );
				this.filter_db.setValue(  this.tmp_row, "display_name" , data.display_name, true );
				this.filter_db.setValue(  this.tmp_row, "taken_display" , data.taken_date, true );
			}
	},
	_get_model_item:function()
	{
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	_settings_function:function()
	{
			this.settings_ctrl.set("dialog",this.settings_dlg);
			this.settings_ctrl.load();
	},
	_close_update_crm_event:function()
	{
		this.update_crm_ctrl.clear();
	}
});





