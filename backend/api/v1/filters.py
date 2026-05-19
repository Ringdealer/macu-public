# backend/api/v1/filters.py
from django_filters import rest_framework as filters
from products.models import Product

class ProductFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name="price", lookup_expr='gte')
    price_max = filters.NumberFilter(field_name="price", lookup_expr='lte')
    category_id = filters.NumberFilter(field_name="category_id", lookup_expr='exact')
    available = filters.BooleanFilter(field_name="available")

    class Meta:
        model = Product
        fields = ["category_id", "available", "price_min", "price_max"]

class OrderFilter(filters.FilterSet):
    status = filters.CharFilter(field_name="status", lookup_expr="iexact")
    payment_status = filters.CharFilter(field_name="payment_status", lookup_expr="iexact")

    class Meta:
        model = Order
        fields = ["status", "payment_status"]