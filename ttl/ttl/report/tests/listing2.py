outputpath = "c:/output"
page_header = dict(prmax_info=dict(
			name = "Prmax",
			address = "1a",
			tel = "tel",
			fax = "fax",
			email = "email"),
			reportname="This is the report name",
			headerimage = "pressofficelogo4.png",
			strapline = "Powered by PRmax prmax.co.uk")
invoicedetails = [
	(rSingleLine,"Name", "Test"),
	(rMultiLine,"Interests", "abc, def")
]

ss=Listing2PDF(page_header, invoicedetails)
ofile = os.path.normpath(os.path.join(outputpath,"prmax_invoice.pdf"))
if os.path.exists(ofile):
	os.remove( ofile )
ss.write( ofile )
