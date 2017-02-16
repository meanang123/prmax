//-----------------------------------------------------------------------------
// Name:    advance.js
// Author:  Chris Hoy
// Purpose: Add/Edit an advance features
// Created: 05/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../advance/templates/advance.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojox/data/JsonRestStore",
	"dijit/layout/ContentPane" ,
	"dojo/store/Observable",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Textarea",
	"dijit/form/Textarea",
	"dijit/form/Select",
	"dojox/form/BusyButton",
	"prcommon2/date/DateExtended",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, domattr ,domclass,JsonRestStore,ContentPane){
 return declare("prcommon2.advance.advance",
	[BaseWidgetAMD,ContentPane],{
	templateString:template,
	constructor: function()
	{
		this._save_call_back = lang.hitch(this,this._save_call ) ;
		this._load_call_back = lang.hitch(this,this._load_call ) ;
	},
	postCreate:function()
	{
		this.reasoncodeid.set("store", PRCOMMON.utils.stores.Research_Reason_Update_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);

		this.inherited(arguments);
	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			if ( this.advancefeatureid.get("value") == -1 )
			{
				topic.publish(PRCOMMON.Events.Feature_Added, response.data );
				alert("Feature Added");
				this.clear();
			}
			else
			{
				topic.publish(PRCOMMON.Events.Feature_Updated,response.data);
				alert("Feature Updated");
			}
		}
		else
		{
			alert("Problem with Feature");
		}

		this.savenode.cancel();
	},
	_save:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post("/advance/save",
			utilities2.make_params({ data:this.form.get("value")})).then
			( this._save_call_back);
	},
	load:function( advancefeatureid, outletid )
	{
		this.modelemployees = new JsonRestStore ( {target:'/research/admin/employees/listcombo_extended_nocontact/'+outletid, idProperty:"employeeid"});
		this.employeeid.set("store",this.modelemployees);
		this._remove();

		if ( advancefeatureid != -1 )
		{
			request.post("/advance/get_ext",
				utilities2.make_params({data: {advancefeatureid:advancefeatureid}})).
				then ( this._load_call_back);
		}
		else
		{
			this.clear();
			this.advancefeatureid.set("value",-1);
			this.outletid.set("value", outletid);
		}
	},
	_load_call:function( response )
	{
		if ( response.success == "OK" )
		{
			this.outletid.set("value", response.data.advance.outletid );
			this.advancefeatureid.set("value", response.data.advance.advancefeatureid ) ;
			this.editorial_date.set("value", response.data.advance.editorial_date_full );
			this.cover_date.set("value", response.data.advance.cover_date_full );
			this.publication_date.set("value", response.data.advance.publication_date_full );
			this.feature.set("value", response.data.advance.feature ) ;
			this.featuredescription.set("value", response.data.advance.featuredescription);
			this.interests.set("value", response.data.interests);
			if ( response.data.advance.employeeid != null )

				this.employeeid.set("value", response.data.advance.employeeid ) ;
			else
				this.employeeid.set("value", -1 ) ;

			domclass.remove(this.domNode, "prmaxhidden");
		}
		else
		{
			this.advancefeatureid.set("value",-1);
			alert("Problem Loading Feature");
		}
	},
	clear:function()
	{
		this.advancefeatureid.set("value",-1);
		this.editorial_date.set("value",null);
		this.cover_date.set("value",null);
		this.publication_date.set("value",null);
		this.feature.set("value","");
		this.featuredescription.set("value","");
		this.interests.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.employeeid.set("value", -1 ) ;
		this._remove();

	},
	newmode:function()
	{
		domclass.remove(this.domNode , "prmaxhidden");
	},
	_remove:function()
	{
		this.employeeid.textbox.value = "";
		this.employeeid.valueNode.value = null;
		this.employeeid.displayMessage('');
		this.employeeid._lastDisplayedValue  = "";
		this.employeeid._updatePlaceHolder();
		this.employeeid.validate(this.focused);
		}
});
});
