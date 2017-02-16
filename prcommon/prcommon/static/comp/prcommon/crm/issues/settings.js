//-----------------------------------------------------------------------------
// Name:    settings.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/08/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.issues.settings");

dojo.require("ttl.BaseWidget");

dojo.require("prcommon.crm.issues.briefingnoteadd");
dojo.require("prcommon.crm.issues.briefingnoteupdate");

dojo.declare("prcommon.crm.issues.settings",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.issues","templates/settings.html"),
	constructor: function()
	{
		this._dialog = null;
		this._add_call_back = dojo.hitch(this, this._add_call);
		this._error_call_back = dojo.hitch(this, this._error_call);
		this._delete_call_back = dojo.hitch(this, this._delete_call);

		this._store = new prcommon.data.QueryWriteStore (
			{url:'/crm/issues/briefingnotelist',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
			});

		dojo.subscribe("/bn/add", dojo.hitch(this,this._add_event));
		dojo.subscribe("/bn/upd", dojo.hitch(this,this._update_event));
	},
	view: {
		cells: [[
		{name: 'Items',width: "auto",field:"briefingnotesstatusdescription"},
		{name: ' ',width:"20px",formatter:ttl.utilities.editRowCtrl },
		{name: ' ',width:"20px",formatter:ttl.utilities.deleteRowCtrl }
		]]
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.grid.set("structure", this.view);
		this.grid._setStore(this._store);
		this.grid.onRowClick = dojo.hitch(this, this._on_select_row);
		this.force_startup();
	},
	_clear:function()
	{
	},
	_close:function()
	{
		this._clear();

		if ( this._dialog)
		{
			this._dialog.hide();
		}
	},
	_load_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._dialog.show();
		}
		else
		{
			alert("Problem Loading Settings");
		}
	},
	load:function()
	{
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
	},
	_add_briefing_status:function()
	{
		this.new_briefingnote_status_ctrl.set("dialog", this.new_briefingnote_status_dlg);
		this.new_briefingnote_status_dlg.show();
	},
	_on_select_row:function(e)
	{
		this._row = this.grid.getItem(e.rowIndex);

		if ( this._row )
		{
			switch ( e.cellIndex)
			{
			case 2:
				if ( confirm("Delete (" + this._row.i.briefingnotesstatusdescription + ")?"))
				{
					dojo.xhrPost(
						ttl.utilities.makeParams({
						load: this._delete_call_back,
						url:'/crm/issues/briefingnotedelete',
						error: this._error_call_back,
						content:{briefingnotesstatusid:this._row.i.briefingnotesstatusid}}));
				}
				break;
			default:
				this.upd_briefingnote_status_ctrl.set("dialog", this.upd_briefingnote_status_dlg);
				this.upd_briefingnote_status_ctrl.load(this._row.i.briefingnotesstatusid);
				break;
			}
		}
	},
	force_startup:function()
	{
		this.grid.resize( {w:400, h:250});
	},
	_delete_call:function( response)
	{
		if ( response.success=="OK")
		{
			this._store.deleteItem(this._row);
			this._row = null;
		}
		else
		{
			alert("Problem Deleting Briefing Status");
		}
	},
	_add_event:function(briefingnote)
	{
		this._store.newItem(briefingnote);
	},
	_update_event:function(briefingnote)
	{
		this._store.setValue(this._row,"briefingnotesstatusdescription", briefingnote.briefingnotesstatusdescription, true);
	}
});





