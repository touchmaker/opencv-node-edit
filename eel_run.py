import eel,os,random
import cv2
import base64
import numpy as np
import time
from switch import switch

def convert_b64(cv_img):
	jpgbytes = cv2.imencode('.jpg', cv_img)[1]
	base64_code = base64.b64encode(jpgbytes)
	return base64_code.decode("utf8")

def trans_base64(img_str):
	header,data = img_str.split(',',1)
	img_byte = base64.b64decode(data + 'data' * (-len(data) % 4))
	img_array = np.frombuffer(img_byte, np.uint8)
	return img_array

# import image
# load local image and send to js by id
# checked ok
@eel.expose
def cv_image_update(filename,elem):
	if not os.path.exists(filename):
		print("file invalid")

	img = cv2.imread(filename)
	jpgbytes = cv2.imencode('.png', img)[1]
	base64_code = base64.b64encode(jpgbytes).decode('utf8')

	eel.updateImageSrc(base64_code,elem)

@eel.expose
def logpy(s):
	print(s)
	return True

@eel.expose
def dataToPy(s):
	print("来自前端的问候:")

	header,data = s.split(',',1)

	# print(header)
	# print(data)

	img_byte = base64.b64decode(data + 'data' * (-len(data) % 4))
	# print(type(img_byte))
	img_array = np.frombuffer(img_byte, np.uint8)
	# print(type(img_array))
	img = cv2.imdecode(img_array, 1)

	# cv2.imshow('pic',img)
	cv2.imwrite("newpic.jpg",img)

# save base64 image to python 
@eel.expose
def b64_image_save(s,filename):
	header,data = s.split(',',1)

	# print(header)
	# print(data)

	with open("b64.txt",'w') as f:
		f.write(data)

	img_byte = base64.b64decode(data + 'data' * (-len(data) % 4))
	# print(type(img_byte))
	img_array = np.frombuffer(img_byte, np.uint8)
	# print(type(img_array))
	img = cv2.imdecode(img_array, 1)
	# print(type(img))

	cv2.imwrite(filename,img)

# image GaussBlur 
@eel.expose
def gaussBlur(image_str,size):

	img_array = trans_base64(image_str)

	img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
	gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
	blurred = cv2.GaussianBlur(gray, (size,size), 0)
	b64 = convert_b64(blurred)
	return "data:image/png;base64,"+ b64
	

# image cv_threshold 
@eel.expose
def threshold(image_str,thres,thres_type):
	# print("begin threshold")
	img_array = trans_base64(image_str)

	ctype = None
	for case in switch(thres_type):
		if case('THRESH_BINARY'):
			ctype = cv2.THRESH_BINARY
			break
		if case('THRESH_BINARY_INV'):
			ctype = cv2.THRESH_BINARY_INV
			break
		if case('THRESH_TRUNC'):
			ctype = cv2.THRESH_TRUNC
			break
		if case('THRESH_TOZERO'):
			ctype = cv2.THRESH_TOZERO
			break
		if case():
			print("parameter error!!")
			return 

	img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
	gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

	ret,img_n = cv2.threshold(gray,thres,255,ctype)
	b64 = convert_b64(img_n)
	# print("end threshold")
	return "data:image/png;base64,"+ b64

@eel.expose
def getInfo(image_str):
	img_array = trans_base64(image_str)

	size = img_array.shape
	# print(size)
	#error occur only got one demision (****,)
	return size


@eel.expose
def canny(image_str,th1,th2):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
	gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

	canny = cv2.Canny(img, th1, th2)
	b64 = convert_b64(canny)

	return "data:image/png;base64,"+ b64

@eel.expose
def split_red(image_str):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
	zeros = np.zeros(img.shape[:2], dtype = "uint8")
	(B, G, R) = cv2.split(img)
	rr = cv2.merge([zeros, zeros, R])
	gg = cv2.merge([zeros, G, zeros])
	bb = cv2.merge([B, zeros, zeros])
	b64r = convert_b64(rr)
	b64g = convert_b64(gg)
	b64b = convert_b64(bb)
	return ["data:image/png;base64,"+ b64r,"data:image/png;base64,"+ b64g,"data:image/png;base64,"+ b64b]

@eel.expose
def erode(image_str,ksize,kernel_type,iterations_number):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array,cv2.IMREAD_COLOR)

	ctype = None
	for case in switch(kernel_type):
		if case('MORPH_RECT'):
			ctype = cv2.MORPH_RECT
			break
		if case('MORPH_ELLIPSE'):
			ctype = cv2.MORPH_ELLIPSE
			break
		if case('MORPH_CROSS'):
			ctype = cv2.MORPH_CROSS
			break
		if case():
			print("parameter error!!")
			return 

	kernel = cv2.getStructuringElement(ctype,(ksize,ksize))
	img_ret = cv2.erode(img,kernel,iterations_number)

	b64 = convert_b64(img_ret)
	return "data:image/png;base64,"+ b64

@eel.expose
def dilate(image_str,ksize,kernel_type,iterations_number):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array,cv2.IMREAD_COLOR)

	ctype = None
	for case in switch(kernel_type):
		if case('MORPH_RECT'):
			ctype = cv2.MORPH_RECT
			break
		if case('MORPH_ELLIPSE'):
			ctype = cv2.MORPH_ELLIPSE
			break
		if case('MORPH_CROSS'):
			ctype = cv2.MORPH_CROSS
			break
		if case():
			print("parameter error!!")
			return 

	kernel = cv2.getStructuringElement(ctype,(ksize,ksize))
	img_ret = cv2.dilate(img,kernel,iterations_number)

	b64 = convert_b64(img_ret)
	return "data:image/png;base64,"+ b64

@eel.expose
def color_filter(image_str,low,upper):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array,cv2.IMREAD_COLOR)

	hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

	# Threshold of blue in HSV space
	lower_blue = np.array(low)
	upper_blue = np.array(upper)

	# preparing the mask to overlay
	mask = cv2.inRange(hsv, lower_blue, upper_blue)

	# The black region in the mask has the value of 0,
	# so when multiplied with original image removes all non-blue regions
	result = cv2.bitwise_and(img, img, mask = mask)

	b64 = convert_b64(result)
	return "data:image/png;base64,"+ b64

@eel.expose
def hist(image_str,channel):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array,cv2.IMREAD_COLOR)

	# H, W, C = img.shape

	# # Histogram flattening
	# S = H * W * C * 1

	# out = img.copy()
	# sum_h = 0
	# z_max = 255

	# for i in range(1, 255):
	#     ind = np.where(img == i)
	#     sum_h += len(img[ind])
	#     z_prime = z_max / S * sum_h
	#     out[ind] = z_prime

	# hist = cv2.calcHist([img],[channel],None,[256],[0,256])

	hist , bins = np.histogram(img.ravel(),256,[0,256])
	# print(len(hist))
	# print(hist)
	s = ""
	for j in hist:
		s = s + str(j)+','
	return s

@eel.expose
def rotate(image_str,angle):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array,cv2.IMREAD_COLOR)

	(h, w) = img.shape[:2]
	center = (w // 2, h // 2)
	 
	M = cv2.getRotationMatrix2D(center, angle, 1.0)
	rotated = cv2.warpAffine(img, M, (w, h))

	b64 = convert_b64(rotated)
	return "data:image/png;base64,"+ b64

@eel.expose
def rotate_b(image_str,angle):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array,cv2.IMREAD_COLOR)

	(h, w) = img.shape[:2]
	(cX, cY) = (w // 2, h // 2)


	# grab the rotation matrix (applying the negative of the
	# angle to rotate clockwise), then grab the sine and cosine
	# (i.e., the rotation components of the matrix)
	M = cv2.getRotationMatrix2D((cX, cY), -angle, 1.0)
	cos = np.abs(M[0, 0])
	sin = np.abs(M[0, 1])

	# compute the new bounding dimensions of the image
	nW = int((h * sin) + (w * cos))
	nH = int((h * cos) + (w * sin))

	# adjust the rotation matrix to take into account translation
	M[0, 2] += (nW / 2) - cX
	M[1, 2] += (nH / 2) - cY

	# perform the actual rotation and return the image
	rotated =  cv2.warpAffine(img, M, (nW, nH))

	b64 = convert_b64(rotated)
	return "data:image/png;base64,"+ b64

@eel.expose
def drawStr(image_str,text,x,y):
	img_array = trans_base64(image_str)
	img = cv2.imdecode(img_array,cv2.IMREAD_COLOR)

	cv2.putText(img, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 0, 0), 1,cv2.LINE_AA)

	b64 = convert_b64(img)
	return "data:image/png;base64,"+ b64


eel.init('web')
eel.start('main.html')

