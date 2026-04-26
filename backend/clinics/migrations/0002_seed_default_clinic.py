from django.db import migrations


def create_default_clinic(apps, schema_editor):
    """
    As no clinic crud is present on frontend so we will seed default clinic
    Other first POST to /api/patients/ fails because _get_current_clinic() returns None.
    """
    Clinic = apps.get_model("clinics", "Clinic")
    Clinic.objects.get_or_create(
        name="ABC Clinic",
        defaults={
            "address": "123 Main Street",
            "phone": "555-0100",
        },
    )


def remove_default_clinic(apps, schema_editor):
    """Reverse operation if the migration is rolled back."""
    Clinic = apps.get_model("clinics", "Clinic")
    Clinic.objects.filter(name="ABC Clinic").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("clinics", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_default_clinic, remove_default_clinic),
    ]
