//-----------------------------------------------------------------------------
// Name:    prmax.display.StdBanner
// Author:  Chris Hoy
// Purpose:
// Created: 29/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.display.CommonBanner");

dojo.require("ttl.BaseWidget");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.lists.exclusions.view");
dojo.require("prmax.lists.exclusions.emailview");

dojo.require("prcommon.documents.view");


dojo.declare("prmax.display.CommonBanner",
	[ttl.BaseWidget],{
		widgetsInTemplate: true,
		message:"",
		showlabel:false,
		isuseradmin:false,
		canviewfinancial:false,
	constructor: function() {
		this.search = new prmax.search.SearchCtrl();
		this.stdDialog = new prmax.DlgCtrl2("width:30em;height:35em");
		this.largeDialog = new prmax.DlgCtrl2("width:710px;height:565px;");
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));
		dojo.subscribe(PRCOMMON.Events.PressReleaseStart, dojo.hitch(this,this._StartPressEvent));
		dojo.subscribe('/update/engagement_label', dojo.hitch(this,this._UpdateEngagementLabelEvent));
		dojo.subscribe('/update/distribution_label', dojo.hitch(this,this._UpdateDistributionLabelEvent));

	},
	postCreate:function()
	{
		if ( this.useradmin !=  null )
			this.useradmin.set("disabled" , this.isuseradmin?false:true);

		if ( this.financial != null )
			this.financial.set("disabled" , this.canviewfinancial?false:true);

		// for pro version show extra menu options
		if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
		{
			dojo.removeClass(this.tag_menu.domNode,"prmaxhidden");
			dojo.removeClass(this.project_menu.domNode,"prmaxhidden");
		}

		if (PRMAX.utils.settings.advancefeatures && this.advance_view)
			dojo.removeClass(this.advance_view.domNode,"prmaxhidden");

		// update subscription
		if (PRMAX.utils.settings.updatum && this.updatum_view)
			dojo.removeClass(this.updatum_view.domNode,"prmaxhidden");

		if (PRMAX.utils.settings.distributionistemplated && this.distribution_template_menu)
		{
			dojo.removeClass(this.distribution_template_menu.domNode,"prmaxhidden");
		}

		if ((PRMAX.utils.settings.useemail == false || PRMAX.utils.settings.isdemo == true ) && this.distribution_menu != null )
		{
			this.distribution_menu.set("disabled", true ) ;
		}

		if (PRMAX.utils.settings.no_distribution==true)
		{
			dojo.addClass(this.distribution_menu.domNode,"prmaxhidden");
		}

		if (this.clients)
		{
			dojo.attr(this.clients.containerNode,"innerHTML", PRMAX.utils.settings.client_name +"s" );
		}

		if ( this.banner_issue_label != null )
			this.banner_issue_label.set("label", PRMAX.utils.settings.issue_description+"s");

		if (PRMAX.utils.settings.crm)
		{
			if ( this.banner_crm)
				dojo.removeClass(this.banner_crm.domNode,"prmaxhidden");
			if ( this.banner_issue_label)
				dojo.removeClass(this.banner_issue_label.domNode,"prmaxhidden");
		}
		if (PRMAX.utils.settings.clippings && this.clippings != null )
		{
			dojo.removeClass(this.clippings.domNode,"prmaxhidden");
		}
		if (this.engbtn)
		{
			dojo.attr(this.engbtn, 'label', '<span><span class="main_menu_button"><i class="fa fa-user fa-2x"></i><p>'+PRMAX.utils.settings.crm_engagement_plural+'</p></span></span>');
		}
		if (this.distibution_menu)
		{
			dojo.attr(this.distribution_menu, 'label', '<span><span class="main_menu_button"><i class="fa fa-share-square-o fa-2x"></i><p>'+PRMAX.utils.settings.distribution_description_plural+'</p></span></span>');
		}
		if (this.distr_menuitem != undefined)
			dojo.attr(this.distr_menuitem.containerNode, 'innerHTML', PRMAX.utils.settings.distribution_description_plural);

		if (PRMAX.utils.settings.has_global_newsroom==false)
		{
			dojo.addClass(this.newsrooms.domNode,"prmaxhidden");
		}


		this.inherited(arguments);
	},
	loadLinks:function()
	{
		if (this.mainpanel==undefined)
			this.mainpanel = dijit.byId("std_view_stack");
	},
	_ShowSearchStd:function()
	{
		this._StdView("outlet_view",null,false);
		this._ShowSearchMode();
	},
	_ShowSearchAppend:function()
	{
		this._StdView("outlet_view",null,false);
		this._ShowSearchMode();
	},
	ShowSearchStd:function()
	{
		this._StdView("outlet_view",null,false);
		this._ShowSearchMode(1);
	},
	_ShowResultList:function( )
	{
		this.ShowResultList( );
	},
	ShowResultList:function( option, extra )
	{
		this._StdView( option || "outlet_view", extra , true );
	},
	_StdView:function( result_view , extra , show_sub_section)
	{
		this.loadLinks();
		href = "layout/std_view?result_view=" + result_view;
		if ( extra != null )
		{
			href += "&";
			href += extra;
		}
		var page = this.mainpanel.getPage("std_view.search_list");
		var args =  {key:"std_view.search_list",
							 href:href,
							 style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("std_view.search_list");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			var currentpage = this.mainpanel.selectedChildWidget;
			this.mainpanel.showPage(page);
			var control = dijit.byId("std_view.search_list");
			if ( currentpage != page )
			{
				if  (control != null)
					control.Refresh(result_view );
			}
			else if ( result_view != null && show_sub_section == true)
			{
				if  (control != null)
					control.showView( result_view );
			}
		}
	},
	_ShowSearchMode:function()
	{
		try
		{
			var window = this.search.show_search_form();
			this.search._setAdvanceModeAttr ( 0 );
			window.show();
			this.search.focus();
		}
		catch(e){}
	},
	_ShowListPage:function()
	{
		this.loadLinks();
		this._StdView("outlet_view",null,true);
	},
	_Logout:function()
	{
		if  ( confirm("Logout of Prmax?")==true)
			window.location.href = "/logout";
	},
	_Help:function()
	{
		this.loadLinks();
		var args =  {key:"help_system.html",
							 href:"layout/help_system",
							 style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("help_system.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	ShowListsPage:function()
	{
		this._Lists("standing",null);
	},
	_Lists:function( showviewname , startup)
	{
		this.loadLinks();
		href = "/layout/std_view_lists";
		if ( showviewname != null )
			href = href + "?selectedview=" + showviewname;
			if (startup)
			href = href + "&startup_mode=" + startup;

		var args =  {key:"std_view.list_view",
					href:href,
					style:"width:100%;height:100%"};
		var mainpanel = dijit.byId("std_view_stack");
		var page = mainpanel.getPage("std_view.list_view");
		if (page==null)
		{
			page = mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			dijit.byId("std_view.list_view").refresh( showviewname, startup);
			mainpanel.showPage(page);
		}
	},
	_DoLoadOutlet:function(outletid,key,tries)
	{
		++tries;
		if (tries>20) return ;
		var page_controller = dijit.byId(key+"_controller");
		if (page_controller!= undefined && page_controller.saveNode!= undefined)
		{
			page_controller.Load(outletid);
		}
		else
		{
			setTimeout("dijit.byId('std_banner_control')._DoLoadOutlet("+outletid + ",'"+key+"',"+tries+");",300);
		}
	},
	_DoLoadNewOutlet:function(key,tries)
	{
		++tries;
		if (tries>20) return ;
		var page_controller = dijit.byId(key+"_controller");
		if (page_controller!= undefined && page_controller.saveNode!= undefined)
		{
			page_controller.Clear()
		}
		else
		{
			setTimeout("dijit.byId('std_banner_control')._DoLoadNewOutlet('"+key+"',"+tries+");",300);
		}
	},
	_Outlet:function()
	{
		this.ShowOutlet();
	},
	ShowOutlet:function(outletid)
	{
		this.loadLinks();
		var args =  {key:"outlet_edit.html",
							 href:"/outlets/outlet_edit",
							 style:"width:100%;height:100%"};
		var mainpanel = dijit.byId("std_view_stack");
		var page = mainpanel.getPage("outlet_edit.html");
		if (page==null)
		{
			page = mainpanel.addPage ( args ) ;
			//ttl.utilities.resize (page ) ;
			//console.log("PBlank Page", outletid);
			if (outletid)
				this._DoLoadOutlet(outletid,args['key'],1);
			else
			{
				console.log("start");
				this._DoLoadNewOutlet(args['key'],1);
			}
		}
		else
		{
			var page_controller = dijit.byId(args['key']+"_controller");

			mainpanel.showPage(page);
			page_controller.Clear();
			if (outletid)
				this._DoLoadOutlet(outletid,args['key'],1);
		}
	},
	_Freelance:function()
	{
		this.ShowFreelance();
	},
	ShowHomePage:function()
	{
		this._ShowStartUp();
	},
	_ShowStartUp:function()
	{
		this.loadLinks();
		var page = this.mainpanel.getPage("std_start_view");
		if ( page !== null )
		{
			this.mainpanel.showPage(page);
		}
		else
		{
			var page = this.mainpanel.getPage("std_view.search_list");
			if ( page !== null )
				this.mainpanel.showPage(page);
		}
	},
	ShowFreelance:function(outletid)
	{
		this.loadLinks();

		var args =  {key:"freelance_add.html",
							 href:"/outlets/freelance_add",
							 style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("freelance_add.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
			if (outletid)
				this._DoLoadOutlet(outletid,args['key'],1);
			else
			{
				console.log("start");
				this._DoLoadNewOutlet(args['key'],1);
			}
		}
		else
		{
			var page_controller = dijit.byId(args['key']+"_controller");

			page_controller.Clear();
			if (outletid)
				this._DoLoadOutlet(outletid,args['key'],1);
			this.mainpanel.showPage(page);
		}
	},
   _Preferences:function()
	{
		this.largeDialog.set("content",'<div dojoType="prmax.customer.Preferences" style="width:710px;height:565px" class="scrollpanel"></div>');
		this.largeDialog.show("User Preferences");
	},
  _Customers:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.customer.Customer"></div>');
		this.stdDialog.show("Customer Details");
	},
   _Tags:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.interests.Tags"></div>');
		this.stdDialog.show("Tags");
	},
	 destroy: function()
	 {
		this.inherited(arguments);
		delete  this.search;
	},
	_UserAdmin:function()
	{
		this.loadLinks();
		var page = this.mainpanel.getPage("std_view.user_admin");
		var args =  {key:"std_view.user_admin",
							 href:"layout/std_user_admin_view",
							 style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("std_view.user_admin");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			dijit.byId("std_user_admin_view_id").Clear();
			this.mainpanel.showPage(page);
		}
	},
	_Collateral:function()
	{
		this.loadLinks();
		var args =  {key:"std_view.collateral",
							 href:"layout/std_collateral_view",
							 style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("std_view.collateral");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			dijit.byId("std_collateral_view_id").Clear();
			this.mainpanel.showPage(page);
		}
	},
	_ExclusionList:function()
	{
		this.loadLinks();
		var args =  {key:"std_view.exclusions",
							 href:"layout/std_exclusions_view",
							 style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("std_view.exclusions");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			dijit.byId("std_exclusions_view_id").Clear();
			this.mainpanel.showPage(page);
		}

	},
	_Projects:function()
	{
		this.loadLinks();
		var args =  {key:"std_view.projects",
							 href:"layout/std_projects_view",
							 style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("std_view.projects");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			dijit.byId("std_projects_view_id").refresh();
			this.mainpanel.showPage(page);
		}
	},
	_DialogCloseEvent:function(  source )
	{
		this.stdDialog.hide();
		this.stdDialog.set("content",'');
		this.largeDialog.hide();
		this.largeDialog.set("content",'');

	},
	ShowEmailPanel:function( release )
	{
		this.loadLinks();

		var args =  {key:"show_distribute_panel_view",
					href:"/layout/std_distribute_panel_view?emailtemplateid="+ release.emailtemplateid,
					style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("show_distribute_panel_view");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			var page_controller = dijit.byId(args['key']+"_controller");

			this.mainpanel.showPage(page);
			page_controller.Load ( release.emailtemplateid ) ;
		}
	},
	ShowDistribution:function ( release )
	{
		this.ShowEmailPanel(release);
	},
	_StartPressEvent: function ( release )
	{
		this.ShowEmailPanel(release);
	},
	_UpdateEngagementLabelEvent:function()
	{
		dojo.attr(this.engbtn, 'label', '<span><span class="main_menu_button"><i class="fa fa-user fa-2x"></i><p>'+PRMAX.utils.settings.crm_engagement_plural+'</p></span></span>');
	},
	_UpdateDistributionLabelEvent:function()
	{
		dojo.attr(this.distribution_menu, 'label', '<span><span class="main_menu_button"><i class="fa fa-share-square-o fa-2x"></i><p>'+PRMAX.utils.settings.distribution_description_plural+'</p></span></span>');
	},
	ShowExistingPressRelease:function()
	{
		this.selectrelease.show();
	},
	ShowNewPressRelease:function()
	{
		this.newrelease.show();
	},
	_Distribute:function()
	{
		this.loadLinks();
		var args =  {key:"std_view.distribution",
							 href:"/layout/std_distribution_view",
							 style:"width:100%;height:100%"};
		var page = this.mainpanel.getPage("std_view.distribution");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			dijit.byId("std_distribution_view_id").Clear();
			this.mainpanel.showPage(page);
		}
	},
	_ShowAdvanceResult:function()
	{
		this._StdView("advance_view",null,true);
	},
	ShowSearchAdvance:function( mode )
	{
		try
		{
			var window = this.search.show_search_form(mode);
			this.search.StartUpAdvance();
			this.search._setAdvanceModeAttr ( mode );
			window.show();
			this.search.focus();
		}
		catch(e){}
	},
	ShowSentDistributions:function()
	{
		this._Lists("distributions","Display Sent");
	},
	_Financial:function()
	{
		this.loadLinks();
		var args =
			{
				key:"customer_financial.html",
				href:"/layout/customer_financial",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("customer_financial.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_Updatum:function()
	{
		this.loadLinks();
		var args =
			{
				key:"updatum.html",
				href:"/updatum/updatum_view",
				style:"width:100%;height:100%;overflow:hidden"
			};

		var page = this.mainpanel.getPage("updatum.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_Clients:function()
	{
		this.loadLinks();
		var args =
			{
				key:"clients.html",
				href:"/layout/clients",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("clients.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_Newsrooms:function()
	{
		this.loadLinks();
		var args =
			{
				key:"newsrooms.html",
				href:"/layout/newsrooms",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("newsrooms.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_issues:function()
	{
		this.loadLinks();
		var args =
			{
				key:"issues.html",
				href:"/layout/issues",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("issues.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_statements:function()
	{
		this.loadLinks();
		var args =
			{
				key:"statements.html",
				href:"/layout/statements",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("statements.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_privatechannels:function()
	{
		this.loadLinks();
		var args =
			{
				key:"privatechannels.html",
				href:"/layout/privatechannels",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("privatechannels.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_show_crm_viewer:function()
	{
		this.loadLinks();
		var args =
			{
				key:"crm.html",
				href:"/layout/crm_view",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("crm.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_show_documents_view:function()
	{
		this.loadLinks();
		var args =
			{
				key:"documents.html",
				href:"/layout/documents_view",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("documents.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_show_clippings:function()
	{
		this.loadLinks();
		var args =
			{
				key:"clippings.html",
				href:"/clippings/open_clipping_view",
				style:"width:100%;height:100%;padding:0px;margin:0px;overflow:hidden;"
			};

		var page = this.mainpanel.getPage("clippings.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
/*
	_show_clippings:function()
	{
		this.loadLinks();
		var args =
			{
				key:"clippings.html",
				href:"/layout/clippings_view",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("clippings.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
*/
	_question:function(filter_type)
	{
		this.loadLinks();
		var args =
			{
				key:"questions.html",
				href:"/layout/questions_view",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("questions.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_global_analysis_questions:function()
	{
		this.loadLinks();
		var args =
			{
				key:"global_analysis_questions.html",
				href:"/layout/global_analysis_questions",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("global_analysis_questions.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_release_templates:function()
	{
		this.loadLinks();
		var args =
			{
				key:"distributiontemplate.html",
				href:"/layout/distributiontemplate",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("distributiontemplate.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_pprrequest:function()
	{
		this.loadLinks();
		var args =
			{
				key:"prrequest.html",
				href:"/layout/prrequest",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("prrequest.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize (page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_Activity:function()
	{
		this.loadLinks();
		var args =
			{
				key:"activity.html",
				href:"/layout/activity",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("activity.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},

});
