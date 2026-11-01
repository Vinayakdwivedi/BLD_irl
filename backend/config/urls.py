from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_status(request):
    return JsonResponse({
        "service": "BLD Institute donation API",
        "status": "ok",
        "endpoints": {
            "donations": "/api/donations/",
            "admin": "/admin/",
        },
    })


urlpatterns = [
    path("", api_status, name="api-status"),
    path("admin/", admin.site.urls),
    path("api/", include("donations.urls")),
]
