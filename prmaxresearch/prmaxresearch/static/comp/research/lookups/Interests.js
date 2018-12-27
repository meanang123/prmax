//-----------------------------------------------------------------------------
// Name:    search.js
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
	"dojo/text!../lookups/templates/Interests.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/store/Memory",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, Memory, request, utilities2, json, topic ){
 return declare("research.lookup.Interests",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/interests/list', idProperty:"interestid"}));
		this.interest_outlet_used = new Observable( new JsonRest( {target:'/research/admin/interests/research_where_used_outlet', idProperty:"outletid"}));
		this.interest_employee_used = new Observable( new JsonRest( {target:'/research/admin/interests/research_where_used_employee', idProperty:"employeeid"}));

		this._add_interest_call_back = dojo.hitch ( this, this._add_interest_call ) ;
		this._rename_interest_call_back = dojo.hitch ( this, this._rename_interest_call ) ;
		this._delete_interest_call_back = dojo.hitch ( this, this._delete_interest_call ) ;
		this._delete_outlet_call_back = dojo.hitch ( this, this._delete_outlet_call ) ;
		this._delete_employee_call_back = dojo.hitch ( this, this._delete_employee_call ) ;
		this._transfer_selection_call_back = dojo.hitch ( this, this._transfer_selection_call ) ;
		this._transfer_call_back = dojo.hitch(this, this._transfer_call);
	},
		postCreate:function()
		{
		var cells =
		[
			{label: 'Id',className: "dgrid-column-nbr-right",field:"interestid"},
			{label: 'Keywords',className: "standard", field:"interestname"},
			{label: 'Parent',className: "standard", field:"parentname"},
			{label: 'is_section', className:"dgrid-column-type-small", field:'is_section'}
		];
		this.interest_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			sort: [{ attribute: "interestname", descending: false }]
		})
		this.interest_grid_view.set("content", this.interest_grid);
		this.interest_grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));
		this.interest_grid.set("query",{});

		var cells =
		[
			{label: 'Outlet Name',className: "standard",field:"outletname"},
			{label: ' ',className:"grid-field-image-view",formatter:utilities2.delete_icon}
		];
		this.interest_outlet_used_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.interest_outlet_used
		})
		this.interest_outlet_used_grid_view.set("content", this.interest_outlet_used_grid);
		this.interest_outlet_used_grid.on("dgrid-select", dojo.hitch(this,this._outlet_where_used));

		var cells =
		[
			{label: 'Outlet Name',className: "standard",field:"outletname"},
			{label: 'Contact',className: "standard",field:"contactname"},
			{label: 'Job Title',className: "standard",field:"job_title"},
			{label: ' ',className:"grid-field-image-view",formatter:utilities2.delete_icon}
		];
		this.interest_employee_used_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.interest_employee_used,
			query:{}
		})
		this.interest_employee_used_grid.on("dgrid-select", dojo.hitch(this,this._contact_where_used));

		this.master_type.set("store",PRCOMMON.utils.stores.Interest_Filter());
		this.master_type.set("value", -1 ) ;
		this.master_type2.set("store",PRCOMMON.utils.stores.Interest_Filter());
		this.master_type2.set("value", -1 ) ;

		dojo.connect(this.transfer_list_select.domNode,"onkeyup" , dojo.hitch(this,this._transfer_select));
		dojo.connect(this.transfer_list,"onchange" ,  dojo.hitch(this,this._transfer_selection_options));

		topic.subscribe(PRCOMMON.Events.Interest_Delete, dojo.hitch(this,this._interest_delete_event));
		topic.subscribe(PRCOMMON.Events.Interest_Update, dojo.hitch(this,this._interest_update_event));
		topic.subscribe(PRCOMMON.Events.Interest_Add, dojo.hitch(this,this._interest_add_event));

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.interest_employee_used_grid_view.set("content", this.interest_employee_used_grid);
	},
	_delete_outlet_call:function( response )
	{
		if ( response.success == "OK" )
		{
			this.interest_outlet_used.remove( this._outlet_row.outletid ) ;
			this._outlet_row = null;
		}
	},
	_outlet_where_used:function( e )
	{
		if (confirm("Delete Coverage"))
		{
			this._outlet_row = e.rows[0].data;
			request.post('/research/admin/interests/research_delete_from_outlet',
				utilities2.make_params({data:{outletid: this._outlet_row.outletid,
					interestid: this._interestid }})).
				then(this._delete_outlet_call_back);
		}
	},
	_delete_employee_call:function( response )
	{
		if ( response.success == "OK" )
		{
			this.interest_employee_used.remove( this._employee_row.employeeid ) ;
			this._employee_row = null;
		}
	},
	_contact_where_used:function( e )
	{
		if ( confirm("Delete Employee") )
		{
			this._employee_row = e.rows[0].data;
			request.post('/research/admin/interests/research_delete_from_employee',
				utilities2.make_params({ data : {employeeid: this._employee_row.employeeid,
					interestid: this._interestid }})).
				then (this._delete_employee_call_back);
		}
	},
	_execute:function()
	{
			var query = {filter:arguments[0].filter};
			this.interest_grid.set("query",query);
			this._clear();
	},
	_add_interest_call:function( response )
	{
		if ( response.success == "OK" )
		{
			topic.publish(PRCOMMON.Events.Interest_Add, response.data);
			alert("Keyword Added");
			this._clear_add();
		}
		else if ( response.success == "DU" )
		{
			alert("Keywords all ready exists");
		}
		else
		{
			alert("Problem adding Keyword");
		}
	},
	_execute_add:function()
	{
		if (this.interestname.isValid() == false )
		{
			alert("No Keywords Specified");
		}
		else
		{
			var content =  { interestname:arguments[0].interestname,
				parentinterestid:arguments[0].interestparentid };

			if (arguments[0].is_new_section[0] == "on")
				content["is_section"] = 1;

			request.post('/research/admin/interests/research_add',
				utilities2.make_params({ data: content})).
				then( this._add_interest_call_back );
		}
		return false ;
	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_clear_add:function()
	{
		this.interestname.set("value","");
		this.master_type.set("value",-1);
	},
	_clear:function()
	{
		this.interest_view.selectChild(this.blank);
		this._interestid = null;
		this._row = null;
		this.interest_outlet_used_grid.set("query",{});
		this.interest_employee_used_grid.set("query",{});
	},
	_on_cell_call : function(e)
	{
		var row = e.rows[0].data;

		this.interest_view.selectChild(this.details_view);
		this.interest_outlet_used_grid.set( "query", {interestid:row.interestid});
		this.interest_employee_used_grid.set( "query", {interestid:row.interestid});
		this._interestid = row.interestid;
		dojo.attr(this.interest_name, row.interestname);
		this.is_section.set("value", row.is_section);
		this.interestname2.set("value",row.interestname);
		if (row.parentinterestid == null || row.parentinterestid == "")
			this.master_type2.set("value",-1);
		else
			this.master_type2.set("value",row.parentinterestid);
		this._row = row ;
	},
		_delete_interest_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Interest_Delete, response.data.interest.interestid );
				alert("Keywords Delete");
			}
			else
			{
				alert ("Problem Deleting Keywords may still be in use ");
			}
		},
		_delete_interest:function()
		{
			if (confirm("Delete Keywords"))
			{
				request.post('/research/admin/interests/research_delete',
					utilities2.make_params({ data : { interestid: this._interestid}})).
					then ( this._delete_interest_call_back);
			}
			return false ;
		},
		_rename_interest_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Interest_Update, response.data);
				dojo.attr(this.interest_name, response.data.interest.interestname);
				alert("Keywords Renamed");
			}
			else if ( response.success == "DU" )
			{
				alert("Already Exists");
			}
			else
			{
				alert ("Problem Renaming Keyword");
			}
		},
		_rename_interest:function()
		{
			if (this.interestname2.isValid() == false )
			{
				alert("No Keyword Specified");
				return false;
			}

			if (confirm("Update Keyword"))
			{
				var content = {interestname:this.interestname2.get("value"),
												parentinterestid:this.master_type2.get("value"),
												interestid: this._interestid};

				if ( this.is_section.get("checked"))
					content["is_section"] = 1;

				request.post('/research/admin/interests/research_rename',
					utilities2.make_params({data:content})).
					then( this._rename_interest_call_back)
			}
			return false ;
		},
		_interest_delete_event:function( interestid )
		{
			this._store.remove(interestid);
			this._clear();
		},
		_interest_update_event:function( data )
		{
			this._store.put( data );
		},
		_interest_add_event:function ( data )
		{
			this._store.add( data );
		},
		_transfere:function()
		{
			dojo.toggleClass(this.show_transfer,"prmaxhidden");
		},
		_transfer_call:function( response )
		{
			if ( response.success == "OK" )
			{
				this.interest_outlet_used_grid.set("query",{interestid:this._interestid});
				this.interest_employee_used_grid.set("query",{interestid:this._interestid});
				this._clear_transfer_selection_box();
				this._transfere();
				alert("Keywords Moved");
			}
			else
			{
				alert("Problem Moving Keywords");
			}
		},
		_transfere_do:function()
		{
			if (parseInt(this.transfer_list.options[this.transfer_list.selectedIndex].value) == this._interestid)
			{
				alert("Cannot Move too it's self");
				return;
			}

			if ( confirm ( "Move Keyword to " + this.transfer_list.options[this.transfer_list.selectedIndex].text +"?") )
			{
				request.post('/research/admin/interests/research_move_interest',
					utilities2.make_params({ data: {
							frominterestid:this._interestid,
							tointerestid: this.transfer_list.options[this.transfer_list.selectedIndex].value
					}})).
					then (this._transfer_call_back);
			}
		},
		_transfer_selection_call:function( response )
		{
			if ( this._transactionid == response.transactionid )
			{
				this._clear_transfer_selection_box();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.transfer_list.options[this.transfer_list.options.length] = new Option(
							record[0] + "(" + record[1] + ")",
							record[1]);
				}
				this._transfer_selection_options();
			}
		},
		_transfer_select:function()
		{
			var data = this.transfer_list_select.get("value");
			if (data.length>0)
			{
				this._transactionid = PRCOMMON.utils.uuid.createUUID();

				request.post('/interests/listuserselection',
					utilities2.make_params({data:{
							word:data,
							filter:-1,
							interesttypeid:1,
							transactionid: this._transactionid,
							restrict:0
					}})).
					then (this._transfer_selection_call_back);
			}
			else
			{
				this._clear_transfer_selection_box();
				this._transfer_selection_options();
			}
		},
		_transfer_selection_options:function()
		{

		},
		_clear_transfer_selection_box:function()
		{
			this.transfer_list.options.length=0;
		},
		_transfer_selection_options:function()
		{
			this.transfer_do.set('disabled', this.transfer_list.selectedIndex!=-1?false:true);
		}
});
});
