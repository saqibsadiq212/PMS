from django.db import models


class TimeStampedModel(models.Model):
    """Base Fields — it will add created_at and updated_at to any model."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Clinic(TimeStampedModel):
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Clinician(TimeStampedModel):
    clinic = models.ForeignKey(
        Clinic, 
        on_delete=models.CASCADE, 
        related_name="clinicians",
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    class Meta:
        ordering = ["last_name", "first_name"]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"


class Patient(TimeStampedModel):
    clinic = models.ForeignKey(
        Clinic,
        on_delete=models.CASCADE,
        related_name="patients",
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ["last_name", "first_name"]
        indexes = [
            models.Index(fields=["clinic", "last_name"]),
        ]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"
    

class AppointmentQuerySet(models.QuerySet):
    def for_clinic(self, clinic_id: int):
        return self.filter(patient__clinic_id=clinic_id)


class Appointment(TimeStampedModel):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "SCHEDULED"
        COMPLETED = "completed", "COMPLETED"
        CANCELLED = "cancelled", "CANCELLED"

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="appointments",
    )
    clinicians = models.ManyToManyField(
        Clinician,
        related_name="appointments",
    )
    scheduled_at = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )

    objects = AppointmentQuerySet.as_manager()

    class Meta:
        ordering = ["-scheduled_at"]
        indexes = [
            models.Index(fields=["patient", "-scheduled_at"]),
        ]

    def __str__(self) -> str:
        return f"Appointment for {self.patient} at {self.scheduled_at:%Y-%m-%d %H:%M}"
