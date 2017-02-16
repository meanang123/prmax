//-----------------------------------------------------------------------------
// Name:    TaskTags.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/05/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.TaskTags");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.TaskTags",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin","templates/TaskTags.html"),
	group:"accounts",
	constructor: function()
	{
		this._AddTaskCallBack = dojo.hitch(this, this._AddTaskCall);
		this._DeleteTaskCallBack = dojo.hitch ( this, this._DeleteTaskCall);
		this._UpdateTaskCallBack = dojo.hitch ( this, this._UpdateTaskCall);

		this._tasktags = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/tasktags?group=' + this.group,
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
			});
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.view_grid.set("structure",this.view);
		this.view_grid._setStore(this._tasktags);
		this.view_grid['onRowClick'] = dojo.hitch(this,this._OnSelectRow);
		this.group1.set("value", this.group);
		this.group2.set("value", this.group);
	},
	_OnSelectRow : function(e)
	{
		this._row = this.view_grid.getItem(e.rowIndex);
		if ( e.cellIndex  == 1)
		{
			if ( confirm("Delete Diary Type " + this._row.i.tasktagdescription + "?"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._DeleteTaskCallBack,
					url:'/iadmin/tasktags_delete',
					content: { tasktagid: this._row.i.tasktagid}}));
			}
		}
		else if ( e.cellIndex == 2 )
		{
			this.tasktagdescription2.set("value", this._row.i.tasktagdescription);
			this.tasktagid.set("value", this._row.i.tasktagid);

			this.tasktagupddialog.show();
		}
		this.view_grid.selection.clickSelectEvent(e);
	},
	view:{noscroll: false,
			cells: [[
			{name: 'Diary Type',width: "400px",field:'tasktagdescription'},
			{name: ' ',width: "2em",field:'tasktagid',formatter:ttl.utilities.deleteRowCtrl},
			{name: ' ',width: "2em",field:'tasktagid',formatter:ttl.utilities.formatRowCtrl}
		]]
	},
	resize:function()
	{
		this.borderControl.resize ( arguments[0] ) ;
		this.inherited(arguments);

	},
	_New:function()
	{
		this.tasktagdescription.set("value","");
		this.tasktagdialog.show();
		this.tasktagdescription.focus();
	},
	_Close:function()
	{
		this.tasktagdialog.hide();
	},
	_Add:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			this.addbtn.cancel();
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._AddTaskCallBack,
			url:'/iadmin/tasktags_add',
			content:this.form.get("value")}));
	},
	_AddTaskCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._tasktags.newItem( response.data );
			this._Close();
			this.tasktagdescription.set("value","");
		}
		else if ( response.success == "DU")
		{
			alert("Already exists");
		}
		else
		{
			alert("Problem Adding");
		}

		this.addbtn.cancel();
	},
	_DeleteTaskCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._tasktags.deleteItem( this._row )
		}
		else
		{
			alert("Problem Deleting (Probably in use)");
		}
	},
	_UpdateTaskCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._tasktags.setValue(this._row, "tasktagdescription" , response.data.tasktagdescription, true ) ;
			this._Close2();
		}
		else if ( response.success == "DU")
		{
			alert("Already Exists");
			this.tasktagdescription2.focus();
		}
		else
		{
			alert("Problem Adding");
		}

		this.updbtn.cancel();
	},
	_Update:function()
	{
		if (ttl.utilities.formValidator( this.formupd ) == false )
		{
			this.updbtn.cancel();
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._UpdateTaskCallBack,
			url:'/iadmin/tasktags_update',
			content:this.formupd.get("value")}));
	},
	_Close2:function()
	{
		this.tasktagupddialog.hide();
	}
});