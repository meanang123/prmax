<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
  <meta content="text/html; charset=UTF-8" http-equiv="content-type" />
  <title>Login</title>
  <link rel="stylesheet" type="text/css" media="screen" href="${tg.url('/static/css/login.css')}"/>
</head>
<body>
  <div id="loginform">
    <p>Login message.</p>
    <form action="/login_json" method="post" class="loginfields">
      <h2><span>Login</span></h2>
      <div>
        <label for="user_name">Username:</label><input type="text" id="user_name" name="user_name" class="text"></input><br/>
        <label for="password">Password:</label><input type="password" id="password" name="password" class="text"></input>
        <input type="submit" id="submit" name="login" value="Login"/>
      </div>
    </form>
  </div>
</body>
</html>
