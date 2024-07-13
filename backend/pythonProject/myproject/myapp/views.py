from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from pymongo import MongoClient
import csv
from django.http import HttpResponse
# Construct the connection string with urllib.parse.quote_plus
connection_uri = f"mongodb+srv://deekshithgowda8888:Rq6uZqTgpmk1J7oY@cluster0.xpni6pr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Initialize MongoClient with the connection string
client = MongoClient(connection_uri)
db = client["expenditure_manager"]
gst_collection = db['gst_list01']
@csrf_exempt
def download_product_list(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            products = data.get('products', [])

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="product_list.csv"'

            writer = csv.writer(response)
            writer.writerow(['Product', 'Price', 'Quantity', 'GST', 'Total'])

            for product in products:
                price = float(product.get('price', 0))
                quantity = int(product.get('quantity', 0))
                gst_data = gst_collection.find_one({'category': product['category']})
                if not gst_data:
                    return JsonResponse({'error': f"GST rate not found for category {product['category']}"}, status=404)

                gst = gst_data['gst']
                gst_amount = price * (gst / 100)
                total = (price + gst_amount) * quantity
                writer.writerow([product['name'], price, quantity, gst, total])

            return response
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
from urllib.parse import quote_plus





@csrf_exempt
def calculate_gst(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        products = data.get('products', [])
        result = {'products': []}

        for product in products:
            price = float(product['price'])
            quantity = int(product['quantity'])

            # Fetch GST rate from MongoDB
            gst_data = gst_collection.find_one({'category': product['category']})
            gst_data01 = gst_collection.find()
            if not gst_data:
                return JsonResponse({'error': f"GST rate not found for category {product['category']}"}, status=404)

            gst = gst_data['gst']
            gst_amount = price * (gst / 100)
            total = (price + gst_amount) * quantity
            result['products'].append({'gst': gst, 'total': total})

        return JsonResponse(result)
    return JsonResponse({'error': 'Invalid method'}, status=405)
