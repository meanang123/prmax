require({cache:{
'url:research/outlets/templates/OutletDelete.html':"<div style=\"width:400px;height:200px;\" >\r\n\t<form  data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"class\":\"prmaxdefault\",onsubmit:\"return false;\"'>\r\n\t\t<input data-dojo-attach-point=\"outletid\" data-dojo-props='name:\"outletid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td  align=\"center\" data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td ><select data-dojo-attach-point=\"reasoncodes\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<br/><br/>\r\n\t<button data-dojo-attach-point=\"delete_btn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",name:\"submit\",style:\"float:right;\",busyLabel:\"Please Wait Deleting\",iconClass:\"fa fa-trash fa-2x\"' data-dojo-attach-event=\"onClick:_delete_submit\">Delete Outlet</button>\r\n\t<br/><br/>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    OutletDelete.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/outlets/OutletDelete", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Form"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang,topic,domattr){
 return declare("research.outlets.OutletEdit",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
			this._delete_call_back = lang.hitch(this, this._delete_call );
			this._error_call_back = lang.hitch(this, this._error_call);
		},
		postCreate:function()
		{
			this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Del_Codes());
			this.inherited(arguments);
		},
		_delete_submit:function()
		{
			if ( utilities2.form_validator(this.form)==false)
			{
				alert("Not all required fields filled in");
				throw "N";
			}
			if ( confirm("Delete Outlet " + domattr.get(this.heading,"innerHTML" ) + "?"))
			{
				if ( confirm("Delete Outlet are you sure?"))
				{
					this.delete_btn.makeBusy();
					request.post('/research/admin/outlets/research_delete',
						utilities2.make_params({data:this.form.get("value"),timeout:90000})).then
						(this._delete_call_back);
				}
			}
		},
		_delete_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Outlet_Deleted,response.data);
				alert("Outlet Deleted");
				this._dialog.hide();
				this.clear();
			}
			else
			{
				alert ( "Problem Deleteing Contact" ) ;
			}

			this.delete_btn.cancel();
		},
		// styandard clear function
		clear:function()
		{
			this.outletid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			domattr.set(this.heading,"innerHTML" , "" ) ;
			this.delete_btn.cancel();
		},
		load:function( outletid, outletname, dialog)
		{
			this.outletid.set("value", outletid );
			domattr.set(this.heading,"innerHTML" , outletname ) ;
			this.reasoncodes.set("value", null);
			this._dialog = dialog;
		},
		_error_call:function()
		{
			alert("Taking time to delete please wait ");
			this.delete_btn.cancel();
		},
});
});





