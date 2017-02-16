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
dojo.provide("prmax.search.Circulation");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("dijit.form.CheckBox");
dojo.require("prcommon.search.std_search");

dojo.declare("prmax.search.Circulation",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		name:"",		// name used for a form integration
		value:"",
		title : '',
		search : '',
		size:'9',
		testmode:false,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.search","templates/Circulation.html"),
		constructor: function()
		{
			this._fieldList = [1,2,3,4,5,6];
		},
		postCreate:function()
		{
			for ( var key in this._fieldList)
			{
				var record = this._fieldList[key];
				dojo.attr(this["node_"+record+"_label"], "for", this["node_"+record].id);
			}
		},
		checkCount:function()
		{
			this._Get(this._getData());
		},
		// styandard clear function
		Clear:function()
		{
			for ( var a in this._fieldList)
				this["node_"+this._fieldList[a]].set("value",false);
			this._Get("");
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
			this._Get(this._getValueAttr());
			if ( open )
				this.MakeOpen();
		},
		_getValueAttr:function()
		{
			return this._getData();
		},
		_getData:function()
		{
			var data = Array();
			var offset = 0 ;
			for ( var a in this._fieldList)
			{
				if (this["node_"+this._fieldList[a]].get("value")!=false)
				{
					data[offset] = parseInt(this._fieldList[a]);
					++offset;
				}
			}
			if (this._extended)
			{
				return {data:data};
			}
			else
			{
				var data = offset>0?dojo.toJson(data):"";
				this.value = data;
				return data;
			}
		},
		_focus:function()
		{
			this.node_1.focus();
		}
	}
);





