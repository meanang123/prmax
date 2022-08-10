require({cache:{
'url:prcommon2/roles/templates/Roles.html':"<div >\r\n\t<div class=\"dojoInterestPane\" >\r\n\t\t<div data-dojo-attach-point=\"selectarea\" style=\"display:none\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n\t\t\t\t  <tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n\t\t\t\t  <tr><td colspan=\"3\">\r\n\t\t\t\t  <table style=\"width:100%\" class=\"prmaxtable\" >\r\n\t\t\t\t\t  <tr>\r\n\t\t\t\t\t  <td width=\"70%\" data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select </span><input class=\"prmaxfocus prmaxinput\" type=\"text\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='style:\"width:150px\"' data-dojo-attach-point=\"interest_list_select\" data-dojo-attach-event=\"onkeyup:interest_select_event\" /></td>\r\n\t\t\t\t\t<td><div data-dojo-attach-point=\"show_search_integration\" class=\"prmaxhidden\"><label data-dojo-attach-point=\"search_only_label\">Default to Primary</label><input data-dojo-attach-point=\"search_only\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"1\"' /></div></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t  </td></tr>\r\n\t\t\t\t  <tr><td ><select style=\"width:100%\" name=\"roles\" data-dojo-attach-point=\"interest_list\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t  <td >\r\n\t\t\t\t\t<button class=\"button_add_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-attach-event=\"onClick:interest_select_all\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:interest_select_single\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:interest_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:interest_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button></td>\r\n\t\t\t\t  <td ><select style=\"width:100%\" data-dojo-attach-point=\"interest_select\" size=\"${size}\" class=\"lists\"  data-dojo-attach-event=\"onchange:interest_update_selection\"></select></td>\r\n\t\t\t\t  <td>\r\n\t\t\t\t\t<button  style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"up\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-attach-event=\"onClick:_up_button\" data-dojo-type=\"dijit/form/Button\"><div style=\"width:2em\">Up</div></button><br/>\r\n\t\t\t\t\t<button style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"down\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_down_button\"><div style=\"width:2em\">Down</div></button><br/>\r\n\t\t\t\t  </td></tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});
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
define("prcommon2/roles/Roles", [
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
