#-*-coding:utf-8-*-
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np
lena = mpimg.imread('./code.png')



plt.imshow(lena)
plt.axis('off')
plt.show()