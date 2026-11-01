from django.urls import path
from .views import create_donation

urlpatterns = [
    path("donations/", create_donation, name="create-donation"),
]
