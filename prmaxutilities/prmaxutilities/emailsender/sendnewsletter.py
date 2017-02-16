from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage
from ttl.string import TranslateToHtmlEntities
from ttl.ttlemail import SendMessage
import sgmllib
import os, os.path
import random
from time import sleep
import smtplib
import csv
from BeautifulSoup import BeautifulSoup
import platform
import codecs
hostName = 'localhost'

class MyParser(sgmllib.SGMLParser):
	"A simple parser class."

	def __init__(self, verbose=0):
		"Initialise an object, passing 'verbose' to the superclass."

		sgmllib.SGMLParser.__init__(self, verbose)
		self.images = []

	def parse(self, s):
		"Parse the given string 's'."
		self.feed(s)
		self.close()

	def start_img(self, attributes):
		"Process a hyperlink and its 'attributes'."

		for name, value in attributes:
			if name == "src":
				self.images.append(value)

# Create the root message and fill in the from, to, and subject headers
_coding = "iso-8859-1"

def _BuildNewsLetter( rFolder, newsletterId , embedd, strTo, strFrom, subject, greeting ) :
	rootFolder = os.path.normpath(os.path.join(rFolder, str(newsletterId)))

	msgRoot = MIMEMultipart('related')
	msgRoot['Subject'] = subject
	msgRoot['From'] = strFrom
	msgRoot['To'] = strTo
	msgRoot['List-Unsubscribe'] = strFrom
	msgRoot.preamble="This is a multi-part message in MIME format.\n"
	msgRoot.epilogue=""
	msgRoot.set_charset(_coding)

	# Encapsulate the plain and HTML versions of the message body in an
	# 'alternative' part, so message agents can decide which they want to display.
	msgAlternative = MIMEMultipart('alternative')
	msgRoot.attach(msgAlternative)

	# We reference the image in the IMG SRC attribute by the ID we give it below
	f = open(os.path.join(rootFolder,"index.html"),"r")
	data = f.read()
	f.close()

	try:
		text = data.encode(_coding,'xmlcharrefreplace')
	except:
		text = data
		# fixup
	text = TranslateToHtmlEntities ( data )

	if embedd:
		myparser = MyParser()
		myparser.parse(data)

		for name in myparser.images:
			text = text.replace(name, "cid:" + name)

	text = text.replace("$GREETING$",greeting)

	text = text.replace("$UNSUBSCRIBE$",strTo)

	# add text version
	try:
		soup = BeautifulSoup(text)
		plain = "".join(soup.findAll(text=True))

	except Exception, e:
		print e
		plain = "Please view in HTML mode"


	msgText = MIMEText(plain,'plain',_coding)
	msgAlternative.attach(msgText)

	# add html version
	msgText = MIMEText(text, 'html',_coding)
	msgAlternative.attach(msgText)

	if embedd:
		# This example assumes the image is in the current directory
		for name in myparser.images:
			fp = open( os.path.join(rootFolder,name), 'rb')
			msgImage = MIMEImage(fp.read())
			fp.close()
			# Define the image's ID as referenced above
			msgImage.add_header('Content-ID', '<'+name+'>')
			msgRoot.attach(msgImage)


	return msgRoot

strFrom = 'sales2@prmax.co.uk'
baseFolder1 = r"c:\temp"
baseFolder2  = "/tmp"
import os , os.path

if os.path.exists ( baseFolder1 ) :
	baseFolder = baseFolder1
else:
	baseFolder = baseFolder2

def _Test(strFrom, baseFolder, newsletterid, subject, embedd = True ):

	for row in (('chris.g.hoy@gmail.com','Chris'),('david.mahoney@prmax.co.uk',"David"),('nickpr@aol.com',"Nick")):
		msgRoot = _BuildNewsLetter( baseFolder, newsletterid , embedd, row[0], strFrom, subject, row[1])

		if platform.system().lower()== "windows":
			smtp = smtplib.SMTP_SSL(host= "smtp.gmail.com", port=465)
			smtp.ehlo()
			smtp.login("chris.hoy@prmax.co.uk", "RO9JWPqV")
			#smtp.login("chris.hoy@prmax.co.uk", "Ignore")
		else:
			smtp = smtplib.SMTP()
			smtp.connect(hostName)

		smtp.sendmail(strFrom, row[0], msgRoot.as_string())
		smtp.quit()

def _SendList( strFrom, baseFolder, newsletterid, subject, embedd = True,  offset = 0, limit = 3000 ):
	if platform.system().lower()== "windows":
		smtp = smtplib.SMTP_SSL(host= "smtp.gmail.com", port=465)
		smtp.ehlo()
		#smtp.login("chris.hoy@prmax.co.uk", "RO9JWPqV")
		smtp.login("chris.hoy@prmax.co.uk", "Ignore")
	else:
		smtp = smtplib.SMTP()
		smtp.connect(hostName)

	reader = csv.reader( file ( os.path.join( baseFolder,str(newsletterid),"emails.csv"),"r"))
	#reader.next()
	c = -1
	for row in reader:
		c = c + 1
		if c < offset :  continue
		if c > limit: continue
		print "Sending",c
		email = row[1].replace("^M","")
		greeting =  row[0]
		msgRoot = _BuildNewsLetter( baseFolder, newsletterid , embedd, email, strFrom, subject, greeting )

		try:
			smtp.sendmail(strFrom, email , msgRoot.as_string())
		except Exception , d :
			print email
		if c%50 == 0:
			sleep ( random.randint(1, 5 ) )

	smtp.quit()

if __name__=='__main__':
	import getopt, sys
	opts, args = getopt.getopt(sys.argv[1:],"" , ["test","distribute","newsletter=","subject=", "noembedded"])
	print opts
	newsletter = None
	subject = None
	embedd = True

	for o, a in opts:
		if o == "--newsletter":
			newsletter = int(a)
		if o == "--subject":
			subject = a
		if o == "--noembedded":
			embedd = False

	if not subject:
		print "Missing Subject"

	for o, a in opts:
		if o in ("--test",):
			_Test(strFrom, baseFolder, newsletter, subject, embedd)
		if o in ("--distribute"):
			_SendList( strFrom, baseFolder, newsletter, subject, embedd)
