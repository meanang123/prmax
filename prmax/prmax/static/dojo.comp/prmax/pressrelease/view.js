//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose: maintannce for distrbutions
// Created: 01/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.view");


dojo.require("prmax.pressrelease.Duplicate");
dojo.require("prmax.pressrelease.newrelease");
dojo.require("prmax.pressrelease.saveasstanding");
dojo.require("prmax.pressrelease.briefreport");
dojo.require("prmax.pressrelease.rename");
dojo.require("prmax.pressrelease.output");
dojo.require("prcommon.crm.add");
dojo.require("prcommon.date.daterange");

dojo.declare("prmax.pressrelease.view",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	types : 0,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/view.html"),
	startup_mode:"Display All",
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore ( {url:'/emails/templates_list_grid', nocallback:true} );
		this.model2 = new prcommon.data.QueryWriteStore ( {url:'/emails/distribution_view'} );
		this.model_clips = new prcommon.data.QueryWriteStore ( {url:'/clippings/list_clippings_emailtemplate'} );
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});

		this._DeleteReleaseCallBack = dojo.hitch ( this, this._DeleteReleaseCall ) ;
		this._ShowDetailsCallBack = dojo.hitch(this, this._ShowDetailsCall );
		this._PullReleaseCallBack = dojo.hitch(this, this._PullReleaseCall);
		this._Load_Seo_Call_Back = dojo.hitch(this, this._Load_Seo_Call);
		this._WithDrawCallBack = dojo.hitch(this, this._WithDrawCall);
		if (PRMAX.utils.settings.seo == true )
			this.view["cells"][0][6] = {name: 'Seo Release', width: "60px", field:"seopressrelease_display"};
		if (PRMAX.utils.settings.crm == true )
		{
			this.view["cells"][0].push({name: PRMAX.utils.settings.issue_description, width: "120px", field:"issuename"});
		}
		dojo.subscribe("/pr/rename", dojo.hitch(this, this._rename_event));
		dojo.subscribe('/update/distribution_label', dojo.hitch(this,this._UpdateDistributionLabelEvent));
	},
	postCreate:function()
	{
		dojo.attr(this.client_label,"innerHTML", PRMAX.utils.settings.client_name );
		dojo.attr(this.rename_dialog, "title", "Rename " + PRMAX.utils.settings.distribution_description );
		dojo.attr(this.duplcatedlg, "title", "Duplicate " + PRMAX.utils.settings.distribution_description );
		dojo.attr(this.show_list, "label", PRMAX.utils.settings.distribution_description);

		this.view["cells"][0][5]["name"] = PRMAX.utils.settings.client_name;

		this.grid.set("structure",this.view);
		this.grid2.set("structure",this.view2);
		this.grid_clips.set("structure",this.view_clips);

		this.grid['onStyleRow'] = dojo.hitch(this,this._OnStyleRow);
		this.grid['onCellClick'] = dojo.hitch(this,this.onCellClick);
		this.grid2['onCellClick'] = dojo.hitch(this,this._OnCellClick2);

		this.grid._setStore(this.model);
		this.grid2._setStore(this.model2);
		this.grid_clips._setStore(this.model_clips);
		this.clientid.set("store", this._clients);
		this.clientid.set("value",-1);

		if ( this.startup_mode != "All")
		{
			this.option.set("value",this.startup_mode);

			this.grid.setQuery( ttl.utilities.getPreventCache(
				{restrict:this.option.get("value"),
				//timerestriction: this.option2.get("value"),
				drange: this.drange.get("value")}));
		}

		if (PRMAX.utils.settings.useemail == false || PRMAX.utils.settings.isdemo == true )
		{
			dojo.addClass(this.addbutton.domNode , "prmaxhidden");
		}

		this.inherited(arguments);
	},
	_OnStyleRow:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	_DeleteReleaseCall:function ( response )
	{
		if ( response.success == "OK")
		{
			this.model.deleteItem(this._row);
			alert("Distrbution Deleted");
			this._ClearAndHideDetails();
		}
		else
		{
			alert("Press Release lists cannot be deleted without first deleting the Press Release");
		}
	},
	onCellClick : function(e)
	{
		console.log("onCellClick",e);
		// user click on a general display row
		this.grid.selection.clickSelectEvent(e);
		this._row = this.grid.getItem(e.rowIndex);
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._ShowDetailsCallBack,
				url:'/emails/templates_get_min',
				content:{emailtemplateid:this._row.i.emailtemplateid}
			}));
	},
	_OnCellClick2:function ( e )
	{
		this.grid2.selection.clickSelectEvent(e);
		this._row2 = this.grid2.getItem(e.rowIndex);

		if ( this._row2.i.hasmsg && e.cellIndex == 6 )
		{
			this.msgctrl.set("href",dojo.string.substitute("/emails/distribution_details?listmemberdistributionid=${listmemberdistributionid}",
												{listmemberdistributionid:this._row2.i.listmemberdistributionid}));
			this.msg_dialog.show();
		}
		if ( e.cellIndex == 0 && PRMAX.utils.settings.crm == true )
		{
			this.crm_add.set("dialog",this.crm_dlg);
			this.crm_add.clear();
			this.crm_add.load(this._row2.i.outletid,this._row2.i.outletname,this._row2.i.employeeid,this._row2.i.contactname,this._row2.i.contactid, this._emailtemplateid);
			this.crm_dlg.show();
			this.crm_dlg.resize();
		}
	},
	_CancelShow:function()
	{
		this.msgctrl.set("content","");
		this.msg_dialog.hide();
	},
	_ShowDetailsCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this._list_view = true;
			dojo.removeClass(this.show_email.domNode,"prmaxhidden");
			dojo.removeClass(this.refresh_show_list.domNode,"prmaxhidden");
			dojo.removeClass(this.show_clippings.domNode,"prmaxhidden");
			if (PRMAX.utils.settings.has_ct == true )
				dojo.removeClass(this.show_analysis.domNode,"prmaxhidden");

			dojo.attr(this.listname_display, "innerHTML" , this._row.i.emailtemplatename ) ;
			this._emailtemplateid = response.data.emailtemplateid;
			this.grid2.setQuery( ttl.utilities.getPreventCache({emailtemplateid: response.data.emailtemplateid}));
			this.grid_clips.setQuery( ttl.utilities.getPreventCache({emailtemplateid: response.data.emailtemplateid}));

			this.controls.selectChild ( this.main_view ) ;
			this.controls2.selectChild ( this.grid2 );
			this.sent_view.set("href","/emails/templates_text?emailtemplateid=" + response.data.emailtemplateid);
			this.analysis_view.set("href","/emails/templates_analysis?emailtemplateid=" + this._row.i.emailtemplateid);
			//
			if (response.data.pull)
				dojo.removeClass(this.pull_release.domNode,"prmaxhidden");
			else
				dojo.addClass(this.pull_release.domNode,"prmaxhidden");

			this.cont_stack.selectChild ( this.distribution_view );
			if (PRMAX.utils.settings.seo == true )
			{
				this.seopressrelease.Clear();
				if (response.data.seopressrelease)
					dojo.removeClass(this.seo_show.domNode,"prmaxhidden");
				else
					dojo.addClass(this.seo_show.domNode,"prmaxhidden");
			}
			if (this._row.i.pressreleasestatusid == 2)
				dojo.removeClass(this.show_brief.domNode,"prmaxhidden");
			else
				dojo.addClass(this.show_brief.domNode,"prmaxhidden");
		}
	},
	_ClearAndHideDetails:function()
	{
		this.controls.selectChild ( this.blank_view ) ;
		dojo.attr(this.listname_display, "innerHTML" , "" ) ;
		this.grid2.setQuery( ttl.utilities.getPreventCache({}));
		this.controls2.selectChild ( this.grid2);
		this.sent_view.set("content","");
		this.analysis_view.set("content","");
	},
	_DeleteRelease: function ()
	{
		// delete
		if ( confirm("Delete " + this._row.i.emailtemplatename + "?"))
		{
			var collateral = true;

			if ( confirm("Retain Collateral as global?"))
				collateral = false;

			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._DeleteReleaseCallBack,
					url:'/emails/template_delete',
					content:{emailtemplateid:this._row.i.emailtemplateid, delete_collateral: collateral}
				}));
		}
	},
	_RenameRelease:function()
	{
		this.rename_ctrl.load(this._row.i.emailtemplateid,this.rename_dialog);
	},
	view: {
		cells: [[
		{name: 'Description',width: "300px",field:"emailtemplatename"},
		{name: 'Time Sent',width: "120px",field:"display_sent_time"},
		{name: 'Schedule Delivery',width: "120px",field:"embargo_display"},
		{name: 'Nbr',width: "40px",field:"nbr"},
		{name: 'Status', width: "60px", field:"status"},
		{name: 'Client', width: "60px", field:"clientname"}
		]]
	},
	view2: {
		cells: [[
		{name: ' ',width: "12px",field:"h", formatter:ttl.utilities.format_row_ctrl},
		{name: 'Outlet',width: "200px",field:"outletname"},
		{name: 'Job title',width: "150px",field:"job_title"},
		{name: 'Contact',width: "150px",field:"contactname"},
		{name: 'Email',width: "150px",field:"emailaddress"},
		{name: 'Status',width: "60px",field:"status"},
		{name: ' ',width: "2em",field:"hasmsg", formatter:ttl.utilities.genericView}
		]]
	},
	view_clips: { //this is for the clippings
		cells: [[
		{name: 'Date',width: "60px",field:"clip_source_date_display"},
		{name: 'Title',width: "300px",field:"clip_title"},
		{name: 'Outlet',width: "120px",field:"outletname"},
		{name: 'Client',width: "120px",field:"clientname"},
		{name: 'Issue',width: "120px",field:"issuename"}
		]]
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	_AddDistributions:function()
	{
		dijit.byId("std_banner_control").ShowNewPressRelease();
	},
	Clear:function()
	{
		this.grid.setQuery(ttl.utilities.makeParams({}));
	},
	_OptionChanged:function()
	{
		//this.refresh();
		if ( this.option.get("value") == "Display Sent")
		{
			//dojo.removeClass(this.option2_label1,"prmaxhidden");
			//dojo.removeClass(this.option2_label2,"prmaxhidden");
			dojo.removeClass(this.drange_label,"prmaxhidden");
			dojo.removeClass(this.drange.domNode,"prmaxhidden");
		}
//		else if ( this.option.get("value") == "Display All" )
//		{
//			dojo.addClass(this.option2_label1,"prmaxhidden");
//			dojo.addClass(this.option2_label2,"prmaxhidden");
//			dojo.removeClass(this.drange_label,"prmaxhidden");
//			dojo.removeClass(this.drange.domNode,"prmaxhidden");
//		}
		else
		{
			//dojo.addClass(this.option2_label1,"prmaxhidden");
			//dojo.addClass(this.option2_label2,"prmaxhidden");
			dojo.addClass(this.drange_label,"prmaxhidden");
			dojo.addClass(this.drange.domNode,"prmaxhidden");
		}
	},
	refresh:function( startup )
	{
		if ( startup )
		{
			this.option.set("value", startup )
		}

		this.grid.setQuery( ttl.utilities.getPreventCache(
				{
					restrict:this.option.get("value"),
					//timerestriction: this.option2.get("value"),
					clientid : this.clientid.get("value"),
					drange: this.drange.get("value")
				}));

		this._ClearAndHideDetails();
	},
	_DuplicateRelease:function()
	{
		this.duplicatectrl.Load( this.duplcatedlg, this._row.i.emailtemplateid );
		this.duplcatedlg.show();
	},
	_SaveToStanding:function()
	{
		this.saveasstandingctrl.Load ( this.saveasstandingdlg , this._row.i.emailtemplateid );
		this.saveasstandingdlg.show();
	},
	_Show_List:function()
	{
		this._list_view = true;
		this.controls2.selectChild(this.grid2);
		this._swap_view();
	},
	_Show_Email:function()
	{
		this._list_view = false;
		this.controls2.selectChild(this.sent_view);
		this._swap_view();
	},
	_swap_view:function()
	{
		if (this._list_view == true)
		{
			dojo.addClass(this.show_list.domNode,"prmaxhidden");
			dojo.removeClass(this.show_email.domNode,"prmaxhidden");
		}
		else
		{
			dojo.removeClass(this.show_list.domNode,"prmaxhidden");
			dojo.addClass(this.show_email.domNode,"prmaxhidden");
		}
	},
	_Refresh_Show_List:function()
	{
		this.grid2.setQuery( ttl.utilities.getPreventCache({emailtemplateid: this._row.i.emailtemplateid}));
	},
	_Pull_Release:function()
	{
		if ( confirm("Return Release (" + this._row.i.emailtemplatename + ")to Draft for Editing?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._PullReleaseCallBack,
					url:'/emails/template_pull',
					content:{emailtemplateid:this._row.i.emailtemplateid}
				}));
		}
	},
	_PullReleaseCall:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Release returned to Drafts for Editing.");
			this.controls.selectChild ( this.blank_view ) ;
			this._OptionChanged();
		}
		else if ( response.success == "EX")
		{
			alert("Release Already Sent");
		}
		else
		{
			alert("Problem Pulling Release");
		}
	},
	_Show_Seo_Release:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._Load_Seo_Call_Back,
				url: "/emails/seorelease/get",
				content:{seoreleaseid : this._row.i.seoreleaseid}
		}));
	},
	_Load_Seo_Call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.seopressrelease.Load ( response.data.emailtemplateid, response.data ) ;
			this.cont_stack.selectChild ( this.seo_view );
		}
		else
		{

		}
	},
	_Update_Seo_Release:function()
	{
		if ( confirm("Update SEO Release" ) )
		{
			this.seopressrelease.Save();
		}
	},
	_Show_Distribution:function()
	{
		this.cont_stack.selectChild ( this.distribution_view );
	},
	_WithDrawCall:function( response )
	{
		if ( response.success == "OK")
		{
			dojo.addClass(this.seo_show.domNode,"prmaxhidden");
			this.cont_stack.selectChild ( this.distribution_view );
			this.model.setValue(  this._row, "seopressrelease_display" , "", true );

		}
		else
		{
			alert("Problem withdrawing Press Release");
		}
	},
	_Widthdraw_Seo_Release:function()
	{
		if ( confirm("Withdraw Release") )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._WithDrawCallBack,
					url: "/emails/seorelease/withdraw" ,
					content: {emailtemplateid:this._row.i.emailtemplateid}
				}));
		}
	},
	_brief_check_list:function()
	{
		this.report_ctrl.load( this._row.i.listid,this.report_dialog );
		this.report_dialog.show();
	},
	_change_client:function()
	{
		this.refresh();
	},
	_rename_event:function( emailtemplate )
	{
		this.model.setValue(  this._row, "emailtemplatename" , emailtemplate.emailtemplatename , true );
		this.model.setValue(  this._row, "clientname" , emailtemplate.clientname, true );
		this.model.setValue(  this._row, "issuename" , emailtemplate.issuename, true );
	},
	_show_analysis:function()
	{
		this.controls2.selectChild ( this.analysis_view );
	},
	_execute_filter:function()
	{
		var data = {
			restrict:this.option.get("value"),
			//timerestriction: this.option2.get("value"),
			clientid : this.clientid.get("value"),
			drange: this.drange.get("value")
		};

		var tmp = this.namefilter.get("value");

		if (tmp.length)
			data["emailtemplatename"] = tmp;

		this.grid.setQuery(ttl.utilities.getPreventCache(data));
	},
	_clear_filter:function()
	{
		this.clientid.set("value",-1);
		this.option.set("value","Display All");
		this.namefilter.set("value","");
	},
	_Show_Clippings:function()
	{
		this.controls2.selectChild ( this.grid_clips );
	},
	_clear_filter:function()
	{
		this.clientid.set("value",-1);
		this.option.set("value","Display All");
		this.namefilter.set("value","");
	},
	_UpdateDistributionLabelEvent:function()
	{
		dojo.attr(this.rename_dialog, "title", "Rename " + PRMAX.utils.settings.distribution_description );
		dojo.attr(this.duplcatedlg, "title", "Duplicate " + PRMAX.utils.settings.distribution_description );
		dojo.attr(this.show_list, "label", PRMAX.utils.settings.distribution_description);
	},
	_Output:function()
	{
		this.outputctrl.clear();
		this.outputctrl.set("dialog", this.dlg_output);
		this.dlg_output.show();
	}
});
