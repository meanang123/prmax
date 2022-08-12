/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.accounts.FinancialView"]){dojo._hasResource["prmax.iadmin.accounts.FinancialView"]=true;dojo.provide("prmax.iadmin.accounts.FinancialView");dojo.require("ttl.BaseWidget");dojo.require("prmax.iadmin.accounts.ReAllocation");dojo.declare("prmax.iadmin.accounts.FinancialView",[ttl.BaseWidget],{templateString:"<div>\r\n\t<div  dojoAttachPoint=\"borderControl\" dojotype=\"dijit.layout.BorderContainer\" gutters=\"false\"  style=\"width:100%;height:100%;overflow: hidden; border: 0; padding: 0; margin: 0\" >\r\n\t\t<div dojotype=\"dijit.layout.ContentPane\" region=\"top\" style=\"width:100%;height:45px;\">\r\n\t\t\t<div style=\"height:44px;width:100%;overflow:hidden;padding:0px;margin:0px\">\r\n\t\t\t\t<div style=\"float:left\" >\r\n\t\t\t\t<p class=\"prmaxrowdisplaylarge\" >Balance £&nbsp;<span dojoAttachPoint=\"balance_figure\">0.00</span></p>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div style=\"float:right;padding-top:0px;padding-right:10px;margin:5px\" >\r\n\t\t\t\t\t<input class=\"prmaxbutton\" type=\"text\"  dojoAttachPoint=\"filterdate\" name = \"filterdate\" dojoType=\"dijit.form.DateTextBox\" >\r\n\t\t\t\t\t<label class=\"prmaxrowdisplay\">Unallocated</label><input class=\"prmaxbutton\" type=\"checkbox\" dojoAttachPoint=\"unallocated\" name = \"unallocated\" dojoType=\"dijit.form.CheckBox\" >\r\n\t\t\t\t\t<label class=\"prmaxrowdisplay\">Money Only</label><input class=\"prmaxbutton\" type=\"checkbox\" dojoAttachPoint=\"moneyonly\" name = \"moneyonly\" checked=\"checked\" dojoType=\"dijit.form.CheckBox\" >\r\n\t\t\t\t\t<button type=\"button\" dojoAttachEvent=\"onClick:_FilterBy\" dojoType=\"dijit.form.Button\" label=\"Filter By\" ></button>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div  dojoType=\"dijit.layout.ContentPane\" region=\"center\"  splitter=\"true\" >\r\n\t\t\t<div dojoAttachPoint=\"financialgrid\" dojoType=\"dojox.grid.DataGrid\" query=\"{ name:'*'}\" rowsPerPage=\"50\" style=\"width:100%;height:100%\" ></div>\r\n\t\t</div>\r\n\t\t<div  dojoType=\"dijit.layout.ContentPane\" region=\"bottom\"  splitter=\"true\" style=\"width:100%;height:20%\">\r\n\t\t\t<div dojoType=\"dijit.layout.StackContainer\" dojoAttachPoint=\"zone\" region=\"center\"  doLayout=\"true\" style=\"border:1px solid black\">\r\n\t\t\t\t<div dojotype=\"dijit.layout.ContentPane\" title=\"blank\" dojoAttachPoint=\"blank_view\" selected></div>\r\n\t\t\t\t<div dojotype=\"dijit.layout.BorderContainer\" style=\"width:100%;height:100%\" title=\"allocations\" gutters=\"false\" dojoAttachPoint=\"allocations_view\">\r\n\t\t\t\t\t<div dojoAttachPoint=\"allocations_grid\" dojoType=\"dojox.grid.DataGrid\" query=\"{ name:'*'}\" rowsPerPage=\"50\" region=\"center\"></div>\r\n\t\t\t\t\t<div dojotype=\"dijit.layout.ContentPane\" region=\"right\" style=\"width:50%;height:100%\">\r\n\t\t\t\t\t\t<button class=\"prmaxbutton\"  type=\"button\" dojoType=\"dijit.form.Button\" label=\"Re-Allocate\" dojoAttachEvent=\"onClick:_ReAllocate\" dojoAttachPoint=\"reallocate\" ></button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n<form dojoAttachPoint=\"documentform\" target=\"_blank\" method=\"post\" action=\"/iadmin/viewpdf\">\r\n\t<input type=\"hidden\" name=\"audittrailid\" dojoAttachPoint=\"documentform_audittrailid\">\r\n</form>\r\n<form data-dojo-attach-point=\"htmlform\" target=\"_blank\" method=\"post\" action=\"/iadmin/viewhtml\">\r\n\t<input type=\"hidden\" name=\"audittrailid\" data-dojo-attach-point=\"htmlform_audittrailid\">\r\n</form>\r\n\r\n<div data-dojo-type=\"prmax.iadmin.accounts.ReAllocation\" data-dojo-attach-point=\"reallocation\"></div>\r\n</div>\r\n",constructor:function(){this.financial_data=new prcommon.data.QueryWriteStore({url:"/iadmin/customer_financial",onError:ttl.utilities.globalerrorchecker,clearOnClose:true,nocallback:true,urlPreventCache:true});this.allocation_data=new prcommon.data.QueryWriteStore({url:"/iadmin/allocation_details",onError:ttl.utilities.globalerrorchecker,clearOnClose:true,nocallback:true,urlPreventCache:true});this._DeleteAlocationCallBack=dojo.hitch(this,this._DeleteAlocationCall);this._LoadBalanceCallBack=dojo.hitch(this,this._LoadBalanceCall);dojo.subscribe(PRCOMMON.Events.Financial_ReLoad,dojo.hitch(this,this._RefreshView));},postCreate:function(){this.inherited(arguments);var td=new Date();var t=new Date(td.getTime()-370*24*60*60*1000);this.filterdate.set("value",t);this.financialgrid.set("structure",this.view);this.allocations_grid.set("structure",this.view2);this.financialgrid._setStore(this.financial_data);this.allocations_grid._setStore(this.allocation_data);this.financialgrid["onRowClick"]=dojo.hitch(this,this._OnSelectFinancial);this.allocations_grid["onRowClick"]=dojo.hitch(this,this._OnSelectAllocation);},Load:function(_1){this._customerid=_1;var _2={icustomerid:this._customerid,unallocated:this.unallocated.get("checked"),moneyonly:this.moneyonly.get("checked")};this.financialgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),_2));this._GetBalance();},resize:function(){this.inherited(arguments);this.borderControl.resize(arguments[0]);},view:{noscroll:false,cells:[[{name:"Logged",width:"5em",field:"auditdate"},{name:"Date",width:"5em",field:"invoice_date"},{name:"Text",width:"20em",field:"audittext"},{name:"Charge",width:"4em",field:"charge",styles:"text-align: right;padding-right:2px;",formatter:ttl.utilities.Display_Money},{name:"Paid",width:"4em",field:"paid",styles:"text-align: right;padding-right:2px;",formatter:ttl.utilities.Display_Money},{name:"Un All.",width:"4em",field:"unallocated",styles:"text-align: right;padding-right:2px;",formatter:ttl.utilities.Display_Money},{name:"Inv/Cd Nbr",width:"4em",field:"invoicenbr",styles:"text-align: right;padding-right:2px;"},{name:"Month",width:"5em",field:"payment_month_display",styles:"text-align: right;padding-right:2px;"},{name:" ",width:"2em",field:"documentpresent",formatter:ttl.utilities.documentExists},{name:"Reason",width:"auto",field:"reason"}]]},view2:{noscroll:false,cells:[[{name:"Type",width:"12em",field:"type"},{name:"Allocated",width:"5em",field:"amount",styles:"text-align: right;padding-right:2px;",formatter:ttl.utilities.Display_Money},{name:"Value",width:"5em",field:"amount",styles:"text-align: right;padding-right:2px;",formatter:ttl.utilities.Display_Money},{name:"Inv Id",width:"4em",field:"invoicenbr",styles:"text-align: right;padding-right:2px;"},{name:"Date",width:"5em",field:"invoicedate"},{name:" ",width:"2em",formatter:ttl.utilities.deleteRowCtrl}]]},_OnSelectFinancial:function(e){this._row=this.financialgrid.getItem(e.rowIndex);if(e.cellIndex==8&&this._row.i.documentpresent==true){if(this._row.i.audittypeid==17){dojo.attr(this.htmlform_audittrailid,"value",this._row.i.audittrailid);dojo.attr(this.htmlform,"action","/iadmin/viewhtml/"+this._row.i.audittrailid);this.htmlform.submit();}else{dojo.attr(this.documentform_audittrailid,"value",this._row.i.audittrailid);dojo.attr(this.documentform,"action","/iadmin/viewpdf/"+this._row.i.audittrailid);this.documentform.submit();}}else{this.allocations_grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{keyid:this._row.i.keyid}));this.zone.selectChild((this._row.i.keyid==null)?this.blank_view:this.allocations_view);if(this._row.i.keyid==null){dojo.addClass(this.reallocate,"prmaxhidden");}else{dojo.removeClass(this.reallocate,"prmaxhidden");}}this.financialgrid.selection.clickSelectEvent(e);},_DeleteAlocationCall:function(_3){if(_3.success=="OK"){this.allocation_data.deleteItem(this._alloc_row);this.financialgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{icustomerid:this._customerid}));alert("Allocation Deleted");}else{alert("Problem Deleting Allocation");}},_OnSelectAllocation:function(e){this._alloc_row=this.allocations_grid.getItem(e.rowIndex);if(e.cellIndex==5){if(confirm("Delete Allocation")){dojo.xhrPost(ttl.utilities.makeParams({load:dojo.hitch(this,this._DeleteAlocationCallBack),url:"/iadmin/allocation_delete",content:{customerpaymentallocationid:this._alloc_row.i.customerpaymentallocationid}}));}}},_ReAllocate:function(){this.reallocation.Load(this._customerid,this._row.i.keyid);},_RefreshView:function(){var _4={icustomerid:this._customerid,filter_date:ttl.utilities.toJsonDate(this.filterdate.get("value")),unallocated:this.unallocated.get("value"),moneyonly:this.moneyonly.get("value")};this.financialgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),_4));if(this._row!=null&&this._row.i.keyid!=null){this.allocations_grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{keyid:this._row.i.keyid}));}this._GetBalance();},_FilterBy:function(){var _5={icustomerid:this._customerid,filter_date:ttl.utilities.toJsonDate(this.filterdate.get("value")),unallocated:this.unallocated.get("value"),moneyonly:this.moneyonly.get("value")};this.financialgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),_5));dojo.addClass(this.reallocate,"prmaxhidden");this._GetBalance();},_GetBalance:function(){dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadBalanceCallBack,url:"/iadmin/customer_balance",content:{"icustomerid":this._customerid}}));},_LoadBalanceCall:function(_6){if(_6.success=="OK"){dojo.attr(this.balance_figure,"innerHTML",dojo.number.format(_6.balances.balance/100,{places:2}));}else{dojo.attr(this.balance_figure,"innerHTML","ERROR");}}});}