from datetime import datetime
import flask
from PIL import Image
from tensorflow.keras.models import load_model
import tensorflow.keras.preprocessing.image as image
app = flask.Flask(__name__)
import datetime
import io, base64
from tensorflow import expand_dims
from tensorflow.keras.applications.efficientnet import preprocess_input
import matplotlib.pyplot as plt

model = load_model('save_keras_hdf5.h5', compile=False)

@app.route('/process', methods=['POST'])
def processImage():
    begin_time = datetime.datetime.now()
    print('recieved request')
    base64image = flask.request.get_json()['image']
    img = Image.open(io.BytesIO(base64.b64decode(base64image))).convert('RGB')
    plt.imshow(img)
    img = img.resize((240, 240))
    time1 = datetime.datetime.now() - begin_time
    # img = image.load_img('26cbf2a11b798517f5ed9092ca8df263.jpg', target_size=(240,240))
    img = image.img_to_array(img)
    img = expand_dims(img, axis=0)
    img = preprocess_input(img)
    time2 = datetime.datetime.now() - begin_time
    # %%
    prediction = model.predict(img)[0][0]
    time3 = datetime.datetime.now() - begin_time
    return flask.jsonify({
        'prediction:': str(prediction),
        'time1': str(time1),
        'time2': str(time2),
        'time3': str(time3),
    })

@app.route('/test' , methods=['GET','POST'])
def test():
	print("log: got at test")
	return flask.jsonify({'status':'succces'})

app.run(debug=True)
# %%
