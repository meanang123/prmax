//-----------------------------------------------------------------------------
// Name:    Languages.js
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
	"dojo/text!../languages/templates/Languages.html",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"ttl/utilities2"
	], function(declare, BaseWidgetAMD, template, lang, domattr,domclass,domstyle,request,utilities2){
 return declare("prcommon2.languages.Languages",
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
			// key
			dojo.connect(this.languages_list_select.domNode,"onkeyup" ,  lang.hitch(this,this.languages_select_event));
			dojo.connect(this.languages_list,"onchange" ,  lang.hitch(this,this.languages_update_selection));
			dojo.connect(this.languages_list,"ondblclick" ,  lang.hitch(this,this.languages_select_dbl));

			this.inherited(arguments);
		},
		clear:function()
		{
			this._clear_selection_box();
			this._clear_selected_box();
			this.languages_list_select.set("value","");
			this._get_selector(this._getValueAttr());
			this._selection_options();

			this.inherited(arguments);
		},
		_send_request:function ( data )
		{
			request.post('/lanquages/listuserselection',
				utilities2.make_params({data:{ word:data}})).then
				(this._load_selection_call);
		},
		languages_select_event:function()
		{
			var data = this.languages_list_select.get("value");
			if (data.length>0)
			{
				if (this.selectTimer)
				{
					clearTimeout ( this.selectTimer);
					this.selectTimer = null;
				}
				this.selectTimer = setTimeout(dojo.hitch(this, this._send_request,data),this.searchTime);
			}
			else
			{
				if ( this.selectTimer )
				{
					clearTimeout ( this.selectTimer);
					this.selectTimer = null;
				}
				this._clear_selection_box();
				this._selection_options();
			}

		},
		_load_selection:function(response)
		{
			this._clear_selection_box();
			for ( var i=0 ; i <response.data.length; ++i )
			{
				var record = response.data[i];
				this.languages_list.options[this.languages_list.options.length] = new Option( record[0], record[1]);
			}
			this._selection_options();
		},
		_clear_selection_box:function()
		{
			this.languages_list.options.length=0;
		},
		_clear_selected_box:function()
		{
			this.languages_select.length=0;
		},
		languages_update_selection:function()
		{
			this._selection_options();
		},
		languages_select_dbl:function()
		{
			this.languages_select_single();
			this._selection_options();
		},
		languages_select_all:function()
		{
			for (var c=0; c<this.languages_list.options.length ;c++){
				var option = this.languages_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.languages_select.options.length ;c1++){
					if (this.languages_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.languages_select.options[this.languages_select.options.length] = new Option(option.text,option.value);
				}
			}
			this._get_selector(this._getValueAttr());
			this.languages_list.options.length = 0 ;
			this.languages_update_selection();
		},
		languages_select_single:function()
		{
			for (var c=0; c<this.languages_list.options.length ;c++){
				var option = this.languages_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.languages_select.options.length ;c1++){
						if (this.languages_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.languages_select.options[this.languages_select.options.length] = new Option(option.text,option.value);
						this._get_selector(this._getValueAttr());
					}
				}
			}
		},
		languages_remove_all:function()
		{
			this.languages_select.options.length = 0 ;
			this.languages_update_selection();
			this._get_selector(this._getValueAttr());
		},
		languages_remove_single:function()
		{
			for (var c=0; c<this.languages_select.options.length ;c++){
				if (this.languages_select.options[c].selected)
					this.languages_select.options[c] = null;
			}
			this.languages_update_selection();
			this._get_selector(this._getValueAttr());

		},
		add_select:function(data)
		{
			this.languages_select.options[this.languages_select.options.length] = new Option(data.languagename,data.languageid);
		},
		_setValueAttr:function(values)
		{
			this.clear();
			if (values != null)
			{
				var data = values.data;
				var open = false;
				if ( data == null || data == undefined )
					data = values;
				for (var key in data)
				{
					var record = data[key];
					this.languages_select.options[this.languages_select.options.length] = new Option(record.languagename,record.languageid);
					opne = true;
				}
				if ( open )
					this.make_open();
				this._get_selector(this._getValueAttr());
			}
		},
		_getValueAttr:function()
		{
			var data = Array();
			for (var c=0; c<this.languages_select.options.length ;c++)
			{
				if (this._extended)
				{
					data[c] = {
						languageid:parseInt(this.languages_select.options[c].value),
						languagename:this.languages_select.options[c].text
						};
				}
				else
				{
					data[c] = parseInt(this.languages_select.options[c].value);
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
			return this.languages_select.options.length;
		},
		_setExtendedAttr:function(value)
		{
			this._extended = value
		},

		change_filter:function()
		{
			this.languages_select();
		},
		_selection_options:function()
		{
			this.button_all.set('disabled',this.languages_list.length?false:true);
			this.button_single.set('disabled',this.languages_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.languages_select.length?false:true);
			this.button_del_single.set('disabled',this.languages_select.selectedIndex!=-1?false:true);

			this._up_down();
		},
		_up_down:function()
		{
			var upvalue = true ;
			var downvalue = true ;

			if (this.languages_select.options.length>1 && this.languages_select.selectedIndex != -1 )
			{
				if  (this.languages_select.selectedIndex>0)
					upvalue = false ;

				if  (this.languages_select.selectedIndex<this.languages_select.options.length - 1 )
					downvalue = false;
			}
		},
		_setDisabledAttr:function(values)
		{
			this.disabled = values;
		},
		_getDisabledAttr:function()
		{
			return this.disabled;
		},
		_get_selector:function()
		{
			if (this.selectonly==false)
				this.inherited(arguments);
		},
		_focus:function()
		{
			this.languages_list_select.focus();
		}
});
});
