require({cache:{
'url:prcommon2/advance/templates/advance.html':"<div class=\"prmaxhidden\">\r\n\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" onsubmit=\"return false;\" style=\"width:100%;height:100%\">\r\n\t\t<br/>\r\n\t\t<input type=\"hidden\" name=\"outletid\" value=\"-1\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletid\">\r\n\t\t<input type=\"hidden\" name=\"advancefeatureid\" value=\"-1\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"advancefeatureid\">\r\n\t\t<table style=\"width:97%\" cellpadding=\"1\" cellspacing=\"0\">\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"120px\">Editorial Date</td><td><input data-dojo-props='type:\"text\",style:\"width:25em\",name:\"editorial\",required:false' data-dojo-attach-point=\"editorial_date\" data-dojo-type=\"prcommon2/date/DateExtended\" /></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Cover Date</td><td><input data-dojo-props='style:\"width:25em\",name:\"cover\",required:true' data-dojo-type=\"prcommon2/date/DateExtended\" data-dojo-attach-point=\"cover_date\"></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Publication Date</td><td><input data-dojo-props='style:\"width:25em\",name:\"publicationdate\",required:true' data-dojo-type=\"prcommon2/date/DateExtended\" data-dojo-attach-point=\"publication_date\"></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Summary</td><td><input data-dojo-props='maxLength:120,required:true,style:\"width:95%\",name:\"feature\",type:\"text\"' data-dojo-attach-point=\"feature\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Contact</td><td><select data-dojo-props='style:\"width:100%\",name:\"employeeid\",\"class\":\"prmaxinput\",autoComplete:true,searchAttr:\"displayname\",labelAttr:\"displayname\",labelType:\"html\",maxlength:80' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"employeeid\" ></select></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Feature Details</td><td>&nbsp;\t</td></tr>\r\n\t\t\t<tr><td colspan=\"2\"><div class=\"stdframe\" style=\"height:200px;margin-left:10px\"><textarea data-dojo-attach-point=\"featuredescription\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"featuredescription\",required:true,style:\"height:300px;width:99%\"'></textarea></div></td></tr>\r\n<!--\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" >Feature Interest</td><td><div data-dojo-attach-point=\"interests\" data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-props='\"name\":\"interests\",selectonly:true,size:6,displaytitle:\"\",startopen:\"\",restrict:0,keytypeid:-1,title:\"Select\"'></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Reason Code</td><td ><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/Select\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",class:\"prmaxrequired\"'  /></td></tr>\r\n-->\r\n\t\t\t<tr><td align=\"right\" colspan=\"2\"><br/><button data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",\"class\":\"prmaxbutton\",busyLabel:\"Please Wait Saving...\",label:\"Save\"' data-dojo-attach-event=\"onClick:_save\"></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    advance.js
// Author:  Chris Hoy
// Purpose: Add/Edit an advance features
// Created: 05/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define("prcommon2/advance/advance", [
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
//		this.reasoncodeid.set("store", PRCOMMON.utils.stores.Research_Reason_Update_Codes());
//		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);

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
			//this.interests.set("value", response.data.interests);
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
		//this.interests.set("value","");
		//this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
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
