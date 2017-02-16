//-----------------------------------------------------------------------------
// Name:    prcommon.languages.Languages
// Author:  
// Purpose:
// Created: June 2016
//
// To do:
//-----------------------------------------------------------------------------

dojo.provide("prcommon.languages.Languages");

dojo.require("ttl.BaseWidget");

// Main control
dojo.declare("prcommon.languages.Languages",
	[ttl.BaseWidget],
	{
		name:"",	
		value:"",
		displaytitle : 'Languages',
		search : '',
		size:'7',
		testmode:false,
		selectonly:false,
		startopen:false,
		preload:true,
		interesttypeid:1,
		restrict:1,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prcommon.languages","templates/Languages.html"),
		constructor: function()
		{
			this.disabled = false;
			this._extended = false;
			this._LoadSelectionCall = dojo.hitch(this,this._LoadSelection);
			
			this.selectTimer = null;
		},
		postCreate:function()
		{
			// key
			dojo.connect(this.languages_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this.languages_select_event));
			dojo.connect(this.languages_list,"onchange" ,  dojo.hitch(this,this.languages_update_selection));
			dojo.connect(this.languages_list,"ondblclick" ,  dojo.hitch(this,this.languages_select_dbl));

			if (this.preload)
			{
				this._Send_Request("*");
			}			
			this.inherited(arguments);
		},
		
		Clear:function()
		{
			this._ClearSelectionBox();
			this._ClearSelectedBox();
			this.languages_list_select.set("value","");
			this._Get(this._getValueAttr());
			this._SelectionOptions();

			this.inherited(arguments);
		},

		_Send_Request:function ( data )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadSelectionCall,
					url:'/languages/listuserselection',
					content:{ word:data}}));		
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
				this.selectTimer = setTimeout(dojo.hitch(this, this._Send_Request,data),this.searchTime);
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
		_LoadSelection:function(response)
		{
			this._ClearSelectionBox();
			for ( var i=0 ; i <response.data.length; ++i )
			{
				var record = response.data[i];
				this.languages_list.options[this.languages_list.options.length] = new Option(record.languagename,record.languageid);
			}
			this._SelectionOptions();
		},
		_ClearSelectionBox:function()
		{
			this.languages_list.options.length=0;
		},
		_ClearSelectedBox:function()
		{
			this.languages_select.length=0;
		},
		languages_update_selection:function()
		{
			this._SelectionOptions();
		},
		languages_select_dbl:function()
		{
			this.languages_select_single();
			this._SelectionOptions();
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
			this._Get(this._getValueAttr());
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
						this._Get(this._getValueAttr());
					}
				}
			}
		},
		languages_remove_all:function()
		{
			this.languages_select.options.length = 0 ;
			this.languages_update_selection();
			this._Get(this._getValueAttr());
		},
		languages_remove_single:function()
		{
			for (var c=0; c<this.languages_select.options.length ;c++){
				if (this.languages_select.options[c].selected)
					this.languages_select.options[c] = null;
			}
			this.languages_update_selection();
			this._Get(this._getValueAttr());

		},
		add_select:function(data)
		{
			this.languages_select.options[this.languages_select.options.length] = new Option(data.languagename,data.languageid);
		},
		_setValueAttr:function(values)
		{
			this.Clear();
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
				this._Get(this._getValueAttr());
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
		_SelectionOptions:function()
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
		_Get:function()
		{
			if (this.selectonly==false)
				this.inherited(arguments);
		},
		_focus:function()
		{
			this.languages_list_select.focus();
		}
});

