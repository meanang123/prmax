// code to get the system started
// thge dojo.js is loaded in the start2.html
// the prmaxstartup.js is the equivelent of the LoadDebugStartPage function but is packed for optimal performace
// at final time and it should be quicker to load it as a direct js file

// load the basic components into the system, this is only done in debug and not
// release mode
function LoadDebugStartPage()
{
	if (djConfig.isDebug===true)
	{
		dojo.require("dojox.widget.Toaster");
		dojo.require("dijit.layout.ContentPane");
		dojo.require("dojo.data.ItemFileReadStore");
		dojo.require("ttl.utilities");
		dojo.require("dijit.Dialog");
		dojo.require("dijit.ProgressBar");
		dojo.require("prmax.common.ReportBuilder");
	}
}

// this is the main loaded
// for debug it load individual widgets
// for release it load a single obtimized js file
function _LoadDojoOntoStartPage(dojopath,dojoversion, options )
{
	// now load the compoments
	if (djConfig.isDebug===true)
	{

		dojo.require("dojo.io.iframe");
		dojo.require("dojo.back");

		dojo.require("dijit.layout.BorderContainer");
		dojo.require("dijit.layout.StackContainer");
		dojo.require("dijit.layout.TabContainer");
		dojo.require("dijit.layout.ContentPane");
		dojo.require("dijit.layout.AccordionContainer");


		dojo.require("dijit.TitlePane");
		dojo.require("dijit.Toolbar");
		dojo.require("dijit.Menu");
		dojo.require("dijit.Dialog");
		dojo.require("dijit.Tree");
		dojo.require("dijit.ProgressBar");

		dojo.require("dijit.Editor");
		dojo.require("dijit._editor.plugins.FontChoice");
		dojo.require("dijit._editor.plugins.TextColor");
		dojo.require("dijit._editor.plugins.LinkDialog");

		dojo.require("dijit.form._FormWidget");
		dojo.require("dijit.form.Button");
		dojo.require("dijit.form.Form");
		dojo.require("dijit.form.TextBox");
		dojo.require("dijit.form.FilteringSelect");
		dojo.require("dijit.form.ValidationTextBox");
		dojo.require("dijit.form.NumberTextBox");
		dojo.require("dijit.form.Form");
		dojo.require("dijit.form.Textarea");
		dojo.require("dijit.form.MultiSelect");
		dojo.require("dijit.form.ComboBox");

		dojo.require("dojox.grid.DataGrid");
		dojo.require("dojox.data.QueryReadStore");
		dojo.require("dojox.form.BusyButton");
		dojo.require("dojox.validate.regexp");
		dojo.require("dojox.form.PasswordValidator");
		dojo.require("dojox.collections.Dictionary");

		dojo.require("prcommon.data.QueryWriteStore");
		dojo.require("prcommon.data.DataStores");

		dojo.require("prcommon.interests.Interests");
		dojo.require("prmax.search.person");

		dojo.require("prcommon.advance.stdview");
		dojo.require("prcommon.date.DateSearchExtended");

		dojo.require("prmax.email.emaileditorclear");

		dojo.require("prmax.employee.EmployeeDisplay");
		dojo.require("prmax.employee.EmployeeOverride");
		dojo.require("prmax.employee.EmployeeEdit");
		dojo.require("prmax.employee.ChangeEmployee");
		dojo.require("prmax.employee.EmployeeNew");
		dojo.require("prmax.employee.EmployeeSelect");

		dojo.require("prmax.roles.ApplyRoles");
		dojo.require("prmax.roles.Roles");
		dojo.require("prmax.roles.SearchRoles");


		dojo.require("prmax.search.SearchCtrl");
		dojo.require("prmax.search.Circulation");
		dojo.require("prmax.search.SearchCount");
		dojo.require("prmax.search.Frequency");
		dojo.require("prmax.search.standard");
		dojo.require("prmax.search.PrmaxOutletTypes");


		dojo.require("prmax.searchgrid.SearchGridCount");
		dojo.require("prmax.searchgrid.SortDisplay");
		dojo.require("prmax.searchgrid.Deduplicate");
		dojo.require("prmax.search.PrmaxOutletTypes");

		dojo.require("prmax.lists.projectfilter");
		dojo.require("prmax.DlgCtrl");
		dojo.require("prmax.DlgCtrl2");

		dojo.require("prmax.collateral.view");
		dojo.require("prmax.collateral.add");
		dojo.require("prmax.collateral.adddialog");

		dojo.require("prmax.customer.Customer");
		dojo.require("prmax.customer.Preferences");

		dojo.require("prmax.customer.clients.view");

		dojo.require("prmax.common.SelectOptions");

		dojo.require("prmax.display.Output");
		dojo.require("prmax.display.StdBanner");
		dojo.require("prmax.display.StdView");
		dojo.require("prmax.display.startup");
		dojo.require("prmax.display.startup.startup");
		dojo.require("prmax.display.DisplayCtrl");

		dojo.require("prmax.email.wordtohtml");

		dojo.require("prmax.editor.CollateralDialog");
		dojo.require("prmax.editor.TtlImgLinkDialog");
		dojo.require("prmax.editor.MergeFields");

		dojo.require("prmax.freelance.FreelanceEdit");

		dojo.require("prmax.geographical.GeographicalTree");
		dojo.require("prmax.geographical.Geographical");

		dojo.require("prmax.lists.SaveToListNew");
		dojo.require("prmax.lists.DeleteToList");
		dojo.require("prmax.lists.NewListDlg");
		dojo.require("prmax.lists.view");

		dojo.require("prmax.outlet.OutletOverride");
		dojo.require("prmax.outlet.OutletEdit");

		dojo.require("prmax.projects.projects");
		dojo.require("prmax.projects.newproject");
		dojo.require("prmax.projects.projectselect");

		dojo.require("prmax.pressrelease.newrelease");
		dojo.require("prmax.pressrelease.sendrelease");
		dojo.require("prmax.pressrelease.selectrelease");
		dojo.require("prmax.pressrelease.view");

		dojo.require("prmax.interests.Tags");
		dojo.require("prmax.interests.ApplyTags");
		dojo.require("prmax.interests.AddTags");

		dojo.require("prmax.help.HelpBrowser");

		dojo.require("prmax.user.UserAdmin");


		dojo.require("ttl.layout.ContentPane");
		dojo.require("ttl.GridHelpers");
		dojo.require("ttl.FrameMngr");
		dojo.require("ttl.Form" );
		dojo.require("ttl.utilities");

		dojo.require("prmax.prmaxobjects");
		dojo.require("prcommon.prcommonobjects");

		dojo.require("ttl.uuid");
		dojo.require("ttl.data.utilities");


		dojo.require("dojox.layout.ExpandoPane");
		dojo.require("prmax.common.SelectOptions2");

		dojo.require("prcommon.data.QueryWriteStore");

		dojo.require("prcommon.contacthistory.notes");

		dojo.require("prcommon.crm.issues.viewer");
		dojo.require("prmax.customer.clients.view");
		dojo.require("prcommon.crm.viewer");
		dojo.require("prcommon.clippings.viewer");

		dojo.require("prmax.pressrelease.distributiontemplate.viewer");
		dojo.require("prcommon.recovery.passwordrecoverydetails");

	}
	else
	{
		// if this is a compressed version then we load the compressed layor
		// dojo.require?
		dojo._loadUri("/static/"+dojopath+"/dojo/prmaxdojo.js?version="+dojoversion);
	}
	//Initialise the global controllers
	gHelper = new ttl.GridHelpers();
	PRMAX.utils = {};
	PRCOMMON.utils.uuid = new TTL.UUID();
	PRMAX.utils.settings = dojo.fromJson( options );
	PRMAX.utils.fieldControl = {};
	// Load global data stores
	PRCOMMON.utils.stores = new prcommon.data.DataStores();
	PRCOMMON.utils.stores.fetch();

	PRCOMMON.utils.notes = new prcommon.contacthistory.notes();
}

// This creats the initial view
function _LoadStandardView()
{

	// Now we add the actual start page frame
	var node = document.createElement("div");
	node.style.cssText = "width:100%;height:100%;overflow: hidden; border: 0; padding: 0; margin: 0";
	document.body.appendChild(node);
	var bc = new dijit.layout.BorderContainer({design: "headline",style:"width:100%;height:100%"},node);
	// create the banner
	style="width:100%;overflow:hidden;margin:0px;padding:0px;height:44px;";
	node = document.createElement("div");
	document.body.appendChild(node);
	var widget = new dijit.layout.ContentPane({region: "top",
												href:"/layout/std_banner?cachebust=" + new Date().getTime(),
												style:style},
												node);
	bc.addChild(widget);
	// create the main region
	node = document.createElement("div");
	document.body.appendChild(node);
	widget = new dijit.layout.ContentPane({region: "center",
													href:"/layout/std_start_view?cachebust=" + new Date().getTime()},
													node);
	bc.addChild(widget);
	bc.startup();
}

// function called by startup to intialise the dojo
// dojopath is dojo.dev or dojo.prod
// dojoversion is a version number and is used to make sure and upgrade will download
// the correct file
function LoadStandardPage(dojopath,dojoversion,options)
{
	ttl.utilities.showMessageStd("Loading ..............",3000);
	_LoadDojoOntoStartPage(dojopath,dojoversion,options);
	_LoadStandardView();
}
