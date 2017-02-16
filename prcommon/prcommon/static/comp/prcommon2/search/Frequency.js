//-----------------------------------------------------------------------------
// Name:    Frequency.js
// Author:  Chris Hoy
// Purpose:
// Created: 24/11/2009
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/Frequency.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"prcommon2/search/std_search",
	"dijit/form/FilteringSelect",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template, std_search, lang, domattr, domclass, domstyle, json, ItemFileReadStore){
 return declare("prcommon2.search.Frequency",
	[BaseWidgetAMD,std_search],{
		templateString:template,
		name:"",
		value:"",
		title : '',
		search : '',
		size:'9',
		testmode:false,
		constructor: function()
		{
			this.store = new ItemFileReadStore ({ url:"/common/lookups?searchtype=frequencies&ignoreoption=1"});
		},
		postCreate:function()
		{
			this.select.set("store",this.store);
			this.select.set("value",-1);
		},
		_changed:function()
		{
			this._get_selector( this._get_data());
		},
		// styandard clear function
		clear:function()
		{
			this.select.set("value",-1);

			this._get_selector("");

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





