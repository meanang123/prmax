require({cache:{
'url:control/support/templates/spfcontrol.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"height:35px;width:100%;overflow:hidden;border:1px solid black\"'>\r\n\t\t<div class=\"dijitToolbarTop\" data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"float:left:height:100%;width:100%\",\"class\":\"prmaxbuttonlarge\"' >\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PrmaxResultsIcon PrmaxResultsEmpty\",showLabel:true' data-dojo-attach-event=\"onClick:_New\">New</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",style:\"width:100%\"'>\r\n\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-attach-point=\"hosts_view\" data-dojo-props='style:\"width:100%;height:100%\"' >\r\n\t\t\t<div data-dojo-attach-point=\"hosts_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:50%;height:100%;\",region:\"center\"'></div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"options\" data-dojo-props='region:\"right\",style:\"width:50%;height:100%\"'>\r\n\t\t\t\t<div title=\"blank\" data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='selected:\"selected\",style:\"width:100%;height:100%\"'></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"host_update\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%;\"'>\r\n\t\t\t\t\t<form data-dojo-attach-point=\"formupd\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t\t\t<table style=\"width:500px;border-collapse:collapse;\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Domain</td><td><input data-dojo-props='type:\"text\", readOnly:true, name:\"host2\",style:\"width:300px\"' data-dojo-attach-point=\"host2\" data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Is Valid Source</td><td><input data-dojo-props='type:\"text\",name:\"is_valid_source2\"' data-dojo-attach-point=\"is_valid_source2\" data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Private Key</td><td><input data-dojo-props='type:\"text\",name:\"privatekey2\",style:\"width:300px\",rows:\"4\"' data-dojo-attach-point=\"privatekey2\" data-dojo-type=\"dijit/form/SimpleTextarea\"></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Selector</td><td><input data-dojo-props='type:\"text\",name:\"selector2\",style:\"width:300px\",rows:\"3\"' data-dojo-attach-point=\"selector2\" data-dojo-type=\"dijit/form/SimpleTextarea\"></td></tr><br/><br/>\r\n\t\t\t\t\t\t\t<tr><td></td><td align=\"right\"><button data-dojo-props='type:\"button\",busyLabel:\"Updating ...\",label:\"Update Host\"' data-dojo-attach-point=\"updbtn\" data-dojo-attach-event=\"onClick:_Update\" data-dojo-type=\"dojox/form/BusyButton\" ></button></td></tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</form>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/Dialog\" title=\"New Host\" data-dojo-attach-point=\"hostdialog\">\r\n\t\t<form data-dojo-attach-point=\"form\" onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t<table style=\"width:500px;border-collapse:collapse;\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Domain</td><td><input data-dojo-props='type:\"text\",required:\"true\", name:\"host\",style:\"width:300px\"' data-dojo-attach-point=\"host\" data-dojo-type=\"dijit/form/ValidationTextBox\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Is Valid Source</td><td><input data-dojo-props='type:\"text\",name:\"is_valid_source\"' data-dojo-attach-point=\"is_valid_source\" data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Private Key</td><td><input data-dojo-props='type:\"text\",name:\"privatekey\",style:\"width:300px\",rows:\"4\"' data-dojo-attach-point=\"privatekey\" data-dojo-type=\"dijit/form/SimpleTextarea\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Selector</td><td><input data-dojo-props='type:\"text\",name:\"selector\",style:\"width:300px\",rows:\"3\"' data-dojo-attach-point=\"selector\" data-dojo-type=\"dijit/form/SimpleTextarea\"></td></tr>\r\n\r\n\t\t\t\t<tr><td colspan=\"2\"><br/></td></tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td><button data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_Close\" data-dojo-type=\"dijit/form/Button\"></button></td>\r\n\t\t\t\t\t<td align=\"right\"><button data-dojo-props='type:\"button\",busyLabel:\"Adding ...\",label:\"Add Host\"' data-dojo-attach-point=\"addbtn\" data-dojo-attach-event=\"onClick:_Add\" data-dojo-type=\"dojox/form/BusyButton\"></button></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n<!--\t\r\n\t<div data-dojo-attach-point=\"getspfctl\" data-dojo-type=\"dijit/Dialog\"  title=\"Look Up Domain Record\">\r\n\t\t<div><br/>\r\n\t\t<button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_cancel_dialog\" style=\"float:left\">Close</button>\r\n\t\t<button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_check_domain\" style=\"float:right\">OK</button>\r\n\t\t</div><br/>\r\n\t</div>\r\n-->\t\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    control.support.spfcontrol
// Author:
// Purpose:
// Created: 17//
//
// To do:
//
//-----------------------------------------------------------------------------
define("control/support/spfcontrol", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../support/templates/spfcontrol.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"ttl/utilities2",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"dijit/form/Button",
	"dijit/Dialog",
	"dijit/form/Form",
	"dijit/form/FilteringSelect",
	"dijit/form/CheckBox",
	"dijit/form/SimpleTextarea"
	], function(declare, BaseWidgetAMD, template,BorderContainer, ContentPane, lang, domattr,domclass,domstyle,request,utilities2, topic, JsonRestStore, ItemFileReadStore, Grid, JsonRest, Observable){
 return declare("control.support.spfcontrol",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{

		this._AddHostCallBack = lang.hitch(this, this._AddHostCall);
		this._DeleteHostCallBack = lang.hitch ( this, this._DeleteHostCall);
		this._UpdateHostCallBack = lang.hitch ( this, this._UpdateHostCall);

		this._hosts = new Observable(new JsonRest(
			{target:'/hostspf/hostspf_list',
			idProperty:'host',
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
			}));
	},
	postCreate:function()
	{
		this.inherited(arguments);
		var cells =
		[
			{label: 'Host',className:"dgrid-column-status-large",field:'host'},
			{label: ' ',name:'delete', className:"dgrid-column-type-boolean",field:' host',formatter:utilities2.delete_row_ctrl},
			{label: ' ',name:'update',className:"dgrid-column-type-boolean",field:'host',formatter:utilities2.format_row_ctrl}
		];

		this.view = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._hosts,
			sort: [{ attribute: "host", descending: false }],
			query:{}
		});

		this.hosts_grid_view.set("content", this.view);
		this.view.on(".dgrid-cell:click", lang.hitch(this,this._OnSelectRow));

	},
	_OnSelectRow : function(e)
	{
		var cell = this.view.cell(e);

		this._row = cell.row.data;
		if ( cell.column.id  == 1)
		{
			if ( confirm("Delete Host " + this._row.host + "?"))
			{
				request.post("/hostspf/hostspf_delete",
					utilities2.make_params({ data : {host : this._row.host}})).
					then(this._DeleteHostCallBack);
			}
		}
		else
		{
			this.options.selectChild(this.host_update);
			this.host2.set("value", this._row.host);
			this.is_valid_source2.set("checked", this._row.is_valid_source);
			this.privatekey2.set("value", "");
			this.selector2.set("value", this._row.selector);
		}
	},
	_Close:function()
	{
		this.hostdialog.hide();
	},
	_New:function()
	{
		this.host.set("value","");
		this.is_valid_source.set("checked", true);
		this.privatekey.set("value","");
		this.selector.set("value","");
		this.hostdialog.show();
		this.host.focus();
	},
	_Add:function()
	{
		if ((this.privatekey.value == '' && this.selector.value != '') || (this.privatekey.value != '' && this.selector.value == ''))
		{
			alert("Not all required field filled in")
			this.addbtn.cancel();
			return false;
		}
		if (utilities2.form_validator( this.form ) == false)
		{
			this.addbtn.cancel();
			alert("Not all required field filled in");
			return false;
		}
		request.post("/hostspf/hostspf_add",
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._AddHostCallBack);
	},
	_AddHostCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._hosts.add( response.data );
			this._Close();
			this.host.set("value","");
			this.options.selectChild(this.host_update);
			this.host2.set("value", response.data.host);
		}
		else if ( response.success == "DU")
		{
			alert("Already exists");
		}
		else
		{
			alert("Problem Adding");
		}

		this.addbtn.cancel();
	},
	_UpdateHostCall:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Host Updated");
			this.view.set("query",{});
		}
		else if ( response.success == "DU")
		{
			alert("Already Exists");
			this.host2.focus();
		}
		else
		{
			alert("Problem Adding");
		}

		this.updbtn.cancel();
	},
	_Update:function()
	{
		if ((this.privatekey2.value == '' && this.selector2.value != '') || (this.privatekey2.value != '' && this.selector2.value == ''))
		{
			alert("Please update both Private Key and Selector")
			this.updbtn.cancel();
			return false;
		}
		if (utilities2.form_validator( this.formupd ) == false )
		{
			this.updbtn.cancel();
			return false;
		}
		
		request.post("/hostspf/hostspf_update",
			utilities2.make_params({ data : this.formupd.get("value")})).
			then(this._UpdateHostCallBack);
	},
	_DeleteHostCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._hosts.remove(this._row.host)
			this._row = null;
			this.options.selectChild(this.blank);
		}
		else
		{
			alert("Problem Deleting");
		}
	}
});
});
