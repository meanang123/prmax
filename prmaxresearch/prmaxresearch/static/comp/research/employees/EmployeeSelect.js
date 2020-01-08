//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeSelect
// Author:  Chris Hoy
// Purpose: This select a contact record or creates a new one and select it
//			exposed to a form contactid and contacttype (N,S) N is for no
//			selection
// Created: 11/02/2009
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/EmployeeSelect.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"research/employees/PersonNew",
	"prcommon2/contact/ContactSelect",
	"prcommon2/contact/ContactSelectMain",
	"research/employees/ContactMerge",
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, JsonRestStore, Observable, domattr ,domclass){
 return declare("research.employees.EmployeeSelect",
	[BaseWidgetAMD],{
	templateString:template,
	required:false,
	nonew:false,
	name:"eselect",
	mustexists:false,
	constructor: function()
	{
		this._shopadd = true;
		topic.subscribe(PRCOMMON.Events.Person_Added,lang.hitch(this, this._add_event));
	},
	postCreate:function()
	{
		domattr.set(this.nocontactlabel,'for',this.nocontactnode.id);
		domattr.set(this.selectcontactlabel, 'for', this.selectcontactnode.id);
		this.contactid.set("callback", lang.hitch(this, this._selected_from_extended));
		if ( this.mustexists==true )
		{
			domclass.add(this.select_view,"prmaxhidden");
			this.selectcontactnode.set("checked",true);
			domclass.add(this.displayname_ctrl,"prmaxhidden");
		}
		this.inherited(arguments);
	},
	set_outletid:function(outletid)
	{
		this.outletid.set("value", outletid);
		this.contactid._outletid = outletid;
	},
	_add_event:function(contact)
	{
		this.contactid.set("value", contact.contactid);
	},
	_setCheckedAttr:function( value )
	{
		this.nocontactnode.set("checked",value);
		this.selectcontactnode.set("checked",true);
		this._change_mode(false);
	},
	set_no_contact:function()
	{
		this.nocontactnode.set("checked",true);
		this._change_mode(true);
	},
	_getValueAttr:function( )
	{
		return this.contactid._contact.contactid.get("value");
	},
	_setValueAttr:function( value )
	{
		this.contactid.set("value", value );
	},
	isValid:function()
	{
		var rvalid = true ;
		var valid = true;
		var v = this.contactid.get("value");
		if ( v=="" || v == -1 || v==0 || v==null)
			valid = false;
		if (this.required==true)
		{
			if (valid==false)
				rvalid = false;
		}
		else
		{
			if ( this.nocontactnode.get("checked")==false && valid==false)
			{
				rvalid = false;
			}
		}
		return rvalid;
	},
	isFocusable: function()
	{
		return true;
	},
	focus: function()
	{
		this.contactid.focus();
	},
	clear:function()
	{
		this.contactid.set("value",null);
		this._shopadd = false;
	},
	_contact_mode_no_contact:function()
	{
		this._change_mode(true);
	},
	_contact_mode_contact:function()
	{
		this._change_mode(false);
	},
	_change_mode:function(mode)
	{
		domclass.remove(this.selectcontactform, mode?"prmaxvisible":"prmaxhidden");
		domclass.add(this.selectcontactform, mode?"prmaxhidden":"prmaxvisible");

		if (mode)
			domclass.remove(this.contactid, "prmaxrequired");
		else
			domclass.add(this.contactid, "prmaxrequired");

		this.contactid.set("disabled" , mode);
		this._shopadd = false;
	},
	_update_after_add:function(contact)
	{
		this.contactid.set("value",contact.contactid);
		this._shopadd = false;
		this._add_contact_show();
	},
	_selected_from_extended:function(contact)
	{
		this.contactid.set("value",contact.contactid);
	},
});
});
