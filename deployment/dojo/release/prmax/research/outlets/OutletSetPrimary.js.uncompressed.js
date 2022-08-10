require({cache:{
'url:research/outlets/templates/OutletSetPrimary.html':"<div style=\"width:400px;height:140px;\" >\r\n\t<form  class=\"prmaxdefault\" data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" onsubmit=\"return false;\">\r\n\t\t<input data-dojo-attach-point=\"employeeid\" name=\"employeeid\" type=\"hidden\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td  align=\"center\" data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td ><select data-dojo-attach-point=\"reasoncodes\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\"'/></td></tr>\r\n<!--\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td ><select data-dojo-attach-point=\"reasoncodes\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n\t\t\t<tr><td  align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Description</td><td  ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"reason\" data-dojo-type=\"dijit/form/Textarea\"  data-dojo-props='name:\"reason\",style:\"width:99%;height:80%;\"'></textarea></div></td></tr>\r\n-->\r\n\t\t</table>\r\n\t</form>\r\n\t<br/><br/>\r\n\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_set_primary_submit\" data-dojo-props='style:\"float:right;\",type:\"button\",name:\"submit\"'>Set Primary Contact</button>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    OutletSetPrimary.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/03/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/outlets/OutletSetPrimary", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletSetPrimary.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/FilteringSelect",
	"dijit/form/Form",
	"dijit/form/Textarea"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json,lang,topic,domattr ){
 return declare("research.outlets.OutletSetPrimary",
	[BaseWidgetAMD],{
	templateString: template,
		constructor: function()
		{
			this._set_primary_call_back = lang.hitch(this, this._set_primary_call );
		},
		postCreate:function()
		{
			dojo.connect(this.form,"onSubmit",lang.hitch(this,this._set_primary_submit));
			this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());

			this.inherited(arguments);
		},
		_set_primary_submit:function()
		{
			if ( utilities2.form_validator(this.form)==false)
			{
				alert("Not all required fields filled in");
				throw "N";
			}
			if ( confirm("Set Primary  Contact " + domattr.get(this.heading,"innerHTML" ) + "?"))
			{
				request.post('/research/admin/employees/research_set_primary',
					utilities2.make_params({data: this.form.get("value") } )).then
					(this._set_primary_call_back);
			}
		},
		_set_primary_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				alert("Outlet Primary Contact Changed. Please verify the 'Research tab' to make sure these changes haven't effected it");
				if (response.employee.series == true)
				{
					alert("Series members were affected. Please run employee synchronisation process");
				}
				this.clear();
				topic.publish('/emp/set_primary');
				this._dialog.hide();

			}
			else
			{
				alert ( "Problem Changed Primary Contact" ) ;
			}
		},
		// styandard clear function
		clear:function()
		{
			this.employeeid.set("value", -1 ) ;
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
//			this.reason.set("value","");
			domattr.set(this.heading,"innerHTML" , "" ) ;
		},
		load:function( employeeid, employeename, job_title, dialog)
		{
			this._dialog = dialog;
			this.employeeid.set("value", employeeid );
			domattr.set(this.heading,"innerHTML" , employeename ) ;
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
//			this.reason.focus();
		},
//		focus:function()
//		{
//			this.reason.focus();
//		}
});
});





