from django.contrib import admin
from .models import Donation


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "transaction_id", "submitted_at", "verified")
    list_filter = ("verified", "submitted_at")
    search_fields = ("name", "email", "transaction_id")
    readonly_fields = ("submitted_at",)
