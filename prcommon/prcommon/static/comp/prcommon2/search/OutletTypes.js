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
	"dojo/text!../search/templates/OutletTypes.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/json",
	"prcommon2/search/SearchCount",
	"dijit/form/CheckBox"
	], function(declare, BaseWidgetAMD, template, std_search, lang, domattr, domclass, domstyle, json){
 return declare("prcommon2.search.OutletTypes",
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
			this._field_list = [1,2,4,5,6,7,8,9,11];
			this._values = "";
		},
		postCreate:function()
		{
			for ( var key in this._field_list)
			{
				var record = this._field_list[key];
				domattr.set(this["node"+record+"label"], "for", this["node"+record].id);
			}
		},
		// styandard clear function
		clear:function()
		{
			for ( var a in this._field_list)
				this["node"+this._field_list[a]].set("value",false);
			this._get_selector(this._get_data());

			this.inherited(arguments);

		},
		_setValueAttr:function(values)
		{
			var open = false ;
			this.clear();
			for ( var key in values.data )
			{
				var record = values.data[key];
				this["node"+record].set("value",true);
				open = true ;
			}

			this._get_selector(this._get_data());
			if ( open )
				this.make_open();
		},
		_getValueAttr:function()
		{
			return this._get_data();
		},
		outlet_select:function()
		{
			var cvalue = this.value;

			this._get_selector(this._get_data());

		},
		_get_data:function()
		{
			var data = Array();
			var offset = 0 ;
			for ( var a in this._field_list)
			{
				if (this["node"+this._field_list[a]].get("value")!=false)
				{
					data[offset] = this._field_list[a];
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
				return data ;
			}
		},
		_focus:function()
		{
			this.node1.focus();
		}
});
});





