//-----------------------------------------------------------------------------
// Name:    prcommon.interests.Interests
// Author:  Chris Hoy
// Purpose:
// Created: 19/07/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.interests.Interests");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.search.std_search");

// Main control
dojo.declare("prcommon.interests.Interests",
	[ prcommon.search.std_search, ttl.BaseWidget],
	{
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
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prcommon.interests","templates/Interests.html"),
		constructor: function()
		{
			this.disabled = false;
			this._extended = false;
			this._LoadSelectionCall = dojo.hitch(this,this._LoadSelection);
			this.interestTimer = null;

			this.inherited(arguments);
		},
		statup2:function()
		{
			this.master_type.set("value",-1);
			this.inherited(arguments);
		},
		postCreate:function()
		{
			this.master_type.store = PRCOMMON.utils.stores.Interest_Sections();
			this.master_type.set("value",-1);
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
			else
			{
				this.AndOr_Tip.set("connectId",this.AndOr.id);
			}
			if (this.nofilter)
			{
				dojo.style(this.master_type.domNode,"display","none");
			}
			if (this.startopen)
			{
				dojo.style(this.toggleCtrl,"display","none");
				dojo.style(this.selectarea,"display","block");
			}
			this.inherited(arguments);
		},
		// styandard clear function
		Clear:function()
		{
			this._ClearSelectionBox();
			this._ClearSelectedBox();
			this.master_type.set("value",-1);
			this.interest_list_select.set("value","");
			this._Get(this._getValueAttr());
			this._SelectionOptions();
			this.inherited(arguments);
		},
		clear_private:function()
		{
			this.Clear();
			this.interest_select.options[this.interest_select.options.length] = new Option('Private',3312);
		},
		_Send_Request:function( data, filter )
		{
			this._transactionid = PRCOMMON.utils.uuid.createUUID();

			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadSelectionCall,
					url:'/interests/listuserselection',
					content:{ word:data,
										filter:filter,
										logic:this.AndOr.get("value"),
										interesttypeid:this.interesttypeid,
										keytypeid:this.keytypeid,
										restrict:this.restrict,
										transactionid: this._transactionid}})	);
		},
		interestSelect:function( p1, defaultvalue )
		{
			var data = this.interest_list_select.get("value");
			var filter = this.master_type.get("value");

			if ( defaultvalue != null )
				data = defaultvalue;

			if ( filter == "-1" && data == "*" )
				data = "";

			if (data.length>0)
			{
				if (this.interestTimer)
				{
					clearTimeout ( this.interestTimer);
					this.interestTimer = null;
				}
				this.interestTimer = setTimeout(dojo.hitch(this, this._Send_Request,data,filter),this.searchTime);
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
					this.interest_list.options[this.interest_list.options.length] = new Option(record[0],record[1]);
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

		changeFilter:function()
		{
			this.interestSelect(null, "*");
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
		_Toggle:function()
		{
			if (this.open==false && ( this.master_type.get("value")==null|| this.master_type.get("value").length ==0))
			{
				console.log("Setting");
				this.master_type.set("value",-1);
			}
			this.inherited(arguments);
		}
	}
);





