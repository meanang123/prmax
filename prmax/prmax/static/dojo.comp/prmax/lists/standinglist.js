//-----------------------------------------------------------------------------
// Name:    "prmax.lists.view
// Author:  Chris Hoy
// Purpose:
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.standinglist");

dojo.declare("prmax.lists.standinglist", [ttl.BaseWidget], {
	widgetsInTemplate: true,
	listtypeid:1,
	delete_mode:true,
	display:"Media Lists",
	templatePath: dojo.moduleUrl( "prmax.lists","templates/standinglist.html"),
	constructor: function() {
		this.layoutListList=[ this.view1];
		this.projectList= new dojox.data.QueryReadStore (
			{url:'/projects/list',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
		});

		this.listid = -1;
		this.projectid = -1;
		this.onLoadListCall = dojo.hitch(this,this.onLoadDisplayCtrl);
		this.onOpenListCallBack = dojo.hitch(this,this.onOpenListCall);
		this._DetailsCallBack = dojo.hitch(this,this.ListDetailsCallBack);
		this._OnAddProjectCallBack = dojo.hitch(this,this._AddProjectCall);
		this._OnAddListCallBack = dojo.hitch(this,this._AddListCall);
		this._styleCallBack = dojo.hitch(this,this._StyleCallBackFunc);
		this._OnEnableToolbarCallBack = dojo.hitch(this,this._SelectionChanged);
		this._OnDeleteListsCallBack = dojo.hitch(this,this._OnDeleteListsCall);
		this._OnAddProjectToListCallBack = dojo.hitch(this,this._OnAddProjectToListCall);
		this._OnDeleteProjectsCallBack = dojo.hitch(this,this._OnDeleteProjectsCall);
		this._getModelItemCall = dojo.hitch(this,this._getModelItem);
		this._OnRefreshListCallBack = dojo.hitch(this,this._OnRefreshListCall);
		// event handling
		dojo.subscribe(PRCOMMON.Events.List_Deleted, dojo.hitch(this,this._ListDeletedEvent));
		dojo.subscribe(PRCOMMON.Events.List_Add, dojo.hitch(this,this._ListAddEvent));

		this._store_loaded = false ;

	},
	postCreate:function()
	{
		this.modelList= new prcommon.data.QueryWriteStore (
			{url:'/lists/listall?listtypeid=' + this.listtypeid,
				tableid:2,
				oncallback: dojo.hitch(this,this._SelectionChanged),
				onError:ttl.utilities.globalerrorchecker,
				oncallbackparams: dojo.hitch(this,this._getContext)
		});

		this.listGrid.set("structure",this.layoutListList );
		this.listGrid._setStore ( this.modelList ) ;

		this.baseonCellClick = this.listGrid.onCellClick;
		this.listGrid.onCellClick = dojo.hitch(this,this.onCellClick);
		this.listGrid.onCellDblClick = dojo.hitch(this,this._OnRowDblClick);

		this.svl_project_filter_project_list.store = this.projectList;

		dojo.connect(this.svl_project_filter_dialog,"execute",dojo.hitch(this,this._ProjectFilter));
		dojo.connect(this.svl_project_add_form,"onSubmit",dojo.hitch(this,this._ProjectSubmit));
		dojo.connect(this.svl_list_add_form,"onSubmit",dojo.hitch(this,this._ListSubmit));
		dojo.connect(this.svl_list_proj_dlg_form,"onSubmit",dojo.hitch(this,this._AddProjectToListSubmit));

		dojo.connect(this.svl_reports_full,"onClick",dojo.hitch(this,this._ReportStart,1));
		dojo.connect(this.svl_reports_summary,"onClick",dojo.hitch(this,this._ReportStart,7));

		dojo.connect(this.svl_projects_listofprojects,"onchange", dojo.hitch(this,this._onChangedProjects));

		this._newlist_callback = dojo.hitch(this,this._newlistcall);

		this._EnableToolbar();

		if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
		{
			dojo.removeClass(this.svl_reports_full.domNode,"prmaxhidden");
			dojo.removeClass(this.menu_filter.domNode,"prmaxhidden");
		}

		if ( this.delete_mode == false )
		{
			dojo.style(this.svl_list_delete.domNode,"display", "none" );
			dojo.style(this.svl_delete.domNode,"display", "none" );
		}

		dojo.attr(this.displayNode, "innerHTML" , this.display ) ;

		this.inherited(arguments);
	},
	_getContext:function()
	{
		return { listtypeid : this.listtypeid };
	},
	_AddProjectButton:function()
	{
		this.svl_project_add_form.submit();
	},
	_AddExistingToList:function()
	{
		this.svl_list_proj_dlg_form.submit();
	},
	_ClearFilter:function()
	{
		this.svl_project_filter_project_list.set("value",null);
		this.projectid = -1;
		this.refresh();
	},
	_ProjectFilter:function()
	{
		console.log(arguments);
		console.log(arguments[0].projectid,this.projectid);
		if (arguments[0].projectid != this.projectid )
		{
			this.projectid = arguments[0].projectid;
			this.refresh();
		}
	},
	_ReportStart:function()
	{
		dijit.byId("std_report_control").StartDialog({
			reportoutputtypeid:0,
			reporttemplateid:arguments[0]});
	},
	_DeleteProjectFromList:function()
	{
		var ar = Array();
		var aoff = 0 ;
		for ( var c = 0; c<this.svl_projects_listofprojects.options.length;c++)
		{
			if ( this.svl_projects_listofprojects.options[c].selected)
			{
				ar[aoff] = parseInt(this.svl_projects_listofprojects.options[c].value,10);
				++aoff;
			}
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._OnDeleteProjectsCallBack,
				url:"/lists/deletelistprojects",
				content: {
						projects:dojo.toJson(ar),
						listid:this.listid}}));
	},
	_OnDeleteProjectsCall:function(response)
	{
		console.log("_OnDeleteProjectsCall", response);
		if (response.success=="OK")
		{
			for ( var c = 0; c<this.svl_projects_listofprojects.options.length;c++)
			{
				if ( this.svl_projects_listofprojects.options[c].selected)
				{
					this.svl_projects_listofprojects.options[c] = null;
					--c;
				}
			}
		}
	},
	_onChangedProjects:function()
	{
		console.log("_onChangedProjects");
		this.svl_projects_delete.set("disabled",this.svl_projects_listofprojects.options.length?false:true);
	},
	_EnableToolbar:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._OnEnableToolbarCallBack,
				url:"/lists/listmaintcount?listtypeid=" + this.listtypeid}));

	},
	onCellClick : function(e) {
		if ( e.cellIndex >0 ) {
			this.onSelectRow(e);
		}
		else if (e.cellIndex == 0 )
		{
			var row = this.listGrid.getItem(e.rowIndex);
			this.modelList.setValue(  row, "selected" , !row.i.selected, true );
		}
		else
		{
			this.baseonCellClick(e);
		}
	},
	_OnRowDblClick: function(e)
	{
		this._row = this.listGrid.getItem(e.rowIndex);
		this.listid = this._row.i.listid;
		this._OpenLists(1,[this.listid,0]);
	},
	_AddProjectCall:function(response)
	{
		if (response.success=="OK")
		{
			this.svl_projects_listofprojects.options[this.svl_projects_listofprojects.options.length] = new Option(response.project.projectname,response.project.projectid);
			this._CancelProjectDlg();
		}
		else if (response.success=="DU")
		{
			alert("Project Name Already Exists");
			this._ProjectDlgClear();
			this.svl_project_add_name.focus();

		}
		else if (response.success=="VF")
		{
			alert( "Project Name: " + response.error_message[0][1]);
			this.svl_project_add_ok.cancel();
			this.svl_project_add_name.focus();
		}
		else if (response.success=="FA")
		{
			alert("Problem Adding Project");
			this.svl_project_add_ok.cancel();
			this.svl_project_add_name.focus();
		}
	},
// Add a project to a list
	_AddProjectToList:function()
	{
		this.projectlistmodel= new prcommon.data.QueryWriteStore (
		{	url:'/lists/projectforlist?listid='+this.listid,
			onError:ttl.utilities.globalerrorchecker,
			nocallback:true
		});
		this.svl_list_proj_dlg_list.store = this.projectlistmodel;
		this._ProjectAddToDlgClear();
		this.svl_list_proj_dlg.show();
	},

	_getModelItemProject:function()
	{
		this.projectid = arguments[0].i.projectid;
	},
	_AddProjectToListSubmit:function()
	{
		console.log("_AddProjectToListSubmit");

		// Check we have a project;
		this.projectid = -1;
		var item  =	{	identity:this.svl_list_proj_dlg_list.value,
									onItem: dojo.hitch (this, this._getModelItemProject)};
		this.projectlistmodel.fetchItemByIdentity(item);
		if (this.projectid!=-1)
		{
			dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._OnAddProjectToListCallBack,
				url:'/lists/addprojecttolist',
				content: {listid:this.listid,projectid:this.projectid}}));
		}
		else
		{
			alert("No Valid Project Selected");
			this.svl_list_proj_dlg_ok.cancel();
		}
	},
	_OnAddProjectToListCall:function(response)
	{
		console.log("_OnAddProjectToListCall",response);
		var project = response.project;
		if ( response.success=="OK")
		{
			this.svl_projects_listofprojects.options[this.svl_projects_listofprojects.options.length] = new Option(project.projectname,project.projectid);
			this.svl_list_proj_dlg.hide();
		}
		this.svl_list_proj_dlg_ok.cancel();
	},
	_CancelAddPrjDlg:function()
	{
		this.svl_list_proj_dlg.hide();
		this._ProjectAddToDlgClear();
	},
	_ProjectAddToDlgClear:function()
	{
		this.svl_list_proj_dlg_ok.cancel();
		this.svl_list_proj_dlg_list.set('value',"");
	},
// Add Project
	_ProjectSubmit:function()
	{
		if (this.svl_project_add_form.isValid() === false )
		{
			this.svl_project_add_ok.cancel();
			return false;
		}

		var content = this.svl_project_add_form.getValues();
		content['listid'] = this.listid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._OnAddProjectCallBack,
				url:'projects/addnewandtolist',
				content: content}));

		return false;
	},
	_CancelProjectDlg:function()
	{
		this.svl_project_new_dlg.hide();
		this._ProjectDlgClear();
	},
	_ProjectDlgClear:function()
	{
		this.svl_project_add_ok.cancel();
		this.svl_project_add_name.set('value',"");
	},
	_AddProject:function()
	{
		this.svl_project_new_dlg.show();
	},

// List dialog
	_ListSubmit:function()
	{
		if (this.svl_list_add_form.isValid() === false )
		{
			this.svl_list_add_ok.cancel();
			return false;
		}

		var content = this.svl_list_add_form.getValues();
		content['listid'] = this.listid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._OnAddListCallBack,
				url:this._ListModeUrl(),
				content: content}));

		return false;
	},

	_AddListCall:function(response)
	{
		console.log("_AddListCall",response);

		if (response.success=="OK")
		{
			// Add to list and select
			if (this.list_mode===0||this.list_mode===2)
			{
				// Add the row to the gride
				response.list.selected = false;
				response.list.qty = 0 ;
				var item = this.modelList.newItem(response.list);
				gHelper.AddRowToQueryWriteGrid(this.listGrid,item);
				this.listGrid.selection.clear();
				this.listid = item.i.listid;
				this.listGrid.update();
			}
			else
			{
				this.list = response.list;
				item  = {identity:response.list.listid,
									onItem: dojo.hitch (this, this._getModelItem)};
				this.tmp_row = null;
				this.modelList.fetchItemByIdentity(item);
				if (this.tmp_row)
				{
					this.modelList.SetNoCallBackMode(true);
					this.modelList.setValue(  this.tmp_row, "listname" , response.list.listname, true );
					this.modelList.SetNoCallBackMode(false);
				}
			}
			this._ShowHideDetails();
			this._ListDisplayBasicDetails(response.list);
		}
	},
	_DeleteSingle:function()
	{
		if (confirm("Delete List (" + this.svl_name_field.innerHTML+")?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._OnDeleteListsCallBack,
					url:"/lists/deletelist",
					content:{listid:this.listid}}));
		}
	},
	_Delete:function()
	{
		if (confirm("Delete Selected Lists"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._OnDeleteListsCallBack,
					url:"/lists/deleteselection",
					content:{listtypeid:1}}));
		}
	},
	_OnDeleteListsCall:function(response)
	{
		if (response.success=="OK")
		{
			var lists = [this.listid];

			if (response.lists != null )
				lists = response.lists;

			this._EnableToolBarCall( false);
			dojo.publish(PRCOMMON.Events.List_Deleted, [lists]);
			this.listid = -1;
			this._ShowHideDetails();
			this.listGrid.selection.clear();
		}
		else
		{
			alert("Problem Deleting List");
		}
	},
	onOpenListCall:function(response)
	{
		console.log("onOpenListCall",response);
		dojo.publish(PRCOMMON.Events.SearchSession_Changed, [ response.data] );
		dijit.byId("std_banner_control").ShowResultList();
	},
	_OpenSingle:function()
	{
		this._OpenLists(1,[this.listid,0]);
	},
	_Open:function()
	{
		this._OpenLists(1,[-1,-1]);
	},
	_OpenLists:function(overwrite,lists)
	{
		var content = {
			overwrite:overwrite,
			lists:dojo.toJson(lists),
			selected:-1,
			listtypeid:this.listtypeid} ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this.onOpenListCallBack,
				url:'/lists/open',
				content: content }));
	},

// List options
	_Rename:function()
	{
		this.list_mode = 1;
		this.svl_list_new_dlg.show(this.list_mode,this.listid);
		this.svl_list_new_dlg.set("callback", this._newlist_callback);
	},
	_Duplicate:function()
	{
		this.list_mode = 2;
		this.svl_list_new_dlg.show(this.list_mode,this.listid);
		this.svl_list_new_dlg.set("callback", this._newlist_callback);
	},
	_New:function()
	{
		this.list_mode = 0;
		this.svl_list_new_dlg.show(this.list_mode,-1);
		this.svl_list_new_dlg.set("callback", this._newlist_callback);
	},
	_newlistcall:function(response)
	{
		this._AddListCall(response);
	},

	refresh:function()
	{
		this.listid = -1;
		this._EnableSingleListControls(false);
		this.listGrid.selection.clear();
		this._ShowHideDetails();
		this.listGrid.showMessage(this.listGrid.loadingMessage);
		var params = ttl.utilities.getPreventCache();
		if (this.projectid!=-1)
			params['projectid'] = this.projectid;
		this.listGrid.setQuery(params);
		this._EnableToolbar();
	},
	view1:{
		cells: [[
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",field:'selected',formatter:ttl.utilities.formatButtonCell},
			{name: 'Name',width: "auto",field:"listname"},
			{name: 'Client Name',width: "200px",field:"clientname"},
			{name: 'Qty',width: "50px",field:"qty"}
			]]
	},
	loadListDetails:function(listid)
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._DetailsCallBack,
				url:'lists/info',
				content: {listid:listid}
		}));
	},
	_EnableSingleListControls:function(enable)
	{
		var enabled = enable?false:true;

		this.svl_list_rename.set('disabled',enabled);
		this.svl_list_delete.set('disabled',enabled);
		this.svl_list_open.set('disabled',enabled);

		this.svl_projects_add.set('disabled',enabled);
		this.svl_projects_new.set('disabled',enabled);
	},
	ListDetailsCallBack:function(response)
	{
		console.log("ListDetailsCallBack",response);
		this._ShowHideDetails();
		this._EnableSingleListControls(true);
		console.log(response.list.listname);
		this._ListDisplayBasicDetails(response.list);

		for ( var key in response.projects)
		{
			var project = response.projects[key];
			this.svl_projects_listofprojects.options[this.svl_projects_listofprojects.options.length] = new Option(project.projectname,project.projectid);
		}
	},
	_ListDisplayBasicDetails:function(list)
	{
		this._EnableSingleListControls(true);
		this.svl_name_field.innerHTML = list.listname;
		this.svl_count_field.innerHTML = (list.nbr)? list.nbr.toString():"0";
		this.svl_list_delete.set("disabled", list.emailtemplateid>0?true:false);

		this.svl_projects_listofprojects.options.length = 0;
		this.svl_projects_delete.set('disabled',true);
	},
	onSelectRow : function(e) {
		this._row = this.listGrid.getItem(e.rowIndex);
		this.listid = this._row.i.listid;
		this.loadListDetails(this.listid);
		this.listGrid.selection.clickSelectEvent(e);
	},
	// handle the grid sytles for the rows
	onStyleRow: function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	_StyleCallBackFunc:function( rowData)
	{
		return (rowData.i.listid== this.listid)?true:false;
	},
	_EnableToolBarCall:function( enabled)
	{
		var enable = enabled? false:true;

		this.svl_delete.set("disabled",enable);
		this.svl_open.set("disabled",enable);
	},
	_ShowHideDetails:function()
	{
		var display = this.listid==-1?"none":"block";

		if ( this.listid == -1 )
		{
			dojo.addClass(this.list_info_pane.domNode,"prmaxhidden");
			if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
				dojo.addClass(this.list_projects_pane.domNode,"prmaxhidden");
		}
		else
		{
			dojo.removeClass(this.list_info_pane.domNode,"prmaxhidden");
			if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
				dojo.removeClass(this.list_projects_pane.domNode,"prmaxhidden");
		}
	},
	_SelectionChanged:function(response)
	{
		this._EnableToolBarCall( response.data.selected>0?true:false);
	},
	resize:function()
	{
		console.log("STANDINGRESIZE");
		console.log(arguments[0]);
		this.borderCtrl.resize( arguments[0] ) ;
	},
	_getModelItem:function()
	{
		console.log("_getModelItem",arguments);
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	// delete sessionid from screen
	_ListDeletedEvent:function( lists )
	{
		for ( var key in lists)
		{
			this.tmp_row = null;
			var item  = {identity:lists[key],
					onItem: this._getModelItemCall};

			console.log(item);
			this.modelList.fetchItemByIdentity(item);
			console.log(this.tmp_row);
			if (this.tmp_row )
				this.modelList.deleteItem( this.tmp_row );
		}
	},
	_ListAddEvent:function( lists )
	{
		this.modelList.newItem( lists ) ;
	},
	_OnRefreshListCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this._ListDisplayBasicDetails(response.list);
			var item  = {identity:response.list.listid,
										onItem: dojo.hitch (this, this._getModelItem)};
			this.tmp_row = null;
			this.modelList.fetchItemByIdentity(item);
			if (this.tmp_row)
			{
				this.modelList.SetNoCallBackMode(true);
				this.modelList.setValue(  this.tmp_row, "nbr_deleted" , response.list.nbr_deleted, true );
				this.modelList.SetNoCallBackMode(false);
			}
			alert("List Refreshed");
		}
		else
		{
			alert("Problem Refreshing List");
		}
	}
});
