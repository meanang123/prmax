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
dojo.provide("prmax.dataadmin.Interests");

dojo.declare("prmax.dataadmin.Interests",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/Interests.html"),
		constructor: function()
		{
			this.interests = new prcommon.data.QueryWriteStore ( {url:'/dataadmin/interests',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker});
			this.interest_outlet_used = new prcommon.data.QueryWriteStore ( {url:'/interests/research_where_used_outlet',
							nocallback:true,
				onError:ttl.utilities.globalerrorchecker});
			this.interest_employee_used = new prcommon.data.QueryWriteStore ( {url:'/interests/research_where_used_employee',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker});

			this._AddInterestCallBack = dojo.hitch ( this, this._AddInterestCall ) ;
			this._RenameInterestCallBack = dojo.hitch ( this, this._RenameInterestCall ) ;
			this._DeleteInterestCallBack = dojo.hitch ( this, this._DeleteInterestCall ) ;
			this._DeleteOutletCallBack = dojo.hitch ( this, this._DeleteOutletCall ) ;
			this._DeleteEmployeeCallBack = dojo.hitch ( this, this._DeleteEmployeeCall ) ;
			this._TransferSelectionCallBack = dojo.hitch ( this, this._TransferSelectionCall ) ;
			this._TransferCallBack = dojo.hitch(this, this._TransferCall);
		},
		postCreate:function()
		{
			this.interest_grid.set("structure",this.view);
			this.interest_grid._setStore(this.interests );
			this.baseonCellClick = this.interest_grid['onCellClick'];
			this.interest_grid['onStyleRow'] = dojo.hitch(this,ttl.GridHelpers.onStyleRow);
			this.interest_grid['onRowClick'] = dojo.hitch(this,this.onSelectRow);
			this.interest_grid['onCellClick'] = dojo.hitch(this,this.onCellClick);

			this.interest_outlet_used_grid['onCellClick'] = dojo.hitch(this,this._OutletWhereUsed);
			this.interest_employee_used_grid['onCellClick'] = dojo.hitch(this,this._ContactWhereUsed);

			this.interest_outlet_used_grid.set("structure",this.view_user_outlet);
			this.interest_outlet_used_grid._setStore(this.interest_outlet_used );
			this.interest_employee_used_grid.set("structure",this.view_user_employee);
			this.interest_employee_used_grid._setStore(this.interest_employee_used );

			this.master_type.store = PRCOMMON.utils.stores.Interest_Filter();
			this.master_type.set("value", -1 ) ;
			this.master_type2.store = PRCOMMON.utils.stores.Interest_Filter();
			this.master_type2.set("value", -1 ) ;

			dojo.connect(this.transfer_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this._TransferSelect));
			dojo.connect(this.transfer_list,"onchange" ,  dojo.hitch(this,this._TransferSelectionOptions));

			dojo.subscribe(PRCOMMON.Events.Interest_Delete, dojo.hitch(this,this._InterestDeleteEvent));
			dojo.subscribe(PRCOMMON.Events.Interest_Update, dojo.hitch(this,this._InterestUpdateEvent));
			dojo.subscribe(PRCOMMON.Events.Interest_Add, dojo.hitch(this,this._InterestAddEvent));
		},
		view: {
			cells: [[
				{name: 'Interests',width: "auto",field:"interestname"},
				{name: 'Parent',width: "auto",field:"parentname"},
				{name: 'is_section', width: '50px', field:'is_section'}]]
		},
		view_user_employee: {
			cells: [[ {name: 'Outlet Name',width: "auto",field:"outletname"},
				{name: 'Contact',width: "auto",field:"contactname"},
				{name: 'Job Title',width: "auto",field:"job_title"},
				{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.deleteRowCtrl}
				]]
		},
		view_user_outlet: {
			cells: [[ {name: 'Outlet Name',width: "auto",field:"outletname"},
			{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.deleteRowCtrl}]]
		},
		resize:function()
		{
			this.frame.resize(arguments[0]);
		},
		_DeleteOutletCall:function( response )
		{
			if ( response.success == "OK" )
			{
				this.interest_outlet_used.deleteItem( this._outlet_row ) ;
			}
		},
		_OutletWhereUsed:function( e )
		{
			if ( e.cellIndex == 1 )
			{
				this._outlet_row = this.interest_outlet_used_grid.getItem(e.rowIndex);
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._DeleteOutletCallBack,
					url:'/interests/research_delete_from_outlet',
					content: {outletid: this._outlet_row.i.outletid,
					interestid: this._interestid }}));
			}
		},
		_DeleteEmployeeCall:function( response )
		{
			if ( response.success == "OK" )
			{
				this.interest_employee_used.deleteItem( this._employee_row ) ;
			}
		},
		_ContactWhereUsed:function( e )
		{
			if ( e.cellIndex == 3 )
			{
				this._employee_row = this.interest_employee_used_grid.getItem(e.rowIndex);
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._DeleteEmployeeCallBack,
					url:'/interests/research_delete_from_employee',
					content: {employeeid: this._employee_row.i.employeeid,
					interestid: this._interestid }}));
			}

		},
		destroy:function()
		{
			try
			{
				this.inherited(arguments);
			}
			catch(e){}
		},
		_Execute:function()
		{
				var query = {filter:arguments[0].filter};
				this.interest_grid.setQuery( ttl.utilities.getPreventCache(query));
				this._Clear();
		},
		_AddInterestCall:function( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Interest_Add, [response.data]);
				alert("Interest Added");
				this._ClearAdd();
			}
			else if ( response.success == "DU" )
			{
				alert("Interest all ready exists");
			}
			else
			{
				alert("Problem adding interest");
			}
		},
		_ExecuteAdd:function()
		{
			if (this.interestname.isValid() == false )
			{
				alert("No Interest Specified");
			}
			else
			{
				var content =  { interestname:arguments[0].interestname,
					parentinterestid:arguments[0].interestparentid };

				if (arguments[0].is_new_section[0] == "on")
					content["is_section"] = 1;

				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._AddInterestCallBack,
					url:'/interests/research_add',
					content: content}));
			}
			return false ;
		},
		_ClearFilter:function()
		{
			this.filter.set("value","");
		},
		_ClearAdd:function()
		{
			this.interestname.set("value","");
			this.master_type.set("value",-1);
		},
		_Clear:function()
		{
			this._interestid = null;
			this._row = null;
			dojo.addClass(this.details_view,"prmaxhidden");
			this.interest_outlet_used_grid.setQuery( ttl.utilities.getPreventCache({}));
			this.interest_employee_used_grid.setQuery( ttl.utilities.getPreventCache({}));
		},
		onSelectRow : function(e) {
			var row = this.interest_grid.getItem(e.rowIndex);

			dojo.removeClass(this.details_view,"prmaxhidden");

			this.interest_outlet_used_grid.setQuery( ttl.utilities.getPreventCache({interestid:row.i.interestid}));
			this.interest_employee_used_grid.setQuery( ttl.utilities.getPreventCache({interestid:row.i.interestid}));
			this._interestid = row.i.interestid;
			dojo.attr(this.interest_name, row.i.interestname);
			this.is_section.set("value", row.i.is_section);
			this.interestname2.set("value",row.i.interestname);
			this.master_type2.set("value",row.i.parentinterestid);
			this._row = row ;

			this.interest_grid.selection.clickSelectEvent(e);
		},
		onCellClick : function(e)
		{
			this.onSelectRow(e);
		},
		_DeleteInterestCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Interest_Delete, [response.data]);
				alert("Interest Delete");
			}
			else
			{
				alert ("Problem Deleting interest may still be in use ");
			}
		},
		_DeleteInterest:function()
		{
			if (confirm("Delete Interest"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._DeleteInterestCallBack,
					url:'/interests/research_delete',
					content: {interestid: this._interestid}}));
			}
			return false ;
		},
		_RenameInterestCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Interest_Update, [response.data]);
				dojo.attr(this.interest_name, response.data.interest.interestname);
				alert("Interest Renamed");
			}
			else if ( response.success == "DU" )
			{
				alert("Already Exists");
			}
			else
			{
				alert ("Problem Renaming interest");
			}
		},
		_RenameInterest:function()
		{
			if (this.interestname2.isValid() == false )
			{
				alert("No Interest Specified");
				return false;
			}

			if (confirm("Update Interest"))
			{
				var content = {interestname:this.interestname2.get("value"),
												parentinterestid:this.master_type2.get("value"),
												interestid: this._interestid};

				if ( this.is_section.get("checked"))
					content["is_section"] = 1;

				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._RenameInterestCallBack,
					url:'/interests/research_rename',
					content: content}));
			}
			return false ;
		},
		_InterestDeleteEvent:function( geographicalid )
		{
			this.interests.deleteItem(this._row);
			this._Clear();
		},
		_InterestUpdateEvent:function( data )
		{
			this.interests.setValue(  this._row, "interestname" , data.interest.interestname, true );
			this.interests.setValue(  this._row, "is_section" , data.is_section, true );
		},
		_InterestAddEvent:function ( data )
		{
			var row	= { interestid : data.interest.interestid ,
							interestname : data.interest.interestname ,
							parentname : "" ,
							parentinterestid : null }

			if ( data.parentinterest != null )
			{
				row["parentname"] = data.parentinterest.parentname;
				row["parentinterestid"] =  data.parentinterest.parentinterestid;
			}

			gHelper.AddRowToQueryWriteGrid(this.interest_grid,this.interests.newItem( row ));
		},
		_Transfere:function()
		{
			dojo.toggleClass(this.show_transfer,"prmaxhidden");
		},
		_TransferCall:function( response )
		{
			if ( response.success == "OK" )
			{
				this.interest_outlet_used_grid.setQuery( ttl.utilities.getPreventCache({interestid:this._interestid}));
				this.interest_employee_used_grid.setQuery( ttl.utilities.getPreventCache({interestid:this._interestid}));
				this._ClearTransferSelectionBox();
				this._Transfere();
				alert("Interest Moved");
			}
			else
			{
				alert("Problem Moving Interest");
			}
		},
		_Transfere_Do:function()
		{
			if ( confirm ( "Move Interest to " + this.transfer_list.options[this.transfer_list.selectedIndex].text +"?") )
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._TransferCallBack,
							url:'/interests/research_move_interest',
							content:{
							frominterestid:this._interestid,
							tointerestid: this.transfer_list.options[this.transfer_list.selectedIndex].value
					}}));
			}
		},
		_TransferSelectionCall:function( response )
		{
			if ( this._transactionid == response.transactionid )
			{
				this._ClearTransferSelectionBox();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.transfer_list.options[this.transfer_list.options.length] = new Option(
							record[0] + "(" + record[1] + ")",
							record[1]);
				}
				this._TransferSelectionOptions();
			}
		},
		_TransferSelect:function()
		{
			var data = this.transfer_list_select.get("value");
			if (data.length>0)
			{
				this._transactionid = PRCOMMON.utils.uuid.createUUID();

				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._TransferSelectionCallBack,
						url:'/interests/listuserselection',
						content:{
							word:data,
							filter:-1,
							interesttypeid:1,
							transactionid: this._transactionid,
							restrict:0
				}}));
			}
			else
			{
				this._ClearTransferSelectionBox();
				this._TransferSelectionOptions();
			}
		},
		_TransferSelectionOptions:function()
		{

		},
		_ClearTransferSelectionBox:function()
		{
			this.transfer_list.options.length=0;
		},
		_TransferSelectionOptions:function()
		{
			this.transfer_do.set('disabled', this.transfer_list.selectedIndex!=-1?false:true);
		}
});





