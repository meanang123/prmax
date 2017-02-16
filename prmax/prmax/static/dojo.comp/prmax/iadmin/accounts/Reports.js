dojo.provide("prmax.iadmin.accounts.Reports");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.Reports",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/Reports.html"),
	postCreate:function()
	{
		this.inherited(arguments);

		this.active_report_date.set("value", new Date());
		this.account_payments_report_date.set("value", new Date());
	},
	_Active_Account_Report:function()
	{
		this.active_accounts_report_form.submit();
	},
	_Account_Payment_Report:function()
	{
		this.account_payments_report_form.submit();
	}
});