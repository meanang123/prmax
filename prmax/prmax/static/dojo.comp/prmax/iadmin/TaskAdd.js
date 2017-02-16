//-----------------------------------------------------------------------------
// Name:    TaskAdd.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/05/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.TaskAdd");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.TaskAdd",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin","templates/TaskAdd.html"),
	constructor: function()
	{
		this._users = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=sales,accounts"});
		this._taskstatus =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus"});
		this.icustomerid_data = new dojox.data.QueryReadStore ( {url:'/iadmin/customers_combo', onError:ttl.utilities.globalerrorchecker, clearOnClose:true, urlPreventCache:true});
		this._tasktype = null;
		this._tasktags = null;

		this._AddCallBack = dojo.hitch(this, this._AddCall);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.taskstatusid.store = this._taskstatus;
		this.assigntoid.store = this._users;
		this.icustomerid.store = this.icustomerid_data;

	},
	Load:function ( group , dialog, model , customerid )
	{
		var command = "";

		if ( group != null )
			command = "&group=" + group;

		if ( this._tasktype == null )
		{
			this._tasktype = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=tasktype"+command});
			this._tasktags = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=tasktags"+command});
		}

		this.tasktypeid.store = this._tasktype;
		this.tasktagid.store = this._tasktags;


		this._dialog = dialog;
		this._model = model;
		this.group.set("value", group ) ;
		this._Clear();
		dojo.removeClass(this.tasktag,"prmaxhidden");
		if ( customerid )
			this.icustomerid.set("value", customerid ) ;
	},
	_Close:function()
	{
		this._dialog.hide();
	},
	_AddCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			if ( this._model )
				this._model.newItem( response.task ) ;
			this._dialog.hide();
			this._Clear();
		}
		else
		{
			alert("Problem Adding Task");
		}
		this.addbtn.cancel();
	},
	_Clear:function()
	{
		this.addbtn.cancel();

	},
	_Add:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["due_date"] = ttl.utilities.toJsonDate ( this.due_date.get("value") ) ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._AddCallBack),
			url:'/iadmin/task_add',
			content: content}));
	}
});