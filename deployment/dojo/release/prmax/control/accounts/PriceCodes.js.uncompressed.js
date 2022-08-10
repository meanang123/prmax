require({cache:{
'url:control/accounts/templates/PriceCodes.html':"<div>\r\n\t<div data-dojo-attach-point=\"borderControl\" data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",gutters:false'>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"height:35px;width:100%;overflow:hidden;border:1px solid black\"'>\r\n\t\t\t<div class=\"dijitToolbarTop\" data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"float:left:height:100%;width:100%\",\"class\":\"prmaxbuttonlarge\"' >\r\n\t\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PrmaxResultsIcon PrmaxResultsEmpty\",showLabel:true' data-dojo-attach-event=\"onClick:_New\">New</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"view_grid\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",splitter:true'></div>\t\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/Dialog\" title=\"New Price Code\" data-dojo-attach-point=\"pricecodedialog\">\r\n\t\t<form data-dojo-attach-point=\"form\" onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t<table style=\"width:500px;border-collapse:collapse;\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Products</td><td><input data-dojo-props='type:\"text\",required:true,name:\"customerproductid\",style:\"width:300px\"' data-dojo-attach-point=\"customerproductid\" data-dojo-type=\"dijit/form/FilteringSelect\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"150px\">Price Code</td><td><input data-dojo-props='type:\"text\",required:true,name:\"pricecodedescription\",style:\"width:150px\"' data-dojo-attach-point=\"pricecodedescription\" data-dojo-type=\"dijit/form/ValidationTextBox\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Price Description</td><td><input data-dojo-props='type:\"text\",required:true,name:\"pricecodelongdescription\",style:\"width:300px\"' data-dojo-attach-point=\"pricecodelongdescription\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Module Type</td><td><select data-dojo-props='\"class\":\"prmaxinput\",name:\"prmaxmoduleid\",style:\"width:10em\",autoComplete:true,required:true' data-dojo-attach-point=\"prmaxmoduleid\" data-dojo-type=\"dijit/form/FilteringSelect\" ></select>\r\n\t\t\t\t\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Partners</td><td><select data-dojo-props='\"class\":\"prmaxinput\",name:\"customersourceid\",style:\"width:10em\"' data-dojo-attach-point=\"customersourceid\" data-dojo-type=\"dijit/form/FilteringSelect\" ></select>\r\n\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Fixed Sales Price</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"fixed_salesprice\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"fixed_salesprice\"  ></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Fixed Renewal Price</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"fixed_renewalprice\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"fixed_renewalprice\" ></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Monthly Sales Price</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"monthly_salesprice\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"monthly_salesprice\"></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Monthly Renewal Price</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"monthly_renewalprice\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"monthly_renewalprice\" ></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Concurrent Users</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"concurrentusers\",required:true,trim:true,style:\"width:5em\",constraints:{min:1,max:200}' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"concurrentusers\" ></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Paid Months</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"paid_months\",required:true,trim:true,style:\"width:5em\",constraints:{min:1,max:50}' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"paid_months\"></input>\r\n\t\t\t\t<tr><td colspan=\"2\"><br/></td></tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td><button data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_Close\" data-dojo-type=\"dijit/form/Button\"></button></td>\r\n\t\t\t\t\t<td align=\"right\"><button data-dojo-props='type:\"button\",busyLabel:\"Adding ...\",label:\"Add Price Code\"' data-dojo-attach-point=\"addbtn\" data-dojo-attach-event=\"onClick:_Add\" data-dojo-type=\"dojox/form/BusyButton\"></button></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/Dialog\" title=\"Update Price Code\" data-dojo-attach-point=\"pricecodeupddialog\">\r\n\t\t<form data-dojo-attach-point=\"formupd\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t<input type=\"hidden\" data-dojo-attach-point=\"pricecodeid\" name = \"pricecodeid\" data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t<table style=\"width:500px;border-collapse:collapse;\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Products</td><td><input data-dojo-props='type:\"text\",required:true,name:\"customerproductid\",style:\"width:300px\"' data-dojo-attach-point=\"customerproductid2\" data-dojo-type=\"dijit/form/FilteringSelect\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"150px\">New Price Code</td><td><input data-dojo-props='type:\"text\",required:true,name:\"pricecodedescription\",style:\"width:300px\"' data-dojo-attach-point=\"pricecodedescription2\" data-dojo-type=\"dijit/form/ValidationTextBox\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Price Description</td><td><input data-dojo-props='type:\"text\",required:true,name:\"pricecodelongdescription\",style:\"width:300px\"' data-dojo-attach-point=\"pricecodelongdescription2\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Module Type</td><td><select  data-dojo-props='\"class\":\"prmaxinput\",name:\"prmaxmoduleid\",style:\"width:10em\",autoComplete:true,required:true' data-dojo-attach-point=\"prmaxmoduleid2\" data-dojo-type=\"dijit/form/FilteringSelect\" ></select>\r\n\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Partners</td><td><select data-dojo-props='\"class\":\"prmaxinput\",name:\"customersourceid\",style:\"width:10em\"' data-dojo-attach-point=\"customersourceid2\" data-dojo-type=\"dijit/form/FilteringSelect\" ></select>\r\n\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Fixed Sales Price</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"fixed_salesprice\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"fixed_salesprice2\"  ></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Fixed Renewal Price</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"fixed_renewalprice\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"fixed_renewalprice2\" ></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Monthly Sales Price</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"monthly_salesprice\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"monthly_salesprice2\"></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >MOnthly Renewal Price</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"monthly_renewalprice\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"monthly_renewalprice2\" ></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Concurrent Users</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"concurrentusers\",required:true,trim:true,style:\"width:5em\",constraints:{min:1,max:200}' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"concurrentusers2\" ></input>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Paid Months</td><td><input data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"paid_months\",required:true,trim:true,style:\"width:5em\",constraints:{min:1,max:50}' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"paid_months2\"></input>\r\n\t\t\t\t<tr><td colspan=\"2\"><br/></td></tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td><button data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_Close2\" data-dojo-type=\"dijit/form/Button\"></button></td>\r\n\t\t\t\t\t<td align=\"right\"><button data-dojo-props='type:\"button\",busyLabel:\"Updating ...\",label:\"Update Price Code\"' data-dojo-attach-point=\"updbtn\" data-dojo-attach-event=\"onClick:_Update\" data-dojo-type=\"dojox/form/BusyButton\" ></button></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    PriceCodes.js
// Author:  
// Purpose:
// Created: 21/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define("control/accounts/PriceCodes", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../accounts/templates/PriceCodes.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dijit/form/Select",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"dijit/form/Button",
	"dijit/form/CurrencyTextBox",
	"dijit/form/NumberTextBox",
	"dijit/Toolbar",
	"dijit/Dialog",
	"dijit/form/Form",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, BorderContainer,ContentPane,request,utilities2,lang,topic,domclass,ItemFileReadStore,Grid,JsonRest,Observable){

return declare("control.accounts.PriceCodes",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._AddPriceCallBack = lang.hitch(this, this._AddPriceCall);
		this._DeletePriceCallBack = lang.hitch ( this, this._DeletePriceCall);
		this._UpdatePriceCallBack = lang.hitch ( this, this._UpdatePriceCall);

		this._pricecodes = new Observable(new JsonRest(
			{target:'/pricecode/pricecodes',
			idProperty:'pricecodeid',
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
			}));

		this._modules = new ItemFileReadStore ( {url:'/common/lookups?searchtype=prmaxmodules',onError:utilities2.globalerrorchecker, clearOnClose:true, urlPreventCache:true });
		this._modules = new ItemFileReadStore ( {url:'/common/lookups?searchtype=prmaxmodules'});
		this._customersources = new ItemFileReadStore ( {url:'/common/lookups?searchtype=customersources&nofilter=-1'});
		this._products = new ItemFileReadStore ( {url:'/common/lookups?searchtype=customerproducts'});
	},

	postCreate:function()
	{
		this.inherited(arguments);	
		var cells =
		[
			{label: 'Product',className:"dgrid-column-status-small",field:'customerproductdescription'},
			{label: 'Price Code',className:"dgrid-column-status",field:'pricecodedescription'},
			{label: 'Description',className:"dgrid-column-status-large",field:'pricecodelongdescription'},
			{label: 'Module',className:"dgrid-column-status-small",field:'prmaxmoduledescription'},
			{label: 'Partners',className:"dgrid-column-status-small",field:'customersourcedescription'},
			{label: 'Fixed Renewal Price',className:"dgrid-column-money",field:'fixed_renewalprice',formatter:utilities2.display_money},
			{label: 'Fixed Sales Price',className:"dgrid-column-money",field:'fixed_salesprice', formatter:utilities2.display_money},
			{label: 'Monthly Renewal Price',className:"dgrid-column-money",field:'monthly_renewalprice', formatter:utilities2.display_money},
			{label: 'Monthly Sales Price',className:"dgrid-column-money",field:'monthly_salesprice', formatter:utilities2.display_money},
			{label: 'Con. Users',className:"dgrid-column-nbr-right",field:'concurrentusers'},
			{label: 'Paid Months',className:"dgrid-column-nbr-right",field:'paid_months'},
			{label: ' ',name:'delete', className:"dgrid-column-type-boolean",field:'pricecodeid',formatter:utilities2.delete_row_ctrl},
			{label: ' ',name:'update',className:"dgrid-column-type-boolean",field:'pricecodeid',formatter:utilities2.format_row_ctrl}			
		];		

		this.view = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._pricecodes,
			sort: [{ attribute: "pricecodedescription", descending: false }],
			query:{}
		});

		this.view_grid.set("content", this.view);
		this.view.on(".dgrid-cell:click", lang.hitch(this,this._OnSelectRow));

		this.prmaxmoduleid.set('store', this._modules);
		this.prmaxmoduleid2.set('store',this._modules);
		this.customersourceid.set('store', this._customersources);
		this.customersourceid2.set('store', this._customersources);
		this.customerproductid.set('store', this._products);
		this.customerproductid2.set('store', this._products);
	},

	_OnSelectRow : function(e)
	{
		var cell = this.view.cell(e);
		
		this._row = cell.row.data;
		if ( cell.column.id  == 11)
		{
			if ( confirm("Delete Price Code " + this._row.pricecodedescription + "?"))
			{
				request.post("/pricecode/pricecode_delete",
					utilities2.make_params({ data : {pricecodeid : this._row.pricecodeid}})).
					then(this._DeletePriceCallBack);
			}
		}
		else if ( cell.column.id == 12 )
		{
			this.pricecodedescription2.set("value", this._row.pricecodedescription);
			this.pricecodelongdescription2.set("value", this._row.pricecodelongdescription);
			this.pricecodeid.set("value", this._row.pricecodeid);
			this.prmaxmoduleid2.set("value", this._row.prmaxmoduleid);
			this.customersourceid2.set("value", this._row.customersourceid);
			this.customerproductid2.set("value", this._row.customerproductid);
			this.fixed_salesprice2.set("value", this._row.fixed_salesprice);
			this.fixed_renewalprice2.set("value", this._row.fixed_renewalprice);
			this.monthly_salesprice2.set("value", this._row.monthly_salesprice);
			this.monthly_renewalprice2.set("value", this._row.monthly_renewalprice);
			this.concurrentusers2.set("value", this._row.concurrentusers);
			this.paid_months2.set("value", this._row.paid_months);

			this.pricecodeupddialog.show();
		}
	},
	resize:function()
	{
		this.borderControl.resize ( arguments[0] ) ;
		this.inherited(arguments);

	},
	_New:function()
	{
		this.pricecodedescription.set("value","");
		this.pricecodelongdescription.set("value","");
		this.prmaxmoduleid.set("value",1);
		this.customersourceid.set("value",5);
		this.customerproductid.set("value",2);
		this.fixed_salesprice.set("value",0.0);
		this.fixed_renewalprice.set("value",0.0);
		this.monthly_salesprice.set("value",0.0);
		this.monthly_renewalprice.set("value",0.0);
		this.concurrentusers.set("value",1);
		this.paid_months.set("value",12)
		this.pricecodedialog.show();
		this.pricecodedescription.focus();
	},
	_Close:function()
	{
		this.pricecodedialog.hide();
	},
	_Add:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			this.addbtn.cancel();
			return false;
		}
		request.post("/pricecode/pricecode_add",
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._AddPriceCallBack);			
	},
	_AddPriceCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._pricecodes.add( response.data );
			this._Close();
			this.pricecodedescription.set("value","");
			this.pricecodelongdescription.set("value","");
		}
		else if ( response.success == "DU")
		{
			alert("Already exists");
		}
		else
		{
			alert("Problem Adding");
		}

		this.addbtn.cancel();
	},
	_DeletePriceCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._pricecodes.remove(this._row.pricecodeid)
			this._row = null;
		}
		else
		{
			alert("Problem Deleting (Probably in use)");
		}
	},
	_UpdatePriceCall:function( response )
	{
		if ( response.success == "OK")
		{
		
			this.view.set("query",{});
			this._Close2();
		}
		else if ( response.success == "DU")
		{
			alert("Already Exists");
			this.pricecodedescription2.focus();
		}
		else
		{
			alert("Problem Adding");
		}

		this.updbtn.cancel();
	},
	_Update:function()
	{
		if (utilities2.form_validator( this.formupd ) == false )
		{
			this.updbtn.cancel();
			return false;
		}
		request.post("/pricecode/pricecode_update",
			utilities2.make_params({ data : this.formupd.get("value")})).
			then(this._UpdatePriceCallBack);				
	},
	_Close2:function()
	{
		this.pricecodeupddialog.hide();
	}
});
});
