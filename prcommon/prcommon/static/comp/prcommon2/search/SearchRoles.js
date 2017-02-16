//-----------------------------------------------------------------------------
// Name:    SearchRoles.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/SearchRoles.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"prcommon2/roles/Roles",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template,std_search,lang, domattr,domclass,domstyle){
 return declare("prcommon2.search.SearchRoles",
	[BaseWidgetAMD,std_search],{
	templateString: template,
	name:"",		// name used for a form integration
	value:"",
	showdefaultoption: true,
		constructor: function()
		{
			this.disabled = false;
			this._extended = false;
			this._load_selection_call = lang.hitch(this,this._load_selection);
		},
		postCreate:function()
		{
			this.roles_search.set("keytypeid",this.keytypeid);
			this.roles_search.countnode = this.countnode;
			if (this.showdefaultoption==true)
			{
				domclass.remove(this.roles_search.show_search_integration,"prmaxhidden");
			}
			else
			{
				domstyle.set(this.selectarea,"display","none");
			}
			this.inherited(arguments);

		},
		// styandard clear function
		clear:function()
		{
			this.roles_search.clear();
			this.inherited(arguments);
		},
		_setValueAttr:function(values)
		{
			this.roles_search.set("value", values);
			if ( this.roles_search.get("count")>0 )
				this.make_open();
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
		_capture_extended_content:function(data)
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
		_focus:function()
		{
			this.roles_search.master_type_text.focus();
		}
});
});





