require({cache:{
'url:prcommon2/languages/templates/Languages.html':"<div >\r\n\t<div class=\"dojolanguagesPane\" >\r\n\t\t<div data-dojo-attach-point=\"selectarea\" class=\"prmaxselectmultiple\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n\t\t\t\t  <tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n\t\t\t\t  <tr><td colspan=\"3\">\r\n\t\t\t\t  <table style=\"width:100%\" class=\"prmaxtable\" >\r\n\t\t\t\t\t  <tr>\r\n\t\t\t\t\t  <td width=\"70%\" data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select </span><input class=\"prmaxfocus prmaxinput\" type=\"text\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='style:\"width:150px\"' data-dojo-attach-point=\"languages_list_select\" data-dojo-attach-event=\"onkeyup:languages_select_event\" /></td>\r\n\t\t\t\t\t<td><div data-dojo-attach-point=\"show_search_integration\" class=\"prmaxhidden\"><label data-dojo-attach-point=\"search_only_label\">Default to Primary</label><input data-dojo-attach-point=\"search_only\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"1\"' /></div></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t  </td></tr>\r\n\t\t\t\t  <tr><td ><select style=\"width:100%\" name=\"roles\" data-dojo-attach-point=\"languages_list\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t  <td >\r\n\t\t\t\t\t<button class=\"button_add_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-attach-event=\"onClick:languages_select_all\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:languages_select_single\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:languages_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:languages_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button></td>\r\n\t\t\t\t  <td ><select style=\"width:100%\" data-dojo-attach-point=\"languages_select\" size=\"${size}\" class=\"lists\"  data-dojo-attach-event=\"onchange:languages_update_selection\"></select></td>\r\n\t\t\t\t  </tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});
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
define("prcommon2/languages/Languages", [
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
