//-----------------------------------------------------------------------------
// Name:    OutetTypes.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.search.PrmaxOutletTypes");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("dijit.form.CheckBox");
dojo.require("prcommon.search.std_search");

dojo.declare("prmax.search.PrmaxOutletTypes",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		name:"",		// name used for a form integration
		value:"",
		title : '',
		search : '',
		size:'7',
		testmode:false,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.search","templates/PrmaxOutletTypes.html"),
		constructor: function()
		{
			this._fieldList = [1,2,3,4,5,6,7,8,9];
			this._values = "";
			this.items = new dojo.data.ItemFileReadStore (
				{ url:"/common/lookups?searchtype=prmaxoutlettypes"});
			this.items.fetch();
			this._ClearSelectionListCall = dojo.hitch ( this, this._ClearSelectionList ) ;
			this._LoadSelectionCall = dojo.hitch ( this, this._LoadSelection ) ;
			this._ControlButtonsCall = dojo.hitch(this,this._ControlButtons)
			this._Selected = new dojox.collections.Dictionary();
			this._GroupTypes = new dojox.collections.Dictionary();
			this._GroupTypes.add(1,'national');
			this._GroupTypes.add(2,'regional');
			this._GroupTypes.add(3,'business');
			this._GroupTypes.add(4,'consumer');
			this._GroupTypes.add(5,'radio');
			this._GroupTypes.add(6,'television');
			this._GroupTypes.add(7,'internet');
			this._GroupTypes.add(8,'news');
			this._GroupTypes.add(9,'parliamentary');

			this._Primary = new dojox.collections.Dictionary();
			this._Primary.add(1,1);
			this._Primary.add(2,6);
			this._Primary.add(3,13);
			this._Primary.add(4,15);
			this._Primary.add(5,24);
			this._Primary.add(6,27);
			this._Primary.add(7,null);
			this._Primary.add(8,43);
			this._Primary.add(9,null);

		},
		postCreate:function()
		{
			for ( var key in this._fieldList)
			{
				var record = this._fieldList[key];
				dojo.attr(this["node"+record+"label"], "for", this["node"+record].id);
				dojo.connect ( this["node"+record], "onClick", dojo.hitch(this, this._SelectPrimary , record  ) ) ;
				dojo.connect ( this["node"+record + "button"], "onclick", dojo.hitch(this, this._SelectList , record  ) ) ;
			}

			dojo.connect(this.OutletType_list,"onchange" ,  this._ControlButtonsCall);
			dojo.connect(this.OutletType_select,"onchange" ,  this._ControlButtonsCall);
			dojo.connect(this.OutletType_list,"ondblclick" ,  dojo.hitch(this,this._OutletSelectDbl));


		},
		_ControlButtons:function()
		{
			this.button_all.set('disabled',this.OutletType_list.length?false:true);
			this.button_single.set('disabled',this.OutletType_list.selectedIndex!=-1?false:true);
			this.button_del_all.set('disabled',this.OutletType_select.length?false:true);
			this.button_del_single.set('disabled',this.OutletType_select.selectedIndex!=-1?false:true);
		},
		// styandard clear function
		Clear:function()
		{
			this._Selected.clear();
			this.OutletType_list.options.length = 0 ;
			this.OutletType_select.options.length = 0 ;
			this._Get(this._getData());
			for ( var key in this._fieldList)
				this["node"+this._fieldList[key]].set("checked",false );

			this.inherited(arguments);
		},
		_setValueAttr:function(values)
		{
			var open = false ;
			this.Clear();
			for ( var key in values.data )
			{
				open = true ;
			}

			this._Get(this._getData());
			if ( open )
				this.MakeOpen();
		},
		_getValueAttr:function()
		{
			return this._getData();
		},
		_ClearSelectionList:function(size, request)
		{
			this.OutletType_list.options.length = 0 ;
		},
		_LoadSelection:function (items, request )
		{
			for (i = 0; i < items.length; i++) {
				var item = items[i];
				this.OutletType_list.options[this.OutletType_list.options.length] = new Option( item.name, item.id) ;
			}
		},
		_SelectList:function( typeid )
		{
			// fill selection area
			this.items.fetch({
				query: {
					grouptypeid: this._GroupTypes.item ( typeid )
				},
				onBegin: this._ClearSelectionListCall,
				onComplete: this._LoadSelectionCall
			});
		},
		_SelectPrimary:function( typeid )
		{
			if (this["node"+typeid].get("checked") )
			{
				// fill selection area
				this.items.fetch({
					query: {
					    grouptypeid: this._GroupTypes.item ( typeid )
					},
					onBegin: this._ClearSelectionListCall,
					onComplete: this._LoadSelectionCall
				});

				var pid = this._Primary.item(typeid) ;
				if (pid != null && this._Selected.containsKey(pid) == false )
				{
					var v = this.items._getItemByIdentity(pid);
					this._SelectItem (pid , v.name ) ;
					this._ControlButtons();
					this._Get(this._getValueAttr());
				}
			}
			else
			{
				this.OutletType_list.options.length = 0 ;
				var pid = this._Primary.item(typeid) ;
				// remove from selected
				if ( this._Selected.containsKey(pid))
				{
					this._Selected.remove(pid);
					for ( var c = 0 ; c < this.OutletType_select.options.length; c++)
					{
						var record = this.OutletType_select.options[c];

						if ( parseInt(record.value) == pid )
						{
							this.OutletType_select.options[c] = null ;
							this._ControlButtons();
							this._Get(this._getValueAttr());
							break;
						}
					}
				}
			}
		},
		_SelectItem:function( id , name )
		{
			if (this._Selected.containsKey(id) == false )
			{
				this.OutletType_select.options[this.OutletType_select.options.length] = new Option(
							name,
							id) ;
				this._Selected.add(id, name ) ;
			}
		},
		_getData:function()
		{
			var data = this._Selected.getKeyList();

			var obj = {data:data,logic:2};

			if (this._extended)
			{
				return obj;
			}
			else
			{
				var data = this._Selected.count>0?dojo.toJson(obj):"";
				this.value = data;
				return data ;
			}
		},
		_focus:function()
		{
			this.node1.focus();
		},
		_OutletTypeSelectAll:function()
		{
			var altered = false ;
			for (var c=0; c<this.OutletType_list.options.length ;c++){
				var option = this.OutletType_list.options[c];
				var recordid = parseInt(option.value);
				if ( this._Selected.containsKey ( recordid ) == false )
				{
					this.OutletType_select.options[this.OutletType_select.options.length] = new Option(option.text,option.value);
					this._Selected.add(recordid , option.text ) ;
				}
			}
			this.OutletType_list.options.length = 0 ;
			this._Get(this._getValueAttr());
			this._ControlButtons();
		},
		_OutletTypeSelectSingle:function()
		{
			var altered = false ;
			for (var c=0; c<this.OutletType_list.options.length ;c++){
				var option = this.OutletType_list.options[c];
				if (option.selected) {
					var recordid = parseInt(option.value);

					if ( this._Selected.containsKey( recordid ) == false  ) {
						this.OutletType_select.options[this.OutletType_select.options.length] = new Option(option.text,option.value);
						this._Selected.add(recordid , option.text ) ;
						this.OutletType_list.options[c] = null ;
						--c;
						altered = true ;
					}
				}
			}
			if ( altered )
				this._Get(this._getValueAttr());
			this._ControlButtons();
		},
		_OutletTypeRemoveAll:function()
		{
			for (var c=0; c<this.OutletType_select.options.length ;c++){
				var option = this.OutletType_select.options[c];
				var recordid = parseInt(option.value);
				this._Selected.remove( recordid );
				this.OutletType_list.options[this.OutletType_list.options.length] = new Option(option.text,option.value);
			}
			this.OutletType_select.options.length = 0 ;
			this._Get(this._getValueAttr());
			this._ControlButtons();

		},
		_OutletTypeRemoveSingle:function()
		{
			var altered = false ;
			for (var c=0; c<this.OutletType_select.options.length ;c++){
				var option = this.OutletType_select.options[c];
				if (option.selected) {
					var recordid = parseInt(option.value);
					this._Selected.remove( recordid );
					altered = true ;
					this.OutletType_list.options[this.OutletType_list.options.length] = new Option(option.text,option.value);
					this.OutletType_select.options[c] = null ;
					--c;
				}
			}
			if ( altered )
			{
				this._Get(this._getValueAttr());
				this._ControlButtons();
			}
		},
		_OutletSelectDbl:function()
		{
			this._OutletTypeSelectSingle();
		},
		_CaptureExtendedContent:function(data)
		{
			return data;
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
				var pid = data[key];
				var v = this.items._getItemByIdentity(pid);
				this._SelectItem (pid , v.name ) ;
				open = true;
			}
			this._ControlButtons();
			this._Get(this._getValueAttr());

			if ( open )
				this.MakeOpen();
		}
});





