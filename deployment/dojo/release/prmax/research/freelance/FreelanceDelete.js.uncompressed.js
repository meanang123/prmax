require({cache:{
'url:research/freelance/templates/FreelanceDelete.html':"<div style=\"width:400px;height:200px;\" >\r\n\t<form  data-dojo-attach-point=\"form\"data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"class\":\"prmaxdefault\",onsubmit:\"return false;\"'>\r\n\t\t<input data-dojo-attach-point=\"outletid\" name=\"outletid\" type=\"hidden\"data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td  align=\"center\" data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td >\r\n\t\t\t<select data-dojo-attach-point=\"reasoncodes\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td  align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Description</td><td  ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"reason\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"reason\",\"class\":\"prmaxrowtag\",required:true,style:\"width:99%;height:80%;\"'></textarea></div></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<br/><br/>\r\n\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:right;\",type:\"button\"' data-dojo-attach-event=\"onClick:_delete_submit\">Delete Freelancer</button>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/freelance/FreelanceDelete", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../freelance/templates/FreelanceDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, request, utilities2,lang,topic,domattr){
 return declare("research.freelance.FreelanceDelete",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._delete_call_back = lang.hitch(this, this._delete_call );
		this._dialog = null;
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
			if ( this.reason.get("value").length == 0 )
			{
				alert("No Description Given");
				this.reason.focus();
				return;
			}

			if ( confirm("Delete Freelance " + domattr.get(this.heading,"innerHTML" ) + "?"))
			{
				if ( confirm("Delete Freelancer are you sure?"))
				{
					request.post('/research/admin/outlets/research_delete',
						utilities2.make_params({data: this.form.get("value")})).then
						(this._delete_call_back);
				}
			}
		},
		_delete_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Outlet_Deleted,response.data);
				alert("Freelance Deleted");
				this.clear();
				this._dialog.hide();
			}
			else
			{
				alert ( "Problem Deleteing Freelancer" ) ;
			}
		},
		// styandard clear function
		clear:function()
		{
			this.outletid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
			domattr.set(this.heading,"innerHTML" , "" ) ;
		},
		load:function( outletid, freelancename )
		{
			this.outletid.set("value", outletid );
			domattr.set(this.heading,"innerHTML" , freelancename ) ;
			this.reasoncodes.set("value", null);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		},
		_setDialogAttr:function ( dialog )
		{
			this._dialog = dialog;
		}
});
});





