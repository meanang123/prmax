//-----------------------------------------------------------------------------
// Name:    OutetTypes.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/PrmaxOutletTypes.html",
	"prcommon2/search/std_search",
	"dojo/data/ItemFileReadStore",
	"dojox/collections/Dictionary",
	"dojo/json",
	"dijit/form/CheckBox",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template,std_search, ItemFileReadStore, Dictionary,json){
 return declare("prcommon2.search.PrmaxOutletTypes",
	[BaseWidgetAMD,std_search],{
	templateString: template,
		name:"",		// name used for a form integration
		value:"",
		title : '',
		search : '',
		size:'7',
		testmode:false,
		constructor: function()
		{
			this._fieldList = [1,2,3,4,5,6,7,8,9];
			this._values = "";
			this.items = new ItemFileReadStore ({ url:"/common/lookups?searchtype=prmaxoutlettypes"});
			this.items.fetch();
			this._clear_selection_list_call = dojo.hitch ( this, this._clear_selection_list ) ;
			this._load_selection_call = dojo.hitch ( this, this._load_selection ) ;
			this._control_buttons_call = dojo.hitch(this,this._control_buttons)
			this._selected = new Dictionary();
			this._group_types = new Dictionary();
			this._group_types.add(1,'national');
			this._group_types.add(2,'regional');
			this._group_types.add(3,'business');
			this._group_types.add(4,'consumer');
			this._group_types.add(5,'radio');
			this._group_types.add(6,'television');
			this._group_types.add(7,'internet');
			this._group_types.add(8,'news');
			this._group_types.add(9,'parliamentary');

			this._primary = new Dictionary();
			this._primary.add(1,1);
			this._primary.add(2,6);
			this._primary.add(3,13);
			this._primary.add(4,15);
			this._primary.add(5,24);
			this._primary.add(6,27);
			this._primary.add(7,null);
			this._primary.add(8,43);
			this._primary.add(9,null);

		},
		postCreate:function()
		{
			for ( var key in this._fieldList)
			{
				var record = this._fieldList[key];
				dojo.attr(this["node"+record+"label"], "for", this["node"+record].id);
				dojo.connect ( this["node"+record], "onClick", dojo.hitch(this, this._select_primary , record  ) ) ;
				dojo.connect ( this["node"+record + "button"], "onclick", dojo.hitch(this, this._select_list , record  ) ) ;
			}

			dojo.connect(this.outlet_type_list,"onchange" ,  this._control_buttons_call);
			dojo.connect(this.outlet_type_select,"onchange" ,  this._control_buttons_call);
			dojo.connect(this.outlet_type_list,"ondblclick" ,  dojo.hitch(this,this._outlet_select_dbl));


		},
		_control_buttons:function()
		{
			this.button_all.set('disabled',this.outlet_type_list.length?false:true);
			this.button_single.set('disabled',this.outlet_type_list.selectedIndex!=-1?false:true);
			this.button_del_all.set('disabled',this.outlet_type_select.length?false:true);
			this.button_del_single.set('disabled',this.outlet_type_select.selectedIndex!=-1?false:true);
		},
		// styandard clear function
		clear:function()
		{
			this._selected.clear();
			this.outlet_type_list.options.length = 0 ;
			this.outlet_type_select.options.length = 0 ;
			this._get_selector(this._get_data());
			for ( var key in this._fieldList)
				this["node"+this._fieldList[key]].set("checked",false );

			this.inherited(arguments);
		},
		_setValueAttr:function(values)
		{
			var open = false ;
			this.clear();
			for ( var key in values.data )
			{
				open = true ;
			}

			this._get_selector(this._get_data());
			if ( open )
				this.MakeOpen();
		},
		_getValueAttr:function()
		{
			return this._get_data();
		},
		_clear_selection_list:function(size, request)
		{
			this.outlet_type_list.options.length = 0 ;
		},
		_load_selection:function (items, request )
		{
			for (i = 0; i < items.length; i++) {
				var item = items[i];
				this.outlet_type_list.options[this.outlet_type_list.options.length] = new Option( item.name, item.id) ;
			}
		},
		_select_list:function( typeid )
		{
			// fill selection area
			this.items.fetch({
				query: {
					grouptypeid: this._group_types.item ( typeid )
				},
				onBegin: this._clear_selection_list_call,
				onComplete: this._load_selection_call
			});
		},
		_select_primary:function( typeid )
		{
			if (this["node"+typeid].get("checked") )
			{
				// fill selection area
				this.items.fetch({
					query: {
					    grouptypeid: this._group_types.item ( typeid )
					},
					onBegin: this._clear_selection_list_call,
					onComplete: this._load_selection_call
				});

				var pid = this._primary.item(typeid) ;
				if (pid != null && this._selected.containsKey(pid) == false )
				{
					var v = this.items._getItemByIdentity(pid);
					this._select_item (pid , v.name ) ;
					this._control_buttons();
					this._get_selector(this._getValueAttr());
				}
			}
			else
			{
				this.outlet_type_list.options.length = 0 ;
				var pid = this._primary.item(typeid) ;
				// remove from selected
				if ( this._selected.containsKey(pid))
				{
					this._selected.remove(pid);
					for ( var c = 0 ; c < this.outlet_type_select.options.length; c++)
					{
						var record = this.outlet_type_select.options[c];

						if ( parseInt(record.value) == pid )
						{
							this.outlet_type_select.options[c] = null ;
							this._control_buttons();
							this._get_selector(this._getValueAttr());
							break;
						}
					}
				}
			}
		},
		_select_item:function( id , name )
		{
			if (this._selected.containsKey(id) == false )
			{
				this.outlet_type_select.options[this.outlet_type_select.options.length] = new Option(
							name,
							id) ;
				this._selected.add(id, name ) ;
			}
		},
		_get_data:function()
		{
			var data = this._selected.getKeyList();

			var obj = {data:data,logic:2};

			if (this._extended)
			{
				return obj;
			}
			else
			{
				var data = this._selected.count>0?json.stringify(obj):"";
				this.value = data;
				return data ;
			}
		},
		_focus:function()
		{
			this.node1.focus();
		},
		_outlet_type_select_all:function()
		{
			var altered = false ;
			for (var c=0; c<this.outlet_type_list.options.length ;c++){
				var option = this.outlet_type_list.options[c];
				var recordid = parseInt(option.value);
				if ( this._selected.containsKey ( recordid ) == false )
				{
					this.outlet_type_select.options[this.outlet_type_select.options.length] = new Option(option.text,option.value);
					this._selected.add(recordid , option.text ) ;
				}
			}
			this.outlet_type_list.options.length = 0 ;
			this._get_selector(this._getValueAttr());
			this._control_buttons();
		},
		_outlet_type_select_single:function()
		{
			var altered = false ;
			for (var c=0; c<this.outlet_type_list.options.length ;c++){
				var option = this.outlet_type_list.options[c];
				if (option.selected) {
					var recordid = parseInt(option.value);

					if ( this._selected.containsKey( recordid ) == false  ) {
						this.outlet_type_select.options[this.outlet_type_select.options.length] = new Option(option.text,option.value);
						this._selected.add(recordid , option.text ) ;
						this.outlet_type_list.options[c] = null ;
						--c;
						altered = true ;
					}
				}
			}
			if ( altered )
				this._get_selector(this._getValueAttr());
			this._control_buttons();
		},
		_outlet_type_remove_all:function()
		{
			for (var c=0; c<this.outlet_type_select.options.length ;c++){
				var option = this.outlet_type_select.options[c];
				var recordid = parseInt(option.value);
				this._selected.remove( recordid );
				this.outlet_type_list.options[this.outlet_type_list.options.length] = new Option(option.text,option.value);
			}
			this.outlet_type_select.options.length = 0 ;
			this._get_selector(this._getValueAttr());
			this._control_buttons();

		},
		_outlet_type_remove_single:function()
		{
			var altered = false ;
			for (var c=0; c<this.outlet_type_select.options.length ;c++){
				var option = this.outlet_type_select.options[c];
				if (option.selected) {
					var recordid = parseInt(option.value);
					this._selected.remove( recordid );
					altered = true ;
					this.outlet_type_list.options[this.outlet_type_list.options.length] = new Option(option.text,option.value);
					this.outlet_type_select.options[c] = null ;
					--c;
				}
			}
			if ( altered )
			{
				this._get_selector(this._getValueAttr());
				this._control_buttons();
			}
		},
		_outlet_select_dbl:function()
		{
			this._outlet_type_select_single();
		},
		_capture_extended_content:function(data)
		{
			return data;
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
				var pid = data[key];
				var v = this.items._getItemByIdentity(pid);
				this._select_item (pid , v.name ) ;
				open = true;
			}
			this._control_buttons();
			this._get_selector(this._getValueAttr());

			if ( open )
				this.make_open();
		}
});
});





