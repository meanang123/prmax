//-----------------------------------------------------------------------------
// Name:    Publisher.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: June 2019
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/Publisher.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojox/data/JsonRestStore",	
	"prcommon2/search/std_search",
	"dijit/form/FilteringSelect",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template, std_search, lang, domattr, domclass, domstyle, json, ItemFileReadStore, JsonRest){
 return declare("prcommon2.search.Publisher",
	[BaseWidgetAMD,std_search],{
		templateString:template,
		constructor: function()
		{
			//this.store = new ItemFileReadStore ({ url:"/common/lookups?searchtype=frequencies&ignoreoption=1"});
			//this.store = new ItemFileReadStore ({ url:"/common/lookups?searchtype=publishers&ignoreoption=1"});

			this.store = new JsonRest( {target:'/research/admin/publisher/search_list',mode:'search', labelAttribute:"publishername",idProperty:"publisherid"});
//			this.store = new JsonRest( {target:'/research/admin/publisher/list', labelAttribute:"publishername",idProperty:"publisherid"});

		},
		postCreate:function()
		{
			this.select.set("store",this.store);
			this.select.set("value",-1);
		},
		_changed:function()
		{
			this._get_selector( this._get_data());
//			if (this.select.get("value") == null)
//			{
//				this.select.set("value", -1);
//				this._get_selector("All");
//			}
		},
		// styandard clear function
		clear:function()
		{
			this.select.set("value",-1);

			this._get_selector("All");

			this.inherited(arguments);
		},
		_setValueAttr:function( values )
		{
			var open = false;
			this.clear();
			this._get_selector(this._getValueAttr());
		},
		_getValueAttr:function()
		{
			return this._get_data();
		},
		_get_data:function()
		{
			if (this.select.get("value") == "")
			{
				this.select.set("value", -1);
			}
			var data = parseInt(this.select.get("value"));

			if (this._extended)
			{
				return {data:data};
			}
			else
			{
				this.value = (data != null && data != -1)  ? json.stringify(data):"";
				return this.value;
			}
		},
		_focus:function()
		{
			this.select.focus();
		},
		_capture_extended_content:function(stdfields)
		{
			var tmp  = this.inherited(arguments);

			tmp.partial = 0 ;

			return tmp;
		}
});
});





