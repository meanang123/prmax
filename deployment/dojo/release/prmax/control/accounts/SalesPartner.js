//>>built
require({cache:{"url:control/accounts/templates/SalesPartner.html":"<div>\r\n        <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"height:35px;width:100%;overflow:hidden;border:1px solid black\"'>\r\n            <div class=\"dijitToolbarTop\" data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"float:left:height:100%;width:100%\",\"class\":\"prmaxbuttonlarge\"' >\r\n                <table width=\"50%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" >\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:70px\">Partner</td><td style=\"width:250px\"><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='\"class\":\"prmaxinput\",name:\"customersourceid\",style:\"width:15em\"' data-dojo-attach-point=\"customersourceid\" ></select></td>\r\n                        <td><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_change_partner\">Show Partner</button></td>\r\n                    </tr>\r\n                </table>\r\n            </div>\r\n        </div>\r\n\r\n    <div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"' >\r\n        <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='\"class\":\"scrollpanel\",style:\"width:100%;height:100%\",title:\"Details\"' >\r\n            <form data-dojo-attach-point=\"DetailsForm\" data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n                <table class=\"prmaxtable\" width=\"500px\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Name</td><td width=\"70%\"><input data-dojo-attach-point=\"name\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"name\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Contact</td><td width=\"70%\"><input data-dojo-attach-point=\"contactname\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"contactname\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Address1</td><td width=\"70%\"><input data-dojo-attach-point=\"address1\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"address1\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Address2</td><td width=\"70%\"><input data-dojo-attach-point=\"address2\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"address2\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >County</td><td width=\"70%\"><input data-dojo-attach-point=\"county\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"county\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Postcode</td><td width=\"70%\"><input data-dojo-attach-point=\"postcode\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"postcode\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Townname</td><td width=\"70%\"><input data-dojo-attach-point=\"townname\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"townname\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Country</td><td width=\"70%\"><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='\"class\":\"prmaxinput\",name:\"country\"' data-dojo-attach-point=\"country\" ></select></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Email Address</td><td width=\"70%\"><input data-dojo-attach-point=\"email\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"email\",required:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:40,maxLength:70' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Phone</td><td width=\"70%\"><input data-dojo-attach-point=\"phone\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",trim:true,name:\"phone\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                    <tr><td><button data-dojo-attach-point=\"updbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_update_partner\">Update</button></td></tr>\r\n                </table>\r\n            </form>\r\n        </div>\r\n\r\n        <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='\"class\":\"scrollpanel\",style:\"width:100%;height:100%\",title:\"Financial Log\"' >\r\n            <div style=\"height:6%;width:100%;overflow:hidden;padding:0px;margin:0px\">\r\n                <div style=\"float:left;padding-top:0px;padding-right:10px;margin:5px\" >\r\n                    <label class=\"label_size_small\">Dates</label><div data-dojo-type=\"prcommon2/date/daterange\" data-dojo-attach-point=\"date_search\"></div>\r\n                    <label class=\"prmaxrowdisplay\">Unallocated</label><input data-dojo-props='\"class\":\"prmaxbutton\",type:\"checkbox\",name:\"unallocated\",checked:true' data-dojo-attach-point=\"unallocated\" data-dojo-type=\"dijit/form/CheckBox\" >\r\n                    <button type=\"button\" data-dojo-attach-event=\"onClick:_FilterBy\" data-dojo-type=\"dijit/form/Button\" label=\"Filter By\" ></button>\r\n                    <button data-dojo-attach-event=\"onClick:_statement_report\" data-dojo-attach-point=\"statementreportbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='iconClass:\"fa fa-print\",type:\"button\",busyLabel:\"Generating Statement Report...\",label:\"Statement Report PDF\"'></button>\r\n                    <td><button data-dojo-attach-event=\"onClick:_statement_report_excel\" data-dojo-attach-point=\"statementreportexcelbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='iconClass:\"fa fa-print\",type:\"button\",busyLabel:\"Generating Statement Report Excel...\",label:\"Statement Report Excel\"'></button>\r\n                </div>\r\n            </div>\r\n\r\n             <div data-dojo-attach-point=\"financialgrid\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",splitter:true,style:\"width:100%;height:93%\"' ></div>\r\n        </div>\r\n\r\n        <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='\"class\":\"scrollpanel\",style:\"width:100%;height:100%\",title:\"Customers\"' >\r\n            <div style=\"height:6%;width:100%;overflow:hidden;padding:0px;margin:0px\">\r\n                <div style=\"float:left;padding-top:0px;padding-right:10px;margin:5px\" >\r\n                    <select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='\"class\":\"prmaxinput\",name:\"customerstatus\", value:0' data-dojo-attach-point=\"customerstatus\" ></select>\r\n                    <button type=\"button\" data-dojo-attach-event=\"onClick:_FilterBy_Customers\" data-dojo-type=\"dijit/form/Button\" label=\"Filter By\" ></button>\r\n                    <button data-dojo-attach-event=\"onClick:_listing_report\" data-dojo-attach-point=\"listingreportbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='iconClass:\"fa fa-print\",type:\"button\",busyLabel:\"Generating Customers Report...\",label:\"Customers Report PDF\"'></button>\r\n                    <button data-dojo-attach-event=\"onClick:_listing_report_excel\" data-dojo-attach-point=\"listingreportexcelbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='iconClass:\"fa fa-print\",type:\"button\",busyLabel:\"Generating Customers Report Excel...\",label:\"Customers Report Excel\"'></button>\r\n                </div>\r\n            </div>\r\n        \r\n            <div data-dojo-attach-point=\"customersgrid\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",splitter:true,style:\"width:100%;height:93%\"' ></div>\r\n        </div>\r\n\r\n        <div data-dojo-attach-point=\"listing_report_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Partners' Customers\" data-dojo-props='style:\"width:300px\"'>\r\n            <div data-dojo-type=\"prcommon2/reports/ReportBuilder\" data-dojo-attach-point=\"listing_report_node\"></div>\r\n        </div><br/>\r\n        <div data-dojo-attach-point=\"statement_report_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Partners' Statement\" data-dojo-props='style:\"width:300px\"'>\r\n            <div data-dojo-type=\"prcommon2/reports/ReportBuilder\" data-dojo-attach-point=\"statement_report_node\"></div>\r\n        </div>        \r\n    </div>\r\n\r\n    <form data-dojo-attach-point=\"documentform\" target=\"_blank\" method=\"post\" action=\"/audit/viewpdf\">\r\n        <input type=\"hidden\" name=\"audittrailid\" data-dojo-attach-point=\"documentform_audittrailid\">\r\n    </form>\r\n    <form data-dojo-attach-point=\"htmlform\" target=\"_blank\" method=\"post\" action=\"/audit/viewhtml\">\r\n        <input type=\"hidden\" name=\"audittrailid\" data-dojo-attach-point=\"htmlform_audittrailid\">\r\n    </form>\r\n    \r\n</div>\r\n"}});define("control/accounts/SalesPartner",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../accounts/templates/SalesPartner.html","dijit/layout/BorderContainer","dijit/layout/ContentPane","dojo/request","ttl/utilities2","dojo/_base/lang","dojo/topic","dojo/dom-class","dojo/dom-attr","dojo/data/ItemFileReadStore","ttl/store/JsonRest","dojo/store/Observable","ttl/grid/Grid","dijit/form/Select","dijit/form/ValidationTextBox","dojox/form/BusyButton","dijit/form/Button","dijit/form/CurrencyTextBox","dijit/form/NumberTextBox","dijit/Toolbar","dijit/Dialog","dijit/form/Form","dijit/form/FilteringSelect","prcommon2/reports/ReportBuilder","prcommon2/date/daterange","dojox/validate/regexp"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f){return _1("control.accounts.SalesPartner",[_2,_4],{templateString:_3,gutters:false,constructor:function(){this.financial_data=new _e(new _d({target:"/audit/partners_financial",idProperty:"audittrailid",onError:_7.globalerrorchecker,clearOnClose:true,nocallback:true,urlPreventCache:true}));this.customers_data=new _e(new _d({target:"/customer/partner_customers",idProperty:"customerid",onError:_7.globalerrorchecker,clearOnClose:true,nocallback:true,urlPreventCache:true}));this._customersources=new _c({url:"/common/lookups?searchtype=customersources&nofilter=-1"});this._countries=new _c({url:"/common/lookups?searchtype=countries"});this._customerstatus=new _c({url:"/common/lookups?searchtype=customerstatus&show_all=0"});this._get_partner_call_back=_8.hitch(this,this._get_partner_call);this._update_partner_call_back=_8.hitch(this,this._update_partner_call);this._complete_listing_call_back=_8.hitch(this,this._complete_listing_call);this._complete_statement_call_back=_8.hitch(this,this._complete_statement_call);this._complete_listing_excel_call_back=_8.hitch(this,this._complete_listing_excel_call);this._complete_statement_excel_call_back=_8.hitch(this,this._complete_statement_excel_call);},postCreate:function(){this.customersourceid.set("store",this._customersources);this.customersourceid.set("value",-1);this.country.set("store",this._countries);this.customerstatus.set("store",this._customerstatus);this.customerstatus.set("value",0);this.inherited(arguments);var _10=[{label:"Customer",className:"dgrid-column-status-large",field:"customername"},{label:"Logged",className:"dgrid-column-status-small",field:"auditdate"},{label:"Date",className:"dgrid-column-date",field:"invoice_date"},{label:"Text",className:"dgrid-column-status-large",field:"audittext"},{label:"Charge",className:"dgrid-column-money",field:"charge",formatter:_7.display_money},{label:"Paid",className:"dgrid-column-money",field:"paid",formatter:_7.display_money},{label:"Un All.",className:"dgrid-column-money",field:"unallocated",formatter:_7.display_money},{label:"Inv/Cd Nbr",className:"dgrid-column-nbr-right",field:"invoicenbr"},{label:"Month",className:"dgrid-column-status-small",field:"payment_month_display"},{label:" ",className:"dgrid-column-type-boolean",field:"documentpresent",formatter:_7.document_exists},{label:"Reason",className:"dgrid-column-status-large",field:"reason"}];var _11=[{label:"Customer",className:"dgrid-column-status-large",field:"customername"},{label:"Contact",className:"dgrid-column-status-large",field:"contactname"},{label:"Status",className:"dgrid-column-status-small",field:"customerstatusname"}];this.view1=new _f({columns:_10,selectionMode:"single",store:this.financial_data,sort:[{attribute:"auditdate",descending:true}],query:{}});this.view2=new _f({columns:_11,selectionMode:"single",store:this.customers_data,sort:[{attribute:"customername"}],query:{}});this.financialgrid.set("content",this.view1);this.view1.on(".dgrid-cell:click",_8.hitch(this,this._OnSelectFinancial));this.customersgrid.set("content",this.view2);},_change_partner:function(){this.customersourceid.get("value");this._customersourceid=this.customersourceid;_6.post("/partners/get_partner",_7.make_params({data:{"customersourceid":this.customersourceid}})).then(this._get_partner_call_back);},_update_partner:function(){if(_7.form_validator(this.DetailsForm)==false){alert("Not all required field filled in");return false;}var _12=this.DetailsForm.get("value");_12["customersourceid"]=this.customersourceid.get("value");_6.post("/partners/update_partner",_7.make_params({data:_12})).then(this._update_partner_call_back);},_get_partner_call:function(_13){if(_13.success=="OK"){this.name.set("value",_13.data.name);this.contactname.set("value",_13.data.contactname);this.address1.set("value",_13.data.address1);this.address2.set("value",_13.data.address2);this.county.set("value",_13.data.county);this.postcode.set("value",_13.data.postcode);this.townname.set("value",_13.data.townname);this.country.set("value",_13.data.country);this.email.set("value",_13.data.email);this.phone.set("value",_13.data.phone);var _14=this._get_filters();var _15=_8.mixin(_7.get_prevent_cache(),_14);this.view1.set("query",_15);this.view2.set("query",_15);}else{alert("Problem Loading Partner");}},_update_partner_call:function(_16){if(_16.success=="OK"){alert("Partner Updated");}else{alert("Problem Updating Partner");}},_listing_report:function(){var _17={};_17["reportoutputtypeid"]=0;_17["reporttemplateid"]=28;_17["customersourceid"]=this.customersourceid.get("value");_17["customerid"]=-1;_17["customerstatusid"]=this.customerstatus.get("value");this.listing_report_dlg.show();this.listing_report_node.SetCompleted(this._complete_listing_call_back);this.listing_report_node.start(_17);},_listing_report_excel:function(){var _18={};_18["reportoutputtypeid"]=4;_18["reporttemplateid"]=28;_18["customersourceid"]=this.customersourceid.get("value");_18["customerid"]=-1;_18["customerstatusid"]=this.customerstatus.get("value");this.listing_report_dlg.show();this.listing_report_node.SetCompleted(this._complete_listing_excel_call_back);this.listing_report_node.start(_18);},_complete_listing_call:function(){this.listingreportbtn.cancel();this.listing_report_dlg.hide();},_complete_listing_excel_call:function(){this.listingreportexcelbtn.cancel();this.listing_report_dlg.hide();},_statement_report:function(){var _19={};_19["reportoutputtypeid"]=0;_19["reporttemplateid"]=29;_19["customersourceid"]=this.customersourceid.get("value");_19["customerid"]=-1;this.statement_report_dlg.show();this.statement_report_node.SetCompleted(this._complete_statement_call_back);this.statement_report_node.start(_19);},_statement_report_excel:function(){var _1a={};_1a["reportoutputtypeid"]=4;_1a["reporttemplateid"]=29;_1a["customersourceid"]=this.customersourceid.get("value");_1a["customerid"]=-1;this.statement_report_dlg.show();this.statement_report_node.SetCompleted(this._complete_statement_excel_call_back);this.statement_report_node.start(_1a);},_complete_statement_call:function(){this.statementreportbtn.cancel();this.statement_report_dlg.hide();},_complete_statement_excel_call:function(){this.statementreportexcelbtn.cancel();this.statement_report_dlg.hide();},_OnSelectFinancial:function(e){var _1b=this.view1.cell(e);this._row=_1b.row.data;if(_1b.column.id==9&&this._row.documentpresent==true){if(this._row.audittypeid==17){_b.set(this.htmlform_audittrailid,"value",this._row.audittrailid);_b.set(this.htmlform,"action","/audit/viewhtml/"+this._row.audittrailid);this.htmlform.submit();}else{_b.set(this.documentform_audittrailid,"value",this._row.audittrailid);_b.set(this.documentform,"action","/audit/viewpdf/"+this._row.audittrailid);this.documentform.submit();}}else{var _1c=_8.mixin(_7.get_prevent_cache(),{keyid:this._row.keyid});this.view2.set("query",_1c);this.zone.selectChild((this._row.keyid==null)?this.blank_view:this.allocations_view);if(this._row.keyid==null){_a.add(this.reallocate,"prmaxhidden");}else{_a.remove(this.reallocate,"prmaxhidden");}}},_getFilterAttr:function(){return this._get_filters();},_get_filters:function(){var _1d={customersourceid:this._customersourceid,daterange:this.date_search.get("value"),unallocated:this.unallocated.get("checked")};return _1d;},_get_filters_customers:function(){var _1e={customersourceid:this._customersourceid,customerstatus:this.customerstatus.get("value")};return _1e;},_FilterBy:function(){var _1f=this._get_filters();var _20=_8.mixin(_7.get_prevent_cache(),_1f);this.view1.set("query",_20);},_FilterBy_Customers:function(){var _21=this._get_filters_customers();var _22=_8.mixin(_7.get_prevent_cache(),_21);this.view2.set("query",_22);}});});