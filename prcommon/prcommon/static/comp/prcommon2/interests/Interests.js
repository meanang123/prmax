//-----------------------------------------------------------------------------
// Name:    prcommon2.interests.Interests
// Author:  Chris Hoy
// Purpose:
// Created: 03/10/2012
//
// To do:
//
//-----------------------------------------------------------------------------
// Main control
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../interests/templates/Interests.html",
	"prcommon2/search/std_search",
	"dojo/json",
	"dojo/request",
	"ttl/utilities2",
	"dijit/popup",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/on",
	"prcommon2/search/SearchCount",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/Tooltip",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, std_search, json, request, utilities2, popup, domclass,domstyle, lang,domattr,on){

 return declare("prcommon2.interests.Interests",
	[BaseWidgetAMD, std_search],{
	templateString: template,
	name:"",		// name used for a form integration
	value:"",
	displaytitle : 'Keywords',
	search : '',
	size:'7',
	testmode:false,
	selectonly:false,
	startopen:false,
	interesttypeid:1,
	nofilter:false,
	restrict:1,
	compact:false,
	showhelp:false,
	constructor: function()
	{
		this.disabled = false;
		this._extended = false;
		this._load_selection_call = lang.hitch(this,this._load_selection);
		this.interest_timer = null;
	},
	statup2:function()
	{
		this.master_type.set("value",-1);
		this.inherited(arguments);
	},
	postCreate:function()
	{
		this.master_type.set("store",PRCOMMON.utils.stores.interest_sections());
		this.master_type.set("value",-1);
		// key
		on(this.interest_list_select.domNode,"keyup" , lang.hitch(this,this._interest_select));
		on(this.interest_list,"change" , lang.hitch(this,this.interest_update_selection));
		on(this.interest_list,"dblclick", lang.hitch(this,this.interest_select_dbl));
		domattr.set(this.andorlabel, "for", this.andor.id);
		if (this.selectonly == true )
		{
			domstyle.set(this.andor.domNode,"display" ,"None");
			domstyle.set(this.countnode.domNode,"display", "None");
			domstyle.set(this.andorlabel, "display","None");
		}
		else
		{
			this.andor_tip.set("connectId",this.andor.id);
		}
		if (this.nofilter)
		{
			domstyle.set(this.master_type.domNode,"display","none");
		}
		if (this.startopen == true )
		{
			domstyle.set(this.togglectrl,"display","none");
			domstyle.set(this.selectarea,"display","block");
		}
		if (this.showhelp == true )
		{
				domclass.remove(this.show_help_btn,"prmaxhidden");
		}

		if (this.compact == true )
		{
			domclass.add(this.button_all.domNode,"prmaxhidden");
			domclass.add(this.button_del_all.domNode,"prmaxhidden");
			domclass.add(this.button_all_line,"prmaxhidden");
			domclass.add(this.button_del_all_line,"prmaxhidden");
		}
		this.inherited(arguments);
	},
	// styandard clear function
	clear:function()
	{
		this._clear_selection_box();
		this._clear_selected_box();
		this.master_type.set("value",-1);
		this.interest_list_select.set("value","");
		this._get_selector(this._getValueAttr());
		this._selection_options();
		if (this.selectonly == false )
			this.inherited(arguments);
	},
	clear_selection:function()
	{
		this._clear_selection_box();
		this.interest_list_select.set("value","");
		this._get_selector(this._getValueAttr());

	},
	_send_request:function( data, filter )
	{
		this._transactionid = PRCOMMON.utils.uuid.createUUID();

		request.post('/interests/listuserselection',
			utilities2.make_params({data :{ word:data,
									filter:filter,
									logic:this.andor.get("value"),
									interesttypeid:this.interesttypeid,
									keytypeid:this.keytypeid,
									restrict:this.restrict,
									transactionid: this._transactionid}})).
			then( this._load_selection_call );
	},
	_interest_select:function( p1, defaultvalue )
	{
		var data = this.interest_list_select.get("value");
		var filter = this.master_type.get("value");

		if ( defaultvalue != null )
			data = defaultvalue;

		if ( filter == "-1" && data == "*" )
			data = "";

		if (data.length>0)
		{
			if (this.interest_timer)
			{
				clearTimeout ( this.interest_timer);
				this.interest_timer = null;
			}
			this.interest_timer = setTimeout(lang.hitch(this, this._send_request,data,filter),this.searchTime);
		}
		else
		{
			this.interest_timer = null;
			this._clear_selection_box();
			this._selection_options();
		}
	},
	_load_selection:function(response)
	{
		if ( this._transactionid == response.transactionid )
		{
			this._clear_selection_box();
			for ( var i=0 ; i <response.data.length; ++i )
			{
				var record = response.data[i];
				this.interest_list.options[this.interest_list.options.length] = new Option(record[0],record[1]);
			}
			this._selection_options();
		}
	},
	_clear_selection_box:function()
	{
		this.interest_list.options.length=0;
	},
	_clear_selected_box:function()
	{
		this.interest_select.length=0;
	},
	and_or:function()
	{
		this._get_selector(this._getValueAttr(),true);
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
		this.interest_select.options[this.interest_select.options.length] = new Option(data.interestname,data.interestid);
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
				this.interest_select.options[this.interest_select.options.length] = new Option(record.interestname,record.interestid);
				open = true;
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
		var obj = {data:data,logic:this.andor.get("value")};
		if (this._extended)
		{
			return obj;
		}
		else
		{
			var data = data.length>0?json.stringify(obj):"";
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
		this._interest_select(null, "*");
	},
	_selection_options:function()
	{
		this.button_all.set('disabled',this.interest_list.length?false:true);
		this.button_single.set('disabled',this.interest_list.selectedIndex!=-1?false:true);

		this.button_del_all.set('disabled',this.interest_select.length?false:true);
		this.button_del_single.set('disabled',this.interest_select.selectedIndex!=-1?false:true);
	},
	_capture_extended_content:function(data)
	{
		var logic = this.andor.get("value");
		return lang.mixin(data,{logic:logic});
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
		if (this.open==false && ( this.master_type.get("value")==null|| this.master_type.get("value").length ==0))
		{
			console.log("Setting");
			this.master_type.set("value",-1);
		}
		this.inherited(arguments);
	},
	_show_help:function()
	{
		this.show_help_dialog.show();
	},
	_hide_help:function()
	{
		this.show_help_dialog.hide();
	}
});
});





