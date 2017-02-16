//-----------------------------------------------------------------------------
// Name:    prcommon.query.query
// Author:  Chris Hoy
// Purpose:
// Created: 13/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../query/templates/query.html",
	"dijit/layout/BorderContainer",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"ttl/utilities2",
	"dojox/data/JsonRestStore"
	], function(declare, BaseWidgetAMD, template,BorderContainer, lang, domattr,domclass,domstyle,request,utilities2, JsonRestStore){
 return declare("prcommon2.query.query",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._QueryCallBack = lang.hitch(this,this._QueryCall);
		this._QueryLoadCallBack = lang.hitch(this,this._QueryLoadCall);
		this._QuerySaveCallBack = lang.hitch(this,this._QuerySaveCall);

		this.queries =  new JsonRestStore({target:"/query/queries_research", idProperty:"queryhistoryid",  labelAttribute:"queryhistoryname"});
	},
	postCreate:function()
	{
		this.select.set("store",this.queries);

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

			request.post('/query/execute',
				utilities2.make_params({data:{ query_text:query}})).then
				(this._QueryCallBack);

	 },
	 _QueryLoadCall:function ( response )
	 {
		if ( response.success == "OK" )
		{
			dojo.attr(this.query_text,"value", response.data.query_text);
		}
		else
		{
			alert("problem");
		}
	 },
	_Load:function()
	{
		request.post('/query/load',
			utilities2.make_params({data:{ queryhistoryid:this.select.get("value")}})).then
			(this._QueryLoadCallBack);
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
		if ( utilities2.form_validator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			throw "B";
		}

		var query_text = dojo.attr(this.query_text,"value");
		request.post('/query/save2',
			utilities2.make_params({data:
			{query_text:query_text,
			subject:this.subject_name.get("value"),
			typeid:1
			}
			})).then
			(this._QuerySaveCallBack);
	},
	_To_Excel:function()
	{
		this.query_text_to_excel.set("value", dojo.attr(this.query_text,"value"));
		this.tmp_to_excel.set("value", new Date());

		return true ;
	}
});
});