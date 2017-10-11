//-----------------------------------------------------------------------------
// Name:    prcommon.crm.responses.search.js
// Author:  
// Purpose:
// Created: Sept 2017
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.responses.search");

dojo.require("dojo.data.ItemFileReadStore");

dojo.declare("prcommon.crm.responses.search",
[ ttl.BaseWidget ],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.responses","templates/search.html"),
	constructor: function()
	{
		this._SelectCallback = dojo.hitch(this,this._Select_Call);
		this._statements =  new prcommon.data.QueryWriteStore({ url:"/common/lookups?searchtype=statements"});	
		dojo.subscribe('/statement/add',  dojo.hitch(this, this._AddStatementEvent));

		this.inherited(arguments);
	},
	postCreate:function()
	{
	
		this.statementid.set("store", this._statements);

		this.inherited(arguments);
	},
	Load:function ( dialog )
	{
		this._dialog = dialog;
	},	
	_select:function()
	{
		var content = {};
		content['statementid'] = this.statementid.value;
	
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SelectCallback,
			url:"/statement/statement_get",
			content:content}));
	
	},
	_Select_Call:function(response)
	{

		if (response.success = "OK")
		{
			dojo.publish('/statement/get', [{data:response.data}]);
			this._dialog.hide();
		}
	},
	_AddStatementEvent:function(statement)
	{
		statement.id = statement.statementid;
		statement.name = statement.statementdescription;
		this._statements.newItem(statement);
		this.statementid.set("value", statement.statementid);		
	},	
});





