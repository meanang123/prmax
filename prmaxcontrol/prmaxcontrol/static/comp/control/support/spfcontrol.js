//-----------------------------------------------------------------------------
// Name:    control.support.spfcontrol
// Author:
// Purpose:
// Created: 17//
//
// To do:
//
//-----------------------------------------------------------------------------
define([
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
