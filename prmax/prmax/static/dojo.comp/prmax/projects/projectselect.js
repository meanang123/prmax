//-----------------------------------------------------------------------------
// Name:    projectss.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.projects.projectselect");

dojo.require("dijit.form.Button");
dojo.require("prcommon.search.std_search");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");

// Main control
dojo.declare("prmax.projects.projectselect",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		name:"",		// name used for a form integration
		value:"",
		search : '',
		size:'7',
		startopen:false,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.projects","templates/projectselect.html"),
		constructor: function()
		{
			this.disabled = false;
			this._LoadSelectionCall = dojo.hitch(this,this._LoadSelection);
		},
		postCreate:function()
		{
			// key
			dojo.connect(this.projects_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this.projectsSelect));
			dojo.connect(this.projects_list,"onchange" ,  dojo.hitch(this,this.projectsUpdateSelection));
			dojo.connect(this.projects_list,"ondblclick" ,  dojo.hitch(this,this.projectsSelectDbl));
			if (this.startopen)
			{
				dojo.style(this.toggleCtrl,"display","none");
				dojo.style(this.selectarea,"display","block");
			}
		},
		// styandard clear function
		Clear:function()
		{
			this._ClearSelectionBox();
			this._ClearSelectedBox();
			this.projects_list_select.set("value","");
			this._SelectionOptions();
			this.inherited(arguments);
		},
		projectsSelect:function()
		{
			var data = this.projects_list_select.get("value");
			if (data.length>0)
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadSelectionCall,
						url:'/projects/listuserselection',
						content:{ word:data }})	);
			}
			else
			{
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
				this.projects_list.options[this.projects_list.options.length] = new Option(record[0],record[1]);
			}
			this._SelectionOptions();
		},
		_ClearSelectionBox:function()
		{
			this.projects_list.options.length=0;
		},
		_ClearSelectedBox:function()
		{
			this.projects_select.length=0;
		},
		projectsUpdateSelection:function()
		{
			this._SelectionOptions();
		},
		projectsSelectDbl:function()
		{
			this.projectsSelectSingle();
			this._SelectionOptions();
		},
		projectsSelectAll:function()
		{
			for (var c=0; c<this.projects_list.options.length ;c++){
				var option = this.projects_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.projects_select.options.length ;c1++){
					if (this.projects_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.projects_select.options[this.projects_select.options.length] = new Option(option.text,option.value);
				}
			}
			this.projects_list.options.length = 0 ;
			this.projectsUpdateSelection();
		},
		projectsSelectSingle:function()
		{
			for (var c=0; c<this.projects_list.options.length ;c++){
				var option = this.projects_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.projects_select.options.length ;c1++){
						if (this.projects_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.projects_select.options[this.projects_select.options.length] = new Option(option.text,option.value);
					}
				}
			}
		},
		projectsRemoveAll:function()
		{
			this.projects_select.options.length = 0 ;
			this.projectsUpdateSelection();
		},
		projectsRemoveSingle:function()
		{
			for (var c=0; c<this.projects_select.options.length ;c++){
				if (this.projects_select.options[c].selected)
					this.projects_select.options[c] = null;
			}
			this.projectsUpdateSelection();
		},
		addSelect:function(data)
		{
			this.projects_select.options[this.projects_select.options.length] = new Option(data.projectsname,data.projectsid);
		},
		_setValueAttr:function(values)
		{
			this.Clear();
			var data = values.data;
			if ( data == null || data == undefined )
				data = values;
			for (var key in data)
			{
				var record = data[key];
				this.projects_select.options[this.projects_select.options.length] = new Option(record.projectsname,record.projectsid);
			}
		},
		_getValueAttr:function()
		{
			var data = Array();
			for (var c=0; c<this.projects_select.options.length ;c++)
			{
				if (this._extended)
				{
					data[c] = {
						projectsid:parseInt(this.projects_select.options[c].value),
						projectsname:this.projects_select.options[c].text
						};
				}
				else
				{
					data[c] = parseInt(this.projects_select.options[c].value);
				}
			}
			var obj = {data:data };
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
			return this.projects_select.options.length;
		},
		_setExtendedAttr:function(value)
		{
			this._extended = value
		},
		changeFilter:function()
		{
			this.projectsSelect();
		},
		_SelectionOptions:function()
		{
			this.button_all.set('disabled',this.projects_list.length?false:true);
			this.button_single.set('disabled',this.projects_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.projects_select.length?false:true);
			this.button_del_single.set('disabled',this.projects_select.selectedIndex!=-1?false:true);

		},
		_CaptureExtendedContent:function(data)
		{
			var logic=this.AndOr.get("value");
			return dojo.mixin(data);
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
			this.projects_list_select.focus();
		}
	}
);





