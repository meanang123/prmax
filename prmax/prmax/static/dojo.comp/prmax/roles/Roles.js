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
dojo.provide("prmax.roles.Roles");

dojo.require("prcommon.search.std_search");

// Main control
dojo.declare("prmax.roles.Roles",
	[ prcommon.search.std_search,ttl.BaseWidget],
	{
		name:"",		// name used for a form integration
		value:"",
		size:'7',
		startopen:false,
		searchmode:false,
		widgetsInTemplate: true,
		selectonly: true,
		templatePath: dojo.moduleUrl( "prmax.roles","templates/Roles.html"),
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
			dojo.connect(this.interest_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this.interestSelect));
			dojo.connect(this.interest_list,"onchange" ,  dojo.hitch(this,this.interestUpdateSelection));
			dojo.connect(this.interest_list,"ondblclick" ,  dojo.hitch(this,this.interestSelectDbl));
			if (this.startopen)
			{
				dojo.style(this.toggleCtrl,"display","none");
				dojo.style(this.selectarea,"display","block");
			}
			else
			{
				dojo.style(this.toggleszone,"display","block");
				dojo.style(this.selectarea,"display","none");
			}
			this.inherited(arguments);
		},
		// styandard clear function
		Clear:function()
		{
			this._ClearSelectionBox();
			this._ClearSelectedBox();
			this.interest_list_select.set("value","");
			this._Get(this._getValueAttr());
			this._SelectionOptions();
			this.inherited(arguments);
		},
		_Send_Request:function ( data )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadSelectionCall,
					url:'/roles/listuserselection',
					content:{ word:data}})	);
		},
		interestSelect:function()
		{
			var data = this.interest_list_select.get("value");
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
				this.interest_list.options[this.interest_list.options.length] = new Option(record[0],record[1]);
			}
			this._SelectionOptions();
		},
		_ClearSelectionBox:function()
		{
			this.interest_list.options.length=0;
		},
		_ClearSelectedBox:function()
		{
			this.interest_select.length=0;
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
			this.interest_select.options[this.interest_select.options.length] = new Option(data.interestname,data.interestid);
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
				this.interest_select.options[this.interest_select.options.length] = new Option(record.interestname,record.interestid);
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
						interestid:parseInt(this.interest_select.options[c].value),
						interestname:this.interest_select.options[c].text
						};
				}
				else
				{
					data[c] = parseInt(this.interest_select.options[c].value);
				}
			}
			var obj = this._CaptureExtendedContent	({data:data} ) ;

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

		changeFilter:function()
		{
			this.interestSelect();
		},
		_SelectionOptions:function()
		{
			this.button_all.set('disabled',this.interest_list.length?false:true);
			this.button_single.set('disabled',this.interest_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.interest_select.length?false:true);
			this.button_del_single.set('disabled',this.interest_select.selectedIndex!=-1?false:true);

			this._UpDown();
		},
		_UpDown:function()
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
		_UpButton:function()
		{
			var index = this.interest_select.selectedIndex;
			if ( index != -1 )
			{
				var temp = this.interest_select.options[index];
				var other = this.interest_select.options[index-1];

				this.interest_select.options[index-1] = new Option(temp.innerHTML, temp.value,true);
				this.interest_select.options[index] = new Option(other.innerHTML, other.value);

				this._UpDown();
			}
		},
		_DownButton:function()
		{
			var index = this.interest_select.selectedIndex;
			if ( index != -1 )
			{
				var temp = this.interest_select.options[index];
				var other = this.interest_select.options[index+1];

				this.interest_select.options[index+1] = new Option(temp.innerHTML, temp.value,true);
				this.interest_select.options[index] = new Option(other.innerHTML, other.value);

				this._UpDown();
			}
		},
		_CaptureExtendedContent:function(data)
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
		_Toggle:function()
		{
			this.inherited(arguments);
		}
	}
);





