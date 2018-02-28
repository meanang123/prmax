//-----------------------------------------------------------------------------
// Name:    PersonSelect.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2014
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.search.PersonSelect2");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Dialog");
dojo.require("ttl.Form");
dojo.require("prmax.search.standard");

dojo.require("prcommon.crm.add");
dojo.require("prmax.search.PersonSelect");
dojo.require("prmax.search.PersonSelectDetails");


dojo.declare("prmax.search.PersonSelect2",
	[ ttl.BaseWidget],
	{
	templatePath: dojo.moduleUrl( "prmax.search","templates/PersonSelect2.html"),
	searchtypeid:7,
	placeHolder:"Select Contact",
	source_url:"/search/list",
	constructor: function()
	{
		this._contactid = null;
		this._load_call_back = dojo.hitch(this, this._load_call);
		this._on_select_contact_call_back = dojo.hitch(this,this._on_select_contact);
		this.show_infotbtn = false;

	},
	postCreate:function()
	{
		dojo.addClass(this.clearbtn.domNode,"prmaxhidden");
		dojo.addClass(this.infobtn.domNode,"prmaxhidden");
		dojo.attr(this.contact_display,"innerHTML",this.placeHolder);

		this.inherited(arguments);

	},
	_show_details_function:function(command)
	{

	},
	_load_call:function(response)
	{
		this._contactid = response.contact.contactid;
	},
	_setValueAttr:function(value)
	{
		this._contactid = value ;
		this._set_view();
	},
	_setDisplayvalueAttr:function(value)
	{
		if (value == "" || value == null )
		{
			dojo.attr(this.contact_display,"innerHTML",this.placeHolder);
			dojo.addClass(this.contact_display,"PlaceHolder");
			dojo.addClass(this.clearbtn.domNode, "prmaxhidden");
			dojo.addClass(this.infobtn.domNode, "prmaxhidden");
		}
		else
		{
			dojo.attr(this.contact_display,"innerHTML",value);
			dojo.removeClass(this.contact_display,"PlaceHolder");
			dojo.removeClass(this.clearbtn.domNode, "prmaxhidden");
			dojo.removeClass(this.infobtn.domNode, "prmaxhidden");
		}
	},
	_getValueAttr:function()
	{
		return this._contactid;
	},
	_clear:function()
	{
		this.clear();
	},
	_load_contact_details:function()
	{
		this.selectdetails_ctrl.set("dialog",this.employeeid.value);
		this.selectdetails_ctrl.load(this.selectdetails_dlg,this.employeeid.value);
		this.selectdetails_dlg.show();
	},
	_set_view:function()
	{
		if (this._contactid == null)
		{
			dojo.removeClass(this.clearbtn.domNode,"prmaxhidden");
			dojo.addClass(this.infobtn.domNode,"prmaxhidden");
			dojo.addClass(this.contact_display,"PlaceHolder");
		}
		else
		{
			dojo.removeClass(this.clearbtn.domNode,"prmaxhidden");
			dojo.removeClass(this.infobtn.domNode,"prmaxhidden");
			dojo.removeClass(this.contact_display,"PlaceHolder");
		}
	},
	_select:function()
	{
	},
	clear:function()
	{
		this._clear();
	},
	clear:function()
	{
		this._contactid = null;
		dojo.attr(this.contact_display,"innerHTML",this.placeHolder);
		this._set_view();
	},
	_close:function()
	{
		this.select_dlg.hide();
	},
	_get_form:function()
	{
	},
	_search:function()
	{
	},
	refresh:function( )
	{
	},
	_clear_search:function()
	{
	},
	_clear_search_results:function()
	{
	},
	_search_update_event:function( )
	{
	},
	_select_contact:function()
	{
		this.person_select_dlg.start_search(this._on_select_contact_call_back);
	},
	_on_select_contact:function(employeeid,outletid,contactname,outletname)
	{
		this.outletid.set("value", outletid);
		this.employeeid.set("value", employeeid);
		var details = {}
		details['outletid'] = outletid;
		details['employeeid'] = employeeid;

		var display = contactname;
		if (outletname != "")
		{
			display +=" (" + outletname + ")";
		}
		dojo.attr(this.contact_display,"innerHTML",display);
		dojo.removeClass(this.clearbtn.domNode, "prmaxhidden");
		dojo.removeClass(this.infobtn.domNode, "prmaxhidden");

		dojo.publish("/crm/update_person", [details]);
	},

});



