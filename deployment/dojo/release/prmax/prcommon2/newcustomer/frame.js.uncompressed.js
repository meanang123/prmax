require({cache:{
'url:prcommon2/newcustomer/templates/frame.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"center\",gutters:false' >\r\n\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"controls\" data-dojo-props=\"region:'center',preload:false\">\r\n\t\t\t<input data-dojo-attach-point=\"nbroflogins\" data-dojo-props='type:\"hidden\",value:\"1\",name:\"nbrofloginsid\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t<input data-dojo-attach-point=\"customersourceid\" data-dojo-props='type:\"hidden\",value:\"5\",name:\"customersourceid\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\r\n\t\t\t\t<div data-dojo-props='style:\"width:100%;height:100%\",title:\"step1\",region:\"center\", \"class\":\"scrollpanel\"' data-dojo-attach-point='step1' data-dojo-type=\"dijit/layout/ContentPane\" >\r\n\t\t\t\t\t<form style=\"margin-left:100px\" data-dojo-props='\"class\":\"prmaxdefault\",onSubmit:\"return false\"' data-dojo-attach-point=\"step1_form\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t\t\t<div><h1>Order your PRmax</h1></div><br>\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t<table cellspacing =\"1\" cellpadding=\"1\" width=\"800px\">\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td colspan=\"3\"><div data-dojo-attach-point=\"step1_logo\" style=\"width:100%\"><img style=\"border:0px;\" src=\"/static/images/step1.png\"</img></div><br><br></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"100px\">Name*</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width:200px\",\"class\":\"prmaxinput prmaxrequired\",name:\"firstname\",placeholder:\"Firstname\"' data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width:250px\",\"class\":\"prmaxinput prmaxrequired\",name:\"familyname\",placeholder:\"Surname\"' data-dojo-attach-point=\"familyname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"100px\">Company*</td>\r\n\t\t\t\t\t\t\t\t<td colspan=\"2\"><input data-dojo-props='type:\"text\",trim:true,style:\"width:510px\",\"class\":\"prmaxinput prmaxrequired\",name:\"customername\",placeholder:\"Company Name\"' data-dojo-attach-point=\"customername\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"100px\">Address(billing)*</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 200px\",\"class\":\"prmaxinput prmaxrequired\",name:\"address1\",placeholder:\"Address\"' data-dojo-attach-point=\"address1\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 250px\",\"class\":\"prmaxinput prmaxrequired\",name:\"address2\",placeholder:\"Address Line 2\"' data-dojo-attach-point=\"address2\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 200px\",\"class\":\"prmaxinput prmaxrequired\",name:\"townname\",placeholder:\"Town\"' data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 250px\",\"class\":\"prmaxinput prmaxrequired\",name:\"county\",placeholder:\"County\"' data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 200px\",\"class\":\"prmaxinput prmaxrequired\",name:\"postcode\",placeholder:\"Postcode\"' data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"100px\">Email Address*</td>\r\n\t\t\t\t\t\t\t\t<td colspan=\"2\"><input data-dojo-props='type:\"text\",trim:true,style:\"width:510px\",\"class\":\"prmaxinput prmaxrequired\",name:\"email\",placeholder:\"Email address\",size:\"40\",maxlength:\"80\",required:\"true\"' data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"100px\">Phone Number</td>\r\n\t\t\t\t\t\t\t\t<td colspan=\"2\"><input data-dojo-props='type:\"text\",trim:true,style:\"width:510px\",\"class\":\"prmaxinput\",name:\"tel\",placeholder:\"Phone Number\"' data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" colspan=\"4\"><button style=\"float:right\" data-dojo-attach-point=\"step1btn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"fuchsiabtn\",type:\"button\",label:\"Next\"' data-dojo-attach-event=\"onClick:_step1_next\"></button></td></tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</form>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div data-dojo-props='style:\"width:100%;height:100%\",title:\"step2\",region:\"center\", \"class\":\"scrollpanel\"' data-dojo-attach-point='step2' data-dojo-type=\"dijit/layout/ContentPane\" >\r\n\t\t\t\t\t<form style=\"margin-left:100px\" data-dojo-props='\"class\":\"prmaxdefault\",onSubmit:\"return false\"' data-dojo-attach-point=\"step2_form\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t\t\t<div><h1>Order your PRmax</h1></div><br>\r\n\t\t\t\t\t\t<table cellspacing =\"1\" cellpadding=\"1\" width=\"800px\">\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td colspan=\"2\"><div data-dojo-attach-point=\"step2_logo\" style=\"width:100%\"><img style=\"border:0px;\" src=\"/static/images/step2.png\"</img></div><br><br></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\">I would like an </td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\">\r\n\t\t\t\t\t\t\t\t\t<select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='style:\"width:250px;color:black\"' data-dojo-attach-point=\"termid\" data-dojo-attach-event=\"onChange: _subscription_changed\">\r\n\t\t\t\t\t\t\t\t\t\t<option value=4>An Annual Subscription</option>\r\n\t\t\t\t\t\t\t\t\t\t<option value=1>A Single Month Subscription</option>\r\n\t\t\t\t\t\t\t\t\t</select><br/>\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">PRmax Edition</td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\">\r\n\t\t\t\t\t\t\t\t\t<select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='style:\"width:250px;color:black\"' data-dojo-attach-point=\"editionid\" data-dojo-attach-event=\"onChange: _edition_changed\">\r\n\t\t\t\t\t\t\t\t\t\t<option value=0>PRmax Standard Edition</option>\r\n\t\t\t\t\t\t\t\t\t\t<option value=1>PRmax Press Office</option>\r\n\t\t\t\t\t\t\t\t\t\t<option value=2>PRmax Freelance Edition</option>\r\n\t\t\t\t\t\t\t\t\t</select><br/>\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">With</td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\">\r\n\t\t\t\t\t\t\t\t\t<select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='style:\"width:250px;color:black\"' data-dojo-attach-point=\"mediadataid\" data-dojo-attach-event=\"onChange: _mediadata_changed\">\r\n\t\t\t\t\t\t\t\t\t\t<option value=0>UK Media Data</option>\r\n\t\t\t\t\t\t\t\t\t\t<option value=1>European Media Data</option>\r\n\t\t\t\t\t\t\t\t\t\t<option value=2>Global Media Data</option>\r\n\t\t\t\t\t\t\t\t\t</select><br/>\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Paying</td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\">\r\n\t\t\t\t\t\t\t\t\t<select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='style:\"width:250px;color:black\"' data-dojo-attach-point=\"paymentmethodid\" data-dojo-attach-event=\"onChange: _paymentmethod_changed\">\r\n\t\t\t\t\t\t\t\t\t\t<option value=4>Annually Invoice</option>\r\n\t\t\t\t\t\t\t\t\t\t<option value=2>Monthly Direct Debit</option>\r\n\t\t\t\t\t\t\t\t\t</select><br/>\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag prmaxhidden\" width=\"200px\" data-dojo-attach-point='advancefeatures_label'>Advance Features</td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\">\r\n\t\t\t\t\t\t\t\t\t<input data-dojo-props='\"class\":\"prmaxinput prmaxhidden\",name:\"advancefeatures\", value:\"1\"' data-dojo-attach-point=\"advancefeatures\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onChange: _advanced_changed\"></input>\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Price</td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\">\r\n\t\t\t\t\t\t\t\t\t<input data-dojo-props='type:\"text\",trim:true,style:\"width: 200px\",\"class\":\"prmaxinput prmaxrequired\",name:\"price\", readOnly:\"readOnly\", value:\"${defaultcost}\"' data-dojo-attach-point=\"price\" data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n\t\t\t\t\t\t\t\t\t<div class=\"vat\">+VAT</div>\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" colspan=\"3\">\r\n\t\t\t\t\t\t\t\t\t<button style=\"float:right\" data-dojo-attach-point=\"step2nextbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"fuchsiabtn\",type:\"button\",label:\"Next\"' data-dojo-attach-event=\"onClick:_step2_next\"></button>\r\n\t\t\t\t\t\t\t\t\t<button style=\"float:right\" data-dojo-attach-point=\"step2backbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"fuchsiabtn\",type:\"button\",label:\"Back\"' data-dojo-attach-event=\"onClick:_step2_back\"></button>\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</form>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div data-dojo-props='style:\"width:100%;height:100%\",title:\"step3\",region:\"center\", \"class\":\"scrollpanel\"' data-dojo-attach-point='step3' data-dojo-type=\"dijit/layout/ContentPane\" >\r\n\t\t\t\t\t<form style=\"margin-left:100px\" data-dojo-props='\"class\":\"prmaxdefault\",onSubmit:\"return false\"' data-dojo-attach-point=\"step3_form\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t\t\t<div><h1>Order your PRmax</h1></div><br>\r\n\t\t\t\t\t\t<table cellspacing =\"1\" cellpadding=\"1\" width=\"800px\">\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td colspan=\"2\"><div data-dojo-attach-point=\"step3_logo\" style=\"width:100%\"><img style=\"border:0px;\" src=\"/static/images/step3.png\"</img></div><br><br></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td><td align=\"left\" class=\"prmaxrowtag\" colspan=\"2\">Thank you for ordering PRmax. Please find below details confirming your subscription package and advise us of any changes within 3 days. Please note that annual subscriptions will renew each year unless at least one months notice is received prior to the renewal date.</td></tr>\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td><td align=\"left\" class=\"prmaxrowtag\" colspan=\"2\"><b>Your details</b></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Customer Name</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"customername_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"customername_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Contact Name</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"contactname_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"contactname_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Address</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"address_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"address_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Email</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"email_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"email_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td><td align=\"left\" class=\"prmaxrowtag\" colspan=\"2\"><b>Your order</b></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\" data-dojo-attach-point=\"subscription_confirm_label\"></td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"subscription_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"subscription_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Nbr of Concurrent Users</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"concurrentusers\", readOnly:\"readOnly\"' data-dojo-attach-point=\"concurrentusers\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">First Access Date</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"firstaccessdate\", readOnly:\"readOnly\"' data-dojo-attach-point=\"firstaccessdate\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Renewal date</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"renewaldate\", readOnly:\"readOnly\"' data-dojo-attach-point=\"renewaldate\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Payment Method</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"paymentmethod_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"paymentmethod_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td><td align=\"left\" class=\"prmaxrowtag\" colspan=\"2\"><b>Monthly Service Cost</b></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Media Database</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"mediadatabase_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"mediadatabase_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Advance</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"advance_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"advance_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">VAT @ 20%</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"vat_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"vat_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td align=\"left\" class=\"prmaxrowtag\" width=\"200px\">Total</td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 450px\",\"class\":\"prmaxinput\",name:\"total_confirm\", readOnly:\"readOnly\"' data-dojo-attach-point=\"total_confirm\" data-dojo-type=\"dijit/form/TextBox\" ></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" class=\"prmaxrowtag\" width=\"100px\"></td>\r\n\t\t\t\t\t\t\t\t<td class=\"prmaxrowtag\" colspan =\"2\" align=\"left\"><label data-dojo-attach-point=\"tclabel\">I Agree to the Terms and Conditions</label>&nbsp;<input data-dojo-props='\"class\":\"prmaxinput\", name:\"tcaccept\"' data-dojo-attach-point=\"tcaccept\" data-dojo-type=\"dijit/form/CheckBox\"/>&nbsp;&nbsp;<a href=\"/static/rel/html/tc.pdf\" target=\"_newtab\">View  Terms and Conditions<a/></td></tr>\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" colspan=\"3\">\r\n\t\t\t\t\t\t\t\t\t<button style=\"float:right\" data-dojo-attach-point=\"step3nextbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"fuchsiabtn\",type:\"button\",label:\"Confirm\"' data-dojo-attach-event=\"onClick:_confirm\"></button>\r\n\t\t\t\t\t\t\t\t\t<button style=\"float:right\" data-dojo-attach-point=\"step3backbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"fuchsiabtn\",type:\"button\",label:\"Back\"' data-dojo-attach-event=\"onClick:_step3_back\"></button>\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t</table>\r\n\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t</form>\r\n\t\t\t\t</div>\r\n\t\t\t\t\r\n\t\t</div>\r\n\t</div>\r\n\t\r\n\t\r\n\t\r\n</div>"}});
define("prcommon2/newcustomer/frame", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../newcustomer/templates/frame.html",
	"dijit/layout/BorderContainer",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"ttl/grid/Grid",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojox/data/JsonRestStore",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dijit/Toolbar",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/CheckBox",
	"dijit/form/Textarea",
	"dijit/form/Form",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, BorderContainer, domgeom, lang, JsonRest, Observable, Grid, utilities2, topic, request, domattr, domclass){
 return declare("prcommon2.newcustomer.frame",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	as_frame:0,
	back_colour:"black",
	back_panel_colour:"black",
	fore_color:"lightblue",
	defaultcost:'£1878',
	customersourceid:5,
	constructor: function()
	{

	},
	postCreate:function()
	{
		this.controls.selectChild(this.step1);
		this._price_call_back = lang.hitch(this, this._price_call);
		this._submit_call_back = lang.hitch(this, this._submit_call);
		
		this.inherited(arguments);
	},
	_step1_next:function()
	{
		this.controls.selectChild(this.step2);
	},
	_step2_next:function()
	{
		this.controls.selectChild(this.step3);
		this.customername_confirm.set("value", this.customername.get("value"));
		this.contactname_confirm.set("value", this.firstname.get("value") + ' ' + this.familyname.get("value"));
		this.address_confirm.set("value", this.address1.get("value") + ' ' + this.address2.get("value") + ' '+ this.postcode.get("value") + ' ' + this.townname.get("value") + ' ' + this.county.get("value"));
		this.email_confirm.set("value", this.email.get("value"));
		
		this.subscription_confirm.set("value", this.editionid.item.name + ' with ' + this.mediadataid.item.name);
		if (this.paymentmethodid.get("value") == 4)
		{
			domattr.set(this.subscription_confirm_label, 'innerHTML', 'Annual subscription to');
		}
		else
		{
			domattr.set(this.subscription_confirm_label, 'innerHTML', 'Monthly subscription to');
		}	
		
		if (this.editionid.get("value") == 0)
		{
			this.concurrentusers.set("value", 3);	
		}
		else if (this.editionid.get("value") == 1)
		{
			this.concurrentusers.set("value", 5);	
		}
		else 
		{
			this.concurrentusers.set("value", 1);
		}

		var today = new Date();
		if (this.termid.get("value") == 1)
		{
			this.firstaccessdate.set("value", utilities2.to_json_date(today));
			this.renewaldate.set("value", utilities2.to_json_date(utilities2.add_days_to_date(today, 30)));
		}
		else
		{
			this.firstaccessdate.set("value", 'On receipt of payment');
			this.renewaldate.set("value", utilities2.to_json_date(utilities2.add_days_to_date(today, 365)));
		}
		
		this.paymentmethod_confirm.set("value", this.paymentmethodid.item.name);
		
		
	},
	_confirm:function()
	{
	
		var data = this.step1_form.get("value");
		
		try
		{
			if (this.tcaccept.get("checked")==false )
			{
				alert("T & C not accepted, Please accept before continuing");
				return;
			}

			if (utilities2.form_validator(this.step3_form)==false)
			{
				alert("Not all required fields filled in");
				return;
			}

			var data = this.step3_form.get("value");

			request.post('/eadmin/new2',
				utilities2.make_params({data: data})).
				then(this._submit_call_back);
		}
		catch(e) { alert(e);}
	},
	_submit_call1:function(response)
	{
		if ( response.success=="OK")
		{
			// account added pay now to recieve login details
			alert('Your new account created successfully. Please follow your email instructions or call us the office to pay and receive your login detail.')
			return;
		}
		if ( response.success=="DU")
		{
			alert(response.message);
		}
	},
	_submit_call:function(response)
	{
		if ( response.success=="OK")
		{
			// account added pay now to recieve login details
			dijit.byId("customer_control_pane").set( "href", response.page ) ;
			//dojo.byId("main").href  = response.page;
			return;
		}
		if ( response.success=="DU")
		{
			alert(response.message);
		}
	},	
	_step2_back:function()
	{
		this.controls.selectChild(this.step1);
	},
	_step3_back:function()
	{
		this.controls.selectChild(this.step2);
	},
	_subscription_changed:function()
	{
		if (this.termid.get("value") == 1)
		{
			this.editionid.store.remove(0);
			this.editionid.store.remove(1);
			this.editionid.set("value", 2);
			this.mediadataid.store.remove(1);
			this.mediadataid.store.remove(2);
			this.paymentmethodid.store.remove(2);
			domclass.remove(this.advancefeatures.domNode, 'prmaxhidden');
			domclass.remove(this.advancefeatures_label, 'prmaxhidden');
		}
		else
		{
			this.editionid.store.add({id:"0", value:"0", name:"PRmax Standard Edition"});
			this.editionid.store.add({id:"1", value:"1", name:"PRmax Press Office"});
			this.mediadataid.store.add({id:"1", value:"1", name:"European Media Data"});
			this.mediadataid.store.add({id:"2", value:"2", name:"Global Media Data"});
			this.paymentmethodid.store.add({id:"2", value:"2", name:"Monthly Direct Debit"});
			if (this.editionid.get("value") == 2)
			{
				domclass.remove(this.advancefeatures.domNode, 'prmaxhidden');
				domclass.remove(this.advancefeatures_label, 'prmaxhidden');
			}
			else
			{
				domclass.add(this.advancefeatures.domNode, 'prmaxhidden');
				domclass.add(this.advancefeatures_label, 'prmaxhidden');
			}
		}
		this.get_price();	
	},
	_edition_changed:function()
	{
		if (this.editionid.get("value") == 2)
		{
			domclass.remove(this.advancefeatures.domNode, 'prmaxhidden');
			domclass.remove(this.advancefeatures_label, 'prmaxhidden');
		}
		else
		{
			domclass.add(this.advancefeatures.domNode, 'prmaxhidden');
			domclass.add(this.advancefeatures_label, 'prmaxhidden');
		}
		this.get_price();
	},
	_mediadata_changed:function()
	{
		this.get_price();
	},
	_paymentmethod_changed:function()
	{
		this.get_price();
	},
	_advanced_changed:function()
	{
		this.get_price();
	},
	get_price:function()
	{
		var data = {};
		data['nbrofloginsid'] = this.nbroflogins.get("value")
		data['termid'] = this.termid.get("value");
		data['editionid'] = this.editionid.get("value");
		data['mediadataid'] = this.mediadataid.get("value");
		data['paymentmethodid'] = this.paymentmethodid.get("value");
		data['advancefeatures'] = this.advancefeatures.get("checked");
		
		request.post('/eadmin/price_new',
			utilities2.make_params({data: data})).
			then(this._price_call_back);		
	},
	_price_call:function(response)
	{
		if (response.success=="OK")
		{
		    if ( response.data[1].length>0)
			{
				this.price.set("value",response.data[1]);
			}
			else
			{
				this.price.set("value","£"+ utilities2.round_decimals(response.data[0]/100,2));
			}
		}		
	},

	
	
	
	_change_price:function()
	{
		if (this.subscription.get("value") == 0 )
		{
			if (this.edition.get("value") == 0)
			{
				if (this.addons.get("value") ==0)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£1878")
					}
					else
					{
						this.price.set("value", "£188pcm")	
					}
				}
				else if (this.addons.get("value") == 1)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£2560")
					}
					else
					{
						this.price.set("value", "£256pcm")	
					}
				}
				else if (this.addons.get("value") == 2)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£3085")
					}
					else
					{
						this.price.set("value", "£308pcm")	
					}
				}
			
			}
			if (this.edition.get("value") == 1)
			{
				if (this.addons.get("value") == 0)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£3550")
					}
					else
					{
						this.price.set("value", "£355pcm")	
					}
				}
				else if (this.addons.get("value") == 1)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£4840")
					}
					else
					{
						this.price.set("value", "£484pcm")	
					}
				}
				else if (this.addons.get("value") == 2)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£5845")
					}
					else
					{
						this.price.set("value", "£580pcm")	
					}
				}
			}
			if (this.edition.get("value") == 2)
			{
				if (this.addons.get("value") == 0)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£1155")
					}
					else
					{
						this.price.set("value", "£115pcm")	
					}
				}
				else if (this.addons.get("value") == 1)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£1895")
					}
					else
					{
						this.price.set("value", "£189pcm")	
					}
				}
				else if (this.addons.get("value") == 2)
				{
					if (this.paying.get("value") == 0)
					{
						this.price.set("value", "£2560")
					}
					else
					{
						this.price.set("value", "£256pcm")	
					}
				}
			}
		}	
			
			

//			this.paying.set("value", 0);
//		}
//		else if (this.subscription.get("value") == 1)
//		{
//			this.paying.set("value", 1);
//		}
	}

});
});
