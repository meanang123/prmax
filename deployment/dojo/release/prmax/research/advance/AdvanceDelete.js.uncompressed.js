require({cache:{
'url:research/advance/templates/AdvanceDelete.html':"<div style=\"width:400px;height:200px;\" >\r\n\t<form  data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"class\":\"prmaxdefault\",onsubmit:\"return false;\"'>\r\n\t\t<input data-dojo-attach-point=\"advancefeatureid\" data-dojo-props='name:\"advancefeatureid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td  align=\"center\" data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td ><select data-dojo-attach-point=\"reasoncodes\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td  align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Description</td><td  ><div class=\"reasonframe\" ><textarea data-dojo-type=\"dijit/form/Textarea\" data-dojo-attach-point=\"reason\" data-dojo-props='name:\"reason\",\"class\":\"prmaxrowtag\",required:true,style:\"width:99%;height:80%;\"'></textarea></div></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<br/><br/>\r\n\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:right;\",type:\"button\",name:\"submit\"' data-dojo-attach-event=\"onClick:_delete_submit\">Delete Feature</button>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    AdvanceDelete.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/10/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/advance/AdvanceDelete", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../advance/templates/AdvanceDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json,lang,topic, domattr, domclass ){
	 return declare("research.advance.AdvanceDelete",
		[BaseWidgetAMD],{
		templateString: template,
		constructor: function()
		{
			this._delete_call_back = dojo.hitch(this, this._delete_call );
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

			if ( confirm("Delete Feature " + domattr.get(this.heading,"innerHTML" ) + "?"))
			{
				if ( confirm("Delete Feature are you sure?"))
				{
					request.post('/advance/research_delete',
						utilities2.make_params({ data : this.form.get("value") })).then
						(this._delete_call_back);
				}
			}
		},
		_delete_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Feature_Deleted,response.data);
				alert("Feature  Deleted");
				this._dialog.hide();
				this.clear();
			}
			else
			{
				alert ( "Problem Deleteing Feature" ) ;
			}
		},
		_setDialogAttr:function( dialog )
		{
		this._dialog = dialog;
		},
		// styandard clear function
		clear:function()
		{
			this.advancefeatureid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
			domattr.set(this.heading,"innerHTML" , "" ) ;
		},
		load:function( advancefeatureid, feature )
		{
			this.advancefeatureid.set("value", advancefeatureid );
			domattr.set(this.heading,"innerHTML" , feature ) ;
			this.reasoncodes.set("value", null);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
});
});





