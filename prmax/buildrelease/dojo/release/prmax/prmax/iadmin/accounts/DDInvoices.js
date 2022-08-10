/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.accounts.DDInvoices"]){dojo._hasResource["prmax.iadmin.accounts.DDInvoices"]=true;dojo.provide("prmax.iadmin.accounts.DDInvoices");dojo.require("ttl.BaseWidget");dojo.declare("prmax.iadmin.accounts.DDInvoices",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<table width=\"500px\" cellpadding=\"0\" cellpadding=\"0\">\r\n\t\t<tr><td colspan=\"2\"><div class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Create DD Invoices for next 10 Working days (Ignores Bank Holidays)</div></td>\r\n\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >DD Day</td><td><select data-dojo-props='\"class\":\"prmaxrequired\",required:\"true\",name:\"pay_montly_day\",autoComplete:\"true\",style:\"width:3em\"' data-dojo-attach-point=\"pay_montly_day\" data-dojo-type=\"dijit.form.FilteringSelect\" ><option value=\"1\">1</option><option value=\"8\">8</option><option value=\"15\">15</option><option value=\"22\">22</option></select></td></tr>\r\n\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >DD Date</td><td><input type=\"text\"  dojoAttachPoint=\"take_date\" name = \"take_date\" required=\"true\" dojoType=\"dijit.form.DateTextBox\" ></td></tr>\r\n\t\t<tr><td colspan=\"2\"><br/><br/><br/></td></tr>\r\n\t\t<tr><td class=\"prmaxrowlabel\" colspan=\"2\" align=\"center\"><button dojoType=\"dojox.form.BusyButton\" type=\"button\" dojoAttachEvent=\"onClick:_CreateInvoices\" busylabel=\"Please Wait\" dojoAttachPoint=\"invbtn\">Create Invoices And Setup Payment</button></td></tr>\r\n\t\t<tr><td colspan=\"2\" ><br/><br/><br/></td></tr>\r\n\t\t<tr><td>\r\n\t\t\t<form target=\"_newtab\" action=\"/iadmin/payment_dd_invoices_draft\" method=\"post\" dojoAttachEvent=\"onsubmit:_DraftInvoices\" >\r\n\t\t\t\t<input type=\"hidden\"  dojoAttachPoint=\"tmp_cache\" name = \"tmp_cache\" dojoType=\"dijit.form.TextBox\" >\r\n\t\t\t\t<input type=\"hidden\"  dojoAttachPoint=\"pay_montly_day2\" name = \"pay_montly_day\" dojoType=\"dijit.form.TextBox\" >\r\n\t\t\t\t<input type=\"hidden\"  dojoAttachPoint=\"take_date2\" name = \"take_date\" dojoType=\"dijit.form.TextBox\" >\r\n\t\t\t\t<button type=\"submit\" dojoType=\"dijit.form.Button\" label=\"See Draft List\" ></button>\r\n\t\t\t</form>\r\n\t\t</td></tr>\r\n\t</table>\r\n</div>\r\n",constructor:function(){this._InvoiceCallBack=dojo.hitch(this,this._InvoiceCall);},_CreateInvoices:function(){if(confirm("Create Payment Run")){var _1={pay_montly_day:this.pay_montly_day.get("value"),take_date:ttl.utilities.toJsonDate(this.take_date.get("value"))};dojo.xhrPost(ttl.utilities.makeParams({load:dojo.hitch(this,this._InvoiceCallBack),url:"/iadmin/payment_dd_invoices",content:_1}));}else{this.invbtn.cancel();}},_InvoiceCall:function(_2){if(_2.success=="OK"){alert("Invoice Run Created");}else{alert("Problem creating Invoice Run");}this.invbtn.cancel();},_DraftInvoices:function(){this.tmp_cache.set("value",new Date());this.pay_montly_day2.set("value",this.pay_montly_day.get("value"));if(this.take_date.get("value")){var d=this.take_date.get("value");this.take_date2.set("value",d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());}else{this.take_date2.set("value",null);}return true;}});}