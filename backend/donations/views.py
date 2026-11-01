import json

from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Donation


@csrf_exempt
def create_donation(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Only POST is allowed."}, status=405)

    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Request body must be valid JSON."}, status=400)

    required = ("transaction_id", "name", "email")
    missing = [field for field in required if not str(payload.get(field, "")).strip()]
    if missing:
        return JsonResponse({"detail": f"Missing required fields: {', '.join(missing)}."}, status=400)

    try:
        donation = Donation.objects.create(
            transaction_id=str(payload["transaction_id"]).strip(),
            name=str(payload["name"]).strip(),
            email=str(payload["email"]).strip(),
            work=str(payload.get("work", "")).strip(),
            profession=str(payload.get("profession", "")).strip(),
            address=str(payload.get("address", "")).strip(),
            miscellaneous=str(payload.get("miscellaneous", "")).strip(),
        )
    except IntegrityError:
        return JsonResponse({"detail": "This transaction ID has already been submitted."}, status=409)

    return JsonResponse({"id": donation.id, "detail": "Donation submitted for verification."}, status=201)
