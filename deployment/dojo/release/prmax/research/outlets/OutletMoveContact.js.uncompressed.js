require({cache:{
'url:research/outlets/templates/OutletMoveContact.html':"<div style=\"width:400px;height:200px;\" >\r\n\t<form  data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"class\":\"prmaxdefault\",onsubmit:\"return false;\"'>\r\n\t\t<input data-dojo-attach-point=\"employeeid\" data-dojo-props='name:\"employeeid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td  align=\"center\" data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">New Outlet</td><td ><select data-dojo-attach-point=\"outletid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"outletid\",searchAttr:\"outletname\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"' data-dojo-attach-event=\"onChange:_outlet_selected\"/></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"desk_view\" class=\"prmaxhidden\"><td align=\"right\" class=\"prmaxrowtag\">Desks</td><td ><select data-dojo-attach-point=\"outletdeskid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"outletdeskid\",searchAttr:\"deskname\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<br/><br/>\r\n\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",style:\"float:left\" ' data-dojo-attach-event=\"onClick:_close_dlg\">Close</button>\r\n\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",style:\"float:right\" ' data-dojo-attach-event=\"onClick:_move_contact\">Move Contact</button>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    OutletMoveContact.js
// Author:  Chris Hoy
// Purpose:
// Created: 06/03/2013
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/outlets/OutletMoveContact", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletMoveContact.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"ttl/store/JsonRest",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Form"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang,topic,domattr,JsonRest,domclass){
 return declare("research.outlets.OutletMoveContact",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._move_call_back = lang.hitch(this, this._move_call );
		this._outlet_selected_call_back = lang.hitch(this, this._outlet_selected_call );
		this._outlets =  new JsonRest( {target:'/research/admin/outlets/list_research', idProperty:"outletid"});
		this._outletdesks =new JsonRest( {target:'/research/admin/desks/list_outlet_desks', idProperty:"outletdeskid"});

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.outletid.set("store", this._outlets);
		this.outletdeskid.set("store", this._outletdesks);
		this._outlet = null;
	},
	_move_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}
		if ( confirm("Move Contact?"))
		{
			request.post('/research/admin/outlets/research_move_contact',
				utilities2.make_params({data:this.form.get("value")})). then
				(this._move_call_back);
		}
	},
	_move_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			topic.publish(PRCOMMON.Events.Employee_Deleted,{has_deleted:true, employeeid: parseInt(this.employeeid.get("value"))});
			alert("Contact Moved. Please verify the 'Research tab' to make sure these changes haven't effected it");
			if (response.data.source_series == true && response.data.destination_series == false)
			{
				alert("Series members were affected. Please run employee synchronisation process");
			}				
			else if (response.data.source_series == false && response.data.destination_series == true)
			{
				alert("Series members of DESTINATION publication were affected. Please run employee synchronisation process for DESTINATION publication");
			}				
			else if (response.data.source_series == true && response.data.destination_series == true)
			{
				alert("Series members of BOTH source AND destination publications were affected. Please run employee synchronisation process for both of them");
			}				
			this._dialog.hide();
			this.clear();
		}
		else
		{
			alert ( "Problem Moving Contact" ) ;
		}
	},
	// styandard clear function
	clear:function()
	{
		this.outletid.set("value", null ) ;
		this.outletdeskid.set("value", -1);
		domattr.set(this.heading,"innerHTML" , "" ) ;
		domclass.add(this.desk_view,"prmaxhidden");

	},
	clear2:function()
	{
		this.outletid.set("value", null ) ;
		this.outletdeskid.set("value", -1);
	},
	load:function( employeeid, employeename, dialog, outletid)
	{
		this.clear();
		this.employeeid.set("value", employeeid );
		domattr.set(this.heading,"innerHTML" , employeename) ;
		this._dialog = dialog;
		this.outletid.set("query",{ioutletid:outletid});
		this.outletid.set("value", null);
	},
	_close_dlg:function()
	{
		this._dialog.hide();
		this.clear();
	},
	_outlet_selected:function( outletid)
	{
		if (this.outletid.value != "")
		{
			request.post('/research/admin/outlets/research_outlet_is_child',
				utilities2.make_params({data:{outletid:this.outletid.value}})). then
				(this._outlet_selected_call_back);
		}
	},
	_outlet_selected_call:function ( response )
	{
		if ( response.is_child == false )
		{
			this.outletdeskid.set("query",{outletid:response.outletid});
			this.outletdeskid.set("value", null);
			domclass.remove(this.desk_view,"prmaxhidden");
		}
		else
		{
			alert ( "Cannot move a contact to a child outlet. Please select a parent outlet." ) ;
			this.clear2();
		}
	},	
});
});





