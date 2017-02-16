//-----------------------------------------------------------------------------
// Name:    SelectMultipleOutlets.js
// Author:  Chris Hoy
// Purpose:
// Created: 11/11/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlet/templates/SelectMultipleOutlets.html",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"ttl/utilities2",
	"prcommon2/outlet/OutletSelectPanel"
	], function(declare, BaseWidgetAMD, template, lang, domattr,domclass,domstyle,request,utilities2){
 return declare("prcommon2.outlet.SelectMultipleOutlets",
	[BaseWidgetAMD],{
	templateString: template,
		name:"",		// name used for a form integration
		value:"",
		size:'7',
		startopen:false,
		searchmode:false,
		widgetsInTemplate: true,
		selectonly: true,
		constructor: function()
		{
			this.disabled = false;
			this._load_selection_call = lang.hitch(this,this._load_selection);
			this.selectTimer = null;
		},
		postCreate:function()
		{
			this.inherited(arguments);

			this.select_ctrl.set("dialog", this.select_dlg);
			this.select_ctrl.set("callback", lang.hitch(this, this._add_single));
		},
		clear:function()
		{
			this._clear_selected_box();
			this._selection_options();

			this.inherited(arguments);
		},
		_send_request:function ( data )
		{
			request.post('/lanquages/listuserselection',
				utilities2.make_params({data:{ word:data}})).then
				(this._load_selection_call);
		},
		_clear_selected_box:function()
		{
			this.outlet_select.length=0;
		},
		outlets_update_selection:function()
		{
			this._selection_options();
		},
		outlets_remove_all:function()
		{
			this.outlet_select.options.length = 0 ;
			this.outlet_update_selection();
		},
		outlets_remove_single:function()
		{
			for (var c=0; c<this.outlet_select.options.length ;c++)
			{
				if (this.outlet_select.options[c].selected)
					this.outlet_select.options[c] = null;
			}
			this.outlets_update_selection();
		},
		_add_single:function( data)
		{
			var add = true;
			for (var c=0; c<this.outlet_select.options.length ;c++)
			{
				if (this.outlet_select.options[c].value == data.outletid )
					add = false;
			}
			if (add)
				this.add_select(data);

			this._selection_options();
		},
		add_select:function(data)
		{
			this.outlet_select.options[this.outlet_select.options.length] = new Option(data.outletname,data.outletid);
		},
		_setValueAttr:function(values)
		{
			this.clear();
			if ( values )
			{
				var data = values.data;
				var open = false;
				if ( data == null || data == undefined )
					data = values;
				for (var key in data)
				{
					var record = data[key];
					this.outlet_select.options[this.outlet_select.options.length] = new Option(record.outletname,record.outletid);
				}
			}
		},
		_getValueAttr:function()
		{
			var data = Array();
			for (var c=0; c<this.outlet_select.options.length ;c++)
			{
				if (this._extended)
				{
					data[c] = {
						outletid:parseInt(this.outlet_select.options[c].value),
						outletame:this.outlet_select.options[c].text
						};
				}
				else
				{
					data[c] = parseInt(this.outlet_select.options[c].value);
				}
			}
			var obj = {data:data};

			if (this._extended)
			{
				return obj;
			}
			else
			{
				var data = data.length>0?dojo.toJson(obj):"";
				this.value = data;
				return data;
			}
		},
		_getCountAttr:function()
		{
			return this.outlet_select.options.length;
		},
		_setExtendedAttr:function(value)
		{
			this._extended = value
		},
		_selection_options:function()
		{
			this.button_del_all.set('disabled',this.outlet_select.length?false:true);
			this.button_del_single.set('disabled',this.outlet_select.selectedIndex!=-1?false:true);
		},
		_setDisabledAttr:function(values)
		{
			this.disabled = values;
		},
		_getDisabledAttr:function()
		{
			return this.disabled;
		},
		_select_outlet:function()
		{
			this.select_dlg.show();
		}
});
});
