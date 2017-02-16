//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.geographical.Geographical");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.TextBox");
dojo.require("ttl.Select");
dojo.require("prmax.geographical.GeographicalTree");

dojo.declare("prmax.geographical.Geographical",
	[ prcommon.search.std_search,ttl.BaseWidget],
	{
		name:"",		// name used for a form integration
		value:"",
		displaytitle:"Geo. Coverage",
		title : '',
		search : '',
		size:'7',
		selectonly:false,
		startopen:false,
		widgetsInTemplate: true,
		cascade:true,
		open:false,
		templatePath: dojo.moduleUrl( "prmax.geographical","templates/Geographical.html"),
		constructor: function()
		{
			this.disabled = false;
			this._LoadSelectionCall = dojo.hitch(this,this._LoadSelection);
			this._transactionid = null;
			this.selectTimer = null;
		},
		postCreate:function()
		{
			// key
			dojo.connect(this.geographical_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this.geographicalSelect));
			dojo.connect(this.geographical_list,"onchange" ,  dojo.hitch(this,this.geographicalUpdateSelection));
			dojo.connect(this.geographical_list,"ondblclick" ,  dojo.hitch(this,this.geographicalSelectDbl));

			dojo.connect(this.geographical_select,"ondblclick" ,  dojo.hitch(this,this.geographicalSelectDeleteDbl));

			dojo.attr(this.FilterRadioRestrictionLabel, "for" , this.FilterRadioRestriction.id );
			dojo.attr(this.FilterRadioTownLabel, "for" , this.FilterRadioTown.id );
			dojo.attr(this.FilterRadioCountyLabel, "for" , this.FilterRadioCounty.id );
			dojo.attr(this.FilterRadioRegionLabel, "for" , this.FilterRadioRegion.id );
			dojo.attr(this.FilterRadioNationLabel, "for" , this.FilterRadioNation.id );

			if (this.selectonly)
			{
				this.countNode.domNode.style.display ="None";
			}
			if (this.startopen)
			{
				dojo.style(this.toggleCtrl,"display","none");
				dojo.style(this.selectarea,"display","block");
			}

			dojo.subscribe(PRCOMMON.Events.Geographical_Selected, dojo.hitch(this,this._GeographicalSelectionEvent));
			dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));

			this.inherited ( arguments ) ;

		},
		_GeographicalSelectionEvent:function( e )
		{
			var addRecord = true ;

			for (var c1=0; c1<this.geographical_select.options.length ;c1++){
				if (this.geographical_select.options[c1].value==e.geographicalarea){
					addRecord = false;
					break;
				}
			}

			if ( addRecord )
			{
				this.geographical_select.options[this.geographical_select.options.length] = new Option(e.geographicalname,e.geographicalid);
				this._Get(this._getValueAttr());
			}
		},
		// styandard clear function
		Clear:function()
		{
			this._ClearSelectionBox();
			this._ClearSelectedBox();
			this.geographical_list_select.set("value","");
			this.FilterRadioRestriction.set("checked",true)
			this._Get(this._getValueAttr());
			this._SelectionOptions();
			this.inherited(arguments);

		},
		_ClearSelection:function()
		{
			this.Clear();
		},
		_Send_Request:function( data )
		{
			this._transactionid = PRCOMMON.utils.uuid.createUUID();

			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadSelectionCall,
					url:'/geographical/listbytype',
					content:{
						word:data,
						filter:this._getFilter(),
						geographicaltypeid:this.geographicaltypeid,
						transactionid: this._transactionid
				}}));

		},
		geographicalSelect:function()
		{
			var data = this.geographical_list_select.get("value");
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
				this.selectTimer = null;
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
					this.geographical_list.options[this.geographical_list.options.length] = new Option(record[0],record[1]);
				}
				this._SelectionOptions();
			}
		},
		_ClearSelectionBox:function()
		{
			this.geographical_list.options.length=0;
		},
		_Get: function(value,force)
		{
			if ( this.keytypeid != "" )
				this.inherited(arguments);
		},
		_ClearSelectedBox:function()
		{
			this.geographical_select.length=0;
		},
		geographicalUpdateSelection:function()
		{
			this._SelectionOptions();
		},
		geographicalSelectDbl:function()
		{
			this.geographicalSelectSingle();
			this._SelectionOptions();
		},
		geographicalSelectAll:function()
		{
			for (var c=0; c<this.geographical_list.options.length ;c++){
				var option = this.geographical_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.geographical_select.options.length ;c1++){
					if (this.geographical_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.geographical_select.options[this.geographical_select.options.length] = new Option(option.text,option.value);
					this._Get(this._getValueAttr());
				}
			}
			this.geographical_list.options.length = 0 ;
			this.geographicalUpdateSelection();
		},
		geographicalSelectSingle:function()
		{
			for (var c=0; c<this.geographical_list.options.length ;c++){
				var option = this.geographical_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.geographical_select.options.length ;c1++){
						if (this.geographical_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.geographical_select.options[this.geographical_select.options.length] = new Option(option.text,option.value);
						this._Get(this._getValueAttr());
					}
				}
			}
		},
		geographicalRemoveAll:function()
		{
			this.geographical_select.options.length = 0 ;
			this.geographicalUpdateSelection();
			this._Get(this._getValueAttr());
		},
		geographicalSelectDeleteDbl:function( target )
		{
			console.log("write", target);
			if  ( target != null && target.originalTarget != null && target.originalTarget.index != null )
			{
				this.geographical_select.options[target.originalTarget.index] = null;
				this.geographicalUpdateSelection();
				this._Get(this._getValueAttr());
			}
			else
			{
				this.geographicalRemoveSingle();
			}
		},
		geographicalRemoveSingle:function()
		{
			for (var c=0; c<this.geographical_select.options.length ;c++){
				if (this.geographical_select.options[c].selected)
					this.geographical_select.options[c] = null;
			}
			this.geographicalUpdateSelection();
			this._Get(this._getValueAttr());

		},
		addSelect:function(data)
		{
			this.geographical_select.options[this.geographical_select.options.length] = new Option(data.geographicalname,data.geographicalid);
		},
		_setValueAttr:function(obj)
		{
			var data = obj.data;
			var open = false;
			if ( data == null || data == undefined )
				data = obj;
			this.Clear();
			for (var key in data)
			{
				var record = data[key];
				this.geographical_select.options[this.geographical_select.options.length] = new Option(record.geographicalname,record.geographicalid);
				open = true;
			}
			if ( open )
				this.MakeOpen();
			this._extended = false;
			this._Get(this._getValueAttr());
		},
		_getValueAttr:function()
		{
			var data = Array();
			for (var c=0; c<this.geographical_select.options.length ;c++)
			{
				if (this._extended)
				{
					data[c] = {
						geographicalid:parseInt(this.geographical_select.options[c].value),
						geographicalname:this.geographical_select.options[c].text};
				}
				else
				{
					data[c] = parseInt(this.geographical_select.options[c].value);
				}
			}
			var obj = {data:data,cascade:"C"};
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
			return this.geographical_select.options.length;
		},
		changeFilter:function()
		{
			this.geographicalSelect();
		},
		_SelectionOptions:function()
		{
			this.button_all.set('disabled',this.geographical_list.length?false:true);
			this.button_single.set('disabled',this.geographical_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.geographical_select.length?false:true);
			this.button_del_single.set('disabled',this.geographical_select.selectedIndex!=-1?false:true);

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
		_focus:function()
		{
			this.geographical_list_select.focus();
		},
		_OnFocus:function()
		{
			this.open = true;
			this._ToggleCascade();
		},

		_getFilter:function()
		{
			if (this.FilterRadioRestriction.get("checked"))
				return this.FilterRadioRestriction.get("value");
			else if ( this.FilterRadioTown.get("checked"))
				return this.FilterRadioTown.get("value");
			else if ( this.FilterRadioCounty.get("checked"))
				return this.FilterRadioCounty.get("value");
			else if ( this.FilterRadioRegion.get("checked"))
				return this.FilterRadioRegion.get("value");
			else if ( this.FilterRadioNation.get("checked"))
				return this.FilterRadioNation.get("value");
			return -1;
		},
		_ShowAll:function()
		{
			var data = this.geographical_list_select.get("value");
			if ( data.length != 0 )
			{
				this.geographicalSelect();
			}
		},
		_ShowNoFilter:function()
		{
			var data = this.geographical_list_select.get("value");
			if ( data.length != 0 )
			{
				this.geographicalSelect();
			}
			else
			{
				this._ClearSelectionBox();
				this._SelectionOptions();
			}
		},
		_Toggle:function()
		{
			if (this.selectonly== false )
				this.inherited(arguments);
		},
		_TreeView:function()
		{
			this.geog_tree_dlg.show();
		},
		_DialogCloseEvent:function(  source )
		{
			this.geog_tree_dlg.hide();
		}
	}
);





