//-----------------------------------------------------------------------------
// Name:    prcommon.query.query
// Author:  Chris Hoy
// Purpose:
// Created: 13/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.query.query");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.form.CheckBox");

dojo.declare("prcommon.query.query",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.query","templates/query.html"),
	constructor: function()
	{
		this._QueryCallBack = dojo.hitch(this,this._QueryCall);
		this._QueryLoadCallBack = dojo.hitch(this,this._QueryLoadCall);
		this._QuerySaveCallBack = dojo.hitch(this,this._QuerySaveCall);
		this._QueryUpdateCallBack = dojo.hitch(this,this._QueryUpdateCall)

		this.queries = new dojox.data.QueryReadStore (
			{url:'/query/queries',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});

	},
	postCreate:function()
	{
		this.select.store = this.queries;

		this.inherited(arguments);

	},
	resize:function()
	{
		this.borderControl.resize(arguments);
		this.inherited(arguments);
	},
	_QueryCall:function (response )
	{
		if ( response.success == "OK" )
		{
			this.result_view.setContent ( response.data ) ;
		}
		else
		{
			alert("problem");
		}
		this.execute_button.cancel();
	},
	 _Execute:function()
	 {
		var query = dojo.attr(this.query_text,"value");

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._QueryCallBack,
			url:"/query/execute" ,
			content: {query_text:query}}));
	 },
	 _QueryLoadCall:function ( response )
	 {
		if ( response.success == "OK" )
		{
			dojo.attr(this.query_text,"value", response.data.query_text);
			this.visibletoresearch.set("value", response.data.typeid);
		}
		else
		{
			alert("problem");
		}
	 },
	_Load:function()
	{
			dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._QueryLoadCallBack,
			url:"/query/load" ,
			content: {queryhistoryid:this.select.get("value")}}));
	},
	_Save:function()
	{
		var query_text = dojo.attr(this.query_text,"value");
		if ( query_text.length>0)
		{
			this.savedlg.show();
		}
	},
	_CancelDialog:function()
	{
		this.savedlg.hide();
	},
	 _QuerySaveCall:function ( response )
	 {
		if ( response.success == "OK" )
		{
			alert("Query Saved");
			this._CancelDialog();
		}
		else
		{
			alert("problem");
		}
	 },
	_Query_Save:function()
	{
		if ( ttl.utilities.formValidator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			return;
		}

		var query_text = dojo.attr(this.query_text,"value");
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._QuerySaveCallBack,
			url:"/query/save" ,
			content: {query_text:query_text,subject:this.subject_name.get("value")}}));
	},
	_To_Excel:function()
	{
		this.query_text_to_excel.set("value", dojo.attr(this.query_text,"value"));
		this.tmp_to_excel.set("value", new Date());

		return true ;
	},
	_VisibleToResearch:function()
	{
		var content = {};
		content['queryhistoryid'] = this.select.get("value");
		content['visibletoresearch'] = this.visibletoresearch.get("value");
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._QueryUpdateCallBack,
			url:"/query/toresearch" ,
			content:content}));
	},
	 _QueryUpdateCall:function ( response )
	 {
		if ( response.success == "OK" )
		{
			alert("Query Updated");
		}
		else
		{
			alert("Problem");
		}
	 },		
});