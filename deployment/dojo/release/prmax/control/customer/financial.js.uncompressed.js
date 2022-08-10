require({cache:{
'url:control/customer/templates/financial.html':"<div>\r\n    <div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='gutters:true,style:\"width:100%;height:100%\"' >\r\n        <div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"' >\r\n            <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='\"class\":\"scrollpanel\",style:\"width:100%;height:100%\",title:\"Details\"' >\r\n                <form data-dojo-attach-point=\"financialForm\" data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n                    <table class=\"prmaxtable\" width=\"500px\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Order Status</td><td width=\"70%\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"customerorderstatusid\",style:\"width:19em\",autoComplete:true' data-dojo-attach-point=\"customerorderstatusid\" data-dojo-type=\"dijit/form/FilteringSelect\" ></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Financial Status</td><td width=\"70%\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"financialstatusid\",style:\"width:15em\",autoComplete:true' data-dojo-attach-point=\"financialstatusid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Payment Method</td><td width=\"70%\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"paymentmethodid\",style:\"width:15em\",autoComplete:true' data-dojo-attach-point=\"paymentmethodid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Core Renewal Date</td><td><input data-dojo-attach-point=\"renewal_date\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",required:true,name:\"renewal_date\"' data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Features Renewal Date</td><td><input data-dojo-attach-point=\"renewal_date_features\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"renewal_date_features\"' data-dojo-type=\"dijit/form/DateTextBox\"></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Bank Name</td><td width=\"70%\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"bank_name\",type:\"text\",trim:true' data-dojo-attach-point=\"bank_name\" data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Account Name</td><td width=\"70%\"><input data-dojo-attach-point=\"bank_account_name\" data-dojo-props='name:\"bank_account_name\",type:\"text\",trim:true,\"class\":\"prmaxinput\"' data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Sort Code</td><td width=\"70%\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"bank_sort_code\",type:\"text\",trim:true' data-dojo-attach-point=\"bank_sort_code\" data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Account Number</td><td width=\"70%\"><input data-dojo-attach-point=\"bank_account_nbr\" data-dojo-props='\"class\":\"prmaxinput\",name:\"bank_account_nbr\",type:\"text\",trim:\"true\"' data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Purchase Order</td><td width=\"70%\"><input data-dojo-attach-point=\"purchase_order\" data-dojo-props='\"class\":\"prmaxinput\",name:\"purchase_order\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Bundled Invoice</td><td><input data-dojo-attach-point=\"has_bundled_invoice\" data-dojo-props='\"class\":\"prmaxinput\",name:\"has_bundled_invoice\",type:\"checkbox\"' data-dojo-type=\"dijit/form/CheckBox\"/></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">DD Reference</td><td width=\"70%\"><input data-dojo-attach-point=\"dd_ref\" data-dojo-props='type:\"text\",\"class\":\"prmaxinput\",name:\"dd_ref\"' data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">DD Start Day of Month</td><td width=\"70%\"><select data-dojo-props='style:\"width:50px\",\"class\":\"prmaxinput\",name:\"dd_start_day\",type:\"text\"' data-dojo-attach-point=\"dd_start_day\" data-dojo-type=\"dijit/form/ComboBox\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">DD Start Month</td><td width=\"70%\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"dd_start_month\",type:\"text\",trim:true, constraints:{min:0,max:3}, style:\"width:3em\"' data-dojo-attach-point=\"dd_start_month\" data-dojo-type=\"dijit/form/NumberTextBox\"></td></tr>\r\n                        <tr>\r\n                            <td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">DD Media Mn.</td><td width=\"70%\">\r\n                                <input data-dojo-attach-point=\"pay_monthly_value\" data-dojo-props='\"class\":\"prmaxinput\",name:\"pay_monthly_value\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/CurrencyTextBox\" >&nbsp;\r\n                                <select data-dojo-props='\"class\":\"prmaxinput\",name:\"dd_media_pricecodeid\",style:\"width:5em\",autoComplete:true' data-dojo-attach-point=\"dd_media_pricecodeid\" data-dojo-type=\"dijit/form/ComboBox\"></select>\r\n                            </td>\r\n                        </tr>\r\n                        <tr data-dojo-attach-point=\"adv_1\"><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">DD Features Mn.</td><td width=\"70%\"><input data-dojo-attach-point=\"dd_advance_value\" data-dojo-props='\"class\":\"prmaxinput\",name:\"dd_advance_value\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/CurrencyTextBox\"></td></tr>\r\n                        <tr data-dojo-attach-point=\"monitoring_1\"><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">DD Monitoring Mn.</td><td width=\"70%\"><input data-dojo-attach-point=\"dd_monitoring_value\" data-dojo-props='\"class\":\"prmaxinput\",name:\"dd_monitoring_value\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/CurrencyTextBox\"></td></tr>\r\n                        <tr data-dojo-attach-point=\"int_1\"><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">DD International Mn.</td><td width=\"70%\"><input data-dojo-attach-point=\"dd_international_data_value\" data-dojo-props='\"class\":\"prmaxinput\",name:\"dd_international_data_value\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/CurrencyTextBox\"></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Monthly Day</td><td width=\"70%\"><select data-dojo-props='style:\"width:50px\",\"class\":\"prmaxinput\",name:\"pay_montly_day\",type:\"text\"' data-dojo-attach-point=\"pay_montly_day\" data-dojo-type=\"dijit/form/ComboBox\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Next Monthly Value</td><td width=\"70%\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"next_month_value\",type:\"text\",trim:true' data-dojo-attach-point=\"next_month_value\" data-dojo-type=\"dijit/form/CurrencyTextBox\"></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" valign=\"top\">Next Monthly Invoice Message</td><td><div class=\"dialogprofileframe\" ><textarea data-dojo-attach-point=\"next_invoice_message\" data-dojo-props='name:\"next_invoice_message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' data-dojo-type=\"dijit/form/Textarea\" ></textarea></div></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Sub Day of Month</td><td width=\"70%\"><select data-dojo-props='style:\"width:50px\",\"class\":\"prmaxinput\",name:\"sub_start_day\",type:\"text\"' data-dojo-attach-point=\"sub_start_day\" data-dojo-type=\"dijit/form/ComboBox\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Last Paid Month</td><td width=\"70%\"><input data-dojo-attach-point=\"last_paid_date\" data-dojo-props='\"class\":\"prmaxinput\",readonly:\"readonly\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Collection Date</td><td width=\"70%\"><input data-dojo-props='\"class\":\"prmaxinput\",readonly:\"readonly\",type:\"text\",trim:true' data-dojo-attach-point=\"dd_collectiondate\" data-dojo-type=\"dijit/form/TextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" >SEO Payment Method</td><td ><select data-dojo-props='\"class\":\"prmaxinput\",name:\"seopaymenttypeid\",style:\"width:15em\",autoComplete:true' data-dojo-attach-point=\"seopaymenttypeid\" data-dojo-type=\"dijit/form/FilteringSelect\" ></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" >SEO Free Qty</td><td><input data-dojo-props='\"class\":\"prmaxinput\",readonly:\"readonly\", type:\"text\", \"disabled\":\"disabled\"' data-dojo-attach-point=\"seonbrincredit\" data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n                        <tr ><td class=\"prmaxrowtag\" colspan=\"2\"><button data-dojo-props='label:\"Save\",\"class\":\"prmaxbutton\",busyLabel:\"Please Wait Saving...\",type:\"button\"' data-dojo-attach-point=\"saveFinancialNode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_UpdateFinancial\" ></button></td></tr>\r\n                    </table>\r\n                </form>\r\n            </div>\r\n            <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='\"class\":\"scrollpanel\",style:\"width:100%;height:100%\",title:\"Sales Analysis\"' >\r\n                <form data-dojo-attach-point=\"salesform\" data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n                    <table class=\"prmaxtable\" width=\"500px\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Media</td><td width=\"70%\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"pricecodeid\",style:\"width:9em\",autoComplete:true' data-dojo-attach-point=\"pricecodeid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Features</td><td width=\"70%\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"advpricecodeid\",style:\"width:9em\",autoComplete:true' data-dojo-attach-point=\"advpricecodeid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Updateum</td><td width=\"70%\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"updatumpricecodeid\",style:\"width:9em\",autoComplete:true' data-dojo-attach-point=\"updatumpricecodeid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">International</td><td width=\"70%\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"intpricecodeid\",style:\"width:9em\",autoComplete:true' data-dojo-attach-point=\"intpricecodeid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" align=\"right\" style=\"width:30%\">Clippings</td><td width=\"70%\"><select data-dojo-props='\"class\":\"prmaxinput\",name:\"clippingspricecodeid\",style:\"width:9em\",autoComplete:true' data-dojo-attach-point=\"clippingspricecodeid\" data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n\r\n                        <tr><td class=\"prmaxrowtag\" colspan=\"2\"><button data-dojo-props='label:\"Save\",\"class\":\"prmaxbutton\",busyLabel:\"Please Wait Saving...\",type:\"button\"' data-dojo-attach-point=\"savesalesanalysis\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_update_sales_analysis\" ></button></td></tr>\r\n                    </table>\r\n                </form>\r\n            </div>\r\n            <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='\"class\":\"scrollpanel\",style:\"width:100%;height:100%\",title:\"Address\"' >\r\n                <form data-dojo-attach-point=\"addressform\" data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n                    <table class=\"prmaxtable\" width=\"500px\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n                        <tr><td class=\"prmaxrowtag\" style=\"width:30%\" align=\"right\" >Invoice Email</td><td width=\"70%\"><input data-dojo-props='\"class\":\"prmaxinput\",regExpGen:dojox.validate.regexp.emailAddress,trim:true,name:\"invoiceemail\",type:\"text\"' data-dojo-attach-point=\"invoiceemail\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></td></tr>\r\n                        <tr><td class=\"prmaxrowtag\" colspan=\"2\"><button data-dojo-props='label:\"Save\",\"class\":\"prmaxbutton\",busyLabel:\"Please Wait Saving...\",type:\"button\"' data-dojo-attach-point=\"saveaddress\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_update_address\" ></button></td></tr>\r\n                    </table>\r\n                </form>\r\n            </div>\r\n        </div>\r\n\r\n        <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='\"class\":\"scrollpanel\",region:\"right\",style:\"height:100%;width:150px\"' >\r\n            <button data-dojo-attach-event=\"onClick:_take_payment\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Enter Payment\",type:\"button\"'></button>\r\n            <button data-dojo-attach-event=\"onClick:_manual_payment\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Pay & Allocate\",type:\"button\"' ></button>\r\n            <button data-dojo-attach-event=\"onClick:_one_off_invoice\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"One Off Invoice\",type:\"button\"' ></button>\r\n            <button data-dojo-attach-event=\"onClick:_send_proforma\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Send Proforma\",type:\"button\"' ></button>\r\n            <button data-dojo-attach-event=\"onClick:_manual_invoice\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Manual Invoice\",type:\"button\"' ></button>\r\n            <button data-dojo-attach-event=\"onClick:_invoice\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Invoice\",type:\"button\"' ></button>\r\n            <button data-dojo-attach-event=\"onClick:_credit_note\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Credit Note\",type:\"button\"' ></button>\r\n            <button data-dojo-attach-event=\"onClick:_manual_credit\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Manual Credit\",type:\"button\"' ></button>\r\n            <button data-dojo-attach-event=\"onClick:_adjustment\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Adjustment\",type:\"button\"' ></button>\r\n            <hr/>\r\n            <button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_send_confirmation\" data-dojo-props='label:\"Order Confirmation\"' ></button>\r\n            <button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_send_update_confirmation\" data-dojo-props='label:\"Upgrade Confirmation\"' ></button>\r\n            <hr/>\r\n            <button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_dd_received_confirm\" data-dojo-props='label:\"Letter DD Received\"' ></button>            \r\n        </div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Send Proforma\"' data-dojo-attach-point=\"sendproformadialog\">\r\n        <div  data-dojo-attach-point=\"sendproformactrl\" data-dojo-type=\"control/customer/proforma\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Invoice Account\"' data-dojo-attach-point=\"invdialog\">\r\n        <div  data-dojo-attach-point=\"invctrl\" data-dojo-type=\"control/customer/pre_pay_invoice\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Enter Manual Invoice\"' data-dojo-attach-point=\"manualinvoicedialog\">\r\n        <div data-dojo-attach-point=\"manualinvoicectrl\" data-dojo-type=\"control/customer/manual_invoice\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Manual Credit\"' data-dojo-attach-point=\"manualcreditdialog\">\r\n        <div data-dojo-attach-point=\"manualcreditctrl\" data-dojo-type=\"control/customer/manual_credit\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Credit Account\"' data-dojo-attach-point=\"creditdialog\">\r\n        <div  data-dojo-attach-point=\"creditctrl\" data-dojo-type=\"control/customer/credit\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Enter Order Confirmation\"' data-dojo-attach-point=\"sendorderconfirmationdialog\">\r\n        <div data-dojo-attach-point=\"sendorderconfirmationctrl\" data-dojo-type=\"control/customer/order_confirmation\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Upgrade Confirmation\"' data-dojo-attach-point=\"upgradeconfirmationdialog\">\r\n        <div data-dojo-attach-point=\"upgradeconfirmationctrl\" data-dojo-type=\"control/customer/upgrade_order_confirmation\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Send DD Confirmation\"' data-dojo-attach-point=\"dd_conf_dialog\">\r\n        <div data-dojo-attach-point=\"dd_conf_ctrl\" data-dojo-type=\"control/customer/send_dd_conf\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"One Off Invoice\"' data-dojo-attach-point=\"onceoffinvoicedialog\">\r\n        <div data-dojo-attach-point=\"onceoffinvoicectrl\" data-dojo-type=\"control/customer/one_off_invoice\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Adjust Account\"' data-dojo-attach-point=\"adjustdialog\">\r\n        <div  data-dojo-attach-point=\"adjustctrl\" data-dojo-type=\"control/customer/adjustments\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Enter Payment & Allocated\"' data-dojo-attach-point=\"allocpaymentdialog\">\r\n        <div  data-dojo-attach-point=\"allocpaymentctrl\" data-dojo-props='manualmode:\"true\"' data-dojo-type=\"control/customer/payment\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Take Payment\"' data-dojo-attach-point=\"takepaymentdialog\">\r\n        <div  data-dojo-attach-point=\"takepaymentctrl\" data-dojo-type=\"control/customer/payment\" ></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Monthly Payment\"' data-dojo-attach-point=\"monthlypaymentdialog\">\r\n        <div  data-dojo-attach-point=\"monthlypaymentctrl\" data-dojo-type=\"control/customer/monthly_payment\" ></div>\r\n    </div>\r\n</div>\r\n\r\n"}});

//-----------------------------------------------------------------------------
// Name:    FinancialControl.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/financial", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/financial.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",	
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/FilteringSelect",
	"dijit/form/DateTextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/ComboBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/Button",
	"dijit/Dialog",
	"control/customer/payment",
	"control/customer/monthly_payment",
	"control/customer/proforma",
	"control/customer/dd_invoices",
	"control/customer/order_confirmation",
	"control/customer/upgrade_order_confirmation",
	"control/customer/manual_invoice",
	"control/customer/adjustments",
	"control/customer/credit",
	"control/customer/pre_pay_invoice",
	"control/customer/one_off_invoice",
	"control/customer/manual_credit",
	"control/customer/send_dd_conf"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,ItemFileReadStore){

 return declare("control.customer.financial",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._FinancialResponseCall = lang.hitch(this,this._FinancialResponse);
		this._update_salesanalysis_call_back = lang.hitch(this,this._update_salesanalysis_call);
		this._update_address_call_back = lang.hitch(this,this._update_address_call);
		this._paymentmethods =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=paymentmethods"});
		this._financialstatus =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=financialstatus"});
		this._daysofmonth =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=daysofmonth"});
		this._customerorderstatus =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=customerorderstatus"});
		this._seopaymenttypes =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=seopaymenttypes"});

		this._pricecodes_core =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=core"});
		this._pricecodes_adv =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=adv"});
		this._pricecodes_updatum =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=updatum"});
		this._pricecodes_int =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=int"});
		this._pricecodes_clippings =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=clippings"});

		this._LoadInvoiceCallBack = lang.hitch(this, this._LoadInvoiceCall);
		this._LoadCreditCallBack = lang.hitch(this, this._LoadCreditCall);
		this._LoadOneOffCallBack = lang.hitch(this, this._LoadOneOffCall);
		this._LoadCustomerCallBack = lang.hitch(this, this._LoadCustomerCall);
		this._ManualCreditCallBack = lang.hitch(this, this._ManualCreditCall);
		this._upgrade_load_confirmation_call_back = lang.hitch(this,this._upgrade_load_confirmation_call);
		this._send_dd_conf_call_back = lang.hitch(this,this._send_dd_conf_call);
		this._take_payment_call_back = lang.hitch(this, this._take_payment_call);
		this._manual_payment_call_back = lang.hitch(this, this._manual_payment_call);
	},
	postCreate:function()
	{
		this.paymentmethodid.set("store", this._paymentmethods);
		this.financialstatusid.set("store",this._financialstatus);
		this.pay_montly_day.set("store",this._daysofmonth);
		this.sub_start_day.set("store",this._daysofmonth);
		this.customerorderstatusid.set("store",this._customerorderstatus);
		this.seopaymenttypeid.set("store",this._seopaymenttypes);
		this.dd_start_day.set("store", this._daysofmonth);

		this.pricecodeid.set("store",this._pricecodes_core);
		this.advpricecodeid.set("store",this._pricecodes_adv);
		this.updatumpricecodeid.set("store",this._pricecodes_updatum);
		this.intpricecodeid.set("store",this._pricecodes_int);
		this.clippingspricecodeid.set("store",this._pricecodes_clippings);

		this.inherited(arguments);
	},
	load:function( data )
	{
		this.paymentmethodid.set("value", data.cust.paymentmethodid);
		this.financialstatusid.set("value", data.cust.financialstatusid);
		this.customerorderstatusid.set("value", data.cust.customerorderstatusid);

		this.next_invoice_message.set("value", data.cust.next_invoice_message);
		this.bank_name.set("value", data.cust.bank_name);
		if ( data.cust.renewal_date_d != null )
			this.renewal_date.set("value", new Date(data.cust.renewal_date_d.year, data.cust.renewal_date_d.month-1, data.cust.renewal_date_d.day));
		else
			this.renewal_date.set("value",null);
		if ( data.cust.renewal_date_features_d != null )
			this.renewal_date_features.set("value", new Date(data.cust.renewal_date_features_d.year, data.cust.renewal_date_features_d.month-1, data.cust.renewal_date_features_d.day));
		else
			this.renewal_date_features.set("value",null);

		this.invoiceemail.set("value", data.cust.invoiceemail);
		this.bank_account_name.set("value", data.cust.bank_account_name);
		this.bank_sort_code.set("value", data.cust.bank_sort_code);
		this.bank_account_nbr.set("value", data.cust.bank_account_nbr);

		this.pay_monthly_value.set("value", dojo.number.round( data.cust.pay_monthly_value/100.0,2));
		this.dd_monitoring_value.set("value", dojo.number.round( data.cust.dd_monitoring_value/100.0,2));
		this.dd_advance_value.set("value", dojo.number.round( data.cust.dd_advance_value/100.0,2));
		this.dd_international_data_value.set("value", dojo.number.round( data.cust.dd_international_data_value/100.0,2));

		this.last_paid_date.set("value", data.cust.last_paid_date_display);
		this.dd_ref.set("value", data.cust.dd_ref);
		this.dd_collectiondate.set("value", data.cust.dd_collectiondate_display);
		this.pay_montly_day.set("value", data.cust.pay_montly_day);
		this.sub_start_day.set("value", data.cust.sub_start_day);
		this.purchase_order.set("value", data.cust.purchase_order);
		this.next_month_value.set("value", dojo.number.round( data.cust.next_month_value/100.0,2));
		this.seopaymenttypeid.set("value", data.cust.seopaymenttypeid);
		this.seonbrincredit.set("value", data.cust.seonbrincredit);
		this.dd_start_day.set("value", data.cust.dd_start_day);
		this.dd_start_month.set("value", data.cust.dd_start_month);
		this.has_bundled_invoice.set("checked", data.cust.has_bundled_invoice);

		this.pricecodeid.set("value",data.cust.pricecodeid);
		this.advpricecodeid.set("value",data.cust.advpricecodeid);
		this.updatumpricecodeid.set("value",data.cust.updatumpricecodeid);
		this.intpricecodeid.set("value",data.cust.intpricecodeid);
		this.clippingspricecodeid.set("value",data.cust.clippingspricecodeid);

		this._data = data;
		this.Show_Hide_Fields (data.cust );
	},
	_take_payment_call:function( response)
	{
		if ( response.success == "OK")
		{
			this.takepaymentctrl.setCustomer (
					response.data.cust,
					this.takepaymentdialog ) ;
			this.takepaymentdialog.show();
		}
		else
		{
			alert("Problem Loading");
		}
	},
	_take_payment:function()
	{
		var tmp = this.paymentmethodid.get("value");

		if ( tmp == 1  || tmp == null)
		{
			request.post("/customer/get_internal",
				utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
				then(this._take_payment_call_back);			
		}
		else
		{
			this.monthlypaymentctrl.setCustomer (
				this._data.cust.customerid,
				this._data.cust.customername,
				this._data.cust.email ,
				this.monthlypaymentdialog,
				this.pay_monthly_value.get("value")) ;

			this.monthlypaymentdialog.show();
		}
	},
	_manual_payment_call:function (response)
	{
		if (response.success== "OK")
		{
			this.allocpaymentctrl.setCustomer (
				response.data.cust,
				this.allocpaymentdialog);
			this.allocpaymentdialog.show();
		}
		else
		{
			alert("Problem Loading");
		}
	},
	_manual_payment:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
			then(this._manual_payment_call_back);		
	},
	_adjustment:function()
	{
		this.adjustctrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this.adjustdialog ) ;

			this.adjustdialog.show();
	},
	_LoadOneOffCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.onceoffinvoicectrl.setCustomer ( response.data.cust, this.onceoffinvoicedialog ) ;
			this.onceoffinvoicedialog.show();
		}
	},
	_one_off_invoice:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data: {'icustomerid':this._data.cust.customerid}})).
			then(this._LoadOneOffCallBack);			
	},
	_dd_received_confirm:function()
	{
		if ( this.dd_ref.get("value").length>0)
		{
			request.post("/customer/get_internal",
				utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
				then(this._send_dd_conf_call_back);			
		}
		else
		{
			alert("No DD Ref");
		}
	},
	_send_dd_conf_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.dd_conf_ctrl.set_customer (
					response.data.cust,
					this.dd_conf_dialog ) ;
			this.dd_conf_dialog.show();
		}
		else
		{
			alert("Problem Loading");
		}
	},
	_send_confirmation:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
			then(this._LoadCustomerCallBack);						
	},
	_LoadCustomerCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.sendorderconfirmationctrl.setCustomer (
				response.data.cust.customerid,
				this.sendorderconfirmationdialog,
				response.data.cust) ;

			this.sendorderconfirmationdialog.show();
		}
		else
		{
			alert("Problem Loading Customer Details");
		}
	},
	_send_update_confirmation:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {'icustomerid':this._data.cust.customerid}})).
			then(this._upgrade_load_confirmation_call_back);			
	},
	_upgrade_load_confirmation_call:function( response )
	{
		if ( response.success == "OK" )
		{
			this.upgradeconfirmationctrl.set_customer (
				response.data.cust.customerid,
				this.upgradeconfirmationdialog,
				response.data.cust) ;

			this.upgradeconfirmationdialog.show();
		}
		else
		{
			alert("Problem Loading Customer Details");
		}
	},
	_credit_note:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {icustomerid:this._data.cust.customerid}})).
			then(this._LoadCreditCallBack);			
	},
	_LoadCreditCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.creditctrl.setCustomer ( response.data.cust, this.creditdialog ) ;
		}
	},
	_ManualCreditCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.manualcreditctrl.setCustomer ( response.data.cust, this.manualcreditdialog ) ;
			this.manualcreditdialog.show();
		}
	},	
	_manual_credit:function()
	{
		request.post("/customer/get_internal",
			utilities2.make_params({ data : {icustomerid:this._data.cust.customerid}})).
			then(this._ManualCreditCallBack);				
	},
	_manual_invoice:function()
	{
		this.manualinvoicectrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this.manualinvoicedialog ) ;
		this.manualinvoicedialog.show();
	},	
	_invoice:function()
	{
		request.post('/customer/get_internal',
			utilities2.make_params({ data : {icustomerid:this._data.cust.customerid}})).
			then(this._LoadInvoiceCallBack);			
			
	},
	_LoadInvoiceCall:function( response )
	{
		if (response.success == "OK")
		{
			this.invctrl.setCustomer ( response.data.cust, this.invdialog ) ;
			this.invdialog.show();
		}
		else
		{
			alert("Problem Loading Data");
		}
	},
	_send_proforma:function()
	{
		this.sendproformactrl.setCustomer (
			this._data.cust.customerid,
			this._data.cust.customername,
			this._data.cust.email ,
			this.sendproformadialog ) ;

		this.sendproformadialog.show();
	},
	_getEmailAddress:function()
	{
		var email = this.invoiceemail.get("value");
		if (email == "" )
			email = this._data.cust.email;

		return email;
	},
	_UpdateFinancial:function()
	{
		if ( utilities2.form_validator ( this.financialForm ) == false )
		{
			this.saveFinancialNode.cancel();
			return;
		}

		var content = this.financialForm.get("value");
		content["icustomerid"] = this._data.cust.customerid ;
		content["renewal_date"] = utilities2.to_json_date ( this.renewal_date.get("value") );
		content["renewal_date_features"] = utilities2.to_json_date ( this.renewal_date_features.get("value") );

		request.post("/customer/update_customer_financial",
			utilities2.make_params({ data : content})).
			then(this._FinancialResponseCall);				
	},
	_FinancialResponse:function( response )
	{
		if (response.success=="OK")
		{
			alert("Customer Financial Details Updated");
		}
		else
		{
			if ( response.message )
			{
				alert(response.message );
			}
			else
			{
				alert("Problem Updating Financial Details");
			}
		}

		this.saveFinancialNode.cancel();
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},
	Show_Hide_Fields:function( customer )
	{
		if (customer.updatum)
		{
			domclass.remove(this.monitoring_1, "prmaxhidden");
		}
		else
		{
			domclass.add(this.monitoring_1, "prmaxhidden");
		}
		if (customer.advancefeatures)
		{
			domclass.remove(this.adv_1, "prmaxhidden");
		}
		else
		{
			domclass.add(this.adv_1, "prmaxhidden");
		}
		if (customer.has_international_data)
		{
			domclass.remove(this.int_1, "prmaxhidden");
		}
		else
		{
			domclass.add(this.int_1, "prmaxhidden");
		}
	},
	_update_sales_analysis:function()
	{
		if ( utilities2.form_validator ( this.salesform ) == false )
		{
			this.savesalesanalysis.cancel();
			return;
		}

		var content = this.salesform.get("value");
		content["icustomerid"] = this._data.cust.customerid ;

		request.post("/customer/update_customer_salesanalysis",
			utilities2.make_params({ data : content})).
			then(this._update_salesanalysis_call_back);				
	},
	_update_salesanalysis_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Customer Sales Analysis Updated");
		}
		else
		{
			if ( response.message )
			{
				alert(response.message );
			}
			else
			{
				alert("Problem Updating Sales Analysis Details");
			}
		}
		this.savesalesanalysis.cancel();
	},
	_update_address:function()
	{

		if ( utilities2.form_validator ( this.addressform ) == false )
		{
			this.saveaddress.cancel();
			return;
		}

		var content = this.addressform.get("value");
		content["icustomerid"] = this._data.cust.customerid ;

		request.post("/customer/update_customer_address",
			utilities2.make_params({ data : content})).
			then(this._update_address_call_back);				
	},
	_update_address_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Customer Address Details Updated");
		}
		else
		{
			if ( response.message )
			{
				alert(response.message );
			}
			else
			{
				alert("Problem Updating Address Details");
			}
		}
		this.saveaddress.cancel();
	}
});
});

