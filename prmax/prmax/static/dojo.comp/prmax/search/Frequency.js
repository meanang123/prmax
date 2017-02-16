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
dojo.provide("prmax.search.Frequency");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("dijit.form.CheckBox");
dojo.require("prcommon.search.std_search");

dojo.declare("prmax.search.Frequency",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		name:"",		// name used for a form integration
		value:"",
		title : '',
		search : '',
		size:'9',
		testmode:false,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.search","templates/Frequency.html"),
		constructor: function()
		{
			this.store = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=frequencies&ignoreoption=1"});
		},
		postCreate:function()
		{
			this.select.store = this.store;
			this.select.set("value",-1);
		},
		_Changed:function()
		{
			this._Get( this._getData());
		},
		// styandard clear function
		Clear:function()
		{
			this.select.set("value",-1);

			this._Get("");
			this.inherited(arguments);
		},
		_setValueAttr:function( values )
		{
			var open = false;
			this.Clear();
			this._Get(this._getValueAttr());
		},
		_getValueAttr:function()
		{
			return this._getData();
		},
		_getData:function()
		{
			var data = parseInt(this.select.get("value"));

			if (this._extended)
			{
				return {data:data};
			}
			else
			{
				this.value = (data != null && data != -1)  ? dojo.toJson(data):"";
				return this.value;
			}
		},
		_focus:function()
		{
			this.select.focus();
		},
		_CaptureExtendedContent:function(stdfields)
		{
			var tmp  = this.inherited(arguments);

			tmp.partial = 0 ;

			return tmp;


		}

	}
);





