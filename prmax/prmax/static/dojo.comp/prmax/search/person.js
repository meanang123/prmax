//-----------------------------------------------------------------------------
// Name:    person.js
// Author:  Chris Hoy
// Purpose:
// Created: 16/01/2017
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.search.person");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("dijit.form.TextBox");
dojo.require("prcommon.search.std_search");

dojo.declare("prmax.search.person",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		testmode:false,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.search","templates/person.html"),
		constructor: function()
		{
			this._on_input_call_back = dojo.hitch(this,this._on_input)
		},
		postCreate:function()
		{
			// capture the key strokes
			if(dojo.isMoz || dojo.isOpera)
			{
				// firefox used a single operation
				this.connect(this.data_surname.textbox, "oninput", this._on_input_call_back);
				this.connect(this.data_firstname.textbox, "oninput", this._on_input_call_back);
			}
			else
			{
				// ie etc need to capture a number of events
				this.connect(this.data_surname.textbox, "onkeyup", this._on_input_call_back);
				this.connect(this.data_surname.textbox, "onpaste", this._on_input_call_back);
				this.connect(this.data_surname.textbox, "oncut", this._on_input_call_back);
				this.connect(this.data_firstname.textbox, "onkeyup", this._on_input_call_back);
				this.connect(this.data_firstname.textbox, "onpaste", this._on_input_call_back);
				this.connect(this.data_firstname.textbox, "oncut", this._on_input_call_back);
			}
		},
		// Key Pressed handler
		_on_input:function()
		{
			this._enable_controls();
			this._Get(this._get_data());
		},
		// focus event to make sure that as may chnaged are captured as possible
		_onChange:function()
		{
			this._Get(this._get_data());
		},
		// styandard clear function
		Clear:function()
		{
			this.data_surname.set("value","");
			this.data_firstname.set("value","");
			this._value="";
			this._enable_controls();
			this.inherited(arguments);
		},
		_setValueAttr:function( value )
		{
			if ( value == "" || value == null)
			{
				this.data_surname.set("value","");
				this.data_firstname.set("value","");
			}
			else
			{
				this.data_surname.set("value",value.data.surname);
				this.data_firstname.set("value",value.data.firstname);
			}
		},
		_getValueAttr:function( value )
		{
			return this._get_data();
		},
		focus:function()
		{
			this.data_surname.focus();
		},
		_get_data:function()
		{
			var data = {
				surname: this.data_surname.get("value"),
				firstname : this.data_firstname.get("value")
				}

			var obj = {data:data,logic:2};

			if (this._extended)
			{
				return obj;
			}
			else
			{
				var data = "";
				if (obj["data"]["surname"].length>0)
					data = dojo.toJson(obj);

				this.value = data;
				this._enable_controls();
				return data ;
			}
		},
		_enable_controls:function()
		{
			var data = this.data_surname.get("value");

			if (data.length>0)
			{
				this.data_firstname.set("disabled", false);
			}
			else
			{
				this.data_firstname.set("value", "");
				this.data_firstname.set("disabled", true);
			}
		}
	}
);





