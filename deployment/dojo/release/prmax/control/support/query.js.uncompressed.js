require({cache:{
'url:control/support/templates/query.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:240px\"'>\r\n\t\t\t<textarea name = \"query_text\" style=\"width:100%\" rows=9 class=\"prmaxdefault\" data-dojo-attach-point=\"query_text\"></textarea>\r\n\t\t\t<table cellpadding=\"0\" cellpadding=\"0\" width=\"100%\">\r\n\t\t\t\t<tr><td><button data-dojo-attach-point=\"execute_button\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_Execute\" data-dojo-props='busyLabel:\"Wait Executing\"'>Execute</button></td>\r\n\t\t\t<td>\r\n\t\t\t\t<form data-dojo-attach-point=\"to_excel_form\" target=\"_newtab\" method=\"post\" action=\"/query/to_excel\" data-dojo-attach-event=\"onsubmit:_To_Excel\" >\r\n\t\t\t\t\t<input type=\"hidden\"  data-dojo-attach-point=\"query_text_to_excel\" name = \"query_text\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t\t<input type=\"hidden\"  data-dojo-attach-point=\"tmp_to_excel\" name = \"tmp_cache\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t\t<button type=\"submit\" data-dojo-type=\"dijit/form/Button\" label=\"To Excel\" ></button>\r\n\t\t\t\t</form>\r\n\t\t\t</td>\r\n\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_Save\">Save As</button><select data-dojo-attach-point=\"select\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='searchAttr:\"subject\",labelType:\"html\"' ></select><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_Load\">Load</button></td></tr></table>\r\n\t\t\t<br/>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"result_view\">\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"savedlg\" data-dojo-type=\"dijit/Dialog\"  title=\"Save Query\">\r\n\t\t<div><br/>\r\n\t\t\t<form class=\"prmaxdefault\" data-dojo-attach-point=\"formNode\" data-dojo-type=\"dijit/form/Form\" onSubmit=\"return false\">\r\n\t\t\t\t<input type=\"hidden\"  name = \"typeid\" value=\"1\" data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t<table style=\"width:100%;border-collapse:collapse;\" cellspacing=\"1\" cellpadding=\"1\" border=\"0\">\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\">Subject</td><td><input  data-dojo-props='style:\"float:left\",name:\"subject\",type:\"text\",trim:true,required:true' data-dojo-attach-point=\"subject_name\" data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t\t<br/>\r\n\t\t</div>\r\n\t\t<div >\r\n\t\t\t\t<button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_CancelDialog\" style=\"float:left\">Cancel</button>\r\n\t\t\t\t<button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_Query_Save\" style=\"float:right\">OK</button>\r\n\t\t</div><br/>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    control.support.query
// Author:  
// Purpose:
// Created: 17//
//
// To do:
//
//-----------------------------------------------------------------------------
define("control/support/query", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../support/templates/query.html",
	"dijit/layout/BorderContainer",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"ttl/utilities2",
	"dojox/data/JsonRestStore"
	], function(declare, BaseWidgetAMD, template,BorderContainer, lang, domattr,domclass,domstyle,request,utilities2, JsonRestStore){
 return declare("control.support.query",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._QueryCallBack = lang.hitch(this,this._QueryCall);
		this._QueryLoadCallBack = lang.hitch(this,this._QueryLoadCall);
		this._QuerySaveCallBack = lang.hitch(this,this._QuerySaveCall);

		this.queries =  new JsonRestStore({target:"/query/queries2", idProperty:"queryhistoryid",  labelAttribute:"queryhistoryname"});
	},
	postCreate:function()
	{
		this.select.set("store",this.queries);

		this.inherited(arguments);
	},
	_QueryCall:function (response )
	{
		if ( response.success == "OK" )
		{
			this.result_view.setContent ( response.data ) ;
		}
		else
		{
			alert("problem");
		}
		this.execute_button.cancel();
	},
	 _Execute:function()
	 {
			var query = dojo.attr(this.query_text,"value");

			request.post('/query/execute',
				utilities2.make_params({data:{ query_text:query}})).then
				(this._QueryCallBack);

	 },
	 _QueryLoadCall:function ( response )
	 {
		if ( response.success == "OK" )
		{
			dojo.attr(this.query_text,"value", response.data.query_text);
		}
		else
		{
			alert("problem");
		}
	 },
	_Load:function()
	{
		request.post('/query/load',
			utilities2.make_params({data:{ queryhistoryid:this.select.get("value")}})).then
			(this._QueryLoadCallBack);
	},
	_Save:function()
	{
		var query_text = dojo.attr(this.query_text,"value");
		if ( query_text.length>0)
		{
			this.savedlg.show();
		}
	},
	_CancelDialog:function()
	{
		this.savedlg.hide();
	},
	 _QuerySaveCall:function ( response )
	 {
		if ( response.success == "OK" )
		{
			alert("Query Saved");
			this._CancelDialog();
		}
		else
		{
			alert("problem");
		}
	 },
	_Query_Save:function()
	{
		if ( utilities2.form_validator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			throw "B";
		}

		var query_text = dojo.attr(this.query_text,"value");
		request.post('/query/save2',
			utilities2.make_params({data:
			{query_text:query_text,
			subject:this.subject_name.get("value")
			}
			})).then
			(this._QuerySaveCallBack);
	},
	_To_Excel:function()
	{
		this.query_text_to_excel.set("value", dojo.attr(this.query_text,"value"));
		this.tmp_to_excel.set("value", new Date());

		return true ;
	}
});
});