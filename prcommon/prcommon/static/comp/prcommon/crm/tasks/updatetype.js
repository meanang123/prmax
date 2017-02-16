//-----------------------------------------------------------------------------
// Name:    updatetype.js
// Author:  
// Purpose:
// Created: 13/02/2017
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.tasks.updatetype");

dojo.declare("prcommon.crm.tasks.updatetype",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.tasks","templates/updatetype.html"),

	constructor: function()
	{
		this._load_call_back = dojo.hitch( this, this._load_call);
		this._upd_call_back =  dojo.hitch( this, this._upd_call);

		this._tasktypestatus = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=tasktypestatus"});

	},
	postCreate:function()
	{
		this.tasktypestatusid.store = this._tasktypestatus;
		this.inherited(arguments);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.tasktypestatusid.set("value", response.data.tasktypestatusid);
			this.tasktypedescription.set("value", response.data.tasktypedescription);
		}
		else
		{
			alert("Problem Loading Task Type");
		}
	},

	load:function(dialog, tasktypeid)
	{
		this._tasktypeid = tasktypeid;
		this._dialog = dialog;
		this._clear();
		
		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._load_call_back,
						url:"/crm/tasks/get_tasktype" ,
						content: {tasktypeid:this._tasktypeid}
						}));
	},
	_clear:function()
	{
		this.updbtn.cancel();
		this.tasktypedescription.set("value","");
		this.tasktypestatusid.set("value",1);
	},	
	_close:function()
	{
		if (this._dialog != null )
			this._dialog.hide();
	},	
	_update_tasktype:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.updbtn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content['tasktypeid'] = this._tasktypeid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._upd_call_back),
			url:'/crm/tasks/tasktype_update',
			content: content}));

	},
	_upd_call:function(response)
	{
		if ( response.success == "OK" )
		{
			alert("Task Type Updated");
			this._close();
			this._clear();
			dojo.publish ("tasktype/update", [response.data]);
			
		}
		else
		{
			alert("Problem Updating Task");
		}

		this.updbtn.cancel();
	}
});





