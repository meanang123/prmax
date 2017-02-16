//-----------------------------------------------------------------------------
// Name:    prcommon.search.Countries
// Author:  Chris Hoy
// Purpose:
// Created: 19/07/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/Countries.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/json",
	"dojo/request",
	"ttl/utilities2",
	"prcommon2/search/std_search",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template, std_search, lang, domattr, domclass, domstyle, json, request,utilities2){
 return declare("prcommon2.search.Countries",
	[BaseWidgetAMD,std_search],{
		templateString:template,
		name:"",		// name used for a form integration
		value:"",
		displaytitle : 'Countries',
		search : '',
		size:'7',
		testmode:false,
		selectonly:false,
		startopen:false,
		preload:true,
		interesttypeid:1,
		restrict:1,
		constructor: function()
		{
			this.disabled = false;
			this._extended = false;
			this._load_selection_call = lang.hitch(this,this._load_selection);
			this.interestTimer = null;

			this.inherited(arguments);
		},
		postCreate:function()
		{
			// key
			dojo.connect(this.interest_list_select.domNode,"onkeyup" ,  lang.hitch(this,this.interest_select_event));
			dojo.connect(this.interest_list,"onchange" ,  lang.hitch(this,this.interest_update_selection));
			dojo.connect(this.interest_list,"ondblclick" ,  lang.hitch(this,this.interest_select_dbl));
			domattr.set(this.andorlabel, "for", this.andor.id);
			if (this.selectonly)
			{
				this.andor.domNode.style.display ="None";
				this.countnode.domNode.style.display ="None";
				this.andor.style.display ="None";
			}
			if (this.startopen)
			{
				domstyle.set(this.togglectrl,"display","none");
				domstyle.set(this.selectarea,"display","block");
			}
			if (this.preload)
			{
				for ( var key in PRMAX.Settings.countries )
				{
					var option = PRMAX.Settings.countries[key];

					this.interest_select.options[this.interest_select.options.length] = new Option(option.countryname,option.countryid);
				}
				if ( PRMAX.Settings.countries.length > 0 )
				{
					this.make_open();
					this._get_selector(this._getValueAttr(),true);
				}

			}
			this.inherited(arguments);
		},
		// styandard clear function
		clear:function()
		{
			this._clear_selection_box();
			this._clear_selected_box();
			this.interest_list_select.set("value","");
			this._get_selector(this._getValueAttr());
			this._selection_options();

			this.inherited(arguments);
		},
		_send_request:function( data )
		{
			this._transactionid = PRCOMMON.utils.uuid.createUUID();

			request.post('/geographical/countries_listselection',
				utilities2.make_params({ data:{ word:data,
										logic:this.andor.get("value"),
										keytypeid:this.keytypeid,
										restrict:this.restrict,
										transactionid: this._transactionid}})).then
				(this._load_selection_call);
		},
		interest_select_event:function( p1, defaultvalue )
		{
			var data = this.interest_list_select.get("value");

			if ( defaultvalue != null )
				data = defaultvalue;

			if (data.length>0)
			{
				if (this.interestTimer)
				{
					clearTimeout ( this.interestTimer);
					this.interestTimer = null;
				}
				this.interestTimer = setTimeout(dojo.hitch(this, this._send_request,data),this.searchTime);
			}
			else
			{
				this.interestTimer = null;
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
					this.interest_list.options[this.interest_list.options.length] = new Option(record.countryname,record.countryid);
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
			this.interest_select.options[this.interest_select.options.length] = new Option(data.countryname,data.countryid);
		},
		_setValueAttr:function(values)
		{
			this.clear();
			var data = values.data;
			var open = false;
			if ( data == null || data == undefined )
				data = values;
			for (var key in data)
			{
				var record = data[key];
				this.interest_select.options[this.interest_select.options.length] = new Option(record.countryname,record.countryid);
				opne = true;
			}
			if ( open )
				this.make_open();
			this._get_selector(this._getValueAttr());

		},
		_getValueAttr:function()
		{
			var data = Array();
			for (var c=0; c<this.interest_select.options.length ;c++)
			{
				if (this._extended)
				{
					data[c] = {
						countryid:parseInt(this.interest_select.options[c].value),
						countryname:this.interest_select.options[c].text
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

		_selection_options:function()
		{
			this.button_all.set('disabled',this.interest_list.length?false:true);
			this.button_single.set('disabled',this.interest_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.interest_select.length?false:true);
			this.button_del_single.set('disabled',this.interest_select.selectedIndex!=-1?false:true);
		},
		_capture_extended_content:function(data)
		{
			var logic=this.andor.get("value");
			return dojo.mixin(data,{logic:logic});
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
		}
});
});





