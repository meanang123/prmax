# -*- coding: utf-8 -*-
"""Sage Page Encoding """
#-----------------------------------------------------------------------------
# Name:         ttlsagepay.py
# Purpose:
# Author:       Chris Hoy
# Created:      29/05/2015
# Copyright:    (c) 2015
#-----------------------------------------------------------------------------

from Crypto import Random
from Crypto.Cipher import AES


class AESSagePay(object):
	def __init__(self, key, bs=16):
		"__init__"

		self._key = key
		self.BS = bs

	def _pad(self, s):
		return s + (self.BS - len(s) % self.BS) * chr(self.BS - len(s) % self.BS)

	def _unpad(self, s):
		return s[:-ord(s[len(s)-1:])]

	def encrypt(self, data):
		"encrypt"
		raw = self._pad(data)
		iv = Random.new().read(self.BS)
		cipher = AES.new(self._key, AES.MODE_CBC, iv)

		return (iv+cipher.encrypt(raw)).encode("hex")

	def decrypt_sage(self, enc):
		"decrypt"
		if enc[0] == "@":
			data = enc[1:].decode("hex")
		else:
			data = enc.decode("hex")

		iv = self._key
		cipher = AES.new(self._key, AES.MODE_CBC, iv)

		return cipher.decrypt(data).strip('\x05')

	def decrypt_std(self, enc):
		"""decryupt standard"""

		data = enc.decode("hex")
		iv = data[:self.BS]
		cipher = AES.new(self._key, AES.MODE_CBC, iv)

		return self._unpad(cipher.decrypt(data[self.BS:]))

#c = AESSagePay("HpzN36qypEveDbdk")
#retdata = u'@731627bf860c645f1895cb17914faa9ee0f8257cb624076c6f4ac5101fca59508c5bb21cc6871d3ef6f10313e5e33207cc3536605e6c472d81caabac9cb879f73f0cc1e5aed19eadebba567e38f48f4fed5dd05743ea40715c3434b70b79689c8fec5bca5edc9108fbe903bbed002fc19486c8af63505dd8c9a4e1e63fa71858c3c0f9f211d8ab6e2170abb09e4bf6c7f4b52725b416e5a859d0c6dab6748b4babe9562aa67f63a9acbb201b67076e2517f2a6879a90b30e1ccde6e3fc99e1901b5ef33f18fe916a15935696ce495199c12f2e98d0428dfd2147250cbef5da0d6a2f47ecd56204e3e31648b75f9574f883fb252e06d80cbfa857d033e0cad582c2b19d370c6a2ea35f5cfbe21a0a2cb49850ff89eb603df1f067664423080dc99f3eed3a81dd2d8225c55195f4e639bcacefe6a00e6936dfca7129a85b6476e5a73013f8b1ce44229505fe30022c3932deada7be8f7ada630d9203b1d741d9fd21654c9d09348a86b0027c23a888b9adeb59bcfc623fab0207fe36d5082d7408c92701f6298464608511b11ca387b692'
#print (c.decrypt_sage(retdata))
# encoded string comes from sage page webe site so should be correct
# note the missing bit is the first 16 characters ( block )
# returns 50629152759.18328.10780&VPSTxId={C949E58C-A0DB-4553-8682-A296C4B7CF6E}&Status=OK&StatusDetail=0000 : The Authorisation was Successful.&TxAuthNo=8604856&AVSCV2=SECURITY CODE MATCH ONLY&AddressResult=MATCHED&PostCodeResult=NOTMATCHED&CV2Result=MATCHED&GiftAid=0&3DSecureStatus=NOTCHECKED&CardType=VISA&Last4Digits=0006&DeclineCode=00&ExpiryDate=0133&Amount=5.10&BankAuthCode=999777

# should return VendorTxCode=20150629152759.18328.10780&VPSTxId={C949E58C-A0DB-4553-8682-A296C4B7CF6E}&Status=OK&StatusDetail=0000 : The Authorisation was Successful.&TxAuthNo=8604856&AVSCV2=SECURITY CODE MATCH ONLY&AddressResult=MATCHED&PostCodeResult=NOTMATCHED&CV2Result=MATCHED&GiftAid=0&3DSecureStatus=NOTCHECKED&CardType=VISA&Last4Digits=0006&DeclineCode=00&ExpiryDate=0133&Amount=5.10&BankAuthCode=999777
