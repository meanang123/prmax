//-----------------------------------------------------------------------------
// Name:    Interests.js
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
	"dojo/text!../roles/templates/Roles.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"ttl/utilities2"
	], function(declare, BaseWidgetAMD, template,std_search, lang, domattr,domclass,domstyle,request,utilities2){
 return declare("prcommon2.roles.Roles",
	[BaseWidgetAMD,std_search],{
	templateString: template,
		name:"",		// name used for a form integration
		value:"",
		size:'7',
		startopen:false,
		searchmode:false,
		widgetsInTemplate: true,
		selectonly: true,
		orderbtns:true,
		constructor: function()
		{
			this.disabled = false;
			this._extended = false;
			this._load_selection_call = lang.hitch(this,this._load_selection);
			this.selectTimer = null;
		},
		postCreate:function()
		{
			// key
			dojo.connect(this.interest_list_select.domNode,"onkeyup" ,  lang.hitch(this,this.interest_select_event));
			dojo.connect(this.interest_list,"onchange" ,  lang.hitch(this,this.interest_update_selection));
			dojo.connect(this.interest_list,"ondblclick" ,  lang.hitch(this,this.interest_select_dbl));
			if (this.startopen)
			{
				domstyle.set(this.selectarea,"display","block");
			}
			else
			{
				domstyle.set(this.selectarea,"display","none");
			}
			if (this.orderbtns==false)
			{
				domclass.add(this.up.domNode,"prmaxhidden");
				domclass.add(this.down.domNode,"prmaxhidden");
			}

			this.inherited(arguments);
		},
		clear:function()
		{
			this._clear_selection_box();
			this._clear_selected_box();
			this.interest_list_select.set("value","");
			this._get_selector(this._getValueAttr());
			this._selection_options();

			this.inherited(arguments);
		},
		_send_request:function ( data )
		{
			var command = { word:data};

			request.post('/roles/listuserselection',
				utilities2.make_params({data: command})).then
				(this._load_selection_call);
		},
		interest_select_event:function()
		{
			var data = this.interest_list_select.get("value");
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
				this._ClearSelectionBox();
				this._SelectionOptions();
			}

		},
		_load_selection:function(response)
		{
			this._clear_selection_box();
			for ( var i=0 ; i <response.data.length; ++i )
			{
				var record = response.data[i];
				this.interest_list.options[this.interest_list.options.length] = new Option(record[0],record[1]);
			}
			this._selection_options();
		},
		_clear_selection_box:function()
		{
			this.interest_list.options.length=0;
		},
		_clear_selected_box:function()
		{
			this.interest_select.length=0;
		},
		interest_update_selection:function()
		{
			this._selection_options();
		},
		interest_select_dbl:function()
		{
			this.interest_select_single();
			this._selection_options();
		},
		interest_select_all:function()
		{
			for (var c=0; c<this.interest_list.options.length ;c++){
				var option = this.interest_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.interest_select.options.length ;c1++){
					if (this.interest_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.interest_select.options[this.interest_select.options.length] = new Option(option.text,option.value);
				}
			}
			this._get_selector(this._getValueAttr());
			this.interest_list.options.length = 0 ;
			this.interest_update_selection();
		},
		interest_select_single:function()
		{
			for (var c=0; c<this.interest_list.options.length ;c++){
				var option = this.interest_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.interest_select.options.length ;c1++){
						if (this.interest_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.interest_select.options[this.interest_select.options.length] = new Option(option.text,option.value);
						this._get_selector(this._getValueAttr());
					}
				}
			}
		},
		interest_remove_all:function()
		{
			this.interest_select.options.length = 0 ;
			this.interest_update_selection();
			this._get_selector(this._getValueAttr());
		},
		interest_remove_single:function()
		{
			for (var c=0; c<this.interest_select.options.length ;c++){
				if (this.interest_select.options[c].selected)
					this.interest_select.options[c] = null;
			}
			this.interest_update_selection();
			this._get_selector(this._getValueAttr());

		},
		add_select:function(data)
		{
			rolename = data.rolename;
			this.interest_select.options[this.interest_select.options.length] = new Option(data.rolename,data.prmaxroleid);
		},
		_setValueAttr:function(values)
		{
			this.clear();
			if ( values != null )
			{
				var data = values.data;
				var open = false;
				if ( data == null || data == undefined )
					data = values;
				for (var key in data)
				{
					var record = data[key];

					var rolename = "rolename";
					if (record.rolename == undefined || record.rolename == null)
						rolename = "prmaxrole";

					this.interest_select.options[this.interest_select.options.length] = new Option(record[rolename],record.prmaxroleid);
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
			for (var c=0; c<this.interest_select.options.length ;c++)
			{
				if (this._extended)
				{
					data[c] = {
						interestid:parseInt(this.interest_select.options[c].value),
						interestname:this.interest_select.options[c].text
						};
				}
				else
				{
					data[c] = parseInt(this.interest_select.options[c].value);
				}
			}
			var obj = this._capture_extended_content	({data:data} ) ;

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
			return this.interest_select.options.length;
		},
		_setExtendedAttr:function(value)
		{
			this._extended = value
		},

		change_filter:function()
		{
			this.interest_select();
		},
		_selection_options:function()
		{
			this.button_all.set('disabled',this.interest_list.length?false:true);
			this.button_single.set('disabled',this.interest_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.interest_select.length?false:true);
			this.button_del_single.set('disabled',this.interest_select.selectedIndex!=-1?false:true);

			this._up_down();
		},
		_up_down:function()
		{
			var upvalue = true ;
			var downvalue = true ;

			if (this.interest_select.options.length>1 && this.interest_select.selectedIndex != -1 )
			{
				if  (this.interest_select.selectedIndex>0)
					upvalue = false ;

				if  (this.interest_select.selectedIndex<this.interest_select.options.length - 1 )
					downvalue = false;
			}

			this.up.set('disabled',upvalue);
			this.down.set('disabled',downvalue);

		},
		_up_button:function()
		{
			var index = this.interest_select.selectedIndex;
			if ( index != -1 )
			{
				var temp = this.interest_select.options[index];
				var other = this.interest_select.options[index-1];

				this.interest_select.options[index-1] = new Option(temp.innerHTML, temp.value,true);
				this.interest_select.options[index] = new Option(other.innerHTML, other.value);

				this._up_down();
			}
		},
		_down_button:function()
		{
			var index = this.interest_select.selectedIndex;
			if ( index != -1 )
			{
				var temp = this.interest_select.options[index];
				var other = this.interest_select.options[index+1];

				this.interest_select.options[index+1] = new Option(temp.innerHTML, temp.value,true);
				this.interest_select.options[index] = new Option(other.innerHTML, other.value);

				this._up_down();
			}
		},
		_capture_extended_content:function(data)
		{
			var settings = {logic:2};

			if ( this.search_only.get("checked"))
				settings.search_only = true;

			return dojo.mixin(data,settings );
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
			this.interest_list_select.focus();
		},
		_toggle:function()
		{
			this.inherited(arguments);
		}
});
});
