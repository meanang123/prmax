//-----------------------------------------------------------------------------
// Name:    OutetTypes.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/Circulation.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/json",
	"dijit/form/CheckBox",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template, std_search, lang, domattr, domclass, domstyle, json){
 return declare("prcommon2.search.Circulation",
	[BaseWidgetAMD,std_search],{
	templateString:template,
		name:"",		// name used for a form integration
		value:"",
		title : '',
		search : '',
		size:'9',
		testmode:false,
		constructor: function()
		{
			this._field_list = [1,2,3,4,5,6];
		},
		postCreate:function()
		{
			for ( var key in this._field_list)
			{
				var record = this._field_list[key];
				domattr.set(this["node_"+record+"_label"], "for", this["node_"+record].id);
			}
		},
		check_count:function()
		{
			this._get_selector(this._get_data());
		},
		// styandard clear function
		clear:function()
		{
			for ( var a in this._field_list)
				this["node_"+this._field_list[a]].set("value",false);
			this._get_selector("");
			this.inherited(arguments);
		},
		_setValueAttr:function( values )
		{
			var open = false;
			this.Clear();
			for ( var key in values.data )
			{
				var record = values.data[key];
				this["node_"+record].set("value",true);
				open = true ;
			}
			this._get_selector(this._getValueAttr());
			if ( open )
				this.make_open();
		},
		_getValueAttr:function()
		{
			return this._get_data();
		},
		_get_data:function()
		{
			var data = Array();
			var offset = 0 ;
			for ( var a in this._field_list)
			{
				if (this["node_"+this._field_list[a]].get("value")!=false)
				{
					data[offset] = parseInt(this._field_list[a]);
					++offset;
				}
			}
			if (this._extended)
			{
				return {data:data};
			}
			else
			{
				var data = offset>0?json.stringify(data):"";
				this.value = data;
				return data;
			}
		},
		_focus:function()
		{
			this.node_1.focus();
		}
});
});
