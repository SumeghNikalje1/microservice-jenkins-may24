from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def hello():
    print('Getting List of WishList Items')
    x = {
        "1": "Apple Iphone",
        "2": "MacBook",
        "3": "Your Fav Something else"
    }
    return jsonify(x)

@app.route('/likes', methods=['GET'])
def likes():
    return 'List of WishList Items'

@app.route('/product/<product>', methods=['GET', 'POST'])
def product(product):
    if request.method == 'POST':
        print(product)
        return product
    return 'Call from POST'

if __name__ == '__main__':
    print("Wishlist Microservice Started...")
    app.run(host="0.0.0.0", port=1003)
