//-----------------------------------------------------------------------------
// Name:    Edit.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/07/2013
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../international/templates/Edit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-construct",
	"research/audit/AuditViewer",
	"prcommon2/interests/Interests",
	"prcommon2/web/WebButton",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"research/outlets/OutletDelete",
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, ItemFileReadStore,lang,topic, domattr, domclass, domstyle, domConstruct){
 return declare("research.international.Edit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
		this._load_call_back = lang.hitch(this, this._load_call);
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());
		this.www_show.set("source", this.www);
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this._outletname = '';
		this._outletid = '';

		this.inherited(arguments);
	},
	load:function( outletid )
	{
		this._outletid = outletid;
		this.outletid.set("value", outletid);
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.updatebtn.cancel();
		request.post('/research/admin/outlets/research_outlet_edit_get',
			utilities2.make_params({ data : {outletid: outletid}})).
			then ( this._load_call_back);
	},
	_load_call:function( response )
	{
		if ( response.success == "OK")
		{
			with ( response )
			{
				this._outletname = outlet.outlet.outletname;
				this.tabs.selectChild(this.details_tab);
				this.prmax_outlettypeid.set("value",outlet.outlet.prmax_outlettypeid);
				var tmp = outlet.outlet.outletid+" - " + outlet.outlet.outletname;
				domattr.set(this.outlet_details_view,"innerHTML",  tmp );
				if (outlet.outlet.sourcetypeid == 7)
				{
					this.www.set("value",outlet.outlet.www);
					this.interests.set("value",outlet.interests ) ;
					this.address1.set("value",outlet.address.address1);
					this.address2.set("value",outlet.address.address2);
					this.townname.set("value",outlet.address.townname);
					this.county.set("value",outlet.address.county);
					this.postcode.set("value",outlet.address.postcode);
					this.email.set("value",outlet.communications.email);
					this.tel.set("value",outlet.communications.tel);
					this.fax.set("value",outlet.communications.fax);

					this.outlet_audit.set('disabled', false);
					this.outlet_audit.load(outlet.outlet.outletid);
					domclass.remove(this.tb2, "prmaxhidden");
				}
				else
				{
					this.outlet_audit.set('disabled', true);
					domclass.add( this.tb2,"prmaxhidden");
				}
			}
		}
		else
		{
			alert("Problem Loading");
		}

	},
	_update:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.updatebtn.cancel();
			throw "N";
		}
		var tmp_data = this.form.get("value");
		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");

		request.post('/research/admin/outlets/update_international',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}
		this.updatebtn.cancel();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	},
	_delete:function()
	{
			this.outlet_delete_ctrl.load(this._outletid, this._outletname , this.outlet_delete_dlg);
			this.outlet_delete_dlg.show();
	},


});
});


