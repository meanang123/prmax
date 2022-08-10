require({cache:{
'url:prcommon2/outlet/templates/SelectMultipleOutlets.html':"<div >\r\n\t<div class=\"dojolanguagesPane\" >\r\n\t\t<div data-dojo-attach-point=\"selectarea\" class=\"prmaxselectmultiple\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n\t\t\t\t  <tr><td width=\"60%\"></td><td width=\"5%\"></td></tr>\r\n\t\t\t\t  <tr>\r\n\t\t\t\t\t<td><select style=\"width:100%\" data-dojo-attach-point=\"outlet_select\" size=\"${size}\" class=\"lists\"  data-dojo-attach-event=\"onchange:outlets_update_selection\"></select></td>\r\n\t\t\t\t  <td valign=\"top\">\r\n\t\t\t\t\t<button style=\"padding:0px;margin:0px\" data-dojo-props='type:\"button\",label:\"Select\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_select_outlet\"></button>\r\n\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:outlets_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:outlets_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button></td>\r\n\t\t\t\t  <td ></td>\r\n\t\t\t\t  </tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n\t\t<div data-dojo-attach-point=\"select_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Select Publication\"'>\r\n\t\t\t<div data-dojo-attach-point=\"select_ctrl\" data-dojo-type=\"prcommon2/outlet/OutletSelectPanel\" data-dojo-props='style:\"width:500px;height:600px\"'></div>\r\n\t</div>\r\n</div>\r\n"}});
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
define("prcommon2/outlet/SelectMultipleOutlets", [
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
