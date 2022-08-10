/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.accounts.ManualInvoice"]){dojo._hasResource["prmax.iadmin.accounts.ManualInvoice"]=true;dojo.provide("prmax.iadmin.accounts.ManualInvoice");dojo.require("ttl.BaseWidget");dojo.require("dojo.io.iframe");dojo.require("dojox.form.FileInput");dojo.require("ttl.DateTextBox");dojo.require("dojo.number");dojo.declare("prmax.iadmin.accounts.ManualInvoice",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<form dojoAttachPoint=\"form\" method=\"post\" name=\"form\" enctype=\"multipart/form-data\" onSubmit=\"return false;\">\r\n\t\t<input type=\"hidden\"  dojoAttachPoint=\"icustomerid\" name=\"icustomerid\" dojoType=\"dijit.form.TextBox\" ></input>\r\n\t\t<input type=\"hidden\"  dojoAttachPoint=\"invoice_date2\" name=\"invoice_date\" dojoType=\"dijit.form.TextBox\" ></input>\r\n\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Manual Invoice</label><div style=\"display:inline\" class=\"prmaxrowdisplaylarge\" dojoAttachPoint=\"customername\">Name</div></td></tr>\r\n\t\t\t<tr><td style=\"width:150px\" class=\"prmaxrowlabel\" align=\"right\">Invoice Ref</td><td><input type=\"text\"  dojoAttachPoint=\"invoice_ref\" name = \"invoice_ref\" dojoType=\"dijit.form.ValidationTextBox\" style=\"width:8em\" required=\"true\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\">Invoice Date</td><td><input type=\"text\" dojoAttachPoint=\"invoice_date\" dojoType=\"ttl.DateTextBox\" style=\"width:8em\" required=\"true\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\"><label class=\"prmaxrowlabel\">Gross Amount</label></td><td><input type=\"text\" name=\"amount\" dojoType=\"dijit.form.CurrencyTextBox\" required=\"true\" trim=\"true\" constraints=\"{min:0.01,max:99999.00,fractional:true,places:'0,2'}\" dojoAttachPoint=\"amount\" style=\"width:8em\" dojoAttachEvent=\"onBlur:_Amounts\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\"><label class=\"prmaxrowlabel\">Vat</label></td><td><input type=\"text\" name=\"vat\" dojoType=\"dijit.form.CurrencyTextBox\" required=\"true\" trim=\"true\" constraints=\"{min:0.00,max:99999.00,fractional:true,places:'0,2'}\" dojoAttachPoint=\"vat\" style=\"width:8em\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\"><label class=\"prmaxrowlabel\" >Unpaid Amount</label></td><td><input type=\"text\" name=\"unpaidamount\" dojoType=\"dijit.form.CurrencyTextBox\" required=\"true\" dojoAttachPoint=\"unpaidamount\" style=\"width:8em\" constraints=\"{min:0.00,max:99999.00,fractional:true,places:'0,2'}\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowlabel\">Invoice File (pdf)</td><td><input class=\"prmaxinput\" type=\"file\" dojoAttachPoint=\"invoice_file\" name=\"invoice_file\" size=\"50\"></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" colspan=\"2\" align=\"right\"><button dojoType=\"dijit.form.Button\" type=\"button\" dojoAttachEvent=\"onClick:_Send\">Enter Manual Invoice</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n",constructor:function(){this._AddCallBack=dojo.hitch(this,this._AddCall);},_AddCall:function(_1){if(_1.success=="OK"){alert("Invoice Added");dojo.publish(PRCOMMON.Events.Financial_ReLoad,[]);this._dialog.hide();}else{alert("Problem Adding Invoice");}},_Send:function(){if(this.invoice_ref.isValid()==false||this.invoice_date.isValid()==false||this.amount.isValid()==false||this.vat.isValid()==false||this.unpaidamount.isValid()==false){return false;}var _2=dojo.attr(this.invoice_file,"value").toLowerCase();if(_2.indexOf(".pdf")==-1){alert("This must be a pdf file");return false;}this.invoice_date2.set("value",this.invoice_date.get("ValueISO"));dojo.io.iframe.send({url:"/iadmin/add_manual_invoice",handleAs:"json",load:this._AddCallBack,form:this.form});},setCustomer:function(_3,_4,_5){this.icustomerid.set("value",_3);this.invoice_date.set("value",new Date());this.invoice_ref.set("value","");this.amount.set("value",0);this.unpaidamount.set("value",0);this.vat.set("value",0);dojo.attr(this.invoice_file,"value","");dojo.attr(this.customername,"innerHTML",_4);this._dialog=_5;},_Amounts:function(){var _6=this.amount.get("value");var _7=_6-(_6/(1+(20/100)));this.unpaidamount.set("value",_6);this.vat.set("value",dojo.number.format(_7,{places:2}));}});}