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
dojo.provide("prmax.roles.SearchRoles");

// Main control
dojo.declare("prmax.roles.SearchRoles",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		name:"",		// name used for a form integration
		widgetsInTemplate: true,
		showdefaultoption: true,
		templatePath: dojo.moduleUrl( "prmax.roles","templates/SearchRoles.html"),
		constructor: function()
		{
			this.disabled = false;
			this._extended = false;
			this._LoadSelectionCall = dojo.hitch(this,this._LoadSelection);
		},
		postCreate:function()
		{
			this.roles_search.set("keytypeid",this.keytypeid);
			this.roles_search.countNode = this.countNode;
			if (this.showdefaultoption==true)
				dojo.removeClass(this.roles_search.show_search_itegration,"prmaxhidden");
			else
			{
				dojo.style(this.selectarea,"display","none");
			}
			this.inherited(arguments);

		},
		// styandard clear function
		Clear:function()
		{
			this.roles_search.Clear();
			this.inherited(arguments);
		},
		_setValueAttr:function(values)
		{
			this.roles_search.set("value", values);
			if ( this.roles_search.get("count")>0 )
				this.MakeOpen();

		},
		_getValueAttr:function()
		{
			return this.roles_search.get("value");
		},
		_getIsDefaultAttr:function()
		{
			return this.roles_search.search_only.get("checked");
		},
		_setExtendedAttr:function(value)
		{
			this._extended = value;
			this.roles_search.set("extended", value);
		},
		_CaptureExtendedContent:function(data)
		{
			return data;
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
			this.roles_search.master_type_text.focus();
		}
	}
);





