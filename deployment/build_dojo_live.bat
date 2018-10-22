cd \Projects\prmax\live\deployment\dojo\util\buildscripts
java -Xms1024m -cp ../shrinksafe/js.jar;../closureCompiler/compiler.jar;../shrinksafe/shrinksafe.jar org.mozilla.javascript.tools.shell.Main  ../../dojo/dojo.js baseUrl=../../dojo load=build profile=%1 action=clean,release copyTests=false stripConsole=all
