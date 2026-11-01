from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Donation",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("transaction_id", models.CharField(max_length=120, unique=True)),
                ("name", models.CharField(max_length=120)),
                ("email", models.EmailField(max_length=254)),
                ("work", models.CharField(blank=True, max_length=160)),
                ("profession", models.CharField(blank=True, max_length=160)),
                ("address", models.TextField(blank=True)),
                ("miscellaneous", models.TextField(blank=True)),
                ("submitted_at", models.DateTimeField(auto_now_add=True)),
                ("verified", models.BooleanField(default=False)),
            ],
            options={"ordering": ["-submitted_at"]},
        ),
    ]
