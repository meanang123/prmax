<head>
<title>PRMax Professional Login</title>
<%include file="../std_professional.mak"/>
    <style type="text/css">
        #loginBox
        {
            margin: auto;
            margin-top: 5%;
            padding-left: 2%;
            padding-right: 2%;
            padding-top: 2%;
            padding-bottom: 1%;
            font-family: verdana;
            font-size: 10px;
						border:  none;
						width: 40%;
        }
		#image_box
        {
            width: 60%;
            margin: auto;
            padding-left: 2%;
            padding-right: 2%;
            padding-top: 2%;
            padding-bottom: 1%;
            font-family: verdana;
            font-size: 10px;
        }

        #loginBox h1
        {
            font-size: 30px;
            font-family: "Trebuchet MS";
            margin: 0;
            color: white;
						padding-bottom:10px;
        }

        #loginBox h2
        {
            font-size: 18px;
            font-family: "Trebuchet MS";
            margin: 0;
            color: white;
						padding-bottom:10px;
        }

        #loginBox p
        {
            position: relative;
            top: -1.5em;
            padding-left: 4em;
            font-size: 12px;
            margin: 0;
        }

        #loginBox table
        {
            table-layout: fixed;
            border-spacing: 0;
            width: 100%;
        }

        #loginBox td.label
        {
            width: 33%;
            text-align: left;
						color: white;
						padding-left:20px;
            font-size: 12px;
        }

        #loginBox td.field
        {
            width: 66%;
        }

        #loginBox td.field input
        {
            width: 99%;
        }

        #loginBox td.buttons
        {
            text-align: right;
        }

a:link {color:white}
a:visited {color:white}
a:active {color:white}
body {
    background: black;
}

label {
    color: white;
}
#loginBox td.label {
    padding: 2;
    width: 80px !important;
}
#loginBox td.field {
    padding: 2;
    width: auto !important;
}
div {
    font-size:  13px;
    font-weight: 700;
		color:white;
}
    </style>
<script>
function start_up()
{
try
{
	document.getElementById("user_name").focus();
}
catch ( e ) {}
}
</script>
</head>

<body onLoad="start_up()">
	<div id="image_box"><h1 style="text-align:center">Intelligent PR Software for Professional Communicators</h1></div>
    <div id="loginBox">
        <h1>Press Office Login</h1>
        <form action="${previous_url}" method="POST">
            <table cellspacing="0" cellpadding="1" border="0">
%if message:
				<tr>
					<td class="label">${message|h}</td></tr>
 %endif
                <tr>
                    <td class="label">
                        <label for="user_name">User Name</label>
                    </td>
                    <td class="field">
                        <input type="text" id="user_name" name="user_name"/>
                    </td>
                </tr>
                <tr>
                    <td class="label">
                        <label for="password">Password</label>
                    </td>
                    <td class="field">
                        <input type="password" id="password" name="password"/>
                    </td>
                </tr>
                <tr><td colspan="2" align="right" class="buttons"><input class="adept_login_btn" type="submit" name="login" value="Login"/></td></tr>
				<tr><td colspan="2" class="label"><div><a href="/passwordrequest">Forgot Password?</a></div></td></tr>
            </table>
%if forward_url:
	        <input type="hidden" name="forward_url" value="${forward_url|h}"/>
%endif
%for name,values in original_parameters.items():
						<input type="hidden" name="${name|h}" value="${values|h}"/>
%endfor
				<br/><br/>
    		<div style="color: #ddd;">PRmax Support 01582 380 198 Email <a  style="link:red;visited:red;active:red;hover:red" href="mailto:support@prmax.co.uk">support@prmax.co.uk</a></div>
        </form>
    </div>
</body>
</html>
