import cPickle,sys
from ttl.labels import LabelStandardPDF

def _Labels(reportData):
	""" Create a set of labels"""
	return LabelStandardPDF(reportData['label_info'],reportData['labels'])

def _RunReport():
	try:
		#
		tf = file(sys.argv[1],"rb")
		reportData = cPickle.load(tf)
		tf.close()

		r = _Labels(reportData)
		r.write(sys.argv[2])

	except Exception , ex :
		print (ex)
		sys.exit(-1)

# report options
if __name__=='__main__':
	_RunReport()
