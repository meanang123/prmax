//-----------------------------------------------------------------------------
// Name:    ViewContact.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.crm.viewer");

dojo.declare("prmax.crm.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.crm","templates/viewer.html"),
	contacthistorysourceid_default:-1,
	taskview:false,
	constructor: function()
	{
		this._SetContactNoteCallBack = dojo.hitch( this , this._SetContactNoteCall);
		this._customerid = -2 ;
		this._taskid = null;
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));
		dojo.subscribe(PRCOMMON.Events.Crm_Note_Add, dojo.hitch(this,this._AddNoteEvent));
		dojo.subscribe(PRCOMMON.Events.Crm_Note_Update, dojo.hitch(this,this._UpdateNoteEvent));
		dojo.subscribe(PRCOMMON.Events.Crm_Note_Delete, dojo.hitch(this,this._DeleteNoteEvent));

		this.filter_db = new prcommon.data.QueryWriteStore (
			{url:'/crm/filter',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
		});
	},
	view:{
		cells: [[
			{name: 'Date',width: "120px",field:'taken_display'},
			{name: 'Subject',width: "auto",field:'subject'},
			{name: 'Source Type',width: "auto",field:'contacthistorydescription'},
			{name: 'Source',width: "auto",field:'source'}
			]]
	},
	view2:{
		cells: [[
			{name: 'Date',width: "120px",field:'taken_display'},
			{name: 'Subject',width: "auto",field:'subject'}
			]]
	},

	postCreate:function()
	{
		this.contacthistorysourceid.store = PRCOMMON.utils.stores.ContactHistoryTypes( true );
		this.contacthistorysourceid.set("value", this.contacthistorysourceid_default);
		if ( this.taskview )
		{
			this.viewer_grid.set("structure", this.view2);
			dojo.addClass(this.controls.domNode, "prmaxhidden");
		}
		else
		{
			this.viewer_grid.set("structure", this.view);
		}
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

		this.view_details.Load ( row.i.contacthistoryid);
		this.viewer_grid.selection.clickSelectEvent(e);
	},
	_Filter:function()
	{
		var query = {contacthistorysourceid: this.contacthistorysourceid.get("value"),
				icustomerid : this._customerid
				};
		if ( this._taskid )
			query["taskid"] = this._taskid;

		this.viewer_grid.setQuery(ttl.utilities.getPreventCache( query ));
	},
	_AddNoteShow:function()
	{
		this.addctrl.show();
	},
	LoadControls:function( outletid, employeeid, contactid, ref_customerid, taskid )
	{
		this._customerid = ref_customerid;
		this.addctrl1.LoadControls( outletid, employeeid, contactid, ref_customerid, taskid );
		this.view_details.Clear();

		if ( this._customerid != null && this.contacthistorysourceid_default != -1 )
		{
			this.addctrl1.set("contacthistorysourceid_default" , this.contacthistorysourceid_default);
				this._Filter();
		}
		this.refresh( ) ;
	},
	refresh:function ( )
	{
		this._Filter();
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	},
	_DialogCloseEvent:function(  source )
	{
		if ( source == "add_contact" )
			this.addctrl.hide();
	},
	_AddNoteEvent:function ( notes )
	{
		this.filter_db.newItem ( notes ) ;
	},
	_SetContactNoteCall:function()
	{
		this._row = arguments[0];
	},
	_UpdateNoteEvent:function ( notes )
	{
		this._row = null;
		var item  =	{
				identity: notes.contacthistoryid,
				onItem: this._SetContactNoteCallBack};

		this.filter_db.fetchItemByIdentity(item);
		if  (this._row )
		{
			this.filter_db.setValue(  this._row, "subject" , notes.subject, true );
			this.filter_db.setValue(  this._row, "contacthistorydescription" , notes.contacthistorydescription, true );
		}
	},
	_DeleteNoteEvent:function( contacthistoryid )
	{
		this._row = null;
		var item  =	{
				identity: contacthistoryid,
				onItem: this._SetContactNoteCallBack};

		this.filter_db.fetchItemByIdentity(item);
		if  (this._row )
			this.filter_db.deleteItem( this._row );
	}
});





