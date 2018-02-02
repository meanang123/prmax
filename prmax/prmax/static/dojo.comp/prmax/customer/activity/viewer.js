//-----------------------------------------------------------------------------
// Name:    prmax.customer.activity.viewer.js
// Author:  
// Purpose:
// Created: Jan 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.customer.activity.viewer");

dojo.require("prcommon.data.QueryWriteStore");
dojo.require("prcommon.date.daterange");
dojo.require("prmax.customer.activity.output");

dojo.declare("prmax.customer.activity.viewer",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.customer.activity","templates/viewer.html"),
	constructor: function()
	{
		this.client_model = new prcommon.data.QueryWriteStore(
			{	url:'/activity/activity_grid',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
		});

		this._users = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});
		this._objecttypes = new dojo.data.ItemFileReadStore ( { url:"/activity/objecttype_list"});
		
		this._Client_Added_Call_Back = dojo.hitch ( this, this._Client_Added_Call);
		this._Client_Update_Call_Back = dojo.hitch ( this, this._Client_Update_Call);

	},
	postCreate:function()
	{

		this.grid.set("structure",this.view1 );
		this.grid._setStore ( this.client_model ) ;
		this.grid["onCellClick"] = dojo.hitch(this, this._OnCellClick);

		this.filter_users.store = this._users;
		this.filter_objecttypes.store = this._objecttypes;

		this.inherited(arguments);
	},
	view1:{
		cells: [[
			{name: 'Date',width: "150px",field:"activitydate"},
			{name: 'Description',width: "auto",field:"description"},
			{name: 'Action',width: "60px",field:"actiontypedescription"},
			{name: 'Type',width: "100px",field:"type"},
			{name: 'User',width: "auto",field:"user_name"},
			]]
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	_execute_filter:function()
	{
		var filter = { drange: this.drange.get("value")};
		this.filter = filter;

		if ( arguments[0].user.length > 0 &&
					arguments[0].user != "" &&
					arguments[0].user != "-1")
			filter["user"] = arguments[0].user;

		if ( arguments[0].objecttype.length > 0 &&
					arguments[0].objecttype != "" &&
					arguments[0].objecttype != "-1")
			filter["objecttypeid"] = arguments[0].objecttype;

		this.grid.setQuery( filter );

	},
	_output_function:function()
	{
		this.output_ctrl.clear();
		this.output_ctrl.set("dialog", this.output_dlg);
		this.output_dlg.show();
	},
	_clear_filter:function()
	{
		this.filter_users.set("value", null);
		this.filter_objecttypes.set("value", null);
		this.drange.set("value", null);
	},	
	
});
