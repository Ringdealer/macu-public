#backend/products/urls.py
from django.urls import path
from .views import ProductListView, ProductDetailView

urlpatterns = [
    path("", ProductListView.as_view(), name="products-list"),
    # UUID for public-safe URLs
    path("<uuid:uuid>/", ProductDetailView.as_view(), name="products-detail"),
]