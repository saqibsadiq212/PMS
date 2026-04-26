from rest_framework import serializers

from .models import Appointment, Clinician, Patient


class ClinicianSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Clinician
        fields = ["id", "first_name", "last_name", "full_name"]
        read_only_fields = ["id"]

    def get_full_name(self, obj: Clinician) -> str:
        return f"{obj.first_name} {obj.last_name}"


class AppointmentSerializer(serializers.ModelSerializer):
    clinicians = ClinicianSerializer(many=True, read_only=True)
    clinician_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Clinician.objects.all(),
        source="clinicians",
    )

    class Meta:
        model = Appointment
        fields = ["id", "scheduled_at", "status", "clinicians", "clinician_ids"]
        read_only_fields = ["id"]


class PatientSerializer(serializers.ModelSerializer):
    appointments = AppointmentSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            "id", "first_name", "last_name", "date_of_birth",
            "email", "phone", "appointments", 
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]