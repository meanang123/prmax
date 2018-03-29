//To build just Dojo base, you just need an empty file.
dependencies ={
    layers:  [
		{
			name: "prmaxdojo.js",
			dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",

			"dojox.editor.plugins.Preview",

			"dojox.form.PasswordValidator",

			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.date.DateSearchExtended",

			"prcommon.search.std_search",


			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",
			"prmax.display.startup.startup",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prmax.prmaxobjects",
			"prcommon.prcommonobjects",

			"ttl.utilities",
			"ttl.GridHelpers",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.layout.ContentPane",
			"ttl.data.utilities",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.clippings.viewer",

			"prmax.pressrelease.distributiontemplate.viewer",

			"prcommon.crm.viewer",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.recovery.passwordrecoverydetails"

			]
			},
		{
			name: "prmaxnewcustomer.js",
			dependencies: [
			"dijit._Templated",
			"dijit._Widget",
			"dijit._Container",

			"dojo.data.ItemFileReadStore",

			"dijit.TitlePane",
			"dijit.layout.BorderContainer",
			"dijit.layout.ContentPane",
			"ttl.utilities",
			"ttl.uuid",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.ComboBox",
			"dijit.form.Textarea",
			"dijit.form.TextBox",

			"dojox.validate.regexp",
			"dojox.form.BusyButton",
			"dojox.form.PasswordValidator",
			"dojox.data.QueryReadStore",
			"dojox.form.PasswordValidator",

			"prcommon.data.QueryWriteStore",
			"prmax.customer.NewCustomer",
			"prmax.customer.RequestDemo",
			"prmax.customer.PaymentCollectDetails",
			"prcommon.contacthistory.notes",
			"prcommon.recovery.passwordrecoverydetails"


            ]
        },
		{
        name: "prmaxstartup.js",
        dependencies: [
			"dijit._Templated",
			"dijit._Widget",
			"dijit._Container",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.ContentPane",
			"dijit.Dialog",
			"dijit.ProgressBar",

			"dojox.widget.Toaster",
			"ttl.utilities",
			"ttl.uuid",

			"prmax.common.ReportBuilder",

			"ttl.layout.ContentPane"
			]
    	},
		{
			name: "prmaxinternal.js",
			dependencies: [
			"dijit._Templated",
			"dijit._Widget",
			"dijit._Container",

			"dojo.cldr.currency",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dojo.fx.easing",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",
			"dijit.Dialog",
			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",
			"dijit.form.DateTextBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.layout.ExpandoPane",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",

			"dojox.form.BusyButton",

			"dojox.validate.regexp",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",

			"prmax.iadmin.admin",

			"prmax.prmaxobjects",
			"prcommon.prcommonobjects",

			"prmax.user.AddUser",

			"prmax.iadmin.Payment",
			"prmax.iadmin.MonthlyPayment",
			"prmax.iadmin.Proforma",
			"prmax.iadmin.Privateimport",

			"prmax.crm.viewer",
			"prmax.crm.AddContact",
			"prmax.crm.ViewContact",


			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.contacthistory.notes",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
		{
        name: "prmaxdatadmin.js",
        dependencies: [
			"dijit._Templated",
			"dijit._Widget",
			"dijit._Container",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dojo.fx.easing",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",
			"dijit.Dialog",
			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",
			"dijit.form.DateTextBox",
			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.validate.regexp",
			"dojox.layout.ExpandoPane",
			"dojox.collections.Dictionary",

			"ttl.utilities",
			"ttl.uuid",
			"ttl.GridHelpers",
			"ttl.data.utilities",
			"ttl.layout.ContentPane",
			"ttl.Form",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.customer.InternalAddCustomer",

			"prmax.employee.EmployeeSelect",
			"prmax.employee.EmployeeNew",


			"prmax.search.SearchCtrl",
			"prmax.search.Circulation",
			"prmax.search.SearchCount",
			"prmax.search.standard",
			"prmax.search.PrmaxOutletTypes",
			"prmax.search.Frequency",

			"prmax.geographical.Geographical",
			"prmax.geographical.GeographicalEdit",

			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.dataadmin.admin",
			"prmax.dataadmin.Roles",
			"prmax.dataadmin.search",
			"prmax.dataadmin.Interests",
			"prmax.dataadmin.AuditViewer",
			"prmax.dataadmin.AuditDelete",
			"prmax.dataadmin.Profile",
			"prmax.dataadmin.ReasonCodes",
			"prmax.dataadmin.ResearchDetails",

			"prmax.dataadmin.outlet.Outlets",
			"prmax.dataadmin.outlet.OutletEdit",
			"prmax.dataadmin.outlet.OutletNew",
			"prmax.dataadmin.outlets.OutletEditMainDetails",
			"prmax.dataadmin.outlets.OutletDelete",
			"prmax.dataadmin.outlets.OutletSetPrimary",
			"prmax.dataadmin.outlets.OutletEditPrn",

			"prmax.dataadmin.employees.EmployeeDelete",
			"prmax.dataadmin.employees.EmployeeEdit",
			"prmax.dataadmin.employees.EmployeeNew",
			"prmax.dataadmin.employees.EmployeeSelect",
			"prmax.dataadmin.employees.People",
			"prmax.dataadmin.employees.PersonDelete",

			"prmax.dataadmin.freelance.FreelanceNew",
			"prmax.dataadmin.freelance.FreelanceEdit",
			"prmax.dataadmin.freelance.FreelanceDelete",
			"prmax.dataadmin.freelance.FreelanceChanges",

			"prcommon.query.query",
			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.contacthistory.notes",
			"prcommon.recovery.passwordrecoverydetails"


			]
		},
		{
	        name: "prmaxaidojo.js",
	        dependencies: [
				"dojo.io.iframe",
				"dojo.back",
				"dojo.i18n",

				"dijit.layout.BorderContainer",
				"dijit.layout.StackContainer",
				"dijit.layout.TabContainer",
				"dijit.layout.ContentPane",
				"dijit.layout.AccordionContainer",

				"dijit.TitlePane",
				"dijit.Toolbar",
				"dijit.Menu",
				"dijit.Tree",
				"dijit.ProgressBar",
				 "dijit.Dialog",
				"dijit.Tree",

				"dojo.data.ItemFileReadStore",

				"dijit.form.Form",
				"dijit.form.Button",
				"dijit.form.TextBox",
				"dijit.form.CheckBox",
				"dijit.form.FilteringSelect",
				"dijit.form.Textarea",

				"dojox.form.BusyButton",
				"dojox.validate",
				"dojox.grid.DataGrid",
				"dojox.grid.EnhancedGrid",
				"dojox.data.QueryReadStore",
				"dojox.collections.Dictionary",

				"ttl.utilities",
				"ttl.uuid",
				"ttl.layout.ContentPane",
				"ttl.GridHelpers",
				"ttl.FrameMngr",
				"ttl.Form" ,
				"ttl.utilities",
				"ttl.data.utilities",

			  "prcommon.date.DateSearchExtended",

				"prcommon.prcommonobjects",
				"prmax.prmaxobjects",

				"prcommon.data.DataStores",
				"prcommon.data.QueryWriteStore",

				"prcommon.interests.Interests",
				"prmax.search.person",

				"prmax.common.ReportBuilder",
				"prmax.common.SelectOptions",

				"prmax.search.SearchCtrl",
				"prmax.search.Circulation",
				"prmax.search.SearchCount",
				"prmax.search.Frequency",
				"prmax.search.standard",
				"prmax.search.PrmaxOutletTypes",
				"prmax.searchgrid.SearchGridCount",
				"prmax.searchgrid.SortDisplay",
				"prmax.searchgrid.Deduplicate",
				"prmax.search.PrmaxOutletTypes",

				"prmax.roles.Roles",
				"prmax.roles.SearchRoles",
				"prmax.geographical.Geographical",

				"prmax.help.HelpBrowser",

				"prmax.lists.SaveToListNew",
				"prmax.lists.DeleteToList",
				"prmax.lists.NewListDlg",
				"prmax.lists.view",


				"prmax.display.DisplayCtrl",
				"prmax.employee.EmployeeDisplay",
				"prmax.display.StdView",
				"prmax.ai.view",
				"prmax.ai.banner",
				"prmax.ai.stdview",

			"prcommon.contacthistory.notes",

			"prcommon.crm.viewer",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
// prmaxblueboodojo
		{
    name: "prmaxblueboodojo.js",
        dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prmax.blueboo.view",
			"prmax.blueboo.banner",
			"prmax.blueboo.stdview",

			"prcommon.contacthistory.notes",

			"prcommon.crm.viewer",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
// prmaxipcbdojo
		{
    name: "prmaxipcbdojo.js",
        dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prmax.ipcb.view",
			"prmax.ipcb.banner",
			"prmax.ipcb.stdview",

			"prcommon.contacthistory.notes",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
// prmaxsolidmediadojo
		{
    name: "prmaxsolidmediadojo.js",
        dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.crm.viewer",
			"prcommon.crm.issues.viewer",
			"prcommon.crm.tasks.viewer",

			"prmax.solidmedia.monitoring",

			"prmax.solidmedia.view",
			"prmax.solidmedia.banner",
			"prmax.solidmedia.stdview",
			"prmax.solidmedia.startup",

			"prcommon.contacthistory.notes",
			"prcommon.documents.view",

			"prcommon.clippings.viewer",

			"prmax.pressrelease.distributiontemplate.viewer",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},

// prmaxupdatumdojo
		{
			name: "prmaxupdatumdojo.js",
        dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prmax.updatum.view",
			"prmax.updatum.banner",
			"prmax.updatum.stdview",

			"prcommon.contacthistory.notes",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
//prmaxfensdojo
		{
			name: "prmaxfensdojo.js",
        dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prmax.fens.view",
			"prmax.fens.banner",
			"prmax.fens.stdview",

			"prcommon.contacthistory.notes",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
// prmaxkantardojo
		{
			name: "prmaxkantardojo.js",
        dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prmax.kantar.view",
			"prmax.kantar.banner",
			"prmax.kantar.stdview",

			"prcommon.contacthistory.notes",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
//prmaxphoenixpbdojo
    {
			name: "prmaxphoenixpbdojo.js",
        dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prmax.phoenixpd.view",
			"prmax.phoenixpd.banner",
			"prmax.phoenixpd.stdview",

			"prcommon.contacthistory.notes",
			"prcommon.recovery.passwordrecoverydetails"
			]
		},
// prmaxdeperslijst
		{
		name: "prmaxdeperslijst.js",
				dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.crm.viewer",
			"prcommon.crm.issues.viewer",
			"prcommon.crm.tasks.viewer",

			"prcommon.contacthistory.notes",
			"prcommon.documents.view",

			"prmax.deperslijst.view",
			"prmax.deperslijst.banner",
			"prmax.deperslijst.stdview",
			"prmax.deperslijst.startup",

			"prcommon.clippings.viewer",

			"prcommon.crm.viewer",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
// prmaxmynewsdesk
		{
		name: "prmaxmynewsdesk.js",
				dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.crm.viewer",
			"prcommon.crm.issues.viewer",
			"prcommon.crm.tasks.viewer",

			"prcommon.contacthistory.notes",
			"prcommon.documents.view",

			"prmax.mynewsdesk.view",
			"prmax.mynewsdesk.banner",
			"prmax.mynewsdesk.stdview",

			"prcommon.clippings.viewer",

			"prmax.pressrelease.distributiontemplate.viewer",

			"prcommon.crm.viewer",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
	// prmaxstereotribes
		{
		name: "prmaxstereotribes.js",
				dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.crm.viewer",
			"prcommon.crm.issues.viewer",
			"prcommon.crm.tasks.viewer",

			"prcommon.contacthistory.notes",
			"prcommon.documents.view",

			"prmax.stereotribes.view",
			"prmax.stereotribes.banner",
			"prmax.stereotribes.stdview",

			"prcommon.clippings.viewer",

			"prmax.pressrelease.distributiontemplate.viewer",

			"prcommon.crm.viewer",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.recovery.passwordrecoverydetails"
			]
		},
// pressdata
		{
		name: "prmaxpressdata.js",
				dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.crm.viewer",
			"prcommon.crm.issues.viewer",
			"prcommon.crm.tasks.viewer",

			"prcommon.contacthistory.notes",
			"prcommon.documents.view",

			"prmax.pressdata.view",
			"prmax.pressdata.banner",
			"prmax.pressdata.stdview",
			"prmax.pressdata.startup",

			"prcommon.clippings.viewer",

			"prmax.pressrelease.distributiontemplate.viewer",

			"prcommon.crm.viewer",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.recovery.passwordrecoverydetails"
			]
		},
// pressdata office
		{
		name: "prmaxpressdataoffice.js",
				dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.crm.viewer",
			"prcommon.crm.issues.viewer",
			"prcommon.crm.tasks.viewer",

			"prcommon.contacthistory.notes",
			"prcommon.documents.view",

			"prmax.pressdataoffice.view",
			"prmax.pressdataoffice.banner",
			"prmax.pressdataoffice.stdview",
			"prmax.pressdataoffice.startup",

			"prcommon.clippings.viewer",

			"prmax.pressrelease.distributiontemplate.viewer",

			"prcommon.crm.viewer",
			"prcommon.contacthistory.notes",
			"prcommon.documents.view",
			"prcommon.recovery.passwordrecoverydetails"

			]
		},
// prmaxprofessional
		{
		name: "prmaxprofessional.js",
				dependencies: [
			"dojo.io.iframe",
			"dojo.back",
			"dojo.i18n",

			"dojo.data.ItemFileReadStore",
			"dojo.data.ItemFileWriteStore",

			"dijit.layout.BorderContainer",
			"dijit.layout.StackContainer",
			"dijit.layout.TabContainer",
			"dijit.layout.ContentPane",
			"dijit.layout.AccordionContainer",

			"dijit.TitlePane",
			"dijit.Toolbar",
			"dijit.Menu",
			"dijit.Tree",
			"dijit.ProgressBar",
			"dijit.Dialog",

			"dijit.Editor",
			"dijit._editor.plugins.FontChoice",
			"dijit._editor.plugins.TextColor",
			"dijit._editor.plugins.LinkDialog",

			"dijit.form.Button",
			"dijit.form.Form",
			"dijit.form.TextBox",
			"dijit.form.FilteringSelect",
			"dijit.form.ValidationTextBox",
			"dijit.form.NumberTextBox",
			"dijit.form.CheckBox",
			"dijit.form.MultiSelect",
			"dijit.form.ComboBox",

			"dijit.form.Form",
			"dijit.form.Textarea",

			"dojox.grid.DataGrid",
			"dojox.data.QueryReadStore",
			"dojox.form.BusyButton",
			"dojox.layout.ExpandoPane",
			"dojox.validate.regexp",
			"dojox.collections.Dictionary",
			"dojox.editor.plugins.Preview",
			"dojox.form.PasswordValidator",

			"ttl.utilities",
			"ttl.uuid",

			"ttl.GridHelpers",
			"ttl.layout.ContentPane",
			"ttl.FrameMngr",
			"ttl.Form",
			"ttl.data.utilities",


			"prmax.DlgCtrl",
			"prmax.DlgCtrl2",

			"prcommon.search.std_search",
			"prcommon.date.DateSearchExtended",

			"prmax.common.SelectOptions",
			"prmax.common.SelectOptions2",
			"prmax.common.ReportBuilder",

			"prmax.customer.Customer",
			"prmax.customer.Preferences",

			"prmax.customer.clients.view",
			"prmax.customer.activity.viewer",

			"prmax.collateral.view",
			"prmax.collateral.add",
			"prmax.collateral.adddialog",

			"prcommon.crm.responses.viewer",
//			"prcommon.newsrooms.viewer",

			"prmax.email.wordtohtml",

			"prmax.display.Output",
			"prmax.display.StdBanner",
			"prmax.display.StdView",
			"prmax.display.startup",
			"prmax.display.DisplayCtrl",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.interests.Interests",
			"prmax.search.person",

			"prmax.editor.CollateralDialog",
			"prmax.editor.TtlImgLinkDialog",
			"prmax.editor.MergeFields",

			"prmax.employee.EmployeeDisplay",
			"prmax.employee.EmployeeEdit",
			"prmax.employee.EmployeeOverride",
			"prmax.employee.ChangeEmployee",
			"prmax.employee.EmployeeNew",
			"prmax.employee.EmployeeSelect",

			"prmax.freelance.FreelanceEdit",

			"prmax.geographical.Geographical",

			"prmax.interests.Tags",
			"prmax.interests.ApplyTags",
			"prmax.interests.AddTags",


			"prmax.lists.projectfilter",
			"prmax.lists.SaveToListNew",
			"prmax.lists.DeleteToList",
			"prmax.lists.NewListDlg",
			"prmax.lists.view",

			"prmax.outlet.OutletEdit",
			"prmax.outlet.OutletOverride",

			"prmax.pressrelease.newrelease",
			"prmax.pressrelease.sendrelease",
			"prmax.pressrelease.selectrelease",
			"prmax.pressrelease.view",

			"prmax.projects.projects",
			"prmax.projects.newproject",
			"prmax.projects.projectselect",

			"prmax.roles.ApplyRoles",
			"prmax.roles.Roles",
			"prmax.roles.SearchRoles",

			"prmax.search.standard",
			"prmax.search.Circulation",
			"prmax.search.Frequency",
			"prmax.search.PrmaxOutletTypes",

			"prmax.search.SearchCount",
			"prmax.search.SearchCtrl",

			"prmax.searchgrid.SortDisplay",
			"prmax.searchgrid.SearchGrid",
			"prmax.searchgrid.SearchGridCount",
			"prmax.searchgrid.Deduplicate",

			"prmax.help.HelpBrowser",

			"prmax.user.UserAdmin",

			"prmax.email.wordtohtml",


			"prcommon.prcommonobjects",
			"prmax.prmaxobjects",

			"prcommon.data.QueryWriteStore",
			"prcommon.data.DataStores",

			"prcommon.crm.viewer",
			"prcommon.crm.issues.viewer",
			"prcommon.crm.tasks.viewer",

			"prcommon.contacthistory.notes",
			"prcommon.documents.view",

			"prmax.professional.view",
			"prmax.professional.banner",
			"prmax.professional.stdview",
			"prmax.professional.startup",

			"prcommon.clippings.viewer",

			"prmax.pressrelease.distributiontemplate.viewer",
			"prcommon.recovery.passwordrecoverydetails"

			]
		}
    ],
//compress/build/
    prefixes: [
        [ "dijit", "../dijit" ],
        [ "dojox", "../dojox" ],
        [ "prmax", "/projects/prmax/live/prmax/prmax/static/dojo.comp/prmax" ],
        [ "ttl", "/projects/prmax/live/ttl/ttl/static/comp/ttl" ],
        [ "prcommon", "/projects/prmax/live/prcommon/prcommon/static/comp/prcommon" ]
    ]
};
