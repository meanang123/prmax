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
dojo.provide("prmax.search.OutletTypes");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("dijit.form.CheckBox");
dojo.require("prcommon.search.std_search");

dojo.declare("prmax.search.OutletTypes",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		name:"",		// name used for a form integration
		value:"",
		title : '',
		search : '',
		size:'9',
		testmode:false,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.search","templates/OutletTypes.html"),
		constructor: function()
		{
			this._fieldList = [1,2,4,5,6,7,8,9,11];
			this._values = "";
		},
		postCreate:function()
		{
			for ( var key in this._fieldList)
			{
				var record = this._fieldList[key];
				dojo.set(this["node"+record+"label"], "for", this["node"+record].id);
			}
		},
		// styandard clear function
		Clear:function()
		{
			for ( var a in this._fieldList)
				this["node"+this._fieldList[a]].set("value",false);
			this._Get(this._getData());
			this.inherited(arguments);

		},
		_setValueAttr:function(values)
		{
			var open = false ;
			this.Clear();
			for ( var key in values.data )
			{
				var record = values.data[key];
				this["node"+record].set("value",true);
				open = true ;
			}

			this._Get(this._getData());
			if ( open )
				this.MakeOpen();
		},
		_getValueAttr:function()
		{
			return this._getData();
		},
		outletSelect:function()
		{
			var cvalue = this.value;

			this._Get(this._getData());

		},
		_getData:function()
		{
			var data = Array();
			var offset = 0 ;
			for ( var a in this._fieldList)
			{
				if (this["node"+this._fieldList[a]].get("value")!=false)
				{
					data[offset] = this._fieldList[a];
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
				return data ;
			}
		},
		_focus:function()
		{
			this.node1.focus();
		}
});





