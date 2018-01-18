dojo.provide("prmax.dataadmin.admin");

dojo.require("ttl.utilities");
dojo.require("ttl.GridHelpers");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Dialog");

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.Dialog");
dojo.require("dijit.TitlePane");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Menu");
dojo.require("dijit.Tree");
dojo.require("dijit.ProgressBar");

dojo.require("dijit.form.Button");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.MultiSelect");
dojo.require("dijit.form.ComboBox");
dojo.require("dijit.form.DateTextBox");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Textarea");

dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.data.QueryReadStore");

dojo.require("dojox.form.BusyButton");
dojo.require("dojox.form.PasswordValidator");
dojo.require("dojox.form.DropDownSelect");

dojo.require("dojox.data.QueryReadStore");

dojo.require("dojox.validate.regexp");
dojo.require("dojox.collections.Dictionary");


dojo.require("dijit.tree.ForestStoreModel");
dojo.require("dijit.Tree");

dojo.require("prcommon.data.QueryWriteStore");
dojo.require("prcommon.data.DataStores");

dojo.require("prcommon.interests.Interests");
dojo.require("prmax.search.person");

dojo.require("prmax.employee.EmployeeSelect");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.search.Circulation");
dojo.require("prmax.search.SearchCount");
dojo.require("prmax.search.PrmaxOutletTypes");
dojo.require("prmax.search.standard");
dojo.require("prmax.search.Frequency");

dojo.require("prmax.geographical.Geographical");
dojo.require("prmax.geographical.GeographicalEdit");

dojo.require("prmax.roles.Roles");
dojo.require("prmax.roles.SearchRoles");

dojo.require("prmax.dataadmin.Roles");
dojo.require("prmax.dataadmin.search");
dojo.require("prmax.dataadmin.Interests");
dojo.require("prmax.dataadmin.Geographical");
dojo.require("prmax.dataadmin.AuditViewer");
dojo.require("prmax.dataadmin.AuditDelete");
dojo.require("prmax.dataadmin.Profile");
dojo.require("prmax.dataadmin.ReasonCodes");
dojo.require("prmax.dataadmin.ResearchDetails");
dojo.require("prmax.dataadmin.usersettings");
dojo.require("prmax.dataadmin.Countries");

dojo.require("prmax.dataadmin.advance.view");

dojo.require("prmax.dataadmin.outlets.OutletEdit");
dojo.require("prmax.dataadmin.outlets.OutletNew");
dojo.require("prmax.dataadmin.outlets.Outlets");
dojo.require("prmax.dataadmin.outlets.OutletEditMainDetails");
dojo.require("prmax.dataadmin.outlets.OutletDelete");
dojo.require("prmax.dataadmin.outlets.OutletSetPrimary");
dojo.require("prmax.dataadmin.outlets.OutletEditPrn");

dojo.require("prmax.dataadmin.freelance.FreelanceNew");
dojo.require("prmax.dataadmin.freelance.FreelanceEdit");
dojo.require("prmax.dataadmin.freelance.FreelanceDelete");
dojo.require("prmax.dataadmin.freelance.FreelanceChanges");

dojo.require("prmax.dataadmin.employees.EmployeeDelete");
dojo.require("prmax.dataadmin.employees.EmployeeEdit");
dojo.require("prmax.dataadmin.employees.EmployeeNew");
dojo.require("prmax.dataadmin.employees.EmployeeSelect");
dojo.require("prmax.dataadmin.employees.People");
dojo.require("prmax.dataadmin.employees.PersonDelete");


dojo.require("prmax.dataadmin.questionnaires.SendSingle");
dojo.require("prmax.dataadmin.projects.create");
dojo.require("prmax.dataadmin.projects.view");

dojo.require("prmax.dataadmin.feedback.BouncedEmails");


dojo.require("dojox.layout.ExpandoPane");
dojo.require("dojo.fx.easing");
dojo.require("dojox.form.DropDownSelect");
dojo.require("dojox.form.DropDownStack");

dojo.require("ttl.uuid");
dojo.require("ttl.data.utilities");
dojo.require("ttl.layout.ContentPane");
dojo.require("ttl.GridHelpers");
dojo.require("ttl.Form" );

dojo.require("prcommon.prcommonobjects");
dojo.require("prmax.prmaxobjects");

dojo.declare("prmax.dataadmin.admin",
	[dijit._Widget, dijit._Templated, dijit._Container],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/admin.html"),
	constructor: function()
	{
		this._Windows = new dojox.collections.Dictionary();
		this.inherited(arguments);
	},
	resize:function()
	{
		this.inherited(arguments);
		this.frame.resize(arguments[0]);
	},
	_SelectNode:function()
	{
		var  obj = arguments[0];
		if (this._Windows.containsKey( obj.id) == false )
		{
			var widget = null;
			if (obj.type==0)
				widget = new dijit.layout.ContentPane({title:obj.id.toString(),content:"<div dojoType='"+ obj.content + "' style='width:100%;height:100%'></div>"});
			if (obj.type==2)
				widget = new dijit.layout.ContentPane({title:obj.id.toString(),href:obj.page});

			this.zone.addChild ( widget, 0);
			setTimeout("dijit.byId('"+this.zone.id +"').selectChild('"+widget.id+"');",10);
			this._Windows.add(obj.id,  widget.id ) ;
		}
		else
		{
			var wid = this._Windows.entry(obj.id).value;

			this.zone.selectChild (  dijit.byId(wid));

		}
	}
});
