# Machine-Learning Directory
The directory contains files related to the person detection of our system to detect if a person is trying to access the system.
Our person detection is a CNN binary classifier (based on MobileNetV2) where either a person is detected or is not detected in the image.
The Jupyter Notebook file contains the code used to train our model with the Pascal VOC 2012 dataset. The JavaScript file is the code used
to test prediction using an express server. Finally, the .h5 file is the Keras model that was trained the in Jupyter Notebook file and the
directory is the Keras model converted into a Tensorflow.js model.
