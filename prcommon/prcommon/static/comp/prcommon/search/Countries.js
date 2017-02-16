//-----------------------------------------------------------------------------
// Name:    prcommon.search.Countries
// Author:  Chris Hoy
// Purpose:
// Created: 19/07/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.search.Countries");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.search.std_search");

// Main control
dojo.declare("prcommon.search.Countries",
	[ prcommon.search.std_search, ttl.BaseWidget],
	{
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
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prcommon.search","templates/Countries.html"),
		constructor: function()
		{
			this.disabled = false;
			this._extended = false;
			this._LoadSelectionCall = dojo.hitch(this,this._LoadSelection);
			this._continents = new dojo.data.ItemFileReadStore({ url:"/common/lookups?searchtype=continents"} );
			this.interestTimer = null;

			this.inherited(arguments);
		},
		postCreate:function()
		{
			// key
			dojo.connect(this.interest_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this.interestSelect));
			dojo.connect(this.interest_list,"onchange" ,  dojo.hitch(this,this.interestUpdateSelection));
			dojo.connect(this.interest_list,"ondblclick" ,  dojo.hitch(this,this.interestSelectDbl));
			dojo.attr(this.AndOrLabel, "for", this.AndOr.id);
			if (this.selectonly)
			{
				this.AndOr.domNode.style.display ="None";
				this.countNode.domNode.style.display ="None";
				this.AndOrLabel.style.display ="None";
			}
			if (this.startopen)
			{
				dojo.style(this.toggleCtrl,"display","none");
				dojo.style(this.selectarea,"display","block");
			}
			if (this.preload)
			{
				this._load_defaults();
				if ( PRMAX.utils.settings.countries.length > 0 )
				{
					this.MakeOpen();
					this._Get(this._getValueAttr(),true);
				}

			}

			this.master_type.store = this._continents;
			this.master_type.set("value",-1);

			this.inherited(arguments);
		},
		_load_defaults:function()
		{
			for ( var key in PRMAX.utils.settings.countries )
			{
				var option = PRMAX.utils.settings.countries[key];

				this.interest_select.options[this.interest_select.options.length] = new Option(option.countryname,option.countryid);
			}
		},
		// styandard clear function
		Clear:function()
		{
			this._ClearSelectionBox();
			this._ClearSelectedBox();
			this.interest_list_select.set("value","");
			this._Get(this._getValueAttr());
			this._SelectionOptions();
			this._load_defaults();

			this.inherited(arguments);
		},
		_Send_Request:function( data )
		{
			this._transactionid = PRCOMMON.utils.uuid.createUUID();
			var filter = this.master_type.get("value");

			if ( filter == "-1" && data == "*" )
				data = "";


			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadSelectionCall,
					url:'/geographical/countries_listselection',
					content:{ word:data,
										logic:this.AndOr.get("value"),
										filter:filter,
										keytypeid:this.keytypeid,
										restrict:this.restrict,

										transactionid: this._transactionid}})	);
		},
		interestSelect:function( p1, defaultvalue )
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
				this.interestTimer = setTimeout(dojo.hitch(this, this._Send_Request,data),this.searchTime);
			}
			else
			{
				this.interestTimer = null;
				this._ClearSelectionBox();
				this._SelectionOptions();
			}
		},
		_LoadSelection:function(response)
		{
			if ( this._transactionid == response.transactionid )
			{
				this._ClearSelectionBox();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.interest_list.options[this.interest_list.options.length] = new Option(record.countryname,record.countryid);
				}
				this._SelectionOptions();
			}
		},
		_ClearSelectionBox:function()
		{
			this.interest_list.options.length=0;
		},
		_ClearSelectedBox:function()
		{
			this.interest_select.length=0;
		},

		And_Or:function()
		{
			this._Get(this._getValueAttr(),true);
		},
		interestUpdateSelection:function()
		{
			this._SelectionOptions();
		},
		interestSelectDbl:function()
		{
			this.interestSelectSingle();
			this._SelectionOptions();
		},
		interestSelectAll:function()
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
			this._Get(this._getValueAttr());
			this.interest_list.options.length = 0 ;
			this.interestUpdateSelection();
		},
		interestSelectSingle:function()
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
						this._Get(this._getValueAttr());
					}
				}
			}
		},
		interestRemoveAll:function()
		{
			this.interest_select.options.length = 0 ;
			this.interestUpdateSelection();
			this._Get(this._getValueAttr());
		},
		interestRemoveSingle:function()
		{
			for (var c=0; c<this.interest_select.options.length ;c++){
				if (this.interest_select.options[c].selected)
					this.interest_select.options[c] = null;
			}
			this.interestUpdateSelection();
			this._Get(this._getValueAttr());

		},
		addSelect:function(data)
		{
			this.interest_select.options[this.interest_select.options.length] = new Option(data.countryname,data.countryid);
		},
		_setValueAttr:function(values)
		{
			this.Clear();
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
				this.MakeOpen();
			this._Get(this._getValueAttr());

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
			var obj = {data:data,logic:this.AndOr.get("value")};
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

		_SelectionOptions:function()
		{
			this.button_all.set('disabled',this.interest_list.length?false:true);
			this.button_single.set('disabled',this.interest_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.interest_select.length?false:true);
			this.button_del_single.set('disabled',this.interest_select.selectedIndex!=-1?false:true);
		},
		_CaptureExtendedContent:function(data)
		{
			var logic=this.AndOr.get("value");
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
		 destroy: function()
		 {
			this.inherited(arguments);
		},
		_Get:function()
		{
			if (this.selectonly==false)
				this.inherited(arguments);
		},
		_focus:function()
		{
			this.interest_list_select.focus();
		},
		_change_filter:function()
		{
			var data = this.interest_list_select.get("value");

			if ( data.length == 0)
			data = "*";

			this.interestSelect(null, data );
		}
});





