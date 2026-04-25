from django.contrib import admin

from .models import Clinic, Clinician, Patient, Appointment


@admin.register(Clinic)
class ClinicAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "created_at")
    search_fields = ("name",)


@admin.register(Clinician)
class ClinicianAdmin(admin.ModelAdmin):
    list_display = ("last_name", "first_name", "clinic")
    list_filter = ("clinic",)
    search_fields = ("last_name", "first_name")


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("last_name", "first_name", "clinic", "date_of_birth")
    list_filter = ("clinic",)
    search_fields = ("last_name", "first_name", "email")


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient", "scheduled_at", "status")
    list_filter = ("status", "scheduled_at")
    filter_horizontal = ("clinicians",)