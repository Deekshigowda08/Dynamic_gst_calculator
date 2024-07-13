# myapp/urls.py

from django.urls import path
from .views import calculate_gst,download_product_list

urlpatterns = [
    path('calculate/', calculate_gst),
    path('download/', download_product_list),
]
