from django.shortcuts import render
from rest_framework import viewsets

from .models import Clinic, Patient
from .serializers import PatientSerializer


def _get_current_clinic() -> Clinic:
    """
    Returns the current clinic for the request.

    # Assuming no auth required for this assignment - returns the first clinic in the DB with seed
    # In production this would derive from request.user.profile.clinic
    """
    clinic, _ = Clinic.objects.get_or_create(
        name="ABC Clinic",
        defaults={"address": "123 Main Street", "phone": "555-0100"},
    )
    return clinic


class PatientViewSet(viewsets.ModelViewSet):
    """
    CRUD Endpoints GET, POST, PUT, DELETE for patients
    """
    serializer_class = PatientSerializer

    def get_queryset(self):
        clinic = _get_current_clinic()  # This will now send first clinic just for assignment 
        return (
            Patient.objects
            .filter(clinic=clinic)
            .prefetch_related("appointments__clinicians")
        )

    def perform_create(self, serializer):
        serializer.save(clinic=_get_current_clinic())