require({cache:{
'url:research/employees/templates/ContactInterests.html':"<div style=\"width:500px\" >\r\n\t<form  data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"class\":\"prmaxdefault\",onsubmit:\"return false;\"'>\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"40%\"></td><td></td></tr>\r\n\t\t\t<tr><td colspan=\"2\"><div data-dojo-props='style:\"width:99%\",keytypeid:-1,restrict:0,size:8,name:\"interests\",startopen:true,selectonly:true' data-dojo-type=\"prcommon2/interests/Interests\"></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Remove Existing Keywords</td><td><input data-dojo-props='name:\"append_mode\",name:\"append_mode\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"append_mode\"></td></tr>\r\n\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"2\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_change_interests\" data-dojo-props='type:\"button\",name:\"submit\"'>Change Contact Keywords</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ContactInterests.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/11/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/employees/ContactInterests", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/ContactInterests.html",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/request",
	"ttl/utilities2"
	], function(declare, BaseWidgetAMD, template, topic,  lang, request, utilities2){
 return declare("research.employees.ContactInterests",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._dialog = null;
		this._changed_call_back = lang.hitch( this, this._changed_call);
	},
	_change_interests:function()
	{
		if  ( confirm ("Change Keywords from the Selected Contact to these Keywords"))
		{
			request.post('/research/admin/employees/research_contact_interests',
				utilities2.make_params({data: this.form.get("value")})).then
				( this._changed_call_back);
		}
	},
	_changed_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Contact Keywords Changed");
			this._dialog.hide();
		}
		else
		{
			alert ( "Problem Changing Contact Keywords" ) ;
		}
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
	}
});
});





