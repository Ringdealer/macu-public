#backend/api/v1/routers.py

from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from .viewsets import (
    ProductViewSet,
    OrderViewSet,
    OrderItemViewSet, 
       
    
    
)

# -------------------------
# MAIN ROUTER
# -------------------------
router = DefaultRouter()

router.register("products", ProductViewSet, basename="products")
router.register("orders", OrderViewSet, basename="orders")






# -------------------------
# NESTED ROUTES (ORDER ITEMS)
# -------------------------
orders_router = NestedDefaultRouter(router, "orders", lookup="order")

orders_router.register(
    "items",
    OrderItemViewSet,
    basename="order-items"
)