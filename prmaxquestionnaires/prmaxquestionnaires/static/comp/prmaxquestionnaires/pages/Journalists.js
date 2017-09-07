//-----------------------------------------------------------------------------
// Name:    OutletEdit.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/Journalists.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic, domattr, domclass ){
 return declare("prmaxquestionnaires.pages.Journalists",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this.outlet_contact_model = new Observable( new JsonRest( {target:'/questionnaire/journalists', idProperty:"key"}));

		topic.subscribe(PRCOMMON.Events.Employee_Add, lang.hitch(this,this._employee_add_event));
		topic.subscribe(PRCOMMON.Events.Employee_Updated, lang.hitch(this,this._employee_update_event));
		this._load_call_back = lang.hitch(this,this._load_call);
		this._save_call_back = lang.hitch ( this , this._save_call );
		this._remove_call_back = lang.hitch ( this , this._remove_call );
		this._error_handler_call_back = lang.hitch(this,this._error_handler);
		this._add_call_back = lang.hitch(this,this._add_call);
		this._firsttime = true;
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Contact', className:"standard",field:"contactname"},
			{label: 'Job Title', className:"standard",field:"job_title"}
		];

		this.outlet_contact_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.outlet_contact_model,
			query: {outletid: PRMAX.questionnaire.outlet.outlet.outletid,
			researchprojectitemid: PRMAX.questionnaire.questionnaireid }
		});

		this.outlet_contact_grid_view.set("content", this.outlet_contact_grid);
		this.outlet_contact_grid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		this.outlet_contact_grid.on("dgrid-refresh-complete", lang.hitch(this,this._first_time_call));

		this.questionnaireid.set("value", PRMAX.questionnaire.questionnaireid );

		this.inherited(arguments);
	},
	_first_time_call:function( evt )
	{
		if ( this._firsttime==true)
		{
			if (evt.results.results && evt.results.results[0].length>0)
			{
				this.outlet_contact_grid.select(this.outlet_contact_grid.row(evt.results.results[0][0].key));
				this._post_load_request( evt.results.results[0][0] );
			}
			this._firsttime = false;
		}
	},
	_on_cell_call : function(e)
	{
		var cell = this.outlet_contact_grid.cell(e);

		if (cell.row)
			this._post_load_request( cell.row.data);
	},
	_post_load_request:function( data )
	{
		request.post('/questionnaire/get_journalist',
			utilities2.make_params({ data : {
				objectid:data.objectid,
				questionnaireid : this.questionnaireid.get("value"),
				typeid: data.typeid
				}})).
			then (this._load_call_back,this._error_handler_call_back);
	},
	_load_call:function( response)
	{
		if ( response.success == "OK")
		{
			domattr.set(this.contact_mode,"innerHTML","");
			this.objectid.set("value", response.data.objectid);
		  this.prefix.set("value", response.data.prefix);
		  this.firstname.set("value", response.data.firstname);
		  this.familyname.set("value", response.data.familyname);
		  this.job_title.set("value", response.data.job_title);
		  this.tel.set("value", response.data.tel);
		  this.fax.set("value", response.data.fax);
		  this.mobile.set("value", response.data.mobile);
		  this.email.set("value", response.data.email);
		  this.twitter.set("value", response.data.twitter);
		  this.facebook.set("value", response.data.facebook);
		  this.linkedin.set("value", response.data.linkedin);
		  this.instagram.set("value", response.data.instagram);
			this.interests.set("value", response.data.interests);
			domattr.set(this.interests_org,"innerHTML",response.data.interests_org);
			this.typeid.set("value", response.data.typeid);

			if (response.data.alt_address == false)
			{
				this.no_address.set("checked",false) ;
				this._address_show_do ( false ) ;
				this.address1.set("value","");
				this.address2.set("value","");
				this.townname.set("value","");
				this.county.set("value","");
				this.postcode.set("value","");
			}
			else
			{
				this.no_address.set("checked", true) ;
				this._address_show_do ( true ) ;
				this.address1.set("value",response.data.address1);
				this.address2.set("value",response.data.address2);
				this.townname.set("value",response.data.townname);
				this.county.set("value",response.data.county);
				this.postcode.set("value",response.data.postcode);
			}
			this.updatebtn.cancel();
			this.removebtn.cancel();
			domclass.remove(this.removebtn.domNode,"prmaxhidden");
			this.contact_edit_container.selectChild(this.contact_edit_view);
		}
	},
	_employee_update_event:function ( employee )
	{
		this.outlet_contact_model.put ( employee);
	},
	_employee_add_event:function ( employee )
	{
		this.outlet_contact_model.add(employee);
	},
	_show_add:function()
	{
		domattr.set(this.contact_mode,"innerHTML","Add New Journalist");
		this.objectid.set("value", -1);
		this.prefix.set("value", "");
		this.firstname.set("value", "");
		this.familyname.set("value", "");
		this.job_title.set("value", "");
		this.tel.set("value", "");
		this.fax.set("value", "");
		this.mobile.set("value", "");
		this.email.set("value", "");
		this.twitter.set("value", "");
		this.facebook.set("value", "");
		this.linkedin.set("value", "");
		this.instagram.set("value", "");
		this.no_address.set("checked", false) ;
		this._address_show_do ( false ) ;
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.interests.set("value","");
		domattr.set(this.interests_org,"innerHTML","");

		this.updatebtn.cancel();
		domclass.add(this.removebtn.domNode,"prmaxhidden");
		this.contact_edit_container.selectChild(this.contact_edit_view);
		this.outlet_contact_grid.clearSelection();
	},
	_save_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		if (	this.objectid.get("value") == -1)
		{
			request.post('/questionnaire/add_contact',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._add_call_back,this._error_handler_call_back);
		}
		else
		{
			request.post('/questionnaire/update_contact',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._save_call_back,this._error_handler_call_back);
		}
	},
	_add_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.outlet_contact_model.add( response.data );
			this.objectid.set("value", response.data.objectid);
			this.typeid.set("value", response.data.typeid);
			domclass.remove(this.removebtn.domNode,"prmaxhidden");
			domattr.set(this.contact_mode,"innerHTML","");
			this.outlet_contact_grid.select( response.data );
			alert("Journalist Added");
		}
		else
		{
			alert("Problem applying changes");
		}
		this.updatebtn.cancel();
		this.removebtn.cancel();
	},
	_save_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Journalist Updated");
			this.outlet_contact_model.put ( response.data );
			this.outlet_contact_grid.select( response.data );
		}
		else
		{
			alert("Problem applying changes");
		}
		this.updatebtn.cancel();
		this.removebtn.cancel();
	},
	_remove_contact:function()
	{
		if ( confirm ("Delete Journalist"))
		{
			request.post('/questionnaire/delete_contact',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._remove_call_back,this._error_handler_call_back);
		}
		else
		{
			throw "N";
		}
	},
	_remove_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.outlet_contact_model.remove( response.data.key );
			this.contact_edit_container.selectChild(this.blank_cont_view);
			alert("Journalist Removed");
			var tmp = Object.keys(this.outlet_contact_grid._rowIdToObject);
			if (tmp.length)
			{
				this.outlet_contact_grid.select(this.outlet_contact_grid._rowIdToObject[tmp[0]]);
				this._post_load_request( this.outlet_contact_grid._rowIdToObject[tmp[0]] );
			}
		}
		else
		{
			alert("Problem Removing Journalist");
		}

		this.removebtn.cancel();

	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		this.updatebtn.cancel();
		this.removebtn.cancel();
	},
	_address_show:function()
	{
		this._address_show_do ( this.no_address.get("checked") ) ;
	},
	_address_show_do:function ( show_it )
	{
		var _HidFields = ["addr1","addr2","addr3","addr4","addr5"];

		if ( show_it == false )
		{
			for ( var key in _HidFields )
				domclass.add(this[_HidFields[key]], "prmaxhidden");
		}
		else
		{
			for ( var key in _HidFields )
				domclass.remove(this[_HidFields[key]], "prmaxhidden");
		}
	},
	save_move:function( page_ctrl, error_ctrl )
	{
		page_ctrl();
		throw "N";
	}
});
});


