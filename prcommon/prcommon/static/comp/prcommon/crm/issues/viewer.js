//-----------------------------------------------------------------------------
// Name:    viewers.js
// Author:  Chris Hoy
// Purpose:
// Created: 16/06/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.issues.viewer");

dojo.require("prcommon.data.QueryWriteStore");

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.TextBox");
dojo.require("dojox.grid.DataGrid");

dojo.require("prcommon.crm.issues.add");
dojo.require("prcommon.crm.issues.update");
dojo.require("prcommon.crm.issues.archive");
dojo.require("prcommon.crm.issues.settings");

dojo.declare("prcommon.crm.issues.viewer",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.issues","templates/viewer.html"),
	constructor: function()
	{

		this._briefingnotesstatus = new dojo.data.ItemFileReadStore ( { url:"/common/lookups_restricted?searchtype=briefingnotesstatus&nofilter=1"});

		this.filter_db = new prcommon.data.QueryWriteStore (
			{url:'/crm/issues/issues_list',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
			});

		this._menu = null;
		this._menu2 = null;

		this._get_model_item_call = dojo.hitch(this,this._get_model_item);
		dojo.subscribe(PRCOMMON.Events.Issue_Add, dojo.hitch(this,this._new_issue_event));
		dojo.subscribe(PRCOMMON.Events.Issue_Update, dojo.hitch(this,this._update_issue_event));
	},
	view:{
		cells: [[
			{name: 'Created', width: "120px",field: 'created_display'},
			{name: 'Name', width: "auto",field: 'name'},
			{name: 'Status', width: "120px",field: 'issuestatusdescription'},
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.formatRowCtrl}
			]]
	},
	postCreate:function()
	{
		this.viewer_grid.set("structure", this.view);
		this.viewer_grid._setStore(this.filter_db);
		this.viewer_grid.onRowClick = dojo.hitch(this, this.on_select_row);
		this.filter_briefingnotesstatusid.set("store",this._briefingnotesstatus);
		this.filter_briefingnotesstatusid.set("value",-1);

		this.addbtn.set("label", "New " + PRMAX.utils.settings.issue_description);


		this.inherited(arguments);

	},
	on_select_row : function(e)
	{
		this._selected_row = this.viewer_grid.getItem(e.rowIndex);

		if ( e.cellIndex == 4 )
		{
			var menu = null;

			if (this._selected_row.i.issuestatusid == "1" )
			{
				if (this._menu===null)
				{
					this._menu = new dijit.Menu();
					this._menu.addChild(new dijit.MenuItem({label:"View", onClick:dojo.hitch(this,this._update_issue)}));
					this._menu.addChild(new dijit.MenuItem({label:"Archive", onClick:dojo.hitch(this,this._archive_issue)}));
					this._menu.addChild(new dijit.MenuItem({label:"New", onClick:dojo.hitch(this,this._add_issue)}));
					this._menu.startup();
				}
				menu = this._menu;
			}
			else
			{
				if (this._menu2===null)
				{
					this._menu2 = new dijit.Menu();
					this._menu2.addChild(new dijit.MenuItem({label:"View", onClick:dojo.hitch(this,this._update_issue)}));
					this._menu2.addChild(new dijit.MenuItem({label:"Un Archive", onClick:dojo.hitch(this,this._unarchive_issue)}));
					this._menu2.addChild(new dijit.MenuItem({label:"New", onClick:dojo.hitch(this,this._add_issue)}));
					this._menu2.startup();
				}
				menu = this._menu2;
			}

			menu._openMyself(e);
		}
		else
		{
			this.update_issue_ctrl.load(this._selected_row.i.issueid);
		}
		this.viewer_grid.selection.clickSelectEvent(e);
	},
	_filter:function()
	{
		var query = {};

		if ( arguments[0].autoonly != "1" )
			query["all_issues"] = 1;

		if ( arguments[0].issuename != "" )
			query["issuename"] = arguments[0].issuename;

		if (arguments[0].briefingnotesstatusid != "-1")
			query["briefingnotesstatusid"] = arguments[0].briefingnotesstatusid;

		this.viewer_grid.setQuery(ttl.utilities.getPreventCache( query ));
		this.update_issue_ctrl.clear();

	},
	refresh:function ( )
	{
		this._filter();
	},
	_add_issue:function()
	{
		this.update_issue_ctrl.clear();
		this.new_issue_ctrl.set("dialog",this.new_issue_dlg);
		this.new_issue_ctrl.clear();
		this.new_issue_dlg.show();
	},
	_clear_filter:function()
	{
		this.autoonly.set("checked",true);
		this.issuename.set("value","");
		this.filter_briefingnotesstatusid.set("value",-1);
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	_new_issue_event:function(data)
	{
		this.filter_db.newItem(data);
	},
	_update_issue_event:function(data)
	{
		this.tmp_row = null;
		var item  = {identity:data.issueid,
					onItem:  this._get_model_item_call};
			this.filter_db.fetchItemByIdentity(item);
			if (this.tmp_row)
			{
				this.filter_db.setValue(  this.tmp_row, "issuestatusdescription" , data.issuestatusdescription, true );
				this.filter_db.setValue(  this.tmp_row, "name" , data.name, true );
			}
	},
	_update_issue:function()
	{
		this.update_issue_ctrl.load(this._selected_row.i.issueid);
	},
	_archive_issue:function()
	{
		this.archive_issue_ctrl.set("dialog",this.archive_issue_dlg);
		this.archive_issue_ctrl.load(this._selected_row.i,"archive");
		this.archive_issue_dlg.show();
	},
	_unarchive_issue:function()
	{
		this.archive_issue_ctrl.set("dialog",this.archive_issue_dlg);
		this.archive_issue_ctrl.load(this._selected_row.i,"unarchive");
		this.archive_issue_dlg.show();

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
		this.settings_dlg.show();
		this.settings_ctrl.force_startup();
	}
});





