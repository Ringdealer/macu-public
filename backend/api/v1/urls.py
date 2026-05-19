# backend/api/v1/urls.py

# backend/api/v1/urls.py

from django.urls import path, include

from .routers import router, orders_router
from .viewsets import ProfileView  # new


urlpatterns = [
    path("", include(router.urls)),
    path("", include(orders_router.urls)),

    # PROFILE ENDPOINT
    path("profile/", ProfileView.as_view(), name="profile"),
    
]