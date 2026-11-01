from django.db import models


class Donation(models.Model):
    transaction_id = models.CharField(max_length=120, unique=True)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    work = models.CharField(max_length=160, blank=True)
    profession = models.CharField(max_length=160, blank=True)
    address = models.TextField(blank=True)
    miscellaneous = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.name} — {self.transaction_id}"
