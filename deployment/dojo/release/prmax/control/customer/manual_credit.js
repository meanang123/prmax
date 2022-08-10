//>>built
require({cache:{"url:control/customer/templates/manual_credit.html":"<div>\r\n\t<form data-dojo-attach-point=\"form\" method=\"post\" name=\"form\" enctype=\"multipart/form-data\" onSubmit=\"return false;\">\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"icustomerid\"'  data-dojo-attach-point=\"icustomerid\" data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n\t\t<input data-dojo-attach-point=\"invoice_date2\" data-dojo-props='name:\"credit_date\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\"><label class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Manual Credit</label><div style=\"display:inline\" class=\"prmaxrowdisplaylarge\" data-dojo-attach-point=\"customername\">Name</div></td></tr>\r\n\t\t\t<tr><td style=\"width:150px\" class=\"prmaxrowlabel\" align=\"right\">Reference</td><td><input data-dojo-attach-point=\"ref\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='type:\"text\",name:\"ref\",style:\"width:8em\",required:true' ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\">Date</td><td><input data-dojo-attach-point=\"credit_date\" data-dojo-type=\"ttl/DateTextBox2\" data-dojo-props='type:\"text\",style:\"width:8em\",required:true' ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" valign=\"top\" align=\"right\" >Message</td><td><div class=\"stdframe\" ><textarea data-dojo-attach-point=\"message\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"'></textarea></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowlabel\">Amount</td><td><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props='type:\"text\",name:\"amount\",style:\"width:8em\",required:true,trim:true,constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-attach-point=\"amount\" data-dojo-attach-event=\"onBlur:_amounts\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowlabel\">Vat</td><td><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props='type:\"text\",name:\"vat\",required:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:8em\"' data-dojo-attach-point=\"vat\"></input></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowlabel\" >Unpaid Amount</td><td><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"unpaidamount\" data-dojo-props='type:\"text\",name:\"unpaidamount\",required:true,style:\"width:8em\",constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"}'></input></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowlabel\">Credit File (pdf)</td><td><input class=\"prmaxinput\" type=\"file\" data-dojo-attach-point=\"credit_file\" name=\"credit_file\" size=\"50\"></input></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" colspan=\"2\" align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_send\">Enter Manual Credit Note</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});define("control/customer/manual_credit",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../customer/templates/manual_credit.html","dijit/layout/BorderContainer","dojo/request","ttl/utilities2","dojo/_base/lang","dojo/topic","dojo/dom-class","dojo/dom-attr","dojo/data/ItemFileReadStore","dojo/number","dojo/io/iframe","dojox/form/FileInput","dijit/form/TextBox","dijit/form/ValidationTextBox","dijit/form/CurrencyTextBox","dijit/form/Button","dijit/form/DateTextBox","ttl/DateTextBox2"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b){return _1("control/customer/manual_credit",[_2],{templateString:_3,gutters:false,constructor:function(){this._add_call_back=_7.hitch(this,this._add_call);},_add_call:function(_c){if(_c.success=="OK"){alert("Credit Added");_8.publish(PRCOMMON.Events.Financial_ReLoad,[]);this._dialog.hide();}else{alert("Problem Adding Credit");}},_send:function(){if(this.ref.isValid()==false||this.credit_date.isValid()==false||this.amount.isValid()==false||this.unpaidamount.isValid()==false){return false;}var _d=_a.get(this.credit_file,"value").toLowerCase();if(_d.indexOf(".pdf")==-1){alert("This must be a pdf file");return false;}this.invoice_date2.set("value",this.credit_date.get("ValueISO"));dojo.io.iframe.send({url:"/payment/add_manual_credit",handleAs:"json",load:this._add_call_back,form:this.form});},setCustomer:function(_e,_f){this.icustomerid.set("value",_e.customerid);this.credit_date.set("value",new Date());this.ref.set("value","");this.amount.set("value",0);this.vat.set("value",0);this.unpaidamount.set("value",0);_a.set(this.credit_file,"value","");_a.set(this.customername,"innerHTML",_e.customername);this._dialog=_f;},_amounts:function(){var _10=this.amount.get("value");var vat=_10-(_10/(1+(20/100)));this.unpaidamount.set("value",_10);this.vat.set("value",dojo.number.format(vat,{places:2}));}});});